'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { getMessages } from '@/messages';

type SelectedDays = number | 'custom';

interface ExtensionDaysModalProps {
  locale?: string;
  open: boolean;
  selectedDays: SelectedDays;
  customDays: number;
  onClose: () => void;
  onConfirm: () => void;
  onDaySelect: (days: SelectedDays) => void;
  onCustomDaysChange: (days: number) => void;
}

export default function ExtensionDaysModal({
  locale = 'en',
  open,
  selectedDays,
  customDays,
  onClose,
  onConfirm,
  onDaySelect,
  onCustomDaysChange,
}: ExtensionDaysModalProps) {
  const currentLocale = (locale || 'en') as 'en' | 'ar' | 'es' | 'zh';
  const isRTL = currentLocale === 'ar';
  const t = getMessages(currentLocale);

  if (!open) return null;

  const dayOptions = [
    { value: 1 as SelectedDays, label: t.oneDay },
    { value: 5 as SelectedDays, label: t.fiveDays },
    { value: 30 as SelectedDays, label: t.oneMonth },
    { value: 'custom' as SelectedDays, label: t.custom },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
        <div className={`flex justify-between items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-800">{t.extendStayTitle}</h3>
          <button
            onClick={onClose}
            className={`text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1 touch-manipulation ${isRTL ? '-ml-1' : '-mr-1'}`}
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{t.extendStayQuestion}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {dayOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onDaySelect(option.value)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                selectedDays === option.value
                  ? 'border-[#274754] bg-[#274754] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">{option.label}</div>
              </div>
            </button>
          ))}
        </div>

        {selectedDays === 'custom' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.enterNumberOfDays}</label>
            <input
              type="number"
              min="1"
              max="365"
              value={customDays}
              onChange={(e) => onCustomDaysChange(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-[#274754] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#274754] focus:border-transparent"
              placeholder={t.enterDaysPlaceholder}
            />
          </div>
        )}

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {t.mc_cancel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selectedDays === 'custom' && (customDays < 1 || customDays > 365)}
            className="flex-1 bg-[#274754] hover:bg-[#274754]/80 active:bg-[#274754]/90 text-white touch-manipulation disabled:bg-gray-300 disabled:cursor-not-allowed"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            {t.requestExtension}
          </Button>
        </div>
      </div>
    </div>
  );
}


