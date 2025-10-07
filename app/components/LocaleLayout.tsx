'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LocaleLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function LocaleLayout({ children, locale }: LocaleLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Set the lang attribute on the html element
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Add RTL-specific classes for better Arabic support
    if (locale === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [locale]);

  return (
    <div className={`${locale === 'ar' ? 'rtl' : 'ltr'} min-h-screen`}>
      {children}
    </div>
  );
}
