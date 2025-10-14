'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MaintenanceFormData {
  topic: string;
  mobileNumber: string;
  message: string;
  image: File | null;
}

interface MaintenanceFormErrors {
  topic?: string;
  mobileNumber?: string;
  message?: string;
  image?: string;
}

export default function MaintenanceRequest({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [formData, setFormData] = useState<MaintenanceFormData>({
    topic: '',
    mobileNumber: '',
    message: '',
    image: null
  });
  const [errors, setErrors] = useState<MaintenanceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: "Maintenance Request",
      topic: "Topic",
      mobileNumber: "Mobile Number",
      message: "Message",
      attachPhoto: "Attach Photo",
      takePhoto: "Take Photo",
      uploadPhoto: "Upload Photo",
      scheduleMessage: "You can schedule maintenance with our support team",
      send: "Send",
      required: "This field is required",
      invalidMobile: "Please enter a valid mobile number",
      photoRequired: "Please attach a photo",
      back: "Back"
    },
    ar: {
      title: "طلب الصيانة",
      topic: "الموضوع",
      mobileNumber: "رقم الجوال",
      message: "الرسالة",
      attachPhoto: "إرفاق صورة",
      takePhoto: "التقاط صورة",
      uploadPhoto: "رفع صورة",
      scheduleMessage: "يمكنك جدولة الصيانة مع فريق الدعم لدينا",
      send: "إرسال",
      required: "هذا الحقل مطلوب",
      invalidMobile: "يرجى إدخال رقم جوال صحيح",
      photoRequired: "يرجى إرفاق صورة",
      back: "رجوع"
    }
  };

  const t = translations[locale as keyof typeof translations];

  // Initialize locale
  useState(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  });

  const validateForm = (): boolean => {
    const newErrors: MaintenanceFormErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = t.required;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = t.required;
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = t.invalidMobile;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }

    if (!formData.image) {
      newErrors.image = t.photoRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof MaintenanceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      // Clear error when user selects an image
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use back camera on mobile
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData(prev => ({ ...prev, image: file }));
        // Clear error when user selects an image
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: undefined }));
        }
      }
    };
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Store form data in sessionStorage for confirmation page
    const formDataToStore = {
      ...formData,
      imagePreview: formData.image ? URL.createObjectURL(formData.image) : null
    };
    
    sessionStorage.setItem('maintenanceRequest', JSON.stringify(formDataToStore));
    
    // Navigate to confirmation page
    router.push(`/${locale}/maintenance-confirmation`);
  };

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
              <h1 className="text-lg font-semibold text-gray-800">{t.title}</h1>
              <div className="w-9"></div> {/* Spacer for centering */}
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">⚡ Your request will be responded to within 1 hour</p>
          </div>
        </div>


      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.topic} *
                </label>
                <Input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder={t.topic}
                  className={errors.topic ? 'border-red-500' : ''}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.topic && (
                  <p className="text-red-500 text-xs mt-1">{errors.topic}</p>
                )}
              </div>

              {/* Mobile Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.mobileNumber} *
                </label>
                <Input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  placeholder={t.mobileNumber}
                  className={errors.mobileNumber ? 'border-red-500' : ''}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.message} *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t.message}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.attachPhoto} *
                </label>
                <div className="space-y-3">
                  {/* Take Photo Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTakePhoto}
                    className="w-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.takePhoto}
                  </Button>

                  {/* Upload Photo Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {t.uploadPhoto}
                    </Button>
                  </div>

                  {/* Selected Image Preview */}
                  {formData.image && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Selected"
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.image.name}
                      </p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
              </div>

              {/* Schedule Message */}
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800 text-center">
                  {t.scheduleMessage}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.send}...
                  </>
                ) : (
                  t.send
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
