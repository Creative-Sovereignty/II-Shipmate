import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Coins,
  Lock,
  Layers,
  Upload,
  CheckCircle,
  Loader2,
  Check,
  Cpu,
  Activity,
  Server,
  Zap,
  ShieldCheck,
  Clock,
  FileCode,
  Sparkles,
  Info
} from "lucide-react";

interface BuildPipelineVisualizerProps {
  buildLogsCount: number;
  isBuilding: boolean;
  status: "idle" | "progress" | "complete" | "failed";
  selectedLogoId: string;
}

interface PipelineStage {
  id: number;
  name: string;
  shortName: string;
  icon: React.ComponentType<any>;
  artifact: string;
  subtasks: { text: string; logIndex: number; size: string }[];
  color: string;
  glow: string;
}

export default function BuildPipelineVisualizer({
  buildLogsCount,
  isBuilding,
  status,
  selectedLogoId
}: BuildPipelineVisualizerProps) {
  const [selectedInspectStage, setSelectedInspectStage] = useState<number | null>(null);

  // Define the 5 high-fidelity stages mapped to logs count (0 to 8)
  const STAGES: PipelineStage[] = [
    {
      id: 1,
      name: "Engine Bootstrap",
      shortName: "Bootstrap",
      icon: Compass,
      artifact: "bootstrap_layer.bin",
      subtasks: [
        { text: "Initialize Trusted Web Activity compiler engine", logIndex: 1, size: "45 KB" },
        { text: "Validate project compliance & SSL gateways", logIndex: 1, size: "12 KB" },
        { text: "Map veteran community rating metadata", logIndex: 1, size: "8 KB" }
      ],
      color: "border-indigo-500 text-indigo-400 bg-indigo-950/25",
      glow: "shadow-[0_0_15px_rgba(99,102,241,0.3)]"
    },
    {
      id: 2,
      name: "Billing Overrides Injection",
      shortName: "Paywall",
      icon: Coins,
      artifact: "alternative_billing_rules.json",
      subtasks: [
        { text: "Inject Q3 2026 alternative billing flags", logIndex: 2, size: "18 KB" },
        { text: "Add ALTERNATIVE_BILLING manifest elements", logIndex: 3, size: "6 KB" },
        { text: "Enable BILLING_OVERRIDE system pathways", logIndex: 4, size: "32 KB" }
      ],
      color: "border-[#D4AF37] text-[#D4AF37] bg-amber-950/25",
      glow: "shadow-[0_0_15px_rgba(212,175,55,0.35)]"
    },
    {
      id: 3,
      name: "PWA Asset Packaging",
      shortName: "Assets",
      icon: Layers,
      artifact: `compressed_icon_${selectedLogoId}.png`,
      subtasks: [
        { text: "Compress icons and structural layouts", logIndex: 5, size: "1.2 MB" },
        { text: `Optimize launcher icon asset: icon-${selectedLogoId}.png`, logIndex: 6, size: "128 KB" },
        { text: "Synthesize Android metadata manifest files", logIndex: 6, size: "14 KB" }
      ],
      color: "border-cyan-500 text-cyan-400 bg-cyan-950/25",
      glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]"
    },
    {
      id: 4,
      name: "Cryptographic Signing",
      shortName: "Sign",
      icon: Lock,
      artifact: "release-keystore.bin",
      subtasks: [
        { text: "Acquire private fleet key credential chains", logIndex: 7, size: "2 KB" },
        { text: "Verify SHA256 checksum digital signatures", logIndex: 7, size: "1 KB" },
        { text: "Seal final Starboard compilation packager", logIndex: 7, size: "4 KB" }
      ],
      color: "border-purple-500 text-purple-400 bg-purple-950/25",
      glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
    },
    {
      id: 5,
      name: "Console Sync Deployment",
      shortName: "Deploy",
      icon: Upload,
      artifact: "merchant-marine-release.aab",
      subtasks: [
        { text: "Publish bundle stream safely to console API", logIndex: 8, size: "4.8 MB" },
        { text: "Map Internal Testing release channels", logIndex: 8, size: "12 KB" },
        { text: "Finalize production-signed .AAB file verification", logIndex: 8, size: "100% OK" }
      ],
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/25",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    }
  ];

  // Map progress bar percentage based on step count
  const getProgressPercentage = () => {
    if (status === "complete") return 100;
    if (status === "idle") return 0;
    switch (buildLogsCount) {
      case 0: return 5;
      case 1: return 15;
      case 2: return 28;
      case 3: return 42;
      case 4: return 55;
      case 5: return 68;
      case 6: return 80;
      case 7: return 92;
      case 8: return 100;
      default: return 0;
    }
  };

  // Determine current active stage (1 to 5)
  const getActiveStageId = () => {
    if (status === "complete") return 6; // beyond all
    if (status === "idle") return 0;
    if (buildLogsCount <= 1) return 1;
    if (buildLogsCount <= 4) return 2;
    if (buildLogsCount <= 6) return 3;
    if (buildLogsCount <= 7) return 4;
    return 5;
  };

  const progressPercent = getProgressPercentage();
  const activeStageId = getActiveStageId();

  // Find active stage info (cap to last stage if complete)
  const activeStage = STAGES.find(s => s.id === activeStageId) || STAGES[4];

  // Estimated build duration remaining simulation
  const getEtaSeconds = () => {
    if (status === "complete") return 0;
    if (status === "idle") return 15;
    return Math.max(1, 15 - Math.round((progressPercent / 100) * 15));
  };

  // Animated metric data variables
  const [compilationSpeed, setCompilationSpeed] = useState(3.4);
  const [cpuUsage, setCpuUsage] = useState(34);

  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        // Random fluctuate compilation speed and cpu
        setCompilationSpeed(parseFloat((Math.random() * 4 + 3.1).toFixed(1)));
        setCpuUsage(Math.floor(Math.random() * 20 + 45));
      }, 700);
      return () => clearInterval(interval);
    } else {
      setCompilationSpeed(0);
      setCpuUsage(0);
    }
  }, [isBuilding]);

  // Proactively select the active stage for inspection
  useEffect(() => {
    if (isBuilding && activeStageId >= 1 && activeStageId <= 5) {
      setSelectedInspectStage(activeStageId);
    }
  }, [activeStageId, isBuilding]);

  return (
    <div className="bg-[#030716] border border-slate-800 rounded-xl p-4 md:p-5 space-y-4 shadow-xl">
      {/* HEADER ROW WITH INTEGRATED REAL-TIME TELEMETRY DIALS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-900 pb-3">
        <div className="space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isBuilding ? "bg-amber-400 animate-ping" : "bg-slate-600"}`} />
            <h4 className="font-mono text-[11px] uppercase tracking-wider font-extrabold text-white flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-[#D4AF37]" />
              Starboard Compiler Assembly Hub
            </h4>
          </div>
          <p className="text-[10px] text-[#D4AF37]/80 font-mono">
            ⚓ Play Accreditation Safe-Track Container: Active v2.0
          </p>
        </div>

        {/* METRICS PANEL & SECURE STAMP */}
        <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
          {isBuilding && (
            <div className="flex items-center gap-2.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-850 font-mono text-[9px] text-slate-300">
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3 text-cyan-400 animate-pulse" />
                <span>CPU: <strong className="text-white">{cpuUsage}%</strong></span>
              </div>
              <span className="text-slate-800">|</span>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>FLOW: <strong className="text-white">{compilationSpeed} MB/s</strong></span>
              </div>
              <span className="text-slate-800">|</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Clock className="h-3 w-3 animate-spin-slow" />
                <span>ETA: <strong className="font-extrabold">{getEtaSeconds()}s</strong></span>
              </div>
            </div>
          )}
          {status === "complete" && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 select-none animate-bounce">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>STBD SHA-256 SIGNED</span>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED HORIZONTAL CONNECTOR & STEPPER SYSTEM */}
      <div className="space-y-4 pt-1">
        
        {/* Dynamic Progression Header */}
        <div className="flex justify-between items-center text-[10px] font-mono leading-none">
          <span className="text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            {status === "complete" 
              ? "Assembly pipeline finished successfully!" 
              : isBuilding 
              ? `Compiling segment ${activeStageId}/5: ${activeStage.name}`
              : "Awaiting source repository dispatch payload..."}
          </span>
          <span className="text-[#D4AF37] font-extrabold bg-[#000080]/30 border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
            {progressPercent}% Complete
          </span>
        </div>

        {/* GEOMETRIC TRACK & STEPS WITH ACTIVE SAILING VESSEL */}
        <div className="relative pt-1 pb-3">
          
          {/* Background Connector Rail (Precise math alignment: left-10% to right-10%) */}
          <div className="absolute top-[18px] md:top-[22px] left-[10%] right-[10%] h-1 bg-slate-900 border border-slate-900 -translate-y-1/2 rounded-full z-0 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#000080] via-[#D4AF37] to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 45, damping: 15 }}
            />
          </div>

          {/* SAILING CARGO FREIGHTER/VESSEL BADGE */}
          {isBuilding && (
            <motion.div
              className="absolute top-[18px] md:top-[22px] z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              animate={{ left: `${10 + (progressPercent / 100) * 80}%` }}
              transition={{ type: "spring", stiffness: 40, damping: 14 }}
            >
              <div className="bg-[#000080] border border-[#D4AF37] text-[#D4AF37] px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.7)] flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-widest whitespace-nowrap animate-bounce">
                <span>🚢 SHIP CONTAINER</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              </div>
            </motion.div>
          )}

          {/* Grid of the 5 nodes with interactive indicators */}
          <div className="relative grid grid-cols-5 gap-1.5 select-none z-10">
            {STAGES.map((stage) => {
              const StageIcon = stage.icon;
              const isCompleted = activeStageId > stage.id || status === "complete";
              const isActive = activeStageId === stage.id && status === "progress";
              const isInspected = selectedInspectStage === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedInspectStage(stage.id)}
                  className="flex flex-col items-center text-center space-y-1 focus:outline-none group cursor-pointer"
                >
                  {/* Node Circular Ball */}
                  <div
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)] group-hover:scale-105"
                        : isActive
                        ? `${stage.color} ${stage.glow} scale-110 border-dashed animate-pulse`
                        : isInspected
                        ? "bg-slate-900 border-[#D4AF37] text-slate-300"
                        : "bg-slate-950 border-slate-900 text-slate-700 group-hover:border-slate-800"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-450 font-extrabold stroke-[3.5px]" />
                    ) : (
                      <StageIcon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? "animate-spin-slow text-[#D4AF37]" : ""}`} />
                    )}
                  </div>

                  {/* Bullet Labels */}
                  <span
                    className={`text-[8.5px] md:text-[10px] font-mono tracking-tighter uppercase leading-tight font-black transition-colors ${
                      isCompleted
                        ? "text-emerald-400 font-bold"
                        : isActive
                        ? "text-[#D4AF37]"
                        : isInspected
                        ? "text-slate-300 border-b border-[#D4AF37]/50"
                        : "text-slate-600 group-hover:text-slate-400"
                    }`}
                  >
                    {stage.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROGRESS BAR TRACK */}
        <div className="relative w-full h-2 bg-slate-950 rounded-lg border border-slate-900 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-[#D4AF37] to-emerald-450 rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
          />
          {isBuilding && (
            <span className="absolute top-0 bottom-0 w-20 bg-white/10 skew-x-12 animate-pulse" style={{ left: `${progressPercent - 15}%` }} />
          )}
        </div>
      </div>

      {/* DETAILED ACTIVE SUB-TASKS & ARTIFACT COMPLIANCE DRAWER */}
      <AnimatePresence mode="wait">
        {selectedInspectStage !== null && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="border-t border-slate-900 pt-3 space-y-3 text-left"
          >
            {/* INSPECT TITLE PANEL */}
            {(() => {
              const inspectStage = STAGES.find(s => s.id === selectedInspectStage)!;
              const hasPassed = activeStageId > inspectStage.id || status === "complete";
              const isRunning = activeStageId === inspectStage.id && status === "progress";

              return (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 uppercase font-black">
                        Stage {inspectStage.id} Inspection:
                      </span>
                      <span className="text-white font-bold">{inspectStage.name}</span>
                      {hasPassed ? (
                        <span className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 text-[8px] py-0.5 px-2 rounded uppercase font-bold">
                          Passed Verify
                        </span>
                      ) : isRunning ? (
                        <span className="bg-amber-950/50 border border-amber-900 text-[#D4AF37] text-[8px] py-0.5 px-2 rounded uppercase font-bold animate-pulse">
                          Active Parsing
                        </span>
                      ) : (
                        <span className="bg-slate-950 text-slate-600 text-[8px] py-0.5 px-2 rounded border border-slate-900 uppercase font-bold">
                          Queued Track
                        </span>
                      )}
                    </div>

                    <div className="text-slate-400 bg-slate-950 py-0.5 px-2 rounded border border-slate-850 text-[9px] flex items-center gap-1.5">
                      <FileCode className="h-3 w-3 text-cyan-400" />
                      <span>Artifact: <strong className="text-slate-200">{inspectStage.artifact}</strong></span>
                    </div>
                  </div>

                  {/* SUBTASK RESOLUTION GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#020510] border border-slate-900 p-2.5 rounded-lg">
                    {inspectStage.subtasks.map((task, index) => {
                      const getTaskState = () => {
                        if (status === "complete" || activeStageId > inspectStage.id) return "success";
                        if (activeStageId < inspectStage.id) return "pending";
                        // Fine-grained check of log indexes
                        if (buildLogsCount >= task.logIndex) return "success";
                        if (buildLogsCount === task.logIndex - 1) return "processing";
                        return "pending";
                      };

                      const taskState = getTaskState();

                      return (
                        <div
                          key={index}
                          className={`flex items-start justify-between gap-2 p-2 rounded transition-all duration-200 border ${
                            taskState === "success"
                              ? "bg-emerald-950/10 border-emerald-900/20 text-slate-300"
                              : taskState === "processing"
                              ? "bg-amber-950/20 border-amber-900/60 text-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.05)]"
                              : "opacity-45 bg-transparent border-transparent text-slate-500"
                          }`}
                        >
                          <div className="flex gap-1.5 items-start">
                            {taskState === "success" ? (
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            ) : taskState === "processing" ? (
                              <Loader2 className="h-3.5 w-3.5 text-[#D4AF37] animate-spin shrink-0 mt-0.5" />
                            ) : (
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-700 mt-1.5 mx-1 shrink-0" />
                            )}
                            <span className="text-[9.5px] font-mono leading-tight font-medium">
                              {task.text}
                            </span>
                          </div>
                          
                          <span className="text-[8px] font-mono bg-slate-950 px-1 py-0.5 rounded border border-slate-900 text-slate-400 uppercase select-none shrink-0 self-center">
                            {taskState === "success" ? task.size : taskState === "processing" ? "Compiling" : "Wait"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}

            {/* PIPELINE FOOTER TIPS SECTION */}
            <div className="bg-slate-950 border border-slate-900 p-2 rounded text-[9.5px] text-slate-450 flex items-start gap-1.5 font-mono">
              <Info className="h-3 w-3 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                <strong>Compliance Insight:</strong> The Starboard Play-Track architecture ensures Google Play manifest items are correctly patched bypass-ready for alternative in-app Stripe triggers. Press nodes to inspect previous or upcoming build stages.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
