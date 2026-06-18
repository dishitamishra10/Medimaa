"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const icons = {
  reminders: (color) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
    </svg>
  ),
  dose: (color) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  family: (color) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.059 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0l.001.031c0 .225.012.447.037.666A11.944 11.944 0 0112 21c2.17 0 4.207-.576-5.963-1.584A6.062 6.062 0 0118 18.722zm-12 0a9.094 9.094 0 01-3.741-.479 3 3 0 014.682-2.72m.94 3.198l-.001.031c0 .225.012.447.037.666A11.944 11.944 0 0012 21c2.17 0 4.207-.576-5.963-1.584A6.062 6.062 0 0018 18.722zM12 7.125a3 3 0 110-6 3 3 0 010 6zM18 11.625a3 3 0 110-6 3 3 0 010 6zM6 11.625a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  ),
  records: (color) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke={color} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
  ),
};

export default function WelcomePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const canvasRef = useRef(null);

  const [seconds, setSeconds] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Outer Window Scroll Lock
  useEffect(() => {
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, []);

  // Clinical Heartbeat Pulse Canvas Code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };
    let ekgOffset = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const getEkgHeight = (xPosition) => {
      const internalX = (xPosition + ekgOffset) % 300;
      if (internalX > 40 && internalX < 55) return Math.sin((internalX - 40) * (Math.PI / 15)) * -25;
      if (internalX >= 55 && internalX < 62) return 0;
      if (internalX >= 62 && internalX < 67) return (internalX - 62) * 8;
      if (internalX >= 67 && internalX < 74) return -90 + (internalX - 67) * 10;
      if (internalX >= 74 && internalX < 82) return 100 - (internalX - 74) * 25;
      if (internalX >= 82 && internalX < 95) return -25 + (internalX - 82) * 2;
      if (internalX >= 110 && internalX < 140) return Math.sin((internalX - 110) * (Math.PI / 30)) * -35;
      return 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ekgOffset += 1.5;

      const pulseRows = [canvas.height * 0.25, canvas.height * 0.75];

      pulseRows.forEach((baseY) => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.045)";
        ctx.lineWidth = 1.5;

        for (let x = 0; x < canvas.width; x += 3) {
          let y = baseY + getEkgHeight(x);

          let dx = mouse.x - x;
          let dy = mouse.y - y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            y += Math.sin(distance * 0.05) * ((150 - distance) * 0.15);
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      if (mouse.x > -500) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        let vitalGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        vitalGlow.addColorStop(0, "rgba(52, 211, 153, 0.04)");
        vitalGlow.addColorStop(1, "rgba(52, 211, 153, 0)");

        ctx.fillStyle = vitalGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (!autoRedirect) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoRedirect]);

  useEffect(() => {
    if (seconds <= 0 && autoRedirect) {
      router.push("/dashboard");
    }
  }, [seconds, autoRedirect, router]);

  const progress = (seconds / 10) * 100;

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#05070B] text-slate-100 flex flex-col justify-between antialiased selection:bg-emerald-500/30 overflow-hidden">

      {/* Dynamic Background Vital Line Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full object-cover" />

      {/* Ambient Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none" />

      {/* Header Top Margin Spacer */}
      <div className="h-4 shrink-0" />

      {/* Main Container - Strictly locked to screen height with overflow hidden to avoid accidental browser track jumps */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex items-center justify-center overflow-hidden min-h-0 py-2">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-h-full">

          {/* Left Column: Branding & Greeting Context */}
          <div className="lg:col-span-5 text-left space-y-6 lg:space-y-8">

            {/* Logo and App Title Branding Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Image
                  src="/MediMaa_final.png"
                  alt="SevaTrack Logo"
                  width={65}
                  height={65}
                  priority
                  draggable={false}
                  className="drop-shadow-[0_0_25px_rgba(52,211,153,0.45)] brightness-125 w-auto h-21 select-none"
                />
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white leading-none">
                    <Image
                      src="/Medimaa_text_final.png"
                      alt="Medimaa"
                      width={180}
                      height={40}
                      priority
                      draggable={false}
                      className="brightness-125 select-none"
                    />
                  </h1>
                  <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mt-1">
                    Healthcare Made Simple
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Aesthetic Accent Divider Line */}
            <div className="h-[1.5px] w-24 bg-gradient-to-r from-emerald-500/60 to-transparent" />

            {/* Profile Welcome Message Card */}
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 w-24 rounded bg-gradient-to-r from-emerald-400/40 via-emerald-300/40 to-cyan-400/40" />
                <div className="h-9 w-48 rounded bg-gradient-to-r from-emerald-400/40 via-emerald-300/40 to-cyan-400/40" />
                <div className="h-4 w-72 rounded bg-gradient-to-r from-emerald-400/40 via-emerald-300/40 to-cyan-400/40" />
              </div>
            ) : isLoggedIn ? (
              <div className="space-y-3">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Welcome Back
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-none pb-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 drop-shadow-[0_4px_20px_rgba(52,211,153,0.15)] filter antialiased">
                      {user?.displayName || ""}
                    </h2>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
                    Your secure health ecosystem is live. Easily track schedules, coordinate treatment routines, and remain closely synced with your medical support circle.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm font-normal">
                Set up your secure health profile in minutes. Track medication schedules, log allergies, and keep everything ready for emergencies — all in one place.
              </p>
            )}



            {/* Automatic Dynamic Redirection Bar Indicator */}
            {autoRedirect && (
              <div className="pt-1 max-w-xs space-y-2">
                <div className="flex justify-between items-end text-xs text-slate-300">
                  <span className="font-medium">Redirecting to app dashboard</span>
                  <span className="text-xs font-bold text-emerald-400 tabular-nums">{seconds}s</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Launch Application Navigation Buttons Layout */}
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs tracking-wide transition-all duration-200 hover:opacity-95 shadow-xl shadow-emerald-500/15 active:scale-[0.98] cursor-pointer"
              >
                Launch Dashboard →
              </button>

              {autoRedirect && (
                <button
                  onClick={() => setAutoRedirect(false)}
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs tracking-wide transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] cursor-pointer"
                >
                  Stay Here
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Matrix Feature Cards - Adjusted paddings & text sizing to secure 1:1 view height integration */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 w-full">

            {/* Module Card: Smart Reminders */}
            <div className="group bg-slate-900/20 backdrop-blur-md border border-slate-800/50 rounded-xl p-4 lg:p-5 hover:border-orange-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  {icons.reminders('#FB923C')}
                </div>
                <h3 className="text-slate-100 text-sm font-bold tracking-tight">
                  Smart Reminders
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Timely notifications contextually configured to your active medicine routines.
              </p>
            </div>

            {/* Module Card: Dose Metrics */}
            <div className="group bg-slate-900/20 backdrop-blur-md border border-slate-800/50 rounded-xl p-4 lg:p-5 hover:border-pink-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  {icons.dose('#F472B6')}
                </div>
                <h3 className="text-slate-100 text-sm font-bold tracking-tight">
                  Dose Metrics
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Effortlessly document treatments and track accurate ingestion compliance.
              </p>
            </div>

            {/* Module Card: Care Circle Sync */}
            <div className="group bg-slate-900/20 backdrop-blur-md border border-slate-800/50 rounded-xl p-4 lg:p-5 hover:border-fuchsia-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="p-2.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                  {icons.family('#E879F9')}
                </div>
                <h3 className="text-slate-100 text-sm font-bold tracking-tight">
                  Care Circle Sync
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Instantly share changes or historical logs with family and practitioners.
              </p>
            </div>

            {/* Module Card: Secure Records */}
            <div className="group bg-slate-900/20 backdrop-blur-md border border-slate-800/50 rounded-xl p-4 lg:p-5 hover:border-amber-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-xl shadow-black/5">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {icons.records('#FBBF24')}
                </div>
                <h3 className="text-slate-100 text-sm font-bold tracking-tight">
                  Secure Records
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fully encrypted vault storage for clinical prescriptions and health summaries.
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Minimalist Security Footer Area */}
      <footer className="relative z-20 h-12 text-center w-full bg-[#05070B] flex items-center justify-center shrink-0 border-t border-slate-900/40 mt-auto backdrop-blur-sm">
        <p className="text-slate-400 text-[11px] flex items-center gap-2 font-medium tracking-wide">
          <svg className="w-3.5 h-3.5 text-emerald-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your health records are encrypted and protected securely.
        </p>
      </footer>

    </div>
  );
}