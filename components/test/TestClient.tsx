'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TEST_QUESTIONS } from '@/content/test';

type Recommendation = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

function getRecommendation(score: number, maxScore: number): Recommendation {
  const ratio = score / maxScore;

  if (ratio <= 0.45) {
    return {
      title: 'Разовая консультация',
      description:
        'Ваша личная среда в целом устойчива. Разовая консультация поможет прояснить конкретный вопрос, если он есть, и получить взгляд со стороны.',
      ctaLabel: 'Записаться на консультацию',
      ctaHref: '/booking',
    };
  }

  if (ratio <= 0.75) {
    return {
      title: 'Фокусная программа на 3 месяца',
      description:
        'Заметно накопленное фоновое напряжение в нескольких сферах. Трёхмесячный трек «Основание» даёт структуру для проработки конкретного запроса без затяжного обязательства.',
      ctaLabel: 'Смотреть трек «Основание»',
      ctaHref: '/programs#plan-3m-foundation',
    };
  }

  return {
    title: 'Ретрит и комплексная программа',
    description:
      'Уровень фонового напряжения высокий и охватывает почти все сферы. Стоит начать с выездного ретрита для паузы и затем перейти на комплексную программу от 6 месяцев.',
    ctaLabel: 'Смотреть ретриты',
    ctaHref: '/retreats',
  };
}

export function TestClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const maxScore = useMemo(() => TEST_QUESTIONS.length * 4, []);
  const totalQuestions = TEST_QUESTIONS.length;
  const isFinished = step >= totalQuestions;
  const currentQuestion = TEST_QUESTIONS[step];

  const totalScore = useMemo(
    () => Object.values(answers).reduce((sum, value) => sum + value, 0),
    [answers],
  );

  function handleAnswer(questionId: number, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setStep((prev) => prev + 1);
  }

  function handleRestart() {
    setAnswers({});
    setStep(0);
  }

  if (isFinished) {
    const recommendation = getRecommendation(totalScore, maxScore);

    return (
      <div className="surface-card mx-auto max-w-xl space-y-6 p-8 text-center">
        <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Результат</span>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-on-background)]">
          {recommendation.title}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">
          {recommendation.description}
        </p>
        <div className="text-xs text-[color:var(--color-outline)]">
          Ваш балл: {totalScore} из {maxScore}
        </div>
        <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
          <Link href={recommendation.ctaHref} className="btn-primary px-6 py-3 text-sm label-caps">
            {recommendation.ctaLabel}
          </Link>
          <button type="button" onClick={handleRestart} className="btn-ghost px-6 py-3 text-sm label-caps">
            Пройти заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card mx-auto max-w-xl space-y-6 p-8">
      <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
        <span className="label-caps text-[color:var(--color-primary)]">{currentQuestion.domain}</span>
        <span>
          Вопрос {step + 1} из {totalQuestions}
        </span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-container-high)]">
        <div
          className="h-full bg-[color:var(--color-primary-container)] transition-all duration-300"
          style={{ width: `${(step / totalQuestions) * 100}%` }}
        />
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-[color:var(--color-on-background)]">
        {currentQuestion.text}
      </h2>

      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleAnswer(currentQuestion.id, option.score)}
            className="btn-ghost w-full py-3 text-left text-sm"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
