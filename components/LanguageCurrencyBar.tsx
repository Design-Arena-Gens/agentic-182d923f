"use client";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useTransactionStore } from "@/store/transactions";

const languages = [
  { code: "en-IN", name: "English (India)" },
  { code: "hi", name: "??????" },
  { code: "es", name: "Espa?ol" },
  { code: "fr", name: "Fran?ais" },
  { code: "de", name: "Deutsch" },
  { code: "zh-CN", name: "??" },
];

const popularCurrencies = ["INR", "USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "AED"]; 

export function LanguageCurrencyBar() {
  const { i18n } = useI18n();
  const baseCurrency = useTransactionStore((s) => s.baseCurrency);
  const setBaseCurrency = useTransactionStore((s) => s.setBaseCurrency);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const currencyOptions = useMemo(() => popularCurrencies, []);

  return (
    <div className="flex items-center gap-2">
      <select
        className="select"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>{l.name}</option>
        ))}
      </select>
      <select
        className="select"
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value)}
      >
        {currencyOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
