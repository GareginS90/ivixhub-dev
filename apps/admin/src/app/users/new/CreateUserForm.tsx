"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import {
  createUser,
  type CreateUserInput
} from "./actions";
import type {
  UserGender,
  UserRole
} from "@/lib/admin-api";
import type { AdminLang } from "@/lib/admin-i18n";

type Props = {
  lang: AdminLang;
};

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 3 5.5 5.7v5.1c0 4.3 2.6 7.9 6.5 10.2 3.9-2.3 6.5-5.9 6.5-10.2V5.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.3 12 1.7 1.7 3.7-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CreateUserForm({ lang }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const labels =
    lang === "hy"
      ? {
          account: "Հաշվի տվյալներ",
          accountHint:
            "Մուտքագրեք օգտատիրոջ հիմնական և կոնտակտային տվյալները։",
          access: "Մուտք և հասանելիություն",
          accessHint:
            "Սահմանեք օգտատիրոջ դերը, սկզբնական գաղտնաբառը և հաշվի վիճակը։",
          fullName: "Անուն ազգանուն",
          fullNamePlaceholder: "Օրինակ՝ Անի Սարգսյան",
          email: "Էլ․ փոստ",
          emailPlaceholder: "user@example.com",
          username: "Username",
          usernamePlaceholder: "ani.sargsyan",
          phone: "Հեռախոս",
          phonePlaceholder: "+374...",
          birthDate: "Ծննդյան ամսաթիվ",
          gender: "Սեռ",
          male: "Արական",
          female: "Իգական",
          unspecified: "Չնշված",
          role: "Դեր",
          client: "Հաճախորդ",
          psychologist: "Հոգեբան",
          admin: "Ադմինիստրատոր",
          password: "Սկզբնական գաղտնաբառ",
          passwordPlaceholder: "Առնվազն 8 նիշ",
          passwordHint:
            "Առնվազն 8 նիշ՝ ներառյալ տառ, թիվ և հատուկ նշան։",
          status: "Հաշվի վիճակ",
          active: "Ակտիվ հաշիվ",
          activeHint:
            "Օգտատերը ստեղծվելուց անմիջապես հետո կկարողանա մուտք գործել։",
          inactiveHint:
            "Հաշիվը կստեղծվի, բայց մուտքը կլինի անջատված։",
          cancel: "Չեղարկել",
          create: "Ստեղծել օգտատեր",
          creating: "Ստեղծվում է…",
          genericError: "Չհաջողվեց ստեղծել օգտատիրոջը։"
        }
      : lang === "ru"
        ? {
            account: "Данные аккаунта",
            accountHint:
              "Укажите основные и контактные данные пользователя.",
            access: "Доступ и безопасность",
            accessHint:
              "Выберите роль, начальный пароль и состояние аккаунта.",
            fullName: "Имя и фамилия",
            fullNamePlaceholder: "Например, Анна Саргсян",
            email: "Email",
            emailPlaceholder: "user@example.com",
            username: "Username",
            usernamePlaceholder: "anna.sargsyan",
            phone: "Телефон",
            phonePlaceholder: "+374...",
            birthDate: "Дата рождения",
            gender: "Пол",
            male: "Мужской",
            female: "Женский",
            unspecified: "Не указан",
            role: "Роль",
            client: "Клиент",
            psychologist: "Психолог",
            admin: "Администратор",
            password: "Начальный пароль",
            passwordPlaceholder: "Минимум 8 символов",
            passwordHint:
              "Минимум 8 символов, включая букву, цифру и специальный символ.",
            status: "Состояние аккаунта",
            active: "Активный аккаунт",
            activeHint:
              "Пользователь сможет войти сразу после создания.",
            inactiveHint:
              "Аккаунт будет создан, но вход останется отключённым.",
            cancel: "Отмена",
            create: "Создать пользователя",
            creating: "Создание…",
            genericError: "Не удалось создать пользователя."
          }
        : {
            account: "Account details",
            accountHint:
              "Enter the user's primary identity and contact information.",
            access: "Access and security",
            accessHint:
              "Choose the role, initial password and account state.",
            fullName: "Full name",
            fullNamePlaceholder: "For example, Anna Sargsyan",
            email: "Email",
            emailPlaceholder: "user@example.com",
            username: "Username",
            usernamePlaceholder: "anna.sargsyan",
            phone: "Phone",
            phonePlaceholder: "+374...",
            birthDate: "Birth date",
            gender: "Gender",
            male: "Male",
            female: "Female",
            unspecified: "Unspecified",
            role: "Role",
            client: "Client",
            psychologist: "Psychologist",
            admin: "Administrator",
            password: "Initial password",
            passwordPlaceholder: "At least 8 characters",
            passwordHint:
              "At least 8 characters including a letter, digit and special symbol.",
            status: "Account status",
            active: "Active account",
            activeHint:
              "The user will be able to sign in immediately after creation.",
            inactiveHint:
              "The account will be created, but sign-in will remain disabled.",
            cancel: "Cancel",
            create: "Create user",
            creating: "Creating…",
            genericError: "Failed to create user."
          };

  const [role, setRole] = useState<UserRole>("CLIENT");
  const [gender, setGender] =
    useState<UserGender>("UNSPECIFIED");
  const [active, setActive] = useState(true);

  function localizeError(message: string) {
    const normalized = message.trim().toLowerCase();

    if (normalized.includes("phone number is already registered")) {
      return lang === "hy"
        ? "Այս հեռախոսահամարով օգտատեր արդեն գրանցված է։"
        : lang === "ru"
          ? "Пользователь с этим номером телефона уже зарегистрирован."
          : "A user with this phone number is already registered.";
    }

    if (normalized.includes("email is already registered")) {
      return lang === "hy"
        ? "Այս էլ․ փոստով օգտատեր արդեն գրանցված է։"
        : lang === "ru"
          ? "Пользователь с этим email уже зарегистрирован."
          : "A user with this email is already registered.";
    }

    if (normalized.includes("username is already taken")) {
      return lang === "hy"
        ? "Այս username-ն արդեն զբաղված է։ Ընտրեք մեկ ուրիշը։"
        : lang === "ru"
          ? "Этот username уже занят. Выберите другой."
          : "This username is already taken. Choose another one.";
    }

    if (normalized.includes("birth date is out of allowed range")) {
      return lang === "hy"
        ? "Ծննդյան ամսաթիվը թույլատրելի միջակայքից դուրս է։"
        : lang === "ru"
          ? "Дата рождения находится вне допустимого диапазона."
          : "The birth date is outside the allowed range.";
    }

    if (
      normalized.includes("password must contain") ||
      normalized.includes("size must be between")
    ) {
      return lang === "hy"
        ? "Ստուգեք գաղտնաբառը․ այն պետք է ունենա առնվազն 8 նիշ, տառ, թիվ և հատուկ նշան։"
        : lang === "ru"
          ? "Проверьте пароль: он должен содержать минимум 8 символов, букву, цифру и специальный символ."
          : "Check the password: it must contain at least 8 characters, a letter, a digit and a special symbol.";
    }

    if (
      normalized === "admin_session_expired" ||
      normalized === "admin_unauthenticated"
    ) {
      return lang === "hy"
        ? "Ձեր ադմինիստրատորի սեսիան ավարտվել է։ Մուտք գործեք կրկին։"
        : lang === "ru"
          ? "Сессия администратора завершена. Войдите снова."
          : "Your administrator session has expired. Please sign in again.";
    }

    if (normalized === "admin_forbidden") {
      return lang === "hy"
        ? "Այս գործողությունը կատարելու համար բավարար իրավունքներ չկան։"
        : lang === "ru"
          ? "Недостаточно прав для выполнения этого действия."
          : "You do not have permission to perform this action.";
    }

    return lang === "hy"
      ? "Չհաջողվեց ստեղծել օգտատիրոջը։ Ստուգեք մուտքագրված տվյալները և փորձեք կրկին։"
      : lang === "ru"
        ? "Не удалось создать пользователя. Проверьте введённые данные и попробуйте снова."
        : "Failed to create the user. Check the entered information and try again.";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);

    const input: CreateUserInput = {
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      username: String(form.get("username") || ""),
      phone: String(form.get("phone") || ""),
      birthDate: String(form.get("birthDate") || ""),
      gender,
      role,
      password: String(form.get("password") || ""),
      active
    };

    startTransition(async () => {
      const result = await createUser(input);

      if (!result.success) {
        setError(
          result.message
            ? localizeError(result.message)
            : labels.genericError
        );
        return;
      }

      router.push(`/users/${result.userId}`);
      router.refresh();
    });
  }

  const inputClass =
    "mt-2 h-12 w-full rounded-2xl border border-[#073f43]/10 bg-[#f9fcfc] px-4 text-sm text-[#073f43] outline-none transition placeholder:text-[#9aabad] focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-[0.08em] text-[#607d80]";

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-[22px] border border-rose-200 bg-rose-50 px-5 py-4 shadow-[0_10px_30px_rgba(190,24,93,.06)]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-base font-bold text-rose-600 shadow-sm">
            !
          </div>

          <div className="min-w-0 pt-0.5">
            <div className="text-sm font-semibold text-rose-800">
              {lang === "hy"
                ? "Չհաջողվեց ստեղծել օգտատիրոջը"
                : lang === "ru"
                  ? "Не удалось создать пользователя"
                  : "Unable to create user"}
            </div>

            <div className="mt-1 text-sm leading-5 text-rose-700">
              {error}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
        <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_16px_45px_rgba(7,63,67,.055)]">
          <div className="flex items-start gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
              <UserIcon />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#073f43]">
                {labels.account}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#789092]">
                {labels.accountHint}
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className={labelClass}>
              {labels.fullName}
              <input
                name="fullName"
                type="text"
                maxLength={150}
                autoComplete="name"
                placeholder={labels.fullNamePlaceholder}
                disabled={isPending}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              {labels.email}
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={labels.emailPlaceholder}
                disabled={isPending}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              {labels.username}
              <input
                name="username"
                type="text"
                required
                minLength={3}
                maxLength={50}
                pattern="[a-zA-Z0-9._]+"
                autoComplete="username"
                placeholder={labels.usernamePlaceholder}
                disabled={isPending}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              {labels.phone}
              <input
                name="phone"
                type="tel"
                maxLength={50}
                autoComplete="tel"
                placeholder={labels.phonePlaceholder}
                disabled={isPending}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              {labels.birthDate}
              <input
                name="birthDate"
                type="date"
                required
                min="1940-01-01"
                max="2010-12-31"
                disabled={isPending}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              {labels.gender}
              <select
                value={gender}
                onChange={(event) =>
                  setGender(event.target.value as UserGender)
                }
                disabled={isPending}
                className={inputClass}
              >
                <option value="UNSPECIFIED">
                  {labels.unspecified}
                </option>
                <option value="MALE">{labels.male}</option>
                <option value="FEMALE">{labels.female}</option>
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_16px_45px_rgba(7,63,67,.055)]">
          <div className="flex items-start gap-3 border-b border-[#073f43]/7 px-5 py-5 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#3977e8]">
              <ShieldIcon />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#073f43]">
                {labels.access}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#789092]">
                {labels.accessHint}
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <label className={labelClass}>
              {labels.role}
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as UserRole)
                }
                disabled={isPending}
                className={inputClass}
              >
                <option value="CLIENT">{labels.client}</option>
                <option value="PSYCHOLOGIST">
                  {labels.psychologist}
                </option>
                <option value="ADMIN">{labels.admin}</option>
              </select>
            </label>

            <label className={labelClass}>
              {labels.password}
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
                autoComplete="new-password"
                placeholder={labels.passwordPlaceholder}
                disabled={isPending}
                className={inputClass}
              />
              <span className="mt-2 block text-[11px] font-normal normal-case tracking-normal leading-5 text-[#91a3a5]">
                {labels.passwordHint}
              </span>
            </label>

            <div>
              <div className={labelClass}>{labels.status}</div>

              <button
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => setActive((value) => !value)}
                disabled={isPending}
                className="mt-3 flex w-full items-center justify-between gap-4 rounded-[20px] border border-[#073f43]/8 bg-[#f9fcfc] p-4 text-left transition hover:border-[#078b7b]/20 hover:bg-[#f5fbfa] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div>
                  <div className="text-sm font-semibold text-[#073f43]">
                    {labels.active}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-[#789092]">
                    {active
                      ? labels.activeHint
                      : labels.inactiveHint}
                  </div>
                </div>

                <span
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    active ? "bg-[#078b7b]" : "bg-[#c8d3d4]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      active ? "left-6" : "left-1"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 rounded-[24px] border border-[#073f43]/8 bg-white p-4 shadow-[0_12px_38px_rgba(7,63,67,.045)] sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/users"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#073f43]/10 bg-white px-5 text-sm font-semibold text-[#607d80] transition hover:bg-[#f7fbfb]"
        >
          {labels.cancel}
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#073f43] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(7,63,67,.14)] transition hover:-translate-y-0.5 hover:bg-[#0a555a] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
        >
          {isPending ? labels.creating : labels.create}
        </button>
      </div>
    </form>
  );
}
