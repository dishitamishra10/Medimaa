"use client";

import { useState, useEffect } from "react";

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

const severityConfig = {
  Severe: {
    badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30",
    symptomTag: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
    dot: "bg-rose-400",
  },
  Moderate: {
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
    symptomTag: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
    dot: "bg-amber-400",
  },
  Mild: {
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
    symptomTag: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

export default function AllergyDetailsModal({ allergy, onClose, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    allergyName: "",
    category: "",
    severity: "Mild",
    diagnosedDate: "",
    emergencyNote: "",
    symptoms: "",
  });

  useEffect(() => {
    if (allergy) {
      setFormData({
        allergyName: allergy.allergyName || "",
        category: allergy.category || "",
        severity: allergy.severity || "Mild",
        diagnosedDate: allergy.diagnosedDate || "",
        emergencyNote: allergy.emergencyNote || "",
        symptoms: allergy.symptoms?.join(", ") || "",
      });
      setIsEditing(false);
    }
  }, [allergy]);

  if (!allergy) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(allergy.id, {
      ...formData,
      symptoms: formData.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const config = severityConfig[allergy.severity] ?? severityConfig.Mild;
  const editConfig = severityConfig[formData.severity] ?? severityConfig.Mild;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ── View mode ── */}
        {!isEditing ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {allergy.allergyName}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {allergy.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${config.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {allergy.severity}
                  </span>
                  <button
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Symptoms */}
              <div>
                <p className={labelClass}>Symptoms</p>
                {allergy.symptoms?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {allergy.symptoms.map((symptom, i) => (
                      <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-md ${config.symptomTag}`}>
                        {symptom}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">No symptoms recorded</p>
                )}
              </div>

              {/* Diagnosed */}
              {allergy.diagnosedDate && (
                <div className="flex items-center justify-between py-3 px-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <p className={`${labelClass} mb-0`}>Diagnosed</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {allergy.diagnosedDate}
                  </p>
                </div>
              )}

              {/* Emergency note */}
              {allergy.emergencyNote && (
                <div className="rounded-xl px-3.5 py-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                  <p className={`${labelClass} text-rose-500 dark:text-rose-400 mb-1.5`}>Emergency note</p>
                  <p className="text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
                    {allergy.emergencyNote}
                  </p>
                </div>
              )}

            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition cursor-pointer"
              >
                Edit allergy
              </button>
              <button
                onClick={() => onDelete(allergy.id)}
                className="px-5 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium text-sm transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Edit allergy
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {allergy.allergyName}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Edit Body */}
            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Allergy name</label>
                  <input
                    name="allergyName"
                    value={formData.allergyName}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Drug, Food"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Severity level</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Diagnosed date</label>
                  <input
                    name="diagnosedDate"
                    value={formData.diagnosedDate}
                    onChange={handleChange}
                    placeholder="e.g. Jan 2024"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Severity preview */}
              <div className="flex items-center gap-2 py-0.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">Severity:</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${editConfig.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${editConfig.dot}`} />
                  {formData.severity}
                </span>
              </div>

              <div>
                <label className={labelClass}>
                  Symptoms{" "}
                  <span className="normal-case font-normal text-gray-400 dark:text-gray-600">— comma-separated</span>
                </label>
                <input
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="e.g. Rash, Swelling, Itching"
                  className={inputClass}
                />
                {formData.symptoms && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.symptoms.split(",").map((s, i) =>
                      s.trim() ? (
                        <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-md ${editConfig.symptomTag}`}>
                          {s.trim()}
                        </span>
                      ) : null
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Emergency instructions</label>
                <textarea
                  name="emergencyNote"
                  value={formData.emergencyNote}
                  onChange={handleChange}
                  placeholder="e.g. Use EpiPen immediately, call 112"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

            </div>

            {/* Edit Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-sm transition cursor-pointer"
              >
                Save changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}