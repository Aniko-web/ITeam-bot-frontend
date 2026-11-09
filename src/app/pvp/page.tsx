"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Swords,
  Hash,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Trophy,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";
import { Header } from "@/components/layout/Header";
import { RankBadge } from "@/components/ui/RankBadge";

export default function PvPMainPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    triggerHaptic("heavy");
    router.push(`/pvp/${code.trim().toUpperCase()}`);
  };

  const activePvPLobbies = [
    {
      id: "PVP-9021",
      title: "Mythic Glory 5v5 Scrim Arena",
      host: "ApexSlayer",
      format: "Custom 5v5 Draft Pick",
      blueCount: 5,
      redCount: 4,
      targetRank: "Mythic Glory",
      server: "Zone 6021",
    },
    {
      id: "PVP-7714",
      title: "Tashkent MLBB Weekend Cup — Semi-Final",
      host: "IronWall_Tigreal",
      format: "Tournament Draft 5v5",
      blueCount: 5,
      redCount: 5,
      targetRank: "Mythic Immortal",
      server: "Zone 6022",
    },
    {
      id: "PVP-4309",
      title: "Community Practice Match — Fast Draft",
      host: "ShadowSub",
      format: "Classic 5v5",
      blueCount: 3,
      redCount: 2,
      targetRank: "Legend / Mythic",
      server: "Zone 6021",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-[#F8FAFC]">
      <Header />

      <div className="px-4 pt-3 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold tracking-tight">5v5 PvP Arena</h1>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            Custom Draft Pick
          </span>
        </div>

        {/* Enter Code Card */}
        <div className="rounded-3xl bg-[#111722] border border-white/10 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Lobbiy Kodini Kiriting
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Telegram bot orqali yoki admin yaratgan 5v5 lobbiy kodini kiriting:
          </p>

          <form onSubmit={handleJoinByCode} className="flex gap-2">
            <input
              type="text"
              required
              maxLength={8}
              placeholder="Masalan: E8A1B2"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1 bg-[#090D14] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-black text-white tracking-widest focus:outline-none focus:border-amber-400 uppercase placeholder-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]"
            >
              Kirish
            </button>
          </form>
        </div>

        {/* Active Lobbies Stream */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Faol 5v5 Xonalari
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              Live Arenas
            </span>
          </div>

          <div className="space-y-2.5">
            {activePvPLobbies.map((lobby) => {
              const totalSlots = lobby.blueCount + lobby.redCount;
              const isFull = totalSlots >= 10;

              return (
                <div
                  key={lobby.id}
                  className="p-4 rounded-2xl bg-[#111722] border border-white/5 hover:border-white/15 transition-all flex flex-col space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {lobby.id}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {lobby.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Xost: <strong className="text-slate-300">{lobby.host}</strong> • {lobby.server}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                      {totalSlots}/10
                    </span>
                  </div>

                  {/* Blue vs Red Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-blue-400">Ko'k Jamoa ({lobby.blueCount}/5)</span>
                      <span className="text-red-400">Qizil Jamoa ({lobby.redCount}/5)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#090D14] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${(lobby.blueCount / 10) * 100}%` }}
                      />
                      <div
                        className="h-full bg-red-500 transition-all ml-auto"
                        style={{ width: `${(lobby.redCount / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <RankBadge rank={lobby.targetRank} size="sm" />
                    <Link
                      href={`/pvp/${lobby.id}`}
                      onClick={() => triggerHaptic("selection")}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                        isFull
                          ? "bg-white/5 text-slate-400 hover:text-white"
                          : "bg-white text-black hover:bg-slate-200"
                      }`}
                    >
                      {isFull ? "Tomosha qilish" : "Qo'shilish"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

