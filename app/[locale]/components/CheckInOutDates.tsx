'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import ExtensionDaysModal from '@/app/[locale]/components/ExtensionDaysModal';
import { useAuth } from '@/app/components/AuthProvider';
import { getBookingDataFromStorage, getFormattedArrivalDate, getFormattedDepartureDate } from '@/lib/bookingUtils';
import { getMessages } from '@/messages';
import { useParams } from 'next/navigation';

interface CheckInOutDatesProps {
  locale?: string;
}

export default function CheckInOutDates({ locale }: CheckInOutDatesProps = {}) {
  const params = useParams();
  const currentLocale = (locale || params?.locale || 'en') as 'en' | 'ar';
  const isRTL = currentLocale === 'ar';
  const t = getMessages(currentLocale);
  const { bookingData } = useAuth();
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showRequestAlert, setShowRequestAlert] = useState(false);
  const [showExtensionPopup, setShowExtensionPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | 'custom'>(1);
  const [customDays, setCustomDays] = useState(1);
  const [localBookingData, setLocalBookingData] = useState<any>(null);

  // Get booking data from localStorage on component mount
  useEffect(() => {
    const storedData = getBookingDataFromStorage();
    setLocalBookingData(storedData);
  }, [bookingData]);

  // Get dates from booking data (prefer context, fallback to localStorage)
  const currentBookingData = bookingData || localBookingData;
  const checkInDate = currentBookingData?.arrival;
  const checkOutDate = currentBookingData?.departure;
  
  // Format dates to short format (e.g., "Nov 15")
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const checkIn = formatDate(checkInDate);
  const checkOut = formatDate(checkOutDate);
  
  // Calculate remaining nights from current day to departure
  const calculateRemainingNights = () => {
    if (!checkOutDate) return 0;
    
    const currentDate = new Date();
    const checkOutDateObj = new Date(checkOutDate);
    
    // Validate dates
    if (isNaN(checkOutDateObj.getTime())) {
      return 0;
    }
    
    // Set both dates to start of day for accurate day calculation
    currentDate.setHours(0, 0, 0, 0);
    checkOutDateObj.setHours(0, 0, 0, 0);
    
    const timeDiff = checkOutDateObj.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Return daysDiff (can be negative if past checkout)
    return daysDiff;
  };

  const remainingNights = calculateRemainingNights();
  
  // Check if it's checkout day
  const isCheckoutDay = remainingNights === 0;
  
  // Check if checkout has passed (past checkout date)
  const isAfterCheckout = remainingNights < 0;

  // Show loading state if no booking data is available
  if (!currentBookingData) {
    return (
      <div className="px-4 py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t.staySummary}</h2>
        <div className="border border-gray-200 shadow-md bg-white rounded-md overflow-hidden">
          <div className="p-4 bg-gray-100">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">{t.loadingBookingInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if dates are invalid
  if (!checkInDate || !checkOutDate) {
    return (
      <div className="px-4 py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t.staySummary}</h2>
        <div className="border border-red-200 shadow-md bg-white rounded-md overflow-hidden">
          <div className="p-4 bg-red-50">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-red-600">{t.unableToLoadDates}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine background color based on remaining nights
  const getBackgroundColor = () => {
    if (isAfterCheckout) return 'bg-gray-100';
    if (isCheckoutDay) return 'bg-yellow-100';
    if (remainingNights <= 1) return 'bg-red-100';
    if (remainingNights <= 2) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getTextColor = () => {
    if (isAfterCheckout) return 'text-gray-700';
    if (isCheckoutDay) return 'text-yellow-700';
    if (remainingNights <= 1) return 'text-red-700';
    if (remainingNights <= 2) return 'text-yellow-700';
    return 'text-green-700';
  };

  const getBorderColor = () => {
    if (isAfterCheckout) return 'border-gray-200';
    if (isCheckoutDay) return 'border-yellow-200';
    if (remainingNights <= 1) return 'border-red-200';
    if (remainingNights <= 2) return 'border-yellow-200';
    return 'border-green-200';
  };

  const getStayMessage = () => {
    if (isAfterCheckout) {
      return t.enjoyedStayMessage;
    }
    if (isCheckoutDay) {
      return t.checkoutToday;
    }
    if (remainingNights === 1) {
      return `1 ${t.nightRemaining}`;
    }
    return `${remainingNights} ${t.nightsRemaining}`;
  };

  // Generate calendar file for download
  const generateICSFile = () => {
    if (!checkInDate || !checkOutDate) return '';
    
    const startDate = new Date(checkInDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(checkOutDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = 'Hotel Stay';
    const details = `Check-in: ${checkIn || 'Invalid Date'}\\nCheck-out: ${checkOut || 'Invalid Date'}`;
    
    const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hotel App//Calendar Event//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@hotelapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${details}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    
    return icalData;
  };

  const handleAddToCalendar = () => {
    const icsContent = generateICSFile();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hotel-stay.ics';
    
    // Trigger download for all platforms
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    setShowCalendarPopup(false);
  };

  const handleRequestMoreDays = () => {
    setShowExtensionPopup(true);
  };

  const handleConfirmExtension = () => {
    setShowExtensionPopup(false);
    
    // Get the number of days for extension
    const extensionDays = selectedDays === 'custom' ? customDays : selectedDays;
    
    // Create WhatsApp message using translations
    const accommodation = currentBookingData?.accommodation || (isRTL ? 'الإقامة' : 'the accommodation');
    const dayWord = extensionDays === 1 ? t.day : t.days;
    
    // Replace placeholders in the translation template
    const whatsappMessage = t.extensionWhatsAppMessage
      .replace('{accommodation}', accommodation)
      .replace('{days}', String(extensionDays))
      .replace('{dayWord}', dayWord);
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/966544417180?text=${encodedMessage}`;
    
    // Open WhatsApp immediately (must be synchronous with user action to avoid popup blockers)
    window.open(whatsappUrl, '_blank');
    
    // Show and auto-hide alert
    setShowRequestAlert(true);
    setTimeout(() => {
      setShowRequestAlert(false);
    }, 5000);
  };

  const handleDaySelection = (days: number | 'custom') => {
    setSelectedDays(days);
  };

  const extensionDays = selectedDays === 'custom' ? customDays : selectedDays;
  const dayWord = extensionDays === 1 ? t.day : t.days;
  const extensionMessage = t.extensionRequestMessage
    .replace('{days}', String(extensionDays))
    .replace('{dayWord}', dayWord);

  return (
    <div className="px-4 py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Request More Days Alert - Fixed at top */}
      {showRequestAlert && (
        <div className={`fixed top-4 z-50 animate-in slide-in-from-top-2 duration-300 ${isRTL ? 'right-4 left-4' : 'left-4 right-4'}`}>
          <Alert className="border-blue-200 bg-blue-50 shadow-lg">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <AlertTitle className="text-blue-800">{t.extensionRequestSubmitted}</AlertTitle>
            <AlertDescription className="text-blue-700">
              {extensionMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t.staySummary}</h2>
      <div className={`border ${getBorderColor()} shadow-md bg-white rounded-md overflow-hidden`}>
        <div className={`p-4 ${getBackgroundColor()}`}>
          {/* Improved Layout with Better Spacing */}
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Checkout Time */}
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="flex flex-col items-center gap-1 bg-white/50 px-3 py-1.5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">{checkOut || 'Invalid Date'}</p>
                  <p className="text-sm font-semibold text-gray-600">{t.checkoutTime}</p>
                </div>
              </div>
            </div>

            {/* Center - Duration Badge */}
            <div className="flex-shrink-0">
              <div className={`px-3 py-2 rounded-lg ${getTextColor()} font-bold text-sm bg-white`}>
                {getStayMessage()}
              </div>
            </div>
            
            {/* Calendar Button */}
            <div className={`flex-shrink-0 ${isRTL ? 'order-first' : ''}`}>
              {!isAfterCheckout && (
                <Button 
                  onClick={() => setShowCalendarPopup(true)}
                  variant="outline" 
                  size="sm"
                  className="bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 h-8 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center touch-manipulation"
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request More Days Button - Only show if not after checkout */}
      {!isAfterCheckout && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={handleRequestMoreDays}
            variant="outline" 
            className="bg-white border-[#274754] hover:bg-[#274754]/10 active:bg-[#274754]/20 text-[#274754] px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {isCheckoutDay ? t.extendYourStay : t.requestMoreDays}
          </Button>
        </div>
      )}
      
      {/* Thank you message for past guests */}
      {isAfterCheckout && (
        <div className="mt-4 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <p className="text-2xl mb-3">🙏</p>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{t.thankYouStay}</h3>
            <p className="text-sm text-gray-600">
              {t.thankYouMessage}
            </p>
          </div>
        </div>
      )}

      {/* Calendar Popup Modal - Centered Popup */}
      {showCalendarPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCalendarPopup(false)}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Modal - Centered */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-xl font-bold text-gray-800">{t.addToCalendar}</h3>
              <button
                onClick={() => setShowCalendarPopup(false)}
                className={`text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 touch-manipulation rounded-full hover:bg-gray-100 active:bg-gray-200 ${isRTL ? '-ml-2' : '-mr-2'}`}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {t.calendarInstructions}
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCalendar}
                className="w-full bg-[#274754] hover:bg-[#274754]/90 active:bg-[#274754]/80 text-white justify-center h-14 text-base font-medium rounded-xl touch-manipulation shadow-lg"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <svg className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {t.downloadCalendarEvent}
              </Button>
              
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-700 mb-2">{t.calendarInstructionsTitle}</p>
                <ul className={`space-y-1 text-xs ${isRTL ? 'list-disc list-inside' : ''}`}>
                  {t.calendarInstructionsList.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extension Days Selection Popup Modal */}
      <ExtensionDaysModal
        locale={currentLocale}
        open={showExtensionPopup}
        selectedDays={selectedDays}
        customDays={customDays}
        onClose={() => setShowExtensionPopup(false)}
        onConfirm={handleConfirmExtension}
        onDaySelect={handleDaySelection}
        onCustomDaysChange={(days) => setCustomDays(days)}
      />
    </div>
  );
}