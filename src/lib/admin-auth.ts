import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isBrowser } from "./firebase";

interface AdminAuthState {
  user: User | null;
  name: string;
  isAdmin: boolean;
  loading: boolean;
}

interface UserDocShape {
  permissions?: Record<string, boolean> | undefined;
  name?: string | undefined;
}

async function fetchUserDoc(uid: string): Promise<UserDocShape | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    permissions: data["permissions"] as Record<string, boolean> | undefined,
    name: data["name"] as string | undefined,
  };
}

/** Mirrors the admin gate used across every RaVida tool: same Firebase Auth
 *  accounts, same `users/{uid}.permissions.admin === true` check. */
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({ user: null, name: "", isAdmin: false, loading: true });

  useEffect(() => {
    if (!isBrowser) return;
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, name: "", isAdmin: false, loading: false });
        return;
      }
      const userDoc = await fetchUserDoc(user.uid);
      const isAdmin = userDoc?.permissions?.["admin"] === true;
      const name = userDoc?.name ?? user.email ?? "";
      if (!isAdmin) await signOut(auth);
      setState({ user: isAdmin ? user : null, name: isAdmin ? name : "", isAdmin, loading: false });
    });
  }, []);

  async function login(email: string, password: string): Promise<string | null> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await fetchUserDoc(cred.user.uid);
      if (userDoc?.permissions?.["admin"] !== true) {
        await signOut(auth);
        return "This account does not have admin access.";
      }
      return null;
    } catch (err) {
      const code = (err as { code?: string }).code;
      const map: Record<string, string> = {
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/user-not-found": "No account with that email.",
        "auth/too-many-requests": "Too many attempts, try again shortly.",
      };
      return (code && map[code]) || (err as Error).message || "Sign-in failed.";
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return { ...state, login, logout };
}
