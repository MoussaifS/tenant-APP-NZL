/**
 * Utility functions for accessing booking data from localStorage
 */

export interface BookingData {
  reference: string;
  arrival: string;
  departure: string;
  accommodation: string;
  accessValidUntil: string;
  token: string;
}

/**
 * Get booking data from localStorage
 * @returns BookingData object or null if not found/invalid
 */
export function getBookingDataFromStorage(): BookingData | null {
  try {
    const storedData = localStorage.getItem('bookingData');
    if (!storedData) return null;
    
    const parsedData = JSON.parse(storedData);
    
    // Validate that all required fields are present
    const requiredFields = ['reference', 'arrival', 'departure', 'accommodation', 'accessValidUntil', 'token'];
    const hasAllFields = requiredFields.every(field => parsedData[field] !== undefined);
    
    if (!hasAllFields) {
      console.warn('Invalid booking data in localStorage - missing required fields');
      return null;
    }
    
    return parsedData as BookingData;
  } catch (error) {
    console.error('Error parsing booking data from localStorage:', error);
    return null;
  }
}

/**
 * Check if the booking access is still valid
 * Checks both the accessValidUntil timestamp and validates against checkout time (12:30 PM)
 * @returns true if access is valid, false otherwise
 */
export function isBookingAccessValid(): boolean {
  const bookingData = getBookingDataFromStorage();
  if (!bookingData) return false;
  
  const now = new Date();
  const departureDate = new Date(bookingData.departure);
  
  // Set checkout time to 12:30 PM (12:30) on departure date
  const checkoutTime = new Date(departureDate);
  checkoutTime.setHours(12, 30, 0, 0); // 12:30 PM
  
  // Check if current time is past checkout time
  if (now >= checkoutTime) {
    return false;
  }
  
  // Also check accessValidUntil timestamp (fallback)
  const accessValidUntil = new Date(bookingData.accessValidUntil);
  return now < accessValidUntil;
}

/**
 * Get checkout time for current booking
 * @returns Checkout Date object (12:30 PM on departure date) or null
 */
export function getCheckoutTime(): Date | null {
  const bookingData = getBookingDataFromStorage();
  if (!bookingData) return null;
  
  const departureDate = new Date(bookingData.departure);
  if (isNaN(departureDate.getTime())) return null;
  
  const checkoutTime = new Date(departureDate);
  checkoutTime.setHours(12, 30, 0, 0); // 12:30 PM
  
  return checkoutTime;
}

/**
 * Get formatted arrival date
 * @returns Formatted arrival date string or null
 */
export function getFormattedArrivalDate(): string | null {
  const bookingData = getBookingDataFromStorage();
  if (!bookingData || !bookingData.arrival) return null;
  
  const arrivalDate = new Date(bookingData.arrival);
  if (isNaN(arrivalDate.getTime())) return null;
  
  return arrivalDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Get formatted departure date
 * @returns Formatted departure date string or null
 */
export function getFormattedDepartureDate(): string | null {
  const bookingData = getBookingDataFromStorage();
  if (!bookingData || !bookingData.departure) return null;
  
  const departureDate = new Date(bookingData.departure);
  if (isNaN(departureDate.getTime())) return null;
  
  return departureDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Get remaining days until departure
 * @returns Number of days remaining or null
 */
export function getRemainingDays(): number | null {
  const bookingData = getBookingDataFromStorage();
  if (!bookingData) return null;
  
  const now = new Date();
  const departureDate = new Date(bookingData.departure);
  const timeDiff = departureDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, daysDiff);
}

/**
 * Clear all booking-related data from localStorage
 */
export function clearBookingDataFromStorage(): void {
  localStorage.removeItem('bookingData');
  localStorage.removeItem('accessCode');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('jwtToken');
}
