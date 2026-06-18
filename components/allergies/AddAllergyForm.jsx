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

const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1";

const SEVERITY_OPTIONS = ["Mild", "Moderate", "Severe"];

const severityConfig = {
  Mild: {
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Moderate: {
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-400",
  },
  Severe: {
    badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30",
    dot: "bg-rose-400",
  },
};

export default function AddAllergyForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    allergyName: "",
    category: "",
    severity: "Mild",
    diagnosedDate: "",
    emergencyNote: "",
    symptoms: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      symptoms: formData.symptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setFormData({
      allergyName: "",
      category: "",
      severity: "Mild",
      diagnosedDate: "",
      emergencyNote: "",
      symptoms: "",
    });
  };

  const symptomTags = formData.symptoms
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { badge, dot } = severityConfig[formData.severity];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Add new allergy
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Track your allergy profile and symptoms
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Allergy Name + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Allergy name</label>
            <input
              type="text"
              name="allergyName"
              value={formData.allergyName}
              onChange={handleChange}
              placeholder="e.g. Penicillin"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Drug, Food"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Severity + Diagnosed Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Severity level</label>
              {/* Inline badge indicator to save vertical space */}
              <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${badge}`}>
                <span className={`w-1 h-1 rounded-full ${dot}`} />
                {formData.severity}
              </span>
            </div>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Diagnosed date</label>
            <input
              type="text"
              name="diagnosedDate"
              value={formData.diagnosedDate}
              onChange={handleChange}
              placeholder="e.g. Jan 2024"
              className={inputClass}
            />
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className={labelClass}>
            Symptoms{" "}
            <span className="normal-case font-normal text-gray-400 dark:text-gray-600">
              — comma-separated
            </span>
          </label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="e.g. Rash, Swelling, Itching"
            className={inputClass}
          />
          {symptomTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5 max-h-[48px] overflow-y-auto">
              {symptomTags.map((s, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Instructions */}
        <div>
          <label className={labelClass}>Emergency instructions</label>
          <textarea
            name="emergencyNote"
            value={formData.emergencyNote}
            onChange={handleChange}
            placeholder="e.g. Use EpiPen immediately, call 112"
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Reminder toggle */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            id="reminder"
            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 accent-blue-500"
          />
          <label
            htmlFor="reminder"
            className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none"
          >
            Enable allergy reminders
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition shadow-sm"
          >
            Save allergy profile
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition"
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}