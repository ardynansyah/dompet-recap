import type { Transaction } from '../types';

const TRANSACTIONS_KEY = 'dompet_recap_transactions_v1';
const BUDGET_KEY = 'dompet_recap_budget_v1';

export const DEFAULT_BUDGET = 3000000;

export function loadTransactionsFromStorage(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clean up any legacy sample/dummy data from earlier development
      const cleanTransactions = parsed.filter(
        (t: Transaction) =>
          !('isSample' in t && (t as Record<string, unknown>).isSample) &&
          !t.id?.startsWith('sample-')
      );
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
