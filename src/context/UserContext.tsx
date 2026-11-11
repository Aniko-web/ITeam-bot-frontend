"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/lib/types";
import { api } from "@/lib/api";
import { getTelegramWebApp } from "@/lib/telegram";

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<UserProfile>;
  setUserLocally: (user: UserProfile) => void;
}

const STORAGE_KEY = "iteam_user_profile_v1";

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  updateUser: async () => ({} as UserProfile),
  setUserLocally: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize cached user from localStorage immediately to avoid layout flicker
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setUser(parsed);
          setLoading(false);
        }
      }
    } catch {
      // LocalStorage access may fail in restricted iframes
    }
  }, []);

  // Sync to localStorage
  const persistUser = useCallback((profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage quota/sandbox issues
    }
  }, []);

  // Fetch true server profile
  const refreshUser = useCallback(async () => {
    try {
      setError(null);
      const serverProfile = await api.getMyProfile();
      if (serverProfile) {
        persistUser(serverProfile);
      }
    } catch (err: any) {
      console.warn("[UserContext] Could not fetch server profile:", err?.message || err);
      setError(err?.message || "Failed to load profile from server");

      // Fallback: If no user exists yet in localStorage, construct initial identity from Telegram WebApp
      setUser((prev) => {
        if (prev) return prev; // Keep cached user, never overwrite with random dummy!
        const tg = getTelegramWebApp();
        const tgUser = tg?.initDataUnsafe?.user;
        const initial: UserProfile = {
          telegram_id: tgUser?.id || 999888777,
          first_name: tgUser?.first_name || "MLBB Player",
          last_name: tgUser?.last_name,
          username: tgUser?.username,
          in_game_nickname: tgUser?.first_name || tgUser?.username || "Yangi O'yinchi",
          mlbb_id: "",
          server_id: "",
          current_rank: "Mythic",
          highest_rank: "Mythic Glory",
          current_stars: 25,
          main_roles: ["Jungler", "Mid Laner"],
          top_heroes: ["Tigreal", "Kalea"],
          playtime_schedule: "20:00 - 00:00 UTC+5",
          is_lfg_active: false,
          karma_score: 100,
          istars_balance: 140,
          selected_background_id: "deep-void",
          total_scrims_played: 0,
          total_pvp_played: 0,
          penalties_count: 0,
          is_banned: false,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        } catch {}
        return initial;
      });
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  // Update profile on server AND instantly sync everywhere
  const updateUser = useCallback(
    async (data: Partial<UserProfile>): Promise<UserProfile> => {
      try {
        setError(null);
        // Optimistic update locally
        setUser((prev) => {
          if (!prev) return null;
          const merged = { ...prev, ...data };
          persistUser(merged);
          return merged;
        });

        // Persist to backend server
        const updated = await api.updateProfile(data);
        if (updated) {
          persistUser(updated);
          return updated;
        }
      } catch (err: any) {
        console.warn("[UserContext] Failed to save profile to server:", err?.message || err);
        setError(err?.message || "Serverga saqlashda xatolik yuz berdi");
        // Still keep local changes in localStorage so the user does not lose their typed name
        throw err;
      }
      return user!;
    },
    [persistUser, user]
  );

  // Initial fetch on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        updateUser,
        setUserLocally: persistUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
