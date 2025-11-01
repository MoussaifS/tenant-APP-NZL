'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LocaleLayout from '../../components/LocaleLayout';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../../components/AuthProvider';
import { getMessages } from '@/messages';
import { Button } from '@/components/ui/button';

export default function EmergencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
      setIsLoading(false);
    });
  }, [params]);

  useEffect(() => {
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en/emergency');
    }
  }, [locale, router]);

  if (isLoading) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center">
          <div className="text-[#274754]">Loading...</div>
        </div>
      </LocaleLayout>
    );
  }

  const t = getMessages(locale as 'en' | 'ar');

  const handleWhatsApp = () => {
    // TODO: Replace with your actual WhatsApp number (format: country code + number without +)
    // Example: For +966 11 234 5678, use: '966112345678'
    const whatsappNumber = '966500000000'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent(t.emergency.whatsappMessage || 'Hello, I need assistance');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-[#FAF6F5] pb-20">
        {/* Header */}
      

        <div className="bg-white shadow-sm border-b border-[#EDEBED]">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2 text-[#274754] hover:bg-[#EDEBED]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-lg font-bold text-[#274754]">{t.emergency.title}</h1>
              <div className="w-9"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>


        <div className="px-4 py-6 space-y-4">
          {/* Emergency Number Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#EDEBEB] p-5">
            <h2 className="text-lg font-semibold text-[#274754] mb-4">
              {t.emergency.emergencyNumber}
            </h2>
            <div className="space-y-3">
              {/* Ambulance */}
              <button
                onClick={() => handleCall(t.emergency.ambulancePhone)}
                className="w-full py-3 px-4 bg-[#274754] text-white rounded-lg font-medium hover:bg-[#1a353d] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                  </svg>
                  <span>{t.emergency.ambulance}</span>
                </div>
                <span className="font-semibold">{t.emergency.ambulancePhone}</span>
              </button>
              
              {/* Fire Department */}
              <button
                onClick={() => handleCall(t.emergency.fireDepartmentPhone)}
                className="w-full py-3 px-4 bg-[#274754] text-white rounded-lg font-medium hover:bg-[#1a353d] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-1.05-2.71-2.5-3-1.38-.28-2.5.91-2.5 2.24A2.5 2.5 0 0 0 6 13.5" />
                    <path d="M14.5 18a2.5 2.5 0 1 0-2.5-2.5" />
                    <path d="M12 2v4M16 4l-2 2M8 4l2 2" />
                    <path d="M3 10h18" />
                    <path d="M5 22h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                  </svg>
                  <span>{t.emergency.fireDepartment}</span>
                </div>
                <span className="font-semibold">{t.emergency.fireDepartmentPhone}</span>
              </button>
            </div>
          </div>

          {/* Our Number Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#EDEBEB] p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#94782C] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#274754] mb-1">
                  {t.emergency.ourNumber}
                </h2>
                <p className="text-sm text-[#94782C] mb-3">
                  {t.emergency.ourNumberDescription}
                </p>
                <button
                  onClick={() => handleCall(t.emergency.ourPhone)}
                  className="w-full py-3 px-4 bg-[#94782C] text-white rounded-lg font-medium hover:bg-[#7a6324] transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {t.emergency.ourPhone}
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#EDEBEB] p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1a8a5c] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#274754] mb-1">
                  {t.emergency.whatsapp}
                </h2>
                <p className="text-sm text-[#94782C] mb-3">
                  {t.emergency.whatsappDescription}
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 px-4 bg-[#1a8a5c] text-white rounded-lg font-medium hover:bg-[#156d47] transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {t.emergency.chatOnWhatsapp}
                </button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#EDEBEB] p-5">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-[#D2CFC4] text-[#274754] rounded-lg font-medium hover:bg-[#C1B29E] transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {t.logout}
            </button>
          </div>
        </div>

        <BottomNavigation locale={locale} />
      </div>
    </LocaleLayout>
  );
}

