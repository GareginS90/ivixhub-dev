import BookSessionClient from "@/components/booking/BookSessionClient";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const psychologistId = Number(id);

  if (
    !id ||
    !Number.isInteger(psychologistId) ||
    psychologistId <= 0
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden px-5 py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[500px] bg-[radial-gradient(circle_at_5%_5%,rgba(18,184,196,0.10),transparent_30%),radial-gradient(circle_at_95%_10%,rgba(118,87,223,0.09),transparent_30%)]" />

        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-red-50/90 p-6 text-sm font-medium text-red-800 shadow-sm">
          Invalid psychologist id.
        </div>
      </main>
    );
  }

  return (
    <BookSessionClient psychologistId={psychologistId} />
  );
}
