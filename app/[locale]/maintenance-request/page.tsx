'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getMessages } from '@/messages';

interface MaintenanceFormData {
  topic: string;
  category: string; // Arqam CRM category
  mobileNumber: string;
  message: string;
  brokenItemsCount?: number; // Required for some categories
}

interface MaintenanceFormErrors {
  topic?: string;
  category?: string;
  mobileNumber?: string;
  message?: string;
  brokenItemsCount?: string;
}

export default function MaintenanceRequest({ params }: { params: Promise<{ locale: string }> }) {
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

  const [formData, setFormData] = useState<MaintenanceFormData>({
    topic: '',
    category: '',
    mobileNumber: '',
    message: '',
    brokenItemsCount: undefined
  });
  const [errors, setErrors] = useState<MaintenanceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize locale from params
  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale || 'en');
    });
  }, [params]);

  // Get translations
  const all = getMessages(locale as 'en' | 'ar' | 'es' | 'zh');
  const t = {
    title: all.mc_title || 'Maintenance Request',
    topic: all.mc_topic || 'Topic',
    mobileNumber: all.mc_mobileNumber || 'Mobile Number',
    message: all.mc_message || 'Message',
    scheduleMessage: locale === 'ar' ? 'يمكنك جدولة الصيانة مع فريق الدعم لدينا' : locale === 'es' ? 'Puedes programar el mantenimiento con nuestro equipo de soporte' : locale === 'zh' ? '您可以通过我们的支持团队安排维护' : 'Please contact our support team via WhatsApp',
    send: locale === 'ar' ? 'إرسال' : locale === 'es' ? 'Enviar' : locale === 'zh' ? '发送' : 'Send',
    required: locale === 'ar' ? 'هذا الحقل مطلوب' : locale === 'es' ? 'Este campo es obligatorio' : locale === 'zh' ? '此字段为必填项' : 'This field is required',
    invalidMobile: locale === 'ar' ? 'يرجى إدخال رقم جوال صحيح' : locale === 'es' ? 'Por favor ingrese un número de móvil válido' : locale === 'zh' ? '请输入有效的手机号码' : 'Please enter a valid mobile number',
    back: all.mc_back || 'Back',
    maintenanceCategories: (all.maintenanceCategories || {}) as Record<string, string>
  };

  // Arqam CRM maintenance categories - values are Arabic for backend, labels use translations
  const maintenanceCategories = [
    { value: 'انقطاع مياه', requiresCount: false },
    { value: 'انقطاع كهرباء', requiresCount: false },
    { value: 'مشاكل تكييف', requiresCount: true },
    { value: 'تسريب', requiresCount: true },
    { value: 'استبدال شطّاف', requiresCount: true },
    { value: 'نجارة : رف او باب', requiresCount: true },
    { value: 'أخرى', requiresCount: true },
    { value: 'انقطاع الانترنت', requiresCount: false },
    { value: 'السخان', requiresCount: false },
    { value: 'أعطال الباب', requiresCount: false },
    { value: 'مشكلة مغسلة يد', requiresCount: false },
    { value: 'مشكلة الدش أو سماعة الشاور', requiresCount: false },
    { value: 'مشكلة تسريب سخان', requiresCount: false },
    { value: 'مشكلة في أحد اكسسوارات دورة المياه', requiresCount: false },
    { value: 'اهتزاز أو اتجاج مغسلة الملابس', requiresCount: false },
    { value: 'عطل عام في مغسلة الملابس', requiresCount: false },
    { value: 'انتهاء أو نفاذ الغاز', requiresCount: false },
    { value: 'مشكلة بالفرن أو عطل', requiresCount: false },
    { value: 'عطل انارة أو فيش', requiresCount: false },
    { value: 'مشكلة أدراج ودواليب أو طاولة أو كنب أو كراسي', requiresCount: false },
  ].map(cat => ({
    ...cat,
    label: t.maintenanceCategories[cat.value] || cat.value // Use translated label or fallback to Arabic value
  }));

  const selectedCategory = maintenanceCategories.find(cat => cat.value === formData.category);
  const requiresCount = selectedCategory?.requiresCount || false;

  const validateForm = (): boolean => {
    const newErrors: MaintenanceFormErrors = {};

    if (!formData.category) {
      newErrors.category = t.required;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = t.required;
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = t.invalidMobile;
    }

    if (!formData.message.trim()) {
      newErrors.message = t.required;
    }

    if (requiresCount && (!formData.brokenItemsCount || formData.brokenItemsCount < 1)) {
      newErrors.brokenItemsCount = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof MaintenanceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof MaintenanceFormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof MaintenanceFormErrors]: undefined }));
    }
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
      topic: formData.category, // Use category as topic for Arqam CRM
    };
    
    sessionStorage.setItem('maintenanceRequest', JSON.stringify(formDataToStore));
    
    // Navigate to confirmation page
    router.push(`/${locale}/maintenance-confirmation`);
    setIsSubmitting(false);
  };

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FAF6F5]">
      {/* Header */}
        <div className="bg-white shadow-sm border-b border-[#EDEBED]" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="px-4 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2 text-[#274754] hover:bg-[#EDEBED]"
              >
                <svg 
                  className={`w-5 h-5`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-lg font-bold text-[#274754]">{t.title}</h1>
              <div className="w-9"></div> {/* Spacer for centering */}
            </div>
            <p className="text-sm text-[#94782C] mt-2 text-center font-medium">⚡ Your request will be responded to within 1 hour</p>
          </div>
        </div>


      <div className="px-4 py-6">
        <Card className="border border-[#EDEBED] bg-white shadow-sm" dir={isRTL ? 'rtl' : 'ltr'}>
          <CardHeader className="bg-[#CDB990] bg-opacity-10 border-b border-[#EDEBED]">
            <CardTitle className="text-center text-[#274754] font-bold" dir={isRTL ? 'rtl' : 'ltr'}>{t.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Field */}
              <div>
                <label className="block text-sm font-bold text-[#274754] mb-2">
                  {t.topic} *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#274754] ${
                    errors.category ? 'border-red-500' : 'border-[#EDEBED]'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <option value="">{t.topic}</option>
                  {maintenanceCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              {/* Broken Items Count - Show only if required */}
              {requiresCount && (
                <div>
                  <label className="block text-sm font-bold text-[#274754] mb-2">
                    {isRTL ? 'عدد الأشياء المتعطلة' : 'Number of Broken Items'} *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.brokenItemsCount || ''}
                    onChange={(e) => handleInputChange('brokenItemsCount', parseInt(e.target.value) || 0)}
                    placeholder={isRTL ? 'أدخل العدد' : 'Enter count'}
                    className={errors.brokenItemsCount ? 'border-red-500' : ''}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {errors.brokenItemsCount && (
                    <p className="text-red-500 text-xs mt-1">{errors.brokenItemsCount}</p>
                  )}
                </div>
              )}

              {/* Mobile Number Field - Commented out - will be used later */}
              <div>
                <label className="block text-sm font-bold text-[#274754] mb-2">
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
                <label className="block text-sm font-bold text-[#274754] mb-2">
                  {t.message} *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t.message}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#274754] ${
                    errors.message ? 'border-red-500' : 'border-[#EDEBED]'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {/* Schedule Message */}
              <div className="bg-[#FAF6F5] p-4 rounded-md border border-[#EDEBED]">
                <p className="text-sm text-[#274754] text-center font-medium">
                  {t.scheduleMessage}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#274754] hover:bg-[#94782C] text-white font-bold"
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
