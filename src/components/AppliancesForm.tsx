import React, { useState } from "react";
import { Appliance } from "../types";
import { Cpu, Trash2, Plus, Zap, Percent } from "lucide-react";

interface AppliancesFormProps {
  appliances: Appliance[];
  onAddAppliance: (appliance: Appliance) => void;
  onDeleteAppliance: (id: string) => void;
}

const APPLIANCES_PRESETS = [
  { name: "LED Light Bulb", watts: 9, hours: 6, count: 5 },
  { name: "Incandescent Light Bulb", watts: 60, hours: 6, count: 5 },
  { name: "Central Air Conditioner (1.5 Ton)", watts: 2200, hours: 6, count: 1 },
  { name: "Space Heater", watts: 1500, hours: 4, count: 1 },
  { name: "Refrigerator & Freezer", watts: 150, hours: 24, count: 1 },
  { name: "Gaming PC & Monitor", watts: 450, hours: 5, count: 1 },
  { name: "Standby DVR / Cable Box", watts: 35, hours: 24, count: 1 },
  { name: "Electric Boiler / Kettle", watts: 1800, hours: 0.5, count: 1 }
];

export default function AppliancesForm({
  appliances,
  onAddAppliance,
  onDeleteAppliance
}: AppliancesFormProps) {
  const [name, setName] = useState("");
  const [powerWatts, setPowerWatts] = useState(150);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [count, setCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddAppliance({
      id: "app_" + Date.now(),
      name,
      powerWatts: Number(powerWatts) || 0,
      hoursPerDay: Number(hoursPerDay) || 0,
      count: Number(count) || 1
    });
    setName("");
  };

  const handleApplyPreset = (preset: typeof APPLIANCES_PRESETS[0]) => {
    setName(preset.name);
    setPowerWatts(preset.watts);
    setHoursPerDay(preset.hours);
    setCount(preset.count);
  };

  // Calculate stats
  const totalDailyKwh = appliances.reduce((sum, app) => {
    return sum + ((app.powerWatts * app.hoursPerDay * app.count) / 1000);
  }, 0);

  const totalMonthlyKwh = totalDailyKwh * 30;

  return (
    <div className="space-y-6" id="appliances-section">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          Active Household Appliances
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Catalog your active household loads to map load-shifting scenarios and build custom Home Assistant automation rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Presets</h3>
            <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {APPLIANCES_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded text-[11px] font-semibold text-slate-700 transition-colors text-left truncate max-w-[170px] cursor-pointer"
                  title={`${p.watts}W, ${p.hours}h/day`}
                >
                  ⚡ {p.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Add Custom Appliance</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Appliance Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Living room portable heater"
                className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
                id="appliance-name"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Power (Watts)</label>
                <input
                  type="number"
                  value={powerWatts}
                  onChange={(e) => setPowerWatts(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                  id="appliance-watts"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hours / Day</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                  id="appliance-hours"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qty Count</label>
                <input
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500"
                  id="appliance-count"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              id="add-appliance-btn"
            >
              <Plus className="w-4 h-4" /> Add to Inventory
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Current Appliances Inventory</h3>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
                  {appliances.length} Devices
                </span>
              </div>

              {appliances.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Cpu className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No appliances registered</p>
                  <p className="text-[10px] text-slate-400 mt-1">Select quick presets or add devices manually</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {appliances.map((app) => {
                    const dailyKwh = (app.powerWatts * app.hoursPerDay * app.count) / 1000;
                    const monthlyKwh = dailyKwh * 30;
                    return (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/60 rounded-lg border border-slate-200 transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {app.name}
                            <span className="text-[10px] text-slate-400 font-normal">
                              x{app.count} units
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-3">
                            <span>Draw: <strong className="font-mono text-slate-700">{app.powerWatts}W</strong></span>
                            <span>Usage: <strong className="font-mono text-slate-700">{app.hoursPerDay} hrs/day</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-indigo-950 font-mono">
                              ~{monthlyKwh.toFixed(1)} kWh/mo
                            </div>
                            <div className="text-[10px] text-emerald-600 font-semibold">
                              Est: ${(monthlyKwh * 0.25).toFixed(2)} /mo
                            </div>
                          </div>

                          <button
                            onClick={() => onDeleteAppliance(app.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            id={`delete-appliance-${app.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total Footprint Summary */}
            <div className="border-t border-slate-100 pt-4 mt-6 bg-indigo-50/40 p-3 rounded-lg border border-indigo-100 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="text-slate-600 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Total Active Inventory Draw
                </span>
                <p className="text-[10px] text-slate-400 leading-none">Aggregated calculated demand</p>
              </div>

              <div className="text-right font-mono space-y-0.5">
                <div className="text-sm font-black text-indigo-950">
                  {totalDailyKwh.toFixed(2)} kWh <span className="text-[10px] text-slate-500">/day</span>
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  ~{totalMonthlyKwh.toFixed(1)} kWh <span className="text-[10px] text-slate-500">/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
