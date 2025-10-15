'use client';

import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';
import EmptyState from './EmptyState';
import Modal from './Modal';

export default function ExpenseList() {
  const { filteredExpenses, deleteExpense, expenses } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setDeletingId(id);
      setTimeout(() => {
        deleteExpense(id);
        setDeletingId(null);
      }, 200);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  if (filteredExpenses.length === 0) {
    // Check if there are any expenses at all
    const hasExpenses = expenses.length > 0;

    return (
      <EmptyState
        icon={hasExpenses ? '🔍' : '💳'}
        title={hasExpenses ? 'No expenses match your filters' : 'No expenses yet'}
        description={
          hasExpenses
            ? 'Try adjusting your filters to see more expenses'
            : 'Start tracking your finances by adding your first expense'
        }
        action={
          hasExpenses
            ? undefined
            : {
                label: 'Add Your First Expense',
                onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              }
        }
      />
    );
  }

  return (
    <>
      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={handleCancelEdit}
        title="Edit Expense"
      >
        <ExpenseForm editingExpense={editingExpense || undefined} onCancel={handleCancelEdit} />
      </Modal>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">
          Expenses ({filteredExpenses.length})
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredExpenses.map((expense) => (
          <div
            key={expense.id}
            className={`p-5 hover:bg-slate-50 transition-colors ${
              deletingId === expense.id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-5">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                  {getCategoryIcon(expense.category)}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-slate-900 truncate">
                    {expense.description}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded whitespace-nowrap">
                    {expense.category}
                  </span>
                  {expense.subcategory && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                      {expense.subcategory}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{formatDate(expense.date)}</p>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
