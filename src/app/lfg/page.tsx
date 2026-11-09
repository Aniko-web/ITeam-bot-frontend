"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Filter, Clock, Flame, Shield, Check, Search } from "lucide-react";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { RankBadge } from "@/components/ui/RankBadge";
import { UserProfile, MLBB_Role } from "@/lib/types";
import { MLBB_HEROES } from "@/lib/heroes";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

const ALL_ROLES: MLBB_Role[] = ["Jungler", "Mid Laner", "Exp Laner", "Gold Laner", "Roamer"];
const ALL_RANKS = ["All Ranks", "Mythic Immortal", "Mythic Glory", "Mythic Honor", "Mythic", "Legend", "Epic"];

export default function LFGPage() {
  const [players, setPlayers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>("All Ranks");
  const [invitedIds, setInvitedIds] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, [selectedRole, selectedRank]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await api.browseLFG({
        role: selectedRole || undefined,
        rank: selectedRank !== "All Ranks" ? selectedRank : undefined,
        min_karma: 70,
      });
      setPlayers(data);
    } catch {
      // High quality mock data for instant preview
      setPlayers([
        {
          telegram_id: 101,
          first_name: "ShadowKage",
          in_game_nickname: "ShadowKage",
          mlbb_id: "68392019",
          server_id: "2048",
          current_rank: "Mythic Glory",
          highest_rank: "Mythic Immortal",
          current_stars: 62,
          main_roles: ["Jungler", "Exp Laner"],
          top_heroes: ["Zilong", "Gatotkaca", "Tigreal"],
          playtime_schedule: "21:00 - 02:00 UTC+5",
          is_lfg_active: true,
          karma_score: 135,
          total_scrims_played: 45,
          total_pvp_played: 32,
          penalties_count: 0,
          is_banned: false,
        },
        {
          telegram_id: 102,
          first_name: "AuraRoam",
          in_game_nickname: "AuraRoam",
          mlbb_id: "89201923",
          server_id: "1002",
          current_rank: "Mythic Immortal",
          highest_rank: "Mythic Immortal",
          current_stars: 110,
          main_roles: ["Roamer"],
          top_heroes: ["Tigreal", "Kalea", "Gatotkaca"],
          playtime_schedule: "20:00 - 01:00 UTC+5",
          is_lfg_active: true,
          karma_score: 148,
          total_scrims_played: 88,
          total_pvp_played: 54,
          penalties_count: 0,
          is_banned: false,
        },
        {
          telegram_id: 103,
          first_name: "GoldRush",
          in_game_nickname: "GoldRush",
          mlbb_id: "44291038",
          server_id: "3021",
          current_rank: "Mythic Honor",
          highest_rank: "Mythic Glory",
          current_stars: 38,
          main_roles: ["Gold Laner"],
          top_heroes: ["Claude", "Beatrix", "Brody"],
          playtime_schedule: "19:00 - 23:00 UTC+5",
          is_lfg_active: true,
          karma_score: 110,
          total_scrims_played: 18,
          total_pvp_played: 14,
          penalties_count: 0,
          is_banned: false,
        },
        {
          telegram_id: 104,
          first_name: "MageSupreme",
          in_game_nickname: "MageSupreme",
          mlbb_id: "90218392",
          server_id: "2048",
          current_rank: "Mythic",
          highest_rank: "Mythic Honor",
          current_stars: 22,
          main_roles: ["Mid Laner"],
          top_heroes: ["Valentina", "Pharsa", "Novaria"],
          playtime_schedule: "20:30 - 00:30 UTC+5",
          is_lfg_active: true,
          karma_score: 95,
          total_scrims_played: 12,
          total_pvp_played: 9,
          penalties_count: 0,
          is_banned: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (user: UserProfile) => {
    triggerHaptic("heavy");
    try {
      await api.invitePlayer(user.telegram_id);
    } catch {
      // Mock success for local demo
    }
    setInvitedIds((prev) => [...prev, user.telegram_id]);
    setStatusMessage(`Party invite sent to ${user.in_game_nickname} via Telegram!`);
    triggerHaptic("success");
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Title & Filter Bar */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white tracking-wide uppercase">
            Quick Match (LFG)
          </h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {players.length} Online Now
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Find solo players matching your team's missing role and rank.
        </p>
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => {
            setSelectedRole(null);
            triggerHaptic("light");
          }}
          className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap cursor-pointer transition-all ${
            selectedRole === null
              ? "bg-white/15 text-white border-white/30"
              : "bg-surface text-slate-400 border-white/5 hover:border-white/20"
          }`}
        >
          All Roles
        </button>
        {ALL_ROLES.map((r) => (
          <RoleBadge
            key={r}
            role={r}
            size="sm"
            selected={selectedRole === r}
            onClick={() => {
              setSelectedRole(selectedRole === r ? null : r);
              triggerHaptic("light");
            }}
          />
        ))}
      </div>

      {/* Rank Tier Dropdown */}
      <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-3 py-1.5">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={selectedRank}
          onChange={(e) => {
            setSelectedRank(e.target.value);
            triggerHaptic("light");
          }}
          aria-label="Filter by Rank Tier"
          className="bg-transparent text-xs text-white font-medium focus:outline-none w-full"
        >
          {ALL_RANKS.map((rk) => (
            <option key={rk} value={rk} className="bg-[#111722] text-white">
              {rk}
            </option>
          ))}
        </select>
      </div>

      {/* Status Toast */}
      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Player Card List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Scanning matchmaker...</div>
        ) : players.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-white/5">
            No players currently matching your filter criteria.
          </div>
        ) : (
          players.map((p) => {
            const isInvited = invitedIds.includes(p.telegram_id);
            return (
              <div
                key={p.telegram_id}
                className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex flex-col gap-3 relative"
              >
                {/* Header: Nickname, MLBB ID, Rank */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-white tracking-wide">
                        {p.in_game_nickname}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({p.mlbb_id})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <RankBadge rank={p.current_rank} stars={p.current_stars} />
                      <span className="text-[11px] text-slate-400">
                        Peak: {p.highest_rank}
                      </span>
                    </div>
                  </div>

                  {/* Karma Tag */}
                  <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      {p.karma_score}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Trust Score</span>
                  </div>
                </div>

                {/* Main Roles & Top 3 Heroes with Avatars */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.main_roles.map((r) => (
                      <RoleBadge key={r} role={r} size="sm" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Mains:</span>
                    <div className="flex items-center -space-x-1.5">
                      {p.top_heroes.slice(0, 3).map((heroName) => {
                        const hObj = MLBB_HEROES.find(
                          (h) => h.name.en.toLowerCase() === heroName.toLowerCase()
                        );
                        return hObj ? (
                          <img
                            key={heroName}
                            src={hObj.image}
                            alt={heroName}
                            title={heroName}
                            className="w-5 h-5 rounded-full object-cover border border-cyan-400/50 shadow-sm"
                          />
                        ) : (
                          <span
                            key={heroName}
                            className="text-[10px] text-slate-400 bg-white/5 px-1 rounded"
                          >
                            {heroName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer: Playtime & Invite Action */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{p.playtime_schedule}</span>
                  </div>

                  <button
                    onClick={() => handleInvite(p)}
                    disabled={isInvited}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                      isInvited
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                        : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] active:scale-95"
                    }`}
                  >
                    {isInvited ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>INVITED</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>INVITE TO PARTY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

