'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchUnitLockData, UnitLockData } from '@/lib/apiUtils';
import { getBookingDataFromStorage } from '@/lib/bookingUtils';
import { getMessages } from '@/messages';

interface UnitLockAmenityProps {
  locale?: string;
  isOpen?: boolean; // Track if dialog is open
}

export default function UnitLockAmenity({ locale, isOpen = false }: UnitLockAmenityProps) {
  const params = useParams();
  const currentLocale = useMemo(() => {
    // Prioritize params.locale from URL if locale prop is not explicitly provided
    // This ensures URL-based locale routing works correctly
    const urlLocale = params?.locale as string;
    const finalLocale = locale || urlLocale || 'en';
    return finalLocale as 'en' | 'ar' | 'es' | 'zh';
  }, [locale, params?.locale]);

  const isRTL = currentLocale === 'ar';
  const t = useMemo(() => {
    const messages = getMessages(currentLocale);
    // Debug: Log to verify translations are loaded
    if (typeof window !== 'undefined') {
      console.log('Translation check:', {
        locale: currentLocale,
        hasUnitLockDetails: !!messages?.unitLockDetails,
        unitLockDetailsKeys: messages?.unitLockDetails ? Object.keys(messages.unitLockDetails) : []
      });
    }
    return messages;
  }, [currentLocale]);
  const [unitLockData, setUnitLockData] = useState<UnitLockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const bookingData = getBookingDataFromStorage();
      if (!bookingData || !bookingData.reference) {
        setError(t.unitLockDetails.bookingDataNotAvailable);
        setIsLoading(false);
        return;
      }

      const data = await fetchUnitLockData(bookingData.reference);
      if (data) {
        setUnitLockData(data);
      } else {
        setError(t.unitLockDetails.unitLockDataNotFound);
      }
    } catch (err) {
      console.error('Error fetching unit lock data:', err);
      setError(err instanceof Error ? err.message : t.unitLockDetails.failedToFetchData);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // Fetch data when dialog opens
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here if needed
  };

  // Get unit display text (highlight the unit)
  const getUnitDisplay = () => {
    if (!unitLockData?.unit) {
      return null;
    }
    return unitLockData.unit;
  };

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className={`ml-3 text-gray-600 ${isRTL ? 'mr-3 ml-0' : ''}`}>
            {t.unitLockDetails.loading}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className={`text-sm text-red-700 font-medium ${isRTL ? 'font-arabic' : ''}`}>{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && unitLockData && (
        <>
          {/* Unit Number Display */}
          {getUnitDisplay() && (
            <div>
              <p className={`text-sm font-medium text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t.unitLockDetails.unitNumber}
              </p>
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 p-4 rounded-xl">
                <p className={`font-mono text-2xl font-bold text-green-800 text-center ${isRTL ? 'font-arabic' : ''}`}>
                  {getUnitDisplay()}
                </p>
              </div>
            </div>
          )}

          {/* Building Password Section (only if exists) */}
          {unitLockData.buildingPassword && (
            <div>
              <p className={`text-sm font-medium text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t.unitLockDetails.buildingPassword}
                {unitLockData.development && (
                  <span className={`text-xs text-gray-500 ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>
                    ({unitLockData.development})
                  </span>
                )}
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-mono text-2xl font-bold text-blue-800">{unitLockData.buildingPassword}</p>
                    {unitLockData.development && (
                      <p className={`text-xs text-blue-600 ${isRTL ? 'text-right font-arabic' : ''}`}>
                        {t.unitLockDetails.development}: {unitLockData.development}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  className={`p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 ${isRTL ? 'ml-0 mr-3' : 'ml-3'}`}
                  onClick={() => copyToClipboard(unitLockData.buildingPassword || '')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">{t.unitLockDetails.copy}</span>
                </button>
              </div>
            </div>
          )}

          {/* Apartment Password Section (most important) */}
          {unitLockData.apartmentPassword && (
            <div>
              <p className={`text-sm font-medium text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>
                {t.unitLockDetails.apartmentPassword}
              </p>
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-mono text-2xl font-bold text-green-800">{unitLockData.apartmentPassword}</p>
                  </div>
                </div>
                <button
                  className={`p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 ${isRTL ? 'ml-0 mr-3' : 'ml-3'}`}
                  onClick={() => copyToClipboard(unitLockData.apartmentPassword || '')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">{t.unitLockDetails.copy}</span>
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className={`font-semibold text-blue-800 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                  {t.unitLockDetails.howToUse}
                </h4>
                <ul className={`text-sm text-blue-700 space-y-1 ${isRTL ? 'font-arabic' : ''}`}>
                  {unitLockData.buildingPassword && (
                    <li>• {t.unitLockDetails.buildingPasswordInstruction}</li>
                  )}
                  <li>• {t.unitLockDetails.instruction1}</li>
                  <li>• {t.unitLockDetails.instruction2}</li>
                  <li>• {t.unitLockDetails.instruction3}</li>
                </ul>
              </div>
            </div>
          </div> */}
        </>
      )}

      {/* Fallback if no data is available */}
      {!isLoading && !error && !unitLockData && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className={`text-sm text-gray-600 text-center ${isRTL ? 'font-arabic' : ''}`}>
            {t.unitLockDetails.noDataAvailable}
          </p>
        </div>
      )}
    </div>
  );
}
