'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../../components/LocaleLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Translation content
const translations = {
  en: {
    title: "Cleaning Services",
    subtitle: "Select your preferred cleaning service",
    backButton: "Back",
    confirmButton: "Confirm Selection",
    scheduleTitle: "Schedule Your Service",
    workingHours: "Working Hours: 3:00 PM - 8:00 PM",
    serviceDuration: "Service Duration: 2 hours",
    nextDayNote: "Requests after 7:00 PM will be scheduled for next day at 3:00 PM",
    selectTime: "Select Preferred Time",
    categories: {
      basicCleaning: "Basic Cleaning Services",
      linenServices: "Linen & Towel Packages",
      monthlyPackages: "Monthly Cleaning Packages"
    },
    services: {
      basicCleaning: "Basic Cleaning (Bathroom, Mopping, Sweeping, Trash)",
      basicCleaningDesc: "Bathroom cleaning, mopping, sweeping, and trash removal",
      studioCleaning: "Studio Cleaning",
      oneBedroomCleaning: "1 Bedroom Cleaning", 
      twoBedroomCleaning: "2 Bedroom Cleaning",
      threeBedroomCleaning: "3 Bedroom Cleaning",
      masterBedroomPackage: "1 Master Bed + Towels (2 small + 2 large)",
      masterTwoSinglePackage: "1 Master + 2 Single Beds + Towels (4 small + 4 large)",
      masterFourSinglePackage: "1 Master + 4 Single Beds + Towels (6 small + 6 large)",
      twoMasterPackage: "2 Master Beds + Towels (4 small + 4 large)",
      bedCoverPackage: "Bed Cover + Blanket",
      guestPackage: "Additional Guest Package (Bed cover + Blanket + Pillow + Small towel + Large towel + Slippers)",
      threePillows: "3 Pillows",
      towelsPackage: "Towels (2 small + 2 large)",
      threeSmallTowels: "3 Small Towels",
      threeLargeTowels: "3 Large Towels"
    },
    monthlyPackages: {
      studioMonthly: "Monthly Package - Studio (4 visits)",
      oneBedroomMonthly: "Monthly Package - 1 Bedroom (4 visits)",
      twoBedroomMonthly: "Monthly Package - 2 Bedrooms (4 visits)", 
      threeBedroomMonthly: "Monthly Package - 3 Bedrooms (4 visits)"
    },
    actions: {
      bookingScheduled: "Service booking scheduled!",
      confirmationSent: "Confirmation sent to your email",
      estimatedTime: "Service will be completed within 2 hours",
      contactInfo: "Our team will contact you shortly"
    }
  },
  ar: {
    title: "خدمات التنظيف",
    subtitle: "اختر خدمة التنظيف المفضلة لديك",
    backButton: "رجوع",
    confirmButton: "تأكيد الاختيار",
    scheduleTitle: "جدولة خدمتك",
    workingHours: "ساعات العمل: 3:00 مساءً - 8:00 مساءً",
    serviceDuration: "مدة الخدمة: ساعتان",
    nextDayNote: "الطلبات بعد الساعة 7:00 مساءً ستُجدول لليوم التالي في الساعة 3:00 مساءً",
    selectTime: "اختر الوقت المفضل",
    categories: {
      basicCleaning: "خدمات التنظيف الأساسية",
      linenServices: "باقات المفارش والمناشف",
      monthlyPackages: "باقات التنظيف الشهرية"
    },
    services: {
      basicCleaning: "تنظيف أساسي (حمام، تمسيح، كنس، زبالة)",
      basicCleaningDesc: "تنظيف الحمام، التمسيح، الكنس، وإزالة الزبالة",
      studioCleaning: "تنظيف الاستوديو",
      oneBedroomCleaning: "تنظيف غرفة نوم واحدة",
      twoBedroomCleaning: "تنظيف غرفتي نوم",
      threeBedroomCleaning: "تنظيف 3 غرف نوم",
      masterBedroomPackage: "1 سرير ماستر + مناشف (2 صغيرة + 2 كبيرة)",
      masterTwoSinglePackage: "1 سرير ماستر + 2 سرير مفرد + مناشف (4 صغيرة + 4 كبيرة)",
      masterFourSinglePackage: "1 سرير ماستر + 4 سرير مفرد + مناشف (6 صغيرة + 6 كبيرة)",
      twoMasterPackage: "2 سرير ماستر + مناشف (4 صغيرة + 4 كبيرة)",
      bedCoverPackage: "غطاء سرير + بطانية",
      guestPackage: "باقة ضيف آخر (غطاء سرير + بطانية + مخدة + منشفة صغيرة + منشفة كبيرة + سليبر)",
      threePillows: "3 مخدات",
      towelsPackage: "مناشف (2 صغيرة + 2 كبيرة)",
      threeSmallTowels: "3 مناشف صغيرة",
      threeLargeTowels: "3 مناشف كبيرة"
    },
    monthlyPackages: {
      studioMonthly: "الباقة الشهرية - استوديو (4 زيارات)",
      oneBedroomMonthly: "الباقة الشهرية - غرفة نوم واحدة (4 زيارات)",
      twoBedroomMonthly: "الباقة الشهرية - غرفتي نوم (4 زيارات)",
      threeBedroomMonthly: "الباقة الشهرية - 3 غرف نوم (4 زيارات)"
    },
    actions: {
      bookingScheduled: "تم جدولة حجز الخدمة!",
      confirmationSent: "تم إرسال التأكيد إلى بريدك الإلكتروني",
      estimatedTime: "ستتم الخدمة خلال ساعتين",
      contactInfo: "سيتواصل معك فريقنا قريباً"
    }
  }
};

interface CleaningService {
  id: string;
  name: string;
  description?: string;
  icon: string;
  available: boolean;
  category: string;
  price?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  services: CleaningService[];
}

export default function CleaningServices({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Unit information - in a real app, this would come from props or API
  const [unitInfo] = useState({
    unitNumber: '#301',
    unitType: '2-bedroom', // studio, 1-bedroom, 2-bedroom, 3-bedroom
    checkInDate: '2025-06-10',
    checkOutDate: '2026-06-11',
    stayDuration: 365, // days
    buildingName: 'Al-Riyadh Tower',
    hasKitchen: true,
    hasBalcony: true,
    floorNumber: 3
  });

  useEffect(() => {
    // Get locale from params
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
      setIsLoading(false);
    });
  }, [params]);

  useEffect(() => {
    // Validate locale
    if (!['en', 'ar'].includes(locale)) {
      router.push('/en');
      return;
    }
  }, [locale, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const t = translations[locale as keyof typeof translations];
  // const isRTL = locale === 'ar';

  // Get recommended services based on unit type and stay duration
  const getRecommendedServices = () => {
    const recommendations = [];
    
    // Based on unit type
    if (unitInfo.unitType === 'studio') {
      recommendations.push('studio-cleaning', 'studio-monthly');
    } else if (unitInfo.unitType === '1-bedroom') {
      recommendations.push('one-bedroom-cleaning', 'master-bedroom-package', 'one-bedroom-monthly');
    } else if (unitInfo.unitType === '2-bedroom') {
      recommendations.push('two-bedroom-cleaning', 'master-two-single-package', 'two-bedroom-monthly');
    } else if (unitInfo.unitType === '3-bedroom') {
      recommendations.push('three-bedroom-cleaning', 'master-four-single-package', 'three-bedroom-monthly');
    }
    
    // Based on stay duration
    if (unitInfo.stayDuration >= 30) {
      recommendations.push('basic-cleaning-only');
    }
    if (unitInfo.stayDuration >= 90) {
      recommendations.push(...['studio-monthly', 'one-bedroom-monthly', 'two-bedroom-monthly', 'three-bedroom-monthly']);
    }
    
    return recommendations;
  };

  // Filter services based on unit type - only show relevant services
  const getFilteredServices = (services: CleaningService[]) => {
    return services.filter(service => {
      // Always show basic cleaning and linen services
      if (service.category === 'linen-services') {
        return true;
      }
      
      // Filter cleaning services based on unit type
      if (service.category === 'basic-cleaning') {
        if (unitInfo.unitType === 'studio' && service.id === 'studio-cleaning') return true;
        if (unitInfo.unitType === '1-bedroom' && service.id === 'one-bedroom-cleaning') return true;
        if (unitInfo.unitType === '2-bedroom' && service.id === 'two-bedroom-cleaning') return true;
        if (unitInfo.unitType === '3-bedroom' && service.id === 'three-bedroom-cleaning') return true;
        if (service.id === 'basic-cleaning-only') return true; // Always show basic cleaning
        return false;
      }
      
      // Filter monthly packages based on unit type
      if (service.category === 'monthly-packages') {
        if (unitInfo.unitType === 'studio' && service.id === 'studio-monthly') return true;
        if (unitInfo.unitType === '1-bedroom' && service.id === 'one-bedroom-monthly') return true;
        if (unitInfo.unitType === '2-bedroom' && service.id === 'two-bedroom-monthly') return true;
        if (unitInfo.unitType === '3-bedroom' && service.id === 'three-bedroom-monthly') return true;
        return false;
      }
      
      return true;
    });
  };

  const recommendedServices = getRecommendedServices();

  // All available services
  const allServices = {
    'basic-cleaning': [
      {
        id: 'basic-cleaning-only',
        name: t.services.basicCleaning,
        description: t.services.basicCleaningDesc,
        icon: '🧹',
        available: true,
        category: 'basic-cleaning',
        price: '200 SAR'
      },
      {
        id: 'studio-cleaning',
        name: t.services.studioCleaning,
        icon: '🏠',
        available: true,
        category: 'basic-cleaning',
        price: '200 SAR'
      },
      {
        id: 'one-bedroom-cleaning',
        name: t.services.oneBedroomCleaning,
        icon: '🛏️',
        available: true,
        category: 'basic-cleaning',
        price: '260 SAR'
      },
      {
        id: 'two-bedroom-cleaning',
        name: t.services.twoBedroomCleaning,
        icon: '🛏️',
        available: true,
        category: 'basic-cleaning',
        price: '365 SAR'
      },
      {
        id: 'three-bedroom-cleaning',
        name: t.services.threeBedroomCleaning,
        icon: '🛏️',
        available: true,
        category: 'basic-cleaning',
        price: '380 SAR'
      }
    ],
    'linen-services': [
      {
        id: 'master-bedroom-package',
        name: t.services.masterBedroomPackage,
        icon: '🛏️',
        available: true,
        category: 'linen-services',
        price: '131 SAR'
      },
      {
        id: 'master-two-single-package',
        name: t.services.masterTwoSinglePackage,
        icon: '🛏️',
        available: true,
        category: 'linen-services',
        price: '245 SAR'
      },
      {
        id: 'master-four-single-package',
        name: t.services.masterFourSinglePackage,
        icon: '🛏️',
        available: true,
        category: 'linen-services',
        price: '359 SAR'
      },
      {
        id: 'two-master-package',
        name: t.services.twoMasterPackage,
        icon: '🛏️',
        available: true,
        category: 'linen-services',
        price: '230 SAR'
      },
      {
        id: 'bed-cover-package',
        name: t.services.bedCoverPackage,
        icon: '🛋️',
        available: true,
        category: 'linen-services',
        price: '67 SAR'
      },
      {
        id: 'guest-package',
        name: t.services.guestPackage,
        icon: '👥',
        available: true,
        category: 'linen-services',
        price: '85 SAR'
      },
      {
        id: 'three-pillows',
        name: t.services.threePillows,
        icon: '🛏️',
        available: true,
        category: 'linen-services',
        price: '52 SAR'
      },
      {
        id: 'towels-package',
        name: t.services.towelsPackage,
        icon: '🧺',
        available: true,
        category: 'linen-services',
        price: '77 SAR'
      },
      {
        id: 'three-small-towels',
        name: t.services.threeSmallTowels,
        icon: '🧺',
        available: true,
        category: 'linen-services',
        price: '57 SAR'
      },
      {
        id: 'three-large-towels',
        name: t.services.threeLargeTowels,
        icon: '🧺',
        available: true,
        category: 'linen-services',
        price: '67 SAR'
      }
    ],
    'monthly-packages': [
      {
        id: 'studio-monthly',
        name: t.monthlyPackages.studioMonthly,
        icon: '📅',
        available: true,
        category: 'monthly-packages',
        price: '780 SAR'
      },
      {
        id: 'one-bedroom-monthly',
        name: t.monthlyPackages.oneBedroomMonthly,
        icon: '📅',
        available: true,
        category: 'monthly-packages',
        price: '1020 SAR'
      },
      {
        id: 'two-bedroom-monthly',
        name: t.monthlyPackages.twoBedroomMonthly,
        icon: '📅',
        available: true,
        category: 'monthly-packages',
        price: '1440 SAR'
      },
      {
        id: 'three-bedroom-monthly',
        name: t.monthlyPackages.threeBedroomMonthly,
        icon: '📅',
        available: true,
        category: 'monthly-packages',
        price: '1500 SAR'
      }
    ]
  };

  // Create filtered service categories
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'basic-cleaning',
      name: t.categories.basicCleaning,
      services: getFilteredServices(allServices['basic-cleaning'])
    },
    {
      id: 'linen-services',
      name: t.categories.linenServices,
      services: getFilteredServices(allServices['linen-services'])
    },
    {
      id: 'monthly-packages',
      name: t.categories.monthlyPackages,
      services: getFilteredServices(allServices['monthly-packages'])
    }
  ].filter(category => category.services.length > 0); // Only show categories that have services

  const handleServiceSelect = (serviceId: string) => {
    // Toggle selection - if clicking the same service, deselect it
    if (selectedService === serviceId) {
      setSelectedService(null);
      setSelectedTime(null);
      setSelectedDate(null);
    } else {
      setSelectedService(serviceId);
      // Auto-select today's date when service is selected
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  };

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Working hours: 3:00 PM (15:00) to 8:00 PM (20:00)
    const startHour = 15; // 3:00 PM
    const endHour = 20;   // 8:00 PM
    
    const timeSlots = [];
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      const slotTime = hour * 60;
      
      // Only show future time slots
      if (slotTime > currentTime) {
        timeSlots.push(timeSlot);
      }
    }
    
    return timeSlots;
  };

  // Calculate estimated arrival time
  const getEstimatedArrivalTime = (selectedTimeSlot: string) => {
    if (!selectedTimeSlot) return null;
    
    const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
    const arrivalTime = new Date();
    arrivalTime.setHours(hours + 2, minutes, 0, 0); // Add 2 hours for service duration
    
    return arrivalTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Check if request is after 7 PM (next day scheduling)
  const isNextDayScheduling = (selectedTimeSlot: string) => {
    if (!selectedTimeSlot) return false;
    const [hours] = selectedTimeSlot.split(':').map(Number);
    return hours >= 19; // 7:00 PM or later
  };

  const handleConfirm = () => {
    if (!selectedService || !selectedTime) return;
    
    // Navigate to payment page
    router.push(`/${locale}/payment?service=${selectedService}&time=${selectedTime}&price=${getSelectedServicePrice()}&serviceName=${encodeURIComponent(getSelectedServiceName())}`);
  };

  const getSelectedServicePrice = () => {
    if (!selectedService) return 0;
    
    for (const category of serviceCategories) {
      const service = category.services.find(s => s.id === selectedService);
      if (service) {
        return parseInt(service.price?.replace(' SAR', '') || '0');
      }
    }
    return 0;
  };

  const getSelectedServiceName = () => {
    if (!selectedService) return '';
    
    for (const category of serviceCategories) {
      const service = category.services.find(s => s.id === selectedService);
      if (service) {
        return service.name;
      }
    }
    return '';
  };

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-lg font-medium text-gray-800">{t.title}</h1>
              <div className="w-9"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">{t.subtitle}</p>
          </div>
        </div>

        {/* Unit Information */}
        <div className="px-4 py-4 bg-blue-50 border-b">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">Your Unit Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Unit:</span>
                <span className="font-medium text-gray-800 ml-1">{unitInfo.unitNumber}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-800 ml-1">{unitInfo.unitType.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-500">Building:</span>
                <span className="font-medium text-gray-800 ml-1">{unitInfo.buildingName}</span>
              </div>
              <div>
                <span className="text-gray-500">Stay:</span>
                <span className="font-medium text-gray-800 ml-1">{unitInfo.stayDuration} days</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700">
                💡 Services are recommended based on your unit type and stay duration
              </p>
            </div>
          </div>
        </div>


        {/* Services Accordion */}
        <div className="px-4 py-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {serviceCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border-0">
                <AccordionTrigger className="bg-white rounded-lg px-4 py-3 hover:no-underline hover:bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium text-gray-800 text-left">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.services.length} services</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    {category.services.map((service) => (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer border-2 relative ${
                          selectedService === service.id
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        } ${!service.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => service.available && handleServiceSelect(service.id)}
                      >
                        {/* Recommendation Badge */}
                        {recommendedServices.includes(service.id) && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Recommended
                          </div>
                        )}
                        
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`text-2xl p-2 rounded-full ${
                                selectedService === service.id 
                                  ? 'bg-blue-100' 
                                  : 'bg-gray-100'
                              }`}>
                                {service.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className={`font-medium mb-1 ${
                                    selectedService === service.id 
                                      ? 'text-blue-800' 
                                      : 'text-gray-800'
                                  }`}>
                                    {service.name}
                                  </h3>
                                  {recommendedServices.includes(service.id) && (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  )}
                                </div>
                                {service.description && (
                                  <p className="text-xs text-gray-600">{service.description}</p>
                                )}
                                {recommendedServices.includes(service.id) && (
                                  <p className="text-xs text-green-600 font-medium mt-1">
                                    Perfect for your {unitInfo.unitType.replace('-', ' ')} unit
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className={`text-lg font-medium ${
                                  selectedService === service.id 
                                    ? 'text-blue-600' 
                                    : 'text-gray-700'
                                }`}>
                                  {service.price}
                                </div>
                                <div className="text-xs text-gray-500">per service</div>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedService === service.id 
                                  ? 'bg-blue-500 border-blue-500' 
                                  : 'border-gray-300'
                              }`}>
                                {selectedService === service.id && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Schedule Service Button */}
        {selectedService && !selectedTime && (
          <div className="px-4 py-4 bg-white border-t">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-800">Service Selected</h3>
              </div>
              <div className="text-sm text-gray-700 mb-4">
                <p><strong>Service:</strong> {getSelectedServiceName()}</p>
                <p><strong>Price:</strong> {getSelectedServicePrice()} SAR</p>
              </div>
              <Button 
                onClick={() => setSelectedTime('schedule')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
              >
                Schedule Your Service
              </Button>
            </div>
          </div>
        )}

        {/* Time Selection Section */}
        {selectedService && selectedTime === 'schedule' && (
          <div className="px-4 py-4 bg-white border-t">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">{t.scheduleTitle}</h3>
              
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800">{t.workingHours}</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-700">{t.serviceDuration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-orange-700">{t.nextDayNote}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectTime}</label>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableTimeSlots().map((timeSlot) => (
                    <button
                      key={timeSlot}
                      onClick={() => setSelectedTime(timeSlot)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium ${
                        selectedTime === timeSlot
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {timeSlot}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTime && selectedTime !== 'schedule' && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-green-800">Service Scheduled</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p><strong>Request Time:</strong> {selectedTime}</p>
                    <p><strong>Estimated Arrival:</strong> {getEstimatedArrivalTime(selectedTime)}</p>
                    {isNextDayScheduling(selectedTime) && (
                      <p className="text-orange-600 font-medium">⚠️ Service will be provided next day at 3:00 PM</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Service Summary */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected Service</p>
                  <p className="font-medium text-gray-800">{getSelectedServiceName()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Price</p>
                  <p className="text-lg font-medium text-blue-600">{getSelectedServicePrice()} SAR</p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <Button 
              onClick={handleConfirm}
              disabled={!selectedTime || selectedTime === 'schedule'}
              className={`w-full py-3 text-base font-medium ${
                selectedTime && selectedTime !== 'schedule'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedTime && selectedTime !== 'schedule' ? t.confirmButton : 'Select Time First'}
            </Button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">{t.actions.bookingScheduled}</h3>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 mb-1">{t.actions.confirmationSent}</p>
                  <p className="text-xs text-gray-500 mb-1">{t.actions.estimatedTime}</p>
                  <p className="text-xs text-gray-500">{t.actions.contactInfo}</p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Service: <span className="font-medium text-blue-600">{getSelectedServiceName()}</span></div>
                  {selectedTime && (
                    <div>Scheduled for: <span className="font-medium text-blue-600">{selectedTime}</span></div>
                  )}
                  {selectedTime && (
                    <div>Estimated arrival: <span className="font-medium text-blue-600">{getEstimatedArrivalTime(selectedTime)}</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocaleLayout>
  );
}
