import React from 'react';
import { Pencil, Sparkles, AlertTriangle } from 'lucide-react';
import { formatRupiah, formatCurrentMonthYear } from '../utils/format';
import { getWalletStatus } from '../constants/categories';

interface BudgetHeroCardProps {
  monthlyBudget: number;
  totalSpent: number;
  selectedMonth?: string;
  onOpenEditBudget: () => void;
  onOpenStoryModal: () => void;
}

export const BudgetHeroCard: React.FC<BudgetHeroCardProps> = ({
  monthlyBudget,
  totalSpent,
  selectedMonth,
  onOpenEditBudget,
  onOpenStoryModal,
}) => {
  const remainingBudget = monthlyBudget - totalSpent;
  const spentRatio = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(spentRatio, 0), 100);
  const statusInfo = getWalletStatus(spentRatio);

  // Solid flat bar color based on DESIGN.md
  let progressBarColor = '#2A9D8F'; // Fresh Pine (< 60%)
  if (spentRatio > 85) {
    progressBarColor = '#E11D48'; // Rose Alert (> 85%)
  } else if (spentRatio >= 60) {
    progressBarColor = '#F4A261'; // Orange Warm Toffee (60 - 85%)
  }

  // Warning Banner calculation
  let warningBanner = null;
  if (spentRatio > 100) {
    warningBanner = {
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#B91C1C]',
      text: 'text-[#7F1D1D]',
      message: 'Fix boncos! Pengeluaran bulan ini udah lewat batas.',
    };
  } else if (spentRatio >= 90) {
    warningBanner = {
      bg: 'bg-[#FFF1F2]',
      border: 'border-[#E11D48]',
      text: 'text-[#9F1239]',
      message: 'Waduh, saldo udah kritis! Tahan dulu checkout sama ngopinya.',
    };
  } else if (spentRatio >= 75) {
    warningBanner = {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#F59E0B]',
      text: 'text-[#92400E]',
      message: 'Rem dikit bro, jatah bulan ini tinggal dikit lagi.',
    };
  }

  return (
    <div className="bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 card-tactile relative overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Dompet Aman?
          </span>
          <h2 className="text-lg font-black text-[#1E232A]">
            {formatCurrentMonthYear(selectedMonth)}
          </h2>
        </div>

        {/* Status Badge */}
        <div
          className="px-3 py-1 rounded-full border-2 border-[#1E232A] text-xs font-black tracking-wide flex items-center gap-1.5 shadow-[2px_2px_0px_#1E232A]"
          style={{
            backgroundColor: statusInfo.badgeBg,
            color: statusInfo.badgeText,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusInfo.accentColor }}
          />
          {statusInfo.label}
        </div>
      </div>

      {/* Main Numbers: Sisa & Terpakai */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-2xl">
        <div>
          <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-0.5">
            Udah Kepake
          </span>
          <p className="text-lg md:text-xl font-black text-[#1E232A] tracking-tight">
            {formatRupiah(totalSpent)}
          </p>
        </div>

        <div className="border-l border-[#E6E0D4] pl-3">
          <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-0.5">
            Sisa Duit
          </span>
          <p
            className={`text-lg md:text-xl font-black tracking-tight ${
              remainingBudget >= 0 ? 'text-[#2A9D8F]' : 'text-[#E11D48]'
            }`}
          >
            {formatRupiah(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Progress Bar & Limit Settings */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#64748B]">
            {spentRatio.toFixed(1)}% terpakai
          </span>
          <button
            type="button"
            onClick={onOpenEditBudget}
            className="flex items-center gap-1 text-[#1E232A] hover:text-[#F95738] transition-colors underline decoration-dotted cursor-pointer"
          >
            <Pencil size={12} />
            <span>Jatah: {formatRupiah(monthlyBudget)}</span>
          </button>
        </div>

        {/* Chunky Flat Progress Track */}
        <div className="w-full bg-[#E6E0D4] border-2 border-[#1E232A] rounded-full h-4 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${clampedPercentage}%`,
              backgroundColor: progressBarColor,
            }}
          />
        </div>
      </div>

      {/* Dynamic Warning Banner (75%+, 90%+, >100%) */}
      {warningBanner && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-2xl border-2 ${warningBanner.bg} ${warningBanner.border} ${warningBanner.text} animate-in fade-in duration-200`}
        >
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs font-black leading-snug">
            {warningBanner.message}
          </p>
        </div>
      )}

      {/* Action: Bikin Recap IG Story */}
      <button
        type="button"
        onClick={onOpenStoryModal}
        className="w-full py-3 px-4 rounded-2xl border-2 border-[#1E232A] bg-[#7058D0] text-white text-sm font-black tracking-wide btn-tactile flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles size={16} />
        <span>Bikin Recap IG Story</span>
      </button>
    </div>
  );
};
