import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { notFound } from "next/navigation";
import type { PageProps } from "@/types/pageProps";
import { LANGS } from "@/lib/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children, params: { lang } }: PageProps) {
  if (!LANGS.includes(lang)) return notFound();

  return (
    <html lang={lang} className="bg-mimosa text-slate-50">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
