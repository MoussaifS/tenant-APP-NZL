export const en = {
  // Home
  welcome: "Welcome to your second home with Nuzul.",
  welcomeTo: "Welcome to",
  yourSecondHome: "Your Second Home",
  withNuzul: "with Nuzul",
  logout: "Logout",
  searchPlaceholder: "Find something you want...",
  checkIn: "Check-in",
  checkOut: "Check-out",
  amenities: "Amenities",
  seeMore: "See More",
  wifi: "Wifi",
  features: "Features",
  unitLock: "Unit Lock",
  parking: "Parking",
  currentReservation: "Current Reservation",
  location: "Riyadh",
  home: "Home",
  notifications: "Notification",
  support: "Support",
  profile: "Profile",
  partnerServices: "Services",
  exploreServices: "Explore our partner providers for additional services and support",
  cleaningServices: "Cleaning Services",
  cleaningServicesDescription: "Professional cleaning",
  maintenance: "Maintenance",
  maintenanceDescription: "Quick repairs",

  // Login
  title: "Guest Access Portal",
  description: "Enter your booking reference number to continue",
  codeLabel: "Booking Reference",
  codePlaceholder: "Enter booking reference",
  loginButton: "Sign In",
  invalidCode: "Invalid booking reference. Please check your booking confirmation.",
  codeRequired: "Please enter your booking reference number",
  loading: "Verifying...",
  welcomeTitle: "Welcome to Nuzul",
  secureText: "Secure & Encrypted",
  secureDescription: "Your booking information is protected and secure",
  supportContact: "For assistance, please contact support: +971 XX XXX XXXX",

  // Maintenance Confirmation
  mc_title: "Confirm Maintenance Request",
  mc_reviewRequest: "Please review your maintenance request",
  mc_topic: "Topic",
  mc_mobileNumber: "Mobile Number",
  mc_message: "Message",
  mc_attachedPhoto: "Attached Photo",
  mc_noPhoto: "No photo attached",
  mc_confirm: "Confirm & Send via WhatsApp",
  mc_edit: "Edit",
  mc_cancel: "Cancel",
  mc_back: "Back",
  mc_sending: "Uploading image and preparing WhatsApp message...",
  mc_success: "Request sent successfully!",
  mc_error: "Failed to send request. Please try again.",

  // Maintenance Categories (values are Arabic for backend, labels are translated)
  maintenanceCategories: {
    "انقطاع مياه": "Water Outage",
    "انقطاع كهرباء": "Power Outage",
    "مشاكل تكييف": "AC Problems (Photo + Count Required)",
    "تسريب": "Leakage (Photo + Count Required)",
    "استبدال شطّاف": "Toilet Seat Replacement (Photo + Count Required)",
    "نجارة : رف او باب": "Carpentry: Shelf or Door (Photo + Count Required)",
    "أخرى": "Other (Photo + Count Required)",
    "انقطاع الانترنت": "Internet Outage",
    "السخان": "Water Heater",
    "أعطال الباب": "Door Malfunction",
    "مشكلة مغسلة يد": "Hand Basin Problem",
    "مشكلة الدش أو سماعة الشاور": "Shower or Shower Head Problem",
    "مشكلة تسريب سخان": "Water Heater Leak",
    "مشكلة في أحد اكسسوارات دورة المياه": "Bathroom Accessory Problem (Towel Rack, Tissue Holder, Soap Dispenser)",
    "اهتزاز أو اتجاج مغسلة الملابس": "Washing Machine Vibration or Noise",
    "عطل عام في مغسلة الملابس": "General Washing Machine Malfunction",
    "انتهاء أو نفاذ الغاز": "Gas Empty or Depleted",
    "مشكلة بالفرن أو عطل": "Oven Problem or Malfunction",
    "عطل انارة أو فيش": "Lighting or Socket Malfunction",
    "مشكلة أدراج ودواليب أو طاولة أو كنب أو كراسي": "Drawer, Cabinet, Table, Sofa or Chair Problem"
  },

  // Unit Information
  unitInformation: "Property Information",
  loadingUnitInfo: "Loading unit information...",
  unitInfoNotAvailable: "Unit information not available",
  goBack: "Go Back",
  noBookingDataFound: "No booking data found",
  unableToExtractUnitNumber: "Unable to extract unit number from accommodation",
  unitNotFound: "Unit {unitNumber} not found",
  failedToLoadUnitInfo: "Failed to load unit information",
  propertyDetails: "Property Details",
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
  checkInInstructions: "🚪 Check-in Instructions",
  checkInSteps: [
    "You may be asked to present your ID upon arrival.",
    "Please keep the property in good condition.",
    "Our support team is available 24/7 to assist you with anything you need."
  ],
  essentialInfo: "🔑 Essential Information",
  unitNumber: "Unit Number",
  wifiPassword: "WiFi Password",
  emergencyContact: "Emergency Contact",
  maintenanceContact: "Maintenance Contact",
  importantNotes: [
    "You may be asked to share your ID",
    "Keep the property clean",
    "Technical support is available 24/7"
  ],

  // Check In/Out Dates Component
  staySummary: "Your Stay Summary",
  checkoutTime: "12:00 PM",
  checkoutToday: "Checkout Today",
  nightRemaining: "Night Remaining",
  nightsRemaining: "Nights Remaining",
  thankYouStay: "Thank You for Staying With Us!",
  thankYouMessage: "We hope you had a wonderful experience. We'd love to host you again soon!",
  extendYourStay: "Extend Your Stay?",
  requestMoreDays: "Request More Days",
  addToCalendar: "Add to Calendar",
  calendarInstructions: "Download and open the calendar file to add this event to your calendar app.",
  downloadCalendarEvent: "Download Calendar Event",
  calendarInstructionsTitle: "ℹ️ How to use:",
  calendarInstructionsList: [
    "iPhone/iPad: Open the .ics file from Files app or Safari downloads",
    "Android: Open the downloaded file and select your calendar app",
    "Works with Google Calendar, Apple Calendar, Outlook, and more"
  ],
  loadingBookingInfo: "Loading booking information...",
  unableToLoadDates: "Unable to load booking dates. Please try logging in again.",
  extensionRequestSubmitted: "Extension Request Submitted",
  extensionRequestMessage: "Your request for {days} additional {dayWord} has been prepared. WhatsApp should now be opening where you can send your request.",
  extensionWhatsAppMessage: "Hello! I'm staying at accommodation \"{accommodation}\" and I'm looking to extend my stay for {days} {dayWord}. Could you please help me with this request?",
  day: "day",
  days: "days",

  // Extension Days Modal
  extendStayTitle: "Extend Your Stay",
  extendStayQuestion: "How many additional days would you like to extend your stay?",
  oneDay: "1 Day",
  fiveDays: "5 Days",
  oneMonth: "1 Month",
  custom: "Custom",
  enterNumberOfDays: "Enter number of days:",
  enterDaysPlaceholder: "Enter days",
  requestExtension: "Request Extension",
  enjoyedStayMessage: "We hope you enjoyed your stay! 🌟",

  // Bottom Navigation
  bottomNavHome: "Main",
  bottomNavUnitInfo: "Unit Information",
  bottomNavPartners: "Partners",
  bottomNavContact: "Contact",

  // Emergency/Contact
  emergency: {
    title: "Emergency & Contact",
    subtitle: "We're here to help you 24/7",
    emergencyNumber: "Emergency Services",
    ambulance: "Ambulance",
    ambulancePhone: "997",
    fireDepartment: "Fire Department",
    fireDepartmentPhone: "998",
    ourNumber: "Our Number (For Emergency)",
    ourNumberDescription: "Contact us for urgent support",
    ourPhone: "+966 9200 15064",
    whatsapp: "WhatsApp Chat",
    whatsappDescription: "Chat with us on WhatsApp for quick assistance",
    chatOnWhatsapp: "Chat on WhatsApp",
    whatsappMessage: "Hello, I need assistance"
  },

  // Partners
  partners: {
    title: "Our Partners",
    subtitle: "Exclusive discounts and services for our guests",
    conciergeServices: "Concierge Services",
    coupons: "Coupons & Discounts",
    contactPartner: "Contact Partner",
    visitWebsite: "Visit Website",
    callNow: "Call Now",
    getCoupons: "Get Coupons",
    mezwalah: {
      name: "Mezwalah",
      description: "At Mezwalah, we deliver tailored Destination Management Solutions with top-tier service. Our expert team creates seamless multi-destination itineraries in Saudi Arabia and beyond.",
      industry: "Travel Arrangements",
      website: "www.mezwalah.com",
      phone: "00966507002958"
    },
    noonMinutes: {
      name: "Noon Minutes",
      description: "Get exclusive coupons and discounts for various services and products.",
    }
  },

  // Cleaning Services
  cleaning: {
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
    cancel: "Cancel",
    
    // Unit Info
    yourUnit: "Your Unit",
    building: "Building",
    stayDuration: "Stay"
  },

  // Unit Lock
  unitLockDetails: {
    unitNumber: "Unit Number",
    buildingPassword: "Building Password",
    apartmentPassword: "Apartment Password",
    development: "Development",
    copy: "Copy",
    loading: "Loading...",
    bookingDataNotAvailable: "Booking data not available",
    unitLockDataNotFound: "Unit lock data not found",
    failedToFetchData: "Failed to fetch data",
    noDataAvailable: "No data available",
    howToUse: "How to use",
    instruction2: "Press the unlock button",
    instruction3: "The door will unlock automatically",
  }
};

export type EnMessages = typeof en;

