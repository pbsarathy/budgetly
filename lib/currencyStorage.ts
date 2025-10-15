export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  locale: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: '$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: '$', locale: 'en-AU', name: 'Australian Dollar' },
};

const STORAGE_KEY = 'expense-tracker-currency';
const DEFAULT_CURRENCY: Currency = 'INR';

export const currencyStorage = {
  get: (): Currency => {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY;
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Currency) || DEFAULT_CURRENCY;
  },

  set: (currency: Currency): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, currency);
  },
};
