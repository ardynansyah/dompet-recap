import { useState, useEffect, useRef, useCallback } from 'react';
import type { Transaction, CategoryId, BackupData } from '../types';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
  loadBudgetFromStorage,
  saveBudgetToStorage,
  isValidTransaction,
  DEFAULT_BUDGET,
} from '../utils/storage';

export interface ImportResult {
  success: boolean;
  message: string;
}

export function useExpenseStore() {
  // Lazy initial state membaca langsung dari localStorage saat initial render
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      return loadTransactionsFromStorage();
    } catch (err) {
      console.error('Error saat inisialisasi state transaksi:', err);
      return [];
    }
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      return loadBudgetFromStorage();
    } catch (err) {
      console.error('Error saat inisialisasi state budget:', err);
      return DEFAULT_BUDGET;
    }
  });

  // Guard ref agar initial mount tidak memicu penimpaan data di localStorage
  const isMountedTx = useRef<boolean>(false);
  const isMountedBudget = useRef<boolean>(false);

  // Sync transactions ke localStorage hanya saat state transaksi berubah setelah initial mount
  useEffect(() => {
    if (!isMountedTx.current) {
      isMountedTx.current = true;
      return;
    }
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  // Sync budget ke localStorage hanya saat state budget berubah setelah initial mount
  useEffect(() => {
    if (!isMountedBudget.current) {
      isMountedBudget.current = true;
      return;
    }
    saveBudgetToStorage(monthlyBudget);
  }, [monthlyBudget]);

  // Aksi menambah transaksi baru
  const addTransaction = useCallback(
    (newTx: {
      title: string;
      amount: number;
      categoryId: CategoryId;
      date: string;
    }) => {
      const transaction: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: newTx.title.trim(),
        amount: newTx.amount,
        categoryId: newTx.categoryId,
        date: newTx.date,
        createdAt: Date.now(),
      };

      setTransactions((prev) => [transaction, ...prev]);
    },
    []
  );

  // Aksi menghapus transaksi
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Aksi memperbarui budget bulanan
  const saveBudget = useCallback((newBudget: number) => {
    if (typeof newBudget === 'number' && Number.isFinite(newBudget) && newBudget > 0) {
      setMonthlyBudget(newBudget);
    }
  }, []);

  // Fitur Export Backup (JSON)
  const exportBackupData = useCallback(() => {
    try {
      const backupPayload: BackupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        monthlyBudget,
        transactions,
      };

      const jsonString = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `dompet-recap-backup-${today}.json`;
      link.click();

      // Bersihkan memory object URL setelah trigger download
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Gagal mengekspor data backup:', err);
      alert('Maaf, terjadi kendala saat mengekspor file backup.');
    }
  }, [monthlyBudget, transactions]);

  // Fitur Import Backup (JSON) dengan validasi skema ketat
  const importBackupData = useCallback(
    async (file: File): Promise<ImportResult> => {
      // Validasi tipe file dasar
      if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        return {
          success: false,
          message: 'Format file tidak didukung. Mohon gunakan file berekstensi .json',
        };
      }

      try {
        const textContent = await file.text();
        let parsed: unknown;

        try {
          parsed = JSON.parse(textContent);
        } catch {
          return {
            success: false,
            message: 'File JSON korup atau tidak dapat dibaca.',
          };
        }

        // Validasi struktur objek utama
        if (!parsed || typeof parsed !== 'object') {
          return {
            success: false,
            message: 'Struktur file backup tidak valid.',
          };
        }

        const data = parsed as Record<string, unknown>;

        // Validasi versi skema & keberadaan data
        if (typeof data.version !== 'number' || data.version < 1) {
          return {
            success: false,
            message: 'Versi skema backup tidak dikenali.',
          };
        }

        // Validasi budget bulanan
        let importedBudget = DEFAULT_BUDGET;
        if (
          typeof data.monthlyBudget === 'number' &&
          Number.isFinite(data.monthlyBudget) &&
          data.monthlyBudget > 0
        ) {
          importedBudget = data.monthlyBudget;
        }

        // Validasi array transaksi
        if (!Array.isArray(data.transactions)) {
          return {
            success: false,
            message: 'Data transaksi pada file backup tidak berformat array.',
          };
        }

        // Validasi setiap item transaksi
        const validTransactions: Transaction[] = data.transactions.filter(isValidTransaction);

        // Timpa state aktif
        setTransactions(validTransactions);
        setMonthlyBudget(importedBudget);

        // Simpan langsung ke localStorage agar langsung persisten
        saveTransactionsToStorage(validTransactions);
        saveBudgetToStorage(importedBudget);

        return {
          success: true,
          message: `Berhasil memulihkan ${validTransactions.length} transaksi & target budget!`,
        };
      } catch (err) {
        console.error('Gagal mengimpor file backup:', err);
        return {
          success: false,
          message: 'Terjadi kesalahan sistem saat memproses file backup.',
        };
      }
    },
    []
  );

  return {
    transactions,
    monthlyBudget,
    addTransaction,
    deleteTransaction,
    saveBudget,
    exportBackupData,
    importBackupData,
  };
}
