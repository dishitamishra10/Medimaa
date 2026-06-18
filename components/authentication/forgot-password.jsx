"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/actions/actions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-black/30 p-8 w-full max-w-md border border-transparent dark:border-gray-700/60">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Forgot your password
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          Please enter the email address you'd like your password reset
          information sent to
        </p>

        {submitted ? (
          <div className="text-center py-4">
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">
              ✅ If this email exists, a reset link has been sent.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(""); }}
              className="text-blue-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-teal-300 text-sm font-semibold cursor-pointer mt-3"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Enter email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-blue-500 dark:border-teal-500 rounded-md px-4 py-3 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-teal-500 transition-colors duration-150"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a2e44] hover:bg-[#152436] dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-600 dark:hover:from-teal-500 dark:hover:to-blue-500 text-white font-semibold py-3.5 rounded-md transition-all duration-200 mb-6 text-sm cursor-pointer"
            >
              Request reset link
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-blue-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-teal-300 text-sm font-semibold"
              >
                Back To Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}