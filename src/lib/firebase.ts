import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Same Firebase project used by the RaVida Schedule/Checkins app and the
// standalone booking.html site — all three share this one database, so
// services/categories/hours/bookings entered anywhere show up everywhere.
const firebaseConfig = {
  apiKey: "AIzaSyAdIWtK-ojPZvncUnKeek-OzNRYG--xRbA",
  authDomain: "ravida-scheduler1432.firebaseapp.com",
  projectId: "ravida-scheduler1432",
  storageBucket: "ravida-scheduler1432.firebasestorage.app",
  messagingSenderId: "208477456951",
  appId: "1:208477456951:web:2cafc93f28a81ef5a2cdb2",
};

// TanStack Start renders on the server too; Firebase's JS SDK is browser-only,
// so guard initialization to only happen client-side.
const app = typeof window !== "undefined" ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : undefined;

export const auth = app ? getAuth(app) : (undefined as unknown as ReturnType<typeof getAuth>);
export const db = app ? getFirestore(app) : (undefined as unknown as ReturnType<typeof getFirestore>);
export const isBrowser = typeof window !== "undefined";
