# Budgetly

A modern, professional expense tracking and budgeting web application built with Next.js 15, TypeScript, and Tailwind CSS. Track your personal finances with ease, visualize spending patterns, manage budgets, and export your data.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

### Expense Management
- **Add Expenses**: Create expenses with amount, category, date, and description
- **Edit Expenses**: Update existing expenses with full validation
- **Delete Expenses**: Remove expenses with confirmation
- **Form Validation**: Client-side validation for all inputs

### Analytics & Insights
- **Dashboard**: Overview with key metrics and spending summaries
- **Summary Cards**: Total spending, monthly spending, average expense, and expense count
- **Category Breakdown**: Visual breakdown of spending by category with progress bars
- **Smart Insights**: Automated insights about spending patterns
- **Charts**: Interactive pie charts and line graphs for spending visualization

### Budget Management
- **Overall Budget**: Set and track total monthly budget limit
- **Category Budgets**: Set individual budgets for each spending category
- **Progress Tracking**: Visual progress bars with color-coded warnings
- **Budget Alerts**: Warnings when approaching or exceeding budget limits

### Recurring Expenses
- **Auto-generation**: Automatically create expenses based on frequency (daily, weekly, monthly, yearly)
- **Management**: Add, pause, and delete recurring expenses
- **Tracking**: View last generated dates and upcoming expenses

### Filtering & Search
- **Category Filter**: Filter expenses by category (Food, Transportation, Entertainment, Shopping, Bills, Education, Savings, Other)
- **Month View**: Filter by specific month or view all time
- **Date Range**: Filter by start and end dates
- **Search**: Search expenses by description, category, or amount
- **Real-time Updates**: Filters apply instantly

### Data Export
- **CSV Export**: Export filtered expenses to CSV format
- **PDF Export**: Generate professional PDF reports with summary
- **Automatic Formatting**: Properly formatted dates and amounts in INR
- **One-click Download**: Instant download with timestamped filename

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Data Storage**: localStorage (browser-based)
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF for export functionality
- **Icons**: Unicode emojis for categories

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository or download the project:
```bash
cd budgetly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Usage Guide

### Adding an Expense

1. Fill in the expense form at the top of the page:
   - **Amount**: Enter the expense amount (must be greater than 0)
   - **Category**: Select from Food, Transportation, Entertainment, Shopping, Bills, or Other
   - **Date**: Choose the expense date (defaults to today)
   - **Description**: Enter a brief description

2. Click "Add Expense" to save

### Viewing Analytics

1. Click the "Dashboard" tab in the header
2. View summary cards showing:
   - Total spending across all time
   - Spending for current month
   - Average expense amount
   - Total number of expenses
3. Review the category breakdown with visual progress bars
4. Read automated insights about your spending patterns

### Filtering Expenses

1. Click the "All Expenses" tab
2. Use the Filters section:
   - **Category**: Select a specific category or "All"
   - **Start Date**: Set the earliest date to include
   - **End Date**: Set the latest date to include
   - **Search**: Type to search descriptions, categories, or amounts
3. Click "Clear all filters" to reset

### Editing an Expense

1. Navigate to "All Expenses" tab
2. Click the edit icon (pencil) on any expense
3. Modify the fields in the form
4. Click "Update Expense" to save or "Cancel" to discard changes

### Deleting an Expense

1. Navigate to "All Expenses" tab
2. Click the delete icon (trash) on any expense
3. Confirm the deletion in the popup dialog

### Exporting Data

1. Apply any desired filters (optional)
2. Click the "Export CSV" button in the header
3. The CSV file will download automatically with format: `expenses-YYYY-MM-DD.csv`
4. Open in Excel, Google Sheets, or any spreadsheet application

## Project Structure

```
budgetly/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout with context provider
│   └── page.tsx              # Main page with tabs and layout
├── components/
│   ├── BudgetChart.tsx       # Budget vs spending bar chart
│   ├── BudgetManager.tsx     # Budget management interface
│   ├── Charts.tsx            # Pie and line charts
│   ├── Dashboard.tsx         # Analytics dashboard
│   ├── ExpenseFilters.tsx    # Filter controls with month view
│   ├── ExpenseForm.tsx       # Expense creation/editing form
│   ├── ExpenseList.tsx       # List of expenses with actions
│   ├── ExportButton.tsx      # CSV/PDF export functionality
│   └── RecurringExpenses.tsx # Recurring expense management
├── contexts/
│   └── ExpenseContext.tsx    # Global state management
├── lib/
│   ├── expenseStorage.ts     # localStorage CRUD operations
│   └── utils.ts              # Utility functions (formatting, calculations)
├── types/
│   └── expense.ts            # TypeScript type definitions
└── public/                   # Static assets
```

## Data Storage

This application uses browser localStorage to persist your expense data. This means:

- ✅ Your data stays private on your device
- ✅ No server or database required
- ✅ Works offline
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Clearing browser data will delete expenses
- ⚠️ Use CSV export to backup your data

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires localStorage support and modern JavaScript features.

## Customization

### Changing Categories

Edit `/types/expense.ts` and update the `ExpenseCategory` type, then update the utility functions in `/lib/utils.ts`:
- `getCategoryColor()` - Add color mapping
- `getCategoryIcon()` - Add icon mapping

### Changing Currency

Update the `formatCurrency()` function in `/lib/utils.ts` to change the currency code and locale.

### Styling

The application uses Tailwind CSS. Modify colors and styles by:
- Editing component class names
- Updating `/app/globals.css` for global styles
- Modifying the Tailwind configuration if needed

## Performance

- Optimized production build with Next.js and Turbopack
- Client-side rendering with efficient React hooks
- Minimal bundle size (~227 KB First Load JS)
- Smooth animations with CSS transitions
- Lazy loading for charts and PDF generation

## Future Enhancements

Potential features for future development:
- Dark mode support
- Multiple currency support (in progress)
- Cloud sync with Supabase + Google authentication
- Mobile app version (React Native)
- Receipt image attachments
- Multi-language support
- Investment tracking
- Debt management
- Financial goals and savings targets

## Development Notes

For detailed session notes, development context, and TODO tracking, see [SESSION_NOTES.md](./SESSION_NOTES.md).

## Contributing

This is a personal project currently under active development. The roadmap includes:
- P0: Critical UX improvements (FAB, toasts, multi-currency)
- P1: Production backend (Supabase + Google Auth)
- P2+: Advanced features (dark mode, voice input, receipt scanning)

## License

This project is open source and available for personal use.

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)
- [Recharts](https://recharts.org/)
- [jsPDF](https://github.com/parallax/jsPDF)
