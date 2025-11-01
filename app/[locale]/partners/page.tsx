'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LocaleLayout from '../../components/LocaleLayout';
import PartnerServices from '../components/PartnerServices';
import BottomNavigation from '../components/BottomNavigation';

const translations = {
  en: {
    partnerServices: 'Services',
    exploreServices: 'Explore our partner providers for additional services and support',
    destinationManagement: 'Travel & Tourism',
    couponsDiscounts: 'Deals & Discounts',
    foodDelivery: 'Food & Dining',
    transportation: 'Transportation',
    wellness: 'Health & Wellness',
    entertainment: 'Entertainment',
    contactPartner: 'Contact',
    viewOffers: 'Learn More',
    joinAsPartner: 'Join as Partner',
    featuredPartners: 'Featured Partners',
    allPartners: 'All Partners',
    bookNow: 'Book Now',
    callNow: 'Call Now',
  },
  ar: {
    partnerServices: 'الخدمات',
    exploreServices: 'استكشف مقدمي الخدمات الشركاء للحصول على خدمات ودعم إضافي',
    destinationManagement: 'السفر والسياحة',
    couponsDiscounts: 'العروض والخصومات',
    foodDelivery: 'الطعام والمطاعم',
    transportation: 'النقل',
    wellness: 'الصحة والعافية',
    entertainment: 'الترفيه',
    contactPartner: 'اتصل',
    viewOffers: 'اعرف المزيد',
    joinAsPartner: 'انضم كشريك',
    featuredPartners: 'الشركاء المميزون',
    allPartners: 'جميع الشركاء',
    bookNow: 'احجز الآن',
    callNow: 'اتصل الآن',
  },
};

export default function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
      setIsLoading(false);
    });
  }, [params]);

  useEffect(() => {
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en/partners');
    }
  }, [locale, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const t = translations[locale as keyof typeof translations];

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <h1 className="text-lg font-semibold text-gray-800">{t.partnerServices}</h1>
          </div>
        </div>

        <PartnerServices 
          partnerServices={t.partnerServices}
          exploreServices={t.exploreServices}
          locale={locale}
          translations={t}
        />

        <BottomNavigation locale={locale} />
      </div>
    </LocaleLayout>
  );
}


