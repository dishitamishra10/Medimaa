"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, Droplet, Clock, UserCheck, Mail, Phone, Lock, CloudLightning, CheckCircle2, AlertCircle, Loader2, MapPin, Heart, Globe } from 'lucide-react';

import { db } from '@/lib/firestore';           
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from "@/hooks/useAuth"; 
import AccessRestricted from '@/components/restricted-access/AccessRestricted';
import LoadingState from '@/components/loading/LoadingState';



const labelClass = "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5";
const inputClass = `
  w-full rounded-xl border border-gray-200 dark:border-gray-800/80
  bg-white dark:bg-[#111827]
  px-4 py-2.5 text-sm
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-teal-500/20
  focus:border-blue-500 dark:focus:border-teal-500 transition-all duration-200
`.trim();

const selectClass = `${inputClass} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat`;

const readOnlyClass = `
  w-full rounded-xl border border-gray-100 dark:border-gray-800/50
  bg-gray-50 dark:bg-[#111827]/40
  px-4 py-2.5 text-sm
  text-gray-400 dark:text-gray-500
  cursor-not-allowed focus:outline-none transition-all duration-200
`.trim();

export default function ProfilePage() {
  const { user, isLoading, uid } = useAuth(); 
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    role: "Patient", 
    bloodGroup: "",
    age: "", 
    dob: "", 
    sex: "", 
    maritalStatus: "",
    preferredLanguage: "",
    nationality: "",
    
    // Permanent Address Fields
    permStreet: "",
    permCity: "",
    permState: "",
    permPostalCode: "",

    // Current Address Fields
    currStreet: "",
    currCity: "",
    currState: "",
    currPostalCode: "",

    // Contact Fields
    phonePrimary: "",
    phoneSecondary: "",
    email: "", 
    photoURL: ""
  });

  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle");
  const debounceTimer = useRef(null);
  const isInitialMount = useRef(true);

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
    async function loadProfileData() {
      if (isLoading) return;
      
      if (user) {
        try {
          const docRef = doc(db, "users", uid, "profile", "details");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            let fName = data.firstName || "";
            let mName = data.middleName || "";
            let lName = data.lastName || "";
            if (!fName && data.name) {
              const parts = data.name.trim().split(/\s+/);
              if (parts.length === 1) fName = parts[0];
              else if (parts.length === 2) { fName = parts[0]; lName = parts[1]; }
              else if (parts.length > 2) { fName = parts[0]; mName = parts.slice(1, -1).join(" "); lName = parts[parts.length - 1]; }
            }

            setProfileData({
              ...data,
              firstName: fName,
              middleName: mName,
              lastName: lName,
              role: data.role || "Patient",
              email: user.email,
              age: calculateAge(data.dob),
              
              maritalStatus: data.maritalStatus || "",
              preferredLanguage: data.preferredLanguage || "",
              nationality: data.nationality || "",

              permStreet: data.permStreet || data.streetAddress || "",
              permCity: data.permCity || data.city || "",
              permState: data.permState || data.state || "",
              permPostalCode: data.permPostalCode || data.postalCode || "",
              
              currStreet: data.currStreet || "",
              currCity: data.currCity || "",
              currState: data.currState || "",
              currPostalCode: data.currPostalCode || "",

              phonePrimary: data.phonePrimary || data.phone || "", 
              phoneSecondary: data.phoneSecondary || "",
              photoURL: data.photoURL || user.photoURL || ""
            });

            if (data.sameAsPermanent) {
              setSameAsPermanent(true);
            }
          } else {
            let initialFirstName = "";
            let initialLastName = "";
            if (user.displayName) {
              const parts = user.displayName.trim().split(/\s+/);
              initialFirstName = parts[0] || "";
              if (parts.length > 1) initialLastName = parts[parts.length - 1] || "";
            }

            setProfileData((prev) => ({
              ...prev,
              firstName: initialFirstName,
              middleName: "",
              lastName: initialLastName,
              role: "Patient",
              email: user.email || "",
              phonePrimary: user.phoneNumber || "",
              photoURL: user.photoURL || ""
            }));
          }
        } catch (err) {
          console.error("Firestore Fetch Error:", err);
          setSyncStatus("error");
        }
      }
      setLoading(false);
    }

    loadProfileData();
  }, [user, isLoading, uid]);

  useEffect(() => {
    if (sameAsPermanent) {
      setProfileData(prev => ({
        ...prev,
        currStreet: prev.permStreet,
        currCity: prev.permCity,
        currState: prev.permState,
        currPostalCode: prev.permPostalCode
      }));
    }
  }, [sameAsPermanent, profileData.permStreet, profileData.permCity, profileData.permState, profileData.permPostalCode]);

  useEffect(() => {
    if (isInitialMount.current) {
      if (uid && !loading) isInitialMount.current = false;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const hasMissingFields = 
      !profileData.firstName?.trim() || 
      !profileData.lastName?.trim() ||
      !profileData.dob?.trim() || 
      !profileData.sex?.trim() || 
      !profileData.bloodGroup?.trim() ||
      !profileData.nationality?.trim() || 
      !profileData.phonePrimary?.trim();

    if (hasMissingFields) {
      setSyncStatus("incomplete");
      return; 
    }

    setSyncStatus("typing");
    debounceTimer.current = setTimeout(async () => {
      if (!uid) return;
      setSyncStatus("saving");
      
      const assembledName = [profileData.firstName, profileData.middleName, profileData.lastName]
        .filter(Boolean)
        .join(" ");

      try {
        const docRef = doc(db, "users", uid, "profile", "details");
        await setDoc(docRef, {
          name: assembledName,
          firstName: profileData.firstName.trim(),
          middleName: profileData.middleName.trim(),
          lastName: profileData.lastName.trim(),
          role: profileData.role || "Patient",
          dob: profileData.dob || "",
          sex: profileData.sex || "",
          bloodGroup: profileData.bloodGroup || "",
          
          maritalStatus: profileData.maritalStatus,
          preferredLanguage: profileData.preferredLanguage.trim(),
          nationality: profileData.nationality.trim(),

          sameAsPermanent,
          permStreet: profileData.permStreet.trim(),
          permCity: profileData.permCity.trim(),
          permState: profileData.permState.trim(),
          permPostalCode: profileData.permPostalCode.trim(),

          currStreet: profileData.currStreet.trim(),
          currCity: profileData.currCity.trim(),
          currState: profileData.currState.trim(),
          currPostalCode: profileData.currPostalCode.trim(),

          phonePrimary: profileData.phonePrimary.trim(),
          phoneSecondary: profileData.phoneSecondary.trim(),
          
          photoURL: profileData.photoURL || "",
          updatedAt: new Date().toISOString()
        }, { merge: true });
        setSyncStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSyncStatus("error");
      }
    }, 1000);
    return () => clearTimeout(debounceTimer.current);
  }, [profileData, uid, loading, sameAsPermanent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "dob") updatedData.age = calculateAge(value);
      return updatedData;
    });
  };

  const displayAssembledName = () => {
    const combined = [profileData.firstName, profileData.middleName, profileData.lastName]
      .filter(Boolean)
      .join(" ");
    return combined || "Anonymous Record";
  };

  const getInitials = () => {
    if (profileData.firstName) {
      const firstInitial = profileData.firstName[0] || "";
      const lastInitial = profileData.lastName ? profileData.lastName[0] : "";
      return (firstInitial + lastInitial).toUpperCase();
    }
    return "U";
  };

  if (isLoading) {
    return (
      <LoadingState message="Loading your profile…"/>
    );
  }

  if (!user) {
    return (
      <AccessRestricted message="Please log in to your account credentials layout frame to track system configurations or edit custom clinical profile fields securely." />
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-8 flex justify-center items-start transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-[#111827] rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-gray-950/20 border border-gray-200 dark:border-gray-800/80 transition-all duration-300">

        {/* Header Panels */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-wide">Patient profile</h1>
          </div>
          <div className="text-xs font-medium select-none transition-all duration-200">
            {syncStatus === "incomplete" && (
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 animate-pulse">
                <AlertCircle size={13} className="text-rose-500" /> Required fields missing
              </span>
            )}
            {syncStatus === "typing" && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <CloudLightning size={13} className="animate-pulse text-amber-500" /> Updating metrics...
              </span>
            )}
            {syncStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-teal-400 bg-blue-50 dark:bg-teal-950/30 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-teal-900/40">
                <Loader2 size={13} className="animate-spin text-blue-500 dark:text-teal-400" /> Syncing securely...
              </span>
            )}
            {(syncStatus === "saved" || syncStatus === "idle") && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40">
                <CheckCircle2 size={13} className="text-emerald-500" /> Saved
              </span>
            )}
            {syncStatus === "error" && (
              <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40">
                <AlertCircle size={13} className="text-red-500" /> Database Unreachable
              </span>
            )}
          </div>
        </div>

        {/* Hero Identity Avatar View */}
        <div className="flex items-center gap-4 mb-8 bg-gray-50 dark:bg-[#111827]/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800/60 shadow-inner">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-blue-100 dark:border-teal-900/30 shadow-sm relative">
              {profileData.photoURL ? (
                <img
                  src={profileData.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-50 dark:bg-teal-950/40 text-blue-600 dark:text-teal-400 font-bold text-xl flex items-center justify-center">
                  {getInitials()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight truncate">
              {displayAssembledName()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {profileData.role || "Patient"} · Blood Type:{" "}
              <span className="text-red-500 dark:text-red-400 font-semibold">
                {profileData.bloodGroup || "Pending assessment"}
              </span>
            </p>
          </div>
        </div>

        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest border-l-2 border-blue-500 dark:border-teal-400 pl-2 mb-4">
            Personal Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5 mb-5">
            <div className="space-y-1">
              <label className={labelClass}>
                <User size={13} className="text-blue-500 dark:text-teal-400" />
                <span>First name <span className="text-rose-500">*</span></span>
              </label>
              <input 
                type="text" 
                name="firstName" 
                value={profileData.firstName || ""} 
                onChange={handleInputChange} 
                placeholder="e.g. Akash" 
                className={`${inputClass} ${!profileData.firstName?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <User size={13} className="text-gray-400" />
                <span>Middle name</span>
              </label>
              <input 
                type="text" 
                name="middleName" 
                value={profileData.middleName || ""} 
                onChange={handleInputChange} 
                placeholder="Optional" 
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <User size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Last name <span className="text-rose-500">*</span></span>
              </label>
              <input 
                type="text" 
                name="lastName" 
                value={profileData.lastName || ""} 
                onChange={handleInputChange} 
                placeholder="e.g. Sharma" 
                className={`${inputClass} ${!profileData.lastName?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5 mb-5">
            <div className="space-y-1">
              <label className={labelClass}>
                <Calendar size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Date of birth <span className="text-rose-500">*</span></span>
              </label>
              <input 
                type="date" 
                name="dob" 
                value={profileData.dob || ""} 
                onChange={handleInputChange} 
                className={`${inputClass} ${!profileData.dob?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <UserCheck size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Sex <span className="text-rose-500">*</span></span>
              </label>
              <select 
                name="sex" 
                value={profileData.sex || ""} 
                onChange={handleInputChange} 
                className={`${selectClass} ${!profileData.sex?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <Droplet size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Blood group <span className="text-rose-500">*</span></span>
              </label>
              <select 
                name="bloodGroup" 
                value={profileData.bloodGroup || ""} 
                onChange={handleInputChange} 
                className={`${selectClass} ${!profileData.bloodGroup?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`}
                required
              >
                <option value="">Select blood classification</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5">
            <div className="space-y-1">
              <label className={labelClass}><Heart size={13} className="text-gray-400" /><span>Marital Status</span></label>
              <select name="maritalStatus" value={profileData.maritalStatus || ""} onChange={handleInputChange} className={selectClass}>
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <User size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Nationality <span className="text-rose-500">*</span></span>
              </label>
              <input 
                type="text" 
                name="nationality" 
                value={profileData.nationality || ""} 
                onChange={handleInputChange} 
                placeholder="e.g. Indian" 
                className={`${inputClass} ${!profileData.nationality?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`}
                required
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}><Globe size={13} className="text-gray-400" /><span>Preferred Language</span></label>
              <input type="text" name="preferredLanguage" value={profileData.preferredLanguage || ""} onChange={handleInputChange} placeholder="e.g. English, Hindi" className={inputClass} />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className={labelClass}><Clock size={13} className="text-gray-400" /><span>Calculated Age</span></label>
              <input type="text" name="age" value={profileData.age || ""} readOnly placeholder="Computed dynamically based on provided date of birth metrics" className={readOnlyClass} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/80 my-6"></div>

        {/* SECTION 2: ADDRESS DETAILS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest border-l-2 border-blue-500 dark:border-teal-400 pl-2 mb-4">
            Address Details
          </h3>
          
          {/* Permanent Address Grid Blocks */}
          <div className="space-y-4 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 mb-5">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Permanent Address</h4>
            <div className="space-y-1">
              <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>Street Address</span></label>
              <input type="text" name="permStreet" value={profileData.permStreet || ""} onChange={handleInputChange} placeholder="Apartment, unit, street lines..." className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>City / Town</span></label>
                <input type="text" name="permCity" value={profileData.permCity || ""} onChange={handleInputChange} placeholder="e.g. New Delhi" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>State / Province</span></label>
                <input type="text" name="permState" value={profileData.permState || ""} onChange={handleInputChange} placeholder="e.g. Delhi" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>Postal Code</span></label>
                <input type="text" name="permPostalCode" value={profileData.permPostalCode || ""} onChange={handleInputChange} placeholder="e.g. 110001" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Same Address Toggler Checkbox Control element */}
          <div className="flex items-center gap-2 mb-5 px-1 select-none">
            <input 
              type="checkbox" 
              id="sameAddressToggle" 
              checked={sameAsPermanent} 
              onChange={(e) => setSameAsPermanent(e.target.checked)} 
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-800 text-teal-500 focus:ring-teal-500/20 accent-teal-500 cursor-pointer"
            />
            <label htmlFor="sameAddressToggle" className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">
              Current address is the same as permanent address
            </label>
          </div>

          {/* Current Address Grid Blocks */}
          <div className={`space-y-4 bg-gray-50/50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 transition-all duration-200 ${sameAsPermanent ? 'opacity-60 pointer-events-none' : ''}`}>
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Current Address</h4>
            <div className="space-y-1">
              <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>Street Address</span></label>
              <input type="text" name="currStreet" value={profileData.currStreet || ""} onChange={handleInputChange} placeholder="Apartment, unit, street lines..." className={inputClass} disabled={sameAsPermanent} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>City / Town</span></label>
                <input type="text" name="currCity" value={profileData.currCity || ""} onChange={handleInputChange} placeholder="e.g. Mumbai" className={inputClass} disabled={sameAsPermanent} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>State / Province</span></label>
                <input type="text" name="currState" value={profileData.currState || ""} onChange={handleInputChange} placeholder="e.g. Maharashtra" className={inputClass} disabled={sameAsPermanent} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}><MapPin size={13} className="text-gray-400" /><span>Postal Code</span></label>
                <input type="text" name="currPostalCode" value={profileData.currPostalCode || ""} onChange={handleInputChange} placeholder="e.g. 400001" className={inputClass} disabled={sameAsPermanent} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/80 my-6"></div>

        {/* SECTION 3: CONTACT DETAILS */}
        <div>
          <h3 className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-widest border-l-2 border-blue-500 dark:border-teal-400 pl-2 mb-4">
            Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
            <div className="space-y-1">
              <label className={labelClass}>
                <Phone size={13} className="text-blue-500 dark:text-teal-400" />
                <span>Primary Line <span className="text-rose-500">*</span></span>
              </label>
              <input 
                type="text" 
                name="phonePrimary" 
                value={profileData.phonePrimary || ""} 
                onChange={handleInputChange} 
                placeholder="e.g. +91 XXXXX XXXXX" 
                className={`${inputClass} ${!profileData.phonePrimary?.trim() ? 'border-rose-300 dark:border-rose-900/40 focus:border-rose-500' : ''}`} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>
                <Phone size={13} className="text-gray-400" />
                <span>Secondary Line</span>
              </label>
              <input 
                type="text" 
                name="phoneSecondary" 
                value={profileData.phoneSecondary || ""} 
                onChange={handleInputChange} 
                placeholder="Alternative mobile number (Optional)" 
                className={inputClass} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={labelClass}><Mail size={13} className="text-gray-400" /><span>Email Id</span></label>
              </div>
              <input type="email" readOnly value={profileData.email || ""} className={readOnlyClass} />
            </div>
          </div>
        </div>

        {/* Security Warning Information Footnote Callout */}
        <div className="flex items-start gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111827]/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/60 mt-8 shadow-sm">
          <AlertCircle size={15} className="text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Core authentication layers (Email index logs) cannot be modified dynamically. The cloud infrastructure autosaves inputs instantly upon revision activity.
          </p>
        </div>
      </div>
    </div>
  );
}