"use client";

import React, { useState } from "react";
import {
  TEAM_LOGOS,
  REGIONS,
  TeamLogoItem,
  TeamRegion,
  CUSTOM_LOGO_FEE_ISTARS,
  PREMIUM_LOGO_FEE_ISTARS,
} from "@/data/teamLogos";
import { PlaydomTopupModal } from "@/components/modals/PlaydomTopupModal";
import { triggerHaptic } from "@/lib/telegram";
import {
  Sparkles,
  Upload,
  Check,
  AlertCircle,
  Coins,
  ShieldCheck,
  X,
} from "lucide-react";

interface TeamLogoSelectorProps {
  selectedLogoId?: string;
  isCustomLogo?: boolean;
  customLogoUrl?: string;
  currentBalance?: number;
  onSelectLogo: (logoId: string, isCustom: boolean, customUrl?: string) => void;
  onBalanceUpdate?: (newBalance: number) => void;
}

export const TeamLogoSelector: React.FC<TeamLogoSelectorProps> = ({
  selectedLogoId = "fnatic_onic",
  isCustomLogo = false,
  customLogoUrl = "",
  currentBalance = 150,
  onSelectLogo,
  onBalanceUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<"pro" | "custom">(
    isCustomLogo ? "custom" : "pro"
  );
  const [selectedRegion, setSelectedRegion] = useState<TeamRegion | "ALL">("ALL");
  const [pendingPremiumLogo, setPendingPremiumLogo] = useState<TeamLogoItem | null>(null);
  const [showPlaydomModal, setShowPlaydomModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>(customLogoUrl || "");

  const filteredLogos = TEAM_LOGOS.filter((item) => {
    if (selectedRegion === "ALL") return true;
    return item.region === selectedRegion;
  });

  const handleCardClick = (logo: TeamLogoItem) => {
    triggerHaptic("selection");
    if (logo.tier === "free") {
      onSelectLogo(logo.id, false);
      return;
    }

    // Premium tier (100 IStars)
    if (currentBalance < PREMIUM_LOGO_FEE_ISTARS) {
      triggerHaptic("warning");
      setPendingPremiumLogo(logo);
      setShowPlaydomModal(true);
      return;
    }

    // Prompt lightweight confirmation dialog
    setPendingPremiumLogo(logo);
  };

  const confirmPremiumPurchase = () => {
    if (!pendingPremiumLogo) return;
    triggerHaptic("impactMedium");
    onSelectLogo(pendingPremiumLogo.id, false);
    setPendingPremiumLogo(null);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (currentBalance < CUSTOM_LOGO_FEE_ISTARS) {
      triggerHaptic("warning");
      setShowPlaydomModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      onSelectLogo("custom_upload", true, result);
      triggerHaptic("impactMedium");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Mode Switcher: Pro Teams vs Custom Logo */}
      <div className="flex items-center justify-between p-1 bg-[#111722] border border-white/10 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("pro");
            triggerHaptic("selection");
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "pro"
              ? "bg-[#1A2338] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Pro Jamoalar (MPL)
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("custom");
            triggerHaptic("selection");
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "custom"
              ? "bg-[#1A2338] text-white shadow-sm border border-white/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-blue-400" />
          O'z rasmingizni yuklash
        </button>
      </div>

      {/* PRO TEAMS TAB */}
      {activeTab === "pro" && (
        <div className="flex flex-col space-y-3">
          {/* Region Tabs (All, MPL ID, MPL PH, MPL MY) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                setSelectedRegion("ALL");
                triggerHaptic("selection");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedRegion === "ALL"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-[#111722] text-slate-400 border border-white/5 hover:border-white/15 hover:text-slate-200"
              }`}
            >
              Barchasi ({TEAM_LOGOS.length})
            </button>
            {REGIONS.map((reg) => {
              const count = TEAM_LOGOS.filter((x) => x.region === reg).length;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg);
                    triggerHaptic("selection");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedRegion === reg
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-[#111722] text-slate-400 border border-white/5 hover:border-white/15 hover:text-slate-200"
                  }`}
                >
                  {reg} ({count})
                </button>
              );
            })}
          </div>

          {/* Logos Grid (3 or 4 columns) */}
          <div className="grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredLogos.map((logo) => {
              const isSelected = !isCustomLogo && selectedLogoId === logo.id;
              const isPremium = logo.tier === "premium";

              return (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => handleCardClick(logo)}
                  className={`relative flex flex-col items-center p-2.5 rounded-2xl border transition-all text-left group ${
                    isSelected
                      ? "bg-[#182238] border-white/40 shadow-sm"
                      : "bg-[#111622] border-white/5 hover:border-white/20 hover:bg-[#151c2c]"
                  }`}
                >
                  {/* Tier / Price Ribbon Badge */}
                  <div className="absolute top-1.5 right-1.5 z-10">
                    {isPremium ? (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                        <Coins className="w-2.5 h-2.5 text-amber-400" />
                        100
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Bepul
                      </span>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-1.5 left-1.5 z-10 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Visual Emblem Badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center my-1 relative shadow-inner border border-white/10 transition-transform group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${logo.primaryColor}33 0%, ${logo.secondaryColor} 100%)`,
                    }}
                  >
                    <span className="text-xl font-black drop-shadow-md tracking-tighter text-white">
                      {logo.badgeText.split(" ")[0]}
                    </span>
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider px-1 rounded bg-black/40"
                      style={{ color: logo.primaryColor }}
                    >
                      {logo.tag}
                    </span>
                  </div>

                  {/* Name and Tag */}
                  <span className="text-[11px] font-semibold text-white truncate w-full text-center mt-1">
                    {logo.name}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">
                    {logo.region}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CUSTOM UPLOAD TAB */}
      {activeTab === "custom" && (
        <div className="flex flex-col space-y-3">
          <div className="p-4 rounded-2xl bg-[#111622] border border-white/10 flex flex-col items-center text-center">
            {uploadedImage ? (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-md mb-3">
                <img
                  src={uploadedImage}
                  alt="Custom Team Logo"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImage("");
                    onSelectLogo("fnatic_onic", false);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 rounded-2xl hover:border-white/30 cursor-pointer bg-white/[0.02] transition-colors mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 border border-blue-500/20">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white mb-0.5">
                  Rasm tanlang (PNG yoki JPG)
                </span>
                <span className="text-[10px] text-slate-400">
                  Tavsiya: Kvadrat format, kamida 512x512px
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Fee Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left w-full">
              <Coins className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 text-[11px] text-slate-300">
                <span className="font-semibold text-amber-300">
                  Narx: {CUSTOM_LOGO_FEE_ISTARS} IStars
                </span>{" "}
                (7,000 UZS). Jamoa yaratilganda yechiladi.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTWEIGHT CONFIRMATION MODAL FOR PREMIUM LOGO (100 IStars) */}
      {pendingPremiumLogo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#111722] border border-white/15 p-5 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Premium Logo Tanlash
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingPremiumLogo(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 my-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0 border border-white/10"
                style={{
                  background: `linear-gradient(135deg, ${pendingPremiumLogo.primaryColor} 0%, ${pendingPremiumLogo.secondaryColor} 100%)`,
                }}
              >
                {pendingPremiumLogo.badgeText.split(" ")[0]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">
                  {pendingPremiumLogo.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {pendingPremiumLogo.description}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Ushbu logoni tanlash uchun hisobingizdan{" "}
              <strong className="text-amber-400">
                {pendingPremiumLogo.price_istars} IStars
              </strong>{" "}
              (5,000 UZS) yechiladi. Tasdiqlaysizmi?
            </p>

            <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#090D14] border border-white/5 mb-4">
              <span className="text-slate-400">Joriy balans:</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {currentBalance} IStars
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPendingPremiumLogo(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmPremiumPurchase}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-lg shadow-amber-500/20"
              >
                Tasdiqlash (100 ⭐)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYDOM TOP-UP MODAL (When Balance < Fee) */}
      <PlaydomTopupModal
        isOpen={showPlaydomModal}
        onClose={() => {
          setShowPlaydomModal(false);
          setPendingPremiumLogo(null);
        }}
        currentBalance={currentBalance}
        onSuccess={(newBal) => {
          onBalanceUpdate?.(newBal);
          setShowPlaydomModal(false);
          if (pendingPremiumLogo) {
            onSelectLogo(pendingPremiumLogo.id, false);
            setPendingPremiumLogo(null);
          }
        }}
      />
    </div>
  );
};

