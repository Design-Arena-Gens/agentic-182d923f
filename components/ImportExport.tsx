"use client";
import Papa from "papaparse";
import { useTransactionStore } from "@/store/transactions";
import { Upload, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ImportExport() {
  const { t } = useTranslation();
  const { transactions, setTransactions } = useTransactionStore();

  const onExport = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const onImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as any[];
        const sanitized = rows.map((r) => ({
          id: String(r.id || crypto.randomUUID()),
          type: (r.type === 'income' ? 'income' : 'expense') as 'income' | 'expense',
          amount: Number(r.amount) || 0,
          currency: String(r.currency || 'INR'),
          date: r.date ? new Date(r.date).toISOString() : new Date().toISOString(),
          category: String(r.category || 'Other'),
          note: String(r.note || ''),
          tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
        }));
        setTransactions(sanitized);
      }
    });
  };

  return (
    <div className="container-card">
      <div className="card-header"><span className="font-medium">{t('csv.title')}</span></div>
      <div className="card-body flex items-center gap-2">
        <button className="button" onClick={onExport}><Download className="w-4 h-4" /> {t('csv.export')}</button>
        <label className="button-outline cursor-pointer">
          <Upload className="w-4 h-4" /> {t('csv.import')}
          <input className="hidden" type="file" accept=".csv" onChange={(e) => e.target.files && onImport(e.target.files[0])} />
        </label>
      </div>
    </div>
  );
}
