"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Mic,
  Plus,
  Crown,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Radio,
  Sparkles,
} from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Team, TeamMember } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";
import { Header } from "@/components/layout/Header";
import { TEAM_LOGOS } from "@/data/teamLogos";

export default function MyTeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyTeam() {
      try {
        const teams = await api.getTeams();
        // Assume user is in first team or captain
        if (teams && teams.length > 0) {
          setTeam(teams[0]);
        } else {
          setTeam(null);
        }
      } catch {
        // Fallback demo squad
        setTeam({
          id: "team-apex-01",
          captain_id: 999888777,
          name: "Apex Gaming UZ",
          tag: "APEX",
          description: "MPL Qualifier & Community Tournament Squad. Daily scrims at 21:00.",
          pro_team_logo_id: "fnatic_onic",
          voice_type: "discord",
          voice_link_secret: "https://discord.gg/iteam-scrims",
          max_slots: 7,
          is_recruiting: true,
          min_rank_requirement: "Mythic Glory",
          created_at: new Date().toISOString(),
          starter_count: 5,
          substitute_count: 1,
          members: [
            {
              id: "m-1",
              user_id: 999888777,
              slot_type: "starter",
              assigned_role: "Jungler",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "ApexSlayer",
              rank: "Mythic Glory",
              karma_score: 98,
            },
            {
              id: "m-2",
              user_id: 102,
              slot_type: "starter",
              assigned_role: "Roamer",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "IronWall_Tigreal",
              rank: "Mythic Honor",
              karma_score: 95,
            },
            {
              id: "m-3",
              user_id: 103,
              slot_type: "starter",
              assigned_role: "Mid Laner",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "PharsaSniper",
              rank: "Mythic Glory",
              karma_score: 99,
            },
            {
              id: "m-4",
              user_id: 104,
              slot_type: "starter",
              assigned_role: "Gold Laner",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "BeatrixGod",
              rank: "Mythic Immortal",
              karma_score: 100,
            },
            {
              id: "m-5",
              user_id: 105,
              slot_type: "starter",
              assigned_role: "Exp Laner",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "YuZhongRuler",
              rank: "Mythic Honor",
              karma_score: 92,
            },
            {
              id: "m-6",
              user_id: 106,
              slot_type: "substitute",
              assigned_role: "Roamer",
              status: "active",
              joined_at: new Date().toISOString(),
              nickname: "ShadowSub",
              rank: "Mythic",
              karma_score: 88,
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    loadMyTeam();
  }, []);

  const proLogo = TEAM_LOGOS.find((x) => x.id === team?.pro_team_logo_id);
  const starters = team?.members?.filter((m) => m.slot_type === "starter") || [];
  const substitutes = team?.members?.filter((m) => m.slot_type === "substitute") || [];

  return (
    <div className="flex flex-col min-h-screen text-[#F8FAFC]">
      <Header />

      <div className="px-4 pt-3 space-y-4">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-extrabold tracking-tight">Mening Jamoam</h1>
          </div>

          <Link
            href="/teams"
            onClick={() => triggerHaptic("light")}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
          >
            Barcha jamoalar
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {team ? (
          <>
            {/* Team Identity Banner */}
            <div className="relative rounded-3xl bg-[#111722] border border-white/10 p-5 shadow-lg overflow-hidden">
              <div
                className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ backgroundColor: proLogo?.primaryColor || "#F59E0B" }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/10 shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${proLogo?.primaryColor || "#F59E0B"}33 0%, ${proLogo?.secondaryColor || "#111827"} 100%)`,
                  }}
                >
                  <span className="text-2xl font-black text-white">
                    {proLogo ? proLogo.badgeText.split(" ")[0] : team.tag}
                  </span>
                  <span
                    className="text-[9px] font-extrabold uppercase px-1 rounded bg-black/40"
                    style={{ color: proLogo?.primaryColor || "#F59E0B" }}
                  >
                    [{team.tag}]
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-base font-black text-white truncate">
                      {team.name}
                    </h2>
                    {proLogo && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                        {proLogo.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400">
                      Minimal rank: <strong className="text-white">{team.min_rank_requirement}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Qidiruvda
                    </span>
                  </div>
                </div>
              </div>

              {/* Private Voice Room Box */}
              {team.voice_link_secret && (
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between bg-black/30 -mx-5 -mb-5 p-4 rounded-b-3xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Maxfiy Ovozli Aloqa ({team.voice_type})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Faqat jamoa a'zolari uchun
                      </span>
                    </div>
                  </div>
                  <a
                    href={team.voice_link_secret}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => triggerHaptic("impactLight")}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-white flex items-center gap-1 transition-colors"
                  >
                    Ulanish
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Roster Section: Starters (5/5) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Asosiy Tarkib ({starters.length}/5)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500">
                  Starter Slots
                </span>
              </div>

              <div className="space-y-2">
                {starters.map((member, idx) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-[#111722] border border-white/5 hover:border-white/15 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-white/10">
                        {idx === 0 ? <Crown className="w-4 h-4 text-amber-400" /> : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {member.nickname || "O'yinchi"}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                              Kapitan
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <RankBadge rank={member.rank || "Mythic"} size="sm" />
                          <span className="text-[10px] text-slate-400">• Ishonch: {member.karma_score || 100}%</span>
                        </div>
                      </div>
                    </div>

                    <RoleBadge role={member.assigned_role || "Flex"} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Substitutes Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Zaxira O'yinchilar ({substitutes.length}/2)
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                {substitutes.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-[#111722] border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800/60 text-slate-400 font-bold flex items-center justify-center text-xs border border-white/5">
                        Sub
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {member.nickname}
                        </span>
                        <RankBadge rank={member.rank || "Legend"} size="sm" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      {member.assigned_role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty State if No Team */
          <div className="rounded-3xl bg-[#111722] border border-white/10 p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Siz hali hech qanday jamoaga a'zo emassiz
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              O'z jamoangizni tuzing, rasmiy MPL logolarini tanlang va do'stlaringizni taklif qiling.
            </p>
            <Link
              href="/teams"
              onClick={() => triggerHaptic("impactMedium")}
              className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Jamoa tuzish yoki qo'shilish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
