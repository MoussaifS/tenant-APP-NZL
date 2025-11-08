/**
 * Shared API utility functions for Strapi integration
 */

import { getBookingDataFromStorage } from './bookingUtils';

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
 * Get JWT token from localStorage bookingData
 * @returns JWT token string or null
 */
function getJWTToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Get token from bookingData in localStorage
  const bookingData = getBookingDataFromStorage();
  if (bookingData && bookingData.token) {
    return bookingData.token;
  }
  
  // Fallback to old jwtToken key for backward compatibility
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

/**
 * Request interface matching Strapi API and Arqam CRM
 */
export interface CreateRequestData {
  type: 'extending' | 'cleaning' | 'maintenance';
  date: string; // ISO datetime string
  Phone_Number?: string; // Optional, only for maintenance
  details?: string; // Optional
  Reference_Number: number | string; // Booking reference number
  image?: File | null; // Optional image file (deprecated - use imageId and imageUrl instead)
  imageId?: number; // Optional image ID (uploaded to Strapi first)
  imageUrl?: string; // Optional accessible image URL (from Google Cloud Storage)
  // Arqam CRM fields
  requesttype?: string; // 'نظافة' | 'صيانة' | 'طلب تمديد'
  requestcategory?: string; // Category based on request type
  datechekout?: string | null; // Checkout date (null for cleaning/maintenance, date for extension)
  datechekin?: string | null; // Checkin date (null for cleaning/maintenance, date for extension)
  roomnumber?: string; // Room/unit number
  name?: string; // Guest name
  phone?: string; // Guest phone (alternative to Phone_Number)
  note?: string; // Additional notes
}

/**
 * Find booking by reference number and return its ID
 * @param referenceNumber - Booking reference number
 * @returns Booking ID or null if not found
 */
export async function findBookingByReference(referenceNumber: string | number): Promise<number | null> {
  try {
    const token = getJWTToken();
    if (!token) {
      console.error('❌ [API] No JWT token found. User must be authenticated.');
      return null;
    }

    // Convert to string for query
    const refStr = String(referenceNumber);
    const url = `${STRAPI_URL}${API_BASE_PATH}/bookings?filters[Booking_Reference_Number][$eq]=${encodeURIComponent(refStr)}&pagination[limit]=1`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Finding booking by reference:', refStr);
      console.log('🔍 [API] URL:', url);
    }
    
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

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ [API] Unauthorized - JWT token invalid or expired');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('isAuthenticated');
        }
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorText = await response.text();
      console.error('❌ [API] Error response:', errorText);
      throw new Error(`Failed to find booking: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Booking found:', data);
    }
    
    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Request timeout:', API_TIMEOUT + 'ms');
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    console.error('❌ [API] Error finding booking:', error);
    throw error;
  }
}

/**
 * Image upload result interface
 */
export interface ImageUploadResult {
  id: number;
  url: string;
}

/**
 * Upload image file to Strapi (automatically stored in Google Cloud Storage)
 * Images are uploaded BEFORE request components are processed
 * @param file - Image file to upload
 * @returns Image upload result with ID and accessible URL, or null if upload fails
 */
export async function uploadImageToStrapi(file: File): Promise<ImageUploadResult | null> {
  try {
    const token = getJWTToken();
    if (!token) {
      console.error('❌ [API] No JWT token found. User must be authenticated.');
      return null;
    }

    const formData = new FormData();
    formData.append('files', file);
    // Strapi upload API accepts files directly
    // Metadata can be updated separately if needed

    const url = `${STRAPI_URL}${API_BASE_PATH}/upload`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Uploading image to Strapi (will sync to GCS):', file.name);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 2); // Longer timeout for file upload
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ [API] Unauthorized - JWT token invalid or expired');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('isAuthenticated');
        }
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorText = await response.text();
      console.error('❌ [API] Error uploading image:', errorText);
      return null;
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Image uploaded to Strapi:', data);
    }
    
    // Strapi returns an array of uploaded files with accessible URLs
    // The URL is automatically generated and points to Google Cloud Storage
    if (Array.isArray(data) && data.length > 0 && data[0].id && data[0].url) {
      // Construct full URL if relative
      const imageUrl = data[0].url.startsWith('http') 
        ? data[0].url 
        : `${STRAPI_URL}${data[0].url}`;
      
      if (DEBUG_MODE) {
        console.log('✅ [API] Image accessible URL:', imageUrl);
      }
      
      return {
        id: data[0].id,
        url: imageUrl
      };
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Upload timeout');
      return null;
    }
    console.error('❌ [API] Error uploading image:', error);
    return null;
  }
}

/**
 * Create a request in Strapi
 * @param requestData - Request data to create
 * @returns Created request data or null if creation fails
 */
export async function createRequest(requestData: CreateRequestData): Promise<any | null> {
  try {
    const token = getJWTToken();
    if (!token) {
      console.error('❌ [API] No JWT token found. User must be authenticated.');
      return null;
    }

    // Upload image if provided (only for maintenance requests)
    // NEW WORKFLOW: Images are uploaded BEFORE request components are processed
    let imageId = null;
    let imageUrl = null;
    
    // Prefer imageId/imageUrl (new workflow) over image file (legacy)
    if (requestData.imageId && requestData.imageUrl) {
      imageId = requestData.imageId;
      imageUrl = requestData.imageUrl;
      if (DEBUG_MODE) {
        console.log('✅ [API] Using pre-uploaded image:', { id: imageId, url: imageUrl });
      }
    } else if (requestData.image) {
      // Legacy workflow: upload image now (for backward compatibility)
      const uploadResult = await uploadImageToStrapi(requestData.image);
      if (uploadResult) {
        imageId = uploadResult.id;
        imageUrl = uploadResult.url;
      }
      if (!imageId && DEBUG_MODE) {
        console.warn('⚠️ [API] Image upload failed, but continuing with request creation');
      }
    }

    // Prepare request payload
    // Reference_Number is pulled from localStorage (bookingData.reference)
    // Date is set to current time when request is made
    // Type and details are set dynamically per component
    const payload: any = {
      data: {
        type: requestData.type, // 'extending' | 'cleaning' | 'maintenance'
        date: requestData.date, // ISO datetime string (current time)
        Reference_Number: typeof requestData.Reference_Number === 'string' 
          ? parseInt(requestData.Reference_Number) 
          : requestData.Reference_Number, // From localStorage booking data
      },
    };

    // Add optional fields
    if (requestData.Phone_Number) {
      payload.data.Phone_Number = requestData.Phone_Number;
    }
    if (requestData.details) {
      payload.data.details = requestData.details;
    }
    if (imageId) {
      payload.data.image = imageId;
    }
    // Store image URL for Arqam integration
    if (imageUrl) {
      payload.data.imageUrl = imageUrl;
    }
    
    // Add Arqam CRM fields
    if (requestData.requesttype) {
      payload.data.requesttype = requestData.requesttype;
    }
    if (requestData.requestcategory) {
      payload.data.requestcategory = requestData.requestcategory;
    }
    if (requestData.datechekout !== undefined) {
      payload.data.datechekout = requestData.datechekout;
    }
    if (requestData.datechekin !== undefined) {
      payload.data.datechekin = requestData.datechekin;
    }
    if (requestData.roomnumber) {
      payload.data.roomnumber = requestData.roomnumber;
    }
    if (requestData.name) {
      payload.data.name = requestData.name;
    }
    if (requestData.phone) {
      payload.data.phone = requestData.phone;
    }
    if (requestData.note) {
      payload.data.note = requestData.note;
    }

    const url = `${STRAPI_URL}${API_BASE_PATH}/requests`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Creating request:', payload);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        console.error('❌ [API] Unauthorized - JWT token invalid or expired');
        console.error('❌ [API] Response:', errorText);
        
        // Don't clear bookingData as it contains the token
        // Just log the error and return null so the flow can continue
        // The WhatsApp message will still be sent
        
        if (DEBUG_MODE) {
          console.warn('⚠️ [API] Request creation failed due to authentication, but continuing with WhatsApp flow');
        }
        
        // Return null instead of throwing - allows WhatsApp flow to continue
        return null;
      }
      
      console.error('❌ [API] Error creating request:', response.status, errorText);
      
      // For other errors, also return null instead of throwing
      // This allows the WhatsApp flow to continue even if database save fails
      if (DEBUG_MODE) {
        console.warn('⚠️ [API] Request creation failed, but continuing with WhatsApp flow');
      }
      
      return null;
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Request created:', data);
    }
    
    return data.data || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Request timeout:', API_TIMEOUT + 'ms');
      console.warn('⚠️ [API] Request creation timed out, but continuing with WhatsApp flow');
      return null;
    }
    console.error('❌ [API] Error creating request:', error);
    
    // Return null instead of throwing - allows WhatsApp flow to continue
    // The request will still be sent via WhatsApp even if database save fails
    if (DEBUG_MODE) {
      console.warn('⚠️ [API] Request creation failed due to error, but continuing with WhatsApp flow');
    }
    
    return null;
  }
}

/**
 * Unit Lock data structure from n8n webhook
 */
export interface UnitLockData {
  unit?: string; // Unit number like "B6/9", "A1", "R217"
  development?: string; // Development name (if building password exists)
  buildingPassword?: string; // Building password (optional)
  apartmentPassword?: string; // Apartment password (required)
}

/**
 * Fetch unit lock data from backend (triggers n8n webhook)
 * @param reference - Booking reference number
 * @returns Promise<UnitLockData | null> The unit lock data or null if not found
 */
export async function fetchUnitLockData(reference: string | number): Promise<UnitLockData | null> {
  try {
    const token = getJWTToken();
    if (!token) {
      console.error('❌ [API] No JWT token found. User must be authenticated.');
      return null;
    }

    const url = `${STRAPI_URL}${API_BASE_PATH}/unit-lock`;
    
    if (DEBUG_MODE) {
      console.log('🔍 [API] Fetching unit lock data for reference:', reference);
      console.log('🔍 [API] URL:', url);
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ reference }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (DEBUG_MODE) {
      console.log('📡 [API] Unit lock response status:', response.status);
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
      throw new Error(`Failed to fetch unit lock data: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (DEBUG_MODE) {
      console.log('✅ [API] Unit lock data received:', data);
    }
    
    return data.data || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ [API] Request timeout:', API_TIMEOUT + 'ms');
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    console.error('❌ [API] Error fetching unit lock data:', error);
    throw error;
  }
}
