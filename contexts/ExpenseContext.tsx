'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFilters, Budget, RecurringExpense } from '@/types/expense';
import { useAuth } from './AuthContext';
import * as supabaseStorage from '@/lib/supabaseStorage';
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
  const { user } = useAuth();
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

  // Load all data from Supabase when user is authenticated
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔄 Loading data for user:', user.id, user.email);

        const [loadedExpenses, loadedBudgets, loadedRecurring] = await Promise.all([
          supabaseStorage.getExpenses(user.id),
          supabaseStorage.getBudgets(user.id),
          supabaseStorage.getRecurringExpenses(user.id),
        ]);

        console.log('✅ Data loaded successfully:', {
          expenses: loadedExpenses.length,
          budgets: loadedBudgets.length,
          recurring: loadedRecurring.length
        });

        setExpenses(loadedExpenses);

        // Convert Supabase budgets to Budget format
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const currentBudgets: Budget[] = loadedBudgets
          .filter(b => b.month === currentMonth && b.year === currentYear)
          .map(b => ({
            category: b.category,
            limit: b.amount,
            period: 'monthly' as const,
          }));

        setBudgets(currentBudgets);
        setRecurringExpenses(loadedRecurring);
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('Error details:', {
          message: (error as Error).message,
          user: { id: user.id, email: user.email }
        });
        addToast('Failed to load data from server', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Auto-generate recurring expenses
  useEffect(() => {
    if (isLoading || !user) return;

    async function generateRecurringExpenses() {
      const today = new Date();
      const expensesToGenerate: Expense[] = [];
      const recurringToUpdate: { id: string; updates: Partial<RecurringExpense> }[] = [];

      for (const recurring of recurringExpenses) {
        if (!recurring.isActive) continue;

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
          expensesToGenerate.push({
            id: generateId(),
            amount: recurring.amount,
            category: recurring.category,
            subcategory: recurring.subcategory,
            description: `${recurring.description} (Auto)`,
            date: today.toISOString().split('T')[0],
            createdAt: today.toISOString(),
          });

          recurringToUpdate.push({
            id: recurring.id,
            updates: { lastGenerated: today.toISOString().split('T')[0] },
          });
        }
      }

      if (expensesToGenerate.length > 0 && user) {
        try {
          // Add all auto-generated expenses
          await Promise.all(
            expensesToGenerate.map(expense =>
              supabaseStorage.addExpense(user.id, expense)
            )
          );

          // Update recurring expenses with last generated date
          await Promise.all(
            recurringToUpdate.map(({ id, updates }) =>
              supabaseStorage.updateRecurringExpense(user.id, id, updates)
            )
          );

          // Reload data
          const [updatedExpenses, updatedRecurring] = await Promise.all([
            supabaseStorage.getExpenses(user.id),
            supabaseStorage.getRecurringExpenses(user.id),
          ]);

          setExpenses(updatedExpenses);
          setRecurringExpenses(updatedRecurring);
        } catch (error) {
          console.error('Error generating recurring expenses:', error);
        }
      }
    }

    generateRecurringExpenses();
  }, [recurringExpenses, isLoading, user]);

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

  const addExpense = async (expense: Expense) => {
    if (!user) {
      addToast('Please sign in to add expenses', 'error');
      return;
    }

    try {
      console.log('➕ Adding expense:', { user: user.email, expense });
      const added = await supabaseStorage.addExpense(user.id, expense);
      console.log('✅ Expense added successfully:', added);
      setExpenses((prev) => [added, ...prev]);
      addToast('Expense added successfully!', 'success', {
        label: 'Undo',
        onClick: async () => {
          try {
            await supabaseStorage.deleteExpense(user.id, added.id);
            setExpenses((prev) => prev.filter((e) => e.id !== added.id));
            addToast('Expense removed', 'info');
          } catch (error) {
            console.error('Error undoing add:', error);
            addToast('Failed to undo', 'error');
          }
        },
      });
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      console.error('Error details:', {
        message: (error as Error).message,
        code: (error as any).code,
        details: (error as any).details,
        hint: (error as any).hint,
        user: { id: user.id, email: user.email }
      });
      addToast('Failed to add expense', 'error');
    }
  };

  const updateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
    if (!user) {
      addToast('Please sign in to update expenses', 'error');
      return;
    }

    const originalExpense = expenses.find((e) => e.id === id);

    try {
      await supabaseStorage.updateExpense(user.id, id, updatedExpense);
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
      );

      if (originalExpense) {
        addToast('Expense updated successfully!', 'success', {
          label: 'Undo',
          onClick: async () => {
            try {
              await supabaseStorage.updateExpense(user.id, id, originalExpense);
              setExpenses((prev) =>
                prev.map((e) => (e.id === id ? originalExpense : e))
              );
              addToast('Update reverted', 'info');
            } catch (error) {
              console.error('Error undoing update:', error);
              addToast('Failed to undo', 'error');
            }
          },
        });
      } else {
        addToast('Expense updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      addToast('Failed to update expense', 'error');
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) {
      addToast('Please sign in to delete expenses', 'error');
      return;
    }

    const deletedExpense = expenses.find((e) => e.id === id);

    try {
      await supabaseStorage.deleteExpense(user.id, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));

      if (deletedExpense) {
        addToast('Expense deleted', 'info', {
          label: 'Undo',
          onClick: async () => {
            try {
              const restored = await supabaseStorage.addExpense(user.id, deletedExpense);
              setExpenses((prev) => [restored, ...prev]);
              addToast('Expense restored', 'success');
            } catch (error) {
              console.error('Error undoing delete:', error);
              addToast('Failed to undo', 'error');
            }
          },
        });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      addToast('Failed to delete expense', 'error');
    }
  };

  const addBudget = async (budget: Budget) => {
    if (!user) {
      addToast('Please sign in to set budgets', 'error');
      return;
    }

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      await supabaseStorage.saveBudget(user.id, {
        category: budget.category,
        amount: budget.limit,
        month: currentMonth,
        year: currentYear,
      });

      setBudgets((prev) => {
        const existing = prev.find((b) => b.category === budget.category);
        if (existing) {
          return prev.map((b) => (b.category === budget.category ? budget : b));
        }
        return [...prev, budget];
      });

      addToast('Budget saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving budget:', error);
      addToast('Failed to save budget', 'error');
    }
  };

  const deleteBudgetFunc = async (category: string) => {
    if (!user) {
      addToast('Please sign in to delete budgets', 'error');
      return;
    }

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Find the budget ID
      const allBudgets = await supabaseStorage.getBudgets(user.id);
      const budgetToDelete = allBudgets.find(
        (b) => b.category === category && b.month === currentMonth && b.year === currentYear
      );

      if (budgetToDelete && budgetToDelete.id) {
        await supabaseStorage.deleteBudget(user.id, budgetToDelete.id);
        setBudgets((prev) => prev.filter((b) => b.category !== category));
        addToast('Budget deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      addToast('Failed to delete budget', 'error');
    }
  };

  const addRecurring = async (recurring: RecurringExpense) => {
    if (!user) {
      addToast('Please sign in to add recurring expenses', 'error');
      return;
    }

    try {
      const added = await supabaseStorage.addRecurringExpense(user.id, recurring);
      setRecurringExpenses((prev) => [added, ...prev]);
      addToast('Recurring expense added successfully!', 'success');
    } catch (error) {
      console.error('Error adding recurring expense:', error);
      addToast('Failed to add recurring expense', 'error');
    }
  };

  const updateRecurring = async (id: string, updated: Partial<RecurringExpense>) => {
    if (!user) {
      addToast('Please sign in to update recurring expenses', 'error');
      return;
    }

    try {
      await supabaseStorage.updateRecurringExpense(user.id, id, updated);
      setRecurringExpenses((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
      );
      addToast('Recurring expense updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating recurring expense:', error);
      addToast('Failed to update recurring expense', 'error');
    }
  };

  const deleteRecurring = async (id: string) => {
    if (!user) {
      addToast('Please sign in to delete recurring expenses', 'error');
      return;
    }

    try {
      await supabaseStorage.deleteRecurringExpense(user.id, id);
      setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
      addToast('Recurring expense deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
      addToast('Failed to delete recurring expense', 'error');
    }
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
