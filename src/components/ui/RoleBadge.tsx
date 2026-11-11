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
          color: "border-purple-500/20 text-purple-300 bg-purple-500/10",
          selectedColor: "border-white/30 bg-purple-900/30 text-white shadow-sm",
          label: isRu ? "Лес" : "Jungler",
        };
      case "mid laner":
      case "mid":
        return {
          iconSrc: "/lanes/mid.png",
          color: "border-blue-500/20 text-blue-300 bg-blue-500/10",
          selectedColor: "border-white/30 bg-blue-900/30 text-white shadow-sm",
          label: isRu ? "Мид" : "Mid Laner",
        };
      case "exp laner":
      case "exp":
        return {
          iconSrc: "/lanes/exp.png",
          color: "border-amber-500/20 text-amber-300 bg-amber-500/10",
          selectedColor: "border-white/30 bg-amber-900/30 text-white shadow-sm",
          label: isRu ? "Опыт" : "Exp Laner",
        };
      case "gold laner":
      case "gold":
        return {
          iconSrc: "/lanes/gold.png",
          color: "border-yellow-500/20 text-yellow-300 bg-yellow-500/10",
          selectedColor: "border-white/30 bg-yellow-900/30 text-white shadow-sm",
          label: isRu ? "Золото" : "Gold Laner",
        };
      case "roamer":
      case "roam":
        return {
          iconSrc: "/lanes/roam.png",
          color: "border-emerald-500/20 text-emerald-300 bg-emerald-500/10",
          selectedColor: "border-white/30 bg-emerald-900/30 text-white shadow-sm",
          label: isRu ? "Роум" : "Roamer",
        };
      default:
        return {
          iconSrc: "/lanes/roam.png",
          color: "border-white/15 text-slate-300 bg-white/5",
          selectedColor: "border-white/30 bg-white/15 text-white shadow-sm",
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
