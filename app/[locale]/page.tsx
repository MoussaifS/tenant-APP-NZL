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

// Translation content
const translations = {
  en: {
    welcome: "Welcome",
    guestName: "Hassan Ahmed",
    searchPlaceholder: "Find something you want...",
    checkIn: "Check-in",
    checkOut: "Check-out",
    amenities: "Amenities",
    seeMore: "See More",
    wifi: "Wifi",
    features: "Features",
    unitLock: "Unit Lock",
    parking: "Parking",
    currentReservation: "Current Reservation",
    location: "Riyadh",
    home: "Home",
    notifications: "Notification",
    support: "Support",
    profile: "Profile",
    partnerServices: "Services",
    exploreServices: "Explore our partner providers for additional services and support"
  },
  ar: {
    welcome: "مرحباً",
    guestName: "حسن أحمد",
    searchPlaceholder: "ابحث عن شيء تريده...",
    checkIn: "تاريخ الوصول",
    checkOut: "تاريخ المغادرة",
    amenities: "المرافق",
    seeMore: "المزيد",
    wifi: "الواي فاي",
    features: "المميزات",
    unitLock: "قفل الوحدة",
    parking: "الموقف",
    currentReservation: "الحجز الحالي",
    location: "الرياض",
    home: "الرئيسية",
    notifications: "الإشعارات",
    support: "الدعم",
    profile: "الملف الشخصي",
    partnerServices: "الخدمات",
    exploreServices: "استكشف مقدمي الخدمات الشركاء للحصول على خدمات ودعم إضافي"
  }
};

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

  const t = translations[locale as keyof typeof translations];
  // const isRTL = locale === 'ar';

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-gray-50 pb-20">
        <WelcomeHeader 
          welcome={t.welcome} 
          guestName={t.guestName}
         
        />
        
       

        <CheckInOutDates 
          checkIn={t.checkIn}
          checkOut={t.checkOut}
          checkInDate="6-10-2025"
          checkOutDate="6-11-2026"
        />

        <AmenitiesSection 
          amenities={t.amenities}
          seeMore={t.seeMore}
          wifi={t.wifi}
          features={t.features}
          unitLock={t.unitLock}
          parking={t.parking}
        />

        

        <PartnerServices 
          partnerServices={t.partnerServices}
          exploreServices={t.exploreServices}
          locale={locale}
        />

<CurrentReservation 
          currentReservation={t.currentReservation}
          location={t.location}
        />

        <BottomNavigation />
      </div>
    </LocaleLayout>
  );
}
