"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Swords,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Key,
  Copy,
  Check,
  ChevronLeft,
  Share2,
  ShieldCheck,
  Zap
} from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { ReadyModal } from "@/components/ui/ReadyModal";
import { Scrim } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

export default function ScrimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scrimId = params.id as string;

  const [scrim, setScrim] = useState<Scrim | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Captain Room Credentials Input State
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [submittingCreds, setSubmittingCreds] = useState(false);

  useEffect(() => {
    loadScrim();
  }, [scrimId]);

  const loadScrim = async () => {
    try {
      const data = await api.getScrim(scrimId);
      setScrim(data);
    } catch {
      // Mock scrim with pending ready check
      setScrim({
        id: scrimId,
        host_team_id: "team-1",
        host_team_name: "Apex Legends",
        host_team_tag: "APEX",
        challenger_team_id: "team-2",
        challenger_team_name: "Shadow Syndicate",
        challenger_team_tag: "SHDW",
        target_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        target_rank: "Mythic Glory",
        format: "BO3",
        status: "ready_check_pending",
        custom_room_id: "904128",
        custom_room_password: "777",
        total_confirmed: 8,
        total_required: 10,
        ready_checks: [
          { user_id: 1, nickname: "ViperKing", team_id: "team-1", is_ready: true },
          { user_id: 2, nickname: "AuraRoam", team_id: "team-1", is_ready: true },
          { user_id: 3, nickname: "GoldRush", team_id: "team-1", is_ready: true },
          { user_id: 4, nickname: "MageSupreme", team_id: "team-1", is_ready: true },
          { user_id: 5, nickname: "IronWall", team_id: "team-1", is_ready: true },
          { user_id: 6, nickname: "ShadowAce", team_id: "team-2", is_ready: true },
          { user_id: 7, nickname: "NightStalker", team_id: "team-2", is_ready: true },
          { user_id: 8, nickname: "PhantomMid", team_id: "team-2", is_ready: true },
          { user_id: 9, nickname: "SilentRoam", team_id: "team-2", is_ready: false },
          { user_id: 10, nickname: "DarkGold", team_id: "team-2", is_ready: false },
        ],
        notes: "Strict 5m Ready Check window. No toxic banter.",
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReady = async () => {
    try {
      await api.confirmReady(scrimId);
      setIsConfirmed(true);
      if (scrim) {
        setScrim({
          ...scrim,
          total_confirmed: Math.min(10, scrim.total_confirmed + 1),
        });
      }
    } catch {
      setIsConfirmed(true);
      if (scrim) {
        setScrim({
          ...scrim,
          total_confirmed: Math.min(10, scrim.total_confirmed + 1),
        });
      }
    }
  };

  const handleTriggerReadyCheck = async () => {
    triggerHaptic("heavy");
    try {
      await api.triggerReadyCheck(scrimId);
      triggerHaptic("success");
      setShowReadyModal(true);
      loadScrim();
    } catch (e: any) {
      alert(e.message || "Ready check triggered");
    }
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("heavy");
    setSubmittingCreds(true);
    try {
      await api.submitScrimCredentials(scrimId, {
        custom_room_id: roomId,
        custom_room_password: roomPassword,
      });
      triggerHaptic("success");
      loadScrim();
    } catch (e: any) {
      alert(e.message || "Broadcast credentials");
    } finally {
      setSubmittingCreds(false);
    }
  };

  const copyCredentials = () => {
    if (!scrim?.custom_room_id) return;
    triggerHaptic("medium");
    navigator.clipboard.writeText(`Room: ${scrim.custom_room_id} | Pass: ${scrim.custom_room_password}`);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  if (loading || !scrim) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading Scrim Details...</div>;
  }

  const isAllReady = scrim.total_confirmed >= 10 || scrim.status === "ready_check_confirmed" || scrim.status === "in_progress";

  return (
    <div className="flex flex-col gap-4">
      {/* Header Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Scrims</span>
        </button>
        <RankBadge rank={scrim.target_rank} />
      </div>

      {/* Matchup Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
            {scrim.format} SERIES
          </span>
          <span className="font-mono font-medium">
            {new Date(scrim.target_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Versus Teams */}
        <div className="grid grid-cols-5 items-center text-center my-1">
          <div className="col-span-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl neumo-inset flex items-center justify-center font-mono font-black text-white text-sm mb-1">
              {scrim.host_team_tag || "HOST"}
            </div>
            <span className="text-xs font-black text-white">{scrim.host_team_name}</span>
            <span className="text-[10px] text-slate-400">Host Team</span>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <span className="text-base font-black text-rose-500 font-mono">VS</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Custom 5v5</span>
          </div>

          <div className="col-span-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-black text-purple-300 text-sm mb-1">
              {scrim.challenger_team_tag || "RIVAL"}
            </div>
            <span className="text-xs font-black text-white">
              {scrim.challenger_team_name || "Challenger"}
            </span>
            <span className="text-[10px] text-slate-400">Rival Team</span>
          </div>
        </div>

        {scrim.notes && (
          <p className="text-[11px] text-slate-400 border-t border-white/5 pt-2 italic">
            "{scrim.notes}"
          </p>
        )}
      </div>

      {/* Automated Ready Check System Banner */}
      <div className="p-4 rounded-2xl neumo-card border border-white/10 flex flex-col gap-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-extrabold uppercase tracking-wide text-white">
              10-Player Ready Check
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-white">
            {scrim.total_confirmed} / 10 Confirmed
          </span>
        </div>

        {/* 10 Player Slots Visual Bar */}
        <div className="grid grid-cols-10 gap-1 my-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < scrim.total_confirmed ? "bg-white/90" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Roster Readiness List */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {scrim.ready_checks.map((rc) => (
            <div
              key={rc.user_id}
              className={`p-2 rounded-lg border flex items-center justify-between ${
                rc.is_ready
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-[#0B0E14] border-white/5 text-slate-400"
              }`}
            >
              <span className="truncate font-medium">{rc.nickname}</span>
              {rc.is_ready ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-[9px] text-amber-400 font-mono">WAITING</span>
              )}
            </div>
          ))}
        </div>

        {/* Ready Action Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setShowReadyModal(true)}
            className="flex-1 py-3 bg-white hover:bg-slate-200 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM READY / TASDIQLASH</span>
          </button>

          <button
            onClick={handleTriggerReadyCheck}
            className="px-3 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 text-xs font-bold transition-all cursor-pointer"
            title="Ping 10 Players via Bot"
          >
            <Zap className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Room ID & Password Distribution */}
      {isAllReady ? (
        <div className="p-4 rounded-2xl bg-[#141A24] border border-emerald-500/30 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-white">
                MLBB Custom Room Credentials
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              VERIFIED 10/10
            </span>
          </div>

          {scrim.custom_room_id ? (
            <div className="p-3 bg-[#0B0E14] border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Room ID:</span>
                  <span className="font-mono font-black text-base text-white">
                    {scrim.custom_room_id}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">Password:</span>
                  <span className="font-mono font-black text-base text-amber-300">
                    {scrim.custom_room_password}
                  </span>
                </div>
              </div>

              <button
                onClick={copyCredentials}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors cursor-pointer"
              >
                {copiedKey ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            /* Host Captain Credentials Submission Form */
            <form onSubmit={handleSubmitCredentials} className="flex flex-col gap-2 pt-1">
              <p className="text-[11px] text-slate-300">
                Captain, please submit your MLBB Custom Room details to broadcast them immediately
                to the opposing squad:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Room ID (e.g. 984021)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Password (e.g. 777)"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingCreds}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {submittingCreds ? "BROADCASTING..." : "BROADCAST ROOM DETAILS TO PLAYERS"}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="p-3 bg-[#0B0E14] border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Key className="w-4 h-4 text-slate-600" />
          <span>Room credentials unlock automatically when all 10 players confirm ready.</span>
        </div>
      )}

      {/* Ready Modal */}
      <ReadyModal
        isOpen={showReadyModal}
        onClose={() => setShowReadyModal(false)}
        onConfirm={handleConfirmReady}
        isConfirmed={isConfirmed}
        totalConfirmed={scrim.total_confirmed}
        totalRequired={10}
        matchTitle={`${scrim.host_team_tag} vs ${scrim.challenger_team_tag || "RIVAL"} (${scrim.format})`}
      />
    </div>
  );
}

