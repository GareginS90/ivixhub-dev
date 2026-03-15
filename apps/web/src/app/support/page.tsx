export const dynamic = "force-dynamic";

import Link from "next/link";

function SupportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-gray-700">
        {children}
      </div>
    </section>
  );
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#fbfcff] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Поддержка</h1>
            <p className="mt-2 text-sm text-gray-600">
              Важная информация о бронировании, оплате, отмене и работе платформы.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            На главную
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SupportCard title="Как работает IviXHub">
            <p>
              Клиент проходит мини-тест или выбирает психолога из каталога,
              затем выбирает тип сессии, язык, дату и время, после чего
              переходит к оплате и подтверждению брони.
            </p>
            <p className="mt-3">
              После успешной оплаты бронь считается подтверждённой, а информация
              о сессии появляется в личном кабинете.
            </p>
          </SupportCard>

          <SupportCard title="Оплата и escrow">
            <p>
              Все платежи проходят через платёжный flow платформы. Для MVP+
              платёжный сценарий уже построен так, чтобы дальше масштабироваться
              к реальным провайдерам.
            </p>
            <p className="mt-3">
              Деньги не должны восприниматься как окончательно завершённые до тех пор,
              пока не выполнены условия сессии и соответствующая бизнес-логика платформы.
            </p>
          </SupportCard>

          <SupportCard title="Правила отмены">
            <p>
              Бесплатная отмена доступна не позднее чем за 24 часа до начала сессии.
            </p>
            <p className="mt-3">
              Если до начала сессии осталось меньше 24 часов, отмена может быть
              ограничена правилами платформы и логикой backend.
            </p>
          </SupportCard>

          <SupportCard title="Видеосессии">
            <p>
              После подтверждения брони пользователь получает доступ к сессии
              в рамках платформы. Видеосессии являются частью основного продукта
              и учитываются как обязательный элемент MVP+.
            </p>
            <p className="mt-3">
              Если возникают технические проблемы со входом в сессию, такие случаи
              должны обрабатываться через поддержку и административные процессы.
            </p>
          </SupportCard>

          <SupportCard title="Безопасность и конфиденциальность">
            <p>
              Платформа должна обеспечивать защищённый доступ, разграничение ролей,
              подтверждение специалистов и корректную обработку пользовательских данных.
            </p>
            <p className="mt-3">
              Мы не должны показывать лишние технические детали пользователю, но обязаны
              сохранять прозрачность правил и процессов.
            </p>
          </SupportCard>

          <SupportCard title="Если возникла проблема">
            <p>
              Если у вас возникли сложности с оплатой, отменой, доступом к брони,
              подтверждением специалиста или видеосессией, обращение должно попадать
              в поток поддержки и администрирования платформы.
            </p>
            <p className="mt-3">
              На следующем этапе через Admin Panel мы добавим полноценную
              операционную обработку таких кейсов.
            </p>
          </SupportCard>
        </div>

        <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Быстрые действия</h2>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/psychologists"
              className="inline-flex justify-center rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90"
            >
              Перейти в каталог психологов
            </Link>
            <Link
              href="/quiz"
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
            >
              Пройти мини-тест
            </Link>
            <Link
              href="/app"
              className="inline-flex justify-center rounded-2xl border px-5 py-3 hover:bg-gray-50"
            >
              Открыть личный кабинет
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
