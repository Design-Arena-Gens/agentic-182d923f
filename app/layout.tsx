import "../styles/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { AppHeader } from "@/components/AppHeader";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata = {
  title: "Flowwise - Smart Expense Tracker",
  description: "Track expenses, budgets, and goals across currencies & languages.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <I18nProvider>
            <AppHeader />
            <main className="max-w-6xl mx-auto px-4 pb-20 pt-6">{children}</main>
            <ServiceWorkerRegister />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
