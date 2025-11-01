'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../components/LocaleLayout';
import WelcomeHeader from './components/WelcomeHeader';
import CheckInOutDates from './components/CheckInOutDates';
import AmenitiesSection from './components/AmenitiesSection';
import CurrentReservation from './components/CurrentReservation';
import PartnerServices from './components/PartnerServices';
import BottomNavigation from './components/BottomNavigation';
import { getMessages } from '@/messages';

// Translations moved to messages folder

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get locale from params
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
      setIsLoading(false);
    });
  }, [params]);

  useEffect(() => {
    // Validate locale
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en');
      return;
    }
  }, [locale, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const t = getMessages(locale as 'en' | 'ar');
  // const isRTL = locale === 'ar';

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-gray-50 pb-20">
        <WelcomeHeader 
          locale={locale}
        />
        
       

        <CheckInOutDates locale={locale} />

        <AmenitiesSection 
          amenities={t.amenities}
          wifi={t.wifi}
          features={t.features}
          unitLock={t.unitLock}
          parking={t.parking}
        />

        

        <PartnerServices 
          locale={locale}       />

{/* <CurrentReservation 
          currentReservation={t.currentReservation}
          location={t.location}
        /> */}

        <BottomNavigation locale={locale} />
      </div>
    </LocaleLayout>
  );
}
