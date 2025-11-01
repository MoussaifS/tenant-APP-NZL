/**
 * Shared API utility functions for Strapi integration
 */

// Strapi API configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api';

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
 * Fetch units from Strapi API
 * @returns Promise<Unit[]> Array of units
 */
export async function fetchUnits(): Promise<Unit[]> {
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
