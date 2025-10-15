'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { calculateStats, formatCurrency, getCategoryIcon, generateInsights } from '@/lib/utils';
import { ExpenseCategory } from '@/types/expense';
import Charts from './Charts';
import BudgetChart from './BudgetChart';
import EmptyState from './EmptyState';
import { overallBudgetStorage } from '@/lib/expenseStorage';

interface DashboardProps {
  onAddExpense: () => void;
}

export default function Dashboard({ onAddExpense }: DashboardProps) {
  const { expenses, budgets } = useExpenses();
  const stats = calculateStats(expenses);
  const [overallBudget, setOverallBudget] = useState<{limit: number; period: string} | null>(null);

  useEffect(() => {
    setOverallBudget(overallBudgetStorage.get());
  }, []);

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Welcome to Monetly!"
        description="Start tracking your expenses and get insights into your spending habits. Add your first expense to see your dashboard come to life."
        action={{
          label: 'Add Your First Expense',
          onClick: onAddExpense,
        }}
      />
    );
  }

  const statCards = [
    {
      title: 'Total Spending',
      value: formatCurrency(stats.totalSpending),
      icon: '💰',
      color: 'text-white',
      bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
      iconBg: 'bg-white/20',
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthlySpending),
      icon: '📅',
      color: 'text-white',
      bg: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Average Expense',
      value: formatCurrency(stats.averageExpense),
      icon: '📊',
      color: 'text-white',
      bg: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Total Expenses',
      value: stats.expenseCount.toString(),
      icon: '🧾',
      color: 'text-white',
      bg: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
      iconBg: 'bg-white/20',
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

  // Check for budget warnings
  const budgetWarnings: Array<{type: string; message: string; severity: string}> = [];

  if (overallBudget && stats.monthlySpending > overallBudget.limit) {
    budgetWarnings.push({
      type: 'overall',
      message: `You've exceeded your overall monthly budget by ${formatCurrency(stats.monthlySpending - overallBudget.limit)}`,
      severity: 'critical'
    });
  } else if (overallBudget && (stats.monthlySpending / overallBudget.limit) >= 0.9) {
    budgetWarnings.push({
      type: 'overall',
      message: `You're at ${((stats.monthlySpending / overallBudget.limit) * 100).toFixed(0)}% of your overall budget`,
      severity: 'warning'
    });
  }

  // Check category budget warnings
  budgets.forEach(budget => {
    const categorySpending = stats.categoryBreakdown[budget.category];
    if (categorySpending > budget.limit) {
      budgetWarnings.push({
        type: 'category',
        message: `${budget.category}: Over budget by ${formatCurrency(categorySpending - budget.limit)}`,
        severity: 'warning'
      });
    }
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Budget Warnings */}
      {budgetWarnings.length > 0 && (
        <div className="space-y-3">
          {budgetWarnings.map((warning, index) => (
            <div
              key={index}
              className={`p-5 border-2 shadow-xl transform hover:scale-102 transition-all ${
                warning.severity === 'critical'
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400 text-red-900'
                  : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 text-yellow-900'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0 filter drop-shadow">
                  {warning.severity === 'critical' ? '🚨' : '⚠️'}
                </span>
                <div>
                  <p className="font-bold text-base">{warning.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} shadow-2xl p-6 sm:p-7 hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.iconBg} backdrop-blur-sm w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl shadow-xl transform group-hover:scale-110 transition-transform`}>
                  <span className="filter drop-shadow-lg">{card.icon}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-semibold mb-2 uppercase tracking-wider">{card.title}</p>
              <p className={`text-3xl sm:text-4xl font-extrabold ${card.color} drop-shadow-lg`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Categories - Modern Cards */}
      {topCategories.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Spending by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
            {topCategories.map(({ category, amount }) => {
              const percentage =
                stats.totalSpending > 0 ? (amount / stats.totalSpending) * 100 : 0;

              return (
                <div
                  key={category}
                  className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-white/40 p-5 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 cursor-pointer group relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                        <span className="filter drop-shadow">{getCategoryIcon(category)}</span>
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-sm font-bold text-slate-900 text-center mb-2 truncate">
                      {category}
                    </h3>

                    {/* Amount */}
                    <p className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-2">
                      {formatCurrency(amount)}
                    </p>

                    {/* Percentage */}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <div className="text-xs font-bold text-slate-600">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 transition-all duration-500 shadow-lg"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
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
      {(() => {
        const insights = generateInsights(expenses);
        if (insights.length === 0) return null;

        const getInsightStyles = (type: 'positive' | 'warning' | 'info') => {
          switch (type) {
            case 'positive':
              return 'bg-white/20 border-green-300/30 text-white';
            case 'warning':
              return 'bg-white/20 border-yellow-300/30 text-white';
            case 'info':
              return 'bg-white/15 border-white/20 text-white';
          }
        };

        const renderMarkdown = (text: string) => {
          return text.split('**').map((part, i) =>
            i % 2 === 0 ? part : <strong key={i} className="text-yellow-200 font-bold">{part}</strong>
          );
        };

        return (
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 flex items-center gap-3">
                <span className="text-3xl sm:text-4xl filter drop-shadow-lg">💡</span>
                <span>Smart Insights</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-md p-5 border-2 ${getInsightStyles(insight.type)} hover:scale-105 transition-transform duration-300 shadow-xl`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0 filter drop-shadow-lg">{insight.icon}</span>
                      <p className="leading-relaxed font-medium">
                        {renderMarkdown(insight.message)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
