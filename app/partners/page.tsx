import type { Metadata } from 'next';
import Link from 'next/link';
import { partners } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Партнёры',
  description: 'Экосистема центра Семерджиди: United Innovation Capital, Realting.uz, UNICAP Invest и AMAImedia.',
};

export default function PartnersPage() {
  return (
    <>
      <section className="border-b border-[color:var(--color-outline-variant)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Партнёры</span>
          <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.12] text-[color:var(--color-on-background)] md:text-5xl">
            Экосистема, которая нас поддерживает
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--color-on-surface-variant)] md:text-lg">
            Центр Семерджиди работает не в изоляции: исследования, капитал, аналитика рынка и разработки в области
            ИИ приходят от партнёров, с которыми выстроены прямые рабочие связи.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card glow-moss flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1 md:p-8"
            >
              <span className="label-caps text-[11px] text-[color:var(--color-primary)]">{partner.short}</span>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-on-background)]">
                {partner.name}
              </h2>
              <p className="text-sm text-[color:var(--color-on-surface-variant)]">{partner.role}</p>
              <span className="mt-auto pt-2 text-xs text-[color:var(--color-outline)]">{partner.url.replace('https://', '')} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="max-w-2xl space-y-3">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Совместный продукт</span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
              AMAImedia и персонализированная языковая модель
            </h2>
            <p className="text-[color:var(--color-on-surface-variant)]">
              Совместно с исследовательским центром AMAImedia (ИИ и BLM) центр Семерджиди развивает продукт
              персонализированной языковой модели — инструмент сопровождения между сессиями с расширениями для
              пары, семьи, команды, компании и владельцев питомцев.
            </p>
            <Link href="/programs#prog-personal-ai-model" className="btn-ghost inline-block px-5 py-2.5 text-xs label-caps">
              Смотреть продукт
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
