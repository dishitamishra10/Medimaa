"use client";

import { useEffect, useState, use } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore";

const COLORS = [
  { bg: "bg-[#E6F1FB]", fg: "text-[#0C447C]", dot: "bg-[#378ADD]" },
  { bg: "bg-[#FBEAF0]", fg: "text-[#72243E]", dot: "bg-[#D4537E]" },
  { bg: "bg-[#EAF3DE]", fg: "text-[#27500A]", dot: "bg-[#639922]" },
  { bg: "bg-[#FAEEDA]", fg: "text-[#633806]", dot: "bg-[#BA7517]" },
];

function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function getEndDate(startDate, duration) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + duration);
  return formatDate(d);
}

export default function PatientPage({ params }) {
  const { id } = use(params);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const ref = collection(db, "users", id, "medicalRecords");
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
      setLoading(false);
    };
    fetchRecords();
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2.5 p-16 text-sm text-gray-500 dark:text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        Loading records...
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (records.length === 0) {
    return (
      <div className="text-center py-16 px-8 text-gray-500 dark:text-gray-400">
        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-black/10 dark:border-white/10 flex items-center justify-center mx-auto mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <p className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
          No records found
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This patient has no medical records yet.
        </p>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#FBEAF0] dark:bg-[#FF6B9D]/15 flex items-center justify-center">
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className="text-[#993556] dark:text-[#FF6B9D]"
          >
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" />
            <path d="M12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
          </svg>
        </div>
        <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          Patient information
        </h1>
      </div>

      {/* Cards */}
      {records.map((r, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <div key={r.id}
            className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-xl mb-4 overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-gray-800/60 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${color.bg} ${color.fg}`}>
                  {getInitials(r.patientName)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {r.patientName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Started {formatDate(r.startDate)}
                  </p>
                </div>
              </div>
              {/* Active badge */}
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EAF3DE] text-[#27500A] dark:bg-[#27500A]/30 dark:text-[#86c34a]">
                Active
              </span>
            </div>

            {/* Medicine row */}
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-black/10 dark:border-white/10">
              <span className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {r.medicineName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-full px-2 py-0.5">
                {r.dosage}
              </span>
            </div>

            {/* Metrics grid */}
            {/* gap-px + dark bg creates the divider lines between cells */}
            <div className="grid grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
              {[
                { label: "Frequency", value: r.frequency },
                { label: "Duration", value: `${r.duration} days` },
                { label: "Ends", value: getEndDate(r.startDate, r.duration) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white dark:bg-gray-900 px-4 py-3">
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Dose times */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-black/10 dark:border-white/10">
              <span className="text-xs text-gray-500 dark:text-gray-400">Dose times</span>
              {r.doseTimes?.map((t) => (
                <span key={t}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 border border-black/20 dark:border-white/20 rounded-full px-2.5 py-0.5"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>

            {/* Notes */}
            {r.notes && (
              <div className="flex gap-1.5 items-start px-4 pt-2.5 pb-3.5 text-xs text-gray-500 dark:text-gray-400 border-t border-black/10 dark:border-white/10">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" className="shrink-0 mt-px">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                {r.notes}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}