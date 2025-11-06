"use client";
import { useMemo } from "react";
import { useTransactionStore } from "@/store/transactions";
import { useTranslation } from "react-i18next";
import { formatMoney } from "@/lib/currency";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

export function SummaryCards() {
  const { t } = useTranslation();
  const { transactions, baseCurrency, rates } = useTransactionStore();

  const { income, expense, balance } = useMemo(() => {
    let income = 0, expense = 0;
    for (const tx of transactions) {
      const rate = rates[tx.currency] ? rates[tx.currency] : (tx.currency === baseCurrency ? 1 : 0);
      const amountInBase = tx.amount * (tx.currency === baseCurrency ? 1 : (rate ? 1 / rate : 0));
      if (tx.type === 'income') income += amountInBase; else expense += amountInBase;
    }
    return { income, expense, balance: income - expense };
  }, [transactions, baseCurrency, rates]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="container-card">
        <div className="card-header">
          <div className="flex items-center gap-2"><ArrowUpCircle className="w-5 h-5 text-emerald-500" /> {t('summary.income')}</div>
        </div>
        <div className="card-body text-2xl font-semibold">{formatMoney(balance < 0 ? 0 : income, baseCurrency)}</div>
      </div>
      <div className="container-card">
        <div className="card-header">
          <div className="flex items-center gap-2"><ArrowDownCircle className="w-5 h-5 text-rose-500" /> {t('summary.expense')}</div>
        </div>
        <div className="card-body text-2xl font-semibold">{formatMoney(expense, baseCurrency)}</div>
      </div>
      <div className="container-card">
        <div className="card-header">
          <div className="flex items-center gap-2"><Wallet className="w-5 h-5 text-brand-600" /> {t('summary.balance')}</div>
        </div>
        <div className="card-body text-2xl font-semibold">{formatMoney(balance, baseCurrency)}</div>
      </div>
    </div>
  );
}
