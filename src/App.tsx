import { useState, useEffect, SyntheticEvent, useRef } from "react";
import { 
  Gauge, 
  ThermometerSnowflake, 
  ShieldAlert, 
  Wrench, 
  Flame, 
  Flag, 
  ShoppingCart, 
  CheckCheck,
  Check,
  Plane,
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Truck,
  Gift,
  Plus,
  Minus,
  X,
  CreditCard,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { PRODUCTS, PRODUCT_DATA, CROSS_SELL_ITEMS, INSTALLMENT_PLANS, TESTIMONIALS, IMAGES, SYSTEM_CONFIG } from "./data";
import CoolingChart from "./components/CoolingChart";

// Custom requestAnimationFrame-based animated counter component triggered when scrolled into view
function ScrollTriggeredCounter({ value, suffix, themeMode }: { value: number; suffix: string; themeMode: "cyber" | "magi" | "initialD" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let startTimestamp: number | null = null;
          const duration = 1200; // 1.2 seconds animation
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing-out quad function for professional acceleration deceleration feel
            const easeOutQuad = (t: number) => t * (2 - t);
            const currentValue = Math.floor(easeOutQuad(progress) * value);
            setCount(currentValue);
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(value);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value]);

  return (
    <span 
      ref={elementRef} 
      className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text font-display tracking-tight ${
        themeMode === "cyber" 
          ? "bg-gradient-to-r from-cyan-450 to-fuchsia-500 text-cyan-glow" 
          : themeMode === "initialD"
          ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 [text-shadow:2px_2px_0px_rgba(0,0,0,1)]"
          : "bg-gradient-to-r from-red-600 to-yellow-500 text-glow"
      }`}
    >
      {count}{suffix}
    </span>
  );
}

export default function App() {
  // States
  const [themeMode, setThemeMode] = useState<"cyber" | "magi" | "initialD">("magi");
  const [selectedProductId, setSelectedProductId] = useState<string>("airtec-gearbox-oil-cooler");
  
  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  
  const [quantity, setQuantity] = useState<number>(1);
  const [addonSticker, setAddonSticker] = useState<boolean>(false);
  const [addonBung, setAddonBung] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transmissionTemp, setTransmissionTemp] = useState<number>(118.5);
  const [circuitTime, setCircuitTime] = useState<string>("04:43:65");
  const [orderNotification, setOrderNotification] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Fallback image helper
  const handleImageError = (e: SyntheticEvent<HTMLImageElement>, type: string) => {
    const img = e.currentTarget;
    if (img.dataset.tried === "true") return;
    img.dataset.tried = "true";
    if (type === "hero") {
      img.src = IMAGES.fallbackHeroBg;
    } else if (type === "product") {
      img.src = IMAGES.fallbackProduct;
    } else if (type === "data") {
      img.src = IMAGES.fallbackDataCurve;
    } else if (type === "install") {
      img.src = IMAGES.fallbackInstallMechanic;
    } else {
      img.src = "https://placehold.co/800x450/111/fff?text=AIRTEC+COOLING+SYSTEM";
    }
  };

  // Real-time telemetry emulation & Scroll events
  useEffect(() => {
    // 1. Oscillate Transmission Oil Temp between 118°C and 122.5°C reflecting critical peaks
    const tempInterval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.5;
      setTransmissionTemp(prev => {
        const next = prev + delta;
        return next < 118.0 ? 118.0 : next > 122.6 ? 122.6 : next;
      });
    }, 1200);

    // 2. Stopwatch loop microsecond oscillation for Telemetry simulation
    const circuitInterval = setInterval(() => {
      const m = 4;
      const s = Math.floor(35 + Math.random() * 20);
      const ms = Math.floor(Math.random() * 100);
      setCircuitTime(`0${m}:${s < 10 ? '0' + s : s}:${ms < 10 ? '0' + ms : ms}`);
    }, 100);

    // 3. Random purchase bubble loops to trigger urgency factor
    const notificationTimeout = setTimeout(() => {
      const { cities, buyers, suffix, clearTimerMs } = SYSTEM_CONFIG.realtimeAlerts;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      setOrderNotification(`${randomCity}的 ${randomBuyer}${suffix}`);
      
      const clearNotice = setTimeout(() => {
        setOrderNotification(null);
      }, clearTimerMs);

      return () => clearTimeout(clearNotice);
    }, SYSTEM_CONFIG.realtimeAlerts.notificationTimerMs);

    // 4. Scroll listener to reveal the Sticky Bottom Order Bar past 400px scroll
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(tempInterval);
      clearInterval(circuitInterval);
      clearTimeout(notificationTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Increase/Decrease quantity with safety limits
  const changeQty = (val: number) => {
    const res = quantity + val;
    if (res >= 1 && res <= activeProduct.stockLeft) {
      setQuantity(res);
    }
  };

  // Calculation for plans based on local currency (GBP) or exchange-rendered TWD values
  const getSelectedPlan = () => {
    return INSTALLMENT_PLANS.find(p => p.id === selectedPlanId) || INSTALLMENT_PLANS[0];
  };

  const calculateTotal = () => {
    const plan = getSelectedPlan();
    
    // Core base GBP cost
    let itemTotalGbp = activeProduct.priceGbp * quantity;
    
    // Check addon accessories
    if (addonSticker) {
      itemTotalGbp += CROSS_SELL_ITEMS[0].priceGbp;
    }
    if (addonBung) {
      itemTotalGbp += CROSS_SELL_ITEMS[1].priceGbp;
    }

    const feeGbp = itemTotalGbp * plan.rate;
    const grandTotalGbp = itemTotalGbp + feeGbp;
    const monthlyPaymentGbp = grandTotalGbp / plan.months;

    // Convert into TWD (Note: Taiwanese owners prefer seeing dynamic TWD rates next to import price)
    const rate = activeProduct.exchangeRate;
    const itemTotalTwd = Math.round(itemTotalGbp * rate);
    const feeTwd = Math.round(feeGbp * rate);
    const grandTotalTwd = Math.round(grandTotalGbp * rate);
    const monthlyPaymentTwd = Math.round(monthlyPaymentGbp * rate);

    return {
      itemTotalGbp,
      feeGbp,
      grandTotalGbp,
      monthlyPaymentGbp,
      itemTotalTwd,
      feeTwd,
      grandTotalTwd,
      monthlyPaymentTwd
    };
  };

  const { 
    itemTotalGbp, 
    feeGbp, 
    grandTotalGbp, 
    monthlyPaymentGbp, 
    itemTotalTwd, 
    feeTwd, 
    grandTotalTwd, 
    monthlyPaymentTwd 
  } = calculateTotal();

  const handleCheckoutRedirect = () => {
    const plan = getSelectedPlan();
    if (plan.payLink) {
      if (selectedProductId === "airtec-gearbox-oil-cooler") {
        window.location.href = plan.payLink;
      } else {
        // Appends product details to real payment merchant flow
        window.location.href = `${plan.payLink}&product=${selectedProductId}&qty=${quantity}`;
      }
    }
  };

  const scrollCheckout = () => {
    const checkoutElem = document.getElementById("order");
    if (checkoutElem) {
      checkoutElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans transition-colors duration-300 ${
      themeMode === "cyber" 
        ? "selection:bg-cyan-500 selection:text-black" 
        : themeMode === "initialD"
        ? "selection:bg-yellow-400 selection:text-black"
        : "selection:bg-red-600 selection:text-white"
    }`}>
      {/* HUD Scanline visual overlay effect */}
      <div className="scanlines" />

      {/* Social Urgency Notification Pop */}
      {orderNotification && (
        <div className={`fixed top-24 right-4 z-50 animate-bounce max-w-sm bg-neutral-950 border-2 p-4 flex items-center gap-3 rounded-sm ${
          themeMode === "cyber" 
            ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
            : themeMode === "initialD"
            ? "border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            : "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
        }`}>
          <div className={`w-3 h-3 rounded-full animate-ping ${
            themeMode === "cyber" ? "bg-cyan-400" : themeMode === "initialD" ? "bg-yellow-450 bg-yellow-400" : "bg-red-600"
          }`} />
          <p className="text-sm font-bold text-gray-200">{orderNotification}</p>
        </div>
      )}

      {/* Sticky Bottom Bar for instant Mobile / Wide CTA */}
      <div 
        className={`fixed bottom-0 left-0 w-full z-[45] bg-black/95 border-t-2 px-4 py-3 transition-all duration-300 transform ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        } ${
          themeMode === "cyber" 
            ? "border-cyan-500 shadow-[0_-5px_25px_rgba(6,182,212,0.35)]" 
            : themeMode === "initialD"
            ? "border-yellow-400 shadow-[0_-5px_25px_rgba(250,204,21,0.25)]"
            : "border-red-600 shadow-[0_-5px_25px_rgba(220,38,38,0.3)]"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="text-left font-mono hidden sm:block">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
              {activeProduct.name.slice(0, 32)}...
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-black ${
                themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400 text-glow" : "text-white"
              }`}>
                NT$ {Math.round(activeProduct.priceGbp * activeProduct.exchangeRate).toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                (英國空運直送)
              </span>
            </div>
            <span className="text-[10px] text-yellow-500 font-black block mt-0.5 animate-pulse">
              ⚡ 支援付款: 一次付清 / 3期(2.9%) / 6期(3.5%) / 12期(6.5%) 分期付款
            </span>
          </div>
          
          <button 
            onClick={scrollCheckout}
            className={`w-full sm:w-auto font-black py-3 px-8 text-sm md:text-base uppercase tracking-widest skew-box cursor-pointer text-center transition-all duration-250 ${
              themeMode === "cyber" 
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                : themeMode === "initialD"
                ? "bg-yellow-400 hover:bg-yellow-350 text-black border-2 border-black [box-shadow:4px_4px_0px_#000]"
                : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            }`}
          >
            <span className="unskew-text tracking-widest flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" /> 立即搶購現貨 (Add to Basket)
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 border-b bg-black/90 backdrop-blur-md transition-colors duration-300 ${
        themeMode === "cyber" ? "border-cyan-950/60" : themeMode === "initialD" ? "border-yellow-950/80" : "border-red-900/40"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-10 skew-box transition-colors duration-350 ${
              themeMode === "cyber" ? "bg-cyan-500 shadow-[0_0_10px_#00f0ff]" : themeMode === "initialD" ? "bg-yellow-400 [box-shadow:2px_2px_0px_#000] border border-black" : "bg-red-650 bg-red-600"
            }`}></div>
            <div className="flex flex-col text-left">
              <span className="font-retro text-[10px] md:text-[13px] tracking-wider text-yellow-400 leading-none mb-1 shadow-sm">
                {SYSTEM_CONFIG.nav.brandLogo}
              </span>
              <span className="font-retro-sub text-xs md:text-sm tracking-widest font-bold leading-none uppercase text-cyan-400">
                {SYSTEM_CONFIG.nav.brandSub}
              </span>
            </div>
          </div>
          
          {/* Locked to MAGI_SYS */}
          <div className="flex items-center gap-3 md:gap-5">
            <span className="hidden lg:inline-flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
              {SYSTEM_CONFIG.nav.statusText}
            </span>

            <button 
              onClick={scrollCheckout}
              className={`skew-box px-5 py-2 font-black transition-all duration-300 flex items-center shadow-lg cursor-pointer border-0 ${
                themeMode === "cyber" 
                  ? "bg-cyan-500 text-black hover:bg-cyan-400" 
                  : themeMode === "initialD"
                  ? "bg-yellow-400 text-black hover:bg-yellow-350 border-2 border-black [box-shadow:3px_3px_0px_#000]"
                  : "bg-white text-black hover:bg-red-600 hover:text-white"
              }`}
            >
              <span className="unskew-text uppercase text-xs md:text-sm tracking-widest flex items-center gap-1.5 font-bold">
                <ShoppingBag className="w-4 h-4" /> {SYSTEM_CONFIG.nav.ctaText}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.heroBg} 
            onError={(e) => handleImageError(e, "hero")}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 grayscale mix-blend-screen scale-105" 
            alt="Toyota GR Yaris Gen2 Motorsport stance"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/35 to-[#0A0A0A]"></div>
          {/* Cyber grid system */}
          <div className={`absolute inset-0 opacity-15 transition-all duration-300 ${
            themeMode === "cyber" ? "cyber-grid-bg" : themeMode === "initialD" ? "manga-speed-lines opacity-25" : ""
          }`} style={themeMode === "cyber" ? {} : themeMode === "initialD" ? {} : { backgroundImage: "linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-12 items-center w-full py-16">
          <div className="md:col-span-8 text-left space-y-6 md:space-y-8">
            <div className={`inline-flex items-center gap-2 border px-4 py-1 skew-box animate-pulse ${
              themeMode === "cyber" ? "border-cyan-500 bg-cyan-950/25" : themeMode === "initialD" ? "border-yellow-400 bg-yellow-950/40" : "border-red-600 bg-red-950/40"
            }`}>
              <span className={`text-xs md:text-sm font-bold tracking-widest uppercase unskew-text font-mono ${
                themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400 font-extrabold" : "text-red-400"
              }`}>
                {themeMode === "cyber" ? "STATUS // CRITICAL HEAT // TOUGHT & TRACK" : themeMode === "initialD" ? "KTSP 改車找阿咪 // 道路專用特仕版" : SYSTEM_CONFIG.hero.badge}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black leading-none italic drop-shadow-2xl font-display uppercase">
              {SYSTEM_CONFIG.hero.titleMain}<br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-350 ${
                themeMode === "cyber" 
                  ? "from-cyan-400 via-pink-500 to-fuchsia-500 text-pink-glow" 
                  : themeMode === "initialD"
                  ? "from-yellow-400 via-amber-400 to-yellow-500 [text-shadow:3px_3px_0px_#000]"
                  : "from-red-640 to-red-500 text-glow"
              }`}>
                {themeMode === "initialD" ? "KTSP 阿咪魂加持" : SYSTEM_CONFIG.hero.titleGlow}
              </span>
            </h1>

            <p className={`text-lg md:text-2.5xl font-black italic tracking-wide font-display -mt-4 uppercase ${
              themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : themeMode === "initialD" ? "text-yellow-400 [text-shadow:1px_1px_0px_#000]" : "text-red-500"
            }`}>
              {themeMode === "initialD" ? "藤原とうふ店（自家用）× GR YARIS EXTREME COOLING" : SYSTEM_CONFIG.hero.subTitle}
            </p>

            <div className={`text-base md:text-lg text-gray-300 border-l-4 pl-4 max-w-2xl leading-relaxed italic ${
              themeMode === "cyber" ? "border-cyan-500" : themeMode === "initialD" ? "border-yellow-400" : "border-red-600"
            }`}>
              {themeMode === "initialD" ? "「不論是榛名山的山道，還是極速賽道，KTSP 與 AIRTEC 一同帶你征服極限，徹底消滅變速箱高溫！」" : SYSTEM_CONFIG.hero.quote}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 max-w-lg">
              <button 
                onClick={scrollCheckout}
                className={`group relative px-8 py-4 transition-all duration-300 skew-box cursor-pointer ${
                  themeMode === "cyber" 
                    ? "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.65)]" 
                    : themeMode === "initialD"
                    ? "bg-yellow-400 hover:bg-yellow-350 text-black border-4 border-black [box-shadow:6px_6px_0px_#000] active:translate-x-1 active:translate-y-1 active:[box-shadow:2px_2px_0px_#000] transition-all"
                    : "bg-red-600 hover:bg-red-700 shadow-[0_0_35px_rgba(220,38,38,0.5)]"
                }`}
              >
                <span className={`unskew-text text-xl md:text-2xl font-black uppercase flex items-center justify-center gap-2 whitespace-nowrap ${
                  themeMode === "cyber" ? "text-black" : themeMode === "initialD" ? "text-black font-extrabold" : "text-white"
                }`}>
                  NT$ {Math.round(activeProduct.priceGbp * activeProduct.exchangeRate).toLocaleString()} 預訂現貨 <ArrowRight className="w-5 h-5 animate-pulse" />
                </span>
              </button>
              
              <div className="flex flex-col text-left justify-center pl-2">
                <span className="text-xs text-gray-400 line-through tracking-wider font-mono">
                  原建議售價: NT$ {Math.round(activeProduct.originalPriceGbp * activeProduct.exchangeRate).toLocaleString()}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest animate-pulse flex items-center gap-1 ${
                  themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400 font-extrabold" : "text-red-500"
                }`}>
                  <Sparkles className="w-3.5 h-3.5" /> {themeMode === "initialD" ? "⚡ 道路最速五連髮夾彎專用" : SYSTEM_CONFIG.hero.badgeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Instock Banner on Hero */}
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <div className={`border-2 bg-black/95 p-6 skew-box transition-all duration-300 ${
              themeMode === "cyber" 
                ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                : "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
            }`}>
              <div className="unskew-text text-left md:text-right">
                <p className={`text-xs font-bold mb-1 tracking-wider uppercase font-mono ${
                  themeMode === "cyber" ? "text-cyan-400" : "text-red-500"
                }`}>
                  {themeMode === "cyber" ? "CYBER_WARNING // BATCH LOW:" : SYSTEM_CONFIG.hero.stockLabel}
                </p>
                <div className="text-2xl md:text-3xl font-black font-number text-white animate-pulse tracking-wider">
                  {SYSTEM_CONFIG.hero.stockUnitLabel} {activeProduct.stockLeft} {SYSTEM_CONFIG.hero.stockUnitSuffix}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAGI / Cyber Technical Alarm Emergency Warnings Section */}
      <section className={`py-24 relative border-t-4 transition-colors duration-300 overflow-hidden ${
        themeMode === "cyber" ? "border-cyber-cyan bg-[#030308] cyber-grid-bg" : "border-eva-orange bg-[#0A0A0A] hex-grid-bg"
      }`}>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none pointer-events-none font-serif font-black whitespace-nowrap select-none transition-colors ${
          themeMode === "cyber" ? "text-cyan-500 opacity-[0.03]" : "text-eva-orange opacity-[0.03]"
        }`}>
          {themeMode === "cyber" ? "THERMO_RUN" : SYSTEM_CONFIG.magiSection.watermark}
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center">
              <div className={`border-2 bg-black px-8 py-4 mb-2 transition-all duration-300 ${
                themeMode === "cyber" 
                  ? "border-cyber-cyan shadow-[0_0_25px_rgba(0,240,255,0.6)]" 
                  : "border-eva-red animate-eva-blink shadow-[0_0_25px_rgba(236,0,0,0.6)]"
              }`}>
                <h2 className={`text-4xl md:text-6xl font-serif font-black tracking-widest uppercase scale-y-[1.35] skew-x-[-5deg] ${
                  themeMode === "cyber" ? "text-cyan-400" : "text-black"
                }`}>
                  {themeMode === "cyber" ? "CYBER_THERM_OVERLOAD" : SYSTEM_CONFIG.magiSection.emergencyBadge}
                </h2>
              </div>
              <p className={`font-digital tracking-[0.4em] text-xs md:text-sm mt-4 uppercase ${
                themeMode === "cyber" ? "text-cyan-300 text-cyber-glow" : "text-eva-red"
              }`}>
                {themeMode === "cyber" ? "CORE CODE // GEARBOX CONSTANT RELY" : SYSTEM_CONFIG.magiSection.emergencyDetails}
              </p>
            </div>
            
            <div className={themeMode === "initialD" ? "tofu-shop-sticker mt-10" : "eva-quote-box mt-10"}>
              <span className={`font-mono transition-colors ${
                themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black font-bold" : "text-ff9d00"
              }`}>
                {themeMode === "cyber" ? "RUNTIME GEAR CRITICAL DEVIATION" : themeMode === "initialD" ? "KTSP PROJECT.D // 榛名山最高機密" : SYSTEM_CONFIG.magiSection.episodeTitle}
              </span>
              <p className={`leading-tight transition-all duration-300 ${
                themeMode === "initialD" ? "text-black font-black text-3xl md:text-5xl tracking-tight mt-1 uppercase italic [text-shadow:2px_2px_0px_#eab308]" : "eva-quote-text"
              } ${
                themeMode === "cyber" ? "text-cyan-100 text-shadow-none" : ""
              }`} style={themeMode === "cyber" ? { textShadow: "4px 4px 0px #ff007f" } : {}}>
                {SYSTEM_CONFIG.magiSection.quoteHeader}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Panel 1 - Overheating Limp Mode warning */}
            <div className={themeMode === "cyber" ? "cyber-panel p-1 rounded-sm" : themeMode === "initialD" ? "manga-panel p-1 rounded-sm" : "magi-box p-1"}>
              {themeMode === "cyber" && <><div className="cyber-corner-tr"/><div className="cyber-corner-bl"/></>}
              <div className={`h-full p-6 md:p-8 flex flex-col relative overflow-hidden ${
                themeMode === "initialD" ? "bg-white text-black text-left" : "bg-black/95 text-white"
              }`}>
                <div className={`flex justify-between items-start pb-4 mb-6 border-b-2 ${
                  themeMode === "cyber" ? "border-cyan-900/60" : themeMode === "initialD" ? "border-black" : "border-eva-orange"
                }`}>
                  <div>
                    <span className={`font-bold px-3 py-0.5 text-xs block w-fit mb-1 font-mono uppercase ${
                      themeMode === "cyber" ? "bg-cyan-500 text-black" : themeMode === "initialD" ? "bg-black text-white" : "bg-eva-orange text-black"
                    }`}>
                      {SYSTEM_CONFIG.magiSection.panel1.tag}
                    </span>
                    <h3 className={`text-2xl font-serif font-black scale-y-[1.25] ${
                      themeMode === "initialD" ? "text-black font-extrabold" : "text-white"
                    }`}>{SYSTEM_CONFIG.magiSection.panel1.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${
                      themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black" : "text-eva-orange"
                    }`}>{SYSTEM_CONFIG.magiSection.panel1.target}</p>
                    <p className={`text-xs font-mono font-bold animate-pulse ${
                      themeMode === "cyber" ? "text-pink-500 text-pink-glow" : themeMode === "initialD" ? "text-red-650 text-red-600 font-extrabold" : "text-eva-red"
                    }`}>{SYSTEM_CONFIG.magiSection.panel1.status}</p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center py-6">
                  <AlertTriangle className={`w-14 h-14 mb-3 animate-pulse ${
                    themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black" : "text-eva-red"
                  }`} />
                  <div className={`text-center w-full border-y-2 py-4 ${
                    themeMode === "initialD" ? "border-black bg-neutral-100" : "border-neutral-900 bg-neutral-950/80"
                  }`}>
                    <p className={`text-[10px] tracking-[0.3em] mb-1 uppercase font-mono ${
                      themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black font-extrabold" : "text-eva-orange"
                    }`}>
                      {SYSTEM_CONFIG.magiSection.panel1.statHeader}
                    </p>
                    <div className={`text-4xl md:text-5xl font-black tracking-widest text-center font-digital ${
                      themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : themeMode === "initialD" ? "text-black font-extrabold [text-shadow:2px_2px_0px_#ddd]" : "text-eva-red"
                    }`}>
                      {transmissionTemp.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t border-dashed ${
                  themeMode === "initialD" ? "border-stone-400 text-stone-800" : "border-neutral-800 text-gray-300"
                }`}>
                  <div className="text-sm md:text-base leading-relaxed font-bold" dangerouslySetInnerHTML={{ __html: SYSTEM_CONFIG.magiSection.panel1.description }}>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2 - Shifting wear symptoms */}
            <div className={themeMode === "cyber" ? "cyber-panel p-1 rounded-sm" : themeMode === "initialD" ? "manga-panel p-1 rounded-sm" : "magi-box p-1"}>
              {themeMode === "cyber" && <><div className="cyber-corner-tr"/><div className="cyber-corner-bl"/></>}
              <div className={`h-full p-6 md:p-8 flex flex-col relative overflow-hidden ${
                themeMode === "initialD" ? "bg-white text-black text-left" : "bg-black/95 text-white"
              }`}>
                <div className={`flex justify-between items-start pb-4 mb-6 border-b-2 ${
                  themeMode === "cyber" ? "border-cyan-900/60" : themeMode === "initialD" ? "border-black" : "border-eva-orange"
                }`}>
                  <div>
                    <span className={`font-bold px-3 py-0.5 text-xs block w-fit mb-1 font-mono uppercase ${
                      themeMode === "cyber" ? "bg-cyan-500 text-black" : themeMode === "initialD" ? "bg-black text-white" : "bg-eva-orange text-black"
                    }`}>
                      {SYSTEM_CONFIG.magiSection.panel2.tag}
                    </span>
                    <h3 className={`text-2xl font-serif font-black scale-y-[1.25] ${
                      themeMode === "initialD" ? "text-black font-extrabold" : "text-white"
                    }`}>{SYSTEM_CONFIG.magiSection.panel2.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-mono font-bold ${
                      themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black" : "text-eva-orange"
                    }`}>{SYSTEM_CONFIG.magiSection.panel2.target}</p>
                    <p className={`text-xs font-mono font-bold uppercase tracking-tight ${
                      themeMode === "cyber" ? "text-pink-500 text-pink-glow" : themeMode === "initialD" ? "text-red-650 text-red-650 font-extrabold" : ""
                    }`}>{themeMode === "cyber" ? "SYS_DEGRADED" : SYSTEM_CONFIG.magiSection.panel2.status}</p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center py-6">
                  <Flame className={`w-14 h-14 mb-3 animate-pulse ${
                    themeMode === "cyber" ? "text-pink-500" : themeMode === "initialD" ? "text-black animate-bounce" : "text-eva-orange"
                  }`} />
                  <div className={`text-center w-full border-y-2 py-4 ${
                    themeMode === "initialD" ? "border-black bg-neutral-100" : "border-neutral-900 bg-neutral-950/80"
                  }`}>
                    <p className={`text-[10px] tracking-[0.3em] mb-1 uppercase font-mono ${
                      themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-black font-extrabold" : "text-eva-orange"
                    }`}>
                      {SYSTEM_CONFIG.magiSection.panel2.statHeader}
                    </p>
                    <div className={`text-3xl md:text-4xl font-black tracking-widest text-center font-digital ${
                      themeMode === "cyber" ? "text-pink-500 text-pink-glow animate-pulse" : themeMode === "initialD" ? "text-red-600 font-extrabold [text-shadow:1px_1px_0px_#ccc]" : "text-[#FF3333] animate-pulse"
                    }`}>
                      STATUS: LIMP MODE
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t border-dashed ${
                  themeMode === "initialD" ? "border-stone-400 text-stone-800" : "border-neutral-800 text-gray-300"
                }`}>
                  <div className="text-sm md:text-base leading-relaxed font-bold" dangerouslySetInnerHTML={{ __html: SYSTEM_CONFIG.magiSection.panel2.description }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`mt-16 h-8 w-full max-w-5xl mx-auto border-y-2 transition-all ${
            themeMode === "cyber" ? "border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40" : themeMode === "initialD" ? "manga-stripe-yellow border-black shadow-[4px_4px_0_#000]" : "eva-stripe border-eva-red"
          }`}></div>
          
        </div>
      </section>

      {/* Block B: Product Core Features with Scroll-revealed jumping counters */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        themeMode === "cyber" ? "bg-[#020205] border-cyan-950/40" : "bg-black border-neutral-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h4 className={`tracking-[0.6em] text-xs font-bold uppercase mb-2 font-mono ${
              themeMode === "cyber" ? "text-cyan-400" : "text-red-500"
            }`}>
              {SYSTEM_CONFIG.showcase.badge}
            </h4>
            <h2 className="text-4xl md:text-6xl font-black italic text-white font-display">
              {SYSTEM_CONFIG.showcase.titleMain} <span className={themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : "text-red-650 text-glow"}>{SYSTEM_CONFIG.showcase.titleGlow}</span>
            </h2>
            <p className="text-sm font-mono text-gray-500 mt-2">
              品名 : {activeProduct.name} // 料號 : {activeProduct.partNumber}
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
            {/* Three Ultimate Technologies with Animated Counters */}
            <div className="w-full lg:w-1/2 space-y-8">
              {activeProduct.features.map((feat, idx) => {
                const getIcon = (iconName: string) => {
                   const iconClass = themeMode === "cyber" ? "text-cyan-400" : "text-red-500";
                   switch (iconName) {
                     case "ThermometerSnowflake": return <ThermometerSnowflake className={`w-8 h-8 ${iconClass}`} />;
                     case "Wrench": return <Wrench className={`w-8 h-8 ${iconClass}`} />;
                     default: return <Gauge className={`w-8 h-8 ${iconClass}`} />;
                   }
                };
                return (
                  <div key={idx} className={`flex group gap-5 items-start bg-neutral-950/60 p-5 border transition-all duration-300 ${
                    themeMode === "cyber" ? "border-neutral-900 hover:border-cyan-500/50" : "border-neutral-900 hover:border-red-600/40"
                  }`}>
                    <div className="flex flex-col items-center justify-center min-w-[90px] text-center border-r border-neutral-800 pr-4">
                      {/* Interactive Counter animation */}
                      <ScrollTriggeredCounter value={feat.targetVal} suffix={feat.targetVal === 100 ? "%" : "%"} themeMode={themeMode} />
                      <span className="text-[10px] text-gray-500 font-bold uppercase font-mono mt-1">
                        {feat.title}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getIcon(feat.icon)}
                        <h4 className="text-lg md:text-xl font-bold text-white">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Visual Specs Poster Block */}
            <div className="w-full lg:w-1/2 relative">
              <div className={`relative z-10 border-2 p-1 bg-neutral-950 transition-colors ${
                themeMode === "cyber" ? "border-cyan-850" : "border-red-900/40"
              }`}>
                <img 
                  src={IMAGES.product} 
                  onError={(e) => handleImageError(e, "product")}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto filter contrast-125 hover:scale-[1.01] transition-transform duration-500 block" 
                  alt="AIRTEC Box Core 3D outline with black powder coating"
                />
                <div className={`absolute top-2 right-2 bg-black/85 text-white font-mono text-[10px] py-1 px-2 border ${
                  themeMode === "cyber" ? "border-cyan-500/50" : "border-red-600/50"
                }`}>
                  {activeProduct.partNumber} // AIRTEC BLACK COMPACTION
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-neutral-800 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Real Track proven data and instrument charts */}
      <section className={`py-24 border-t transition-colors duration-300 relative ${
        themeMode === "cyber" ? "bg-[#040409] border-cyan-950/40" : "bg-neutral-950 border-red-955/20"
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto relative">
            <CoolingChart themeMode={themeMode} />
          </div>
        </div>
      </section>

      {/* Section D: Bolt-on and Spec Comparison Table */}
      <section className="py-24 bg-black border-t border-neutral-900 relative">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 justify-center bg-red-950/20 px-3 py-1 border border-red-900/50 mb-3 rounded-full">
              <Wrench className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">DIRECT REPLACEMENT SPECIALIST</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tight text-white uppercase font-display">
              {SYSTEM_CONFIG.specComparison.title}
            </h2>
            <p className="text-sm text-gray-400 max-w-3xl mx-auto mt-3 leading-relaxed">
              {SYSTEM_CONFIG.specComparison.boltOnLabel}
            </p>
          </div>

          <div className="border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black border-b border-neutral-800 text-[11px] md:text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                    <th className="p-4 md:p-6">{SYSTEM_CONFIG.specComparison.headers.metric}</th>
                    <th className="p-4 md:p-6 text-center">{SYSTEM_CONFIG.specComparison.headers.oe}</th>
                    <th className="p-4 md:p-6 text-center text-red-500 bg-red-955/10">{SYSTEM_CONFIG.specComparison.headers.airtec}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono text-xs md:text-sm">
                  {SYSTEM_CONFIG.specComparison.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/45 transition">
                      <td className="p-4 md:p-6 font-bold text-gray-300 font-sans">{row.name}</td>
                      <td className="p-4 md:p-6 text-center text-gray-400 line-through">{row.oe}</td>
                      <td className="p-4 md:p-6 text-center text-white bg-red-950/10 font-bold border-l border-red-950/20">
                        {row.airtec.includes("(") ? (
                          <div className="flex flex-col items-center">
                            <span className="text-glow text-red-400">{row.airtec.split("(")[0]}</span>
                            <span className="text-[10px] text-yellow-500 font-black animate-pulse">({row.airtec.split("(")[1]}</span>
                          </div>
                        ) : (
                          <span className="text-red-400">{row.airtec}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* God Hand Professional Installer Section */}
      <section className="py-24 bg-neutral-950 border-y border-red-950/40 relative overflow-hidden">
        <div className="absolute top-10 right-0 text-9xl font-black text-neutral-900 opacity-20 italic select-none hidden md:block font-display">
          GOD HAND施工
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Technician Profile Card */}
            <div className="w-full lg:w-1/3 relative flex justify-center">
              <div className="relative z-10 transform -rotate-1 hover:rotate-0 transition-transform duration-500 max-w-sm w-full">
                <img 
                  src={IMAGES.installMechanic} 
                  onError={(e) => handleImageError(e, "install")}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto grayscale contrast-125 border-4 border-white shadow-2xl block" 
                  alt="Professional installation details"
                />
                <div className="absolute bottom-4 left-4 bg-red-600 text-white px-5 py-1.5 font-black italic text-base md:text-lg shadow-lg">
                  INSTALLER: {TESTIMONIALS.mechanic.name}
                </div>
              </div>
            </div>

            {/* Quote details */}
            <div className="w-full lg:w-2/3 space-y-6">
              {SYSTEM_CONFIG.technician.title && (
                <h4 className="text-red-500 font-bold tracking-widest text-sm uppercase font-mono">
                  {SYSTEM_CONFIG.technician.title}
                </h4>
              )}
              <h2 className="text-3xl md:text-5xl font-black italic text-white leading-tight font-display">
                {SYSTEM_CONFIG.technician.boldQuote}
              </h2>
              <div className="border-l-4 border-red-600 pl-6 py-2">
                <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed font-sans">
                  {TESTIMONIALS.mechanic.quote}
                </p>
              </div>

              {/* Install Pricing Discount calculation display block */}
              <div className="grid grid-cols-2 gap-4 max-w-md pt-4 font-mono">
                <div className="bg-black p-4 text-center border border-neutral-800">
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-bold">{SYSTEM_CONFIG.technician.regularWageLabel}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-500 line-through">
                    NT$ {TESTIMONIALS.mechanic.regularPrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-950/30 p-4 text-center border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  <p className="text-red-500 text-xs mb-1 font-bold uppercase tracking-wider">{SYSTEM_CONFIG.technician.couponLabel}</p>
                  <p className="text-xl md:text-2xl font-black text-white italic animate-pulse font-sans">
                    {SYSTEM_CONFIG.technician.freeText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Order Sales Funnel Section with Cross Sells (Customers also purchased) */}
      <section id="order" className={`py-24 transition-colors duration-300 relative overflow-hidden ${
        themeMode === "cyber" ? "bg-[#030307]" : "bg-black"
      }`}>
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
          themeMode === "cyber" ? "from-cyan-400 to-fuchsia-500" : "from-red-600 to-yellow-500"
        }`}></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className={`bg-neutral-950 border p-6 md:p-12 transition-all duration-300 relative ${
            themeMode === "cyber" 
              ? "border-cyan-900/50 shadow-[0_0_60px_rgba(6,182,212,0.15)]" 
              : "border-neutral-800 shadow-[0_0_60px_rgba(220,38,38,0.15)]"
          }`}>
            
            {/* 雙管齊下 散熱配置決策器 / COOLING SOLUTION SELECTOR */}
            <div className="mb-10 text-left border-b border-neutral-900 pb-8">
              <span className={`text-[10px] font-mono font-bold tracking-[0.2em] block mb-2 uppercase ${
                themeMode === "cyber" ? "text-cyan-400" : "text-yellow-400"
              }`}>
                CHOOSE YOUR WEAPON // 極限征服高溫・雙管齊下強效方案
              </span>
              <h3 className="text-xl md:text-3xl font-black italic tracking-tight mb-6">
                夏天盡興奔馳解方：雙重控溫極致升級
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRODUCTS.map(prod => {
                  const isSelected = selectedProductId === prod.id;
                  const prodPriceTwd = Math.round(prod.priceGbp * prod.exchangeRate);
                  const prodOrigPriceTwd = Math.round(prod.originalPriceGbp * prod.exchangeRate);
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        setSelectedProductId(prod.id);
                        if (quantity > prod.stockLeft) {
                          setQuantity(prod.stockLeft);
                        }
                      }}
                      className={`flex flex-col justify-between p-4 border-2 text-left transition-all relative group cursor-pointer rounded-sm ${
                        isSelected 
                          ? themeMode === "cyber" 
                            ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                            : themeMode === "initialD"
                            ? "border-yellow-400 bg-yellow-400/10 [box-shadow:3px_3px_0px_#000]"
                            : "border-red-650 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                          : "border-neutral-850 hover:border-neutral-600 bg-neutral-900/40"
                      }`}
                    >
                      {prod.id === "airtec-twin-combo" && (
                        <div className={`absolute -top-3 left-3 px-2 py-0.5 text-[8px] font-black tracking-widest uppercase rounded-xs ${
                          themeMode === "cyber" ? "bg-cyan-500 text-black shadow-cyan-500/50 shadow-sm" : themeMode === "initialD" ? "bg-yellow-400 text-black shadow-yellow-400/50 shadow-sm" : "bg-red-650 text-white shadow-red-500/50 shadow-sm"
                        }`}>
                          HOT DEAL
                        </div>
                      )}
                      <div>
                        <span className="font-mono text-[9px] text-gray-500 block mb-1">CODE: {prod.partNumber}</span>
                        <h4 className="font-black text-sm text-white uppercase group-hover:text-yellow-400 transition-colors leading-tight mb-2">
                          {prod.id === "airtec-gearbox-oil-cooler" ? "自排變速箱油冷排" : prod.id === "hks-type-s-oil-cooler" ? "絕對領域加大油冷排" : "終極避暑雙冷套裝"}
                        </h4>
                        <p className="text-[11px] text-gray-400 leading-normal mb-4 line-clamp-3">
                          {prod.id === "airtec-gearbox-oil-cooler" 
                            ? "有效解除暴力鴨自排箱高溫自我保護。一月冬天或酷夏皆能穩定於賽道山路操駕，解決卡擋、動力降速等警訊！" 
                            : prod.id === "hks-type-s-oil-cooler" 
                            ? "頂級 HKS Type-S 加大引擎油冷，能在一月寒冬或酷夏激烈跑完數圈依然穩定溫控。內建節溫器，無損直上！" 
                            : "最強散熱救星！同時攻克『變速箱油溫』與『引擎機油溫度』雙死穴。夏天長途極限操駕也不掉一絲動力，無損原裝首選！"
                          }
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-neutral-900/60 w-full mt-2">
                        <div className="flex justify-between items-baseline gap-1">
                          <span className="text-[10px] line-through text-gray-500 font-mono font-semibold">NT$ {prodOrigPriceTwd.toLocaleString()}</span>
                          <span className={`text-sm font-black font-mono ${
                            isSelected 
                              ? themeMode === "cyber" ? "text-cyan-400" : themeMode === "initialD" ? "text-yellow-400 font-bold" : "text-red-500"
                              : "text-white"
                          }`}>
                            NT$ {prodPriceTwd.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Top Details & Urgency Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-900 pb-8 gap-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl text-neutral-500 line-through font-mono font-semibold">
                    原價 NT$ {Math.round(activeProduct.originalPriceGbp * activeProduct.exchangeRate).toLocaleString()}
                  </span>
                  <span className={`text-xs border px-2.5 py-1 font-black uppercase tracking-wider skew-box ${
                    themeMode === "cyber" ? "bg-cyan-950 text-cyan-400 border-cyan-800" : "bg-red-950 text-red-005 text-red-400 border-red-900"
                  }`}>
                    <span className="unskew-text">{activeProduct.id === "airtec-twin-combo" ? "雙管齊下尊榮特惠" : SYSTEM_CONFIG.checkout.badgeLabel}</span>
                  </span>
                </div>
                
                <h2 className={`text-5xl md:text-7xl font-black italic leading-none font-mono ${
                  themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : "text-white text-glow"
                }`}>
                  NT$ {Math.round(activeProduct.priceGbp * activeProduct.exchangeRate).toLocaleString()}
                </h2>
                
                {/* Developer TWD Rate API indicator */}
                <h3 className={`text-base md:text-lg font-bold tracking-[0.2em] uppercase font-mono ${
                  themeMode === "cyber" ? "text-cyan-455" : "text-red-500"
                }`}>
                  {activeProduct.subName}
                </h3>
                <p className="text-xs text-gray-500 font-mono italic text-left">
                  {"// 英國原裝空運直達台灣 (包含原廠雙流導罩散熱套件)"}
                </p>
              </div>
              
              <div className={`px-5 py-2.5 font-black italic animate-pulse shadow-md text-sm md:text-base text-left rounded-sm tracking-tight ${
                themeMode === "cyber" ? "bg-cyan-500 text-black shadow-cyan-400/30" : "bg-red-645 bg-red-600 text-white"
              }`}>
                {SYSTEM_CONFIG.hero.stockUnitLabel} {activeProduct.stockLeft} {SYSTEM_CONFIG.hero.stockUnitSuffix}
              </div>
            </div>

            {/* Dynamic Stock Warning scarcity slider (Functional requirement) */}
            <div className={`border-2 p-4 mb-8 ${
              themeMode === "cyber" ? "bg-cyan-950/10 border-cyan-900/60" : "bg-red-950/20 border-red-900/60"
            }`}>
              <div className={`flex justify-between items-center text-xs font-mono font-bold mb-2 ${
                themeMode === "cyber" ? "text-cyan-400" : "text-red-500"
              }`}>
                <span className="animate-pulse">● {SYSTEM_CONFIG.checkout.stockUrgencyPrefix.split("。")[0]}</span>
                <span>剩餘組數 : {activeProduct.stockLeft} / 10組</span>
              </div>
              <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className={`h-full animate-pulse ${
                    themeMode === "cyber" ? "bg-gradient-to-r from-cyan-600 to-cyan-400" : "bg-gradient-to-r from-red-700 to-red-500"
                  }`}
                  style={{ width: `${(activeProduct.stockLeft / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-300 mt-2 font-sans leading-tight">
                {SYSTEM_CONFIG.checkout.stockUrgencyPrefix.split("。")[1]}
              </p>
            </div>

            {/* Included Items Details */}
            <div className="space-y-4 mb-8 text-left">
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wide">{SYSTEM_CONFIG.checkout.packageItemsHeader}</p>
              <ul className="space-y-3 font-sans">
                {/* Row 1: Product Kit Row */}
                {activeProduct.id === "hks-type-s-oil-cooler" ? (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>HKS Gen2 Oil Cooler Kit (Type-S)</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                ) : activeProduct.id === "airtec-gearbox-oil-cooler" ? (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>AIRTEC Gen2 Gearbox Oil Cooler Kit (自排專屬)</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                ) : (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>AIRTEC + HKS Twin-Cooling Combo Kit</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                )}

                {/* Row 2: Air Cargo Row */}
                {activeProduct.id === "hks-type-s-oil-cooler" ? (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>日本航空空運直達 (Japan Air Cargo)</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                ) : activeProduct.id === "airtec-gearbox-oil-cooler" ? (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>英國航空空運直達 (UK Air Cargo)</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                ) : (
                  <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900 pb-2.5">
                    <span className="font-bold text-gray-200 flex items-center gap-2.5">
                      <Plane className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                      <span>英日航空空運直達 (UK & Japan Air Cargo)</span>
                    </span>
                    <span className="text-green-500 font-extrabold italic font-mono text-xs tracking-wider">READY</span>
                  </li>
                )}

                {/* Row 3: God hand professional install row */}
                <li className="flex items-center justify-between text-sm md:text-base bg-red-950/20 p-3 -mx-3 rounded border border-red-900/30">
                  <span className="font-bold text-white flex items-center gap-2.5">
                    <Wrench className="w-4 h-4 text-red-600 flex-shrink-0" /> 
                    <span>巨匠阿咪無損手工安裝 (God Hand Install)</span>
                  </span>
                  <span className="text-yellow-500 font-extrabold italic font-mono text-xs tracking-wider">FREE UPGRADE</span>
                </li>
              </ul>
            </div>

            {/* Interactive Quantity Selection Module */}
            <div className="bg-neutral-900/60 p-4 rounded border border-neutral-800 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left w-full sm:w-auto">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                    <ShoppingCart className="w-4 h-4 text-red-500" /> {SYSTEM_CONFIG.checkout.quantitySelectHeader}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => changeQty(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-12 text-center text-xl font-black text-white font-mono">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => changeQty(1)}
                    disabled={quantity >= activeProduct.stockLeft}
                    className="w-10 h-10 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inline Payment Installment Selection / 分期付款選擇 */}
            <div className="bg-neutral-900/40 p-5 rounded border border-neutral-800 mb-6 text-left">
              <p className="text-xs text-gray-400 uppercase font-black mb-3 tracking-widest font-mono flex items-center gap-1.5">
                <CreditCard className={`w-3.5 h-3.5 ${themeMode === "cyber" ? "text-cyan-400" : "text-red-500"}`} /> 選擇付款與分期方式 (Choose Payment Plan)
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {INSTALLMENT_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const activeBorder = themeMode === "cyber" 
                    ? "border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.35)] bg-cyan-950/25" 
                    : themeMode === "initialD"
                    ? "border-yellow-400 bg-yellow-450/10 [box-shadow:3px_3px_0px_#000]"
                    : "border-red-650 bg-red-950/15";
                    
                  // Calculate dynamic per-month price for each card
                  const planFeeTwd = Math.round(itemTotalTwd * plan.rate);
                  const planTotalTwd = itemTotalTwd + planFeeTwd;
                  const monthlyTwd = Math.round(planTotalTwd / plan.months);

                  return (
                    <label key={`inline-${plan.id}`} className="cursor-pointer block">
                      <input 
                        type="radio" 
                        name="payment_plan_inline" 
                        value={plan.id} 
                        className="sr-only" 
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                      />
                      <div className={`p-4 border rounded-sm transition duration-200 h-full flex flex-col justify-between hover:bg-neutral-900 ${
                        isSelected ? activeBorder : "border-neutral-800 bg-black/40 hover:border-neutral-700"
                      }`}>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-black text-sm ${isSelected ? (themeMode === "cyber" ? "text-cyan-300" : themeMode === "initialD" ? "text-yellow-400" : "text-white") : "text-white"}`}>
                              {plan.months === 1 ? "一次付清" : `分期 ${plan.months} 期`}
                            </span>
                            {plan.rate > 0 ? (
                              <span className={`text-[10px] border px-1.5 py-0.5 font-bold font-mono ${
                                themeMode === "cyber" ? "bg-cyan-950 text-cyan-400 border-cyan-800" : "bg-red-950 text-red-400 border-red-900"
                              }`}>
                                +{(plan.rate * 100).toFixed(1)}% {SYSTEM_CONFIG.checkout.processingFeeSuffix}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-green-950 text-green-400 border border-green-950 px-1.5 py-0.5 font-bold font-mono">
                                {SYSTEM_CONFIG.checkout.freeFeeLabel}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 leading-normal">
                            {plan.description}
                          </p>
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-neutral-900/40 flex justify-between items-baseline">
                          <span className="text-[9px] text-neutral-500 font-mono">每期應繳:</span>
                          <span className={`text-sm font-black font-mono ${isSelected ? (themeMode === "cyber" ? "text-cyan-400" : "text-yellow-400") : "text-gray-300"}`}>
                            NT$ {monthlyTwd.toLocaleString()} <span className="text-[9px] font-normal text-gray-400">/{plan.months}{SYSTEM_CONFIG.checkout.perInstallmentSuffix}</span>
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Installment Pricing Summary Box */}
              <div className="bg-black p-4 border border-neutral-850 rounded-sm space-y-2 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>選購配件與商品小計</span>
                  <span>NT$ {itemTotalTwd.toLocaleString()} 元</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{SYSTEM_CONFIG.checkout.processingFeeLabel}</span>
                  <span className={feeTwd > 0 ? (themeMode === "cyber" ? "text-cyan-400" : "text-red-400") : "text-green-400"}>
                    {feeTwd > 0 ? `+NT$ ${feeTwd.toLocaleString()} 元` : "NT$ 0 (免手續費)"}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-neutral-900 pt-3 mt-3">
                  <span className="font-bold text-white text-sm">應付總金額</span>
                  <span className={`text-xl md:text-2xl font-black ${themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : "text-red-500"}`}>
                    NT$ {grandTotalTwd.toLocaleString()} 元
                  </span>
                </div>
                {getSelectedPlan().months > 1 && (
                  <div className="text-right text-[11px] text-yellow-500 border-t border-neutral-900/50 pt-2 mt-1 font-bold">
                    已選分期: <span className="text-sm font-black underline">{getSelectedPlan().months} 期</span> | 每月支付金額: <span className="text-base text-yellow-400 font-black font-mono">NT$ {monthlyPaymentTwd.toLocaleString()} 元</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Checkout Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`w-full font-black text-2xl md:text-3xl py-5 uppercase italic tracking-wider skew-box transition-all duration-300 cursor-pointer text-center block border-0 ${
                themeMode === "cyber" 
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)]" 
                  : "bg-red-650 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.8)]"
              }`}
            >
              <span className="unskew-text flex items-center justify-center gap-2">
                {themeMode === "cyber" ? "立即購入此配置" : SYSTEM_CONFIG.checkout.checkoutButtonText} <Flag className={`w-6 h-6 animate-pulse ${themeMode === "cyber" ? "text-black" : "text-white"}`} />
              </span>
            </button>
          </div>
        </div>
      </section>

      <footer className={`transition-colors duration-300 py-20 text-center border-t ${
        themeMode === "cyber" ? "bg-[#020205] border-cyan-950/40" : "bg-neutral-950 border-red-950/40"
      }`}>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-6 tracking-wide mario-retro-title select-none flex justify-center items-center gap-1.5 flex-wrap">
          {(() => {
            const characters = "KTSP 改車找阿咪".split("");
            const marioColors = [
              "text-red-500 hover:text-red-400",    // K
              "text-yellow-400 hover:text-yellow-300", // T
              "text-blue-500 hover:text-blue-400",   // S
              "text-green-500 hover:text-green-400",  // P
              "text-neutral-500", // space
              "text-red-500 hover:text-red-400",    // 改
              "text-yellow-400 hover:text-yellow-300", // 車
              "text-green-500 hover:text-green-400",  // 找
              "text-blue-500 hover:text-blue-400",   // 阿
              "text-red-500 hover:text-red-400"     // 咪
            ];
            return characters.map((char, index) => {
              if (char === " ") {
                return <span key={index} className="w-2 md:w-3"></span>;
              }
              const colorClass = marioColors[index % marioColors.length];
              const delay = `${(index * 0.1).toFixed(1)}s`;
              return (
                <span 
                  key={index}
                  className={`mario-char-bounce ${colorClass} hover:scale-125 transition-transform duration-100 cursor-pointer`}
                  style={{ animationDelay: delay }}
                >
                  {char}
                </span>
              );
            });
          })()}
        </h2>
        <p className="text-neutral-500 tracking-widest text-xs uppercase font-mono px-4">
          {SYSTEM_CONFIG.footer.brandSlogan}
        </p>

        <p className="text-[10px] text-neutral-600 mt-6 font-mono max-w-xl mx-auto px-4 leading-relaxed">
          {SYSTEM_CONFIG.footer.copyright}
        </p>
      </footer>

      {/* Payment Configuration Modal dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted backdrop */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className={`inline-block relative text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-xl w-full border z-10 rounded-sm bg-neutral-950 ${
            themeMode === "cyber" ? "border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.3)]" : "border-neutral-800"
          }`}>
            {/* Header / HUD panel decorator */}
            <div className="bg-black p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                <Wrench className={`w-5 h-5 ${themeMode === "cyber" ? "text-cyan-400" : "text-red-600"}`} /> {SYSTEM_CONFIG.checkout.modalTitle}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Product item breakdown info */}
                           {/* Installment choices list */}
              <p className="text-left text-xs text-gray-400 uppercase font-bold mb-3 tracking-widest font-mono flex items-center gap-1.5">
                <CreditCard className={`w-3.5 h-3.5 ${themeMode === "cyber" ? "text-cyan-400" : "text-eva-orange"}`} /> {SYSTEM_CONFIG.checkout.planSelectHeader}
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
                {INSTALLMENT_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const activeBorder = themeMode === "cyber" 
                    ? "border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.35)] bg-cyan-950/10" 
                    : "border-red-650 bg-red-955/10 bg-opacity-10";
                  return (
                    <label key={plan.id} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="payment_plan" 
                        value={plan.id} 
                        className="sr-only plan-radio" 
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                      />
                      <div className={`p-4 border rounded-sm transition duration-250 text-left ${
                        isSelected ? activeBorder : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-750"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm md:text-base ${isSelected && themeMode === "cyber" ? "text-cyan-300" : "text-white"}`}>
                            {plan.label}
                          </span>
                          {plan.rate > 0 ? (
                            <span className={`text-xs border px-2 py-0.5 font-bold font-mono ${
                              themeMode === "cyber" ? "bg-cyan-950 text-cyan-400 border-cyan-800" : "bg-red-950 text-red-400 border-red-900"
                            }`}>
                              {(plan.rate * 100).toFixed(1)}% {SYSTEM_CONFIG.checkout.processingFeeSuffix}
                            </span>
                          ) : (
                            <span className="text-xs bg-green-950 text-green-400 border border-green-950 px-2 py-0.5 font-bold font-mono">
                              {SYSTEM_CONFIG.checkout.freeFeeLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 font-sans">
                          {plan.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Interactive Calculation results area */}
              <div className="border-t border-neutral-800 pt-4 bg-black p-5 -mx-6 -mb-6 text-left">
                <div className="flex justify-between text-xs text-gray-450 mb-2 font-mono">
                  <span>Product Subtotal</span>
                  <span>NT$ {itemTotalTwd.toLocaleString()} 元</span>
                </div>
                <div className="flex justify-between text-xs text-gray-455 mb-4 font-mono">
                  <span>{SYSTEM_CONFIG.checkout.processingFeeLabel}</span>
                  <span className={feeTwd > 0 ? "text-cyan-400" : "text-green-400"}>
                    {feeTwd > 0 ? `+NT$ ${feeTwd.toLocaleString()} 元` : "NT$ 0"}
                  </span>
                </div>

                <div className="flex justify-between items-end mb-4">
                  <span className="font-bold italic text-base md:text-lg text-white">{SYSTEM_CONFIG.checkout.totalPayableLabel}</span>
                  <div className="text-right">
                    <span className={`text-3xl md:text-4xl font-black tracking-wide font-mono block ${
                      themeMode === "cyber" ? "text-cyan-400 text-cyber-glow" : "text-red-500 text-glow"
                    }`}>
                      NT$ {grandTotalTwd.toLocaleString()} 元
                    </span>
                  </div>
                </div>

                {getSelectedPlan().months > 1 && (
                  <div className="mb-4 text-right bg-neutral-950/85 p-3 border border-neutral-905 rounded-sm">
                    <p className="text-gray-300 text-sm">
                      分期詳情: <span className="text-xl md:text-2xl font-black text-yellow-500 font-mono">NT$ {monthlyPaymentTwd.toLocaleString()}</span>{" / "}{getSelectedPlan().months} {SYSTEM_CONFIG.checkout.perInstallmentSuffix}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Action */}
              <button 
                  onClick={handleCheckoutRedirect}
                  className={`w-full font-black py-4 uppercase tracking-widest skew-box transition-all cursor-pointer text-center block border-0 ${
                    themeMode === "cyber" 
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                      : "bg-red-650 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  }`}
                >
                  <span className="unskew-text text-base md:text-lg flex items-center justify-center gap-1.5 font-bold">
                    {themeMode === "cyber" ? "確認送出並開啟安全結帳" : SYSTEM_CONFIG.checkout.confirmButtonText} <CheckCircle2 className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
