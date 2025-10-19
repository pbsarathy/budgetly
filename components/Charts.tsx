'use client';

import React, { useMemo } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ExpenseCategory } from '@/types/expense';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Education: '#6366f1',
  Investments: '#10b981',
  'Daily Spends': '#eab308',
  EMI: '#f43f5e',
  Maintenance: '#06b6d4',
  Other: '#64748b',
};

export default function Charts() {
  const { expenses } = useExpenses();

  // Prepare data for pie chart (category breakdown)
  const pieData = useMemo(() => {
    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Education: 0,
      Investments: 0,
      'Daily Spends': 0,
      EMI: 0,
      Maintenance: 0,
      Other: 0,
    };

    expenses.forEach((exp) => {
      categoryTotals[exp.category] += exp.amount;
    });

    return Object.entries(categoryTotals)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name as ExpenseCategory],
      }));
  }, [expenses]);

  // Prepare data for line chart (spending over time - last 30 days)
  const lineData = useMemo(() => {
    const last30Days: Record<string, number> = {};
    const today = new Date();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days[dateStr] = 0;
    }

    // Sum expenses by date
    expenses.forEach((exp) => {
      if (last30Days.hasOwnProperty(exp.date)) {
        last30Days[exp.date] += exp.amount;
      }
    });

    return Object.entries(last30Days).map(([date, amount]) => {
      const d = new Date(date);
      return {
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        amount,
      };
    });
  }, [expenses]);

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Category Breakdown */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-6">
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(props: Record<string, unknown>) => {
                  const percent = ((props.percent as number) * 100).toFixed(0);
                  return `${props.name}: ${percent}%`;
                }}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toFixed(0)}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-center py-12">No data available</p>
        )}
      </div>

      {/* Line Chart - Spending Trend */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Spending Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `Rs ${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`Rs ${value.toFixed(0)}`, 'Amount']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
