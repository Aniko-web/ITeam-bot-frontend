"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Mic,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronLeft,
  CheckCircle,
  Crown
} from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { Team, TeamMember } from "@/lib/types";
import { api } from "@/lib/api";
import { triggerHaptic } from "@/lib/telegram";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const data = await api.getTeam(teamId);
      setTeam(data);
    } catch {
      // Mock team with starters, substitutes, and applicants
      setTeam({
        id: teamId,
        captain_id: 101,
        name: "Apex Legends Uzbekistan",
        tag: "APEX",
        description: "Official competitive squad preparing for international scrims and tournaments.",
        voice_type: "discord",
        voice_link_secret: "https://discord.gg/apex-pro-scrims", // If active user
        max_slots: 7,
        is_recruiting: true,
        min_rank_requirement: "Mythic Glory",
        created_at: new Date().toISOString(),
        starter_count: 5,
        substitute_count: 1,
        members: [
          {
            id: "m-1",
            user_id: 101,
            nickname: "ViperKing",
            rank: "Mythic Immortal",
            slot_type: "captain",
            assigned_role: "Jungler",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 135,
          },
          {
            id: "m-2",
            user_id: 102,
            nickname: "AuraRoam",
            rank: "Mythic Immortal",
            slot_type: "starter",
            assigned_role: "Roamer",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 140,
          },
          {
            id: "m-3",
            user_id: 103,
            nickname: "GoldRush",
            rank: "Mythic Glory",
            slot_type: "starter",
            assigned_role: "Gold Laner",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 112,
          },
          {
            id: "m-4",
            user_id: 104,
            nickname: "MageSupreme",
            rank: "Mythic Honor",
            slot_type: "starter",
            assigned_role: "Mid Laner",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 98,
          },
          {
            id: "m-5",
            user_id: 105,
            nickname: "IronWall",
            rank: "Mythic Glory",
            slot_type: "starter",
            assigned_role: "Exp Laner",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 105,
          },
          {
            id: "m-6",
            user_id: 106,
            nickname: "SubFighter",
            rank: "Mythic",
            slot_type: "substitute",
            assigned_role: "Exp Laner",
            status: "active",
            joined_at: new Date().toISOString(),
            karma_score: 90,
          },
          {
            id: "m-7",
            user_id: 107,
            nickname: "RookieSniper",
            rank: "Mythic Glory",
            slot_type: "starter",
            assigned_role: "Gold Laner",
            status: "pending_approval",
            joined_at: new Date().toISOString(),
            karma_score: 102,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    triggerHaptic("heavy");
    try {
      await api.joinTeamRequest(teamId);
      setActionMessage("Application sent to Captain!");
      triggerHaptic("success");
    } catch (e: any) {
      setActionMessage(e.message || "Applied to roster");
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleManageMember = async (targetUserId: number, action: string) => {
    triggerHaptic("medium");
    try {
      await api.manageMember(teamId, { target_user_id: targetUserId, action });
      setActionMessage(`Member action: ${action}`);
      triggerHaptic("success");
      loadTeam();
    } catch (e: any) {
      alert(e.message || "Failed action");
    }
    setTimeout(() => setActionMessage(null), 3000);
  };

  if (loading || !team) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading Team Roster...</div>;
  }

  const starters = team.members.filter((m) => m.status === "active" && m.slot_type !== "substitute");
  const substitutes = team.members.filter((m) => m.status === "active" && m.slot_type === "substitute");
  const pendingApplicants = team.members.filter((m) => m.status === "pending_approval");

  return (
    <div className="flex flex-col gap-4">
      {/* Header Back & Tag */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Teams</span>
        </button>
        <RankBadge rank={team.min_rank_requirement} />
      </div>

      {/* Team Identity Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                [{team.tag}]
              </span>
              <h2 className="text-lg font-black text-white">{team.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {team.description}
            </p>
          </div>
        </div>

        {/* Communication Shield Section */}
        <div className="mt-1 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Mic className="w-3.5 h-3.5 text-purple-400" />
              Communication Channel
            </span>
            <span className="text-slate-400 font-mono text-[11px] capitalize">
              {team.voice_type.replace("_", " ")}
            </span>
          </div>

          {team.voice_link_secret ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-emerald-300">Voice Access Unlocked</span>
                  <p className="text-[10px] text-emerald-400/80">Active Roster Access</p>
                </div>
              </div>
              <a
                href={team.voice_link_secret}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Join Channel</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-300">Channel Link Encrypted</span>
                <p className="text-[10px] text-amber-400/80 mt-0.5">
                  Discord/Voice link is strictly hidden until the Captain approves your roster
                  application.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 5 Main Starters */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-300" />
            Main Starters ({starters.length} / 5)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Competitive 5</span>
        </div>

        <div className="flex flex-col gap-2">
          {starters.map((m, idx) => (
            <div
              key={m.id}
              className="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center font-mono text-xs font-bold text-slate-500">
                  #{idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{m.nickname}</span>
                    {m.slot_type === "captain" && (
                      <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <div className="mt-0.5">
                    <RankBadge rank={m.rank || "Mythic"} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {m.assigned_role && <RoleBadge role={m.assigned_role} size="sm" />}
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ★ {m.karma_score || 100}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Substitutes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Substitutes ({substitutes.length} / 2)
          </h3>
          <span className="text-[10px] font-mono text-purple-400">Bench Reserve</span>
        </div>

        <div className="flex flex-col gap-2">
          {substitutes.map((m) => (
            <div
              key={m.id}
              className="glass-panel p-3 rounded-xl border border-white/5 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white">{m.nickname}</span>
                <div className="mt-0.5">
                  <RankBadge rank={m.rank || "Mythic"} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.assigned_role && <RoleBadge role={m.assigned_role} size="sm" />}
                <span className="text-xs font-mono text-slate-400">Reserve</span>
              </div>
            </div>
          ))}
          {substitutes.length === 0 && (
            <div className="p-3 bg-[#0B0E14] border border-dashed border-white/10 rounded-xl text-center text-xs text-slate-500">
              Substitute slot open
            </div>
          )}
        </div>
      </div>

      {/* Captain Admin Panel: Pending Applicants */}
      {pendingApplicants.length > 0 && (
        <div className="p-3.5 neumo-card border border-white/10 rounded-2xl flex flex-col gap-2.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-slate-300" />
            Pending Roster Applications ({pendingApplicants.length})
          </h4>

          {pendingApplicants.map((app) => (
            <div
              key={app.id}
              className="p-3 bg-[#0B0E14] rounded-xl border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white">{app.nickname}</span>
                <div className="flex items-center gap-2 mt-1">
                  <RankBadge rank={app.rank || "Mythic"} />
                  {app.assigned_role && <RoleBadge role={app.assigned_role} size="sm" />}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleManageMember(app.user_id, "accept")}
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-colors cursor-pointer"
                  title="Accept to Roster"
                >
                  <UserCheck className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={() => handleManageMember(app.user_id, "reject")}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Reject"
                >
                  <UserX className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Request Button */}
      <button
        onClick={handleApply}
        className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-extrabold rounded-xl shadow-lg tracking-wide active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <Users className="w-4 h-4" />
        <span>APPLY TO JOIN ROSTER</span>
      </button>
    </div>
  );
}

