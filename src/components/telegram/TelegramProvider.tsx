"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";
import { getTelegramWebApp } from "@/lib/telegram";

interface TelegramContextType {
  isReady: boolean;
  user: any | null;
  initData: string;
}

const TelegramContext = createContext<TelegramContextType>({
  isReady: false,
  user: null,
  initData: "",
});

export const useTelegram = () => useContext(TelegramContext);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [initData, setInitData] = useState("");

  const setupTelegram = () => {
    const tg = getTelegramWebApp();
    if (tg) {
      tg.ready();
      tg.expand();
      setInitData(tg.initData);
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
      setIsReady(true);
    } else {
      // Running in browser outside Telegram
      setUser({
        id: 999888777,
        first_name: "DemoCaptain",
        username: "democaptain",
      });
      setIsReady(true);
    }
  };

  useEffect(() => {
    setupTelegram();
  }, []);

  return (
    <TelegramContext.Provider value={{ isReady, user, initData }}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onLoad={setupTelegram}
      />
      {children}
    </TelegramContext.Provider>
  );
};

