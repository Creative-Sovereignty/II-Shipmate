import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User,
  signInAnonymously
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Check if Firebase is realistically configured with real parameters
export const isFirebaseEnabled = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);

let appVar: any = null;
let authVar: any = null;
let dbVar: any = null;

if (isFirebaseEnabled) {
  try {
    appVar = initializeApp(firebaseConfig);
    dbVar = getFirestore(appVar, firebaseConfig.firestoreDatabaseId || "(default)");
    authVar = getAuth(appVar);
    
    // Validate connection to Firestore as requested by skill
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(dbVar, "test_connection", "ping"));
      } catch (error) {
        if (error instanceof Error && error.message.includes("offline")) {
          console.warn("[Firebase] Client appears offline or connection tests blocked.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("[Firebase] Error during initialization:", error);
  }
}

export const app = appVar;
export const db = dbVar;
export const auth = authVar;

// 1. OPERATION ENUM & ERROR HANDLING (Rule 3)
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = authVar?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || "anonymous_stub_id",
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || false,
      isAnonymous: currentUser?.isAnonymous || false,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("[Firestore Hardened Error Handler]:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 2. HELPER TO PROVIDE SHA-256 SIGNATURE FOR UNCORRUPTED BACKUP ENFORCEMENT
export async function calculateSHA256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // Basic fallback hash for unsupported browsers or tests
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padEnd(8, "f");
    return `${hex}fallback-dummy-hash-signature-block-value-padded-out-to-64hex`.substring(0, 64);
  }
}

// Mock auth / profile objects for when Firebase config is absent
export interface ShipmateUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  isAnonymous: boolean;
}

export const localUserStorageKey = "shipmate_local_user";
export const getLocalUser = (): ShipmateUser => {
  const stored = localStorage.getItem(localUserStorageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  
  // Default unauthenticated / anonymous user
  const newUser: ShipmateUser = {
    uid: "guest_shipmate_master",
    displayName: "Shipmate Commander",
    email: "commander@sovranlyip.com",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    isAnonymous: true
  };
  localStorage.setItem(localUserStorageKey, JSON.stringify(newUser));
  return newUser;
};

export const saveLocalUser = (user: Partial<ShipmateUser>) => {
  const current = getLocalUser();
  const updated = { ...current, ...user };
  localStorage.setItem(localUserStorageKey, JSON.stringify(updated));
  return updated;
};

// 3. SECURE BACKUP DATA SCHEMAS
export interface BackupPayload {
  backupId: string;
  userId: string;
  name: string;
  appConfig: string; // stringified JSON
  checksum: string;  // SHA-256 verification hash
  createdAt: string; // ISO String
}

// LOCAL HARDENED BACKUPS REPOSITORY (LocalStorage)
const localBackupsKey = "shipmate_local_backups";
export const getLocalBackups = (): BackupPayload[] => {
  const raw = localStorage.getItem(localBackupsKey);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalBackup = (backup: BackupPayload) => {
  const current = getLocalBackups();
  // Filter out duplicates
  const updated = [backup, ...current.filter(b => b.backupId !== backup.backupId)];
  localStorage.setItem(localBackupsKey, JSON.stringify(updated));
  return updated;
};

export const deleteLocalBackup = (backupId: string) => {
  const current = getLocalBackups();
  const updated = current.filter(b => b.backupId !== backupId);
  localStorage.setItem(localBackupsKey, JSON.stringify(updated));
  return updated;
};
