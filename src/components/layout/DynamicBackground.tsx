"use client";

import React, { useEffect, useRef, useState } from "react";

export type BackgroundThemeId = "deep-void" | "minimal-slate" | "carbon-mesh" | "particles" | "custom";

interface DynamicBackgroundProps {
  themeId?: BackgroundThemeId;
  customUrl?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  themeId: propThemeId,
  customUrl,
}) => {
  const [themeId, setThemeId] = useState<BackgroundThemeId>(propThemeId || "deep-void");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("iteam_bg_theme") as BackgroundThemeId;
    if (saved) {
      setThemeId(saved);
    }
  }, []);

  useEffect(() => {
    if (propThemeId) {
      setThemeId(propThemeId);
    }
  }, [propThemeId]);

  // Subtle floating particles canvas for "particles" theme (battery-conscious, 30fps cap, small canvas)
  useEffect(() => {
    if (themeId !== "particles" && themeId !== "deep-void") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = 18; // Very lightweight
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.25 + 0.05,
    }));

    let lastTime = 0;
    const render = (time: number) => {
      // Limit to ~30 FPS for optimal battery and performance in WebViews
      if (time - lastTime > 32) {
        lastTime = time;
        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [themeId]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Theme 1: Deep Void (Matte Pure Dark with subtle radial vignette) */}
      {themeId === "deep-void" && (
        <div className="absolute inset-0 bg-[#090D14]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(17,24,39,0.7)_0%,transparent_75%)]" />
        </div>
      )}

      {/* Theme 2: Minimal Slate */}
      {themeId === "minimal-slate" && (
        <div className="absolute inset-0 bg-[#0B0F19]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      )}

      {/* Theme 3: Carbon Mesh */}
      {themeId === "carbon-mesh" && (
        <div className="absolute inset-0 bg-[#10141E]">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>
      )}

      {/* Custom Theme URL */}
      {themeId === "custom" && customUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-[2px]"
          style={{ backgroundImage: `url(${customUrl})` }}
        />
      )}

      {/* Ambient Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
};

