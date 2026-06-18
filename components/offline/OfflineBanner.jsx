"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <WifiOff className="h-12 w-12 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
          You're Offline
        </h1>

        {/* Description */}
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          No internet connection detected. Please check your network and
          reconnect to continue using the application.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Try Again
        </button>

        {/* Status */}
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-500">
          Waiting for connection...
        </div>
      </div>
    </div>
  );
}