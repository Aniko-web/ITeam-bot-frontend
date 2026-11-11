"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Swords, Flame, Shield, Radio, ArrowRight, Zap, Trophy, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { QuickMatchList } from "@/components/home/QuickMatchList";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { RankBadge } from "@/components/ui/RankBadge";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { KarmaMeter } from "@/components/ui/KarmaMeter";
import { UserProfile } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopupModal, setShowTopupModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getMyProfile();
      setProfile(data);
    } catch {
      // Offline / dev fallback
      setProfile({
        telegram_id: 999888777,
        first_name: "DemoCaptain",
        in_game_nickname: "ViperKing",
        mlbb_id: "78491032",
        server_id: "2048",
        current_rank: "Mythic Glory",
        highest_rank: "Mythic Immortal",
        current_stars: 54,
        main_roles: ["Jungler", "Mid Laner"],
        top_heroes: ["Tigreal", "Kalea", "Zilong"],
        playtime_schedule: "20:00 - 00:00 UTC+5",
        is_lfg_active: true,
        karma_score: 115,
        istars_balance: 140,
        selected_background_id: "deep-void",
        total_scrims_played: 24,
        total_pvp_played: 18,
        penalties_count: 0,
        is_banned: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLFG = async () => {
    triggerHaptic("medium");
    if (!profile) return;
    try {
      const updated = await api.toggleLFG();
      setProfile(updated);
    } catch {
      setProfile({ ...profile, is_lfg_active: !profile.is_lfg_active });
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    if (profile) {
      setProfile({ ...profile, istars_balance: newBalance });
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* 1. Header with IStars Balance Capsule & Profile */}
      <Header user={profile} onBalanceUpdate={handleBalanceUpdate} />

      <main className="px-4 flex flex-col gap-4 max-w-md mx-auto w-full pb-24">
        {/* 2. Promotional Banner Carousel (Playdom + IStars recharge) */}
        <BannerCarousel
          onOpenTopup={() => setShowTopupModal(true)}
          userId={profile?.telegram_id}
        />

        {/* 3. Player Quick Status & LFG Status Pill */}
        {profile && (
          <div className="neumo-card p-4 relative overflow-hidden flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300 font-semibold">ID: {profile.mlbb_id} ({profile.server_id})</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300 font-medium">{profile.playtime_schedule}</span>
              </div>

              {/* LFG Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleLFG}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                  profile.is_lfg_active
                    ? "liquid-glass text-emerald-400 border-emerald-500/30"
                    : "neumo-btn border-white/5 text-slate-400"
                }`}
              >
                <Radio
                  className={`w-3 h-3 ${profile.is_lfg_active ? "text-emerald-400" : ""}`}
                />
                <span>{profile.is_lfg_active ? "LFG: ACTIVE" : "LFG: IDLE"}</span>
              </button>
            </div>

            {/* Main Roles & Karma Bar */}
            <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                {profile.main_roles.map((r) => (
                  <RoleBadge key={r} role={r} size="sm" />
                ))}
              </div>

              <Link
                href="/karma"
                onClick={() => triggerHaptic("light")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full neumo-btn hover:brightness-110 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono font-bold text-white">
                  {profile.karma_score} Karma
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* 4. Quick Match (LFG) Lobby Stream */}
        <QuickMatchList currentUser={profile} />

        {/* 5. Tactile Neumorphic Core Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Scrim Finder */}
          <Link
            href="/scrims"
            onClick={() => triggerHaptic("light")}
            className="neumo-card p-3.5 rounded-2xl flex flex-col justify-between transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl neumo-inset flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Swords className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">Scrim Finder</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                BO1 / BO3 avtomat Ready Check
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 mt-2.5">
              <span>Topish</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Teams Roster */}
          <Link
            href="/teams"
            onClick={() => triggerHaptic("light")}
            className="neumo-card p-3.5 rounded-2xl flex flex-col justify-between transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl neumo-inset flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">Jamoalar (Teams)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                5+2 Roster & Pro Logolar
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-400 mt-2.5">
              <span>Roster</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* 5v5 PvP Custom */}
          <Link
            href="/pvp/lobby"
            onClick={() => triggerHaptic("light")}
            className="neumo-card p-3.5 rounded-2xl flex flex-col justify-between transition-all group active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-xl neumo-inset flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">5v5 Custom PvP</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                Telegram lobbi & slotlar
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-2.5">
              <span>Kirish</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* IStars Top-up Direct Tile */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic("medium");
              setShowTopupModal(true);
            }}
            className="neumo-card p-3.5 rounded-2xl flex flex-col justify-between transition-all text-left group active:scale-[0.98] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl neumo-inset flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">Playdom Top-up</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                100 IStars = 5,000 UZS
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-2.5">
              <span>To‘ldirish</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </main>

      {/* Playdom Deposit Modal */}
      <PlaydomTopupModal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        currentBalance={profile?.istars_balance ?? 125}
        onSuccess={handleBalanceUpdate}
        userId={profile?.telegram_id}
      />
    </div>
  );
}
