/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
// Supabase database operations - replaces localStorage
import { supabase } from './supabase';
import type { Expense, RecurringExpense, ExpenseCategory } from '@/types/expense';

// Internal types for Supabase operations
interface CategoryBudget {
  id?: string;
  category: ExpenseCategory;
  amount: number;
  month: number;
  year: number;
}

interface OverallBudget {
  amount: number;
  month: number;
  year: number;
}

// ============================================
// EXPENSES
// ============================================

export async function getExpenses(userId: string): Promise<Expense[]> {
  const { data, error }: any = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((row: any): Expense => ({
    id: row.id,
    amount: parseFloat(row.amount.toString()),
    category: row.category,
    subcategory: row.subcategory || undefined,
    description: row.description,
    date: row.date,
    createdAt: row.created_at,
  }));
}

export async function addExpense(userId: string, expense: Omit<Expense, 'id'>): Promise<Expense> {
  const { data, error }: any = await supabase
    .from('expenses')
    // @ts-ignore Supabase types not fully configured
    // @ts-ignore
    .insert({
      user_id: userId,
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory || null,
      description: expense.description,
      date: expense.date,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding expense:', error);
    throw error;
  }

  const row = data as any;
  return {
    id: row.id,
    amount: parseFloat(row.amount.toString()),
    category: row.category,
    subcategory: row.subcategory || undefined,
    description: row.description,
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function updateExpense(userId: string, id: string, updates: Partial<Expense>): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    // @ts-ignore
    .update({
      amount: updates.amount,
      category: updates.category,
      subcategory: updates.subcategory || null,
      description: updates.description,
      date: updates.date,
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

export async function deleteExpense(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

// ============================================
// BUDGETS
// ============================================

export async function getBudgets(userId: string): Promise<CategoryBudget[]> {
  const { data, error }: any = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching budgets:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((row: any): CategoryBudget => ({
    id: row.id,
    category: row.category as CategoryBudget['category'],
    amount: parseFloat(row.amount.toString()),
    month: row.month,
    year: row.year,
  }));
}

export async function saveBudget(userId: string, budget: Omit<CategoryBudget, 'id'>): Promise<CategoryBudget> {
  // Check if budget already exists for this category/month/year
  const { data: existing }: any = await supabase
    .from('budgets')
    .select('id')
    .eq('user_id', userId)
    .eq('category', budget.category)
    .eq('month', budget.month)
    .eq('year', budget.year)
    .single() as { data: any };

  if (existing) {
    // Update existing budget
    const { data, error }: any = await supabase
      .from('budgets')
      // @ts-ignore
    .update({ amount: budget.amount })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error);
      throw error;
    }

    return {
      id: data.id,
      category: data.category as CategoryBudget['category'],
      amount: parseFloat(data.amount.toString()),
      month: data.month,
      year: data.year,
    };
  } else {
    // Insert new budget
    const { data, error }: any = await supabase
      .from('budgets')
      // @ts-ignore
    .insert({
        user_id: userId,
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating budget:', error);
      throw error;
    }

    return {
      id: data.id,
      category: data.category as CategoryBudget['category'],
      amount: parseFloat(data.amount.toString()),
      month: data.month,
      year: data.year,
    };
  }
}

export async function deleteBudget(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
}

// ============================================
// OVERALL BUDGET
// ============================================

export async function getOverallBudget(userId: string): Promise<OverallBudget | null> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data, error }: any = await supabase
    .from('overall_budgets')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - budget doesn't exist
      return null;
    }
    console.error('Error fetching overall budget:', error);
    throw error;
  }

  return {
    amount: parseFloat(data.amount.toString()),
    month: data.month,
    year: data.year,
  };
}

export async function saveOverallBudget(userId: string, budget: OverallBudget): Promise<void> {
  // Check if budget exists
  const { data: existing }: any = await supabase
    .from('overall_budgets')
    .select('id')
    .eq('user_id', userId)
    .eq('month', budget.month)
    .eq('year', budget.year)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('overall_budgets')
      // @ts-ignore
    .update({ amount: budget.amount })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating overall budget:', error);
      throw error;
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('overall_budgets')
      // @ts-ignore
    .insert({
        user_id: userId,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
      });

    if (error) {
      console.error('Error creating overall budget:', error);
      throw error;
    }
  }
}

// ============================================
// RECURRING EXPENSES
// ============================================

export async function getRecurringExpenses(userId: string): Promise<RecurringExpense[]> {
  const { data, error }: any = await supabase
    .from('recurring_expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recurring expenses:', error);
    throw error;
  }

  return (data || []).map((row: any): RecurringExpense => ({
    id: row.id,
    amount: parseFloat(row.amount.toString()),
    category: row.category as RecurringExpense['category'],
    subcategory: row.subcategory || undefined,
    description: row.description,
    frequency: row.frequency as RecurringExpense['frequency'],
    startDate: row.start_date,
    lastGenerated: row.last_generated || undefined,
    isActive: row.is_active,
  }));
}

export async function addRecurringExpense(
  userId: string,
  expense: Omit<RecurringExpense, 'id'>
): Promise<RecurringExpense> {
  const { data, error }: any = await supabase
    .from('recurring_expenses')
    // @ts-ignore
    .insert({
      user_id: userId,
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory || null,
      description: expense.description,
      frequency: expense.frequency,
      start_date: expense.startDate,
      last_generated: expense.lastGenerated || null,
      is_active: expense.isActive,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding recurring expense:', error);
    throw error;
  }

  return {
    id: data.id,
    amount: parseFloat(data.amount.toString()),
    category: data.category as RecurringExpense['category'],
    subcategory: data.subcategory || undefined,
    description: data.description,
    frequency: data.frequency as RecurringExpense['frequency'],
    startDate: data.start_date,
    lastGenerated: data.last_generated || undefined,
    isActive: data.is_active,
  };
}

export async function updateRecurringExpense(
  userId: string,
  id: string,
  updates: Partial<RecurringExpense>
): Promise<void> {
  const updateData: Record<string, unknown> = {};

  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory || null;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.frequency !== undefined) updateData.frequency = updates.frequency;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.lastGenerated !== undefined) updateData.last_generated = updates.lastGenerated || null;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  const { error } = await supabase
    .from('recurring_expenses')
    // @ts-ignore
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating recurring expense:', error);
    throw error;
  }
}

export async function deleteRecurringExpense(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('recurring_expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting recurring expense:', error);
    throw error;
  }
}

// ============================================
// USER PROFILE
// ============================================

export async function getUserProfile(userId: string) {
  const { data, error }: any = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
}

export async function updateUserCurrency(userId: string, currency: string): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    // @ts-ignore
    .update({ currency })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user currency:', error);
    throw error;
  }
}
