"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Plus,
  Users,
  Mic,
  Lock,
  ArrowRight,
  Check,
  Sparkles,
  Upload,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { Team, MLBB_Rank, UserProfile } from "@/lib/types";
import { PRO_TEAMS, ProTeamLogo } from "@/lib/proTeams";
import { TeamLogoSelector } from "@/components/teams/TeamLogoSelector";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTopupModal, setShowTopupModal] = useState(false);

  // Create Form State
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [voiceType, setVoiceType] = useState<any>("discord");
  const [voiceSecret, setVoiceSecret] = useState("");
  const [minRank, setMinRank] = useState<MLBB_Rank>("Mythic");
  const [creating, setCreating] = useState(false);

  // Logo Selection State
  const [logoMode, setLogoMode] = useState<"pro" | "custom" | "none">("pro");
  const [selectedProLogo, setSelectedProLogo] = useState<string>("onic");
  const [customLogoUrl, setCustomLogoUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [teamsData, userProfile] = await Promise.all([
        api.getTeams().catch(() => []),
        api.getMyProfile().catch(() => null),
      ]);
      setTeams(teamsData);
      setProfile(userProfile);
    } catch {
      // Mock fallback
      setTeams([
        {
          id: "team-1",
          captain_id: 101,
          name: "ONIC Uzbekistan",
          tag: "ONIC",
          pro_team_logo_id: "onic",
          is_custom_logo: false,
          description: "Top tier MLBB competitive clan preparing for regional qualifier tournaments.",
          voice_type: "discord",
          voice_link_secret: undefined,
          max_slots: 7,
          is_recruiting: true,
          min_rank_requirement: "Mythic Glory",
          created_at: new Date().toISOString(),
          members: [],
          starter_count: 5,
          substitute_count: 1,
        },
        {
          id: "team-2",
          captain_id: 102,
          name: "Team Liquid Academy",
          tag: "TL",
          pro_team_logo_id: "liquid",
          is_custom_logo: false,
          description: "Disciplined scrim roster seeking a flex Gold Laner and backup Roamer.",
          voice_type: "telegram_voice",
          voice_link_secret: undefined,
          max_slots: 7,
          is_recruiting: true,
          min_rank_requirement: "Mythic",
          created_at: new Date().toISOString(),
          members: [],
          starter_count: 4,
          substitute_count: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRequiredFee = () => {
    if (logoMode === "custom") return 140;
    if (logoMode === "pro") return 100;
    return 0;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    triggerHaptic("heavy");

    const fee = getRequiredFee();
    const currentBalance = profile?.istars_balance ?? 140;

    if (fee > 0 && currentBalance < fee) {
      triggerHaptic("warning");
      setErrorMessage(
        `IStars balansingiz yetarli emas (Kerak: ${fee} IStars, sizda: ${currentBalance} IStars). Iltimos, Playdom orqali to‘ldiring.`
      );
      return;
    }

    setCreating(true);
    try {
      const created = await api.createTeam({
        name,
        tag,
        description,
        voice_type: voiceType,
        voice_link_secret: voiceSecret,
        min_rank_requirement: minRank,
        max_slots: 7,
        pro_team_logo_id: logoMode === "pro" ? selectedProLogo : undefined,
        is_custom_logo: logoMode === "custom",
        logo_url: logoMode === "custom" ? customLogoUrl : undefined,
      });

      setTeams([created, ...teams]);
      if (profile && fee > 0) {
        setProfile({ ...profile, istars_balance: (profile.istars_balance ?? 140) - fee });
      }
      setShowCreateModal(false);
      triggerHaptic("success");
    } catch (e: any) {
      setErrorMessage(e.message || "Jamoa yaratishda xatolik yuz berdi.");
    } finally {
      setCreating(false);
    }
  };

  const getProBadge = (proId?: string) => {
    return PRO_TEAMS.find((p) => p.id === proId);
  };

  return (
    <div className="flex flex-col gap-3.5 px-4 pt-3">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>ITeam Jamoalari (Teams)</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            5 Asosiy + 2 Zaxira tarkib & Pro klan logolari
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            triggerHaptic("medium");
          }}
          className="px-3 py-1.5 bg-[#182030] hover:bg-[#202B40] border border-white/10 text-white text-xs font-extrabold rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3] text-amber-400" />
          <span>YANGI JAMOA</span>
        </button>
      </div>

      {/* Teams List */}
      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
        ) : teams.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-[#111622] rounded-2xl border border-white/5">
            Faol jamoalar topilmadi. Birinchi bo‘lib ro‘yxatdan o‘ting!
          </div>
        ) : (
          teams.map((t) => {
            const pro = getProBadge(t.pro_team_logo_id);

            return (
              <Link
                key={t.id}
                href={`/teams/${t.id}`}
                onClick={() => triggerHaptic("light")}
                className="bg-[#111622] hover:bg-[#141B2A] p-4 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex flex-col gap-3 group shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Team Pro Logo / Tag Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border overflow-hidden shrink-0 shadow-inner"
                      style={{
                        backgroundColor: pro ? pro.secondaryColor : "#182030",
                        borderColor: pro ? pro.primaryColor : "rgba(255,255,255,0.1)",
                        color: pro ? pro.primaryColor : "#ffffff",
                      }}
                    >
                      {t.logo_url ? (
                        <img src={t.logo_url} alt={t.name} className="w-full h-full object-cover" />
                      ) : pro ? (
                        <span className="tracking-tighter font-extrabold text-[11px] text-center px-1">
                          {pro.badgeText}
                        </span>
                      ) : (
                        <span>{t.tag}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">
                          [{t.tag}]
                        </span>
                        <h3 className="font-extrabold text-white text-sm group-hover:text-amber-400 transition-colors">
                          {t.name}
                        </h3>
                        {pro && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                            PRO VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                        {t.description || "Tavsif ko‘rsatilmagan."}
                      </p>
                    </div>
                  </div>

                  <RankBadge rank={t.min_rank_requirement} />
                </div>

                {/* Slots & Voice Status */}
                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/5">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Users className="w-3.5 h-3.5 text-slate-300" />
                      {t.starter_count + t.substitute_count} / {t.max_slots} O‘rin
                    </span>
                    <span className="flex items-center gap-1 font-mono capitalize">
                      <Mic className="w-3.5 h-3.5 text-purple-400" />
                      {t.voice_type.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-300 group-hover:text-white font-bold text-xs transition-colors">
                    <span>Tarkibni Ko‘rish</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Register Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-sm bg-[#111622] border border-white/10 rounded-2xl p-5 shadow-2xl my-6 text-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Yangi Jamoa Ro‘yxatdan O‘tkazish
              </h3>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#182030] border border-white/10 text-[11px] font-mono text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{profile?.istars_balance ?? 140} IStars</span>
              </div>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              {/* Team Name */}
              <div>
                <span className="text-[11px] font-bold text-slate-300">Jamoa Nomi</span>
                <input
                  type="text"
                  required
                  placeholder="masalan: Apex Predators"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              {/* Clan Tag & Min Rank */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-300">Tegi (2-6 belgi)</span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="APEX"
                    value={tag}
                    onChange={(e) => setTag(e.target.value.toUpperCase())}
                    className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-300">Min Rang</span>
                  <select
                    value={minRank}
                    onChange={(e) => setMinRank(e.target.value as MLBB_Rank)}
                    className="w-full bg-[#090D14] border border-white/10 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                  >
                    <option value="Mythic Immortal">Mythic Immortal</option>
                    <option value="Mythic Glory">Mythic Glory</option>
                    <option value="Mythic Honor">Mythic Honor</option>
                    <option value="Mythic">Mythic</option>
                    <option value="Legend">Legend</option>
                    <option value="Epic">Epic</option>
                    <option value="Grandmaster">Grandmaster</option>
                    <option value="Master">Master</option>
                    <option value="Elite">Elite</option>
                    <option value="Warrior">Warrior</option>
                  </select>
                </div>
              </div>

              {/* Logo Selection Section (Requirement 5) */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    Jamoa Logosi (Identity)
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    Narxi: {getRequiredFee()} IStars
                  </span>
                </div>

                {/* Logo Selector Component */}
                <TeamLogoSelector
                  selectedLogoId={selectedProLogo}
                  isCustomLogo={logoMode === "custom"}
                  customLogoUrl={customLogoUrl}
                  currentBalance={profile?.istars_balance ?? 150}
                  onSelectLogo={(logoId, isCustom, url) => {
                    if (isCustom) {
                      setLogoMode("custom");
                      if (url) setCustomLogoUrl(url);
                    } else {
                      setLogoMode("pro");
                      setSelectedProLogo(logoId);
                    }
                  }}
                  onBalanceUpdate={(newBal) => {
                    if (profile) setProfile({ ...profile, istars_balance: newBal });
                  }}
                />
              </div>

              {/* Voice Type & Secret Link */}
              <div>
                <span className="text-[11px] font-bold text-slate-300">Ovozli Aloqa</span>
                <select
                  value={voiceType}
                  onChange={(e) => setVoiceType(e.target.value)}
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                >
                  <option value="discord">Discord Server</option>
                  <option value="telegram_voice">Telegram Ovozli Chat</option>
                  <option value="in_game_mic">In-Game Mikrofon</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300">Ovozli Kanal Havolasi (Maxfiy)</span>
                  <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                    <Lock className="w-2.5 h-2.5" /> Yopiq himoya
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="https://discord.gg/... yoki Telegram link"
                  value={voiceSecret}
                  onChange={(e) => setVoiceSecret(e.target.value)}
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-bold text-slate-300">Tavsif va Maqsad</span>
                <textarea
                  rows={2}
                  placeholder="Mashg‘ulot vaqti, turnir maqsadlari..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#090D14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              {/* Error / Insufficient Balance Alert */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex flex-col gap-2">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic("medium");
                      setShowTopupModal(true);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-amber-500 text-black font-extrabold text-[11px] uppercase tracking-wide self-start cursor-pointer active:scale-95"
                  >
                    Playdom orqali to‘ldirish &gt;
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-black tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                >
                  {creating ? "YARATILMOQDA..." : "TASDIQLASH"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playdom Deposit Modal for quick topup */}
      <PlaydomTopupModal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        currentBalance={profile?.istars_balance ?? 140}
        onSuccess={(newBal) => {
          if (profile) setProfile({ ...profile, istars_balance: newBal });
          setErrorMessage(null);
        }}
        userId={profile?.telegram_id}
      />
    </div>
  );
}
