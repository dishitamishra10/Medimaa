"use client";

import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isWelcomePage = pathname === "/welcome";

  return (
    <footer
      className={`relative border-t backdrop-blur-sm transition-colors duration-300 ${
        isWelcomePage
          ? "border-neutral-800/60 bg-neutral-950/90 text-neutral-400"
          : "mt-16 border-teal-900/20 dark:border-teal-100/10 bg-white/60 dark:bg-neutral-950/60 text-neutral-400 dark:text-neutral-500"
      }`}
    >
      <div
        className={`border-t ${
          isWelcomePage
            ? "border-neutral-800/40"
            : "border-teal-900/10 dark:border-teal-100/10"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} Medimaa. All rights reserved.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            Your health data stays private and secure.
          </span>
        </div>
      </div>
    </footer>
  );
}