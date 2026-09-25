import type { Metadata } from 'next';
import { OnboardingClient } from '@/components/onboarding/OnboardingClient';

export const metadata: Metadata = {
  title: 'Начало пути',
  description: 'Короткое знакомство с центром Семерджиди и подбор пути: индивидуальная работа, пара/семья/команда или компания.',
};

export default function OnboardingPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <OnboardingClient />
    </section>
  );
}
