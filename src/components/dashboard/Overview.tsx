"use client";

import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';

export function Overview() {
  const { transactions } = useFinance();
  const { theme } = useTheme();
  const [filterDate, setFilterDate] = useState("");
  const isDark = theme === 'dark';

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  let currentBalance = 0;
  let balanceData = [...transactions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], t) => {
      currentBalance += t.type === 'income' ? t.amount : -t.amount;
      const existing = acc.find(d => d.date === t.date);
      if (existing) {
        existing.balance = currentBalance;
      } else {
        acc.push({ date: t.date, balance: currentBalance });
      }
      return acc;
    }, []);

  if (filterDate) {
    balanceData = balanceData.filter(d => d.date === filterDate);
  }

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#000000', '#333333', '#555555', '#777777', '#999999', '#AAAAAA'];
  const DARK_COLORS = ['#FFFFFF', '#CCCCCC', '#AAAAAA', '#888888', '#666666', '#444444'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black p-3 border border-black dark:border-white">
          <p className="text-sm font-bold text-black dark:text-white mb-1">{label}</p>
          <p className="text-base text-black dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white dark:bg-black p-6 border-2 border-black dark:border-white">
          <div>
            <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Total Balance</p>
            <p className="mt-2 text-3xl font-bold text-black dark:text-white">
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 border border-black dark:border-white">
          <div>
            <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Total Income</p>
            <p className="mt-2 text-2xl text-black dark:text-white">
              {formatCurrency(income)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 border border-black dark:border-white">
          <div>
            <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Total Expenses</p>
            <p className="mt-2 text-2xl text-black dark:text-white">
              {formatCurrency(expenses)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black p-6 border border-black dark:border-white lg:col-span-2 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-black dark:text-white uppercase tracking-widest">Balance Trend</h3>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">Date:</label>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-2 py-1 text-sm border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white outline-none"
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate("")}
                  className="text-xs uppercase font-bold text-black dark:text-white underline hover:no-underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#333' : '#ccc'} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  axisLine={{ stroke: isDark ? '#fff' : '#000' }}
                  tickLine={{ stroke: isDark ? '#fff' : '#000' }}
                  tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={{ stroke: isDark ? '#fff' : '#000' }}
                  tickLine={{ stroke: isDark ? '#fff' : '#000' }}
                  tick={{ fill: isDark ? '#fff' : '#000', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="step" 
                  dataKey="balance" 
                  stroke={isDark ? '#fff' : '#000'} 
                  strokeWidth={2}
                  fillOpacity={0.1} 
                  fill={isDark ? '#fff' : '#000'} 
                  activeDot={{ r: 6, strokeWidth: 2, fill: isDark ? '#000' : '#fff', stroke: isDark ? '#fff' : '#000' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 border border-black dark:border-white flex flex-col">
          <h3 className="text-lg font-bold text-black dark:text-white mb-6 uppercase tracking-widest">Spending</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip wrapperClassName="!bg-white dark:!bg-black !border !border-black dark:!border-white !rounded-none !shadow-none" />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                    stroke={isDark ? '#000' : '#fff'}
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="square"
                    formatter={(value) => (
                      <span className="text-black dark:text-white text-sm font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-black dark:text-white text-sm">No data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
