import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { formatCurrentMonthYear } from '../utils/format';

interface HeaderProps {
  onResetAllData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetAllData }) => {
  return (
    <header className="border-b-2 border-[#1E232A] bg-white sticky top-0 z-30 px-4 py-3 shadow-[0_2px_0px_#1E232A]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F95738] border-2 border-[#1E232A] shadow-[2px_2px_0px_#1E232A] flex items-center justify-center text-white font-black text-lg">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black text-[#1E232A] tracking-tight">
                Dompet Recap
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#E8F6F4] text-[#1C6B61] text-[10px] font-black border border-[#1E232A]/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#64748B] hidden md:block">
              Tracker Pengeluaran Gemoy &middot; {formatCurrentMonthYear()}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onResetAllData && (
            <button
              type="button"
              onClick={onResetAllData}
              title="Kembalikan data ke contoh awal"
              className="px-2.5 py-1.5 rounded-xl border border-[#1E232A]/30 hover:border-[#1E232A] bg-[#F8F5EE] hover:bg-[#F2EDE2] text-[#64748B] hover:text-[#1E232A] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Story Recap Button (Disabled/Placeholder for Step 4) */}
          <button
            type="button"
            disabled
            title="Fitur ini akan dikerjakan di Step 4"
            className="px-3.5 py-1.5 rounded-xl border-2 border-[#1E232A]/40 bg-[#F2EDE2] text-[#64748B] text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-75"
          >
            <Sparkles size={14} className="text-[#F95738]" />
            <span>Story Recap</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-[#1E232A] text-white">
              Step 4
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
