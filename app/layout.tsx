import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ExpenseProvider } from "@/contexts/ExpenseContext";

const inter = Inter({ subsets: ["latin"] });

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
        <ExpenseProvider>{children}</ExpenseProvider>
      </body>
    </html>
  );
}
