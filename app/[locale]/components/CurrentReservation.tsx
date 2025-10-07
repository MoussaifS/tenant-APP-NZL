'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CurrentReservationProps {
  currentReservation: string;
  location: string;
}

export default function CurrentReservation({ currentReservation, location }: CurrentReservationProps) {
  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{currentReservation}</h2>
      <Card className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-2"></div>
            <p className="text-gray-600">Property Image</p>
          </div>
        </div>
        <Badge variant="secondary" className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-700 border-0">
          <svg className="w-4 h-4 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {location}
        </Badge>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </Card>
    </div>
  );
}
