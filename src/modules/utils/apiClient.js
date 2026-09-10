import { API_BASE } from "../../config";

let refreshPromise = null;

export const getAccessToken = () => {
  return localStorage.getItem("basescrib_token") || localStorage.getItem("token") || "";
};

export const getRefreshToken = () => {
  return localStorage.getItem("basescrib_refresh_token") || "";
};

export const setTokens = (access, refresh) => {
  if (access) {
    localStorage.setItem("basescrib_token", access);
    localStorage.setItem("token", access);
  }
  if (refresh) {
    localStorage.setItem("basescrib_refresh_token", refresh);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("basescrib_token");
  localStorage.removeItem("token");
  localStorage.removeItem("basescrib_refresh_token");
};

/**
 * Attempts to refresh the access token using the stored refresh token.
 * Prevents multiple parallel refresh calls by returning a shared Promise.
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("No refresh token available");
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!res.ok) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("basescrib:unauthorized"));
        }
        throw new Error("Session expired. Please log in again.");
      }

      const data = await res.json();
      const newAccess = data.access;
      const newRefresh = data.refresh || refreshToken;
      setTokens(newAccess, newRefresh);
      return newAccess;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Fetch wrapper that attaches Authorization header and automatically
 * refreshes access token and retries request if HTTP 401 occurs.
 */
export const fetchWithAuth = async (url, options = {}) => {
  let token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401 Unauthorized, try to refresh token once and retry
  if (res.status === 401 && getRefreshToken()) {
    try {
      const newToken = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } catch (err) {
      console.warn("Auto token refresh failed:", err);
    }
  }

  return res;
};
