import Link from "next/link";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import { normalizeAdminLang } from "@/lib/admin-i18n";
import CreateUserForm from "./CreateUserForm";

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
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

export default async function NewUserPage() {
  const lang = normalizeAdminLang(
    (await cookies()).get("ivixhub_lang")?.value
  );

  const labels =
    lang === "hy"
      ? {
          title: "Նոր օգտատեր",
          subtitle:
            "Ստեղծեք հաճախորդի, հոգեբանի կամ ադմինիստրատորի նոր հաշիվ։",
          back: "Վերադառնալ օգտատերերին"
        }
      : lang === "ru"
        ? {
            title: "Новый пользователь",
            subtitle:
              "Создайте новый аккаунт клиента, психолога или администратора.",
            back: "Вернуться к пользователям"
          }
        : {
            title: "New user",
            subtitle:
              "Create a new client, psychologist or administrator account.",
            back: "Back to users"
          };

  return (
    <AdminShell
      lang={lang}
      title={labels.title}
      subtitle={labels.subtitle}
    >
      <div className="mb-5">
        <Link
          href="/users"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#073f43]/10 bg-white px-4 text-xs font-semibold text-[#607d80] transition hover:-translate-y-0.5 hover:border-[#078b7b]/20 hover:bg-[#f7fbfb] hover:text-[#078b7b]"
        >
          <ArrowLeftIcon />
          {labels.back}
        </Link>
      </div>

      <CreateUserForm lang={lang} />
    </AdminShell>
  );
}
