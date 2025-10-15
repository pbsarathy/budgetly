export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Savings'
  | 'Other';

export type BillSubcategory =
  | 'EMI'
  | 'Credit Card'
  | 'Internet'
  | 'Mobile'
  | 'Electricity'
  | 'Water'
  | 'Gas'
  | 'Rent'
  | 'Insurance'
  | 'Other Bills';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: BillSubcategory; // Optional subcategory for Bills
  description: string;
  date: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'All';
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  monthView?: string; // Format: 'YYYY-MM' or 'all' or 'current'
}

export interface ExpenseStats {
  totalSpending: number;
  monthlySpending: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategory: ExpenseCategory | null;
  expenseCount: number;
  averageExpense: number;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
  period: 'monthly'; // Can be extended to 'weekly' | 'yearly' later
}

export interface OverallBudget {
  limit: number;
  period: 'monthly';
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringExpense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  frequency: RecurringFrequency;
  startDate: string; // ISO date string
  lastGenerated?: string; // ISO date string of last auto-generated expense
  isActive: boolean;
}
