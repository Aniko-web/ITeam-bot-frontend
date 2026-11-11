"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertTriangle, Shield, Check } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";

interface ReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isConfirmed: boolean;
  totalConfirmed: number;
  totalRequired: number;
  deadline?: string;
  matchTitle?: string;
}

export const ReadyModal: React.FC<ReadyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isConfirmed,
  totalConfirmed,
  totalRequired = 10,
  matchTitle = "BO3 Ranked Scrim",
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleConfirm = async () => {
    triggerHaptic("heavy");
    setLoading(true);
    try {
      await onConfirm();
      triggerHaptic("success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm neumo-card p-5 border border-white/10 shadow-2xl text-center relative overflow-hidden">
        {/* Clean Specular Top Highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="w-12 h-12 rounded-full neumo-inset flex items-center justify-center mx-auto mb-3">
          <Clock className="w-5 h-5 text-slate-300" />
        </div>

        <h3 className="text-lg font-bold text-white tracking-wide uppercase">
          Match Ready Check
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{matchTitle}</p>

        {/* Countdown Timer */}
        <div className="my-5 py-3 px-4 neumo-inset rounded-xl inline-block mx-auto">
          <span className="text-3xl font-mono font-black tracking-wider text-white">
            {timeString}
          </span>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
            Time Remaining
          </p>
        </div>

        {/* 10 Player Slots Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Roster Check-in</span>
            <span className="font-mono font-semibold text-white">
              {totalConfirmed} / {totalRequired} Confirmed
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalRequired }).map((_, i) => {
              const isChecked = i < totalConfirmed;
              return (
                <div
                  key={i}
                  className={`h-8 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                    isChecked
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-[#0B0E14] border-white/10 text-white/20"
                  }`}
                >
                  {isChecked ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="text-xs font-mono font-semibold">#{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 mb-5 flex items-start gap-2 text-left">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-300 leading-tight">
            Failure to confirm within the window auto-cancels the scrim and applies a -5 Karma
            penalty.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isConfirmed ? (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-extrabold rounded-xl shadow-lg tracking-wide active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{loading ? "CONFIRMING..." : "CONFIRM READY (TASDIQLASH)"}</span>
            </button>
          ) : (
            <div className="py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              YOU ARE READY! WAITING FOR OTHERS...
            </div>
          )}

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white py-1.5 transition-colors"
          >
            Dismiss View
          </button>
        </div>
      </div>
    </div>
  );
};

