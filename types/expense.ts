export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Investments'
  | 'Daily Spends'
  | 'EMI'
  | 'Maintenance'
  | 'Other';

export type BillSubcategory =
  | 'Credit Card'
  | 'Internet'
  | 'Mobile'
  | 'Electricity'
  | 'Water'
  | 'Gas'
  | 'Rent'
  | 'Insurance'
  | 'Other Bills';

export type InvestmentSubcategory =
  | 'Savings'
  | 'Mutual Fund'
  | 'Stocks'
  | 'Jar'
  | 'Other';

export type DailySpendSubcategory =
  | 'Groceries'
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Snacks'
  | 'Others';

export type EMISubcategory =
  | 'Personal Loan'
  | 'Home Loan'
  | 'Vehicle Loan'
  | 'Education Loan'
  | 'Others';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  subcategory?: BillSubcategory | InvestmentSubcategory | DailySpendSubcategory | EMISubcategory; // Optional subcategory
  customSubcategory?: string; // For "Others" subcategory
  customCategory?: string; // For "Other" category
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
  subcategory?: BillSubcategory | InvestmentSubcategory | DailySpendSubcategory | EMISubcategory; // Optional subcategory
  customSubcategory?: string; // For "Others" subcategory
  customCategory?: string; // For "Other" category
  description: string;
  frequency: RecurringFrequency;
  startDate: string; // ISO date string
  lastGenerated?: string; // ISO date string of last auto-generated expense
  isActive: boolean;
}
