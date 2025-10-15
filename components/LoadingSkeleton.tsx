'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-5 animate-pulse">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="bg-slate-200 w-9 h-9 sm:w-10 sm:h-10 rounded-lg"></div>
      </div>
      <div className="bg-slate-200 h-3 w-24 rounded mb-2"></div>
      <div className="bg-slate-200 h-6 w-32 rounded"></div>
    </div>
  );
}

export function ExpenseListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 animate-pulse">
        <div className="bg-slate-200 h-6 w-32 rounded"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-5 animate-pulse">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-slate-200 h-5 w-48 rounded mb-2"></div>
                <div className="bg-slate-200 h-4 w-24 rounded"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-200 h-6 w-20 rounded"></div>
                <div className="flex gap-1">
                  <div className="bg-slate-200 w-8 h-8 rounded-lg"></div>
                  <div className="bg-slate-200 w-8 h-8 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Category Breakdown Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 animate-pulse">
        <div className="bg-slate-200 h-6 w-48 rounded mb-5"></div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-200 w-6 h-6 rounded"></div>
                  <div className="bg-slate-200 h-4 w-24 rounded"></div>
                </div>
                <div className="bg-slate-200 h-4 w-20 rounded"></div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-200 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 animate-pulse">
            <div className="bg-slate-200 h-6 w-32 rounded mb-4"></div>
            <div className="bg-slate-200 h-64 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-700 mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium text-lg">Loading your expenses...</p>
      </div>
    </div>
  );
}
