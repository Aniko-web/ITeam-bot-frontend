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
      <header className="sticky top-0 z-40 w-full bg-[#090D14]/95 backdrop-blur-md border-b border-white/10 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left Column: User Avatar & Truncated Nickname */}
          <Link
            href="/profile"
            onClick={() => triggerHaptic("light")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#111622] border border-white/15 flex items-center justify-center overflow-hidden group-hover:border-white/30 transition-colors shadow-sm">
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
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090D14]" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight truncate max-w-[110px]">
                  {user?.in_game_nickname || "ITeam Player"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400">
                  {user?.current_rank || "Mythic"}
                </span>
                <span className="text-[9px] text-slate-500">•</span>
                <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
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
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#111622] border border-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Tilni almashtirish"
            >
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="uppercase font-mono">{language}</span>
            </button>

            {/* Support / Headset Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setShowSupport(true);
              }}
              className="w-8 h-8 rounded-full bg-[#111622] border border-white/10 hover:border-white/25 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Qo‘llab-quvvatlash"
            >
              <Headphones className="w-3.5 h-3.5" />
            </button>

            {/* IStars Balance Capsule */}
            <div className="flex items-center bg-[#111622] border border-white/10 rounded-full pl-2.5 pr-1 py-1 gap-1.5 shadow-sm">
              <div className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
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
                className="w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-sm"
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
