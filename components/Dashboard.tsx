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
        <div className="space-y-2">
          {budgetWarnings.map((warning, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                warning.severity === 'critical'
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                  {warning.severity === 'critical' ? '🚨' : '⚠️'}
                </span>
                <div>
                  <p className="font-semibold text-sm">{warning.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-sm p-4 sm:p-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Smart Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`backdrop-blur-sm rounded-lg p-4 border ${getInsightStyles(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{insight.icon}</span>
                    <p className="leading-relaxed">
                      {renderMarkdown(insight.message)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
