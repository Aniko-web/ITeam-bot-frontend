import React from "react";
import { MLBB_Rank } from "@/lib/types";

interface RankBadgeProps {
  rank: MLBB_Rank | string;
  stars?: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  stars,
  showIcon = true,
  size = "md",
}) => {
  const getRankConfig = (r: string) => {
    const normalized = (r || "").toLowerCase().trim();
    switch (normalized) {
      case "mythic immortal":
        return {
          icon: "/ranks/mythic_immortal.png",
          bg: "bg-[#182030] border-purple-500/30 text-purple-200",
          label: "Mythic Immortal",
        };
      case "mythic glory":
        return {
          icon: "/ranks/mythic_glory.png",
          bg: "bg-[#182030] border-amber-500/30 text-amber-200",
          label: "Mythic Glory",
        };
      case "mythic honor":
        return {
          icon: "/ranks/mythic_honor.png",
          bg: "bg-[#182030] border-cyan-500/30 text-cyan-200",
          label: "Mythic Honor",
        };
      case "mythic":
        return {
          icon: "/ranks/mythic.png",
          bg: "bg-[#182030] border-rose-500/30 text-rose-200",
          label: "Mythic",
        };
      case "legend":
        return {
          icon: "/ranks/legend.png",
          bg: "bg-[#182030] border-yellow-500/30 text-yellow-200",
          label: "Legend",
        };
      case "epic":
        return {
          icon: "/ranks/epic.png",
          bg: "bg-[#182030] border-emerald-500/30 text-emerald-200",
          label: "Epic",
        };
      case "grandmaster":
        return {
          icon: "/ranks/grandmaster.png",
          bg: "bg-[#182030] border-slate-400/30 text-slate-200",
          label: "Grandmaster",
        };
      case "master":
        return {
          icon: "/ranks/master.png",
          bg: "bg-[#182030] border-amber-600/30 text-amber-200",
          label: "Master",
        };
      case "elite":
        return {
          icon: "/ranks/elite.png",
          bg: "bg-[#182030] border-blue-400/30 text-blue-200",
          label: "Elite",
        };
      case "warrior":
      default:
        return {
          icon: "/ranks/warrior.png",
          bg: "bg-[#182030] border-amber-700/30 text-amber-300",
          label: r || "Warrior",
        };
    }
  };

  const config = getRankConfig(rank);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border font-bold uppercase tracking-wider shadow-sm transition-all ${
        sizeClasses[size]
      } ${config.bg}`}
    >
      {showIcon && (
        <img
          src={config.icon}
          alt={config.label}
          className={`${iconSizes[size]} object-contain shrink-0`}
        />
      )}
      <span className="truncate">{rank}</span>
      {stars !== undefined && (
        <span className="text-[11px] font-mono text-white/90 border-l border-white/15 pl-1.5 ml-0.5 font-bold">
          ★ {stars}
        </span>
      )}
    </div>
  );
};
