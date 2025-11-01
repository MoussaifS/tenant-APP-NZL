'use client';

interface FeaturesAmenityProps {
  locale?: string;
}


export default function FeaturesAmenity({ locale = 'en' }: FeaturesAmenityProps) {

  console.log('FeaturesAmenity', locale);

  const isRTL = locale === 'ar';
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
      <div className="space-y-3">
        <div className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a1 1 0 011-1h14a1 1 0 010 2H3A1 1 0 012 5zm0 5a1 1 0 011-1h10a1 1 0 010 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 010 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`font-medium text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'Wi‑Fi' : 'Wi‑Fi'}
            </span>
          </div>
          <span className="text-green-600 font-bold">✓</span>
        </div>

        <div className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h2l1 2h8l1-2h2a1 1 0 100-2H3zm2 6a2 2 0 00-2 2v4a2 2 0 002 2h10a2 2 0 002-2v-4a2 2 0 00-2-2H5z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`font-medium text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'موقف سيارات' : 'Parking'}
            </span>
          </div>
          <span className="text-green-600 font-bold">✓</span>
        </div>

        <div className={`flex items-center justify-between p-2 bg-white rounded-lg shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v6h12V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm-3 14a3 3 0 006 0H7z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`font-medium text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'دعم 24/7' : '24/7 Support'}
            </span>
          </div>
          <span className="text-green-600 font-bold">✓</span>
        </div>
      </div>
    </div>
  );
}


