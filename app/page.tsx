'use client';

import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseFilters from '@/components/ExpenseFilters';
import ExpenseList from '@/components/ExpenseList';
import ExportButton from '@/components/ExportButton';
import BudgetManager from '@/components/BudgetManager';
import RecurringExpensesManager from '@/components/RecurringExpenses';
import FloatingActionButton from '@/components/FloatingActionButton';
import CurrencySelector from '@/components/CurrencySelector';
import Modal from '@/components/Modal';
import { ToastContainer } from '@/components/Toast';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import { useExpenses } from '@/contexts/ExpenseContext';

type TabType = 'dashboard' | 'expenses' | 'budgets' | 'recurring';

const TAB_STYLES = {
  dashboard: {
    active: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg',
    hover: 'hover:bg-blue-50',
    icon: '📊',
  },
  expenses: {
    active: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg',
    hover: 'hover:bg-emerald-50',
    icon: '💳',
  },
  budgets: {
    active: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg',
    hover: 'hover:bg-purple-50',
    icon: '💰',
  },
  recurring: {
    active: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg',
    hover: 'hover:bg-orange-50',
    icon: '🔄',
  },
};

export default function Home() {
  const { isLoading, toasts, removeToast } = useExpenses();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                📊
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Monetly</h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Smart expense tracking made simple</p>
              </div>
            </div>
          </div>
        </header>
        <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
                📊
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  Monetly
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Smart expense tracking made simple</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <CurrencySelector />
              <button
                onClick={handleAddExpense}
                className="px-3 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </button>
              <ExportButton />
            </div>
          </div>

          {/* Navigation Tabs - File Tab Style */}
          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {(Object.keys(TAB_STYLES) as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              const styles = TAB_STYLES[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all rounded-t-lg border-2 border-b-0 whitespace-nowrap
                    flex items-center gap-1.5 sm:gap-2 min-w-fit text-sm sm:text-base
                    ${isActive
                      ? `${styles.active} border-transparent transform translate-y-0.5`
                      : `bg-white/90 text-slate-600 border-slate-300 ${styles.hover} shadow-sm`
                    }
                  `}
                >
                  <span className="text-base sm:text-lg">{styles.icon}</span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Expense Modal */}
      <Modal
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        title="Add Expense"
      >
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      </Modal>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Content Views */}
          {activeTab === 'dashboard' && <Dashboard onAddExpense={handleAddExpense} />}
          {activeTab === 'expenses' && (
            <div className="space-y-4 sm:space-y-6">
              <ExpenseFilters />
              <ExpenseList />
            </div>
          )}
          {activeTab === 'budgets' && <BudgetManager />}
          {activeTab === 'recurring' && <RecurringExpensesManager />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200 mt-8 sm:mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-slate-500 text-xs sm:text-sm">
            Turning expenses into insights
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddExpense} />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
