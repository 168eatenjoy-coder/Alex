export interface Product {
  id: string;
  name: string;
  subName: string;
  originalPrice: number;
  price: number;
  specs: string[];
  stockLeft: number;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface InstallmentPlan {
  id: string;
  months: number;
  label: string;
  rate: number;
  description: string;
  payLink: string;
}

// ==========================================
// 1. 全域視覺圖片配置 (Images Configuration)
// ==========================================
export const IMAGES = {
  // 首頁大圖 (預設為賽車底盤背景)
  heroBg: "/hks_demo.jpg",
  // 商品展示主圖
  product: "/product.jpg",
  // 數據曲線圖
  dataCurve: "/data.jpg",
  // 專業安裝現場/技師照
  installMechanic: "/install.jpg",

  // 備用 Unsplash 高清大圖 (當 /public 裡的本地圖檔尚未加載時的 fallback)
  fallbackHeroBg: "https://images.unsplash.com/photo-1701382453094-bf9b59ecbc8f?auto=format&fit=crop&w=1920&q=80",
  fallbackProduct: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
  fallbackDataCurve: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  fallbackInstallMechanic: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800&q=80"
};

// ==========================================
// 2. 當前商品資料設定 (Product Main Data)
// ==========================================
export const PRODUCT_DATA: Product = {
  id: "hks-cooler-gen2",
  name: "HKS Type-S 絕對領域機油冷卻器",
  subName: "GR Yaris Gen2 Final Stage Edition",
  originalPrice: 54900,
  price: 52000,
  stockLeft: 4,
  specs: [
    "HKS Gen2 專用高密度 Core 本體 (Type-S)"
  ],
  features: [
    {
      title: "冷卻的極意 (-20°C)",
      description: "專為二代 Yaris 設計的專屬散熱鰭片流速，完美平衡風阻與散熱面積，能穩定將高速行駛下的機油溫度降低多達 20度。",
      icon: "ThermometerSnowflake"
    },
    {
      title: "暴力鴨專用續命丹",
      description: "有效消除原廠在麗寶、大鵬灣全速狂操時的嚴重熱衰竭現象，徹底解開冷卻封印，延長引擎高轉運轉壽命。",
      icon: "ShieldAlert"
    },
    {
      title: "無損直上設計 (Bolt-On)",
      description: "完全對應原廠底盤與水箱支架預留鎖點。完全不需破壞或切削原廠板金，無損回復，精準度如同原廠選配件。",
      icon: "Wrench"
    }
  ]
};

// ===============================================================
// 3. 信用卡分期與付款金流連結設定 (Installment Plans & PayUni checkouts)
//    【重要】您可以在此處將 payLink 替換為您的 PayUni 或藍新第三方支付金流網址！
// ===============================================================
export const INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: "1",
    months: 1,
    label: "一次付清 (One-Time Payment)",
    rate: 0.0,
    description: "免手續費，快速啟動絕對領域",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/gVT1kvxjaHJrQfQbd7GQ"
  },
  {
    id: "3",
    months: 3,
    label: "信用卡 3 期分期付款",
    rate: 0.029,
    description: "輕鬆入手，2.9% 輕量利息無壓力",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/GYqjfSPbRPJPoOO6iNve"
  },
  {
    id: "6",
    months: 6,
    label: "信用卡 6 期分期付款",
    rate: 0.035,
    description: "每個月少吃兩頓大餐，換引擎永久平安",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/NOaY6IEacPzGbdBpYCTH"
  },
  {
    id: "12",
    months: 12,
    label: "信用卡 12 期分期付款",
    rate: 0.065,
    description: "每天不到一杯咖啡錢，擁抱卓越賽道耐受度",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/J7eSxUoXtt27VHWmzEG7"
  }
];

// ==========================================
// 4. 黑手老字號專業證言 (Installer/Mechanic Review)
// ==========================================
export const TESTIMONIALS = {
  mechanic: {
    name: "阿咪 (Ah-Mi)",
    title: "Project D 指定首席黑手技師",
    quote: "車子是男人的靈魂，我不會讓它受傷。我不只是把改裝品鎖上去。我是幫你調校這部怪獸的生命防線。極緻完美的施工，是對你跟對暴力鴨最基本的尊重。",
    regularPrice: 7700,
    promoPrice: 0
  }
};

// ===============================================================
// 5. 全站文字細節與文案包裝配置 (Full Copy & Typography Details)
//    更動這裡的文字，就能在完全不更改程式碼的情況下把這套「硬核賽車／新世紀福音戰士」風格用在任何不同的新商品上！
// ===============================================================
export const SYSTEM_CONFIG = {
  // 導覽列文字
  nav: {
    brandLogo: "PROJECT GR",
    brandSub: "| YARIS GEN2 FINAL STAGE",
    statusText: "SYSTEM OVERWATCH ACTIVE",
    ctaText: "BATTLE START"
  },
  
  // 英雄首頁主文案
  hero: {
    badge: "公道最速傳說 // 始動",
    titleMain: "封印，",
    titleGlow: "解除。",
    quote: "「昨晚我輸給一輛 GR Yaris Gen2... 跑了整趟北宜公路催沒停，他的油溫居然沒有過熱？」 現在，輪到別人看不到你的車尾燈了。唱出屬於你的狂野行跡。",
    ctaPriceLabel: "參戰",
    originalPriceLabel: "ORIGINAL",
    badgeLabel: "限時降價特惠中 font-mono",
    stockLabel: "SYSTEM READY // INSTOCK:",
    stockUnitLabel: "GEN2 FINAL",
    stockUnitSuffix: "UNITS"
  },

  // 仿福音戰士 MAGI 警告版面設定
  magiSection: {
    watermark: "活動限界",
    emergencyBadge: "緊急事態",
    emergencyDetails: "EMERGENCY: THERMAL RUNAWAY LIMIT ACTIVED",
    quoteHeader: "你的引擎在哭泣啊！",
    episodeTitle: "EPISODE: OVERHEAT FEAR",
    
    panel1: {
      tag: "MAGI-01 // BALTHASAR",
      title: "熱暴走警告",
      target: "TARGET: LIHPAO",
      status: "STATUS: CRITICAL",
      statHeader: "TIME TO LIMP MODE (賽道安全極限)",
      description: "GR YARIS 本身散熱效率不足，若在賽道全油門，短短兩圈原廠冷卻系統依然會觸發電腦熱防護 Limp Mode（鎖動力保護）。"
    },
    
    panel2: {
      tag: "MAGI-02 // MELCHIOR",
      title: "活動限界 OIL",
      target: "TARGET: BEIYI",
      status: "STATUS: WARNING",
      statHeader: "REAL-TIME OIL TEMP (即時機油溫度)",
      description: "在高負載山道狂飆，北47線都還沒攻略完畢，機油溫度已飆破臨界點，引擎效能開始因高溫急速軟腳退火！"
    }
  },

  // 產品規格展示標題
  showcase: {
    badge: "New Cooling Engineering for Gen2",
    titleMain: "HKS Type-S",
    titleGlow: "絕對領域"
  },

  // 首席技師安裝方案
  technician: {
    title: "Project D 指定首席黑手技師",
    boldQuote: "「車子是男人的靈魂，我不會讓它受傷。」",
    regularWageLabel: "常規安裝工資",
    couponLabel: "本波參戰優惠",
    freeText: "$0 FREE"
  },

  // 直接下單與結帳彈窗詳情
  checkout: {
    badgeLabel: "限時特惠 DISCOUNT",
    stockUrgencyPrefix: "最後",
    stockUrgencySuffix: "組庫存 // 補貨未定",
    packageItemsHeader: "Included In Package / 全配內容物 :",
    readyLabel: "READY",
    includedLabel: "INCLUDED",
    airCargoText: "日本航空空運直達 (Japan Air Cargo Link)",
    freeInstallBanner: "阿咪專業手工無損安裝服務",
    freeUpgradeLabel: "FREE UPGRADE",
    quantitySelectHeader: "選擇購入數量 (QUANTITY)",
    checkoutButtonText: "立即結帳 / CHECKOUT",
    
    modalTitle: "Tuning Configuration",
    planSelectHeader: "Select Payment Option (付款方案選擇)",
    processingFeeLabel: "Plan Processing Fee (手續費)",
    freeFeeLabel: "免手續費",
    processingFeeSuffix: "費率",
    totalPayableLabel: "TOTAL PAYABLE",
    perInstallmentPrefix: "每期只要",
    perInstallmentSuffix: "期",
    confirmButtonText: "Confirm & Launch Order"
  },

  // 開發社交真實度氣泡 (模擬下單城市與买家)
  realtimeAlerts: {
    notificationTimerMs: 6000,
    clearTimerMs: 5000,
    cities: ["台北松山", "新北板橋", "台中西屯", "桃園中壢", "新竹竹北", "高雄前鎮"],
    buyers: ["張先生", "林先生", "陳先生", "王先生", "劉先生", "許先生"],
    suffix: " 剛剛搶購了 1 套 HKS Type-S 冷卻組！"
  },

  // 頁腳 (Footer)
  footer: {
    brandName: "GR PROJECT",
    brandSlogan: "RACE ON TRACK. DRIVE SAFE. // YARIS GEN2 EDITION",
    copyright: "© 2026 PROJECT GR All Rights Reserved. Custom Tuning solutions & PayUni Gateway."
  }
};
