"use client";

import { FormEvent, useState } from "react";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.5-2.7 8-7 10-4.3-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m5 7 7 6 7-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 10V8a4 4 0 0 1 8 0v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-20"
      />
      <path
        d="M20 12a8 8 0 0 0-8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const text = await response.text();

      let data: { message?: string } | null = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            (response.status === 401 || response.status === 403
              ? "Սխալ էլ․ փոստ կամ գաղտնաբառ"
              : "Մուտքը չհաջողվեց")
        );
      }

      window.location.replace("/");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Մուտքը չհաջողվեց։ Փորձեք կրկին։"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbfb]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 15%, rgba(18,184,196,.13), transparent 28%), radial-gradient(circle at 88% 82%, rgba(118,87,223,.10), transparent 30%), radial-gradient(circle at 76% 10%, rgba(57,119,232,.07), transparent 25%)"
        }}
      />

      <div className="pointer-events-none absolute -left-28 top-1/3 h-72 w-72 rounded-full border border-[#12b8c4]/10" />
      <div className="pointer-events-none absolute -left-16 top-[38%] h-48 w-48 rounded-full border border-[#12b8c4]/10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-[#7657df]/10" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1320px] items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_480px] lg:px-8">
        <section className="hidden max-w-xl lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#078b7b]/10 bg-white/75 px-3.5 py-2 text-xs font-semibold text-[#078b7b] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#12b8c4]" />
            IviXHub Internal Administration
          </div>

          <div className="mt-7">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#078b7b]">
              IviXHub
            </div>

            <h1 className="mt-4 max-w-lg text-[48px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#073f43]">
              Secure administration for the IviXHub platform.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#607d80]">
              Հոգեբանների մոդերացիա, կատալոգի կառավարում և համակարգի
              գործողությունների վերահսկում՝ մեկ անվտանգ միջավայրում։
            </p>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            <div className="rounded-[20px] border border-[#073f43]/7 bg-white/75 p-4 shadow-[0_10px_30px_rgba(7,63,67,.04)] backdrop-blur">
              <div className="h-1.5 w-8 rounded-full bg-[#078b7b]" />
              <div className="mt-4 text-sm font-semibold text-[#073f43]">
                Moderation
              </div>
              <div className="mt-1 text-xs leading-5 text-[#789092]">
                Review & verify
              </div>
            </div>

            <div className="rounded-[20px] border border-[#073f43]/7 bg-white/75 p-4 shadow-[0_10px_30px_rgba(7,63,67,.04)] backdrop-blur">
              <div className="h-1.5 w-8 rounded-full bg-[#3977e8]" />
              <div className="mt-4 text-sm font-semibold text-[#073f43]">
                Catalog
              </div>
              <div className="mt-1 text-xs leading-5 text-[#789092]">
                Platform data
              </div>
            </div>

            <div className="rounded-[20px] border border-[#073f43]/7 bg-white/75 p-4 shadow-[0_10px_30px_rgba(7,63,67,.04)] backdrop-blur">
              <div className="h-1.5 w-8 rounded-full bg-[#7657df]" />
              <div className="mt-4 text-sm font-semibold text-[#073f43]">
                Audit
              </div>
              <div className="mt-1 text-xs leading-5 text-[#789092]">
                Activity control
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[480px]">
          <div className="overflow-hidden rounded-[32px] border border-[#073f43]/8 bg-white/90 shadow-[0_28px_80px_rgba(7,63,67,.11)] backdrop-blur-xl">
            <div className="relative overflow-hidden border-b border-[#073f43]/7 px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 95% 0%, rgba(18,184,196,.12), transparent 40%), radial-gradient(circle at 0% 100%, rgba(118,87,223,.06), transparent 38%)"
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e5f8f5] to-[#edf3ff] text-[#078b7b] ring-1 ring-[#078b7b]/8">
                    <ShieldIcon />
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#078b7b]">
                      IviXHub
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-[#789092]">
                      Secure administration
                    </div>
                  </div>
                </div>

                <h2 className="mt-7 text-[30px] font-semibold tracking-[-0.035em] text-[#073f43]">
                  Admin Panel
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#607d80]">
                  Մուտք գործեք ադմինիստրատորի հաշվով։
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="px-6 py-6 sm:px-8 sm:py-7">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-[#315e61]"
                >
                  Էլ․ փոստ
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-[#91a3a5]">
                    <MailIcon />
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isSubmitting}
                    className="h-[52px] w-full rounded-2xl border border-[#073f43]/10 bg-[#fbfdfd] pl-12 pr-4 text-sm font-medium text-[#073f43] outline-none transition placeholder:text-[#a5b4b5] focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold text-[#315e61]"
                >
                  Գաղտնաբառ
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-center text-[#91a3a5]">
                    <LockIcon />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSubmitting}
                    className="h-[52px] w-full rounded-2xl border border-[#073f43]/10 bg-[#fbfdfd] pl-12 pr-4 text-sm font-medium text-[#073f43] outline-none transition placeholder:text-[#a5b4b5] focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3.5 text-sm leading-5 text-rose-700"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-xs font-bold">
                    !
                  </div>
                  <div className="pt-0.5">{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email.trim() || !password}
                className="mt-6 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#073f43] via-[#087f78] to-[#078b7b] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(7,139,123,.20)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(7,139,123,.25)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon />
                    Մուտք...
                  </>
                ) : (
                  <>
                    Մուտք գործել
                    <ArrowIcon />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-start gap-2.5 border-t border-[#073f43]/7 pt-5 text-xs leading-5 text-[#789092]">
                <span className="mt-0.5 text-[#078b7b]">
                  <ShieldIcon />
                </span>
                <p>
                  Այս բաժինը նախատեսված է միայն IviXHub-ի լիազորված
                  ադմինիստրատորների համար։
                </p>
              </div>
            </form>
          </div>

          <div className="mt-5 text-center text-[11px] font-medium text-[#91a3a5]">
            IviXHub · Internal Administration
          </div>
        </section>
      </div>
    </main>
  );
}
