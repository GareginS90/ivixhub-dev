"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "ru" | "en" | "hy";
type Role = "client" | "psychologist";
type FocusView = "local" | "remote";

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
  ru: {
    roomTitle: "Комната сессии",
    roomSubtitle: "Внутренний live-shell IviXHub для MVP+ этапа. Следующим шагом сюда подключим реального video provider.",
    loading: "Подключение к сессии...",
    error: "Не удалось загрузить состояние видео-сессии.",
    role: "Роль",
    booking: "Бронь",
    status: "Статус",
    provider: "Провайдер",
    channel: "Канал",
    startedAt: "Начата",
    endedAt: "Завершена",
    roomOpen: "Комната открыта",
    waitingStartClient: "Пожалуйста, дождитесь, пока психолог начнёт сессию.",
    waitingStartPsychologist: "Вы можете начать сессию прямо из комнаты.",
    ended: "Сессия уже завершена.",
    localPreview: "Ваше видео",
    remotePreview: "Удалённый участник",
    remoteWaiting: "На MVP+ этапе здесь появится второй участник и live stream provider.",
    start: "Начать сессию",
    starting: "Запуск...",
    end: "Завершить сессию",
    ending: "Завершение...",
    sessionTimer: "Таймер сессии",
    accessDenied: "Нет доступа к камере или микрофону. Проверь разрешения браузера.",
    notStarted: "Ещё не начата",
    noMedia: "Видео недоступно",
    psychologist: "Психолог",
    client: "Клиент",
    makeMain: "Сделать главным",
    localMain: "Главное окно: ваше видео",
    remoteMain: "Главное окно: второй участник",
    camera: "Камера",
    microphone: "Микрофон",
    participantWaiting: "Участник подключится здесь",
    endedStop: "После завершения сессии камера и микрофон отключены."
  },
  en: {
    roomTitle: "Session room",
    roomSubtitle: "Internal IviXHub live shell for the MVP+ stage. Next we will connect a real video provider here.",
    loading: "Connecting to session...",
    error: "Failed to load video session state.",
    role: "Role",
    booking: "Booking",
    status: "Status",
    provider: "Provider",
    channel: "Channel",
    startedAt: "Started",
    endedAt: "Ended",
    roomOpen: "Room is open",
    waitingStartClient: "Please wait until the psychologist starts the session.",
    waitingStartPsychologist: "You can start the session directly from this room.",
    ended: "The session has already ended.",
    localPreview: "Your video",
    remotePreview: "Remote participant",
    remoteWaiting: "At the MVP+ stage, the second participant and the live stream provider will appear here.",
    start: "Start session",
    starting: "Starting...",
    end: "End session",
    ending: "Ending...",
    sessionTimer: "Session timer",
    accessDenied: "Camera or microphone access is unavailable. Check your browser permissions.",
    notStarted: "Not started yet",
    noMedia: "Video unavailable",
    psychologist: "Psychologist",
    client: "Client",
    makeMain: "Make main",
    localMain: "Main view: your video",
    remoteMain: "Main view: second participant",
    camera: "Camera",
    microphone: "Microphone",
    participantWaiting: "The participant will appear here",
    endedStop: "After session end, the camera and microphone are turned off."
  },
  hy: {
    roomTitle: "Սեանսի սենյակ",
    roomSubtitle: "IviXHub-ի ներքին live-shell-ը MVP+ փուլի համար։ Հաջորդ քայլում այստեղ կմիանա իրական video provider-ը։",
    loading: "Միանում է սեանսին...",
    error: "Չհաջողվեց բեռնել տեսասեանսի վիճակը։",
    role: "Դեր",
    booking: "Ամրագրում",
    status: "Վիճակ",
    provider: "Պրովայդեր",
    channel: "Կանալ",
    startedAt: "Սկսվել է",
    endedAt: "Ավարտվել է",
    roomOpen: "Սենյակը բաց է",
    waitingStartClient: "Խնդրում ենք սպասել, մինչև հոգեբանը սկսի սեանսը։",
    waitingStartPsychologist: "Կարող եք սկսել սեանսը հենց այս սենյակից։",
    ended: "Սեանսն արդեն ավարտված է։",
    localPreview: "Ձեր տեսանյութը",
    remotePreview: "Հեռավոր մասնակից",
    remoteWaiting: "MVP+ փուլում այստեղ կհայտնվի երկրորդ մասնակիցը և live stream provider-ը։",
    start: "Սկսել սեանսը",
    starting: "Սկսվում է...",
    end: "Ավարտել սեանսը",
    ending: "Ավարտվում է...",
    sessionTimer: "Սեանսի ժամանակաչափ",
    accessDenied: "Տեսախցիկի կամ խոսափողի հասանելիություն չկա։ Ստուգեք browser-ի թույլտվությունները։",
    notStarted: "Դեռ չի սկսվել",
    noMedia: "Տեսանյութը հասանելի չէ",
    psychologist: "Հոգեբան",
    client: "Հաճախորդ",
    makeMain: "Դարձնել գլխավոր",
    localMain: "Գլխավոր պատուհան՝ ձեր տեսանյութը",
    remoteMain: "Գլխավոր պատուհան՝ երկրորդ մասնակիցը",
    camera: "Տեսախցիկ",
    microphone: "Խոսափող",
    participantWaiting: "Մասնակիցը կհայտնվի այստեղ",
    endedStop: "Սեանսի ավարտից հետո տեսախցիկն ու խոսափողը անջատված են։"
  }
} as const;

function fmtDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("hy-AM", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function formatDuration(startedAt: string | null, endedAt: string | null) {
  if (!startedAt) return "00:00";
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const diff = Math.max(0, Math.floor((end - start) / 1000));
  const mm = String(Math.floor(diff / 60)).padStart(2, "0");
  const ss = String(diff % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function tone(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "IN_PROGRESS") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (s === "ENDED") return "border-slate-200 bg-slate-100 text-slate-800";
  return "border-amber-200 bg-amber-50 text-amber-900";
}

function StatusIcon({
  kind,
  enabled
}: {
  kind: "camera" | "mic";
  enabled: boolean;
}) {
  const color = enabled ? "#16a34a" : "#dc2626";

  if (kind === "camera") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 8.5C4 7.67157 4.67157 7 5.5 7H14.5C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17H5.5C4.67157 17 4 16.3284 4 15.5V8.5Z"
          stroke={color}
          strokeWidth="1.8"
        />
        <path
          d="M16 10.5L20 8V16L16 13.5V10.5Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {!enabled && (
          <path
            d="M5 19L19 5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15C10.3431 15 9 13.6569 9 12V7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7V12C15 13.6569 13.6569 15 12 15Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M7 11.5V12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12V11.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M12 17V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 20H14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {!enabled && (
        <path
          d="M5 19L19 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function MediaToggleButton({
  kind,
  enabled,
  label,
  onClick
}: {
  kind: "camera" | "mic";
  enabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${
        enabled
          ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
          : "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
      }`}
    >
      <StatusIcon kind={kind} enabled={enabled} />
      <span>{label}</span>
    </button>
  );
}

function VideoCard({
  title,
  isMain,
  onMakeMain,
  actionLabel,
  children
}: {
  title: string;
  isMain: boolean;
  onMakeMain: () => void;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-3xl border bg-slate-50 p-4 ${isMain ? "lg:col-span-3" : "lg:col-span-1"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="font-medium">{title}</div>
        <button
          type="button"
          onClick={onMakeMain}
          className="rounded-2xl border px-3 py-2 text-xs hover:bg-white"
        >
          {actionLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

export default function VideoRoomShell({
  bookingId,
  role,
  lang
}: {
  bookingId: string;
  role: Role;
  lang: Lang;
}) {
  const tr = TXT[lang];
  const [session, setSession] = useState<VideoSessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [focusView, setFocusView] = useState<FocusView>("remote");

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function loadSession(silent = false) {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const r = await fetch(`/api/sessions/${bookingId}/video/join`, {
        method: "POST",
        cache: "no-store"
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.error);
        return;
      }

      setSession(j as VideoSessionResponse);
    } catch (e: any) {
      setError(e?.message || tr.error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  function stopLocalMedia() {
    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach((track) => {
      track.enabled = false;
      track.stop();
    });

    streamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setMicEnabled(false);
    setCamEnabled(false);
  }

  async function startSession() {
    try {
      setStarting(true);
      setError(null);

      const r = await fetch(`/api/sessions/${bookingId}/video/start`, {
        method: "POST",
        cache: "no-store"
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.error);
        return;
      }

      setSession(j as VideoSessionResponse);
    } catch (e: any) {
      setError(e?.message || tr.error);
    } finally {
      setStarting(false);
    }
  }

  async function endSession() {
    try {
      setEnding(true);
      setError(null);

      const r = await fetch(`/api/sessions/${bookingId}/video/end`, {
        method: "POST",
        cache: "no-store"
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        setError(j?.message || tr.error);
        return;
      }

      setSession(j as VideoSessionResponse);
      stopLocalMedia();
    } catch (e: any) {
      setError(e?.message || tr.error);
    } finally {
      setEnding(false);
    }
  }

  useEffect(() => {
    loadSession(false);

    const poll = window.setInterval(() => {
      loadSession(true);
    }, 5000);

    return () => window.clearInterval(poll);
  }, [bookingId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((x) => x + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    async function setupMedia() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setMediaError(tr.noMedia);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setMediaError(null);
        setMicEnabled(true);
        setCamEnabled(true);
      } catch {
        setMediaError(tr.accessDenied);
      }
    }

    setupMedia();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [tr.accessDenied, tr.noMedia]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = micEnabled;
    });
  }, [micEnabled]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = camEnabled;
    });
  }, [camEnabled]);

  useEffect(() => {
    const normalizedStatus = (session?.status || "").toUpperCase();
    if (normalizedStatus === "ENDED") {
      stopLocalMedia();
    }
  }, [session?.status]);

  const normalizedStatus = (session?.status || "NOT_STARTED").toUpperCase();
  const canStart = role === "psychologist" && normalizedStatus === "NOT_STARTED";
  const canEnd = normalizedStatus === "IN_PROGRESS";
  const timerText = useMemo(
    () => formatDuration(session?.startedAt ?? null, session?.endedAt ?? null),
    [session?.startedAt, session?.endedAt, tick]
  );

  const helperText =
    normalizedStatus === "IN_PROGRESS"
      ? tr.roomOpen
      : normalizedStatus === "ENDED"
      ? tr.ended
      : role === "psychologist"
      ? tr.waitingStartPsychologist
      : tr.waitingStartClient;

  const localIsMain = focusView === "local";
  const remoteIsMain = focusView === "remote";

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{tr.roomTitle}</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">{tr.roomSubtitle}</p>

      {loading && (
        <div className="mt-6 rounded-2xl border bg-slate-50 p-4 text-sm text-gray-700">
          {tr.loading}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {session && (
        <>
          <div className={`mt-6 rounded-2xl border p-4 text-sm ${tone(session.status)}`}>
            {helperText}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.booking}</div>
              <div className="mt-1 font-medium">#{bookingId}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.role}</div>
              <div className="mt-1 font-medium">
                {role === "psychologist" ? tr.psychologist : tr.client}
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.status}</div>
              <div className="mt-1 font-medium">{session.status}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.sessionTimer}</div>
              <div className="mt-1 font-medium">{session.startedAt ? timerText : tr.notStarted}</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.provider}</div>
              <div className="mt-1 font-medium">{session.provider}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.channel}</div>
              <div className="mt-1 font-medium">{session.channelName}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.startedAt}</div>
              <div className="mt-1 font-medium">{fmtDateTime(session.startedAt)}</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.endedAt}</div>
              <div className="mt-1 font-medium">{fmtDateTime(session.endedAt)}</div>
            </div>
          </div>

          {normalizedStatus === "ENDED" && (
            <div className="mt-4 rounded-2xl border bg-slate-100 p-4 text-sm text-slate-700">
              {tr.endedStop}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {localIsMain ? tr.localMain : tr.remoteMain}
            </div>

            <MediaToggleButton
              kind="mic"
              enabled={micEnabled}
              label={tr.microphone}
              onClick={() => setMicEnabled((x) => !x)}
            />

            <MediaToggleButton
              kind="camera"
              enabled={camEnabled}
              label={tr.camera}
              onClick={() => setCamEnabled((x) => !x)}
            />

            {canStart && (
              <button
                type="button"
                onClick={startSession}
                disabled={starting}
                className="rounded-2xl bg-black px-5 py-3 text-sm text-white disabled:opacity-50"
              >
                {starting ? tr.starting : tr.start}
              </button>
            )}

            {canEnd && (
              <button
                type="button"
                onClick={endSession}
                disabled={ending}
                className="rounded-2xl border px-5 py-3 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {ending ? tr.ending : tr.end}
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
            <VideoCard
              title={tr.localPreview}
              isMain={localIsMain}
              onMakeMain={() => setFocusView("local")}
              actionLabel={tr.makeMain}
            >
              <div className={`overflow-hidden rounded-2xl border bg-black ${localIsMain ? "h-[420px]" : "h-[180px]"}`}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>

              {mediaError && (
                <div className="mt-3 rounded-2xl border bg-amber-50 p-3 text-sm text-amber-900">
                  {mediaError}
                </div>
              )}
            </VideoCard>

            <VideoCard
              title={tr.remotePreview}
              isMain={remoteIsMain}
              onMakeMain={() => setFocusView("remote")}
              actionLabel={tr.makeMain}
            >
              <div className={`grid place-items-center rounded-2xl border bg-white ${remoteIsMain ? "h-[420px]" : "h-[180px]"}`}>
                <div className="max-w-sm px-4 text-center text-sm leading-6 text-slate-600">
                  <div className="font-medium text-slate-800">{tr.participantWaiting}</div>
                  <div className="mt-2">{tr.remoteWaiting}</div>
                </div>
              </div>
            </VideoCard>
          </div>
        </>
      )}
    </div>
  );
}
