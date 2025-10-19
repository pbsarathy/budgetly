import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastComponent, ToastContainer } from '@/components/Toast';
import type { Toast } from '@/components/Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ToastComponent', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
      mockOnClose.mockClear();
    });

    it('should render toast message', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Test message',
        type: 'success',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(screen.getByText('Test message')).toBeTruthy();
    });

    it('should display success icon for success toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Success',
        type: 'success',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('should display error icon for error toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Error',
        type: 'error',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(screen.getByText('✕')).toBeTruthy();
    });

    it('should display info icon for info toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Info',
        type: 'info',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(screen.getByText('ⓘ')).toBeTruthy();
    });

    it('should auto-dismiss after default duration (5 seconds)', async () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Auto dismiss',
        type: 'success',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledWith('test-1');
      });
    });

    it('should auto-dismiss after custom duration', async () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Custom duration',
        type: 'success',
        duration: 3000,
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      // Fast-forward 3 seconds
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledWith('test-1');
      });
    });

    it('should call onClose when close button is clicked', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Closeable',
        type: 'success',
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('test-1');
    });

    it('should render action button when action is provided', () => {
      const mockAction = vi.fn();
      const toast: Toast = {
        id: 'test-1',
        message: 'With action',
        type: 'info',
        action: {
          label: 'Undo',
          onClick: mockAction,
        },
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /undo/i })).toBeTruthy();
    });

    it('should call action onClick when action button is clicked', () => {
      const mockAction = vi.fn();
      const toast: Toast = {
        id: 'test-1',
        message: 'With action',
        type: 'info',
        action: {
          label: 'Undo',
          onClick: mockAction,
        },
      };

      render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const actionButton = screen.getByRole('button', { name: /undo/i });
      fireEvent.click(actionButton);

      expect(mockAction).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalledWith('test-1');
    });

    it('should apply correct background color for success toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Success',
        type: 'success',
      };

      const { container } = render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const toastElement = container.querySelector('[class*="bg-green"]');
      expect(toastElement).toBeTruthy();
    });

    it('should apply correct background color for error toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Error',
        type: 'error',
      };

      const { container } = render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const toastElement = container.querySelector('[class*="bg-red"]');
      expect(toastElement).toBeTruthy();
    });

    it('should apply correct background color for info toast', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Info',
        type: 'info',
      };

      const { container } = render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      const toastElement = container.querySelector('[class*="gradient"]');
      expect(toastElement).toBeTruthy();
    });
  });

  describe('ToastContainer', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
      mockOnClose.mockClear();
    });

    it('should render nothing when toasts array is empty', () => {
      const { container } = render(<ToastContainer toasts={[]} onClose={mockOnClose} />);

      expect(container.firstChild).toBeFalsy();
    });

    it('should render multiple toasts', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'First toast', type: 'success' },
        { id: '2', message: 'Second toast', type: 'error' },
        { id: '3', message: 'Third toast', type: 'info' },
      ];

      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      expect(screen.getByText('First toast')).toBeTruthy();
      expect(screen.getByText('Second toast')).toBeTruthy();
      expect(screen.getByText('Third toast')).toBeTruthy();
    });

    it('should stack toasts vertically', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'Toast 1', type: 'success' },
        { id: '2', message: 'Toast 2', type: 'success' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const flexContainer = container.querySelector('[class*="flex-col"]');
      expect(flexContainer).toBeTruthy();
    });

    it('should position container at bottom-right', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'Test', type: 'success' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const positionedContainer = container.querySelector('[class*="bottom"][class*="right"]');
      expect(positionedContainer).toBeTruthy();
    });

    it('should have fixed positioning', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'Test', type: 'success' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const fixedContainer = container.querySelector('[class*="fixed"]');
      expect(fixedContainer).toBeTruthy();
    });

    it('should have high z-index for layering', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'Test', type: 'success' },
      ];

      const { container } = render(<ToastContainer toasts={toasts} onClose={mockOnClose} />);

      const zIndexContainer = container.querySelector('[class*="z-50"]');
      expect(zIndexContainer).toBeTruthy();
    });
  });

  describe('Toast Lifecycle', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
      mockOnClose.mockClear();
    });

    it('should clear timer on unmount', () => {
      const toast: Toast = {
        id: 'test-1',
        message: 'Test',
        type: 'success',
      };

      const { unmount } = render(<ToastComponent toast={toast} onClose={mockOnClose} />);

      unmount();

      // Advance time after unmount
      vi.advanceTimersByTime(5000);

      // onClose should not be called after unmount
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should reset timer when toast changes', async () => {
      const toast1: Toast = {
        id: 'test-1',
        message: 'First',
        type: 'success',
        duration: 3000,
      };

      const { rerender } = render(<ToastComponent toast={toast1} onClose={mockOnClose} />);

      // Advance 2 seconds
      vi.advanceTimersByTime(2000);

      // Change toast
      const toast2: Toast = {
        id: 'test-2',
        message: 'Second',
        type: 'success',
        duration: 3000,
      };

      rerender(<ToastComponent toast={toast2} onClose={mockOnClose} />);

      // Advance another 2 seconds (total 4 seconds from first toast)
      vi.advanceTimersByTime(2000);

      // First toast shouldn't have closed yet because timer was reset
      expect(mockOnClose).not.toHaveBeenCalledWith('test-1');

      // Advance remaining time for second toast
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledWith('test-2');
      });
    });
  });
});
