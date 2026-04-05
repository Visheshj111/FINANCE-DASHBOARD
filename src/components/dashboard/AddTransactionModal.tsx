"use client";

import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";

export function AddTransactionModal() {
  const { isAddModalOpen, setIsAddModalOpen, addTransaction, transactions } = useFinance();

  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const categories = Array.from(new Set(transactions.map((t) => t.category))).filter(Boolean);

  const [newTx, setNewTx] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount || !newTx.category) return;
    
    addTransaction({
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      date: newTx.date,
      type: newTx.type,
    });
    
    setIsAddModalOpen(false);
    setIsOtherCategory(false);
    setNewTx({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    });
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 dark:bg-black/90">
      <div className="bg-white dark:bg-black p-6 w-full max-w-md border-2 border-black dark:border-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-widest">Add Transaction</h3>
          <button 
            onClick={() => setIsAddModalOpen(false)} 
            className="text-black dark:text-white border border-black dark:border-white px-2 py-1 text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            X
          </button>
        </div>
        
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-black dark:text-white">
                <input 
                  type="radio" 
                  name="type" 
                  value="expense" 
                  checked={newTx.type === 'expense'} 
                  onChange={(e) => setNewTx({...newTx, type: e.target.value as any})}
                />
                Expense
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-black dark:text-white">
                <input 
                  type="radio" 
                  name="type" 
                  value="income" 
                  checked={newTx.type === 'income'} 
                  onChange={(e) => setNewTx({...newTx, type: e.target.value as any})}
                />
                Income
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">Description</label>
            <input 
              type="text" 
              required
              value={newTx.description}
              onChange={(e) => setNewTx({...newTx, description: e.target.value})}
              className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white outline-none focus:border-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">Amount (₹)</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={newTx.amount}
                onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white outline-none focus:border-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">Date</label>
              <input 
                type="date" 
                required
                value={newTx.date}
                onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white outline-none focus:border-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black dark:text-white mb-2 uppercase">Category</label>
            {!isOtherCategory ? (
              <select 
                required
                value={newTx.category}
                onChange={(e) => {
                  if (e.target.value === "other") {
                    setIsOtherCategory(true);
                    setNewTx({ ...newTx, category: "" });
                  } else {
                    setNewTx({ ...newTx, category: e.target.value });
                  }
                }}
                className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white outline-none focus:border-2 cursor-pointer"
              >
                <option value="" disabled>Select a category...</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="other">Other (type custom)</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  required
                  placeholder="Enter custom category"
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white outline-none focus:border-2"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setIsOtherCategory(false);
                    setNewTx({ ...newTx, category: "" });
                  }}
                  className="px-3 border border-black dark:border-white text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="submit"
              className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest border border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
