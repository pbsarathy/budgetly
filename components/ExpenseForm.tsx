'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, BillSubcategory, InvestmentSubcategory, DailySpendSubcategory, EMISubcategory } from '@/types/expense';
import { generateId } from '@/lib/utils';
import { useExpenses } from '@/contexts/ExpenseContext';

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Education',
  'Investments',
  'Daily Spends',
  'EMI',
  'Maintenance',
  'Other',
];

const BILL_SUBCATEGORIES: BillSubcategory[] = [
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

const INVESTMENT_SUBCATEGORIES: InvestmentSubcategory[] = [
  'Savings',
  'Mutual Fund',
  'Stocks',
  'Jar',
  'Other',
];

const DAILY_SPEND_SUBCATEGORIES: DailySpendSubcategory[] = [
  'Groceries',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Snacks',
  'Others',
];

const EMI_SUBCATEGORIES: EMISubcategory[] = [
  'Personal Loan',
  'Home Loan',
  'Vehicle Loan',
  'Education Loan',
  'Others',
];

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function ExpenseForm({ editingExpense, onCancel, onClose }: ExpenseFormProps) {
  const { addExpense, updateExpense, addRecurringExpense } = useExpenses();

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food' as ExpenseCategory,
    subcategory: '' as BillSubcategory | InvestmentSubcategory | DailySpendSubcategory | EMISubcategory | '',
    customSubcategory: '',
    customCategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        subcategory: editingExpense.subcategory || '',
        customSubcategory: editingExpense.customSubcategory || '',
        customCategory: editingExpense.customCategory || '',
        description: editingExpense.description,
        date: editingExpense.date,
      });
    }
  }, [editingExpense]);

  // Reset subcategory when category changes away from Bills, Investments, Daily Spends, and EMI
  useEffect(() => {
    if (formData.category !== 'Bills' && formData.category !== 'Investments' && formData.category !== 'Daily Spends' && formData.category !== 'EMI') {
      setFormData(prev => ({ ...prev, subcategory: '', customSubcategory: '' }));
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

    if (formData.category === 'Investments' && !formData.subcategory) {
      newErrors.subcategory = 'Please select an investment type';
    }

    if (formData.category === 'Daily Spends' && !formData.subcategory) {
      newErrors.subcategory = 'Please select a daily spend type';
    }

    if (formData.category === 'EMI' && !formData.subcategory) {
      newErrors.subcategory = 'Please select an EMI type';
    }

    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Please enter a category name';
    }

    if ((formData.subcategory === 'Other' || formData.subcategory === 'Others') && !formData.customSubcategory.trim()) {
      newErrors.customSubcategory = 'Please enter a subcategory name';
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

      // Add subcategory for Investments
      if (formData.category === 'Investments' && formData.subcategory) {
        expenseData.subcategory = formData.subcategory as InvestmentSubcategory;
      }

      // Add subcategory for Daily Spends
      if (formData.category === 'Daily Spends' && formData.subcategory) {
        expenseData.subcategory = formData.subcategory as DailySpendSubcategory;
      }

      // Add subcategory for EMI
      if (formData.category === 'EMI' && formData.subcategory) {
        expenseData.subcategory = formData.subcategory as EMISubcategory;
      }

      // Add custom category if Other is selected
      if (formData.category === 'Other' && formData.customCategory) {
        expenseData.customCategory = formData.customCategory.trim();
      }

      // Add custom subcategory if Other or Others is selected
      if ((formData.subcategory === 'Other' || formData.subcategory === 'Others') && formData.customSubcategory) {
        expenseData.customSubcategory = formData.customSubcategory.trim();
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

        // If recurring is checked, also create a recurring expense
        if (isRecurring) {
          let subcategory: BillSubcategory | InvestmentSubcategory | DailySpendSubcategory | EMISubcategory | undefined = undefined;

          if (formData.subcategory) {
            if (formData.category === 'Bills') {
              subcategory = formData.subcategory as BillSubcategory;
            } else if (formData.category === 'Investments') {
              subcategory = formData.subcategory as InvestmentSubcategory;
            } else if (formData.category === 'Daily Spends') {
              subcategory = formData.subcategory as DailySpendSubcategory;
            } else if (formData.category === 'EMI') {
              subcategory = formData.subcategory as EMISubcategory;
            }
          }

          const recurringExpense = {
            id: generateId(),
            amount: parseFloat(formData.amount),
            category: formData.category,
            subcategory,
            customSubcategory: formData.customSubcategory || undefined,
            customCategory: formData.customCategory || undefined,
            description: formData.description.trim(),
            frequency: recurringFrequency,
            startDate: formData.date,
            isActive: true,
          };
          addRecurringExpense(recurringExpense);
        }
      }

      setFormData({
        amount: '',
        category: 'Food',
        subcategory: '',
        customSubcategory: '',
        customCategory: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setIsRecurring(false);
      setRecurringFrequency('monthly');
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
      customSubcategory: '',
      customCategory: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsRecurring(false);
    setRecurringFrequency('monthly');
    setErrors({});
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            step="1"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.amount ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="₹ 0"
            required
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
            className="w-full px-3 py-2.5 border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
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
              Bill Type <span className="text-red-500">*</span>
            </label>
            <select
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as BillSubcategory })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.subcategory ? 'border-red-500' : 'border-slate-300'
              }`}
              required
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

        {/* Investment Subcategory - Only shown when Investments is selected */}
        {formData.category === 'Investments' && (
          <div>
            <label htmlFor="investment-subcategory" className="block text-sm font-medium text-slate-700 mb-1.5">
              Investment Type <span className="text-red-500">*</span>
            </label>
            <select
              id="investment-subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as InvestmentSubcategory, customSubcategory: '' })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.subcategory ? 'border-red-500' : 'border-slate-300'
              }`}
              required
            >
              <option value="">Select investment type</option>
              {INVESTMENT_SUBCATEGORIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-xs text-red-500">{errors.subcategory}</p>}
          </div>
        )}

        {/* Daily Spends Subcategory - Only shown when Daily Spends is selected */}
        {formData.category === 'Daily Spends' && (
          <div>
            <label htmlFor="dailyspend-subcategory" className="block text-sm font-medium text-slate-700 mb-1.5">
              Daily Spend Type <span className="text-red-500">*</span>
            </label>
            <select
              id="dailyspend-subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as DailySpendSubcategory, customSubcategory: '' })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.subcategory ? 'border-red-500' : 'border-slate-300'
              }`}
              required
            >
              <option value="">Select daily spend type</option>
              {DAILY_SPEND_SUBCATEGORIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-xs text-red-500">{errors.subcategory}</p>}
          </div>
        )}

        {/* EMI Subcategory - Only shown when EMI is selected */}
        {formData.category === 'EMI' && (
          <div>
            <label htmlFor="emi-subcategory" className="block text-sm font-medium text-slate-700 mb-1.5">
              EMI Type <span className="text-red-500">*</span>
            </label>
            <select
              id="emi-subcategory"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as EMISubcategory, customSubcategory: '' })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.subcategory ? 'border-red-500' : 'border-slate-300'
              }`}
              required
            >
              <option value="">Select EMI type</option>
              {EMI_SUBCATEGORIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-xs text-red-500">{errors.subcategory}</p>}
          </div>
        )}

        {/* Custom Subcategory - Only shown when Other or Others subcategory is selected */}
        {(formData.subcategory === 'Other' || formData.subcategory === 'Others') && (
          <div>
            <label htmlFor="custom-subcategory" className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom {formData.category === 'Bills' ? 'Bill' : formData.category === 'Investments' ? 'Investment' : formData.category === 'Daily Spends' ? 'Daily Spend' : 'EMI'} Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="custom-subcategory"
              value={formData.customSubcategory}
              onChange={(e) => setFormData({ ...formData, customSubcategory: e.target.value })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.customSubcategory ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter custom type"
              required
            />
            {errors.customSubcategory && <p className="mt-1 text-xs text-red-500">{errors.customSubcategory}</p>}
          </div>
        )}

        {/* Custom Category - Only shown when Other category is selected */}
        {formData.category === 'Other' && (
          <div>
            <label htmlFor="custom-category" className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="custom-category"
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
                errors.customCategory ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter category name"
              required
            />
            {errors.customCategory && <p className="mt-1 text-xs text-red-500">{errors.customCategory}</p>}
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
            className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.date ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2.5 border focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all ${
              errors.description ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter description"
            required
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Recurring Expense Checkbox */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-purple-600 border-slate-300 focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-900">Make this a recurring expense</span>
            <p className="text-xs text-slate-600 mt-0.5">
              This expense will be automatically added at regular intervals
            </p>
          </div>
        </label>

        {/* Frequency Selector - Only shown when recurring is checked */}
        {isRecurring && (
          <div className="mt-3 pl-7">
            <label htmlFor="frequency" className="block text-sm font-medium text-slate-700 mb-1.5">
              Frequency <span className="text-red-500">*</span>
            </label>
            <select
              id="frequency"
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
              className="w-full px-3 py-2.5 border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-sm"
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>

      {/* Required Fields Help Text */}
      <p className="text-xs text-slate-500 mt-4">
        <span className="text-red-500">*</span> Required fields
      </p>

      {/* Buttons */}
      <div className="flex gap-2 sm:gap-3 justify-end mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-3 sm:px-8 sm:py-3.5 text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 font-semibold transition-all duration-200 shadow-sm hover:shadow text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 sm:px-10 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
