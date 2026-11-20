import React, { useState, useRef } from 'react';
import { X, Check, Download, Upload } from 'lucide-react';
import { formatRupiah } from '../utils/format';

interface BudgetEditModalProps {
  isOpen: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (newBudget: number) => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => Promise<{ success: boolean; message: string }>;
}

export const BudgetEditModal: React.FC<BudgetEditModalProps> = ({
  isOpen,
  currentBudget,
  onClose,
  onSave,
  onExportBackup,
  onImportBackup,
}) => {
  const [budgetInput, setBudgetInput] = useState<string>(String(currentBudget));
  const [error, setError] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportBackup) return;

    try {
      setIsImporting(true);
      setImportStatus(null);
      const result = await onImportBackup(file);

      if (result.success) {
        setImportStatus({ type: 'success', message: result.message });
        // Update input field budget jika ikut berubah dari backup
        setBudgetInput(String(currentBudget));
      } else {
        setImportStatus({ type: 'error', message: result.message });
      }
    } catch {
      setImportStatus({
        type: 'error',
        message: 'Gagal memproses file backup.',
      });
    } finally {
      setIsImporting(false);
      // Reset input agar file yang sama bisa dipilih ulang jika perlu
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white border-2 border-[#1E232A] rounded-3xl p-6 shadow-[5px_5px_0px_#1E232A] animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E6E0D4] mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1E232A]">Pengaturan Budget & Data</h3>
            <p className="text-xs text-[#64748B] font-medium">Atur batas anggaran dan kelola cadangan data</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#1E232A]/20 hover:border-[#1E232A] hover:bg-[#F8F5EE] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} className="text-[#1E232A]" />
          </button>
        </div>

        {/* Form Edit Budget */}
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
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border border-[#1E232A] transition-all cursor-pointer ${
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
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E232A] bg-white text-[#1E232A] text-sm font-bold hover:bg-[#F8F5EE] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-[#1E232A] bg-[#2A9D8F] text-white text-sm font-bold btn-tactile flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={16} />
              Simpan Budget
            </button>
          </div>
        </form>

        {/* Section Backup & Restore Data (JSON) */}
        {(onExportBackup || onImportBackup) && (
          <div className="mt-6 pt-5 border-t-2 border-[#E6E0D4] space-y-3">
            <div>
              <h4 className="text-xs font-extrabold text-[#1E232A] uppercase tracking-wider">
                Cadangan Data (Backup JSON)
              </h4>
              <p className="text-[11px] text-[#64748B] font-medium mt-0.5">
                Simpan atau pulihkan seluruh data transaksi & budget ke file JSON
              </p>
            </div>

            {/* Hidden File Input for Import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2.5">
              {onExportBackup && (
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="py-2.5 px-3 rounded-xl border-2 border-[#1E232A] bg-[#F8F5EE] hover:bg-[#F2EDE2] text-[#1E232A] text-xs font-bold btn-tactile-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} className="text-[#2A9D8F]" />
                  <span>Ekspor JSON</span>
                </button>
              )}

              {onImportBackup && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="py-2.5 px-3 rounded-xl border-2 border-[#1E232A] bg-[#F8F5EE] hover:bg-[#F2EDE2] text-[#1E232A] text-xs font-bold btn-tactile-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload size={14} className="text-[#7058D0]" />
                  <span>{isImporting ? 'Memproses...' : 'Impor JSON'}</span>
                </button>
              )}
            </div>

            {/* Feedback Status Alert */}
            {importStatus && (
              <p
                className={`text-[11px] font-bold p-2.5 rounded-xl border ${
                  importStatus.type === 'success'
                    ? 'bg-[#E8F6F4] text-[#1C6B61] border-[#2A9D8F]/30'
                    : 'bg-[#FDECEE] text-[#B91C1C] border-[#E63946]/30'
                }`}
              >
                {importStatus.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
