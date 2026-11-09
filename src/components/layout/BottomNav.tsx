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
        <div className="relative bg-[#111722]/95 backdrop-blur-md border border-white/10 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.65)] p-1.5 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = item.match(pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => triggerHaptic("light")}
                className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-200 group ${
                  isActive
                    ? "bg-[#1A2338] text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`relative transition-transform duration-200 ${
                    isActive ? "scale-105" : "group-hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-[20px] h-[20px] ${
                      isActive
                        ? "text-white stroke-[2.4] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                        : "stroke-[1.8]"
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight font-medium truncate max-w-[80px] leading-tight ${
                    isActive ? "text-white font-semibold" : "text-slate-400"
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
