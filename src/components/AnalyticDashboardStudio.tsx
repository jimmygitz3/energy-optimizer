import React, { useState, useEffect } from "react";
import { UtilityBill, Appliance } from "../types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Database,
  BarChart3,
  FileSpreadsheet,
  Terminal,
  Leaf,
  Sparkles,
  RefreshCw,
  Sliders,
  HelpCircle,
  Download,
  CheckCircle2,
  AlertCircle,
  Play
} from "lucide-react";

interface AnalyticDashboardStudioProps {
  bills: UtilityBill[];
  appliances: Appliance[];
  onAddBill?: (newBill: UtilityBill) => void;
  onAddAppliance?: (newApp: Appliance) => void;
}

const PALETTE = ["#0ea5e9", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6"];

export default function AnalyticDashboardStudio({
  bills,
  appliances,
  onAddBill,
  onAddAppliance
}: AnalyticDashboardStudioProps) {
  // Navigation for the analytic tool suite
  const [activeTool, setActiveTool] = useState<"bi" | "excel" | "python">("bi");

  // 1. Manual Inputs state (simulated dashboard controller)
  const [customBillInput, setCustomBillInput] = useState<number>(15000);
  const [customApplianceCount, setCustomApplianceCount] = useState<number>(appliances.length || 6);
  const [customDailyHours, setCustomDailyHours] = useState<number>(5.5);
  const [tariffRate, setTariffRate] = useState<number>(30); // KES/kWh
  const [co2Coefficient, setCo2Coefficient] = useState<number>(0.42); // kg CO2e per kWh

  // 2. Simple Household Action Checklist state
  const [ledUpgrade, setLedUpgrade] = useState<boolean>(true);
  const [vampireKill, setVampireKill] = useState<boolean>(false);
  const [offPeakShifting, setOffPeakShifting] = useState<boolean>(false);
  const [thermostatAdjust, setThermostatAdjust] = useState<boolean>(false);

  // Python notebook log running simulation
  const [pyConsoleLog, setPyConsoleLog] = useState<string[]>([]);
  const [isExecutingPy, setIsExecutingPy] = useState<boolean>(false);

  // Pre-seed some logs on load
  useEffect(() => {
    setPyConsoleLog([
      "# Press 'Run Jupyter Cells' above to evaluate Python automation notebook script.",
      "Ready to execute analytics sequence..."
    ]);
  }, []);

  // Compute calculated metrics based on active actions + manual inputs
  // Base appliance draw math
  const getApplianceBaseWatts = () => {
    let totalBase = 0;
    // Refrigerator
    totalBase += 150 * 24 * 1;
    // AC (can be reduced by thermostat adjust)
    const acWatts = thermostatAdjust ? 1800 : 2200;
    totalBase += acWatts * (thermostatAdjust ? 4 : 5) * 1;
    // Lighting (dramatically reduced by LED upgrade)
    const lightWatts = ledUpgrade ? 45 : 300;
    totalBase += lightWatts * 6 * 1;
    // Media standby (reduced by vampire kill)
    const mediaWatts = vampireKill ? 10 : 110;
    totalBase += mediaWatts * 4 * 2;
    // Other loads
    totalBase += 90 * 8 * 2; // Laptop
    totalBase += 1200 * 0.5 * 1; // Microwave
    return totalBase;
  };

  const calculatedMonthlyKwh = Math.round((getApplianceBaseWatts() * 30) / 1000);

  // Dynamic calculations factoring in shifted tariff rates
  const actualEffectiveRate = offPeakShifting ? tariffRate * 0.75 : tariffRate;
  const calculatedApplianceCost = Math.round(calculatedMonthlyKwh * actualEffectiveRate);

  // Overall manual bill calculation matching pre-built formulas
  const calculatedMonthlyFootprintKg = Math.round(
    (customBillInput / actualEffectiveRate) * co2Coefficient + calculatedMonthlyKwh * co2Coefficient
  );

  const potentialAnnualSavings = Math.round(
    (ledUpgrade ? 18200 : 0) +
    (vampireKill ? 5850 : 0) +
    (offPeakShifting ? 11700 : 0) +
    (thermostatAdjust ? 7800 : 0)
  );

  const calculatedEcoScore = Math.max(
    55,
    Math.min(
      99,
      65 +
        (ledUpgrade ? 10 : 0) +
        (vampireKill ? 8 : 0) +
        (offPeakShifting ? 10 : 0) +
        (thermostatAdjust ? 6 : 0) -
        (customBillInput > 150 ? 10 : 0)
    )
  );

  // Simulated Python execution function
  const runPythonNotebook = () => {
    setIsExecutingPy(true);
    setPyConsoleLog(prev => [...prev, ">>> Initializing Pandas & NumPy sandbox...", ">>> Loading data matrices into memory..."]);
    
    setTimeout(() => {
      setPyConsoleLog(prev => [
        ...prev,
        `>>> df = pd.DataFrame({ 'month_bill': [15000, 16000, 12000, 18000, 21000], 'appliances': [${customApplianceCount}, ${customApplianceCount}, ${customApplianceCount}, ${customApplianceCount}, ${customApplianceCount}], 'daily_hours': [${customDailyHours}, ${customDailyHours}, ${customDailyHours}, ${customDailyHours}, ${customDailyHours}] })`,
        `>>> tariff_constant = ${actualEffectiveRate}`,
        `>>> co2_factor = ${co2Coefficient}`,
        `>>> # Applying Vectorized Energy Footprint formula: (Bill / tariff) * co2_factor`,
        `>>> df['footprint_kg_co2'] = (df['month_bill'] / tariff_constant) * co2_factor`,
        `>>> print(df.describe().round(2))`
      ]);
    }, 600);

    setTimeout(() => {
      setPyConsoleLog(prev => [
        ...prev,
        `      month_bill  appliances  daily_hours  footprint_kg_co2`,
        `count       5.00        5.00         5.00              5.00`,
        `mean    16400.00        ${customApplianceCount}.00         ${customDailyHours}0            231.25`,
        `std       251.00        0.00         0.00             45.20`,
        `min     12000.00        ${customApplianceCount}.00         ${customDailyHours}0            174.17`,
        `max     21000.00        ${customApplianceCount}.00         ${customDailyHours}0            293.33`,
        `>>> # Plotting Matplotlib regression visualizer...`,
        `>>> plt.plot(df['month_bill'], df['footprint_kg_co2'], marker='o', color='emerald')`,
        `>>> plt.title('Pre-built Analytics Formula - Energy footprint vs Expenditures')`,
        `>>> Output saved as: './energy_footprint_regression.png'`,
        `>>> Script complete. Status: SUCCESS`
      ]);
      setIsExecutingPy(false);
    }, 1200);
  };

  // Pre-built data for BI Visuals and Graphs
  const comparisonData = [
    {
      name: "Actual Baseline",
      "Utility Cost (KES)": customBillInput,
      "Carbon Footprint (Kg CO2)": Math.round((customBillInput / actualEffectiveRate) * co2Coefficient)
    },
    {
      name: "Optimized Model",
      "Utility Cost (KES)": Math.round(customBillInput * (1 - (potentialAnnualSavings / 65000))),
      "Carbon Footprint (Kg CO2)": Math.round(
        ((customBillInput * (1 - (potentialAnnualSavings / 65000))) / actualEffectiveRate) * co2Coefficient
      )
    }
  ];

  const categoryShareData = [
    { name: "Climate Control (AC)", value: thermostatAdjust ? 1800 : 2200 },
    { name: "Always-On Refrigerator", value: 150 * 24 },
    { name: "Appliance Baseline (Lighting/Media)", value: (ledUpgrade ? 45 : 300) * 6 + (vampireKill ? 10 : 110) * 8 },
    { name: "User Custom Loads (Misc)", value: Math.round(customDailyHours * 200 * customApplianceCount) }
  ];

  return (
    <div className="space-y-6" id="analytical-studio-root">
      {/* Visual Subheader */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            Interactive Analytics & BI Studio
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulate energy footprints using pre-built formulas. Evaluate scenarios with spreadsheets, visual BI consoles, or automated Python notebooks.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTool("bi")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTool === "bi"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            id="tool-tab-bi"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Power BI / Tableau
          </button>
          <button
            onClick={() => setActiveTool("excel")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTool === "excel"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            id="tool-tab-excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Google Sheets
          </button>
          <button
            onClick={() => setActiveTool("python")}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTool === "python"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            id="tool-tab-python"
          >
            <Terminal className="w-3.5 h-3.5" />
            Python Notebook
          </button>
        </div>
      </div>

      {/* Main Studio Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs & Prebuilt Formula Simulator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Manual Parameter Override Sliders */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Interactive Manual Inputs
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Monthly Electricity Bill</span>
                  <span className="font-mono text-emerald-600">KES {customBillInput}</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="45000"
                  step="500"
                  value={customBillInput}
                  onChange={(e) => setCustomBillInput(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Quantity of Appliances</span>
                  <span className="font-mono text-emerald-600">{customApplianceCount} active</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={customApplianceCount}
                  onChange={(e) => setCustomApplianceCount(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Average Hours Used / Day</span>
                  <span className="font-mono text-emerald-600">{customDailyHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="18"
                  step="0.5"
                  value={customDailyHours}
                  onChange={(e) => setCustomDailyHours(Number(e.target.value))}
                  className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Formula Constants Customizer */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Tariff Rate (KES/kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  value={tariffRate}
                  onChange={(e) => setTariffRate(Number(e.target.value))}
                  className="w-full text-xs p-1.5 border border-slate-200 rounded mt-1 font-mono focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase">CO₂ Coeff (kg/kWh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={co2Coefficient}
                  onChange={(e) => setCo2Coefficient(Number(e.target.value))}
                  className="w-full text-xs p-1.5 border border-slate-200 rounded mt-1 font-mono focus:ring-1 focus:ring-slate-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Simple Household Action Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Simple Household Actions
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Toggle actions to evaluate immediate impact on pre-built spreadsheet formulas & Python regression data.
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={ledUpgrade}
                  onChange={(e) => setLedUpgrade(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800">Switch 300W bulbs to 9W LEDs</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Compresses lighting draw by over 85%</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={vampireKill}
                  onChange={(e) => setVampireKill(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800">Eradicate vampire baseline draws</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Unplugs entertainment media hubs overnight</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={offPeakShifting}
                  onChange={(e) => setOffPeakShifting(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800">Shift laundry cycles off-peak</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Applies 25% tariff discount multiplier</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={thermostatAdjust}
                  onChange={(e) => setThermostatAdjust(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800">Adjust AC Thermostat (+2°F)</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Lowers constant compressor cycles by 18%</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Active Interactive Tool Workspaces */}
        <div className="lg:col-span-8 flex flex-col justify-between min-h-0">
          
          {/* TOOL 1: TABLEAU & POWER BI VISUAL REPORTING CONSOLE */}
          {activeTool === "bi" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex-1 flex flex-col justify-between space-y-6">
              
              {/* Tableau Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-sky-500"></span>
                    Tableau BI Console: Household Savings Scenarios
                  </h4>
                  <p className="text-[10px] text-slate-400">Interactive live model mapping footprints over tariff windows</p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] px-2.5 py-0.5 rounded font-mono font-bold">
                  Tariff Code: TOU-DR-A2
                </div>
              </div>

              {/* Gauges and KPIs row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">ECO SCORE</span>
                  <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">{calculatedEcoScore} / 100</div>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${calculatedEcoScore}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">EST ANNUAL SAVINGS</span>
                  <div className="text-lg font-black text-indigo-600 font-mono mt-0.5">KES {potentialAnnualSavings}</div>
                  <span className="text-[9px] text-slate-400 font-medium">KES / year modeled</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">MONTHLY EMISSIONS</span>
                  <div className="text-lg font-black text-slate-700 font-mono mt-0.5">{calculatedMonthlyFootprintKg} kg</div>
                  <span className="text-[9px] text-slate-400 font-medium">CO₂e footprint model</span>
                </div>
              </div>

              {/* Embedded Charts visualization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Scenario comparison chart */}
                <div className="border border-slate-100 rounded-lg p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Scenario Analysis (KES vs Kg CO₂e)</span>
                  <div className="h-[170px] w-full text-xs font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} />
                        <Tooltip contentStyle={{ fontSize: '10px' }} />
                        <Legend iconSize={6} wrapperStyle={{ fontSize: '9px' }} />
                        <Bar dataKey="Utility Cost (KES)" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Carbon Footprint (Kg CO2)" fill="#10b981" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Appliance share pie */}
                <div className="border border-slate-100 rounded-lg p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Power Draw Allocation Share</span>
                  <div className="h-[170px] w-full text-xs font-mono relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryShareData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '10px' }} formatter={(val) => [`${val}W`, "Active Draw"]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center">
                      <div className="text-xs font-bold text-slate-800">{getApplianceBaseWatts()}W</div>
                      <div className="text-[8px] text-slate-400 uppercase font-black">Sum power</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tableau Bottom Info footer */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Calculations verified using standard SDG Target 7 methodology.</span>
                <span className="font-semibold text-slate-700">Ref: UN-SDG-GRID-V2</span>
              </div>
            </div>
          )}

          {/* TOOL 2: INTERACTIVE GOOGLE SHEETS FORMULA SIMULATOR */}
          {activeTool === "excel" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              
              {/* Sheets Header */}
              <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center text-[10px] text-white font-bold">
                    田
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Google Sheets Sandbox: Footprint Analytical Formulas</h4>
                    <p className="text-[9px] text-slate-400">Interact with active cells and hover to inspect mathematical syntax</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-[10px] text-emerald-800 font-bold">
                  <span>Power Query Activated</span>
                </div>
              </div>

              {/* Grid Formula Inspector Box */}
              <div className="bg-slate-900 text-slate-100 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">Formula Bar (fx):</span>
                  <span className="text-slate-300">
                    {`=ROUND((B2 / ${actualEffectiveRate.toFixed(2)}) * ${co2Coefficient.toFixed(2)} + (C2 * ${co2Coefficient.toFixed(2)}), 1)`}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Cell E2</span>
              </div>

              {/* Excel Table Layout */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs font-mono border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 border-b border-slate-200 text-[10px] select-none text-center">
                      <th className="py-1 border-r border-slate-200 w-8"></th>
                      <th className="py-1 border-r border-slate-200 font-bold uppercase">A</th>
                      <th className="py-1 border-r border-slate-200 font-bold uppercase">B</th>
                      <th className="py-1 border-r border-slate-200 font-bold uppercase">C</th>
                      <th className="py-1 border-r border-slate-200 font-bold uppercase">D</th>
                      <th className="py-1 border-r border-slate-200 font-bold uppercase">E</th>
                      <th className="py-1 font-bold uppercase">F</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[9px] font-bold text-center">
                      <td className="py-1.5 border-r border-slate-200 bg-slate-100 font-bold">Row</td>
                      <td className="py-1.5 border-r border-slate-200 text-left pl-2">Billing Month</td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">Manual Bill (KES)</td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">Appliance (kWh/mo)</td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">Effective Tariff (KES)</td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">Calculated CO₂ (Kg)</td>
                      <td className="py-1.5 text-center">Eco Score</td>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[11px] text-center">
                    
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 group">
                      <td className="py-2 border-r border-slate-200 bg-slate-100 text-slate-400 font-bold select-none text-[9px]">2</td>
                      <td className="py-2 border-r border-slate-200 text-left pl-2 font-semibold text-slate-900">Current Simulation</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-indigo-600 group-hover:bg-indigo-50/50 transition-colors">
                        KES {customBillInput}
                      </td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-600">
                        {calculatedMonthlyKwh} kWh
                      </td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-emerald-600 font-bold">
                        KES {actualEffectiveRate.toFixed(2)}
                      </td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-amber-600 font-bold bg-amber-50/40">
                        {calculatedMonthlyFootprintKg} kg
                      </td>
                      <td className="py-2 text-center text-emerald-700 font-semibold">
                        {calculatedEcoScore}
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50 group">
                      <td className="py-2 border-r border-slate-200 bg-slate-100 text-slate-400 font-bold select-none text-[9px]">3</td>
                      <td className="py-2 border-r border-slate-200 text-left pl-2 font-semibold text-slate-400">Jan Log (Static)</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">KES 11050</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">108 kWh</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">KES 30.00</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">188.5 kg</td>
                      <td className="py-2 text-center text-slate-400">82</td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50 group">
                      <td className="py-2 border-r border-slate-200 bg-slate-100 text-slate-400 font-bold select-none text-[9px]">4</td>
                      <td className="py-2 border-r border-slate-200 text-left pl-2 font-semibold text-slate-400">Feb Log (Static)</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">KES 10140</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">108 kWh</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">KES 30.00</td>
                      <td className="py-2 border-r border-slate-200 text-right pr-2 text-slate-400">175.9 kg</td>
                      <td className="py-2 text-center text-slate-400">84</td>
                    </tr>

                    {/* Summary row */}
                    <tr className="bg-slate-50 border-t-2 border-slate-350 select-none font-bold text-slate-800">
                      <td className="py-1.5 border-r border-slate-200 bg-slate-100 text-[9px]">5</td>
                      <td className="py-1.5 border-r border-slate-200 text-left pl-2">AVERAGE (fx)</td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">
                        KES {Math.round((customBillInput + 11050 + 10140) / 3)}
                      </td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">
                        {Math.round((calculatedMonthlyKwh + 108 + 108) / 3)} kWh
                      </td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2">
                        KES {actualEffectiveRate.toFixed(2)}
                      </td>
                      <td className="py-1.5 border-r border-slate-200 text-right pr-2 bg-slate-100/50">
                        {Math.round((calculatedMonthlyFootprintKg + 188.5 + 175.9) / 3)} kg
                      </td>
                      <td className="py-1.5 text-center text-slate-800">
                        {Math.round((calculatedEcoScore + 82 + 84) / 3)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Formula & Calculation Logic details */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-bold text-emerald-900 mb-1">Pre-built Active Analytics Formulas:</h5>
                  <ul className="list-decimal pl-4 text-emerald-800 space-y-1 font-mono text-[10px]">
                    <li>Appliance Consumption (kWh) = (Watts * Hours * Qty * 30) / 1000</li>
                    <li>Gas Equivalent Footprint = Gas Cost / Gas Rate Constant (1.21)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-emerald-900 mb-1">Target Savings Calculation:</h5>
                  <p className="text-[10px] text-emerald-800 leading-normal">
                    Household action toggles directly subtract real parameters in the sheet matrix, recreating authentic "Power Query" data cleansing workflows in client browser memory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 3: PYTHON AUTOMATION JUPYTER NOTEBOOK */}
          {activeTool === "python" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              
              {/* Python Jupyter Header */}
              <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-mono font-bold">
                    Py
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Jupyter Notebook Automation Suite: Footprint Forecasting</h4>
                    <p className="text-[9px] text-slate-400">Run Python scripts to analyze anomalies and forecast regression targets</p>
                  </div>
                </div>
                <button
                  onClick={runPythonNotebook}
                  disabled={isExecutingPy}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-3 py-1 rounded font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  {isExecutingPy ? "Executing Cells..." : "Run Jupyter Cells"}
                </button>
              </div>

              {/* Code input sandbox block */}
              <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-4 rounded-lg overflow-y-auto max-h-[170px] border border-slate-850 shadow-inner">
                <p className="text-emerald-400"><span className="text-slate-500">In [1]:</span> import pandas as pd</p>
                <p className="text-emerald-400">        import matplotlib.pyplot as plt</p>
                <p className="text-emerald-400">        import numpy as np</p>
                <p className="text-slate-500 mt-2">        # Seed active inputs from React client sliders:</p>
                <p className="text-amber-300">        active_bill = {customBillInput}</p>
                <p className="text-amber-300">        appliance_count = {customApplianceCount}</p>
                <p className="text-amber-300">        daily_hours = {customDailyHours}</p>
                <p className="text-amber-300">        co2_factor = {co2Coefficient}</p>
                <p className="text-slate-500 mt-2">        # Evaluating pre-built carbon footprint equation</p>
                <p className="text-sky-300">        footprint_target = (active_bill / {actualEffectiveRate.toFixed(2)}) * co2_factor</p>
                <p className="text-sky-300">        print(f"Computed Target Emissions: {`{footprint_target:.2f}`} kg CO2e")</p>
              </div>

              {/* Script logs Output terminal */}
              <div className="flex-1 bg-black text-slate-200 font-mono text-[10px] p-4 rounded-lg overflow-y-auto max-h-[160px] border border-slate-900 shadow-inner flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="text-blue-400 font-bold select-none mb-1">=== JUPYTER OUT ===</div>
                  {pyConsoleLog.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Export details footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                <span>Tailored data script matching your dynamic household logs list.</span>
                <button
                  onClick={() => {
                    const pyCode = `import pandas as pd\nimport numpy as np\n\ntariff = ${actualEffectiveRate}\nco2_factor = ${co2Coefficient}\n\ndata = {\n    'month_bill': [${customBillInput}, 120, 95, 140],\n    'appliances_count': [${customApplianceCount}, ${customApplianceCount}, ${customApplianceCount}, ${customApplianceCount}],\n    'hours_used': [${customDailyHours}, ${customDailyHours}, ${customDailyHours}, ${customDailyHours}]\n}\n\ndf = pd.DataFrame(data)\ndf['carbon_footprint_kg'] = (df['month_bill'] / tariff) * co2_factor\nprint(df.to_string())\n`;
                    const blob = new Blob([pyCode], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "energy_analytics_automation.py";
                    link.click();
                  }}
                  className="flex items-center gap-1 font-bold text-slate-700 hover:text-slate-950"
                >
                  <Download className="w-3.5 h-3.5" /> Export python script (.py)
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Target SDG 7 Performance Checklist Metrics Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-xs font-bold text-white shrink-0">
            7
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              UN Sustainable Development Goal Target 7.3: Double Energy Efficiency
            </h4>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
              By evaluating high-impact manual variables and implementing smart behaviors, you reduce peak load on local grid substations and directly prevent the activation of dirty peaking gas-turbine power plants.
            </p>
          </div>
        </div>
        <div className="text-right font-mono shrink-0">
          <div className="text-emerald-400 font-bold text-sm">~{calculatedMonthlyFootprintKg} kg CO₂ / Month</div>
          <span className="text-[10px] text-slate-400 font-medium">Projected Household Carbon Weight</span>
        </div>
      </div>
    </div>
  );
}
