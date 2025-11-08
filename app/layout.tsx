import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import Script from "next/script";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guest Portal",
  description: "Your personalized guest experience portal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout - html/body attributes will be updated by [locale]/layout.tsx
  // suppressHydrationWarning prevents hydration mismatch warnings
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Script to set HTML attributes IMMEDIATELY before React hydrates */}
        <Script
          id="set-locale-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var pathname = window.location.pathname;
                  var pathSegments = pathname.split('/').filter(Boolean);
                  var locale = pathSegments[0] || 'en';
                  var supportedLocales = ['en', 'ar', 'es', 'zh'];
                  
                  if (supportedLocales.includes(locale)) {
                    document.documentElement.setAttribute('lang', locale);
                    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
                    
                    if (locale === 'ar') {
                      document.body.classList.add('rtl');
                      document.body.setAttribute('dir', 'rtl');
                    } else {
                      document.body.classList.remove('rtl');
                      document.body.setAttribute('dir', 'ltr');
                    }
                  }
                } catch(e) {
                  console.error('Error setting locale attributes:', e);
                }
              })();
            `,
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}