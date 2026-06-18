"use client";

import { useState } from "react";

const inputClass = `
  w-full rounded-lg border border-gray-200 dark:border-gray-700
  bg-gray-50 dark:bg-gray-800
  px-3 py-2.5 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
  focus:border-transparent transition
`.trim();

const labelClass = "block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5";

export default function AddReactionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    allergen: "",
    severity: "Mild",
    reactionDate: "",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      symptoms: formData.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setFormData({ allergen: "", severity: "Mild", reactionDate: "", symptoms: "", treatment: "", notes: "" });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Log Allergy Reaction</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Track reactive flareups and historical treatments</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Trigger Allergen</label>
          <input name="allergen" placeholder="e.g. Peanuts, Ibuprofen" value={formData.allergen} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Severity</label>
            <select name="severity" value={formData.severity} onChange={handleChange} className={inputClass}>
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Reaction Date</label>
            <input type="date" name="reactionDate" value={formData.reactionDate} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Symptoms <span className="normal-case text-gray-400">— comma separated</span></label>
          <input name="symptoms" placeholder="e.g. Rash, Wheezing" value={formData.symptoms} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Administered Treatment</label>
          <input name="treatment" placeholder="e.g. EpiPen, 25mg Benadryl" value={formData.treatment} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea name="notes" placeholder="Additional reaction notes..." rows={3} value={formData.notes} onChange={handleChange} className={`${inputClass} resize-none`} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-3 text-sm hover:bg-blue-600 transition">
            Save Reaction
          </button>
          <button type="button" onClick={onCancel} className="px-6 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}