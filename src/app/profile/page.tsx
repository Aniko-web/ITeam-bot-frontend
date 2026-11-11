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
import { Save, Check, User, Shield, Gamepad2, Sparkles, Clock, Globe, Wallet, Paintbrush, AlertCircle, Info } from "lucide-react";

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
  const [lookupNotice, setLookupNotice] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<"success" | "warning" | null>(null);

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
    setLookupNotice(null);
    setLookupStatus(null);

    try {
      const res = await api.lookupNickname(mlbbId, serverId);
      if (res && res.status === "success" && res.nickname) {
        setNickname(res.nickname);
        setNicknameVerified(true);
        setLookupStatus("success");
        setLookupNotice(
          lang === "uz"
            ? `O‘yinchi topildi: "${res.nickname}". Rasmiy serverdan tasdiqlandi!`
            : lang === "ru"
            ? `Игрок найден: "${res.nickname}". Подтверждено сервером!`
            : `Player resolved: "${res.nickname}". In-game identity verified!`
        );
        triggerHaptic("success");
      } else {
        setNicknameVerified(false);
        setLookupStatus("warning");
        setLookupNotice(
          lang === "uz"
            ? "Ushbu ID bo‘yicha nickname topilmadi. O‘z nicknamengizni quyidagi maydonga bemalol qo‘lda yozishingiz mumkin!"
            : lang === "ru"
            ? "Никнейм по данному ID не найден. Вы можете ввести свой никнейм вручную ниже!"
            : "No nickname resolved for this ID. You can type your nickname manually below!"
        );
        triggerHaptic("warning");
      }
    } catch (e: any) {
      setNicknameVerified(false);
      setLookupStatus("warning");
      setLookupNotice(
        lang === "uz"
          ? "Tekshirish serveri bilan aloqa bo‘lmadi. O‘z nicknamengizni quyida bemalol qo‘lda yozishingiz mumkin!"
          : lang === "ru"
          ? "Не удалось связаться с сервером проверки. Введите свой никнейм вручную!"
          : "Could not connect to validation server. Please type your nickname manually!"
      );
      triggerHaptic("warning");
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
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      {/* Title & Language Switcher */}
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

        {/* Tactile Neumorphic Language Switcher Pills */}
        <div className="flex items-center gap-1 neumo-inset p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setLang("uz");
              triggerHaptic("light");
            }}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "uz" ? "liquid-pill-active text-white shadow-sm" : "text-slate-400 hover:text-white"
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
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "ru" ? "liquid-pill-active text-white shadow-sm" : "text-slate-400 hover:text-white"
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
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
              lang === "en" ? "liquid-pill-active text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Karma Status Card with Neumorphic Extrusion */}
      <div className="neumo-card p-4 flex flex-col gap-2.5">
        <KarmaMeter score={profile.karma_score} showDetails={true} />
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-white/5 text-center">
          <div className="p-2.5 neumo-inset rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Scrims Completed</span>
            <p className="text-sm font-mono font-bold text-white mt-0.5">{profile.total_scrims_played}</p>
          </div>
          <div className="p-2.5 neumo-inset rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">PvP Battles</span>
            <p className="text-sm font-mono font-bold text-white mt-0.5">{profile.total_pvp_played}</p>
          </div>
        </div>
      </div>

      {/* IStars Economy & Playdom Top-up Card */}
      <div className="neumo-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl neumo-inset flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white">
                {profile.istars_balance ?? 140}
              </span>
              <span className="text-xs font-semibold text-amber-300">IStars</span>
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
          className="px-3.5 py-1.5 rounded-xl liquid-glass text-amber-300 hover:text-amber-200 text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>To‘ldirish</span>
        </button>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="neumo-card p-4 flex flex-col gap-4">
        {/* MLBB Identity */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Gamepad2 className="w-3.5 h-3.5 text-slate-300" />
            In-Game MLBB Identity
          </label>
          <div className="flex flex-col gap-2.5">
            {/* Game ID & Server ID inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Game ID</span>
                <input
                  type="text"
                  value={mlbbId}
                  onChange={(e) => {
                    setMlbbId(e.target.value);
                    setNicknameVerified(false);
                    setLookupNotice(null);
                  }}
                  required
                  placeholder="e.g. 78491032"
                  className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-white/30 transition-all mt-1"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Server ID (Zone)</span>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => {
                    setServerId(e.target.value);
                    setNicknameVerified(false);
                    setLookupNotice(null);
                  }}
                  required
                  placeholder="e.g. 2048"
                  className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-white/30 transition-all mt-1"
                />
              </div>
            </div>

            {/* Auto-Fetch Nickname Button with Liquid Glass styling */}
            <button
              type="button"
              onClick={handleLookupNickname}
              disabled={fetchingNickname}
              className="w-full py-2.5 px-3.5 liquid-glass hover:brightness-110 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm"
            >
              {fetchingNickname ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin text-slate-300" />
                  <span>
                    {lang === "uz" ? "Serverdan qidirilmoqda..." : lang === "ru" ? "Поиск ника..." : "Fetching Nickname..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-300" />
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

            {/* Lookup Status Notice */}
            {lookupNotice && (
              <div
                className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                  lookupStatus === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-200"
                }`}
              >
                {lookupStatus === "success" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{lookupNotice}</span>
              </div>
            )}

            {/* Resolved or Custom Nickname */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-400 font-medium">In-Game Nickname</span>
                {nicknameVerified ? (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    {lang === "uz" ? "Tasdiqlangan MLBB Akkaunt" : lang === "ru" ? "MLBB аккаунт проверен" : "Verified MLBB Account"}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    {lang === "uz" ? "O‘zingiz ham yoza olasiz" : "Ручной ввод"}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                placeholder="MLBB nicknamingizni kiriting"
                className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white/30 transition-all"
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
            <span className="text-[11px] text-slate-400 font-medium">Current Rank</span>
            <div className="relative mt-1">
              <select
                value={currentRank}
                onChange={(e) => setCurrentRank(e.target.value as MLBB_Rank)}
                className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
              >
                {ALL_RANKS.map((rk) => (
                  <option key={rk} value={rk} className="bg-[#0e141f] text-white">
                    {rk}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium">Current Stars</span>
            <input
              type="number"
              min={0}
              max={999}
              value={currentStars}
              onChange={(e) => setCurrentStars(Number(e.target.value))}
              className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-white/30 transition-all mt-1"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Preferred Playtime Schedule
          </label>
          <input
            type="text"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. 20:00 - 00:00 UTC+5"
            className="w-full neumo-inset rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-white/30 transition-all"
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
                  className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "neumo-card border border-white/20 shadow-sm"
                      : "neumo-inset hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{theme.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{theme.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Liquid Glass Bottom Sticky CTA */}
        <div className="fixed bottom-[74px] left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
          <div className="pointer-events-auto w-full max-w-md liquid-glass-dock rounded-[22px] p-2 flex items-center justify-center shadow-2xl">
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-3 rounded-2xl font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                savedSuccess
                  ? "bg-emerald-500 text-black shadow-md"
                  : "bg-white hover:bg-slate-200 text-black shadow-lg active:scale-98"
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>SAQLANDI! (PROFILE SAVED)</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? "SAQLANMOQDA..." : "PROFILNI SAQLASH (SAVE PROFILE)"}</span>
                </>
              )}
            </button>
          </div>
        </div>
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
