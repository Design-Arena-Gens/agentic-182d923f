"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchRates } from "@/lib/currency";

type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string; // ISO string
  category: string;
  note?: string;
  tags: string[];
};

type Store = {
  transactions: Transaction[];
  baseCurrency: string;
  rates: Record<string, number>; // relative to base (exchangerate.host returns rates map)
  addTransaction: (input: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  setTransactions: (rows: Transaction[]) => void;
  setBaseCurrency: (cur: string) => void;
  refreshRates: () => Promise<void>;
};

export const useTransactionStore = create<Store>()(
  persist(
    (set, get) => ({
      transactions: [],
      baseCurrency: "INR",
      rates: {},
      addTransaction: (input) => set((s) => ({ transactions: [{ id: crypto.randomUUID(), ...input }, ...s.transactions] })),
      removeTransaction: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
      setTransactions: (rows) => set({ transactions: rows }),
      setBaseCurrency: (cur) => { set({ baseCurrency: cur }); get().refreshRates(); },
      refreshRates: async () => {
        const base = get().baseCurrency;
        const rates = await fetchRates(base);
        set({ rates });
      },
    }),
    { name: "flowwise-store" }
  )
);

// kick off initial rates fetch on client hydration
if (typeof window !== "undefined") {
  const unsub = useTransactionStore.subscribe((state, prev) => {
    if (state.baseCurrency !== prev.baseCurrency) return; // handled in setter
  });
  useTransactionStore.getState().refreshRates();
}
