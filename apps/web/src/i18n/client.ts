import en from "@/i18n/en.json";
import ru from "@/i18n/ru.json";
import hy from "@/i18n/hy.json";

export type UiLang = "en" | "ru" | "hy";

export function getUiLangFromCookie(): UiLang {
  if (typeof document === "undefined") return "ru";
  const m = document.cookie.match(/(?:^|;\s*)ivixhub_lang=([^;]+)/);
  const v = m ? decodeURIComponent(m[1]) : "ru";
  if (v === "en" || v === "hy" || v === "ru") return v;
  return "ru";
}

export function tClient(lang: UiLang) {
  return lang === "hy" ? (hy as any) : lang === "en" ? (en as any) : (ru as any);
}
