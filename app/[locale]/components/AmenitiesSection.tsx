'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';

interface AmenitiesSectionProps {
  amenities: string;
  seeMore: string;
  wifi: string;
  features: string;
  unitLock: string;
  parking: string;
}

export default function AmenitiesSection({ 
  amenities, 
  seeMore, 
  wifi, 
  features, 
  unitLock,
  parking
}: AmenitiesSectionProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  
  const amenitiesData = [
    {
      id: 'wifi',
      title: wifi,
      icon: (
        <img 
          src="/wifi.svg" 
          alt="WiFi" 
          className="w-6 h-6"
        />
      ),
      bgColor: 'bg-blue-100',
      modalContent: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Network Name</p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 rounded-xl">
              <p className="font-semibold text-blue-800">GuestNetwork</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Password</p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-3 rounded-xl flex items-center justify-between">
              <p className="font-mono text-lg font-bold text-gray-800">GuestWiFi2024</p>
              <button 
                className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
                onClick={() => {
                  navigator.clipboard.writeText('GuestWiFi2024');
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700 font-medium">Free high-speed internet included</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: features,
      icon: (
        <img 
          src="/features.svg" 
          alt="Features" 
          className="w-6 h-6"
        />
      ),
      bgColor: 'bg-yellow-100',
      modalContent: (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Swimming Pool</span>
              </div>
              <span className="text-green-600 font-bold">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Fitness Center</span>
              </div>
              <span className="text-green-600 font-bold">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Laundry Service</span>
              </div>
              <span className="text-green-600 font-bold">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">24/7 Concierge</span>
              </div>
              <span className="text-green-600 font-bold">✓</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700">Rooftop Terrace</span>
              </div>
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'unitLock',
      title: unitLock,
      icon: (
        <img 
          src="assets/icons/Group.png" 
          alt="Key Lock" 
          className="w-6 h-6"
        />
      ),
      bgColor: 'bg-green-100',
      modalContent: (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Access Code</p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-mono text-2xl font-bold text-gray-800">1234</p>
                  <p className="text-xs text-gray-500">4-digit code</p>
                </div>
              </div>
              <button 
                className="ml-3 p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-1"
                onClick={() => {
                  navigator.clipboard.writeText('1234');
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">How to use</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Enter the 4-digit code on the keypad</li>
                  <li>• Press the unlock button or # key</li>
                  <li>• The door will unlock automatically</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-amber-700 font-medium">Keep this code secure and don't share it with others</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">{amenities}</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {amenitiesData.map((amenity) => (
          <Dialog key={amenity.id} open={openModal === amenity.id} onOpenChange={(open) => setOpenModal(open ? amenity.id : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="text-center">
                  <div className={`w-10 h-10 ${amenity.bgColor} rounded-full flex items-center justify-center mx-auto mb-1`}>
                    {amenity.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{amenity.title}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-0">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-bold text-gray-800 text-center">
                  {amenity.id === 'wifi' && 'WiFi Access'}
                  {amenity.id === 'features' && 'Premium Amenities'}
                  {amenity.id === 'unitLock' && 'Unit Access'}
                </DialogTitle>
              </DialogHeader>
              <div className="px-2">
                {amenity.modalContent}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}