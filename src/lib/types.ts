export type MLBB_Role = "Jungler" | "Mid Laner" | "Exp Laner" | "Gold Laner" | "Roamer";

export type MLBB_Rank =
  | "Warrior"
  | "Elite"
  | "Master"
  | "Grandmaster"
  | "Epic"
  | "Legend"
  | "Mythic"
  | "Mythic Honor"
  | "Mythic Glory"
  | "Mythic Immortal";

export interface UserProfile {
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  avatar_url?: string;
  mlbb_id: string;
  server_id: string;
  in_game_nickname: string;
  main_roles: MLBB_Role[];
  top_heroes: string[];
  current_rank: MLBB_Rank;
  highest_rank: MLBB_Rank;
  current_stars: number;
  playtime_schedule: string;
  is_lfg_active: boolean;
  karma_score: number;
  is_verified?: boolean;
  istars_balance?: number;
  selected_background_id?: string;
  total_scrims_played: number;
  total_pvp_played: number;
  penalties_count: number;
  is_banned: boolean;
}

export interface TeamMember {
  id: string;
  user_id: number;
  slot_type: "captain" | "starter" | "substitute";
  assigned_role?: MLBB_Role;
  status: "active" | "pending_approval" | "benched" | "declined";
  joined_at: string;
  nickname?: string;
  rank?: MLBB_Rank;
  avatar_url?: string;
  karma_score?: number;
}

export interface Team {
  id: string;
  captain_id: number;
  name: string;
  tag: string;
  logo_url?: string;
  pro_team_logo_id?: string;
  is_custom_logo?: boolean;
  description?: string;
  voice_type: "in_game_mic" | "telegram_voice" | "discord" | "teamspeak" | "other";
  voice_link_secret?: string; // HIDDEN until accepted
  max_slots: number;
  is_recruiting: boolean;
  min_rank_requirement: MLBB_Rank;
  created_at: string;
  members: TeamMember[];
  starter_count: number;
  substitute_count: number;
}

export interface PlaydomPackage {
  id: string;
  name: string;
  istars: number;
  uzs: number;
  bonus: number;
  is_popular?: boolean;
  description: string;
}

export interface Transaction {
  id: string;
  user_id: number;
  amount_istars: number;
  amount_uzs: number;
  type: string;
  status: string;
  provider: string;
  description?: string;
  created_at: string;
}

export interface ScrimReadyCheck {
  user_id: number;
  nickname: string;
  team_id: string;
  is_ready: boolean;
  confirmed_at?: string;
}

export interface Scrim {
  id: string;
  host_team_id: string;
  host_team_name?: string;
  host_team_tag?: string;
  challenger_team_id?: string;
  challenger_team_name?: string;
  challenger_team_tag?: string;
  target_time: string;
  target_rank: MLBB_Rank;
  format: "BO1" | "BO3" | "BO5";
  status:
    | "open"
    | "matched"
    | "ready_check_pending"
    | "ready_check_confirmed"
    | "in_progress"
    | "completed"
    | "cancelled";
  custom_room_id?: string;
  custom_room_password?: string;
  ready_check_started_at?: string;
  ready_check_deadline?: string;
  ready_checks: ScrimReadyCheck[];
  total_confirmed: number;
  total_required: number;
  notes?: string;
  created_at: string;
}

export interface PvPParticipant {
  id: string;
  user_id: number;
  nickname: string;
  rank: MLBB_Rank;
  avatar_url?: string;
  slot_index: number;
  team_side: "BLUE" | "RED";
  selected_role: MLBB_Role;
  is_ready: boolean;
  joined_at: string;
}

export interface PvPLobby {
  id: string;
  lobby_code: string;
  title: string;
  creator_telegram_id: number;
  format: string;
  target_rank: MLBB_Rank;
  max_slots: number;
  status: "open" | "full" | "ready" | "credentials_shared" | "completed" | "cancelled";
  custom_room_id?: string;
  custom_room_password?: string;
  participants: PvPParticipant[];
  blue_team: PvPParticipant[];
  red_team: PvPParticipant[];
  created_at: string;
}

export interface KarmaSummary {
  user_id: number;
  current_score: number;
  endorsements_count: number;
  reports_count: number;
  reputation_tier: string;
  top_endorsements: Record<string, number>;
}

