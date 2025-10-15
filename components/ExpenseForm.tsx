'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, BillSubcategory } from '@/types/expense';
import { generateId } from '@/lib/utils';
import { useExpenses } from '@/contexts/ExpenseContext';

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

const BILL_SUBCATEGORIES: BillSubcategory[] = [
  'EMI',
  'Credit Card',
  'Internet',
  'Mobile',
  'Electricity',
  'Water',
  'Gas',
  'Rent',
  'Insurance',
  'Other Bills',
];

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function ExpenseForm({ editingExpense, onCancel, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food' as ExpenseCategory,
    subcategory: '' as BillSubcategory | '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        subcategory: editingExpense.subcategory || '',
        description: editingExpense.description,
        date: editingExpense.date,
      });
    }
  }, [editingExpense]);

  // Reset subcategory when category changes away from Bills
  useEffect(() => {
    if (formData.category !== 'Bills') {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (formData.category === 'Bills' && !formData.subcategory) {
      newErrors.subcategory = 'Please select a bill type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData: Partial<Expense> = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      };

      // Add subcategory only if category is Bills and subcategory is selected
      if (formData.category === 'Bills' && formData.subcategory) {
        expenseData.subcategory = formData.subcategory as BillSubcategory;
      }

      if (editingExpense) {
        updateExpense(editingExpense.id, expenseData);
      } else {
        const newExpense: Expense = {
          ...expenseData as Omit<Expense, 'id' | 'createdAt'>,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        addExpense(newExpense);
      }

      setFormData({
        amount: '',
        category: 'Food',
        subcategory: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});

      if (onCancel) onCancel();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      category: 'Food',
      subcategory: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {editingExpense ? 'Edit Expense' : 'New Expense'}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            step="1"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.amount ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="₹ 0"
          />
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Bill Subcategory - Only shown when Bills is selected */}
        {formData.category === 'Bills' && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-slate-700 mb-1.5">
              Bill Type
            </label>
            <select
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as BillSubcategory })}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.subcategory ? 'border-red-500' : 'border-slate-300'
              }`}
            >
              <option value="">Select bill type</option>
              {BILL_SUBCATEGORIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-xs text-red-500">{errors.subcategory}</p>}
          </div>
        )}

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.date ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.description ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter description"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
        {(editingExpense || onClose) && (
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium border border-slate-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
        >
          {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
