'use client';

import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useAuth } from '../../components/AuthProvider';
import { Button } from '../../../components/ui/button';
import { getMessages } from '@/messages';

interface WelcomeHeaderProps {
  locale: string;
}

export default function WelcomeHeader({ locale }: WelcomeHeaderProps) {
  const { logout } = useAuth();
  const isRTL = locale === 'ar';
  
  // Get translations from messages files
  const t = getMessages(locale as 'en' | 'ar');
  
  // Font style based on locale
  const welcomeFontFamily = isRTL 
    ? 'var(--font-welcome-ar)' 
    : 'var(--font-welcome-en)';
  
  return (
    <div className="bg-[#CDB990] relative overflow-hidden rounded-b-[40px]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle texture overlay */}
      
      <div className="relative py-10 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12">
        {/* Logout Button */}
        <div className={`absolute top-6 ${isRTL ? 'left-6 sm:left-8' : 'right-6 sm:right-8'}`}>
          {/* <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {t.logout}
          </Button> */}
          <LanguageSwitcher />
        </div>

        {/* Language Switcher */}
        {/* <div className={`absolute top-6 ${isRTL ? 'right-6 sm:right-8' : 'left-6 sm:left-8'}`}>
          <LanguageSwitcher />
        </div> */}
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h1 
            className={`text-white ${isRTL ? 'font-normal' : 'font-thin tracking-tight'}`}
            style={{ fontFamily: welcomeFontFamily }}
          >
            {/* Welcome line */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-medium mb-2">
              {t.welcomeTo}
            </div>
            
            {/* Main title line */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {t.yourSecondHome}
            </div>
            
            {/* Brand line */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-medium ">
              {t.withNuzul}
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
}