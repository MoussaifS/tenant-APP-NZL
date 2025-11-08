'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LocaleLayout from '../../components/LocaleLayout';
import BottomNavigation from '../components/BottomNavigation';
import { getMessages } from '@/messages';
import { Button } from '@/components/ui/button';

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
    if (!['en', 'ar', 'es', 'zh'].includes(locale)) {
      router.push('/en/partners');
    }
  }, [locale, router]);

  if (isLoading) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center">
          <div className="text-[#274754]">Loading...</div>
        </div>
      </LocaleLayout>
    );
  }

  const t = getMessages(locale as 'en' | 'ar' | 'es' | 'zh');
  const isRTL = locale === 'ar';

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/^0+/, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWebsite = (url: string) => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank');
  };

  const handleWhatsApp = (phone: string, partnerName: string) => {
    const cleanPhone = phone.replace(/^0+/, '');
    const message = locale === 'ar'
      ? `مرحباً! أنا ضيف في ${partnerName} وأود الاستفسار عن الخدمات المتاحة.`
      : `Hello! I'm a guest interested in ${partnerName} services.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-[#FAF6F5] pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-[#EDEBED] sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2 text-[#274754] hover:bg-[#EDEBED] -ml-2"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold text-[#274754]">{t.partners.title}</h1>
                <p className="text-sm text-[#94782C]">{t.partners.subtitle}</p>
              </div>
              <div className="w-10"></div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Mezwalah - Concierge Services */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBED]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#DECFBC] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#274754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#274754]">{t.partners.mezwalah.name}</h2>
                <p className="text-xs text-[#94782C]">{t.partners.conciergeServices}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#274754] leading-relaxed mb-4">
              {t.partners.mezwalah.description}
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleWebsite(t.partners.mezwalah.website)}
                className="w-full py-3 bg-[#274754] text-white rounded-xl font-medium hover:bg-[#94782C] transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {t.partners.visitWebsite}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCall(t.partners.mezwalah.phone)}
                  className="py-3 bg-[#DECFBC] text-[#274754] rounded-xl font-medium hover:bg-[#CDB990] transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t.partners.callNow}
                </button>
                <button
                  onClick={() => handleWhatsApp(t.partners.mezwalah.phone, t.partners.mezwalah.name)}
                  className="py-3 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#1fa855] transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Noon Minutes - Coupons */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBED]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D2CFC4] flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#274754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#274754]">{t.partners.noonMinutes.name}</h2>
                <p className="text-xs text-[#94782C]">{t.partners.coupons}</p>
              </div>
              <div className="bg-[#CDB990] text-white text-xs font-bold px-3 py-1 rounded-full">
                {t.partners.noonMinutes.couponsAvailable}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#274754] leading-relaxed mb-4">
              {t.partners.noonMinutes.description}
            </p>

            {/* Action */}
            <button
              onClick={() => {
                const message = locale === 'ar'
                  ? `مرحباً! أنا ضيف وأود الحصول على كوبونات وخصومات من ${t.partners.noonMinutes.name}.`
                  : `Hello! I'm a guest and would like to get coupons and discounts from ${t.partners.noonMinutes.name}.`;
                const encodedMessage = encodeURIComponent(message);
                window.open(`https://wa.me/966500000000?text=${encodedMessage}`, '_blank');
              }}
              className="w-full py-3 bg-[#CDB990] text-white rounded-xl font-medium hover:bg-[#94782C] transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {t.partners.getCoupons}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-[#DECFBC] bg-opacity-30 rounded-2xl p-4 border border-[#CDB990] border-opacity-30">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#274754] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#274754]">
                {locale === 'ar' 
                  ? 'تواصل مع شركائنا للاستفادة من الخدمات والخصومات الحصرية المتاحة لضيوفنا.'
                  : 'Contact our partners to take advantage of exclusive services and discounts available to our guests.'}
              </p>
            </div>
          </div>
        </div>

        <BottomNavigation locale={locale} />
      </div>
    </LocaleLayout>
  );
}
