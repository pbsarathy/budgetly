import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock user for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

// Custom render function that includes all providers
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <AuthProvider>
      <ExpenseProvider>{children}</ExpenseProvider>
    </AuthProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper to wait for async operations
export const waitForLoadingToFinish = async () => {
  const { findByText } = await import('@testing-library/react');
  // Wait for any loading states to finish
  await new Promise((resolve) => setTimeout(resolve, 100));
};

// Helper to create mock expenses
export const createMockExpense = (overrides = {}) => ({
  id: `expense-${Math.random().toString(36).substr(2, 9)}`,
  amount: 100,
  category: 'Food' as const,
  description: 'Test expense',
  date: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Helper to create mock budgets
export const createMockBudget = (overrides = {}) => ({
  category: 'Food' as const,
  limit: 5000,
  period: 'monthly' as const,
  ...overrides,
});

// Helper to create mock recurring expenses
export const createMockRecurringExpense = (overrides = {}) => ({
  id: `recurring-${Math.random().toString(36).substr(2, 9)}`,
  amount: 100,
  category: 'Bills' as const,
  subcategory: 'Rent' as const,
  description: 'Test recurring expense',
  frequency: 'monthly' as const,
  startDate: new Date().toISOString().split('T')[0],
  isActive: true,
  ...overrides,
});
