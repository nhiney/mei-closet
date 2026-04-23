const SESSION_KEY = "mei_session_v1";
const AUTH_CHANGE = "mei-auth-change";

export type Session = {
  accessToken: string;
  email: string;
  userId: string;
  role?: string;
};

function emitAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE));
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.accessToken || !parsed.email || !parsed.userId) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      email: parsed.email,
      userId: parsed.userId,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}
