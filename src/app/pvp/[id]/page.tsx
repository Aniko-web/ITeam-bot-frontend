"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Flame,
  Shield,
  Key,
  Copy,
  Check,
  ChevronLeft,
  Users,
  Swords,
  Lock,
  Unlock,
  Radio
} from "lucide-react";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { RankBadge } from "@/components/ui/RankBadge";
import { PvPLobby, PvPParticipant, MLBB_Role } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

const ROLES: MLBB_Role[] = ["Exp Laner", "Jungler", "Mid Laner", "Gold Laner", "Roamer"];

export default function PvPLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const lobbyCode = (params.id as string) || "E8A1B2";

  const [lobby, setLobby] = useState<PvPLobby | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<MLBB_Role>("Jungler");
  const [copiedKey, setCopiedKey] = useState(false);

  // Admin reveal credentials
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    loadLobby();
  }, [lobbyCode]);

  const loadLobby = async () => {
    try {
      const data = await api.getLobbyByCode(lobbyCode);
      setLobby(data);
    } catch {
      // Mock PvP Lobby
      setLobby({
        id: "lobby-1",
        lobby_code: lobbyCode.toUpperCase(),
        title: "Uzbekistan Community 5v5 Custom",
        creator_telegram_id: 999888777,
        format: "BO1",
        target_rank: "Mythic",
        max_slots: 10,
        status: "open",
        custom_room_id: "774910",
        custom_room_password: "888",
        participants: [],
        blue_team: [
          {
            id: "p1",
            user_id: 101,
            nickname: "ViperKing",
            rank: "Mythic Glory",
            slot_index: 0,
            team_side: "BLUE",
            selected_role: "Jungler",
            is_ready: true,
            joined_at: new Date().toISOString(),
          },
          {
            id: "p2",
            user_id: 102,
            nickname: "AuraRoam",
            rank: "Mythic Immortal",
            slot_index: 1,
            team_side: "BLUE",
            selected_role: "Roamer",
            is_ready: true,
            joined_at: new Date().toISOString(),
          },
          {
            id: "p3",
            user_id: 103,
            nickname: "ShadowMid",
            rank: "Mythic",
            slot_index: 2,
            team_side: "BLUE",
            selected_role: "Mid Laner",
            is_ready: true,
            joined_at: new Date().toISOString(),
          },
        ],
        red_team: [
          {
            id: "p6",
            user_id: 106,
            nickname: "RedBeast",
            rank: "Mythic Immortal",
            slot_index: 5,
            team_side: "RED",
            selected_role: "Exp Laner",
            is_ready: true,
            joined_at: new Date().toISOString(),
          },
          {
            id: "p7",
            user_id: 107,
            nickname: "CrimsonSniper",
            rank: "Mythic Honor",
            slot_index: 6,
            team_side: "RED",
            selected_role: "Gold Laner",
            is_ready: true,
            joined_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSlot = async (slotIndex: number) => {
    triggerHaptic("heavy");
    if (!lobby) return;
    try {
      const updated = await api.joinPvPSlot(lobby.id, {
        slot_index: slotIndex,
        selected_role: selectedRole,
      });
      setLobby(updated);
      triggerHaptic("success");
    } catch {
      // Mock slot claiming for local demonstration
      const side = slotIndex < 5 ? "BLUE" : "RED";
      const newPart: PvPParticipant = {
        id: `p-${Date.now()}`,
        user_id: 999888777,
        nickname: "DemoCaptain",
        rank: "Mythic Glory",
        slot_index: slotIndex,
        team_side: side,
        selected_role: selectedRole,
        is_ready: true,
        joined_at: new Date().toISOString(),
      };

      if (side === "BLUE") {
        setLobby({
          ...lobby,
          blue_team: [...lobby.blue_team.filter((p) => p.slot_index !== slotIndex), newPart],
        });
      } else {
        setLobby({
          ...lobby,
          red_team: [...lobby.red_team.filter((p) => p.slot_index !== slotIndex), newPart],
        });
      }
      triggerHaptic("success");
    }
  };

  const handleRevealCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("heavy");
    if (!lobby) return;
    setRevealing(true);
    try {
      await api.revealPvPCredentials(lobby.id, {
        custom_room_id: roomId,
        custom_room_password: roomPassword,
      });
      triggerHaptic("success");
      loadLobby();
    } catch (e: any) {
      alert(e.message || "Failed to reveal credentials");
    } finally {
      setRevealing(false);
    }
  };

  const copyCreds = () => {
    if (!lobby?.custom_room_id) return;
    triggerHaptic("medium");
    navigator.clipboard.writeText(`Room: ${lobby.custom_room_id} | Pass: ${lobby.custom_room_password}`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  if (loading || !lobby) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading PvP Lobby...</div>;
  }

  const totalOccupied = lobby.blue_team.length + lobby.red_team.length;
  const isFull = totalOccupied >= 10 || lobby.status === "full" || lobby.status === "credentials_shared";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Lobby</span>
        </button>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          CODE: {lobby.lobby_code}
        </span>
      </div>

      {/* Lobby Title & Status */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-black text-white">{lobby.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                5v5 Custom Draft
              </span>
              <RankBadge rank={lobby.target_rank} />
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-mono font-black text-white">
              {totalOccupied} / 10
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Slots Claimed</p>
          </div>
        </div>
      </div>

      {/* Role Picker for next claim */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Select Your Lane Before Claiming Slot
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ROLES.map((r) => (
            <RoleBadge
              key={r}
              role={r}
              size="sm"
              selected={selectedRole === r}
              onClick={() => {
                setSelectedRole(r);
                triggerHaptic("light");
              }}
            />
          ))}
        </div>
      </div>

      {/* Blue Team (5 Slots) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            BLUE SIDE ({lobby.blue_team.length} / 5)
          </h3>
          <span className="text-[10px] font-mono text-blue-300">First Pick</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, idx) => {
            const player = lobby.blue_team.find((p) => p.slot_index === idx);
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  player
                    ? "bg-blue-950/40 border-blue-500/40 text-blue-200"
                    : "bg-[#0B0E14] border-dashed border-white/10 hover:border-blue-500/50 cursor-pointer"
                }`}
                onClick={() => !player && handleClaimSlot(idx)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono text-xs font-bold text-blue-400">
                    B{idx + 1}
                  </span>
                  {player ? (
                    <div>
                      <span className="text-xs font-bold text-white">{player.nickname}</span>
                      <div className="mt-0.5">
                        <RankBadge rank={player.rank} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      + Tap to Claim Blue Slot ({selectedRole})
                    </span>
                  )}
                </div>

                {player && <RoleBadge role={player.selected_role} size="sm" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Red Team (5 Slots) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            RED SIDE ({lobby.red_team.length} / 5)
          </h3>
          <span className="text-[10px] font-mono text-rose-300">Counter Pick</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, idx) => {
            const actualSlot = idx + 5;
            const player = lobby.red_team.find((p) => p.slot_index === actualSlot);
            return (
              <div
                key={actualSlot}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  player
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : "bg-[#0B0E14] border-dashed border-white/10 hover:border-rose-500/50 cursor-pointer"
                }`}
                onClick={() => !player && handleClaimSlot(actualSlot)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-mono text-xs font-bold text-rose-400">
                    R{idx + 1}
                  </span>
                  {player ? (
                    <div>
                      <span className="text-xs font-bold text-white">{player.nickname}</span>
                      <div className="mt-0.5">
                        <RankBadge rank={player.rank} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      + Tap to Claim Red Slot ({selectedRole})
                    </span>
                  )}
                </div>

                {player && <RoleBadge role={player.selected_role} size="sm" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Room Credentials Card */}
      {lobby.custom_room_id ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 flex flex-col gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold uppercase text-white">
                MLBB Custom Room Credentials
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
              LOBBY ACTIVE
            </span>
          </div>

          <div className="p-3 bg-[#0B0E14] border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Room ID:</span>
                <span className="font-mono font-black text-base text-white">
                  {lobby.custom_room_id}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400">Password:</span>
                <span className="font-mono font-black text-base text-cyan-300">
                  {lobby.custom_room_password}
                </span>
              </div>
            </div>

            <button
              onClick={copyCreds}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors cursor-pointer"
            >
              {copiedKey ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : isFull ? (
        /* Host Form to Reveal Room ID */
        <form
          onSubmit={handleRevealCreds}
          className="p-4 rounded-2xl bg-[#161E2E] border border-amber-500/40 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase">
              Slots Filled! Reveal MLBB Room Details
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              required
              placeholder="Password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={revealing}
            className="py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {revealing ? "BROADCASTING..." : "REVEAL ROOM ID TO PLAYERS"}
          </button>
        </form>
      ) : (
        <div className="p-3 bg-[#0B0E14] border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-slate-600" />
          <span>Room credentials will be revealed by the host once all 10 slots are occupied.</span>
        </div>
      )}
    </div>
  );
}

