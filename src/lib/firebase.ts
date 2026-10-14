import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDocFromServer, getDoc } from 'firebase/firestore';
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

import { compressDataUrl } from './imageOptimizer';

export interface StudioConfigPayload {
  projects: Project[];
  footerLogo: string | null;
  footerLogoHeight: number;
}

const OVERFLOW_DOC_ID = `${STUDIO_CONFIG_DOC_ID}_overflow`;

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

// Auto-compress any project images that are heavier than 100 KB to keep cloud sync blazing fast
export async function sanitizeAndCompressProjects(projects: Project[]): Promise<Project[]> {
  const result: Project[] = [];
  for (const p of projects) {
    // Gather all valid images from either images array or customImageUrl
    const rawImages = (
      p.images && Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : p.customImageUrl
        ? [p.customImageUrl]
        : []
    ).filter((img): img is string => typeof img === 'string' && img.trim().length > 0);

    const compressedImages: string[] = [];
    for (const imgUrl of rawImages) {
      if (imgUrl.startsWith('data:image/') && imgUrl.length > 110000) {
        try {
          const compressed = await compressDataUrl(imgUrl, 1280, 1280, 0.78);
          compressedImages.push(compressed);
        } catch {
          compressedImages.push(imgUrl);
        }
      } else {
        compressedImages.push(imgUrl);
      }
    }

    const updatedProject: Project = {
      ...p,
      images: compressedImages,
      customImageUrl: compressedImages[0] || p.customImageUrl || '',
      fitMode: p.fitMode || 'cover',
      aspectRatio: p.aspectRatio || '1350x1080',
    };

    result.push(updatedProject);
  }
  return result;
}

// Subscribe to real-time studio configuration across all devices & browsers
export function subscribeToStudioConfig(
  onData: (data: StudioConfigPayload, source: 'cloud' | 'tab') => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
  const overflowRef = doc(db, STUDIO_CONFIG_COLLECTION, OVERFLOW_DOC_ID);

  let overflowProjects: Project[] = [];
  let mainConfigData: StudioConfigPayload | null = null;

  // Helper to emit combined data
  const emitCombined = () => {
    if (mainConfigData) {
      const allProjects = overflowProjects.length > 0
        ? [...mainConfigData.projects, ...overflowProjects]
        : mainConfigData.projects;
      onData({ ...mainConfigData, projects: allProjects }, 'cloud');
    }
  };

  // 1. Listen for real-time Firestore updates (different browsers, devices, locations)
  const unsubscribeFirestore = onSnapshot(
    docRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw && Array.isArray(raw.projects) && raw.projects.length > 0) {
          mainConfigData = {
            projects: raw.projects as Project[],
            footerLogo: raw.footerLogo ?? null,
            footerLogoHeight: typeof raw.footerLogoHeight === 'number' ? raw.footerLogoHeight : 32,
          };

          if (raw.hasOverflow) {
            try {
              const overflowSnap = await getDoc(overflowRef);
              if (overflowSnap.exists()) {
                const overflowData = overflowSnap.data();
                if (overflowData && Array.isArray(overflowData.projects)) {
                  overflowProjects = overflowData.projects as Project[];
                }
              }
            } catch (err) {
              console.warn('Erro ao carregar partição secundária:', err);
            }
          } else {
            overflowProjects = [];
          }

          emitCombined();
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

// Save studio configuration to Firestore to broadcast to all devices simultaneously without arbitrary limits
export async function saveStudioConfigToFirebase(
  projects: Project[],
  footerLogo: string | null,
  footerLogoHeight: number
): Promise<{ success: boolean; error?: string }> {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
  const overflowRef = doc(db, STUDIO_CONFIG_COLLECTION, OVERFLOW_DOC_ID);

  // 1. Auto-compress any heavy artworks to high-efficiency WebP
  const cleanProjects = await sanitizeAndCompressProjects(projects);

  const payload = {
    projects: cleanProjects,
    footerLogo: footerLogo ?? null,
    footerLogoHeight,
    hasOverflow: false,
    updatedAt: new Date().toISOString(),
  };

  // Strip any accidental undefined fields that Firestore rejects
  const sanitizedPayload = JSON.parse(JSON.stringify(payload));

  // 2. If projects payload exceeds 650 KB, partition into multiple documents so storage is never blocked
  const estimatedSize = JSON.stringify(sanitizedPayload).length;
  try {
    if (estimatedSize > 650000 && cleanProjects.length > 1) {
      const mid = Math.ceil(cleanProjects.length / 2);
      const primaryProjects = cleanProjects.slice(0, mid);
      const overflowProjects = cleanProjects.slice(mid);

      // Write overflow chunk
      await setDoc(overflowRef, JSON.parse(JSON.stringify({
        projects: overflowProjects,
        updatedAt: new Date().toISOString(),
      })));

      // Write primary chunk
      await setDoc(docRef, JSON.parse(JSON.stringify({
        projects: primaryProjects,
        footerLogo: footerLogo ?? null,
        footerLogoHeight,
        hasOverflow: true,
        updatedAt: new Date().toISOString(),
      })));
    } else {
      await setDoc(docRef, sanitizedPayload);
    }

    // Broadcast locally to any other open tabs immediately
    broadcastLocalSync({ projects: cleanProjects, footerLogo, footerLogoHeight });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${STUDIO_CONFIG_COLLECTION}/${STUDIO_CONFIG_DOC_ID}`);
    throw error;
  }
}

