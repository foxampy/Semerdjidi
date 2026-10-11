import type { Metadata } from 'next';
import Link from 'next/link';
import { JOURNAL_ARTICLES, RESEARCH_PAPERS } from '@/content/journal';
import { RecentDrafts } from '@/components/journal/RecentDrafts';

export const metadata: Metadata = {
  title: 'Журнал и исследования',
  description: 'Статьи, наблюдения и научные исследования центра Семерджиди — психология города, психоанализ, выгорание.',
};

export default function JournalPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Журнал</span>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.12] text-[color:var(--color-on-background)] md:text-5xl">
            Наблюдения, статьи и научная точность
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
            Тексты специалистов центра и исследования, которые мы проводим вместе с партнёрами — от городской
            психологии до скрытого выгорания в командах.
          </p>
        </div>
      </section>

      <div className="hairline" />

      {/* Articles */}
      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
          Статьи
        </h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {JOURNAL_ARTICLES.map((article) => (
            <article key={article.id} id={article.id} className="surface-card scroll-mt-24 flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                <span className="label-caps text-[color:var(--color-primary)]">{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                  {article.title}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--color-on-surface-variant)]">{article.subtitle}</p>
              </div>

              <blockquote className="pl-4 text-sm italic text-[color:var(--color-on-surface-variant)]">
                «{article.pullQuote}»
              </blockquote>

              <div className="hairline mb-4" />
              <div className="space-y-3 text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">
                {article.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="hairline mb-4" />
              <div className="mt-auto flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                <span>{article.author}</span>
                <span>{new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Research papers */}
      <section className="bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
            Исследования
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {RESEARCH_PAPERS.map((paper) => (
              <div key={paper.id} id={paper.id} className="surface-card scroll-mt-24 space-y-4 p-6 md:p-8">
                <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                  <span className="label-caps text-[color:var(--color-primary)]">{paper.year}</span>
                  <span>{paper.collaboration}</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                    {paper.title}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--color-on-surface-variant)]">{paper.subtitle}</p>
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">{paper.abstract}</p>
                <div className="hairline mb-4" />
                <ul className="space-y-2 text-sm text-[color:var(--color-on-surface-variant)]">
                  {paper.findings.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[color:var(--color-primary)]">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="hairline mb-4" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="label-caps rounded-full px-3 py-1 text-[10px] text-[color:var(--color-on-surface-variant)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={paper.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps shrink-0 text-[10px] text-[color:var(--color-secondary)] underline-offset-4 hover:underline"
                  >
                    Читать источник →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecentDrafts />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="surface-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-12">
          <div className="max-w-lg space-y-2">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Тест личной среды</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
              Проверьте собственный уровень фонового напряжения
            </h2>
          </div>
          <Link href="/test" className="btn-primary shrink-0 px-6 py-3 text-sm label-caps">
            Пройти тест
          </Link>
        </div>
      </section>
    </>
  );
}
