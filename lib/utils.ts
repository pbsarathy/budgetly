import { Expense, ExpenseCategory, ExpenseStats } from '@/types/expense';
import { currencyStorage, CURRENCIES, Currency } from './currencyStorage';

/**
 * Generates a cryptographically secure random ID
 * Uses Web Crypto API for true randomness (not Math.random)
 */
export function generateId(): string {
  // Use crypto.getRandomValues for cryptographically secure random values
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Convert to hex string
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 * Removes HTML-like characters and normalizes Unicode
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .normalize('NFKC'); // Normalize Unicode to prevent homograph attacks
}

export function formatCurrency(amount: number, currencyCode?: Currency): string {
  const currency = currencyCode || currencyStorage.get();
  const currencyInfo = CURRENCIES[currency];

  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
}

export function getMonthEnd(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
}

export function calculateStats(expenses: Expense[]): ExpenseStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyExpenses = expenses.filter(
    (exp) => new Date(exp.date) >= monthStart
  );
  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryBreakdown: Record<ExpenseCategory, number> = {
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
    categoryBreakdown[exp.category] += exp.amount;
  });

  let topCategory: ExpenseCategory | null = null;
  let maxAmount = 0;

  (Object.keys(categoryBreakdown) as ExpenseCategory[]).forEach((category) => {
    if (categoryBreakdown[category] > maxAmount) {
      maxAmount = categoryBreakdown[category];
      topCategory = category;
    }
  });

  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? totalSpending / expenseCount : 0;

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
    expenseCount,
    averageExpense,
  };
}

/**
 * Sanitizes a cell value for CSV export to prevent formula injection attacks
 * Prepends single quote to values starting with =, +, -, @ to prevent formula execution
 */
function sanitizeCSVCell(value: string): string {
  const stringValue = String(value);

  // Check if value starts with formula characters
  if (/^[=+\-@\t\r]/.test(stringValue)) {
    // Prepend with single quote to treat as text
    return `"'${stringValue.replace(/"/g, '""')}"`;
  }

  // Escape quotes and wrap in quotes
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((exp) => [
    sanitizeCSVCell(formatDate(exp.date)),
    sanitizeCSVCell(exp.category),
    sanitizeCSVCell(exp.description),  // CRITICAL: Sanitize user input
    sanitizeCSVCell(exp.amount.toString()),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToPDF(expenses: Expense[]): Promise<void> {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 25;

  // Title with better styling
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Expense Report', pageWidth / 2, yPos, { align: 'center' });

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;
  doc.text(`Generated on ${formattedDate}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  // Summary box with border
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(20, yPos, pageWidth - 40, 20, 2, 2, 'FD');

  yPos += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Summary', 25, yPos);

  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Total Expenses: ${expenses.length}`, 25, yPos);
  doc.text(`Total Amount: Rs ${totalAmount.toFixed(0)}`, pageWidth / 2 + 10, yPos);

  yPos += 12;

  // Table header with better alignment
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(51, 65, 85); // slate-700
  doc.roundedRect(20, yPos, pageWidth - 40, 9, 1, 1, 'F');

  doc.setTextColor(255, 255, 255);
  const headerY = yPos + 6.5;
  doc.text('Date', 25, headerY);
  doc.text('Category', 55, headerY);
  doc.text('Description', 95, headerY);
  doc.text('Amount', pageWidth - 25, headerY, { align: 'right' });

  yPos += 12;
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'normal');

  // Table rows with better formatting
  expenses.forEach((expense, index) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 25;

      // Redraw header on new page
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(51, 65, 85);
      doc.roundedRect(20, yPos, pageWidth - 40, 9, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      const newHeaderY = yPos + 6.5;
      doc.text('Date', 25, newHeaderY);
      doc.text('Category', 55, newHeaderY);
      doc.text('Description', 95, newHeaderY);
      doc.text('Amount', pageWidth - 25, newHeaderY, { align: 'right' });
      yPos += 12;
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
    }

    // Alternate row colors with rounded corners
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(20, yPos - 4, pageWidth - 40, 9, 1, 1, 'F');
    }

    // Format date as dd/mm/yy
    const expenseDate = new Date(expense.date);
    const formattedExpenseDate = `${String(expenseDate.getDate()).padStart(2, '0')}/${String(expenseDate.getMonth() + 1).padStart(2, '0')}/${String(expenseDate.getFullYear()).slice(-2)}`;

    doc.setFontSize(9);
    doc.text(formattedExpenseDate, 25, yPos);
    doc.text(expense.category, 55, yPos);

    // Truncate long descriptions
    const maxDescLength = 28;
    const description = expense.description.length > maxDescLength
      ? expense.description.substring(0, maxDescLength) + '...'
      : expense.description;
    doc.text(description, 95, yPos);

    // Format amount
    const amountText = `Rs ${expense.amount.toFixed(0)}`;
    doc.text(amountText, pageWidth - 25, yPos, { align: 'right' });

    yPos += 9;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Generated by Monetly', pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Save the PDF with dd/mm/yy format
  const filename = `expenses-${formattedDate.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
}

export function getCategoryColor(category: ExpenseCategory): string {
  const colors: Record<ExpenseCategory, string> = {
    Food: 'bg-orange-100 text-orange-700',
    Transportation: 'bg-blue-100 text-blue-700',
    Entertainment: 'bg-purple-100 text-purple-700',
    Shopping: 'bg-pink-100 text-pink-700',
    Bills: 'bg-red-100 text-red-700',
    Education: 'bg-indigo-100 text-indigo-700',
    Investments: 'bg-green-100 text-green-700',
    'Daily Spends': 'bg-yellow-100 text-yellow-700',
    EMI: 'bg-rose-100 text-rose-700',
    Maintenance: 'bg-cyan-100 text-cyan-700',
    Other: 'bg-slate-100 text-slate-700',
  };
  return colors[category];
}

export function getCategoryIcon(category: ExpenseCategory): string {
  const icons: Record<ExpenseCategory, string> = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Education: '📚',
    Investments: '💰',
    'Daily Spends': '🛒',
    EMI: '💳',
    Maintenance: '🔧',
    Other: '📌',
  };
  return icons[category];
}

export interface Insight {
  type: 'positive' | 'warning' | 'info';
  message: string;
  icon: string;
  priority?: number; // 1 = low, 2 = medium, 3 = high
}

export function generateInsights(expenses: Expense[]): Insight[] {
  const insights: Insight[] = [];

  if (expenses.length === 0) return insights;

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get current and last month expenses
  const currentMonthExpenses = expenses.filter(e => new Date(e.date) >= currentMonth);
  const lastMonthExpenses = expenses.filter(e => new Date(e.date) >= lastMonth && new Date(e.date) <= lastMonthEnd);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate category breakdown (current month only)
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  // Insight 1: Top category
  if (topCategory) {
    const percentage = (topCategory[1] / currentMonthTotal) * 100;
    insights.push({
      type: percentage > 40 ? 'warning' : 'info',
      message: `Your top spending category is **${topCategory[0]}** at ${formatCurrency(topCategory[1])} (${percentage.toFixed(0)}% of monthly spending)`,
      icon: '📊',
      priority: percentage > 40 ? 3 : 1
    });
  }

  // Insight 2: Month-over-month comparison
  if (lastMonthTotal > 0 && currentMonthExpenses.length > 0) {
    const change = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (Math.abs(change) > 5) {
      insights.push({
        type: change > 0 ? 'warning' : 'positive',
        message: change > 0
          ? `You're spending **${Math.abs(change).toFixed(0)}% more** this month compared to last month`
          : `Great job! You're spending **${Math.abs(change).toFixed(0)}% less** this month`,
        icon: change > 0 ? '📈' : '📉',
        priority: change > 15 ? 3 : 2
      });
    }
  }

  // Insight 3: Budget burn rate (spending pace)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();

  // Compare spending pace - are we spending too fast?
  if (currentMonthExpenses.length > 0 && daysElapsed > 5) {
    const projectedMonthlySpending = (currentMonthTotal / daysElapsed) * daysInMonth;
    const paceRatio = projectedMonthlySpending / (currentMonthTotal > 0 ? currentMonthTotal : 1);

    if (paceRatio > 1.3 && projectedMonthlySpending > currentMonthTotal * 1.2) {
      insights.push({
        type: 'warning',
        message: `At your current pace, you're projected to spend **${formatCurrency(projectedMonthlySpending)}** by month end`,
        icon: '⏱️',
        priority: 3
      });
    }
  }

  // Insight 4: Daily Spends category tracking
  const dailySpendsAmount = categoryTotals['Daily Spends'] || 0;
  if (dailySpendsAmount > 0) {
    const dailySpendsPercentage = (dailySpendsAmount / currentMonthTotal) * 100;
    if (dailySpendsPercentage > 30) {
      insights.push({
        type: 'warning',
        message: `Daily spends are **${dailySpendsPercentage.toFixed(0)}%** of your monthly spending at ${formatCurrency(dailySpendsAmount)}. Consider setting a grocery budget!`,
        icon: '🛒',
        priority: 2
      });
    } else if (dailySpendsAmount > 0) {
      insights.push({
        type: 'info',
        message: `You've spent **${formatCurrency(dailySpendsAmount)}** on daily essentials this month`,
        icon: '🛒',
        priority: 1
      });
    }
  }

  // Insight 5: EMI tracking with subcategory breakdown
  const emiExpenses = currentMonthExpenses.filter(e => e.category === 'EMI');
  if (emiExpenses.length > 0) {
    const emiTotal = categoryTotals['EMI'] || 0;
    const emiPercentage = (emiTotal / currentMonthTotal) * 100;

    // Find most expensive EMI type
    const emiSubcategoryTotals: Record<string, number> = {};
    emiExpenses.forEach(exp => {
      const key = exp.customSubcategory || exp.subcategory || 'Unknown';
      emiSubcategoryTotals[key] = (emiSubcategoryTotals[key] || 0) + exp.amount;
    });

    const topEMI = Object.entries(emiSubcategoryTotals).sort((a, b) => b[1] - a[1])[0];

    if (topEMI) {
      insights.push({
        type: emiPercentage > 40 ? 'warning' : 'info',
        message: `Your biggest EMI is **${topEMI[0]}** at ${formatCurrency(topEMI[1])}/month (${emiPercentage.toFixed(0)}% of spending)`,
        icon: '💳',
        priority: emiPercentage > 40 ? 3 : 1
      });
    }
  }

  // Insight 6: Maintenance spending tracking
  const maintenanceAmount = categoryTotals['Maintenance'] || 0;
  if (maintenanceAmount > 0) {
    const maintenancePercentage = (maintenanceAmount / currentMonthTotal) * 100;
    insights.push({
      type: 'info',
      message: `You spent **${formatCurrency(maintenanceAmount)}** on maintenance this month (${maintenancePercentage.toFixed(0)}% of spending)`,
      icon: '🔧',
      priority: 1
    });
  }

  // Insight 7: Transaction frequency
  if (currentMonthExpenses.length > 0) {
    const avgPerDay = currentMonthExpenses.length / now.getDate();
    if (avgPerDay > 3) {
      insights.push({
        type: 'info',
        message: `You're making **${avgPerDay.toFixed(1)} transactions per day** this month`,
        icon: '📱',
        priority: 1
      });
    }
  }

  // Insight 8: Large expenses warning
  if (expenses.length > 5) {
    const avgExpense = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
    const largeExpenses = currentMonthExpenses.filter(e => e.amount > avgExpense * 2);
    if (largeExpenses.length > 0) {
      insights.push({
        type: 'warning',
        message: `You have **${largeExpenses.length} large expense${largeExpenses.length > 1 ? 's' : ''}** this month (above ${formatCurrency(avgExpense * 2)})`,
        icon: '⚠️',
        priority: 2
      });
    }
  }

  // Insight 9: Investments category positive reinforcement
  const investmentsAmount = categoryTotals['Investments'] || 0;
  if (investmentsAmount > 0) {
    const investmentsPercentage = (investmentsAmount / currentMonthTotal) * 100;
    insights.push({
      type: 'positive',
      message: `Excellent! You've invested **${formatCurrency(investmentsAmount)}** (${investmentsPercentage.toFixed(0)}% of spending) this month`,
      icon: '💰',
      priority: 2
    });
  }

  // Sort by priority (highest first) and return top 6 insights
  return insights
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 6);
}
