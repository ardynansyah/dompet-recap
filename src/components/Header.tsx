import React from 'react';
import { Sparkles } from 'lucide-react';
import { formatCurrentMonthYear } from '../utils/format';

interface HeaderProps {
  onOpenStoryModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStoryModal }) => {
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
              Tracker Pengeluaran &middot; {formatCurrentMonthYear()}
            </p>
          </div>
        </div>

        {/* Right Actions: Story Recap Button */}
        <div className="flex items-center gap-2">
          {onOpenStoryModal && (
            <button
              type="button"
              onClick={onOpenStoryModal}
              title="Bikin Story Recap"
              className="px-3.5 py-1.5 rounded-xl border-2 border-[#1E232A] bg-[#7058D0] text-white text-xs font-black flex items-center gap-1.5 btn-tactile cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Story Recap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
