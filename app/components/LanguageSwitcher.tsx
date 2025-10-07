'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    // Get current locale from URL
    const pathname = window.location.pathname;
    const urlLocale = pathname.split('/')[1];
    if (['en', 'ar'].includes(urlLocale)) {
      setCurrentLocale(urlLocale);
    }
  }, []);

  const switchLocale = (newLocale: string) => {
    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Get current pathname without locale
    const pathname = window.location.pathname;
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';
    switchLocale(newLocale);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded text-xs font-medium bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
    >
      EN/AR
    </button>
  );
}
