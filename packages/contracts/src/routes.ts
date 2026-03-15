import type { RouteAccess } from "./rbac";

export const PUBLIC_WEB_ROUTES: RouteAccess[] = [
  // --- Public marketing / SEO
  { app: "PUBLIC_WEB", id: "HOME", path: "/", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "PSY_CATALOG", path: "/psychologists", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "PSY_PROFILE_PUBLIC", path: "/psychologists/:slug", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "HOW_IT_WORKS", path: "/how-it-works", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "FAQ", path: "/faq", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "TRUST_SAFETY", path: "/trust-safety", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "QUIZ", path: "/quiz", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "QUIZ_RESULT", path: "/quiz/result", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "SUPPORT", path: "/support", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"] },
  { app: "PUBLIC_WEB", id: "TERMS", path: "/legal/terms", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },
  { app: "PUBLIC_WEB", id: "PRIVACY", path: "/legal/privacy", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"], seoIndexable: true },

  // Payment returns
  { app: "PUBLIC_WEB", id: "PAY_RETURN_SUCCESS", path: "/pay/return/success", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"] },
  { app: "PUBLIC_WEB", id: "PAY_RETURN_CANCEL", path: "/pay/return/cancel", allowed: ["GUEST","CLIENT","PSYCHOLOGIST"] },

  // --- Auth
  { app: "PUBLIC_WEB", id: "AUTH_LOGIN", path: "/auth/login", allowed: ["GUEST"] },
  { app: "PUBLIC_WEB", id: "AUTH_REGISTER", path: "/auth/register", allowed: ["GUEST"] },
  { app: "PUBLIC_WEB", id: "AUTH_VERIFY", path: "/auth/verify", allowed: ["CLIENT","PSYCHOLOGIST"], guards: ["AUTH"] },
  { app: "PUBLIC_WEB", id: "AUTH_CONSENTS", path: "/auth/consents", allowed: ["CLIENT","PSYCHOLOGIST"], guards: ["AUTH"] },
  { app: "PUBLIC_WEB", id: "AUTH_FORGOT", path: "/auth/forgot", allowed: ["GUEST"] },
  { app: "PUBLIC_WEB", id: "AUTH_RESET", path: "/auth/reset", allowed: ["GUEST"] },

  // --- Client app
  { app: "PUBLIC_WEB", id: "CLIENT_DASH", path: "/app", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_PROFILE", path: "/app/profile", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_SETTINGS", path: "/app/settings", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_PAYMENTS", path: "/app/payments", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT","PAYMENTS_ENABLED"] },
  { app: "PUBLIC_WEB", id: "CLIENT_BOOKINGS", path: "/app/bookings", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_BOOKING_DETAILS", path: "/app/bookings/:id", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_CHECKOUT", path: "/app/checkout/:bookingId", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT","PAYMENTS_ENABLED"] },
  { app: "PUBLIC_WEB", id: "CLIENT_CHAT_LIST", path: "/app/chat", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_CHAT_THREAD", path: "/app/chat/:threadId", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_VIDEO", path: "/app/video/:sessionId", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT","VIDEO_SESSION_WINDOW"] },
  { app: "PUBLIC_WEB", id: "CLIENT_TICKETS", path: "/app/tickets", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },
  { app: "PUBLIC_WEB", id: "CLIENT_TICKET_DETAILS", path: "/app/tickets/:id", allowed: ["CLIENT"], guards: ["AUTH","ROLE_CLIENT"] },

  // --- Psychologist app
  { app: "PUBLIC_WEB", id: "PRO_DASH", path: "/pro", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST"] },
  { app: "PUBLIC_WEB", id: "PRO_PROFILE", path: "/pro/profile", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_ONBOARDING", path: "/pro/onboarding", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST"] },
  { app: "PUBLIC_WEB", id: "PRO_AVAILABILITY", path: "/pro/availability", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_BOOKINGS", path: "/pro/bookings", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_BOOKING_DETAILS", path: "/pro/bookings/:id", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_CHAT_LIST", path: "/pro/chat", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_CHAT_THREAD", path: "/pro/chat/:threadId", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_VIDEO", path: "/pro/video/:sessionId", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED","VIDEO_SESSION_WINDOW"] },
  { app: "PUBLIC_WEB", id: "PRO_PAYOUTS", path: "/pro/payouts", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST","PSY_APPROVED"] },
  { app: "PUBLIC_WEB", id: "PRO_NOTIFICATIONS", path: "/pro/notifications", allowed: ["PSYCHOLOGIST"], guards: ["AUTH","ROLE_PSYCHOLOGIST"] }
];

export const ADMIN_ROUTES: RouteAccess[] = [
  { app: "ADMIN_PANEL", id: "ADMIN_LOGIN", path: "/admin/login", allowed: ["GUEST"] },
  { app: "ADMIN_PANEL", id: "ADMIN_HOME", path: "/admin", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },

  { app: "ADMIN_PANEL", id: "ADMIN_PSY_LIST", path: "/admin/psychologists", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_PSY_DETAILS", path: "/admin/psychologists/:id", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },

  { app: "ADMIN_PANEL", id: "ADMIN_CATALOG", path: "/admin/catalog", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_BOOKINGS", path: "/admin/bookings", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_PAYMENTS", path: "/admin/payments", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_ESCROW", path: "/admin/escrow", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_AUDIT", path: "/admin/audit", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] },
  { app: "ADMIN_PANEL", id: "ADMIN_FEATURE_FLAGS", path: "/admin/feature-flags", allowed: ["ADMIN"], guards: ["AUTH","ROLE_ADMIN"] }
];

export const ALL_ROUTES: RouteAccess[] = [...PUBLIC_WEB_ROUTES, ...ADMIN_ROUTES];
