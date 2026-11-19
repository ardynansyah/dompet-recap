import React, { useMemo } from 'react';
import type { Transaction, CategoryId } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import {
  formatRupiah,
  formatCurrentMonthYear,
  getCurrentMonthPrefix,
  getTodayFormattedUpper,
} from '../../utils/format';

interface ReceiptThemeCardProps {
  transactions: Transaction[];
  monthlyBudget: number;
  hideAmount: boolean;
  selectedMonth?: string;
}

export const ReceiptThemeCard: React.FC<ReceiptThemeCardProps> = ({
  transactions,
  monthlyBudget,
  hideAmount,
  selectedMonth,
}) => {
  const currentMonth = selectedMonth || getCurrentMonthPrefix();
  const todayStr = useMemo(() => getTodayFormattedUpper(), []);

  const { currentTransactions, totalSpent, remainingBudget, categoryTotals, activeCategories } =
    useMemo(() => {
      const current = transactions.filter((t) => t.date.startsWith(currentMonth));
      const spent = current.reduce((acc, t) => acc + t.amount, 0);
      const remaining = monthlyBudget - spent;

      const totals: Record<CategoryId, { total: number; count: number }> = {
        makan: { total: 0, count: 0 },
        nongkrong: { total: 0, count: 0 },
        transport: { total: 0, count: 0 },
        belanja: { total: 0, count: 0 },
        hiburan: { total: 0, count: 0 },
        lainnya: { total: 0, count: 0 },
      };

      current.forEach((tx) => {
        if (totals[tx.categoryId]) {
          totals[tx.categoryId].total += tx.amount;
          totals[tx.categoryId].count += 1;
        }
      });

      const active = (Object.keys(totals) as CategoryId[]).filter(
        (cid) => totals[cid].total > 0
      );

      return {
        currentTransactions: current,
        totalSpent: spent,
        remainingBudget: remaining,
        categoryTotals: totals,
        activeCategories: active,
      };
    }, [transactions, monthlyBudget, currentMonth]);

  return (
    <div
      className="w-[360px] h-[640px] bg-[#EAE6DF] border-2 border-[#1E232A] rounded-2xl p-4 flex flex-col items-center justify-center select-none overflow-hidden relative"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* Decorative background grid subtle effect */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1E232A 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Main Thermal Receipt Body */}
      <div className="w-[320px] bg-[#FCFBF7] border-2 border-[#1E232A] shadow-[4px_4px_0px_#1E232A] rounded-sm relative z-10 flex flex-col justify-between p-4.5 text-[#1E232A] text-xs">
        {/* Sawtooth Top Edge */}
        <div className="absolute -top-2 left-0 right-0 h-2 flex overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-[#FCFBF7] border-t-2 border-l-2 border-[#1E232A] transform rotate-45 -translate-y-1"
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="space-y-3">
          {/* Header */}
          <div className="text-center space-y-1">
            <p className="tracking-widest font-bold text-sm">
              ========================
            </p>
            <h2 className="font-extrabold text-sm tracking-wider uppercase">
              DOMPET RECAP MART
            </h2>
            <p className="text-[10px] text-[#64748B]">
              Struk Catatan Pengeluaran
            </p>
            <p className="tracking-widest font-bold text-sm">
              ========================
            </p>
          </div>

          {/* Meta Info (Clean & Simple) */}
          <div className="text-[11px] font-bold space-y-1 border-b border-dashed border-[#1E232A] pb-2">
            <div className="flex justify-between">
              <span>PERIODE</span>
              <span>{formatCurrentMonthYear(currentMonth).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-[#64748B]">
              <span>TANGGAL CETAK</span>
              <span>{todayStr}</span>
            </div>
          </div>

          {/* Itemized Category Breakdown */}
          <div className="space-y-1.5 py-1">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              [RINCIAN KATEGORI]
            </p>
            {activeCategories.length === 0 ? (
              <p className="text-[11px] italic text-center py-3 text-[#64748B]">
                Belum ada jajan yang dicatet
              </p>
            ) : (
              activeCategories.map((cid) => {
                const cat = CATEGORIES[cid];
                const info = categoryTotals[cid];
                const percentage =
                  totalSpent > 0
                    ? Math.round((info.total / totalSpent) * 100)
                    : 0;

                return (
                  <div
                    key={cid}
                    className="flex items-center justify-between text-[11px] font-semibold leading-tight"
                  >
                    <span className="truncate max-w-[130px]">
                      &gt; {cat.name}
                    </span>
                    <span className="text-right shrink-0">
                      {hideAmount ? 'Rp ••••••' : formatRupiah(info.total)} ({percentage}%)
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Total Section */}
          <div className="border-t-2 border-dashed border-[#1E232A] pt-2 space-y-1">
            <div className="flex justify-between font-extrabold text-xs">
              <span>TOTAL KELUAR</span>
              <span className="text-sm font-black">
                {hideAmount ? 'Rp ••••••' : formatRupiah(totalSpent)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-[11px] text-[#64748B]">
              <span>SISA BUDGET</span>
              <span className={remainingBudget < 0 ? 'text-[#E11D48]' : ''}>
                {hideAmount ? 'Rp ••••••' : formatRupiah(remainingBudget)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-[10px] text-[#64748B]">
              <span>TOTAL TRANSAKSI</span>
              <span>{currentTransactions.length} transaksi</span>
            </div>
          </div>
        </div>

        {/* Footer & Barcode Section */}
        <div className="pt-3 border-t-2 border-[#1E232A] space-y-2 text-center">
          {/* Barcode Look */}
          <div className="flex items-center justify-center gap-[2.5px] h-9 px-2 overflow-hidden bg-white py-1 border border-[#1E232A]/20">
            <div className="w-1.5 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-1 h-full bg-[#1E232A]" />
            <div className="w-2.5 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-1.5 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-2 h-full bg-[#1E232A]" />
            <div className="w-1 h-full bg-[#1E232A]" />
            <div className="w-2 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-1.5 h-full bg-[#1E232A]" />
            <div className="w-2.5 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-1.5 h-full bg-[#1E232A]" />
            <div className="w-2 h-full bg-[#1E232A]" />
            <div className="w-0.5 h-full bg-[#1E232A]" />
            <div className="w-1 h-full bg-[#1E232A]" />
            <div className="w-2 h-full bg-[#1E232A]" />
            <div className="w-1.5 h-full bg-[#1E232A]" />
          </div>
          <p className="text-[9px] tracking-widest font-bold">
            DOMPET RECAP 
          </p>

          <p className="text-[9px] font-bold text-[#64748B] pt-0.5">
            TERIMA KASIH TELAH BERTAHAN BULAN INI
          </p>
        </div>

        {/* Sawtooth Bottom Edge */}
        <div className="absolute -bottom-2 left-0 right-0 h-2 flex overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-2 bg-[#FCFBF7] border-b-2 border-r-2 border-[#1E232A] transform rotate-45 translate-y-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
