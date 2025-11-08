'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('en');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Get current locale from URL
    const pathname = window.location.pathname;
    const urlLocale = pathname.split('/')[1];
    if (['en', 'ar', 'es', 'zh'].includes(urlLocale)) {
      setCurrentLocale(urlLocale);
    }
  }, []);

  const switchLocale = (newLocale: string) => {
    // Set the NEXT_LOCALE cookie
    // This line sets a cookie named "NEXT_LOCALE" to store the selected language/locale.
    // The cookie will be available for the entire site (path=/) and set to expire in one hour (3600 seconds).
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=3600`;
    
    // Get current pathname without locale
    const pathname = window.location.pathname;
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'es', name: 'Español', dir: 'ltr' },
    { code: 'zh', name: '中文', dir: 'ltr' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div dir={currentLanguage.dir}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/30 ${
              currentLanguage.dir === 'rtl' ? 'flex-row-reverse' : ''
            }`}
            aria-label={`Switch language - Current: ${currentLanguage.name}`}
            title={`Current: ${currentLanguage.name} - Click to select language`}
          >
            <Globe className="w-4 h-4 transition-colors duration-200 group-hover:text-blue-200" />
            <span className={`text-xs font-semibold tracking-wide ${
              currentLanguage.dir === 'rtl' ? 'font-arabic' : ''
            }`}>
              {currentLanguage.code.toUpperCase()}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-56 p-2 bg-white/95 backdrop-blur-md border border-white/20 shadow-lg"
          align="end"
          sideOffset={8}
        >
          <div className="space-y-1">
            {languages.map((language) => {
              const isSelected = language.code === currentLocale;
              return (
                <button
                  key={language.code}
                  onClick={() => switchLocale(language.code)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50 ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  } ${language.dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  aria-label={`Switch to ${language.name}`}
                >
                  <div className={`flex items-center gap-2 ${language.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className={`${language.dir === 'rtl' ? 'font-arabic' : ''}`}>
                      {language.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language.code.toUpperCase()}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}