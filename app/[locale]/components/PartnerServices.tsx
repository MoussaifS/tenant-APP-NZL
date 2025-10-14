'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PartnerServicesProps {
  partnerServices: string;
  exploreServices: string;
  locale: string;
}

export default function PartnerServices({ partnerServices, exploreServices, locale }: PartnerServicesProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState<string | null>(null);

  const handleCleaningServiceClick = async () => {
    setIsNavigating('cleaning');
    try {
      await router.push(`/${locale}/cleaning-services`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(null);
    }
  };

  const handleMaintenanceClick = async () => {
    setIsNavigating('maintenance');
    try {
      await router.push(`/${locale}/maintenance-request`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(null);
    }
  };

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{partnerServices}</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Cleaning Services Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleCleaningServiceClick}
          role="button"
          tabIndex={0}
          aria-label="Navigate to cleaning services"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCleaningServiceClick();
            }
          }}
        >
          <CardContent className="p-4 relative">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              Cleaning Services
            </h3>
            <p className="text-xs text-gray-600">
              Professional cleaning
            </p>
            
            {/* Loading indicator */}
            {isNavigating === 'cleaning' && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleMaintenanceClick}
          role="button"
          tabIndex={0}
          aria-label="Navigate to maintenance services"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMaintenanceClick();
            }
          }}
        >
          <CardContent className="p-4 relative">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">
              Maintenance
            </h3>
            <p className="text-xs text-gray-600">
              Quick repairs
            </p>
            
            {/* Loading indicator */}
            {isNavigating === 'maintenance' && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
