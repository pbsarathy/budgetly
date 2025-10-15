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
    active: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl',
    hover: 'hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50',
    icon: '📊',
  },
  expenses: {
    active: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-2xl',
    hover: 'hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50',
    icon: '💳',
  },
  budgets: {
    active: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl',
    hover: 'hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50',
    icon: '💰',
  },
  recurring: {
    active: 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-2xl',
    hover: 'hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50',
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
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
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
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-white/20 sticky top-0 z-10 shadow-xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              {/* Glassmorphic Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-75 group-hover:opacity-100 blur transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl shadow-2xl flex-shrink-0 transform group-hover:scale-105 transition-transform">
                  <span className="filter drop-shadow-lg">💰</span>
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  Monetly
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-600 hidden sm:block mt-0.5">Turning expenses into insights ✨</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <CurrencySelector />
              <button
                onClick={handleAddExpense}
                className="relative px-3 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all font-bold shadow-xl hover:shadow-2xl flex items-center gap-1.5 text-sm sm:text-base whitespace-nowrap transform hover:scale-105 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <span className="relative text-xl sm:text-2xl">+</span>
                <span className="relative hidden sm:inline">Add Expense</span>
                <span className="relative sm:hidden text-xs font-extrabold">Add</span>
              </button>
              <ExportButton />
            </div>
          </div>

          {/* Navigation Tabs - File Tab Style */}
          <div className="flex gap-1.5 sm:gap-3 mt-4 sm:mt-6 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {(Object.keys(TAB_STYLES) as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              const styles = TAB_STYLES[tab];

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2.5 sm:px-7 sm:py-3.5 font-bold transition-all duration-300 border-2 border-b-0 whitespace-nowrap
                    flex items-center gap-1.5 sm:gap-2.5 min-w-fit text-xs sm:text-base flex-shrink-0 transform
                    ${isActive
                      ? `${styles.active} border-transparent translate-y-0.5 scale-105`
                      : `bg-white/90 backdrop-blur-sm text-slate-700 border-white/40 ${styles.hover} shadow-lg hover:shadow-xl hover:scale-102`
                    }
                  `}
                >
                  <span className="text-base sm:text-xl filter drop-shadow">{styles.icon}</span>
                  <span className="hidden xs:inline tracking-wide">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span className="xs:hidden tracking-wide">{tab.charAt(0).toUpperCase() + tab.slice(1).substring(0, 3)}</span>
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
      <footer className="bg-white/90 backdrop-blur-md border-t-2 border-white/30 mt-12 sm:mt-16 shadow-2xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Turning expenses into insights ✨
          </p>
          <p className="text-center text-xs sm:text-sm text-slate-500 mt-2">
            Made with 💜 by Claude Code
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
