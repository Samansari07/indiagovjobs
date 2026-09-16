import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { ensureProfile, checkIsAdmin } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function hydrateUser(sessionUser) {
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    setUser(sessionUser);
    try {
      const [p, admin] = await Promise.all([
        ensureProfile(sessionUser),
        checkIsAdmin(sessionUser.id),
      ]);
      setProfile(p);
      setIsAdmin(admin);
    } catch {
      // Non-fatal: user stays logged in, profile can be retried on Profile page.
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await hydrateUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await hydrateUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = { user, profile, isAdmin, loading, setProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
