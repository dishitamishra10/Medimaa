"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/actions/actions";
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800/80 shadow-sm dark:shadow-black/30 p-8">

          {/* Header — hidden after submission */}
          {!submitted && (
            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Account Recovery
              </p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
                Forgot your password?
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Enter your email and we'll send you a link to reset it.
              </p>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Check your inbox</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                If that email exists, we've sent a reset link.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800/80 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-600 hover:opacity-90 dark:hover:from-teal-500 dark:hover:to-blue-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
              >
                Send reset link
              </button>

              <div className="text-center pt-1">
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Protected by Medimaa ·{" "}
          <Link href="/help-and-support" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
            Need help?
          </Link>
        </p>

      </div>
    </div>
  );
}