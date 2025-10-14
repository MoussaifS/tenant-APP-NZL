'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleLayout from '../../components/LocaleLayout';
import BottomNavigation from '../components/BottomNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

// Property data structure
interface Property {
  id: number;
  reference: string;
  development: string;
  units: string;
  floor: string;
  bedrooms: number;
  neighborhood: string;
  location: string;
  tourismLicense?: string;
  expiredDate?: string;
  availability: string;
  buildingPassword?: string;
  apartmentPassword?: string;
  lastPasswordChange?: string;
  wifiCredentials?: string;
  price?: number;
  parking: string;
}

// Property data
const properties: Property[] = [
  {
    id: 1,
    reference: "R101",
    development: "Almajidiya 103",
    units: "B6/9",
    floor: "2",
    bedrooms: 2,
    neighborhood: "Altaawun",
    location: "https://maps.app.goo.gl/Whs4MciiYjh6xoYW6?g_st=iw",
    availability: "Available",
    apartmentPassword: "654321#",
    lastPasswordChange: "31/1/2024",
    parking: "Basement",
    tourismLicense: "50002178",

  },
  {
    id: 2,
    reference: "R102",
    development: "Almajidiya 44",
    units: "L1",
    floor: "g",
    bedrooms: 2,
    neighborhood: "Almalga",
    location: "https://maps.app.goo.gl/5PmBHE6M1srg9kkh9?g_st=iw",
    tourismLicense: "50002178",
    expiredDate: "21/8/1446",
    availability: "Available",
    apartmentPassword: "3466#",
    lastPasswordChange: "31/1/2024",
    price: 13000,
    parking: "Outside"
  },
  {
    id: 3,
    reference: "R103",
    development: "Almajidiya 92",
    units: "A1",
    floor: "g",
    bedrooms: 3,
    neighborhood: "Alyasmeen",
    location: "https://maps.app.goo.gl/rcuZo9wFw1sdJ6dE7?g_st=iw",
    tourismLicense: "50002194",
    expiredDate: "26/8/1446",
    availability: "Available",
    buildingPassword: "#33333333#",
    apartmentPassword: "201515#",
    lastPasswordChange: "1/5/2024",
    wifiCredentials: "use:Nuzul living ,Pw:50084181",
    price: 14500,
    parking: "Outside"
  },
  {
    id: 4,
    reference: "R105",
    development: "Almajidiya 115",
    units: "C7",
    floor: "1",
    bedrooms: 3,
    neighborhood: "Almalga",
    location: "https://maps.app.goo.gl/Cq1kueHR3nPsbzwT9?g_st=iw",
    tourismLicense: "50004518",
    expiredDate: "4/6/1447",
    availability: "Available",
    buildingPassword: "13333#",
    apartmentPassword: "718436#",
    lastPasswordChange: "15/5/2024",
    price: 16000,
    parking: "Basement"
  },
  {
    id: 5,
    reference: "R108",
    development: "Almajidiya Village",
    units: "L3",
    floor: "g",
    bedrooms: 3,
    neighborhood: "Hittin",
    location: "https://maps.app.goo.gl/Ey6jgwMjqiuqjqQLA?g_st=ic",
    tourismLicense: "50005086",
    expiredDate: "26/6/1447",
    availability: "Available",
    buildingPassword: "#1937#",
    apartmentPassword: "456191#",
    lastPasswordChange: "31/1/2024",
    price: 15900,
    parking: "Outside"
  }
];

// Translation content
const translations = {
  en: {
    unitInformation: "Property Information",
    propertyDetails: "Property Details",
    location: "📍 Location",
    googleMaps: "View on Google Maps",
    reference: "Reference",
    development: "Development",
    units: "Units",
    floor: "Floor",
    bedrooms: "Bedrooms",
    neighborhood: "Neighborhood",
    tourismLicense: "Tourism License",
    expiredDate: "Expired Date",
    availability: "Availability",
    buildingPassword: "Building Password",
    apartmentPassword: "Apartment Password",
    lastPasswordChange: "Last Password Change",
    wifiCredentials: "WiFi Credentials",
    price: "Price",
    parking: "Parking",
    checkInInstructions: "🚪 Check-in Instructions",
    checkInSteps: [
      "Arrive at the main entrance",
      "Contact the building security",
      "Present your ID and reservation details",
      "Collect your keys from the reception",
      "Follow the elevator to your unit"
    ],
    essentialInfo: "🔑 Essential Information",
    unitNumber: "Unit Number",
    wifiPassword: "WiFi Password",
    emergencyContact: "Emergency Contact",
    maintenanceContact: "Maintenance Contact",
    home: "Home",
    notifications: "Notification",
    support: "Support",
    profile: "Profile"
  },
  ar: {
    unitInformation: "معلومات العقار",
    propertyDetails: "تفاصيل العقار",
    location: "📍 الموقع",
    googleMaps: "عرض على خرائط جوجل",
    reference: "المرجع",
    development: "التطوير",
    units: "الوحدات",
    floor: "الطابق",
    bedrooms: "عدد الغرف",
    neighborhood: "الحي",
    tourismLicense: "رخصة السياحة",
    expiredDate: "تاريخ الانتهاء",
    availability: "التوفر",
    buildingPassword: "كلمة مرور المبنى",
    apartmentPassword: "كلمة مرور الشقة",
    lastPasswordChange: "آخر تغيير لكلمة المرور",
    wifiCredentials: "بيانات الواي فاي",
    price: "السعر",
    parking: "الموقف",
    checkInInstructions: "🚪 تعليمات الوصول",
    checkInSteps: [
      "الوصول إلى المدخل الرئيسي",
      "التواصل مع أمن المبنى",
      "تقديم الهوية وتفاصيل الحجز",
      "استلام المفاتيح من الاستقبال",
      "استخدام المصعد للوصول إلى الوحدة"
    ],
    essentialInfo: "🔑 المعلومات الأساسية",
    unitNumber: "رقم الوحدة",
    wifiPassword: "كلمة مرور الواي فاي",
    emergencyContact: "جهة الاتصال الطارئة",
    maintenanceContact: "جهة الاتصال للصيانة",
    home: "الرئيسية",
    notifications: "الإشعارات",
    support: "الدعم",
    profile: "الملف الشخصي"
  }
};

export default function UnitInformation({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  
  // Set R101 as the default unit
  const currentProperty = properties.find(p => p.reference === 'R101') || properties[0];

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
      router.push('/en/unit-information');
      return;
    }
  }, [locale, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const t = translations[locale as keyof typeof translations];
  // const isRTL = locale === 'ar';

  const handleGoogleMapsClick = () => {
    // Open Google Maps with the property location
    window.open(currentProperty.location, '_blank');
  };

  return (
    <LocaleLayout locale={locale}>
      <div className="min-h-screen bg-gray-50 pb-20">
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
              <h1 className="text-lg font-semibold text-gray-800">Unit Information</h1>
              <div className="w-9"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Property Details */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <InfoIcon className="h-5 w-5" />
                {t.propertyDetails}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">{t.reference}</p>
                  <p className="font-bold text-gray-900">{currentProperty.reference}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">{t.development}</p>
                  <p className="font-bold text-gray-900">{currentProperty.development}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">{t.units}</p>
                  <p className="font-bold text-gray-900">{currentProperty.units}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">{t.floor}</p>
                  <p className="font-bold text-gray-900">{currentProperty.floor}</p>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">{t.location}</h3>
                <Button 
                  onClick={handleGoogleMapsClick}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  variant="default"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  {t.googleMaps}
                </Button>
              </div>

              {/* Rent and License Information */}
              <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">{t.tourismLicense}</p>
                    <p className="font-bold text-gray-900">{currentProperty.tourismLicense}</p>
                  </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">{t.parking}</p>
                  <p className="font-bold text-gray-900">{currentProperty.parking}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Information */}
          {/* <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <KeyIcon className="h-5 w-5" />
                {t.essentialInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentProperty.buildingPassword && (
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-500 mb-1">{t.buildingPassword}</p>
                    <p className="font-bold text-lg text-gray-900">{currentProperty.buildingPassword}</p>
                  </div>
                )}
                {currentProperty.apartmentPassword && (
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-500 mb-1">{t.apartmentPassword}</p>
                    <p className="font-bold text-lg text-gray-900">{currentProperty.apartmentPassword}</p>
                  </div>
                )}
                {currentProperty.wifiCredentials && (
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-500 mb-1">{t.wifiCredentials}</p>
                    <p className="font-bold text-lg text-gray-900">{currentProperty.wifiCredentials}</p>
                  </div>
                )}
                {currentProperty.lastPasswordChange && (
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-500 mb-1">{t.lastPasswordChange}</p>
                    <p className="font-bold text-lg text-gray-900">{currentProperty.lastPasswordChange}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-gray-900 mb-3">📞 {t.emergencyContact}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Emergency</span>
                    <span className="text-sm font-bold text-red-600">+966 50 123 4567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maintenance</span>
                    <span className="text-sm font-bold text-blue-600">+966 50 987 6543</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Check-in Instructions */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <InstructionsIcon className="h-5 w-5" />
                {t.checkInInstructions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {t.checkInSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <BottomNavigation />
      </div>
    </LocaleLayout>
  );
}

// Icon Components
// function KeyIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="7.5" cy="15.5" r="5.5" />
//       <path d="m21 2-9.6 9.6" />
//       <path d="m15.5 7.5 3 3L22 7l-3-3" />
//     </svg>
//   );
// }

function MapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function InstructionsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9,12 3,3 3,-3" />
    </svg>
  );
}
