"use client";

import { useState } from "react";

const inputClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  px-3 py-2 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-transparent transition
`.trim();

const labelClass = "block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1";

export default function AddTestResultForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    testType: "Skin Prick Test (SPT)",
    allergen: "",
    resultValue: "",
    testDate: "",
    interpretation: "Positive",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ testType: "Skin Prick Test (SPT)", allergen: "", resultValue: "", testDate: "", interpretation: "Positive" });
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Test Result</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Log clinical test metrics, IgE scores, or patch developments</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Test Type</label>
            <select name="testType" value={formData.testType} onChange={handleChange} className={inputClass}>
              <option>Skin Prick Test (SPT)</option>
              <option>IgE Blood Test</option>
              <option>Patch Test</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Target Allergen</label>
            <input name="allergen" placeholder="e.g. Pollen, Milk" value={formData.allergen} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Result Value</label>
            <input name="resultValue" placeholder="e.g. 5mm wheal, 4.2 kU/L" value={formData.resultValue} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Test Date</label>
            <input type="date" name="testDate" value={formData.testDate} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Clinical Interpretation</label>
          <select name="interpretation" value={formData.interpretation} onChange={handleChange} className={inputClass}>
            <option>Positive</option>
            <option>Negative</option>
            <option>Equivocal / Borderline</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-blue-600 transition">
            Save Result
          </button>
          <button type="button" onClick={onCancel} className="px-5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}