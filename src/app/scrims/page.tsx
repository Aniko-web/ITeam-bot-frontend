"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Swords, Plus, Clock, Trophy, ArrowRight, ShieldAlert } from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { Scrim, MLBB_Rank } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

export default function ScrimsPage() {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Scrim Form
  const [format, setFormat] = useState<"BO1" | "BO3" | "BO5">("BO3");
  const [targetRank, setTargetRank] = useState<MLBB_Rank>("Mythic Glory");
  const [targetTime, setTargetTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScrims();
  }, []);

  const fetchScrims = async () => {
    try {
      const data = await api.getScrims();
      setScrims(data);
    } catch {
      // Mock scrims for instant preview
      setScrims([
        {
          id: "scrim-101",
          host_team_id: "team-1",
          host_team_name: "Apex Legends",
          host_team_tag: "APEX",
          challenger_team_id: "team-2",
          challenger_team_name: "Shadow Syndicate",
          challenger_team_tag: "SHDW",
          target_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          target_rank: "Mythic Glory",
          format: "BO3",
          status: "ready_check_pending",
          ready_checks: [],
          total_confirmed: 7,
          total_required: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: "scrim-102",
          host_team_id: "team-3",
          host_team_name: "Tashkent Titans",
          host_team_tag: "TTN",
          target_time: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          target_rank: "Mythic Honor",
          format: "BO3",
          status: "open",
          ready_checks: [],
          total_confirmed: 0,
          total_required: 10,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScrim = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("heavy");
    setSubmitting(true);
    try {
      const created = await api.createScrim({
        target_time: targetTime || new Date(Date.now() + 3600000).toISOString(),
        target_rank: targetRank,
        format,
        notes,
      });
      setScrims([created, ...scrims]);
      setShowCreateModal(false);
      triggerHaptic("success");
    } catch (e: any) {
      alert(e.message || "Failed to create scrim listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase">
            Scrim Practice Finder
          </h2>
          <p className="text-xs text-slate-400">
            Automated 10-player Ready Checks exactly 10m before match.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            triggerHaptic("medium");
          }}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-200 text-black text-xs font-extrabold rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>POST SCRIM</span>
        </button>
      </div>

      {/* Scrim Listings */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading scrim listings...</div>
        ) : scrims.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-white/5">
            No active scrims scheduled. Post one to invite opposing captains!
          </div>
        ) : (
          scrims.map((s) => {
            const isReadyCheck = s.status === "ready_check_pending";
            return (
              <Link
                key={s.id}
                href={`/scrims/${s.id}`}
                onClick={() => triggerHaptic("light")}
                className={`neumo-card p-4 transition-all card-hover flex flex-col gap-3 group ${
                  isReadyCheck
                    ? "border-amber-500/40"
                    : "hover:border-white/20"
                }`}
              >
                {/* Status & Format */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {s.format}
                    </span>
                    <RankBadge rank={s.target_rank} />
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isReadyCheck
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : s.status === "open"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-purple-500/20 border-purple-500 text-purple-300"
                    }`}
                  >
                    {isReadyCheck ? "⚔️ READY CHECK LIVE" : s.status.replace("_", " ")}
                  </span>
                </div>

                {/* Matchup Header */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">
                      [{s.host_team_tag || "HOST"}] {s.host_team_name || "Host Squad"}
                    </span>
                  </div>

                  <span className="text-xs font-black text-rose-400 font-mono">VS</span>

                  <div className="flex items-center gap-2 text-right">
                    <span className="font-extrabold text-white text-base">
                      {s.challenger_team_tag
                        ? `[${s.challenger_team_tag}] ${s.challenger_team_name}`
                        : "Waiting Challenger"}
                    </span>
                  </div>
                </div>

                {/* Ready Check Progress if active */}
                {isReadyCheck && (
                  <div className="p-2.5 neumo-inset rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300 animate-spin" />
                      10-Player Confirmation
                    </span>
                    <span className="text-xs font-mono font-extrabold text-white">
                      {s.total_confirmed} / {s.total_required} Ready
                    </span>
                  </div>
                )}

                {/* Footer Time */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(s.target_time).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1 text-white font-bold text-xs">
                    <span>Enter Hub</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Post Scrim Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#111722] border border-rose-500/30 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-3">
              Post Scrim Challenge
            </h3>

            <form onSubmit={handleCreateScrim} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400">Match Format</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500 mt-1"
                  >
                    <option value="BO1">BO1 (Single)</option>
                    <option value="BO3">BO3 (Best of 3)</option>
                    <option value="BO5">BO5 (Best of 5)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Target Rank Tier</span>
                  <select
                    value={targetRank}
                    onChange={(e) => setTargetRank(e.target.value as any)}
                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500 mt-1"
                  >
                    <option value="Mythic Immortal">Mythic Immortal</option>
                    <option value="Mythic Glory">Mythic Glory</option>
                    <option value="Mythic Honor">Mythic Honor</option>
                    <option value="Mythic">Mythic</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Target Match Date & Time</span>
                <input
                  type="datetime-local"
                  required
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 mt-1"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Notes / Rules</span>
                <textarea
                  rows={2}
                  placeholder="e.g. Draft pick, no pauses unless technical"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 mt-1"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black tracking-wider cursor-pointer"
                >
                  {submitting ? "POSTING..." : "SCHEDULE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

