import React, { useState } from "react";
import { UtilityBill } from "../types";
import { FileText, Shield, ShieldCheck, Trash2, Plus, Upload, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { SAMPLE_NAMES, SAMPLE_ADDRESSES, SAMPLE_ACCOUNTS } from "../data";

interface UtilityBillsFormProps {
  bills: UtilityBill[];
  onAddBill: (bill: UtilityBill) => void;
  onDeleteBill: (id: string) => void;
  securityScrub: boolean;
  setSecurityScrub: (val: boolean) => void;
}

export default function UtilityBillsForm({
  bills,
  onAddBill,
  onDeleteBill,
  securityScrub,
  setSecurityScrub
}: UtilityBillsFormProps) {
  const [month, setMonth] = useState("Aug");
  const [electricityKwh, setElectricityKwh] = useState(380);
  const [electricityCost, setElectricityCost] = useState(95);
  const [gasTherm, setGasTherm] = useState(6);
  const [gasCost, setGasCost] = useState(10);

  // File parsing simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBill, setScannedBill] = useState<{
    fileName: string;
    rawText: string;
    scrubbedText: string;
    detectedPii: string[];
    extractedData: { month: string; electricityKwh: number; electricityCost: number; gasTherm: number; gasCost: number };
  } | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBill({
      id: "bill_" + Date.now(),
      month,
      electricityKwh: Number(electricityKwh) || 0,
      electricityCost: Number(electricityCost) || 0,
      gasTherm: Number(gasTherm) || 0,
      gasCost: Number(gasCost) || 0
    });
  };

  // Simulate drop or file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateOcr(e.target.files[0].name);
    }
  };

  const simulateOcr = (fileName: string) => {
    setIsScanning(true);
    setScannedBill(null);

    setTimeout(() => {
      // Pick a random client identity to simulate realistic scanned text
      const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      const randomAddress = SAMPLE_ADDRESSES[Math.floor(Math.random() * SAMPLE_ADDRESSES.length)];
      const randomAccount = SAMPLE_ACCOUNTS[Math.floor(Math.random() * SAMPLE_ACCOUNTS.length)];
      const randomMonth = ["Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(Math.random() * 5)];
      
      const kwh = Math.floor(Math.random() * 250) + 300;
      const cost = Math.round(kwh * 0.25);
      const therms = Math.floor(Math.random() * 12) + 5;
      const gasC = Math.round(therms * 1.3);

      const raw = `MID-CITY ENERGY CORP\nStatement Date: 2026-07-15\nAccount: ${randomAccount}\nCustomer: ${randomName}\nService Address: ${randomAddress}\nService Month: ${randomMonth}\n-----------------------------------\nCURRENT CHARGES:\nElectricity usage: ${kwh} kWh @ $0.25 = $${cost}.00\nGas service: ${therms} Therms @ $1.30 = $${gasC}.00\nTotal Bill Due: $${cost + gasC}.00\nThank you for choosing Mid-City!`;

      // Scrub utility personal data
      let scrubbed = raw;
      const detected: string[] = [];
      if (securityScrub) {
        scrubbed = scrubbed
          .replace(randomName, "[REDACTED CLIENT NAME]")
          .replace(randomAddress, "[REDACTED SERVICE ADDRESS]")
          .replace(randomAccount, "[REDACTED ACCOUNT ID]");
        detected.push(`Customer Name: ${randomName}`);
        detected.push(`Full Address: ${randomAddress}`);
        detected.push(`Account Code: ${randomAccount}`);
      }

      setScannedBill({
        fileName,
        rawText: raw,
        scrubbedText: scrubbed,
        detectedPii: securityScrub ? detected : [],
        extractedData: { month: randomMonth, electricityKwh: kwh, electricityCost: cost, gasTherm: therms, gasCost: gasC }
      });
      setIsScanning(false);
    }, 1500);
  };

  const importScannedData = () => {
    if (!scannedBill) return;
    const { month, electricityKwh, electricityCost, gasTherm, gasCost } = scannedBill.extractedData;
    onAddBill({
      id: "bill_" + Date.now(),
      month,
      electricityKwh,
      electricityCost,
      gasTherm,
      gasCost
    });
    setScannedBill(null);
  };

  return (
    <div className="space-y-6" id="utility-bills-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Utility Bill Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Input electricity and natural gas bills to establish your baseline footprint and savings model.
          </p>
        </div>

        {/* Security / Privacy Scrubbing Controls */}
        <div className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
          {securityScrub ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
          ) : (
            <Shield className="w-5 h-5 text-amber-500" />
          )}
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              Privacy Scrubbing Filter
              <span className="bg-emerald-600 text-[10px] text-white px-1.5 py-0.2 rounded-full">Secure</span>
            </div>
            <button
              onClick={() => setSecurityScrub(!securityScrub)}
              className="text-[11px] text-emerald-700 underline font-medium hover:text-emerald-800 cursor-pointer block"
            >
              {securityScrub ? "Active (Masks names, accounts & addresses)" : "Disabled (Plaintext OCR ingestion)"}
            </button>
          </div>
        </div>
      </div>

      {/* PII Prevention Warning Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900" id="pii-warning-callout">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            Privacy Directive: Discourage Posting Sensitive Information (PII)
          </h4>
          <p className="text-[11px] leading-relaxed text-amber-700">
            For maximum privacy, we strongly advise households <strong>never</strong> to post or upload files with
            sensitive Personal Identifiable Information (PII) like residential street addresses, personal banking numbers, 
            or account logins. Always check that utility records are cleansed prior to entry, or keep the 
            <strong> Privacy Scrubbing Filter</strong> active to automatically redact mock billing records.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Methods column */}
        <div className="lg:col-span-5 space-y-6">
          {/* OCR Document Scanner Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 opacity-60"></div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Upload Utility Statement (OCR Simulator)
            </h3>
            
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-lg p-4 transition-colors text-center relative group">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="utility-file-uploader"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-emerald-500 group-hover:scale-105 transition-transform" />
              <p className="text-xs font-medium text-slate-700">Drag statement PDF/image here or click</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG (Simulated processing)</p>
            </div>

            {isScanning && (
              <div className="mt-4 p-4 bg-emerald-50/50 rounded-lg flex items-center justify-center gap-3 border border-emerald-100">
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-emerald-800 font-medium">
                  {securityScrub ? "Redacting sensitive PII & parsing metrics..." : "Performing secure OCR extraction..."}
                </div>
              </div>
            )}

            {scannedBill && (
              <div className="mt-4 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">
                    📄 {scannedBill.fileName}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Digitized
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Parsed Month: <strong>{scannedBill.extractedData.month}</strong></span>
                    <span>Electric: <strong>{scannedBill.extractedData.electricityKwh} kWh</strong></span>
                  </div>

                  {securityScrub && scannedBill.detectedPii.length > 0 && (
                    <div className="bg-emerald-50 p-2 rounded text-[11px] text-emerald-900 border border-emerald-100 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-emerald-800">
                        <EyeOff className="w-3.5 h-3.5" /> Automatically Redacted PII:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 font-mono text-[10px]">
                        {scannedBill.detectedPii.map((pii, idx) => (
                           <li key={idx}>{pii}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-white p-2 rounded border border-slate-200 text-[10px] font-mono text-slate-600 max-h-24 overflow-y-auto whitespace-pre-line leading-relaxed">
                    {securityScrub ? scannedBill.scrubbedText : scannedBill.rawText}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={importScannedData}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all cursor-pointer shadow-xs"
                      id="import-scanned-bill-btn"
                    >
                      Verify & Log Bill
                    </button>
                    <button
                      onClick={() => setScannedBill(null)}
                      className="px-3 py-1.5 bg-slate-250 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold transition-all cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual input form */}
          <form onSubmit={handleManualSubmit} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Add Utility Bill Manually</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Billing Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 bg-white"
                  id="bill-month-input"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location Region</label>
                <input
                  type="text"
                  placeholder="e.g. CA (Grid Substation)"
                  disabled
                  value="CA (Pacific Grid)"
                  className="w-full text-xs p-2 border border-slate-200 rounded bg-slate-50 text-slate-500"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3">
              <div className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                <span>⚡ Electricity Usage Details</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Electricity (kWh)</label>
                  <input
                    type="number"
                    value={electricityKwh}
                    onChange={(e) => setElectricityKwh(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    id="bill-electric-kwh"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Electricity Cost ($)</label>
                  <input
                    type="number"
                    value={electricityCost}
                    onChange={(e) => setElectricityCost(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                    id="bill-electric-cost"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 space-y-3">
              <div className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                <span>🔥 Gas Fuel Usage Details</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Gas (Therms)</label>
                  <input
                    type="number"
                    value={gasTherm}
                    onChange={(e) => setGasTherm(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                    id="bill-gas-therm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Gas Cost ($)</label>
                  <input
                    type="number"
                    value={gasCost}
                    onChange={(e) => setGasCost(Number(e.target.value))}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                    id="bill-gas-cost"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              id="add-bill-manual-btn"
            >
              <Plus className="w-4 h-4" /> Log Bill Record
            </button>
          </form>
        </div>

        {/* Existing logs display */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Logged Utility Statement History</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">
                {bills.length} Months Total
              </span>
            </div>

            {bills.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600">No utility statement logs present</p>
                <p className="text-[10px] text-slate-400 mt-1">Upload a statement or add manual records to seed charts</p>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-2.5 font-bold">Billing Period</th>
                      <th className="py-2.5 font-bold text-right">Power Draw (kWh)</th>
                      <th className="py-2.5 font-bold text-right">Power cost</th>
                      <th className="py-2.5 font-bold text-right">Gas Draw (Th)</th>
                      <th className="py-2.5 font-bold text-right">Gas cost</th>
                      <th className="py-2.5 font-bold text-right">Total Cost</th>
                      <th className="py-2.5 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {bills.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-semibold text-slate-900">{b.month} 2026</td>
                        <td className="py-3 text-right font-mono">{b.electricityKwh}</td>
                        <td className="py-3 text-right text-blue-600 font-semibold font-mono">${b.electricityCost}</td>
                        <td className="py-3 text-right font-mono">{b.gasTherm ?? "-"}</td>
                        <td className="py-3 text-right text-amber-600 font-semibold font-mono">
                          {b.gasCost ? `$${b.gasCost}` : "-"}
                        </td>
                        <td className="py-3 text-right text-slate-900 font-bold font-mono">
                          ${b.electricityCost + (b.gasCost || 0)}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => onDeleteBill(b.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 cursor-pointer transition-colors"
                            title="Delete log"
                            id={`delete-bill-${b.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
