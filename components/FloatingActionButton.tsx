'use client';

import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 sm:bottom-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl hover:shadow-blue-500/50 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
      aria-label="Add expense"
    >
      <span className="text-3xl sm:text-4xl font-light leading-none group-hover:rotate-90 transition-transform duration-300">
        +
      </span>
    </button>
  );
}
