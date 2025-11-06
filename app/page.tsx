"use client";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ChartsPanel } from "@/components/ChartsPanel";
import { ImportExport } from "@/components/ImportExport";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TransactionForm />
          <TransactionList />
        </div>
        <div className="space-y-6">
          <ChartsPanel />
          <ImportExport />
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t("footer.madeWith")} ? {t("footer.andCare")}
      </p>
    </div>
  );
}
