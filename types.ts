export type ProgramCategory =
  | 'Личное развитие'
  | 'Профессионалам'
  | 'Группы'
  | 'Ретриты'
  | 'Супервизии'
  | 'Образование'
  | 'Корпоративным';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  shortDescription: string;
  fullDescription: string;
  format: 'Очно' | 'Онлайн' | 'Очно и онлайн';
  duration: string;
  hours?: number;
  price: string;
  specialistName: string;
  specialistRole?: string;
  certificate?: boolean;
  audience?: string;
  modules?: string[];
}

/** Комплексные программы 1–12+ месяцев — конструктор длительных треков. */
export interface FullProgramPlan {
  id: string;
  durationMonths: 1 | 3 | 6 | 9 | 12;
  title: string;
  subtitle: string;
  focus: string;
  idealFor: string;
  retreatsCount: number;
  individualSessionsCount: number;
  supervisionsCount: number;
  groupSessionsCount: number;
  lecturesAndSeminarsCount: number;
  appFeatures: string[];
  phases: { month: string; theme: string; goals: string[] }[];
  priceTotal: string;
  pricePerMonth: string;
}

export type CollectiveCategory = 'couples' | 'family' | 'team' | 'business' | 'corporation' | 'pets';

export interface CollectiveModuleItem {
  id: CollectiveCategory;
  title: string;
  badge: string;
  subtitle: string;
  targetAudience: string;
  coreProblems: string[];
  approach: string[];
  formatOptions: string[];
  duration: string;
  results: string[];
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  specialization: string;
  professionalStatus: string;
  directions: string[];
  languages: string[];
  formats: ('Онлайн' | 'Очно')[];
  education: string;
  experience: string;
  bio: string;
  programs: string[];
}

export interface Retreat {
  id: string;
  title: string;
  location: string;
  date: string;
  duration: string;
  groupSize: string;
  format: string;
  shortDescription: string;
  program: string[];
  price: string;
  highlights: string[];
}

export interface JournalArticle {
  id: string;
  category: 'Психология' | 'Психоанализ' | 'Человек' | 'Отношения' | 'Профессия' | 'Город' | 'Исследования' | 'События';
  title: string;
  subtitle: string;
  date: string;
  author: string;
  readTime: string;
  pullQuote: string;
  content: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  subtitle: string;
  /** Издание и авторы источника, напр. "World Psychiatry · Leichsenring et al." */
  collaboration: string;
  year: string;
  tags: string[];
  abstract: string;
  findings: string[];
  /** Ссылка на оригинальную публикацию — обязательна для внешних источников. */
  sourceUrl: string;
}

/** Узел карты направлений центра — используется в сетевой секции на главной странице. */
export interface DirectionModule {
  id: string;
  title: string;
  tagline: string;
  description: string;
  directions: string[];
  specialistIds: string[];
}

export interface TestQuestion {
  id: number;
  domain: 'Город' | 'Работа' | 'Среда' | 'Отношения' | 'Восстановление' | 'Состояние';
  text: string;
  options: { label: string; score: number }[];
}

export interface BookingFormData {
  interest: 'Консультация' | 'Группа' | 'Обучение' | 'Супервизия' | 'Ретрит' | 'Корпоративная программа' | 'Другое';
  format: 'Очно' | 'Онлайн' | 'Не знаю';
  name: string;
  phone: string;
  email: string;
  comment: string;
  preferredSpecialist?: string;
  preferredProgram?: string;
}
