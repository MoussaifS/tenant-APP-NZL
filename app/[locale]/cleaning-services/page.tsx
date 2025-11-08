'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../../components/LocaleLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookingDataFromStorage, getRemainingDays } from '../../../lib/bookingUtils';
import { fetchUnits, extractUnitNumber, Unit, createRequest, CreateRequestData } from '@/lib/apiUtils';
import { getMessages } from '@/messages';

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
  arqaamCategory?: string; // Arqam CRM category in Arabic
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  }, [params]);

  useEffect(() => {
    if (!['en', 'ar', 'es', 'zh'].includes(locale)) {
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

  const t = getMessages(locale as 'en' | 'ar' | 'es' | 'zh');

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
              {t.goBack}
            </Button>
          </div>
        </div>
      </LocaleLayout>
    );
  }
  
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

  // Service configurations with Arqam CRM categories
  const allServices: ServiceOption[] = [
    {
      id: 'basic-clean',
      title: t.cleaning.basicCleaningTitle,
      description: t.cleaning.basicCleaningDesc,
      icon: '🧹',
      price: 200,
      duration: '2h',
      category: 'cleaning',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom'],
      arqaamCategory: 'تنظيف ستوديو' // Default, will be mapped based on unit type
    },
    {
      id: 'studio-full',
      title: t.cleaning.fullCleaningTitle,
      description: t.cleaning.fullCleaningDesc,
      icon: '✨',
      price: 200,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['studio'],
      arqaamCategory: 'تنظيف ستوديو'
    },
    {
      id: '1br-full',
      title: t.cleaning.fullCleaningTitle,
      description: t.cleaning.fullCleaningDesc,
      icon: '✨',
      price: 260,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['1-bedroom'],
      arqaamCategory: 'تنظيف شقة 1 غرفة'
    },
    {
      id: '2br-full',
      title: t.cleaning.fullCleaningTitle,
      description: t.cleaning.fullCleaningDesc,
      icon: '✨',
      price: 365,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['2-bedroom'],
      arqaamCategory: 'تنظيف شقة 2 غرفة'
    },
    {
      id: '3br-full',
      title: t.cleaning.fullCleaningTitle,
      description: t.cleaning.fullCleaningDesc,
      icon: '✨',
      price: 380,
      duration: '2h',
      category: 'cleaning',
      popular: true,
      unitTypes: ['3-bedroom'],
      arqaamCategory: 'تنظيف شقة 3 غرف'
    },
    {
      id: 'monthly-studio',
      title: t.cleaning.monthlyTitle,
      description: t.cleaning.monthlyDesc,
      icon: '📅',
      price: 780,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['studio'],
      arqaamCategory: 'باقة تنظيف شقة 2 غرفة أو 1 غرفة شهري (4 زيارات بالشهر)'
    },
    {
      id: 'monthly-1br',
      title: t.cleaning.monthlyTitle,
      description: t.cleaning.monthlyDesc,
      icon: '📅',
      price: 1020,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['1-bedroom'],
      arqaamCategory: 'باقة تنظيف شقة 2 غرفة أو 1 غرفة شهري (4 زيارات بالشهر)'
    },
    {
      id: 'monthly-2br',
      title: t.cleaning.monthlyTitle,
      description: t.cleaning.monthlyDesc,
      icon: '📅',
      price: 1440,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['2-bedroom'],
      arqaamCategory: 'باقة تنظيف شقة 2 غرفة أو 1 غرفة شهري (4 زيارات بالشهر)'
    },
    {
      id: 'monthly-3br',
      title: t.cleaning.monthlyTitle,
      description: t.cleaning.monthlyDesc,
      icon: '📅',
      price: 1500,
      duration: '4 visits',
      category: 'monthly',
      unitTypes: ['3-bedroom'],
      arqaamCategory: 'باقة تنظيف شقة 3 غرفة شهري (4 زيارات بالشهر)'
    },
    {
      id: 'linens-master',
      title: t.cleaning.linensTitle + ' - Master',
      description: '1 master bed + 2 small + 2 large towels',
      icon: '🛏️',
      price: 131,
      duration: '1h',
      category: 'linens',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom'],
      arqaamCategory: '1 سرير ماستر+ مناشف (2 صغيرة + 2 كبيرة)'
    },
    {
      id: 'linens-master-2single',
      title: t.cleaning.linensTitle + ' - Large',
      description: '1 master + 2 single beds + 4 small + 4 large towels',
      icon: '🛏️',
      price: 245,
      duration: '1h',
      category: 'linens',
      unitTypes: ['1-bedroom', '2-bedroom', '3-bedroom'],
      arqaamCategory: '1 سرير ماستر + 2 سرير مفرد + مناشف (4 صغيرة + 4 كبيرة)'
    },
    {
      id: 'linens-master-4single',
      title: t.cleaning.linensTitle + ' - XL',
      description: '1 master + 4 single beds + 6 small + 6 large towels',
      icon: '🛏️',
      price: 359,
      duration: '1h',
      category: 'linens',
      unitTypes: ['2-bedroom', '3-bedroom'],
      arqaamCategory: '1 سرير ماستر + 4 سرير مفرد + مناشف (6 صغيرة + 6 كبيرة)'
    },
    {
      id: 'guest-package',
      title: t.cleaning.guestTitle,
      description: t.cleaning.guestDesc,
      icon: '👥',
      price: 85,
      duration: '30min',
      category: 'extras',
      unitTypes: ['studio', '1-bedroom', '2-bedroom', '3-bedroom'],
      arqaamCategory: 'باقة ضيف آخر (غطاء سرير + بطانية+ مخدة+ منشفة صغيرة + منشفة كبيرة + سليبر)'
    }
  ];

  const availableServices = allServices.filter(service => 
    service.unitTypes.includes(unitType)
  );

  const getAvailableTimeSlots = () => {
    // Always show all time slots from 3:00 PM to 8:00 PM
    const slots = [];
    for (let hour = 15; hour < 20; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }
    return slots;
  };

  const shouldShowLateNotification = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 19; // 7 PM or later
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('confirmation');
  };

  const handleCancel = () => {
    setSelectedService(null);
    setSelectedTime(null);
    setCurrentStep('service');
    router.back();
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedTime) return;
    
    const service = availableServices.find(s => s.id === selectedService);
    if (!service) return;
    
    // Get booking data from localStorage
    const bookingData = getBookingDataFromStorage();
    if (!bookingData || !bookingData.reference) {
      console.error('Missing booking data or reference number');
      return;
    }

    // Determine Arqam category based on service and unit type
    let arqaamCategory = service.arqaamCategory || '';
    
    // Map cleaning services to Arqam categories based on unit type
    if (service.category === 'cleaning' && !arqaamCategory) {
      const bedroomCount = parseInt(currentUnit.Number_of_bedrooms);
      if (bedroomCount === 0) {
        arqaamCategory = 'تنظيف ستوديو';
      } else if (bedroomCount === 1) {
        arqaamCategory = 'تنظيف شقة 1 غرفة';
      } else if (bedroomCount === 2) {
        arqaamCategory = 'تنظيف شقة 2 غرفة';
      } else if (bedroomCount >= 3) {
        arqaamCategory = 'تنظيف شقة 3 غرف';
      }
    }

    // Extract room number from accommodation
    const roomNumber = currentUnit.Reference || bookingData.accommodation?.match(/R\d+/)?.[0] || '';

    // Format dates from bookingData for Arqam CRM (YYYY-MM-DD format)
    const formatDateForArqaam = (dateString: string) => {
      if (!dateString) return 'null';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'null';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const datechekin = formatDateForArqaam(bookingData.arrival);
    const datechekout = formatDateForArqaam(bookingData.departure);

    // Prepare dynamic details for the cleaning service request
    const details = `Service: ${service.title}\n` +
      `Unit: ${currentUnit.Reference}\n` +
      `Unit Type: ${currentUnit.Number_of_bedrooms} bedroom\n` +
      `Building: ${currentUnit.Development}\n` +
      `Preferred Time: ${selectedTime}\n` +
      `Price: ${service.price} SAR`;

    // Create request in database via backend API with Arqam CRM fields
    // Type: 'cleaning', Date: current time, Details: dynamic, Reference_Number: from localStorage
    try {
      const requestPayload: CreateRequestData = {
        type: 'cleaning' as const,
        date: new Date().toISOString(), // Current time when request is made
        details: details, // Dynamic details based on selected service and time
        Reference_Number: bookingData.reference, // From localStorage booking data
        // Arqam CRM fields for cleaning requests
        requesttype: 'نظافة',
        requestcategory: arqaamCategory,
        datechekin: datechekin,
        datechekout: datechekout,
        roomnumber: roomNumber,
        note: `Preferred Time: ${selectedTime}\n${details}`,
      };
      
      console.log('📤 Creating cleaning request with payload:', JSON.stringify(requestPayload, null, 2));
      
      const result = await createRequest(requestPayload);
      if (result) {
        console.log('✅ Cleaning request saved to database and sent to Arqam CRM successfully');
        // Show success message and reset form
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSelectedService(null);
          setSelectedTime(null);
          setCurrentStep('service');
          router.push(`/${locale}`);
        }, 3000);
      } else {
        console.warn('⚠️ Cleaning request save failed');
        alert(locale === 'ar' ? 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to submit request. Please try again.');
      }
    } catch (requestError) {
      console.error('❌ Error saving cleaning request to database:', requestError);
      alert(locale === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting the request. Please try again.');
    }
  };

  const selectedServiceData = availableServices.find(s => s.id === selectedService);

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-[#FAF6F5]">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    {locale === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Request Submitted Successfully!'}
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {locale === 'ar' 
                      ? 'تم إرسال طلب التنظيف. سيتم الرد عليك قريباً.'
                      : 'Your cleaning request has been sent. You will be contacted soon.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                <h1 className="text-xl font-bold text-[#274754]">{t.cleaning.title}</h1>
                <p className="text-sm text-[#94782C]">{t.cleaning.subtitle}</p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-[#274754] hover:text-[#94782C] transition-colors"
              >
                {t.cleaning.cancel}
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between px-4">
              {[t.cleaning.step1, t.cleaning.step2, t.cleaning.step3].map((step, index) => (
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
            {/* <div className="px-4 pt-4 pb-2">
              <div className="bg-white border border-[#EDEBED] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#94782C] mb-1">{t.cleaning.yourUnit}</p>
                    <p className="text-lg font-bold text-[#274754]">{currentUnit.Reference}</p>
                    <p className="text-sm text-[#94782C]">{currentUnit.Number_of_bedrooms} bedroom • {remainingDays} days</p>
                  </div>
                  <div className="text-4xl">🏠</div>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            <div className="px-4 pt-4">
              <h2 className="text-base font-bold text-[#274754] mb-3">{t.cleaning.recommended}</h2>
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
                            {/* {service.popular && (
                              <span className="bg-[#CDB990] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                {t.cleaning.popular}
                              </span>
                            )} */}
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
                            <span>{t.cleaning.todayOnly}</span>
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
                <h2 className="text-base font-bold text-[#274754] mb-3">{t.cleaning.monthlyPlan}</h2>
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
                          {/* <div className="inline-block bg-[#CDB990] text-white text-xs px-2 py-1 rounded-full">
                            {t.cleaning.saveUp} 20%
                          </div> */}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-[#274754]">{service.price}</p>
                          <p className="text-xs text-[#94782C]">SAR{t.cleaning.perMonth}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* Linens & Extras */}
            <div className="px-4 pt-6">
              <h2 className="text-base font-bold text-[#274754] mb-3">{t.cleaning.linens} & {t.cleaning.extras}</h2>
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

            <h2 className="text-lg font-bold text-[#274754] mb-2">{t.cleaning.pickTime}</h2>
            <p className="text-sm text-[#94782C] mb-4">{t.cleaning.workingHours}</p>

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

            {shouldShowLateNotification() && (
              <div className="bg-[#FAF6F5] rounded-xl p-3 text-sm text-[#274754] border border-[#EDEBED]">
                <p className="flex items-start gap-2">
                  <span className="text-lg">⏰</span>
                  <span>{t.cleaning.lateNote}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation */}
        {currentStep === 'confirmation' && selectedServiceData && selectedTime && (
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold text-[#274754] mb-4">{t.cleaning.reviewBooking}</h2>

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
                  <span className="text-[#94782C]">{t.cleaning.yourUnit}</span>
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
                <span className="font-bold text-[#274754]">{t.cleaning.totalPrice}</span>
                <span className="text-2xl font-bold text-[#274754]">{selectedServiceData.price} <span className="text-base">SAR</span></span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-[#274754] hover:bg-[#94782C] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              {t.cleaning.confirmPay}
            </button>
          </div>
        )}
      </div>
    </LocaleLayout>
  );
}