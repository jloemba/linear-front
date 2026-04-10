const ANALYTICS_SESSION_KEY = import.meta.env.ANALYTICS_SESSION_KEY || "analyticsSessionId";

export const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getSessionId = () => {
  if (typeof window === "undefined") return createSessionId();
  
  const existingSessionId = window.sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  if (existingSessionId?.trim()) return existingSessionId;

  const sessionId = createSessionId();
  window.sessionStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  return sessionId;
};

export const getUserId = () => {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem("userId")?.trim() || undefined;
};