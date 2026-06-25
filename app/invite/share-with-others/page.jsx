"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functionsInstance } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import LoadingState from "@/components/loading/LoadingState";
import AccessRestricted from "@/components/restricted-access/AccessRestricted";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { user, isLoading } = useAuth();

  const handleSendInvite = async () => {
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (user?.email == email) {
      setMessage("You cannot send an invite to yourself.");
      return;
    }

    try {
      setMessage("Sending...");

      // Pass your configured functions instance to the callable wrapper
      const sendFriendInvite = httpsCallable(
        functionsInstance,
        "sendFriendInvite"
      );

      const result = await sendFriendInvite({
        friendEmail: email,
      });

      console.log("Response data:", result.data);
      setMessage(result.data.message);
    } catch (error) {
      console.error("Function error detailed:", error);

      // If the user isn't logged in, error.message will say "You must be logged in"
      setMessage(error.message || "An unexpected error occurred.");
    }
  };

  if (isLoading) {
    return (
      <LoadingState message="Loading share options…" />
    )
  }

  if (!user) {
    return (
      <AccessRestricted message="Please log in to share your records with a friend." />
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl px-8 py-10 w-full max-w-sm mx-auto shadow-sm dark:shadow-black/30">

        <p className="font-sans text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-3">
          Friends
        </p>
        <h1
          className="text-[28px] font-normal text-gray-900 dark:text-gray-100 mb-2 leading-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Invite a Friend
        </h1>
        <p className="font-sans text-[13px] text-gray-500 dark:text-gray-400 mb-8">
          Enter their email address to send an invite
        </p>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="font-sans text-[13px] font-medium text-gray-900 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-sans text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3.5 py-2.5 outline-none w-full transition-all duration-150 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-gray-400 dark:focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] dark:focus:shadow-[0_0_0_3px_rgba(45,168,168,0.15)]"
          />
        </div>

        <button
          onClick={handleSendInvite}
          className="font-sans text-sm font-medium text-white bg-gray-900 dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-600 dark:hover:from-teal-500 dark:hover:to-blue-500 border-none rounded-lg py-3 w-full cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-[0.98]"
        >
          Send Invite
        </button>

        {message && (
          <p className="font-sans text-[13px] text-gray-500 dark:text-gray-400 text-center mt-6">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}