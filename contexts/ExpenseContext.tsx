'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFilters, Budget, RecurringExpense } from '@/types/expense';
import { expenseStorage, budgetStorage, recurringStorage } from '@/lib/expenseStorage';
import { generateId } from '@/lib/utils';
import { Toast, ToastType } from '@/components/Toast';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  filters: ExpenseFilters;
  setFilters: (filters: ExpenseFilters) => void;
  filteredExpenses: Expense[];
  budgets: Budget[];
  setBudget: (budget: Budget) => void;
  deleteBudget: (category: string) => void;
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (recurring: RecurringExpense) => void;
  updateRecurringExpense: (id: string, recurring: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;
  isLoading: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, action?: { label: string; onClick: () => void }) => void;
  removeToast: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'All',
    searchTerm: '',
    monthView: 'current',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load all data from localStorage on mount
  useEffect(() => {
    const loadedExpenses = expenseStorage.getAll();
    const loadedBudgets = budgetStorage.getAll();
    const loadedRecurring = recurringStorage.getAll();

    setExpenses(loadedExpenses);
    setBudgets(loadedBudgets);
    setRecurringExpenses(loadedRecurring);
    setIsLoading(false);
  }, []);

  // Auto-generate recurring expenses
  useEffect(() => {
    if (isLoading) return;

    const today = new Date();
    let hasNewExpenses = false;

    recurringExpenses.forEach((recurring) => {
      if (!recurring.isActive) return;

      const lastGenerated = recurring.lastGenerated
        ? new Date(recurring.lastGenerated)
        : new Date(recurring.startDate);

      let shouldGenerate = false;

      switch (recurring.frequency) {
        case 'daily':
          shouldGenerate = today.getTime() - lastGenerated.getTime() >= 24 * 60 * 60 * 1000;
          break;
        case 'weekly':
          shouldGenerate = today.getTime() - lastGenerated.getTime() >= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'monthly':
          shouldGenerate =
            today.getMonth() !== lastGenerated.getMonth() ||
            today.getFullYear() !== lastGenerated.getFullYear();
          break;
        case 'yearly':
          shouldGenerate = today.getFullYear() !== lastGenerated.getFullYear();
          break;
      }

      if (shouldGenerate) {
        const newExpense: Expense = {
          id: generateId(),
          amount: recurring.amount,
          category: recurring.category,
          description: `${recurring.description} (Auto)`,
          date: today.toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };

        expenseStorage.add(newExpense);
        recurringStorage.update(recurring.id, { lastGenerated: today.toISOString() });
        hasNewExpenses = true;
      }
    });

    if (hasNewExpenses) {
      setExpenses(expenseStorage.getAll());
      setRecurringExpenses(recurringStorage.getAll());
    }
  }, [recurringExpenses, isLoading]);

  const addToast = (
    message: string,
    type: ToastType = 'success',
    action?: { label: string; onClick: () => void }
  ) => {
    const newToast: Toast = {
      id: generateId(),
      message,
      type,
      action,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addExpense = (expense: Expense) => {
    const newExpenses = expenseStorage.add(expense);
    setExpenses(newExpenses);
    addToast('Expense added successfully!', 'success');
  };

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    const newExpenses = expenseStorage.update(id, updatedExpense);
    setExpenses(newExpenses);
    addToast('Expense updated successfully!', 'success');
  };

  const deleteExpense = (id: string) => {
    const deletedExpense = expenses.find((e) => e.id === id);
    const newExpenses = expenseStorage.delete(id);
    setExpenses(newExpenses);

    if (deletedExpense) {
      addToast('Expense deleted', 'info', {
        label: 'Undo',
        onClick: () => {
          const restored = expenseStorage.add(deletedExpense);
          setExpenses(restored);
          addToast('Expense restored', 'success');
        },
      });
    }
  };

  const addBudget = (budget: Budget) => {
    const newBudgets = budgetStorage.setBudget(budget);
    setBudgets(newBudgets);
  };

  const deleteBudgetFunc = (category: string) => {
    const newBudgets = budgetStorage.delete(category);
    setBudgets(newBudgets);
  };

  const addRecurring = (recurring: RecurringExpense) => {
    const newRecurring = recurringStorage.add(recurring);
    setRecurringExpenses(newRecurring);
  };

  const updateRecurring = (id: string, updated: Partial<RecurringExpense>) => {
    const newRecurring = recurringStorage.update(id, updated);
    setRecurringExpenses(newRecurring);
  };

  const deleteRecurring = (id: string) => {
    const newRecurring = recurringStorage.delete(id);
    setRecurringExpenses(newRecurring);
  };

  // Filter expenses based on current filters
  const filteredExpenses = expenses.filter((expense) => {
    // Month view filter
    if (filters.monthView && filters.monthView !== 'all') {
      const expenseDate = new Date(expense.date);

      if (filters.monthView === 'current') {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (expenseDate.getMonth() !== currentMonth || expenseDate.getFullYear() !== currentYear) {
          return false;
        }
      } else {
        // Specific month format: 'YYYY-MM'
        const [filterYear, filterMonth] = filters.monthView.split('-').map(Number);

        if (expenseDate.getFullYear() !== filterYear || expenseDate.getMonth() + 1 !== filterMonth) {
          return false;
        }
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(searchLower);
      const matchesCategory = expense.category.toLowerCase().includes(searchLower);
      const matchesAmount = expense.amount.toString().includes(searchLower);

      if (!matchesDescription && !matchesCategory && !matchesAmount) {
        return false;
      }
    }

    return true;
  });

  // Sort by date (newest first)
  const sortedFilteredExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        filters,
        setFilters,
        filteredExpenses: sortedFilteredExpenses,
        budgets,
        setBudget: addBudget,
        deleteBudget: deleteBudgetFunc,
        recurringExpenses,
        addRecurringExpense: addRecurring,
        updateRecurringExpense: updateRecurring,
        deleteRecurringExpense: deleteRecurring,
        isLoading,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
