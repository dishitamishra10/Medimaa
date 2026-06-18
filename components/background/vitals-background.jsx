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

      const isDarkMode = document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");

      const pulseRows = [canvas.height * 0.25, canvas.height * 0.75];

      pulseRows.forEach((baseY) => {
        ctx.beginPath();
        
        if (isDarkMode) {
          ctx.strokeStyle = "rgba(11, 153, 106, 0.08)"; // Faint green for dark mode
          ctx.lineWidth = 1.5;
          ctx.globalCompositeOperation = "screen";      
        } else {
          // SOLID VIBRANT RED: Replaced RGBA with a solid hex color profile 
          // and refined thickness down slightly to keep background rendering clean
          ctx.strokeStyle = "#b53a48da";   
          ctx.lineWidth = 1.2;
          ctx.globalCompositeOperation = "source-over";  
        }

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
        
        if (isDarkMode) {
          ctx.globalCompositeOperation = "screen";
          let vitalGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
          vitalGlow.addColorStop(0, "rgba(74, 187, 145, 0.04)");
          vitalGlow.addColorStop(1, "rgba(52, 211, 153, 0)");
          ctx.fillStyle = vitalGlow;
        } else {
          ctx.globalCompositeOperation = "source-over"; 
          let vitalGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
          // Matches the soft mouse-tracking red ambient spotlight glow
          vitalGlow.addColorStop(0, "rgba(225, 29, 72, 0.04)");   
          vitalGlow.addColorStop(1, "rgba(225, 29, 72, 0)");
          ctx.fillStyle = vitalGlow;
        }
        
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

  return (
    <>
      {/* Kept at z-index: -1 so it floats smoothly behind cards and typography layers */}
      <canvas 
        ref={canvasRef} 
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1 }} 
      />
      
      {/* Shared Ambient Spotlights — Maintained exclusively for dark mode setups */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] hidden dark:block bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] hidden dark:block bg-emerald-500/[0.015] blur-[120px] rounded-full pointer-events-none z-0" />
    </>
  );
}