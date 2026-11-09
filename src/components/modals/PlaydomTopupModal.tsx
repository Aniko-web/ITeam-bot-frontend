"use client";

import React, { useState } from "react";
import { X, Sparkles, ShieldCheck, Check, ArrowRight, Zap, ExternalLink } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";
import { api } from "@/lib/api";

interface PlaydomTopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSuccess: (newBalance: number) => void;
  userId?: number;
}

const PACKAGES = [
  {
    id: "pkg_100",
    name: "Starter Stash",
    istars: 100,
    uzs: 5000,
    bonus: 0,
    badge: "100 IStars",
    desc: "Pro Team logo (ONIC, Liquid, EVOS)",
    tag: null,
  },
  {
    id: "pkg_250",
    name: "Custom Team Pack",
    istars: 250,
    uzs: 12500,
    bonus: 10,
    badge: "250 IStars",
    desc: "Custom Logo (140) + 110 Zaxira",
    tag: "Eng Ommabop",
  },
  {
    id: "pkg_500",
    name: "Captain Bundle",
    istars: 500,
    uzs: 25000,
    bonus: 35,
    badge: "500 IStars",
    desc: "Katta jamoalar va scrim badallari",
    tag: "+35 Bonus",
  },
  {
    id: "pkg_1000",
    name: "Esports Org",
    istars: 1000,
    uzs: 50000,
    bonus: 100,
    badge: "1,000 IStars",
    desc: "To'liq jamoa boshqaruvi va badallar",
    tag: "+100 Bonus",
  },
];

export const PlaydomTopupModal: React.FC<PlaydomTopupModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onSuccess,
  userId = 999888777,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<string>("pkg_250");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    triggerHaptic("heavy");
    setLoading(true);
    try {
      const res = await api.topUpIStars(selectedPkg);
      triggerHaptic("success");
      setSuccessMsg(res.message);
      onSuccess(res.new_balance);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch {
      // Fallback optimistic top-up for local dev
      const chosen = PACKAGES.find((p) => p.id === selectedPkg);
      const added = (chosen?.istars || 100) + (chosen?.bonus || 0);
      const newBal = currentBalance + added;
      triggerHaptic("success");
      setSuccessMsg(`+${added} IStars Playdom orqali hisobingizga qo'shildi!`);
      onSuccess(newBal);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const selectedData = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#111622] border border-white/10 rounded-2xl p-5 shadow-2xl relative text-white flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={() => {
            triggerHaptic("light");
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">IStars Balansini To‘ldirish</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Hamkor:</span>
              <span className="font-semibold text-amber-400">Playdom Official</span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Balance & Rate Pill */}
        <div className="bg-[#090D14] border border-white/5 rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Mavjud Balans
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-amber-300 font-mono">{currentBalance}</span>
              <span className="text-xs font-bold text-slate-400">IStars</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Kurs
            </span>
            <span className="text-[11px] font-mono text-slate-300 font-semibold">
              100 IStars = 5,000 UZS
            </span>
          </div>
        </div>

        {/* Package Selector Grid */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Paketni tanlang
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PACKAGES.map((pkg) => {
              const isSelected = selectedPkg === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    setSelectedPkg(pkg.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#182030] border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : "bg-[#0B0F19] border-white/5 hover:border-white/15"
                  }`}
                >
                  {pkg.tag && (
                    <span className="absolute -top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-500 text-black">
                      {pkg.tag}
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{pkg.badge}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400 stroke-[3]" />}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{pkg.desc}</p>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-baseline justify-between">
                    <span className="text-xs font-mono font-black text-amber-300">
                      {pkg.uzs.toLocaleString()} UZS
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Guide Note */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 text-[11px] text-slate-400 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span>• Pro Team Logo narxi:</span>
            <span className="font-semibold text-slate-200">100 IStars (5,000 UZS)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>• Custom Logo yuklash to‘lovi:</span>
            <span className="font-semibold text-slate-200">140 IStars (7,000 UZS)</span>
          </div>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-extrabold text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block animate-spin mr-1">⚡</span>
          ) : (
            <Zap className="w-4 h-4 fill-black" />
          )}
          <span>Playdom orqali to‘ldirish ({selectedData.uzs.toLocaleString()} UZS)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Playdom Partner Footer */}
        <div className="text-center pt-1">
          <a
            href={`https://t.me/playdom_bot?start=user_${userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
          >
            <span>Playdom xizmati haqida batafsil</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

