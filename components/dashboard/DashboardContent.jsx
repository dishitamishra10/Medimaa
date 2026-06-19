"use client";

import { useAuth } from "../../hooks/useAuth";
import { db } from "@/lib/firestore";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import LoadingState from "../loading/LoadingState";
import AccessRestricted from "../restricted-access/AccessRestricted";

import RecentMedicines from "./RecentMedicines";
import DashboardStats from "./DashboardStats";
import SharedAccessCard from "./SharedAccessCard";
import TodaySchedule from "./TodaySchedule";


export default function DashboardContent() {
  const { user, uid, isLoading } = useAuth();

  const [totalMedicines, setTotalMedicines] = useState(0);
  const [todaysDoses, setTodaysDoses] = useState(0);
  const [pendingDoses, setPendingDoses] = useState(0);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);

  // Bulletproof time tracking helper using Regex parsing patterns
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;

    const match = timeString.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3].toUpperCase();

    if (hours === 12) {
      hours = 0;
    }
    if (modifier === "PM") {
      hours += 12;
    }

    return hours * 60 + minutes;
  };

  const fetchDashboardData = useCallback(async () => {
    if (!uid) return;
    try {
      const medsRef = collection(db, "users", uid, "medicalRecords");
      const snapshot = await getDocs(medsRef);
      const medicinesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMedicines(medicinesData);
      setTotalMedicines(medicinesData.length);

      let totalDoseCount = 0;
      let pendingCount = 0;
      let schedule = [];

      // Calculate the explicit date key prefix string (DD-MM-YYYY)
      const todayDateStr = (() => {
        const t = new Date();
        return `${String(t.getDate()).padStart(2, '0')}-${String(t.getMonth() + 1).padStart(2, '0')}-${t.getFullYear()}`;
      })();

      medicinesData.forEach((medicine) => {
        medicine.doseTimes?.forEach((time) => {
          totalDoseCount++;

          // Generate the unique compound key to verify progress status securely
          const dateSpecificKey = `${todayDateStr}_${time}`;
          const taken = medicine.doseStatus && medicine.doseStatus[dateSpecificKey] === true;

          if (!taken) pendingCount++;

          schedule.push({
            docId: medicine.id,
            userId: uid,
            medicineName: medicine.medicineName,
            dosage: medicine.dosage || "Scheduled dose",
            time,
            taken, // Fully defined and safely accessible now!
          });
        });
      });

      // Sort array listings chronologically
      schedule.sort((a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time));

      setTodaysDoses(totalDoseCount);
      setPendingDoses(pendingCount);
      setTodaySchedule(schedule);

      // setSharedUsers([
      //   { id: 1, name: "Jaydev Mishra", relation: "Daughter", accessType: "Viewer" },
      //   { id: 2, name: "Dr Sharma", relation: "Doctor", accessType: "Medical Access" },
      // ]);



      const sharedUsersRef = collection(db, "users", uid, "sharedUsers");
      const shared_snapshot = await getDocs(sharedUsersRef);

      const users = shared_snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id, // friendUid
          email: data.friendEmail || "",
          name: data.friendName || "No Name Set",
          accessType: "Viewer",
        };
      });

      setSharedUsers(users);

    } catch (error) {
      console.error("Dashboard Data Synchronization Error:", error);
    }
  }, [uid]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12 ? "Good morning" :
      hour >= 12 && hour < 17 ? "Good afternoon" :
        hour >= 17 && hour < 21 ? "Good evening" :
          hour >= 21 && hour < 24 ? "Winding down" :
            "Still up";

  const firstName = user?.displayName?.split(" ")[0];
  const takenCount = todaysDoses - pendingDoses;
  const progressPct = todaysDoses > 0 ? Math.round((takenCount / todaysDoses) * 100) : 0;
  const circumference = 2 * Math.PI * 32;


  if(isLoading){
    return (
      <LoadingState message="Loading your dashboard…"/>
    )
  }

  if(!user){
    return (
      <AccessRestricted message="Please log in to access your dashboard and manage your clinical profile."/>
    )
  }

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* ── Welcome Banner ── */}
        <div className="mb-10 rounded-2xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/80 p-7 shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-6">

            {/* Left Column greet fields */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">
                Welcome back
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {greeting}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50/60 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {todaysDoses} doses today
                </span>

                {pendingDoses > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-rose-50/60 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {pendingDoses} pending
                  </span>
                ) : todaysDoses > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    All doses taken
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right Column metric analytics radial ring */}
            {todaysDoses > 0 && (
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative h-20 w-20">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      className="stroke-gray-100/80 dark:stroke-gray-800/80"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40" cy="40" r="32"
                      fill="none"
                      className="stroke-blue-500"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - takenCount / todaysDoses)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {progressPct}%
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">done</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Today's progress</p>
              </div>
            )}

          </div>
        </div>

        {/* ── Stats Panels Layout ── */}
        <DashboardStats
          totalMedicines={totalMedicines}
          todaysDoses={todaysDoses}
          pendingDoses={pendingDoses}
        />

        {/* ── Today's Schedule Timeline Layout ── */}
        <div className="mt-6">
          <TodaySchedule
            schedule={todaySchedule}
            setTodaySchedule={setTodaySchedule}
            pendingDoses={pendingDoses}
            setPendingDoses={setPendingDoses}
            convertTimeToMinutes={convertTimeToMinutes}
          />
        </div>

        {/* ── Shared Access Identity Blocks ── */}
        <div className="mt-6">
          <SharedAccessCard users={sharedUsers} />
        </div>

        {/* ── Medicine Profiles Registry Blocks ── */}
        <div className="mt-6">
          <RecentMedicines
            medicines={medicines}
            uid={uid}
            onRefreshData={fetchDashboardData}
          />
        </div>

        {/* ── Security Trust Footnote Area ── */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <svg className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Your health records are encrypted and protected securely.
          </p>
        </div>

      </div>
    </div>
  );
}