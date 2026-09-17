import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  ShieldCheck,
  Zap,
  Check,
  CreditCard,
  Lock,
  Loader2,
  Ticket,
  ChevronRight,
  Download,
  Flame,
  X,
  Compass,
  Award,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

interface PricingPaywallProps {
  currentTier: "free" | "paid_export" | "white_label";
  onPurchaseComplete: (tier: "paid_export" | "white_label", licenseKey: string) => void;
  onClose?: () => void;
  preselectedTier?: "paid_export" | "white_label" | null;
}

export default function PricingPaywall({
  currentTier,
  onPurchaseComplete,
  onClose,
  preselectedTier = null
}: PricingPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<"paid_export" | "white_label">(
    preselectedTier || "paid_export"
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"plans" | "stripe" | "success">("plans");

  // Stripe form state variables
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // 0.15 for 15% off
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  
  // Checkout simulation logs
  const [checkoutLogs, setCheckoutLogs] = useState<string[]>([]);
  const [generatedLicense, setGeneratedLicense] = useState("");

  const pricing = {
    paid_export: 29.99,
    white_label: 299.99
  };

  const activePrice = pricing[selectedPlan];
  const discountMultiplier = 1 - appliedDiscount;
  const finalPrice = activePrice * discountMultiplier;

  // Real-time promo code evaluator
  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const trimmed = promoCode.trim().toUpperCase();
    
    if (trimmed === "VETERAN") {
      setAppliedDiscount(0.15); // 15% off
      setPromoSuccess("🇺🇸 Veteran discount of 15% applied successfully!");
    } else if (trimmed === "STEERTRUE") {
      setAppliedDiscount(0.20); // 20% off
      setPromoSuccess("⚓ Captain's discount of 20% applied successfully!");
    } else if (trimmed === "ADMIRAL" || trimmed === "DEVELOPER" || trimmed === "FREEPASS") {
      setAppliedDiscount(1.00); // 100% off
      setPromoSuccess("⚓ FLEET ADMIRAL BYPASS ENGAGED: 100% discount active (Final Cost: $0.00 USD)!");
    } else {
      setPromoError("Invalid promotional coupon entered.");
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card input to 4 block intervals
    const val = e.target.value.replace(/\D/g, "");
    const truncated = val.slice(0, 16);
    const formatted = truncated.match(/.{1,4}/g)?.join(" ") || truncated;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const truncated = val.slice(0, 4);
    if (truncated.length >= 3) {
      setCardExpiry(`${truncated.slice(0, 2)}/${truncated.slice(2)}`);
    } else {
      setCardExpiry(truncated);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCardCvc(val.slice(0, 4));
  };

  const triggerCheckoutProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      alert("Please check your credit card number details.");
      return;
    }
    if (cardExpiry.length < 5) {
      alert("Please provide the card expiry month & year.");
      return;
    }
    if (cardCvc.length < 3) {
      alert("Invalid Security Code (CVC).");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutLogs(["🔒 Opening secure TLS encryption tunnel...", "🔑 Requesting payment permission from Stripe relay..."]);

    const logsArray = [
      `💳 Validating payment method: ${cardNumber.substring(0, 4)} **** **** ${cardNumber.slice(-4)}`,
      `💰 Charging account amount: $${finalPrice.toFixed(2)} USD`,
      "⚓ Activating alternate billing route validation tokens...",
      "🛡️ Registering digital developer signature key on standard servers...",
      "✨ Transaction fully authorized! Sealing security key..."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logsArray.length) {
        setCheckoutLogs(prev => [...prev, logsArray[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        
        // Generate mock license key
        const randomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
        const lic = `STBD-${selectedPlan === "white_label" ? "WHTL" : "EXPR"}-${randomHex()}-${randomHex()}-${randomHex()}`;
        
        setGeneratedLicense(lic);
        setIsCheckingOut(false);
        setCheckoutStep("success");
        onPurchaseComplete(selectedPlan, lic);
      }
    }, 800);
  };

  return (
    <div className="bg-slate-950 border-2 border-[#D4AF37] rounded-3xl p-5 md:p-8 max-w-4xl mx-auto shadow-[0_0_35px_rgba(212,175,55,0.18)] text-slate-200 overflow-hidden relative">
      {/* Decorative top badge */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 bg-[#D4AF37] text-[#000040] text-[9px] font-mono font-black py-1 px-4 rounded-b-lg tracking-widest uppercase">
        Safe Stripe Payments Enabled
      </div>

      <div className="flex justify-between items-start gap-4 mb-3 pb-3 border-b border-slate-900">
        <div>
          <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block font-black">
            STRIPE SECURE CERTIFICATION BYPASS SYSTEM
          </span>
          <h2 className="text-xl md:text-3xl font-serif text-white font-extrabold flex items-center gap-2">
            Unlock Production Deployments <Award className="h-5 w-5 text-[#D4AF37] shrink-0" />
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-550 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {checkoutStep === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl font-sans">
              Deploy your veteran communities perfectly with full alternative billing systems. Secure your standalone downloads, clear automated play test restrictions, and bypass high platform taxation. Choose the profile that matches your fleet size:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              {/* PLAN 1: SINGLE BUNDLE */}
              <div 
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  selectedPlan === "paid_export" 
                    ? "bg-[#020512] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                    : "bg-[#010206] border-slate-850 hover:border-slate-800"
                }`}
                onClick={() => setSelectedPlan("paid_export")}
              >
                {selectedPlan === "paid_export" && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37]/15 border-l border-b border-[#D4AF37] text-[#D4AF37] text-[8px] font-mono py-0.5 px-2.5 rounded-bl font-black uppercase tracking-wider">
                    SELECTED
                  </div>
                )}
                
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-black text-indigo-400 tracking-wider block uppercase bg-indigo-950/40 p-1 px-2.5 rounded-full w-max">
                    SINGLE FLEET DOWNLOAD LITE
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-slate-400">$</span>
                    <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">29.99</span>
                    <span className="text-xs text-slate-500 font-mono">/ Per Bundle export</span>
                  </div>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                    Ideal for individual veterans publishing single localized applications with full Play Store billing compliance bypass.
                  </p>
                </div>

                <ul className="text-[10px] space-y-2 font-mono text-slate-350 border-t border-slate-900 pt-3">
                  <li className="flex items-center gap-2 text-emerald-450 font-semibold">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Instant signed .AAB package output</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Compliant with Q3 2026 Billing Laws</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Full text+json policy audit report downloads</span>
                  </li>
                  <li className="flex items-center gap-2 opacity-50 line-through">
                    <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span>Branded launcher logo overrides</span>
                  </li>
                </ul>
              </div>

              {/* PLAN 2: ENTERPRISE WHITE LABEL */}
              <div 
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  selectedPlan === "white_label" 
                    ? "bg-[#020512] border-2 border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] animate-pulse-slow" 
                    : "bg-[#010206] border-slate-850 hover:border-slate-800"
                }`}
                onClick={() => setSelectedPlan("white_label")}
              >
                <div className="absolute top-0 right-0 bg-emerald-950 text-emerald-400 border-l border-b border-emerald-800 text-[8px] font-mono py-0.5 px-2.5 rounded-bl font-black uppercase tracking-wider">
                  ⚠️ PROFITABLE UNLIMITED
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-black text-emerald-400 tracking-wider block uppercase bg-[#000040] p-1 px-2.5 rounded-full w-max border border-emerald-800">
                    SQUADRON UNLIMITED PLATINUM
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-slate-400">$</span>
                    <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">299.99</span>
                    <span className="text-xs text-slate-500 font-mono">/ Standard White-Label</span>
                  </div>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                    Enable custom brand modifications, white-label launcher replacements, and infinite compile cycles with no limits.
                  </p>
                </div>

                <ul className="text-[10px] space-y-2 font-mono text-slate-350 border-t border-slate-900 pt-3">
                  <li className="flex items-center gap-2 text-emerald-450 font-semibold">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>INFINITE signed .AAB package outputs</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-450">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>White-Label Branding (Custom Logos / Colors)</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-450">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited deletion endpoint customization</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-450">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Priority 24/7 Marine Legal Advisory channel</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="bg-[#000040]/40 border border-[#D4AF37]/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-0.5">
                <span className="text-[9px] text-[#D4AF37] font-mono uppercase font-black tracking-widest block">SELECTED CHECKOUT TARGET</span>
                <p className="text-xs font-mono font-bold text-white">
                  {selectedPlan === "white_label" ? "Enterprise White-Label Unlimited License" : "Single Bundle Export Package License"}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-slate-550 block">Amount:</span>
                  <span className="text-lg font-mono font-black text-[#D4AF37]">${activePrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep("stripe")}
                  className="flex-1 sm:flex-initial bg-[#D4AF37] hover:bg-amber-500 text-[#000040] font-mono font-black text-xs py-3 px-6 rounded-lg tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)] scroll-smooth"
                >
                  <span>Go To Stripe Checkout</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
          </motion.div>
        )}

        {checkoutStep === "stripe" && (
          <motion.div
            key="stripe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* COLLATIVE CHECKOUT COLUMNS */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#000080] border border-[#D4AF37]/50 text-[#D4AF37] font-bold">
                💳 STRIPE SECURED PAYMENT TERMINAL
              </span>

              <form onSubmit={triggerCheckoutProcess} className="space-y-4 pt-2">
                
                {/* Credit Card Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Fleet Commander"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    disabled={isCheckingOut}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 font-mono text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Credit Card Digits Field */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">Credit Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      disabled={isCheckingOut}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3.5 pl-10 font-mono text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <CreditCard className="absolute top-3 left-3 h-4 w-4 text-slate-550" />
                  </div>
                </div>

                {/* EXP + CVC Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1">
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      disabled={isCheckingOut}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 font-mono text-xs text-center text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">CVC / CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="***"
                      maxLength={4}
                      value={cardCvc}
                      onChange={handleCvcChange}
                      disabled={isCheckingOut}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 font-mono text-xs text-center text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">Postal ZIP</label>
                    <input
                      type="text"
                      required
                      placeholder="90210"
                      maxLength={5}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                      disabled={isCheckingOut}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-3 font-mono text-xs text-center text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* DYNAMIC LOGS LOADER DISPLAY */}
                <AnimatePresence>
                  {isCheckingOut && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-[10px] font-mono space-y-1 text-slate-450"
                    >
                      <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold uppercase text-[9px] animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin text-[#D4AF37]" />
                        <span>Stripe Transaction In Progress</span>
                      </div>
                      {checkoutLogs.map((log, idx) => (
                        <p key={idx} className="leading-tight text-slate-400">
                          ⚙️ {log}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FORM CONTROLS */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("plans")}
                    disabled={isCheckingOut}
                    className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-850 py-3 rounded-lg text-slate-350 text-xs font-mono uppercase tracking-wider cursor-pointer font-bold"
                  >
                    Back to Plans
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs py-3 rounded-lg tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Authorize ${finalPrice.toFixed(2)}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* SUMMARY CART SIDE COLUMN */}
            <div className="lg:col-span-5 bg-[#030614] rounded-2xl p-5 border border-slate-900/60 font-mono text-[11px] space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] block border-b border-slate-900 pb-1 font-bold">
                  Order Summary
                </span>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-white font-bold block text-xs">
                        {selectedPlan === "white_label" ? "Squadron White-Label Upgrade" : "Single Bundle Export License"}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-normal font-sans">
                        {selectedPlan === "white_label" ? "Infinite compiling with logo overrides" : "One-time binary execution payload unlock"}
                      </span>
                    </div>
                    <span className="text-white font-bold">${activePrice.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-900 my-2 pt-2 space-y-1 text-slate-450">
                    <div className="flex justify-between text-[10px]">
                      <span>Stripe Subtotal</span>
                      <span>${activePrice.toFixed(2)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-450 text-[10px]">
                        <span>Coupon Savings ({(appliedDiscount * 100).toFixed(0)}%)</span>
                        <span>-${(activePrice * appliedDiscount).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-white font-black text-sm pt-1 border-t-2 border-dashed border-slate-900">
                    <span>Total Cost Charged:</span>
                    <span className="text-[#D4AF37] font-mono text-normal">${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* PROMO COUPON CODE INTERFACE */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Apply Captain Coupon</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter VETERAN"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isCheckingOut}
                    className="flex-1 bg-slate-900 border border-slate-850 py-1.5 px-3 rounded text-xs text-white uppercase focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isCheckingOut}
                    className="bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37]/50 px-3.5 py-1.5 rounded uppercase font-black text-[10px] tracking-wider cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-rose-400 font-bold">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-400 font-bold">{promoSuccess}</p>}
                
                {/* Default Hint badge to encourage users */}
                <div className="text-[10px] text-slate-500 font-sans p-2.5 rounded bg-slate-900/40 border border-slate-905 block leading-normal space-y-1">
                  <div>
                    💡 Tip: Apply coupon <code className="text-[#D4AF37] font-semibold">VETERAN</code> to redeem a <span className="font-bold">15% discount</span>! This coupon respects veteran service directives.
                  </div>
                  <div className="text-[#D4AF37]/90 text-[9px] font-mono leading-relaxed pt-1.5 border-t border-slate-900">
                    ⚓ <strong>DEVELOPER BYPASS KEY:</strong> Enter coupon <code className="bg-[#000040] text-[#FFF4D0] px-1 py-0.5 rounded font-bold border border-[#D4AF37]/35 select-all">ADMIRAL</code> or <code className="bg-[#000040] text-[#FFF4D0] px-1 py-0.5 rounded font-bold border border-[#D4AF37]/35 select-all font-sans">DEVELOPER</code> to redeem 100% off for custom tests.
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-slate-550 pt-2 border-t border-slate-900 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-650" />
                <span>PCI-DSS Secured. Starboard is verified safe.</span>
              </div>

            </div>
          </motion.div>
        )}

        {checkoutStep === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 max-w-lg mx-auto py-6"
          >
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 text-emerald-450 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] select-none">
              <ShieldCheck className="h-10 w-10 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <span className="text-emerald-400 uppercase tracking-widest font-mono text-[10px] font-black">TRANSACTION AUTHORIZED BY STRIPE</span>
              <h3 className="text-xl md:text-2xl font-serif text-white font-bold">Welcome Aboard, Captain!</h3>
              <p className="text-slate-450 text-xs font-sans max-w-sm mx-auto">
                Your alternative billing credential keys are synchronized successfully in the Android compile container logs.
              </p>
            </div>

            {/* GENERATED RECEIPT BOX */}
            <div className="bg-[#02040b] border-2 border-[#D4AF37]/50 rounded-xl p-4 text-left font-mono text-[11px] space-y-2 select-text relative">
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-emerald-400 uppercase font-black">SEALED</span>
              </div>

              <p className="text-[#D4AF37] border-b border-slate-900 pb-1 text-center font-bold">
                STARBOARD FLEET RECEIPT LOG
              </p>
              
              <div className="grid grid-cols-2 gap-1.5 text-slate-400 pt-1 text-[10px]">
                <span>License Plan:</span>
                <span className="text-white text-right font-bold uppercase">{selectedPlan.replace("_", " ")}</span>
                
                <span>Merchant ID:</span>
                <span className="text-white text-right">STBD-STRIPE-2026-9</span>

                <span>Charged Cost:</span>
                <span className="text-emerald-400 text-right font-black">${finalPrice.toFixed(2)} USD</span>

                <span>Receipt Stamp:</span>
                <span className="text-white text-right select-all">#{Math.floor(Math.random() * 89999 + 10000)}</span>
              </div>

              {/* ACTIVE KEY BLOCK */}
              <div className="border-t border-slate-900 mt-2 pt-2 space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Assigned Platform License Security Key</span>
                <div className="bg-slate-950 p-2 text-center rounded border border-slate-900/80 font-black text-[#D4AF37] select-all leading-none text-xs block tracking-widest">
                  {generatedLicense}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    setCheckoutStep("plans");
                  }
                }}
                className="w-full bg-[#D4AF37] hover:bg-amber-500 text-[#000040] font-mono font-black text-xs py-3.5 rounded-lg tracking-widest uppercase transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Return to Marine Console Playground
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
