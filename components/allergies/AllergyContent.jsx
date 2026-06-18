"use client";

import { useEffect, useState } from "react";
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc, doc,
} from "firebase/firestore";

import { db } from "@/lib/firestore";
import { useAuth } from "../../hooks/useAuth";

import EmergencyAlert from "./EmergencyAlert";
import AllergyCard from "./AllergyCard";
import AddAllergyForm from "./AddAllergyForm";
import AddReactionForm from "./AddReactionForm";
import AddTestResultForm from "./AddTestResultForm";
import AddDoctorNoteForm from "./AddDoctorNoteForm";
import ReactionHistory from "./ReactionHistory";
import AllergyTestResults from "./AllergyTestResults";
import ReferenceInfo from "./ReferenceInfo";
import AllergyDetailsModal from "./AllergyDetailsModal";
import ReactionDetailsModal from "./ReactionDetailsModal";
import AllergyTestResultDetailsModal from "./AllergyTestResultDetailsModal";

export default function AllergyContent() {
  const { uid } = useAuth();

  // ── CORE APPLICATION DATA STATES ─────────────────────────
  const [allergies, setAllergies] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState([]);

  // ── OVERLAY INTERACTIVE MODAL STATES ──────────────────────
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [selectedTestResult, setSelectedTestResult] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, allergyId: null });

  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Suppress background scroll bars whenever overlay modals are opened
  useEffect(() => {
    if (
      showAllergyModal || showReactionModal || showTestModal || showNoteModal ||
      deleteConfirmation.isOpen || selectedAllergy || selectedReaction || selectedTestResult
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showAllergyModal, showReactionModal, showTestModal, showNoteModal, deleteConfirmation.isOpen, selectedAllergy, selectedReaction, selectedTestResult]);

  // ── GLOBAL DATABASE SYNC EXECUTION CYCLE ──────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const allergySnapshot = await getDocs(collection(db, "users", uid, "allergies"));
        setAllergies(allergySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const reactionSnapshot = await getDocs(collection(db, "users", uid, "reactions"));
        setReactions(reactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const testSnapshot = await getDocs(collection(db, "users", uid, "testResults"));
        setTestResults(testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const noteSnapshot = await getDocs(collection(db, "users", uid, "doctorNotes"));
        setDoctorNotes(noteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Database Extraction Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  /* ─────────────────────────────────────────────────────────
     ALLERGY OPERATIONS
     ───────────────────────────────────────────────────────── */
  const addAllergy = async (allergyData) => {
    if (!uid) return alert("Please log in!");
    try {
      const docRef = await addDoc(collection(db, "users", uid, "allergies"), allergyData);
      setAllergies((prev) => [...prev, { id: docRef.id, ...allergyData }]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllergy = (allergyId) => {
    if (!uid) return alert("Action unauthorized.");
    setDeleteConfirmation({ isOpen: true, allergyId });
  };

  const handleConfirmDelete = async () => {
    const { allergyId } = deleteConfirmation;
    if (!allergyId || !uid) return;
    try {
      await deleteDoc(doc(db, "users", uid, "allergies", allergyId));
      setAllergies((prev) => prev.filter((a) => a.id !== allergyId));
      setSelectedAllergy(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteConfirmation({ isOpen: false, allergyId: null });
    }
  };

  const updateAllergy = async (allergyId, updatedData) => {
    if (!uid) return alert("Action unauthorized.");
    try {
      await updateDoc(doc(db, "users", uid, "allergies", allergyId), updatedData);
      setAllergies((prev) => prev.map((a) => (a.id === allergyId ? { ...a, ...updatedData } : a)));
      setSelectedAllergy(null);
    } catch (error) {
      console.error(error);
    }
  };

  /* ─────────────────────────────────────────────────────────
     REACTION OPERATIONS
     ───────────────────────────────────────────────────────── */
  const addReaction = async (reactionData) => {
    if (!uid) return alert("Please log in!");
    try {
      const docRef = await addDoc(collection(db, "users", uid, "reactions"), reactionData);
      setReactions((prev) => [...prev, { id: docRef.id, ...reactionData }]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReaction = async (reactionId) => {
    if (!uid) return alert("Action unauthorized.");
    try {
      await deleteDoc(doc(db, "users", uid, "reactions", reactionId));
      setReactions((prev) => prev.filter((r) => r.id !== reactionId));
      setSelectedReaction(null);
    } catch (error) {
      console.error(error);
    }
  };

  const updateReaction = async (reactionId, updatedData) => {
    if (!uid) return alert("Action unauthorized.");
    try {
      await updateDoc(doc(db, "users", uid, "reactions", reactionId), updatedData);
      setReactions((prev) => prev.map((r) => (r.id === reactionId ? { ...r, ...updatedData } : r)));
      setSelectedReaction(null);
    } catch (error) {
      console.error(error);
    }
  };

  /* ─────────────────────────────────────────────────────────
     TEST RESULTS OPERATIONS
     ───────────────────────────────────────────────────────── */
  const addTestResult = async (testData) => {
    if (!uid) return alert("Please log in!");
    try {
      const docRef = await addDoc(collection(db, "users", uid, "testResults"), testData);
      setTestResults((prev) => [...prev, { id: docRef.id, ...testData }]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTestResult = async (testId) => {
    if (!uid) return alert("Action unauthorized.");
    try {
      await deleteDoc(doc(db, "users", uid, "testResults", testId));
      setTestResults((prev) => prev.filter((t) => t.id !== testId));
      setSelectedTestResult(null);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTestResult = async (testId, updatedData) => {
    if (!uid) return alert("Action unauthorized.");
    try {
      await updateDoc(doc(db, "users", uid, "testResults", testId), updatedData);
      setTestResults((prev) => prev.map((t) => (t.id === testId ? { ...t, ...updatedData } : t)));
      setSelectedTestResult(null);
    } catch (error) {
      console.error(error);
    }
  };

  /* ─────────────────────────────────────────────────────────
     DOCTOR NOTES OPERATIONS
     ───────────────────────────────────────────────────────── */
  const addDoctorNote = async (noteData) => {
    if (!uid) return alert("Please log in!");
    try {
      const docRef = await addDoc(collection(db, "users", uid, "doctorNotes"), noteData);
      setDoctorNotes((prev) => [...prev, { id: docRef.id, ...noteData }]);
    } catch (error) {
      console.error(error);
    }
  };

  // Safe categorical filters
  const filteredAllergies = allergies.filter((allergy) => {
    if (activeCategory === "All") return true;
    return allergy.category?.toLowerCase().trim() === activeCategory.toLowerCase().trim();
  });

  const categoriesList = ["All", ...new Set(allergies.map(a => a.category).filter(Boolean))];

  const severeCount = allergies.filter((a) => a.severity === "Severe").length;
  const moderateCount = allergies.filter((a) => a.severity === "Moderate").length;
  const mildCount = allergies.filter((a) => a.severity === "Mild").length;

  const statsConfig = [
    { label: "Severe", count: severeCount, pill: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" },
    { label: "Moderate", count: moderateCount, pill: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" },
    { label: "Mild", count: mildCount, pill: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400 dark:text-gray-500">Loading your allergy profile…</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-8 py-10">
        
        {/* Banner with Permanent Stats Track */}
        <div className="mb-10 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-7">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">Patient Allergy Tracker</p>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">My Allergies</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">Manage and monitor your allergy records and emergency instructions.</p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {allergies.length} total tracked
                </span>
                {severeCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {severeCount} severe
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 shrink-0">
              {statsConfig.map((s) => (
                <div key={s.label} className={`flex flex-col items-center justify-center rounded-xl px-5 py-3.5 min-w-[76px] ${s.pill}`}>
                  <p className="text-xl font-semibold">{s.count}</p>
                  <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EmergencyAlert allergies={allergies} />

        {/* Dynamic Category Selector Pills */}
        {allergies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Allergy Profile Grid workspace */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Allergy Profile</h2>
            </div>
            {/* The side button always remains stable right here */}
            <button 
              onClick={() => setShowAllergyModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm cursor-pointer transition shadow-sm"
            >
              + Add allergy
            </button>
          </div>

          {/* Grid Layout Cards / Clean Empty State Toggle */}
          {filteredAllergies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8">
              {/* Redundant duplicate button wrapper removed from this interior block */}
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {allergies.length === 0 ? "No allergies recorded yet" : `No results found under category "${activeCategory}"`}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {filteredAllergies.map((allergy) => (
                <div key={allergy.id} className="cursor-pointer" onClick={() => setSelectedAllergy(allergy)}>
                  <AllergyCard allergy={allergy} />
                </div>
              ))}
            </div>
          )}

          <ReactionHistory reactions={reactions} onAddClick={() => setShowReactionModal(true)} onReactionClick={(rx) => setSelectedReaction(rx)} />
          <AllergyTestResults testResults={testResults} onAddClick={() => setShowTestModal(true)} onResultClick={(res) => setSelectedTestResult(res)} />
          <ReferenceInfo allergies={allergies} doctorNotes={doctorNotes} onAddNoteClick={() => setShowNoteModal(true)} />
        </div>
      </div>

      {/* ── INTERNAL OVERLAY PORTALS ── */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-800 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Delete Profile Record?</h3>
            <p className="text-xs text-gray-400 mt-2">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={handleConfirmDelete} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 rounded-xl text-xs transition cursor-pointer">Confirm Delete</button>
              <button onClick={() => setDeleteConfirmation({ isOpen: false, allergyId: null })} className="px-4 border rounded-xl text-xs text-gray-500 transition cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAllergyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <button onClick={() => setShowAllergyModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition">✕</button>
            <AddAllergyForm onSubmit={async (d) => { await addAllergy(d); setShowAllergyModal(false); }} onCancel={() => setShowAllergyModal(false)} />
          </div>
        </div>
      )}

      {showReactionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <button onClick={() => setShowReactionModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition">✕</button>
            <AddReactionForm onSubmit={async (d) => { await addReaction(d); setShowReactionModal(false); }} onCancel={() => setShowReactionModal(false)} />
          </div>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <button onClick={() => setShowTestModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition">✕</button>
            <AddTestResultForm onSubmit={async (d) => { await addTestResult(d); setShowTestModal(false); }} onCancel={() => setShowTestModal(false)} />
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <button onClick={() => setShowNoteModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 transition">✕</button>
            <AddDoctorNoteForm onSubmit={async (n) => { await addDoctorNote(n); setShowNoteModal(false); }} onCancel={() => setShowNoteModal(false)} />
          </div>
        </div>
      )}

      {selectedAllergy && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AllergyDetailsModal allergy={selectedAllergy} onClose={() => setSelectedAllergy(null)} onDelete={deleteAllergy} onUpdate={updateAllergy} />
        </div>
      )}

      {selectedReaction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <ReactionDetailsModal reaction={selectedReaction} onClose={() => setSelectedReaction(null)} onDelete={deleteReaction} onUpdate={updateReaction} />
        </div>
      )}

      {selectedTestResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <AllergyTestResultDetailsModal result={selectedTestResult} onClose={() => setSelectedTestResult(null)} onDelete={deleteTestResult} onUpdate={updateTestResult} />
        </div>
      )}
    </>
  );
}