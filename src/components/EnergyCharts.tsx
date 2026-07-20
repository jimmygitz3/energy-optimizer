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
import { BarChart3, PieChartIcon, Leaf, TrendingUp } from "lucide-react";

interface EnergyChartsProps {
  bills: UtilityBill[];
  appliances: Appliance[];
}

const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981", "#ef4444", "#6b7280"];

export default function EnergyCharts({ bills, appliances }: EnergyChartsProps) {
  // 1. Prepare bills cost trends data
  const trendsData = bills.map(b => ({
    name: b.month,
    Electric: b.electricityCost,
    Gas: b.gasCost || 0,
    Total: b.electricityCost + (b.gasCost || 0)
  }));

  // 2. Prepare appliance footprint share
  const applianceData = appliances.map(app => {
    const monthlyKwh = ((app.powerWatts * app.hoursPerDay * app.count * 30) / 1000);
    return {
      name: app.name,
      value: Math.round(monthlyKwh),
      cost: Math.round(monthlyKwh * 0.25) // Est $0.25 per kWh
    };
  }).filter(item => item.value > 0);

  const totalApplianceMonthlyKwh = applianceData.reduce((sum, item) => sum + item.value, 0);

  // 3. Prepare predictive scenario comparison
  const totalBillsElectricityCost = bills.reduce((sum, b) => sum + b.electricityCost, 0);
  const totalBillsGasCost = bills.reduce((sum, b) => sum + (b.gasCost || 0), 0);
  const avgMonthlyUtilityCost = bills.length > 0 ? (totalBillsElectricityCost + totalBillsGasCost) / bills.length : 140;

  const comparativeScenarios = [
    {
      name: "Current Baseline",
      "Utility Bill ($)": Math.round(avgMonthlyUtilityCost),
      "Carbon Footprint (Kg CO2e)": Math.round((bills.reduce((sum, b) => sum + b.electricityKwh, 0) / (bills.length || 1)) * 0.45)
    },
    {
      name: "Smart Load-Shift",
      "Utility Bill ($)": Math.round(avgMonthlyUtilityCost * 0.82), // 18% savings
      "Carbon Footprint (Kg CO2e)": Math.round((bills.reduce((sum, b) => sum + b.electricityKwh, 0) / (bills.length || 1)) * 0.82 * 0.45)
    },
    {
      name: "Full Smart IoT Eco",
      "Utility Bill ($)": Math.round(avgMonthlyUtilityCost * 0.72), // 28% savings
      "Carbon Footprint (Kg CO2e)": Math.round((bills.reduce((sum, b) => sum + b.electricityKwh, 0) / (bills.length || 1)) * 0.72 * 0.45)
    }
  ];

  return (
    <div className="space-y-6" id="energy-charts-section">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Energy Footprint Visualizations
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore data models mapping historic expenditure, high-demand appliance groups, and target SDG savings trajectories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trends Area Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Monthly Utility Billing Log History ($)
            </h3>
            <p className="text-[11px] text-gray-500">Electricity cost stacked alongside gas over registered periods</p>
          </div>

          <div className="h-[260px] w-full text-xs font-mono">
            {trendsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-center">
                Please seed some billing log data to load the area trend model.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorElectric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Electric" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorElectric)" />
                  <Area type="monotone" dataKey="Gas" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorGas)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Appliance Footprint Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <PieChartIcon className="w-4 h-4 text-indigo-500" />
              Appliance Consumption Baseline Share (kWh/mo)
            </h3>
            <p className="text-[11px] text-gray-500">Breakdown of calculated active device baseline cycles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 h-[220px] w-full text-xs font-mono relative flex justify-center items-center">
              {applianceData.length === 0 ? (
                <div className="text-gray-400 text-center">Add appliances to inventory.</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applianceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {applianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} formatter={(val) => [`${val} kWh`, "Power Draw"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Central Text HUD */}
                  <div className="absolute text-center">
                    <div className="text-lg font-black text-slate-800">{totalApplianceMonthlyKwh}</div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">kWh / Month</div>
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-6 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {applianceData.length === 0 ? (
                <p className="text-[11px] text-gray-400">Inventory is empty.</p>
              ) : (
                applianceData.map((app, idx) => {
                  const share = ((app.value / totalApplianceMonthlyKwh) * 100).toFixed(0);
                  return (
                    <div key={app.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        <span className="truncate font-semibold text-gray-700">{app.name}</span>
                      </div>
                      <div className="text-right font-mono text-gray-500 shrink-0 font-medium">
                        {app.value} kWh ({share}%)
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* SDG 7 Comparative Analysis Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Leaf className="w-4 h-4 text-emerald-500" />
                UN SDG 7 Scenario Optimization Targets
              </h3>
              <p className="text-[11px] text-gray-500">Predictive monthly dollar costs vs estimated carbon output (Kg CO2e) per scenario</p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1 rounded border border-emerald-200 font-bold self-start sm:self-auto">
              🎯 Target SDG 7.3: +100% Efficiency Acceleration
            </div>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeScenarios} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Utility Bill ($)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Carbon Footprint (Kg CO2e)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
