import { getInitData } from "./telegram";
import { UserProfile, Team, Scrim, PvPLobby, KarmaSummary } from "./types";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // 1. URL search param override (e.g. ?api_url=https://backend.alwaysdata.net)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryApi = params.get("api_url");
      if (queryApi && queryApi.trim()) {
        const cleaned = queryApi.trim().replace(/\/+$/, "");
        const formatted = cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
        localStorage.setItem("iteam_api_url", formatted);
        return formatted;
      }
    } catch {}

    // 2. LocalStorage override
    try {
      const stored = localStorage.getItem("iteam_api_url");
      if (stored && stored.trim()) {
        const cleaned = stored.trim().replace(/\/+$/, "");
        return cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
      }
    } catch {}
  }

  // 3. Environment Variable
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleaned = envUrl.trim().replace(/\/+$/, "");
    return cleaned.endsWith("/api/v1") ? cleaned : `${cleaned}/api/v1`;
  }

  return "http://localhost:8000/api/v1";
}

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiBase = getApiBaseUrl();
  const initData = getInitData();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (initData) {
    headers.set("X-Telegram-Init-Data", initData);
  } else {
    // Local developer fallback user ID
    headers.set("X-Dev-Telegram-Id", "999888777");
  }

  try {
    const res = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "API Error" }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn(`[API] Failed to call ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Module A: Profiles & LFG
  getMyProfile: () => fetcher<UserProfile>("/profile/me"),
  lookupNickname: (mlbbId: string, serverId: string) =>
    fetcher<{ status: string; nickname: string; mlbb_id: string; server_id: string; is_verified: boolean }>(
      `/profile/lookup-nickname?mlbb_id=${encodeURIComponent(mlbbId)}&server_id=${encodeURIComponent(serverId)}`
    ),
  updateProfile: (data: Partial<UserProfile>) =>
    fetcher<UserProfile>("/profile/me", { method: "PUT", body: JSON.stringify(data) }),
  toggleLFG: () => fetcher<UserProfile>("/profile/toggle-lfg", { method: "POST" }),
  browseLFG: (params?: { rank?: string; role?: string; min_karma?: number }) => {
    const q = new URLSearchParams();
    if (params?.rank) q.append("rank", params.rank);
    if (params?.role) q.append("role", params.role);
    if (params?.min_karma) q.append("min_karma", String(params.min_karma));
    return fetcher<UserProfile[]>(`/profile/lfg/browse?${q.toString()}`);
  },
  invitePlayer: (userId: number) =>
    fetcher<{ status: string; message: string }>(`/profile/lfg/invite/${userId}`, { method: "POST" }),

  // Module B: Teams
  getTeams: (minRank?: string) => {
    const q = minRank ? `?min_rank=${encodeURIComponent(minRank)}` : "";
    return fetcher<Team[]>(`/teams/${q}`);
  },
  getTeam: (id: string) => fetcher<Team>(`/teams/${id}`),
  createTeam: (data: any) => fetcher<Team>("/teams/", { method: "POST", body: JSON.stringify(data) }),
  joinTeamRequest: (teamId: string) =>
    fetcher<{ status: string; message: string }>(`/teams/${teamId}/join-request`, { method: "POST" }),
  manageMember: (teamId: string, actionData: any) =>
    fetcher<{ status: string; action: string }>(`/teams/${teamId}/manage-member`, {
      method: "POST",
      body: JSON.stringify(actionData),
    }),

  // Module C: Scrims & Ready Check
  getScrims: (status?: string) => {
    const q = status ? `?status_filter=${status}` : "";
    return fetcher<Scrim[]>(`/scrims/${q}`);
  },
  getScrim: (id: string) => fetcher<Scrim>(`/scrims/${id}`),
  createScrim: (data: any) => fetcher<Scrim>("/scrims/", { method: "POST", body: JSON.stringify(data) }),
  challengeScrim: (scrimId: string) =>
    fetcher<Scrim>(`/scrims/${scrimId}/challenge`, { method: "POST" }),
  triggerReadyCheck: (scrimId: string) =>
    fetcher<{ status: string; message: string }>(`/scrims/${scrimId}/trigger-ready-check`, { method: "POST" }),
  confirmReady: (scrimId: string) =>
    fetcher<{ status: string; ready_count: number }>(`/scrims/${scrimId}/confirm-ready`, { method: "POST" }),
  submitScrimCredentials: (scrimId: string, creds: { custom_room_id: string; custom_room_password: string }) =>
    fetcher<{ status: string }>(`/scrims/${scrimId}/credentials`, {
      method: "POST",
      body: JSON.stringify(creds),
    }),

  // Module D: Anti-Troll Karma
  submitKarmaFeedback: (data: any) =>
    fetcher<any>("/karma/feedback", { method: "POST", body: JSON.stringify(data) }),
  getKarmaSummary: (userId: number) => fetcher<KarmaSummary>(`/karma/summary/${userId}`),

  // Module E: Community PvP
  getLobbyByCode: (code: string) => fetcher<PvPLobby>(`/pvp/code/${code}`),
  joinPvPSlot: (lobbyId: string, data: { slot_index: number; selected_role: string }) =>
    fetcher<PvPLobby>(`/pvp/${lobbyId}/join-slot`, { method: "POST", body: JSON.stringify(data) }),
  leavePvPSlot: (lobbyId: string) =>
    fetcher<PvPLobby>(`/pvp/${lobbyId}/leave-slot`, { method: "POST" }),
  revealPvPCredentials: (lobbyId: string, creds: { custom_room_id: string; custom_room_password: string }) =>
    fetcher<{ status: string }>(`/pvp/${lobbyId}/reveal-credentials`, {
      method: "POST",
      body: JSON.stringify(creds),
    }),

  // ITeam Economy & Playdom Partner
  getEconomyBalance: () =>
    fetcher<{ istars_balance: number; uzs_equivalent: number; rates: any }>("/economy/balance"),
  getPackages: () =>
    fetcher<{ rate: string; packages: any[]; pro_team_logo_fee: number; custom_team_logo_fee: number }>(
      "/economy/packages"
    ),
  topUpIStars: (packageId: string) =>
    fetcher<{ success: boolean; message: string; new_balance: number; credited_istars: number }>(
      "/economy/topup",
      { method: "POST", body: JSON.stringify({ package_id: packageId }) }
    ),
  getTransactions: () => fetcher<any[]>("/economy/transactions"),
};

