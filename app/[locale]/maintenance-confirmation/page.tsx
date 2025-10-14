'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MaintenanceFormData {
  topic: string;
  mobileNumber: string;
  message: string;
  image: File | null;
  imagePreview: string | null;
}

export default function MaintenanceConfirmation({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [formData, setFormData] = useState<MaintenanceFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: "Confirm Maintenance Request",
      reviewRequest: "Please review your maintenance request",
      topic: "Topic",
      mobileNumber: "Mobile Number",
      message: "Message",
      attachedPhoto: "Attached Photo",
      noPhoto: "No photo attached",
      confirm: "Confirm & Send",
      edit: "Edit",
      cancel: "Cancel",
      back: "Back",
      sending: "Sending...",
      success: "Request sent successfully!",
      error: "Failed to send request. Please try again."
    },
    ar: {
      title: "تأكيد طلب الصيانة",
      reviewRequest: "يرجى مراجعة طلب الصيانة الخاص بك",
      topic: "الموضوع",
      mobileNumber: "رقم الجوال",
      message: "الرسالة",
      attachedPhoto: "الصورة المرفقة",
      noPhoto: "لا توجد صورة مرفقة",
      confirm: "تأكيد وإرسال",
      edit: "تعديل",
      cancel: "إلغاء",
      back: "رجوع",
      sending: "جاري الإرسال...",
      success: "تم إرسال الطلب بنجاح!",
      error: "فشل في إرسال الطلب. يرجى المحاولة مرة أخرى."
    }
  };

  const t = translations[locale as keyof typeof translations];

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

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear stored data
      sessionStorage.removeItem('maintenanceRequest');
      
      // Show success message briefly then redirect
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 1500);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.back}
        </Button>
        <h1 className="text-lg font-semibold text-gray-800">{t.title}</h1>
      </div>

      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t.title}</CardTitle>
            <p className="text-sm text-gray-600 text-center">{t.reviewRequest}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.topic}
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.topic}
                  </p>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.mobileNumber}
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.mobileNumber}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message}
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-800 whitespace-pre-wrap" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.message}
                  </p>
                </div>
              </div>

              {/* Attached Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.attachedPhoto}
                </label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  {formData.imagePreview ? (
                    <div>
                      <img
                        src={formData.imagePreview}
                        alt="Attached photo"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.image?.name || 'Attached photo'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">{t.noPhoto}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
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
                  >
                    {t.edit}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isSubmitting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
