'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../../components/LocaleLayout';
import BottomNavigation from '../components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { getBookingDataFromStorage } from '../../../lib/bookingUtils';
import { getMessages } from '@/messages';
import { fetchUnits, extractUnitNumber, Unit } from '@/lib/apiUtils';

export default function UnitInformation({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isRTL = locale === 'ar';
  const t = getMessages(locale as 'en' | 'ar');

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  }, [params]);

  useEffect(() => {
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en/unit-information');
      return;
    }
  }, [locale, router]);

  useEffect(() => {
    const loadUnitData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const bookingData = getBookingDataFromStorage();
        const currentT = getMessages(locale as 'en' | 'ar');
        if (!bookingData) {
          setError(currentT.noBookingDataFound);
          return;
        }

        const unitNumber = extractUnitNumber(bookingData.accommodation);
        if (!unitNumber) {
          setError(currentT.unableToExtractUnitNumber);
          return;
        }

        const units = await fetchUnits();
        const unit = units.find(u => u.Reference === unitNumber);
        
        if (!unit) {
          setError(currentT.unitNotFound.replace('{unitNumber}', unitNumber));
          return;
        }

        setCurrentUnit(unit);
      } catch (err) {
        console.error('Error loading unit data:', err);
        const currentT = getMessages(locale as 'en' | 'ar');
        setError(currentT.failedToLoadUnitInfo);
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitData();
  }, [locale]);

  if (isLoading) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#274754] mx-auto mb-4"></div>
            <p className="text-[#274754]">{t.loadingUnitInfo}</p>
          </div>
        </div>
      </LocaleLayout>
    );
  }

  if (error || !currentUnit) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="text-center p-6">
            <div className="text-[#274754] text-lg mb-4">⚠️</div>
            <p className="text-[#274754] mb-4">{error || t.unitInfoNotAvailable}</p>
            <Button 
              onClick={() => router.back()}
              className="bg-[#274754] hover:bg-[#94782C] text-white"
            >
              {t.goBack}
            </Button>
          </div>
        </div>
      </LocaleLayout>
    );
  }

  const handleGoogleMapsClick = () => {
    const location = `${currentUnit.Location}`;
    window.open(`${location}`, '_blank');
  };

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-[#FAF6F5] pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2 text-[#274754] hover:bg-gray-100 -ml-2"
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
              <h1 className="text-xl font-bold text-[#274754]">{t.unitInformation}</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Unit Header Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBED]">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-[#94782C] mb-1">{t.reference}</p>
                <h2 className="text-2xl font-bold text-[#274754]">{currentUnit.Reference}</h2>
              </div>
              <div className="text-4xl">🏠</div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[#94782C]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{currentUnit.Development}</span>
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#EDEBED]">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-xs text-[#94782C] font-medium ${isRTL ? 'text-right flex-1' : ''}`}>{t.units}</p>
              </div>
              <p className={`text-xl font-bold text-[#274754] ${isRTL ? 'text-right' : ''}`}>{currentUnit.Units}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#EDEBED]">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-xs text-[#94782C] font-medium ${isRTL ? 'text-right flex-1' : ''}`}>{t.floor}</p>
              </div>
              <p className={`text-xl font-bold text-[#274754] ${isRTL ? 'text-right' : ''}`}>{currentUnit.Floor}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#EDEBED]">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-xs text-[#94782C] font-medium ${isRTL ? 'text-right flex-1' : ''}`}>{t.tourismLicense}</p>
              </div>
              <p className={`text-sm font-bold text-[#274754] ${isRTL ? 'text-right' : ''}`}>{currentUnit.Tourism_License}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#EDEBED]">
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-xs text-[#94782C] font-medium ${isRTL ? 'text-right flex-1' : ''}`}>{t.parking}</p>
              </div>
              <p className={`text-xl font-bold text-[#274754] ${isRTL ? 'text-right' : ''}`}>{currentUnit.Parking}</p>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBED]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#DECFBC] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#274754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-xs text-[#94782C]">{t.neighborhood}</p>
                <p className="font-bold text-[#274754]">{currentUnit.Neighborhood}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleGoogleMapsClick}
              className="w-full bg-[#274754] hover:bg-[#94782C] text-white font-medium py-3 rounded-xl shadow-sm"
            >
              <svg 
                className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {t.googleMaps}
            </Button>
          </div>

          {/* Check-in Instructions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDEBED]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#DECFBC] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#274754]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-lg font-bold text-[#274754] ${isRTL ? 'text-right flex-1' : ''}`}>
                {t.checkInInstructions}
              </h3>
            </div>

            <div className="space-y-3">
              {t.checkInSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#CDB990] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className={`text-sm text-[#274754] flex-1 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNavigation locale={locale} />
      </div>
    </LocaleLayout>
  );
}