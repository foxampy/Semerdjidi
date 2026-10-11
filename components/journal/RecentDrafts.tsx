'use client';

/**
 * «Свежее» — лента опубликованных черновиков из автоматизации
 * `semerdjidi-research-drafts` (см. supabase/functions/semerdjidi-research-drafts
 * и docs/superpowers/specs/2026-09-25-semerdjidi-platform-design.md §5b).
 *
 * Читает `semerdjidi_content_drafts` напрямую через PostgREST сырым `fetch`
 * (без @supabase/supabase-js — тот же паттерн, что и в CommentSection.tsx
 * проекта EvenEsh), только строки со status=published. RLS на таблице
 * разрешает анонимное чтение исключительно опубликованных строк, так что
 * анон-ключ ничего лишнего не откроет.
 */

import { useEffect, useState } from 'react';
import type { PublishedContentDraft } from '@/types';

const KIND_LABEL: Record<PublishedContentDraft['kind'], string> = {
  article: 'Статья',
  research: 'Исследование',
  social_post: 'Заметка',
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function RecentDrafts() {
  const [drafts, setDrafts] = useState<PublishedContentDraft[] | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  useEffect(() => {
    if (!supabaseUrl || !anonKey) {
      setDrafts([]);
      return;
    }
    const url =
      `${supabaseUrl}/rest/v1/semerdjidi_content_drafts` +
      `?select=id,kind,title,subtitle,category,body,source_url,source_citation,created_at` +
      `&status=eq.published&order=created_at.desc&limit=6`;
    fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => setDrafts(Array.isArray(rows) ? rows : []))
      .catch(() => setDrafts([]));
  }, [supabaseUrl, anonKey]);

  // Пока не пришли данные (или их нет) — секция тихо ничего не показывает,
  // без "загрузки" и без пустого блока на статическом сайте.
  if (!drafts || drafts.length === 0) return null;

  return (
    <>
      <div className="hairline" />
      <section className="bg-[color:var(--color-surface-container-lowest)]">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="label-caps text-[11px] text-[color:var(--color-outline)]">Свежее</span>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-on-background)] md:text-3xl">
                Из ленты исследований центра
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[color:var(--color-on-surface-variant)]">
              Находки из мира психологии, психоанализа и организационной аналитики — проверены редакцией перед публикацией.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <article key={draft.id} className="surface-card flex flex-col gap-3 p-6">
                <div className="flex items-center justify-between text-xs text-[color:var(--color-outline)]">
                  <span className="label-caps text-[color:var(--color-primary)]">
                    {draft.category ?? KIND_LABEL[draft.kind]}
                  </span>
                  <span>{formatWhen(draft.created_at)}</span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[color:var(--color-on-background)]">
                    {draft.title}
                  </h3>
                  {draft.subtitle && (
                    <p className="mt-1 text-sm text-[color:var(--color-on-surface-variant)]">{draft.subtitle}</p>
                  )}
                </div>
                <p className="line-clamp-4 text-sm leading-relaxed text-[color:var(--color-on-surface-variant)]">
                  {draft.body}
                </p>
                {draft.source_url && (
                  <a
                    href={draft.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-caps mt-auto pt-2 text-[10px] text-[color:var(--color-secondary)] underline-offset-4 hover:underline"
                  >
                    {draft.source_citation ?? 'Читать источник'} →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
