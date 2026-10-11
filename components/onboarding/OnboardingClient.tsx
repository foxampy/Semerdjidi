'use client';

import { useState } from 'react';
import Link from 'next/link';

type Path = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const PATHS: Path[] = [
  {
    id: 'individual',
    title: 'Я иду один',
    description: 'Индивидуальная терапия, комплексный трек на 1–12 месяцев или разовая консультация.',
    ctaLabel: 'Пройти тест личной среды',
    ctaHref: '/test',
  },
  {
    id: 'collective',
    title: 'Мы — пара, семья или команда',
    description: 'Модули для пары, семьи, команды или компании — совместная работа с системой отношений.',
    ctaLabel: 'Смотреть модули расширения',
    ctaHref: '/programs#category-Группы',
  },
  {
    id: 'corporate',
    title: 'Я представляю компанию',
    description: 'Аудит психологического климата, сопровождение руководителей, корпоративные ретриты.',
    ctaLabel: 'Смотреть корпоративные программы',
    ctaHref: '/programs#category-Корпоративным',
  },
];

const STEPS = ['Знакомство', 'Метод', 'Ваш путь'] as const;

export function OnboardingClient() {
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`label-caps flex h-7 w-7 items-center justify-center rounded-full text-[11px] ${
                idx <= step
                  ? 'bg-[color:var(--color-primary-container)]/20 text-[color:var(--color-primary)]'
                  : 'text-[color:var(--color-outline)]'
              }`}
            >
              {idx + 1}
            </span>
            {idx < STEPS.length - 1 && <span className="h-px w-8 bg-[color:var(--color-outline-variant)]" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="surface-card space-y-4 p-8 text-center">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Шаг 1 — Знакомство</span>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
            Семерджиди — психологический центр в Ташкенте
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">
            Мы соединяем психоаналитическую глубину с научной точностью: индивидуальная терапия, группы,
            образование, ретриты и корпоративное благополучие — всё под одной методологией.
          </p>
          <button type="button" onClick={() => setStep(1)} className="btn-primary px-6 py-3 text-sm label-caps">
            Далее
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="surface-card space-y-6 p-8 text-center">
          <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Шаг 2 — Метод</span>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
            От личной устойчивости до здоровой организации
          </h2>
          <div className="grid grid-cols-3 gap-3 text-left">
            {['Человек', 'Отношения', 'Команда', 'Руководитель', 'Организация', 'Среда'].map((item, idx) => (
              <div key={item} className="rounded-[var(--radius-md)] bg-[color:var(--color-surface-container-lowest)] p-3">
                <div className="label-caps text-[10px] text-[color:var(--color-primary)]">0{idx + 1}</div>
                <div className="mt-1 text-sm text-[color:var(--color-on-background)]">{item}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={() => setStep(0)} className="btn-ghost px-6 py-3 text-sm label-caps">
              Назад
            </button>
            <button type="button" onClick={() => setStep(2)} className="btn-primary px-6 py-3 text-sm label-caps">
              Далее
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center">
            <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Шаг 3 — Ваш путь</span>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
              Что из этого сейчас про вас?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {PATHS.map((path) => (
              <div key={path.id} className="surface-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                    {path.title}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--color-on-surface-variant)]">{path.description}</p>
                </div>
                <Link href={path.ctaHref} className="btn-primary shrink-0 px-5 py-2.5 text-xs label-caps">
                  {path.ctaLabel}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button type="button" onClick={() => setStep(1)} className="btn-ghost px-6 py-3 text-sm label-caps">
              Назад
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
