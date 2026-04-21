"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

const AUTH_STORAGE_KEY = "spectrix.auth.user";
const AuthContext = createContext(null);

function readStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setUser(readStoredUser());
      setIsInitialized(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    writeStoredUser(null);
  }, []);

  const setAuthenticatedUser = useCallback((nextUser) => {
    const normalizedUser = nextUser || null;
    setUser(normalizedUser);
    writeStoredUser(normalizedUser);
  }, []);

  const applyLoginResponse = useCallback(
    (responsePayload) => {
      const payload = responsePayload?.data ?? responsePayload;

      if (payload?.success && payload?.user) {
        setAuthenticatedUser(payload.user);
      }

      return payload;
    },
    [setAuthenticatedUser],
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isDemoUser: user?.role === "demo",
      isInitialized,
      setAuthenticatedUser,
      applyLoginResponse,
      clearAuth,
    }),
    [applyLoginResponse, clearAuth, isInitialized, setAuthenticatedUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function useDemoAction() {
  const { isDemoUser } = useAuth();
  
  return useCallback((actionName = "This action") => {
    if (isDemoUser) {
      toast.error(
        `${actionName} is blocked in demo account. Demo accounts are read-only.`
      );
      return false;
    }
    return true;
  }, [isDemoUser]);
}
