import Image from 'next/image';
import Link from 'next/link';
import { PROGRAMS } from '@/content/programs';
import { SPECIALISTS } from '@/content/specialists';
import { RETREATS } from '@/content/retreats';
import { partners, site } from '@/lib/site';

export default function HomePage() {
  const featuredPrograms = PROGRAMS.filter((p) => p.id !== 'prog-personal-ai-model').slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--color-outline-variant)]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <span className="label-caps inline-block rounded-full border border-[color:var(--color-outline-variant)] px-3 py-1 text-[11px] text-[color:var(--color-outline)]">
              Психологический центр · Ташкент
            </span>
            <h1 className="max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-[color:var(--color-on-background)] sm:text-5xl md:text-[56px] md:leading-[1.14]">
              Пространство психологической глубины и научной точности
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
              {site.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/test" className="btn-primary px-6 py-3 text-sm label-caps">
                Пройти тест личной среды
              </Link>
              <Link href="/programs" className="btn-ghost px-6 py-3 text-sm label-caps">
                Смотреть программы
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-full bg-[color:var(--color-primary-container)]/10 blur-3xl" />
            <div className="surface-card relative flex h-full w-full items-center justify-center p-10">
              <Image
                src="/brand/logo-main.png"
                alt={site.name}
                width={280}
                height={280}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Approach / systemic chain teaser */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="mb-10 max-w-2xl space-y-3">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Метод</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
            От личной устойчивости до здоровой организации
          </h2>
          <p className="text-[color:var(--color-on-surface-variant)]">
            Мы работаем на всех уровнях — от индивидуальной терапии до системного здоровья компаний — потому что
            личное состояние человека и жизнеспособность организации связаны напрямую.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {['Человек', 'Отношения', 'Команда', 'Руководитель', 'Организация', 'Среда'].map((step, idx) => (
            <div key={step} className="surface-card p-4">
              <div className="label-caps text-[11px] text-[color:var(--color-primary)]">0{idx + 1}</div>
              <div className="mt-2 font-[family-name:var(--font-display)] text-base text-[color:var(--color-on-background)]">
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs teaser */}
      <section className="border-y border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl space-y-3">
              <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Программы</span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
                От одной сессии до годовой трансформации
              </h2>
            </div>
            <Link href="/programs" className="btn-ghost px-5 py-2.5 text-xs label-caps">
              Все программы
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredPrograms.map((program) => (
              <Link
                key={program.id}
                href={`/programs#${program.id}`}
                className="surface-card glow-moss flex flex-col justify-between gap-4 p-6 transition-transform hover:-translate-y-1"
              >
                <div className="space-y-2">
                  <span className="label-caps text-[10px] text-[color:var(--color-primary)]">{program.category}</span>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                    {program.title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-on-surface-variant)]">{program.shortDescription}</p>
                </div>
                <div className="flex items-center justify-between border-t border-[color:var(--color-outline-variant)] pt-4 text-xs text-[color:var(--color-outline)]">
                  <span>{program.duration}</span>
                  <span className="label-caps text-[color:var(--color-secondary)]">{program.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists teaser */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl space-y-3">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Специалисты</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
              Команда, которой можно доверить глубину
            </h2>
          </div>
          <Link href="/specialists" className="btn-ghost px-5 py-2.5 text-xs label-caps">
            Все специалисты
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALISTS.map((specialist) => (
            <div key={specialist.id} className="surface-card p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-primary-container)]/20 font-[family-name:var(--font-display)] text-lg text-[color:var(--color-primary)]">
                {specialist.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                  {specialist.name}
                </div>
                <div className="label-caps text-[10px] text-[color:var(--color-outline)]">{specialist.role}</div>
              </div>
              <p className="text-sm text-[color:var(--color-on-surface-variant)]">{specialist.specialization}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Retreats teaser */}
      <section className="border-y border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl space-y-3">
              <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Ретриты</span>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
                Выездные пространства для восстановления
              </h2>
            </div>
            <Link href="/retreats" className="btn-ghost px-5 py-2.5 text-xs label-caps">
              Все ретриты
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {RETREATS.map((retreat) => (
              <div key={retreat.id} className="surface-card p-6 space-y-3">
                <span className="label-caps text-[10px] text-[color:var(--color-primary)]">{retreat.date}</span>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                  {retreat.title}
                </h3>
                <p className="text-sm text-[color:var(--color-on-surface-variant)]">{retreat.shortDescription}</p>
                <div className="flex items-center justify-between border-t border-[color:var(--color-outline-variant)] pt-4 text-xs text-[color:var(--color-outline)]">
                  <span>{retreat.location}</span>
                  <span className="label-caps text-[color:var(--color-secondary)]">{retreat.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test CTA banner */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="surface-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-12">
          <div className="max-w-lg space-y-2">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Тест личной среды</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
              Узнайте, где ваша личная среда теряет ресурс
            </h2>
            <p className="text-sm text-[color:var(--color-on-surface-variant)]">
              6 вопросов, 2 минуты — и персональная рекомендация: консультация, группа или ретрит.
            </p>
          </div>
          <Link href="/test" className="btn-primary shrink-0 px-6 py-3 text-sm label-caps">
            Пройти тест
          </Link>
        </div>
      </section>

      {/* Partners strip */}
      <section className="border-t border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
          <div className="mb-8 space-y-2">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Партнёры</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
              Экосистема, которая нас поддерживает
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card glow-moss flex flex-col gap-2 p-5 transition-transform hover:-translate-y-1"
              >
                <span className="label-caps text-[11px] text-[color:var(--color-primary)]">{partner.short}</span>
                <span className="text-sm text-[color:var(--color-on-surface-variant)]">{partner.role}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
