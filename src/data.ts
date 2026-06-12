export interface Product {
  id: string;
  name: string;
  subName: string;
  partNumber: string;
  originalPriceGbp: number;
  priceGbp: number;
  exchangeRate: number; // For easy substitution to TWD: NTD = Price_GBP * exchangeRate
  specs: string[];
  stockLeft: number;
  features: {
    title: string;
    description: string;
    icon: string;
    targetVal: number; // For animated counter! E.g. 172 for 172%
    suffix: string; // E.g. "% 容量激增"
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

export interface CrossSellItem {
  id: string;
  name: string;
  priceGbp: number;
  originalPriceGbp: number;
}

// ==========================================
// 1. 全域視覺圖片配置 (Images Configuration)
// ==========================================
export const IMAGES = {
  // 首頁大圖 (修正為真正的 Toyota GR Yaris 高清賽車跑道姿態)
  heroBg: "/hks_demo.jpg",
  // 商品展示主圖 (AIRTEC 變速箱油冷排雙引流科技導風罩實車無損空運熱交換核心狀態)
  product: "/product.jpg",
  // 數據曲線圖
  dataCurve: "/data.jpg",
  // 專業安裝現場/技師照
  installMechanic: "/install.jpg",

  // 備用 Unsplash 高清抗粉體塗層大圖 / AIRTEC 實裝精密導流照
  fallbackHeroBg: "https://images.unsplash.com/photo-1621259182978-f09e5e2b07ae?auto=format&fit=crop&w=1920&q=80",
  fallbackProduct: "/product.jpg",
  fallbackDataCurve: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  fallbackInstallMechanic: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800&q=80"
};

// ==========================================
// 2. 當前商品資料設定 - AIRTEC (Product Main Data)
// ==========================================
export const PRODUCTS: Product[] = [
  {
    id: "airtec-gearbox-oil-cooler",
    name: "AIRTEC Motorsport Gearbox Oil Cooler for Toyota Yaris GR Gen 2 (Auto)",
    subName: "Toyota GR Yaris Gen2 自排專屬極限性能版變速箱冷排",
    partNumber: "ATMSYGR12",
    originalPriceGbp: 698.80, // £ 698.8 * 41.5 = NT$ 29,000 (原本建議售價)
    priceGbp: 602.41, // USER SPEC: NT$ 25,000 佛心價! (£ 602.41 * 41.5 = 約 NT$ 25,000)
    exchangeRate: 41.50, // 匯率轉換系數
    stockLeft: 4,
    specs: [
      "AIRTEC 頂規黑色粉體烤漆加大防爆散熱排本體",
      "AIRTEC 鋁合金前方導流罩 (ATMSYGR12-Forwarder)",
      "AIRTEC 後方對流引導風箱管 (ATMSYGR12-Ventilation)",
      "高壓耐高溫航空編織防爆雙冷卻油管與完整安裝專用支架包"
    ],
    features: [
      {
        title: "容量激增",
        description: "冷排本體加高、加寬、加厚，總容積從原廠的 0.92 公升，暴力提升至 2.52 公升。從側切剖面看，厚度增加將近一倍，熱對流極致最大化！",
        icon: "Gauge",
        targetVal: 172,
        suffix: "% 容量暴增"
      },
      {
        title: "撞風面積擴大",
        description: "正面高密度撞風表面積由原廠 289cm² 大幅擴充至 421cm²，提供極佳的低阻高對流冷卻表現，全油門攻頂溫度零威脅。",
        icon: "ThermometerSnowflake",
        targetVal: 45,
        suffix: "% 散熱迎風擴增"
      },
      {
        title: "專屬雙引導流設計",
        description: "內附專用高耐度鋁合金前方導流導罩與後方流線型專用導風管，精確引進外氣冷熱空氣極速對流，熱交換效率暴力躍升一倍！",
        icon: "Wrench",
        targetVal: 100,
        suffix: "% 熱效率提升"
      }
    ]
  },
  {
    id: "hks-type-s-oil-cooler",
    name: "HKS Type-S Engine Oil Cooler for Toyota Yaris GR",
    subName: "Toyota GR Yaris (GXPA16) Type-S 絕對領域加大引擎油冷排",
    partNumber: "HKS Type-S",
    originalPriceGbp: 1325.30, // £ 1325.30 * 41.5 = NT$ 55,000 (建議售價)
    priceGbp: 1253.01, // £ 1253.01 * 41.5 = NT$ 52,000 (車友限時特價)
    exchangeRate: 41.50,
    stockLeft: 3,
    specs: [
      "HKS 專利 150x220x48mm / 12排 加強型冷卻核心 (Type-S Core)",
      "一體成型鋁合金前後迎風專用空氣導流罩與專屬支架",
      "內建溫控感知器 (Thermostat) 加熱旁通迴路，有效防止油溫過低",
      "高耐壓、超耐高溫不鏽鋼航空編織雙油路冷卻管件"
    ],
    features: [
      {
        title: "極速散熱效率",
        description: "高密度散熱鰭片與最優化內部流道設計，能在激烈走行時瞬間將引擎機油溫度大降 20°C 以上，延緩過熱衰竭保護！",
        icon: "ThermometerSnowflake",
        targetVal: 140,
        suffix: "% 散熱效能升級"
      },
      {
        title: "原廠無損孔位",
        description: "專屬一體成型支架設計，完美配合原廠防撞梁預留孔位，施工零修改、不鋸不切，高密合度無懈可擊！",
        icon: "Wrench",
        targetVal: 100,
        suffix: "% 完全免修改直上"
      },
      {
        title: "防過冷節溫科技",
        description: "內附專為街道/賽道開發之節溫裝置 (開關點 70°C-80°C)，低溫氣候走行自動啟動旁通流路，防主油壓因油寒而異常！",
        icon: "Gauge",
        targetVal: 100,
        suffix: "% 智能溫控守護"
      }
    ]
  },
  {
    id: "airtec-twin-combo",
    name: "KTSP × AIRTEC Twin-Cooling Ultra-Spec Combo Bundle",
    subName: "【雙管齊下】AIRTEC 變速箱油冷排 + HKS Type-S 引擎油冷排 終極避暑大禮包",
    partNumber: "ATMSYGR-COMBO",
    originalPriceGbp: 2024.10, // NT$ 84,000
    priceGbp: 1879.52, // NT$ 78,000
    exchangeRate: 41.50,
    stockLeft: 2,
    specs: [
      "【第一管】AIRTEC 頂規自排專用變速箱散熱冷排 (ATMSYGR12 前後風罩版)",
      "【第二管】HKS Type-S 絕對領域加大引擎油冷排 (高效率節溫科技)",
      "全套雙系統專用高壓耐高溫航空金屬編織油管與完整免切無損專屬支架組",
      "KTSP 阿咪魂改裝廠手藝無損雙系統完工服務，享最高規格性能守護"
    ],
    features: [
      {
        title: "雙重控溫效能",
        description: "同時徹底解決變速箱高熱保護卡擋與引擎機油溫度飆高兩大升級痛點！盛夏跑賽道或攻頂山路也爽快無阻！",
        icon: "ShieldAlert",
        targetVal: 200,
        suffix: "% 極限避暑冷卻效率"
      },
      {
        title: "夏天盡興狂飆",
        description: "引擎機油溫度與自排箱溫度雙重極致守護，酷熱夏日狂胚多圈麗寶賽道或山道路段，徹底杜絕高溫軟腳防禦！",
        icon: "Flame",
        targetVal: 120,
        suffix: "°C 內完美大綠區控制"
      },
      {
        title: "KTSP 完美施工",
        description: "KTSP 改車找阿咪親自操持！自排油冷 + 引擎油冷一次到位，限時雙重優惠工資 NT$ 0 完工狂省萬元！",
        icon: "Sparkles",
        targetVal: 100,
        suffix: "% 專業無損匠人施工"
      }
    ]
  }
];

export const PRODUCT_DATA: Product = PRODUCTS[0];

// ==========================================
// 3. 順手加購區 (Customers Also Purchased / Cross-Sell)
// ==========================================
export const CROSS_SELL_ITEMS: CrossSellItem[] = [
  {
    id: "sticker",
    name: "AIRTEC Start / Stop 引擎啟動鈕果凍貼",
    priceGbp: 4.15,
    originalPriceGbp: 5.00
  },
  {
    id: "symposer-bung",
    name: "AIRTEC 洩壓閥塞 33mm (Dump Valve Symposer Bung)",
    priceGbp: 16.01,
    originalPriceGbp: 22.00
  }
];

// ===============================================================
// 4. 信用卡與分期設定 (PayUni / Checkout Plans)
// ===============================================================
export const INSTALLMENT_PLANS: InstallmentPlan[] = [
  {
    id: "1",
    months: 1,
    label: "一次付清 (One-Time Payment)",
    rate: 0.0,
    description: "免手續費，英國空運最速直送",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/gVT1kvxjaHJrQfQbd7GQ"
  },
  {
    id: "3",
    months: 3,
    label: "信用卡 3 期分期付款",
    rate: 0.029,
    description: "無痛性能大躍進，無負擔享受山路與賽道極速操駕",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/GYqjfSPbRPJPoOO6iNve"
  },
  {
    id: "6",
    months: 6,
    label: "信用卡 6 期分期付款",
    rate: 0.035,
    description: "每期輕量理財，給自排暴力鴨變速箱完美延壽升級",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/NOaY6IEacPzGbdBpYCTH"
  },
  {
    id: "12",
    months: 12,
    label: "信用卡 12 期分期付款",
    rate: 0.065,
    description: "每日省下一杯美式咖啡，完美解決變速箱熱衰退煩惱",
    payLink: "https://api.payuni.com.tw/api/uop/receive_info/2/1/CCAT005638610001/J7eSxUoXtt27VHWmzEG7"
  }
];

// ==========================================
// 5. 台灣安裝與售後證言 (Installer Team Review)
// ==========================================
export const TESTIMONIALS = {
  mechanic: {
    name: "阿咪 (Ah-Mi)",
    title: "Project D 暴力鴨御用首席首席改裝重地總監",
    quote: "二代自排暴力鴨在一般開法變速箱溫度就已經緊繃在 110 度上下，只要山路狂灌兩下、甚至像冬天賽道只要拉轉起步，溫度就直接熔斷 120°C 觸發降速卡擋。裝了這套 AIRTEC 雙導流加強冷排之後，台中麗寶跑完整節油溫水溫都在大綠區。原廠完美藏於保護防撞梁後，施工不需切原廠任何部件，無損直上，完美極限！",
    regularPrice: 6500,
    promoPrice: 0
  }
};

// ===============================================================
// 6. 全站文字細節與文案包裝配置 (Full Copy & Typography Details)
// ===============================================================
export const SYSTEM_CONFIG = {
  // 導覽列文字
  nav: {
    brandLogo: "KTSP MOTORSPORT",
    brandSub: "| GR YARIS GEN2 (AUTO)",
    statusText: "GR YARIS GEN 2 // AIRTEC MOTORSPORT",
    ctaText: "立即搶購現貨"
  },
  
  // 英雄首頁主文案
  hero: {
    badge: "GR YARIS GEN 2 // AIRTEC MOTORSPORT",
    titleMain: "封印，",
    titleGlow: "解除。",
    subTitle: "公道最速傳說始動。",
    quote: "當溫度破表、換檔遲滯狂襲，你是否還能堅守最速之名？二代自排版 GR Yaris 當天氣漸熱（甚至在1月初的寒冬），在賽道或山路變速箱溫度極易突破 120°C，導致爆表換檔嚴重不順及動力遲滯！SOLUTION FOUND // AIRTEC Motorsport 專用冷卻套件導入，徹底消滅熱衰竭！",
    ctaPriceLabel: "搶購現貨",
    originalPriceLabel: "ORIGINAL",
    badgeLabel: "KTSP MOTORSPORT UK BATCH EXCLUSIVE COUPLING",
    stockLabel: "SYSTEM WARNING // INSTOCK LOW:",
    stockUnitLabel: "現貨僅剩:",
    stockUnitSuffix: "組 / 補貨調貨 3 週"
  },

  // 仿福音戰士 MAGI 警告版面設定
  magiSection: {
    watermark: "過熱限界",
    emergencyBadge: "變速箱熱暴走警告",
    emergencyDetails: "STATUS: CRITICAL // GEARBOX OVERHEAT IMMINENT",
    quoteHeader: "油溫突破 120°C 變速箱崩壞！",
    episodeTitle: "EPISODE: GEARBOX THERMAL OVERHEAT RUNAWAY",
    
    panel1: {
      tag: "MAGI-01 // COUPLING-LIMIT",
      title: "自排熱防護限制",
      target: "TARGET: LIHPAO CIRCUIT",
      status: "STATUS: CRITICAL",
      statHeader: "TRANSMISSION OIL RE-TEMP (變速箱即時溫度)",
      description: "在台中麗寶賽道或山路激烈操駕，<strong>二代自排版 GR Yaris 變速箱溫度極易突破 120°C ！</strong> 甚至在氣溫寒冷的一月初冬天也會頻繁發生，導致高熱衰！"
    },
    
    panel2: {
      tag: "MAGI-02 // DEBILITATED-GEAR",
      title: "換檔遲滯退縮症",
      target: "TARGET: SHIHTAN / MOUNTAINS",
      status: "STATUS: PATHOLOGICAL",
      statHeader: "TELEMETRY RESPONSE (反應時間延遲)",
      description: "一旦高溫，自排腦便啟動動力自我防禦限制。<strong>隨之而來的是嚴重的換檔不順、踩不上去與遲滯軟腳。</strong> 唯有導入 AIRTEC 專用冷卻套件才能徹底破解封鎖！"
    }
  },

  // 產品規格展示標題
  showcase: {
    badge: "172% CAPACITY INCREASE & 45% FRONT HEATER SURFACE EXPANDED",
    titleMain: "三大終極科技",
    titleGlow: "完美無損解藥"
  },

  specComparison: {
    title: "規格參數極限對決 // SPECIFICATION DEFEAT",
    boltOnLabel: "完美隱藏於保險桿後方，完全無須切割或修剪原廠部件 (Direct replacement that requires no cutting or trimming)。套件內附專用輕量化強化支架、油管與防爆快拆配件，以及詳細施工指南。",
    headers: {
      metric: "規格細節 (SPECIFICATIONS)",
      oe: "原廠標準 (OEM SPEC)",
      airtec: "AIRTEC 加強版 (AIRTEC CORE)"
    },
    rows: [
      { name: "本體厚度 (Core Depth)", oe: "32mm", airtec: "60mm (厚度近乎倍增 !)" },
      { name: "本體高度 (Core Height)", oe: "252mm", airtec: "290mm" },
      { name: "本體寬度 (Core Width)", oe: "115mm", airtec: "145mm" },
      { name: "總冷媒容積 (Cooling Capacity)", oe: "0.92 L", airtec: "2.52 L (172% 暴力增加 !)" },
      { name: "正面撞風面積 (Frontal Area)", oe: "289 cm²", airtec: "421 cm² (45% 迎風暴增 !)" }
    ]
  },

  // 首席技師安裝方案
  technician: {
    title: "",
    boldQuote: "「原廠預留位完美隱藏保險桿，不鋸不切。」",
    regularWageLabel: "原廠特約手工安裝與高規格排氣施工",
    couponLabel: "本波名額限時尊榮優惠",
    freeText: "NT$ 0 佛心免費完工"
  },

  // 直接下單與結帳彈窗詳情
  checkout: {
    badgeLabel: "英國直送 UK DIRECT",
    stockUrgencyPrefix: "SYSTEM WARNING // INSTOCK LOW 。目前現貨僅剩",
    stockUrgencySuffix: "組！若未搶到現貨，預計下一批交貨期需等待 2 到 3 個禮拜。",
    packageItemsHeader: "Included In Package / AIRTEC 套件全配內容物 :",
    readyLabel: "UK AIRPORT STOCK",
    includedLabel: "INCLUDED",
    airCargoText: "英國原裝原廠空運直達台灣 (UK Air Cargo Express)",
    freeInstallBanner: "【職人操刀】KTSP阿咪特約無損精密完工服務 (匠人親自全車守護，100%原廠孔位無損直上)",
    freeUpgradeLabel: "FREE UPGRADE",
    quantitySelectHeader: "選擇購入數量 (QUANTITY)",
    checkoutButtonText: "加入購物車 (Add to basket)",
    
    modalTitle: "AIRTEC Racing Upgrade Portal",
    planSelectHeader: "Select Billing Method (金流與多期分期付款選項)",
    processingFeeLabel: "Billing Process Fee (銀行手續費)",
    freeFeeLabel: "免手續費 0%",
    processingFeeSuffix: "利息費率",
    totalPayableLabel: "TOTAL AMOUNT DUE",
    perInstallmentPrefix: "每期只要",
    perInstallmentSuffix: "期",
    confirmButtonText: "Confirm Selection & Initiate Order"
  },

  // 開發社交真實度氣泡 (模擬下單城市與买家)
  realtimeAlerts: {
    notificationTimerMs: 8000,
    clearTimerMs: 6500,
    cities: ["台北內湖", "新北板橋", "台中北屯", "桃園中壢", "新竹竹北", "高雄鼓山", "彰化市", "台南安平"],
    buyers: ["柯先生", "林先生", "陳先生", "王先生", "詹先生", "廖先生", "賴先生", "游車友"],
    suffix: " 剛剛加入購物車下單了 1 組 AIRTEC 變速箱冷排套件！"
  },

  // 頁腳 (Footer)
  footer: {
    brandName: "KTSP 改車找阿咪",
    brandSlogan: "UK PERFORMANCE COOLING SYSTEMS // EXCEED LIMITS ON Track & Touge",
    copyright: "© 2026 AIRTEC Motorsport. Coordinated by Taiwan Master Tuning Associates. UK registered ATMSYGR12."
  }
};
