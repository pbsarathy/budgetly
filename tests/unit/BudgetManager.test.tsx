import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import BudgetManager from '@/components/BudgetManager';
import { useExpenses } from '@/contexts/ExpenseContext';

// Mock the context
vi.mock('@/contexts/ExpenseContext', () => ({
  useExpenses: vi.fn(),
}));

// Mock the overall budget storage
vi.mock('@/lib/expenseStorage', () => ({
  overallBudgetStorage: {
    get: vi.fn(() => null),
    save: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('BudgetManager', () => {
  const mockSetBudget = vi.fn();
  const mockDeleteBudget = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    (useExpenses as any).mockReturnValue({
      budgets: [],
      setBudget: mockSetBudget,
      deleteBudget: mockDeleteBudget,
      expenses: [],
    });
  });

  describe('Rendering', () => {
    it('should render budget manager header', () => {
      render(<BudgetManager />);

      expect(screen.getByText(/budget manager/i)).toBeTruthy();
    });

    it('should show Set Overall Budget button', () => {
      render(<BudgetManager />);

      expect(screen.getByRole('button', { name: /set overall budget/i })).toBeTruthy();
    });

    it('should show Set Category Budget button', () => {
      render(<BudgetManager />);

      expect(screen.getByRole('button', { name: /set category budget/i })).toBeTruthy();
    });

    it('should show empty state when no budgets exist', () => {
      render(<BudgetManager />);

      expect(screen.getByText(/no category budgets set yet/i)).toBeTruthy();
    });

    it('should display existing budgets', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
          { category: 'Transportation', limit: 5000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [],
      });

      render(<BudgetManager />);

      expect(screen.getByText(/food/i)).toBeTruthy();
      expect(screen.getByText(/transportation/i)).toBeTruthy();
    });
  });

  describe('Overall Budget Form', () => {
    it('should show overall budget form when button clicked', async () => {
      render(<BudgetManager />);

      const button = screen.getByRole('button', { name: /set overall budget/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByLabelText(/total monthly budget/i)).toBeTruthy();
      });
    });

    it('should hide form when Cancel is clicked', async () => {
      render(<BudgetManager />);

      const setButton = screen.getByRole('button', { name: /set overall budget/i });
      fireEvent.click(setButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/total monthly budget/i)).toBeTruthy();
      });

      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0];
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByLabelText(/total monthly budget/i)).toBeFalsy();
      });
    });

    it('should validate overall budget amount', async () => {
      render(<BudgetManager />);

      const setButton = screen.getByRole('button', { name: /set overall budget/i });
      fireEvent.click(setButton);

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /save overall budget/i });
        fireEvent.click(saveButton);
      });

      // Should show validation error (browser validation or custom)
      const input = screen.getByLabelText(/total monthly budget/i);
      expect(input).toHaveAttribute('required');
    });
  });

  describe('Category Budget Form', () => {
    it('should show category budget form when button clicked', async () => {
      render(<BudgetManager />);

      const button = screen.getByRole('button', { name: /set category budget/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByLabelText(/category/i)).toBeTruthy();
        expect(screen.getByLabelText(/monthly budget/i)).toBeTruthy();
      });
    });

    it('should have all categories in dropdown', async () => {
      render(<BudgetManager />);

      const button = screen.getByRole('button', { name: /set category budget/i });
      fireEvent.click(button);

      await waitFor(() => {
        const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
        const options = Array.from(categorySelect.options).map((opt) => opt.value);

        expect(options).toContain('Food');
        expect(options).toContain('Transportation');
        expect(options).toContain('Entertainment');
        expect(options).toContain('Shopping');
        expect(options).toContain('Bills');
        expect(options).toContain('Education');
        expect(options).toContain('Investments');
        expect(options).toContain('Other');
      });
    });

    it('should call setBudget on form submission', async () => {
      render(<BudgetManager />);

      const button = screen.getByRole('button', { name: /set category budget/i });
      fireEvent.click(button);

      await waitFor(() => {
        const categorySelect = screen.getByLabelText(/category/i);
        fireEvent.change(categorySelect, { target: { value: 'Food' } });

        const amountInput = screen.getByLabelText(/monthly budget/i);
        fireEvent.change(amountInput, { target: { value: '10000' } });

        const saveButton = screen.getByRole('button', { name: /save category budget/i });
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(mockSetBudget).toHaveBeenCalledWith({
          category: 'Food',
          limit: 10000,
          period: 'monthly',
        });
      });
    });

    it('CRITICAL: should close form when cancel is clicked after warning', async () => {
      /**
       * This test verifies the fix for the bug where:
       * - User sets category budget exceeding overall budget
       * - Clicks Cancel on the warning dialog
       * - Form should close but it stays open (BUG)
       */

      // Setup with overall budget
      const { overallBudgetStorage } = await import('@/lib/expenseStorage');
      (overallBudgetStorage.get as any).mockReturnValue({ limit: 50000, period: 'monthly' });

      render(<BudgetManager />);

      // Open category budget form
      const button = screen.getByRole('button', { name: /set category budget/i });
      fireEvent.click(button);

      await waitFor(async () => {
        const amountInput = screen.getByLabelText(/monthly budget/i);
        fireEvent.change(amountInput, { target: { value: '60000' } });

        // Mock window.confirm to return false (Cancel)
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

        const saveButton = screen.getByRole('button', { name: /save category budget/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          // Verify confirm was called
          expect(confirmSpy).toHaveBeenCalled();
        });

        confirmSpy.mockRestore();
      });

      // After cancel, form should be closed
      await waitFor(() => {
        expect(screen.queryByLabelText(/monthly budget/i)).toBeFalsy();
      });
    });
  });

  describe('Budget Display', () => {
    it('should show progress bar for each budget', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [
          {
            id: '1',
            amount: 5000,
            category: 'Food',
            description: 'Groceries',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const { container } = render(<BudgetManager />);

      // Should have progress bar
      const progressBar = container.querySelector('[class*="progress"]');
      expect(progressBar).toBeTruthy();
    });

    it('should show green progress when under budget', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [
          {
            id: '1',
            amount: 3000,
            category: 'Food',
            description: 'Groceries',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const { container } = render(<BudgetManager />);

      const greenProgress = container.querySelector('[class*="bg-green"]');
      expect(greenProgress).toBeTruthy();
    });

    it('should show yellow warning when approaching limit (80%+)', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [
          {
            id: '1',
            amount: 8500,
            category: 'Food',
            description: 'Groceries',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const { container } = render(<BudgetManager />);

      const yellowProgress = container.querySelector('[class*="bg-yellow"]');
      expect(yellowProgress).toBeTruthy();
    });

    it('should show red warning when over budget', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [
          {
            id: '1',
            amount: 12000,
            category: 'Food',
            description: 'Groceries',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const { container } = render(<BudgetManager />);

      const redProgress = container.querySelector('[class*="bg-red"]');
      expect(redProgress).toBeTruthy();
    });

    it('should show over budget message', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [
          {
            id: '1',
            amount: 12000,
            category: 'Food',
            description: 'Groceries',
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
          },
        ],
      });

      render(<BudgetManager />);

      expect(screen.getByText(/over.*budget/i)).toBeTruthy();
    });
  });

  describe('Budget Deletion', () => {
    it('should show delete button for each budget', () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [],
      });

      const { container } = render(<BudgetManager />);

      const deleteButton = container.querySelector('button[title*="delete"]');
      expect(deleteButton).toBeTruthy();
    });

    it('should call deleteBudget when delete is clicked', async () => {
      (useExpenses as any).mockReturnValue({
        budgets: [
          { category: 'Food', limit: 10000, period: 'monthly' },
        ],
        setBudget: mockSetBudget,
        deleteBudget: mockDeleteBudget,
        expenses: [],
      });

      const { container } = render(<BudgetManager />);

      const deleteButton = container.querySelector('button[title*="delete"]');
      expect(deleteButton).toBeTruthy();

      if (deleteButton) {
        fireEvent.click(deleteButton);

        await waitFor(() => {
          expect(mockDeleteBudget).toHaveBeenCalledWith('Food');
        });
      }
    });
  });

  describe('Overall Budget Warning', () => {
    it('should warn when category budget exceeds overall budget', async () => {
      const { overallBudgetStorage } = await import('@/lib/expenseStorage');
      (overallBudgetStorage.get as any).mockReturnValue({ limit: 50000, period: 'monthly' });

      render(<BudgetManager />);

      const button = screen.getByRole('button', { name: /set category budget/i });
      fireEvent.click(button);

      await waitFor(async () => {
        const amountInput = screen.getByLabelText(/monthly budget/i);
        fireEvent.change(amountInput, { target: { value: '60000' } });

        const confirmSpy = vi.spyOn(window, 'confirm');

        const saveButton = screen.getByRole('button', { name: /save category budget/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
          expect(confirmSpy).toHaveBeenCalled();
          const confirmMessage = confirmSpy.mock.calls[0][0];
          expect(confirmMessage).toMatch(/exceed.*overall budget/i);
        });

        confirmSpy.mockRestore();
      });
    });
  });
});
