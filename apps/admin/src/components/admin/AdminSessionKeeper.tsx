"use client";

import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function AdminSessionKeeper() {
  useEffect(() => {
    let stopped = false;
    let refreshing = false;

    async function refreshSession() {
      if (stopped || refreshing || window.location.pathname === "/login") {
        return;
      }

      refreshing = true;

      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store"
        });

        if (response.status === 401 || response.status === 403) {
          window.location.replace("/login");
        }
      } catch {
        // A temporary network/backend failure should not immediately destroy
        // the administrator session. The next scheduled refresh can retry.
      } finally {
        refreshing = false;
      }
    }

    const intervalId = window.setInterval(
      refreshSession,
      REFRESH_INTERVAL_MS
    );

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      stopped = true;
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return null;
}
