"use client";

import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export function Transactions() {
  const { transactions, role, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSorted = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.description.toLowerCase().includes(search.toLowerCase()) || 
          t.category.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === "all" || t.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === "date") {
          comp = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          comp = a.amount - b.amount;
        }
        return sortOrder === "asc" ? comp : -comp;
      });
  }, [transactions, search, filterType, sortField, sortOrder]);

  const toggleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-black dark:border-white flex flex-col">
      <div className="p-6 border-b border-black dark:border-white flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-bold text-black dark:text-white uppercase tracking-widest">Transactions</h3>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-auto px-3 py-1 bg-white dark:bg-black border border-black dark:border-white text-sm text-black dark:text-white"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1 bg-white dark:bg-black border border-black dark:border-white text-sm text-black dark:text-white cursor-pointer"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-black dark:border-white bg-black text-white dark:bg-white dark:text-black">
            <tr>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 font-bold uppercase tracking-wider">Category</th>
              <th 
                className="px-6 py-3 font-bold uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th 
                className="px-6 py-3 font-bold uppercase tracking-wider text-right cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              {role === "admin" && <th className="px-6 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black dark:divide-white">
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-3 font-medium text-black dark:text-white">
                    {t.description}
                  </td>
                  <td className="px-6 py-3 text-black dark:text-white">{t.category}</td>
                  <td className="px-6 py-3 text-black dark:text-white">
                    {t.date}
                  </td>
                  <td className={cn(
                    "px-6 py-3 text-right font-bold",
                    t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  {role === "admin" && (
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-black dark:text-white underline text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-2 py-1 border border-transparent hover:border-black dark:hover:border-white transition-none"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === "admin" ? 5 : 4} className="px-6 py-12 text-center font-bold text-black dark:text-white">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
