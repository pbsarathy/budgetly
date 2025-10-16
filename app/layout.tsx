import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";

// Inter font with tabular figures for better number alignment
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Monetly - Smart Expense Tracker",
  description: "Smart expense tracking made simple. Track expenses, manage budgets, and gain financial insights with Monetly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ExpenseProvider>{children}</ExpenseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
