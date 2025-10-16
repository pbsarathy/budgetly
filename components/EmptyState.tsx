'use client';

import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-6xl sm:text-7xl mb-4">{icon}</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm sm:text-base text-slate-600">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all font-medium shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
