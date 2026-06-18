"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const EmergencyQRPage = () => {
  const { uid } = useAuth();
  // const profileUrl = `http://localhost:3000/patient/${uid}`;
  const profileUrl = `http://localhost:3000/signin?redirect=/patient/${uid}`;
  const [copied, setCopied] = useState(false);

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${uid}-qr.png`;
    link.click();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-gray-700/60 rounded-[14px] p-6 max-w-[300px] w-full flex flex-col items-center gap-3.5 shadow-sm dark:shadow-black/30">

        {/* Header */}
        <div className="text-center">
          <div className="w-9 h-9 rounded-lg bg-[#FBEAF0] dark:bg-teal-500/10 flex items-center justify-center mx-auto mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#993556] dark:text-teal-400"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3M14 21h3M20 18v3" />
            </svg>
          </div>

          <h1 className="text-[15px] font-medium mb-0.5">
            Emergency QR code
          </h1>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Scan to view medical records
          </p>
        </div>

        {/* QR code */}
        <div className="p-3 bg-white dark:bg-gray-800 border border-black/10 dark:border-gray-700 rounded-[10px]">
          <QRCodeCanvas
            id="qr-code"
            value={profileUrl}
            size={160}
            level="H"
          />
        </div>

        {/* URL pill */}
        <div
          onClick={copyLink}
          title="Click to copy link"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 w-full overflow-hidden cursor-pointer transition-all duration-200 border ${copied
              ? "bg-[#EAF3DE] dark:bg-green-500/10 border-green-700/30 dark:border-green-500/30"
              : "bg-[#f9f9f8] dark:bg-gray-800 border-black/10 dark:border-gray-700"
            }`}
        >
          {copied ? (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-[#27500A] dark:text-green-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="shrink-0 text-gray-500 dark:text-gray-400"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}

          <span
            className={`text-[11px] whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ${copied
                ? "text-[#27500A] dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {copied ? "Link copied!" : profileUrl}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black/10 dark:bg-gray-700" />

        {/* Download button */}
        <button
          onClick={downloadQR}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#FBEAF0] dark:bg-gradient-to-r dark:from-teal-600 dark:to-blue-600 text-[#72243E] dark:text-white border border-[#993556]/30 dark:border-transparent rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 hover:opacity-85 active:scale-[0.98]"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download QR code
        </button>
      </div>
    </div>
  );
};

export default EmergencyQRPage;