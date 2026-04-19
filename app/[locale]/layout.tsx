import type { Metadata } from "next";
import { Dela_Gothic_One, Space_Grotesk } from "next/font/google";
import Header from "@/components/widgets/header/Header";
import Footer from "@/components/widgets/footer/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { translate } from "@/i18n/lib/translate";
import { isRtlDirection } from "@/i18n/utilities";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const delaGothic = Dela_Gothic_One({
  variable: "--font-dela-gothic",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
  const locale = await getLocale();
  const isRTL = await isRtlDirection(locale);

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body className={`${delaGothic.variable} ${spaceGrotesk.variable} antialiased`}>
        <NextIntlClientProvider>
          <Header />
          <main className="min-h-screen w-full flex flex-col">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
