"use client";

import React from "react";
import { X, Headphones, Send, HelpCircle, ShieldCheck, ExternalLink } from "lucide-react";
import { triggerHaptic } from "@/lib/telegram";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">ITeam Qo‘llab-quvvatlash</h2>
            <p className="text-[11px] text-slate-400">24/7 Yordam va Texnik xizmat</p>
          </div>
        </div>

        {/* Support items */}
        <div className="flex flex-col gap-2">
          <a
            href="https://t.me/iteam_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("light")}
            className="p-3 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Telegram Operator
                </h4>
                <p className="text-[10px] text-slate-400">Jonli aloqa (o‘rtacha javob: 3 daqiqa)</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          </a>

          <a
            href="https://t.me/playdom_bot"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("light")}
            className="p-3 rounded-xl bg-[#0B0F19] border border-white/5 hover:border-amber-500/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Playdom To‘lov Masalalari
                </h4>
                <p className="text-[10px] text-slate-400">IStars to‘lovlari va cheklar tekshiruvi</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </a>

          <div className="p-3 rounded-xl bg-[#090D14] border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-bold text-slate-300">Tez-tez beriladigan savollar:</span>
            </div>
            <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
              <li>100 IStars = 5,000 UZS qatʼiy belgilangan kurs</li>
              <li>Pro team logolari narxi: 100 IStars</li>
              <li>O‘z jamoangiz logosi yuklash narxi: 140 IStars</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

