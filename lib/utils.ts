import { Expense, ExpenseCategory, ExpenseStats } from '@/types/expense';
import { currencyStorage, CURRENCIES, Currency } from './currencyStorage';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    Savings: 0,
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

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((exp) => [
    formatDate(exp.date),
    exp.category,
    exp.description,
    exp.amount.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
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
  doc.text('Generated by Spendora', pageWidth / 2, pageHeight - 15, { align: 'center' });

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
    Savings: 'bg-green-100 text-green-700',
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
    Savings: '💰',
    Other: '📌',
  };
  return icons[category];
}
