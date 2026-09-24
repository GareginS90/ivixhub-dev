"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type Lang = "ru" | "en" | "hy";
type ViewRole = "CLIENT" | "PSYCHOLOGIST";

type ChatMessage = {
  id: number;
  bookingId: number;
  senderUserId: number;
  senderRole: string;
  text: string;
  createdAt: string;
};

type ChatPageResponse = {
  items: ChatMessage[];
  nextBeforeId: number | null;
};

const TXT = {
  hy: {
    title: "Հանդիպման չատ",
    subtitle:
      "Հաղորդագրությունները հասանելի են միայն այս ամրագրման մասնակիցներին։",
    loading: "Հաղորդագրությունները բեռնվում են…",
    empty: "Հաղորդագրություններ դեռ չկան։",
    emptyHint: "Գրեք առաջին հաղորդագրությունը և սկսեք զրույցը։",
    placeholderClient: "Գրեք հաղորդագրություն հոգեբանին…",
    placeholderPsychologist: "Գրեք հաղորդագրություն հաճախորդին…",
    send: "Ուղարկել",
    sending: "Ուղարկվում է…",
    refresh: "Թարմացնել",
    refreshing: "Թարմացվում է…",
    loadOlder: "Ցույց տալ ավելի հին հաղորդագրությունները",
    loadingOlder: "Բեռնվում են…",
    error: "Չհաջողվեց բեռնել չատը։",
    sendError: "Չհաջողվեց ուղարկել հաղորդագրությունը։",
    closed: "Այս չատը փակ է, քանի որ ամրագրումն այլևս ակտիվ չէ։",
    closedHint: "Նախկին հաղորդագրությունները շարունակում են հասանելի լինել դիտելու համար։",
    you: "Դուք",
    client: "Հաճախորդ",
    psychologist: "Հոգեբան",
    messages: "Հաղորդագրություններ",
    live: "Ավտոմատ թարմացում",
    chars: "նիշ"
  },

  ru: {
    title: "Чат сессии",
    subtitle:
      "Сообщения доступны только участникам этого бронирования.",
    loading: "Загружаем сообщения…",
    empty: "Сообщений пока нет.",
    emptyHint: "Отправьте первое сообщение, чтобы начать диалог.",
    placeholderClient: "Напишите сообщение психологу…",
    placeholderPsychologist: "Напишите сообщение клиенту…",
    send: "Отправить",
    sending: "Отправка…",
    refresh: "Обновить",
    refreshing: "Обновляем…",
    loadOlder: "Показать более ранние сообщения",
    loadingOlder: "Загрузка…",
    error: "Не удалось загрузить чат.",
    sendError: "Не удалось отправить сообщение.",
    closed: "Этот чат закрыт, потому что бронирование больше не активно.",
    closedHint: "Предыдущие сообщения остаются доступными для просмотра.",
    you: "Вы",
    client: "Клиент",
    psychologist: "Психолог",
    messages: "Сообщения",
    live: "Автообновление",
    chars: "символов"
  },

  en: {
    title: "Session chat",
    subtitle:
      "Messages are available only to participants of this booking.",
    loading: "Loading messages…",
    empty: "No messages yet.",
    emptyHint: "Send the first message to start the conversation.",
    placeholderClient: "Write a message to the psychologist…",
    placeholderPsychologist: "Write a message to the client…",
    send: "Send",
    sending: "Sending…",
    refresh: "Refresh",
    refreshing: "Refreshing…",
    loadOlder: "Load older messages",
    loadingOlder: "Loading…",
    error: "Failed to load chat.",
    sendError: "Failed to send message.",
    closed: "This chat is closed because the booking is no longer active.",
    closedHint: "Previous messages remain available for viewing.",
    you: "You",
    client: "Client",
    psychologist: "Psychologist",
    messages: "Messages",
    live: "Auto refresh",
    chars: "characters"
  }
} as const;

function localeFor(lang: Lang) {
  if (lang === "hy") return "hy-AM";
  if (lang === "ru") return "ru-RU";
  return "en-US";
}

function fmtDateTime(
  iso: string,
  lang: Lang
) {
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

function mergeMessages(
  current: ChatMessage[],
  incoming: ChatMessage[]
) {
  const map = new Map<number, ChatMessage>();

  for (const item of current) {
    map.set(item.id, item);
  }

  for (const item of incoming) {
    map.set(item.id, item);
  }

  return Array.from(map.values()).sort(
    (a, b) => a.id - b.id
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8" />
      <path d="M5.5 15A7 7 0 0 0 17.8 17.8L20 16" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

function LockIcon() {
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
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function BookingChatClient({
  bookingId,
  lang,
  viewRole,
  isClosed = false
}: {
  bookingId: string;
  lang: Lang;
  viewRole: ViewRole;
  isClosed?: boolean;
}) {
  const tr = TXT[lang];

  const [items, setItems] = useState<
    ChatMessage[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingOlder, setLoadingOlder] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [text, setText] = useState("");

  const [nextBeforeId, setNextBeforeId] =
    useState<number | null>(null);

  const [initialLoaded, setInitialLoaded] =
    useState(false);

  const listRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  async function loadInitial(
    manual = false
  ) {
    try {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(
        `/api/chat/${bookingId}?limit=50`,
        {
          cache: "no-store" as RequestCache
        }
      );

      const payload = (await response
        .json()
        .catch(
          () => null
        )) as ChatPageResponse | null;

      if (!response.ok) {
        setError(tr.error);
        return;
      }

      const loadedItems = Array.isArray(
        payload?.items
      )
        ? payload.items
        : [];

      setItems(loadedItems);
      setNextBeforeId(
        payload?.nextBeforeId ?? null
      );
      setInitialLoaded(true);
    } catch {
      setError(tr.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function refreshSilently() {
    try {
      const response = await fetch(
        `/api/chat/${bookingId}?limit=50`,
        {
          cache: "no-store" as RequestCache
        }
      );

      const payload = (await response
        .json()
        .catch(
          () => null
        )) as ChatPageResponse | null;

      if (!response.ok) {
        return;
      }

      const loadedItems = Array.isArray(
        payload?.items
      )
        ? payload.items
        : [];

      setItems((previous) =>
        mergeMessages(
          previous,
          loadedItems
        )
      );

      setNextBeforeId(
        payload?.nextBeforeId ?? null
      );
    } catch {
      // Silent polling failure should not interrupt the conversation.
    }
  }

  async function loadOlder() {
    if (
      !nextBeforeId ||
      loadingOlder
    ) {
      return;
    }

    const currentHeight =
      listRef.current?.scrollHeight ?? 0;

    try {
      setLoadingOlder(true);
      setError(null);

      const response = await fetch(
        `/api/chat/${bookingId}?limit=50&beforeId=${encodeURIComponent(
          String(nextBeforeId)
        )}`,
        {
          cache: "no-store" as RequestCache
        }
      );

      const payload = (await response
        .json()
        .catch(
          () => null
        )) as ChatPageResponse | null;

      if (!response.ok) {
        setError(tr.error);
        return;
      }

      const older = Array.isArray(
        payload?.items
      )
        ? payload.items
        : [];

      setItems((previous) =>
        mergeMessages(
          previous,
          older
        )
      );

      setNextBeforeId(
        payload?.nextBeforeId ?? null
      );

      window.requestAnimationFrame(() => {
        if (!listRef.current) return;

        const newHeight =
          listRef.current.scrollHeight;

        listRef.current.scrollTop =
          newHeight - currentHeight;
      });
    } catch {
      setError(tr.error);
    } finally {
      setLoadingOlder(false);
    }
  }

  async function sendMessage() {
    const clean = text.trim();

    if (
      !clean ||
      sending ||
      isClosed
    ) {
      return;
    }

    try {
      setSending(true);
      setError(null);

      const response = await fetch(
        `/api/chat/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            text: clean
          })
        }
      );

      const payload = (await response
        .json()
        .catch(
          () => null
        )) as ChatMessage | null;

      if (
        !response.ok ||
        !payload
      ) {
        setError(tr.sendError);
        return;
      }

      setItems((previous) =>
        mergeMessages(
          previous,
          [payload]
        )
      );

      setText("");

      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    } catch {
      setError(tr.sendError);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    loadInitial();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (!initialLoaded) return;

    const timer = window.setInterval(
      () => {
        refreshSilently();
      },
      5000
    );

    return () => {
      window.clearInterval(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, initialLoaded]);

  useEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTop =
      listRef.current.scrollHeight;
  }, [items.length]);

  const placeholder = useMemo(
    () =>
      viewRole === "CLIENT"
        ? tr.placeholderClient
        : tr.placeholderPsychologist,
    [tr, viewRole]
  );

  function isMine(
    item: ChatMessage
  ) {
    return (
      (item.senderRole || "").toUpperCase() ===
      viewRole
    );
  }

  function senderLabel(
    item: ChatMessage
  ) {
    const senderRole = (
      item.senderRole || ""
    ).toUpperCase();

    if (senderRole === viewRole) {
      return tr.you;
    }

    return senderRole === "CLIENT"
      ? tr.client
      : tr.psychologist;
  }

  function onComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (
        text.trim() &&
        !sending &&
        !isClosed
      ) {
        void sendMessage();
      }
    }
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#073f43]/7 bg-white shadow-[0_20px_60px_rgba(7,63,67,0.07)]">
      <header className="border-b border-[#073f43]/7 bg-white/95 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#e5f8f5] to-[#edf5ff] text-[#078b7b]">
              <ChatIcon />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black tracking-[-0.02em] text-[#173f42]">
                  {tr.title}
                </h2>

                {!isClosed && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f8f5] px-2.5 py-1 text-[10px] font-black text-[#078b7b]">
                    <span className="size-1.5 rounded-full bg-[#12b8c4]" />
                    {tr.live}
                  </span>
                )}
              </div>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#819293]">
                {tr.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadInitial(true)
            }
            disabled={refreshing}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#073f43]/8 bg-white px-4 text-xs font-extrabold text-[#557173] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/25 hover:text-[#078b7b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              <RefreshIcon />
            </span>

            {refreshing
              ? tr.refreshing
              : tr.refresh}
          </button>
        </div>
      </header>

      {isClosed && (
        <div className="mx-5 mt-5 flex gap-3 rounded-[20px] border border-amber-200 bg-amber-50 p-4 sm:mx-6">
          <div className="mt-0.5 shrink-0 text-amber-600">
            <LockIcon />
          </div>

          <div>
            <div className="text-sm font-black text-amber-900">
              {tr.closed}
            </div>

            <div className="mt-1 text-xs leading-5 text-amber-800/75">
              {tr.closedHint}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-5 mt-5 rounded-[18px] border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 sm:mx-6">
          {error}
        </div>
      )}

      <div className="relative bg-[radial-gradient(circle_at_20%_10%,rgba(18,184,196,0.055),transparent_28%),radial-gradient(circle_at_90%_75%,rgba(118,87,223,0.045),transparent_30%),#f8fbfb]">
        {nextBeforeId && (
          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#073f43]/8 bg-white/95 px-4 text-[11px] font-extrabold text-[#617c7e] shadow-[0_8px_25px_rgba(7,63,67,0.08)] backdrop-blur transition-all hover:border-[#12b8c4]/25 hover:text-[#078b7b] disabled:opacity-60"
            >
              {loadingOlder
                ? tr.loadingOlder
                : tr.loadOlder}
            </button>
          </div>
        )}

        <div
          ref={listRef}
          className="h-[500px] overflow-y-auto px-4 py-6 sm:h-[560px] sm:px-6"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-bold text-[#718789]">
                <span className="size-5 animate-spin rounded-full border-2 border-[#12b8c4]/20 border-t-[#078b7b]" />
                {tr.loading}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-white text-[#078b7b] shadow-sm">
                  <ChatIcon />
                </div>

                <div className="mt-4 text-sm font-black text-[#31595b]">
                  {tr.empty}
                </div>

                <div className="mt-1.5 text-xs leading-5 text-[#849697]">
                  {tr.emptyHint}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-7">
              {items.map((item) => {
                const mine =
                  isMine(item);

                return (
                  <div
                    key={item.id}
                    className={`flex ${
                      mine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[72%] ${
                        mine
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`mb-1.5 px-1 text-[10px] font-extrabold ${
                          mine
                            ? "text-right text-[#078b7b]"
                            : "text-left text-[#7a8f90]"
                        }`}
                      >
                        {senderLabel(item)}
                      </div>

                      <div
                        className={`rounded-[22px] px-4 py-3.5 shadow-sm ${
                          mine
                            ? "rounded-br-[7px] bg-gradient-to-br from-[#078b7b] via-[#119b99] to-[#159faf] text-white"
                            : "rounded-bl-[7px] border border-[#073f43]/7 bg-white text-[#31595b]"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm leading-6">
                          {item.text}
                        </div>

                        <div
                          className={`mt-2 text-[10px] ${
                            mine
                              ? "text-white/70"
                              : "text-[#92a1a2]"
                          }`}
                        >
                          {fmtDateTime(
                            item.createdAt,
                            lang
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-[#073f43]/7 bg-white p-4 sm:p-5">
        <div
          className={`rounded-[24px] border bg-[#f8fbfb] p-3 transition-all ${
            isClosed
              ? "border-[#073f43]/7 opacity-70"
              : "border-[#073f43]/8 focus-within:border-[#12b8c4]/35 focus-within:bg-white focus-within:shadow-[0_10px_30px_rgba(7,63,67,0.055)]"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) =>
              setText(
                event.target.value
              )
            }
            onKeyDown={
              onComposerKeyDown
            }
            placeholder={placeholder}
            rows={3}
            maxLength={4000}
            disabled={isClosed}
            className="block max-h-40 min-h-[72px] w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 text-[#274f52] outline-none placeholder:text-[#9aabad] disabled:cursor-not-allowed"
          />

          <div className="mt-2 flex flex-col gap-3 border-t border-[#073f43]/6 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="px-2 text-[10px] font-bold text-[#9aabad]">
              {text.length}/4000{" "}
              {tr.chars}
            </div>

            <button
              type="button"
              onClick={sendMessage}
              disabled={
                sending ||
                !text.trim() ||
                isClosed
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(21,159,175,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,159,175,0.26)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              {sending
                ? tr.sending
                : tr.send}

              {!sending && (
                <SendIcon />
              )}
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
