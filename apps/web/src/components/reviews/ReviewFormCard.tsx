"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "ru" | "en" | "hy";
type TargetRole = "PSYCHOLOGIST" | "CLIENT";

type ExistingReviewResponse = {
  exists: boolean;
  review: {
    id: number;
    bookingId: number;
    targetRole: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  } | null;
};

const TXT = {
  ru: {
    titlePsychologist: "Оценить психолога",
    titleClient: "Оценить клиента",
    subtitlePsychologist: "После завершённой сессии вы можете оставить оценку и комментарий.",
    subtitleClient: "После завершённой сессии вы можете оставить оценку и комментарий о клиенте.",
    rating: "Оценка",
    comment: "Комментарий",
    commentPlaceholderPsychologist: "Поделитесь впечатлением о работе психолога...",
    commentPlaceholderClient: "Поделитесь впечатлением о работе с клиентом...",
    submit: "Отправить отзыв",
    submitting: "Отправка...",
    alreadySubmitted: "Отзыв уже отправлен",
    success: "Спасибо, отзыв сохранён.",
    loadError: "Не удалось загрузить состояние отзыва.",
    submitError: "Не удалось отправить отзыв.",
    optional: "необязательно",
    yourRating: "Ваша оценка",
    yourComment: "Ваш комментарий",
    starsHint: "Выберите оценку от 1 до 5"
  },
  en: {
    titlePsychologist: "Rate the psychologist",
    titleClient: "Rate the client",
    subtitlePsychologist: "After a completed session, you can leave a rating and a comment.",
    subtitleClient: "After a completed session, you can leave a rating and a comment about the client.",
    rating: "Rating",
    comment: "Comment",
    commentPlaceholderPsychologist: "Share your experience with the psychologist...",
    commentPlaceholderClient: "Share your experience working with the client...",
    submit: "Submit review",
    submitting: "Submitting...",
    alreadySubmitted: "Review already submitted",
    success: "Thank you, your review has been saved.",
    loadError: "Failed to load review state.",
    submitError: "Failed to submit review.",
    optional: "optional",
    yourRating: "Your rating",
    yourComment: "Your comment",
    starsHint: "Choose a rating from 1 to 5"
  },
  hy: {
    titlePsychologist: "Գնահատել հոգեբանին",
    titleClient: "Գնահատել հաճախորդին",
    subtitlePsychologist: "Ավարտված սեանսից հետո կարող եք թողնել գնահատական և մեկնաբանություն։",
    subtitleClient: "Ավարտված սեանսից հետո կարող եք թողնել գնահատական և մեկնաբանություն հաճախորդի մասին։",
    rating: "Գնահատական",
    comment: "Մեկնաբանություն",
    commentPlaceholderPsychologist: "Կիսվեք հոգեբանի աշխատանքի մասին ձեր տպավորությամբ...",
    commentPlaceholderClient: "Կիսվեք հաճախորդի հետ աշխատանքի մասին ձեր տպավորությամբ...",
    submit: "Ուղարկել կարծիքը",
    submitting: "Ուղարկվում է...",
    alreadySubmitted: "Կարծիքն արդեն ուղարկված է",
    success: "Շնորհակալություն, կարծիքը պահպանվեց։",
    loadError: "Չհաջողվեց բեռնել կարծիքի վիճակը։",
    submitError: "Չհաջողվեց ուղարկել կարծիքը։",
    optional: "ոչ պարտադիր",
    yourRating: "Ձեր գնահատականը",
    yourComment: "Ձեր մեկնաբանությունը",
    starsHint: "Ընտրեք գնահատական 1-ից 5"
  }
} as const;

function StarButton({
  active,
  onClick
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition ${
        active
          ? "border-amber-300 bg-amber-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
      aria-label="star"
    >
      ★
    </button>
  );
}

export default function ReviewFormCard({
  bookingId,
  lang,
  targetRole
}: {
  bookingId: number;
  lang: Lang;
  targetRole: TargetRole;
}) {
  const tr = TXT[lang];

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existing, setExisting] = useState<ExistingReviewResponse["review"]>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const title = targetRole === "PSYCHOLOGIST" ? tr.titlePsychologist : tr.titleClient;
  const subtitle = targetRole === "PSYCHOLOGIST" ? tr.subtitlePsychologist : tr.subtitleClient;
  const placeholder =
    targetRole === "PSYCHOLOGIST"
      ? tr.commentPlaceholderPsychologist
      : tr.commentPlaceholderClient;

  async function loadExisting() {
    try {
      setLoading(true);
      setError(null);

      const r = await fetch(`/api/reviews/bookings/${bookingId}/my`, {
        cache: "no-store"
      });

      const j = (await r.json().catch(() => null)) as ExistingReviewResponse | null;

      if (!r.ok) {
        setError(j && "message" in (j as any) ? (j as any).message : tr.loadError);
        return;
      }

      if (j?.exists && j.review) {
        setExisting(j.review);
      } else {
        setExisting(null);
      }
    } catch {
      setError(tr.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExisting();
  }, [bookingId]);

  async function submitReview() {
    if (submitting || rating < 1 || rating > 5) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment
        })
      });

      const j = await r.json().catch(() => null);

      if (!r.ok) {
        const details =
          typeof j?.details === "string" && j.details.trim()
            ? j.details
            : j?.message || tr.submitError;

        setError(details);
        return;
      }

      setExisting(j);
      setSuccess(tr.success);
    } catch {
      setError(tr.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <section className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

      {loading ? (
        <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          Loading...
        </div>
      ) : existing ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
            {tr.alreadySubmitted}
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">{tr.yourRating}</div>
              <div className="mt-1 font-medium">{existing.rating} / 5</div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-xs text-gray-500">Created</div>
              <div className="mt-1 font-medium">
                {new Date(existing.createdAt).toLocaleString("hy-AM", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
            <div className="text-xs text-gray-500">{tr.yourComment}</div>
            <div className="mt-1 whitespace-pre-wrap text-slate-900">
              {existing.comment?.trim() || "—"}
            </div>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4 rounded-2xl border bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-2xl border bg-emerald-50 p-4 text-sm text-emerald-900">
              {success}
            </div>
          )}

          <div className="mt-4">
            <div className="text-sm font-medium">{tr.rating}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {stars.map((star) => (
                <StarButton
                  key={star}
                  active={rating >= star}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">{tr.starsHint}</div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">
              {tr.comment} <span className="text-slate-400">({tr.optional})</span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              rows={5}
              placeholder={placeholder}
              className="mt-2 w-full rounded-3xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <button
            type="button"
            onClick={submitReview}
            disabled={submitting || rating < 1}
            className="mt-4 rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? tr.submitting : tr.submit}
          </button>
        </>
      )}
    </section>
  );
}
