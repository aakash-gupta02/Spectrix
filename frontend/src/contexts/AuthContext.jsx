"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [user, setUser] = useState(() => readStoredUser());

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
      isInitialized: true,
      setAuthenticatedUser,
      applyLoginResponse,
      clearAuth,
    }),
    [applyLoginResponse, clearAuth, setAuthenticatedUser, user],
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
