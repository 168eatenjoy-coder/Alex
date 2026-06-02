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

// 圖片集配置：您可以在這裡輕鬆更動網站上所有圖片的路徑或網址
export const IMAGES = {
  // 首頁背景圖 (預設為 GR Yaris Gen2 特規底盤背景)
  heroBg: "/hks_demo.jpg",
  // 商品展示圖
  product: "/product.jpg",
  // 數據對比圖
  dataCurve: "/data.jpg",
  // 阿咪安裝現場圖
  installMechanic: "/install.jpg",

  // 如果本地圖檔不存在時的備用 Unsplash 高清賽道背景
  fallbackHeroBg: "https://images.unsplash.com/photo-1701382453094-bf9b59ecbc8f?auto=format&fit=crop&w=1920&q=80",
  fallbackProduct: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80",
  fallbackDataCurve: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  fallbackInstallMechanic: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=800&q=80"
};

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

export interface InstallmentPlan {
  id: string;
  months: number;
  label: string;
  rate: number;
  description: string;
  payLink: string;
}

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

export const TESTIMONIALS = {
  mechanic: {
    name: "阿咪 (Ah-Mi)",
    title: "Project D 指定首席黑手技師",
    quote: "車子是男人的靈魂，我不會讓它受傷。我不只是把改裝品鎖上去。我是幫你調校這部怪獸的生命防線。極緻完美的施工，是對你跟對暴力鴨最基本的尊重。",
    regularPrice: 7700,
    promoPrice: 0
  }
};
