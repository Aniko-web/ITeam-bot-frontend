"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Check, ArrowRight, Shield, Zap } from "lucide-react";
import { UserProfile, MLBB_Role } from "@/lib/types";
import { triggerHaptic } from "@/lib/telegram";

interface LobbyItem {
  id: string;
  hostNickname: string;
  hostAvatar?: string;
  hostRank: string;
  targetRankDisplay: string;
  lobbyType: "Duo (2)" | "Trio (3)" | "Full Team (5)";
  slotsFilled: number;
  totalSlots: number;
  neededRole: MLBB_Role;
  laneIcon: string;
  neededRoleLabel: string;
}

interface QuickMatchListProps {
  currentUser?: UserProfile | null;
}

export const QuickMatchList: React.FC<QuickMatchListProps> = ({ currentUser }) => {
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({});

  // Active recommended lobbies
  const defaultLobbies: LobbyItem[] = [
    {
      id: "lobby-1",
      hostNickname: "SoraViper",
      hostAvatar: "/heroes/fanny.png",
      hostRank: "Mythic Immortal",
      targetRankDisplay: "Mythic Immortal 100+★",
      lobbyType: "Full Team (5)",
      slotsFilled: 4,
      totalSlots: 5,
      neededRole: "Roamer",
      laneIcon: "/lanes/roam.png",
      neededRoleLabel: "[+] Roamer Needed",
    },
    {
      id: "lobby-2",
      hostNickname: "ShadowClaw",
      hostAvatar: "/heroes/chou.png",
      hostRank: "Mythic Glory",
      targetRankDisplay: "Mythic Glory 50-100★",
      lobbyType: "Trio (3)",
      slotsFilled: 2,
      totalSlots: 3,
      neededRole: "Gold Laner",
      laneIcon: "/lanes/gold.png",
      neededRoleLabel: "[+] Gold Laner Needed",
    },
    {
      id: "lobby-3",
      hostNickname: "ApexMage",
      hostAvatar: "/heroes/kagura.png",
      hostRank: "Mythic Honor",
      targetRankDisplay: "Mythic Honor 25-50★",
      lobbyType: "Full Team (5)",
      slotsFilled: 3,
      totalSlots: 5,
      neededRole: "Jungler",
      laneIcon: "/lanes/jungle.png",
      neededRoleLabel: "[+] Jungler Needed",
    },
    {
      id: "lobby-4",
      hostNickname: "IronShield",
      hostAvatar: "/heroes/tigreal.png",
      hostRank: "Mythic",
      targetRankDisplay: "Mythic 0-25★",
      lobbyType: "Duo (2)",
      slotsFilled: 1,
      totalSlots: 2,
      neededRole: "Exp Laner",
      laneIcon: "/lanes/exp.png",
      neededRoleLabel: "[+] Exp Laner Needed",
    },
  ];

  // Reorder & prioritize lobbies matching user's rank & main roles if available
  const sortedLobbies = [...defaultLobbies].sort((a, b) => {
    if (!currentUser) return 0;
    const aMatchesRole = currentUser.main_roles?.includes(a.neededRole) ? 1 : 0;
    const bMatchesRole = currentUser.main_roles?.includes(b.neededRole) ? 1 : 0;
    return bMatchesRole - aMatchesRole;
  });

  const handleJoin = (lobbyId: string) => {
    triggerHaptic("heavy");
    setJoinedMap((prev) => ({ ...prev, [lobbyId]: true }));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded-full bg-cyan-400" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Tavsiya Etilgan Lobbilar (Quick Match)
          </h2>
        </div>
        <Link
          href="/lfg"
          onClick={() => triggerHaptic("light")}
          className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Barchasi</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Lobby Cards Stream */}
      <div className="flex flex-col gap-2">
        {sortedLobbies.map((lobby) => {
          const isJoined = joinedMap[lobby.id];
          const isAlmostFull = lobby.slotsFilled === lobby.totalSlots - 1;

          return (
            <div
              key={lobby.id}
              className="bg-[#111622] hover:bg-[#141B2A] border border-white/5 hover:border-white/15 rounded-2xl p-3 transition-all flex items-center justify-between gap-3 shadow-sm group"
            >
              {/* Left Column: Host Avatar & Rank Details */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#182030] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={lobby.hostAvatar}
                    alt={lobby.hostNickname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white truncate max-w-[120px]">
                      {lobby.hostNickname}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-medium truncate mt-0.5">
                    {lobby.targetRankDisplay}
                  </span>
                </div>
              </div>

              {/* Right Column: Lobby Type, Slot Count, Needed Role & Join Button */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {/* Top Row: Type & Slots */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-slate-400 font-semibold">{lobby.lobbyType}</span>
                  <span
                    className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                      isAlmostFull
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-white/5 text-slate-300 border border-white/10"
                    }`}
                  >
                    {lobby.slotsFilled}/{lobby.totalSlots}
                  </span>
                </div>

                {/* Middle Row: Missing Lane Tag */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#182030] border border-white/5 text-[10px] text-cyan-300 font-bold">
                  <img src={lobby.laneIcon} alt={lobby.neededRole} className="w-3 h-3 object-contain" />
                  <span>{lobby.neededRoleLabel}</span>
                </div>

                {/* Bottom Row: Join Action Button */}
                <button
                  type="button"
                  disabled={isJoined}
                  onClick={() => handleJoin(lobby.id)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                    isJoined
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Yuborildi</span>
                    </>
                  ) : (
                    <span>Qo‘shilish</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

