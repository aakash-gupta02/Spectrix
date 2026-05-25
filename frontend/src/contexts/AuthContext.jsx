"use client";

import { authAPI } from "@/lib/api/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);


  // fetch current user on initial load to determine auth state
  const fetchMe = useCallback(async () => {

    try {
      const payload = await authAPI.getMe();

      if (payload?.success && payload?.user) {
        setUser(payload.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsInitialized(true);
    }

  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  const setAuthenticatedUser = useCallback((nextUser) => {
    setUser(nextUser || null);
  }, []);

  // optional immediate hydration
  // after login response
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
      refetchUser: fetchMe,
    }),

    [
      user,
      isInitialized,
      setAuthenticatedUser,
      applyLoginResponse,
      clearAuth,
      fetchMe,
    ],
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

  return useCallback(
    (actionName = "This action") => {
      if (isDemoUser) {
        toast.error(
          `${actionName} is blocked in demo account. Demo accounts are read-only.`,
        );

        return false;
      }

      return true;
    },

    [isDemoUser],
  );
}
