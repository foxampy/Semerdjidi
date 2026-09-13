export type ActiveScreen = 
  | 'onboarding'    // Онбординг EthOSium: LabForge, Семерджиди, Тест, Оффер 19-20 сентября
  | 'feed'          // Семерджиди — Лента Пространства
  | 'founder'       // Профиль Екатерины Семерджиди & Витрина
  | 'retreats'      // FRACTAL: Точка Сборки | Ретриты 2026 (Горный 18-19-20 сентября)
  | 'report'        // FRACTAL: Personal Reflection Report
  | 'integration'   // FRACTAL — 7 Дней Интеграции
  | 'baseline'      // FRACTAL — Baseline & Чекин
  | 'workbook'      // FRACTAL — Цифровой Workbook (стр. 56-64)
  | 'experts'       // Каталог 50 специалистов
  | 'learning'      // Академическое обучение
  | 'club'          // Закрытый клуб Семерджиди
  | 'practices'     // Психологический Покой — Аудиотека
  | 'chat'          // Защищенный мессенджер EAP
  | 'admin'         // Суперадмин-консоль
  | 'booking'       // Бронирование ретрита
  | 'labforge'      // LabForge: R&D, архитектура, системная интеграция и консалтинг
  | 'coffee'        // Кофейня EthOSium: спешелти кофе, чайная комната, лаунж
  | 'social'        // Внутренняя соцсеть EthOSium: Аккаунт, Сообщения, Друзья, Стена
  | 'ethosium'      // EthOSium 4D Continuum
  | 'whitepaper'   // Белая Книга & Архитектура Экосистемы EthOSium
  | 'mediakit'     // Медиа-кит & Промо-центр: все модули экосистемы, баннеры и партнерские материалы
  | 'strategy'     // Архитектура, Стратегия, Дорожная Карта & Инвест-план (Интерактивная карта и Seed Round)
  | 'myday';       // Мой день: планы, дашборды, предложения, ежедневник, календарь, лекции, семинары, задания

export interface RetreatModuleItem {
  id: string;
  name: string;
  category: 'base' | 'experience' | 'expert' | 'transport';
  description: string;
  priceUsd: number;
  isBase?: boolean;
  maxSpots?: number;
  availableSpots?: number;
}

export interface RetreatQuestionnaireData {
  experienceLevel?: string;
  nutritionPreference?: string;
  mainIntention?: string;
  horseRidingExperience?: string;
  accommodationType?: string;
  specialRequests?: string;
}

export interface RetreatApplicationDraft {
  id?: string;
  retreatId: string;
  retreatTitle: string;
  selectedModules: string[];
  totalBudgetUsd: number;
  finalPriceUsd: number;
  promoCode?: string;
  questionnaire: RetreatQuestionnaireData;
  name: string;
  contact: string;
  email?: string;
  step: 'modules' | 'questionnaire' | 'profile' | 'completed';
  status: 'draft' | 'new' | 'in_review' | 'approved' | 'completed' | 'declined';
  lastUpdated?: string;
}

export interface EthosiumUserProfile {
  id: string;
  name: string;
  emailOrTg: string;
  role: string;
  contour: 'labforge' | 'semerdzhidi' | 'both';
  archetype?: string;
  testScoreSummary?: string;
  registeredAt: string;
  hasDiscount19Sep: boolean;
  isAdmin?: boolean;
  adminRole?: 'superadmin' | 'admin' | 'moderator';
  avatar?: string;
  testAnswers?: {
    q1?: string;
    q2?: string;
    q3Choice?: string;
    q3Reason?: string;
    q4Choice?: string;
    q4Excess?: string;
    q5?: string;
    q6?: string;
    q7?: string;
    completedAt?: string;
  } | null;
  baselineData?: {
    sliders?: {
      anxiety?: number;
      muscleTension?: number;
      controlNeed?: number;
      isolation?: number;
      selfConnection?: number;
      clarity?: number;
      vitalEnergy?: number;
    };
    luggageChecklist?: Record<string, boolean>;
    eveningReflection?: {
      left?: string;
      gone?: string;
      came?: string;
    };
    savedAt?: string;
  } | null;
  retreatPreRegistration?: {
    format: 'standard' | 'vip';
    contact: string;
    finalPriceUsd: number;
    promoCode: string;
    lockedAt: string;
  } | null;
}

export interface AdminUserRecord extends EthosiumUserProfile {
  provider?: string;
}

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface WallPostComment {
  author: string;
  text: string;
  time?: string;
}

export interface WallPost {
  id: string;
  author: string;
  authorRole?: string;
  contour?: 'labforge' | 'semerdzhidi' | 'both';
  time: string;
  text: string;
  tags: string[];
  likes: number;
  comments: WallPostComment[];
  likedByMe?: boolean;
}
