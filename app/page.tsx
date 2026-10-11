import Image from 'next/image';
import Link from 'next/link';
import { PROGRAMS } from '@/content/programs';
import { SPECIALISTS } from '@/content/specialists';
import { RETREATS } from '@/content/retreats';
import { DIRECTION_MODULES } from '@/content/directions';
import { RESEARCH_PAPERS } from '@/content/journal';
import { partners, site } from '@/lib/site';

// Позиции узлов «Метода» вдоль спирали (координаты в системе viewBox 0 0 600 600).
// dx/dy — смещение подписи относительно узла, чтобы не перекрывать кривую.
const METHOD_STEPS = [
  { label: 'Человек', x: 300, y: 220, dx: 0, dy: -40 },
  { label: 'Отношения', x: 410, y: 250, dx: 55, dy: -18 },
  { label: 'Команда', x: 460, y: 360, dx: 68, dy: 4 },
  { label: 'Руководитель', x: 380, y: 470, dx: 20, dy: 42 },
  { label: 'Организация', x: 230, y: 460, dx: -25, dy: 42 },
  { label: 'Среда', x: 120, y: 340, dx: -62, dy: -6 },
] as const;

export default function HomePage() {
  const featuredPrograms = PROGRAMS.filter((p) => p.id !== 'prog-personal-ai-model').slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <span className="label-caps inline-block rounded-full bg-[color:var(--color-surface-container)]/70 px-3 py-1 text-[11px] text-[color:var(--color-outline)]">
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

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 rounded-[var(--radius-xl)] bg-[color:var(--color-primary-container)]/10 blur-3xl" />
            <div className="surface-card relative overflow-hidden p-3">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]">
                <Image
                  src="/brand/ekaterina-semerdjidi.jpg"
                  alt="Екатерина Семерджиди, основатель центра"
                  fill
                  sizes="(min-width: 1024px) 360px, 80vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                    Екатерина Семерджиди
                  </div>
                  <div className="label-caps text-[10px] text-[color:var(--color-outline)]">
                    Основатель центра, психоаналитик, супервизор
                  </div>
                </div>
                <p className="text-sm text-[color:var(--color-on-surface-variant)]">
                  Лично ведёт супервизии и разрабатывает программы центра — от индивидуальной терапии до
                  корпоративного благополучия.
                </p>
                <Link
                  href="/specialists#ekaterina-semerdjidi"
                  className="btn-primary inline-block px-5 py-2.5 text-xs label-caps"
                >
                  Супервизия и разработка программ
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="hairline mx-auto max-w-4xl" />
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

        <div className="relative mx-auto aspect-square w-full max-w-2xl py-6 md:max-w-3xl">
          <svg
            viewBox="0 0 600 600"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              d="M300 220 C360 200 380 220 410 250 S460 320 460 360 S410 430 380 470 S300 480 230 460 S150 400 120 340"
              fill="none"
              stroke="var(--color-primary-container)"
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              className="method-spiral-path"
            />
            <path
              d="M120 340 Q150 250 260 230"
              fill="none"
              stroke="var(--color-outline)"
              strokeWidth={1.5}
              strokeLinecap="round"
              pathLength={1}
              className="method-spiral-return"
            />
            {METHOD_STEPS.map((step, idx) => (
              <g key={step.label}>
                <circle
                  cx={step.x}
                  cy={step.y}
                  r={16}
                  fill="var(--color-tertiary)"
                  className="method-spiral-halo"
                  style={{ animationDelay: `${idx * 0.4}s` }}
                />
                <circle
                  cx={step.x}
                  cy={step.y}
                  r={7}
                  fill="var(--color-primary)"
                  className="method-spiral-node"
                  style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
                />
              </g>
            ))}
          </svg>

          {METHOD_STEPS.map((step, idx) => (
            <div
              key={step.label}
              className="surface-card absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap px-3 py-1.5"
              style={{
                left: `${((step.x + step.dx) / 600) * 100}%`,
                top: `${((step.y + step.dy) / 600) * 100}%`,
              }}
            >
              <span className="label-caps text-[10px] text-[color:var(--color-primary)]">0{idx + 1}</span>
              <span className="font-[family-name:var(--font-display)] text-sm text-[color:var(--color-on-background)]">
                {step.label}
              </span>
            </div>
          ))}

          <style>{`
            @keyframes methodSpiralDraw {
              from { stroke-dashoffset: 1; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes methodSpiralReturn {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: -0.08; }
            }
            @keyframes methodSpiralNode {
              from { opacity: 0; transform: scale(0.4); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes methodSpiralHalo {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 0.12; }
            }
            .method-spiral-path {
              stroke-dasharray: 1;
              stroke-dashoffset: 1;
              animation: methodSpiralDraw 2.6s ease-out forwards;
            }
            .method-spiral-return {
              stroke-dasharray: 0.08 0.06;
              opacity: 0.6;
              animation: methodSpiralReturn 6s linear infinite;
            }
            .method-spiral-node {
              transform-box: fill-box;
              transform-origin: center;
              opacity: 0;
              animation: methodSpiralNode 0.5s ease-out forwards;
            }
            .method-spiral-halo {
              transform-box: fill-box;
              transform-origin: center;
              opacity: 0.5;
              animation: methodSpiralHalo 4s ease-in-out infinite;
            }
          `}</style>
        </div>
      </section>

      {/* Directions network map */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="mb-10 max-w-2xl space-y-3">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Карта направлений</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
            Четыре модуля вокруг одного центра
          </h2>
          <p className="text-[color:var(--color-on-surface-variant)]">
            Это не список услуг, а карта охвата практики — от клинической работы с человеком до исследовательской
            работы с организацией. Каждый узел собран вокруг специалиста-якоря.
          </p>
        </div>

        <div className="relative">
          {/* Core node */}
          <div className="surface-card glow-moss mx-auto mb-6 flex max-w-xs flex-col items-center gap-1 p-6 text-center">
            <span className="label-caps text-[10px] text-[color:var(--color-outline)]">Центр</span>
            <span className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
              {site.name}
            </span>
          </div>
          <div className="hairline mx-auto mb-6 max-w-4xl" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTION_MODULES.map((module) => (
              <div key={module.id} className="surface-card flex flex-col gap-3 p-6">
                <div>
                  <span className="label-caps text-[10px] text-[color:var(--color-primary)]">{module.tagline}</span>
                  <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                    {module.title}
                  </h3>
                </div>
                <p className="text-sm text-[color:var(--color-on-surface-variant)]">{module.description}</p>
                <div className="mt-auto">
                  <div className="hairline mb-3" />
                  <ul className="space-y-1.5 text-xs text-[color:var(--color-on-surface-variant)]">
                    {module.directions.map((direction) => (
                      <li key={direction} className="flex gap-2">
                        <span className="text-[color:var(--color-primary)]">—</span>
                        {direction}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs teaser */}
      <section className="bg-[color:var(--color-surface-container-lowest)]">
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
                <div>
                  <div className="hairline mb-4" />
                  <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                    <span>{program.duration}</span>
                    <span className="label-caps text-[color:var(--color-secondary)]">{program.price}</span>
                  </div>
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
      <section className="bg-[color:var(--color-surface-container-lowest)]">
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
                <div>
                  <div className="hairline mb-4" />
                  <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                    <span>{retreat.location}</span>
                    <span className="label-caps text-[color:var(--color-secondary)]">{retreat.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research / publications teaser */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl space-y-3">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Исследования</span>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)] md:text-4xl">
              Научная точность вместо домыслов
            </h2>
            <p className="text-[color:var(--color-on-surface-variant)]">
              Мы опираемся на опубликованные исследования — от ВОЗ и Gallup до региональных работ по Центральной Азии
              — и честно указываем источник каждой цифры.
            </p>
          </div>
          <Link href="/journal" className="btn-ghost px-5 py-2.5 text-xs label-caps">
            Все исследования
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {RESEARCH_PAPERS.slice(0, 3).map((paper) => (
            <a
              key={paper.id}
              href={paper.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card glow-moss flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                <span className="label-caps text-[color:var(--color-primary)]">{paper.year}</span>
                <span>{paper.collaboration}</span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                {paper.title}
              </h3>
              <p className="text-sm text-[color:var(--color-on-surface-variant)]">{paper.abstract}</p>
              <div className="mt-auto">
                <div className="hairline mb-4" />
                <span className="label-caps text-[10px] text-[color:var(--color-secondary)]">
                  Читать источник →
                </span>
              </div>
            </a>
          ))}
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
      <section className="bg-[color:var(--color-surface-container-lowest)]">
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

      {/* Manifesto */}
      <section className="mx-auto max-w-[1000px] px-5 py-20 text-center md:px-10 md:py-28">
        <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Манифест</span>
        <blockquote className="mt-6 font-[family-name:var(--font-display)] text-2xl leading-snug text-[color:var(--color-on-background)] md:text-4xl md:leading-snug">
          «Мы не измеряем настроение анкетами — мы погружаемся в реальные процессы, будь то психика одного человека
          или структура целой компании. Точность важнее удобства».
        </blockquote>
        <div className="mt-6 label-caps text-xs text-[color:var(--color-outline)]">
          Екатерина Семерджиди, основатель центра
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/booking" className="btn-primary px-6 py-3 text-sm label-caps">
            Оставить заявку
          </Link>
        </div>
      </section>
    </>
  );
}
