"use client";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

export default function TodaySchedule({ schedule = [], setTodaySchedule, pendingDoses, setPendingDoses }) {

  // Helper function to generate a strict, standardized string key for today's date (DD-MM-YYYY)
  const getTodayDateString = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleToggle = async (item) => {
    try {
      const todayStr = getTodayDateString();
      const docRef = doc(db, "users", item.userId, "medicalRecords", item.docId);
      
      // FIX: Instead of checking just the raw time, we save progress locked to the unique calendar date string
      const dateSpecificKey = `doseStatus.${todayStr}_${item.time}`;
      
      await updateDoc(docRef, { [dateSpecificKey]: !item.taken });
      
      setTodaySchedule((prev) =>
        prev.map((dose) =>
          dose.docId === item.docId && dose.time === item.time
            ? { ...dose, taken: !dose.taken } : dose
        )
      );
      setPendingDoses((prev) => (!item.taken ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Dose Update Error:", error);
    }
  };

  const takenCount = schedule.filter((d) => d.taken).length;
  const progress = schedule.length > 0 ? Math.round((takenCount / schedule.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Today's schedule
          </h2>
          {schedule.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {takenCount} of {schedule.length} doses completed
            </p>
          )}
        </div>
        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      {schedule.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400 dark:text-gray-500">Daily completion</span>
            <span className="font-semibold text-blue-500 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />

      {/* Empty state */}
      {schedule.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-3">
            <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            No medicines scheduled for today
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Add a medicine to see your schedule here
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {schedule.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between rounded-xl px-3.5 py-3
                border transition-all duration-150
                ${item.taken
                  ? "bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 opacity-60"
                  : "bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0">

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(item)}
                  className={`
                    h-5 w-5 rounded-full flex items-center justify-center shrink-0
                    border-2 transition-all duration-200 cursor-pointer
                    ${item.taken
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-transparent border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500"
                    }
                  `}
                >
                  {item.taken && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate transition-all ${item.taken ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-900 dark:text-gray-100"}`}>
                    {item.medicineName}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    {item.dosage ?? "Scheduled dose"}
                  </p>
                </div>
              </div>

              {/* Time badge */}
              <span className={`
                text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ml-3
                ${item.taken
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700"
                  : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                }
              `}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}