import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import { getMessages } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/sonner";
import ClarityScript from "../components/analytics/ClarityScript";
import { GoogleTagManager } from "@next/third-parties/google";
import { AuthProvider } from "@/context/AuthProvider";
import { SessionProvider } from "@/context/SessionProvider";
// import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata = {
  title: "Astrosway - Your Cosmic Journey Begins",
  description:
    "Discover the mysteries of the universe with Astrosway. Professional astrology services, cosmic insights, and personalized readings.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function LocaleLayout({ children, params }) {
  // locale comes from the [locale] segment in /src/app/[locale]/
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ClarityScript />
        <GoogleTagManager gtmId="GTM-PRBKJKBM" />
        {/* <GoogleAnalytics gaId="G-L3LT2TZLXP" /> */}
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <SessionProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Toaster />
              <Footer />
              </SessionProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
