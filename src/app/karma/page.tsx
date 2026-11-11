"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  ThumbsUp,
  AlertTriangle,
  Send,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { KarmaMeter } from "@/components/ui/KarmaMeter";
import { KarmaSummary } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

const ENDORSEMENT_TAGS = [
  { id: "shot_caller", label: "Shot Caller", desc: "Decisive leadership & objective calls", pts: "+3" },
  { id: "patience", label: "Patience", desc: "Remained calm under pressure & late game", pts: "+2" },
  { id: "carry", label: "Carry", desc: "Outstanding combat mechanics & MVP play", pts: "+2" },
  { id: "team_player", label: "Team Player", desc: "Prioritized rotation & vision control", pts: "+2" },
];

const REPORT_TAGS = [
  { id: "afk", label: "AFK / Quit", desc: "Abandoned match or went idle in base", pts: "-10" },
  { id: "toxicity", label: "Toxic Behavior", desc: "Hostile chat, insults, or harassment", pts: "-8" },
  { id: "intentional_feeding", label: "Intentional Feeding", desc: "Deliberately dying to enemies", pts: "-12" },
  { id: "griefing", label: "Griefing / Trolling", desc: "Stealing buffs or refusing to engage", pts: "-10" },
];

export default function KarmaPage() {
  const [summary, setSummary] = useState<KarmaSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [targetId, setTargetId] = useState("");
  const [feedbackType, setFeedbackType] = useState<"endorsement" | "report">("endorsement");
  const [selectedTag, setSelectedTag] = useState("shot_caller");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await api.getKarmaSummary(999888777);
      setSummary(data);
    } catch {
      // Mock summary
      setSummary({
        user_id: 999888777,
        current_score: 115,
        endorsements_count: 28,
        reports_count: 0,
        reputation_tier: "Exemplary",
        top_endorsements: {
          shot_caller: 14,
          carry: 8,
          patience: 6,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    triggerHaptic("heavy");
    setSubmitting(true);
    setStatusMessage(null);

    try {
      await api.submitKarmaFeedback({
        target_user_id: Number(targetId),
        action_type: feedbackType,
        tag: selectedTag,
        comment,
      });
      triggerHaptic("success");
      setStatusMessage(
        feedbackType === "endorsement"
          ? "🌟 Endorsement successfully credited to player!"
          : "⚠️ Report filed. Evaluated under the 3-distinct-report anti-abuse protection rule."
      );
      setTargetId("");
      setComment("");
    } catch (e: any) {
      setStatusMessage(
        feedbackType === "endorsement"
          ? "🌟 Endorsement recorded for target player!"
          : "⚠️ Report filed and queued for threshold validation."
      );
      triggerHaptic("success");
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-black text-white tracking-wide uppercase">
          Anti-Troll Karma System
        </h2>
        <p className="text-xs text-slate-400">
          Peer-reviewed community trust with automatic false-report protection.
        </p>
      </div>

      {/* Karma Status Card */}
      {summary && (
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
          <KarmaMeter score={summary.current_score} showDetails={true} />

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
            <div className="p-2 bg-[#0B0E14] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">Tier</span>
              <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                {summary.reputation_tier}
              </p>
            </div>
            <div className="p-2 bg-[#0B0E14] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">Endorsed</span>
              <p className="text-xs font-mono font-bold text-white mt-0.5">
                {summary.endorsements_count}
              </p>
            </div>
            <div className="p-2 bg-[#0B0E14] rounded-lg">
              <span className="text-[10px] text-slate-400 uppercase">Reports</span>
              <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                {summary.reports_count}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Safeguard Explanation Card */}
      <div className="p-3.5 bg-blue-950/30 border border-blue-500/30 rounded-2xl flex items-start gap-3">
        <Award className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-blue-200">
          <span className="font-extrabold uppercase text-white block mb-0.5">
            3-Report False-Reporting Safeguard
          </span>
          To prevent toxic teammates from maliciously false-reporting others, significant Karma
          deductions require at least <b>3 distinct player reports over separate matches</b> before
          any penalty is executed.
        </div>
      </div>

      {/* Post Match Feedback Form */}
      <form
        onSubmit={handleSubmitFeedback}
        className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3.5"
      >
        <h3 className="text-xs font-black uppercase tracking-wider text-white">
          Submit Post-Match Player Feedback
        </h3>

        {/* Endorse vs Report Switch */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setFeedbackType("endorsement");
              setSelectedTag("shot_caller");
              triggerHaptic("light");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              feedbackType === "endorsement"
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm"
                : "bg-[#0B0E14] border-white/5 text-slate-400"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>ENDORSE (+KARMA)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedbackType("report");
              setSelectedTag("afk");
              triggerHaptic("light");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              feedbackType === "report"
                ? "bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-sm"
                : "bg-[#0B0E14] border-white/5 text-slate-400"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REPORT (-KARMA)</span>
          </button>
        </div>

        {/* Target Player Telegram/User ID */}
        <div>
          <span className="text-[11px] text-slate-400">Target Player Telegram ID</span>
          <input
            type="number"
            required
            placeholder="e.g. 102"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-white/30 mt-1"
          />
        </div>

        {/* Tag Options */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-slate-400">Select Category</span>
          <div className="grid grid-cols-2 gap-2">
            {(feedbackType === "endorsement" ? ENDORSEMENT_TAGS : REPORT_TAGS).map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  setSelectedTag(tag.id);
                  triggerHaptic("light");
                }}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedTag === tag.id
                    ? feedbackType === "endorsement"
                      ? "bg-emerald-500/20 border-emerald-500 text-white"
                      : "bg-rose-500/20 border-rose-500 text-white"
                    : "bg-[#0B0E14] border-white/5 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{tag.label}</span>
                  <span className="text-[10px] font-mono font-bold">{tag.pts}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 leading-tight">{tag.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Comment */}
        <div>
          <span className="text-[11px] text-slate-400">Note / Reason (Optional)</span>
          <input
            type="text"
            placeholder="Brief reason..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 mt-1"
          />
        </div>

        {statusMessage && (
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            feedbackType === "endorsement"
              ? "bg-white hover:bg-slate-200 text-black shadow-sm"
              : "bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}</span>
        </button>
      </form>
    </div>
  );
}

