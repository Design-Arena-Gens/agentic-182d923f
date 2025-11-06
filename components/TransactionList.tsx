"use client";
import { useMemo, useState } from "react";
import { useTransactionStore } from "@/store/transactions";
import { formatMoney } from "@/lib/currency";
import { Trash2, Edit2, Filter, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TransactionList() {
  const { t } = useTranslation();
  const { transactions, baseCurrency, rates, removeTransaction } = useTransactionStore();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!(
          tx.category.toLowerCase().includes(q) ||
          (tx.note || "").toLowerCase().includes(q)
        )) return false;
      }
      return true;
    });
  }, [transactions, query, type]);

  return (
    <div className="container-card">
      <div className="card-header">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Filter className="w-4 h-4" /> {t('list.transactions')}</div>
        <div className="flex items-center gap-2">
          <input className="input" placeholder={t('list.search')!} value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">{t('list.all')}</option>
            <option value="income">{t('form.income')}</option>
            <option value="expense">{t('form.expense')}</option>
          </select>
        </div>
      </div>
      <div className="card-body overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 dark:text-gray-400">
            <tr>
              <th className="py-2">{t('list.date')}</th>
              <th className="py-2">{t('list.type')}</th>
              <th className="py-2">{t('list.category')}</th>
              <th className="py-2">{t('list.note')}</th>
              <th className="py-2">{t('list.amount')}</th>
              <th className="py-2">{t('list.inBase')}</th>
              <th className="py-2">{t('list.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => {
              const rate = rates[tx.currency] ? rates[tx.currency] : (tx.currency === baseCurrency ? 1 : 0);
              const baseAmount = tx.amount * (tx.currency === baseCurrency ? 1 : (rate ? 1 / rate : 0));
              return (
                <tr key={tx.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-2">{t(`form.${tx.type}`)}</td>
                  <td className="py-2">{t(`categories.${tx.category.toLowerCase()}`, { defaultValue: tx.category })}</td>
                  <td className="py-2 max-w-[240px] truncate" title={tx.note}>{tx.note}</td>
                  <td className="py-2">{formatMoney(tx.amount, tx.currency)}</td>
                  <td className="py-2">{formatMoney(baseAmount, baseCurrency)}</td>
                  <td className="py-2">
                    <button className="button-outline" onClick={() => removeTransaction(tx.id)}><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">{t('list.empty')}</div>
        )}
      </div>
    </div>
  );
}
