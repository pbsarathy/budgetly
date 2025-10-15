'use client';

import React from 'react';
import { Expense } from '@/types/expense';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency, getCategoryIcon, generateId } from '@/lib/utils';

export default function RecentExpensesQuickAdd() {
  const { expenses, addExpense } = useExpenses();

  // Get last 5 unique expenses (unique by category + description + amount combo)
  const getRecentUniqueExpenses = () => {
    const seen = new Set<string>();
    const unique: Expense[] = [];

    // Sort by date descending
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const expense of sorted) {
      const key = `${expense.category}-${expense.description}-${expense.amount}`;
      if (!seen.has(key) && unique.length < 5) {
        seen.add(key);
        unique.push(expense);
      }
      if (unique.length === 5) break;
    }

    return unique;
  };

  const recentExpenses = getRecentUniqueExpenses();

  if (recentExpenses.length === 0) {
    return null;
  }

  const handleQuickAdd = (expense: Expense) => {
    const today = new Date().toISOString().split('T')[0];
    const newExpense: Expense = {
      id: generateId(),
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: today,
      createdAt: new Date().toISOString(),
    };
    addExpense(newExpense);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        Quick Add Recent Expenses
      </h3>

      <div className="space-y-2">
        {recentExpenses.map((expense, index) => (
          <button
            key={`${expense.id}-${index}`}
            onClick={() => handleQuickAdd(expense)}
            className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-2xl flex-shrink-0">{getCategoryIcon(expense.category)}</span>
              <div className="text-left min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-slate-500">{expense.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(expense.amount)}
              </span>
              <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                +
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-3 text-center">
        Click to add with today&apos;s date
      </p>
    </div>
  );
}
