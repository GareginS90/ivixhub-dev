import { cookies } from "next/headers";

async function refreshAccess(base: string, refreshToken: string): Promise<string | null> {
  const r = await fetch(`${base}/api/public/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!r.ok) return null;
  const j = (await r.json()) as { accessToken: string };
  return j.accessToken;
}

export async function bffFetch(input: {
  baseUrl: string;
  path: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  const jar = await cookies();
  const access = jar.get("ivixhub_access")?.value;
  const refresh = jar.get("ivixhub_refresh")?.value;

  const doRequest = async (token?: string) => {
    return fetch(`${input.baseUrl}${input.path}`, {
      method: input.method ?? "GET",
      headers: {
        ...(input.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(input.body ? { "Content-Type": "application/json" } : {})
      },
      body: input.body ? JSON.stringify(input.body) : undefined
    });
  };

  let r = await doRequest(access);

  if (r.status !== 401 || !refresh) return r;

  const newAccess = await refreshAccess(input.baseUrl, refresh);
  if (!newAccess) return r;

  // обновим cookie access
  jar.set("ivixhub_access", newAccess, { httpOnly: true, secure: false, sameSite: "lax", path: "/" });

  // повторим запрос
  r = await doRequest(newAccess);
  return r;
}
