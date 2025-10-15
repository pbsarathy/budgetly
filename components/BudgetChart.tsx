'use client';

import React, { useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function BudgetChart() {
  const { budgets, expenses } = useExpenses();

  // Calculate current month spending per category
  const budgetData = useMemo(() => {
    if (budgets.length === 0) return [];

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return budgets.map((budget) => {
      const spent = expenses
        .filter((exp) => exp.category === budget.category && new Date(exp.date) >= monthStart)
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        category: budget.category,
        Budget: budget.limit,
        Spent: spent,
        Remaining: Math.max(0, budget.limit - spent),
      };
    });
  }, [budgets, expenses]);

  if (budgetData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Budget vs Spending</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={budgetData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="category"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            formatter={(value: number) => [`Rs ${value.toFixed(0)}`, '']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
          />
          <Legend />
          <Bar dataKey="Budget" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
