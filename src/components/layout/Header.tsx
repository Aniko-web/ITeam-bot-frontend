"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Headphones, Plus, Sparkles, Wallet, Globe } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { triggerHaptic } from "@/lib/telegram";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { SupportModal } from "@/components/modals/SupportModal";
import { useLanguage, Language } from "@/lib/i18n";

interface HeaderProps {
  user?: UserProfile | null;
  onBalanceUpdate?: (newBalance: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onBalanceUpdate }) => {
  const [showTopup, setShowTopup] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [localBalance, setLocalBalance] = useState<number | null>(null);
  const { language, setLanguage } = useLanguage();

  const balance = localBalance !== null ? localBalance : user?.istars_balance ?? 125;

  const handleTopupSuccess = (newBalance: number) => {
    setLocalBalance(newBalance);
    if (onBalanceUpdate) {
      onBalanceUpdate(newBalance);
    }
  };

  const cycleLanguage = () => {
    triggerHaptic("light");
    const nextLang: Language = language === "uz" ? "ru" : language === "ru" ? "en" : "uz";
    setLanguage(nextLang);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090D14]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left Column: User Avatar & Truncated Nickname */}
          <Link
            href="/profile"
            onClick={() => triggerHaptic("light")}
            className="flex items-center gap-2.5 group p-1 -ml-1 rounded-2xl hover:bg-white/[0.03] transition-colors"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#111622] neumo-btn flex items-center justify-center overflow-hidden group-hover:border-white/30 transition-colors shadow-sm">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.in_game_nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-300">
                    {(user?.in_game_nickname || "IT").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090D14] shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight truncate max-w-[110px] drop-shadow-sm">
                  {user?.in_game_nickname || "ITeam Player"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-cyan-300/90 font-medium">
                  {user?.current_rank || "Mythic"}
                </span>
                <span className="text-[9px] text-slate-500">•</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  ★{user?.current_stars ?? 25}
                </span>
              </div>
            </div>
          </Link>

          {/* Right Column: Support & IStars Balance Capsule */}
          <div className="flex items-center gap-2">
            {/* Language Pill */}
            <button
              type="button"
              onClick={cycleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full neumo-btn text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Tilni almashtirish"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="uppercase font-mono">{language}</span>
            </button>

            {/* Support / Headset Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setShowSupport(true);
              }}
              className="w-8 h-8 rounded-full neumo-btn flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Qo‘llab-quvvatlash"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* IStars Balance Capsule */}
            <div className="flex items-center neumo-btn rounded-full pl-2.5 pr-1 py-1 gap-1.5 shadow-sm border border-amber-500/20">
              <div className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                <span className="text-xs font-mono font-black text-amber-300 tracking-tight">
                  {balance}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">IStars</span>
              </div>

              {/* Rounded "+" button to open Playdom modal */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("medium");
                  setShowTopup(true);
                }}
                className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 hover:brightness-110 text-black flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                title="Playdom orqali to‘ldirish"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Playdom Topup Modal */}
      <PlaydomTopupModal
        isOpen={showTopup}
        onClose={() => setShowTopup(false)}
        currentBalance={balance}
        onSuccess={handleTopupSuccess}
        userId={user?.telegram_id}
      />

      {/* Support Modal */}
      <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </>
  );
};
