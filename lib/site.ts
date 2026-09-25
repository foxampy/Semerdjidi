/**
 * Единый источник имени, контактов и навигации. Все страницы и метаданные
 * читают эти значения отсюда, а не дублируют их — иначе телефон в шапке и
 * телефон в JSON-LD расходятся при первой же правке.
 */
export const site = {
  name: 'Семерджиди',
  nameEn: 'Semerdjidi',
  short: 'Semerdjidi',
  subtitle: 'Психологический центр',
  tagline: 'Пространство психологической глубины и научной точности.',
  description:
    'Семерджиди — психологический центр в Ташкенте: индивидуальная психоаналитическая терапия, групповые программы, ретриты, супервизии и корпоративное благополучие. Подбор специалиста и программы под вашу задачу.',
  url: 'https://semerdjidi.web.app',
  locale: 'ru_RU',
  contacts: {
    address: 'Ташкент, ул. Садыка Азимова, 68',
    phone: '+998 71 200-11-22',
    phoneHref: 'tel:+998712001122',
    email: 'welcome@semerdjidi.uz',
    workingHours: 'Пн–Вс: 09:00 — 21:00',
    telegram: '@semerdjidi_center',
    telegramUrl: 'https://t.me/semerdjidi_center',
    instagram: '@semerdjidi.psychology',
    instagramUrl: 'https://instagram.com/semerdjidi.psychology',
  },
  founder: {
    name: 'Екатерина Семерджиди',
    role: 'Основатель, психоаналитик',
  },
} as const;

export const nav = [
  { label: 'Программы', href: '/programs' },
  { label: 'Специалисты', href: '/specialists' },
  { label: 'Ретриты', href: '/retreats' },
  { label: 'Журнал', href: '/journal' },
  { label: 'Тест среды', href: '/test' },
  { label: 'Компаниям', href: '/healthy-company' },
  { label: 'Партнёры', href: '/partners' },
] as const;

export const footerLinks = [
  { label: 'О центре', href: '/about' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'Исследования', href: '/journal' },
  { label: 'Whitepaper и архитектура', href: '/whitepaper' },
] as const;

/**
 * Партнёры первой волны — только подтверждённые пользователем связи.
 * AMAImedia — партнёр по направлению ИИ/BLM-исследований, отсюда растёт
 * продукт персонализированной языковой модели с модулями «пара / семья /
 * команда / компания / питомцы» (см. programs: prog-personal-ai-model).
 */
export const partners = [
  {
    id: 'uic',
    name: 'United Innovation Capital',
    short: 'UIC',
    role: 'Исследования, архитектура решений и капитал',
    url: 'https://uic-central.web.app',
  },
  {
    id: 'realting',
    name: 'Realting.uz',
    short: 'Realting.uz',
    role: 'Недвижимость и аналитика рынка Узбекистана',
    url: 'https://realting.uz',
  },
  {
    id: 'unicap',
    name: 'UNICAP Invest',
    short: 'UNICAPinvest.org',
    role: 'Инвестиционная и финансовая экспертиза',
    url: 'https://unicapinvest.org',
  },
  {
    id: 'amaimedia',
    name: 'AMAImedia',
    short: 'AMAImedia',
    role: 'Центр исследований и разработок ИИ и BLM — партнёр по персонализированным языковым моделям',
    url: 'https://huggingface.co/AMAImedia',
  },
] as const;
