'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUnit, clearCachedUnit } from '@/lib/apiUtils';
import { isBookingAccessValid, getCheckoutTime } from '@/lib/bookingUtils';

interface BookingData {
  reference: string;
  arrival: string;
  departure: string;
  accommodation: string;
  accessValidUntil: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessCode: string | null;
  bookingData: BookingData | null;
  login: (code: string) => Promise<{ success: boolean; error?: string; errorCode?: string }>;
  logout: () => void;
  refreshBookingData: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Strapi API configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api';
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define logout function early so it can be used in other effects
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessCode');
    localStorage.removeItem('bookingData');
    localStorage.removeItem('jwtToken');
    
    // Clear unit cache
    clearCachedUnit();
    
    // Clear cookies
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'accessCode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setIsAuthenticated(false);
    setAccessCode(null);
    setBookingData(null);
    
    const locale = pathname?.split('/')[1] || 'en';
    router.push(`/${locale}/login`);
  };

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedCode = localStorage.getItem('accessCode');
    const storedBookingData = localStorage.getItem('bookingData');
    
    if (authStatus === 'true' && storedCode && storedBookingData) {
      try {
        const parsedBookingData = JSON.parse(storedBookingData);
        
        // Validate booking access before setting authenticated state
        if (!isBookingAccessValid()) {
          // Booking expired, clear all data
          console.log('⚠️ [Auth] Booking access expired, logging out');
          logout();
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        setAccessCode(storedCode);
        setBookingData(parsedBookingData);
      } catch (error) {
        console.error('Error parsing stored booking data:', error);
        // Clear invalid data
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('accessCode');
        localStorage.removeItem('bookingData');
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!isLoading && !isAuthenticated && !pathname?.includes('/login')) {
      const locale = pathname?.split('/')[1] || 'en';
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (code: string): Promise<{ success: boolean; error?: string; errorCode?: string }> => {
    try {
      // Call backend authentication endpoint
      const authResponse = await fetch(`${STRAPI_URL}/api/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingReference: code })
      });

      const responseData = await authResponse.json();

      // Handle error responses from backend
      if (!authResponse.ok) {
        console.log('Error response from backend:', responseData);
        const errorMessage = typeof responseData.error === 'string' 
          ? responseData.error 
          : (typeof responseData.error === 'object' && responseData.error?.message 
              ? responseData.error.message 
              : 'An error occurred during authentication. Please try again.');
        
        console.log('Error message to display:', errorMessage);
        
        return { 
          success: false, 
          error: errorMessage,
          errorCode: responseData.code
        };
      }

      // Successful authentication
      const { token, booking, accessValidUntil } = responseData;
      const now = new Date();
      
      const bookingDataObj = {
        reference: booking.reference,
        arrival: booking.arrival,
        departure: booking.departure,
        accommodation: booking.accommodation,
        accessValidUntil: accessValidUntil,
        token: token
      };
      
      // Store authentication data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessCode', code);
      localStorage.setItem('bookingData', JSON.stringify(bookingDataObj));
      localStorage.setItem('jwtToken', token);
      
      // Set cookies for SSR compatibility
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400'; // 24 hours
      document.cookie = `accessCode=${code}; path=/; max-age=86400`;
      document.cookie = `jwtToken=${token}; path=/; max-age=86400`;
      
      setIsAuthenticated(true);
      setAccessCode(code);
      setBookingData(bookingDataObj);
      
      // Fetch and cache unit data for this booking
      try {
        const unit = await getCurrentUnit(booking.accommodation, true); // Force refresh on login
        if (unit && DEBUG_MODE) {
          console.log('✅ [Auth] Unit data loaded and cached:', unit.Reference);
        }
      } catch (error) {
        console.error('❌ [Auth] Failed to load unit data:', error);
        // Don't fail login if unit fetch fails, user can still access the app
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Unable to connect to the server. Please check your internet connection and try again.',
        errorCode: 'CONNECTION_ERROR'
      };
    }
  };

  const refreshBookingData = async (): Promise<void> => {
    if (!accessCode || !bookingData) return;
    
    try {
      // Fetch all bookings and filter on client side
      const bookingResponse = await fetch(`${STRAPI_URL}${API_BASE_PATH}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (bookingResponse.ok) {
        const bookingDataResp = await bookingResponse.json();
        const booking = bookingDataResp.data.find((b: any) => b.Booking_Reference_Number.toString() === accessCode);
        
        if (booking) {
          const now = new Date();
          const arrivalDate = new Date(booking.Arrival);
          const departureDate = new Date(booking.Departure);
          
          const arrivalTime = new Date(arrivalDate);
          arrivalTime.setHours(15, 45, 0, 0);
          
          const departureTime = new Date(departureDate);
          departureTime.setHours(12, 30, 0, 0); // 12:30 PM checkout
          
          const token = btoa(JSON.stringify({
            bookingReference: accessCode,
            arrival: arrivalDate.toISOString(),
            departure: departureDate.toISOString(),
            accommodation: booking.Accommodation,
            expiresAt: departureTime.toISOString()
          }));
          
          const updatedBookingData = {
            reference: accessCode,
            arrival: arrivalDate.toISOString(),
            departure: departureDate.toISOString(),
            accommodation: booking.Accommodation,
            accessValidUntil: departureTime.toISOString(),
            token: token
          };
          
          // Check if accommodation changed
          const accommodationChanged = bookingData.accommodation !== booking.Accommodation;
          
          // Update localStorage
          localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
          localStorage.setItem('jwtToken', token);
          
          // Update state
          setBookingData(updatedBookingData);
          
          // If accommodation changed, refresh unit data
          if (accommodationChanged) {
            try {
              const unit = await getCurrentUnit(booking.Accommodation, true); // Force refresh
              if (unit && DEBUG_MODE) {
                console.log('✅ [Auth] Unit data refreshed after accommodation change:', unit.Reference);
              }
            } catch (error) {
              console.error('❌ [Auth] Failed to refresh unit data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing booking data:', error);
    }
  };

  // Periodically check if checkout time has passed
  useEffect(() => {
    if (!isAuthenticated || !bookingData) return;

    const checkCheckoutTime = () => {
      if (!isBookingAccessValid()) {
        console.log('⏰ [Auth] Checkout time passed, automatically logging out');
        logout();
      }
    };

    // Check immediately
    checkCheckoutTime();

    // Set up interval to check every minute
    const intervalId = setInterval(checkCheckoutTime, 60000); // Check every minute

    // Also set a timeout for exact checkout time
    const checkoutTime = getCheckoutTime();
    if (checkoutTime) {
      const now = new Date();
      const timeUntilCheckout = checkoutTime.getTime() - now.getTime();
      
      if (timeUntilCheckout > 0) {
        const timeoutId = setTimeout(() => {
          console.log('⏰ [Auth] Checkout time reached (12:30 PM), logging out');
          logout();
        }, timeUntilCheckout);
        
        return () => {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        };
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, bookingData]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      accessCode, 
      bookingData, 
      login, 
      logout, 
      refreshBookingData,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
