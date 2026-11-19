import type { Transaction } from '../types';
import { getCurrentMonthPrefix } from './format';

const TRANSACTIONS_KEY = 'dompet_recap_transactions_v1';
const BUDGET_KEY = 'dompet_recap_budget_v1';

export const DEFAULT_BUDGET = 3000000;

export function getInitialSampleTransactions(): Transaction[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentDay = now.getDate(); // 1 - 31

  // Format local YYYY-MM-DD
  const formatLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Ensure dates are strictly within the current month of the device
  const day1 = currentDay;
  const day2 = currentDay;
  const day3 = Math.max(1, currentDay - 1);
  const day4 = Math.max(1, currentDay - 2);
  const day5 = Math.max(1, currentDay - 3);

  const date1 = formatLocal(new Date(currentYear, currentMonth, day1));
  const date2 = formatLocal(new Date(currentYear, currentMonth, day2));
  const date3 = formatLocal(new Date(currentYear, currentMonth, day3));
  const date4 = formatLocal(new Date(currentYear, currentMonth, day4));
  const date5 = formatLocal(new Date(currentYear, currentMonth, day5));

  const nowTime = now.getTime();

  return [
    {
      id: 'sample-1',
      title: 'Nasi Padang Lauk Rendang',
      amount: 32000,
      categoryId: 'makan',
      date: date1,
      createdAt: nowTime - 3600000 * 2,
      isSample: true,
    },
    {
      id: 'sample-2',
      title: 'Kopi Susu Gula Aren Dobel Shot',
      amount: 28000,
      categoryId: 'nongkrong',
      date: date2,
      createdAt: nowTime - 3600000 * 4,
      isSample: true,
    },
    {
      id: 'sample-3',
      title: 'Bensin & Parkir Seharian',
      amount: 50000,
      categoryId: 'transport',
      date: date3,
      createdAt: nowTime - 86400000 * 1,
      isSample: true,
    },
    {
      id: 'sample-4',
      title: 'Kaos Basic Katun',
      amount: 149000,
      categoryId: 'belanja',
      date: date4,
      createdAt: nowTime - 86400000 * 2,
      isSample: true,
    },
    {
      id: 'sample-5',
      title: 'Langganan Streaming & Game',
      amount: 89000,
      categoryId: 'hiburan',
      date: date5,
      createdAt: nowTime - 86400000 * 3,
      isSample: true,
    },
  ];
}

export function loadTransactionsFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      const initial = getInitialSampleTransactions();
      saveTransactionsToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const currentMonthPrefix = getCurrentMonthPrefix();
      const hasCurrentMonth = parsed.some((t: Transaction) =>
        t.date && t.date.startsWith(currentMonthPrefix)
      );
      const allSamples = parsed.every((t: Transaction) => t.isSample);

      // If user hasn't added custom transactions and sample dates are from an older/different month,
      // refresh them to the current real-time month so the charts are never empty!
      if (allSamples && !hasCurrentMonth) {
        const fresh = getInitialSampleTransactions();
        saveTransactionsToStorage(fresh);
        return fresh;
      }

      return parsed;
    }
    return getInitialSampleTransactions();
  } catch (err) {
    console.error('Gagal membaca data transaksi dari localStorage:', err);
    return getInitialSampleTransactions();
  }
}

export function saveTransactionsToStorage(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Gagal menyimpan transaksi ke localStorage:', err);
  }
}

export function loadBudgetFromStorage(): number {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) {
      saveBudgetToStorage(DEFAULT_BUDGET);
      return DEFAULT_BUDGET;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_BUDGET;
  } catch {
    return DEFAULT_BUDGET;
  }
}

export function saveBudgetToStorage(budget: number): void {
  try {
    localStorage.setItem(BUDGET_KEY, String(budget));
  } catch (err) {
    console.error('Gagal menyimpan budget ke localStorage:', err);
  }
}
