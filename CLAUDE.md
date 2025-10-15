# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. The application helps users manage their personal finances by tracking expenses across different categories with analytics and export capabilities.

## Architecture

### Core Structure

- **App Router**: Uses Next.js 14 App Router (`/app` directory)
- **Client-side State**: React Context API for expense management (`/contexts/ExpenseContext.tsx`)
- **Data Persistence**: localStorage for browser-based storage
- **Type Safety**: Full TypeScript implementation with shared types in `/types/expense.ts`

### Key Components

1. **ExpenseForm** (`/components/ExpenseForm.tsx`): Handles expense creation and editing with validation
2. **ExpenseList** (`/components/ExpenseList.tsx`): Displays filtered expenses with edit/delete actions
3. **Dashboard** (`/components/Dashboard.tsx`): Shows analytics, summary cards, and spending insights
4. **ExpenseFilters** (`/components/ExpenseFilters.tsx`): Provides category, date, and search filtering
5. **ExportButton** (`/components/ExportButton.tsx`): Exports filtered expenses to CSV

### Data Flow

1. ExpenseContext provides global state management
2. All expense CRUD operations go through expenseStorage service (`/lib/expenseStorage.ts`)
3. Utility functions in `/lib/utils.ts` handle formatting, calculations, and CSV export
4. Components consume context via `useExpenses()` hook

### Category System

Fixed categories: Food, Transportation, Entertainment, Shopping, Bills, Other
Each category has an associated color and icon defined in `getCategoryColor()` and `getCategoryIcon()`

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Development server runs on `http://localhost:3000`

## Code Patterns

### Adding New Features to Expense Type

1. Update `Expense` interface in `/types/expense.ts`
2. Update `expenseStorage` CRUD operations in `/lib/expenseStorage.ts`
3. Modify ExpenseForm validation and form fields
4. Update ExpenseList display if needed

### Adding New Categories

1. Update `ExpenseCategory` type in `/types/expense.ts`
2. Add color mapping in `getCategoryColor()` in `/lib/utils.ts`
3. Add icon mapping in `getCategoryIcon()` in `/lib/utils.ts`

### Context Usage

Always use `useExpenses()` hook to access:
- `expenses`: All expenses
- `filteredExpenses`: Filtered based on current filters
- `addExpense()`, `updateExpense()`, `deleteExpense()`: CRUD operations
- `filters`, `setFilters()`: Filter state management

## Important Notes

- All components using hooks must be marked with `'use client'` directive
- Date strings are stored in ISO format (YYYY-MM-DD)
- Currency formatting uses USD by default
- ExpenseForm handles both creation and editing modes based on `editingExpense` prop
- Statistics are calculated client-side from the full expense list
- CSV export respects current filters
