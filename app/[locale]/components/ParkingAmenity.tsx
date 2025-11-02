'use client';

import { useEffect, useMemo, useState } from 'react';
import { Car } from 'lucide-react';
import { getBookingDataFromStorage } from '@/lib/bookingUtils';
import { getCurrentUnit, Unit } from '@/lib/apiUtils';

interface ParkingAmenityProps {
  locale?: string;
}

export default function ParkingAmenity({ locale = 'en' }: ParkingAmenityProps) {
  const isRTL = locale === 'ar';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);

  useEffect(() => {
    const loadUnit = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bookingData = getBookingDataFromStorage();
        if (!bookingData) {
          setError(isRTL ? 'لا تتوفر بيانات الحجز' : 'No booking data found');
          return;
        }
        const unit = await getCurrentUnit(bookingData.accommodation);
        if (!unit) {
          setError(isRTL ? 'لم يتم العثور على الوحدة أو تم رفض الوصول' : 'Unit not found or access denied');
          return;
        }
        setCurrentUnit(unit);
      } catch (e) {
        setError(isRTL ? 'فشل تحميل معلومات الوحدة' : 'Failed to load unit information');
      } finally {
        setIsLoading(false);
      }
    };
    loadUnit();
  }, [isRTL]);

  const parkingType = useMemo(() => {
    const raw = (currentUnit?.Parking || '').toLowerCase().trim();
    if (!raw) return '';
    if (raw.includes('outside') && raw.includes('lock')) return 'outside_lock';
    if (raw.includes('outside')) return 'outside';
    if (raw.includes('basement') || raw.includes('underground')) return 'basement';
    if (raw.includes('public')) return 'public';
    return 'other';
  }, [currentUnit]);

  const title = isRTL ? 'موقف السيارات' : 'Parking Information';
  const details = useMemo(() => {
    switch (parkingType) {
      case 'outside':
        return isRTL
          ? 'الموقف خارج المبنى وغالبًا ما يكون مرقّمًا للوحدة'
          : 'Outside the building; usually numbered for the unit.';
      case 'outside_lock':
        return isRTL
          ? 'الموقف خارج المبنى مع قفل'
          : 'Outside the building with a lock.';
      case 'basement':
        return isRTL
          ? 'الموقف في قبو المبنى'
          : 'Basement of the building.';
      case 'public':
        return isRTL
          ? 'موقف عام متاح بالقرب من المبنى'
          : 'Public parking available nearby.';
      case 'other':
      default:
        return currentUnit?.Parking || (isRTL ? 'تفاصيل الموقف غير متاحة' : 'Parking details not available');
    }
  }, [parkingType, isRTL, currentUnit]);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Car className="w-4 h-4 text-purple-600" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className={`font-semibold text-purple-800 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
              {title}
            </h4>
            {isLoading ? (
              <p className={`text-sm text-purple-700 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'جارٍ التحميل...' : 'Loading...'}
              </p>
            ) : error ? (
              <p className={`text-sm text-red-600 ${isRTL ? 'font-arabic' : ''}`}>
                {error}
              </p>
            ) : (
              <p className={`text-sm text-purple-700 ${isRTL ? 'font-arabic' : ''}`}>
                {details}
              </p>
            )}
          </div>
        </div>
      </div>

      {!isLoading && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h4 className={`font-semibold text-blue-800 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                {isRTL ? 'تعليمات الموقف' : 'Parking Instructions'}
              </h4>
              <ul className={`text-sm text-blue-700 space-y-1 ${isRTL ? 'font-arabic' : ''}`}>
                {parkingType === 'outside' && (
                  <li>• {isRTL ? 'أماكن المواقف خارج المبنى وغالبًا تكون مرقّمة' : 'Spots are outside the building and usually numbered.'}</li>
                )}
                {parkingType === 'outside_lock' && (
                  <li>• {isRTL ? 'استخدم القفل المخصص لمكانك' : 'Use the designated lock for your spot.'}</li>
                )}
                {parkingType === 'basement' && (
                  <li>• {isRTL ? 'اتبع لافتات القبو للوصول إلى المواقف' : 'Follow basement signage to access parking.'}</li>
                )}
                {parkingType === 'public' && (
                  <li>• {isRTL ? 'قد تنطبق رسوم على المواقف العامة' : 'Public parking may incur fees.'}</li>
                )}
                <li>• {isRTL ? 'يرجى ركن سيارتك ضمن المساحة المحددة' : 'Please park within the marked lines.'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
