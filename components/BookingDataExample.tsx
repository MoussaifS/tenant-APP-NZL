'use client';

import { useAuth } from '@/app/components/AuthProvider';
import { 
  getBookingDataFromStorage, 
  isBookingAccessValid, 
  getFormattedArrivalDate, 
  getFormattedDepartureDate,
  getRemainingDays 
} from '@/lib/bookingUtils';
import { useEffect, useState } from 'react';

export default function BookingDataExample() {
  const { bookingData, refreshBookingData } = useAuth();
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Get data from localStorage
    const storedData = getBookingDataFromStorage();
    setLocalStorageData(storedData);
    setIsValid(isBookingAccessValid());
  }, [bookingData]);

  const handleRefreshData = async () => {
    await refreshBookingData();
    // Update local state after refresh
    const storedData = getBookingDataFromStorage();
    setLocalStorageData(storedData);
    setIsValid(isBookingAccessValid());
  };

  if (!bookingData && !localStorageData) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">No Booking Data</h3>
        <p>Please log in to view your booking information.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Booking Information</h3>
        <button 
          onClick={handleRefreshData}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Reference Number</label>
            <p className="text-lg font-mono">{bookingData?.reference || localStorageData?.reference}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Accommodation</label>
            <p className="text-lg">{bookingData?.accommodation || localStorageData?.accommodation}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Arrival Date</label>
            <p className="text-lg">{getFormattedArrivalDate()}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Departure Date</label>
            <p className="text-lg">{getFormattedDepartureDate()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Access Valid Until</label>
            <p className="text-lg">
              {bookingData?.accessValidUntil || localStorageData?.accessValidUntil 
                ? new Date(bookingData?.accessValidUntil || localStorageData?.accessValidUntil).toLocaleString()
                : 'N/A'
              }
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Remaining Days</label>
            <p className="text-lg">{getRemainingDays() || 0} days</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: isValid ? '#d1fae5' : '#fee2e2' }}>
          <p className={`text-sm font-medium ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            Access Status: {isValid ? 'Valid' : 'Expired'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Raw localStorage Data:</h4>
        <pre className="text-xs text-gray-700 overflow-auto">
          {JSON.stringify(localStorageData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
