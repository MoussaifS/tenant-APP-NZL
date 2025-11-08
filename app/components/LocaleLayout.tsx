'use client';

import { useEffect, useLayoutEffect } from 'react';

interface LocaleLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function LocaleLayout({ children, locale }: LocaleLayoutProps) {
  // Use useLayoutEffect to run synchronously before browser paint
  useLayoutEffect(() => {
    // Update HTML attributes immediately to prevent flash
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      
      // Add RTL-specific classes for better Arabic support
      if (locale === 'ar') {
        document.body.classList.add('rtl');
        document.body.setAttribute('dir', 'rtl');
      } else {
        document.body.classList.remove('rtl');
        document.body.setAttribute('dir', 'ltr');
      }
    }
  }, [locale]);

  // Also set it in useEffect as fallback
  useEffect(() => {
    if (typeof document !== 'undefined') {
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
  }, [locale]);

  const isRTL = locale === 'ar';

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen`} dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      {children}
    </div>
  );
}