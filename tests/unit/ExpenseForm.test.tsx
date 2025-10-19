import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ExpenseForm from '@/components/ExpenseForm';
import { useExpenses } from '@/contexts/ExpenseContext';

// Mock the context
vi.mock('@/contexts/ExpenseContext', () => ({
  useExpenses: vi.fn(),
}));

describe('ExpenseForm', () => {
  const mockAddExpense = vi.fn();
  const mockUpdateExpense = vi.fn();
  const mockAddRecurringExpense = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    (useExpenses as any).mockReturnValue({
      addExpense: mockAddExpense,
      updateExpense: mockUpdateExpense,
      addRecurringExpense: mockAddRecurringExpense,
      expenses: [],
      filteredExpenses: [],
    });
  });

  describe('Rendering', () => {
    it('should render empty form fields by default', () => {
      render(<ExpenseForm />);

      expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
      expect(screen.getByLabelText(/category/i)).toHaveValue('Food');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/date/i)).toBeTruthy();
    });

    it('should render all required categories', () => {
      render(<ExpenseForm />);

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

    it('should show recurring expense checkbox', () => {
      render(<ExpenseForm />);

      const checkbox = screen.getByRole('checkbox', { name: /recurring expense/i });
      expect(checkbox).toBeTruthy();
      expect(checkbox).not.toBeChecked();
    });

    it('should show frequency selector when recurring is checked', async () => {
      render(<ExpenseForm />);

      const checkbox = screen.getByRole('checkbox', { name: /recurring expense/i });
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(screen.getByLabelText(/frequency/i)).toBeTruthy();
      });
    });
  });

  describe('Validation', () => {
    it('should show error for empty amount', async () => {
      render(<ExpenseForm />);

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid amount/i)).toBeTruthy();
      });
    });

    it('should show error for negative amount', async () => {
      render(<ExpenseForm />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '-100' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid amount/i)).toBeTruthy();
      });
    });

    it('should show error for empty description', async () => {
      render(<ExpenseForm />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a description/i)).toBeTruthy();
      });
    });

    it('should require bill type when Bills category selected', async () => {
      render(<ExpenseForm />);

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Bills' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/bill type/i)).toBeTruthy();
      });

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test bill' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please select a bill type/i)).toBeTruthy();
      });
    });

    it('should require investment type when Investments category selected', async () => {
      render(<ExpenseForm />);

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Investments' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/investment type/i)).toBeTruthy();
      });
    });

    it('should require custom category when Other is selected', async () => {
      render(<ExpenseForm />);

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Other' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/custom category/i)).toBeTruthy();
      });

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '100' } });

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a category name/i)).toBeTruthy();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call addExpense with correct data on submit', async () => {
      render(<ExpenseForm />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '500' } });

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Food' } });

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Lunch' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: 500,
            category: 'Food',
            description: 'Lunch',
          })
        );
      });
    });

    it('should reset form after successful submission', async () => {
      render(<ExpenseForm onCancel={mockOnCancel} />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '500' } });

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalled();
      });
    });

    it('should create recurring expense when checkbox is checked', async () => {
      render(<ExpenseForm />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '1000' } });

      const descriptionInput = screen.getByLabelText(/description/i);
      fireEvent.change(descriptionInput, { target: { value: 'Rent' } });

      const recurringCheckbox = screen.getByRole('checkbox', { name: /recurring expense/i });
      fireEvent.click(recurringCheckbox);

      await waitFor(() => {
        expect(screen.getByLabelText(/frequency/i)).toBeTruthy();
      });

      const submitButton = screen.getByRole('button', { name: /add expense/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddExpense).toHaveBeenCalled();
        expect(mockAddRecurringExpense).toHaveBeenCalled();
      });
    });
  });

  describe('Edit Mode', () => {
    const mockExpense = {
      id: 'test-id',
      amount: 750,
      category: 'Food' as const,
      description: 'Dinner',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
    };

    it('should pre-fill form fields in edit mode', () => {
      render(<ExpenseForm editingExpense={mockExpense} />);

      expect(screen.getByLabelText(/amount/i)).toHaveValue(750);
      expect(screen.getByLabelText(/category/i)).toHaveValue('Food');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Dinner');
      expect(screen.getByLabelText(/date/i)).toHaveValue('2024-01-15');
    });

    it('should call updateExpense instead of addExpense in edit mode', async () => {
      render(<ExpenseForm editingExpense={mockExpense} />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '800' } });

      const submitButton = screen.getByRole('button', { name: /update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateExpense).toHaveBeenCalledWith(
          'test-id',
          expect.objectContaining({
            amount: 800,
          })
        );
        expect(mockAddExpense).not.toHaveBeenCalled();
      });
    });

    it('should show Update button instead of Add Expense in edit mode', () => {
      render(<ExpenseForm editingExpense={mockExpense} />);

      expect(screen.getByRole('button', { name: /update/i })).toBeTruthy();
      expect(screen.queryByRole('button', { name: /add expense/i })).toBeFalsy();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(<ExpenseForm onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should reset form when cancel is clicked', () => {
      render(<ExpenseForm onCancel={mockOnCancel} />);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: '999' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Subcategory Handling', () => {
    it('should show bill subcategories for Bills category', async () => {
      render(<ExpenseForm />);

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Bills' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/bill type/i)).toBeTruthy();
      });
    });

    it('should show investment subcategories for Investments category', async () => {
      render(<ExpenseForm />);

      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Investments' } });

      await waitFor(() => {
        expect(screen.getByLabelText(/investment type/i)).toBeTruthy();
      });
    });

    it('should clear subcategory when category changes', async () => {
      render(<ExpenseForm />);

      // Select Bills and subcategory
      const categorySelect = screen.getByLabelText(/category/i);
      fireEvent.change(categorySelect, { target: { value: 'Bills' } });

      await waitFor(() => {
        const subcategorySelect = screen.getByLabelText(/bill type/i);
        fireEvent.change(subcategorySelect, { target: { value: 'Rent' } });
      });

      // Change to different category
      fireEvent.change(categorySelect, { target: { value: 'Food' } });

      // Subcategory should not be visible
      await waitFor(() => {
        expect(screen.queryByLabelText(/bill type/i)).toBeFalsy();
      });
    });
  });
});
