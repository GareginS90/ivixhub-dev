import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import UserStatusActions from "@/components/admin/UserStatusActions";
import {
  adminFetch,
  fmtDateTime,
  type AdminUser,
  type UserRole
} from "@/lib/admin-api";
import { cookies } from "next/headers";
import { normalizeAdminLang } from "@/lib/admin-i18n";

type Params = Promise<{
  id: string;
}>;

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M19 12H5m5-5-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5 7 7 6 7-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function roleTone(role: UserRole) {
  if (role === "ADMIN") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  if (role === "PSYCHOLOGIST") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

function InfoRow({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#073f43]/6 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="text-xs font-medium text-[#789092]">{label}</div>
      <div className="break-all text-sm font-semibold text-[#315e61] sm:text-right">
        {value}
      </div>
    </div>
  );
}

export default async function UserDetailPage({
  params
}: {
  params: Params;
}) {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const { id } = await params;
  const userId = Number.parseInt(id, 10);

  const labels =
    lang === "hy"
      ? {
          title: "Օգտատիրոջ հաշիվ",
          subtitle:
            "Դիտեք հաշվի տվյալները, հաստատման կարգավիճակը և ադմինիստրատիվ հասանելիությունը։",
          back: "Բոլոր օգտատերերը",
          notFound: "Օգտատերը չի գտնվել։",
          loadError: "Չհաջողվեց բեռնել օգտատիրոջ տվյալները։",
          overview: "Հաշվի ամփոփում",
          personal: "Անձնական տվյալներ",
          contact: "Կոնտակտային տվյալներ",
          security: "Հաշվի կարգավիճակ",
          activity: "Ժամանակագրություն",
          administration: "Հաշվի կառավարում",
          administrationText:
            "Հաշվի անջատումը չի ջնջում օգտատիրոջ տվյալները։ Այն հնարավոր է հետագայում կրկին ակտիվացնել։",
          id: "User ID",
          fullName: "Անուն",
          username: "Username",
          birthDate: "Ծննդյան ամսաթիվ",
          gender: "Սեռ",
          email: "Էլ․ փոստ",
          phone: "Հեռախոս",
          phoneVerification: "Հեռախոսի հաստատում",
          role: "Դեր",
          accountStatus: "Հաշվի կարգավիճակ",
          createdAt: "Ստեղծվել է",
          updatedAt: "Վերջին փոփոխություն",
          active: "Ակտիվ",
          inactive: "Անջատված",
          verified: "Հաստատված",
          notVerified: "Չհաստատված",
          male: "Արական",
          female: "Իգական",
          unspecified: "Նշված չէ"
        }
      : lang === "ru"
        ? {
            title: "Аккаунт пользователя",
            subtitle:
              "Просматривайте данные аккаунта, статус подтверждения и административный доступ.",
            back: "Все пользователи",
            notFound: "Пользователь не найден.",
            loadError: "Не удалось загрузить данные пользователя.",
            overview: "Обзор аккаунта",
            personal: "Личные данные",
            contact: "Контактные данные",
            security: "Статус аккаунта",
            activity: "Хронология",
            administration: "Управление аккаунтом",
            administrationText:
              "Отключение аккаунта не удаляет данные пользователя. Аккаунт можно активировать снова.",
            id: "User ID",
            fullName: "Имя",
            username: "Username",
            birthDate: "Дата рождения",
            gender: "Пол",
            email: "Email",
            phone: "Телефон",
            phoneVerification: "Подтверждение телефона",
            role: "Роль",
            accountStatus: "Статус аккаунта",
            createdAt: "Создан",
            updatedAt: "Последнее изменение",
            active: "Активен",
            inactive: "Отключён",
            verified: "Подтверждён",
            notVerified: "Не подтверждён",
            male: "Мужской",
            female: "Женский",
            unspecified: "Не указан"
          }
        : {
            title: "User account",
            subtitle:
              "Review account data, verification status and administrative access.",
            back: "All users",
            notFound: "User not found.",
            loadError: "Unable to load user details.",
            overview: "Account overview",
            personal: "Personal information",
            contact: "Contact information",
            security: "Account status",
            activity: "Timeline",
            administration: "Account administration",
            administrationText:
              "Deactivating an account does not delete user data. The account can be activated again later.",
            id: "User ID",
            fullName: "Full name",
            username: "Username",
            birthDate: "Birth date",
            gender: "Gender",
            email: "Email",
            phone: "Phone",
            phoneVerification: "Phone verification",
            role: "Role",
            accountStatus: "Account status",
            createdAt: "Created",
            updatedAt: "Last updated",
            active: "Active",
            inactive: "Inactive",
            verified: "Verified",
            notVerified: "Not verified",
            male: "Male",
            female: "Female",
            unspecified: "Unspecified"
          };

  if (!Number.isInteger(userId) || userId <= 0) {
    return (
      <AdminShell
        lang={lang}
        title={labels.title}
        subtitle={labels.subtitle}
      >
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#078b7b] transition hover:text-[#073f43]"
        >
          <BackIcon />
          {labels.back}
        </Link>

        <div className="mt-5 rounded-[26px] border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
          {labels.notFound}
        </div>
      </AdminShell>
    );
  }

  let user: AdminUser | null = null;
  let error = "";

  try {
    user = await adminFetch<AdminUser>(`/api/admin/users/${userId}`);
  } catch (caught: unknown) {
    error =
      caught instanceof Error && caught.message
        ? caught.message
        : labels.loadError;
  }

  if (!user) {
    return (
      <AdminShell
        lang={lang}
        title={labels.title}
        subtitle={labels.subtitle}
      >
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#078b7b] transition hover:text-[#073f43]"
        >
          <BackIcon />
          {labels.back}
        </Link>

        <div className="mt-5 rounded-[26px] border border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
          {error || labels.notFound}
        </div>
      </AdminShell>
    );
  }

  const genderLabel =
    user.gender === "MALE"
      ? labels.male
      : user.gender === "FEMALE"
        ? labels.female
        : labels.unspecified;

  return (
    <AdminShell
      lang={lang}
      title={labels.title}
      subtitle={labels.subtitle}
    >
      <Link
        href="/users"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#078b7b] transition hover:text-[#073f43]"
      >
        <BackIcon />
        {labels.back}
      </Link>

      <section className="mt-5 overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_16px_45px_rgba(7,63,67,.055)]">
        <div className="relative overflow-hidden px-6 py-6 sm:px-7">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, rgba(18,184,196,.10), transparent 35%), radial-gradient(circle at 100% 20%, rgba(118,87,223,.08), transparent 32%)"
            }}
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#dff7f3] via-[#eaf6fb] to-[#eeeaff] text-xl font-bold text-[#078b7b] ring-1 ring-[#073f43]/6">
                {(user.fullName || user.username || user.email)
                  .slice(0, 1)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-[#073f43]">
                  {user.fullName || user.username}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#789092]">
                  <span>@{user.username}</span>
                  <span>•</span>
                  <span>ID {user.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${roleTone(user.role)}`}
              >
                {user.role}
              </span>

              <span
                className={
                  user.active
                    ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    : "inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                }
              >
                {user.active ? labels.active : labels.inactive}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.045)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
                <UserIcon />
              </div>
              <h2 className="text-base font-semibold text-[#073f43]">
                {labels.personal}
              </h2>
            </div>

            <div className="mt-4">
              <InfoRow label={labels.id} value={user.id} />
              <InfoRow label={labels.fullName} value={user.fullName || "—"} />
              <InfoRow label={labels.username} value={`@${user.username}`} />
              <InfoRow label={labels.birthDate} value={user.birthDate || "—"} />
              <InfoRow label={labels.gender} value={genderLabel} />
            </div>
          </section>

          <section className="rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.045)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf3ff] text-[#3977e8]">
                <ContactIcon />
              </div>
              <h2 className="text-base font-semibold text-[#073f43]">
                {labels.contact}
              </h2>
            </div>

            <div className="mt-4">
              <InfoRow label={labels.email} value={user.email} />
              <InfoRow label={labels.phone} value={user.phone || "—"} />
              <InfoRow
                label={labels.phoneVerification}
                value={
                  <span
                    className={
                      user.phoneVerified
                        ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                        : "inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
                    }
                  >
                    {user.phoneVerified
                      ? labels.verified
                      : labels.notVerified}
                  </span>
                }
              />
            </div>
          </section>

          <section className="rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.045)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-[#7657df]">
                <ShieldIcon />
              </div>
              <h2 className="text-base font-semibold text-[#073f43]">
                {labels.security}
              </h2>
            </div>

            <div className="mt-4">
              <InfoRow
                label={labels.role}
                value={
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${roleTone(user.role)}`}
                  >
                    {user.role}
                  </span>
                }
              />

              <InfoRow
                label={labels.accountStatus}
                value={
                  <span
                    className={
                      user.active
                        ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                        : "inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                    }
                  >
                    {user.active ? labels.active : labels.inactive}
                  </span>
                }
              />
            </div>
          </section>

          <section className="rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.045)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1f8f8] text-[#456b6e]">
                <ClockIcon />
              </div>
              <h2 className="text-base font-semibold text-[#073f43]">
                {labels.activity}
              </h2>
            </div>

            <div className="mt-4">
              <InfoRow
                label={labels.createdAt}
                value={fmtDateTime(user.createdAt)}
              />
              <InfoRow
                label={labels.updatedAt}
                value={fmtDateTime(user.updatedAt)}
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[26px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.05)] sm:p-6 xl:sticky xl:top-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#073f43] text-[#8ce8e8]">
              <ShieldIcon />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#073f43]">
                {labels.administration}
              </h2>
              <div className="mt-0.5 text-xs text-[#91a3a5]">
                ID {user.id}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-[#607d80]">
            {labels.administrationText}
          </p>

          <div className="my-5 h-px bg-[#073f43]/7" />

          <UserStatusActions
            userId={user.id}
            active={user.active}
            lang={lang}
          />
        </aside>
      </div>
    </AdminShell>
  );
}
