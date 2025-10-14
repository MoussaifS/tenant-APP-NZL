'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';

interface CheckInOutDatesProps {
  checkIn: string;
  checkOut: string;
  checkInDate: string;
  checkOutDate: string;
}

export default function CheckInOutDates({ 
  checkIn, 
  checkOut, 
  checkInDate, 
  checkOutDate 
}: CheckInOutDatesProps) {
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showRequestAlert, setShowRequestAlert] = useState(false);
  const [showExtensionPopup, setShowExtensionPopup] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number | 'custom'>(1);
  const [customDays, setCustomDays] = useState(1);
  
  // Calculate duration between check-in and check-out
  const calculateDuration = () => {
    const checkInDateObj = new Date(checkInDate);
    const checkOutDateObj = new Date(checkOutDate);
    const timeDiff = checkOutDateObj.getTime() - checkInDateObj.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const duration = calculateDuration();

  // Determine background color based on duration
  const getBackgroundColor = () => {
    if (duration <= 1) return 'bg-red-100';
    if (duration <= 2) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getTextColor = () => {
    if (duration <= 1) return 'text-red-700';
    if (duration <= 2) return 'text-yellow-700';
    return 'text-green-700';
  };

  const getBorderColor = () => {
    if (duration <= 1) return 'border-red-200';
    if (duration <= 2) return 'border-yellow-200';
    return 'border-green-200';
  };

  // Detect mobile platform
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const isMobile = () => {
    return isIOS() || isAndroid();
  };

  // Generate calendar links
  const generateAppleCalendarLink = () => {
    const startDate = new Date(checkInDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(checkOutDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = 'Hotel Stay';
    const details = `Check-in: ${checkInDate}\nCheck-out: ${checkOutDate}`;
    
    // Use proper iCal format for mobile compatibility
    const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hotel App//Calendar Event//EN
BEGIN:VEVENT
UID:${Date.now()}@hotelapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${details}
END:VEVENT
END:VCALENDAR`;
    
    return icalData;
  };

  const generateGoogleCalendarLink = () => {
    const startDate = new Date(checkInDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(checkOutDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent('Hotel Stay');
    const details = encodeURIComponent(`Check-in: ${checkInDate}\nCheck-out: ${checkOutDate}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
  };

  const handleAppleCalendar = () => {
    const calendarData = generateAppleCalendarLink();
    
    if (isIOS()) {
      // For iOS, use data URL directly
      const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(calendarData)}`;
      window.location.href = dataUrl;
    } else {
      // For other platforms, use blob download
      const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hotel-stay.ics';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleGoogleCalendar = () => {
    const googleUrl = generateGoogleCalendarLink();
    
    if (isMobile()) {
      // For mobile, try to open in app first, fallback to web
      window.location.href = googleUrl;
    } else {
      window.open(googleUrl, '_blank');
    }
  };

  const handleRequestMoreDays = () => {
    setShowExtensionPopup(true);
  };

  const handleConfirmExtension = () => {
    setShowExtensionPopup(false);
    setShowRequestAlert(true);
    // Auto-hide alert after 5 seconds
    setTimeout(() => {
      setShowRequestAlert(false);
    }, 5000);
  };

  const handleDaySelection = (days: number | 'custom') => {
    setSelectedDays(days);
  };

  return (
    <div className="px-4 py-4">
      {/* Request More Days Alert - Fixed at top */}
      {showRequestAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <Alert className="border-blue-200 bg-blue-50 shadow-lg">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <AlertTitle className="text-blue-800">Extension Request Submitted</AlertTitle>
            <AlertDescription className="text-blue-700">
              Your request for {selectedDays === 'custom' ? customDays : selectedDays} additional {selectedDays === 'custom' ? (customDays === 1 ? 'day' : 'days') : (selectedDays === 1 ? 'day' : 'days')} has been submitted. Our team will review your request and contact you within 1 hours.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <h2 className="text-lg font-bold text-gray-800 mb-4">Your Stay Summary</h2>
      <div className={`border-1 ${getBorderColor()} shadow-md bg-white rounded-md overflow-hidden`}>
        <div className={`p-4 ${getBackgroundColor()}`}>
          {/* Improved Layout with Better Spacing */}
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Checkout Time */}
            <div className="flex-1">
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="flex flex-col items-center gap-1 bg-white/50 px-3 py-1.5 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">{checkOutDate}</p>
                  <p className="text-sm font-semibold text-gray-600">12:00 PM</p>
                </div>
              </div>
            </div>

            {/* Center - Duration Badge */}
            <div className="flex-shrink-0">
              <div className={`px-3 py-2 rounded-lg ${getTextColor()} font-bold text-sm bg-white  `}>
                {duration} {duration === 1 ? 'Night' : 'Nights'} 
              </div>
            </div>
            
            {/* Right Side - Calendar Button */}
            <div className="flex-shrink-0">
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
            </div>
          </div>
        </div>
      </div>

      {/* Request More Days Button */}
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={handleRequestMoreDays}
          variant="outline" 
          className="bg-white border-blue-300 hover:bg-blue-50 active:bg-blue-100 text-blue-700 px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Request More Days
        </Button>
      </div>

      {/* Calendar Popup Modal */}
      {showCalendarPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add to Calendar</h3>
            <button
              onClick={() => setShowCalendarPopup(false)}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1 touch-manipulation"
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
          
          <p className="text-sm text-gray-600 mb-4">
            Choose your preferred calendar app:
          </p>
          
          <div className="space-y-3">
            {/* Show Apple Calendar option for iOS or all platforms */}
            {(isIOS() || !isMobile()) && (
              <Button 
                onClick={() => {
                  handleAppleCalendar();
                  setShowCalendarPopup(false);
                }}
                variant="outline" 
                className="w-full bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 justify-start h-12 touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {isIOS() ? 'Add to Calendar' : 'Apple Calendar'}
              </Button>
            )}
            
            {/* Show Google Calendar option */}
            <Button 
              onClick={() => {
                handleGoogleCalendar();
                setShowCalendarPopup(false);
              }}
              variant="outline" 
              className="w-full bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 justify-start h-12 touch-manipulation"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <svg className="w-5 h-5 mr-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                <path d="M7 10h5v5H7z"/>
              </svg>
              Google Calendar
            </Button>

            {/* Show Outlook option for Android */}
            {isAndroid() && (
              <Button 
                onClick={() => {
                  const startDate = new Date(checkInDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                  const endDate = new Date(checkOutDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                  const title = encodeURIComponent('Hotel Stay');
                  const details = encodeURIComponent(`Check-in: ${checkInDate}\nCheck-out: ${checkOutDate}`);
                  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${details}`;
                  window.location.href = outlookUrl;
                  setShowCalendarPopup(false);
                }}
                variant="outline" 
                className="w-full bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 justify-start h-12 touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <svg className="w-5 h-5 mr-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.5 21L3 16.5 7.5 12 12 16.5 16.5 12 21 16.5 16.5 21 12 16.5 7.5 21Z"/>
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                </svg>
                Outlook Calendar
              </Button>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Extension Days Selection Popup Modal */}
      {showExtensionPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Extend Your Stay</h3>
              <button
                onClick={() => setShowExtensionPopup(false)}
                className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1 touch-manipulation"
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
            
            <p className="text-sm text-gray-600 mb-4">
              How many additional days would you like to extend your stay?
            </p>
            
            {/* Day Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { value: 1, label: '1 Day' },
                { value: 5, label: '5 Days' },
                { value: 30, label: '1 Month' },
                { value: 'custom', label: 'Custom' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDaySelection(option.value as number | 'custom')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                    selectedDays === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold">{option.label}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Days Input - Only show when Custom is selected */}
            {selectedDays === 'custom' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter number of days:
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customDays}
                  onChange={(e) => setCustomDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter days"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowExtensionPopup(false)}
                variant="outline" 
                className="flex-1 bg-white border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmExtension}
                disabled={selectedDays === 'custom' && (customDays < 1 || customDays > 365)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                Request Extension
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}