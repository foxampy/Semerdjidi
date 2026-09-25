'use client';

import { useState } from 'react';
import type { BookingFormData } from '@/types';

const INTEREST_OPTIONS: BookingFormData['interest'][] = [
  'Консультация',
  'Группа',
  'Обучение',
  'Супервизия',
  'Ретрит',
  'Корпоративная программа',
  'Другое',
];

const FORMAT_OPTIONS: BookingFormData['format'][] = ['Очно', 'Онлайн', 'Не знаю'];

const initialForm: BookingFormData = {
  interest: 'Консультация',
  format: 'Не знаю',
  name: '',
  phone: '',
  email: '',
  comment: '',
};

export function BookingForm() {
  const [form, setForm] = useState<BookingFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof BookingFormData>(key: K, value: BookingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Укажите имя и телефон — это обязательные поля.');
      return;
    }

    setError(null);
    // TODO: подключить отправку в Supabase (таблица заявок) — см. следующий этап интеграции бэкенда.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="surface-card mx-auto max-w-xl space-y-3 p-8 text-center">
        <span className="label-caps text-[11px] text-[color:var(--color-primary)]">Заявка отправлена</span>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)]">
          Спасибо, {form.name}
        </h2>
        <p className="text-sm text-[color:var(--color-on-surface-variant)]">
          Мы свяжемся с вами по телефону {form.phone} в ближайшее рабочее время, чтобы подтвердить запись.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-xl space-y-5 p-8">
      <div>
        <label className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">Интересует</label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update('interest', option)}
              className={`label-caps rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                form.interest === option
                  ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary-container)]/20 text-[color:var(--color-primary)]'
                  : 'border-[color:var(--color-outline-variant)] text-[color:var(--color-on-surface-variant)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">Формат</label>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => update('format', option)}
              className={`label-caps rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
                form.format === option
                  ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary-container)]/20 text-[color:var(--color-primary)]'
                  : 'border-[color:var(--color-outline-variant)] text-[color:var(--color-on-surface-variant)]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">
            Имя *
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container)] px-4 py-2.5 text-sm text-[color:var(--color-on-background)] outline-none focus:border-[color:var(--color-primary)]"
          />
        </div>
        <div>
          <label htmlFor="phone" className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+998 __ ___-__-__"
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container)] px-4 py-2.5 text-sm text-[color:var(--color-on-background)] outline-none focus:border-[color:var(--color-primary)]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container)] px-4 py-2.5 text-sm text-[color:var(--color-on-background)] outline-none focus:border-[color:var(--color-primary)]"
        />
      </div>

      <div>
        <label htmlFor="comment" className="label-caps mb-2 block text-[10px] text-[color:var(--color-outline)]">
          Комментарий
        </label>
        <textarea
          id="comment"
          rows={3}
          value={form.comment}
          onChange={(e) => update('comment', e.target.value)}
          className="w-full resize-none rounded-[var(--radius-md)] border border-[color:var(--color-outline-variant)] bg-[color:var(--color-surface-container)] px-4 py-2.5 text-sm text-[color:var(--color-on-background)] outline-none focus:border-[color:var(--color-primary)]"
        />
      </div>

      {error && <p className="text-sm text-[color:var(--color-error)]">{error}</p>}

      <button type="submit" className="btn-primary w-full py-3 text-sm label-caps">
        Отправить заявку
      </button>
    </form>
  );
}
