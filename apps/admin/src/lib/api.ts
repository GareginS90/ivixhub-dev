export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
  }
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = getToken();

  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    return;
  }

  return res;
}
