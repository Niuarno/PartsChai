import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "PartsChai - Buy & Sell PC Parts in Bangladesh | PC Parts Marketplace",
  description: "The trusted marketplace for PC parts in Bangladesh. Buy and sell processors, graphics cards, motherboards, RAM, storage, and all PC components at the best prices.",
  keywords: ["PC parts", "computer parts Bangladesh", "graphics card", "processor", "motherboard", "RAM", "SSD", "gaming PC", "PC components", "PartsChai"],
  authors: [{ name: "PartsChai Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PartsChai",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    title: "PartsChai - PC Parts Marketplace Bangladesh",
    description: "Buy & sell PC parts in Bangladesh. Processors, GPUs, motherboards, RAM and more.",
    url: "https://partschai.com",
    siteName: "PartsChai",
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PartsChai - PC Parts Marketplace Bangladesh",
    description: "Buy & sell PC parts in Bangladesh. Processors, GPUs, motherboards, RAM and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration);
                    },
                    function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <MobileBottomNav />
      </body>
    </html>
  );
}
