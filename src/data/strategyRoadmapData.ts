export interface ArchitectureNode {
  id: string;
  title: string;
  englishTitle: string;
  category: 'core' | 'circuit' | 'deeptech' | 'offline' | 'economics';
  badge: string;
  icon: string;
  color: string;
  shortDesc: string;
  fullDesc: string;
  technicalSpecs: string[];
  dataFlowInputs: string[];
  dataFlowOutputs: string[];
  kpis: string[];
  securityLevel: string;
  status: 'production' | 'active_dev' | 'scaling';
  linkedScreen?: string;
  responsibleLead: string;
}

export interface FlywheelStage {
  step: number;
  title: string;
  shortDesc: string;
  trigger: string;
  outputEffect: string;
  conversionMetric: string;
  synergy: string;
}

export interface RoadmapMilestone {
  id: string;
  phaseId: 'phase1' | 'phase2' | 'phase3' | 'phase4';
  quarter: string;
  title: string;
  category: 'tech' | 'offline' | 'institute' | 'business';
  status: 'done' | 'in_progress' | 'planned';
  progressPercent: number;
  summary: string;
  deliverables: string[];
  budgetUsd: number;
  kpis: string[];
  dependencies: string[];
  riskMitigation: string;
}

export interface RoadmapPhase {
  id: 'phase1' | 'phase2' | 'phase3' | 'phase4';
  number: string;
  name: string;
  period: string;
  tagline: string;
  status: 'active' | 'upcoming' | 'vision';
  coreFocus: string;
  keyGoal: string;
}

export interface InvestmentRound {
  id: string;
  name: string;
  status: 'completed' | 'open' | 'projected';
  targetAmountUsd: number;
  raisedAmountUsd: number;
  valuationPreUsd: number;
  valuationPostUsd: number;
  instrument: string;
  minTicketUsd: number;
  timeline: string;
  runwayMonths: number;
  leadInvestors: string;
  keyUseOfFunds: { label: string; percent: number; amountUsd: number }[];
  strategicUnlocks: string[];
}

export interface FinancialMetricYear {
  year: string;
  revenueUsd: number;
  cogsUsd: number;
  opexUsd: number;
  ebitdaUsd: number;
  activeResidents: number;
  retreatGuests: number;
  supervisionsCount: number;
}

export interface InvestorTier {
  id: string;
  name: string;
  ticketUsd: number;
  equityTokensPct: string;
  perks: string[];
  governanceRole: string;
}

// -------------------------------------------------------------
// ARCHITECTURE NODES DATA
// -------------------------------------------------------------
export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'arch-sovereign-vault',
    title: 'Суверенное Хранилище (Local-First Vault)',
    englishTitle: 'Sovereign Encrypted Client Vault',
    category: 'core',
    badge: 'Контур I: Local-First',
    icon: 'lock',
    color: '#86efac',
    shortDesc: 'Абсолютно приватное криптографическое ядро для замеров, рефлексий и дневников резидента.',
    fullDesc: 'Ключевой этический принцип EthOSium: биометрия, дневники состояний и результаты тестов не продаются рекламодателям и не покидают устройство резидента без его прямого криптографического разрешения.',
    technicalSpecs: [
      'AES-GCM-256 симметричное локальное шифрование',
      'IndexedDB + CacheStorage для мгновенного офлайн-доступа',
      'Zero-Knowledge Sync протокол синхронизации ключей',
      'Полная автономия при отсутствии интернета в горах'
    ],
    dataFlowInputs: ['PPG-пульсометрия', 'Baseline D-3 чекины', 'Голосовые заметки интеграции'],
    dataFlowOutputs: ['Анонимизированный хеш индекса стресса', 'Личные отчеты рефлексии'],
    kpis: ['0% утечек данных', '< 15ms скорость шифрования локального снапшота'],
    securityLevel: 'Tier-4: Максимальный суверенный',
    status: 'production',
    linkedScreen: 'report',
    responsibleLead: 'LabForge Core Cryptography Team'
  },
  {
    id: 'arch-gemini-ai-core',
    title: 'Нейро-Семантическое Ядро (AI Core)',
    englishTitle: 'Semerdzhidi Gemini AI Engine',
    category: 'deeptech',
    badge: 'Серверный AI Core',
    icon: 'neurology',
    color: '#BA9470',
    shortDesc: 'Серверный анализ текстовых дневников, паттернов усталости и построение поливагального профиля.',
    fullDesc: 'Нейросетевой модуль на базе передовых моделей Gemini с дообучением на авторском корпусе текстов и клинических протоколов Екатерины Семерджиди. Автоматически выявляет когнитивные искажения и триггеры симпатического истощения.',
    technicalSpecs: [
      'Server-side Gemini 2.5 Flash / Pro API оркестрация',
      'Strict Zero-Leakage Data Sanitization (удаление PII до отправки)',
      'Мультимодальный анализ тональности голоса и текста',
      'Генерация персонализированных протоколов D-3 / D+7'
    ],
    dataFlowInputs: ['Анонимизированные расшифровки сессий', 'Ответы опросников ретритов'],
    dataFlowOutputs: ['Сводный Reflection Report', 'Рекомендации по дыхательным частотам'],
    kpis: ['94.2% точность поливагальной классификации', '< 1.8с генерация отчета'],
    securityLevel: 'Tier-3: Изолированный backend прокси',
    status: 'production',
    linkedScreen: 'report',
    responsibleLead: 'Foxampy AI Labs'
  },
  {
    id: 'arch-institute-mesh',
    title: 'Меш-Сеть Института (50 Экспертов)',
    englishTitle: 'Semerdzhidi Care Mesh Network',
    category: 'circuit',
    badge: 'Контур II: Супервизия',
    icon: 'psychology',
    color: '#93c5fd',
    shortDesc: 'Единый реестр аккредитованных психологов, телесных терапевтов и коучей с EAP-мессенджером.',
    fullDesc: 'Институт объединяет 50 профильных экспертов, прошедших сертификацию по методу Семерджиди. Модуль маршрутизирует резидентов на основе их Baseline-индекса и гарантирует конфиденциальную супервизию.',
    technicalSpecs: [
      'P2P сквозное шифрование в EAP-мессенджере',
      'Календарная интеграция слотов с часовыми поясами',
      'Система независимой клинической супервизии',
      'Смарт-подбор специалиста по биомаркерам истощения'
    ],
    dataFlowInputs: ['Запросы резидентов на консультации', 'Оценки супервизорского совета'],
    dataFlowOutputs: ['Индивидуальные планы поддержки', 'Рецепты практик в Аудиотеку'],
    kpis: ['NPS клиентов > 91%', 'Среднее время ответа дежурного куратора < 12 мин'],
    securityLevel: 'Tier-3: Медицинская конфиденциальность',
    status: 'production',
    linkedScreen: 'experts',
    responsibleLead: 'Екатерина Семерджиди & Совет Института'
  },
  {
    id: 'arch-mountain-camp',
    title: 'Физический Кампус & Чимган Hub',
    englishTitle: 'Chimgan High-Altitude Camp 18-20 Sept',
    category: 'offline',
    badge: 'Контур III: Физический',
    icon: 'landscape',
    color: '#f97316',
    shortDesc: 'Горная база 1800м: дровяные бани, иппотерапия, сап-борды Чарвака, лекции и костры.',
    fullDesc: 'Офлайн-якорь всей экосистемы. Место глубокого цифрового детокса, где соматическая терапия соединяется с природными факторами: чистым горным воздухом, ледниковой водой и живым сообществом единомышленников.',
    technicalSpecs: [
      'Модульный конструктор ретрита с бронированием 24h',
      'Гео-синхронизация высотных треков и маршрутов',
      'Безопасная логистика трансфера премиум-класса',
      'Система льготного субсидирования (гранты и скидка 50%)'
    ],
    dataFlowInputs: ['Анкеты участников', 'Выбранные модули конструктора'],
    dataFlowOutputs: ['Живой опыт заземления', 'Артефакты телесных осознаний'],
    kpis: ['100% заполняемость заездов', '0% соматических травм на треках'],
    securityLevel: 'Tier-2: Физическая безопасность & медицина',
    status: 'production',
    linkedScreen: 'retreats',
    responsibleLead: 'Экспедиционная команда EthOSium'
  },
  {
    id: 'arch-roots-silk-road',
    title: 'Программа Корней (Silk Road Heritage)',
    englishTitle: 'Ancestral Roots & Cultural Reconnection',
    category: 'offline',
    badge: 'Культурный Код',
    icon: 'explore',
    color: '#fbbf24',
    shortDesc: '10-дневная трансформирующая экспедиция: Ташкент, Самарканд, Бухара, петроглифы Чаткала.',
    fullDesc: 'Аналог программ Таглит и Маса для восстановления родовой опоры, понимания кочевого и оседлого наследия Шелкового Пути, осознания архетипов предков и экзистенциального заземления.',
    technicalSpecs: [
      'Маршрутный экспедиционный паспорт в PWA',
      'Аудиогиды с локальной поливагальной привязкой',
      'Историко-генеалогические соматические расстановки'
    ],
    dataFlowInputs: ['Родовые запросы резидентов', 'Экспедиционные логи'],
    dataFlowOutputs: ['Крепкая культурная идентичность', 'Антихрупкое самоопределение'],
    kpis: ['Глубина экзистенциальной ясности > 8.8/10'],
    securityLevel: 'Tier-2: Физический контур',
    status: 'scaling',
    linkedScreen: 'retreats',
    responsibleLead: 'Совет культурологов EthOSium'
  },
  {
    id: 'arch-tashkent-lounge',
    title: 'Городской Лаунж & Спешелти Бар',
    englishTitle: 'Tashkent EthOSium Specialty & Silence Hub',
    category: 'offline',
    badge: 'Городской Якорь',
    icon: 'local_cafe',
    color: '#eab308',
    shortDesc: 'Пространство чистой тишины в центре столицы: чайные церемонии Мауна, спешелти кофе, коворкинг.',
    fullDesc: 'Городской форпост EthOSium. Позволяет резидентам не терять состояние горного покоя в суете делового мегаполиса благодаря залу тишины, отборному зерну и регулярным открытым лекториям.',
    technicalSpecs: [
      'PWA-меню с предзаказом и баллами лояльности',
      'Зонирование акустического комфорта (< 40 dB в комнате Мауна)',
      'Лаборатория чистой заварки без искусственных добавок'
    ],
    dataFlowInputs: ['Заказы резидентов', 'Бронирование тихих капсул'],
    dataFlowOutputs: ['Устойчивый ритм дня', 'Офлайн нетворкинг резидентов'],
    kpis: ['Выручка $18k+/мес на локацию', 'Возвратность гостей > 68%'],
    securityLevel: 'Tier-1: Общественное пространство',
    status: 'active_dev',
    linkedScreen: 'coffee',
    responsibleLead: 'EthOSium Hospitality Group'
  },
  {
    id: 'arch-unit-economics',
    title: 'Экономический Движок (EthOS Token & Credits)',
    englishTitle: 'Regenerative Tokenized Value Economy',
    category: 'economics',
    badge: 'Контур IV: Экономика',
    icon: 'account_balance_wallet',
    color: '#c084fc',
    shortDesc: 'Модель замкнутого цикла: абонементы, ретритные депозиты, роялти экспертов и грантовый фонд.',
    fullDesc: 'Гибридная модель монетизации с диверсифицированными потоками выручки: офлайн-ретриты (высокий чек), клубные подписки (SaaS MRR), образовательные воркбуки и кофейная дистрибуция.',
    technicalSpecs: [
      'Stripe & региональные шлюзы (Payme, Click, Uzum)',
      'Смарт-контракты распределения роялти экспертам (80/20 split)',
      'Грантовый фонд субсидирования (5% выручки идет на скидки 50%)',
      'Система баллов EthOS Credits за практики заземления'
    ],
    dataFlowInputs: ['Транзакции бронирований', 'Клубные взносы'],
    dataFlowOutputs: ['Выплаты супервизорам', 'Инвестиции в R&D LabForge'],
    kpis: ['Gross Margin 68%', 'LTV / CAC > 4.2x', 'Cash-flow позитивность к Q4 2026'],
    securityLevel: 'Tier-3: Финансовые шлюзы PCI-DSS',
    status: 'production',
    linkedScreen: 'club',
    responsibleLead: 'Финансовый департамент EthOSium'
  }
];

// -------------------------------------------------------------
// FLYWHEEL STRATEGY DATA
// -------------------------------------------------------------
export const STRATEGY_FLYWHEEL_STEPS: FlywheelStage[] = [
  {
    step: 1,
    title: 'Вход через Контент & Чекин Baseline D-3',
    shortDesc: 'Пользователь проходит 7-шкальную диагностику поливагального состояния и осознает уровень скрытого стресса.',
    trigger: 'Бесплатный чекин в PWA / Лента статей Семерджиди',
    outputEffect: 'Осознание дефицита ресурса и формирование доверия к методу',
    conversionMetric: 'Конверсия в регистрацию: 28%',
    synergy: 'Питает персональный профиль данными без риска утечки'
  },
  {
    step: 2,
    title: 'Офлайн Ретрит Чимган (Пиковый Телесный Опыт)',
    shortDesc: 'Горный выезд с грантовой скидкой 50% трансформирует ментальную теорию в физическое облегчение симпатики.',
    trigger: 'Бронирование модульного ретрита со скидкой 50%',
    outputEffect: 'Глубокая нейро-перезагрузка, эмоциональный сдвиг и доверие к бренду',
    conversionMetric: 'NPS ретрита: 94%, повторные покупки: 48%',
    synergy: 'Генерирует мощный UGC-контент и лояльное ядро комьюнити'
  },
  {
    step: 3,
    title: 'Интеграция D+7 & Цифровой Workbook',
    shortDesc: '7-дневный протокол плавного возвращения в город исключает постретритный откат в выгорание.',
    trigger: 'Завершение горной смены',
    outputEffect: 'Закрепление новых привычек сна, питания и дыхания в ритме мегаполиса',
    conversionMetric: 'Completion Rate воркбука: 74%',
    synergy: 'Переводит разового гостя в категорию постоянного резидента'
  },
  {
    step: 4,
    title: 'Клуб Резидентов & Сеть 50 Специалистов',
    shortDesc: 'Резидент подключается к регулярным супервизиям Института и ежемесячной клубной подписке ($45/$95).',
    trigger: 'Индивидуальные рекомендации из Reflection Report',
    outputEffect: 'Стабильный MRR, предотвращение рецидивов истощения',
    conversionMetric: 'Retention 6 месяцев: 62%, LTV: $840',
    synergy: 'Обеспечивает практику и достойный доход сертифицированным психологам'
  },
  {
    step: 5,
    title: 'R&D LabForge & Корпоративный EAP-контур',
    shortDesc: 'Компании подключают ключевые команды к чекинам стресса и заказывают корпоративные ретриты.',
    trigger: 'Рекомендации резидентов-топ-менеджеров своим HR-директорам',
    outputEffect: 'B2B контракты $15k–$45k, масштабирование аппаратно-программного комплекса',
    conversionMetric: 'B2B Cycle: 45 дней, Чистая маржинальность: 58%',
    synergy: 'Финансирует новые гранты и научные исследования в Ташкенте'
  }
];

// -------------------------------------------------------------
// ROADMAP PHASES & MILESTONES (2026 - 2030)
// -------------------------------------------------------------
export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase1',
    number: '01',
    name: 'Генезис & Прорыв в Горах',
    period: 'Q3 2026 – Q4 2026',
    tagline: 'Запуск MVP, Чимган 18-20 сентября, Институт 50 специалистов и Whitepaper 3.0',
    status: 'active',
    coreFocus: 'Доказательство ценности, валидация офлайн-онлайн связки, первый пул резидентов.',
    keyGoal: 'Провести горный ретрит 18-20 сентября, собрать 500 активных пользователей PWA, выйти на $45k выручки.'
  },
  {
    id: 'phase2',
    number: '02',
    name: 'Deep Tech & Расширение Шелкового Пути',
    period: '2027 (Q1 – Q4)',
    tagline: 'PPG-диагностика стресса, Программа Корней (Самарканд/Бухара), Corporate EAP',
    status: 'upcoming',
    coreFocus: 'Масштабирование на Central Asia & MENA, запуск B2B корпоративного направления.',
    keyGoal: '10,000 активных пользователей, 12 проведенных экспедиций, выручка $480k/год.'
  },
  {
    id: 'phase3',
    number: '03',
    name: 'Круглогодичный Кампус & Биосенсор',
    period: '2028',
    tagline: 'Собственный высокогорный хаб в Чимгане, EthOS Smart Ring прототип, швейцарский фонд',
    status: 'upcoming',
    coreFocus: 'Капитализация физических активов, создание собственного круглогодичного ретрит-центра.',
    keyGoal: 'Строительство 1-й очереди кампуса (25 номеров), 50,000 резидентов, выручка $2.1M.'
  },
  {
    id: 'phase4',
    number: '04',
    name: 'Глобальная Децентрализация EthOS',
    period: '2029 – 2030',
    tagline: 'Международная сеть резиденций: Алматы, Дубай, Тбилиси, Бали; открытый стандарт EthOS Core',
    status: 'vision',
    coreFocus: 'Мировой франчайзинг ретрит-инфраструктуры, IPO / M&A интеграция в global healthtech.',
    keyGoal: '250,000+ глобальных пользователей, сеть из 6 хабов, капитализация > $60M.'
  }
];

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'ms-chimgan-sept26',
    phaseId: 'phase1',
    quarter: 'Q3 2026',
    title: 'Флагманский Горный Ретрит Чимган 18–20 сентября',
    category: 'offline',
    status: 'in_progress',
    progressPercent: 88,
    summary: 'Первый трехдневный физический заезд в Чаткальских горах с модульным бронированием, сап-бордами и баней.',
    deliverables: [
      'Полная аренда горной базы премиум-класса на 3 дня',
      'Интеграция 5 ведущих специалистов Института Семерджиди на площадке',
      'Выдача персональных печатных воркбуков и тотемов резидента',
      'Обеспечение грантов 50% для первых 12 участников'
    ],
    budgetUsd: 14500,
    kpis: ['18-24 участника на заезде', 'NPS > 90%', '0 происшествий'],
    dependencies: ['Бронирование базы', 'Завершение D-3 тестирования'],
    riskMitigation: 'Резервные теплые павильоны и трансфер 4x4 на случай горного дождя.'
  },
  {
    id: 'ms-pwa-whitepaper3',
    phaseId: 'phase1',
    quarter: 'Q3 2026',
    title: 'Релиз EthOSium PWA & Публикация Whitepaper 3.0',
    category: 'tech',
    status: 'done',
    progressPercent: 100,
    summary: 'Запуск прогрессивного веб-приложения с офлайн-доступом, 12 главами белой книги и 8 векторами здоровья.',
    deliverables: [
      'Интерактивный ридер Whitepaper с матрицей здоровья',
      'Local-first хранилище личных рефлексий с шифрованием',
      'Генератор ссылок шеринга для Telegram WebApp',
      'Система мгновенного переключения шрифтов и языков'
    ],
    budgetUsd: 8500,
    kpis: ['Lighthouse PWA Score: 98/100', '< 1.2s время первой отрисовки'],
    dependencies: ['Архитектурный аудит Foxampy & LabForge'],
    riskMitigation: 'Полная локальная изоляция (Zero Cloud Dep on start).'
  },
  {
    id: 'ms-institute-50',
    phaseId: 'phase1',
    quarter: 'Q4 2026',
    title: 'Аккредитация первых 50 специалистов Института',
    category: 'institute',
    status: 'in_progress',
    progressPercent: 75,
    summary: 'Формирование реестра доказательных психологов, телесных практиков и соматических терапевтов.',
    deliverables: [
      'Стандартизация методики оценки поливагального выгорания',
      'Интеграция онлайн-расписания и календаря консультаций',
      'Этический регламент и комиссия по супервизии сложных кейсов'
    ],
    budgetUsd: 12000,
    kpis: ['50 активных экспертов в каталоге', 'Минимум 120 часов супервизий в месяц'],
    dependencies: ['Личный отбор Екатерины Семерджиди'],
    riskMitigation: 'Многоступенчатое интервьюирование и проверка дипломов.'
  },
  {
    id: 'ms-tashkent-cafe',
    phaseId: 'phase1',
    quarter: 'Q4 2026',
    title: 'Открытие городского лаунжа & кофейни EthOSium в Ташкенте',
    category: 'offline',
    status: 'planned',
    progressPercent: 30,
    summary: 'Создание физического якоря в столице: спешелти кофе, чайные церемонии Мауна и лекторий.',
    deliverables: [
      'Локация 140 м² в центре Ташкента с шумоизолированной комнатой тишины',
      'Коллаборация с фермерскими хозяйствами и чайными мастерами',
      'Интеграция клубного мерча и офлайн-точки выдачи воркбуков'
    ],
    budgetUsd: 42000,
    kpis: ['Выход на операционный ноль на 3-й месяц', '150+ чеков в день'],
    dependencies: ['Выбор локации в Ташкенте', 'Заключение договора аренды'],
    riskMitigation: 'Тестовый поп-ап формат на партнерской площадке перед полным ремонтом.'
  },
  {
    id: 'ms-ppg-sensor',
    phaseId: 'phase2',
    quarter: 'Q1-Q2 2027',
    title: 'Аппаратный PPG-модуль замера стресса через камеру смартфона',
    category: 'tech',
    status: 'planned',
    progressPercent: 15,
    summary: 'Считывание вариабельности сердечного ритма (HRV) и симпатического тонуса без покупки внешних датчиков.',
    deliverables: [
      'Компьютерное зрение фотоплетизмографии (PPG) через вспышку камеры',
      'Алгоритм фильтрации артефактов движения и шумов освещения',
      'Автоматическая привязка данных к 8 векторам здоровья'
    ],
    budgetUsd: 38000,
    kpis: ['Корреляция 91% с медицинскими нагрудными датчиками Polar H10'],
    dependencies: ['Лабораторные тесты в LabForge R&D'],
    riskMitigation: 'Резервная интеграция с Apple HealthKit и Google Health Connect.'
  },
  {
    id: 'ms-silk-road-expeditions',
    phaseId: 'phase2',
    quarter: 'Q2 2027',
    title: 'Запуск 10-дневной Программы Корней по Шелковому Пути',
    category: 'offline',
    status: 'planned',
    progressPercent: 20,
    summary: 'Регулярные культурологические экспедиции (Ташкент – Самарканд – Бухара – Чаткал) для диаспоры и экспатов.',
    deliverables: [
      'Партнерство с историческими медресе и обсерваторией Улугбека для ночных созерцаний',
      'Специальные железнодорожные вагоны с практиками заземления в пути',
      'Генеалогические и антропологические сессии с учеными Академии Наук'
    ],
    budgetUsd: 65000,
    kpis: ['4 потока в 2027 году по 20 резидентов', 'NPS > 95%'],
    dependencies: ['Согласование музейных маршрутов'],
    riskMitigation: 'Пул проверенных отелей бутик-класса с автономным питанием.'
  },
  {
    id: 'ms-b2b-eap',
    phaseId: 'phase2',
    quarter: 'Q3-Q4 2027',
    title: 'Корпоративная платформа EAP для IT и Fintech компаний',
    category: 'business',
    status: 'planned',
    progressPercent: 10,
    summary: 'B2B подписка для предотвращения выгорания топ-менеджмента и ключевых инженерных команд.',
    deliverables: [
      'HR-дашборд с агрегированным индексом ментального здоровья команд',
      'Пакет закрытых корпоративных уикенд-ретритов в Чимгане',
      'Юридическая обвязка корпоративных договоров в юрисдикциях Узбекистана, ОАЭ и Казахстана'
    ],
    budgetUsd: 50000,
    kpis: ['15 подписанных B2B контрактов', '$180k годовой B2B контрактной стоимости (ACV)'],
    dependencies: ['Завершение сертификации ISO-27001 по защите данных'],
    riskMitigation: 'Абсолютная анонимизация личных бесед сотрудников от работодателя.'
  },
  {
    id: 'ms-chimgan-campus',
    phaseId: 'phase3',
    quarter: '2028',
    title: 'Строительство круглогодичного высокогорного кампуса EthOSium Sanctuary',
    category: 'offline',
    status: 'planned',
    progressPercent: 5,
    summary: 'Собственный архитектурный шедевр в Чимгане: 25 эко-вилл, спа-комплекс на талой воде, лаборатория сна.',
    deliverables: [
      'Земельный участок 2.5 Га с видом на Большой Чимган',
      'Энергоэффективная пассивная эко-архитектура из натурального камня и лиственницы',
      'Акустическая капсула тишины и зал соматических практик с панорамным остеклением'
    ],
    budgetUsd: 1400000,
    kpis: ['Круглогодичная загрузка 78%', 'Собственный актив на балансе компании'],
    dependencies: ['Закрытие инвестиционного раунда Series A', 'Генплан застройки'],
    riskMitigation: 'Поэтапный ввод: сначала центральный лодж и 10 вилл, затем спа-блок.'
  }
];

// -------------------------------------------------------------
// INVESTMENT PLAN DATA
// -------------------------------------------------------------
export const INVESTMENT_ROUNDS: InvestmentRound[] = [
  {
    id: 'round-preseed',
    name: 'Pre-Seed (Генезис)',
    status: 'completed',
    targetAmountUsd: 150000,
    raisedAmountUsd: 150000,
    valuationPreUsd: 1200000,
    valuationPostUsd: 1350000,
    instrument: 'Founder Equity & Angel Grants',
    minTicketUsd: 25000,
    timeline: 'Завершен (Q1–Q3 2026)',
    runwayMonths: 9,
    leadInvestors: 'Фаундеры (Екатерина Семерджиди & LabForge Core Angels)',
    keyUseOfFunds: [
      { label: 'Разработка PWA & Архитектура', percent: 45, amountUsd: 67500 },
      { label: 'Пилотный Ретрит Чимган 18-20 сент', percent: 30, amountUsd: 45000 },
      { label: 'Методология Института & Юристы', percent: 15, amountUsd: 22500 },
      { label: 'Маркетинг & Фотопродакшн', percent: 10, amountUsd: 15000 }
    ],
    strategicUnlocks: [
      'Готовая масштабируемая PWA-платформа с офлайн режимом',
      'Сформированный пул 50 сертифицированных специалистов',
      'Проведение первого флагманского ретрита в горах Чимгана'
    ]
  },
  {
    id: 'round-seed',
    name: 'Seed Round (Открыт для синдиката)',
    status: 'open',
    targetAmountUsd: 650000,
    raisedAmountUsd: 210000, // Committed
    valuationPreUsd: 4500000,
    valuationPostUsd: 5150000,
    instrument: 'SAFE / Convertible Note (20% Discount, $5M Cap) + Token Allocation Option',
    minTicketUsd: 25000,
    timeline: 'Q3 2026 – Q1 2027 (Активный сбор)',
    runwayMonths: 18,
    leadInvestors: 'LabForge Syndicate & Центрально-Азиатские бизнес-ангелы',
    keyUseOfFunds: [
      { label: 'R&D LabForge & PPG-биометрия', percent: 35, amountUsd: 227500 },
      { label: 'Открытие кофейни-лаунжа в Ташкенте', percent: 25, amountUsd: 162500 },
      { label: 'Масштабирование ретритов & Программа Корней', percent: 20, amountUsd: 130000 },
      { label: 'Институт, Эксперты & B2B EAP отдел', percent: 20, amountUsd: 130000 }
    ],
    strategicUnlocks: [
      'Выход на ежемесячную выручку $65k+ (MRR + Retreats)',
      'Собственный городской хаб с комнатой тишины в Ташкенте',
      'Запуск B2B корпоративных продаж и партнерств с банками и IT-сектором'
    ]
  },
  {
    id: 'round-series-a',
    name: 'Series A (Кампус & Международный Скейл)',
    status: 'projected',
    targetAmountUsd: 3000000,
    raisedAmountUsd: 0,
    valuationPreUsd: 18000000,
    valuationPostUsd: 21000000,
    instrument: 'Priced Preferred Equity (Series A)',
    minTicketUsd: 250000,
    timeline: 'Q1 – Q3 2028',
    runwayMonths: 24,
    leadInvestors: 'Международные HealthTech & Hospitality VC фонды (MENA, Europe, US)',
    keyUseOfFunds: [
      { label: 'Строительство кампуса EthOSium Sanctuary', percent: 55, amountUsd: 1650000 },
      { label: 'Экспансия: Алматы, Дубай, Тбилиси', percent: 25, amountUsd: 750000 },
      { label: 'Hardware EthOS Smart Ring R&D', percent: 12, amountUsd: 360000 },
      { label: 'Глобальный маркетинг & аккредитации', percent: 8, amountUsd: 240000 }
    ],
    strategicUnlocks: [
      'Собственная недвижимость в Чимгане стоимостью > $4.5M',
      'Международное присутствие на 3 ключевых рынках',
      'Подготовка к IPO или стратегическому поглощению'
    ]
  }
];

export const FINANCIAL_PROJECTIONS: FinancialMetricYear[] = [
  {
    year: '2026',
    revenueUsd: 110000,
    cogsUsd: 42000,
    opexUsd: 55000,
    ebitdaUsd: 13000,
    activeResidents: 650,
    retreatGuests: 85,
    supervisionsCount: 320
  },
  {
    year: '2027',
    revenueUsd: 580000,
    cogsUsd: 195000,
    opexUsd: 240000,
    ebitdaUsd: 145000,
    activeResidents: 4200,
    retreatGuests: 360,
    supervisionsCount: 1850
  },
  {
    year: '2028',
    revenueUsd: 2450000,
    cogsUsd: 780000,
    opexUsd: 890000,
    ebitdaUsd: 780000,
    activeResidents: 18500,
    retreatGuests: 1200,
    supervisionsCount: 7400
  },
  {
    year: '2029',
    revenueUsd: 7200000,
    cogsUsd: 2150000,
    opexUsd: 2400000,
    ebitdaUsd: 2650000,
    activeResidents: 62000,
    retreatGuests: 3100,
    supervisionsCount: 22000
  },
  {
    year: '2030',
    revenueUsd: 18500000,
    cogsUsd: 5400000,
    opexUsd: 5200000,
    ebitdaUsd: 7900000,
    activeResidents: 180000,
    retreatGuests: 7500,
    supervisionsCount: 65000
  }
];

export const INVESTOR_TIERS: InvestorTier[] = [
  {
    id: 'tier-supporter',
    name: 'Angel Supporter (Член Синдиката)',
    ticketUsd: 10000,
    equityTokensPct: '0.22% SAFE + 15,000 EthOS Credits',
    perks: [
      'Пожизненный VIP-статус в Закрытом Клубе Семерджиди',
      '1 бесплатное участие в горном ретрите Чимгана ежегодно',
      'Именная плакета в зале тишины Ташкентского лаунжа',
      'Ежеквартальный закрытый Zoom с Фаундерами и финансовой отчетностью'
    ],
    governanceRole: 'Информационные права & Доступ к закрытому синдикату'
  },
  {
    id: 'tier-angel',
    name: 'Key Angel Partner',
    ticketUsd: 25000,
    equityTokensPct: '0.55% SAFE + 40,000 EthOS Credits',
    perks: [
      'Все привилегии уровня Supporter для 2 человек (партнер/супруг)',
      '2 бесплатных ретрита в Чимгане в год с правом передачи близким',
      'Скидка 40% на любые дополнительные экспедиции и Программу Корней',
      'Приоритетный доступ к бронированию вилл в будущем кампусе 2028 года'
    ],
    governanceRole: 'Консультативный совет & Право первого инвестирования в Series A'
  },
  {
    id: 'tier-strategic',
    name: 'Strategic Lead Investor',
    ticketUsd: 100000,
    equityTokensPct: '2.20% SAFE / Equity + 200,000 EthOS Credits',
    perks: [
      'Именная резиденция-вилла в будущем Чимганском кампусе на 14 дней в году',
      'Безлимитный доступ ко всей инфраструктуре и спешелти кофейням',
      'Персональный консьерж здоровья и сопровождение Екатерины Семерджиди',
      'Право голоса при выборе ключевых международных локаций (Дубай/Бали)'
    ],
    governanceRole: 'Место наблюдателя в Совете Директоров (Board Observer Seat)'
  }
];
