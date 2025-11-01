'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/messages';

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Translations moved to messages folder
  const all = getMessages(locale as 'en' | 'ar');
  const t = {
    title: all.mc_title,
    reviewRequest: all.mc_reviewRequest,
    topic: all.mc_topic,
    mobileNumber: all.mc_mobileNumber,
    message: all.mc_message,
    attachedPhoto: all.mc_attachedPhoto,
    noPhoto: all.mc_noPhoto,
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

  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('https://api.imgbb.com/1/upload?key=546c25a59c58ad7', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.success ? data.data.url : null;
    } catch (error) {
      console.error('Error uploading image to ImgBB:', error);
      return null;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    // Try ImgBB for image upload
    return await uploadImageToImgBB(file);
  };

  const handleConfirm = async () => {
    if (!formData) return;

    setIsSubmitting(true);

    try {
      // Upload image if present - Commented out - will be used later
      // let imageUrl = null;
      // if (formData.image) {
      //   imageUrl = await uploadImage(formData.image);
      // }

      // Create WhatsApp message with maintenance request details
      let whatsappMessage = `Hello! I have a maintenance request for accommodation "Alaredh R217":

Topic: ${formData.topic}
Message: ${formData.message}`;

      // Image and mobile number references commented out - will be used later
      // Mobile: ${formData.mobileNumber}
      // if (imageUrl) {
      //   whatsappMessage += `\n\n📷 Image: ${imageUrl}`;
      // } else if (formData.imagePreview) {
      //   whatsappMessage += `\n\n📷 I have attached a photo with this request (please check your gallery).`;
      // } else {
      //   whatsappMessage += `\n\nNo photo attached.`;
      // }

      whatsappMessage += `\n\nPlease help me with this maintenance request. Thank you!`;
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/966537665619?text=${encodedMessage}`;
      
      // Clear stored data
      sessionStorage.removeItem('maintenanceRequest');
      
      // Show success message briefly then redirect to WhatsApp
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessAlert(true);
        
        // Redirect to WhatsApp after showing alert
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          // Also redirect to home page as fallback
          router.push(`/${locale}`);
        }, 2000);
      }, 1000);
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
                <h3 className="text-sm font-medium text-green-800">Maintenance Request Prepared!</h3>
                <p className="text-sm text-green-700 mt-1">
                  You will be redirected to WhatsApp in a few seconds to send your request.
                  {/* Commented out - will be used later */}
                  {/* {formData?.imagePreview && (
                    <span className="block mt-1 font-medium">
                      📷 Don't forget to attach your photo in WhatsApp!
                    </span>
                  )} */}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <Card className="border border-[#EDEBED] bg-white shadow-sm">
          <CardHeader className="border-b border-[#EDEBED]">
            <CardTitle className="text-center text-[#274754]">{t.title}</CardTitle>
            <p className="text-sm text-[#94782C] text-center">{t.reviewRequest}</p>
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

              {/* Mobile Number - Commented out - will be used later */}
              {/* <div>
                <label className="block text-sm font-medium text-[#94782C] mb-2">
                  {t.mobileNumber}
                </label>
                <div className="p-3 bg-white rounded-md border border-[#EDEBED]">
                  <p className="text-[#274754]" dir={isRTL ? 'rtl' : 'ltr'}>
                    {formData.mobileNumber}
                  </p>
                </div>
              </div> */}

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

              {/* Attached Photo - Commented out - will be used later */}
              {/* <div>
                <label className="block text-sm font-medium text-[#94782C] mb-2">
                  {t.attachedPhoto}
                </label>
                <div className="p-3 bg-white rounded-md border border-[#EDEBED]">
                  {formData.imagePreview ? (
                    <div>
                      <img
                        src={formData.imagePreview}
                        alt="Attached photo"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-xs text-[#94782C] mt-2">
                        {formData.image?.name || 'Attached photo'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#94782C] text-sm">{t.noPhoto}</p>
                  )}
                </div>
              </div> */}

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
