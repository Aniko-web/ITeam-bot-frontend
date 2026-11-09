import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { TelegramProvider } from "@/components/telegram/TelegramProvider";
import { LanguageProvider } from "@/lib/i18n";
import { BottomNav } from "@/components/layout/BottomNav";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { PageTransition } from "@/components/layout/PageTransition";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ITeam — MLBB Esports Platform",
  description: "ITeam: Mobile Legends competitive esports hub, IStars economy powered by Playdom, LFG queues, team rosters, and automated scrim ready checks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className="bg-[#090D14] text-[#F8FAFC] min-h-screen antialiased flex flex-col selection:bg-amber-500 selection:text-black">
        <TelegramProvider>
          <LanguageProvider>
            {/* Dynamic Background Engine (Deep Void, Minimal Slate, Canvas Particles) */}
            <DynamicBackground />

            <div className="flex-1 max-w-md w-full mx-auto pb-28 flex flex-col">
              <PageTransition>{children}</PageTransition>
            </div>

            <BottomNav />
          </LanguageProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
