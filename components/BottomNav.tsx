'use client';

import React from 'react';

type TabType = 'dashboard' | 'expenses' | 'budgets' | 'recurring' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const NAV_ITEMS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '📊' },
  { id: 'expenses', label: 'Expenses', icon: '💳' },
  { id: 'budgets', label: 'Budgets', icon: '💰' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <>
      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200/50 z-40 md:hidden shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 min-w-[70px] py-2 px-3
                  transition-all duration-300 transform
                  ${isActive
                    ? 'scale-110'
                    : 'scale-100 hover:scale-105 active:scale-95'
                  }
                `}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <span
                  className={`text-2xl transition-all duration-300 filter
                    ${isActive
                      ? 'drop-shadow-lg scale-110'
                      : 'opacity-70 grayscale-[50%]'
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className={`text-[10px] font-semibold transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? 'text-[var(--color-primary-accent)] font-bold'
                      : 'text-slate-600'
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1
                               bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-primary-accent-light)]
                               rounded-t-full shadow-lg"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile content - prevents content from being hidden under bottom nav */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
