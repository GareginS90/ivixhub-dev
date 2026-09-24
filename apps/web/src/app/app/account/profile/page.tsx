"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState
} from "react";
import { useRouter } from "next/navigation";
import { getUiLangFromCookie } from "@/i18n/client";

type Lang = "ru" | "en" | "hy";
type Gender =
  | "MALE"
  | "FEMALE"
  | "UNSPECIFIED";

type MeResponse = {
  id: number;
  email: string;
  fullName: string | null;
  username: string;
  birthDate: string;
  gender: Gender;
  phone: string | null;
  phoneVerified: boolean;
  role: string;
  active: boolean;
};

const TXT = {
  hy: {
    back: "Վերադառնալ անձնական էջ",
    eyebrow: "IviXHub Account",
    title: "Անձնական տվյալներ",
    subtitle:
      "Կառավարեք ձեր հիմնական պրոֆիլային տվյալները և հաշվի տեղեկությունները։",
    personalInfo: "Պրոֆիլի տվյալներ",
    personalInfoHint:
      "Այս տվյալները կարող եք փոփոխել ցանկացած ժամանակ։",
    accountInfo: "Հաշվի տվյալներ",
    accountInfoHint:
      "Email-ը և հեռախոսահամարը այս էջից չեն փոփոխվում։",
    fullName: "Անուն և ազգանուն",
    username: "Նիք",
    birthDate: "Ծննդյան ամսաթիվ",
    gender: "Սեռ",
    male: "Արական",
    female: "Իգական",
    unspecified: "Նշված չէ",
    email: "Էլ․ փոստ",
    phone: "Հեռախոսահամար",
    verified: "Հաստատված",
    notVerified: "Չհաստատված",
    notProvided: "Նշված չէ",
    accountStatus: "Հաշվի կարգավիճակ",
    active: "Ակտիվ",
    inactive: "Ապաակտիվ",
    save: "Պահպանել փոփոխությունները",
    saving: "Պահպանվում է…",
    loading: "Պրոֆիլը բեռնվում է…",
    success:
      "Պրոֆիլը հաջողությամբ թարմացվեց։",
    failed:
      "Չհաջողվեց թարմացնել պրոֆիլը։",
    loadFailed:
      "Չհաջողվեց բեռնել պրոֆիլի տվյալները։",
    fullNamePlaceholder:
      "Օրինակ՝ Անուն Ազգանուն",
    usernamePlaceholder:
      "օրինակ՝ username",
    invalidBirthDate:
      "Ընտրեք ճիշտ ծննդյան ամսաթիվ",
    futureBirthDate:
      "Ծննդյան ամսաթիվը չի կարող լինել ապագայում",
    invalidUsername:
      "Նիքը կարող է պարունակել միայն լատինատառ տառեր, թվեր, կետ և ընդգծում",
    usernameHint:
      "Լատինատառ տառեր, թվեր, կետ և ընդգծում։",
    secureTitle:
      "Ձեր հաշվի տվյալները պաշտպանված են",
    secureText:
      "Փոփոխությունները պահպանվում են միայն ձեր հաստատված IviXHub հաշվում։"
  },

  ru: {
    back: "Вернуться в кабинет",
    eyebrow: "IviXHub Account",
    title: "Личные данные",
    subtitle:
      "Управляйте основной информацией профиля и данными аккаунта.",
    personalInfo: "Данные профиля",
    personalInfoHint:
      "Эти данные можно изменить в любое время.",
    accountInfo: "Данные аккаунта",
    accountInfoHint:
      "Email и номер телефона не изменяются на этой странице.",
    fullName: "Имя и фамилия",
    username: "Никнейм",
    birthDate: "Дата рождения",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    unspecified: "Не указано",
    email: "Email",
    phone: "Номер телефона",
    verified: "Подтверждён",
    notVerified: "Не подтверждён",
    notProvided: "Не указано",
    accountStatus: "Статус аккаунта",
    active: "Активен",
    inactive: "Неактивен",
    save: "Сохранить изменения",
    saving: "Сохранение…",
    loading: "Загружаем профиль…",
    success:
      "Профиль успешно обновлён.",
    failed:
      "Не удалось обновить профиль.",
    loadFailed:
      "Не удалось загрузить данные профиля.",
    fullNamePlaceholder:
      "Например, Имя Фамилия",
    usernamePlaceholder:
      "например, username",
    invalidBirthDate:
      "Выберите корректную дату рождения",
    futureBirthDate:
      "Дата рождения не может быть в будущем",
    invalidUsername:
      "Никнейм может содержать только латинские буквы, цифры, точку и нижнее подчёркивание",
    usernameHint:
      "Латинские буквы, цифры, точка и нижнее подчёркивание.",
    secureTitle:
      "Данные вашего аккаунта защищены",
    secureText:
      "Изменения сохраняются только в вашем подтверждённом аккаунте IviXHub."
  },

  en: {
    back: "Back to dashboard",
    eyebrow: "IviXHub Account",
    title: "Personal information",
    subtitle:
      "Manage your core profile information and account details.",
    personalInfo: "Profile information",
    personalInfoHint:
      "You can update these details at any time.",
    accountInfo: "Account details",
    accountInfoHint:
      "Email and phone number cannot be changed on this page.",
    fullName: "Full name",
    username: "Username",
    birthDate: "Date of birth",
    gender: "Gender",
    male: "Male",
    female: "Female",
    unspecified: "Not specified",
    email: "Email",
    phone: "Phone number",
    verified: "Verified",
    notVerified: "Not verified",
    notProvided: "Not provided",
    accountStatus: "Account status",
    active: "Active",
    inactive: "Inactive",
    save: "Save changes",
    saving: "Saving…",
    loading: "Loading profile…",
    success:
      "Profile updated successfully.",
    failed:
      "Failed to update profile.",
    loadFailed:
      "Failed to load profile information.",
    fullNamePlaceholder:
      "For example, First Last",
    usernamePlaceholder:
      "for example, username",
    invalidBirthDate:
      "Select a valid date of birth",
    futureBirthDate:
      "Date of birth cannot be in the future",
    invalidUsername:
      "Username may contain only Latin letters, numbers, dot and underscore",
    usernameHint:
      "Latin letters, numbers, dot and underscore.",
    secureTitle:
      "Your account information is protected",
    secureText:
      "Changes are saved only to your authenticated IviXHub account."
  }
} as const;

function isValidUsername(
  value: string
) {
  return /^[a-zA-Z0-9._]+$/.test(
    value
  );
}

function todayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function ArrowLeftIcon() {
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
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function UserIcon({
  size = 20
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
      <circle
        cx="12"
        cy="8"
        r="4"
      />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
      />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3h3l1.5 5-2 1.5a15 15 0 0 0 5 5l1.5-2 5 1.5v3a4 4 0 0 1-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" />
    </svg>
  );
}

function ShieldIcon({
  size = 19
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
      <path d="M12 3 20 6v5c0 5.2-3.4 8.4-8 10-4.6-1.6-8-4.8-8-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
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
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
      />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
      />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.1 6.8" />
    </svg>
  );
}

function ProfileField({
  label,
  icon,
  children,
  hint
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-black text-[#526f71]">
        <span className="text-[#159faf]">
          {icon}
        </span>
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-[11px] leading-5 text-[#93a4a5]">
          {hint}
        </p>
      )}
    </div>
  );
}

function ReadOnlyRow({
  icon,
  label,
  value,
  badge
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: {
    text: string;
    positive: boolean;
  };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-[#073f43]/6 bg-[#f9fbfb] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#159faf] shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#96a5a6]">
            {label}
          </div>

          <div className="mt-1 break-all text-sm font-bold text-[#31595b]">
            {value}
          </div>
        </div>
      </div>

      {badge && (
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ${
            badge.positive
              ? "bg-[#e7f7f4] text-[#078b7b]"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {badge.positive && (
            <CheckIcon />
          )}
          {badge.text}
        </span>
      )}
    </div>
  );
}

export default function ClientAccountProfilePage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("hy");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [me, setMe] =
    useState<MeResponse | null>(
      null
    );

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [gender, setGender] =
    useState<Gender>(
      "UNSPECIFIED"
    );

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    const syncLang = () => {
      setLang(
        getUiLangFromCookie()
      );
    };

    syncLang();

    const onFocus = () =>
      syncLang();

    const onVisible = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        syncLang();
      }
    };

    window.addEventListener(
      "focus",
      onFocus
    );

    document.addEventListener(
      "visibilitychange",
      onVisible
    );

    const timer =
      window.setInterval(
        syncLang,
        700
      );

    return () => {
      window.removeEventListener(
        "focus",
        onFocus
      );

      document.removeEventListener(
        "visibilitychange",
        onVisible
      );

      window.clearInterval(timer);
    };
  }, []);

  const tr = TXT[lang];

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch("/api/me", {
            cache: "no-store"
          });

        const payload =
          (await response
            .json()
            .catch(
              () => null
            )) as MeResponse | null;

        if (
          !response.ok ||
          !payload
        ) {
          if (!cancelled) {
            setError(
              tr.loadFailed
            );
          }
          return;
        }

        if (cancelled) {
          return;
        }

        setMe(payload);

        setFullName(
          payload.fullName || ""
        );

        setUsername(
          payload.username || ""
        );

        setBirthDate(
          payload.birthDate || ""
        );

        setGender(
          payload.gender ||
            "UNSPECIFIED"
        );
      } catch {
        if (!cancelled) {
          setError(
            tr.loadFailed
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [tr.loadFailed]);

  const genderOptions = useMemo(
    () => [
      {
        code: "MALE" as const,
        label: tr.male
      },
      {
        code: "FEMALE" as const,
        label: tr.female
      },
      {
        code:
          "UNSPECIFIED" as const,
        label: tr.unspecified
      }
    ],
    [tr]
  );

  async function submit() {
    if (saving) {
      return;
    }

    setError(null);
    setSuccess(null);

    if (!birthDate) {
      setError(
        tr.invalidBirthDate
      );
      return;
    }

    const birth = new Date(
      `${birthDate}T00:00:00`
    );

    if (
      Number.isNaN(
        birth.getTime()
      )
    ) {
      setError(
        tr.invalidBirthDate
      );
      return;
    }

    if (
      birthDate > todayDate()
    ) {
      setError(
        tr.futureBirthDate
      );
      return;
    }

    const cleanUsername =
      username.trim();

    if (
      !isValidUsername(
        cleanUsername
      )
    ) {
      setError(
        tr.invalidUsername
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch("/api/me", {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            fullName:
              fullName.trim() ||
              null,
            username:
              cleanUsername.toLowerCase(),
            birthDate,
            gender
          })
        });

      const payload =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        setError(
          payload?.message ||
            payload?.details ||
            tr.failed
        );
        return;
      }

      setMe((previous) =>
        previous
          ? {
              ...previous,
              fullName:
                fullName.trim() ||
                null,
              username:
                cleanUsername.toLowerCase(),
              birthDate,
              gender
            }
          : previous
      );

      setUsername(
        cleanUsername.toLowerCase()
      );

      setSuccess(tr.success);

      window.setTimeout(() => {
        router.push("/app");
        router.refresh();
      }, 900);
    } catch {
      setError(tr.failed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[760px] bg-[radial-gradient(circle_at_4%_7%,rgba(18,184,196,0.12),transparent_28%),radial-gradient(circle_at_96%_8%,rgba(118,87,223,0.09),transparent_31%),radial-gradient(circle_at_52%_38%,rgba(57,119,232,0.045),transparent_32%)]" />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full border border-[#073f43]/8 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-[#4d6b6d] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#12b8c4]/30 hover:bg-white hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {tr.back}
        </Link>

        <section className="relative mt-7 overflow-hidden rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_65px_rgba(7,63,67,0.07)] backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-gradient-to-br from-[#12b8c4]/10 via-[#3977e8]/7 to-[#7657df]/9 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#12b8c4]/12 bg-[#eefaf9] px-3.5 py-2 text-xs font-extrabold text-[#078b7b]">
              <UserIcon size={16} />
              {tr.eyebrow}
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#073f43] sm:text-[38px]">
              {tr.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73898b]">
              {tr.subtitle}
            </p>
          </div>
        </section>

        {loading ? (
          <section className="mt-6 flex min-h-[340px] items-center justify-center rounded-[30px] border border-[#073f43]/7 bg-white shadow-[0_20px_60px_rgba(7,63,67,0.06)]">
            <div className="text-center">
              <div className="mx-auto size-7 animate-spin rounded-full border-[3px] border-[#12b8c4]/15 border-t-[#078b7b]" />

              <div className="mt-4 text-sm font-bold text-[#6d8587]">
                {tr.loading}
              </div>
            </div>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <section className="rounded-[30px] border border-[#073f43]/7 bg-white p-5 shadow-[0_20px_60px_rgba(7,63,67,0.06)] sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-[#e9f8f5] text-[#078b7b]">
                  <UserIcon />
                </div>

                <div>
                  <h2 className="text-base font-black text-[#31595b]">
                    {tr.personalInfo}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#8a9c9d]">
                    {tr.personalInfoHint}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-6">
                <ProfileField
                  label={tr.fullName}
                  icon={<UserIcon size={18} />}
                >
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder={
                      tr.fullNamePlaceholder
                    }
                    autoComplete="name"
                    className="w-full rounded-[18px] border border-[#073f43]/10 bg-[#fbfdfd] px-4 py-3.5 text-sm font-semibold text-[#31595b] outline-none transition-all placeholder:font-normal placeholder:text-[#a5b2b3] focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/8"
                  />
                </ProfileField>

                <ProfileField
                  label={tr.username}
                  icon={<AtIcon />}
                  hint={tr.usernameHint}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9aa9aa]">
                      @
                    </span>

                    <input
                      type="text"
                      value={username}
                      onChange={(event) =>
                        setUsername(
                          event.target.value
                        )
                      }
                      placeholder={
                        tr.usernamePlaceholder
                      }
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full rounded-[18px] border border-[#073f43]/10 bg-[#fbfdfd] py-3.5 pl-9 pr-4 text-sm font-semibold text-[#31595b] outline-none transition-all placeholder:font-normal placeholder:text-[#a5b2b3] focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/8"
                    />
                  </div>
                </ProfileField>

                <ProfileField
                  label={tr.birthDate}
                  icon={<CalendarIcon />}
                >
                  <input
                    type="date"
                    value={birthDate}
                    max={todayDate()}
                    onChange={(event) =>
                      setBirthDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-[18px] border border-[#073f43]/10 bg-[#fbfdfd] px-4 py-3.5 text-sm font-semibold text-[#31595b] outline-none transition-all focus:border-[#12b8c4]/45 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/8"
                  />
                </ProfileField>

                <ProfileField
                  label={tr.gender}
                  icon={<UserIcon size={18} />}
                >
                  <div className="grid gap-2 sm:grid-cols-3">
                    {genderOptions.map(
                      (item) => {
                        const selected =
                          gender ===
                          item.code;

                        return (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() =>
                              setGender(
                                item.code
                              )
                            }
                            className={`min-h-12 rounded-[17px] border px-4 text-sm font-extrabold transition-all duration-200 ${
                              selected
                                ? "border-[#078b7b] bg-gradient-to-r from-[#078b7b] to-[#159faf] text-white shadow-[0_8px_20px_rgba(7,139,123,0.16)]"
                                : "border-[#073f43]/9 bg-[#fbfdfd] text-[#617b7d] hover:border-[#12b8c4]/30 hover:bg-[#f3fbfa]"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </ProfileField>

                {error && (
                  <div className="rounded-[18px] border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-red-800">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-3 rounded-[18px] border border-[#12b8c4]/15 bg-[#eaf8f5] p-4 text-sm font-bold text-[#078b7b]">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white">
                      <CheckIcon />
                    </span>
                    {success}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    void submit()
                  }
                  disabled={saving}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#078b7b] via-[#159faf] to-[#3977e8] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(21,159,175,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(21,159,175,0.24)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      {tr.saving}
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      {tr.save}
                    </>
                  )}
                </button>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-[30px] border border-[#073f43]/7 bg-white p-5 shadow-[0_20px_60px_rgba(7,63,67,0.055)] sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-[16px] bg-[#eef3ff] text-[#3977e8]">
                    <ShieldIcon />
                  </div>

                  <div>
                    <h2 className="text-base font-black text-[#31595b]">
                      {tr.accountInfo}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-[#8a9c9d]">
                      {tr.accountInfoHint}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <ReadOnlyRow
                    icon={<MailIcon />}
                    label={tr.email}
                    value={
                      me?.email ||
                      tr.notProvided
                    }
                  />

                  <ReadOnlyRow
                    icon={<PhoneIcon />}
                    label={tr.phone}
                    value={
                      me?.phone ||
                      tr.notProvided
                    }
                    badge={
                      me?.phone
                        ? {
                            text:
                              me.phoneVerified
                                ? tr.verified
                                : tr.notVerified,
                            positive:
                              Boolean(
                                me.phoneVerified
                              )
                          }
                        : undefined
                    }
                  />

                  <ReadOnlyRow
                    icon={<ShieldIcon size={18} />}
                    label={
                      tr.accountStatus
                    }
                    value={
                      me?.active
                        ? tr.active
                        : tr.inactive
                    }
                    badge={
                      me
                        ? {
                            text:
                              me.active
                                ? tr.active
                                : tr.inactive,
                            positive:
                              me.active
                          }
                        : undefined
                    }
                  />
                </div>
              </section>

              <section className="overflow-hidden rounded-[26px] border border-[#12b8c4]/12 bg-gradient-to-br from-[#effbf9] via-white to-[#f1f5ff] p-5 shadow-[0_16px_45px_rgba(7,63,67,0.045)]">
                <div className="flex size-10 items-center justify-center rounded-[14px] bg-white text-[#078b7b] shadow-sm">
                  <ShieldIcon />
                </div>

                <h3 className="mt-4 text-sm font-black text-[#31595b]">
                  {tr.secureTitle}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#789092]">
                  {tr.secureText}
                </p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
