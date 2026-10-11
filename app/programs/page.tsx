import type { Metadata } from 'next';
import Link from 'next/link';
import { COLLECTIVE_MODULES, FULL_PROGRAM_PLANS, PROGRAMS } from '@/content/programs';
import type { ProgramCategory } from '@/types';

export const metadata: Metadata = {
  title: 'Программы',
  description:
    'Индивидуальные и групповые программы, образовательные треки, супервизии, корпоративные аудиты и комплексные программы на 1–12+ месяцев.',
};

const CATEGORY_ORDER: ProgramCategory[] = [
  'Личное развитие',
  'Группы',
  'Ретриты',
  'Образование',
  'Супервизии',
  'Корпоративным',
  'Профессионалам',
];

export default function ProgramsPage() {
  const categories = CATEGORY_ORDER.filter((category) => PROGRAMS.some((p) => p.category === category));

  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Программы</span>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.12] text-[color:var(--color-on-background)] md:text-5xl">
            От одной сессии до годовой трансформации
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
            Индивидуальная терапия, группы, образование, супервизии и корпоративные форматы — каждая программа
            собирается вокруг конкретного запроса, а не абстрактного курса.
          </p>
        </div>
      </section>

      <div className="hairline" />

      {/* Program cards by category */}
      {categories.map((category) => (
        <section key={category} id={`category-${category}`} className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
          <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
            {category}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.filter((p) => p.category === category).map((program) => (
              <div key={program.id} id={program.id} className="surface-card scroll-mt-24 space-y-4 p-6">
                <div className="space-y-2">
                  <span className="label-caps text-[10px] text-[color:var(--color-primary)]">{program.format}</span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                    {program.title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-on-surface-variant)]">{program.fullDescription}</p>
                </div>

                {program.modules && (
                  <>
                    <div className="hairline mb-3" />
                    <ul className="space-y-1 text-sm text-[color:var(--color-on-surface-variant)]">
                      {program.modules.map((m) => (
                        <li key={m} className="flex gap-2">
                          <span className="text-[color:var(--color-primary)]">—</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="hairline mb-4" />
                <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                  <span>{program.duration}</span>
                  <span className="label-caps text-[color:var(--color-secondary)]">{program.price}</span>
                </div>
                <div className="text-xs text-[color:var(--color-outline)]">
                  Ведёт: <span className="text-[color:var(--color-on-surface-variant)]">{program.specialistName}</span>
                  {program.specialistRole ? ` · ${program.specialistRole}` : ''}
                </div>
                {program.audience && (
                  <div className="text-xs text-[color:var(--color-outline)]">Кому подойдёт: {program.audience}</div>
                )}
                <Link href="/booking" className="btn-primary block w-full py-2.5 text-center text-xs label-caps">
                  Записаться
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Full program plans (1-12+ months) */}
      <section className="bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="mb-10 max-w-2xl space-y-3">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Комплексные треки</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
              Программы на 1, 3, 6, 9 и 12+ месяцев
            </h2>
            <p className="text-[color:var(--color-on-surface-variant)]">
              Каждый трек — заранее собранный комплекс индивидуальных сессий, групп, супервизий, ретритов и
              лекций. Состав и стоимость фиксированы на весь срок.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {FULL_PROGRAM_PLANS.map((plan) => (
              <div key={plan.id} className="surface-card flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="label-caps text-[11px] text-[color:var(--color-primary)]">
                    {plan.durationMonths} {plan.durationMonths === 1 ? 'месяц' : 'месяцев'}
                  </span>
                  <span className="label-caps text-[10px] text-[color:var(--color-outline)]">{plan.subtitle}</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--color-on-surface-variant)]">{plan.focus}</p>
                </div>

                <div className="hairline mb-4" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[color:var(--color-on-surface-variant)]">
                  <div>{plan.individualSessionsCount} инд. сессий</div>
                  <div>{plan.groupSessionsCount} групповых</div>
                  <div>{plan.retreatsCount} ретрит(ов)</div>
                  <div>{plan.supervisionsCount} супервизий</div>
                  <div>{plan.lecturesAndSeminarsCount} лекций/семинаров</div>
                </div>

                <div className="hairline mb-4" />
                <div className="space-y-2">
                  {plan.phases.map((phase) => (
                    <div key={phase.month} className="text-xs">
                      <span className="label-caps text-[color:var(--color-secondary)]">{phase.month}</span>
                      <span className="text-[color:var(--color-on-surface-variant)]"> — {phase.theme}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-1 text-xs text-[color:var(--color-on-surface-variant)]">
                  {plan.appFeatures.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[color:var(--color-primary)]">—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="hairline mb-4" />
                <div className="mt-auto flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                  <span>{plan.idealFor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="label-caps text-[color:var(--color-secondary)]">{plan.priceTotal}</span>
                  <span className="text-xs text-[color:var(--color-outline)]">{plan.pricePerMonth} / мес</span>
                </div>
                <Link href="/booking" className="btn-primary block w-full py-2.5 text-center text-xs label-caps">
                  Выбрать трек
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collective modules */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="mb-10 max-w-2xl space-y-3">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Модули расширения</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
            Пара, семья, команда, компания, корпорация, питомцы
          </h2>
          <p className="text-[color:var(--color-on-surface-variant)]">
            Любая индивидуальная или комплексная программа может быть расширена модулем для тех, кто рядом с
            клиентом — партнёра, семьи, команды или организации.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIVE_MODULES.map((module) => (
            <div key={module.id} className="surface-card space-y-3 p-6">
              <div className="flex items-center justify-between">
                <span className="label-caps text-[10px] text-[color:var(--color-primary)]">{module.badge}</span>
                <span className="text-xs text-[color:var(--color-outline)]">{module.duration}</span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                {module.title}
              </h3>
              <p className="text-sm text-[color:var(--color-on-surface-variant)]">{module.subtitle}</p>
              <p className="text-xs text-[color:var(--color-outline)]">{module.targetAudience}</p>
              <div className="hairline mb-3" />
              <ul className="space-y-1 text-xs text-[color:var(--color-on-surface-variant)]">
                {module.results.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-[color:var(--color-primary)]">—</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="surface-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-12">
            <div className="max-w-lg space-y-2">
              <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Не знаете, с чего начать</span>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
                Пройдите тест личной среды — получите рекомендацию
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
