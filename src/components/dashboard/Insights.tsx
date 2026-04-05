"use client";

import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";

export function Insights() {
  const { transactions } = useFinance();

  const expenses = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenses.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  let highestCategory = { name: "None", amount: 0 };
  Object.entries(categoryTotals).forEach(([name, amount]) => {
    if (amount > highestCategory.amount) {
      highestCategory = { name, amount };
    }
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = expenses.filter(t => {
    const d = new Date(t.date);
    const isPrevMonth = d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1);
    const isCorrectYear = d.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
    return isPrevMonth && isCorrectYear;
  }).reduce((sum, t) => sum + t.amount, 0);

  const diff = thisMonthExpenses - lastMonthExpenses;
  const isUp = diff > 0;

  return (
    <div className="bg-white dark:bg-black p-6 border border-black dark:border-white">
      <h3 className="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-widest">
        Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-black dark:border-white p-4 h-full">
          <p className="text-sm font-bold uppercase text-black dark:text-white">Highest Spending Category</p>
          <p className="text-xl font-bold text-black dark:text-white mt-2">
            {highestCategory.name}
          </p>
          <p className="text-base text-black dark:text-white">
            ({formatCurrency(highestCategory.amount)})
          </p>
        </div>

        <div className="border border-black dark:border-white p-4 h-full">
          <p className="text-sm font-bold uppercase text-black dark:text-white">Monthly Comparison</p>
          <p className="text-xl font-bold text-black dark:text-white mt-2">
            Expenses are {isUp ? "UP" : "DOWN"} by {formatCurrency(Math.abs(diff))}
          </p>
          <p className="text-sm text-black dark:text-white mt-1 uppercase tracking-widest">compared to last month</p>
        </div>
      </div>
    </div>
  );
}
