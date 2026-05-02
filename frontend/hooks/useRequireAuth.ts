"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        // Store action to run after login (UX only — no auto-run for security)
        // Store action to run after login (UX only — no auto-run for security)
        setShowLoginPrompt(true);
      }
    },
    [isAuthenticated]
  );

  const closeLoginPrompt = useCallback(() => {
    setShowLoginPrompt(false);
  }, []);

  return { requireAuth, showLoginPrompt, closeLoginPrompt };
}
