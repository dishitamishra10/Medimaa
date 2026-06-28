"use client";

import { useEffect, useRef } from "react";

export default function VitalsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let offset = 0;

    const mouse = {
      x: null,
      y: null,
      inside: false,
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    };

    const handleMouseLeave = () => {
      mouse.inside = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleMouseEnter = (e) => {
      mouse.inside = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        mouse.inside = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerleave", handleMouseLeave);
    window.addEventListener("pointerenter", handleMouseEnter);
    window.addEventListener("blur", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // --- EKG waveform shape ---
    const getEkgHeight = (xPosition) => {
      const p = ((xPosition + offset) % 340 + 340) % 340;
      if (p < 40) return 0;
      if (p < 52) return Math.sin(((p - 40) / 12) * Math.PI) * -14;
      if (p < 60) return 0;
      if (p < 65) return (p - 60) * 7;
      if (p < 70) return 35 - (p - 65) * 22;
      if (p < 76) return -75 + (p - 70) * 13.5;
      if (p < 86) return 6 - (p - 76) * 5;
      if (p < 105) return Math.sin(((p - 86) / 19) * Math.PI) * -22;
      return 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 1.8;

      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark");

      const W = canvas.width;
      const H = canvas.height;

      if (
        !mouse.inside ||
        mouse.x < 0 ||
        mouse.y < 0 ||
        mouse.x > W ||
        mouse.y > H
      ) {
        mouse.inside = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }

      // --- Grid ---
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = isDark
        ? "rgba(11, 153, 106, 0.06)"
        : "rgba(192, 41, 63, 0.055)";

      for (let x = 0; x <= W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += 36) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // --- ECG lines config ---
      const lines = isDark
        ? [
          { yRatio: 0.25, alpha: 0.45, width: 1.4, color: "rgba(11,153,106,1)", phaseOff: 0, blend: "screen" },
          { yRatio: 0.50, alpha: 0.25, width: 1.0, color: "rgba(11,153,106,1)", phaseOff: 80, blend: "screen" },
          { yRatio: 0.75, alpha: 0.45, width: 1.4, color: "rgba(11,153,106,1)", phaseOff: 160, blend: "screen" },
        ]
        : [
          { yRatio: 0.25, alpha: 1, width: 1.4, color: "#b53a48da", phaseOff: 0, blend: "source-over" },
          { yRatio: 0.50, alpha: 0.45, width: 1.0, color: "#a5253b", phaseOff: 80, blend: "source-over" },
          { yRatio: 0.75, alpha: 1, width: 1.4, color: "#b53a48da", phaseOff: 160, blend: "source-over" },
        ];

      // --- Draw each ECG line ---
      lines.forEach(({ yRatio, alpha, width, color, phaseOff, blend }) => {
        const baseY = H * yRatio;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.globalCompositeOperation = blend;

        for (let x = 0; x <= W; x += 2) {
          let y = baseY + getEkgHeight(x + phaseOff);

          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (
            mouse.inside &&
            mouse.x >= 0 &&
            mouse.y >= 0 &&
            mouse.x <= W &&
            mouse.y <= H &&
            dist < 150
          ) {
            const strength = 1 - dist / 150;
            y += Math.sin(dist * 0.07 - offset * 0.12) * strength * 32;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      });

      // // --- Cursor effect ---
      // if (mouse.x > -500) {
      //   ctx.save();

      //   const pulse = (Math.sin(offset * 0.08) + 1) / 2;

      //   // Soft spotlight (neutral instead of bright green)
      //   const gradient = ctx.createRadialGradient(
      //     mouse.x,
      //     mouse.y,
      //     0,
      //     mouse.x,
      //     mouse.y,
      //     90
      //   );

      //   if (isDark) {
      //     gradient.addColorStop(0, "rgba(255,255,255,0.05)");
      //     gradient.addColorStop(0.5, "rgba(16,185,129,0.025)");
      //     gradient.addColorStop(1, "rgba(16,185,129,0)");
      //   } else {
      //     gradient.addColorStop(0, "rgba(255,255,255,0.12)");
      //     gradient.addColorStop(0.5, "rgba(190,24,93,0.04)");
      //     gradient.addColorStop(1, "rgba(190,24,93,0)");
      //   }

      //   ctx.fillStyle = gradient;
      //   ctx.beginPath();
      //   ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
      //   ctx.fill();

      //   // Animated pulse ring
      //   ctx.beginPath();
      //   ctx.arc(mouse.x, mouse.y, 14 + pulse * 4, 0, Math.PI * 2);
      //   ctx.strokeStyle = isDark
      //     ? `rgba(16,185,129,${0.18 + pulse * 0.12})`
      //     : `rgba(190,24,93,${0.16 + pulse * 0.12})`;
      //   ctx.lineWidth = 1;
      //   ctx.stroke();

      //   // Center dot
      //   ctx.beginPath();
      //   ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
      //   ctx.fillStyle = isDark
      //     ? "rgba(16,185,129,0.85)"
      //     : "rgba(190,24,93,0.85)";
      //   ctx.fill();

      //   // Crosshair
      //   ctx.globalAlpha = 0.22;
      //   ctx.strokeStyle = isDark
      //     ? "rgba(16,185,129,0.55)"
      //     : "rgba(190,24,93,0.55)";
      //   ctx.lineWidth = 0.5;
      //   ctx.setLineDash([6, 6]);

      //   ctx.beginPath();
      //   ctx.moveTo(mouse.x, 0);
      //   ctx.lineTo(mouse.x, H);
      //   ctx.stroke();

      //   ctx.beginPath();
      //   ctx.moveTo(0, mouse.y);
      //   ctx.lineTo(W, mouse.y);
      //   ctx.stroke();

      //   ctx.setLineDash([]);
      //   ctx.restore();
      // }

      // --- Cursor ECG Pulse Ring ---
      if (
        mouse.inside &&
        mouse.x >= 0 &&
        mouse.y >= 0 &&
        mouse.x <= W &&
        mouse.y <= H
      ) {
        ctx.save();

        const pulse = (Math.sin(offset * 0.12) + 1) / 2;
        const ringRadius = 14 + pulse * 6;

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(16,185,129,${0.35 + pulse * 0.25})`
          : `rgba(190,24,93,${0.35 + pulse * 0.25})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner static ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? "rgba(16,185,129,0.8)"
          : "rgba(190,24,93,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#10b981" : "#be185d";
        ctx.fill();

        // Soft crosshair
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = isDark
          ? "rgba(16,185,129,0.6)"
          : "rgba(190,24,93,0.6)";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([8, 8]);

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(mouse.x, 0);
        ctx.lineTo(mouse.x, H);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(0, mouse.y);
        ctx.lineTo(W, mouse.y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);

      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerleave", handleMouseLeave);
      window.removeEventListener("pointerenter", handleMouseEnter);
      window.removeEventListener("blur", handleMouseLeave);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Canvas — sits behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Dark mode ambient spotlights */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] hidden dark:block bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] hidden dark:block bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Light mode ambient spotlights */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] block dark:hidden bg-rose-500/[0.025] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] block dark:hidden bg-rose-500/[0.025] blur-[120px] rounded-full pointer-events-none z-0" />
    </>
  );
}