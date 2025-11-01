'use client';

interface UnitLockAmenityProps {
  locale?: string;
}

export default function UnitLockAmenity({ locale = 'en' }: UnitLockAmenityProps) {
  const isRTL = locale === 'ar';
  return (
    <div className="space-y-4">
      <div>
        <p className={`text-sm font-medium text-gray-600 mb-2 ${isRTL ? 'text-right' : ''}`}>{isRTL ? 'رمز الوصول' : 'Access Code'}</p>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-2xl font-bold text-gray-800">1234</p>
              <p className="text-xs text-gray-500">{isRTL ? 'رمز مكون من 4 أرقام' : '4-digit code'}</p>
            </div>
          </div>
          <button
            className="ml-3 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
            onClick={() => {
              navigator.clipboard.writeText('1234');
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{isRTL ? 'نسخ' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className={`font-semibold text-blue-800 mb-1 ${isRTL ? 'font-arabic' : ''}`}>{isRTL ? 'طريقة الاستخدام' : 'How to use'}</h4>
            <ul className={`text-sm text-blue-700 space-y-1 ${isRTL ? 'font-arabic' : ''}`}>
              <li>• {isRTL ? 'أدخل الرمز المكون من 4 أرقام على لوحة المفاتيح' : 'Enter the 4-digit code on the keypad'}</li>
              <li>• {isRTL ? 'اضغط على زر الفتح أو زر #' : 'Press the unlock button or # key'}</li>
              <li>• {isRTL ? 'سيتم فتح الباب تلقائيًا' : 'The door will unlock automatically'}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-700 font-medium">{isRTL ? 'حافظ على سرية هذا الرمز ولا تشاركه' : "Keep this code secure and don't share it with others"}</p>
        </div>
      </div>
    </div>
  );
}


