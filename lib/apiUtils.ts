/**
 * Shared API utility functions for Strapi integration
 */

// Strapi API configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api';

// Unit cache key in localStorage
const UNIT_CACHE_KEY = 'cachedUnitData';
const UNIT_CACHE_TIMESTAMP_KEY = 'cachedUnitTimestamp';
const UNIT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Unit data structure matching Strapi API
export interface Unit {
  id: number;
  Reference: string;
  Development: string;
  Units: string;
  Floor: string;  
  Location: string;
  Number_of_bedrooms: string;
  Neighborhood: string;
  Tourism_License: string;
  Parking: string;
}

/**
 * Get JWT token from localStorage
 * @returns JWT token string or null
 */
function getJWTToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwtToken');
}

/**
 * Fetch a single unit by accommodation from Strapi API with JWT authentication
 * This is the secure way to fetch units - only returns the unit for the authenticated user
 * @param accommodation - Accommodation string from booking (e.g., "Alaredh R217")
 * @returns Promise<Unit | null> The unit or null if not found
 */
export async function fetchUnitByAccommodation(accommodation: string): Promise<Unit | null> {
  try {
    const token = getJWTToken();
    if (!token) {
      console.error('❌ [API] No JWT token found. User must be authenticated.');
      return null;
    }

    const url = `${STRAPI_URL}${API_BASE_PATH}/units/by-accommodation?accommodation=${encodeURIComponent(accommodation)}`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Fetching unit by accommodation:', accommodation);
      console.log('🔍 [API] URL:', url);
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (DEBUG_MODE) {
      console.log('📡 [API] Response status:', response.status);
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ [API] Unauthorized - JWT token invalid or expired');
        // Clear invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('isAuthenticated');
        }
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorText = await response.text();
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to fetch unit: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Unit API response:', data);
    }
    
    return data.data || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Request timeout:', API_TIMEOUT + 'ms');
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    console.error('❌ [API] Error fetching unit:', error);
    throw error;
  }
}

/**
 * Get cached unit from localStorage
 * @returns Cached Unit or null if not cached or expired
 */
export function getCachedUnit(): Unit | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(UNIT_CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(UNIT_CACHE_TIMESTAMP_KEY);
    
    if (!cachedData || !cachedTimestamp) {
      return null;
    }
    
    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - timestamp > UNIT_CACHE_DURATION) {
      // Clear expired cache
      localStorage.removeItem(UNIT_CACHE_KEY);
      localStorage.removeItem(UNIT_CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cachedData) as Unit;
  } catch (error) {
    console.error('❌ [API] Error reading cached unit:', error);
    return null;
  }
}

/**
 * Cache unit data in localStorage
 * @param unit - Unit to cache
 */
export function cacheUnit(unit: Unit): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(UNIT_CACHE_KEY, JSON.stringify(unit));
    localStorage.setItem(UNIT_CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Unit cached:', unit.Reference);
    }
  } catch (error) {
    console.error('❌ [API] Error caching unit:', error);
  }
}

/**
 * Clear cached unit data
 */
export function clearCachedUnit(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(UNIT_CACHE_KEY);
  localStorage.removeItem(UNIT_CACHE_TIMESTAMP_KEY);
  
  if (DEBUG_MODE) {
    console.log('🗑️ [API] Unit cache cleared');
  }
}

/**
 * Get unit for current booking - uses cache first, then fetches from API if needed
 * This is the recommended method to use in components
 * @param accommodation - Accommodation string from booking
 * @param forceRefresh - Force refresh from API, bypassing cache
 * @returns Promise<Unit | null> The unit or null if not found
 */
export async function getCurrentUnit(accommodation: string, forceRefresh: boolean = false): Promise<Unit | null> {
  // Try to get from cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCachedUnit();
    if (cached) {
      // Verify cached unit matches current accommodation
      const unitNumber = extractUnitNumber(accommodation);
      if (cached.Reference === unitNumber) {
        if (DEBUG_MODE) {
          console.log('✅ [API] Using cached unit:', cached.Reference);
        }
        return cached;
      } else {
        // Accommodation changed, clear cache and fetch new
        if (DEBUG_MODE) {
          console.log('🔄 [API] Accommodation changed, clearing cache');
        }
        clearCachedUnit();
      }
    }
  }
  
  // Fetch from API
  const unit = await fetchUnitByAccommodation(accommodation);
  
  // Cache the result if successful
  if (unit) {
    cacheUnit(unit);
  }
  
  return unit;
}

/**
 * @deprecated This function fetches all units which is a security issue.
 * Use getCurrentUnit() instead for secure, authenticated unit fetching.
 * This function is kept for backward compatibility but should not be used.
 * @returns Promise<Unit[]> Array of units
 */
export async function fetchUnits(): Promise<Unit[]> {
  console.warn('⚠️ [API] fetchUnits() is deprecated and should not be used. Use getCurrentUnit() instead.');
  
  try {
    const url = `${STRAPI_URL}${API_BASE_PATH}/units?pagination%5BpageSize%5D=100`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Fetching units from:', url);
      console.log('🔍 [API] Configuration:', {
        STRAPI_URL,
        API_TIMEOUT,
        DEBUG_MODE,
        API_BASE_PATH
      });
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (DEBUG_MODE) {
      console.log('📡 [API] Response status:', response.status);
      console.log('📡 [API] Response headers:', Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to fetch units: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Units API response:', data);
      console.log('📊 [API] Available unit references:', data.data?.map((unit: any) => unit.Reference));
      console.log('📊 [API] Total units:', data.meta?.pagination?.total);
    }
    
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Request timeout:', API_TIMEOUT + 'ms');
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    console.error('❌ [API] Error fetching units:', error);
    throw error;
  }
}

/**
 * Test connection to the Strapi backend
 * @returns Promise<boolean> True if connection is successful
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const url = `${STRAPI_URL}${API_BASE_PATH}/units?pagination%5BpageSize%5D=1`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [CONNECTION TEST] Testing backend connection to:', url);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for connection test
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (DEBUG_MODE) {
      console.log('📡 [CONNECTION TEST] Response status:', response.status);
    }

    if (response.ok) {
      if (DEBUG_MODE) {
        console.log('✅ [CONNECTION TEST] Backend connection successful');
      }
      return true;
    } else {
      if (DEBUG_MODE) {
        console.log('❌ [CONNECTION TEST] Backend connection failed:', response.status);
      }
      return false;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [CONNECTION TEST] Connection timeout');
    } else {
      console.error('❌ [CONNECTION TEST] Connection error:', error);
    }
    return false;
  }
}

/**
 * Get API configuration for debugging
 * @returns Object with current API configuration
 */
export function getApiConfig() {
  return {
    STRAPI_URL,
    API_TIMEOUT,
    DEBUG_MODE,
    API_BASE_PATH,
    FULL_API_URL: `${STRAPI_URL}${API_BASE_PATH}`
  };
}

/**
 * Extract unit number from accommodation string
 * @param accommodation - Accommodation string like "Alaredh R217"
 * @returns Unit number like "R217" or empty string if not found
 */
export function extractUnitNumber(accommodation: string): string {
  // Extract number from accommodation string like "Alaredh R217"
  const match = accommodation.match(/R(\d+)/);
  if (match) {
    return `R${match[1]}`;
  }
  return '';
}
