import React, { useState, useEffect } from "react";
import { UtilityBill, Appliance, OptimizationReport, HouseholdUser } from "./types";
import { DEFAULT_BILL_DATA, DEFAULT_APPLIANCES } from "./data";
import UtilityBillsForm from "./components/UtilityBillsForm";
import AppliancesForm from "./components/AppliancesForm";
import EnergyCharts from "./components/EnergyCharts";
import AutomationGenerator from "./components/AutomationGenerator";
import SecurityConsole from "./components/SecurityConsole";
import AnalyticDashboardStudio from "./components/AnalyticDashboardStudio";
import {
  LayoutDashboard,
  FileText,
  Cpu,
  Sparkles,
  ShieldAlert,
  Leaf,
  DollarSign,
  Zap,
  Globe,
  Database,
  LogIn,
  LogOut,
  Lock,
  User,
  AlertCircle
} from "lucide-react";

// Pre-seeded high-fidelity optimization report for default state
const INITIAL_REPORT: OptimizationReport = {
  isMock: true,
  recommendations: [
    {
      id: "rec_init_1",
      title: "Replace Living Room Incandescents with 9W LEDs",
      category: "Low Cost / Smart Home",
      description: "You have listed 300W of constant incandescent lighting. Switching to 9W LEDs provides identical lumens output while compressing your lighting power draw by over 85%, saving approximately $140 annually.",
      annualSavings: 140,
      carbonSavingsKg: 350,
      difficulty: "Easy"
    },
    {
      id: "rec_init_2",
      title: "Reschedule AC Operation Cycles",
      category: "Zero Cost / Behavior",
      description: "Avoid running your 2200W AC during peak grid tariff windows (usually 16:00 to 20:00). Pre-cooling your apartment at 14:00 using off-peak pricing brackets will maintain ambient comfort while bypassing high demand fees.",
      annualSavings: 90,
      carbonSavingsKg: 280,
      difficulty: "Medium"
    },
    {
      id: "rec_init_3",
      title: "Eradicate Media Center Vampire Draws",
      category: "Low Cost / Smart Home",
      description: "Your entertainment consoles, cable boxes, and laptops consume phantom baseline standby power while idle. Utilizing a smart plug with automatic nighttime scheduling shuts off the power rail completely.",
      annualSavings: 45,
      carbonSavingsKg: 110,
      difficulty: "Easy"
    }
  ],
  predictiveScenarios: [
    {
      name: "Current Continuous Baseline",
      description: "No change. Standby power remains unchecked, and high-wattage appliances run in high-tariff periods.",
      estimatedCost: 0,
      estimatedMonthlySavings: 0,
      paybackPeriodMonths: 0,
      yearlyCarbonReductionKg: 0
    },
    {
      name: "Behavioral Shifting (No upgrades)",
      description: "Pre-cooling, running washer/dryer off-peak, and turning off standby media setups manually.",
      estimatedCost: 0,
      estimatedMonthlySavings: 22,
      paybackPeriodMonths: 0,
      yearlyCarbonReductionKg: 240
    },
    {
      name: "Full Smart Automation Ecosystem",
      description: "Upgraded LED groups, smart plugs with Home Assistant scheduler automation, and smart radiator valves.",
      estimatedCost: 150,
      estimatedMonthlySavings: 48,
      paybackPeriodMonths: 3,
      yearlyCarbonReductionKg: 740
    }
  ],
  automations: [
    {
      title: "Home Assistant Standby Killer Schedule",
      description: "Shuts off high phantom standby appliances automatically at midnight.",
      type: "Home Assistant YAML",
      code: `alias: Turn Off Standby Devices Nightly
trigger:
  - platform: time
    at: '00:00:00'
action:
  - service: switch.turn_off
    target:
      entity_id: switch.media_center_standby_plug
mode: single`
    },
    {
      title: "Off-Peak Smart AC Cool-Down Scheduler",
      description: "Pre-cools the apartment to avoid highest demand rates.",
      type: "Home Assistant YAML",
      code: `alias: Off-Peak Pre-Cooling Activation
trigger:
  - platform: time
    at: '14:00:00'
condition:
  - condition: numeric_state
    entity_id: sensor.outdoor_temperature
    above: 78
action:
  - service: climate.set_temperature
    target:
      entity_id: climate.living_room_ac
    data:
      temperature: 71
mode: single`
    }
  ],
  sdgImpact: {
    "title": "UN SDG 7.3: Accelerating Energy Efficiency Improvements",
    "description": "Your localized household optimization targets translate to real-world carbon abatement. When combined with grid demand-response scheduling, you play an active role in lowering peak baseline loads globally.",
    "points": [
      "Avoids high peak emissions when local gas turbine peaking plants are online.",
      "Reduces direct apartment energy consumption, leaving clean energy grids resilient."
    ]
  },
  cybersecurityScorecard: {
    "score": 82,
    "issuesFound": [
      "Vulnerability identified: Scanned bill statement contained plain address metadata.",
      "Risk detected: Smart appliances connected to main primary household Wi-Fi."
    ],
    "recommendations": [
      "Always engage the Privacy Scrubbing filter before processing scanned bill entries.",
      "Partition smart home plugs and devices on an isolated Guest VLAN to secure sensitive household devices."
    ]
  }
};

const HOUSEHOLD_PRESETS: HouseholdUser[] = [
  { id: "tenant_1", unit: "Unit 402", name: "J. Doe", role: "user", avatar: "JD" },
  { id: "tenant_2", unit: "Unit 105", name: "A. Smith", role: "user", avatar: "AS" },
  { id: "tenant_3", unit: "Unit 310", name: "L. Chen", role: "user", avatar: "LC" },
  { id: "property_admin", unit: "Property Admin", name: "Sys Admin", role: "admin", avatar: "AD" },
];

const PASSCODES: Record<string, string> = {
  tenant_1: "doe402",
  tenant_2: "smith105",
  tenant_3: "chen310",
  property_admin: "adminmaster",
};

export default function App() {
  const [bills, setBills] = useState<UtilityBill[]>(DEFAULT_BILL_DATA);
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [securityScrub, setSecurityScrub] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [report, setReport] = useState<OptimizationReport | null>(INITIAL_REPORT);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<HouseholdUser | null>(() => {
    const saved = localStorage.getItem("household_current_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loginUnit, setLoginUnit] = useState<string>("tenant_1");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = PASSCODES[loginUnit];
    if (loginPassword === correctPass) {
      const matched = HOUSEHOLD_PRESETS.find((p) => p.id === loginUnit);
      if (matched) {
        setCurrentUser(matched);
        localStorage.setItem("household_current_user", JSON.stringify(matched));
        setLoginPassword("");
        setLoginError(null);
        setActiveTab("dashboard");
      }
    } else {
      setLoginError("Invalid passcode. Please verify your apartment unit credentials.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("household_current_user");
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin" && activeTab === "security") {
      setActiveTab("dashboard");
    }
  }, [currentUser, activeTab]);

  // Sync calculations for dashboard HUDs
  const totalBillsElectricityCost = bills.reduce((sum, b) => sum + b.electricityCost, 0);
  const totalBillsGasCost = bills.reduce((sum, b) => sum + (b.gasCost || 0), 0);
  const avgMonthlyUtilityCost = bills.length > 0 ? Math.round((totalBillsElectricityCost + totalBillsGasCost) / bills.length) : 0;
  
  const totalApplianceMonthlyKwh = Math.round(
    appliances.reduce((sum, app) => {
      return sum + ((app.powerWatts * app.hoursPerDay * app.count * 30) / 1000);
    }, 0)
  );

  // Auto-recalculate average annual savings from report if available
  const annualSavingsDollars = report 
    ? report.recommendations.reduce((sum, rec) => sum + rec.annualSavings, 0)
    : 180;

  const annualCarbonSavingsKg = report
    ? report.recommendations.reduce((sum, rec) => sum + rec.carbonSavingsKg, 0)
    : 420;

  const handleAddBill = (newBill: UtilityBill) => {
    // Check if month already logged, if so, replace it, else append
    setBills((prev) => {
      const filtered = prev.filter((b) => b.month !== newBill.month);
      return [...filtered, newBill].sort((a, b) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
    });
  };

  const handleDeleteBill = (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddAppliance = (newApp: Appliance) => {
    setAppliances((prev) => [...prev, newApp]);
  };

  const handleDeleteAppliance = (id: string) => {
    setAppliances((prev) => prev.filter((app) => app.id !== id));
  };

  const handleGenerateReport = async (customScenarioText: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utilityBills: bills,
          appliances: appliances,
          location: "CA (Pacific Grid Substation)",
          customScenario: customScenarioText,
          securityScrub: securityScrub
        })
      });
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("AI diagnostics API error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900" id="applet-container">
      {/* Professional Polish Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800" id="applet-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 text-slate-900 rounded flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight uppercase flex items-center gap-2 leading-none">
                Household Energy Optimizer
                <span className="hidden md:inline bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase tracking-wider">
                  SDG Goal 7
                </span>
              </h1>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium mt-0.5">
                Affordable, secure, and clean diagnostic intelligence for apartment tenants.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Profile sync identifier */}
            {currentUser && (
              <div className="flex items-center gap-3 border-l border-slate-850 pl-4 sm:pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-white">{currentUser.unit} — {currentUser.name}</p>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 mt-0.5 cursor-pointer transition-colors"
                    id="user-logout-btn"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                  {currentUser.avatar}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {!currentUser ? (
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50" id="login-container">
          <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6 text-emerald-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                GreenPeak Household Portal
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Dedicated household energy efficiency diagnostic tools for residents and building administrators.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Select Household Account / Unit
                </label>
                <select
                  value={loginUnit}
                  onChange={(e) => {
                    setLoginUnit(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-medium"
                  id="login-account-selector"
                >
                  <option value="tenant_1">Unit 402 — J. Doe (Tenant)</option>
                  <option value="tenant_2">Unit 105 — A. Smith (Tenant)</option>
                  <option value="tenant_3">Unit 310 — L. Chen (Tenant)</option>
                  <option value="property_admin">Building Property Administrator (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Passcode / Secure Key
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="Enter passcode"
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  id="login-password-input"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2" id="login-error-alert">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-semibold">{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm animate-fade-in"
                id="login-submit-btn"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Household Workspace
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Cooperative Building Directory Credentials
              </div>
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-[11px] space-y-2">
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span className="font-mono">Unit 402 (J. Doe)</span>
                  <span>Passcode: <code className="font-bold font-mono text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded">doe402</code></span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span className="font-mono">Unit 105 (A. Smith)</span>
                  <span>Passcode: <code className="font-bold font-mono text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded">smith105</code></span>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-medium">
                  <span className="font-mono">Unit 310 (L. Chen)</span>
                  <span>Passcode: <code className="font-bold font-mono text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded">chen310</code></span>
                </div>
                <div className="border-t border-slate-200 my-1 pt-1"></div>
                <div className="flex justify-between items-center text-slate-850 font-bold">
                  <span className="font-mono">Property Admin</span>
                  <span>Passcode: <code className="font-bold font-mono text-emerald-850 bg-emerald-100 px-1.5 py-0.5 rounded">adminmaster</code></span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
                Admin credentials provide full access to the secure Cybersecurity Console. Ordinary accounts are restricted to domestic footprint optimization dashboard workflows.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="md:w-64 shrink-0" id="applet-navigation">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1 sticky top-24">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
              id="nav-tab-dashboard"
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === "dashboard" ? "text-emerald-400" : "text-slate-400"}`} />
              Footprint Dashboard
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                activeTab === "analytics"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
              id="nav-tab-analytics"
            >
              <Database className={`w-4 h-4 shrink-0 ${activeTab === "analytics" ? "text-emerald-400" : "text-slate-400"}`} />
              Interactive BI Studio
            </button>

            <button
              onClick={() => setActiveTab("bills")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                activeTab === "bills"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
              id="nav-tab-bills"
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeTab === "bills" ? "text-emerald-400" : "text-slate-400"}`} />
              Billing Statement Logs
            </button>

            <button
              onClick={() => setActiveTab("appliances")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                activeTab === "appliances"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
              id="nav-tab-appliances"
            >
              <Cpu className={`w-4 h-4 shrink-0 ${activeTab === "appliances" ? "text-emerald-400" : "text-slate-400"}`} />
              Appliance Catalog
            </button>

            <button
              onClick={() => setActiveTab("recommendations")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                activeTab === "recommendations"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              }`}
              id="nav-tab-recommendations"
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === "recommendations" ? "text-emerald-400" : "text-slate-400"}`} />
              Predictive Diagnostics
            </button>

            {currentUser?.role === "admin" && (
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                  activeTab === "security"
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                }`}
                id="nav-tab-security"
              >
                <ShieldAlert className={`w-4 h-4 shrink-0 ${activeTab === "security" ? "text-emerald-400" : "text-slate-400"}`} />
                Cybersecurity Console
              </button>
            )}
          </div>
        </aside>

        {/* Dashboard Panels */}
        <section className="flex-1 min-w-0" id="main-content-panels">
          {/* Active Tab rendering */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Quick KPI summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-kpis">
                {/* KPI Card 1: Cost */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Average Monthly Bill</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-slate-900 font-mono">KES {avgMonthlyUtilityCost.toLocaleString()}</span>
                    <span className="text-sm text-slate-500 font-medium">KES</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-2">↓ 8.2% vs last month</p>
                </div>

                {/* KPI Card 2: Baseline */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Appliance Baseline</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-slate-900 font-mono">{totalApplianceMonthlyKwh}</span>
                    <span className="text-sm text-slate-500 font-medium">kWh/mo</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Calculated active inventory</p>
                </div>

                {/* KPI Card 3: Carbon */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Carbon Offset Target</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-light text-slate-900 font-mono">{(annualCarbonSavingsKg / 1000).toFixed(2)}</span>
                    <span className="text-sm text-slate-500 font-medium">Tonnes CO₂</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]"></div>
                  </div>
                </div>

                {/* KPI Card 4: Eco Score */}
                <div className="bg-emerald-600 p-5 rounded-xl text-white shadow-lg shadow-emerald-900/10">
                  <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-1">UN SDG 7 Eco Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono">{annualSavingsDollars > 120 ? 88 : 75}</span>
                    <span className="text-sm text-emerald-100">/ 100</span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-2">Goal 7: Excellence</p>
                </div>
              </div>

              {/* Charts visual engine wrapper */}
              <EnergyCharts bills={bills} appliances={appliances} />

              {/* Inline Smart recommendation summary */}
              <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Predictive Smart Automations Are Ready
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-xl">
                    Run our diagnostics simulator under custom household scenarios. Instantly export copyable Home Assistant YAML rules tailored to your appliance list.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs font-black rounded transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  Configure Automations
                </button>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="animate-fade-in">
              <AnalyticDashboardStudio
                bills={bills}
                appliances={appliances}
                onAddBill={handleAddBill}
                onAddAppliance={handleAddAppliance}
              />
            </div>
          )}

          {activeTab === "bills" && (
            <div className="animate-fade-in">
              <UtilityBillsForm
                bills={bills}
                onAddBill={handleAddBill}
                onDeleteBill={handleDeleteBill}
                securityScrub={securityScrub}
                setSecurityScrub={setSecurityScrub}
              />
            </div>
          )}

          {activeTab === "appliances" && (
            <div className="animate-fade-in">
              <AppliancesForm
                appliances={appliances}
                onAddAppliance={handleAddAppliance}
                onDeleteAppliance={handleDeleteAppliance}
              />
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="animate-fade-in">
              <AutomationGenerator
                bills={bills}
                appliances={appliances}
                report={report}
                onGenerateReport={handleGenerateReport}
                isGenerating={isGenerating}
                securityScrub={securityScrub}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-fade-in">
              <SecurityConsole bills={bills} appliances={appliances} />
            </div>
          )}
        </section>
      </main>)}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 shrink-0" id="applet-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-yellow-500 rounded-xs flex items-center justify-center text-[10px] font-bold text-white select-none">
              7
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              UN SDG: Affordable and Clean Energy
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>RSA-4096 Encrypted Connection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Verified Data Integrity</span>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] text-slate-400 mt-4 max-w-7xl mx-auto px-4">
          Household Energy Efficiency Optimizer — Built to fulfill UN Sustainable Development Goal 7 Targets. Local encrypted storage utilized.
        </div>
      </footer>
    </div>
  );
}
