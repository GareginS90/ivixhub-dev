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

function getBaseUrl() {
  const base = process.env.IVIXHUB_API_BASE_URL;
  if (!base) {
    throw new Error("IVIXHUB_API_BASE_URL is not set in apps/admin");
  }
  return base;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let parsed: unknown = null;

  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  if (!response.ok) {
    const message =
      typeof parsed === "object" && parsed && "message" in parsed
        ? String((parsed as { message?: string }).message || "Request failed")
        : text || "Request failed";

    throw new Error(message);
  }

  return parsed as T;
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const base = getBaseUrl();

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  return parseResponse<T>(response);
}

export function fmtDateTime(value?: string | null) {
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

export function shortText(value?: string | null, max = 140) {
  const x = (value || "").trim();
  if (!x) return "—";
  if (x.length <= max) return x;
  return `${x.slice(0, max).trim()}…`;
}

export function statusTone(status?: string) {
  const x = (status || "").toUpperCase();

  if (x === "VERIFIED") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (x === "PENDING_VERIFICATION") return "border-amber-200 bg-amber-50 text-amber-800";
  if (x === "REJECTED") return "border-rose-200 bg-rose-50 text-rose-800";

  return "border-slate-200 bg-slate-50 text-slate-700";
}
