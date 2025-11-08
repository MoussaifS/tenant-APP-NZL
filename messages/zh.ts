export const zh = {
  // Home
  welcome: "欢迎来到您在 Nuzul 的第二个家。",
  welcomeTo: "欢迎来到",
  yourSecondHome: "您的第二个家",
  withNuzul: "与 Nuzul",
  logout: "登出",
  searchPlaceholder: "查找您想要的内容...",
  checkIn: "入住",
  checkOut: "退房",
  amenities: "设施",
  seeMore: "查看更多",
  wifi: "无线网络",
  features: "特色",
  unitLock: "单元锁",
  parking: "停车",
  currentReservation: "当前预订",
  location: "利雅得",
  home: "首页",
  notifications: "通知",
  support: "支持",
  profile: "个人资料",
  partnerServices: "服务",
  exploreServices: "探索我们的合作伙伴提供商以获取额外服务和支持",
  cleaningServices: "清洁服务",
  cleaningServicesDescription: "专业清洁",
  maintenance: "维护",
  maintenanceDescription: "快速维修",

  // Login
  title: "宾客访问门户",
  description: "输入您的预订参考号以继续",
  codeLabel: "预订参考号",
  codePlaceholder: "输入预订参考号",
  loginButton: "登录",
  invalidCode: "预订参考号无效。请检查您的预订确认信息。",
  codeRequired: "请输入您的预订参考号",
  loading: "验证中...",
  welcomeTitle: "欢迎来到 Nuzul",
  secureText: "安全加密",
  secureDescription: "您的预订信息受到保护和安全",
  supportContact: "如需帮助，请联系支持：+971 XX XXX XXXX",

  // Maintenance Confirmation
  mc_title: "确认维护请求",
  mc_reviewRequest: "请查看您的维护请求",
  mc_topic: "主题",
  mc_mobileNumber: "手机号码",
  mc_message: "消息",
  mc_attachedPhoto: "附加照片",
  mc_noPhoto: "未附加照片",
  mc_confirm: "确认并通过 WhatsApp 发送",
  mc_edit: "编辑",
  mc_cancel: "取消",
  mc_back: "返回",
  mc_sending: "正在上传图片并准备 WhatsApp 消息...",
  mc_success: "请求发送成功！",
  mc_error: "发送请求失败。请重试。",

  // Maintenance Categories (values are Arabic for backend, labels are translated)
  maintenanceCategories: {
    "انقطاع مياه": "停水",
    "انقطاع كهرباء": "停电",
    "مشاكل تكييف": "空调问题（需要照片+数量）",
    "تسريب": "漏水（需要照片+数量）",
    "استبدال شطّاف": "更换马桶座圈（需要照片+数量）",
    "نجارة : رف او باب": "木工：架子或门（需要照片+数量）",
    "أخرى": "其他（需要照片+数量）",
    "انقطاع الانترنت": "网络中断",
    "السخان": "热水器",
    "أعطال الباب": "门故障",
    "مشكلة مغسلة يد": "洗手盆问题",
    "مشكلة الدش أو سماعة الشاور": "淋浴或花洒问题",
    "مشكلة تسريب سخان": "热水器漏水",
    "مشكلة في أحد اكسسوارات دورة المياه": "浴室配件问题（毛巾架、纸巾架、肥皂架）",
    "اهتزاز أو اتجاج مغسلة الملابس": "洗衣机振动或噪音",
    "عطل عام في مغسلة الملابس": "洗衣机一般故障",
    "انتهاء أو نفاذ الغاز": "燃气用完或耗尽",
    "مشكلة بالفرن أو عطل": "烤箱问题或故障",
    "عطل انارة أو فيش": "照明或插座故障",
    "مشكلة أدراج ودواليب أو طاولة أو كنب أو كراسي": "抽屉、柜子、桌子、沙发或椅子问题"
  },

  // Unit Information
  unitInformation: "房产信息",
  loadingUnitInfo: "正在加载单元信息...",
  unitInfoNotAvailable: "单元信息不可用",
  goBack: "返回",
  noBookingDataFound: "未找到预订数据",
  unableToExtractUnitNumber: "无法从住宿中提取单元号",
  unitNotFound: "未找到单元 {unitNumber}",
  failedToLoadUnitInfo: "加载单元信息失败",
  propertyDetails: "房产详情",
  googleMaps: "在 Google 地图上查看",
  reference: "参考",
  development: "开发",
  units: "单元",
  floor: "楼层",
  bedrooms: "卧室",
  neighborhood: "社区",
  tourismLicense: "旅游许可证",
  expiredDate: "到期日期",
  availability: "可用性",
  buildingPassword: "大楼密码",
  apartmentPassword: "公寓密码",
  lastPasswordChange: "上次密码更改",
  wifiCredentials: "WiFi 凭据",
  price: "价格",
  checkInInstructions: "🚪 入住说明",
  checkInSteps: [
    "到达时可能会要求您出示身份证件。",
    "请保持房产的良好状态。",
    "我们的支持团队全天候为您提供所需帮助。"
  ],
  essentialInfo: "🔑 基本信息",
  unitNumber: "单元号",
  wifiPassword: "WiFi 密码",
  emergencyContact: "紧急联系方式",
  maintenanceContact: "维护联系方式",
  importantNotes: [
    "可能会要求您分享您的身份证件",
    "保持房产清洁",
    "技术支持全天候可用"
  ],

  // Check In/Out Dates Component
  staySummary: "您的住宿摘要",
  checkoutTime: "中午 12:00",
  checkoutToday: "今日退房",
  nightRemaining: "剩余夜晚",
  nightsRemaining: "剩余夜晚",
  thankYouStay: "感谢您选择与我们入住！",
  thankYouMessage: "我们希望您度过了一段美好的时光。我们很乐意很快再次为您服务！",
  extendYourStay: "延长您的住宿？",
  requestMoreDays: "请求更多天数",
  addToCalendar: "添加到日历",
  calendarInstructions: "下载并打开日历文件，将此活动添加到您的日历应用程序。",
  downloadCalendarEvent: "下载日历活动",
  calendarInstructionsTitle: "ℹ️ 使用方法：",
  calendarInstructionsList: [
    "iPhone/iPad：从文件应用程序或 Safari 下载中打开 .ics 文件",
    "Android：打开下载的文件并选择您的日历应用程序",
    "适用于 Google 日历、Apple 日历、Outlook 等"
  ],
  loadingBookingInfo: "正在加载预订信息...",
  unableToLoadDates: "无法加载预订日期。请重新登录。",
  extensionRequestSubmitted: "延期请求已提交",
  extensionRequestMessage: "您延长 {days} {dayWord} 的请求已准备就绪。WhatsApp 现在应该会打开，您可以在那里发送您的请求。",
  extensionWhatsAppMessage: "您好！我目前住在「{accommodation}」，想将我的住宿延长 {days} {dayWord}。您能帮助我处理此请求吗？",
  day: "天",
  days: "天",

  // Extension Days Modal
  extendStayTitle: "延长您的住宿",
  extendStayQuestion: "您想将住宿延长多少天？",
  oneDay: "1 天",
  fiveDays: "5 天",
  oneMonth: "1 个月",
  custom: "自定义",
  enterNumberOfDays: "输入天数：",
  enterDaysPlaceholder: "输入天数",
  requestExtension: "请求延期",
  enjoyedStayMessage: "我们希望您住得愉快！🌟",

  // Bottom Navigation
  bottomNavHome: "主页",
  bottomNavUnitInfo: "单元信息",
  bottomNavPartners: "合作伙伴",
  bottomNavContact: "联系",

  // Emergency/Contact
  emergency: {
    title: "紧急情况与联系",
    subtitle: "我们全天候为您提供帮助",
    emergencyNumber: "紧急服务",
    ambulance: "救护车",
    ambulancePhone: "997",
    fireDepartment: "消防部门",
    fireDepartmentPhone: "998",
    ourNumber: "我们的号码（紧急情况）",
    ourNumberDescription: "如需紧急支持，请联系我们",
    ourPhone: "+966 11 234 5679",
    whatsapp: "WhatsApp 聊天",
    whatsappDescription: "在 WhatsApp 上与我们聊天以获得快速帮助",
    chatOnWhatsapp: "在 WhatsApp 上聊天",
    whatsappMessage: "您好，我需要帮助"
  },

  // Partners
  partners: {
    title: "我们的合作伙伴",
    subtitle: "为我们的客人提供专属折扣和服务",
    conciergeServices: "礼宾服务",
    coupons: "优惠券和折扣",
    contactPartner: "联系合作伙伴",
    visitWebsite: "访问网站",
    callNow: "立即致电",
    getCoupons: "获取优惠券",
    mezwalah: {
      name: "Mezwalah",
      description: "在 Mezwalah，我们提供量身定制的目的地管理解决方案，提供一流的服务。我们的专业团队在沙特阿拉伯及其他地区创建无缝的多目的地行程。",
      industry: "旅行安排",
      website: "www.mezwalah.com",
      phone: "00966507002958"
    },
    noonMinutes: {
      name: "Noon Minutes",
      description: "获取各种服务和产品的专属优惠券和折扣。",
      couponsAvailable: "可用优惠券"
    }
  },

  // Cleaning Services
  cleaning: {
    title: "清洁服务",
    subtitle: "选择适合您的服务",
    quickBooking: "快速预订",
    services: "所有服务",
    popular: "最受欢迎",
    recommended: "为您推荐",
    
    // Service Categories
    regularCleaning: "常规清洁",
    deepCleaning: "深度清洁",
    monthlyPlan: "月度计划",
    linens: "床单和毛巾",
    extras: "额外客人服务",
    
    // Service Details
    basicCleaningTitle: "快速清洁",
    basicCleaningDesc: "浴室、地板和垃圾清理",
    
    fullCleaningTitle: "完整公寓清洁",
    fullCleaningDesc: "全面清洁您的整个单元",
    
    monthlyTitle: "月度套餐",
    monthlyDesc: "每月4次访问 • 节省20%",
    
    linensTitle: "新鲜床单",
    linensDesc: "床单、毯子和毛巾",
    
    guestTitle: "客人设置",
    guestDesc: "为额外客人提供完整的床上用品",
    
    // Service Info
    duration: "2小时",
    available: "今天，下午3-8点",
    fromPrice: "起",
    perVisit: "/ 次",
    perMonth: "/ 月",
    saveUp: "节省",
    
    // Steps
    step1: "服务",
    step2: "时间",
    step3: "确认",
    
    // Time Selection
    pickTime: "选择时间",
    todayOnly: "今天可用",
    workingHours: "下午3:00 - 晚上8:00",
    lateNote: "晚上7点后的请求将安排到第二天",
    
    // Confirmation
    reviewBooking: "查看您的预订",
    totalPrice: "总计",
    confirmPay: "请求服务",
    
    // Unit Info
    yourUnit: "您的单元",
    building: "建筑物",
    stayDuration: "住宿"
  },

  // Unit Lock
  unitLockDetails: {
    unitNumber: "单元号",
    buildingPassword: "大楼密码",
    apartmentPassword: "公寓密码",
    development: "开发",
    copy: "复制",
    loading: "加载中...",
    bookingDataNotAvailable: "预订数据不可用",
    unitLockDataNotFound: "未找到单元锁数据",
    failedToFetchData: "获取数据失败",
    noDataAvailable: "无可用数据",
    howToUse: "使用方法",
    instruction1: "在键盘上输入公寓密码",
    instruction2: "按解锁按钮或 # 键",
    instruction3: "门将自动解锁",
    buildingPasswordInstruction: "先在键盘上输入大楼密码"
  }
};

export type ZhMessages = typeof zh;


