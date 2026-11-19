import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { formatRupiah } from '../utils/format';

interface BudgetEditModalProps {
  isOpen: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (newBudget: number) => void;
}

export const BudgetEditModal: React.FC<BudgetEditModalProps> = ({
  isOpen,
  currentBudget,
  onClose,
  onSave,
}) => {
  const [budgetInput, setBudgetInput] = useState<string>(String(currentBudget));
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const numericValue = parseInt(budgetInput.replace(/\D/g, ''), 10) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericValue <= 0) {
      setError('Budget harus lebih besar dari Rp 0 ya');
      return;
    }
    onSave(numericValue);
    onClose();
  };

  const handleQuickAdd = (amount: number) => {
    setBudgetInput(String(amount));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-2 border-[#1E232A] rounded-3xl p-6 shadow-[5px_5px_0px_#1E232A] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E6E0D4] mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1E232A]">Ubah Target Budget</h3>
            <p className="text-xs text-[#64748B] font-medium">Tentukan batas pengeluaran bulananmu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#1E232A]/20 hover:border-[#1E232A] hover:bg-[#F8F5EE] transition-colors"
            aria-label="Tutup"
          >
            <X size={18} className="text-[#1E232A]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E232A] mb-1.5 uppercase tracking-wide">
              Nominal Budget Bulanan
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={numericValue ? new Intl.NumberFormat('id-ID').format(numericValue) : ''}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setBudgetInput(cleaned);
                  if (error) setError('');
                }}
                placeholder="3.000.000"
                className="w-full pl-12 pr-4 py-3 bg-[#F8F5EE] border-2 border-[#1E232A] rounded-xl text-base font-extrabold text-[#1E232A] focus:outline-none focus:bg-white transition-all"
                autoFocus
              />
            </div>
            {numericValue > 0 && (
              <p className="mt-1 text-xs text-[#2A9D8F] font-semibold">
                Setara: {formatRupiah(numericValue)} per bulan
              </p>
            )}
            {error && <p className="mt-1 text-xs text-[#E63946] font-semibold">{error}</p>}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#64748B] mb-2">Preset Cepat:</p>
            <div className="grid grid-cols-3 gap-2">
              {[2000000, 3000000, 5000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickAdd(preset)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border border-[#1E232A] transition-all ${
                    numericValue === preset
                      ? 'bg-[#1E232A] text-white'
                      : 'bg-[#F8F5EE] text-[#1E232A] hover:bg-white'
                  }`}
                >
                  {formatRupiah(preset)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E232A] bg-white text-[#1E232A] text-sm font-bold hover:bg-[#F8F5EE] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E232A] bg-[#2A9D8F] text-white text-sm font-bold btn-tactile flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              Simpan Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
