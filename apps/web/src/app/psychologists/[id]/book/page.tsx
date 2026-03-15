import BookSessionClient from "@/components/booking/BookSessionClient";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const psychologistId = Number(id);

  if (!id || Number.isNaN(psychologistId)) {
    return (
      <main className="min-h-screen bg-[#fbfcff] p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border bg-red-50 p-6 text-red-800 text-sm">
          <b>Error:</b> Invalid psychologist id in URL.
        </div>
      </main>
    );
  }

  return <BookSessionClient psychologistId={psychologistId} />;
}
