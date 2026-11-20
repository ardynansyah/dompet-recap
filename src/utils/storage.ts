import type { Transaction } from '../types';

const TRANSACTIONS_KEY = 'dompet_recap_transactions_v1';
const BUDGET_KEY = 'dompet_recap_budget_v1';

export const DEFAULT_BUDGET = 3000000;

/**
 * Validasi runtime untuk memastikan objek transaksi valid dan aman dari data korup
 */
export function isValidTransaction(item: unknown): item is Transaction {
  if (!item || typeof item !== 'object') return false;
  const t = item as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    t.id.trim().length > 0 &&
    typeof t.title === 'string' &&
    t.title.trim().length > 0 &&
    typeof t.amount === 'number' &&
    Number.isFinite(t.amount) &&
    t.amount > 0 &&
    typeof t.categoryId === 'string' &&
    typeof t.date === 'string' &&
    t.date.length === 10 &&
    !('isSample' in t && t.isSample) &&
    !t.id.startsWith('sample-')
  );
}

export function loadTransactionsFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Validasi tipe setiap item dan bersihkan data corrupt / legacy sample
      const cleanTransactions = parsed.filter(isValidTransaction);
      if (cleanTransactions.length !== parsed.length) {
        saveTransactionsToStorage(cleanTransactions);
      }
      return cleanTransactions;
    }
    return [];
  } catch (err) {
    console.error('Gagal membaca data transaksi dari localStorage:', err);
    return [];
  }
}

export function saveTransactionsToStorage(transactions: Transaction[]): void {
  try {
    if (!Array.isArray(transactions)) return;
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
    if (typeof parsed === 'number' && Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return DEFAULT_BUDGET;
  } catch (err) {
    console.error('Gagal membaca budget dari localStorage:', err);
    return DEFAULT_BUDGET;
  }
}

export function saveBudgetToStorage(budget: number): void {
  try {
    if (typeof budget !== 'number' || !Number.isFinite(budget) || budget <= 0) return;
    localStorage.setItem(BUDGET_KEY, String(budget));
  } catch (err) {
    console.error('Gagal menyimpan budget ke localStorage:', err);
  }
}
