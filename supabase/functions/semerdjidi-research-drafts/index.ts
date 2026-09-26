/**
 * Semerdjidi — research & news draft generator.
 *
 * Runs on a schedule (see supabase/migrations for the pg_cron job) and, on
 * each call, asks Gemini — grounded in live Google Search — to find ONE real,
 * verifiable piece of psychology/psychoanalysis or organizational R&D /
 * business-analytics research or news relevant to the center's audience, then
 * writes it into `semerdjidi_content_drafts` as `pending_review`.
 *
 * This function never publishes anything by itself. A human always reviews a
 * draft (checks the source is real and the summary is accurate) before
 * flipping its status to `published` — see docs/superpowers/specs for the
 * review workflow. There is no social-media or partner auto-posting here:
 * `social_caption` is a ready-to-copy draft for a human to post manually.
 *
 * Secrets (set in Supabase → Edge Functions → Secrets):
 *   GEMINI_API_KEY — from https://aistudio.google.com/apikey
 *
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided automatically by the
 * Edge Function runtime — no need to set them manually.
 *
 * Auth: verify_jwt is enabled. The scheduled cron job authenticates with the
 * project's service_role key. There is no public/anon entry point.
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_RECENT_SOURCES = 30;

const DRAFT_KINDS = ['article', 'research', 'social_post'] as const;
type DraftKind = (typeof DRAFT_KINDS)[number];

interface GeneratedDraft {
  kind: DraftKind;
  title: string;
  subtitle: string;
  category: string;
  body: string;
  social_caption: string;
  source_url: string;
  source_citation: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDraft(value: unknown): value is GeneratedDraft {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.kind === 'string' &&
    (DRAFT_KINDS as readonly string[]).includes(v.kind) &&
    isNonEmptyString(v.title) &&
    isNonEmptyString(v.body) &&
    isNonEmptyString(v.source_url) &&
    /^https?:\/\//.test(v.source_url as string) &&
    isNonEmptyString(v.source_citation)
  );
}

/** Gemini sometimes wraps JSON in ```json fences despite instructions — strip them. */
function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw.trim());
}

async function fetchRecentSourceUrls(supabaseUrl: string, serviceRoleKey: string): Promise<string[]> {
  const url =
    `${supabaseUrl}/rest/v1/semerdjidi_content_drafts` +
    `?select=source_url&order=created_at.desc&limit=${MAX_RECENT_SOURCES}`;
  const res = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as { source_url: string | null }[];
  return rows.map((r) => r.source_url).filter((u): u is string => isNonEmptyString(u));
}

function buildPrompt(avoidUrls: string[], topicHint: string | undefined) {
  const avoidBlock =
    avoidUrls.length > 0
      ? `Уже освещённые источники (не повторяй их и не бери материалы из тех же самых статей):\n${avoidUrls
          .map((u) => `- ${u}`)
          .join('\n')}`
      : 'Список уже освещённых источников пуст — это первый запуск.';

  return `Ты — редактор-исследователь психологического центра «Семерджиди» в Ташкенте.
Центр сочетает клинический психоанализ, телесную терапию и профилактику выгорания с
R&D-услугами для бизнеса: глубинный аудит психологического климата компаний через
погружение в реальные процессы (а не анкетирование), executive-сопровождение
руководителей, супервизия и обучение специалистов.

Задача: найди ОДИН реальный, проверяемый источник — научную статью, метаанализ, отчёт
авторитетной организации (ВОЗ, Gallup, McKinsey, APA, рецензируемый журнал и т.п.) или
свежую профессиональную новость — который относится к одной из двух тем:
(a) психология, психоанализ, психотерапия, психическое здоровье;
(b) организационная психология, выгорание в компаниях, R&D и бизнес-аналитика,
    эффективность руководителей и команд.

${avoidBlock}

Используй инструмент поиска, чтобы убедиться, что источник реально существует и найти
его настоящий URL. НИКОГДА не выдумывай источник, статистику или URL — если не можешь
найти подходящий реальный источник, верни kind: "none".

Верни СТРОГО валидный JSON без markdown-обёртки, со следующими полями:
{
  "kind": "article" | "research" | "social_post" | "none",
  "title": "заголовок на русском, не кликбейтный",
  "subtitle": "подзаголовок в одно предложение",
  "category": "одно слово-категория на русском, напр. Выгорание / Психоанализ / R&D / Исследования",
  "body": "300-450 слов на русском — точное, но живое изложение находки, БЕЗ воды, с честной ссылкой на источник по тексту (название издания/авторов), без выдуманных цифр",
  "social_caption": "короткий текст до 260 символов на русском для соцсетей/Telegram — с сутью находки и явной пометкой источника, готовый к публикации человеком",
  "source_url": "настоящий рабочий URL источника",
  "source_citation": "издание и авторы, напр. \\"World Psychiatry · Leichsenring et al., 2023\\""
}

${topicHint ? `Дополнительное пожелание по теме от редакции: ${topicHint}` : ''}`;
}

async function callGemini(apiKey: string, prompt: string): Promise<GeneratedDraft | null> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      }),
    },
  );

  if (!res.ok) {
    console.error('gemini request failed', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('');
  if (!text) {
    console.error('gemini response had no text', JSON.stringify(data).slice(0, 500));
    return null;
  }

  let parsed: unknown;
  try {
    parsed = extractJson(text);
  } catch (err) {
    console.error('failed to parse gemini JSON', err, text.slice(0, 500));
    return null;
  }

  if (typeof parsed === 'object' && parsed !== null && (parsed as Record<string, unknown>).kind === 'none') {
    return null;
  }

  if (!isValidDraft(parsed)) {
    console.error('gemini draft failed validation', JSON.stringify(parsed).slice(0, 500));
    return null;
  }

  return parsed;
}

async function insertDraft(supabaseUrl: string, serviceRoleKey: string, draft: GeneratedDraft) {
  const res = await fetch(`${supabaseUrl}/rest/v1/semerdjidi_content_drafts`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      kind: draft.kind,
      title: draft.title,
      subtitle: draft.subtitle,
      category: draft.category,
      body: draft.body,
      social_caption: draft.social_caption,
      source_url: draft.source_url,
      source_citation: draft.source_citation,
      status: 'pending_review',
    }),
  });

  if (!res.ok) {
    throw new Error(`insert failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method-not-allowed' }), { status: 405 });
  }

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!geminiKey || !supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'not-configured' }), { status: 503 });
  }

  let topicHint: string | undefined;
  try {
    const body = await req.json();
    if (isNonEmptyString(body?.topic)) topicHint = body.topic.slice(0, 300);
  } catch {
    // no body / not JSON — fine, topicHint stays undefined
  }

  try {
    const avoidUrls = await fetchRecentSourceUrls(supabaseUrl, serviceRoleKey);
    const draft = await callGemini(geminiKey, buildPrompt(avoidUrls, topicHint));

    if (!draft) {
      return new Response(JSON.stringify({ ok: true, inserted: false, reason: 'no-suitable-source-found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const inserted = await insertDraft(supabaseUrl, serviceRoleKey, draft);
    return new Response(JSON.stringify({ ok: true, inserted: true, draft: inserted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('semerdjidi-research-drafts failed', err);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
});
