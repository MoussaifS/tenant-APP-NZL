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
import { useState, useEffect } from 'react';
import { Wifi, Star, Key, Car } from 'lucide-react';
import Image from 'next/image';
import pic1 from '@/assets/wifi/pic1.jpg';
import pic2 from '@/assets/wifi/pic2.jpg';
import pic3 from '@/assets/wifi/pic3.jpg';
import WifiAmenity from './WifiAmenity';
import FeaturesAmenity from './FeaturesAmenity';
import UnitLockAmenity from './UnitLockAmenity';
import ParkingAmenity from './ParkingAmenity';

interface AmenitiesSectionProps {
  amenities: string;
  wifi: string;
  features: string;
  unitLock: string;
  parking: string;
  locale?: string;
}

// Animated Wifi Instruction Component
function AnimatedWifiInstructions({ isRTL }: { isRTL: boolean }) {
  const [currentPic, setCurrentPic] = useState(0);
  const pics = [ pic1 , pic2, pic3 ];

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPic((prev) => (prev + 1) % pics.length);
    }, 1500); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [pics.length]);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <Image
          src={pics[currentPic]}
          alt="WiFi Instructions"
          fill
          className="object-contain transition-opacity duration-500 p-4"
          priority
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className={`font-semibold text-blue-800 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL ? 'ملاحظة مهمة' : 'Important Note'}
            </h4>
            <p className={`text-sm text-blue-700 ${isRTL ? 'font-arabic' : ''}`}>
              {isRTL 
                ? 'اسم شبكة WiFi وكلمة المرور موجودان أسفل جهاز المودم' 
                : 'The WiFi network name and password are located under the WiFi modem'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AmenitiesSection({ 
  amenities, 
  wifi, 
  features, 
  unitLock,
  parking,
  locale = 'en'
}: AmenitiesSectionProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const isRTL = locale === 'ar';
  
  const amenitiesData = [
    {
      id: 'wifi',
      title: wifi,
      icon: <Wifi className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-100',
      modalContent: (
        <WifiAmenity locale={locale} />
      )
    },
    // {
    //   id: 'features',
    //   title: features,
    //   icon: <Star className="w-6 h-6 text-yellow-600" />,
    //   bgColor: 'bg-yellow-100',
    //   modalContent: (
    //     <FeaturesAmenity locale={locale} />
    //   )
    // },
    {
      id: 'unitLock',
      title: unitLock,
      icon: <Key className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-100',
      modalContent: (
        <UnitLockAmenity locale={locale} isOpen={openModal === 'unitLock'} />
      )
    },
    {
      id: 'parking',
      title: parking,
      icon: <Car className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-100',
      modalContent: (
        <ParkingAmenity locale={locale} />
      )
    }
  ];

  return (
    <div className="px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center mb-2`}>
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
          <h2 className={`text-lg font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>{amenities}</h2>
        </div>
      </div>
      <div className="flex justify-between">
        {amenitiesData.map((amenity) => (
          <Dialog key={amenity.id} open={openModal === amenity.id} onOpenChange={(open) => setOpenModal(open ? amenity.id : null)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="text-center">
                  <div className={`w-10 h-10 ${amenity.bgColor} rounded-full flex items-center justify-center mx-auto mb-1`}>
                    {amenity.icon}
                  </div>
                  <p className={`text-sm font-medium text-gray-700 ${isRTL ? 'text-center font-arabic' : 'text-center'}`}>{amenity.title}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent 
              className={`bg-white ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <DialogHeader className="pb-4">
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle className={`text-xl font-bold text-gray-800 flex-1 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}>
                    {amenity.id === 'wifi' && (isRTL ? 'وصول الواي فاي' : 'WiFi Access')}
                    {amenity.id === 'features' && (isRTL ? 'المرافق المميزة' : 'Premium Amenities')}
                    {amenity.id === 'unitLock' && (isRTL ? 'وصول الوحدة' : 'Unit Access')}
                    {amenity.id === 'parking' && (isRTL ? 'موقف السيارات' : 'Parking')}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className={`px-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {amenity.modalContent}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}