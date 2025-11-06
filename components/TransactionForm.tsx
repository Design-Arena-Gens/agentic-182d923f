"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactionStore } from "@/store/transactions";
import { useTranslation } from "react-i18next";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  currency: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultCategories = [
  "Food", "Transport", "Shopping", "Bills", "Health", "Travel", "Salary", "Other"
];

const popularCurrencies = ["INR", "USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "SGD", "AED"]; 

export function TransactionForm() {
  const add = useTransactionStore((s) => s.addTransaction);
  const baseCurrency = useTransactionStore((s) => s.baseCurrency);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      currency: baseCurrency,
      date: new Date().toISOString().slice(0, 10),
      category: "Food",
    },
  });

  const onSubmit = (data: FormValues) => {
    add({
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      category: data.category,
      note: data.note,
      tags: [],
    });
    reset({ type: data.type, amount: undefined as any, currency: data.currency, date: data.date, category: data.category, note: "" });
  };

  return (
    <div className="container-card">
      <div className="card-header"><span className="font-medium">{t('form.addTransaction')}</span></div>
      <form className="card-body grid grid-cols-1 md:grid-cols-6 gap-3" onSubmit={handleSubmit(onSubmit)}>
        <select className="select md:col-span-1" {...register("type")}>
          <option value="income">{t('form.income')}</option>
          <option value="expense">{t('form.expense')}</option>
        </select>
        <input className="input md:col-span-1" type="number" step="0.01" placeholder={t('form.amount')!} {...register("amount", { valueAsNumber: true })} />
        <select className="select md:col-span-1" {...register("currency")}>
          {popularCurrencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input className="input md:col-span-1" type="date" {...register("date")} />
        <select className="select md:col-span-1" {...register("category")}>
          {defaultCategories.map((c) => (
            <option key={c} value={c}>{t(`categories.${c.toLowerCase()}`, { defaultValue: c })}</option>
          ))}
        </select>
        <input className="input md:col-span-1" placeholder={t('form.note')!} {...register("note")} />
        <div className="md:col-span-6 flex justify-end">
          <button className="button" type="submit">{t('form.add')}</button>
        </div>
      </form>
    </div>
  );
}
