"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "uz" | "ru" | "en";

export interface Translations {
  nav_home: string;
  nav_my_team: string;
  nav_lfg: string;
  nav_teams: string;
  nav_scrims: string;
  nav_pvp: string;
  nav_settings: string;
  nav_profile: string;

  home_title: string;
  home_subtitle: string;
  home_lfg_active: string;
  home_lfg_idle: string;
  home_roles: string;
  home_trust_score: string;
  home_quick_match: string;
  home_quick_match_desc: string;
  home_scrims: string;
  home_scrims_desc: string;
  home_roster: string;
  home_roster_desc: string;
  home_pvp: string;
  home_pvp_desc: string;
  home_ready_check_notice: string;

  lfg_title: string;
  lfg_subtitle: string;
  lfg_online: string;
  lfg_all_roles: string;
  lfg_all_ranks: string;
  lfg_invite: string;
  lfg_invited: string;
  lfg_top_heroes: string;

  team_title: string;
  team_subtitle: string;
  team_new: string;
  team_slots: string;
  team_voice: string;
  team_view: string;
  team_channel_unlocked: string;
  team_channel_locked: string;
  team_starters: string;
  team_subs: string;
  team_apply: string;

  scrim_title: string;
  scrim_subtitle: string;
  scrim_post: string;
  scrim_ready_live: string;
  scrim_room_creds: string;
  scrim_confirm_ready: string;

  karma_title: string;
  karma_subtitle: string;
  karma_safeguard_title: string;
  karma_safeguard_desc: string;
  karma_endorse: string;
  karma_report: string;
  karma_submit: string;

  hero_picker_title: string;
  hero_picker_selected: string;
  hero_picker_max_warning: string;
  hero_picker_hint: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  uz: {
    nav_home: "Asosiy",
    nav_my_team: "Mening Jamoam",
    nav_lfg: "LFG",
    nav_teams: "Jamoalar",
    nav_scrims: "Scrimlar",
    nav_pvp: "5v5 PvP",
    nav_settings: "Sozlamalar",
    nav_profile: "Profil",

    home_title: "MLBB ESPORTS",
    home_subtitle: "Hamjamiyat Hubi",
    home_lfg_active: "LFG: FAOL",
    home_lfg_idle: "LFG: KUTISH",
    home_roles: "Asosiy Rollar",
    home_trust_score: "Ishonch reytingi",
    home_quick_match: "Tezkor Qidiruv (LFG)",
    home_quick_match_desc: "Yetishmayotgan rol va rang bo'yicha sherik topish.",
    home_scrims: "Scrim Tizimi",
    home_scrims_desc: "Avtomatik Ready Check bilan BO1/BO3 mashg'ulotlari.",
    home_roster: "Jamoa Tarkibi",
    home_roster_desc: "5+2 tarkib va yopiq Discord ovozli kanali.",
    home_pvp: "5v5 Jamoat Lobbisi",
    home_pvp_desc: "Telegram Bot orqali tashkil etilgan custom janglar.",
    home_ready_check_notice: "O'yindan 10 daqiqa oldin Bot orqali ogohlantirish keladi.",

    lfg_title: "Tezkor Qidiruv (LFG)",
    lfg_subtitle: "Jamoangizga mos rang va roldagi o'yinchilarni toping.",
    lfg_online: "Onlayn o'yinchilar",
    lfg_all_roles: "Barcha Rollar",
    lfg_all_ranks: "Barcha Ranglar",
    lfg_invite: "JAMOAGA CHORLASH",
    lfg_invited: "YUBORILDI",
    lfg_top_heroes: "Qahramonlar",

    team_title: "Jamoa Tarkiblari",
    team_subtitle: "5 ta Asosiy + 2 ta Zaxira professional tarkiblari.",
    team_new: "YANGI JAMOA",
    team_slots: "O'rinlar",
    team_voice: "Ovozli kanal",
    team_view: "Tarkibni ko'rish",
    team_channel_unlocked: "Ovozli kanal ochildi",
    team_channel_locked: "Ovozli kanal havolasi yopiq",
    team_starters: "Asosiy Tarkib",
    team_subs: "Zaxira O'yinchilar",
    team_apply: "TARKIBGA QO'SHILISH",

    scrim_title: "Scrim Qidiruv",
    scrim_subtitle: "O'yindan 10 daqiqa oldin 10 kishilik Ready Check.",
    scrim_post: "SCRIM E'LON QILISH",
    scrim_ready_live: "⚔️ READY CHECK FAOLLASHDI",
    scrim_room_creds: "MLBB Custom Xona Ma'lumotlari",
    scrim_confirm_ready: "TAYYORMAN / TASDIQLASH",

    karma_title: "Anti-Troll Karma Tizimi",
    karma_subtitle: "Soxta shikoyatlardan himoyalangan jamoat ishonch reytingi.",
    karma_safeguard_title: "3 ta Alohida Shikoyat Himoyasi",
    karma_safeguard_desc: "Zaharli o'yinchilar nohaq shikoyat qilmasligi uchun faqat 3 ta alohida o'yinchi turli o'yinlarda shikoyat qilgandagina jazo qo'llaniladi.",
    karma_endorse: "MAQTOV (+KARMA)",
    karma_report: "SHIKOYAT (-KARMA)",
    karma_submit: "FIKRNI YUBORISH",

    hero_picker_title: "Asosiy Qahramonlar (Maksimal 3 ta)",
    hero_picker_selected: "Tanlangan",
    hero_picker_max_warning: "Maksimal 3 ta asosiy qahramon tanlash mumkin!",
    hero_picker_hint: "💡 Qahramon ustiga bosing va maksimal 3 ta asosiy geroyingizni belgilang.",
  },

  ru: {
    nav_home: "Главная",
    nav_my_team: "Моя Команда",
    nav_lfg: "LFG",
    nav_teams: "Команды",
    nav_scrims: "Скримы",
    nav_pvp: "5v5 PvP",
    nav_settings: "Настройки",
    nav_profile: "Профиль",

    home_title: "MLBB ESPORTS",
    home_subtitle: "Хаб Сообщества",
    home_lfg_active: "LFG: АКТИВЕН",
    home_lfg_idle: "LFG: НЕ АКТИВЕН",
    home_roles: "Основные Роли",
    home_trust_score: "Очки доверия",
    home_quick_match: "Быстрый поиск (LFG)",
    home_quick_match_desc: "Поиск тиммейтов по недостающей роли и рангу.",
    home_scrims: "Поиск Скримов",
    home_scrims_desc: "Тренировочные матчи BO1/BO3 с авто-Ready Check.",
    home_roster: "Ростер Команды",
    home_roster_desc: "Состав 5+2 и приватный голосовой канал Discord.",
    home_pvp: "5v5 Кастомное Лобби",
    home_pvp_desc: "Быстрые пользовательские матчи через Telegram Бота.",
    home_ready_check_notice: "Бот пришлет Ready Check ровно за 10 минут до матча.",

    lfg_title: "Быстрый поиск (LFG)",
    lfg_subtitle: "Найдите игроков под недостающую линию команды.",
    lfg_online: "Игроков онлайн",
    lfg_all_roles: "Все Роли",
    lfg_all_ranks: "Все Ранги",
    lfg_invite: "ПРИГЛАСИТЬ В ПАТИ",
    lfg_invited: "ОТПРАВЛЕНО",
    lfg_top_heroes: "Герои",

    team_title: "Ростеры Команд",
    team_subtitle: "5 основных + 2 запасных соревновательных состава.",
    team_new: "НОВАЯ КОМАНДА",
    team_slots: "Слоты",
    team_voice: "Голосовой канал",
    team_view: "Смотреть состав",
    team_channel_unlocked: "Голосовой канал открыт",
    team_channel_locked: "Ссылка на голосовой канал скрыта",
    team_starters: "Основной Состав",
    team_subs: "Запасные Игроки",
    team_apply: "ПОДАТЬ ЗАЯВКУ",

    scrim_title: "Поиск Скримов",
    scrim_subtitle: "Автоматический Ready Check за 10 минут до начала.",
    scrim_post: "СОЗДАТЬ СКРИМ",
    scrim_ready_live: "⚔️ READY CHECK АКТИВЕН",
    scrim_room_creds: "Данные комнаты MLBB",
    scrim_confirm_ready: "ГОТОВ / ПОДТВЕРДИТЬ",

    karma_title: "Система Кармы (Анти-Тролль)",
    karma_subtitle: "Рейтинг доверия с защитой от ложных жалоб.",
    karma_safeguard_title: "Защита 3-х Независимых Жалоб",
    karma_safeguard_desc: "Для предотвращения токсичных репортов, значительное списание Кармы происходит только после 3-х жалоб от разных игроков в разных матчах.",
    karma_endorse: "ПОХВАЛА (+КАРМА)",
    karma_report: "ЖАЛОБА (-КАРМА)",
    karma_submit: "ОТПРАВИТЬ ОТЗЫВ",

    hero_picker_title: "Основные Герои (Макс 3)",
    hero_picker_selected: "Выбрано",
    hero_picker_max_warning: "Можно выбрать максимум 3 основных персонажей!",
    hero_picker_hint: "💡 Нажмите на героя, чтобы выбрать (максимум 3 основных персонажа).",
  },

  en: {
    nav_home: "Home",
    nav_my_team: "My Team",
    nav_lfg: "LFG",
    nav_teams: "Teams",
    nav_scrims: "Scrims",
    nav_pvp: "5v5 PvP",
    nav_settings: "Settings",
    nav_profile: "Profile",

    home_title: "MLBB ESPORTS",
    home_subtitle: "Community Hub",
    home_lfg_active: "LFG: ACTIVE",
    home_lfg_idle: "LFG: IDLE",
    home_roles: "Main Roles",
    home_trust_score: "Trust Score",
    home_quick_match: "Quick Match (LFG)",
    home_quick_match_desc: "Find solo players by missing role and rank tier.",
    home_scrims: "Scrim Finder",
    home_scrims_desc: "BO1/BO3 practice matches with automated Ready Checks.",
    home_roster: "Team Roster",
    home_roster_desc: "Manage 5+2 lineup & unlock private Discord channel.",
    home_pvp: "5v5 Community PvP",
    home_pvp_desc: "Fast custom lobbies initiated by Telegram Bot admins.",
    home_ready_check_notice: "Bot will ping you 10 mins before your match.",

    lfg_title: "Quick Match (LFG)",
    lfg_subtitle: "Find players matching your team's missing role and rank.",
    lfg_online: "Online Now",
    lfg_all_roles: "All Roles",
    lfg_all_ranks: "All Ranks",
    lfg_invite: "INVITE TO PARTY",
    lfg_invited: "INVITED",
    lfg_top_heroes: "Heroes",

    team_title: "Team Rosters",
    team_subtitle: "5 Starters + 2 Substitutes competitive lineups.",
    team_new: "NEW TEAM",
    team_slots: "Slots",
    team_voice: "Voice Channel",
    team_view: "View Roster",
    team_channel_unlocked: "Voice Channel Unlocked",
    team_channel_locked: "Channel Link Encrypted",
    team_starters: "Main Starters",
    team_subs: "Substitutes",
    team_apply: "APPLY TO JOIN ROSTER",

    scrim_title: "Scrim Practice Finder",
    scrim_subtitle: "Automated 10-player Ready Checks exactly 10m before match.",
    scrim_post: "POST SCRIM",
    scrim_ready_live: "⚔️ READY CHECK LIVE",
    scrim_room_creds: "MLBB Custom Room Credentials",
    scrim_confirm_ready: "CONFIRM READY",

    karma_title: "Anti-Troll Karma System",
    karma_subtitle: "Peer-reviewed community trust with false-report protection.",
    karma_safeguard_title: "3-Report False-Reporting Safeguard",
    karma_safeguard_desc: "To prevent toxic false reporting, significant Karma deductions require at least 3 distinct player reports over separate matches.",
    karma_endorse: "ENDORSE (+KARMA)",
    karma_report: "REPORT (-KARMA)",
    karma_submit: "SUBMIT FEEDBACK",

    hero_picker_title: "Main Heroes (Max 3)",
    hero_picker_selected: "Selected",
    hero_picker_max_warning: "Maximum 3 main heroes can be selected!",
    hero_picker_hint: "💡 Tap on any hero to mark them as your main (up to 3 heroes).",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "uz",
  setLanguage: () => {},
  t: TRANSLATIONS.uz,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("mlbb_lang") as Language;
    if (saved && (saved === "uz" || saved === "ru" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mlbb_lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language] || TRANSLATIONS.uz,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

