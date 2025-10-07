'use client';

import { Card, CardContent } from '@/components/ui/card';

interface PartnerServicesProps {
  partnerServices: string;
  exploreServices: string;
}

export default function PartnerServices({ partnerServices, exploreServices }: PartnerServicesProps) {
  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-gray-800 mb-2">{partnerServices}</h2>
      <p className="text-sm text-gray-600 mb-4">{exploreServices}</p>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Cleaning Services</h3>
            <p className="text-xs text-gray-600">Professional cleaning</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Maintenance</h3>
            <p className="text-xs text-gray-600">Quick repairs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
