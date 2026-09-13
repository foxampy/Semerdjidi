import { ActiveScreen } from '../semerdzhidiTypes';

export interface ModuleShareInfo {
  screen: ActiveScreen;
  title: string;
  description: string;
  tag: string;
}

export const MODULE_META: Record<ActiveScreen, ModuleShareInfo> = {
  feed: {
    screen: 'feed',
    title: 'Семерджиди — Лента публикаций экосистемы',
    description: 'Официальные новости, отчеты экспедиции Тимура Садыкова и публикации резидентов пространства.',
    tag: '#Лента #Экосистема',
  },
  retreats: {
    screen: 'retreats',
    title: 'FRACTAL: Точка Сборки — Ретрит 19-20 сентября в горах Чимгана',
    description: '24 часа психоэмоциональной перезагрузки «Всё включено», термальный чан, тест из 7 вопросов и скидка 50%.',
    tag: '#Ретрит #Чимган #ТочкаСборки',
  },
  practices: {
    screen: 'practices',
    title: 'Ментальный Покой — Аудиотека & Протоколы 432 Hz',
    description: 'Нейро-акустические аудиопрактики, дыхательные ритмы 4-7-8 и глубинное заземление.',
    tag: '#Аудиотека #Релаксация',
  },
  coffee: {
    screen: 'coffee',
    title: 'Кофейня EthOSium • Спешелти кофе & Чайная комната',
    description: 'Пространство живого общения, органик-напитки, чайные церемонии и лаунж глубокого восстановления.',
    tag: '#Кофейня #ЧайнаяКомната',
  },
  founder: {
    screen: 'founder',
    title: 'Екатерина Семерджиди — Профиль основателя & Манифест',
    description: 'Философия экосистемы здоровья, исследовательский метод и системная психотерапия.',
    tag: '#Основатель #Манифест',
  },
  experts: {
    screen: 'experts',
    title: 'Каталог 50 специалистов и супервизоров',
    description: 'Психотерапевты, сертифицированные практики и супервизоры сообщества Семерджиди.',
    tag: '#Эксперты #Супервизия',
  },
  learning: {
    screen: 'learning',
    title: 'Академическое обучение & Практические воркбуки',
    description: 'Курсы глубинной психотерапии, практические пособия и методические протоколы.',
    tag: '#Обучение #Воркбуки',
  },
  club: {
    screen: 'club',
    title: 'Закрытый клуб резидентов Семерджиди',
    description: 'Регулярные супервизии, интервизорские группы, закрытый нетворкинг и поддержка.',
    tag: '#Клуб #Резиденты',
  },
  social: {
    screen: 'social',
    title: 'Личный кабинет & Сообщество участников',
    description: 'Профиль резидента, статус регистрации, результаты тестов и внутренний диалог.',
    tag: '#Кабинет #Сообщество',
  },
  booking: {
    screen: 'booking',
    title: 'Консьерж бронирования ретрита 19-20 сентября',
    description: 'Бронирование слота со скидкой 50%, выбор эко-лоджа и фиксация предоплаты.',
    tag: '#Бронирование #Ретрит',
  },
  baseline: {
    screen: 'baseline',
    title: 'FRACTAL — Baseline диагностика & Чекин D-3',
    description: 'Персональная оценка 7 шкал психоэмоционального баланса и чек-лист готовности к выезду в горы.',
    tag: '#Baseline #Диагностика',
  },
  workbook: {
    screen: 'workbook',
    title: 'Цифровой воркбук Точки Сборки (стр. 56-64)',
    description: 'Интерактивные упражнения, карты внутренних границ и полевые психологические заметки.',
    tag: '#Воркбук #Практика',
  },
  integration: {
    screen: 'integration',
    title: '7 Дней Интеграции в ритм города',
    description: 'Протокол плавного возвращения после горного ретрита: психологические якоря и супервизия.',
    tag: '#Интеграция #Сопровождение',
  },
  report: {
    screen: 'report',
    title: 'Индивидуальный аналитический отчет (9 разделов)',
    description: 'Аудит вегетативного баланса, карта ресурсных зон и рекомендации ведущего терапевта.',
    tag: '#Отчет #Рефлексия',
  },
  chat: {
    screen: 'chat',
    title: 'Защищенный EAP-мессенджер экосистемы',
    description: 'Конфиденциальная связь с дежурным куратором и супервизором ретрита.',
    tag: '#Мессенджер #Куратор',
  },
  admin: {
    screen: 'admin',
    title: 'Суперадмин-консоль управления экосистемой',
    description: 'Управление пользователями, заявками на ретрит, стеной и базой данных.',
    tag: '#Админ #Консоль',
  },
  labforge: {
    screen: 'labforge',
    title: 'LabForge: R&D & Системная архитектура',
    description: 'Технологический контур, нейроинтерфейсы и системная оптимизация здоровья.',
    tag: '#LabForge #RnD',
  },
  ethosium: {
    screen: 'ethosium',
    title: 'EthOSium Nexus — Континуум 4D',
    description: 'Единое цифровое пространство синтеза смыслов, технологий и психоэмоционального баланса.',
    tag: '#EthOSium #Nexus',
  },
  onboarding: {
    screen: 'onboarding',
    title: 'Добро пожаловать в экосистему Семерджиди',
    description: 'Вводный тур по пространствам, философии и направлениям экосистемы.',
    tag: '#Онбординг #Экосистема',
  },
  whitepaper: {
    screen: 'whitepaper',
    title: 'Whitepaper экосистемы EthOSium & Семерджиди',
    description: 'Манифест, 3 системных контура, исследовательский метод, R&D LabForge и экономическая модель.',
    tag: '#Whitepaper #Экосистема #Манифест',
  },
  mediakit: {
    screen: 'mediakit',
    title: 'Медиа-кит & Промо-центр экосистемы Семерджиди & EthOSium',
    description: 'Рекламные баннеры, партнерские макеты по всем модулям (ретриты в Чимгане, институт, LabForge, кофейня, стиль Realting.uz).',
    tag: '#МедиаКит #Баннеры #Экосистема #Ретрит',
  },
  strategy: {
    screen: 'strategy',
    title: 'Архитектура, Roadmap 2026–2030 & Инвест-План EthOSium',
    description: 'Интерактивная карта системных узлов, дорожная карта фаз 1–4, инвестиционный калькулятор и условия участия в Seed Round $650k.',
    tag: '#Архитектура #Roadmap #Инвестиции #SeedRound #EthOSium',
  },
  myday: {
    screen: 'myday',
    title: 'Мой день — Планы, Дашборд, Календарь, Лекции & Задания EthOSium',
    description: 'Ежедневник резидента: фокусы дня, трекер энергии, расписание лекций Института, задания воркбука и предложения дня.',
    tag: '#МойДень #Ежедневник #Планы #Дашборд #EthOSium',
  },
};

export const getModuleUrl = (screen: ActiveScreen, subParam?: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const paramPart = subParam ? `?tab=${encodeURIComponent(subParam)}` : '';
  return `${origin}${pathname}#${screen}${paramPart}`;
};

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard';
  url: string;
  title: string;
}

export const shareModule = async (
  screen: ActiveScreen,
  options?: { subParam?: string; customTitle?: string; customText?: string }
): Promise<ShareResult> => {
  const meta = MODULE_META[screen] || {
    screen,
    title: 'Экосистема Семерджиди',
    description: 'Цифровое пространство здоровья и осознания',
    tag: '#Семерджиди',
  };

  const url = getModuleUrl(screen, options?.subParam);
  const title = options?.customTitle || meta.title;
  const text = options?.customText || `${meta.description}\n\n${meta.tag}`;

  let method: 'native' | 'clipboard' = 'clipboard';
  let success = false;

  // Try Web Share API if supported and not iframe-blocked
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      method = 'native';
      success = true;
    } catch (err: any) {
      // User cancelled or share failed, fallback to clipboard
      if (err?.name === 'AbortError') {
        return { success: true, method: 'native', url, title };
      }
    }
  }

  // Fallback to clipboard
  if (!success && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      method = 'clipboard';
      success = true;
    } catch {
      // Fallback through dummy textarea
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        method = 'clipboard';
        success = true;
      } catch (e) {
        success = false;
      }
    }
  }

  // Dispatch custom event for UI toast notifications
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ethosium-share-notify', {
        detail: {
          url,
          title,
          screen,
          method,
          success,
        },
      })
    );
  }

  return { success, method, url, title };
};
