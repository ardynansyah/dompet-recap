import { useState, useMemo } from 'react';
import { useExpenseStore } from './hooks/useExpenseStore';
import { getCurrentMonthPrefix } from './utils/format';
import { Header } from './components/Header';
import { BudgetHeroCard } from './components/BudgetHeroCard';
import { QuickAddExpenseForm } from './components/QuickAddExpenseForm';
import { SpendingDonutChart } from './components/SpendingDonutChart';
import { TransactionHistory } from './components/TransactionHistory';
import { BudgetEditModal } from './components/BudgetEditModal';
import { StoryRecapModal } from './components/StoryRecapModal';

function App() {
  // Custom hook memusatkan state transaksi, budget, dan sinkronisasi localStorage
  const {
    transactions,
    monthlyBudget,
    addTransaction,
    deleteTransaction,
    saveBudget,
    exportBackupData,
    importBackupData,
  } = useExpenseStore();

  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    getCurrentMonthPrefix()
  );
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);

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

  const handleTogglePrivacy = () => {
    setIsPrivacyMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1E232A] flex flex-col font-sans">
      {/* Header */}
      <Header onOpenStoryModal={() => setIsStoryModalOpen(true)} />

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
            <QuickAddExpenseForm onAddTransaction={addTransaction} />
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
              onDeleteTransaction={deleteTransaction}
            />
          </section>
        </div>
      </main>

      {/* Edit Budget & Data Backup Modal */}
      <BudgetEditModal
        isOpen={isEditBudgetOpen}
        currentBudget={monthlyBudget}
        onClose={() => setIsEditBudgetOpen(false)}
        onSave={saveBudget}
        onExportBackup={exportBackupData}
        onImportBackup={importBackupData}
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
