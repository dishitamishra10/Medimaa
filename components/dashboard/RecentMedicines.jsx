"use client";

import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

export default function RecentMedicines({ medicines = [], uid, onRefreshData }) {
  // Modal toggle triggers
  const [editingMed, setEditingMed] = useState(null);
  const [deletingMedId, setDeletingMedId] = useState(null);

  // Form State Hooks (1:1 with creation fields)
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editFrequency, setEditFrequency] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editTimes, setEditTimes] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Open edit modal and load current document fields
  const startEdit = (med) => {
    setEditingMed(med);
    setEditName(med.medicineName || "");
    setEditDosage(med.dosage || "");
    setEditFrequency(med.frequency || "Once a day");
    setEditDuration(med.duration || "30");
    setEditStartDate(med.startDate || "");
    setEditTimes(med.doseTimes ? med.doseTimes.join(", ") : "");
    setEditNotes(med.notes || "");
  };

  // Perform document update execution
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "users", uid, "medicalRecords", editingMed.id);
      const timesArray = editTimes.split(",").map((t) => t.trim()).filter((t) => t);

      await updateDoc(docRef, {
        medicineName: editName,
        dosage: editDosage,
        frequency: editFrequency,
        duration: editDuration,
        startDate: editStartDate,
        doseTimes: timesArray,
        notes: editNotes,
      });

      setEditingMed(null);
      if (onRefreshData) onRefreshData();
    } catch (error) {
      console.error("Error updating medicine profile:", error);
    }
  };

  // Safe delete document method execution
  const confirmDeleteExecution = async () => {
    if (!deletingMedId) return;
    try {
      const docRef = doc(db, "users", uid, "medicalRecords", deletingMedId);
      await deleteDoc(docRef);
      setDeletingMedId(null);
      if (onRefreshData) onRefreshData();
    } catch (error) {
      console.error("Error deleting medicine profile:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Medicine details
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Active management profiles ({medicines.length} total)
          </p>
        </div>
        <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
          <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />

      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            No medicines added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {medicines.map((med) => (
            <div
              key={med.id}
              className="group flex flex-col justify-between rounded-xl p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {med.medicineName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    Dosage: <span className="font-medium text-gray-700 dark:text-gray-300">{med.dosage || "Not set"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(med)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer"
                    title="Edit Medicine"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingMedId(med.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Medicine"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {med.doseTimes && med.doseTimes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-200/40 dark:border-gray-700/40">
                  {med.doseTimes.map((time, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-200/60 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {time}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── 1:1 REPLICATED MEDICAL FORM MODAL ── */}
      {editingMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Edit medication <span className="text-gray-400 font-normal">— {editingMed.patientName || "Profile"}</span>
              </h3>
              <button onClick={() => setEditingMed(null)} className="text-gray-400 hover:text-gray-200 cursor-pointer text-sm">✕</button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Medicine name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={editDosage}
                    onChange={(e) => setEditDosage(e.target.value)}
                    placeholder="e.g. 1 tablet"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={editFrequency}
                    onChange={(e) => setEditFrequency(e.target.value)}
                    placeholder="Twice a day"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="90"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Start date</label>
                  <input
                    type="text"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    placeholder="DD-MM-YYYY"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Dose times</label>
                  <input
                    type="text"
                    value={editTimes}
                    onChange={(e) => setEditTimes(e.target.value)}
                    placeholder="8:00 AM, 8:00 PM"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="After meals, with water"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingMed(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOM RE-DESIGNED DELETE WARNING DIALOG ── */}
      {deletingMedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-900/30 max-w-sm w-full p-6 shadow-2xl transform transition-all scale-100 duration-150">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 dark:text-rose-400 mb-4 border border-rose-100 dark:border-rose-500/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Delete treatment record?
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 px-2">
                This action is permanent. Removing this medicine clears all metrics, logs, and checking historical metrics from your active today view.
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeletingMedId(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteExecution}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}