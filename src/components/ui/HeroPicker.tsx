"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Sparkles, X, Search, Filter } from "lucide-react";
import { MLBB_HEROES, MLBB_Hero } from "@/lib/heroes";
import { triggerHaptic } from "@/lib/telegram";

interface HeroPickerProps {
  selectedHeroes: string[]; // List of hero names, e.g. ["Tigreal", "Chou", "Valentina"]
  onChange: (heroes: string[]) => void;
  lang?: "uz" | "ru" | "en";
}

export const HeroPicker: React.FC<HeroPickerProps> = ({
  selectedHeroes = [],
  onChange,
  lang = "uz",
}) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLane, setSelectedLane] = useState<string>("All");

  const toggleHero = (hero: MLBB_Hero) => {
    const heroName = hero.name.en;
    const isSelected = selectedHeroes.includes(heroName);

    if (isSelected) {
      triggerHaptic("light");
      onChange(selectedHeroes.filter((h) => h !== heroName));
      setWarningMessage(null);
    } else {
      if (selectedHeroes.length >= 3) {
        triggerHaptic("warning");
        const msg =
          lang === "uz"
            ? "Maksimal 3 ta asosiy qahramon tanlash mumkin!"
            : lang === "ru"
            ? "Можно выбрать максимум 3 основных героев!"
            : "Maximum 3 main heroes can be selected!";
        setWarningMessage(msg);
        setTimeout(() => setWarningMessage(null), 3000);
        return;
      }
      triggerHaptic("heavy");
      onChange([...selectedHeroes, heroName]);
      setWarningMessage(null);
    }
  };

  const removeHero = (heroName: string) => {
    triggerHaptic("light");
    onChange(selectedHeroes.filter((h) => h !== heroName));
    setWarningMessage(null);
  };

  const getTranslatedName = (hero: MLBB_Hero) => {
    return hero.name[lang] || hero.name.en;
  };

  // Filter heroes by search and lane
  const filteredHeroes = MLBB_HEROES.filter((hero) => {
    const matchesSearch =
      hero.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.name.ru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.name.uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLane = selectedLane === "All" || hero.lane === selectedLane;
    return matchesSearch && matchesLane;
  });

  const lanes = ["All", "Roam", "Exp", "Jungle", "Mid", "Gold"];

  const laneIcons: Record<string, string> = {
    Roam: "/lanes/roam.png",
    Exp: "/lanes/exp.png",
    Jungle: "/lanes/jungle.png",
    Mid: "/lanes/mid.png",
    Gold: "/lanes/gold.png",
  };

  const getLaneLabel = (lane: string) => {
    if (lane === "All") {
      return lang === "uz" ? "Barchasi" : lang === "ru" ? "Все" : "All";
    }
    if (lang === "ru") {
      switch (lane.toLowerCase()) {
        case "jungle": return "Лес";
        case "exp": return "Опыт";
        case "gold": return "Золото";
        case "roam": return "Роум";
        case "mid": return "Мид";
        default: return lane;
      }
    }
    return lane;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top Header & Slot Count */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>
            {lang === "uz"
              ? "Asosiy qahramonlar (Max 3 ta)"
              : lang === "ru"
              ? "Основные герои (Макс 3)"
              : "Main Heroes (Max 3)"}
          </span>
        </label>

        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
            selectedHeroes.length === 3
              ? "bg-white/10 border-white/25 text-white"
              : "bg-surface border-white/10 text-slate-400"
          }`}
        >
          {selectedHeroes.length} / 3
        </span>
      </div>

      {/* Selected Heroes Active Badges */}
      {selectedHeroes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap p-2.5 neumo-inset rounded-xl">
          {selectedHeroes.map((name) => {
            const heroObj = MLBB_HEROES.find((h) => h.name.en.toLowerCase() === name.toLowerCase());
            return (
              <div
                key={name}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-bold"
              >
                {heroObj && (
                  <img
                    src={heroObj.image}
                    alt={name}
                    className="w-4 h-4 rounded-full object-cover border border-white/30"
                  />
                )}
                <span>{heroObj ? getTranslatedName(heroObj) : name}</span>
                <button
                  type="button"
                  onClick={() => removeHero(name)}
                  className="p-0.5 hover:bg-white/20 rounded transition-colors text-slate-300 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Warning Alert if exceeded */}
      {warningMessage && (
        <div className="p-2.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Search Input & Lane Filter Pills */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              lang === "uz" ? "Qahramonni qidirish..." : lang === "ru" ? "Поиск героя..." : "Search hero..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {lanes.map((lane) => (
            <button
              key={lane}
              type="button"
              onClick={() => {
                setSelectedLane(lane);
                triggerHaptic("light");
              }}
              className={`px-2.5 py-1 rounded-full border whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedLane === lane
                  ? "bg-white/15 text-white border-white/40 font-bold shadow-sm"
                  : "bg-surface text-slate-400 border-white/5 hover:border-white/20"
              }`}
            >
              {laneIcons[lane] && (
                <img
                  src={laneIcons[lane]}
                  alt={lane}
                  className="w-3.5 h-3.5 object-contain opacity-90 invert-0"
                />
              )}
              <span>{getLaneLabel(lane)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Selection Grid (9 MLBB Heroes) */}
      <div className="grid grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredHeroes.map((hero) => {
          const isSelected = selectedHeroes.includes(hero.name.en);

          return (
            <button
              key={hero.id}
              type="button"
              onClick={() => toggleHero(hero)}
              className={`relative rounded-xl border p-2 flex flex-col items-center text-center transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? "bg-white/10 border-white/40 scale-[1.02] shadow-md"
                  : "bg-[#0B0E14] border-white/10 hover:border-white/25 active:scale-95"
              }`}
            >
              {/* Checkmark Tag */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Hero Image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 mb-1.5 mt-0.5 shadow-inner bg-slate-900">
                <img
                  src={hero.image}
                  alt={hero.name.en}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Names: English / Russian / Uzbek */}
              <span className="font-extrabold text-xs text-white tracking-wide truncate w-full">
                {getTranslatedName(hero)}
              </span>

              <span className="text-[9px] text-slate-400 font-medium truncate w-full">
                {lang === "ru" ? hero.name.en : hero.name.ru}
              </span>

              <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
                {laneIcons[hero.lane] && (
                  <img
                    src={laneIcons[hero.lane]}
                    alt={hero.lane}
                    className="w-2.5 h-2.5 object-contain opacity-80"
                  />
                )}
                <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400 truncate">
                  {getLaneLabel(hero.lane)} • {hero.role.split('/')[0].trim()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 leading-tight">
        {lang === "uz"
          ? "💡 Qahramon ustiga bosing va maksimal 3 ta asosiy geroyingizni belgilang."
          : lang === "ru"
          ? "💡 Нажмите на героя, чтобы выбрать (максимум 3 основных персонажа)."
          : "💡 Tap on any hero to mark them as your main (up to 3 heroes)."}
      </p>
    </div>
  );
};
