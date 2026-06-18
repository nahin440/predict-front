// Firebase client — lazy singleton, safe for SSR/prerender
// Firebase is NEVER initialized at module load time.
// All initialization happens inside getFirebaseApp() which is called only in browser event handlers.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;

  // These MUST exist as NEXT_PUBLIC_ env vars in Vercel dashboard
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || apiKey === "undefined") {
    throw new Error(
      "Firebase API key is missing. Add NEXT_PUBLIC_FIREBASE_API_KEY to your Vercel environment variables."
    );
  }

  const config = {
    apiKey,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  _app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  return _app;
}

function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

/**
 * Sign in with Google popup.
 * Only call this inside a browser event handler (e.g. button onClick).
 * Never import at module top level — always use dynamic import():
 *   const { signInWithGoogle } = await import("@/lib/firebase/client");
 */
export async function signInWithGoogle() {
  const auth     = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}
