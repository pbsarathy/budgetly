'use client';

import React, { useMemo } from 'react';
import { ExpenseCategory } from '@/types/expense';
import { useExpenses } from '@/contexts/ExpenseContext';

const CATEGORIES: (ExpenseCategory | 'All')[] = [
  'All',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Education',
  'Savings',
  'Other',
];

export default function ExpenseFilters() {
  const { filters, setFilters, expenses } = useExpenses();

  // Generate list of available months from expenses
  const availableMonths = useMemo(() => {
    if (expenses.length === 0) return [];

    const monthSet = new Set<string>();
    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthSet.add(monthKey);
    });

    return Array.from(monthSet).sort().reverse(); // Most recent first
  }, [expenses]);

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.startDate ||
    filters.endDate ||
    filters.searchTerm ||
    (filters.monthView && filters.monthView !== 'all');

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters({ category: 'All', searchTerm: '', monthView: 'all' })}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Month View Selector */}
      <div className="mb-4">
        <label htmlFor="month-view" className="block text-sm font-bold text-slate-700 mb-1.5">
          View By Month
        </label>
        <select
          id="month-view"
          value={filters.monthView || 'current'}
          onChange={(e) => setFilters({ ...filters, monthView: e.target.value })}
          className="w-full md:w-64 px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
        >
          <option value="all">All Time</option>
          <option value="current">Current Month</option>
          {availableMonths.map((month) => {
            const [year, monthNum] = month.split('-');
            const date = new Date(parseInt(year), parseInt(monthNum) - 1);
            const monthName = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
            return (
              <option key={month} value={month}>
                {monthName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-bold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category || 'All'}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value as ExpenseCategory | 'All' })
            }
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-bold text-slate-700 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={filters.startDate || ''}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="end-date" className="block text-sm font-bold text-slate-700 mb-1.5">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={filters.endDate || ''}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-bold text-slate-700 mb-1.5">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}
