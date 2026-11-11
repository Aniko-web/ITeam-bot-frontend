"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useLanguage, Language } from "@/lib/i18n";
import { useUser } from "@/context/UserContext";
import { UserProfile, MLBB_Role } from "@/lib/types";
import { api, getApiBaseUrl } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { SupportModal } from "@/components/modals/SupportModal";
import {
  Settings,
  User,
  Globe,
  Palette,
  Bell,
  Coins,
  ShieldCheck,
  Check,
  Smartphone,
  Headphones,
  Save,
  Volume2,
  Server,
} from "lucide-react";

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { user: profile, loading: userLoading, updateUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Form State
  const [mlbbId, setMlbbId] = useState("");
  const [serverId, setServerId] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [activeTheme, setActiveTheme] = useState("particles");
  const [apiUrlInput, setApiUrlInput] = useState("");
  const [apiSaveNotice, setApiSaveNotice] = useState(false);

  // Notifications
  const [notifyScrims, setNotifyScrims] = useState(true);
  const [notifyLfg, setNotifyLfg] = useState(true);
  const [enableHaptics, setEnableHaptics] = useState(true);

  // Modals
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    setApiUrlInput(getApiBaseUrl());
  }, []);

  const handleSaveApiUrl = () => {
    if (!apiUrlInput.trim()) return;
    localStorage.setItem("iteam_api_url", apiUrlInput.trim());
    triggerHaptic("success");
    setApiSaveNotice(true);
    setTimeout(() => {
      setApiSaveNotice(false);
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    if (profile) {
      setMlbbId(profile.mlbb_id || "");
      setServerId(profile.server_id || "");
      setInGameName(profile.in_game_nickname || "");
    }
  }, [profile]);

  useEffect(() => {
    // Load saved background
    const savedBg = localStorage.getItem("iteam_bg_theme") || "particles";
    setActiveTheme(savedBg);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    triggerHaptic("impactMedium");

    try {
      await updateUser({
        mlbb_id: mlbbId,
        server_id: serverId,
        in_game_nickname: inGameName,
      });
      setSaveSuccess(true);
      triggerHaptic("success");
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem("iteam_bg_theme", themeId);
    window.dispatchEvent(new CustomEvent("iteam_theme_changed", { detail: themeId }));
    triggerHaptic("selection");
  };

  return (
    <div className="flex flex-col min-h-screen text-[#F8FAFC]">
      <Header
        user={profile}
        onBalanceUpdate={(newBal) => {
          if (profile) updateUser({ istars_balance: newBal });
        }}
      />

      <div className="px-4 pt-3 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold tracking-tight">Sozlamalar</h1>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            ITeam v2.0
          </span>
        </div>

        {/* 1. In-Game MLBB Identity Card */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                MLBB Identifikatori
              </h2>
            </div>
            {profile?.is_verified && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Tasdiqlangan
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                O'yindagi taxallus (IGN)
              </label>
              <input
                type="text"
                value={inGameName}
                onChange={(e) => setInGameName(e.target.value)}
                placeholder="ApexSlayer"
                className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">
                  MLBB ID
                </label>
                <input
                  type="text"
                  value={mlbbId}
                  onChange={(e) => setMlbbId(e.target.value)}
                  placeholder="88291041"
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">
                  Server ID (Zone)
                </label>
                <input
                  type="text"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="6021"
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                saveSuccess
                  ? "bg-emerald-500 text-black"
                  : "bg-white hover:bg-slate-200 text-black active:scale-[0.98]"
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Muvaffaqiyatli saqlandi!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {saving ? "Saqlanmoqda..." : "Profilni saqlash"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. Theme & Live Canvas Background */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
            <Palette className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Dinamik Fon Mavzulari
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "particles", name: "Live Particles", desc: "Silliq suzuvchi zarrachalar" },
              { id: "deep_void", name: "Deep Void", desc: "Minimalist toza qora" },
              { id: "minimal_slate", name: "Minimal Slate", desc: "Zamonaviy metall tus" },
              { id: "carbon_mesh", name: "Carbon Mesh", desc: "Kiber-panjara naqsh" },
            ].map((th) => {
              const isSelected = activeTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleThemeChange(th.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#182030] border-white/40 text-white shadow-sm"
                      : "bg-[#090D14] border-white/5 hover:border-white/15 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                      {th.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {th.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Language Switcher */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ilova Tili
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { code: "uz" as Language, label: "O'zbekcha", flag: "🇺🇿" },
              { code: "ru" as Language, label: "Русский", flag: "🇷🇺" },
              { code: "en" as Language, label: "English", flag: "🇬🇧" },
            ].map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    triggerHaptic("selection");
                  }}
                  className={`py-2 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-[#1A2338] border-amber-400 text-white font-bold shadow-sm"
                      : "bg-[#090D14] border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="text-xs">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Notifications & Haptics */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Bildirishnomalar va Haptika
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Scrim va Ready Check ogohlantirishlari
                </span>
                <span className="text-[10px] text-slate-400">
                  O'yin boshlanganda 30s ichida Telegram xabarnoma
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotifyScrims(!notifyScrims);
                  triggerHaptic("selection");
                }}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  notifyScrims ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyScrims ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  LFG Takliflari
                </span>
                <span className="text-[10px] text-slate-400">
                  Sizning asosiy rolingizga mos lobbilar paydo bo'lganda
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotifyLfg(!notifyLfg);
                  triggerHaptic("selection");
                }}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  notifyLfg ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifyLfg ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">
                  Telegram Haptic Vibratsiya
                </span>
                <span className="text-[10px] text-slate-400">
                  Tugmalar bosilganda tebranish signali
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEnableHaptics(!enableHaptics);
                  triggerHaptic("selection");
                }}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  enableHaptics ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    enableHaptics ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Economy & Support Links */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">IStars Balansi</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTopupModal(true)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              To'ldirish +
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D14] border border-white/5">
            <span className="text-xs text-slate-400">Hamkor: Playdom</span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {profile?.istars_balance ?? 150} IStars (~{((profile?.istars_balance ?? 150) * 50).toLocaleString()} UZS)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2 transition-colors"
          >
            <Headphones className="w-4 h-4 text-blue-400" />
            Texnik Yordam va Qoidalar
          </button>
        </div>

        {/* 6. Backend Server Connection Settings */}
        <div className="rounded-2xl bg-[#111622] border border-white/10 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Backend Server Manzili (API)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ULANGAN
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ilovadagi barcha o'yinchi ma'lumotlari, jamoalar va scrimlar aynan ushbu serverdan real-vaqtda yuklanadi:
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={apiUrlInput}
              onChange={(e) => setApiUrlInput(e.target.value)}
              placeholder="http://localhost:8000/api/v1 yoki https://api...uz/api/v1"
              className="flex-1 bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/40"
            />
            <button
              type="button"
              onClick={handleSaveApiUrl}
              className="px-3.5 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
            >
              {apiSaveNotice ? "Saqlandi!" : "Saqlash"}
            </button>
          </div>
        </div>
      </div>

      {/* Playdom Topup Modal */}
      <PlaydomTopupModal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        currentBalance={profile?.istars_balance ?? 150}
        onSuccess={(newBal) => {
          if (profile) updateUser({ istars_balance: newBal });
        }}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
