import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import type { CategoryId } from '../types';
import { CATEGORY_LIST } from '../constants/categories';
import { formatRupiah, getTodayDateString } from '../utils/format';

interface QuickAddExpenseFormProps {
  onAddTransaction: (transaction: {
    title: string;
    amount: number;
    categoryId: CategoryId;
    date: string;
  }) => void;
}

export const QuickAddExpenseForm: React.FC<QuickAddExpenseFormProps> = ({
  onAddTransaction,
}) => {
  const [amountInput, setAmountInput] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<CategoryId>('makan');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [error, setError] = useState<string>('');

  const numericAmount = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!numericAmount || numericAmount <= 0) {
      setError('Masukkan nominal pengeluaran dulu ya');
      return;
    }

    if (!title.trim()) {
      setError('Tuliskan keterangan pengeluaran');
      return;
    }

    onAddTransaction({
      title: title.trim(),
      amount: numericAmount,
      categoryId,
      date: date || getTodayDateString(),
    });

    // Reset Form
    setAmountInput('');
    setTitle('');
    setError('');
  };

  return (
    <div className="bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 card-tactile w-full max-w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-[#1E232A] flex items-center gap-2">
          <span>Catat Pengeluaran Baru</span>
        </h3>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F2EDE2] text-[#64748B]">
          Cepat & Rapi
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-full min-w-0">
        {/* Nominal Input */}
        <div>
          <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
            Nominal (Rupiah)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-[#64748B]">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={numericAmount ? new Intl.NumberFormat('id-ID').format(numericAmount) : ''}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '');
                setAmountInput(cleaned);
                if (error) setError('');
              }}
              placeholder="0"
              className="w-full pl-12 pr-4 py-3 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-2xl text-xl font-black text-[#1E232A] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#F95738] transition-all"
            />
          </div>
          {numericAmount > 0 && (
            <p className="mt-1 text-xs font-bold text-[#F95738]">
              {formatRupiah(numericAmount)}
            </p>
          )}
        </div>

        {/* Keterangan Input */}
        <div>
          <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
            Keterangan
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="Misal: Nasi Padang, Kopi Susu, Bensin"
            className="w-full px-3.5 py-2.5 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-xl text-sm font-bold text-[#1E232A] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#F95738] transition-all"
          />
        </div>

        {/* Kategori Selector (Solid colored dots, Anti-AI slop clean design) */}
        <div>
          <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-2">
            Pilih Kategori
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_LIST.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all text-left ${
                    isSelected
                      ? 'border-2 border-[#1E232A] shadow-[2px_2px_0px_#1E232A] translate-x-[-1px] translate-y-[-1px]'
                      : 'border-[#1E232A]/20 bg-[#F8F5EE] text-[#1E232A] hover:border-[#1E232A]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? cat.bgColor : undefined,
                    color: isSelected ? cat.textColor : undefined,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tanggal Input (with iOS Safari fix) */}
        <div className="w-full max-w-full min-w-0 block box-border">
          <label className="block text-xs font-bold text-[#1E232A] uppercase tracking-wider mb-1.5">
            Tanggal
          </label>
          <div className="relative w-full max-w-full min-w-0 block box-border">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-full min-w-0 block box-border appearance-none pl-10 pr-3.5 py-2.5 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-xl text-xs font-bold text-[#1E232A] focus:outline-none focus:bg-white transition-all"
            />
            <Calendar
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-[#E63946] bg-[#FDECEE] border border-[#E63946]/30 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-2xl border-2 border-[#1E232A] bg-[#F95738] text-white text-sm font-black tracking-wide btn-tactile flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Catat Pengeluaran</span>
        </button>
      </form>
    </div>
  );
};
