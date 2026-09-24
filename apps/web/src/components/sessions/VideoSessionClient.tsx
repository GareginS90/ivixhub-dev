"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type Lang = "ru" | "en" | "hy";
type Role = "CLIENT" | "PSYCHOLOGIST";

type VideoSessionResponse = {
  sessionId: number;
  bookingId: number;
  provider: string;
  channelName: string;
  roomId: string;
  roomUrl: string;
  joinToken: string | null;
  expiresAtUtc: string | null;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
};

const TXT = {
  hy: {
    title: "Տեսասեանս",
    subtitle:
      "Անվտանգ առցանց հանդիպում՝ կապված միայն այս ամրագրման հետ։",
    loading: "Տեսասեանսը պատրաստվում է…",
    enterRoom: "Մտնել տեսասենյակ",
    roomUnavailable: "Տեսասենյակը դեռ հասանելի չէ",
    start: "Սկսել սեանսը",
    end: "Ավարտել սեանսը",
    starting: "Սկսվում է…",
    ending: "Ավարտվում է…",
    status: "Կարգավիճակ",
    provider: "Տեսակապի համակարգ",
    channel: "Կապուղի",
    room: "Սենյակ",
    tokenExpires: "Մուտքը գործում է մինչև",
    startedAt: "Սկսվել է",
    endedAt: "Ավարտվել է",
    error: "Չհաջողվեց պատրաստել տեսասեանսը։",
    waitingClient:
      "Սեանսը դեռ չի սկսվել։ Սպասեք, մինչև հոգեբանը սկսի հանդիպումը։",
    waitingPsychologist:
      "Սեանսը կարող եք սկսել թույլատրելի ժամանակահատվածում։",
    inProgress:
      "Սեանսն ընթացքի մեջ է։ Տեսասենյակն արդեն հասանելի է։",
    ended:
      "Սեանսն ավարտված է։ Տեսասենյակ կրկին մուտք գործել հնարավոր չէ։",
    unavailableClient:
      "Տեսասենյակը կբացվի, երբ հոգեբանը սկսի սեանսը։",
    unavailablePsychologist:
      "Սեանսը հնարավոր է սկսել միայն նախատեսված մեկնարկին մոտ ժամանակահատվածում։",
    waiting: "Սպասման ռեժիմ",
    live: "Սեանսն ընթացքի մեջ է",
    finished: "Սեանսն ավարտված է",
    secure: "Անվտանգ տեսազանգ",
    secureText:
      "Տեսասենյակը կապված է ձեր ամրագրման հետ և հասանելի է միայն հանդիպման մասնակիցներին։",
    autoRefresh: "Կարգավիճակը թարմացվում է ավտոմատ",
    sessionInfo: "Սեանսի տվյալներ"
  },

  ru: {
    title: "Видеосессия",
    subtitle:
      "Безопасная онлайн-встреча, связанная только с этим бронированием.",
    loading: "Подготавливаем видеосессию…",
    enterRoom: "Войти в видеокомнату",
    roomUnavailable: "Видеокомната пока недоступна",
    start: "Начать сессию",
    end: "Завершить сессию",
    starting: "Запуск…",
    ending: "Завершение…",
    status: "Статус",
    provider: "Система видеосвязи",
    channel: "Канал",
    room: "Комната",
    tokenExpires: "Доступ действует до",
    startedAt: "Начата",
    endedAt: "Завершена",
    error: "Не удалось подготовить видеосессию.",
    waitingClient:
      "Сессия ещё не началась. Дождитесь, пока психолог начнёт встречу.",
    waitingPsychologist:
      "Вы сможете начать сессию в разрешённое время.",
    inProgress:
      "Сессия уже идёт. Видеокомната доступна.",
    ended:
      "Сессия завершена. Повторный вход в видеокомнату недоступен.",
    unavailableClient:
      "Видеокомната откроется после того, как психолог начнёт сессию.",
    unavailablePsychologist:
      "Сессию можно начать только в разрешённое время перед запланированным началом.",
    waiting: "Ожидание",
    live: "Сессия идёт",
    finished: "Сессия завершена",
    secure: "Безопасный видеозвонок",
    secureText:
      "Видеокомната связана с вашим бронированием и доступна только участникам встречи.",
    autoRefresh: "Статус обновляется автоматически",
    sessionInfo: "Данные сессии"
  },

  en: {
    title: "Video session",
    subtitle:
      "A secure online meeting connected only to this booking.",
    loading: "Preparing video session…",
    enterRoom: "Enter video room",
    roomUnavailable: "Video room is not available yet",
    start: "Start session",
    end: "End session",
    starting: "Starting…",
    ending: "Ending…",
    status: "Status",
    provider: "Video system",
    channel: "Channel",
    room: "Room",
    tokenExpires: "Access expires",
    startedAt: "Started",
    endedAt: "Ended",
    error: "Failed to prepare video session.",
    waitingClient:
      "The session has not started yet. Please wait for the psychologist to start the meeting.",
    waitingPsychologist:
      "You can start the session during the allowed time window.",
    inProgress:
      "The session is in progress. The video room is available.",
    ended:
      "The session has ended. Re-entry to the video room is unavailable.",
    unavailableClient:
      "The video room will open after the psychologist starts the session.",
    unavailablePsychologist:
      "The session can be started only during the allowed pre-start window.",
    waiting: "Waiting",
    live: "Session in progress",
    finished: "Session ended",
    secure: "Secure video call",
    secureText:
      "The video room is linked to your booking and available only to meeting participants.",
    autoRefresh: "Status updates automatically",
    sessionInfo: "Session details"
  }
} as const;

function localeFor(lang: Lang) {
  if (lang === "hy") return "hy-AM";
  if (lang === "ru") return "ru-RU";
  return "en-US";
}

function fmtDateTime(
  iso: string | null | undefined,
  lang: Lang
) {
  if (!iso) return "—";

  return new Date(iso).toLocaleString(
    localeFor(lang),
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
  );
}

function CameraIcon({
  size = 24
}: {
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="6"
        width="13"
        height="12"
        rx="3"
      />
      <path d="m16 10 5-3v10l-5-3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export default function VideoSessionClient({
  bookingId,
  lang,
  role
}: {
  bookingId: string;
  lang: Lang;
  role: Role;
}) {
  const tr = TXT[lang];

  const [loading, setLoading] =
    useState(true);

  const [starting, setStarting] =
    useState(false);

  const [ending, setEnding] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [session, setSession] =
    useState<VideoSessionResponse | null>(
      null
    );

  const pollRef =
    useRef<number | null>(null);

  async function loadJoin(
    silent = false
  ) {
    try {
      if (!silent) {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(
        `/api/sessions/${bookingId}/video/join`,
        {
          method: "POST",
          cache: "no-store"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        if (!silent) {
          setError(
            payload?.message ||
              tr.error
          );
        }
        return;
      }

      setSession(payload);
    } catch (error: unknown) {
      if (!silent) {
        setError(
          error instanceof Error
            ? error.message
            : tr.error
        );
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  async function startSession() {
    try {
      setStarting(true);
      setError(null);

      const response = await fetch(
        `/api/sessions/${bookingId}/video/start`,
        {
          method: "POST",
          cache: "no-store"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            tr.error
        );
        return;
      }

      setSession(payload);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : tr.error
      );
    } finally {
      setStarting(false);
    }
  }

  async function endSession() {
    try {
      setEnding(true);
      setError(null);

      const response = await fetch(
        `/api/sessions/${bookingId}/video/end`,
        {
          method: "POST",
          cache: "no-store"
        }
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            tr.error
        );
        return;
      }

      setSession(payload);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : tr.error
      );
    } finally {
      setEnding(false);
    }
  }

  useEffect(() => {
    void loadJoin(false);

    pollRef.current =
      window.setInterval(() => {
        void loadJoin(true);
      }, 5000);

    return () => {
      if (pollRef.current) {
        window.clearInterval(
          pollRef.current
        );
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const normalizedStatus = (
    session?.status || ""
  ).toUpperCase();

  const canOpenRoom =
    normalizedStatus ===
    "IN_PROGRESS";

  const canStart =
    role === "PSYCHOLOGIST" &&
    normalizedStatus ===
      "NOT_STARTED";

  const canEnd =
    role === "PSYCHOLOGIST" &&
    normalizedStatus ===
      "IN_PROGRESS";

  const helperText = useMemo(() => {
    if (
      normalizedStatus ===
      "IN_PROGRESS"
    ) {
      return tr.inProgress;
    }

    if (
      normalizedStatus === "ENDED"
    ) {
      return tr.ended;
    }

    return role === "PSYCHOLOGIST"
      ? tr.waitingPsychologist
      : tr.waitingClient;
  }, [
    normalizedStatus,
    role,
    tr
  ]);

  const disabledReason =
    useMemo(() => {
      if (canOpenRoom) {
        return null;
      }

      if (
        normalizedStatus === "ENDED"
      ) {
        return tr.ended;
      }

      return role === "PSYCHOLOGIST"
        ? tr.unavailablePsychologist
        : tr.unavailableClient;
    }, [
      canOpenRoom,
      normalizedStatus,
      role,
      tr
    ]);

  const stateMeta = useMemo(() => {
    if (
      normalizedStatus ===
      "IN_PROGRESS"
    ) {
      return {
        label: tr.live,
        dot: "bg-[#12b8c4]",
        badge:
          "border-[#12b8c4]/15 bg-[#e9f8f5] text-[#078b7b]",
        panel:
          "border-[#12b8c4]/15 bg-gradient-to-br from-[#effbf9] to-[#f0f8ff] text-[#245f61]"
      };
    }

    if (
      normalizedStatus === "ENDED"
    ) {
      return {
        label: tr.finished,
        dot: "bg-[#91a2a3]",
        badge:
          "border-[#073f43]/8 bg-[#f1f5f5] text-[#687f80]",
        panel:
          "border-[#073f43]/8 bg-[#f6f8f8] text-[#607778]"
      };
    }

    return {
      label: tr.waiting,
      dot: "bg-amber-400",
      badge:
        "border-amber-200 bg-amber-50 text-amber-800",
      panel:
        "border-amber-200 bg-gradient-to-br from-amber-50 to-[#fffdf7] text-amber-900"
    };
  }, [normalizedStatus, tr]);

  return (
    <section className="overflow-hidden rounded-[32px] border border-[#073f43]/7 bg-white shadow-[0_22px_65px_rgba(7,63,67,0.07)]">
      <header className="relative overflow-hidden border-b border-[#073f43]/7 px-6 py-7 sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/8 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#e5f8f5] via-[#edf9fb] to-[#eef3ff] text-[#078b7b]">
              <CameraIcon />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-[-0.035em] text-[#073f43] sm:text-[28px]">
                  {tr.title}
                </h1>

                {session && (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black ${stateMeta.badge}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${stateMeta.dot} ${
                        normalizedStatus ===
                        "IN_PROGRESS"
                          ? "animate-pulse"
                          : ""
                      }`}
                    />

                    {stateMeta.label}
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#758a8c]">
                {tr.subtitle}
              </p>
            </div>
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f3f8f8] px-3.5 py-2 text-[10px] font-extrabold text-[#728889]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#12b8c4]" />
            {tr.autoRefresh}
          </div>
        </div>
      </header>

      <div className="p-5 sm:p-8">
        {loading && (
          <div className="flex min-h-[340px] items-center justify-center rounded-[26px] border border-[#073f43]/7 bg-[#f8fbfb]">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-[3px] border-[#12b8c4]/15 border-t-[#078b7b]" />

              <div className="mt-4 text-sm font-bold text-[#627b7d]">
                {tr.loading}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {!loading && session && (
          <>
            <div
              className={`flex gap-3 rounded-[22px] border p-5 ${stateMeta.panel}`}
            >
              <div className="mt-0.5 shrink-0">
                {normalizedStatus ===
                "IN_PROGRESS" ? (
                  <CameraIcon
                    size={21}
                  />
                ) : (
                  <ClockIcon />
                )}
              </div>

              <div>
                <div className="text-sm font-black">
                  {stateMeta.label}
                </div>

                <p className="mt-1 text-sm leading-6 opacity-80">
                  {helperText}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="relative flex min-h-[330px] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#092f33] px-6 py-10 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="pointer-events-none absolute left-[-10%] top-[-30%] size-72 rounded-full bg-[#12b8c4]/12 blur-3xl" />
                <div className="pointer-events-none absolute bottom-[-35%] right-[-8%] size-72 rounded-full bg-[#7657df]/13 blur-3xl" />

                <div className="relative flex size-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/7 text-[#72e0dc] backdrop-blur">
                  <CameraIcon
                    size={34}
                  />
                </div>

                <div className="relative mt-5 text-xl font-black">
                  {canOpenRoom
                    ? tr.live
                    : normalizedStatus ===
                        "ENDED"
                      ? tr.finished
                      : tr.roomUnavailable}
                </div>

                <p className="relative mt-2 max-w-md text-sm leading-6 text-white/60">
                  {canOpenRoom
                    ? tr.inProgress
                    : disabledReason}
                </p>

                <div className="relative mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                  {canOpenRoom ? (
                    <Link
                      href={`/video/room/${bookingId}?role=${role.toLowerCase()}`}
                      className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#12b8c4] via-[#159faf] to-[#3977e8] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(18,184,196,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(18,184,196,0.30)]"
                    >
                      <CameraIcon
                        size={18}
                      />
                      {tr.enterRoom}
                      <ArrowIcon />
                    </Link>
                  ) : (
                    <div className="inline-flex min-h-12 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-black text-white/35">
                      <CameraIcon
                        size={18}
                      />
                      {tr.roomUnavailable}
                    </div>
                  )}

                  {canStart && (
                    <button
                      type="button"
                      onClick={
                        startSession
                      }
                      disabled={
                        starting
                      }
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#073f43] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {starting
                        ? tr.starting
                        : tr.start}
                    </button>
                  )}

                  {canEnd && (
                    <button
                      type="button"
                      onClick={
                        endSession
                      }
                      disabled={ending}
                      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-red-300/25 bg-red-400/10 px-6 text-sm font-black text-red-100 transition-all hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {ending
                        ? tr.ending
                        : tr.end}
                    </button>
                  )}
                </div>
              </div>

              <aside className="rounded-[28px] border border-[#073f43]/7 bg-[#f8fbfb] p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm font-black text-[#31595b]">
                  <InfoIcon />
                  {tr.sessionInfo}
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      label:
                        tr.status,
                      value:
                        session.status
                    },
                    {
                      label:
                        tr.provider,
                      value:
                        session.provider
                    },
                    {
                      label:
                        tr.channel,
                      value:
                        session.channelName
                    },
                    {
                      label:
                        tr.room,
                      value:
                        session.roomId
                    },
                    {
                      label:
                        tr.tokenExpires,
                      value:
                        fmtDateTime(
                          session.expiresAtUtc,
                          lang
                        )
                    },
                    {
                      label:
                        tr.startedAt,
                      value:
                        fmtDateTime(
                          session.startedAt,
                          lang
                        )
                    },
                    {
                      label:
                        tr.endedAt,
                      value:
                        fmtDateTime(
                          session.endedAt,
                          lang
                        )
                    }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[18px] border border-[#073f43]/6 bg-white px-4 py-3.5"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#94a5a6]">
                        {item.label}
                      </div>

                      <div className="mt-1.5 break-all text-xs font-black text-[#3c6264]">
                        {item.value ||
                          "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            <div className="mt-6 flex gap-3 rounded-[22px] border border-[#12b8c4]/12 bg-gradient-to-r from-[#f0faf8] to-[#f2f7ff] p-5">
              <div className="shrink-0 text-[#078b7b]">
                <ShieldIcon />
              </div>

              <div>
                <div className="text-sm font-black text-[#31595b]">
                  {tr.secure}
                </div>

                <p className="mt-1 text-xs leading-5 text-[#789092]">
                  {tr.secureText}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
