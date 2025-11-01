'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedCode = localStorage.getItem('accessCode');
    const storedBookingData = localStorage.getItem('bookingData');
    
    if (authStatus === 'true' && storedCode && storedBookingData) {
      try {
        const parsedBookingData = JSON.parse(storedBookingData);
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
      
      // Store authentication data in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessCode', code);
      localStorage.setItem('bookingData', JSON.stringify({
        reference: booking.reference,
        arrival: booking.arrival,
        departure: booking.departure,
        accommodation: booking.accommodation,
        accessValidUntil: accessValidUntil,
        token: token
      }));
      localStorage.setItem('jwtToken', token);
      
      // Set cookies for SSR compatibility
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400'; // 24 hours
      document.cookie = `accessCode=${code}; path=/; max-age=86400`;
      document.cookie = `jwtToken=${token}; path=/; max-age=86400`;
      
      setIsAuthenticated(true);
      setAccessCode(code);
      setBookingData({
        reference: booking.reference,
        arrival: booking.arrival,
        departure: booking.departure,
        accommodation: booking.accommodation,
        accessValidUntil: accessValidUntil,
        token: token
      });
      
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
    if (!accessCode) return;
    
    try {
      // Fetch all bookings and filter on client side
      const bookingResponse = await fetch(`${STRAPI_URL}${API_BASE_PATH}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (bookingResponse.ok) {
        const bookingData = await bookingResponse.json();
        const booking = bookingData.data.find((b: any) => b.Booking_Reference_Number.toString() === accessCode);
        
        if (booking) {
          const now = new Date();
          const arrivalDate = new Date(booking.Arrival);
          const departureDate = new Date(booking.Departure);
          
          const arrivalTime = new Date(arrivalDate);
          arrivalTime.setHours(15, 45, 0, 0);
          
          const departureTime = new Date(departureDate);
          departureTime.setHours(12, 0, 0, 0);
          
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
          
          // Update localStorage
          localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
          localStorage.setItem('jwtToken', token);
          
          // Update state
          setBookingData(updatedBookingData);
        }
      }
    } catch (error) {
      console.error('Error refreshing booking data:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessCode');
    localStorage.removeItem('bookingData');
    localStorage.removeItem('jwtToken');
    
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
