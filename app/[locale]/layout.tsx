import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "../globals.css";
import LocaleLayoutClient from "../components/LocaleLayout";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guest Guest",
  description: "Your personalized guest experience portal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ar' },
    { locale: 'es' },
    { locale: 'zh' },
  ];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Wrap with LocaleLayoutClient to set HTML attributes synchronously
  return (
    <LocaleLayoutClient locale={locale}>
      {children}
    </LocaleLayoutClient>
  );
}

