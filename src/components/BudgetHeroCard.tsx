import React from 'react';
import { Pencil } from 'lucide-react';
import { formatRupiah, formatCurrentMonthYear } from '../utils/format';
import { getWalletStatus } from '../constants/categories';

interface BudgetHeroCardProps {
  monthlyBudget: number;
  totalSpent: number;
  onOpenEditBudget: () => void;
}

export const BudgetHeroCard: React.FC<BudgetHeroCardProps> = ({
  monthlyBudget,
  totalSpent,
  onOpenEditBudget,
}) => {
  const remainingBudget = monthlyBudget - totalSpent;
  const spentRatio = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(spentRatio, 0), 100);
  const statusInfo = getWalletStatus(spentRatio);

  // Solid flat bar color based on DESIGN.md
  let progressBarColor = '#2A9D8F'; // Fresh Pine (< 60%)
  if (spentRatio > 85) {
    progressBarColor = '#E63946'; // Red (> 85%)
  } else if (spentRatio >= 60) {
    progressBarColor = '#F4A261'; // Orange (60 - 85%)
  }

  return (
    <div className="bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 card-tactile relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Kondisi Dompet
          </span>
          <h2 className="text-lg font-black text-[#1E232A]">
            {formatCurrentMonthYear()}
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
      <div className="grid grid-cols-2 gap-3 p-4 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-2xl mb-4">
        <div>
          <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-0.5">
            Total Terpakai
          </span>
          <p className="text-lg md:text-xl font-black text-[#1E232A] tracking-tight">
            {formatRupiah(totalSpent)}
          </p>
        </div>

        <div className="border-l border-[#E6E0D4] pl-3">
          <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-0.5">
            Sisa Saldo
          </span>
          <p
            className={`text-lg md:text-xl font-black tracking-tight ${
              remainingBudget >= 0 ? 'text-[#2A9D8F]' : 'text-[#E63946]'
            }`}
          >
            {formatRupiah(remainingBudget)}
          </p>
        </div>
      </div>

      {/* Progress Bar & Target */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[#64748B]">
            {spentRatio.toFixed(1)}% dari limit
          </span>
          <button
            type="button"
            onClick={onOpenEditBudget}
            className="flex items-center gap-1 text-[#1E232A] hover:text-[#F95738] transition-colors underline decoration-dotted"
          >
            <Pencil size={12} />
            <span>Limit: {formatRupiah(monthlyBudget)}</span>
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

      {/* Commentary Quote */}
      <div className="bg-[#FAF7F2] border border-[#1E232A]/20 rounded-xl px-3.5 py-2.5">
        <p className="text-xs font-medium text-[#1E232A] leading-relaxed">
          💬 &ldquo;{statusInfo.comment}&rdquo;
        </p>
      </div>
    </div>
  );
};
