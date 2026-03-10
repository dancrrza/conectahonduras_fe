import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/widgets/header/header";
import Footer from "@/components/widgets/home/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { translate } from "@/lib/translate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: translate('site_title'),
  description: translate('site_description'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#143952] to-[#0f2740]">
          <main className="min-h-screen w-full container px-4 lg:px-8 py-20 mx-auto">
            <TooltipProvider>{children}</TooltipProvider>
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
