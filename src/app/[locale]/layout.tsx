import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { PwaRegistration } from "@/components/pwa/PwaRegistration";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Oros | Plateforme pour centres dentaires",
  description: "Gestion de rendez-vous, portail patient et conformité Loi 25 pour cliniques dentaires au Québec.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oros",
  },
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
          <PwaRegistration />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
