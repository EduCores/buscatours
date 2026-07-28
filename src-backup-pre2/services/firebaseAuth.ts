import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  }
  return app || getApps()[0];
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());

    // En desarrollo local, conectar al emulador de Authentication.
    if (import.meta.env.VITE_USE_EMULATORS === 'true') {
      // El SDK de Auth detecta automaticamente FIREBASE_AUTH_EMULATOR_HOST,
      // pero lo forzamos por si las var de entorno del CLI no llegan a Vite.
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    }
  }
  return auth;
}

export function getCloudFunctions() {
  const functions = getFunctions(getFirebaseApp(), 'us-central1');
  if (import.meta.env.VITE_USE_EMULATORS === 'true') {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  }
  return functions;
}

export async function login(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function ensureEmulatorUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) return auth.currentUser;

  if (import.meta.env.VITE_USE_EMULATORS === 'true') {
    try {
      return await login('admin@buscatours.com', 'admin123');
    } catch (e) {
      console.warn('Auto-login emulator failed, continuing without user.', e);
    }
  }
  return null;
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}

export function getAuthUid(): string | null {
  const auth = getFirebaseAuth();
  return auth.currentUser?.uid ?? null;
}


