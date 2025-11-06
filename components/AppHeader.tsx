"use client";
import { LanguageCurrencyBar } from "@/components/LanguageCurrencyBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet2 } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-brand-600 font-semibold tracking-tight">
          <Wallet2 className="w-6 h-6" />
          <span>Flowwise</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <LanguageCurrencyBar />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
