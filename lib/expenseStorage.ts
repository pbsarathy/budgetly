import { Expense, Budget, RecurringExpense, OverallBudget } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';
const BUDGET_KEY = 'expense-tracker-budgets';
const OVERALL_BUDGET_KEY = 'expense-tracker-overall-budget';
const RECURRING_KEY = 'expense-tracker-recurring';

export const expenseStorage = {
  getAll: (): Expense[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  save: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  add: (expense: Expense): Expense[] => {
    const expenses = expenseStorage.getAll();
    const newExpenses = [...expenses, expense];
    expenseStorage.save(newExpenses);
    return newExpenses;
  },

  update: (id: string, updatedExpense: Partial<Expense>): Expense[] => {
    const expenses = expenseStorage.getAll();
    const newExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    );
    expenseStorage.save(newExpenses);
    return newExpenses;
  },

  delete: (id: string): Expense[] => {
    const expenses = expenseStorage.getAll();
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    expenseStorage.save(newExpenses);
    return newExpenses;
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};

export const budgetStorage = {
  getAll: (): Budget[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(BUDGET_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading budgets from localStorage:', error);
      return [];
    }
  },

  save: (budgets: Budget[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets to localStorage:', error);
    }
  },

  setBudget: (budget: Budget): Budget[] => {
    const budgets = budgetStorage.getAll();
    const existingIndex = budgets.findIndex((b) => b.category === budget.category);

    let newBudgets;
    if (existingIndex >= 0) {
      newBudgets = [...budgets];
      newBudgets[existingIndex] = budget;
    } else {
      newBudgets = [...budgets, budget];
    }

    budgetStorage.save(newBudgets);
    return newBudgets;
  },

  delete: (category: string): Budget[] => {
    const budgets = budgetStorage.getAll();
    const newBudgets = budgets.filter((b) => b.category !== category);
    budgetStorage.save(newBudgets);
    return newBudgets;
  },
};

export const overallBudgetStorage = {
  get: (): OverallBudget | null => {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(OVERALL_BUDGET_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading overall budget from localStorage:', error);
      return null;
    }
  },

  save: (budget: OverallBudget): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(OVERALL_BUDGET_KEY, JSON.stringify(budget));
    } catch (error) {
      console.error('Error saving overall budget to localStorage:', error);
    }
  },

  delete: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(OVERALL_BUDGET_KEY);
  },
};

export const recurringStorage = {
  getAll: (): RecurringExpense[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(RECURRING_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading recurring expenses from localStorage:', error);
      return [];
    }
  },

  save: (recurring: RecurringExpense[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(RECURRING_KEY, JSON.stringify(recurring));
    } catch (error) {
      console.error('Error saving recurring expenses to localStorage:', error);
    }
  },

  add: (recurring: RecurringExpense): RecurringExpense[] => {
    const allRecurring = recurringStorage.getAll();
    const newRecurring = [...allRecurring, recurring];
    recurringStorage.save(newRecurring);
    return newRecurring;
  },

  update: (id: string, updated: Partial<RecurringExpense>): RecurringExpense[] => {
    const allRecurring = recurringStorage.getAll();
    const newRecurring = allRecurring.map((r) =>
      r.id === id ? { ...r, ...updated } : r
    );
    recurringStorage.save(newRecurring);
    return newRecurring;
  },

  delete: (id: string): RecurringExpense[] => {
    const allRecurring = recurringStorage.getAll();
    const newRecurring = allRecurring.filter((r) => r.id !== id);
    recurringStorage.save(newRecurring);
    return newRecurring;
  },
};
