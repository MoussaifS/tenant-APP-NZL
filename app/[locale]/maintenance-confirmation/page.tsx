'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/messages';
import { createRequest } from '@/lib/apiUtils';
import { getBookingDataFromStorage } from '@/lib/bookingUtils';

interface MaintenanceFormData {
  topic: string;
  category?: string; // Arqam CRM category
  mobileNumber: string;
  message: string;
  brokenItemsCount?: number;
}

export default function MaintenanceConfirmation({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  // Get locale from URL immediately to avoid hydration mismatch
  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const urlLocale = pathSegments[0];
      if (['en', 'ar', 'es', 'zh'].includes(urlLocale)) {
        return urlLocale;
      }
    }
    return 'en';
  });
  const [formData, setFormData] = useState<MaintenanceFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Translations moved to messages folder
  const all = getMessages(locale as 'en' | 'ar' | 'es' | 'zh');
  const t = {
    title: all.mc_title,
    reviewRequest: all.mc_reviewRequest,
    topic: all.mc_topic,
    mobileNumber: all.mc_mobileNumber,
    message: all.mc_message,
    confirm: all.mc_confirm,
    edit: all.mc_edit,
    cancel: all.mc_cancel,
    back: all.mc_back,
    sending: all.mc_sending,
    success: all.mc_success,
    error: all.mc_error,
  };

  // Initialize locale and load form data
  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });

    // Load form data from sessionStorage
    const storedData = sessionStorage.getItem('maintenanceRequest');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    } else {
      // No form data found, redirect back
      router.push(`/${locale}/maintenance-request`);
    }
  }, [params, router, locale]);

  const handleConfirm = async () => {
    if (!formData) return;

    // Validate required fields
    const category = formData.category || formData.topic;
    if (!category?.trim() || !formData.message?.trim()) {
      console.error('Missing required fields: category or message');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get booking data from localStorage
      const bookingData = getBookingDataFromStorage();
      if (!bookingData || !bookingData.reference) {
        console.error('Missing booking data or reference number');
        setIsSubmitting(false);
        return;
      }

      // Prepare dynamic details combining topic/category and message
      const sanitizedCategory = formData.category || formData.topic.trim();
      const sanitizedMessage = formData.message.trim();
      const details = `Category: ${sanitizedCategory}\nMessage: ${sanitizedMessage}`;
      
      // Add broken items count if available
      const note = formData.brokenItemsCount 
        ? `${details}\nعدد الأشياء المتعطلة: ${formData.brokenItemsCount}`
        : details;

      // Extract room number from accommodation
      const roomNumber = bookingData.accommodation?.match(/R\d+/)?.[0] || bookingData.accommodation || '';

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

      // Create request in database via backend API with Arqam CRM fields
      // Type: 'maintenance', Date: current time, Details: dynamic, Reference_Number: from localStorage
      // Phone_Number: only for maintenance requests
      try {
        const result = await createRequest({
          type: 'maintenance',
          date: new Date().toISOString(), // Current time when request is made
          Phone_Number: formData.mobileNumber?.trim() || undefined, // Only for maintenance
          details: details, // Dynamic details based on user input
          Reference_Number: bookingData.reference, // From localStorage booking data
          // Arqam CRM fields for maintenance requests
          requesttype: 'صيانة',
          requestcategory: sanitizedCategory,
          datechekin: datechekin,
          datechekout: datechekout,
          roomnumber: roomNumber,
          phone: formData.mobileNumber?.trim() || undefined,
          note: note,
        });
        if (result) {
          console.log('✅ Maintenance request saved to database and sent to Arqam CRM successfully');
          // Clear stored data
          sessionStorage.removeItem('maintenanceRequest');
          
          // Show success message
          setIsSubmitting(false);
          setShowSuccessAlert(true);
          
          // Redirect to home page after showing success message
          setTimeout(() => {
            router.push(`/${locale}`);
          }, 3000);
        } else {
          console.warn('⚠️ Maintenance request save failed');
          setIsSubmitting(false);
          alert(isRTL ? 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Failed to submit request. Please try again.');
        }
      } catch (requestError) {
        console.error('❌ Error saving maintenance request to database:', requestError);
        setIsSubmitting(false);
        alert(isRTL ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting the request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/${locale}/maintenance-request`);
  };

  const handleCancel = () => {
    sessionStorage.removeItem('maintenanceRequest');
    router.push(`/${locale}`);
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#FAF6F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#274754] mx-auto mb-4"></div>
          <p className="text-[#274754]">Loading...</p>
        </div>
      </div>
    );
  }

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FAF6F5]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#EDEBED] px-4 py-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-2 text-[#274754] hover:bg-[#EDEBED]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.back}
        </Button>
        <h1 className="text-lg font-semibold text-[#274754]">{t.title}</h1>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  {isRTL ? 'تم إرسال الطلب بنجاح!' : 'Request Submitted Successfully!'}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  {isRTL 
                    ? 'تم إرسال طلب الصيانة. سيتم الرد عليك قريباً.'
                    : 'Your maintenance request has been sent. You will be contacted soon.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <Card className="border border-[#EDEBED] bg-white shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
          <CardHeader className="border-b border-[#EDEBED]">
            <CardTitle className="text-center text-[#274754]" dir={isRTL ? 'rtl' : 'ltr'}>{t.title}</CardTitle>
            <p className="text-sm text-[#94782C] text-center" dir={isRTL ? 'rtl' : 'ltr'}>{t.reviewRequest}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-[#94782C] mb-2">
                  {t.topic}
                </label>
                <div className="p-3 bg-white rounded-md border border-[#EDEBED]">
                  <p className="text-[#274754]" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.topic}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#94782C] mb-2">
                  {t.mobileNumber}
                </label>
                <div className="p-3 bg-white rounded-md border border-[#EDEBED]">
                  <p className="text-[#274754]" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.mobileNumber}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#94782C] mb-2">
                  {t.message}
                </label>
                <div className="p-3 bg-white rounded-md border border-[#EDEBED]">
                  <p className="text-[#274754] whitespace-pre-wrap" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full bg-[#274754] hover:bg-[#94782C] text-white font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.sending}
                    </>
                  ) : (
                    t.confirm
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    disabled={isSubmitting}
                    className="border-[#EDEBED] text-[#274754] hover:bg-[#EDEBED]"
                  >
                    {t.edit}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isSubmitting}
                    className="border-[#EDEBED] text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t.cancel}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
