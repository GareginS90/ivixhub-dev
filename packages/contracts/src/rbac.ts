export type Role = "GUEST" | "CLIENT" | "PSYCHOLOGIST" | "ADMIN";

export type PsychologistOnboardingStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type Guard =
  | "AUTH"                 // must be logged in
  | "ROLE_CLIENT"          // must be CLIENT
  | "ROLE_PSYCHOLOGIST"    // must be PSYCHOLOGIST
  | "ROLE_ADMIN"           // must be ADMIN
  | "PSY_APPROVED"         // psychologist must be APPROVED
  | "PAYMENTS_ENABLED"     // payment methods enabled by feature flag
  | "VIDEO_SESSION_WINDOW" // joining video allowed by time window
  ;

export type AppId = "PUBLIC_WEB" | "ADMIN_PANEL";

export type RouteAccess = {
  app: AppId;
  id: string;
  path: string;           // Next.js pathname pattern
  allowed: Role[];
  guards?: Guard[];
  seoIndexable?: boolean; // for public pages
};

export type SessionClaims = {
  userId: string;
  role: Exclude<Role, "GUEST">;
  email?: string;
};

export type FeatureFlags = {
  IVIXHUB_PAYMENT_METHODS?: string; // e.g. "BANK_CARD,IDRAM,TELCELL"
};
