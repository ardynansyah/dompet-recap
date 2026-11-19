import type { Category, CategoryId, WalletStatusInfo } from '../types';

export const CATEGORIES: Record<CategoryId, Category> = {
  makan: {
    id: 'makan',
    name: 'Makan & Minum',
    color: '#F95738',
    bgColor: '#FFECE8',
    textColor: '#C83214',
  },
  nongkrong: {
    id: 'nongkrong',
    name: 'Kopi & Nongkrong',
    color: '#F4A261',
    bgColor: '#FEF3E8',
    textColor: '#B05B17',
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    color: '#2A9D8F',
    bgColor: '#E8F6F4',
    textColor: '#1C6B61',
  },
  belanja: {
    id: 'belanja',
    name: 'Belanja',
    color: '#7058D0',
    bgColor: '#F0EDFC',
    textColor: '#4D36A8',
  },
  hiburan: {
    id: 'hiburan',
    name: 'Tagihan & Hiburan',
    color: '#E76F51',
    bgColor: '#FDF0ED',
    textColor: '#BF482A',
  },
  lainnya: {
    id: 'lainnya',
    name: 'Lainnya',
    color: '#4A7C59',
    bgColor: '#EDF4EF',
    textColor: '#2C5237',
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

/**
 * Menghitung status dompet berdasarkan persentase budget yang terpakai
 */
export function getWalletStatus(spentPercentage: number): WalletStatusInfo {
  if (spentPercentage < 40) {
    return {
      type: 'sultan',
      label: 'Mode Sultan',
      comment: 'Dompet tebal, pengeluaran terkendali. Mau traktir sekecamatan masih aman.',
      accentColor: '#2A9D8F',
      badgeBg: '#E8F6F4',
      badgeText: '#1C6B61',
    };
  }

  if (spentPercentage <= 75) {
    return {
      type: 'aman',
      label: 'Masih Aman',
      comment: 'Arus kas aman terkendali. Jajan santai tetap jalan tanpa rasa bersalah.',
      accentColor: '#3B82F6',
      badgeBg: '#EFF6FF',
      badgeText: '#1D4ED8',
    };
  }

  if (spentPercentage <= 95) {
    return {
      type: 'waspada',
      label: 'Mulai Waspada',
      comment: 'Rem dikit bestie. Jangan kalap checkout dulu, akhir bulan masih berliku.',
      accentColor: '#F4A261',
      badgeBg: '#FEF3E8',
      badgeText: '#B05B17',
    };
  }

  return {
    type: 'bertahan',
    label: 'Mode Bertahan Hidup',
    comment: 'Siaga satu! Saatnya akrab sama mie instan, telur, dan air galon.',
    accentColor: '#E63946',
    badgeBg: '#FDECEE',
    badgeText: '#B91C1C',
  };
}
