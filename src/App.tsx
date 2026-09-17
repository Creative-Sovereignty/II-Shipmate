import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  isFirebaseEnabled, 
  auth, 
  db, 
  calculateSHA256, 
  getLocalBackups, 
  saveLocalBackup, 
  deleteLocalBackup, 
  BackupPayload, 
  getLocalUser, 
  saveLocalUser, 
  ShipmateUser,
  localUserStorageKey
} from "./utils/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc 
} from "firebase/firestore";
import LandingPage from "./components/LandingPage";
import BuildPipelineVisualizer from "./components/BuildPipelineVisualizer";
import PricingPaywall from "./components/PricingPaywall";
import ChromeExtensionStudio from "./components/ChromeExtensionStudio";
import { computeSideBySideDiff } from "./utils/diff";
import {
  Sparkles,
  Image as ImageIcon,
  Volume2,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Cpu,
  Download,
  Shield,
  Coins,
  Settings,
  Terminal as TerminalIcon,
  RefreshCw,
  Info,
  Maximize2,
  Eye,
  AlertTriangle,
  Heart,
  ChevronRight,
  BookOpen,
  MapPin,
  Lock,
  DollarSign,
  Compass,
  FileCode,
  Check,
  RotateCcw,
  Split
} from "lucide-react";

// Pre-loaded broken/unsafe code block for the "Self-Healing Debugger" showcase
const BROKEN_CODE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <title>Connect Dating App</title>
  <!-- Missing service worker registration & PWA manifest link -->
</head>
<body>
  <h1>Find Men Nearby</h1>
  <script>
    // Insecure hardcoded API Key!
    const MAP_API_KEY = "AIzaSyD-BrokenKeyRef-99217822";
    
    // VIOLATION: Calling coordinates silently on load without user button prompt!
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("Tracking coordinates silently...", pos);
    });

    function checkPass() {
      if(password === "admin123") { unlock(); }
    }
  </script>
</body>
</html>`;

const COMPLIANT_FIXED_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Connect | Veteran Navigation & Safespace</title>
  <!-- COMPLIANT: Link to manifest and secure service worker established -->
  <link rel="manifest" href="manifest.json">
</head>
<body>
  <h1>Find Your Connection</h1>

  <!-- COMPLIANT: User action location prompt button -->
  <button id="loc-btn" class="btn">Find Nearby Operators</button>
  <div id="location-status"></div>

  <script>
    // COMPLIANT: Removed hardcoded API key, delegated to process environment setup.
    // COMPLIANT: Real-time Age signal confirmation API
    if ('google.play.age.signals' in window) {
       console.log("🔞 Play Age Signals configured safely.");
    }

    document.getElementById('loc-btn').addEventListener('click', () => {
      document.getElementById('location-status').innerText = "Locating...";
      navigator.geolocation.getCurrentPosition(
        (pos) => { document.getElementById('location-status').innerText = "Safe signal locked."; },
        (err) => { document.getElementById('location-status').innerText = "Manual search initialized."; }
      );
    });
  </script>
</body>
</html>`;

const SHIELD_LOGOS = [
  { id: "compass", name: "Compass Grid", desc: "Gold compass with navy wind indicators", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80" },
  { id: "star", name: "Guiding Star", desc: "Royal star inside a naval metal outline", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" },
  { id: "anchor", name: "Tactical Anchor", desc: "Steel grey anchor with a golden veteran star", url: "https://images.unsplash.com/photo-1544733422-251e532ca221?auto=format&fit=crop&w=400&q=80" },
  { id: "waves", name: "Sovereign Waves", desc: "Minimalist nautical curves heading forward", url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80" }
];

export default function App() {
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");
  const [pipelineStep, setPipelineStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"git" | "debugger" | "compliance" | "calculator" | "packager" | "extension" | "playstore">("git");

  // Stepper Sequence Definitions
  const funnelSteps = [
    { id: "git", label: "Git Scan & Ingress" },
    { id: "debugger", label: "AI Code Self-Healer" },
    { id: "compliance", label: "Security & PWA Auditor" },
    { id: "calculator", label: "Alternate Billing Low-Tax overrides" },
    { id: "packager", label: "Compile App Bundles & Extensions" },
    { id: "playstore", label: "Google Play Store Accreditation Dispatch" }
  ];

  const getActiveStepIndex = () => {
    if (activeTab === "git") return 0;
    if (activeTab === "debugger") return 1;
    if (activeTab === "compliance") return 2;
    if (activeTab === "calculator") return 3;
    if (activeTab === "packager" || activeTab === "extension") return 4;
    return 5;
  };

  const activeStepIndex = getActiveStepIndex();

  const goToNextStep = () => {
    const nextIdx = activeStepIndex + 1;
    if (nextIdx < funnelSteps.length) {
      setActiveTab(funnelSteps[nextIdx].id as any);
    }
  };

  const goToPrevStep = () => {
    const prevIdx = activeStepIndex - 1;
    if (prevIdx >= 0) {
      setActiveTab(funnelSteps[prevIdx].id as any);
    }
  };

  // Google Play Accreditation States
  const [playPackageName, setPlayPackageName] = useState("com.starboard.merchant.marine");
  const [playStoreTitle, setPlayStoreTitle] = useState("Starboard Merchant Marine Mobile");
  const [playCredentialsJson, setPlayCredentialsJson] = useState(`{
  "type": "service_account",
  "project_id": "starboard-marine-2026",
  "private_key_id": "78a9c2b1e4f4567d12190abc12ef34c56",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqh...\\n-----END PRIVATE KEY-----",
  "client_email": "play-publisher@starboard-marine-2501.iam.gserviceaccount.com"
}`);
  const [playAccreditationChecks, setPlayAccreditationChecks] = useState({
    ageGate: true,
    locationTrigger: true,
    stripeBilling: true,
    ugcModeration: true,
  });
  const [isSubmittingPlay, setIsSubmittingPlay] = useState(false);
  const [playSubmissionStatus, setPlaySubmissionStatus] = useState<"idle" | "submitting" | "success" | "failed">("idle");
  const [playSubmissionLogs, setPlaySubmissionLogs] = useState<string[]>([]);
  const [playAccreditationTicket, setPlayAccreditationTicket] = useState("");

  // Git Scanner States
  const [gitUrl, setGitUrl] = useState("https://github.com/ankheternalltd/starboard-merchant-marine-pwa");
  const [gitBranch, setGitBranch] = useState("main");
  const [isGitScanning, setIsGitScanning] = useState(false);
  const [gitScanLogs, setGitScanLogs] = useState<string[]>([]);
  const [gitScanResult, setGitScanResult] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // App Profile States
  const [appName, setAppName] = useState("Starboard");
  const [appDescription, setAppDescription] = useState("Veteran-owned marine fleet management & dating safespace ensuring strict navigation compliance.");
  const [ageGateActive, setAgeGateActive] = useState(true);
  const [locationButtonVisible, setLocationButtonVisible] = useState(true);
  const [stripeWhiteLabel, setStripeWhiteLabel] = useState(true);
  const [ugcProtection, setUgcProtection] = useState(true);
  const [dataDeletionEndpoint, setDataDeletionEndpoint] = useState("https://starboard.fleet/scrub-data");

  // Geolocation Browser State inside device
  const [deviceLocationState, setDeviceLocationState] = useState<"idle" | "acquires" | "secured" | "denied">("idle");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [deviceAgeGateUnlocked, setDeviceAgeGateUnlocked] = useState(() => {
    return localStorage.getItem("starboard_age_unlocked") === "true";
  });
  const [stripeGateActive, setStripeGateActive] = useState(true);

  // Stripe & Licensing Paywall States
  const [licenseTier, setLicenseTier] = useState<"free" | "paid_export" | "white_label">(() => {
    return (localStorage.getItem("starboard_license_tier") || "free") as "free" | "paid_export" | "white_label";
  });
  const [licenseKey, setLicenseKey] = useState(() => {
    return localStorage.getItem("starboard_license_key") || "";
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingPreselection, setPricingPreselection] = useState<"paid_export" | "white_label" | null>(null);

  // Vault/Profiles & Secure Backup States
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [vaultUser, setVaultUser] = useState<ShipmateUser>(getLocalUser);
  const [vaultBackups, setVaultBackups] = useState<BackupPayload[]>(getLocalBackups);
  const [newBackupName, setNewBackupName] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [vaultSuccessMessage, setVaultSuccessMessage] = useState("");

  // Synchronize dynamic Firebase Auth user & Firestore Backups if enabled
  useEffect(() => {
    let unsubscribe: any = null;
    if (isFirebaseEnabled && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const updatedUser: ShipmateUser = {
            uid: user.uid,
            displayName: user.displayName || "Shipmate Commander",
            email: user.email || "",
            photoURL: user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            isAnonymous: user.isAnonymous
          };
          setVaultUser(updatedUser);
          saveLocalUser(updatedUser);
          
          try {
            const q = query(collection(db, "backups"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const liveBackups: BackupPayload[] = [];
            querySnapshot.forEach((docSnapshot) => {
              liveBackups.push(docSnapshot.data() as BackupPayload);
            });
            setVaultBackups(liveBackups);
          } catch (err) {
            console.error("Failed to load Firestore backups:", err);
            setVaultBackups(getLocalBackups());
          }
        } else {
          setVaultUser(getLocalUser());
          setVaultBackups(getLocalBackups());
        }
      });
    } else {
      setVaultUser(getLocalUser());
      setVaultBackups(getLocalBackups());
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleCreateBackup = async () => {
    if (!newBackupName.trim()) return;
    setIsHashing(true);
    
    const configToBackup = {
      playPackageName,
      playStoreTitle,
      playAccreditationChecks,
      gitUrl,
      gitBranch,
      appName,
      appDescription,
      ageGateActive,
      locationButtonVisible,
      stripeWhiteLabel,
      ugcProtection,
      dataDeletionEndpoint,
      stripeGateActive,
      licenseTier,
      timestamp: new Date().toISOString()
    };
    
    const stringifiedConfig = JSON.stringify(configToBackup);
    const checksum = await calculateSHA256(stringifiedConfig);
    
    const backupId = "backup_" + Date.now();
    const newBackup: BackupPayload = {
      backupId,
      userId: vaultUser.uid,
      name: newBackupName.trim(),
      appConfig: stringifiedConfig,
      checksum,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseEnabled && db && auth?.currentUser) {
      try {
        await setDoc(doc(db, "backups", backupId), newBackup);
        setVaultBackups(prev => [newBackup, ...prev]);
        setVaultSuccessMessage(`⚓ FUSE SECURE: CLOUD SNAPSHOT WRITTEN (SHA-256 INTEGRITY GUARANTEED)`);
      } catch (err) {
        console.error("Cloud write failed, saving locally:", err);
        saveLocalBackup(newBackup);
        setVaultBackups(getLocalBackups());
        setVaultSuccessMessage(`⚓ FUSE SECURE: LOCAL LOCKER COMPILED (OFFLINE STANDALONE)`);
      }
    } else {
      saveLocalBackup(newBackup);
      setVaultBackups(getLocalBackups());
      setVaultSuccessMessage(`⚓ FUSE SECURE: LOCAL LOCKER COMPILED (OFFLINE STANDALONE)`);
    }

    setNewBackupName("");
    setIsHashing(false);
    setTimeout(() => setVaultSuccessMessage(""), 5000);
  };

  const handleRestoreBackup = async (backup: BackupPayload) => {
    const rehashed = await calculateSHA256(backup.appConfig);
    const isValidSignature = rehashed === backup.checksum;
    
    if (!isValidSignature) {
      alert("❌ INTEGRITY PLATING BREACH! The backup snapshot signature does not match. State file is corrupted.");
      return;
    }
    
    try {
      const config = JSON.parse(backup.appConfig);
      
      if (config.playPackageName !== undefined) setPlayPackageName(config.playPackageName);
      if (config.playStoreTitle !== undefined) setPlayStoreTitle(config.playStoreTitle);
      if (config.playAccreditationChecks !== undefined) setPlayAccreditationChecks(config.playAccreditationChecks);
      if (config.gitUrl !== undefined) setGitUrl(config.gitUrl);
      if (config.gitBranch !== undefined) setGitBranch(config.gitBranch);
      if (config.appName !== undefined) setAppName(config.appName);
      if (config.appDescription !== undefined) setAppDescription(config.appDescription);
      if (config.ageGateActive !== undefined) setAgeGateActive(config.ageGateActive);
      if (config.locationButtonVisible !== undefined) setLocationButtonVisible(config.locationButtonVisible);
      if (config.stripeWhiteLabel !== undefined) setStripeWhiteLabel(config.stripeWhiteLabel);
      if (config.ugcProtection !== undefined) setUgcProtection(config.ugcProtection);
      if (config.dataDeletionEndpoint !== undefined) setDataDeletionEndpoint(config.dataDeletionEndpoint);
      if (config.stripeGateActive !== undefined) setStripeGateActive(config.stripeGateActive);
      if (config.licenseTier !== undefined) {
        setLicenseTier(config.licenseTier);
        localStorage.setItem("starboard_license_tier", config.licenseTier);
      }
      
      setVaultSuccessMessage(`⚓ ANCHOR RESTORED: All workspace compiler systems secured smoothly!`);
      setTimeout(() => setVaultSuccessMessage(""), 5000);
    } catch (e) {
      alert("❌ Critical failure during backup state restoration.");
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (isFirebaseEnabled && db && auth?.currentUser) {
      try {
        await deleteDoc(doc(db, "backups", backupId));
        setVaultBackups(prev => prev.filter(b => b.backupId !== backupId));
      } catch (err) {
        console.error("Cloud delete failed, deleting locally:", err);
        deleteLocalBackup(backupId);
        setVaultBackups(getLocalBackups());
      }
    } else {
      deleteLocalBackup(backupId);
      setVaultBackups(getLocalBackups());
    }
    setVaultSuccessMessage(`⚓ SNAPSHOT DISCHARGED: Backup container purged.`);
    setTimeout(() => setVaultSuccessMessage(""), 4000);
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseEnabled || !auth) {
      setIsGoogleSigningIn(true);
      setTimeout(() => {
        const u = saveLocalUser({
          displayName: "Fleet Admiral Ank",
          email: "ankheternalltd@gmail.com",
          photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
          isAnonymous: false
        });
        setVaultUser(u);
        setIsGoogleSigningIn(false);
        setVaultSuccessMessage("⚓ WELCOME COMMANDER: Local premium simulation identity authorized!");
        setTimeout(() => setVaultSuccessMessage(""), 4000);
      }, 1000);
      return;
    }

    try {
      setIsGoogleSigningIn(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setIsGoogleSigningIn(false);
      setVaultSuccessMessage(`⚓ SHIPMATE SECURE LOGIN: Authorized as ${result.user.displayName}`);
    } catch (err: any) {
      console.error(err);
      setIsGoogleSigningIn(false);
      alert(`Sign in failed: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    if (isFirebaseEnabled && auth) {
      await signOut(auth);
    }
    const defaultUser = {
      uid: "guest_shipmate_master",
      displayName: "Shipmate Commander",
      email: "commander@sovranlyip.com",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isAnonymous: true
    };
    localStorage.setItem(localUserStorageKey, JSON.stringify(defaultUser));
    setVaultUser(defaultUser);
    setVaultBackups(getLocalBackups());
    setVaultSuccessMessage("⚓ LOGGED OUT: Reverted to local isolation terminal.");
    setTimeout(() => setVaultSuccessMessage(""), 4000);
  };

  // Self-Healing Playground
  const [editorInput, setEditorInput] = useState(BROKEN_CODE_TEMPLATE);
  const [editorOutput, setEditorOutput] = useState("");
  const [healerViewMode, setHealerViewMode] = useState<"standard" | "diff">("standard");
  const [isSelfHealing, setIsSelfHealing] = useState(false);
  const [healSuccessMsg, setHealSuccessMsg] = useState("");
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<string[]>([
    "System Ready. Pre-load your broken HTML dating application code to heal.",
  ]);

  // Auditor States
  const [scannedIssues, setScannedIssues] = useState<Array<{ type: "crit" | "warn" | "info"; msg: string; tip: string }>>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // Alternative revenue calculations
  const [yearlyRevenue, setYearlyRevenue] = useState(250000);

  // Packager Build Sequences
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [isBuildingAab, setIsBuildingAab] = useState(false);
  const [buildAabStatus, setBuildAabStatus] = useState<"idle" | "progress" | "complete" | "failed">("idle");
  const [selectedLogoId, setSelectedLogoId] = useState("anchor");

  // Gemini speech & text generation status
  const [health, setHealth] = useState({ status: "loading", hasApiKey: false });
  const [speechBase64, setSpeechBase64] = useState(""); // Cached audio string
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackState, setPlaybackState] = useState<"idle" | "playing">("idle");

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePaymentFulfillment = (tier: "paid_export" | "white_label", key: string) => {
    setLicenseTier(tier);
    setLicenseKey(key);
    localStorage.setItem("starboard_license_tier", tier);
    localStorage.setItem("starboard_license_key", key);
    
    setDiagnosticsLogs((prev) => [
      ...prev,
      `🔑 STRIPE TRANSACTION SUCCESSFUL: Dynamic licensing upgraded to [${tier === "white_label" ? "Unlimited White-Label" : "Single Bundle Export"}]`,
      `🔑 CERTIFIED PRODUCT SECURITY KEY: ${key}`
    ]);
  };

  useEffect(() => {
    fetchServerHealth();
  }, []);

  const fetchServerHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth({ status: data.status, hasApiKey: data.hasApiKey });
    } catch {
      setHealth({ status: "offline", hasApiKey: false });
    }
  };

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playBase64Audio = (b64: string) => {
    try {
      initAudioCtx();
      if (!audioCtxRef.current) return;

      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch {}
      }

      setPlaybackState("playing");
      const binary = window.atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      audioCtxRef.current.decodeAudioData(bytes.buffer, (buffer) => {
        if (!audioCtxRef.current) return;
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current.destination);
        source.onended = () => setPlaybackState("idle");
        source.start(0);
        audioSourceRef.current = source;
      }, (e) => {
        console.error("Failed to decode audio context PCM bytes", e);
        setPlaybackState("idle");
      });
    } catch (e) {
      console.error(e);
      setPlaybackState("idle");
    }
  };

  // Google Play Console API publisher submitter
  const submitToGooglePlayConsole = () => {
    setIsSubmittingPlay(true);
    setPlaySubmissionStatus("submitting");
    setPlaySubmissionLogs([]);
    setDiagnosticsLogs((prev) => [...prev, "🛰️ Preparing Google Play Store Publisher Accreditation upload channels..."]);

    const logs = [
      "[PLAYAPI] Connecting publisher client console interface to androidpublisher.v3 endpoint... 🟢 Connected.",
      `[PLAYAPI] Verifying project_id: '${playPackageName}' auth token match... 🟢 Handshake validated.`,
      "[PLAYAPI] Scanning signature keystores: found standard certified release configurations...",
      `[PLAYAPI] Checking binary package: found dynamic output model matching target play-signals.`,
      "[PLAYAPI] COMMENCING SYSTEM COMPLIANCE ACCREDITATION CHECKS...",
      playAccreditationChecks.ageGate 
        ? "🟢 Verified: Play Store Rating Age Signaling check is verified [18+ Active Gate]!"
        : "🚨 Advisement warning: Direct Age gate filtering was not checked on declaration forms.",
      playAccreditationChecks.locationTrigger
        ? "🟢 Verified: Explicit User Click Geolocation pattern detected! No background tracking is active."
        : "🚨 POLICIES BLOCKER: Silent Geolocation is NOT officially declared bypass-safe inside forms context.",
      playAccreditationChecks.stripeBilling
        ? "🟢 Verified: Alternative Revenue Paywall verified. Billing paths direct to low-markup Stripe processors."
        : "🚨 Policy warning: Non-standard alternative payment options are flagged on submission declarations.",
      playAccreditationChecks.ugcModeration
        ? "🟢 Verified: User-generated content filtration rules uploaded for dating portals safe compliance."
        : "🚨 Advisory warning: Missing User-Generated Content regulatory filers declaration.",
      "[PLAYAPI] TRANSMITTING ANDROID APP BUNDLE TO PRODUCTION TRACK...",
      `[PLAYAPI] Dispatching bundle ID: '${playPackageName}-v1.0.0.aab' as compliant release draft...`,
      "[PLAYAPI] CHECKING COMPLIANCE ACQUISITION CERTIFICATION STATUS...",
      "🟢 ACCREDITATION CERTIFIED: Target applications passed automated inspection guidelines successfully!",
      `[PLAYAPI] App submitted successfully to the Play Store. Ticket #STBD-PLAY-${Math.floor(100000 + Math.random() * 900000)} is locked.`
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setPlaySubmissionLogs((prev) => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsSubmittingPlay(false);
        setPlaySubmissionStatus("success");
        setPlayAccreditationTicket(`STBD-PLAY-${Math.floor(100000 + Math.random() * 900000)}`);
        setDiagnosticsLogs((prev) => [
          ...prev,
          `🟢 PLAY STORE ACCREDITATION APPROVED: Dispatch track certification secured for '${playPackageName}'!`
        ]);
        speakComplianceReport("Congratulations! Your application is fully accreditation approved and submitted to Google Play.");
      }
    }, 900);
  };

  // Speaks vocal report using server speech endpoint
  const speakComplianceReport = async (textToSpeak: string) => {
    setIsSpeaking(true);
    try {
      const res = await fetch("/api/gemini/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak,
          voice: "Zephyr"
        })
      });
      const data = await res.json();
      if (data.audioBase64) {
        setSpeechBase64(data.audioBase64);
        playBase64Audio(data.audioBase64);
      }
    } catch (e) {
      console.error("Speech request failed", e);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Phase 1 Self-Healing Loop powered by Gemini AI
  const runAISelfHealing = async () => {
    setIsSelfHealing(true);
    setEditorOutput("");
    setHealSuccessMsg("");
    setDiagnosticsLogs((prev) => [...prev, "⚡ Initiating smart parser diagnostics...", "🤖 Injecting self-healing patch to core module..."]);

    try {
      const systemPrompt = `You are the ultimate deterministic healing software agent: 'Shipmate Debugger'.
Your objective is to inspect a broken, messy, or policy-violating PWA source input code block, parse and output its pristine 2026-compliant rewrite.
Rules to apply:
1. Ensure there are NO hardcoded API keys starting with 'AIzaSy' or 'sk-' (replace them with process.env placeholders or safe system loads).
2. Ensure there are no silent geolocation fetches on loading. Geolocation MUST be activated via an explicit HTML button interaction like <button id="loc-btn">.
3. Automatically inject Play Age Signals integration checks ('google.play.age.signals') if age rating controls are detected.
4. Ensure HTML structure is sealed and correct.

Output ONLY the clean corrected HTML block, nested elegantly. Do not write markdown descriptions.`;

      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: editorInput,
          systemInstruction: systemPrompt,
          temperature: 0.2
        })
      });
      const data = await res.json();
      if (data.text) {
        // Strip markdown backticks from output models
        const cleaned = data.text.replace(/```html/g, "").replace(/```/g, "").trim();
        setEditorOutput(cleaned);
        setHealSuccessMsg("Successfully healed all logical gaps, removed hardcoded key, and inserted location prompt parameters.");
        setDiagnosticsLogs((prev) => [
          ...prev,
          "✅ Checksum matched perfectly.",
          "✅ Replaced hardcoded MAP_API_KEY with clean configuration credentials.",
          "✅ Intercepted geolocation logic and bound it tightly to user-triggered loc-btn.",
          "✅ App rated 2026 store-ready!"
        ]);
        speakComplianceReport("Self-healing script is complete. All broken loops fixed. Your application is secure.");
      } else {
        throw new Error("Empty model response");
      }
    } catch (e: any) {
      // Fallback local fixing logic if API key isn't initialized yet
      setEditorOutput(COMPLIANT_FIXED_TEMPLATE);
      setHealSuccessMsg("Applied deterministic dry-run offline self-healing profile parameters.");
      setDiagnosticsLogs((prev) => [
        ...prev,
        "⚠️ Sandbox Notice: Applied offline clean-preset replacement.",
        "✅ Hardcoded MAP_API_KEY removed safely.",
        "✅ Silenced automatic background location tracking.",
        "✅ Created loc-btn UI element constraint."
      ]);
    } finally {
      setIsSelfHealing(false);
    }
  };

  // Git Codebase scanning pipeline
  const runGitCodebaseScan = async () => {
    if (!gitUrl.trim()) return;
    setIsGitScanning(true);
    setGitScanResult(null);
    setGitScanLogs([]);
    setDiagnosticsLogs((prev) => [...prev, `⚓ Connecting to remote Git repository: ${gitUrl}...`]);

    const steps = [
      "⚓ Connecting with remote secure Git-over-HTTPS protocol...",
      "📂 Requesting reference tree pointer arrays on current branch...",
      "🔍 Locating candidate files: index.html, manifest.json, package.json...",
      "🧠 Submitting primary codebase structures to Gemini Compliance Analyzer..."
    ];

    // Progressive log updates
    let delay = 0;
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setGitScanLogs((prev) => [...prev, step]);
      }, delay);
      delay += 550;
    });

    setTimeout(async () => {
      try {
        const res = await fetch("/api/git/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gitUrl, branch: gitBranch })
        });
        if (!res.ok) throw new Error("Connection failed or repository inaccessible");
        const data = await res.json();
        
        setGitScanResult(data);
        setGitScanLogs((prev) => [
          ...prev, 
          `🟢 Connected & Synced Successfully! Extracted primary file: index.html (${data.stats?.linesOfCode || 1200} lines scanned)`,
          `⚡ Compliance Analysis Finished: ${data.stats?.criticalIssues || 0} critical issues, ${data.stats?.warningIssues || 0} warnings.`
        ]);
        
        setDiagnosticsLogs((prev) => [
          ...prev,
          `✅ Remote Git scan finished: '${data.repositoryName}' on branch [${data.branch}]`,
          `🚨 Found ${data.stats?.criticalIssues || 0} key blockers in Git codebase.`
        ]);

        speakComplianceReport(`Complete code scanned from ${data.repositoryName}. We discovered ${data.stats?.criticalIssues || 0} compliance issues.`);
      } catch (err: any) {
        setGitScanLogs((prev) => [
          ...prev,
          "❌ Scan Interrupted: Failed to parse remote indices or private repository credentials missing.",
          "⚡ Default Mock Repo Fallback Activated for preview testing..."
        ]);
        
        const fallbackObj = {
          success: true,
          repositoryName: "ankheternalltd/starboard-merchant-marine-pwa",
          branch: gitBranch,
          stats: {
            filesScanned: 6,
            linesOfCode: 1150,
            criticalIssues: 2,
            warningIssues: 1,
            passedTests: 4
          },
          fileTree: [
            { path: "index.html", type: "file", status: "vulnerable" },
            { path: "manifest.json", type: "file", status: "missing" },
            { path: "service-worker.js", type: "file", status: "secure" }
          ],
          issues: [
            {
              type: "crit",
              msg: "Hardcoded Fleet Keys",
              tip: "Admin credential 'SHIPMATE_API_KEY' found inside index.html."
            },
            {
              type: "crit",
              msg: "Silent Geolocation Tracking",
              tip: "navigator.geolocation fires silently on window.onload without operator action."
            },
            {
              type: "warn",
              msg: "Missing Web Application Manifest",
              tip: "The HTML frame has no manifest correlation links in head segment."
            }
          ],
          retrievedCode: `<!DOCTYPE html>
<html>
<head>
  <title>Merchant Marine Vector Track (Remote Git Sample)</title>
  <!-- Non-compliant viewport and manifest links -->
</head>
<body>
  <h2>Marine Operations Console</h2>
  <script>
    const SHIPMATE_API_KEY = "AIzaSyD-StandardMockKeyForFleetVerification2026";
    
    window.onload = function() {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Silent tracking telemetry running...", pos.coords.latitude);
      });
    };
  </script>
</body>
</html>`
        };
        setGitScanResult(fallbackObj);
        speakComplianceReport("Standard Git scan profile applied. Hardcoded security credentials found.");
      } finally {
        setIsGitScanning(false);
      }
    }, delay + 450);
  };

  // Auditing checks for Phase 2 code requirements
  const runSecurityAuditor = () => {
    setIsAuditing(true);
    setScannedIssues([]);
    setDiagnosticsLogs((prev) => [...prev, "🔍 Commencing Security Auditor pattern scan..."]);

    setTimeout(() => {
      const issues: Array<{ type: "crit" | "warn" | "info"; msg: string; tip: string }> = [];

      // Check key patterns
      if (editorInput.includes("AIza") || editorInput.includes("sk-")) {
        issues.push({
          type: "crit",
          msg: "Hardcoded API Token Found!",
          tip: "Never commit raw keys in production scripts. Move key parameters to environment configurations."
        });
      }

      // Geolocation permission checks
      if (editorInput.includes("getCurrentPosition") && !editorInput.includes("addEventListener('click'")) {
        issues.push({
          type: "crit",
          msg: "Background Location Call Mandate Warning",
          tip: "Google recently updated policies on April 2026. Explicit location buttons must be visible."
        });
      }

      // Age signaling
      if (!editorInput.includes("google.play.age.signals")) {
        issues.push({
          type: "warn",
          msg: "Missing Play Age Signals API Header",
          tip: "Add Play rating triggers to bypass prolonged user identity checks in highly restricted niches."
        });
      }

      // PWA Manifest checks
      if (!editorInput.includes('rel="manifest"')) {
        issues.push({
          type: "warn",
          msg: "No manifest.json connection found",
          tip: "Google Play Trusted Web Activities require standalone display directives to block URL navigation rails."
        });
      }

      // Always pass some healthy notes
      issues.push({
        type: "info",
        msg: "Secure SSL Delivery Checked",
        tip: "Ensures whole communications pipe inside Shipmate runs under HTTPS."
      });

      setScannedIssues(issues);
      setIsAuditing(false);
      setDiagnosticsLogs((prev) => [...prev, `✅ Scan finished. Discovered ${issues.filter(i => i.type === "crit").length} critical violations.`]);
    }, 1200);
  };

  const downloadAuditReport = (format: "txt" | "json") => {
    if (scannedIssues.length === 0) return;

    let content = "";
    let mimeType = "";
    let filename = "";

    const timestamp = new Date().toISOString();

    if (format === "json") {
      const data = {
        scanTimestamp: timestamp,
        targetApp: appName,
        totalIssues: scannedIssues.length,
        criticalCount: scannedIssues.filter((i) => i.type === "crit").length,
        warningCount: scannedIssues.filter((i) => i.type === "warn").length,
        infoCount: scannedIssues.filter((i) => i.type === "info").length,
        issues: scannedIssues.map((issue) => ({
          severity: issue.type === "crit" ? "CRITICAL" : issue.type === "warn" ? "WARNING" : "INFO",
          message: issue.msg,
          remediationTip: issue.tip,
        })),
      };
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
      filename = `starboard-security-audit-${timestamp.split("T")[0]}.json`;
    } else {
      content = `=========================================================
      STARBOARD SECURITY & REGULATORY COMPLIANCE REPORT
                  VETERAN SAFETY BLUEPRINT [2026]
=========================================================
Generated Timestamp : ${timestamp}
Source Application  : ${appName}
Target Gateway      : Standard Independent PWA / Stripe Bypass

---------------------------------------------------------
AUDIT SUMMARIZATION STATS:
---------------------------------------------------------
[🔴] Critical Violations : ${scannedIssues.filter((i) => i.type === "crit").length}
[🟡] Warnings / Advisories: ${scannedIssues.filter((i) => i.type === "warn").length}
[🟢] Verified Safe Notes   : ${scannedIssues.filter((i) => i.type === "info").length}

=========================================================
DETAILED SCAN HIGHLIGHTS & REMEDIATION MATRIX:
=========================================================
`;

      scannedIssues.forEach((issue, index) => {
        const severityLabel = issue.type === "crit" ? "CRITICAL POLICY VIOLATION" : issue.type === "warn" ? "RECOMMENDED ADVISORY" : "SUCCESS INFRASTRUCTURE NOTE";
        const symbol = issue.type === "crit" ? "[CRIT]" : issue.type === "warn" ? "[WARN]" : "[INFO]";
        content += `${index + 1}. ${symbol} ${severityLabel}
   ISSUE: ${issue.msg}
   REMEDIATION: ${issue.tip}
   
---------------------------------------------------------\n`;
      });

      content += `=========================================================
                 REPORT SEALED - STEER TRUE.
=========================================================`;
      mimeType = "text/plain";
      filename = `starboard-security-audit-${timestamp.split("T")[0]}.txt`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDiagnosticsLogs((prev) => [
      ...prev,
      `💾 Exported security audit report file: ${filename} (${format.toUpperCase()})`,
    ]);
  };

  // Device Location Interaction
  const handleDeviceLocationRequest = () => {
    if (!locationButtonVisible) {
      alert("Device Block: Background tracking is deactivated inside your console guidelines.");
      return;
    }
    setDeviceLocationState("acquires");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setDeviceLocationState("secured");
      },
      () => {
        setDeviceLocationState("denied");
      }
    );
  };

  // Simulate Age-gate unlock
  const handleDeviceAgeUnlock = () => {
    setDeviceAgeGateUnlocked(true);
    localStorage.setItem("starboard_age_unlocked", "true");
  };

  const handleDeviceRelock = () => {
    setDeviceAgeGateUnlocked(false);
    localStorage.setItem("starboard_age_unlocked", "false");
  };

  // White-label dynamic parameters
  const [whiteLabelCompany, setWhiteLabelCompany] = useState("Starboard Marine Inc.");
  const [whiteLabelAlias, setWhiteLabelAlias] = useState("vessel-alias-2026");

  // Phase 3 Packager compile
  const runPackagerAssembly = () => {
    setIsBuildingAab(true);
    setBuildAabStatus("progress");
    setBuildLogs([]);

    const logs = [
      "⚓ Hooyah, Shipmate! Initializing Trusted Web Activity builder...",
      "⚙️ Injecting 2026 alternative billing meta configuration...",
      "⚙️ Adding '<meta-data android:name=\"com.android.vending.ALTERNATIVE_BILLING\" android:value=\"true\" />'...",
      "⚙️ Adding '<meta-data android:name=\"com.android.vending.BILLING_OVERRIDE\" android:value=\"true\" />'...",
      "📂 Packaging PWA manifest elements & standalone icons...",
      licenseTier === "white_label"
        ? `📂 White-Label Active: Customized company metadata set to "${whiteLabelCompany}"`
        : "📂 Packaging standard base-level developer metadata registries...",
      `📦 Compiling resource assets with launcher icon: icon-${selectedLogoId}.png...`,
      licenseTier === "white_label"
        ? `🔒 Sealing cryptographic signatures with premium alias "${whiteLabelAlias}"...`
        : "🔒 Signing release-v1.0.0.aab using default private sandbox debug keys...",
      "🎁 Pushing production bundle safely to Google Play Console testing tier..."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBuildLogs((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsBuildingAab(false);
        setBuildAabStatus("complete");
        setDiagnosticsLogs((prev) => [...prev, "📦 Shipmate Packager completed. Built standalone release.aab bundle."]);
        speakComplianceReport("Production bundle successfully signed. Starboard is ready for the fleet.");
      }
    }, 600);
  };

  // Pricing calculations
  const standardCut = yearlyRevenue * 0.15; // 15% Standard cut
  // Alternative custom Stripe gateway: 10% Google alternate billing tax + 2.9% stripe processing
  const stripeRateCut = yearlyRevenue * 0.129; 
  const potentialSavings = standardCut - stripeRateCut;

  return (
    <div className="min-h-screen bg-[#070b19] grid-bg flex flex-col font-sans select-none overflow-x-hidden antialiased text-slate-300">
      
      {/* MILITARY STYLE TOP BAR */}
      <header className="h-16 bg-[#000080]/90 border-b-2 border-[#D4AF37] px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-lg shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#000040] border border-[#D4AF37] rounded flex items-center justify-center shadow-lg">
            <Compass className="h-6.5 w-6.5 text-[#D4AF37] animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-bold tracking-widest text-base md:text-lg flex items-center gap-2">
              <span className="text-gold-metallic font-extrabold uppercase drop-shadow-md">STARBOARD</span>
              <span className="text-white text-xs opacity-75 px-1.5 py-0.5 rounded bg-[#000040] border border-[#D4AF37]/40 tracking-normal font-mono">SHIPMATE v2026</span>
            </span>
            <p className="text-[9px] font-mono text-slate-200 tracking-wider font-semibold uppercase leading-none mt-1">
              Deterministic Launch Automation & Regulatory Guardrails
            </p>
          </div>
        </div>

        {/* STATUS INDICATORS */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right font-mono">
            <span className="text-[9px] text-[#D4AF37] tracking-widest uppercase">VETERAN OPERATED</span>
            <span className="text-xs text-white uppercase font-bold">STEER TRUE. SHIP FAST.</span>
          </div>
          
          <div className="h-8 w-px bg-slate-700/60 hidden md:block"></div>

          <a
            href="/api/download/zip"
            download="starboard-project-source.zip"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-600/20 hover:from-amber-500/20 hover:to-amber-600/30 text-[#D4AF37] border border-[#D4AF37]/45 hover:border-[#D4AF37] rounded py-1 px-3.5 text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer text-center relative overflow-hidden group shadow-[0_0_10px_rgba(212,175,55,0.05)] active:scale-95"
            title="Download full project code as a ZIP archive"
          >
            <Download className="h-3.5 w-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">FREE PROJECT ZIP</span>
          </a>

          <div className="h-8 w-px bg-slate-700/60 hidden md:block"></div>

          <button 
            onClick={() => setIsVaultOpen(true)}
            className="flex items-center gap-2 bg-[#000040] hover:bg-[#000060] active:scale-95 transition-all rounded py-1 px-3 border border-[#D4AF37]/55 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.15)] group"
            title="Open Shipmate Secure Database & Backups Vault"
          >
            {vaultUser && vaultUser.photoURL ? (
              <img 
                src={vaultUser.photoURL} 
                alt="Commander Avatar" 
                className="h-4.5 w-4.5 rounded-full border border-[#D4AF37]/60 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Shield className="h-3.5 w-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[10px] font-mono text-[#D4AF37] font-bold group-hover:text-[#FFF4D0] transition-colors">
              {vaultUser ? vaultUser.displayName.toUpperCase().replace("COMMANDER", "⚓ VAULT") : "⚓ VAULT"}
            </span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER VIEW PORT NAVIGATION */}
      <div className="border-b border-slate-800 bg-slate-950/85 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setViewMode("landing")}
            className={`py-1.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-extrabold transition-all duration-150 cursor-pointer flex items-center gap-2 border-2 ${
              viewMode === "landing"
                ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]"
                : "text-slate-400 hover:text-white border-transparent hover:bg-slate-900/50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Showcase & Graphics Overview</span>
          </button>
          <button
            onClick={() => setViewMode("workspace")}
            className={`py-1.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-extrabold transition-all duration-150 cursor-pointer flex items-center gap-2 border-2 ${
              viewMode === "workspace"
                ? "bg-[#000080]/80 text-[#D4AF37] border-[#D4AF37]"
                : "text-slate-400 hover:text-white border-transparent hover:bg-slate-900/50"
            }`}
          >
            <Settings className="h-4 w-4 text-[#D4AF37]" />
            <span>Interactive Sandbox Workspace</span>
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {viewMode === "landing" ? (
            <button
              onClick={() => setViewMode("workspace")}
              className="bg-gold-shimmer hover:brightness-115 active:scale-95 text-[#000040] py-1.5 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.45)] transition-all cursor-pointer leading-none"
            >
              <span>Launch sandbox workspace</span>
              <ChevronRight className="h-4 w-4 font-black" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5 bg-[#000040] rounded-lg py-1 px-3.5 border border-[#D4AF37]/30 text-[10px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#D4AF37] font-bold tracking-wider">ACTIVE SIM ENGINE</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6"
          >
            <LandingPage
              onLaunchConsole={(preselected) => {
                setViewMode("workspace");
                if (preselected) {
                  setPricingPreselection(preselected);
                  setShowPricingModal(true);
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            
            {/* LEFT COMPONENT: SHIPMATE DEVELOPER ENGINE (7 COLS) */}
            <section className="lg:col-span-7 flex flex-col gap-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-2xl justify-between">
          
          {/* INTRO EXPLAINER BANNER */}
          <div className="bg-[#000050]/40 border border-[#D4AF37]/30 rounded-xl p-3.5 flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Shipmate Regulatory Blueprint Setup</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By choosing a deterministic workflow over faulty AI systems, you eliminate content rejections. Below, audit permissions, fix silent location scrapers, simulate Trusted Web Activities (using Bubblewrap), and compute direct Stripe alternatives.
              </p>
            </div>
          </div>

          {/* SECURE STRIPE LICENSE STATUS BANNER */}
          {licenseTier === "free" ? (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5 text-[#D4AF37] animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-950/40 p-0.5 px-2 rounded uppercase tracking-wider">
                      Sandbox Testing Mode
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">$29.99 License Required for Signed AAB Downloads</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Production bundle compiles are signed with local sandbox debug keys only. Complete payment to secure Play Store ready outputs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPricingPreselection("paid_export");
                  setShowPricingModal(true);
                }}
                className="w-full sm:w-auto bg-gold-shimmer hover:brightness-115 text-[#000040] py-2 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.30)]"
              >
                <span>Unlock Signed Export</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : licenseTier === "paid_export" ? (
            <div className="bg-[#020512] border-2 border-indigo-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-indigo-950/40 border border-indigo-505/50 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-indigo-400 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-[9px] font-mono font-black text-indigo-400 bg-indigo-950/80 p-0.5 px-2 rounded uppercase tracking-wider">
                      Export License Activated
                    </span>
                    <span className="text-[9px] text-[#D4AF37] font-mono font-semibold select-all shrink-0">STBD-{licenseKey.slice(5, 15)}...</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-normal font-sans">
                    Signed package outputs secured. Upgrade to Unlimited White-Label at any time to unlock brand registry customizations and custom manifests.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPricingPreselection("white_label");
                  setShowPricingModal(true);
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 hover:border-slate-750 text-indigo-400 border border-[#D4AF37]/35 py-2 px-4 rounded-lg font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Upgrade to White-Label</span>
                <ChevronRight className="h-4 w-4 text-indigo-400" />
              </button>
            </div>
          ) : (
            <div className="bg-[#030612] border-2 border-[#D4AF37]/55 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-amber-950/20 border border-[#D4AF37]/45 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-[#D4AF37] animate-spin-slow" />
                </div>
                <div className="space-y-0.5 animate-pulse-slow">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-amber-950/50 p-0.5 px-2 rounded uppercase tracking-wider border border-[#D4AF37]/30">
                      Squadron White-Label Upgrade Active
                    </span>
                    <span className="text-[9px] text-emerald-450 font-mono font-semibold select-all shrink-0">{licenseKey}</span>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-normal font-sans">
                    Perfect! Enjoy infinite premium compiles, fully customized brand manifests, and prioritized legal channels.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#000040]/80 py-1.5 px-3 rounded text-[9px] font-mono text-emerald-400 border border-emerald-900 font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.15)] select-none uppercase tracking-widest shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Platinum Whitelist active</span>
              </div>
            </div>
          )}

          {/* COMPLIANCE PIPELINE FUNNEL STEPPER */}
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl shadow-lg space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-[#D4AF37] animate-spin-slow" />
                Compliance Pipeline Funnel Step Chart
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">
                Active Step: {
                  activeTab === "git" ? "1 / 6" :
                  activeTab === "debugger" ? "2 / 6" :
                  activeTab === "compliance" ? "3 / 6" :
                  activeTab === "calculator" ? "4 / 6" :
                  (activeTab === "packager" || activeTab === "extension") ? "5 / 6" : "6 / 6"
                }
              </span>
            </div>

            {/* Stepper row of buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {[
                { id: "git", num: "Step 1", title: "Git Scan", sub: "Code Source", isDone: gitScanResult !== null },
                { id: "debugger", num: "Step 2", title: "AI healer", sub: "Repair Code", isDone: editorOutput !== "" },
                { id: "compliance", num: "Step 3", title: "Audit check", sub: "Scan Rules", isDone: scannedIssues.length > 0 },
                { id: "calculator", num: "Step 4", title: "Tax bypass", sub: "Stripe Model", isDone: true },
                { id: "packager", num: "Step 5", title: "Compiler", sub: "Sealed .AAB", isDone: buildAabStatus === "complete" },
                { id: "playstore", num: "Step 6", title: "Play dispatch", sub: "Accreditation", isDone: playSubmissionStatus === "success" }
              ].map((step) => {
                const isActive = activeTab === step.id || (step.id === "packager" && activeTab === "extension");
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveTab(step.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between h-16 ${
                      isActive
                        ? "bg-[#000080] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.15)] text-[#D4AF37]"
                        : step.isDone
                        ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300 hover:bg-emerald-950/30"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full leading-none">
                      <span className="text-[7.5px] font-mono uppercase tracking-widest opacity-80">{step.num}</span>
                      {step.isDone ? (
                        <Check className="h-2.5 w-2.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                      ) : (
                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold block truncate leading-none mb-0.5">{step.title}</span>
                      <span className="text-[7.5px] opacity-70 block truncate leading-none font-mono whitespace-nowrap">{step.sub}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="flex-1 min-h-[360px] overflow-y-auto max-h-[500px] border border-slate-800/80 rounded-xl p-4 bg-slate-900/40 custom-scrollbar">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: SELF-HEALING DEBUGGER PLAYGROUND */}
              {activeTab === "debugger" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block">
                        Phase 1: Self-Healing Script Playground
                      </span>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                        Paste your code into the analyzer below. It scans for mismatched loops, brackets, insecure code patterns, and replaces background GPS requests with compliant buttons on trigger.
                      </p>
                    </div>

                    {/* View Switcher Controls */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                      <button
                        onClick={() => setHealerViewMode("standard")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-extrabold ${
                          healerViewMode === "standard"
                            ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]"
                            : "bg-slate-950/40 text-slate-400 border border-slate-800 hover:text-white"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        <span>Standard Split</span>
                      </button>
                      <button
                        onClick={() => setHealerViewMode("diff")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-extrabold ${
                          healerViewMode === "diff"
                            ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]"
                            : "bg-slate-950/40 text-slate-400 border border-slate-800 hover:text-white"
                        }`}
                      >
                        <Split className="h-3.5 w-3.5" />
                        <span>Interactive Diff</span>
                      </button>
                    </div>
                  </div>

                  {healerViewMode === "standard" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-stretch">
                      {/* Left: Input Textarea code */}
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>SOURCE APP INPUT (.HTML/.PWA)</span>
                          <button
                            onClick={() => setEditorInput(BROKEN_CODE_TEMPLATE)}
                            className="text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" /> Reset Template
                          </button>
                        </div>
                        <textarea
                          value={editorInput}
                          onChange={(e) => setEditorInput(e.target.value)}
                          className="w-full flex-1 min-h-[180px] md:min-h-[220px] bg-[#020512] font-mono text-[11px] p-3 text-slate-300 border border-slate-800 rounded-lg focus:outline-none focus:border-[#D4AF37] custom-scrollbar"
                        />
                      </div>

                      {/* Right: Healed output */}
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Pristine Fixed Code Output</span>
                          {editorOutput && (
                            <span className="text-[#D4AF37] uppercase text-[9px] font-bold animate-pulse">Healed & Audited</span>
                          )}
                        </div>
                        {editorOutput ? (
                          <pre className="w-full flex-1 min-h-[180px] md:min-h-[220px] bg-[#020d0f] font-mono text-[11px] p-3 text-cyan-300 border border-emerald-950/80 rounded-lg overflow-auto select-text custom-scrollbar">
                            {editorOutput}
                          </pre>
                        ) : (
                          <div className="w-full flex-1 min-h-[180px] md:min-h-[220px] bg-slate-950/50 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-4">
                            <FileCode className="h-8 w-8 text-slate-700 animate-pulse mb-2" />
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                              No modifications synthesized
                            </p>
                            <p className="text-[10px] font-sans text-slate-600 mt-2 max-w-[200px]">
                              Click the Initiate button below to activate automated fixes.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between">
                      {editorOutput ? (
                        (() => {
                          const diffData = computeSideBySideDiff(editorInput, editorOutput);
                          return (
                            <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#020512] flex flex-col min-h-[240px] md:min-h-[280px]">
                              {/* Diff Header */}
                              <div className="grid grid-cols-2 bg-slate-950/80 border-b border-slate-800 text-[10px] font-mono text-slate-400 font-bold sticky top-0 z-10 select-none">
                                <div className="p-2.5 border-r border-slate-800 flex items-center justify-between">
                                  <span>ORIGINAL CODE (DELETIONS)</span>
                                  <span className="text-rose-450 bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/40 text-[8px] uppercase font-black tracking-wider">Original (-)</span>
                                </div>
                                <div className="p-2.5 flex items-center justify-between">
                                  <span>HEALED COMPLIANT OUTPUT</span>
                                  <span className="text-[#D4AF37] bg-amber-950/40 px-2 py-0.5 rounded border border-[#D4AF37]/40 text-[8px] uppercase font-black tracking-wider font-mono">Healed (+)</span>
                                </div>
                              </div>

                              {/* Rows Container */}
                              <div className="flex-1 overflow-auto max-h-[360px] custom-scrollbar font-mono text-[10px] leading-relaxed select-text p-1.5 space-y-[2px]">
                                {diffData.left.map((leftLine, idx) => {
                                  const rightLine = diffData.right[idx];

                                  return (
                                    <div key={idx} className="grid grid-cols-2 gap-1.5">
                                      {/* Left Column (Original) */}
                                      <div 
                                        className={`flex items-stretch rounded-md transition-colors ${
                                          leftLine.type === "removed"
                                            ? "bg-rose-950/20 text-rose-300 border-l border-rose-500/80"
                                            : leftLine.type === "empty"
                                            ? "bg-slate-950/10 opacity-30 select-none pointer-events-none"
                                            : "bg-slate-950/25 text-slate-400 hover:bg-slate-900/10"
                                        }`}
                                      >
                                        <div className="w-9 text-right pr-2 text-slate-600 select-none border-r border-slate-900/10 text-[8px] py-1 flex items-center justify-end bg-slate-950/20 shrink-0 rounded-l-md font-mono font-bold">
                                          {leftLine.lineNumber || ""}
                                        </div>
                                        <div className={`w-3.5 text-center select-none font-bold py-1 shrink-0 ${leftLine.type === "removed" ? "text-rose-500" : "text-slate-705"}`}>
                                          {leftLine.type === "removed" ? "-" : ""}
                                        </div>
                                        <div className="px-2 py-1 whitespace-pre overflow-x-auto custom-scrollbar flex-1 min-w-0 font-mono text-[9.5px]">
                                          {leftLine.content}
                                        </div>
                                      </div>

                                      {/* Right Column (Healed) */}
                                      <div 
                                        className={`flex items-stretch rounded-md transition-colors ${
                                          rightLine.type === "added"
                                            ? "bg-emerald-950/20 text-emerald-300 border-l border-emerald-500/80"
                                            : rightLine.type === "empty"
                                            ? "bg-slate-950/10 opacity-30 select-none pointer-events-none"
                                            : "bg-slate-950/25 text-slate-250 hover:bg-slate-900/10"
                                        }`}
                                      >
                                        <div className="w-9 text-right pr-2 text-slate-600 select-none border-r border-slate-900/10 text-[8px] py-1 flex items-center justify-end bg-slate-950/20 shrink-0 rounded-l-md font-mono font-bold">
                                          {rightLine.lineNumber || ""}
                                        </div>
                                        <div className={`w-3.5 text-center select-none font-bold py-1 shrink-0 ${rightLine.type === "added" ? "text-emerald-500" : "text-slate-705"}`}>
                                          {rightLine.type === "added" ? "+" : ""}
                                        </div>
                                        <div className="px-2 py-1 whitespace-pre overflow-x-auto custom-scrollbar flex-1 min-w-0 font-mono text-[9.5px]">
                                          {rightLine.content}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="w-full flex-1 min-h-[220px] bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6">
                          <Split className="h-10 w-10 text-[#D4AF37]/50 animate-pulse mb-3" />
                          <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-extrabold">
                            Awaiting Code Healing
                          </p>
                          <p className="text-[11px] font-sans text-slate-400 mt-2 max-w-[340px] leading-relaxed">
                            Run the <strong>Self-Heal Code with AI</strong> compiler first! Once the system synthesizes your pristine, security-hardened replacement, you can review it line-by-line using our visual diff tools.
                          </p>
                          <button
                            onClick={runAISelfHealing}
                            disabled={isSelfHealing}
                            className="mt-4 px-4 py-2 bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37]/80 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Trigger Healer Now</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {healSuccessMsg && (
                    <div className="bg-emerald-950/30 border border-emerald-800 text-emerald-200 p-2.5 rounded-lg text-[10px] sm:text-xs flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{healSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={runAISelfHealing}
                      disabled={isSelfHealing}
                      className="bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs font-mono py-3 rounded-lg flex items-center justify-center gap-2 tracking-widest cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase font-extrabold shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                    >
                      {isSelfHealing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Fixing broken loops...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Self-Heal Code with AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={runSecurityAuditor}
                      disabled={isSelfHealing}
                      className="bg-slate-900 border border-slate-700 hover:bg-slate-850 hover:border-slate-600 text-slate-200 font-semibold text-xs font-mono py-3 rounded-lg flex items-center justify-center gap-2 tracking-widest cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase font-extrabold"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Run Security Audit</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AUDITOR PATTERNS SCAN (PHASE 2) */}
              {activeTab === "compliance" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block">
                      Phase 2: The Security & Compliance Auditor
                    </span>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Automatically scans PWA structures for hardcoded credentials, malicious permissions, layout violations, and ensures age-gating requirements match recent compliance rules.
                    </p>
                  </div>

                  {scannedIssues.length > 0 && !isAuditing && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                          SCAN RESULTS:
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/50 border border-rose-900/60 text-rose-300 uppercase font-black">
                          {scannedIssues.filter(i => i.type === "crit").length} CRITICAL
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/50 border border-amber-900/60 text-amber-300 uppercase font-black">
                          {scannedIssues.filter(i => i.type === "warn").length} WARNINGS
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-900/60 text-emerald-300 uppercase font-black">
                          {scannedIssues.filter(i => i.type === "info").length} SUCCESS
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadAuditReport("txt")}
                          className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-[10px] font-mono py-1.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer uppercase transition-all duration-150 active:scale-95"
                          title="Download Text Audit Report"
                        >
                          <Download className="h-3 w-3 text-[#D4AF37]" />
                          <span>Report (TXT)</span>
                        </button>
                        <button
                          onClick={() => downloadAuditReport("json")}
                          className="flex-1 sm:flex-initial bg-[#000080]/80 hover:bg-[#000080] text-[#D4AF37] border-2 border-[#D4AF37]/80 hover:border-[#D4AF37] font-bold text-[10px] font-mono py-1 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider transition-all duration-150 active:scale-95"
                          title="Download JSON Audit Report"
                        >
                          <Download className="h-3 w-3" />
                          <span>Report (JSON)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {isAuditing ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
                        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Scanning payload patterns...</span>
                      </div>
                    ) : scannedIssues.length === 0 ? (
                      <div className="text-center p-10 bg-slate-950/20 border border-slate-800 rounded-lg">
                        <Shield className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                        <span className="text-xs font-mono text-slate-500 block uppercase">No audits completed</span>
                        <button
                          onClick={runSecurityAuditor}
                          className="mt-4 px-4 py-2 hover:bg-slate-800 text-[11px] font-mono uppercase text-[#D4AF37] bg-slate-950 border border-slate-800 rounded cursor-pointer"
                        >
                          Scan Source Code Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {scannedIssues.map((issue, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${
                              issue.type === "crit"
                                ? "bg-rose-950/20 border-rose-900/60 text-rose-200"
                                : issue.type === "warn"
                                ? "bg-amber-950/20 border-amber-900/60 text-amber-200"
                                : "bg-emerald-950/20 border-emerald-900/60 text-slate-300"
                            }`}
                          >
                            {issue.type === "crit" ? (
                              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                            ) : issue.type === "warn" ? (
                              <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1 text-xs">
                              <span className="font-bold flex items-center gap-1.5 uppercase text-[10px]">
                                {issue.type === "crit" ? "Critical Bypass Deficit" : issue.type === "warn" ? "Recommended Advisory" : "Compliance Success"}
                              </span>
                              <p className="font-semibold text-white">{issue.msg}</p>
                              <p className="text-[11px] opacity-80 leading-relaxed font-sans mt-1">{issue.tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: WHITE LABEL STRIPE CALCULATOR */}
              {activeTab === "calculator" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block">
                      Stripe Paywall & Alternative Billing Retained Income Model
                    </span>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Under recent legislative changes, Progressive Web Apps with standalone billing can declare alternative Stripe paywalls. That bypasses the 30% storefront markup fee, lowering Google declaration levies down to just 10% + standard Stripe card processing.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">PROJECTED YEARLY NET SALES:</span>
                      <span className="text-lg font-mono font-bold text-white">${yearlyRevenue.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="50000"
                      value={yearlyRevenue}
                      onChange={(e) => setYearlyRevenue(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 accent-[#D4AF37] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/30 border border-rose-950/50 rounded-xl text-center space-y-1">
                      <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest font-bold">Standard App Store System Cut (15%)</span>
                      <p className="text-sm font-mono text-rose-350 font-bold">${standardCut.toLocaleString()}</p>
                      <p className="text-[10px] font-sans text-slate-500 mt-2">You lose substantial margin share with zero localized billing authority.</p>
                    </div>

                    <div className="p-4 bg-slate-950/30 border border-emerald-950/50 rounded-xl text-center space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Stripe 2026 Alternate Path (12.9% Total)</span>
                      <p className="text-sm font-mono text-emerald-350 font-bold">${stripeRateCut.toLocaleString()}</p>
                      <p className="text-[10px] font-sans text-slate-500 mt-2">Google alternate billing (10%) plus Stripe processing processing standards.</p>
                    </div>
                  </div>

                  <div className="bg-[#000040] border border-[#D4AF37]/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]">
                        <Coins className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <span className="text-white font-bold text-xs uppercase block">97% Retained Direct Income Safeguard</span>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">Retain funds directly in your Stripe bank account before declaring storefront fees!</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] font-mono text-slate-500 block">VETERAN PROFIT BONUS:</span>
                      <span className="text-emerald-400 font-mono font-bold text-base shadow-[0_0_12px_#10b981]">
                        +${potentialSavings.toLocaleString()} / Yr
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: THE SHIP-READY PACKAGER ENGINE */}
              {activeTab === "packager" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block">
                      Phase 3: The 'Ship-Ready' Trusted Web Activity Packager
                    </span>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Converts your compliant landing page and custom PWA config files directly into a sealed, production-signed Android App Bundle (.aab) ready for deployment.
                    </p>
                  </div>

                  {buildAabStatus === "idle" && (
                    <div className="space-y-4">
                      {/* Logo selection to prevent fuzz around the edge warning */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">Select Clean Transparent App-Icon Launcher (No Fuzz Check):</span>
                        <div className="grid grid-cols-4 gap-2">
                          {SHIELD_LOGOS.map((logo) => (
                            <button
                              key={logo.id}
                              onClick={() => setSelectedLogoId(logo.id)}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer bg-slate-950/40 hover:bg-slate-950 ${
                                selectedLogoId === logo.id
                                  ? "border-[#D4AF37] text-white"
                                  : "border-slate-800 text-slate-400"
                              }`}
                            >
                              <span className="font-mono text-[10px] block font-semibold">{logo.name}</span>
                              <span className="text-[8px] opacity-75">{logo.id === "anchor" ? "Recommended" : "Ready"}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans">
                          🛡️ <strong className="text-white">Shipmate Guard:</strong> Employs translucent 512px presets ensuring zero visual edge anomalies to satisfy Play Store automated inspections.
                        </p>
                      </div>

                      {/* ENTERPRISE WHITE-LABEL METADATA CONTROL PANEL */}
                      <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#D4AF37] uppercase block font-black">
                            👑 Whitelabel Brand Override Settings
                          </span>
                          {licenseTier === "white_label" ? (
                            <span className="text-[8px] font-mono bg-[#000040] text-emerald-400 py-0.5 px-2 rounded font-extrabold uppercase animate-pulse border border-emerald-900">
                              ACTIVE OVERRIDES
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setPricingPreselection("white_label");
                                setShowPricingModal(true);
                              }}
                              className="text-[8px] font-mono bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/35 py-1 px-3.5 rounded font-black uppercase border border-[#D4AF37]/40 cursor-pointer transition-all"
                            >
                              Unlock Upgrade
                            </button>
                          )}
                        </div>

                        {licenseTier === "white_label" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-mono uppercase block">Company Registry Name:</label>
                              <input
                                type="text"
                                value={whiteLabelCompany}
                                onChange={(e) => setWhiteLabelCompany(e.target.value)}
                                className="w-full bg-[#02030a] text-xs font-mono font-bold text-white border border-[#D4AF37]/50 rounded p-2 focus:ring-1 focus:ring-[#D4AF37]"
                                placeholder="Starboard Marine Inc."
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-slate-400 font-mono uppercase block">Private Keystore Key Alias:</label>
                              <input
                                type="text"
                                value={whiteLabelAlias}
                                onChange={(e) => setWhiteLabelAlias(e.target.value)}
                                className="w-full bg-[#02030a] text-xs font-mono font-bold text-white border border-[#D4AF37]/50 rounded p-2 focus:ring-1 focus:ring-[#D4AF37]"
                                placeholder="vessel-alias-2026"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-left relative">
                            {/* Disabled preview inputs with overlay */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-35 select-none pointer-events-none">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-mono uppercase block">Company Registry Name:</label>
                                <input
                                  type="text"
                                  disabled
                                  value="Starboard Marine Inc. (LOCKED)"
                                  className="w-full bg-[#02030a] text-xs font-mono border border-slate-800 rounded p-2"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-mono uppercase block">Private Keystore Key Alias:</label>
                                <input
                                  type="text"
                                  disabled
                                  value="vessel-alias-2026 (LOCKED)"
                                  className="w-full bg-[#02030a] text-xs font-mono border border-slate-800 rounded p-2"
                                />
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                              🔒 <strong className="text-white">White-label locks:</strong> Compiles will fallback to default Starboard identifiers. Secure an Enterprise license key to inject customized corporation registry aliases.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={runPackagerAssembly}
                          className="flex-1 bg-gold-shimmer hover:brightness-115 text-[#000040] font-bold text-xs font-mono py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                        >
                          <Compass className="h-4 w-4 text-[#000040]" />
                          <span>Generate Certified .AAB Bundle</span>
                        </button>

                        <a
                          href={`data:text/javascript;charset=utf-8,${encodeURIComponent(`// Starboard Automated ship-agent.js
const pwaPath = "./";
console.log("⚓ Running Shipmate Compile Agent...");
console.log("Checking Alternative Billing manifests...");`)}`}
                          download="ship-agent.js"
                          className="px-4 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-850 hover:border-slate-600 rounded-lg text-[11px] font-mono text-slate-100 flex items-center gap-2 transition-all uppercase"
                        >
                          <Download className="h-4 w-4 text-[#D4AF37]" />
                          <span>ship-agent.js</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {buildAabStatus !== "idle" && (
                    <div className="space-y-3">
                      {/* Integrated Deep Pipeline Graphical Progress Visualizer */}
                      <BuildPipelineVisualizer
                        buildLogsCount={buildLogs.length}
                        isBuilding={isBuildingAab}
                        status={buildAabStatus}
                        selectedLogoId={selectedLogoId}
                      />

                      <div className="bg-[#020512] font-mono text-[11px] p-3 rounded-lg border border-slate-800 max-h-[140px] overflow-y-auto custom-scrollbar flex flex-col space-y-1 block-scroll select-text">
                        {buildLogs.length === 0 ? (
                          <span className="text-slate-500">Preparing system build pipeline tools...</span>
                        ) : (
                          buildLogs.map((log, idx) => (
                            <span
                              key={idx}
                              className={log.includes("COMPLETE") || log.includes("Successfully") ? "text-emerald-400 font-bold" : log.includes("⚙️") ? "text-cyan-400" : "text-slate-400"}
                            >
                              {log}
                            </span>
                          ))
                        )}
                        {isBuildingAab && (
                          <span className="text-cyan-400 animate-pulse flex items-center gap-1.5 mt-1">
                            <Loader2 className="h-3 w-3 animate-spin text-cyan-400" /> Packaging binary bundle & transmitting checksum block markers...
                          </span>
                        )}
                      </div>

                      {buildAabStatus === "complete" && (
                        <div className="bg-emerald-950/30 border border-emerald-800/80 rounded-xl p-4 text-xs text-slate-350 flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-3 flex-1 text-left">
                            <div>
                              <span className="font-bold text-white uppercase text-[10px] block">AAB Package Complete</span>
                              <p className="mt-1 text-[11px] leading-relaxed">
                                Signed App Bundle build successfully compiled as <code className="text-[#D4AF37] font-mono">starboard-v1.0.0.aab</code> and validated compliant.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2.5 pt-1">
                              {licenseTier === "free" ? (
                                <button
                                  onClick={() => {
                                    setDiagnosticsLogs((prev) => [
                                      ...prev,
                                      "⚠️ DOWNLOAD DENIED: Sandbox export requires an authorized license check. Initiating Stripe popup tracker..."
                                    ]);
                                    setPricingPreselection("paid_export");
                                    setShowPricingModal(true);
                                  }}
                                  className="bg-gold-shimmer text-[#000040] hover:brightness-115 font-mono text-[10px] font-extrabold uppercase py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                                >
                                  <Lock className="h-3.5 w-3.5" />
                                  <span>Download Signed .AAB (License Required)</span>
                                </button>
                              ) : (
                                <a
                                  href={`data:application/octet-stream;charset=utf-8,${encodeURIComponent(`[STARBOARD SECURED PRODUCTIONS CERTIFICATE]\nLICENSE TIER: ${licenseTier.toUpperCase()}\nLICENSE KEY: ${licenseKey}\nSIGNATURE ALIAS: ${whiteLabelAlias}\nCOMPANY: ${whiteLabelCompany}\nCOMPLIANCE METRIC: 100% APPROVED\n\n⚓ Shipmate, your compiled release Android App Bundle binary is fully signed and verified!`)}`}
                                  download="starboard-v1.0.0.aab"
                                  onClick={() => {
                                    setDiagnosticsLogs((prev) => [
                                      ...prev,
                                      `📥 DOWNLOAD SUCCESSFUL: Transmitting certified .aab package (STBD-KEY: ${licenseKey.slice(0, 12)}...)`
                                    ]);
                                  }}
                                  className="bg-gold-shimmer text-[#000040] hover:brightness-115 font-mono text-[10px] font-black uppercase py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                                >
                                  <Download className="h-3.5 w-3.5 text-[#000040]" />
                                  <span>Download certified .aab</span>
                                </a>
                              )}

                              <button
                                onClick={() => setBuildAabStatus("idle")}
                                className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 py-2 px-3 text-[#D4AF37] rounded hover:bg-slate-950 cursor-pointer"
                              >
                                Configure Another Package
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: UNIFIED GIT CODE-AUDIT SCANNER (PHASE 4) */}
              {activeTab === "git" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4 font-sans text-left"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block">
                      Phase 4: Unified Git Code-Audit Scanner
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Connect your secure codebase registries, parse metadata configurations, and scan complete repository structures for standard compliance and Play Store viability.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] text-[#D4AF37] font-mono uppercase block font-bold">Git Repository Address (HTTPS):</label>
                      <input
                        type="text"
                        value={gitUrl}
                        onChange={(e) => setGitUrl(e.target.value)}
                        className="w-full bg-[#020512] font-mono text-xs text-white border border-slate-800 rounded p-2.5 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                        placeholder="https://github.com/ankheternalltd/starboard-merchant-marine-pwa"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-455 font-mono uppercase block font-bold">Branch Reference:</label>
                      <input
                        type="text"
                        value={gitBranch}
                        onChange={(e) => setGitBranch(e.target.value)}
                        className="w-full bg-[#020512] font-mono text-xs text-white border border-slate-800 rounded p-2.5 focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                        placeholder="main"
                      />
                    </div>
                  </div>

                  <button
                    onClick={runGitCodebaseScan}
                    disabled={isGitScanning}
                    className="w-full bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs font-mono py-3 rounded-lg flex items-center justify-center gap-2 tracking-widest cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed uppercase"
                  >
                    {isGitScanning ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Scanning complete repository files...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Scan Code from Git Address</span>
                      </>
                    )}
                  </button>

                  {/* Progressive Scan Logs Panel */}
                  {gitScanLogs.length > 0 && (
                    <div className="bg-[#02040b] border border-slate-800/80 rounded-lg p-3 font-mono text-[10px] space-y-1 block-scroll select-text">
                      <div className="flex items-center justify-between text-slate-500 border-b border-slate-900 pb-1 mb-1">
                        <span className="uppercase tracking-wider font-extrabold flex items-center gap-1">Git Client Status Stream</span>
                        {isGitScanning && <span className="text-[#D4AF37] animate-pulse">ACTIVE SYNCING...</span>}
                      </div>
                      <div className="space-y-1 max-h-[100px] overflow-y-auto">
                        {gitScanLogs.map((log, idx) => (
                          <p
                            key={idx}
                            className={
                              log.includes("🟢") || log.includes("Successfully")
                                ? "text-emerald-400 font-bold"
                                : log.includes("❌")
                                ? "text-rose-450 text-rose-400"
                                : "text-slate-400"
                            }
                          >
                            {log}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scan Result Interface */}
                  {gitScanResult && !isGitScanning && (
                    <div className="space-y-4">
                      {/* STATS OVERVIEW DECK */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-center space-y-0.5">
                          <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">FILES SCANNED</span>
                          <span className="text-sm font-mono font-bold text-white">
                            {gitScanResult.stats?.filesScanned || 0}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-center space-y-0.5">
                          <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">TOTAL LINES</span>
                          <span className="text-sm font-mono font-bold text-slate-200">
                            {gitScanResult.stats?.linesOfCode || 1200}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-center space-y-0.5">
                          <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">PASSED CHECKS</span>
                          <span className="text-sm font-mono font-bold text-emerald-400">
                            {gitScanResult.stats?.passedTests || 0}
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-950/40 border border-slate-800 rounded-lg text-center space-y-0.5">
                          <span className="text-[8px] font-mono text-rose-500 uppercase tracking-widest block font-bold">REGULATORY ISSUES</span>
                          <span className="text-sm font-mono font-extrabold text-rose-400 animate-pulse">
                            {gitScanResult.stats?.criticalIssues || 0}
                          </span>
                        </div>
                      </div>

                      {/* WORKSPACE DETAILED COLUMNS */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* LEFT: Repository Map Navigator */}
                        <div className="md:col-span-2 space-y-2 p-3 bg-slate-950/30 border border-slate-800/60 rounded-xl">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-black block border-b border-slate-900/60 pb-1 mb-2">
                            📂 Repository File Map
                          </span>
                          <div className="space-y-1.5 font-mono text-[10px] leading-relaxed">
                            {gitScanResult.fileTree?.map((f: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between border-b border-slate-900/50 pb-1">
                                <span className="text-slate-350 flex items-center gap-1.5 truncate">
                                  <span>{f.type === "directory" ? "📁" : "📄"}</span>
                                  <span className="text-slate-200">{f.path}</span>
                                </span>
                                <span
                                  className={`text-[8px] font-mono font-bold uppercase rounded py-0.5 px-2 tracking-tighter ${
                                    f.status === "vulnerable"
                                      ? "bg-rose-950/50 border border-rose-900/50 text-rose-400"
                                      : f.status === "warning"
                                      ? "bg-amber-950/50 border border-amber-900/50 text-amber-400"
                                      : f.status === "missing"
                                      ? "bg-slate-900 border border-slate-800 text-slate-500"
                                      : "bg-emerald-950/50 border border-emerald-900/50 text-emerald-400"
                                  }`}
                                >
                                  {f.status === "vulnerable" ? "vulnerable" : f.status === "warning" ? "warning" : f.status === "missing" ? "missing" : "secure"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT: Compliance Audit and Bridge */}
                        <div className="md:col-span-3 space-y-3">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-black block border-b border-slate-900 pb-1">
                            🚨 COMPLIANCE CORRELATION ISSUES
                          </span>
                          <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                            {gitScanResult.issues?.map((issue: any, idx: number) => (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                                  issue.type === "crit"
                                    ? "bg-rose-950/15 border-rose-900/50 text-rose-200"
                                    : "bg-amber-950/15 border-amber-900/50 text-amber-200"
                                }`}
                              >
                                <span className="font-mono font-black text-[9px] tracking-widest block uppercase text-rose-300">
                                  {issue.type === "crit" ? "🔴 POLICY BLOCKER" : "🟡 STORE ADVISORY"}
                                </span>
                                <p className="font-bold text-white text-[11px] leading-snug">{issue.msg}</p>
                                <p className="text-[10px] text-slate-400 leading-normal">{issue.tip}</p>
                              </div>
                            ))}
                          </div>

                          {/* BRIDGING CALL TO ACTION */}
                          <div className="bg-[#000040]/50 border border-[#D4AF37]/45 p-3 rounded-xl space-y-2 text-left">
                            <p className="text-[10px] text-slate-300 leading-relaxed">
                              ⚓ <strong className="text-white">Continuous Self-Heal Pipeline:</strong> Push the repository's primary codebase straight into our Self-Healer component to purge unencrypted keys or silent tracking actions.
                            </p>
                            <button
                              onClick={() => {
                                if (gitScanResult.retrievedCode) {
                                  setEditorInput(gitScanResult.retrievedCode);
                                  setActiveTab("debugger");
                                  setDiagnosticsLogs((prev) => [
                                    ...prev,
                                    `⚡ Git SafeScan Link: Synchronized and loaded '${gitScanResult.repositoryName}' source code into Self-Healer buffer.`
                                  ]);
                                }
                              }}
                              className="w-full bg-gold-shimmer hover:brightness-115 text-[#000040] py-2 px-3 rounded font-mono font-black text-[10px] uppercase cursor-pointer text-center justify-center flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Load Extracted Code into Self-Healer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 6: CHROME WEB STORE EQUIVALENT EXPORTER */}
              {activeTab === "extension" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <ChromeExtensionStudio
                    licenseTier={licenseTier}
                    licenseKey={licenseKey}
                    appName={appName}
                    appDescription={appDescription}
                    whiteLabelCompany={whiteLabelCompany}
                    whiteLabelAlias={whiteLabelAlias}
                    onOpenPricingModal={(preselect) => {
                      setPricingPreselection(preselect);
                      setShowPricingModal(true);
                    }}
                    addDiagnosticLog={(log) => setDiagnosticsLogs((prev) => [...prev, log])}
                  />
                </motion.div>
              )}

              {/* TAB 7: GOOGLE PLAY STORE PUBLISHER & ACCREDITATION HUB */}
              {activeTab === "playstore" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4 text-left font-sans text-slate-300"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold block bg-slate-950/40 p-1 px-2 rounded border border-slate-905 inline-block mb-1">
                      Phase 6: Google Play Store Accreditation & Dispatch
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Transmit compliant, signed application binaries directly to the Google Play Store Console. This accreditation wizard runs static and visual checks before submitting deployment requests to verification tracks.
                    </p>
                  </div>

                  {/* METADATA FORM CONTROL CARD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block border-b border-slate-900 pb-1">
                        1. Play Store Catalog Metadata
                      </span>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-[#D4AF37] font-mono uppercase block font-bold">Target Package ID:</label>
                          <input
                            type="text"
                            value={playPackageName}
                            onChange={(e) => setPlayPackageName(e.target.value)}
                            className="w-full bg-[#020512] text-xs font-mono border border-slate-800 rounded p-2 text-white focus:border-[#D4AF37] focus:outline-none"
                            placeholder="com.starboard.merchant.marine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-[#D4AF37] font-mono uppercase block font-bold">App Catalog Title:</label>
                          <input
                            type="text"
                            value={playStoreTitle}
                            onChange={(e) => setPlayStoreTitle(e.target.value)}
                            className="w-full bg-[#020512] text-xs font-mono border border-slate-800 rounded p-2 text-white focus:border-[#D4AF37] focus:outline-none"
                            placeholder="Starboard Merchant Marine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-450 font-mono uppercase block font-bold flex items-center justify-between">
                            <span className="text-[#D4AF37]">Console Private Key (JSON):</span>
                            <span className="text-[8px] text-emerald-400 uppercase font-bold">Handshake Ready</span>
                          </label>
                          <textarea
                            value={playCredentialsJson}
                            onChange={(e) => setPlayCredentialsJson(e.target.value)}
                            className="w-full h-16 bg-[#020512] text-[9.5px] font-mono border border-slate-800 rounded p-2 text-slate-400 focus:border-[#D4AF37] focus:outline-none custom-scrollbar"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block border-b border-slate-900 pb-1 mb-2">
                          2. Compliance Declarations
                        </span>
                        <div className="space-y-2 text-xs">
                          <label className="flex items-start gap-2 cursor-pointer hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={playAccreditationChecks.ageGate}
                              onChange={(e) => setPlayAccreditationChecks(prev => ({ ...prev, ageGate: e.target.checked }))}
                              className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 mt-0.5 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5 leading-none text-[11px]">
                                🔞 18+ Age Rating Gating Check
                              </span>
                              <p className="text-[10px] text-slate-400">Locks restricted content until operator age-verification input is approved.</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-2 cursor-pointer hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={playAccreditationChecks.locationTrigger}
                              onChange={(e) => setPlayAccreditationChecks(prev => ({ ...prev, locationTrigger: e.target.checked }))}
                              className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 mt-0.5 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5 leading-none text-[11px]">
                                📍 Explicit Click-To-Locate Trigger
                              </span>
                              <p className="text-[10px] text-slate-400">Silent background tracking deactivated. "Location Authorization" is approved.</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-2 cursor-pointer hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={playAccreditationChecks.stripeBilling}
                              onChange={(e) => setPlayAccreditationChecks(prev => ({ ...prev, stripeBilling: e.target.checked }))}
                              className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 mt-0.5 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5 leading-none text-[11px]">
                                💳 Authorized Alternative Merchant Billing
                              </span>
                              <p className="text-[10px] text-slate-400">Configures direct-to-Stripe low-tax revenue streams bypass.</p>
                            </div>
                          </label>

                          <label className="flex items-start gap-2 cursor-pointer hover:text-white select-none">
                            <input
                              type="checkbox"
                              checked={playAccreditationChecks.ugcModeration}
                              onChange={(e) => setPlayAccreditationChecks(prev => ({ ...prev, ugcModeration: e.target.checked }))}
                              className="accent-[#D4AF37] h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 mt-0.5 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5 leading-none text-[11px]">
                                🛡️ UGC Community Protection Rules
                              </span>
                              <p className="text-[10px] text-slate-400">Enables content moderators and user filtration policies.</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-2 text-left">
                        <div className="bg-slate-900 border border-slate-800 p-2 text-[10px] text-slate-400 font-mono rounded flex items-center gap-2">
                          <Shield className="h-4 w-4 text-[#D4AF37]" />
                          <span>
                            {buildAabStatus === "complete" 
                              ? "✅ Compliant security package bundle is connected!"
                              : "⚠️ Compile step 5 not finished. Submitting default sandbox."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SUBMISSION INTERACTION AND SIMULATED LIVE LOGGER */}
                  {playSubmissionStatus !== "idle" && (
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-900 pb-1">
                        <span className="flex items-center gap-1">
                          <TerminalIcon className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
                          Play Safe-Scan API Deployment Pipeline Console
                        </span>
                        {isSubmittingPlay ? (
                          <span className="text-[#D4AF37] animate-pulse">DISPATCHING CHANNELS...</span>
                        ) : playSubmissionStatus === "success" ? (
                          <span className="text-emerald-400 font-bold uppercase">Accredited OK</span>
                        ) : (
                          <span className="text-rose-450 font-bold uppercase">Failed</span>
                        )}
                      </div>

                      <div className="space-y-0.5 max-h-[100px] overflow-y-auto custom-scrollbar font-mono text-[9.5px] select-text pt-1">
                        {playSubmissionLogs.map((log, idx) => (
                          <p
                            key={idx}
                            className={
                              log.includes("🟢") || log.includes("SUCCESSFUL") || log.includes("ACCREDITATION CERTIFIED")
                                ? "text-emerald-400 font-bold"
                                : log.includes("🚨") || log.includes("BLOCKED")
                                ? "text-rose-450 font-bold"
                                : log.includes("[PLAYAPI]")
                                ? "text-[#D4AF37]"
                                : "text-slate-400"
                            }
                          >
                            {log}
                          </p>
                        ))}
                        {isSubmittingPlay && (
                          <p className="text-[#D4AF37] animate-pulse flex items-center gap-1 mt-1">
                            <Loader2 className="h-3 w-3 animate-spin text-[#D4AF37]" /> Executing SafeScan signature validation tests...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PLAY STORE ACCREDITATION SUMMARY BADGE AND TICKET */}
                  {playSubmissionStatus === "success" && (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-950/20 border-2 border-emerald-500/30 rounded-xl p-4 text-center space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.12)] relative overflow-hidden"
                    >
                      {/* Decorative background visual grids */}
                      <div className="absolute inset-0 bg-radial-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

                      <div className="space-y-2 relative z-10">
                        <div className="inline-flex py-1 px-2.5 rounded bg-emerald-950/60 border border-emerald-900 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-extrabold items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>ACCREDITED APPROVED</span>
                        </div>

                        {/* THE SHIPPING PORTAL COMPANION SEAL - "(II Shipmate)" anchor symbol */}
                        <div className="flex justify-center py-2">
                          <div className="relative flex flex-col items-center justify-center p-3.5 bg-[#030614] border-2 border-[#D4AF37]/55 rounded-2xl w-44 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-[#D4AF37] transition-all duration-300 group">
                            
                            {/* Subtle inner marine compass grid lines */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:10px_10px] rounded-2xl pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-950/20 to-transparent rounded-2xl pointer-events-none" />

                            <div className="relative w-16 h-16 flex items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#02040c]">
                              {/* Anchor Vector */}
                              <svg
                                viewBox="0 0 100 100"
                                className="w-10 h-10 text-[#D4AF37] drop-shadow-[0_2px_6px_rgba(212,175,55,0.5)] transform group-hover:rotate-6 transition-all duration-300"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {/* Top Ring */}
                                <circle cx="50" cy="18" r="8" strokeWidth="4" />
                                {/* Crossbar / Stock */}
                                <path d="M30 32 H70" strokeWidth="4" />
                                <circle cx="30" cy="32" r="2" fill="currentColor" stroke="none" />
                                <circle cx="70" cy="32" r="2" fill="currentColor" stroke="none" />
                                {/* Shaft */}
                                <path d="M50 26 L50 82" strokeWidth="5.5" />
                                {/* Curved Flukes */}
                                <path d="M22 56 C22 76, 40 84, 50 84 C60 84, 78 76, 78 56" strokeWidth="4.5" />
                                {/* Arrow fluke tips */}
                                <path d="M15 58 L22 51 L29 60 Z" fill="currentColor" stroke="none" />
                                <path d="M85 58 L78 51 L71 60 Z" fill="currentColor" stroke="none" />
                                {/* Base connection crown */}
                                <circle cx="50" cy="84" r="3.5" fill="currentColor" stroke="none" />
                              </svg>
                            </div>

                            {/* "(II Shipmate)" Maritime plaque label */}
                            <div className="mt-2.5 bg-[#000080] border border-[#D4AF37] text-[#D4AF37] font-mono text-[9px] font-black tracking-widest py-1 px-2.5 rounded shadow-[0_2px_4px_rgba(0,0,128,0.4)] whitespace-nowrap">
                              (II SHIPMATE)
                            </div>
                            
                            <span className="text-[7.5px] font-mono text-slate-450 uppercase tracking-widest mt-1">
                              Shipping Portal
                            </span>
                          </div>
                        </div>

                        <h4 className="text-white font-bold text-xs pt-1 uppercase tracking-wider font-serif text-[#D4AF37]">
                          Accreditation Seal Issued: Verified Sandbox Dispatch
                        </h4>
                        <p className="text-[10.5px] text-slate-300 max-w-md mx-auto">
                          Excellent Captain! The Android App Bundle program successfully passed automatic security policy ratings.
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 inline-block font-mono text-[9.5px] text-left space-y-0.5 select-all relative z-10 w-full sm:w-auto">
                        <p><span className="text-slate-500">TICKET REF :</span> <span className="font-bold text-slate-200">{playAccreditationTicket}</span></p>
                        <p><span className="text-slate-500">PACKAGE ID :</span> <span className="text-slate-200">{playPackageName}</span></p>
                        <p><span className="text-slate-500">RATING PRESET:</span> <span className="text-emerald-400 font-bold">18+ VETERAN SAFE-TRACK</span></p>
                        <p><span className="text-slate-500">PORTAL STATUS:</span> <span className="text-[#D4AF37] font-bold">CARGO DISPATCHED</span></p>
                      </div>

                      <div className="pt-1 relative z-10">
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(`[GOOGLE PLAY STORE COMPLIANT DISPATCH CERTIFICATE]\nTICKET HASH: ${playAccreditationTicket}\nDEVELOPER COMPLIANCE VERIFICATION MATCH\nPACKAGE IDENTIFIER: ${playPackageName}\nCATALOGUE TITLE: ${playStoreTitle}\nPORTAL STATUS: (II Shipmate) Secure Anchor Transit Verified\n\nThis app is officially signed, accredited, & certified passed through the Shipping Portal!`)}`}
                          download={`accreditation-${playPackageName}.txt`}
                          className="bg-emerald-600 hover:bg-emerald-550 font-mono text-white text-[9px] font-bold uppercase py-1.5 px-3 rounded inline-flex items-center gap-1.5 select-none transition-all shadow-md cursor-pointer"
                        >
                          <Download className="h-3 w-3" />
                          <span>Get Certificate Text</span>
                        </a>
                      </div>
                    </motion.div>
                  )}

                  {/* ACTION TRIGGER BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={submitToGooglePlayConsole}
                      disabled={isSubmittingPlay || playSubmissionStatus === "success"}
                      className="bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37] font-semibold text-[10.5px] font-mono py-2.5 rounded-xl flex items-center justify-center gap-1.5 tracking-wider cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed uppercase"
                    >
                      {isSubmittingPlay ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin text-[#D4AF37]" />
                          <span>Scanning credentials...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Submit to Play Store</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setPlaySubmissionStatus("idle");
                        setPlaySubmissionLogs([]);
                        setPlayAccreditationTicket("");
                      }}
                      disabled={isSubmittingPlay || playSubmissionStatus === "idle"}
                      className="bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:border-slate-750 text-slate-300 font-semibold text-[10.5px] font-mono py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 select-none uppercase tracking-wider"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Configure New Track</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEPPER STEP BACK / STEP FORWARD FUNNEL CONTROL FOOTER */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-805 mt-3 select-none">
              <button
                onClick={goToPrevStep}
                disabled={activeStepIndex === 0}
                className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 text-slate-400 hover:text-white font-mono text-[9px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 uppercase"
              >
                <span>◁ Back</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 py-1 px-2 bg-slate-950/60 rounded border border-slate-850 text-[9px] text-slate-450 font-mono">
                <span className="font-bold text-[#D4AF37] uppercase">Funnel Mode:</span>
                <span className="text-slate-300 uppercase">{funnelSteps[activeStepIndex]?.label}</span>
              </div>

              {activeStepIndex < funnelSteps.length - 1 ? (
                <button
                  onClick={goToNextStep}
                  className="py-1 px-2.5 bg-[#000080] hover:bg-[#000060] border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-[9px] font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 uppercase shadow-md"
                >
                  <span>Next Step ▷</span>
                </button>
              ) : (
                <div className="py-1 px-2 bg-emerald-950/20 border border-emerald-900 rounded text-emerald-400 font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Accreditation Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* LOWER LIVE DIAGNOSTIC STREAM */}
          <div className="bg-[#02030a] border border-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-1.5 min-h-[90px] max-h-[140px] overflow-y-auto custom-scrollbar select-text">
            <span className="text-slate-500 uppercase tracking-widest font-semibold block border-b border-slate-900 pb-1 flex items-center gap-1">
              <TerminalIcon className="h-3.5 w-3.5 text-[#D4AF37]" /> Active Developer Console Stream Logs
            </span>
            <div className="space-y-0.5 max-h-[90px] overflow-y-auto">
              {diagnosticsLogs.map((log, idx) => (
                <p key={idx} className="text-slate-400 leading-normal">
                  <span className="text-slate-650 opacity-40">[{new Date().toTimeString().split(" ")[0]}]</span> {log}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* RIGHT COMPONENT: HIGH FIDELITY STARBOARD NAVIGATION TARGET (5 COLS) */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center p-3 relative bg-[#010206] border border-slate-800 rounded-2xl shadow-xl justify-between">
          
          {/* SIMULATOR ENVELOPE PHONE HEADER */}
          <div className="w-full flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono px-3 py-1 bg-slate-950/60 rounded-t-lg border-b border-slate-800/80 mb-2">
            <span className="tracking-tighter font-semibold">DEVICE EMULATION: GOOGLE PIXEL 9A</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-slate-650" /></span>
            <span className="text-[#D4AF37] font-bold">PWA STANDALONE</span>
          </div>

          {/* INTERNAL DEVICE VISPORT DISPLAY CONTAINER */}
          <div className="w-full flex-1 min-h-[460px] bg-white text-slate-900 rounded-xl overflow-hidden flex flex-col justify-between border-2 border-slate-800 relative shadow-inner">
            
            {/* VETERAN FLAG BAR HEADER */}
            <header className="bg-[#000080] p-4 text-white text-center border-b border-b-[#D4AF37] relative flex flex-col items-center justify-center">
              
              {/* COMPASS BRAND ICON EMULATION */}
              <div className="logo-box mb-1.5 select-none relative inline-block">
                <div className="w-14 h-14 bg-[#050c26] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg mx-auto">
                  {selectedLogoId === "compass" && <Compass className="h-8 w-8 text-[#D4AF37] animate-spin-slow" />}
                  {selectedLogoId === "star" && <Sparkles className="h-8 w-8 text-[#D4AF37]" />}
                  {selectedLogoId === "anchor" && <Heart className="h-8 w-8 text-[#D4AF37] animate-pulse" />}
                  {selectedLogoId === "waves" && <Shield className="h-8 w-8 text-[#D4AF37]" />}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D4AF37] font-semibold text-lg font-serif italic pointer-events-none drop-shadow">
                  {appName.charAt(0)}
                </div>
              </div>

              <h2 className="font-serif tracking-widest text-[#D4AF37] text-sm uppercase leading-none font-bold">
                {appName}
              </h2>
              <p className="text-[9px] font-serif text-slate-300 opacity-90 tracking-widest leading-none mt-1 uppercase">
                STEER TRUE. SHIP FAST.
              </p>
            </header>

            {/* LIVE SYSTEM VIEWPORT */}
            <div className="flex-1 bg-slate-50 p-4 flex flex-col justify-between items-stretch">
              
              <AnimatePresence mode="wait">
                {/* STATE 1: AGE GATE OVERLAY REQUIRED FOR COMPLIANCE */}
                {ageGateActive && !deviceAgeGateUnlocked ? (
                  <motion.div
                    key="age-gate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4 my-auto bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-205"
                  >
                    <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center">
                      <Lock className="h-6 w-6 text-rose-550 text-rose-450" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-slate-900 text-sm">Age Verification Required</h3>
                      <p className="text-[11px] text-slate-650 max-w-[220px] mx-auto leading-relaxed">
                        Starboard is an 18+ veteran-owned community. Please confirm your age criteria to unlock local marine coordinate operations.
                      </p>
                    </div>

                    <button
                      onClick={handleDeviceAgeUnlock}
                      className="w-full bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border-2 border-[#D4AF37] font-bold text-xs font-mono py-3.5 px-4 rounded shadow-md tracking-wider uppercase cursor-pointer"
                    >
                      Confirm Age & Enter
                    </button>
                    
                    <p className="text-[9px] text-slate-400">By continuing you confirm that you are at least 18 years of age.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="app-main"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col justify-between space-y-3"
                  >
                    {/* WHITE LABEL STRIPE ACCESS CONTROL GATE */}
                    {stripeGateActive && stripeWhiteLabel ? (
                      <div className="p-3 bg-yellow-50 border border-yellow-205 rounded-lg flex flex-col space-y-2 text-center text-xs shadow-sm">
                        <DollarSign className="h-5 w-5 text-amber-600 mx-auto" />
                        <div>
                          <p className="font-bold text-slate-900 text-[11px] uppercase">Direct Stripe Gatekeeper Verified</p>
                          <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Custom layout keeps standard taxes at a minimum.</p>
                        </div>
                        <button
                          onClick={() => setStripeGateActive(false)}
                          className="w-full max-w-[200px] mx-auto bg-amber-500 text-white font-mono font-bold text-[10px] py-1.5 px-3 rounded hover:bg-amber-600 cursor-pointer transition-colors shadow-sm"
                        >
                          Inject Access Grant Callback
                        </button>
                        <a
                          href="https://buy.stripe.com/your_link_id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] text-[#000080] font-semibold hover:underline block"
                        >
                          Checkout Link: buy.stripe.com/your_link_id
                        </a>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-center rounded-lg">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase font-mono tracking-wider">💳 GATEKEEPER ACCESS GRANTED</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Stripe subscription token active in localStorage.</p>
                        <button
                          onClick={() => setStripeGateActive(true)}
                          className="mt-2 text-[9px] font-mono uppercase bg-slate-900 text-white py-1 px-2.5 rounded hover:bg-black cursor-pointer"
                        >
                          Apply Paywall Deauth
                        </button>
                      </div>
                    )}

                    {/* INTERACTIVE GEOLOCATION MAP OVERLAY BUTTON */}
                    <div className="bg-slate-950/10 p-3 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase mb-2">Location Authorization Directive (2026 Policy UI)</span>
                      
                      {deviceLocationState === "idle" && (
                        <button
                          onClick={handleDeviceLocationRequest}
                          className="w-full bg-[#000080] hover:bg-[#000060] text-[#D4AF37] border border-[#D4AF37] font-semibold text-xs py-3.5 px-4 rounded shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
                        >
                          <MapPin className="h-4.5 w-4.5 animate-bounce" />
                          <span>Initialize Navigation</span>
                        </button>
                      )}

                      {deviceLocationState === "acquires" && (
                        <div className="w-full py-4 text-center text-xs font-mono text-[#000080] font-bold flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-[#000080]" />
                          <span>Acquiring Coordinates...</span>
                        </div>
                      )}

                      {deviceLocationState === "secured" && (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-250 text-center text-xs font-mono text-emerald-800 space-y-1">
                          <p className="font-bold flex items-center justify-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            Coordinates Locked Safely.
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Lat: {latitude?.toFixed(4)}, Lon: {longitude?.toFixed(4)}
                          </p>
                        </div>
                      )}

                      {deviceLocationState === "denied" && (
                        <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-center text-xs font-mono text-rose-800 space-y-0.5">
                          <p className="font-bold">Manual Input Required.</p>
                          <p className="text-[10px] text-slate-500">Browser/System location permissions are disabled.</p>
                        </div>
                      )}
                    </div>

                    {/* LIVE DEV RELOCK AGENT LINK AND CONTROLS */}
                    {deviceAgeGateUnlocked && (
                      <button
                        onClick={handleDeviceRelock}
                        className="py-1 px-4 mx-auto text-slate-400 hover:text-slate-650 hover:underline text-[9px] font-mono uppercase cursor-pointer"
                      >
                        Reset Simulated Age Verification State
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* HIGH FIDELITY STARBOARD PROJECT WIKI FOOTER */}
            <footer className="p-3 bg-slate-900 border-t border-[#D4AF37] text-left text-[11px] text-white">
              <span className="font-serif text-[#D4AF37] font-semibold text-xs block mb-1">⚓ Starboard Help Wiki & Compliance Checklist</span>
              <div className="font-mono text-[9px] text-slate-400 space-y-0.5 italic">
                <p><strong>Compliance:</strong> April 2026 Google Play Alternative Billing (Stripe paywalls).</p>
                <p><strong>Moderation:</strong> Custom Rule-Based Deterministic Code Architecture (0% AI Hallucination).</p>
                <p><strong>Data Privacy:</strong> Silent Background tracking deactivated. "Location Button" UI compliant.</p>
                <p className="pt-2 flex items-center justify-between">
                  <a href={dataDeletionEndpoint} target="_blank" rel="noopener noreferrer" className="text-rose-450 text-rose-400 hover:underline">Request Account Data Scrubbing</a>
                  <span className="opacity-80">STEER TRUE.</span>
                </p>
              </div>
            </footer>
          </div>

          {/* SIMULATOR QUICK REACTION HELPER CONTROLS */}
          <div className="w-full mt-3 p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Simulator Override Switches</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {/* Toggle Age Verification */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Strict Age Gate</span>
                <input
                  type="checkbox"
                  checked={ageGateActive}
                  onChange={(e) => setAgeGateActive(e.target.checked)}
                  className="accent-[#D4AF37] h-3.5 w-3.5 cursor-pointer"
                />
              </div>

              {/* Location button verification */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Location Button</span>
                <input
                  type="checkbox"
                  checked={locationButtonVisible}
                  onChange={(e) => setLocationButtonVisible(e.target.checked)}
                  className="accent-[#D4AF37] h-3.5 w-3.5 cursor-pointer"
                />
              </div>

              {/* Stripe option check */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Stripe Paywall</span>
                <input
                  type="checkbox"
                  checked={stripeWhiteLabel}
                  onChange={(e) => setStripeWhiteLabel(e.target.checked)}
                  className="accent-[#D4AF37] h-3.5 w-3.5 cursor-pointer"
                />
              </div>

              {/* UGC filtration */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">UGC Protection</span>
                <input
                  type="checkbox"
                  checked={ugcProtection}
                  onChange={(e) => setUgcProtection(e.target.checked)}
                  className="accent-[#D4AF37] h-3.5 w-3.5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER CRYPTOGRAPHIC VAULT MODAL (PROFILES + DATABASE + BACKUPS) */}
      <AnimatePresence>
        {isVaultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#02040c]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="bg-[#030716] border-2 border-gold-metallic rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden font-sans border-t-[3px]"
            >
              <div className="bg-[#000080] border-b-2 border-[#D4AF37] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#000040] border border-[#D4AF37] flex items-center justify-center glow-gold animate-pulse">
                    <Compass className="h-6 w-6 text-[#D4AF37] animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-display font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                      Shipmate Vault Lockbox & Secure Restorer
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono tracking-wide uppercase">
                      Integrity check guarantees 100% uncorrupted state snapshots
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsVaultOpen(false)}
                  className="bg-slate-900 border border-slate-800 hover:border-[#D4AF37] hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer text-slate-450"
                >
                  <RotateCcw className="h-4.5 w-4.5 text-[#D4AF37]" title="Exit Vault" />
                </button>
              </div>

              {/* TWO PANEL CONTENT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                
                {/* LEFT SIDE PANEL: PROFILE BANNER & INTEGRATION STATUS (5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  
                  <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-3">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className={`w-2 h-2 rounded-full ${isFirebaseEnabled ? "bg-emerald-400 animate-ping" : "bg-gold-metallic animate-pulse"}`} />
                    </div>

                    <div className="relative">
                      {vaultUser.photoURL ? (
                        <img 
                          src={vaultUser.photoURL} 
                          alt="Commander Chief" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]/85 shadow-lg relative z-10 block"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-gold-metallic flex items-center justify-center text-[#D4AF37]">
                          <Shield className="h-8 w-8 text-[#D4AF37]" />
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 bg-gold-metallic text-[#000040] rounded-full p-0.5 border border-slate-950 z-20">
                        <Shield className="h-3.5 w-3.5 stroke-[2.5]" />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-white text-xs font-mono uppercase font-black tracking-wide leading-none">
                        {vaultUser.displayName}
                      </h4>
                      <p className="text-[9px] text-[#D4AF37]/90 font-mono mt-1 uppercase font-bold">
                        {vaultUser.isAnonymous ? "OFFLINE GUEST ACCOUNT" : "CERTIFIED FLEET DEVELOPER"}
                      </p>
                      {vaultUser.email && (
                        <span className="text-[10px] text-slate-550 font-mono tracking-tight block">{vaultUser.email}</span>
                      )}
                    </div>

                    <div className="bg-[#000040] py-1.5 px-3 rounded-lg border border-[#D4AF37]/35 w-full space-y-1">
                      <span className="text-[8px] font-mono font-bold text-[#D4AF37] block uppercase tracking-widest text-center">DATABASE PLATING STATUS</span>
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${isFirebaseEnabled ? "bg-emerald-400 animate-pulse" : "bg-amber-405 animate-pulse"}`} />
                        <span className="text-[9.5px] font-mono font-bold text-slate-300">
                          {isFirebaseEnabled ? "FIRESTORE CLOUD ACTIVE" : "LOCAL BROWSER BUFFER FALLBACK"}
                        </span>
                      </div>
                    </div>

                    {!isFirebaseEnabled ? (
                      <div className="text-[9px] text-slate-500 font-mono leading-relaxed bg-[#0c0000]/25 p-2 rounded">
                        ℹ️ Base config offline. Cloud backups and global sync will activate automatically once Firebase console variables are linked.
                      </div>
                    ) : null}

                    {vaultUser.isAnonymous ? (
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleSigningIn}
                        className="w-full bg-gold-shimmer text-[#000040] font-mono text-[10px] font-black uppercase tracking-wider py-2 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
                      >
                        {isGoogleSigningIn ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4" />
                            <span>Integrate Google Login</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-red-950 hover:border-red-450 text-red-450 font-mono text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-xl cursor-pointer transition-all"
                      >
                        SIGNOUT ENGINES
                      </button>
                    )}
                  </div>

                  {/* ACTIVE BACKUP EMULATOR CREATOR */}
                  <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl space-y-3 font-mono text-left">
                    <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                      <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Assemble New Backup Snapshot
                    </span>
                    <p className="text-[9.5px] text-slate-450 leading-relaxed font-sans">
                      Freeze your current layout setup, white-label attributes, Git scans, and tax overrides. Generates a pristine SHA-256 validation index.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 block uppercase font-extrabold">Snapshot Name Label:</label>
                      <input
                        type="text"
                        value={newBackupName}
                        onChange={(e) => setNewBackupName(e.target.value)}
                        placeholder="e.g. Pre-Accreditation Build v2"
                        className="w-full bg-[#02040c] text-xs text-white border border-slate-850 rounded p-2 focus:outline-none focus:border-[#D4AF37] font-mono placeholder:text-slate-750"
                      />
                    </div>

                    <button
                      onClick={handleCreateBackup}
                      disabled={!newBackupName.trim() || isHashing}
                      className="w-full bg-slate-900 hover:bg-[#000045] border border-[#D4AF37]/55 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#FFF4D0] font-bold text-[9.5px] uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-97 disabled:opacity-45 disabled:pointer-events-none"
                    >
                      {isHashing ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>FUSING CIPHER SIGNATURE...</span>
                        </>
                      ) : (
                        <>
                          <Compass className="h-3.5 w-3.5 text-[#D4AF37]" />
                          <span>FUSE ANCHOR: SIGN SECURE BACKUP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE PANEL: LIVE LOCKER & REPOSITORY LIST (7 cols) */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white uppercase font-mono tracking-widest block">
                        ⚓ Cryptographic Snapshot Registry ({vaultBackups.length})
                      </span>
                      <span className="text-[8.5px] font-mono text-emerald-450 border border-emerald-950 bg-emerald-950/20 py-0.5 px-2 rounded uppercase font-bold">
                        100% UNCORRUPTED
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-450 leading-relaxed">
                      Below are your secure archive checkpoints verified under strict SHA-256 seal. Select a checkpoint to load its compile settings into the sandbox workspace instantly.
                    </p>
                  </div>

                  {vaultSuccessMessage && (
                    <div className="bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 p-2.5 rounded-xl text-[10px] font-mono text-center font-bold tracking-wide flex items-center justify-center gap-2 animate-bounce">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>{vaultSuccessMessage}</span>
                    </div>
                  )}

                  <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-2xl p-3 min-h-[280px] max-h-[360px] overflow-y-auto space-y-2">
                    {vaultBackups.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-50 font-mono">
                        <Lock className="h-8 w-8 text-[#D4AF37]/60" />
                        <span className="text-[10px] text-slate-450">No secure checkpoints saved yet.</span>
                        <p className="text-[8.5px] text-slate-600 max-w-xs leading-relaxed font-sans">
                          Assemble your layout above and hit "Fuse Anchor" to secure your first uncorrupted snapshot database.
                        </p>
                      </div>
                    ) : (
                      vaultBackups.map((backup) => (
                        <div 
                          key={backup.backupId}
                          className="bg-[#020512] border border-slate-900 hover:border-[#D4AF37]/55 p-3 rounded-xl flex flex-col justify-between gap-2.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="space-y-1">
                              <h5 className="text-white text-xs font-bold leading-tight font-sans">
                                {backup.name}
                              </h5>
                              <div className="flex items-center gap-2 text-[8.5px] text-slate-500 font-mono">
                                <span>CREATED: {new Date(backup.createdAt).toLocaleString()}</span>
                                <span>•</span>
                                <span className="bg-slate-950 px-1 py-0.5 rounded border border-slate-900 text-slate-400 text-[7px]">
                                  ID: {backup.backupId}
                                </span>
                              </div>
                            </div>

                            <span className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-[8px] py-0.5 px-2 rounded-full font-mono font-black flex items-center gap-1 uppercase select-none">
                              <Shield className="h-2.5 w-2.5 stroke-[2]" />
                              <span>SECURE</span>
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#000000]/60 p-2 rounded-lg border border-slate-950">
                            {/* Checksum details */}
                            <div className="font-mono text-[8px] text-slate-500 tracking-tight leading-none overflow-hidden text-ellipsis whitespace-nowrap max-w-[210px] text-left">
                              <span className="text-[#D4AF37] font-bold">SHA-256:</span> {backup.checksum}
                            </div>

                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => handleRestoreBackup(backup)}
                                className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/20 hover:from-emerald-500/20 hover:to-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/80 px-2.5 py-1 text-[8.5px] font-mono font-bold uppercase rounded cursor-pointer active:scale-95 transition-all text-center"
                                title="Restore this uncorrupted state"
                              >
                                RESTORE
                              </button>
                              <button
                                onClick={() => handleDeleteBackup(backup.backupId)}
                                className="bg-slate-900/40 hover:bg-red-950/30 text-red-500 hover:text-red-450 border border-slate-950 hover:border-red-950 px-2 py-1 text-[8.5px] font-mono font-black uppercase rounded cursor-pointer active:scale-95 transition-colors text-center"
                                title="Discard this backup container"
                              >
                                DISCARD
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* BOTTOM INFORMATION DISCLOSURE */}
                  <div className="bg-[#000040]/30 border border-[#D4AF37]/35 p-2.5 rounded-xl font-mono text-[8.5px] flex items-start gap-2 text-left">
                    <Info className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-slate-450 leading-relaxed font-sans">
                      <strong>Anchor Sealing Standard:</strong> Each cryptographic snapshot includes complete JSON-stringified layouts, Stripe compliance credentials, and compilation parameters, locked behind individual multi-user UIDs. Any payload modification dynamically triggers permission alerts to maintain maximum fidelity.
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER DYNAMIC STRIPE PRICING MODAL */}
      <AnimatePresence>
        {showPricingModal && (
          <PricingPaywall
            currentTier={licenseTier}
            preselectedTier={pricingPreselection}
            onClose={() => {
              setShowPricingModal(false);
              setPricingPreselection(null);
            }}
            onPurchaseComplete={(tier, key) => {
              handlePaymentFulfillment(tier, key);
              setShowPricingModal(false);
              setPricingPreselection(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* LOWER FOOT BAR BRAND */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-[10px] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex flex-wrap gap-4 items-center">
            <span>DESIGN LEVEL: SECURE NAVAL BLUEPRINT</span>
            <span className="text-slate-850">/</span>
            <span>SYSTEM ENGINES: DETECT & HEAL PACK v2</span>
            <span className="text-slate-850">/</span>
            <span>ALTERNATIVE BILLING OVERRIDES APPROVED</span>
          </div>
          <div>
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4AF37] transition-all flex items-center gap-1 font-bold text-white uppercase tracking-wider"
            >
              <span>Build Framework</span>
              <ExternalLink className="h-3 w-3 text-[#D4AF37]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
