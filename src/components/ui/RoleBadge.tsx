import React from "react";
import { MLBB_Role } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

interface RoleBadgeProps {
  role: MLBB_Role | string;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
  lang?: "uz" | "ru" | "en";
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = "md",
  selected = false,
  onClick,
  lang: propLang,
}) => {
  const { language: contextLang } = useLanguage();
  const lang = propLang || contextLang || "uz";
  const getRoleConfig = (r: string) => {
    const isRu = lang === "ru";
    switch (r.toLowerCase()) {
      case "jungler":
      case "jungle":
        return {
          iconSrc: "/lanes/jungle.png",
          color: "border-purple-500/30 text-purple-300 bg-purple-500/10",
          selectedColor: "border-purple-500 bg-purple-500/25 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]",
          label: isRu ? "Лес" : "Jungler",
        };
      case "mid laner":
      case "mid":
        return {
          iconSrc: "/lanes/mid.png",
          color: "border-blue-500/30 text-blue-300 bg-blue-500/10",
          selectedColor: "border-blue-500 bg-blue-500/25 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]",
          label: isRu ? "Мид" : "Mid Laner",
        };
      case "exp laner":
      case "exp":
        return {
          iconSrc: "/lanes/exp.png",
          color: "border-amber-500/30 text-amber-300 bg-amber-500/10",
          selectedColor: "border-amber-500 bg-amber-500/25 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]",
          label: isRu ? "Опыт" : "Exp Laner",
        };
      case "gold laner":
      case "gold":
        return {
          iconSrc: "/lanes/gold.png",
          color: "border-yellow-500/30 text-yellow-300 bg-yellow-500/10",
          selectedColor: "border-yellow-500 bg-yellow-500/25 text-white shadow-[0_0_12px_rgba(234,179,8,0.4)]",
          label: isRu ? "Золото" : "Gold Laner",
        };
      case "roamer":
      case "roam":
        return {
          iconSrc: "/lanes/roam.png",
          color: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
          selectedColor: "border-emerald-500 bg-emerald-500/25 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]",
          label: isRu ? "Роум" : "Roamer",
        };
      default:
        return {
          iconSrc: "/lanes/roam.png",
          color: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
          selectedColor: "border-cyan-500 bg-cyan-500/25 text-white",
          label: r,
        };
    }
  };

  const config = getRoleConfig(role);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-semibold flex items-center transition-all ${sizeClasses[size]} ${
        selected ? config.selectedColor : config.color
      } ${onClick ? "cursor-pointer active:scale-95 hover:border-white/40" : "cursor-default"}`}
    >
      <img
        src={config.iconSrc}
        alt={config.label}
        className={`${iconSizes[size]} object-contain opacity-90`}
      />
      <span>{config.label}</span>
    </button>
  );
};
