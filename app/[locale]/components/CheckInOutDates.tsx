'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  // Generate calendar links
  const generateAppleCalendarLink = () => {
    const startDate = new Date(checkInDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(checkOutDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent('Hotel Stay');
    const details = encodeURIComponent(`Check-in: ${checkInDate}\nCheck-out: ${checkOutDate}`);
    
    return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${details}
END:VEVENT
END:VCALENDAR`;
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
    const blob = new Blob([calendarData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hotel-stay.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarLink(), '_blank');
  };

  return (
    <div className="px-2 py-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Stay Summary</h2>
      <Card className={`border-2 ${getBorderColor()} shadow-lg bg-white rounded-xl overflow-hidden`}>
        <CardContent className={`p-4 ${getBackgroundColor()} rounded-xl`}>
          {/* Improved Layout with Better Spacing */}
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Date Range */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
                  <p className="text-sm font-semibold text-gray-800">{checkInDate}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
                  <p className="text-sm font-semibold text-gray-800">{checkOutDate}</p>
                </div>
              </div>
            </div>

            {/* Center - Duration Badge */}
            <div className="flex-shrink-0">
              <div className={`px-3 py-2 rounded-lg ${getTextColor()} font-bold text-sm bg-white shadow-sm border`}>
                {duration} {duration === 1 ? 'Night' : 'Nights'}
              </div>
            </div>
            
            {/* Right Side - Calendar Button */}
            <div className="flex-shrink-0">
              <Button 
                onClick={() => setShowCalendarPopup(true)}
                variant="outline" 
                size="sm"
                className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 h-8 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Popup Modal */}
      {showCalendarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add to Calendar</h3>
              <button
                onClick={() => setShowCalendarPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
              <Button 
                onClick={() => {
                  handleAppleCalendar();
                  setShowCalendarPopup(false);
                }}
                variant="outline" 
                className="w-full bg-white border-gray-300 hover:bg-gray-50 text-gray-700 justify-start"
              >
                <svg className="w-5 h-5 mr-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Apple Calendar
              </Button>
              
              <Button 
                onClick={() => {
                  handleGoogleCalendar();
                  setShowCalendarPopup(false);
                }}
                variant="outline" 
                className="w-full bg-white border-gray-300 hover:bg-gray-50 text-gray-700 justify-start"
              >
                <svg className="w-5 h-5 mr-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                  <path d="M7 10h5v5H7z"/>
                </svg>
                Google Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}