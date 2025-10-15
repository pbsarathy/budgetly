'use client';

import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';
import EmptyState from './EmptyState';
import Modal from './Modal';

// Helper function to get week boundaries
function getWeekBoundaries(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of week (Saturday)
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// Helper function to format week range
function formatWeekRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-IN', options);
  const endStr = end.toLocaleDateString('en-IN', options);
  const year = start.getFullYear();
  return `${startStr} - ${endStr}, ${year}`;
}

// Helper function to get week label
function getWeekLabel(weekStart: Date, now: Date): string {
  const thisWeekStart = getWeekBoundaries(now).start;
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  if (weekStart.getTime() === thisWeekStart.getTime()) {
    return 'This Week';
  } else if (weekStart.getTime() === lastWeekStart.getTime()) {
    return 'Last Week';
  }
  return '';
}

interface GroupedExpenses {
  label: string;
  weekRange?: string;
  expenses: {
    category: ExpenseCategory;
    items: Expense[];
  }[];
}

export default function ExpenseList() {
  const { filteredExpenses, deleteExpense, expenses } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Smart grouping: current month by week, older months by month
  const groupedExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups: GroupedExpenses[] = [];
    const processedExpenses = new Set<string>();

    // Sort expenses by date (newest first)
    const sortedExpenses = [...filteredExpenses].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Group current month by weeks
    const currentMonthExpenses = sortedExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    if (currentMonthExpenses.length > 0) {
      // Find all unique weeks in current month
      const weekMap = new Map<string, Expense[]>();

      currentMonthExpenses.forEach(exp => {
        const expDate = new Date(exp.date);
        const { start } = getWeekBoundaries(expDate);
        const weekKey = start.toISOString();

        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, []);
        }
        weekMap.get(weekKey)!.push(exp);
        processedExpenses.add(exp.id);
      });

      // Convert weeks to groups
      Array.from(weekMap.entries())
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
        .forEach(([weekKey, weekExpenses]) => {
          const weekStart = new Date(weekKey);
          const { end } = getWeekBoundaries(weekStart);
          const weekLabel = getWeekLabel(weekStart, now);
          const weekRange = formatWeekRange(weekStart, end);

          // Group by category within week
          const categoryMap = new Map<ExpenseCategory, Expense[]>();
          weekExpenses.forEach(exp => {
            if (!categoryMap.has(exp.category)) {
              categoryMap.set(exp.category, []);
            }
            categoryMap.get(exp.category)!.push(exp);
          });

          groups.push({
            label: weekLabel || weekRange,
            weekRange: weekLabel ? weekRange : undefined,
            expenses: Array.from(categoryMap.entries()).map(([category, items]) => ({
              category,
              items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            }))
          });
        });
    }

    // Group older months by month
    const olderExpenses = sortedExpenses.filter(exp => !processedExpenses.has(exp.id));

    if (olderExpenses.length > 0) {
      const monthMap = new Map<string, Expense[]>();

      olderExpenses.forEach(exp => {
        const expDate = new Date(exp.date);
        const monthKey = `${expDate.getFullYear()}-${expDate.getMonth()}`;

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, []);
        }
        monthMap.get(monthKey)!.push(exp);
      });

      // Convert months to groups
      Array.from(monthMap.entries())
        .sort(([a], [b]) => {
          const [yearA, monthA] = a.split('-').map(Number);
          const [yearB, monthB] = b.split('-').map(Number);
          return (yearB * 12 + monthB) - (yearA * 12 + monthA);
        })
        .forEach(([monthKey, monthExpenses]) => {
          const [year, month] = monthKey.split('-').map(Number);
          const monthDate = new Date(year, month);
          const monthLabel = monthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

          // Group by category within month
          const categoryMap = new Map<ExpenseCategory, Expense[]>();
          monthExpenses.forEach(exp => {
            if (!categoryMap.has(exp.category)) {
              categoryMap.set(exp.category, []);
            }
            categoryMap.get(exp.category)!.push(exp);
          });

          groups.push({
            label: monthLabel,
            expenses: Array.from(categoryMap.entries()).map(([category, items]) => ({
              category,
              items: items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            }))
          });
        });
    }

    return groups;
  }, [filteredExpenses]);

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

      <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            Expenses ({filteredExpenses.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {groupedExpenses.map((group, groupIndex) => (
            <div key={groupIndex} className="p-6">
              {/* Group Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📅</span>
                  <span>{group.label}</span>
                </h3>
                {group.weekRange && (
                  <p className="text-sm text-slate-500 ml-7">{group.weekRange}</p>
                )}
              </div>

              {/* Categories within group */}
              <div className="space-y-4">
                {group.expenses.map((categoryGroup, catIndex) => (
                  <div key={catIndex}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-2 ml-7">
                      <span className="text-lg">{getCategoryIcon(categoryGroup.category)}</span>
                      <span className="font-semibold text-slate-700">{categoryGroup.category}</span>
                      <span className="text-xs text-slate-500">({categoryGroup.items.length})</span>
                    </div>

                    {/* Expenses in category */}
                    <div className="space-y-1 ml-7">
                      {categoryGroup.items.map((expense) => (
                        <div
                          key={expense.id}
                          className={`p-3 hover:bg-slate-50 transition-colors border-l-2 border-slate-200 ${
                            deletingId === expense.id ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                <h4 className="text-sm font-medium text-slate-900 truncate">
                                  {expense.description}
                                </h4>
                                {expense.subcategory && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium whitespace-nowrap">
                                    {expense.subcategory}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{formatDate(expense.date)}</p>
                            </div>

                            {/* Amount and Actions */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-base font-bold text-slate-900">
                                  {formatCurrency(expense.amount)}
                                </div>
                              </div>

                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(expense)}
                                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => handleDelete(expense.id)}
                                  disabled={deletingId === expense.id}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
