'use client';

import React, { useState, useEffect } from 'react';
import { Currency, CURRENCIES, currencyStorage } from '@/lib/currencyStorage';

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
}

export default function CurrencySelector({ onCurrencyChange }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedCurrency(currencyStorage.get());
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    currencyStorage.set(currency);
    setIsOpen(false);
    onCurrencyChange?.(currency);
    // Force re-render by reloading the page
    window.location.reload();
  };

  const currentCurrency = CURRENCIES[selectedCurrency];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-slate-300 hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium text-slate-700"
        aria-label="Select currency"
      >
        <span className="text-base sm:text-lg">{currentCurrency.symbol}</span>
        <span className="hidden sm:inline">{currentCurrency.code}</span>
        <span className="text-slate-400">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl z-30 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">
                Select Currency
              </p>
              <div className="space-y-1">
                {(Object.keys(CURRENCIES) as Currency[]).map((currency) => {
                  const info = CURRENCIES[currency];
                  const isSelected = currency === selectedCurrency;

                  return (
                    <button
                      key={currency}
                      onClick={() => handleCurrencyChange(currency)}
                      className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{info.symbol}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{info.code}</p>
                        <p className="text-xs text-slate-500">{info.name}</p>
                      </div>
                      {isSelected && (
                        <span className="text-blue-600 text-lg">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
