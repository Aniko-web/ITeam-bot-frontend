import React from "react";
import { ShieldCheck, ShieldAlert, Award } from "lucide-react";

interface KarmaMeterProps {
  score: number;
  showDetails?: boolean;
}

export const KarmaMeter: React.FC<KarmaMeterProps> = ({ score, showDetails = false }) => {
  // Score bounds: 0 - 200
  const normalizedPercentage = Math.min(100, Math.max(0, (score / 200) * 100));

  const getTier = (s: number) => {
    if (s >= 130) return { label: "Elite Captain", color: "text-purple-400", bar: "bg-purple-500" };
    if (s >= 90) return { label: "Exemplary", color: "text-emerald-400", bar: "bg-emerald-500" };
    if (s >= 60) return { label: "Standard", color: "text-blue-400", bar: "bg-blue-500" };
    if (s >= 30) return { label: "Warning", color: "text-amber-400", bar: "bg-amber-500" };
    return { label: "Restricted", color: "text-rose-400", bar: "bg-rose-500" };
  };

  const tier = getTier(score);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          {score >= 60 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          )}
          Trust Score
        </span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className={`font-semibold ${tier.color}`}>{tier.label}</span>
          <span className="text-white/40">|</span>
          <span className="font-bold text-white">{score}</span>
          <span className="text-white/40 text-[10px]">/200</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tier.bar}`}
          style={{ width: `${normalizedPercentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>Anti-Troll Shield Active</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Award className="w-3 h-3 text-cyan-400" />
            3-Report False-Report Guard
          </span>
        </div>
      )}
    </div>
  );
};

