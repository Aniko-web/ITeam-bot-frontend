"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Swords, Settings } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";
import { useLanguage } from "@/lib/i18n";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      id: "home",
      label: t.nav_home,
      href: "/",
      icon: Home,
      match: (p: string) => p === "/",
    },
    {
      id: "my-team",
      label: t.nav_my_team,
      href: "/teams/my-team",
      icon: Shield,
      match: (p: string) => p.startsWith("/teams"),
    },
    {
      id: "pvp",
      label: t.nav_pvp,
      href: "/pvp",
      icon: Swords,
      match: (p: string) => p.startsWith("/pvp"),
    },
    {
      id: "settings",
      label: t.nav_settings,
      href: "/settings",
      icon: Settings,
      match: (p: string) => p.startsWith("/settings") || p.startsWith("/profile"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-center pb-safe">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto w-full max-w-md px-3.5 mb-3"
      >
        {/* Liquid Glass Floating Dock with Specular Chromatic Rim */}
        <div className="relative liquid-glass-dock rounded-[26px] p-1.5 flex items-center justify-between overflow-hidden">
          {/* Chromatic Liquid Edge Glow */}
          <div className="liquid-gradient-rim" />

          {/* Ambient fluid glow underneath dock */}
          <div className="absolute -bottom-6 left-1/4 right-1/4 h-8 bg-cyan-500/20 blur-xl pointer-events-none" />

          {navItems.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => triggerHaptic("light")}
                className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[20px] transition-all duration-300 group ${
                  isActive
                    ? "liquid-pill-active text-white scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] active:scale-95"
                }`}
              >
                {/* Active Fluid Specular Sheen */}
                {isActive && (
                  <span className="absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                )}

                <div
                  className={`relative transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-[20px] h-[20px] transition-colors duration-200 ${
                      isActive
                        ? "text-cyan-300 stroke-[2.4] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                        : "stroke-[1.8]"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.9)] animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight font-medium truncate max-w-[80px] leading-tight transition-colors ${
                    isActive ? "text-cyan-100 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
