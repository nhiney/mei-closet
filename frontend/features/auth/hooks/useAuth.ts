"use client";

import { useEffect, useState, useCallback } from "react";
import { loadSession, clearSession, type Session } from "@/lib/auth/session";

export function useAuth() {
  const [user, setUser] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAction = useCallback(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAction();
    
    const handleAuthChange = () => refreshAction();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("mei-auth-change", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("mei-auth-change", handleAuthChange);
    };
  }, [refreshAction]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    // Notify other components
    window.dispatchEvent(new Event("mei-auth-change"));
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    logout,
    refreshAuth: refreshAction
  };
}
