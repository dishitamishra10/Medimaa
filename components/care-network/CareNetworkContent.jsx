"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { User, Pill, ShieldAlert, Loader2 } from "lucide-react";
import LoadingState from "../loading/LoadingState";

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

export default function CareNetworkContent() {
  const { uid, isLoggedIn, isLoading } = useAuth();
  const [sharedRecords, setSharedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 0 ? `${age} years` : "";
  };

  useEffect(() => {
    async function fetchSharedData() {
      if (!uid || (isLoggedIn !== undefined && !isLoggedIn)) {
        setLoading(false);
        return;
      }

      try {
        const sharedAccessSnapshot = await getDocs(collection(db, "users", uid, "receivedAccess"));
        
        const sharedProfilesData = await Promise.all(
          sharedAccessSnapshot.docs.map(async (accessDoc) => {
            const targetUserUid = accessDoc.id; 
            const accessData = accessDoc.data();

            // Fetch the shared Individual's Profile Details
            const profileRef = doc(db, "users", targetUserUid, "profile", "details");
            const profileSnap = await getDoc(profileRef);
            const profileData = profileSnap.exists() 
              ? profileSnap.data() 
              : { name: accessData.ownerName || "Shared Profile" };

            // Pull records from medicalRecords subcollection path
            const medicalRecordsSnapshot = await getDocs(
              collection(db, "users", targetUserUid, "medicalRecords")
            );
            const medicines = medicalRecordsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            // Fetch the shared Individual's Allergies subcollection documents
            const allergiesSnapshot = await getDocs(
              collection(db, "users", targetUserUid, "allergies")
            );
            const allergies = allergiesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            return {
              userId: targetUserUid,
              profile: {
                ...profileData,
                name: profileData.name || accessData.ownerName || "Anonymous Connection",
                computedAge: calculateAge(profileData.dob)
              },
              medicines,
              allergies,
              relationship: accessData.relationship
            };
          })
        );

        setSharedRecords(sharedProfilesData);
        if (sharedProfilesData.length > 0) {
          setSelectedProfile(sharedProfilesData[0]);
        }
      } catch (error) {
        console.error("Error aggregating data from care network paths:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSharedData();
  }, [uid, isLoggedIn]);

  if (isLoading) {
    return (
      <LoadingState message="Syncing care network files…"/>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Banner Component Panel */}
      <div className="mb-10 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2">External Health Logs</p>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Stay Connected</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">Monitor medications, active dosages, and profiles shared securely with you.</p>
      </div>

      {sharedRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
          <User className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Your care network is currently empty</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs leading-relaxed">
            When another individual grants account view permissions to your profile, their metrics will seamlessly map here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Panel: Shared Connections Selector Menu */}
          <div className="space-y-3 lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">Shared Connections</p>
            {sharedRecords.map((record) => (
              <div
                key={record.userId}
                onClick={() => setSelectedProfile(record)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-3 bg-white dark:bg-gray-900 ${
                  selectedProfile?.userId === record.userId
                    ? "border-blue-500 ring-2 ring-blue-500/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-gray-800 flex items-center justify-center text-blue-500 font-bold">
                  {record.profile.name ? record.profile.name[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{record.profile.name}</h4>
                  {record.relationship && (
                    <p className="text-xs text-gray-400 mt-0.5 capitalize font-medium">{record.relationship}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Selected User Detail Readout Displays */}
          {selectedProfile && (
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Meta Block — FIXED: Restored to dynamic 3-column split layout */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                  Clinical Overview: {selectedProfile.profile.name}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Age</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedProfile.profile.computedAge || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Blood Type</span>
                    <span className="font-semibold text-red-500">{selectedProfile.profile.bloodGroup || "—"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Gender</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedProfile.profile.sex || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Shared Medication Records */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="h-4 w-4 text-blue-500" />
                  <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Medications & Dosages</h3>
                </div>
                {selectedProfile.medicines.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                    No medications logged for this individual.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedProfile.medicines.map((med) => {
                      const medicalTiming = med.dosage || (Array.isArray(med.doseTimes) && med.doseTimes.join(", ")) || "";
                      
                      return (
                        <div key={med.id} className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {med.medicineName || med.name}
                            </h4>
                            {medicalTiming && (
                              <p className="text-xs text-gray-400 mt-1 font-medium">
                                <span className="text-gray-500">Scheduled Intake:</span> {medicalTiming}
                              </p>
                            )}
                          </div>
                          {med.frequency && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                              {med.frequency}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Shared Critical Allergy Flags */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Tracked Allergies</h3>
                </div>
                {selectedProfile.allergies.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                    No allergy metrics tracked for this individual.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.allergies.map((all) => {
                      const cfg = severityConfig[all.severity] || severityConfig.Mild;
                      return (
                        <span
                          key={all.id}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded ${cfg.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {all.allergyName || all.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}