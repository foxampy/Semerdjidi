import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Записаться',
  description: 'Заявка на консультацию, программу, ретрит или корпоративный аудит в центре Семерджиди.',
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="mb-10 text-center">
        <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Записаться</span>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[color:var(--color-on-background)] md:text-5xl">
          Оставьте заявку — мы свяжемся в течение дня
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-[color:var(--color-on-surface-variant)]">
          Или напишите напрямую в Telegram {site.contacts.telegram}, если так удобнее.
        </p>
      </div>

      <BookingForm />
    </section>
  );
}
