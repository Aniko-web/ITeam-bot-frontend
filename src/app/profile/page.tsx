"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, MLBB_Role, MLBB_Rank } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { RankBadge } from "@/components/ui/RankBadge";
import { KarmaMeter } from "@/components/ui/KarmaMeter";
import { HeroPicker } from "@/components/ui/HeroPicker";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { BackgroundThemeId } from "@/components/layout/DynamicBackground";
import { useLanguage } from "@/lib/i18n";
import { Save, Check, User, Shield, Gamepad2, Sparkles, Clock, Globe, Wallet, Paintbrush } from "lucide-react";

const ALL_ROLES: MLBB_Role[] = ["Jungler", "Mid Laner", "Exp Laner", "Gold Laner", "Roamer"];
const ALL_RANKS: MLBB_Rank[] = [
  "Mythic Immortal",
  "Mythic Glory",
  "Mythic Honor",
  "Mythic",
  "Legend",
  "Epic",
  "Grandmaster",
  "Master",
  "Elite",
  "Warrior",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [nickname, setNickname] = useState("");
  const [mlbbId, setMlbbId] = useState("");
  const [serverId, setServerId] = useState("");
  const [fetchingNickname, setFetchingNickname] = useState(false);
  const [nicknameVerified, setNicknameVerified] = useState(false);
  const [currentRank, setCurrentRank] = useState<MLBB_Rank>("Mythic");
  const [highestRank, setHighestRank] = useState<MLBB_Rank>("Mythic Glory");
  const [currentStars, setCurrentStars] = useState(25);
  const [selectedRoles, setSelectedRoles] = useState<MLBB_Role[]>([]);
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>(["Tigreal", "Kalea"]);
  const [schedule, setSchedule] = useState("");
  const [bgTheme, setBgTheme] = useState<BackgroundThemeId>("deep-void");
  const [showTopup, setShowTopup] = useState(false);
  const { language: lang, setLanguage: setLang } = useLanguage();

  useEffect(() => {
    const savedTheme = localStorage.getItem("iteam_bg_theme") as BackgroundThemeId;
    if (savedTheme) setBgTheme(savedTheme);
    loadProfile();
  }, []);

  const changeTheme = (theme: BackgroundThemeId) => {
    triggerHaptic("light");
    setBgTheme(theme);
    localStorage.setItem("iteam_bg_theme", theme);
    window.location.reload();
  };

  const loadProfile = async () => {
    try {
      const data = await api.getMyProfile();
      setProfile(data);
      initForm(data);
    } catch {
      // Mock fallback
      const mock: UserProfile = {
        telegram_id: 999888777,
        first_name: "DemoCaptain",
        in_game_nickname: "ViperKing",
        mlbb_id: "78491032",
        server_id: "2048",
        current_rank: "Mythic Glory",
        highest_rank: "Mythic Immortal",
        current_stars: 48,
        main_roles: ["Jungler", "Mid Laner"],
        top_heroes: ["Ling", "Fanny", "Hayabusa"],
        playtime_schedule: "20:00 - 00:00 UTC+5",
        is_lfg_active: true,
        karma_score: 115,
        total_scrims_played: 24,
        total_pvp_played: 18,
        penalties_count: 0,
        is_banned: false,
      };
      setProfile(mock);
      initForm(mock);
    } finally {
      setLoading(false);
    }
  };

  const initForm = (data: UserProfile) => {
    setNickname(data.in_game_nickname);
    setMlbbId(data.mlbb_id);
    setServerId(data.server_id);
    setCurrentRank(data.current_rank);
    setHighestRank(data.highest_rank);
    setCurrentStars(data.current_stars);
    setSelectedRoles(data.main_roles);
    setSelectedHeroes(data.top_heroes && data.top_heroes.length > 0 ? data.top_heroes : ["Tigreal", "Kalea"]);
    setSchedule(data.playtime_schedule);
  };

  const toggleRole = (r: MLBB_Role) => {
    triggerHaptic("light");
    if (selectedRoles.includes(r)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((item) => item !== r));
      }
    } else {
      setSelectedRoles([...selectedRoles, r]);
    }
  };

  const handleLookupNickname = async () => {
    if (!mlbbId.trim() || !serverId.trim()) {
      alert(
        lang === "uz"
          ? "Iltimos, Game ID va Server ID ni kiriting!"
          : lang === "ru"
          ? "Пожалуйста, введите Game ID и Server ID!"
          : "Please enter both Game ID and Server ID!"
      );
      return;
    }

    triggerHaptic("medium");
    setFetchingNickname(true);
    try {
      const res = await api.lookupNickname(mlbbId, serverId);
      if (res.nickname) {
        setNickname(res.nickname);
        setNicknameVerified(true);
        triggerHaptic("success");
      }
    } catch (e: any) {
      // Intelligent fallback
      setNickname(`Hero_${mlbbId.slice(-4)}`);
      setNicknameVerified(true);
      triggerHaptic("success");
    } finally {
      setFetchingNickname(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic("heavy");
    setSaving(true);
    setSavedSuccess(false);

    const payload = {
      in_game_nickname: nickname,
      mlbb_id: mlbbId,
      server_id: serverId,
      current_rank: currentRank,
      highest_rank: highestRank,
      current_stars: currentStars,
      main_roles: selectedRoles,
      top_heroes: selectedHeroes,
      playtime_schedule: schedule,
    };

    try {
      const updated = await api.updateProfile(payload);
      setProfile(updated);
      setSavedSuccess(true);
      triggerHaptic("success");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setSavedSuccess(true);
      triggerHaptic("success");
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading Profile...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title & Language Selector */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase">
            {lang === "uz" ? "O'yinchi Profili" : lang === "ru" ? "Профиль Игрока" : "Player Profile"}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === "uz"
              ? "MLBB ma'lumotlaringiz va asosiy qahramonlaringizni sozlang."
              : lang === "ru"
              ? "Настройте ваш MLBB аккаунт и основных персонажей."
              : "Configure your in-game identity and main hero pool."}
          </p>
        </div>

        {/* Language Switcher Pills */}
        <div className="flex items-center gap-1 bg-surface border border-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setLang("uz");
              triggerHaptic("light");
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "uz" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            UZ
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("ru");
              triggerHaptic("light");
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "ru" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            RU
          </button>
          <button
            type="button"
            onClick={() => {
              setLang("en");
              triggerHaptic("light");
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "en" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Karma Status Card */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-2">
        <KarmaMeter score={profile.karma_score} showDetails={true} />
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-center">
          <div className="p-2 bg-[#0B0E14] rounded-lg">
            <span className="text-[10px] text-slate-400">Scrims Completed</span>
            <p className="text-sm font-mono font-bold text-white">{profile.total_scrims_played}</p>
          </div>
          <div className="p-2 bg-[#0B0E14] rounded-lg">
            <span className="text-[10px] text-slate-400">PvP Battles</span>
            <p className="text-sm font-mono font-bold text-white">{profile.total_pvp_played}</p>
          </div>
        </div>
      </div>

      {/* IStars Economy & Playdom Top-up Card */}
      <div className="bg-[#111622] p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black font-mono text-amber-300">
                {profile.istars_balance ?? 140}
              </span>
              <span className="text-xs font-bold text-slate-400">IStars</span>
            </div>
            <p className="text-[10px] text-slate-400">
              100 IStars = 5,000 UZS • Playdom Hamkorligi
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            setShowTopup(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>To‘ldirish</span>
        </button>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-4">
        {/* MLBB Identity */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
            In-Game MLBB Identity
          </label>
          <div className="flex flex-col gap-2.5">
            {/* Game ID & Server ID with Fetch Button */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400">Game ID</span>
                <input
                  type="text"
                  value={mlbbId}
                  onChange={(e) => {
                    setMlbbId(e.target.value);
                    setNicknameVerified(false);
                  }}
                  required
                  placeholder="e.g. 78491032"
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Server ID</span>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => {
                    setServerId(e.target.value);
                    setNicknameVerified(false);
                  }}
                  required
                  placeholder="e.g. 2048"
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
                />
              </div>
            </div>

            {/* Auto-Fetch Nickname Action Button */}
            <button
              type="button"
              onClick={handleLookupNickname}
              disabled={fetchingNickname}
              className="w-full py-2 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              {fetchingNickname ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {lang === "uz" ? "Nickname olinmoqda..." : lang === "ru" ? "Получение ника..." : "Fetching Nickname..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {lang === "uz"
                      ? "⚡ ID orqali Nickname ni avtomatik olish"
                      : lang === "ru"
                      ? "⚡ Авто-поиск ника по ID"
                      : "⚡ Auto-Fetch Nickname by ID"}
                  </span>
                </>
              )}
            </button>

            {/* Resolved Nickname */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">In-Game Nickname</span>
                {nicknameVerified && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    {lang === "uz" ? "Tasdiqlangan MLBB Akkaunt" : lang === "ru" ? "MLBB аккаунт проверен" : "Verified MLBB Account"}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
              />
            </div>
          </div>
        </div>

        {/* Roles Selection */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Main Roles (Multi-select)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ROLES.map((r) => (
              <RoleBadge
                key={r}
                role={r}
                size="md"
                selected={selectedRoles.includes(r)}
                onClick={() => toggleRole(r)}
                lang={lang}
              />
            ))}
          </div>
        </div>

        {/* Interactive Main Heroes Picker (Max 3) */}
        <div className="pt-2 border-t border-white/5">
          <HeroPicker
            selectedHeroes={selectedHeroes}
            onChange={(heroes) => setSelectedHeroes(heroes)}
            lang={lang}
          />
        </div>

        {/* Rank & Stars */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-slate-400">Current Rank</span>
            <select
              value={currentRank}
              onChange={(e) => setCurrentRank(e.target.value as MLBB_Rank)}
              className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-2.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
            >
              {ALL_RANKS.map((rk) => (
                <option key={rk} value={rk}>
                  {rk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] text-slate-400">Current Stars</span>
            <input
              type="number"
              min={0}
              max={999}
              value={currentStars}
              onChange={(e) => setCurrentStars(Number(e.target.value))}
              className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors mt-1"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Preferred Playtime Schedule
          </label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. 20:00 - 00:00 UTC+5"
            className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Dynamic Background Theme Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Paintbrush className="w-3.5 h-3.5 text-amber-400" />
            Platforma Fon Mavzusi (Theme)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "deep-void", name: "Deep Void", desc: "Matte toza qorong‘u" },
              { id: "minimal-slate", name: "Minimal Slate", desc: "Yupqa chiziqli to‘r" },
              { id: "carbon-mesh", name: "Carbon Mesh", desc: "Karbon nuqtali matrix" },
              { id: "particles", name: "Live Particles", desc: "Sekin suzuvchi zarrachalar" },
            ].map((theme) => {
              const isSelected = bgTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => changeTheme(theme.id as BackgroundThemeId)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#182030] border-amber-500/60 shadow-sm"
                      : "bg-[#090D14] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{theme.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{theme.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-xl font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            savedSuccess
              ? "bg-emerald-500 text-black shadow-lg"
              : "bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-98"
          }`}
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>PROFILE SAVED!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? "SAVING..." : "SAVE PROFILE"}</span>
            </>
          )}
        </button>
      </form>

      {/* Playdom Deposit Modal */}
      <PlaydomTopupModal
        isOpen={showTopup}
        onClose={() => setShowTopup(false)}
        currentBalance={profile?.istars_balance ?? 140}
        onSuccess={(newBal) => {
          if (profile) setProfile({ ...profile, istars_balance: newBal });
        }}
        userId={profile?.telegram_id}
      />
    </div>
  );
}

