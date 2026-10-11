import type { Metadata } from 'next';
import Link from 'next/link';
import { RETREATS } from '@/content/retreats';

export const metadata: Metadata = {
  title: 'Ретриты',
  description: 'Выездные ретриты центра Семерджиди для глубокого восстановления и работы с телом вне города.',
};

export default function RetreatsPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Ретриты</span>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.12] text-[color:var(--color-on-background)] md:text-5xl">
            Выездные пространства для восстановления
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
            Малые группы, полное сопровождение специалистом и выход из привычной городской среды — там, где
            регулярная терапия не дотягивается.
          </p>
        </div>
      </section>

      <div className="hairline mx-5 md:mx-10" />

      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {RETREATS.map((retreat) => (
            <div key={retreat.id} id={retreat.id} className="surface-card scroll-mt-24 space-y-5 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="label-caps text-[11px] text-[color:var(--color-primary)]">{retreat.date}</span>
                <span className="text-xs text-[color:var(--color-outline)]">{retreat.groupSize}</span>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
                  {retreat.title}
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-outline)]">
                  {retreat.location} · {retreat.duration} · {retreat.format}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">
                {retreat.shortDescription}
              </p>

              <div className="hairline" />
              <div className="space-y-2 pt-4">
                <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Программа</div>
                <ul className="space-y-1.5 text-sm text-[color:var(--color-on-surface-variant)]">
                  {retreat.program.map((day) => (
                    <li key={day}>{day}</li>
                  ))}
                </ul>
              </div>

              <div className="hairline" />
              <div className="flex flex-wrap gap-2 pt-4">
                {retreat.highlights.map((h) => (
                  <span
                    key={h}
                    className="label-caps rounded-full px-3 py-1 text-[10px] text-[color:var(--color-on-surface-variant)]"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="hairline" />
              <div className="flex items-center justify-between pt-4">
                <span className="label-caps text-base text-[color:var(--color-secondary)]">{retreat.price}</span>
                <Link href="/booking" className="btn-primary px-5 py-2.5 text-xs label-caps">
                  Забронировать место
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
