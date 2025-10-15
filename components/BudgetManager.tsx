'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseCategory, Budget } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { overallBudgetStorage } from '@/lib/expenseStorage';

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Education',
  'Savings',
  'Other',
];

export default function BudgetManager() {
  const { budgets, setBudget, deleteBudget, expenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [showOverallForm, setShowOverallForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('Food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [overallBudget, setOverallBudget] = useState<number | null>(null);
  const [overallBudgetAmount, setOverallBudgetAmount] = useState('');

  // Load overall budget on mount
  useEffect(() => {
    const saved = overallBudgetStorage.get();
    if (saved) {
      setOverallBudget(saved.limit);
    }
  }, []);

  // Calculate total spending for current month
  const getTotalMonthlySpending = (): number => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return expenses
      .filter((exp) => new Date(exp.date) >= monthStart)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const handleOverallBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!overallBudgetAmount || parseFloat(overallBudgetAmount) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    const limit = parseFloat(overallBudgetAmount);
    overallBudgetStorage.save({ limit, period: 'monthly' });
    setOverallBudget(limit);
    setOverallBudgetAmount('');
    setShowOverallForm(false);
  };

  const handleDeleteOverallBudget = () => {
    if (window.confirm('Are you sure you want to delete the overall budget?')) {
      overallBudgetStorage.delete();
      setOverallBudget(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    const budget: Budget = {
      category: selectedCategory,
      limit: parseFloat(budgetAmount),
      period: 'monthly',
    };

    setBudget(budget);
    setBudgetAmount('');
    setShowForm(false);
  };

  // Calculate current spending for each category this month
  const getCurrentMonthSpending = (category: ExpenseCategory): number => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return expenses
      .filter((exp) => exp.category === category && new Date(exp.date) >= monthStart)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  const totalSpent = getTotalMonthlySpending();
  const overallPercentage = overallBudget ? (totalSpent / overallBudget) * 100 : 0;
  const isOverOverallBudget = overallBudget && totalSpent > overallBudget;
  const isNearOverallLimit = overallBudget && overallPercentage >= 80 && !isOverOverallBudget;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Budget Manager</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowOverallForm(!showOverallForm)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {showOverallForm ? 'Cancel' : overallBudget ? 'Edit Overall Budget' : 'Set Overall Budget'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {showForm ? 'Cancel' : 'Set Category Budget'}
          </button>
        </div>
      </div>

      {/* Overall Budget Section */}
      {showOverallForm && (
        <form onSubmit={handleOverallBudgetSubmit} className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Overall Monthly Budget</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="overall-budget-amount" className="block text-sm font-bold text-slate-700 mb-1.5">
                Total Monthly Budget
              </label>
              <input
                type="number"
                id="overall-budget-amount"
                value={overallBudgetAmount}
                onChange={(e) => setOverallBudgetAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="₹ 0"
                step="100"
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Save Overall Budget
          </button>
        </form>
      )}

      {/* Overall Budget Display */}
      {overallBudget && !showOverallForm && (
        <div className="mb-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Overall Monthly Budget</h3>
              <p className="text-sm text-slate-600 mt-1">
                {formatCurrency(totalSpent)} / {formatCurrency(overallBudget)}
              </p>
            </div>
            <button
              onClick={handleDeleteOverallBudget}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title="Delete overall budget"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverOverallBudget
                  ? 'bg-red-500'
                  : isNearOverallLimit
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>

          {/* Warning Messages */}
          {isOverOverallBudget && (
            <p className="mt-3 text-sm text-red-600 font-medium">
              ⚠️ Over overall budget by {formatCurrency(totalSpent - overallBudget)}
            </p>
          )}
          {isNearOverallLimit && (
            <p className="mt-3 text-sm text-yellow-600 font-medium">
              ⚠️ Approaching overall budget limit ({overallPercentage.toFixed(0)}% used)
            </p>
          )}
          {!isOverOverallBudget && !isNearOverallLimit && (
            <p className="mt-3 text-sm text-green-600 font-medium">
              ✓ {formatCurrency(overallBudget - totalSpent)} remaining ({(100 - overallPercentage).toFixed(0)}% left)
            </p>
          )}
        </div>
      )}

      {/* Category Budget Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Category Budget</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget-category" className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                id="budget-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget-amount" className="block text-sm font-medium text-slate-700 mb-1.5">
                Monthly Budget
              </label>
              <input
                type="number"
                id="budget-amount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="₹ 0"
                step="100"
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Save Category Budget
          </button>
        </form>
      )}

      {budgets.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No category budgets set yet. Click &quot;Set Category Budget&quot; to get started.</p>
      ) : (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-5">Category Budgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {budgets.map((budget) => {
            const spent = getCurrentMonthSpending(budget.category);
            const percentage = (spent / budget.limit) * 100;
            const isOverBudget = spent > budget.limit;
            const isNearLimit = percentage >= 80 && !isOverBudget;

            return (
              <div key={budget.category} className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{budget.category}</h4>
                    <p className="text-sm text-slate-600 mt-1 font-medium">
                      {formatCurrency(spent)} <span className="text-slate-400">/</span> {formatCurrency(budget.limit)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBudget(budget.category)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete budget"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-3 shadow-inner">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      isOverBudget
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : isNearLimit
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {/* Warning Messages */}
                {isOverBudget && (
                  <p className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    ⚠️ Over budget by {formatCurrency(spent - budget.limit)}
                  </p>
                )}
                {isNearLimit && (
                  <p className="text-xs text-yellow-700 font-semibold bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                    ⚠️ Approaching limit ({percentage.toFixed(0)}% used)
                  </p>
                )}
                {!isOverBudget && !isNearLimit && (
                  <p className="text-xs text-green-700 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    ✓ {formatCurrency(budget.limit - spent)} remaining
                  </p>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
