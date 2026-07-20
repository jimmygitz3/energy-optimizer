import { useState } from "react";
import { UtilityBill, Appliance, OptimizationReport, Recommendation, PredictiveScenario, AutomationScript } from "../types";
import { Sparkles, Loader2, Zap, Leaf, ShieldAlert, Check, Copy, Flame, Clock, Award, ChevronDown, ChevronUp } from "lucide-react";

interface AutomationGeneratorProps {
  bills: UtilityBill[];
  appliances: Appliance[];
  report: OptimizationReport | null;
  onGenerateReport: (customScenario: string) => Promise<void>;
  isGenerating: boolean;
  securityScrub: boolean;
}

export default function AutomationGenerator({
  bills,
  appliances,
  report,
  onGenerateReport,
  isGenerating,
  securityScrub
}: AutomationGeneratorProps) {
  const [customScenario, setCustomScenario] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRunOptimization = () => {
    onGenerateReport(customScenario);
  };

  // Safe checks
  const totalBills = bills.length;
  const isSetupReady = totalBills > 0 || appliances.length > 0;

  return (
    <div className="space-y-6" id="ai-optimizer-section">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          SDG 7 Predictive Savings & Smart Automation Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Trigger our server-side predictive model to analyze billing anomalies, rate adjustments, and construct Home Assistant schedules.
        </p>
      </div>

      {/* Input panel & Simulator trigger */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-black text-slate-700">
              Specify Custom Scenarios / Energy Transitions (Optional)
            </label>
            <input
              type="text"
              value={customScenario}
              onChange={(e) => setCustomScenario(e.target.value)}
              placeholder="e.g., 'Installing smart plugs, transitioning to LED, shifting laundry load off-peak'"
              className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 bg-white"
              id="custom-scenario-input"
            />
            <p className="text-[10px] text-slate-400">
              Mention any specific updates you want to test. Our AI constructs custom hardware payload rules matching these plans.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleRunOptimization}
              disabled={!isSetupReady || isGenerating}
              className={`w-full md:w-auto px-5 py-2.5 rounded text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                isSetupReady && !isGenerating
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
              id="generate-optimization-report-btn"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Consumption Models...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run AI Energy Diagnostics
                </>
              )}
            </button>
          </div>
        </div>

        {!isSetupReady && (
          <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-100 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            Please add at least one utility log or registered appliance in the previous tabs to activate the AI diagnostician.
          </div>
        )}
      </div>

      {/* Loading HUD States */}
      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-xs text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <Zap className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Consulting Clean Energy Data Standards</h3>
            <p className="text-[11px] text-slate-400 animate-pulse">
              Calculating CO2 offset metrics, checking region-specific grids, generating script packages, and auditing cybersecurity practices...
            </p>
          </div>
        </div>
      )}

      {/* Report Showcase */}
      {report && !isGenerating && (
        <div className="space-y-6 animate-fade-in" id="ai-optimization-report-results">
          {report.isMock && (
            <div className="bg-amber-50 text-amber-900 text-xs p-3 rounded-lg border border-amber-200 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                💡 Offline Mode Active: Standard AI diagnostic template loaded. Add your Gemini key to Secrets to unlock custom live audits.
              </span>
              <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wider shrink-0">
                Demo
              </span>
            </div>
          )}

          {report.errorInfo && (
            <div className="bg-red-50 text-red-900 text-xs p-3 rounded-lg border border-red-200">
              {report.errorInfo}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recommendations Accordion & Scenarios - Left Side (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Recommendations list */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                  <Award className="w-4.5 h-4.5 text-indigo-600" />
                  AI-Powered Efficiency Action Recommendations
                </h3>

                <div className="space-y-3">
                  {report.recommendations.map((rec) => {
                    const isExpanded = expandedRecId === rec.id;
                    return (
                      <div
                        key={rec.id}
                        className="border border-gray-100 hover:border-indigo-100 rounded-lg overflow-hidden transition-all bg-gray-50/30"
                      >
                        <button
                          onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                          className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold text-gray-900">{rec.title}</span>
                              <span className="bg-indigo-100 text-indigo-900 text-[9px] px-2 py-0.2 rounded-full font-black uppercase">
                                {rec.category}
                              </span>
                              <span className={`text-[9px] px-2 py-0.2 rounded-full font-black uppercase ${
                                rec.difficulty === "Easy" ? "bg-emerald-100 text-emerald-900" :
                                rec.difficulty === "Medium" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-900"
                              }`}>
                                {rec.difficulty}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono flex items-center gap-3">
                              <span className="text-emerald-700 font-bold">Est Savings: ${rec.annualSavings}/year</span>
                              <span className="text-indigo-600 font-bold">Offset: {rec.carbonSavingsKg} kg CO2e</span>
                            </div>
                          </div>

                          <div className="text-gray-400 shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-0 border-t border-gray-100/50 bg-white text-xs text-gray-600 leading-relaxed font-medium">
                            {rec.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Predictive Scenarios Cards */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                  <Clock className="w-4.5 h-4.5 text-emerald-600" />
                  Predictive savings ROI scenarios
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.predictiveScenarios.map((sc, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-gray-900 block">{sc.name}</span>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{sc.description}</p>
                      </div>

                      <div className="border-t border-gray-200/60 pt-3 mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wide font-black">Monthly Save</span>
                          <strong className="text-emerald-700 font-bold text-xs">${sc.estimatedMonthlySavings}/mo</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wide font-black">Capital Investment</span>
                          <strong className="text-slate-800 font-bold text-xs">${sc.estimatedCost}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wide font-black">ROI Payback</span>
                          <strong className="text-indigo-900 font-bold text-xs">{sc.paybackPeriodMonths === 0 ? "Instant" : `${sc.paybackPeriodMonths} Months`}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase tracking-wide font-black">Carbon Avoided</span>
                          <strong className="text-emerald-700 font-bold text-xs">{sc.yearlyCarbonReductionKg} Kg/yr</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Automation Scripts & SDG Card - Right Side (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* SDG 7 Clean Impact Statement Card */}
              <div className="bg-emerald-900 text-emerald-50 rounded-xl p-5 shadow-xs border border-emerald-950 space-y-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-300 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                    UN SDG Goal 7 Accordance
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold leading-snug">{report.sdgImpact.title}</h4>
                  <p className="text-[11px] text-emerald-200 font-medium leading-relaxed">
                    {report.sdgImpact.description}
                  </p>
                </div>

                <ul className="space-y-1.5 text-[11px] font-medium text-emerald-100">
                  {report.sdgImpact.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-300 mt-0.5 font-bold">✔</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Automations Panel */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-xs border border-slate-950 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs font-black text-slate-200">Dynamic IoT Device Automations</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  Deploy these configuration templates inside your local Smart Home ecosystem or scripting controller:
                </p>

                <div className="space-y-4">
                  {report.automations.map((aut, idx) => (
                    <div key={idx} className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[11px] font-bold text-white block">{aut.title}</span>
                          <span className="text-[9px] text-slate-500 font-mono uppercase font-black">{aut.type}</span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(aut.code, idx)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded cursor-pointer transition-colors"
                          title="Copy block"
                          id={`copy-script-${idx}`}
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <pre className="text-[9px] font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800 max-h-36 overflow-y-auto whitespace-pre leading-relaxed text-indigo-200">
                        {aut.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
