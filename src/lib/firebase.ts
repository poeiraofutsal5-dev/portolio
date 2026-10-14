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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local cached data.');
    }
  }
}

// Subscribe to real-time studio configuration across all devices
export function subscribeToStudioConfig(
  onData: (data: { projects: Project[]; footerLogo: string | null; footerLogoHeight: number }) => void
) {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
  
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        if (raw && Array.isArray(raw.projects) && raw.projects.length > 0) {
          onData({
            projects: raw.projects as Project[],
            footerLogo: raw.footerLogo ?? null,
            footerLogoHeight: typeof raw.footerLogoHeight === 'number' ? raw.footerLogoHeight : 32,
          });
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${STUDIO_CONFIG_COLLECTION}/${STUDIO_CONFIG_DOC_ID}`);
    }
  );
}

// Save studio configuration to Firestore to broadcast to all devices
export async function saveStudioConfigToFirebase(
  projects: Project[],
  footerLogo: string | null,
  footerLogoHeight: number
): Promise<void> {
  const docRef = doc(db, STUDIO_CONFIG_COLLECTION, STUDIO_CONFIG_DOC_ID);
  try {
    await setDoc(docRef, {
      projects,
      footerLogo: footerLogo ?? null,
      footerLogoHeight,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${STUDIO_CONFIG_COLLECTION}/${STUDIO_CONFIG_DOC_ID}`);
  }
}
