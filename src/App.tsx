import { useState, useEffect, SyntheticEvent } from "react";
import { 
  Gauge, 
  ThermometerSnowflake, 
  ShieldAlert, 
  Wrench, 
  Flame, 
  Flag, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  ArrowRight,
  Info,
  Truck,
  Gift,
  Plus,
  Minus,
  X,
  CreditCard,
  Sparkles
} from "lucide-react";
import { PRODUCT_DATA, INSTALLMENT_PLANS, TESTIMONIALS, IMAGES, SYSTEM_CONFIG } from "./data";
import CoolingChart from "./components/CoolingChart";

export default function App() {
  // States
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [beiyiTemp, setBeiyiTemp] = useState<number>(128.5);
  const [circuitTime, setCircuitTime] = useState<string>("04:43:65");
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  // Fallback image helper
  const handleImageError = (e: SyntheticEvent<HTMLImageElement>, type: string) => {
    const img = e.currentTarget;
    if (img.dataset.tried === "true") return;
    img.dataset.tried = "true";
    if (type === "hks_demo") {
      img.src = IMAGES.fallbackHeroBg;
    } else if (type === "product") {
      img.src = IMAGES.fallbackProduct;
    } else if (type === "data") {
      img.src = IMAGES.fallbackDataCurve;
    } else if (type === "install") {
      img.src = IMAGES.fallbackInstallMechanic;
    } else {
      img.src = "https://placehold.co/800x450/111/fff?text=PROJECT+GR+STAGE+COOLER";
    }
  };

  // Real-time telemetry emulation
  useEffect(() => {
    const tempInterval = setInterval(() => {
      // Oscillate Beiyi Oil Temp between 126.8°C and 129.7°C
      const delta = (Math.random() - 0.5) * 0.4;
      setBeiyiTemp(prev => {
        const next = prev + delta;
        return next < 126.8 ? 126.8 : next > 129.7 ? 129.7 : next;
      });
    }, 1200);

    const circuitInterval = setInterval(() => {
      // Stopwatch loop microsecond oscillation
      const m = 4;
      const s = Math.floor(35 + Math.random() * 20);
      const ms = Math.floor(Math.random() * 100);
      setCircuitTime(`0${m}:${s < 10 ? '0' + s : s}:${ms < 10 ? '0' + ms : ms}`);
    }, 100);

    // Random order notification simulation (boost urgency safely)
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

    return () => {
      clearInterval(tempInterval);
      clearInterval(circuitInterval);
      clearTimeout(notificationTimeout);
    };
  }, []);

  // Increase/Decrease quantity with safety
  const changeQty = (val: number) => {
    const res = quantity + val;
    if (res >= 1 && res <= PRODUCT_DATA.stockLeft) {
      setQuantity(res);
    }
  };

  // Calculation for plans
  const getSelectedPlan = () => {
    return INSTALLMENT_PLANS.find(p => p.id === selectedPlanId) || INSTALLMENT_PLANS[0];
  };

  const calculateTotal = () => {
    const plan = getSelectedPlan();
    const itemTotal = PRODUCT_DATA.price * quantity;
    const fee = Math.round(itemTotal * plan.rate);
    const grandTotal = itemTotal + fee;
    const monthlyPayment = Math.round(grandTotal / plan.months);

    return {
      itemTotal,
      fee,
      grandTotal,
      monthlyPayment
    };
  };

  const { fee, grandTotal, monthlyPayment } = calculateTotal();

  const handleCheckoutRedirect = () => {
    const plan = getSelectedPlan();
    if (plan.payLink) {
      // Open PayUni billing gateway configured by merchant
      window.location.href = plan.payLink;
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {/* HUD Scanline visual overlay effect */}
      <div className="scanlines" />

      {/* Social Urgency Notification Pop */}
      {orderNotification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce max-w-sm bg-neutral-950 border-2 border-red-600 p-4 shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center gap-3">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <p className="text-sm font-bold text-gray-200">{orderNotification}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-red-900/40 bg-black/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-8 bg-red-600 skew-box"></div>
            <span className="text-base md:text-xl font-black italic tracking-tighter text-white">
              {SYSTEM_CONFIG.nav.brandLogo} <span className="text-red-600">{SYSTEM_CONFIG.nav.brandSub}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline-flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {SYSTEM_CONFIG.nav.statusText}
            </span>
            <a 
              href="#order" 
              className="skew-box bg-white text-black hover:bg-red-600 hover:text-white px-4 py-1.5 font-bold transition-all duration-300 flex items-center shadow-lg hover:shadow-red-600/40"
            >
              <span className="unskew-text uppercase text-xs md:text-sm tracking-widest flex items-center gap-1">
                <Flag className="w-4 h-4" /> {SYSTEM_CONFIG.nav.ctaText}
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.heroBg} 
            onError={(e) => handleImageError(e, "hks_demo")}
            className="w-full h-full object-cover opacity-40 grayscale mix-blend-luminosity scale-105" 
            alt="GR Yaris Gen2 HKS Demo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90"></div>
          {/* Cyber grid system */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-12 gap-12 items-center w-full">
          <div className="md:col-span-8 text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 border border-red-600 px-4 py-1 bg-red-950/40 skew-box animate-pulse">
              <span className="text-red-400 text-xs md:text-sm font-bold tracking-widest uppercase unskew-text">
                {SYSTEM_CONFIG.hero.badge}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black leading-none italic drop-shadow-2xl font-display">
              {SYSTEM_CONFIG.hero.titleMain}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-glow">
                {SYSTEM_CONFIG.hero.titleGlow}
              </span>
            </h1>

            <div className="text-base md:text-lg text-gray-300 border-l-4 border-red-600 pl-4 max-w-xl leading-relaxed italic">
              {SYSTEM_CONFIG.hero.quote}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-md">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 transition-all duration-300 skew-box shadow-[0_0_30px_rgba(220,38,38,0.4)] cursor-pointer"
              >
                <span className="unskew-text text-xl md:text-2xl font-black uppercase flex items-center justify-center gap-2 whitespace-nowrap">
                  NT$ {PRODUCT_DATA.price.toLocaleString()} {SYSTEM_CONFIG.hero.ctaPriceLabel} <ArrowRight className="w-5 h-5 animate-pulse" />
                </span>
              </button>
              
              <div className="flex flex-col text-left justify-center pl-2">
                <span className="text-xs text-gray-400 line-through tracking-wider font-mono">
                  {SYSTEM_CONFIG.hero.originalPriceLabel}: NT$ {PRODUCT_DATA.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-red-500 font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> {SYSTEM_CONFIG.hero.badgeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Instock Banner on Hero */}
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <div className="border-2 border-red-500 bg-black/90 p-5 skew-box shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <div className="unskew-text text-left md:text-right">
                <p className="text-xs text-red-500 font-bold mb-1 tracking-wider uppercase font-mono">
                  {SYSTEM_CONFIG.hero.stockLabel}
                </p>
                <div className="text-2xl md:text-3xl font-black font-number text-white animate-pulse tracking-wider">
                  {SYSTEM_CONFIG.hero.stockUnitLabel} {PRODUCT_DATA.stockLeft} {SYSTEM_CONFIG.hero.stockUnitSuffix}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAGI Technical Alarm Emergency Warnings Section */}
      <section className="py-20 bg-black relative border-t-4 border-eva-orange hex-grid-bg overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[18vw] leading-none text-eva-orange opacity-[0.03] pointer-events-none font-serif font-black whitespace-nowrap select-none">
          {SYSTEM_CONFIG.magiSection.watermark}
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center">
              <div className="border-2 border-eva-red bg-black px-8 py-4 mb-2 animate-eva-blink shadow-[0_0_20px_rgba(236,0,0,0.5)]">
                <h2 className="text-4xl md:text-6xl font-serif font-black text-black tracking-widest uppercase scale-y-[1.35] skew-x-[-5deg]">
                  {SYSTEM_CONFIG.magiSection.emergencyBadge}
                </h2>
              </div>
              <p className="text-eva-red font-digital tracking-[0.4em] text-xs md:text-sm mt-4 uppercase">
                {SYSTEM_CONFIG.magiSection.emergencyDetails}
              </p>
            </div>
            
            <div className="eva-quote-box mt-10">
              <span className="eva-quote-bg-text">{SYSTEM_CONFIG.magiSection.episodeTitle}</span>
              <p className="eva-quote-text">{SYSTEM_CONFIG.magiSection.quoteHeader}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* MAGI-01 Circuit */}
            <div className="magi-box p-1">
              <div className="h-full bg-black/95 p-6 md:p-8 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start border-b-2 border-eva-orange pb-4 mb-6">
                  <div>
                    <span className="bg-eva-orange text-black font-bold px-3 py-0.5 text-xs block w-fit mb-1 font-mono">
                      {SYSTEM_CONFIG.magiSection.panel1.tag}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-white scale-y-[1.25]">{SYSTEM_CONFIG.magiSection.panel1.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-eva-orange font-mono">{SYSTEM_CONFIG.magiSection.panel1.target}</p>
                    <p className="text-xs text-eva-red font-mono font-bold animate-pulse">{SYSTEM_CONFIG.magiSection.panel1.status}</p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center py-6">
                  <AlertTriangle className="w-14 h-14 text-eva-red mb-3 animate-pulse" />
                  <div className="text-center w-full border-y-2 border-neutral-900 py-4 bg-neutral-950/80">
                    <p className="text-[10px] text-eva-orange tracking-[0.3em] mb-1 uppercase font-mono">
                      {SYSTEM_CONFIG.magiSection.panel1.statHeader}
                    </p>
                    <div className="text-4xl md:text-5xl font-black tracking-widest text-eva-red text-center font-digital">
                      {circuitTime}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-eva-orange/40">
                  <div className="text-gray-300 text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: SYSTEM_CONFIG.magiSection.panel1.description }}>
                  </div>
                </div>
              </div>
            </div>

            {/* MAGI-02 Touge */}
            <div className="magi-box p-1">
              <div className="h-full bg-black/95 p-6 md:p-8 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start border-b-2 border-eva-orange pb-4 mb-6">
                  <div>
                    <span className="bg-eva-orange text-black font-bold px-3 py-0.5 text-xs block w-fit mb-1 font-mono">
                      {SYSTEM_CONFIG.magiSection.panel2.tag}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-white scale-y-[1.25]">{SYSTEM_CONFIG.magiSection.panel2.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-eva-orange font-mono">{SYSTEM_CONFIG.magiSection.panel2.target}</p>
                    <p className="text-xs text-eva-orange font-mono font-bold">{SYSTEM_CONFIG.magiSection.panel2.status}</p>
                  </div>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center py-6">
                  <Flame className="w-14 h-14 text-eva-orange mb-3 animate-pulse" />
                  <div className="text-center w-full border-y-2 border-neutral-900 py-4 bg-neutral-950/80">
                    <p className="text-[10px] text-eva-orange tracking-[0.3em] mb-1 uppercase font-mono">
                      {SYSTEM_CONFIG.magiSection.panel2.statHeader}
                    </p>
                    <div className="text-4xl md:text-5xl font-black tracking-widest text-eva-orange text-center font-digital">
                      {beiyiTemp.toFixed(1)}°C
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-eva-orange/40">
                  <div className="text-gray-300 text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: SYSTEM_CONFIG.magiSection.panel2.description }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 h-8 eva-stripe w-full max-w-5xl mx-auto border-y-2 border-eva-red"></div>
        </div>
      </section>

      {/* Main Product Showcase Block - HKS Technical Specs */}
      <section className="py-24 bg-black border-t border-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-red-600 tracking-[0.6em] text-xs font-bold uppercase mb-2 font-mono">
              {SYSTEM_CONFIG.showcase.badge}
            </h4>
            <h2 className="text-4xl md:text-6xl font-black italic text-white font-display">
              {SYSTEM_CONFIG.showcase.titleMain} <span className="text-red-600 text-glow">{SYSTEM_CONFIG.showcase.titleGlow}</span>
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
            {/* Specs Points */}
            <div className="w-full lg:w-1/2 space-y-8">
              {PRODUCT_DATA.features.map((feat, idx) => {
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case "ThermometerSnowflake": return <ThermometerSnowflake className="w-8 h-8 text-red-500" />;
                    case "ShieldAlert": return <ShieldAlert className="w-8 h-8 text-red-500" />;
                    case "Wrench": return <Wrench className="w-8 h-8 text-red-500" />;
                    default: return <Gauge className="w-8 h-8 text-red-500" />;
                  }
                };
                return (
                  <div key={idx} className="flex group gap-5 items-start">
                    <span className="text-4xl md:text-5xl font-black text-neutral-800 italic group-hover:text-red-600 transition-colors duration-500 font-display">
                      {`0${idx + 1}`}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getIcon(feat.icon)}
                        <h4 className="text-xl md:text-2xl font-bold italic text-white">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Visual Specs Poster block */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10 border-2 border-red-900/60 p-1 bg-neutral-950">
                <img 
                  src={IMAGES.product} 
                  onError={(e) => handleImageError(e, "product")}
                  className="w-full h-auto filter contrast-125 hover:scale-[1.01] transition-transform duration-500 block" 
                  alt="Product Highlight"
                />
                <div className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[10px] py-1 px-2 border border-red-600/50">
                  {SYSTEM_CONFIG.nav.brandLogo} // TUNING SYSTEM
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-neutral-800 z-0"></div>
            </div>
          </div>

          {/* Sub Technical Graph Block */}
          <div className="max-w-4xl mx-auto relative mt-16">
            <CoolingChart />
          </div>
        </div>
      </section>

      {/* God Hand Professional Installer Section */}
      <section className="py-24 bg-neutral-950 border-y border-red-950/40 relative overflow-hidden">
        <div className="absolute top-10 right-0 text-9xl font-black text-neutral-900 opacity-20 italic select-none hidden md:block">
          GOD HAND
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Technician Profile Card */}
            <div className="w-full lg:w-1/3 relative flex justify-center">
              <div className="relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm w-full">
                <img 
                  src={IMAGES.installMechanic} 
                  onError={(e) => handleImageError(e, "install")}
                  className="w-full h-auto grayscale contrast-125 border-4 border-white shadow-2xl block" 
                  alt="Master Technician Professional Work"
                />
                <div className="absolute bottom-4 left-4 bg-red-600 text-white px-5 py-1.5 font-black italic text-lg md:text-xl shadow-lg">
                  GOD HAND: {TESTIMONIALS.mechanic.name}
                </div>
              </div>
            </div>

            {/* Quote details */}
            <div className="w-full lg:w-2/3 space-y-6">
              <h4 className="text-red-500 font-bold tracking-widest text-sm uppercase font-mono">
                {SYSTEM_CONFIG.technician.title}
              </h4>
              <h2 className="text-3xl md:text-5xl font-black italic text-white leading-tight">
                {SYSTEM_CONFIG.technician.boldQuote}
              </h2>
              <div className="border-l-4 border-red-600 pl-6 py-2">
                <p className="text-lg md:text-xl text-gray-300 italic leading-relaxed">
                  {TESTIMONIALS.mechanic.quote}
                </p>
              </div>

              {/* Install Pricing Discount calculation display block */}
              <div className="grid grid-cols-2 gap-4 max-w-md pt-4">
                <div className="bg-black p-4 text-center border border-neutral-800">
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-mono">{SYSTEM_CONFIG.technician.regularWageLabel}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-500 line-through font-number">
                    NT$ {TESTIMONIALS.mechanic.regularPrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-950/30 p-4 text-center border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  <p className="text-red-500 text-xs mb-1 font-bold uppercase tracking-wider font-mono">{SYSTEM_CONFIG.technician.couponLabel}</p>
                  <p className="text-2xl md:text-3xl font-black text-white italic font-number animate-pulse">
                    {SYSTEM_CONFIG.technician.freeText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Order Sales Funnel Section */}
      <section id="order" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 eva-stripe-orange"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-neutral-950 border border-neutral-800 p-6 md:p-12 shadow-[0_0_60px_rgba(220,38,38,0.15)] relative">
            
            {/* Top Details & Urgency Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-900 pb-8 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg md:text-xl text-neutral-500 line-through font-mono">
                    NT$ {PRODUCT_DATA.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-950 text-red-400 border border-red-900 px-2.5 py-1 font-black uppercase tracking-wider skew-box">
                    <span className="unskew-text">{SYSTEM_CONFIG.checkout.badgeLabel}</span>
                  </span>
                </div>
                
                <h2 className="text-5xl md:text-7xl font-black italic text-white leading-none font-number text-glow">
                  NT$ {PRODUCT_DATA.price.toLocaleString()}
                </h2>
                <h3 className="text-base md:text-lg text-red-500 font-bold tracking-[0.3em] uppercase font-mono">
                  {PRODUCT_DATA.subName}
                </h3>
              </div>
              
              <div className="bg-red-600 text-white px-5 py-2 py-2.5 font-black italic animate-bounce shadow-md text-sm md:text-base">
                {SYSTEM_CONFIG.checkout.stockUrgencyPrefix} {PRODUCT_DATA.stockLeft} {SYSTEM_CONFIG.checkout.stockUrgencySuffix}
              </div>
            </div>

            {/* Included Items Details */}
            <div className="space-y-4 mb-8">
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-wide">{SYSTEM_CONFIG.checkout.packageItemsHeader}</p>
              <ul className="space-y-3">
                {PRODUCT_DATA.specs.map((spec, i) => (
                  <li key={i} className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900/50 pb-2">
                    <span className="font-bold text-gray-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" /> {spec}
                    </span>
                    <span className="text-green-500 font-black italic font-mono text-xs">{SYSTEM_CONFIG.checkout.readyLabel}</span>
                  </li>
                ))}
                
                <li className="flex items-center justify-between text-sm md:text-base border-b border-neutral-900/50 pb-2">
                  <span className="font-bold text-gray-300 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-red-600 flex-shrink-0" /> {SYSTEM_CONFIG.checkout.airCargoText}
                  </span>
                  <span className="text-green-500 font-black italic font-mono text-xs">{SYSTEM_CONFIG.checkout.includedLabel}</span>
                </li>

                <li className="flex items-center justify-between text-sm md:text-base bg-red-950/20 p-3 -mx-3 rounded">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-500 flex-shrink-0" /> {SYSTEM_CONFIG.checkout.freeInstallBanner}
                  </span>
                  <span className="text-yellow-400 font-black italic font-mono text-xs">{SYSTEM_CONFIG.checkout.freeUpgradeLabel}</span>
                </li>
              </ul>
            </div>

            {/* Interactive Quantity Selection Module (Added to make checkout complete and outstanding!) */}
            <div className="bg-neutral-900/70 p-4 rounded border border-neutral-800/80 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-red-500" /> {SYSTEM_CONFIG.checkout.quantitySelectHeader}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => changeQty(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center hover:bg-neutral-850 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="w-12 text-center text-2xl font-black font-number text-white font-mono">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => changeQty(1)}
                    disabled={quantity >= PRODUCT_DATA.stockLeft}
                    className="w-10 h-10 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center hover:bg-neutral-850 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Checkout Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-red-600 hover:bg-red-500 font-black text-2xl md:text-3xl py-5 uppercase italic tracking-wider skew-box shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] transition-all duration-300 cursor-pointer text-center block"
            >
              <span className="unskew-text flex items-center justify-center gap-2">
                {SYSTEM_CONFIG.checkout.checkoutButtonText} <Flag className="w-6 h-6 text-white animate-pulse" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Direct Professional Footer */}
      <footer className="bg-neutral-950 border-t border-red-950/40 py-12 text-center">
        <h2 className="text-2xl font-black italic text-white mb-2 tracking-widest font-display">
          {SYSTEM_CONFIG.footer.brandName}
        </h2>
        <p className="text-neutral-500 tracking-widest text-xs uppercase font-mono">
          {SYSTEM_CONFIG.footer.brandSlogan}
        </p>
        <p className="text-[10px] text-neutral-600 mt-4 font-mono">
          {SYSTEM_CONFIG.footer.copyright}
        </p>
      </footer>

      {/* Payment Configuration Modal dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Frosted backdrop */}
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="inline-block relative bg-neutral-950 text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg w-full border border-neutral-800 z-10">
            {/* Header / HUD panel decorator */}
            <div className="bg-black p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-red-600" /> {SYSTEM_CONFIG.checkout.modalTitle}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Product item breakdown info */}
              <div className="bg-black border border-neutral-800 p-4 mb-6 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-base">{PRODUCT_DATA.name}</h4>
                  <p className="text-gray-500 text-xs font-mono">
                    {PRODUCT_DATA.subName} / Qty: {quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500 text-lg font-number font-mono">
                    NT$ {(PRODUCT_DATA.price * quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Installment choices list */}
              <p className="text-xs text-gray-400 uppercase font-bold mb-3 tracking-widest font-mono flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-eva-orange" /> {SYSTEM_CONFIG.checkout.planSelectHeader}
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {INSTALLMENT_PLANS.map((plan) => (
                  <label key={plan.id} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment_plan" 
                      value={plan.id} 
                      className="sr-only plan-radio" 
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                    />
                    <div className="plan-card p-4 border border-neutral-800 bg-neutral-900/40 hover:border-red-600/50 rounded transition duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm md:text-base">
                          {plan.label}
                        </span>
                        {plan.rate > 0 ? (
                          <span className="text-xs bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 font-bold font-mono">
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
                ))}
              </div>

              {/* Interactive Calculation results area */}
              <div className="border-t border-neutral-800 pt-4 bg-black p-5 -mx-6 -mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                  <span>Product Subtotal</span>
                  <span>NT$ {(PRODUCT_DATA.price * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-4 font-mono">
                  <span>{SYSTEM_CONFIG.checkout.processingFeeLabel}</span>
                  <span className={fee > 0 ? "text-red-400" : "text-green-400"}>
                    {fee > 0 ? `+NT$ ${fee.toLocaleString()}` : "NT$ 0"}
                  </span>
                </div>

                <div className="flex justify-between items-end mb-4">
                  <span className="font-bold italic text-base md:text-lg text-white">{SYSTEM_CONFIG.checkout.totalPayableLabel}</span>
                  <span className="text-3xl md:text-4xl font-black font-number text-red-500 tracking-wide font-mono">
                    NT$ {grandTotal.toLocaleString()}
                  </span>
                </div>

                {getSelectedPlan().months > 1 && (
                  <div className="mb-4 text-right bg-neutral-950/85 p-2 border border-neutral-900">
                    <p className="text-gray-300 text-sm">
                      {SYSTEM_CONFIG.checkout.perInstallmentPrefix} <span className="text-xl md:text-2xl font-black text-yellow-500 font-number font-mono">{`NT$ ${monthlyPayment.toLocaleString()} / ${SYSTEM_CONFIG.checkout.perInstallmentSuffix}`}</span>
                    </p>
                  </div>
                )}

                {/* Confirm Action */}
                <button 
                  onClick={handleCheckoutRedirect}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 uppercase tracking-widest skew-box shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer text-center block"
                >
                  <span className="unskew-text text-base md:text-lg flex items-center justify-center gap-1.5">
                    {SYSTEM_CONFIG.checkout.confirmButtonText} <CheckCircle2 className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
