'use client';

import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateStats, formatCurrency, getCategoryIcon } from '@/lib/utils';
import { ExpenseCategory } from '@/types/expense';
import Charts from './Charts';
import BudgetChart from './BudgetChart';
import RecentExpensesQuickAdd from './RecentExpensesQuickAdd';
import EmptyState from './EmptyState';

export default function Dashboard() {
  const { expenses } = useExpenses();
  const stats = calculateStats(expenses);

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Welcome to Budgetly!"
        description="Start tracking your expenses and get insights into your spending habits. Add your first expense to see your dashboard come to life."
        action={{
          label: 'Add Your First Expense',
          onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        }}
      />
    );
  }

  const statCards = [
    {
      title: 'Total Spending',
      value: formatCurrency(stats.totalSpending),
      icon: '💰',
      color: 'text-blue-700',
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-200',
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthlySpending),
      icon: '📅',
      color: 'text-emerald-700',
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
    },
    {
      title: 'Average Expense',
      value: formatCurrency(stats.averageExpense),
      icon: '📊',
      color: 'text-violet-700',
      bg: 'bg-gradient-to-br from-violet-50 to-violet-100',
      border: 'border-violet-200',
    },
    {
      title: 'Total Expenses',
      value: stats.expenseCount.toString(),
      icon: '🧾',
      color: 'text-amber-700',
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      border: 'border-amber-200',
    },
  ];

  const topCategories = (Object.keys(stats.categoryBreakdown) as ExpenseCategory[])
    .map((category) => ({
      category,
      amount: stats.categoryBreakdown[category],
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Recent Expenses Quick Add */}
      <RecentExpensesQuickAdd />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} rounded-lg shadow-sm border ${card.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="bg-white/60 backdrop-blur-sm w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-sm">
                {card.icon}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">{card.title}</p>
            <p className={`text-xl sm:text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Top Categories - Modern Cards */}
      {topCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Spending by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {topCategories.map(({ category, amount }) => {
              const percentage =
                stats.totalSpending > 0 ? (amount / stats.totalSpending) * 100 : 0;

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all hover:scale-105 cursor-pointer"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      {getCategoryIcon(category)}
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-sm font-semibold text-slate-900 text-center mb-2 truncate">
                    {category}
                  </h3>

                  {/* Amount */}
                  <p className="text-lg font-bold text-slate-900 text-center mb-2">
                    {formatCurrency(amount)}
                  </p>

                  {/* Percentage */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div className="text-xs font-medium text-slate-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      <Charts />

      {/* Budget Tracking Chart */}
      <BudgetChart />

      {/* Insights */}
      {stats.topCategory && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-sm p-4 sm:p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Insights
          </h2>
          <div className="space-y-3 text-sm">
            <p className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              Your top spending category is <strong className="text-yellow-200">{stats.topCategory}</strong> with{' '}
              <strong className="text-yellow-200">{formatCurrency(stats.categoryBreakdown[stats.topCategory])}</strong>
            </p>
            {stats.monthlySpending > 0 && (
              <p className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                This month you&apos;ve spent{' '}
                <strong className="text-yellow-200">{formatCurrency(stats.monthlySpending)}</strong> across{' '}
                {expenses.filter((exp) => {
                  const now = new Date();
                  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                  return new Date(exp.date) >= monthStart;
                }).length}{' '}
                transactions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
