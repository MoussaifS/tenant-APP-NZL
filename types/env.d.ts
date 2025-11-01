/**
 * Environment variable types for better TypeScript support
 * This file helps with type checking and autocomplete for environment variables
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Strapi Backend Configuration
      NEXT_PUBLIC_STRAPI_URL: string;
      
      // App Configuration
      NEXT_PUBLIC_APP_NAME?: string;
      NEXT_PUBLIC_APP_VERSION?: string;
      
      // Environment
      NODE_ENV: 'development' | 'production' | 'test';
      
      // Optional Configuration
      NEXT_PUBLIC_API_TIMEOUT?: string;
      NEXT_PUBLIC_DEBUG_MODE?: string;
      NEXT_PUBLIC_GA_TRACKING_ID?: string;
    }
  }
}

export {};
