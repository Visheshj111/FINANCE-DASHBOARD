"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, Role } from "@/types";
import { initialTransactions } from "@/lib/mockData";

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [role, setRole] = useState<Role>("viewer");
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("finance_transactions_v5");
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
    
    const savedRole = localStorage.getItem("finance_role_v5");
    if (savedRole) {
      setRole(savedRole as Role);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("finance_transactions_v5", JSON.stringify(transactions));
      localStorage.setItem("finance_role_v5", role);
    }
  }, [transactions, role, mounted]);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, updatedTx: Omit<Transaction, "id">) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...updatedTx, id } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.map(tx => tx).filter(tx => tx.id !== id));
  };

  if (!mounted) {
    return null;
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        setRole,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isAddModalOpen,
        setIsAddModalOpen,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
