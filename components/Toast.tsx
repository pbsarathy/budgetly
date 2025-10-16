'use client';

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastComponentProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastComponent({ toast, onClose }: ToastComponentProps) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ⓘ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${getToastStyles()} px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md animate-in slide-in-from-right duration-300`}
    >
      <span className="text-xl font-bold flex-shrink-0">{getIcon()}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>

      {toast.action && (
        <button
          onClick={() => {
            toast.action?.onClick();
            onClose(toast.id);
          }}
          className="px-3 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
        >
          {toast.action.label}
        </button>
      )}

      <button
        onClick={() => onClose(toast.id)}
        className="text-white/80 hover:text-white text-xl leading-none flex-shrink-0"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
