import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "vault-auth";

// NOTE on token storage: the backend README recommends keeping the JWT in
// memory only, since localStorage is readable by any injected script (XSS).
// This app persists to localStorage instead, trading some of that safety for
// not forcing a re-login on every page refresh — reasonable for a small
// storefront, but worth revisiting (e.g. httpOnly cookie + refresh token)
// before this holds anything more sensitive than a jewelry order.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = async (email, password) => {
    const result = await authApi.login({ email, password });
    setSession(result);
    return result;
  };

  const signup = async (name, email, password) => {
    const result = await authApi.signup({ name, email, password });
    setSession(result);
    return result;
  };

  const logout = () => setSession(null);

  return (
    <AuthContext.Provider
      value={{
        token: session?.token ?? null,
        user: session?.user ?? null,
        isAuthenticated: !!session?.token,
        isAdmin: session?.user?.role === "ADMIN",
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
