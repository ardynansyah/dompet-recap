import React, { useState, useRef } from 'react';
import { X, Download, Eye, EyeOff, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Transaction } from '../types';
import { ReceiptThemeCard } from './recap/ReceiptThemeCard';
import { CleanChartThemeCard } from './recap/CleanChartThemeCard';

interface StoryRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  monthlyBudget: number;
  selectedMonth?: string;
  initialHideAmount?: boolean;
}

type CardTheme = 'receipt' | 'chart';

export const StoryRecapModal: React.FC<StoryRecapModalProps> = ({
  isOpen,
  onClose,
  transactions,
  monthlyBudget,
  selectedMonth,
  initialHideAmount = false,
}) => {
  const [theme, setTheme] = useState<CardTheme>('receipt');
  const [localHideAmount, setLocalHideAmount] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const hideAmount = localHideAmount !== null ? localHideAmount : initialHideAmount;

  const handleClose = () => {
    setLocalHideAmount(null);
    onClose();
  };

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Give a tiny tick for any pending layout adjustments
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, // Ultra-sharp 1080x1920 IG Story resolution
        cacheBust: true,
      });

      const today = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.download = `dompet-recap-${theme}-${today}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal membuat gambar PNG:', err);
      alert('Maaf, ada kendala saat mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-4xl bg-white border-2 border-[#1E232A] rounded-3xl shadow-[6px_6px_0px_#1E232A] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#E6E0D4] bg-[#F8F5EE]">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1E232A]">
              Recap IG Story (9:16)
            </h3>
            <p className="text-xs text-[#64748B] font-semibold">
              Format minimalis siap upload ke Instagram Stories
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full border border-[#1E232A]/20 hover:border-[#1E232A] hover:bg-white transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X size={18} className="text-[#1E232A]" />
          </button>
        </div>

        {/* Content Body: Responsive 2 Columns (Preview on Left/Top, Controls on Right/Bottom) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Live 9:16 Card Preview */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#F2EDE2] border-2 border-[#1E232A] rounded-2xl p-4 overflow-hidden">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Preview Kartu 9:16
            </span>

            {/* Scale wrapper for small mobile viewports so 360x640 fits nicely */}
            <div className="w-full flex items-center justify-center overflow-auto max-h-[66vh] p-1">
              <div
                ref={cardRef}
                className="shrink-0 transform scale-[0.88] sm:scale-100 origin-top transition-transform"
              >
                {theme === 'receipt' ? (
                  <ReceiptThemeCard
                    transactions={transactions}
                    monthlyBudget={monthlyBudget}
                    hideAmount={hideAmount}
                    selectedMonth={selectedMonth}
                  />
                ) : (
                  <CleanChartThemeCard
                    transactions={transactions}
                    monthlyBudget={monthlyBudget}
                    hideAmount={hideAmount}
                    selectedMonth={selectedMonth}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls & Download */}
          <div className="md:col-span-5 space-y-5">
            {/* Theme Selector (2 Clean Options) */}
            <div>
              <label className="block text-xs font-black text-[#1E232A] uppercase tracking-wider mb-2">
                Pilih Tema Story
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('receipt')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                    theme === 'receipt'
                      ? 'bg-[#1E232A] text-white border-[#1E232A] shadow-[2px_2px_0px_#1E232A]'
                      : 'bg-[#F8F5EE] text-[#1E232A] border-[#1E232A]/30 hover:border-[#1E232A]'
                  }`}
                >
                  Struk Kasir
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('chart')}
                  className={`py-2.5 px-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                    theme === 'chart'
                      ? 'bg-[#1E232A] text-white border-[#1E232A] shadow-[2px_2px_0px_#1E232A]'
                      : 'bg-[#F8F5EE] text-[#1E232A] border-[#1E232A]/30 hover:border-[#1E232A]'
                  }`}
                >
                  Clean Chart
                </button>
              </div>
            </div>

            {/* Privacy Toggle: Sensor Nominal Rp */}
            <div className="bg-[#F8F5EE] border-2 border-[#1E232A] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hideAmount ? (
                    <EyeOff size={16} className="text-[#F95738]" />
                  ) : (
                    <Eye size={16} className="text-[#64748B]" />
                  )}
                  <span className="text-xs font-black text-[#1E232A]">
                    Sensor Nominal Rp
                  </span>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setLocalHideAmount(!hideAmount)}
                  className={`w-11 h-6 rounded-full border-2 border-[#1E232A] transition-colors p-0.5 cursor-pointer flex items-center ${
                    hideAmount ? 'bg-[#2A9D8F]' : 'bg-[#E6E0D4]'
                  }`}
                  aria-label="Toggle sensor nominal"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white border border-[#1E232A] transition-transform ${
                      hideAmount ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] font-semibold text-[#64748B] leading-relaxed">
                {hideAmount
                  ? 'Nominal disembunyikan (Rp ••••••). Persentase kategori tetap tampil rapi agar aman dipost ke Story.'
                  : 'Nominal asli ditampilkan. Aktifkan saklar jika ingin menjaga privasi angka saldo.'}
              </p>
            </div>

            {/* Download Action Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-[#1E232A] bg-[#2A9D8F] hover:bg-[#238276] text-white text-sm font-black tracking-wide btn-tactile flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadSuccess ? (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>Berhasil Diunduh!</span>
                  </>
                ) : isDownloading ? (
                  <span>Sedang Menyiapkan Gambar...</span>
                ) : (
                  <>
                    <Download size={18} strokeWidth={2.5} />
                    <span>Download PNG</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center font-bold text-[#64748B]">
                Ekspor otomatis resolusi tinggi (pixelRatio: 3) &middot; Tajam di Instagram Story
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
