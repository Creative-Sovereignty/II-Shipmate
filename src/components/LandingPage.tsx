import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Shield,
  Coins,
  Compass,
  BookOpen,
  Settings,
  ChevronRight,
  Lock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal,
  Activity,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";

interface LandingPageProps {
  onLaunchConsole: (tier?: "paid_export" | "white_label") => void;
}

export default function LandingPage({ onLaunchConsole }: LandingPageProps) {
  // Local states for interactive graphical sections
  const [pipelineStep, setPipelineStep] = useState(0);
  const [geoToggle, setGeoToggle] = useState(true); // true = Compliant, false = Silent Leak
  const [localRevenue, setLocalRevenue] = useState(300000);
  
  // Auto-play the compile pipeline sequence to keep graphics moving dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Compute alternative revenue math
  const systemCut = localRevenue * 0.15;
  const stripeAlternativeCut = localRevenue * 0.129; // 10% Alternate Billing + 2.9% stripe processing
  const netSavings = systemCut - stripeAlternativeCut;

  return (
    <div className="space-y-16 pb-12">
      
      {/* SECTION 1: HERO DISPLAY SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-8 px-4">
        {/* Subtle decorative background graphic */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-[#000040] border border-[#D4AF37]/55 rounded-full px-4 py-2 text-[10px] md:text-xs font-mono tracking-widest text-[#D4AF37] uppercase shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse">
          <Shield className="h-4 w-4 text-[#D4AF37]" />
          <span>REGULATORY COMPLIANCE SYSTEM APPROVED FOR 2026 PUBLICATION</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-serif font-black text-white tracking-tight leading-[1.1]">
          Steer Your App Safely Into <span className="text-[#D4AF37] text-gold-metallic glow-text-gold relative inline-block">
            Play Store
            <span className="absolute bottom-1 left-0 w-full h-1 bg-gold-metallic rounded" />
          </span>
        </h1>
        
        <p className="text-sm md:text-lg text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
          Starboard & Shipmate automate the strict, zero-tolerance mobile publication directives. 
          Instantly pinpoint geolocation leaks, bypass high taxation on in-app sales, and compile 
          100% compliant Trusted Web Activities automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto bg-gold-shimmer hover:brightness-115 active:scale-97 text-[#000040] font-mono font-extrabold text-sm py-4 px-8 rounded-xl tracking-widest uppercase transition-all duration-150 hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.45)]"
          >
            <Compass className="h-5 w-5 text-[#000040] animate-spin-slow" />
            <span>Launch Developer Console</span>
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById("timeline-roadmap");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:bg-slate-850 hover:border-slate-650 text-slate-200 font-mono font-bold text-sm py-4 px-8 rounded-xl tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Activity className="h-4.5 w-4.5 text-[#D4AF37]" />
            <span>Interactive Timeline</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE PIPELINE DIAGRAM GRAPHIC */}
      <section className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-slate-600">
          SYSTEM: COMPILATION FLUX DIAGRAM
        </div>
        
        <div className="space-y-2 mb-6">
          <h2 className="text-xl md:text-2xl font-serif text-white font-bold tracking-tight">
            The Shipmate Compile & Healing Graphic Pipeline
          </h2>
          <p className="text-xs md:text-sm text-slate-450 max-w-2xl">
            Watch the live, automated sanitization workflow in action. We evaluate raw, risky code payloads, pinpoint regulatory compliance gaps, insert mandatory system triggers, and output sealed Play Store packages.
          </p>
        </div>

        {/* 4 Connected Nodes Layout */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 relative pb-4 border-b border-slate-800/60 mb-6">
          {/* Timeline connecting bar */}
          <div className="absolute top-8 left-[12%] right-[12%] h-1 bg-slate-800 -z-10 rounded">
            <div 
              className="h-full bg-gradient-to-r from-[#D4AF37] to-cyan-500 transition-all duration-500 rounded"
              style={{ width: `${(pipelineStep / 3) * 100}%` }}
            />
          </div>

          {[
            { label: "1. Payload Scan", icon: Terminal, color: "text-rose-400 border-rose-950/80" },
            { label: "2. Gap Audit", icon: AlertTriangle, color: "text-[#D4AF37] border-amber-950/80" },
            { label: "3. AI Healing", icon: Sparkles, color: "text-indigo-400 border-indigo-950/80" },
            { label: "4. Sealed .AAB", icon: Shield, color: "text-emerald-400 border-emerald-950/80" },
          ].map((node, i) => {
            const Icon = node.icon;
            const isActive = pipelineStep === i;
            return (
              <button
                key={i}
                onClick={() => setPipelineStep(i)}
                className="flex flex-col items-center text-center focus:outline-none cursor-pointer group"
              >
                <div 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                    isActive 
                      ? "bg-[#000040] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110" 
                      : "bg-[#030612] border-slate-800 group-hover:border-slate-700"
                  }`}
                >
                  <Icon className={`h-5 w-5 md:h-7 md:w-7 transition-all ${isActive ? "text-[#D4AF37] scale-105" : "text-slate-500 group-hover:text-slate-400"}`} />
                  
                  {/* Glowing core bullet */}
                  {isActive && (
                    <span className="absolute -bottom-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <span className={`text-[9px] md:text-xs font-mono font-bold mt-2 tracking-wide uppercase transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-400"}`}>
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Descriptive Graphic Display relative to current pipeline step */}
        <div className="bg-[#020510] border border-slate-800/60 rounded-xl p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-4 flex justify-center">
            {/* ILLUSTRATIVE GRAPHIC ANIMATED CARD */}
            <div className="relative w-full max-w-[240px] aspect-square bg-[#030615] rounded-xl border-2 border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-30 animate-pulse pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {pipelineStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center space-y-4 text-center"
                  >
                    <div className="relative inline-block">
                      <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-800 flex items-center justify-center text-rose-500">
                        <Terminal className="h-8 w-8 animate-pulse" />
                      </div>
                      <span className="absolute -top-1 -right-1 text-xs px-1 text-white bg-rose-600 rounded font-bold font-mono">CRIT</span>
                    </div>
                    <div className="font-mono text-[10px] bg-slate-950/80 p-2 rounded text-rose-450 border border-rose-950/40 select-all max-w-[200px]">
                      const MAP_API_KEY = "AIzaSyD..."
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest leading-none">
                      Hardcoded Tokens Detected
                    </span>
                  </motion.div>
                )}

                {pipelineStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center space-y-4 text-center"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#D4AF37] flex items-center justify-center animate-spin-slow">
                        <div className="w-16 h-16 rounded-full bg-amber-950/30 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                          <Lock className="h-6 w-6" />
                        </div>
                      </div>
                      <span className="absolute inset-0 bg-gradient-to-t from-transparent to-[#D4AF37]/10 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono bg-amber-905/30 border border-amber-900 px-2 py-0.5 rounded text-amber-200">
                        SCANNING STRUCTURES
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest leading-none">
                      Auditing Location Consent Gaps
                    </span>
                  </motion.div>
                )}

                {pipelineStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center space-y-4 text-center"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-indigo-950/40 border border-indigo-700 flex items-center justify-center text-indigo-400 relative">
                        <Sparkles className="h-8 w-8 animate-bounce text-indigo-300" />
                      </div>
                      {/* Interactive visual particles */}
                      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="absolute bottom-2 left-0 w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                    </div>
                    <div className="text-[10px] font-mono p-1 px-2 text-indigo-200 bg-indigo-950/30 rounded border border-indigo-900/40">
                      Injecting Play Age Signal Checkers
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest leading-none">
                      AI Self-Healing Executing
                    </span>
                  </motion.div>
                )}

                {pipelineStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex flex-col items-center space-y-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-800 flex items-center justify-center text-emerald-400">
                      <Award className="h-9 w-9 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="font-mono text-[9px] bg-slate-950 p-1.5 border border-emerald-950 rounded text-emerald-400">
                      starboard-v1.0.0.aab
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest leading-none">
                      Bundle Certified Pass 
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-[#D4AF37] uppercase font-bold">
                STAGE SPECIFICATION {pipelineStep + 1} OF 4
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Active Compilation Step</span>
            </div>

            <AnimatePresence mode="wait">
              {pipelineStep === 0 && (
                <motion.div
                  key="info-0"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-bold text-white font-serif">AAB Payload Ingestion & Verification</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Raw PWA configurations and underlying HTML files are analyzed for critical compliance parameters. Our system looks for background, unprompted coordinate queries, exposed API tokens, and missing manifest headers which trigger permanent storefront bans.
                  </p>
                  <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5 text-rose-350"><span className="w-1 h-1 bg-rose-500 rounded-full" /> Insecure API pattern matches scanned (Client-side keys).</li>
                    <li className="flex items-center gap-1.5 text-rose-350"><span className="w-1 h-1 bg-rose-500 rounded-full" /> Background GPS tracking actions intercepted.</li>
                  </ul>
                </motion.div>
              )}

              {pipelineStep === 1 && (
                <motion.div
                  key="info-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-bold text-white font-serif">Structural Auditor Diagnostics</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    The Security Compliance Scan isolates structural deficiencies. It runs automated checks on PWA manifest linkage requirements, SSL tunnels, age gate triggers, and verifies whether strict navigation directives comply with the newest Play Store guidelines.
                  </p>
                  <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5 text-amber-350"><span className="w-1 h-1 bg-amber-500 rounded-full" /> Analyzes the Presence or Absence of Play Age Signals.</li>
                    <li className="flex items-center gap-1.5 text-amber-350"><span className="w-1 h-1 bg-amber-500 rounded-full" /> Measures user-initiated location consent interfaces.</li>
                  </ul>
                </motion.div>
              )}

              {pipelineStep === 2 && (
                <motion.div
                  key="info-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-bold text-white font-serif">Heuristic AI-Healer Patch Application</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Upon locating policy failures, our heuristic self-healer engine overrides compromised modules. It strips out raw API key tokens, relocates background GPS tracking behind explicit onClick consent layout anchors, and injects Google Play Age Signal queries automatically.
                  </p>
                  <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5 text-indigo-350"><span className="w-1 h-1 bg-indigo-500 rounded-full" /> Automatic code refactoring with verified deterministic loops.</li>
                    <li className="flex items-center gap-1.5 text-indigo-350"><span className="w-1 h-1 bg-indigo-500 rounded-full" /> Safe substitution of raw variables to server configuration processes.</li>
                  </ul>
                </motion.div>
              )}

              {pipelineStep === 3 && (
                <motion.div
                  key="info-3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-bold text-white font-serif">Sealed Production .AAB Assembly</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    A completely sealed, production-signed Android App Bundle (.aab) is output using advanced Bubblewrap compilation. Alternative billing manifest directives are injected directly into the application layout metadata to enable direct Stripe customer paywalls.
                  </p>
                  <ul className="text-[11px] font-mono text-slate-500 space-y-1">
                    <li className="flex items-center gap-1.5 text-emerald-350"><span className="w-1 h-1 bg-emerald-500 rounded-full" /> Android standard manifest alternative billing injections configured.</li>
                    <li className="flex items-center gap-1.5 text-emerald-350"><span className="w-1 h-1 bg-emerald-500 rounded-full" /> 2026 Mobile Play Store store-ready. Perfect checksum matches.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 flex gap-3">
              <button
                onClick={onLaunchConsole}
                className="bg-slate-900 hover:bg-slate-850 text-[#D4AF37] border border-slate-700 hover:border-[#D4AF37]/50 py-2 px-4 rounded text-[11px] font-mono uppercase font-black cursor-pointer transition-all flex items-center gap-1"
              >
                <span>Interactive sandbox demo</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BENTO GRID CAPABILITIES GRAPHICS GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-white font-extrabold tracking-tight">
            Comprehensive Regulatory Protection Suite
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Starboard establishes absolute alignment across critical App Store security frameworks, ensuring veteran-owned applications operate reliably under full compliance control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bento Card A: Location Safety */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-indigo-950/40 border border-indigo-850 rounded-lg flex items-center justify-center text-indigo-400 mb-2">
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                User-Initiated Geolocation Rules
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Silent GPS tracking on page load is considered an immediate security breach. 
                Our engine automatically intercepts navigation calls, binding them to clear, 
                visible location-prompting button controls to satisfy automated storefront compliance tests.
              </p>
            </div>

            {/* INTERACTIVE COMPONENT: Geolocation Safe State Toggle Graphic */}
            <div className="bg-[#030614] rounded-lg p-4 border border-slate-800/60 font-mono text-[11px] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-slate-500 uppercase text-[9px] tracking-widest font-black">Interactive Compliance Preview</span>
                <button 
                  onClick={() => setGeoToggle(!geoToggle)}
                  className={`py-0.5 px-2 rounded text-[9px] uppercase font-bold transition-all cursor-pointer ${geoToggle ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"}`}
                >
                  {geoToggle ? "SAFE / APPROVED" : "INSECURE / CRIT"}
                </button>
              </div>

              {geoToggle ? (
                <div className="space-y-2 text-emerald-350">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" /> Checked compliant Geolocation
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans leading-normal">
                    Location coords are locked directly to explicit user click trigger (<code className="text-slate-300 font-mono">loc-btn</code>). Zero passive sniffing occurs.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-rose-350">
                  <p className="font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0" /> Silent Geolocation Sniffing!
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans leading-normal">
                    The app attempts <code className="text-rose-400 font-mono">getCurrentPosition()</code> in raw script load without explicit consent prompts. 🚩 Automatic rejection risk!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bento Card B: Multi-Factor Age Gates */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-rose-950/40 border border-rose-850 rounded-lg flex items-center justify-center text-rose-400 mb-2">
                <Lock className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Play Age Signals Gatekeeper
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Highly rated niches (including veteran social networks and local marine communities) require precise identity audits. Integration with Google Play Age Verification (the `google.play.age.signals` framework) guarantees seamless player rating clearances.
              </p>
            </div>

            {/* COMPLIANCE GRAPHIC REPRESENTATION */}
            <div className="bg-[#030614] rounded-lg p-4 border border-slate-800/60 flex items-center justify-between gap-4">
              <div className="space-y-1 font-mono text-[10px]">
                <span className="text-slate-500 uppercase text-[9px] tracking-widest block font-bold">API COMPLIANCE CHECKPOINT</span>
                <span className="text-white font-bold block text-xs">🔞 Google Age Credentials</span>
                <span className="text-slate-400 block font-sans">Automatic system identity validation.</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#000040] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-sm text-[#D4AF37] tracking-tighter shadow-lg shrink-0">
                18+ OK
              </div>
            </div>
          </div>

          {/* Bento Card C: Revenue Margin Bypassing (Interactive Stripe Slider) */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between col-span-1 md:col-span-2 space-y-6 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-2">
                <div className="w-10 h-10 bg-emerald-950/40 border border-emerald-850 rounded-lg flex items-center justify-center text-emerald-400 mb-2">
                  <Coins className="h-5 w-5 text-emerald-400 animate-bounce" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  Stripe Alternative Billing Overrides <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">12.9% Total</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  By declaring independent stripe paywalls using recent storefront alternative billing directives (10% Google storefront compliance tax + 2.9% Card Processing), developers bypass high platform margins. That translates into keeping up to 97%+ of localized revenue directly in your bank!
                </p>
                
                {/* Live Responsive Input Slider embedded directly in Bento Graphic card */}
                <div className="pt-2 p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2 max-w-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Adjust Projected Annual Sales</span>
                    <span className="text-white font-black text-xs">${localRevenue.toLocaleString()} / YEAR</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="50000"
                    value={localRevenue}
                    onChange={(e) => setLocalRevenue(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-[#D4AF37] rounded-all appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[9px] text-[#D4AF37] font-semibold">
                    <span>$100,000</span>
                    <span>$800,000</span>
                    <span>$1,500,000</span>
                  </div>
                </div>
              </div>

              {/* Graphical margin visual output side */}
              <div className="lg:col-span-5 bg-[#030614] rounded-lg p-5 border border-slate-800/80 font-mono text-[11px] space-y-4">
                <span className="text-slate-500 uppercase text-[9px] tracking-widest font-black block border-b border-slate-900 pb-1">
                  Revenue Comparison Metric
                </span>

                <div className="space-y-3">
                  {/* Standard Loss */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Standard App System Cost (15%)</span>
                      <span className="text-rose-450 font-bold">${systemCut.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded">
                      <div className="h-full bg-rose-600 rounded transition-all duration-300" style={{ width: "100%" }} />
                    </div>
                  </div>

                  {/* Shipmate Savings Cost */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Shipmate Alternative Rate (12.9%)</span>
                      <span className="text-emerald-450 font-bold">${stripeAlternativeCut.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded">
                      <div className="h-full bg-[#D4AF37] rounded transition-all duration-300" style={{ width: "86%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/60 p-3 rounded text-center space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold leading-none">Net Retained Premium Margin Balance</span>
                  <p className="text-base text-emerald-300 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    +${netSavings.toLocaleString()} / Yr Saving
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: INTERACTIVE CHECKLIST TIMELINE (ROADMAP) */}
      <section id="timeline-roadmap" className="bg-slate-950/40 border border-slate-850 p-6 md:p-8 rounded-2xl relative">
        <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-slate-650">
          CHRONO-BLUEPRINT: 2026 ROADMAP
        </div>

        <div className="space-y-2 mb-8 text-center max-w-2xl mx-auto">
          <ChevronRight className="h-6 w-6 text-[#D4AF37] mx-auto animate-bounce rotate-90" />
          <h2 className="text-xl md:text-2xl font-serif text-white font-bold tracking-tight">
            Timeline of Play Store Regulatory Mandates (2026)
          </h2>
          <p className="text-xs text-slate-450">
            Identify the core checkpoints that mobile web frameworks must pass inside the 2026 mobile app landscape to achieve risk-free certification.
          </p>
        </div>

        {/* Timeline Horizontal Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              quarter: "Q1 2026",
              title: "Silent GPS Mandates Initiated",
              desc: "Unprompted coordinate tracking is completely sandboxed. Background telemetry prompts on initialization without a clear 'Location Button' interaction will fail the Play Store automated scanner tests.",
              status: "Legislation Enforced"
            },
            {
              quarter: "Q2 2026",
              title: "Verified Age Signals Gateway",
              desc: "Adult niche communities, marine veteran networks, and rating-restricted services must declare clean play age tags or integrate active user-confirmed identification checkpoints prior to operational clearances.",
              status: "Legislation Enforced"
            },
            {
              quarter: "Q3 2026",
              title: "Alternative Stripe Overrides",
              desc: "Secure standalone PWAs can bypass direct system tax structures by utilizing registered external payment routes (including Stripe, Bolt), reducing fee leaks from 30% down to custom developer processors.",
              status: "Sandbox Ready"
            }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#030510] border border-slate-850 p-5 rounded-xl space-y-3 flex flex-col justify-between group hover:border-[#D4AF37]/20 transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#D4AF37] font-black">{item.quarter}</span>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 capitalize">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-bold text-white group-hover:text-[#D4AF37] transition-all">
                  {item.title}
                </h3>
                <p className="text-[11px] font-sans text-slate-450 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span>VERIFICATION METRIC</span>
                <span className="text-emerald-450 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> SECURED
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIRECT EXTERNAL STRIPE ROADMAP PAYWALL CHANNELS */}
      <section className="space-y-6">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block">PROFITS GUARANTEED STRIPE PATHWAYS</span>
          <h2 className="text-xl md:text-3xl font-serif text-white font-bold tracking-tight">
            Compliance Pricing Tiers Built to Retain Your Margin
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Bypass heavy app store commissions using Q3 2026 alternative payment gateways. Select the plan that perfectly matches your squad configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* CARD 1: $29.99 PAY PER EXPORT */}
          <div className="bg-[#010206] border border-slate-850 hover:border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-350 relative group">
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-indigo-400 font-bold tracking-wider uppercase bg-indigo-950/40 py-1 px-3 rounded-full">
                  LITE BUNDLE LICENSE
                </span>
                <span className="text-[#D4AF37] text-[9px] font-black">SAVE 15% WITH 'VETERAN'</span>
              </div>
              <h3 className="text-xl font-serif text-white font-bold">Pay Per Export</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Unlock a single compiled, release-signed Android App Bundle (.aab) with embedded Stripe alternative billing metadata. Excellent for pilot apps.
              </p>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-slate-500 text-sm">$</span>
                <span className="text-3xl font-extrabold text-white tracking-tight">29.99</span>
                <span className="text-[10px] text-slate-500">/ single export AAB</span>
              </div>
            </div>

            <ul className="text-[11px] space-y-2 text-slate-350 border-t border-slate-900 pt-4 font-mono">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Single sealed App Bundle signature</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Full HTML compliance audit downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Automatic 2026 GPS protection</span>
              </li>
            </ul>

            <button
              onClick={() => onLaunchConsole("paid_export")}
              className="w-full bg-[#000080]/60 hover:bg-[#000080] text-[#D4AF37] border border-[#D4AF37]/50 font-mono text-xs font-bold py-3 px-4 rounded-xl tracking-wider uppercase transition-all duration-150 cursor-pointer text-center"
            >
              Select & Launch Stripe Checkout
            </button>
          </div>

          {/* CARD 2: $299.99 ENTERPRISE WHITE LABEL */}
          <div className="bg-[#020512] border-2 border-[#D4AF37]/45 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-350 relative group shadow-[0_0_20px_rgba(212,175,55,0.08)]">
            <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#D4AF37] text-[#000040] text-[8px] font-mono font-black py-0.5 px-3 rounded-full uppercase tracking-widest">
              Most Profitable
            </div>
            
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase bg-emerald-950/40 py-1 px-3 rounded-full border border-emerald-900">
                  SQUADRON UNLIMITED
                </span>
                <span className="text-[#D4AF37] text-[9px] font-black font-semibold">HIGH MARGIN VALUE</span>
              </div>
              <h3 className="text-xl font-serif text-white font-bold">Infinite White-Label</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Compile unlimited signed bundles, override company registries, customize server-side deletion webhooks, and gain direct 24/7 legal support access.
              </p>
              <div className="flex items-baseline gap-1 pt-1">
                <span className="text-slate-500 text-sm">$</span>
                <span className="text-3xl font-extrabold text-white tracking-tight">299.99</span>
                <span className="text-[10px] text-slate-500">/ one-time standard</span>
              </div>
            </div>

            <ul className="text-[11px] space-y-2 text-slate-350 border-t border-slate-900 pt-4 font-mono">
              <li className="flex items-center gap-2 font-bold text-[#D4AF37]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Infinite bundle compile downloads</span>
              </li>
              <li className="flex items-center gap-2 font-bold text-[#D4AF37]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>White-label brand overrides active</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Custom deletion endpoint support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                <span>Priority 24/7 veteran advisory desk</span>
              </li>
            </ul>

            <button
              onClick={() => onLaunchConsole("white_label")}
              className="w-full bg-[#D4AF37] hover:bg-amber-550 text-[#000040] font-mono text-xs font-black py-3.5 px-4 rounded-xl tracking-widest uppercase transition-all duration-150 cursor-pointer text-center shadow-[0_0_15px_rgba(212,175,55,0.25)]"
            >
              Unlock Squad White-Label
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5: VETERAN TRUST & CREDENTIALS BANNER */}
      <section className="bg-gradient-to-r from-[#000080]/35 via-[#000040]/45 to-[#000080]/35 border border-[#D4AF37]/35 rounded-2xl p-6 md:p-8 text-center space-y-6">
        <Compass className="h-10 w-10 text-[#D4AF37] mx-auto animate-spin-slow" />
        
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block">STEER TRUE. SHIP COMPLIANT.</span>
          <h2 className="text-xl md:text-3xl font-serif text-white font-extrabold tracking-tight">
            Nautical Quality Crafted for Professional Veteran Developers
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
            Starboard’s blueprint is constructed purely with rule-based deterministic filters. 
            By eliminating unpredictable generative dependencies in the core compilation manifest pipeline, 
            you are guaranteed 100% stable outputs with zero content rating rejections.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
            <span className="block text-[#D4AF37] font-mono font-black text-lg">0%</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">AI Hallucination Bias</span>
          </div>
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
            <span className="block text-[#D4AF37] font-mono font-black text-lg">100%</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">HTTPS Encryption</span>
          </div>
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
            <span className="block text-[#D4AF37] font-mono font-black text-lg">97%+</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Retained Margin</span>
          </div>
          <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-lg">
            <span className="block text-[#D4AF37] font-mono font-black text-lg">AAB</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase">Trusted Web Activity Signed</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onLaunchConsole}
            className="bg-[#D4AF37] hover:bg-amber-500 text-[#000040] font-mono font-extrabold text-xs py-3.5 px-8 rounded-lg tracking-widest uppercase transition-all shadow-md active:scale-97 cursor-pointer"
          >
            Launch Interactive Playgrounds
          </button>
        </div>
      </section>

    </div>
  );
}
