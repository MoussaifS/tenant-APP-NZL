'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

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

  const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div dir={currentLanguage.dir}>
      <button
        onClick={toggleLanguage}
        className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30 ${
          currentLanguage.dir === 'rtl' ? 'flex-row-reverse' : ''
        }`}
        aria-label={`Switch to ${currentLocale === 'en' ? 'Arabic' : 'English'}`}
        title={`Current: ${currentLanguage.name} - Click to switch to ${currentLocale === 'en' ? 'Arabic' : 'English'}`}
      >
        <Globe className="w-4 h-4 transition-colors duration-200 group-hover:text-blue-200" />
        <span className={`text-xs font-semibold tracking-wide ${
          currentLanguage.dir === 'rtl' ? 'font-arabic' : ''
        }`}>
          {currentLanguage.code.toUpperCase()}
        </span>
      </button>
    </div>
  );
}