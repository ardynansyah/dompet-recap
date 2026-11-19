import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Sparkles, ChevronDown } from 'lucide-react';
import type { Transaction, CategoryId } from '../types';
import { CATEGORIES } from '../constants/categories';
import {
  formatRupiah,
  getRecentMonthOptions,
} from '../utils/format';

interface SpendingDonutChartProps {
  transactions: Transaction[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenStoryModal: () => void;
}

export const SpendingDonutChart: React.FC<SpendingDonutChartProps> = ({
  transactions,
  selectedMonth,
  onSelectMonth,
  isPrivacyMode,
  onTogglePrivacy,
  onOpenStoryModal,
}) => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<CategoryId | null>(null);

  // Filter transactions for selected month
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Aggregate spending by category
  const { categoryData, totalSpent } = useMemo(() => {
    const totals: Record<CategoryId, number> = {
      makan: 0,
      nongkrong: 0,
      transport: 0,
      belanja: 0,
      hiburan: 0,
      lainnya: 0,
    };

    let total = 0;
    filteredTransactions.forEach((tx) => {
      if (totals[tx.categoryId] !== undefined) {
        totals[tx.categoryId] += tx.amount;
        total += tx.amount;
      }
    });

    const data = (Object.keys(totals) as CategoryId[])
      .map((id) => {
        const amount = totals[id];
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        return {
          id,
          name: CATEGORIES[id].name,
          color: CATEGORIES[id].color,
          bgColor: CATEGORIES[id].bgColor,
          textColor: CATEGORIES[id].textColor,
          amount,
          percentage,
        };
      })
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    return { categoryData: data, totalSpent: total };
  }, [filteredTransactions]);

  // Thin-Ring SVG Donut dimensions (myBCA style)
  const size = 210;
  const strokeWidthDefault = 12; // Cincin ramping & bersih
  const strokeWidthActive = 17;  // Pop-out saat di-hover/tap
  const radius = (size - strokeWidthActive) / 2; // ~96.5px
  const circumference = 2 * Math.PI * radius;

  // Active hovered/tapped category
  const activeCategory = hoveredCategoryId
    ? categoryData.find((c) => c.id === hoveredCategoryId)
    : null;

  const monthOptions = useMemo(() => getRecentMonthOptions(), []);

  return (
    <div className="bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 card-tactile space-y-4">
      {/* Header with Title & Month Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#E6E0D4]">
        <div>
          <h3 className="text-base font-extrabold text-[#1E232A]">Larinya Duit Lu</h3>
        </div>

        {/* Dropdown Pemilih Bulan */}
        <div className="relative inline-block self-start sm:self-auto">
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="appearance-none bg-[#F8F5EE] hover:bg-[#F2EDE2] border-2 border-[#1E232A] rounded-xl pl-3 pr-8 py-1.5 text-xs font-black text-[#1E232A] cursor-pointer focus:outline-none shadow-[2px_2px_0px_#1E232A]"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1E232A] pointer-events-none"
          />
        </div>
      </div>

      {totalSpent === 0 ? (
        <div className="py-10 text-center bg-[#F8F5EE] border-2 border-dashed border-[#1E232A]/20 rounded-2xl">
          <p className="text-sm font-bold text-[#1E232A] mb-1">
            Belum ada jajan di bulan ini 🍃
          </p>
          <p className="text-xs text-[#64748B]">
            Grafik akan otomatis muncul saat ada catatan pengeluaran.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Main Visual Layout (Donut & Details) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Thin-Ring Donut Chart with Center Content */}
            <div className="sm:col-span-6 flex items-center justify-center relative">
              <div className="relative w-[210px] h-[210px] flex items-center justify-center">
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  className="transform -rotate-90 overflow-visible"
                >
                  {/* Subtle Background Ring Track */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#F2EDE2"
                    strokeWidth={strokeWidthDefault}
                  />

                  {/* Clean Thin Slices with Gaps */}
                  {(() => {
                    let accumulatedOffset = 0;
                    const hasMultiple = categoryData.length > 1;

                    return categoryData.map((item) => {
                      const sliceLength =
                        (item.amount / totalSpent) * circumference;
                      // Celah (gap) 3px antar segmen warna
                      const gap = hasMultiple ? 3 : 0;
                      const effectiveSlice = Math.max(sliceLength - gap, 0.5);
                      const strokeDasharray = hasMultiple
                        ? `${effectiveSlice} ${circumference - effectiveSlice}`
                        : `${circumference} 0`;
                      const strokeDashoffset = -accumulatedOffset;
                      accumulatedOffset += sliceLength;

                      const isHovered = hoveredCategoryId === item.id;
                      const isDimmed =
                        hoveredCategoryId !== null &&
                        hoveredCategoryId !== item.id;

                      return (
                        <circle
                          key={item.id}
                          cx={size / 2}
                          cy={size / 2}
                          r={radius}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={
                            isHovered ? strokeWidthActive : strokeWidthDefault
                          }
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-200 cursor-pointer"
                          style={{
                            opacity: isDimmed ? 0.35 : 1,
                          }}
                          onMouseEnter={() => setHoveredCategoryId(item.id)}
                          onMouseLeave={() => setHoveredCategoryId(null)}
                          onClick={() =>
                            setHoveredCategoryId(
                              hoveredCategoryId === item.id ? null : item.id
                            )
                          }
                        />
                      );
                    });
                  })()}
                </svg>

                {/* Center Hole: Total Kepake, Big Rupiah, & Eye Toggle Button */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center select-none p-2 pointer-events-auto"
                  style={{
                    width: `${(radius - strokeWidthActive) * 2}px`,
                    height: `${(radius - strokeWidthActive) * 2}px`,
                    margin: 'auto',
                  }}
                >
                  {activeCategory ? (
                    <div
                      className="space-y-0.5 animate-in fade-in duration-150 cursor-pointer"
                      onClick={() => setHoveredCategoryId(null)}
                      title="Klik untuk kembali ke Total"
                    >
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black border border-[#1E232A]/20 truncate max-w-[105px]"
                        style={{
                          backgroundColor: activeCategory.bgColor,
                          color: activeCategory.textColor,
                        }}
                      >
                        {activeCategory.name}
                      </span>
                      <p className="text-base sm:text-lg font-black text-[#1E232A] leading-tight">
                        {isPrivacyMode
                          ? 'Rp ••••••'
                          : formatRupiah(activeCategory.amount)}
                      </p>
                      <p className="text-xs font-black text-[#2A9D8F]">
                        {activeCategory.percentage.toFixed(1)}% porsi
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 animate-in fade-in duration-150">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Total Kepake
                      </span>
                      <p className="text-lg sm:text-xl font-black text-[#1E232A] leading-tight tracking-tight">
                        {isPrivacyMode ? 'Rp ••••••' : formatRupiah(totalSpent)}
                      </p>

                      {/* Tombol Ikon Mata Sensor Nominal */}
                      <button
                        type="button"
                        onClick={onTogglePrivacy}
                        title={
                          isPrivacyMode
                            ? 'Buka sensor nominal'
                            : 'Sensor nominal Rp'
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F2EDE2] hover:bg-[#E6E0D4] border border-[#1E232A]/20 text-[#1E232A] text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        {isPrivacyMode ? (
                          <>
                            <EyeOff size={11} className="text-[#F95738]" />
                            <span>Buka</span>
                          </>
                        ) : (
                          <>
                            <Eye size={11} className="text-[#64748B]" />
                            <span>Sensor</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className="sm:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                <span>Rincian Kategori</span>
                <span>{categoryData.length} Kategori</span>
              </div>

              <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                {categoryData.map((item) => {
                  const isSelected = hoveredCategoryId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredCategoryId(item.id)}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                      onClick={() =>
                        setHoveredCategoryId(
                          hoveredCategoryId === item.id ? null : item.id
                        )
                      }
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-2 border-[#1E232A] bg-[#F8F5EE] shadow-[2px_2px_0px_#1E232A] translate-x-[-1px]'
                          : 'border-[#1E232A]/15 hover:border-[#1E232A] bg-white'
                      }`}
                    >
                      {/* Left: Color Dot & Name */}
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-[#1E232A]/30"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-bold text-[#1E232A] truncate">
                          {item.name}
                        </span>
                      </div>

                      {/* Right: Amount & Percentage */}
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-xs font-black text-[#1E232A]">
                          {isPrivacyMode
                            ? 'Rp ••••••'
                            : formatRupiah(item.amount)}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#F2EDE2] text-[#1E232A] min-w-[34px] text-center">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tombol: Share Chart ke Story */}
          <div className="pt-2 border-t-2 border-[#E6E0D4]">
            <button
              type="button"
              onClick={onOpenStoryModal}
              className="w-full py-2.5 px-4 rounded-2xl border-2 border-[#1E232A] bg-[#7058D0] hover:bg-[#6246C6] text-white text-xs font-black tracking-wide btn-tactile flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E232A]"
            >
              <Sparkles size={14} />
              <span>Share Chart ke Story</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
