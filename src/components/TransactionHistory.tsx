import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Transaction, CategoryId } from '../types';
import { CATEGORIES } from '../constants/categories';
import { formatRupiah, formatDateLabel } from '../utils/format';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onClearSampleData: () => void;
  hasSampleData: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction,
  onClearSampleData,
  hasSampleData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.categoryId === selectedCategory;
  });

  // Group by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  filteredTransactions
    .sort((a, b) => {
      // Sort by date desc, then by createdAt desc
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      return b.createdAt - a.createdAt;
    })
    .forEach((tx) => {
      const label = formatDateLabel(tx.date);
      if (!groupedTransactions[label]) {
        groupedTransactions[label] = [];
      }
      groupedTransactions[label].push(tx);
    });

  const categoryFilterOptions: { id: CategoryId | 'all'; name: string }[] = [
    { id: 'all', name: 'Semua' },
    ...Object.values(CATEGORIES).map((c) => ({ id: c.id, name: c.name })),
  ];

  return (
    <div className="bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 card-tactile space-y-5">
      {/* Header & Sample Data Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#E6E0D4]">
        <div>
          <h3 className="text-base font-extrabold text-[#1E232A]">Riwayat Pengeluaran</h3>
          <p className="text-xs text-[#64748B] font-medium">
            Total {filteredTransactions.length} transaksi tercatat
          </p>
        </div>

        {hasSampleData && (
          <button
            type="button"
            onClick={onClearSampleData}
            className="self-start sm:self-auto py-1 px-3 rounded-full border border-[#1E232A] bg-[#FEF3E8] text-[#B05B17] hover:bg-[#FDECEE] hover:text-[#E63946] text-xs font-bold transition-colors cursor-pointer"
          >
            Hapus Data Contoh
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {categoryFilterOptions.map((opt) => {
          const isSelected = selectedCategory === opt.id;
          const count =
            opt.id === 'all'
              ? transactions.length
              : transactions.filter((t) => t.categoryId === opt.id).length;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedCategory(opt.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-[#1E232A] text-white border-[#1E232A] shadow-[2px_2px_0px_#1E232A]'
                  : 'bg-[#F8F5EE] text-[#1E232A] border-[#1E232A]/20 hover:border-[#1E232A]'
              }`}
            >
              <span>{opt.name}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E6E0D4] text-[#64748B]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Transaction List Groups */}
      <div className="space-y-5">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="py-12 px-4 text-center bg-[#F8F5EE] border-2 border-dashed border-[#1E232A]/20 rounded-2xl">
            <p className="text-sm font-bold text-[#1E232A] mb-1">
              {selectedCategory === 'all'
                ? 'Dompetmu masih suci bersih! ✨'
                : 'Belum ada jajan di kategori ini! 🎉'}
            </p>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              {selectedCategory === 'all'
                ? 'Belum ada catatan pengeluaran bulan ini. Catat jajan pertamamu lewat form di sebelah!'
                : 'Dompetmu terselamatkan di kategori ini. Pertahankan prestasimu ya.'}
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#1E232A] uppercase tracking-wider bg-[#F2EDE2] px-2.5 py-0.5 rounded-md border border-[#1E232A]/20">
                  {dateLabel}
                </span>
                <span className="text-[11px] font-bold text-[#64748B]">
                  ({items.length} item)
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => {
                  const cat = CATEGORIES[item.categoryId] || CATEGORIES.lainnya;
                  const isConfirming = deletingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E232A]/15 bg-[#FCFBF7] hover:border-[#1E232A] hover:bg-white transition-all shadow-xs"
                    >
                      {/* Left: Indicator & Title */}
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-[#1E232A]/40"
                          style={{ backgroundColor: cat.color }}
                          title={cat.name}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-[#1E232A] truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1E232A]/20"
                              style={{
                                backgroundColor: cat.bgColor,
                                color: cat.textColor,
                              }}
                            >
                              {cat.name}
                            </span>
                            {item.isSample && (
                              <span className="text-[10px] font-bold text-[#94A3B8] italic">
                                contoh
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Delete Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm md:text-base font-black text-[#1E232A]">
                          - {formatRupiah(item.amount)}
                        </span>

                        {isConfirming ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteTransaction(item.id);
                                setDeletingId(null);
                              }}
                              className="px-2 py-1 text-[11px] font-black bg-[#E63946] text-white rounded-lg border border-[#1E232A] hover:opacity-90"
                            >
                              Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 text-[11px] font-bold bg-[#E6E0D4] text-[#1E232A] rounded-lg border border-[#1E232A]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(item.id)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#E63946] hover:bg-[#FDECEE] rounded-lg transition-colors border border-transparent hover:border-[#E63946]/40 cursor-pointer"
                            title="Hapus transaksi"
                            aria-label="Hapus transaksi"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
