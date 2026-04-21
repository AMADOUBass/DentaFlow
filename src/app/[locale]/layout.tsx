import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oros | Plateforme pour centres dentaires",
  description: "Gestion de rendez-vous, portail patient et conformité Loi 25 pour cliniques dentaires au Québec.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // S'assurer que le paramètre [locale] est valide
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }
 
  // Récupération des messages traduits pour cette locale
  const messages = await getMessages();
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
