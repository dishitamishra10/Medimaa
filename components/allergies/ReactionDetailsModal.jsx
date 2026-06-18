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

const severityConfig = {
  Severe: { badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30", dot: "bg-rose-400" },
  Moderate: { badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30", dot: "bg-amber-400" },
  Mild: { badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30", dot: "bg-emerald-400" },
};

export default function ReactionDetailsModal({ reaction, onClose, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ allergen: "", severity: "Mild", reactionDate: "", symptoms: "", treatment: "", notes: "" });

  useEffect(() => {
    if (reaction) {
      setFormData({
        allergen: reaction.allergen || "",
        severity: reaction.severity || "Mild",
        reactionDate: reaction.reactionDate || "",
        symptoms: reaction.symptoms?.join(", ") || "",
        treatment: reaction.treatment || "",
        notes: reaction.notes || "",
      });
      setIsEditing(false);
    }
  }, [reaction]);

  if (!reaction) return null;

  const handleSave = () => {
    onUpdate(reaction.id, {
      ...formData,
      symptoms: formData.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const config = severityConfig[reaction.severity] || severityConfig.Mild;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        
        {!isEditing ? (
          <>
            {/* View Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{reaction.allergen}</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Reaction Event Logs</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${config.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                {reaction.severity}
              </span>
            </div>

            {/* View Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className={labelClass}>Date of Incident</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{reaction.reactionDate || "—"}</p>
              </div>
              <div>
                <p className={labelClass}>Symptoms Displayed</p>
                <div className="flex flex-wrap gap-1.5">
                  {reaction.symptoms?.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className={labelClass}>Treatment Applied</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{reaction.treatment || "No tracking records."}</p>
              </div>
              {reaction.notes && (
                <div>
                  <p className={labelClass}>Notes</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border text-gray-600 dark:text-gray-400">{reaction.notes}</p>
                </div>
              )}
            </div>

            {/* View Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-2.5 text-sm">Edit Log</button>
              <button onClick={() => onDelete(reaction.id)} className="px-5 border border-rose-300 text-rose-500 font-medium rounded-xl text-sm hover:bg-rose-50">Delete</button>
              <button onClick={onClose} className="px-4 border rounded-xl text-sm">Close</button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode Panel */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit Reaction Log</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Allergen</label>
                <input value={formData.allergen} onChange={(e) => setFormData({ ...formData, allergen: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Severity</label>
                  <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} className={inputClass}>
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" value={formData.reactionDate} onChange={(e) => setFormData({ ...formData, reactionDate: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Symptoms</label>
                <input value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Treatment</label>
                <input value={formData.treatment} onChange={(e) => setFormData({ ...formData, treatment: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea value={formData.notes} rows={3} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`${inputClass} resize-none`} />
              </div>
            </div>

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