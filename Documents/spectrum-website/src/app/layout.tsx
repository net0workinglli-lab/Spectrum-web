'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/components/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/structured-data";
import { useEffect } from "react";
import Head from "next/head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate structured data on client side
  useEffect(() => {
    const organizationSchema = generateOrganizationSchema();
    const websiteSchema = generateWebsiteSchema();

    // Add structured data to head
    const addStructuredData = (data: Record<string, unknown>) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    addStructuredData(organizationSchema);
    addStructuredData(websiteSchema);

    return () => {
      // Cleanup structured data scripts
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/icon.png" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Colors */}
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        
        {/* SEO Meta Tags */}
        <title>SPECTRUM EYECARE - Your Vision, Our Focus</title>
        <meta name="description" content="Premium eyewear collection with quality sunglasses, eyeglasses, and contact lenses. Your vision is our focus." />
        <meta name="keywords" content="eyewear, sunglasses, eyeglasses, contact lenses, vision, optical, SPECTRUM" />
        <meta name="author" content="SPECTRUM EYECARE" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SPECTRUM EYECARE - Your Vision, Our Focus" />
        <meta property="og:description" content="Premium eyewear collection with quality sunglasses, eyeglasses, and contact lenses. Your vision is our focus." />
        <meta property="og:image" content="https://spec-9233a.web.app/thumnail.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="SPECTRUM EYECARE - Premium Eyewear Collection" />
        <meta property="og:url" content="https://spec-9233a.web.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="SPECTRUM EYECARE" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SPECTRUM EYECARE - Your Vision, Our Focus" />
        <meta name="twitter:description" content="Premium eyewear collection with quality sunglasses, eyeglasses, and contact lenses. Your vision is our focus." />
        <meta name="twitter:image" content="https://spec-9233a.web.app/thumnail.png" />
        <meta name="twitter:image:alt" content="SPECTRUM EYECARE - Premium Eyewear Collection" />
        <meta name="twitter:site" content="@spectrum" />
        <meta name="twitter:creator" content="@spectrum" />
        
        {/* Additional Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SPECTRUM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SPECTRUM EYECARE" />
        
        {/* Suppress warnings and errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress various warnings and errors
              (function() {
                const originalWarn = console.warn;
                const originalError = console.error;
                
                console.warn = function(message) {
                  if (typeof message === 'string') {
                    // Suppress CSS preload warnings
                    if (message.includes('preloaded using link preload')) {
                      return;
                    }
                    // Suppress Swiper loop warnings
                    if (message.includes('Swiper Loop Warning') || message.includes('number of slides is not enough for loop mode')) {
                      return;
                    }
                  }
                  originalWarn.apply(console, arguments);
                };
                
                console.error = function(message) {
                  if (typeof message === 'string') {
                    // Suppress RSC payload errors
                    if (message.includes('Failed to fetch RSC payload') || message.includes('Falling back to browser navigation')) {
                      return;
                    }
                  }
                  originalError.apply(console, arguments);
                };
                
                // Convert preload links to stylesheets
                function convertPreloadLinks() {
                  const preloadLinks = document.querySelectorAll('link[rel="preload"][href*=".css"]');
                  preloadLinks.forEach(link => {
                    if (!link.getAttribute('as') || link.getAttribute('as') !== 'style') {
                      link.setAttribute('as', 'style');
                      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
                    }
                  });
                }
                
                // Run immediately and on DOM ready
                convertPreloadLinks();
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', convertPreloadLinks);
                }
                
                // Monitor for new preload links
                const observer = new MutationObserver(convertPreloadLinks);
                observer.observe(document.head, { childList: true, subtree: true });
                
                // Periodic check
                setInterval(convertPreloadLinks, 1000);
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <AppProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <PageTransition>
                    {children}
                  </PageTransition>
                </main>
                <Footer />
                <ScrollToTop />
              </div>
            </AppProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
