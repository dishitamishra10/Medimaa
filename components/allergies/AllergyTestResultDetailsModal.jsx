"use client";

import { useState, useEffect } from "react";

const inputClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  px-3 py-2.5 text-sm
  text-gray-900 dark:text-gray-100
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition
`.trim();

const labelClass = "block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5";

export default function AllergyTestResultDetailsModal({ result, onClose, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ testType: "", allergen: "", resultValue: "", testDate: "", interpretation: "" });

  useEffect(() => {
    if (result) {
      setFormData({
        testType: result.testType || "Skin Prick Test (SPT)",
        allergen: result.allergen || "",
        resultValue: result.resultValue || "",
        testDate: result.testDate || "",
        interpretation: result.interpretation || "Positive",
      });
      setIsEditing(false);
    }
  }, [result]);

  if (!result) return null;

  const handleSave = () => {
    onUpdate(result.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        
        {!isEditing ? (
          <>
            {/* View Mode Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400">{result.testType}</span>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{result.allergen} Result Details</h2>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                result.interpretation === "Positive" 
                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200" 
                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
              }`}>
                {result.interpretation}
              </span>
            </div>

            {/* View Mode Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className={labelClass}>Clinical Measurement / Value</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{result.resultValue || "—"}</p>
              </div>
              <div>
                <p className={labelClass}>Date of Clinical Diagnostic Test</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{result.testDate || "—"}</p>
              </div>
            </div>

            {/* View Mode Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-2.5 text-sm">Edit Record</button>
              <button onClick={() => onDelete(result.id)} className="px-5 border border-rose-300 text-rose-500 font-medium rounded-xl text-sm hover:bg-rose-50">Delete</button>
              <button onClick={onClose} className="px-4 border rounded-xl text-sm">Close</button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit Test Result Record</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Edit Mode Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Test Type</label>
                  <select value={formData.testType} onChange={(e) => setFormData({ ...formData, testType: e.target.value })} className={inputClass}>
                    <option>Skin Prick Test (SPT)</option>
                    <option>IgE Blood Test</option>
                    <option>Patch Test</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Allergen</label>
                  <input value={formData.allergen} onChange={(e) => setFormData({ ...formData, allergen: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Result Value</label>
                  <input value={formData.resultValue} onChange={(e) => setFormData({ ...formData, resultValue: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Test Date</label>
                  <input type="date" value={formData.testDate} onChange={(e) => setFormData({ ...formData, testDate: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Clinical Interpretation</label>
                <select value={formData.interpretation} onChange={(e) => setFormData({ ...formData, interpretation: e.target.value })} className={inputClass}>
                  <option>Positive</option>
                  <option>Negative</option>
                  <option>Equivocal / Borderline</option>
                </select>
              </div>
            </div>

            {/* Edit Mode Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-2.5 text-sm">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="px-5 border rounded-xl text-sm">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}