'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../../components/LocaleLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookingDataFromStorage, getRemainingDays } from '../../../lib/bookingUtils';
import { fetchUnits, extractUnitNumber, Unit } from '@/lib/apiUtils';

// Translation content
const translations = {
  en: {
    title: "Cleaning Services",
    subtitle: "Choose what works for you",
    quickBooking: "Quick Booking",
    services: "All Services",
    popular: "Most Popular",
    recommended: "Recommended for Your Unit",
    
    // Service Categories
    regularCleaning: "Regular Cleaning",
    deepCleaning: "Deep Cleaning",
    monthlyPlan: "Monthly Plan",
    linens: "Linens & Towels",
    extras: "Extra Guest Services",
    
    // Service Details
    basicCleaningTitle: "Quick Clean",
    basicCleaningDesc: "Bathroom, floors, and trash removal",
    
    fullCleaningTitle: "Full Apartment Clean",
    fullCleaningDesc: "Complete cleaning of your entire unit",
    
    monthlyTitle: "Monthly Package",
    monthlyDesc: "4 visits per month • Save 20%",
    
    linensTitle: "Fresh Linens",
    linensDesc: "Bed sheets, blankets & towels",
    
    guestTitle: "Guest Setup",
    guestDesc: "Complete bedding set for additional guests",
    
    // Service Info
    duration: "2 hours",
    available: "Today, 3-8 PM",
    fromPrice: "From",
    perVisit: "/ visit",
    perMonth: "/ month",
    saveUp: "Save",
    
    // Steps
    step1: "Service",
    step2: "Time",
    step3: "Confirm",
    
    // Time Selection
    pickTime: "Pick a time",
    todayOnly: "Available today",
    workingHours: "3:00 PM - 8:00 PM",
    lateNote: "Requests after 7 PM scheduled for next day",
    
    // Confirmation
    reviewBooking: "Review your booking",
    totalPrice: "Total",
    confirmPay: "Request Service",
    
    // Unit Info
    yourUnit: "Your Unit",
    building: "Building",
    stayDuration: "Stay"
  },
  ar: {
    title: "خدمات التنظيف",
    subtitle: "اختر ما يناسبك",
    quickBooking: "حجز سريع",
    services: "جميع الخدمات",
    popular: "الأكثر طلباً",
    recommended: "موصى به لوحدتك",
    
    regularCleaning: "تنظيف عادي",
    deepCleaning: "تنظيف شامل",
    monthlyPlan: "باقة شهرية",
    linens: "مفارش ومناشف",
    extras: "خدمات الضيوف",
    
    basicCleaningTitle: "تنظيف سريع",
    basicCleaningDesc: "حمام، أرضيات، وإزالة القمامة",
    
    fullCleaningTitle: "تنظيف الشقة كاملة",
    fullCleaningDesc: "تنظيف شامل لكامل الوحدة",
    
    monthlyTitle: "الباقة الشهرية",
    monthlyDesc: "4 زيارات شهرياً • وفر 20%",
    
    linensTitle: "مفارش نظيفة",
    linensDesc: "أغطية أسرّة، بطانيات ومناشف",
    
    guestTitle: "تجهيز ضيف",
    guestDesc: "طقم فراش كامل للضيوف الإضافيين",
    
    duration: "ساعتان",
    available: "اليوم، 3-8 مساءً",
    fromPrice: "من",
    perVisit: "/ زيارة",
    perMonth: "/ شهر",
    saveUp: "وفر",
    
    step1: "الخدمة",
    step2: "الوقت",
    step3: "تأكيد",
    
    pickTime: "اختر الوقت",
    todayOnly: "متاح اليوم",
    workingHours: "3:00 مساءً - 8:00 مساءً",
    lateNote: "الطلبات بعد 7 مساءً تُجدول لليوم التالي",
    
    reviewBooking: "راجع حجزك",
    totalPrice: "المجموع",
    confirmPay: "طلب الخدمة",
    
    yourUnit: "وحدتك",
    building: "المبنى",
    stayDuration: "مدة الإقامة"
  }
};

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
  category: 'cleaning' | 'monthly' | 'linens' | 'extras';
  popular?: boolean;
  unitTypes: string[];
}

export default function CleaningServices({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'service' | 'time' | 'confirmation'>('service');

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  }, [params]);

  useEffect(() => {
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en');
      return;
    }
  }, [locale, router]);

  useEffect(() => {
    const loadUnitData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const bookingData = getBookingDataFromStorage();
        if (!bookingData) {
          setError('No booking data found');
          return;
        }

        const unitNumber = extractUnitNumber(bookingData.accommodation);
        if (!unitNumber) {
          setError('Unable to extract unit number');
          return;
        }

        const units = await fetchUnits();
        const unit = units.find(u => u.Reference === unitNumber);
        
        if (!unit) {
          setError(`Unit ${unitNumber} not found`);
          return;
        }

        setCurrentUnit(unit);
      } catch (err) {
        console.error('Error loading unit data:', err);
        setError('Failed to load unit information');
      } finally {
        setIsLoading(false);
      }
    };

    loadUnitData();
  }, []);

  if (isLoading) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#274754] mx-auto mb-4"></div>
            <p className="text-[#274754]">Loading...</p>
          </div>
        </div>
      </LocaleLayout>
    );
  }

  if (error || !currentUnit) {
    return (
      <LocaleLayout locale={locale}>
        <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-[#274754] mb-4">{error || 'Unit not available'}</p>
            <Button 
              onClick={() => router.back()}
              className="bg-[#274754] hover:bg-[#94782C] text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
      </LocaleLayout>
    );
  }

  const t = translations[locale as keyof typeof translations];
  
  const getUnitType = (bedroomCount: string) => {
    const count = parseInt(bedroomCount);
    if (count === 0) return 'studio';
    if (count === 1) return '1-bedroom';
    if (count === 2) return '2-bedroom';
    if (count >= 3) return '3-bedroom';
    return 'studio';
  };

  const remainingDays = getRemainingDays() || 0;
  const unitType = getUnitType(currentUnit.Number_of_bedrooms);

  // Service configurations
  const allServices: ServiceOption[] = [
    {
      id: 'basic-clean',
      title: t.basicCleaningTitle,
      description: t.basicCleaningDesc,
      icon: '🧹',
      price: 200,
      duration: '2h',
      category: 'cleaning',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom']
    },
    {
      id: 'studio-full',
      title: t.fullCleaningTitle,
      description: t.fullCleaningDesc,
      icon: '✨',
      price: 200,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['studio']
    },
    {
      id: '1br-full',
      title: t.fullCleaningTitle,
      description: t.fullCleaningDesc,
      icon: '✨',
      price: 260,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['1-bedroom']
    },
    {
      id: '2br-full',
      title: t.fullCleaningTitle,
      description: t.fullCleaningDesc,
      icon: '✨',
      price: 365,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['2-bedroom']
    },
    {
      id: '3br-full',
      title: t.fullCleaningTitle,
      description: t.fullCleaningDesc,
      icon: '✨',
      price: 380,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['3-bedroom']
    },
    {
      id: 'monthly-studio',
      title: t.monthlyTitle,
      description: t.monthlyDesc,
      icon: '📅',
      price: 780,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['studio']
    },
    {
      id: 'monthly-1br',
      title: t.monthlyTitle,
      description: t.monthlyDesc,
      icon: '📅',
      price: 1020,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['1-bedroom']
    },
    {
      id: 'monthly-2br',
      title: t.monthlyTitle,
      description: t.monthlyDesc,
      icon: '📅',
      price: 1440,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['2-bedroom']
    },
    {
      id: 'monthly-3br',
      title: t.monthlyTitle,
      description: t.monthlyDesc,
      icon: '📅',
      price: 1500,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['3-bedroom']
    },
    {
      id: 'linens-master',
      title: t.linensTitle + ' - Master',
      description: '1 master bed + 2 small + 2 large towels',
      icon: '🛏️',
      price: 131,
      duration: '1h',
      category: 'linens',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom']
    },
    {
      id: 'linens-master-2single',
      title: t.linensTitle + ' - Large',
      description: '1 master + 2 single beds + 4 small + 4 large towels',
      icon: '🛏️',
      price: 245,
      duration: '1h',
      category: 'linens',
      unitTypes: ['1-bedroom', '2-bedroom', '3-bedroom']
    },
    {
      id: 'linens-master-4single',
      title: t.linensTitle + ' - XL',
      description: '1 master + 4 single beds + 6 small + 6 large towels',
      icon: '🛏️',
      price: 359,
      duration: '1h',
      category: 'linens',
      unitTypes: ['2-bedroom', '3-bedroom']
    },
    {
      id: 'guest-package',
      title: t.guestTitle,
      description: t.guestDesc,
      icon: '👥',
      price: 85,
      duration: '30min',
      category: 'extras',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom']
    }
  ];

  const availableServices = allServices.filter(service => 
    service.unitTypes.includes(unitType)
  );

  const getAvailableTimeSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const slots = [];
    for (let hour = 15; hour < 20; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const slotTime = hour * 60;
      
      if (slotTime > currentTime) {
        slots.push(timeSlot);
      }
    }
    
    return slots;
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('confirmation');
  };

  const handleConfirm = () => {
    if (!selectedService || !selectedTime) return;
    
    const service = availableServices.find(s => s.id === selectedService);
    if (!service) return;
    
    // Create WhatsApp message
    const bookingData = getBookingDataFromStorage();
    const message = `Hello! I would like to request a cleaning service:\n\n` +
      `📋 Service: ${service.title}\n` +
      `🏠 Unit: ${currentUnit.Reference}\n` +
      `🛏️ Unit Type: ${currentUnit.Number_of_bedrooms} bedroom\n` +
      `🏢 Building: ${currentUnit.Development}\n` +
      `⏰ Preferred Time: ${selectedTime}\n` +
      `💰 Price: ${service.price} SAR\n\n` +
      `Guest Name: ${bookingData?.guestName || 'N/A'}\n` +
      `Email: ${bookingData?.email || 'N/A'}\n` +
      `Phone: ${bookingData?.phone || 'N/A'}`;
    
    const whatsappNumber = '966500000000'; // Replace with actual customer service number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const selectedServiceData = availableServices.find(s => s.id === selectedService);

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-[#FAF6F5]">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center mb-3">
              <button 
                onClick={() => currentStep === 'service' ? router.back() : setCurrentStep(currentStep === 'confirmation' ? 'time' : 'service')}
                className="p-2 -ml-2 text-[#274754]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[#274754]">{t.title}</h1>
                <p className="text-sm text-[#94782C]">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between px-4">
              {[t.step1, t.step2, t.step3].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex flex-col items-center ${index <= ['service', 'time', 'confirmation'].indexOf(currentStep) ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < ['service', 'time', 'confirmation'].indexOf(currentStep) 
                        ? 'bg-[#94782C] text-white' 
                        : index === ['service', 'time', 'confirmation'].indexOf(currentStep)
                        ? 'bg-[#274754] text-white'
                        : 'bg-[#EDEBED] text-[#94782C]'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 font-medium text-[#274754]">{step}</span>
                  </div>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-2 ${index < ['service', 'time', 'confirmation'].indexOf(currentStep) ? 'bg-[#94782C]' : 'bg-[#EDEBED]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Selection */}
        {currentStep === 'service' && (
          <div className="pb-6">
            {/* Unit Info Card */}
            <div className="px-4 pt-4 pb-2">
              <div className="bg-white border border-[#EDEBED] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#94782C] mb-1">{t.yourUnit}</p>
                    <p className="text-lg font-bold text-[#274754]">{currentUnit.Reference}</p>
                    <p className="text-sm text-[#94782C]">{currentUnit.Number_of_bedrooms} bedroom • {remainingDays} days</p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-[#274754] mb-3">{t.recommended}</h2>
              <div className="space-y-3">
                {availableServices
                  .filter(s => s.popular || s.category === 'cleaning')
                  .slice(0, 2)
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
                    >
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">{service.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#274754]">{service.title}</h3>
                            {service.popular && (
                              <span className="bg-[#CDB990] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                {t.popular}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#94782C] mb-2">{service.description}</p>
                          <div className="flex items-center gap-3 text-xs text-[#274754]">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {service.duration}
                            </span>
                            <span className="text-[#94782C]">•</span>
                            <span>{t.todayOnly}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-[#274754]">{service.price}</p>
                          <p className="text-xs text-[#94782C]">SAR</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Monthly Package */}
            {availableServices.some(s => s.category === 'monthly') && (
              <div className="px-4 pt-6">
                <h2 className="text-base font-bold text-[#274754] mb-3">{t.monthlyPlan}</h2>
                {availableServices
                  .filter(s => s.category === 'monthly')
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="w-full bg-white border-2 border-[#CDB990] rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
                    >
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">{service.icon}</div>
                        <div className="flex-1 text-left">
                          <h3 className="font-bold text-[#274754] mb-1">{service.title}</h3>
                          <p className="text-xs text-[#94782C] mb-2">{service.description}</p>
                          <div className="inline-block bg-[#CDB990] text-white text-xs px-2 py-1 rounded-full">
                            {t.saveUp} 20%
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-[#274754]">{service.price}</p>
                          <p className="text-xs text-[#94782C]">SAR{t.perMonth}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* Linens & Extras */}
            <div className="px-4 pt-6">
              <h2 className="text-base font-bold text-[#274754] mb-3">{t.linens} & {t.extras}</h2>
              <div className="grid grid-cols-2 gap-3">
                {availableServices
                  .filter(s => s.category === 'linens' || s.category === 'extras')
                  .map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="bg-white rounded-2xl p-3 shadow-sm active:scale-95 transition-transform"
                    >
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <h3 className="font-bold text-sm text-[#274754] mb-1">{service.title}</h3>
                      <p className="text-xs text-[#94782C] mb-2 line-clamp-2">{service.description}</p>
                      <p className="text-lg font-bold text-[#274754]">{service.price} <span className="text-xs font-normal">SAR</span></p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Selection */}
        {currentStep === 'time' && selectedServiceData && (
          <div className="px-4 py-6">
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center">
                <div className="text-3xl mr-4">{selectedServiceData.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#274754]">{selectedServiceData.title}</h3>
                  <p className="text-sm text-[#94782C]">{selectedServiceData.description}</p>
                </div>
                <p className="text-xl font-bold text-[#274754]">{selectedServiceData.price}<span className="text-sm"> SAR</span></p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-[#274754] mb-2">{t.pickTime}</h2>
            <p className="text-sm text-[#94782C] mb-4">{t.workingHours}</p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {getAvailableTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-4 rounded-xl font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-[#274754] text-white shadow-lg scale-105'
                      : 'bg-white text-[#274754] shadow-sm active:scale-95'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="bg-[#FAF6F5] rounded-xl p-3 text-sm text-[#274754] border border-[#EDEBED]">
              <p className="flex items-start gap-2">
                <span className="text-lg">⏰</span>
                <span>{t.lateNote}</span>
              </p>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirmation' && selectedServiceData && selectedTime && (
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold text-[#274754] mb-4">{t.reviewBooking}</h2>

            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <div className="flex items-center mb-4 pb-4 border-b border-[#EDEBED]">
                <div className="text-3xl mr-4">{selectedServiceData.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#274754]">{selectedServiceData.title}</h3>
                  <p className="text-sm text-[#94782C]">{selectedServiceData.description}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94782C]">{t.yourUnit}</span>
                  <span className="font-medium text-[#274754]">{currentUnit.Reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94782C]">Time</span>
                  <span className="font-medium text-[#274754]">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94782C]">Duration</span>
                  <span className="font-medium text-[#274754]">{selectedServiceData.duration}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#EDEBED] flex justify-between items-center">
                <span className="font-bold text-[#274754]">{t.totalPrice}</span>
                <span className="text-2xl font-bold text-[#274754]">{selectedServiceData.price} <span className="text-base">SAR</span></span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-[#274754] hover:bg-[#94782C] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              {t.confirmPay}
            </button>
          </div>
        )}
      </div>
    </LocaleLayout>
  );
}