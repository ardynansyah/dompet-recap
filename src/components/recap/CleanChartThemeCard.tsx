import React, { useMemo } from 'react';
import type { Transaction, CategoryId } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import {
  formatRupiah,
  formatCurrentMonthYear,
  getCurrentMonthPrefix,
} from '../../utils/format';

interface CleanChartThemeCardProps {
  transactions: Transaction[];
  monthlyBudget?: number;
  hideAmount: boolean;
  selectedMonth?: string;
}

interface ComputedSlice {
  id: CategoryId;
  name: string;
  color: string;
  total: number;
  percentage: number;
  strokeDasharray: string;
  strokeDashoffset: number;
}

// Pure helper function defined outside component to ensure zero React immutability/render purity warnings
function calculateSlices(
  items: { id: CategoryId; name: string; color: string; total: number; percentage: number }[],
  totalSpent: number,
  circumference: number
): ComputedSlice[] {
  let accumulatedOffset = 0;
  const hasMultiple = items.length > 1;

  return items.map((cat) => {
    const sliceLen = totalSpent > 0 ? (cat.total / totalSpent) * circumference : 0;
    const gap = hasMultiple ? 3 : 0;
    const effectiveSlice = Math.max(sliceLen - gap, 0.5);
    const strokeDasharray = hasMultiple
      ? `${effectiveSlice} ${circumference - effectiveSlice}`
      : `${circumference} 0`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += sliceLen;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });
}

export const CleanChartThemeCard: React.FC<CleanChartThemeCardProps> = ({
  transactions,
  hideAmount,
  selectedMonth,
}) => {
  const currentMonth = selectedMonth || getCurrentMonthPrefix();

  // Thin-Ring Donut Chart Dimensions (myBCA style)
  const donutSize = 180;
  const donutStroke = 12; // Cincin ramping & elegan
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const { currentTransactions, totalSpent, sortedCategories, slices } = useMemo(() => {
    const current = transactions.filter((t) => t.date.startsWith(currentMonth));
    const spent = current.reduce((acc, t) => acc + t.amount, 0);

    const categoryTotals: Record<CategoryId, number> = {
      makan: 0,
      nongkrong: 0,
      transport: 0,
      belanja: 0,
      hiburan: 0,
      lainnya: 0,
    };

    current.forEach((tx) => {
      if (categoryTotals[tx.categoryId] !== undefined) {
        categoryTotals[tx.categoryId] += tx.amount;
      }
    });

    const sorted = (Object.keys(categoryTotals) as CategoryId[])
      .map((cid) => ({
        id: cid,
        name: CATEGORIES[cid].name,
        color: CATEGORIES[cid].color,
        total: categoryTotals[cid],
        percentage:
          spent > 0 ? Math.round((categoryTotals[cid] / spent) * 100) : 0,
      }))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    const computed = calculateSlices(sorted, spent, donutCircumference);

    return {
      currentTransactions: current,
      totalSpent: spent,
      sortedCategories: sorted,
      slices: computed,
    };
  }, [transactions, currentMonth, donutCircumference]);

  return (
    <div
      className="w-[360px] h-[640px] bg-[#181B20] border-2 border-[#1E232A] rounded-2xl p-6 flex flex-col justify-between text-white select-none overflow-hidden relative"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Background Subtle Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Header: Clean Month & Year */}
      <div className="relative z-10 text-center space-y-1">
        <span className="text-[11px] font-bold text-white/50 tracking-widest uppercase block">
          CATATAN PENGELUARAN
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {formatCurrentMonthYear(currentMonth)}
        </h1>
      </div>

      {/* Center Hero: Thin-Ring Donut Chart (myBCA Style) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
          <svg
            width={donutSize}
            height={donutSize}
            viewBox={`0 0 ${donutSize} ${donutSize}`}
            className="transform -rotate-90"
          >
            {/* Background Ring Track */}
            <circle
              cx={donutSize / 2}
              cy={donutSize / 2}
              r={donutRadius}
              fill="transparent"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={donutStroke}
            />

            {/* Slices with small gaps */}
            {slices.map((item) => (
              <circle
                key={item.id}
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={donutRadius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={donutStroke}
                strokeDasharray={item.strokeDasharray}
                strokeDashoffset={item.strokeDashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Center Hole: Total Kepake & Amount */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              Total Kepake
            </span>
            <p className="text-lg font-black text-white leading-tight tracking-tight mt-0.5">
              {hideAmount ? 'Rp ••••••' : formatRupiah(totalSpent)}
            </p>
            <span className="text-[10px] font-medium text-white/40 mt-0.5">
              {currentTransactions.length} transaksi
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown List (Clean & Minimal) */}
      <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/60 pb-1 border-b border-white/10 tracking-wider">
          <span>Kategori</span>
          <span>Porsi</span>
        </div>

        {sortedCategories.length === 0 ? (
          <p className="text-xs text-white/40 italic text-center py-3">
            Belum ada pengeluaran tercatat
          </p>
        ) : (
          <div className="space-y-2">
            {sortedCategories.slice(0, 5).map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate text-[11px]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-white/70">
                      {hideAmount ? 'Rp ••••••' : formatRupiah(cat.total)}
                    </span>
                    <span className="text-[11px] font-black text-white min-w-[32px] text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
                {/* Thin sleek bar */}
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Minimal Watermark Footer */}
      <div className="relative z-10 text-center pt-2">
        <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">
          DOMPET RECAP &middot; DOMPETRECAP.APP
        </p>
      </div>
    </div>
  );
};
