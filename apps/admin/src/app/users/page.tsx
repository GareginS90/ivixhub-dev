import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  adminFetch,
  fmtDateTime,
  type AdminUsersPage,
  type UserRole
} from "@/lib/admin-api";
import { cookies } from "next/headers";
import { normalizeAdminLang } from "@/lib/admin-i18n";

type SearchParams = Promise<{
  q?: string;
  role?: string;
  active?: string;
  page?: string;
}>;

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 20c.7-3.8 2.7-6 6-6s5.3 2.2 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 7.2a3.3 3.3 0 0 1 0 6.4M17 15c2.2.7 3.5 2.4 4 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d={direction === "left" ? "M19 12H5m5-5-5 5 5 5" : "M5 12h14m-5-5 5 5-5 5"}
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

function buildPageHref(
  page: number,
  values: {
    q: string;
    role: string;
    active: string;
  }
) {
  const params = new URLSearchParams();

  if (values.q) params.set("q", values.q);
  if (values.role) params.set("role", values.role);
  if (values.active) params.set("active", values.active);

  params.set("page", String(page));

  return `/users?${params.toString()}`;
}

export default async function UsersPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const lang = normalizeAdminLang((await cookies()).get("ivixhub_lang")?.value);
  const params = await searchParams;

  const q = (params.q || "").trim();
  const role =
    params.role === "CLIENT" ||
    params.role === "PSYCHOLOGIST" ||
    params.role === "ADMIN"
      ? params.role
      : "";

  const active =
    params.active === "true" || params.active === "false"
      ? params.active
      : "";

  const requestedPage = Number.parseInt(params.page || "0", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage >= 0
      ? requestedPage
      : 0;

  const apiParams = new URLSearchParams({
    page: String(page),
    size: "20"
  });

  if (q) apiParams.set("search", q);
  if (role) apiParams.set("role", role);
  if (active) apiParams.set("active", active);

  let result: AdminUsersPage | null = null;
  let error = "";

  try {
    result = await adminFetch<AdminUsersPage>(
      `/api/admin/users?${apiParams.toString()}`
    );
  } catch (caught: unknown) {
    error =
      caught instanceof Error
        ? caught.message
        : "Unable to load users";
  }

  const labels =
    lang === "hy"
      ? {
          title: "Օգտատերեր",
          subtitle:
            "Կառավարեք IviXHub-ի հաճախորդների, հոգեբանների և ադմինիստրատորների հաշիվները։",
          total: "Ընդամենը",
          visible: "Այս էջում",
          active: "Ակտիվ",
          search: "Որոնել",
          searchPlaceholder: "Անուն, էլ․ փոստ, username կամ հեռախոս",
          allRoles: "Բոլոր դերերը",
          allStatuses: "Բոլոր կարգավիճակները",
          activeOnly: "Միայն ակտիվ",
          inactiveOnly: "Միայն անջատված",
          apply: "Կիրառել",
          clear: "Մաքրել",
          user: "Օգտատեր",
          role: "Դեր",
          contact: "Կապ",
          status: "Կարգավիճակ",
          joined: "Գրանցվել է",
          activeStatus: "Ակտիվ",
          inactiveStatus: "Անջատված",
          verified: "Հաստատված",
          notVerified: "Չհաստատված",
          details: "Բացել",
          empty: "Այս ֆիլտրերով օգտատերեր չեն գտնվել։",
          previous: "Նախորդ",
          next: "Հաջորդ",
          page: "Էջ",
          createUser: "Նոր օգտատեր"
        }
      : lang === "ru"
        ? {
            title: "Пользователи",
            subtitle:
              "Управляйте аккаунтами клиентов, психологов и администраторов IviXHub.",
            total: "Всего",
            visible: "На странице",
            active: "Активные",
            search: "Поиск",
            searchPlaceholder: "Имя, email, username или телефон",
            allRoles: "Все роли",
            allStatuses: "Все статусы",
            activeOnly: "Только активные",
            inactiveOnly: "Только отключённые",
            apply: "Применить",
            clear: "Очистить",
            user: "Пользователь",
            role: "Роль",
            contact: "Контакты",
            status: "Статус",
            joined: "Регистрация",
            activeStatus: "Активен",
            inactiveStatus: "Отключён",
            verified: "Подтверждён",
            notVerified: "Не подтверждён",
            details: "Открыть",
            empty: "Пользователи с такими фильтрами не найдены.",
            previous: "Назад",
            next: "Далее",
            page: "Страница",
            createUser: "Новый пользователь"
          }
        : {
            title: "Users",
            subtitle:
              "Manage IviXHub client, psychologist and administrator accounts.",
            total: "Total users",
            visible: "On this page",
            active: "Active shown",
            search: "Search",
            searchPlaceholder: "Name, email, username or phone",
            allRoles: "All roles",
            allStatuses: "All statuses",
            activeOnly: "Active only",
            inactiveOnly: "Inactive only",
            apply: "Apply",
            clear: "Clear",
            user: "User",
            role: "Role",
            contact: "Contact",
            status: "Status",
            joined: "Joined",
            activeStatus: "Active",
            inactiveStatus: "Inactive",
            verified: "Verified",
            notVerified: "Not verified",
            details: "Open",
            empty: "No users match the selected filters.",
            previous: "Previous",
            next: "Next",
            page: "Page",
            createUser: "New user"
          };

  const users = result?.users || [];
  const activeShown = users.filter((user) => user.active).length;

  return (
    <AdminShell
      lang={lang}
      title={labels.title}
      subtitle={labels.subtitle}
    >
      <div className="mb-5 flex justify-end">
        <Link
          href="/users/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#073f43] px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(7,63,67,.14)] transition hover:-translate-y-0.5 hover:bg-[#0a555a]"
        >
          <span
            className="text-lg font-light leading-none"
            aria-hidden="true"
          >
            +
          </span>
          {labels.createUser}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-[24px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.05)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#078b7b]" />
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789092]">
            {labels.total}
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#073f43]">
            {result?.totalElements ?? "—"}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.05)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#3977e8]" />
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789092]">
            {labels.visible}
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#073f43]">
            {users.length}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-[#073f43]/8 bg-white p-5 shadow-[0_12px_38px_rgba(7,63,67,.05)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#7657df]" />
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#789092]">
            {labels.active}
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[#073f43]">
            {activeShown}
          </div>
        </div>
      </div>

      <form
        method="GET"
        className="mt-5 rounded-[26px] border border-[#073f43]/8 bg-white p-4 shadow-[0_12px_38px_rgba(7,63,67,.045)]"
      >
        <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_220px_220px_auto]">
          <label className="relative block">
            <span className="sr-only">{labels.search}</span>
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[#789092]">
              <SearchIcon />
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder={labels.searchPlaceholder}
              className="h-11 w-full rounded-2xl border border-[#073f43]/10 bg-[#f9fcfc] pl-11 pr-4 text-sm text-[#073f43] outline-none transition placeholder:text-[#9aabad] focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10"
            />
          </label>

          <select
            name="role"
            defaultValue={role}
            className="h-11 rounded-2xl border border-[#073f43]/10 bg-[#f9fcfc] px-4 text-sm font-medium text-[#315e61] outline-none transition focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10"
          >
            <option value="">{labels.allRoles}</option>
            <option value="CLIENT">CLIENT</option>
            <option value="PSYCHOLOGIST">PSYCHOLOGIST</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <select
            name="active"
            defaultValue={active}
            className="h-11 rounded-2xl border border-[#073f43]/10 bg-[#f9fcfc] px-4 text-sm font-medium text-[#315e61] outline-none transition focus:border-[#12b8c4]/60 focus:bg-white focus:ring-4 focus:ring-[#12b8c4]/10"
          >
            <option value="">{labels.allStatuses}</option>
            <option value="true">{labels.activeOnly}</option>
            <option value="false">{labels.inactiveOnly}</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="h-11 flex-1 rounded-2xl bg-[#073f43] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0a555a] xl:flex-none"
            >
              {labels.apply}
            </button>

            <Link
              href="/users"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#073f43]/10 bg-white px-4 text-sm font-semibold text-[#607d80] transition hover:bg-[#f7fbfb]"
            >
              {labels.clear}
            </Link>
          </div>
        </div>
      </form>

      {error ? (
        <div className="mt-5 rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#073f43]/8 bg-white shadow-[0_16px_45px_rgba(7,63,67,.055)]">
          <div className="flex items-center gap-3 border-b border-[#073f43]/7 px-5 py-4 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f8f6] text-[#078b7b]">
              <UsersIcon />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#073f43]">
                {labels.title}
              </div>
              <div className="mt-0.5 text-xs text-[#789092]">
                {result?.totalElements ?? 0} {labels.total.toLowerCase()}
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#f0f8f7] text-[#078b7b]">
                <SearchIcon />
              </div>
              <p className="mt-4 text-sm font-medium text-[#607d80]">
                {labels.empty}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-[#073f43]/7 bg-[#f9fcfc] text-left">
                    <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789092]">
                      {labels.user}
                    </th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789092]">
                      {labels.role}
                    </th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789092]">
                      {labels.contact}
                    </th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789092]">
                      {labels.status}
                    </th>
                    <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#789092]">
                      {labels.joined}
                    </th>
                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#073f43]/6 transition last:border-b-0 hover:bg-[#fbfdfd]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e5f8f5] to-[#edf3ff] text-sm font-bold text-[#078b7b]">
                            {(user.fullName || user.username || user.email)
                              .slice(0, 1)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="max-w-[250px] truncate text-sm font-semibold text-[#073f43]">
                              {user.fullName || user.username}
                            </div>
                            <div className="mt-0.5 text-xs text-[#91a3a5]">
                              @{user.username} · ID {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${roleTone(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="max-w-[260px] truncate text-sm font-medium text-[#315e61]">
                          {user.email}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#91a3a5]">
                          {user.phone || "—"}
                          {user.phoneVerified && (
                            <span
                              className="text-emerald-600"
                              title={labels.verified}
                            >
                              <VerifiedIcon />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span
                            className={
                              user.active
                                ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                                : "inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                            }
                          >
                            {user.active
                              ? labels.activeStatus
                              : labels.inactiveStatus}
                          </span>

                          <span className="text-[11px] text-[#91a3a5]">
                            {user.phoneVerified
                              ? labels.verified
                              : labels.notVerified}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-[#607d80]">
                        {fmtDateTime(user.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/users/${user.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-[#073f43]/10 bg-white px-3.5 text-xs font-semibold text-[#078b7b] transition hover:-translate-y-0.5 hover:border-[#078b7b]/25 hover:bg-[#f0faf8]"
                        >
                          {labels.details}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result && result.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#073f43]/7 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="text-xs font-medium text-[#789092]">
                {labels.page} {result.page + 1} / {result.totalPages}
              </div>

              <div className="flex gap-2">
                {result.first ? (
                  <span className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#073f43]/7 bg-[#f7fafb] px-4 text-xs font-semibold text-[#b0bdbf]">
                    <ArrowIcon direction="left" />
                    {labels.previous}
                  </span>
                ) : (
                  <Link
                    href={buildPageHref(result.page - 1, {
                      q,
                      role,
                      active
                    })}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#073f43]/10 bg-white px-4 text-xs font-semibold text-[#315e61] transition hover:bg-[#f7fbfb]"
                  >
                    <ArrowIcon direction="left" />
                    {labels.previous}
                  </Link>
                )}

                {result.last ? (
                  <span className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#073f43]/7 bg-[#f7fafb] px-4 text-xs font-semibold text-[#b0bdbf]">
                    {labels.next}
                    <ArrowIcon direction="right" />
                  </span>
                ) : (
                  <Link
                    href={buildPageHref(result.page + 1, {
                      q,
                      role,
                      active
                    })}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#073f43]/10 bg-white px-4 text-xs font-semibold text-[#315e61] transition hover:bg-[#f7fbfb]"
                  >
                    {labels.next}
                    <ArrowIcon direction="right" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </AdminShell>
  );
}
