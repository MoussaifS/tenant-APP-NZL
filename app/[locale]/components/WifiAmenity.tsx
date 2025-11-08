'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import pic1 from '@/assets/wifi/pic1.jpg';
import pic2 from '@/assets/wifi/pic2.jpg';
import pic3 from '@/assets/wifi/pic3.jpg';

interface WifiAmenityProps {
  locale?: string;
}

function AnimatedWifiInstructions({ isRTL }: { isRTL: boolean }) {
  const [currentPic, setCurrentPic] = useState(0);
  const pics = [pic1, pic2, pic3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPic((prev) => (prev + 1) % pics.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [pics.length]);

  return (
    <div className="space-y-4">
      <div className="relative w-full h-64 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={pics[currentPic]}
          alt="WiFi Instructions"
          fill
          className="object-contain transition-opacity duration-500 p-2"
          priority
        />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

export default function WifiAmenity({ locale = 'en' }: WifiAmenityProps) {
  const isRTL = locale === 'ar';
  return <AnimatedWifiInstructions isRTL={isRTL} />;
}


