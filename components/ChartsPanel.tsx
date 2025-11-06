"use client";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useTransactionStore } from "@/store/transactions";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatMoney } from "@/lib/currency";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export function ChartsPanel() {
  const { t } = useTranslation();
  const { transactions, baseCurrency, rates } = useTransactionStore();

  const { byCategory, byDate } = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byDate: Record<string, number> = {};
    for (const tx of transactions) {
      const rate = rates[tx.currency] ? rates[tx.currency] : (tx.currency === baseCurrency ? 1 : 0);
      const baseAmount = tx.amount * (tx.currency === baseCurrency ? 1 : (rate ? 1 / rate : 0));
      const signAmount = tx.type === 'expense' ? -baseAmount : baseAmount;
      byCategory[tx.category] = (byCategory[tx.category] || 0) + (tx.type === 'expense' ? baseAmount : 0);
      const d = new Date(tx.date).toISOString().slice(0,10);
      byDate[d] = (byDate[d] || 0) + signAmount;
    }
    return { byCategory, byDate };
  }, [transactions, baseCurrency, rates]);

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: t('charts.spendingByCategory') || 'Spending by Category',
        data: Object.values(byCategory),
        backgroundColor: [
          '#f87171','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa','#f472b6','#22d3ee'
        ],
      }
    ]
  };

  const lineLabels = Object.keys(byDate).sort();
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: t('charts.netOverTime') || 'Net over time',
        data: lineLabels.map((d) => byDate[d]),
        borderColor: '#6366f1',
        backgroundColor: '#6366f133'
      }
    ]
  };

  return (
    <div className="container-card">
      <div className="card-header"><span className="font-medium">{t('charts.title')}</span></div>
      <div className="card-body grid grid-cols-1 gap-6">
        <div className="chart-card">
          <Line data={lineData} options={{
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { ticks: { callback: (v) => formatMoney(Number(v), baseCurrency) } } }
          }} />
        </div>
        <div className="chart-card">
          <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
    </div>
  );
}
