import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PwaRegistration } from "@/components/pwa/PwaRegistration";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { getLocaleServer } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Oros | Plateforme dentaire québécoise",
    template: "%s | Oros"
  },
  description: "Solution complète de gestion clinique, portail patient et conformité Loi 25 pour les centres dentaires du Québec.",
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://oros.homes",
    siteName: "Oros",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Oros - Le futur de la gestion dentaire"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Oros | Gestion Dentaire Premium",
    description: "Simplifiez votre clinique avec notre plateforme conforme à la Loi 25.",
    images: ["/og-image.png"]
  },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleServer();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-white font-sans antialiased",
          inter.className
        )}
        suppressHydrationWarning={true}
      >
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
