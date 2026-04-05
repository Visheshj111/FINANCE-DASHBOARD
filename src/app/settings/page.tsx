"use client";

import { Shell } from "@/components/layout/Shell";
import { useFinance } from "@/context/FinanceContext";

export default function SettingsPage() {
  const { role, setIsAddModalOpen } = useFinance();

  return (
    <Shell>
      <div className="flex flex-col gap-8">
        <div className="border-b border-black dark:border-white pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white uppercase tracking-widest">Settings</h1>
            <p className="mt-2 text-black dark:text-white font-medium">
              Manage your account preferences and application behaviors.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black p-6 border border-black dark:border-white max-w-2xl">
          <p className="text-black dark:text-white mb-4">
            Nothing here yet, buddy
          </p>
        </div>
      </div>
    </Shell>
  );
}
