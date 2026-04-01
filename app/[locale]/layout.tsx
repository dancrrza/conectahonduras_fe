import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/widgets/header/Header";
import Footer from "@/components/widgets/footer/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { translate } from "@/i18n/lib/translate";
import { isRtlDirection } from "@/i18n/utilities";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { FallbackImageProvider } from "@/context/FallbackImageContext";
import { fetchFallbackImage } from "@/sanity/queries/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await translate("site_title"),
    description: await translate("site_description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fallbackSrc = await fetchFallbackImage();
  const locale = await getLocale();
  const isRTL = await isRtlDirection(locale);

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <FallbackImageProvider fallbackSrc={fallbackSrc}>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-background">
              <main className="min-h-screen w-full container px-4 lg:px-8 py-20 mx-auto">
                <TooltipProvider>{children}</TooltipProvider>
              </main>
            </div>
            <Footer />
          </FallbackImageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
