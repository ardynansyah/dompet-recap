import type { Transaction } from '../types';
import { getTodayDateString } from './format';

const TRANSACTIONS_KEY = 'dompet_recap_transactions_v1';
const BUDGET_KEY = 'dompet_recap_budget_v1';

export const DEFAULT_BUDGET = 3000000;

export function getInitialSampleTransactions(): Transaction[] {
  const today = getTodayDateString();
  const d = new Date();
  
  const yesterdayDate = new Date(d);
  yesterdayDate.setDate(d.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);

  const threeDaysAgoDate = new Date(d);
  threeDaysAgoDate.setDate(d.getDate() - 3);
  const threeDaysAgo = threeDaysAgoDate.toISOString().slice(0, 10);

  const fiveDaysAgoDate = new Date(d);
  fiveDaysAgoDate.setDate(d.getDate() - 5);
  const fiveDaysAgo = fiveDaysAgoDate.toISOString().slice(0, 10);

  return [
    {
      id: 'sample-1',
      title: 'Nasi Padang Lauk Rendang',
      amount: 32000,
      categoryId: 'makan',
      date: today,
      createdAt: Date.now() - 3600000 * 2,
      isSample: true,
    },
    {
      id: 'sample-2',
      title: 'Kopi Susu Gula Aren Dobel Shot',
      amount: 28000,
      categoryId: 'nongkrong',
      date: today,
      createdAt: Date.now() - 3600000 * 4,
      isSample: true,
    },
    {
      id: 'sample-3',
      title: 'Bensin & Parkir Seharian',
      amount: 50000,
      categoryId: 'transport',
      date: yesterday,
      createdAt: Date.now() - 86400000 * 1,
      isSample: true,
    },
    {
      id: 'sample-4',
      title: 'Kaos Basic Katun',
      amount: 149000,
      categoryId: 'belanja',
      date: threeDaysAgo,
      createdAt: Date.now() - 86400000 * 3,
      isSample: true,
    },
    {
      id: 'sample-5',
      title: 'Langganan Streaming & Game',
      amount: 89000,
      categoryId: 'hiburan',
      date: fiveDaysAgo,
      createdAt: Date.now() - 86400000 * 5,
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
    if (Array.isArray(parsed)) {
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
