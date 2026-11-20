const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let memoryAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  memoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

async function refreshTokenRequest(): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    memoryAccessToken = null;
    return null;
  }
  const data = await res.json();
  memoryAccessToken = data.accessToken ?? null;
  return memoryAccessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (memoryAccessToken) {
    headers.set("Authorization", `Bearer ${memoryAccessToken}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry && !path.startsWith("/api/auth/login")) {
    const newToken = await refreshTokenRequest();
    if (newToken) {
      return apiFetch<T>(path, options, false);
    }
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || "Terjadi kesalahan pada server.");
  }

  return payload as T;
}