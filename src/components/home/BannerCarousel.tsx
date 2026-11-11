"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ShieldCheck, ChevronRight, Zap, Trophy, Gift } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";

interface BannerCarouselProps {
  onOpenTopup: () => void;
  userId?: number;
}

interface BannerItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  actionText: string;
  bgGradient: string;
  icon: React.ReactNode;
  action: () => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onOpenTopup, userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const banners: BannerItem[] = [
    {
      id: "istars-recharge",
      tag: "HAMKORLIK AKSIYASI",
      tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      title: "IStars balansini to‘ldiring",
      subtitle: "100 IStars = 5,000 UZS. Pro logolar va custom rasmlar uchun Playdom xizmati.",
      actionText: "To‘ldirish",
      bgGradient: "from-[#182030] via-[#111622] to-[#0D121B]",
      icon: <Sparkles className="w-8 h-8 text-amber-400 opacity-90" />,
      action: () => {
        triggerHaptic("medium");
        onOpenTopup();
      },
    },
    {
      id: "playdom-partner",
      tag: "PLAYDOM XIZMATI",
      tagColor: "bg-white/10 text-white border-white/20",
      title: "Playdom Rasmiy Hamkor",
      subtitle: "Xavfsiz va tezkor to‘lovlar, eksklyuziv bonuslar va 24/7 yordam kafolati.",
      actionText: "Batafsil",
      bgGradient: "from-[#131D2E] via-[#111622] to-[#0A0E17]",
      icon: <Gift className="w-8 h-8 text-white opacity-90" />,
      action: () => {
        triggerHaptic("light");
        window.open(`https://t.me/playdom_bot?start=user_${userId || "iteam"}`, "_blank");
      },
    },
    {
      id: "pro-teams-roster",
      tag: "PRO CLANLAR",
      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      title: "ONIC, Liquid, EVOS Logolari",
      subtitle: "Jamoangizga rasmiy pro klanlar logolarini atigi 100 IStars evaziga o‘rnating.",
      actionText: "Kashf qilish",
      bgGradient: "from-[#15232A] via-[#111622] to-[#090D14]",
      icon: <Trophy className="w-8 h-8 text-emerald-400 opacity-90" />,
      action: () => {
        triggerHaptic("medium");
        window.location.href = "/teams";
      },
    },
  ];

  // Auto-slide effect (every 5.5s)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  // Touch Swipe handlers
  const minSwipeDistance = 45;

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      triggerHaptic("light");
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      triggerHaptic("light");
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="flex flex-col gap-2">
      {/* Banner Container */}
      <div
        onTouchStart={onTouchStartHandler}
        onTouchMove={onTouchMoveHandler}
        onTouchEnd={onTouchEndHandler}
        className={`relative w-full rounded-2xl p-4 neumo-card-raised overflow-hidden transition-all duration-300 min-h-[142px] flex flex-col justify-between group`}
      >
        {/* Specular Liquid Top Light */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/[0.02] rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

        {/* Top Tag & Decorative Icon */}
        <div className="flex items-start justify-between relative z-10">
          <span
            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentBanner.tagColor}`}
          >
            {currentBanner.tag}
          </span>
          <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5">
            {currentBanner.icon}
          </div>
        </div>

        {/* Content Body */}
        <div className="relative z-10 mt-1">
          <h3 className="text-base font-black text-white tracking-tight leading-snug">
            {currentBanner.title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed max-w-[270px]">
            {currentBanner.subtitle}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 relative z-10">
          <button
            type="button"
            onClick={currentBanner.action}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white liquid-glass hover:brightness-110 px-3.5 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span>{currentBanner.actionText}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </button>

          <span className="text-[10px] text-slate-500 font-mono">
            {currentIndex + 1} / {banners.length}
          </span>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              triggerHaptic("light");
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "w-6 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

