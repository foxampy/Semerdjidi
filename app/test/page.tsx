import type { Metadata } from 'next';
import { TestClient } from '@/components/test/TestClient';

export const metadata: Metadata = {
  title: 'Тест личной среды',
  description: '6 вопросов, 2 минуты — узнайте, где ваша личная среда теряет ресурс, и получите персональную рекомендацию.',
};

export default function TestPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="mb-10 text-center">
        <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Тест личной среды</span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-on-background)] md:text-5xl">
          Узнайте, где ваша личная среда теряет ресурс
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-[color:var(--color-on-surface-variant)]">
          6 вопросов, 2 минуты — и персональная рекомендация: консультация, программа или ретрит.
        </p>
      </div>

      <TestClient />
    </section>
  );
}
