// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import { VitalsAndTiming } from "./vitals.client";
import Footer from "./(components)/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "verdeback - Save greenbacks with verdeback",
  description: "Ultra-performant product catalog using DummyJSON",
  icons: {
    icon: "/favicon.svg",
  },
};

/**
 * Root layout wrapping the app with global styles, header/footer, and vitals.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://dummyjson.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  if (!theme) {
                    localStorage.setItem('theme', 'dark');
                  }
                }
                // Mark navStart on link click for vitals
                window.addEventListener('click', function(e) {
                  var a = e.target.closest && e.target.closest('a[href]');
                  if (a && a.origin === location.origin) {
                    window.__perfMarks = window.__perfMarks || {};
                    window.__perfMarks.navStart = performance.now();
                    console.log('[VITALS] navStart', window.__perfMarks.navStart);
                  }
                }, { capture: true });
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 pt-16">
          {children}
          <VitalsAndTiming />
        </main>
        <Footer />
      </body>
    </html>
  );
}
