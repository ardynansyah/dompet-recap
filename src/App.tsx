import { useState, useEffect, useMemo } from 'react';
import type { Transaction, CategoryId } from './types';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
  loadBudgetFromStorage,
  saveBudgetToStorage,
  getInitialSampleTransactions,
} from './utils/storage';
import { getCurrentMonthPrefix } from './utils/format';
import { Header } from './components/Header';
import { BudgetHeroCard } from './components/BudgetHeroCard';
import { QuickAddExpenseForm } from './components/QuickAddExpenseForm';
import { SpendingDonutChart } from './components/SpendingDonutChart';
import { TransactionHistory } from './components/TransactionHistory';
import { BudgetEditModal } from './components/BudgetEditModal';
import { StoryRecapModal } from './components/StoryRecapModal';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactionsFromStorage()
  );
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() =>
    loadBudgetFromStorage()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    getCurrentMonthPrefix()
  );
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);

  // Sync transactions to localStorage
  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  // Sync budget to localStorage
  useEffect(() => {
    saveBudgetToStorage(monthlyBudget);
  }, [monthlyBudget]);

  // Calculate total spent for the currently selected month
  const totalSpent = useMemo(() => {
    return transactions
      .filter((t) => t.date.startsWith(selectedMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, selectedMonth]);

  // Transactions for the currently selected month
  const displayedTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Check if any sample data remains
  const hasSampleData = transactions.some((t) => t.isSample);

  // Handlers
  const handleAddTransaction = (newTx: {
    title: string;
    amount: number;
    categoryId: CategoryId;
    date: string;
  }) => {
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTx.title,
      amount: newTx.amount,
      categoryId: newTx.categoryId,
      date: newTx.date,
      createdAt: Date.now(),
      isSample: false,
    };

    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearSampleData = () => {
    setTransactions((prev) => prev.filter((t) => !t.isSample));
  };

  const handleResetToSampleData = () => {
    const samples = getInitialSampleTransactions();
    setTransactions(samples);
  };

  const handleSaveBudget = (newBudget: number) => {
    setMonthlyBudget(newBudget);
  };

  const handleTogglePrivacy = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1E232A] flex flex-col font-sans">
      {/* Header */}
      <Header
        onResetAllData={handleResetToSampleData}
        onOpenStoryModal={() => setIsStoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Responsive Grid: 1 col on mobile, 2 col (5-7) on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Sticky on Desktop) */}
          <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {/* Monthly Budget Summary Card with Warning Banner & Story Button */}
            <BudgetHeroCard
              monthlyBudget={monthlyBudget}
              totalSpent={totalSpent}
              selectedMonth={selectedMonth}
              onOpenEditBudget={() => setIsEditBudgetOpen(true)}
              onOpenStoryModal={() => setIsStoryModalOpen(true)}
            />

            {/* Quick Add Expense Form */}
            <QuickAddExpenseForm onAddTransaction={handleAddTransaction} />
          </section>

          {/* Right Column: Spending Analytics & Transaction History */}
          <section className="lg:col-span-7 space-y-6">
            {/* Thin-Ring Donut Chart (myBCA Catatan Finansial style) */}
            <SpendingDonutChart
              transactions={transactions}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
              isPrivacyMode={isPrivacyMode}
              onTogglePrivacy={handleTogglePrivacy}
              onOpenStoryModal={() => setIsStoryModalOpen(true)}
            />

            {/* Transaction History List */}
            <TransactionHistory
              transactions={displayedTransactions}
              onDeleteTransaction={handleDeleteTransaction}
              onClearSampleData={handleClearSampleData}
              hasSampleData={hasSampleData}
            />
          </section>
        </div>
      </main>

      {/* Edit Budget Modal */}
      <BudgetEditModal
        isOpen={isEditBudgetOpen}
        currentBudget={monthlyBudget}
        onClose={() => setIsEditBudgetOpen(false)}
        onSave={handleSaveBudget}
      />

      {/* 9:16 IG Story Recap Modal */}
      <StoryRecapModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        transactions={transactions}
        monthlyBudget={monthlyBudget}
        selectedMonth={selectedMonth}
        initialHideAmount={isPrivacyMode}
      />
    </div>
  );
}

export default App;
