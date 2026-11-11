"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, ArrowRight, Plus, Hash } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";

export default function PvPLobbyIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    triggerHaptic("heavy");
    router.push(`/pvp/${code.trim().toUpperCase()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-black text-white tracking-wide uppercase">
          Community PvP Lobbies
        </h2>
        <p className="text-xs text-slate-400">
          5v5 custom matches created by Telegram Bot admins via /create_pvp.
        </p>
      </div>

      {/* Code Input Form */}
      <form onSubmit={handleJoinByCode} className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-amber-400" />
          Enter Lobby Code
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            required
            maxLength={8}
            placeholder="e.g. E8A1B2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="flex-1 bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono font-black text-white tracking-widest focus:outline-none focus:border-amber-500 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-white hover:bg-slate-200 text-black text-xs font-black rounded-xl tracking-wider shadow-sm transition-all cursor-pointer"
          >
            JOIN LOBBY
          </button>
        </div>
      </form>

      {/* Featured Community Lobby Card */}
      <div
        onClick={() => {
          triggerHaptic("light");
          router.push("/pvp/E8A1B2");
        }}
        className="glass-panel p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all card-hover cursor-pointer flex flex-col gap-3 relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                CODE: E8A1B2
              </span>
              <h3 className="font-extrabold text-white text-base">Uzbekistan 5v5 Custom</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Community custom battle. 5 slots remaining.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            5 / 10 Filled
          </span>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
          <span className="text-slate-400 text-[11px]">Format: BO1 Draft Pick</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
            <span>Enter Lobby</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* How it works info card */}
      <div className="p-3.5 bg-[#0B0E14] border border-white/5 rounded-2xl flex flex-col gap-2 text-xs text-slate-400">
        <span className="font-bold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          How to host your own 5v5 lobby
        </span>
        <p className="leading-relaxed text-[11px]">
          1. Add the Telegram Bot to your Telegram Group or Channel.<br />
          2. Type <code className="text-amber-300 font-mono">/create_pvp</code>.<br />
          3. The bot will reply with a branded Mini App launch card for players to pick their lane.
        </p>
      </div>
    </div>
  );
}

