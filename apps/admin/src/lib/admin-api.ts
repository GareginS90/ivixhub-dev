import "server-only";

import { cookies } from "next/headers";

export type PsychologistStatus =
  | "DRAFT"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED";

export type PendingPsychologistResponse = {
  psychologistId: number;
  userId: number;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  status: PsychologistStatus;
  experienceYears: number;
  bio: string | null;
  submittedAt: string | null;
};

export type AdminPsychologistDecisionResponse = {
  psychologistId: number;
  userId: number;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  status: PsychologistStatus;
  submittedAt: string | null;
  verifiedAt: string | null;
  reviewedByUserId: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
};

export type PsychologistDocument = {
  id: number;
  psychologistId: number;
  docType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
};

export type CatalogItem = {
  id?: number;
  code: string;
  nameEn: string;
  nameRu: string;
  nameHy: string;
  active: boolean;
};

export type AuditEvent = {
  id: number;
  actorUserId: number | null;
  action: string;
  entityType: string | null;
  entityId: number | null;
  details: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type UserRole = "CLIENT" | "PSYCHOLOGIST" | "ADMIN";

export type UserGender = "MALE" | "FEMALE" | "UNSPECIFIED";

export type AdminUser = {
  id: number;
  email: string;
  fullName: string | null;
  username: string;
  birthDate: string;
  gender: UserGender;
  phone: string | null;
  phoneVerified: boolean;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUsersPage = {
  users: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type ApiProblem = {
  message?: unknown;
  detail?: unknown;
  title?: unknown;
  error?: unknown;
};

function getBaseUrl() {
  const base = process.env.IVIXHUB_API_BASE_URL;

  if (!base) {
    throw new Error("IVIXHUB_API_BASE_URL is not set in apps/admin");
  }

  return base.replace(/\/+$/, "");
}

function extractErrorMessage(
  parsed: unknown,
  fallback: string
): string {
  if (typeof parsed === "string") {
    const value = parsed.trim();

    if (value) {
      return value;
    }

    return fallback;
  }

  if (!parsed || typeof parsed !== "object") {
    return fallback;
  }

  const problem = parsed as ApiProblem;

  const candidates = [
    problem.message,
    problem.detail,
    problem.error,
    problem.title
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === "string" &&
      candidate.trim()
    ) {
      return candidate.trim();
    }
  }

  return fallback;
}

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const text = await response.text();
  let parsed: unknown = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        parsed,
        `Request failed (${response.status})`
      )
    );
  }

  return parsed as T;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("ivixhub_admin_access")?.value;

  if (!accessToken) {
    throw new Error("ADMIN_UNAUTHENTICATED");
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (response.status === 401) {
    throw new Error("ADMIN_SESSION_EXPIRED");
  }

  if (response.status === 403) {
    throw new Error("ADMIN_FORBIDDEN");
  }

  return parseResponse<T>(response);
}

export function fmtDateTime(
  value?: string | null
) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString("hy-AM", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch {
    return value;
  }
}

export function shortText(
  value?: string | null,
  max = 140
) {
  const x = (value || "").trim();

  if (!x) return "—";
  if (x.length <= max) return x;

  return `${x.slice(0, max).trim()}…`;
}

export function statusTone(status?: string) {
  const x = (status || "").toUpperCase();

  if (x === "VERIFIED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (x === "PENDING_VERIFICATION") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (x === "REJECTED") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}
