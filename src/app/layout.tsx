import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/ecommerce/CartDrawer";
import { SearchPalette } from "@/components/ecommerce/SearchPalette";
import { Toaster } from "react-hot-toast";
import { SuppressWarnings } from "@/components/utils/SuppressWarnings";

export const metadata: Metadata = {
  title: {
    default: "MarketVerse — Next-Gen E-Commerce",
    template: "%s | MarketVerse",
  },
  description:
    "The immersive, futuristic marketplace for forward-thinking products. Discover electronics, fashion, gaming, and more in a stunning 3D experience.",
  keywords: ["e-commerce", "shopping", "futuristic", "tech", "marketplace"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MarketVerse",
  },
};

/**
 * RootLayout — the top-level layout for MarketVerse.
 *
 * Architecture:
 * - Navbar and CartDrawer are rendered here so they persist across route changes
 * - SearchPalette is global (Cmd+K)
 * - No explicit ThemeProvider needed — dark theme is set via CSS vars on body
 */
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {/* Global overlay components */}
          <Navbar />
          <SuppressWarnings />
          <CartDrawer />
          <SearchPalette />
          <Toaster position="bottom-right" />

          {/* Page content */}
          <main className="min-h-screen">{children}</main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
