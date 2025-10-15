'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseCategory, RecurringExpense, RecurringFrequency } from '@/types/expense';
import { generateId, formatCurrency, formatDate } from '@/lib/utils';

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

const FREQUENCIES: RecurringFrequency[] = ['daily', 'weekly', 'monthly', 'yearly'];

export default function RecurringExpensesManager() {
  const { recurringExpenses, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Bills' as ExpenseCategory,
    description: '',
    frequency: 'monthly' as RecurringFrequency,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    const recurring: RecurringExpense = {
      id: generateId(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      frequency: formData.frequency,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    addRecurringExpense(recurring);
    setFormData({
      amount: '',
      category: 'Bills',
      description: '',
      frequency: 'monthly',
    });
    setShowForm(false);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    updateRecurringExpense(id, { isActive: !isActive });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">Recurring Expenses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add Recurring'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rec-amount" className="block text-sm font-medium text-slate-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                id="rec-amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="₹ 0"
                step="1"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="rec-category" className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select
                id="rec-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
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
              <label htmlFor="rec-description" className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                id="rec-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., Netflix Subscription"
              />
            </div>

            <div>
              <label htmlFor="rec-frequency" className="block text-sm font-medium text-slate-700 mb-1.5">
                Frequency
              </label>
              <select
                id="rec-frequency"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurringFrequency })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                {FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium"
          >
            Add Recurring Expense
          </button>
        </form>
      )}

      {recurringExpenses.length === 0 ? (
        <p className="text-slate-500 text-center py-8">
          No recurring expenses yet. Click &quot;Add Recurring&quot; to set up automatic expenses.
        </p>
      ) : (
        <div className="space-y-3">
          {recurringExpenses.map((recurring) => (
            <div
              key={recurring.id}
              className={`p-4 rounded-lg border transition-opacity ${
                recurring.isActive
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-100 border-slate-300 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-slate-900">{recurring.description}</h3>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-medium rounded">
                      {recurring.category}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {recurring.frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="font-semibold">{formatCurrency(recurring.amount)}</span>
                    <span>Started: {formatDate(recurring.startDate)}</span>
                    {recurring.lastGenerated && (
                      <span>Last: {formatDate(recurring.lastGenerated)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(recurring.id, recurring.isActive)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      recurring.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                    title={recurring.isActive ? 'Pause' : 'Activate'}
                  >
                    {recurring.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteRecurringExpense(recurring.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Recurring expenses are automatically added based on their frequency. The app will create them when you visit the page.
        </p>
      </div>
    </div>
  );
}
