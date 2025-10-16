// Data migration utility - localStorage to Supabase
import { expenseStorage, budgetStorage, recurringStorage } from './expenseStorage';
import * as supabaseStorage from './supabaseStorage';

export interface MigrationResult {
  success: boolean;
  expenseCount: number;
  budgetCount: number;
  recurringCount: number;
  errors: string[];
}

export async function migrateLocalStorageToSupabase(userId: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    expenseCount: 0,
    budgetCount: 0,
    recurringCount: 0,
    errors: [],
  };

  try {
    // 1. Load data from localStorage
    const localExpenses = expenseStorage.getAll();
    const localBudgets = budgetStorage.getAll();
    const localRecurring = recurringStorage.getAll();

    console.log('[Migration] Found local data:', {
      expenses: localExpenses.length,
      budgets: localBudgets.length,
      recurring: localRecurring.length,
    });

    // 2. Migrate expenses
    if (localExpenses.length > 0) {
      for (const expense of localExpenses) {
        try {
          await supabaseStorage.addExpense(userId, expense);
          result.expenseCount++;
        } catch (error) {
          console.error('Error migrating expense:', error);
          result.errors.push(`Failed to migrate expense: ${expense.description}`);
        }
      }
    }

    // 3. Migrate budgets
    if (localBudgets.length > 0) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      for (const budget of localBudgets) {
        try {
          await supabaseStorage.saveBudget(userId, {
            category: budget.category,
            amount: budget.limit,
            month: currentMonth,
            year: currentYear,
          });
          result.budgetCount++;
        } catch (error) {
          console.error('Error migrating budget:', error);
          result.errors.push(`Failed to migrate budget for ${budget.category}`);
        }
      }
    }

    // 4. Migrate recurring expenses
    if (localRecurring.length > 0) {
      for (const recurring of localRecurring) {
        try {
          await supabaseStorage.addRecurringExpense(userId, recurring);
          result.recurringCount++;
        } catch (error) {
          console.error('Error migrating recurring expense:', error);
          result.errors.push(`Failed to migrate recurring: ${recurring.description}`);
        }
      }
    }

    result.success = result.errors.length === 0;

    console.log('[Migration] Complete:', result);

    return result;
  } catch (error) {
    console.error('Migration error:', error);
    result.errors.push('Fatal migration error occurred');
    return result;
  }
}

export function hasLocalStorageData(): boolean {
  const expenses = expenseStorage.getAll();
  const budgets = budgetStorage.getAll();
  const recurring = recurringStorage.getAll();

  return expenses.length > 0 || budgets.length > 0 || recurring.length > 0;
}

export function clearLocalStorageData(): void {
  localStorage.removeItem('expense-tracker-data');
  localStorage.removeItem('expense-tracker-budgets');
  localStorage.removeItem('expense-tracker-recurring');
  localStorage.removeItem('expense-tracker-overall-budget');
  console.log('[Migration] Local storage cleared');
}
