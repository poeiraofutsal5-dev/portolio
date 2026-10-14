import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { Project } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Constant Document ID provided by user for syncing across all devices
export const STUDIO_CONFIG_DOC_ID = 'UiDBo8OtShNXwp46ZnX2';
export const STUDIO_CONFIG_COLLECTION = 'studio_config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot using the actual document
export async function testConnection(): Promise<boolean> {
  try {
    const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
    await getDocFromServer(docRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local cached data.');
    } else {
      console.warn('Firebase test connection notice:', error);
    }
    return false;
  }
}

export interface StudioConfigPayload {
  projects: Project[];
  footerLogo: string | null;
  footerLogoHeight: number;
}

// Create a local BroadcastChannel for zero-latency sync between multiple tabs in the same browser
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('jpx_studio_realtime_sync');
  }
} catch {
  syncChannel = null;
}

export function broadcastLocalSync(data: StudioConfigPayload) {
  if (syncChannel) {
    try {
      syncChannel.postMessage(data);
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
}

// Subscribe to real-time studio configuration across all devices & browsers
export function subscribeToStudioConfig(
  onData: (data: StudioConfigPayload, source: 'cloud' | 'tab') => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);

  // 1. Listen for real-time Firestore updates (different browsers, devices, locations)
  const unsubscribeFirestore = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw && Array.isArray(raw.projects) && raw.projects.length > 0) {
          const configData: StudioConfigPayload = {
            projects: raw.projects as Project[],
            footerLogo: raw.footerLogo ?? null,
            footerLogoHeight: typeof raw.footerLogoHeight === 'number' ? raw.footerLogoHeight : 32,
          };
          onData(configData, 'cloud');
        }
      }
    },
    (error) => {
      console.warn('Firestore onSnapshot listener alert:', error);
      handleFirestoreError(error, OperationType.GET, `${STUDIO_CONFIG_COLLECTION}/${STUDIO_CONFIG_DOC_ID}`);
      if (onError) onError(error);
    }
  );

  // 2. Listen for instantaneous cross-tab events within the same browser
  const handleTabMessage = (event: MessageEvent<StudioConfigPayload>) => {
    if (event.data && Array.isArray(event.data.projects)) {
      onData(event.data, 'tab');
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleTabMessage);
  }

  // 3. Listen for window storage events as fallback for older browsers
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'jpx_custom_projects_v1' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const logo = localStorage.getItem('jpx_custom_footer_logo_v1');
          const heightStr = localStorage.getItem('jpx_custom_footer_logo_height_v1');
          onData({
            projects: parsed,
            footerLogo: logo || null,
            footerLogoHeight: heightStr ? parseInt(heightStr, 10) : 32,
          }, 'tab');
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  };
  window.addEventListener('storage', handleStorageChange);

  return () => {
    unsubscribeFirestore();
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleTabMessage);
    }
    window.removeEventListener('storage', handleStorageChange);
  };
}

// Save studio configuration to Firestore to broadcast to all devices simultaneously
export async function saveStudioConfigToFirebase(
  projects: Project[],
  footerLogo: string | null,
  footerLogoHeight: number
): Promise<{ success: boolean; error?: string }> {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
  const payload = {
    projects,
    footerLogo: footerLogo ?? null,
    footerLogoHeight,
    updatedAt: new Date().toISOString(),
  };

  // Pre-flight payload size check for safety (Firestore limit is 1,048,576 bytes)
  const estimatedSize = JSON.stringify(payload).length;
  if (estimatedSize > 1000000) {
    const errorMsg = `O tamanho dos dados (${Math.round(estimatedSize / 1024)} KB) excede o limite do Firestore (1 MB). Otimize ou reduza o tamanho das imagens.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    await setDoc(docRef, payload);
    // Broadcast locally to any other open tabs immediately
    broadcastLocalSync({ projects, footerLogo, footerLogoHeight });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${STUDIO_CONFIG_COLLECTION}/${STUDIO_CONFIG_DOC_ID}`);
    throw error;
  }
}
