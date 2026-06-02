import { Suspense } from "react";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Dancing_Script } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiAdvisor } from "@/components/ai/AiAdvisor";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ReviewProvider } from "@/context/ReviewContext";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mei Closet — Vintage Marketplace",
    template: "%s | Mei Closet",
  },
  description: "Discover curated vintage gems and handcrafted knitwear in our nostalgic fashion marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable} ${dancingScript.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <LanguageProvider>
          <CartProvider>
            <OrderProvider>
              <ReviewProvider>
                <Suspense fallback={<div style={{ height: "64px" }} />}>
                  <Navbar />
                </Suspense>
                <main className="flex-1">{children}</main>
                <Footer />
                <AiAdvisor />
                <ScrollToTop />
              </ReviewProvider>
            </OrderProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
