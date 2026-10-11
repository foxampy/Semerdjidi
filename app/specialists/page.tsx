import type { Metadata } from 'next';
import Link from 'next/link';
import { SPECIALISTS } from '@/content/specialists';
import { PROGRAMS } from '@/content/programs';

export const metadata: Metadata = {
  title: 'Специалисты',
  description: 'Команда центра Семерджиди: психоаналитики, супервизоры и соматические терапевты в Ташкенте.',
};

export default function SpecialistsPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Специалисты</span>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.12] text-[color:var(--color-on-background)] md:text-5xl">
            Команда, которой можно доверить глубину
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
            Каждый специалист центра работает в собственном направлении — от индивидуального психоанализа до
            соматических ретритов — и подбирается под ваш конкретный запрос.
          </p>
        </div>
      </section>

      <div className="hairline mx-5 md:mx-10" />

      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SPECIALISTS.map((specialist) => (
            <div key={specialist.id} id={specialist.id} className="surface-card scroll-mt-24 space-y-4 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary-container)]/20 font-[family-name:var(--font-display)] text-xl text-[color:var(--color-primary)]">
                  {specialist.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
                    {specialist.name}
                  </h2>
                  <div className="label-caps text-[11px] text-[color:var(--color-outline)]">{specialist.role}</div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">{specialist.bio}</p>

              <div className="hairline" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 text-xs">
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Специализация</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.specialization}</div>
                </div>
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Статус</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.professionalStatus}</div>
                </div>
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Опыт</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.experience}</div>
                </div>
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Языки</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.languages.join(', ')}</div>
                </div>
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Формат</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.formats.join(' / ')}</div>
                </div>
                <div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Образование</div>
                  <div className="mt-1 text-[color:var(--color-on-surface-variant)]">{specialist.education}</div>
                </div>
              </div>

              <div className="hairline" />
              <div className="flex flex-wrap gap-2 pt-4">
                {specialist.directions.map((d) => (
                  <span
                    key={d}
                    className="label-caps rounded-full px-3 py-1 text-[10px] text-[color:var(--color-on-surface-variant)]"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="hairline" />
              <div className="space-y-2 pt-4">
                <div className="label-caps text-[10px] text-[color:var(--color-outline)]">Программы</div>
                <div className="flex flex-col gap-1">
                  {specialist.programs.map((programId) => {
                    const program = PROGRAMS.find((p) => p.id === programId);
                    if (!program) return null;
                    return (
                      <Link
                        key={programId}
                        href={`/programs#${programId}`}
                        className="text-sm text-[color:var(--color-on-surface-variant)] hover:text-[color:var(--color-primary)]"
                      >
                        → {program.title}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link href="/booking" className="btn-primary block w-full py-2.5 text-center text-xs label-caps">
                Записаться к {specialist.name.split(' ')[0]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="surface-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-12">
            <div className="max-w-lg space-y-2">
              <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Не знаете, кто подойдёт</span>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
                Пройдите тест — мы порекомендуем специалиста
              </h2>
            </div>
            <Link href="/test" className="btn-primary shrink-0 px-6 py-3 text-sm label-caps">
              Пройти тест
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
