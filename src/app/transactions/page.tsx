"use client";

import { Shell } from "@/components/layout/Shell";
import { Transactions } from "@/components/dashboard/Transactions";
import { AddTransactionModal } from "@/components/dashboard/AddTransactionModal";
import { useFinance } from "@/context/FinanceContext";

export default function TransactionsPage() {
  const { role, setIsAddModalOpen } = useFinance();

  return (
    <Shell>
      <div className="flex flex-col gap-8">
        <div className="border-b border-black dark:border-white pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white uppercase tracking-widest">All Transactions</h1>
            <p className="mt-2 text-black dark:text-white font-medium">
              Search, filter, and review your financial history.
            </p>
          </div>
          
          {role === "admin" && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-black dark:bg-black dark:text-white px-6 py-2 border-2 border-black dark:border-white uppercase tracking-widest font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Add a Transaction
            </button>
          )}
        </div>

        <Transactions />
        <AddTransactionModal />
      </div>
    </Shell>
  );
}
