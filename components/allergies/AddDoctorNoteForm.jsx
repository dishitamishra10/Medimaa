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

export default function AddDoctorNoteForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    doctorName: "",
    noteType: "Rescue Protocol",
    note: "",
    date: new Date().toISOString().split('T')[0] // Default to current date
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ doctorName: "", noteType: "Rescue Protocol", note: "", date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Doctor's Note</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Log explicit clinical guidance and rescue protocols</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Physician Name</label>
            <input name="doctorName" placeholder="e.g. Dr. Sharma" value={formData.doctorName} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Note Type</label>
            <select name="noteType" value={formData.noteType} onChange={handleChange} className={inputClass}>
              <option>Rescue Protocol</option>
              <option>Cross-Reactivity Warning</option>
              <option>Dietary / Lifestyle Plan</option>
              <option>Immunotherapy Note</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Log Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className={labelClass}>Medical Recommendation</label>
          <textarea name="note" placeholder="Type specific instructions given by the specialist..." rows={3} value={formData.note} onChange={handleChange} className={`${inputClass} resize-none`} required />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-blue-500 text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-blue-600 transition">
            Save Note
          </button>
          <button type="button" onClick={onCancel} className="px-5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}