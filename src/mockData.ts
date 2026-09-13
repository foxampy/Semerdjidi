import { CompanyNode, EcosystemModule, SemerdzhidiProfile, SocialPost, BusinessProcess, RealtimeTelemetryEvent } from './types';

export const INITIAL_COMPANIES: CompanyNode[] = [
  {
    id: 'comp-1',
    name: 'EthOSium Core Labs',
    industry: 'Глубокие нейротехнологии и системные платформы',
    logo: '⚡',
    contours: ['public', 'corporate', 'sovereign'],
    membersCount: 142,
    processHealth: 94,
    synergyLevel: 89,
    activeWorkflows: 28,
    description: 'Центральное архитектурное ядро единой операционной экосистемы EthOSium.'
  },
  {
    id: 'comp-2',
    name: 'Институт Типологии Семерджиди',
    industry: 'Когнитивная психология, синергетика команд & HR-ИИ',
    logo: '🧠',
    contours: ['corporate', 'sovereign'],
    membersCount: 56,
    processHealth: 98,
    synergyLevel: 96,
    activeWorkflows: 14,
    description: 'Разработчики фундаментальной психологической модели и алгоритмов гармонизации команд.'
  },
  {
    id: 'comp-3',
    name: 'NeuroDynamics Enterprise',
    industry: 'Промышленная автоматизация и смарт-логистика',
    logo: '🌐',
    contours: ['public', 'corporate'],
    membersCount: 310,
    processHealth: 86,
    synergyLevel: 81,
    activeWorkflows: 45,
    description: 'Масштабный промышленный контур с распределенными филиалами и B2B цепочками.'
  }
];

export const INITIAL_MODULES: EcosystemModule[] = [
  {
    id: 'mod-semerdjidi',
    code: 'SEM-PSY',
    title: 'Модуль Семерджиди',
    category: 'intelligence',
    contourScope: ['corporate', 'sovereign'],
    icon: 'BrainCircuit',
    status: 'active',
    description: 'Глубокая психологическая типология, синергия команд, предиктивное предотвращение выгорания.',
    usageMetric: '99.4% резонанс',
    activeUsersNow: 418
  },
  {
    id: 'mod-ai-analytics',
    code: 'AI-ANALYTICS',
    title: 'ИИ-Оптимизатор Процессов',
    category: 'intelligence',
    contourScope: ['public', 'corporate', 'sovereign'],
    icon: 'Sparkles',
    status: 'active',
    description: 'Анализ пропускной способности, устранение узких мест в реальном времени с помощью нейросетей.',
    usageMetric: '1.2k опер/мин',
    activeUsersNow: 892
  },
  {
    id: 'mod-social-network',
    code: 'ETHOS-PULSE',
    title: 'Корпоративная Соцсеть & Пульс',
    category: 'collaboration',
    contourScope: ['public', 'corporate'],
    icon: 'Share2',
    status: 'active',
    description: 'Единая среда профессионального взаимодействия, обмен инсайтами и умный нетворкинг по психотипам.',
    usageMetric: '4.8k сообщений/день',
    activeUsersNow: 640
  },
  {
    id: 'mod-circuit-router',
    code: 'MESH-ROUTER',
    title: 'Контурный Шлюз Безопасности',
    category: 'core',
    contourScope: ['public', 'corporate', 'sovereign'],
    icon: 'ShieldCheck',
    status: 'synced',
    description: 'Бесшовная изоляция и прозрачный защищенный обмен данными между публичным и закрытым контурами.',
    usageMetric: 'Zero-Trust активен',
    activeUsersNow: 1250
  },
  {
    id: 'mod-workflows',
    code: 'WORKFLOWS-FLOW',
    title: 'Смарт-Процессы и Задачи',
    category: 'governance',
    contourScope: ['corporate'],
    icon: 'Workflow',
    status: 'active',
    description: 'Автономная маршрутизация бизнес-задач с подбором исполнителей по профилю Семерджиди.',
    usageMetric: '184 активных потока',
    activeUsersNow: 512
  },
  {
    id: 'mod-vault-knowledge',
    code: 'VAULT-SEMANTIC',
    title: 'Семантическая База Знаний',
    category: 'governance',
    contourScope: ['corporate', 'sovereign'],
    icon: 'BookOpenCheck',
    status: 'synced',
    description: 'Умный корпоративный репозиторий со сквозным поиском регламентов и документов контура.',
    usageMetric: '12.4k документов',
    activeUsersNow: 310
  }
];

export const INITIAL_PROFILES: SemerdzhidiProfile[] = [
  {
    id: 'prof-1',
    name: 'Валентина Семерджиди',
    role: 'Главный методолог & Архитектор психосистемы',
    company: 'Институт Типологии Семерджиди',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    dominantType: 'Архитектор Смыслов (Тип I: Стратег-Визионер)',
    vectors: {
      visionary: 95,
      stabilizer: 62,
      harmonizer: 88,
      auditor: 76
    },
    burnoutRisk: 'Низкий',
    synergyScore: 98,
    emotionalEnergy: 92,
    contourClearance: ['public', 'corporate', 'sovereign'],
    cognitiveStyle: 'Концептуально-синтезирующий стиль, мгновенная калибровка межличностного доверия.',
    coachingRecommendations: [
      'Сохранять автономный суверенный контур для написания методологических трудов',
      'Делегировать операционную рутину стабилизаторам контура'
    ],
    recentStateChange: 'Калибровка нового контура завершена успешно'
  },
  {
    id: 'prof-2',
    name: 'Александр Морозов',
    role: 'Технический директор платформы EthOSium',
    company: 'EthOSium Core Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    dominantType: 'Стабилизатор Контура (Тип II: Системный Оператор)',
    vectors: {
      visionary: 72,
      stabilizer: 94,
      harmonizer: 65,
      auditor: 89
    },
    burnoutRisk: 'Умеренный',
    synergyScore: 91,
    emotionalEnergy: 79,
    contourClearance: ['corporate', 'sovereign'],
    cognitiveStyle: 'Высокая структурная надежность, алгоритмическое мышление, предотвращение сбоев.',
    coachingRecommendations: [
      'Проводить регулярные фазы отдыха между масштабными релизными циклами',
      'Повысить вовлечение эмпатических фасилитаторов на ретроспективах'
    ],
    recentStateChange: 'Завершена оптимизация микросервисов'
  },
  {
    id: 'prof-3',
    name: 'Елена Василенко',
    role: 'Лидер кросс-функциональной команды & HR-партнер',
    company: 'EthOSium Core Labs',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    dominantType: 'Гармонизатор Среды (Тип III: Эмпатийный Катализатор)',
    vectors: {
      visionary: 68,
      stabilizer: 70,
      harmonizer: 96,
      auditor: 60
    },
    burnoutRisk: 'Низкий',
    synergyScore: 95,
    emotionalEnergy: 88,
    contourClearance: ['public', 'corporate'],
    cognitiveStyle: 'Высочайший эмоциональный интеллект, нейтрализация трений до их эскалации.',
    coachingRecommendations: [
      'Устанавливать персональные границы при высокой эмоциональной нагрузке команды',
      'Фиксировать договоренности в регламентах контура'
    ]
  },
  {
    id: 'prof-4',
    name: 'Дмитрий Корнеев',
    role: 'Ведущий аудитор безопасности & Архитектор ИИ',
    company: 'NeuroDynamics Enterprise',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    dominantType: 'Критический Аудитор (Тип IV: Контролер Целостности)',
    vectors: {
      visionary: 64,
      stabilizer: 82,
      harmonizer: 52,
      auditor: 96
    },
    burnoutRisk: 'Повышенный',
    synergyScore: 84,
    emotionalEnergy: 68,
    contourClearance: ['corporate', 'sovereign'],
    cognitiveStyle: 'Прецизионный анализ уязвимостей и выявление скрытых логических конфликтов.',
    coachingRecommendations: [
      'Снизить сверхурочную работу в суверенном контуре аудита',
      'Включить автоматические ИИ-триггеры оповещения вместо ручного мониторинга'
    ]
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'prof-1',
    authorName: 'Валентина Семерджиди',
    authorRole: 'Главный методолог',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    authorCompany: 'Институт Типологии Семерджиди',
    contour: 'public',
    timestamp: '14 минут назад',
    content: 'Завершили калибровку психо-модуля Семерджиди для интеграции в общую среду EthOSium! Теперь совместимость команд рассчитывается не по абстрактным тестам, а на основе реальной динамики взаимодействия в корпоративном контуре. Это снижает скрытые конфликты на 43%.',
    tags: ['#Семерджиди', '#EthOSium', '#ПсихологическаяСинергия', '#ИИ'],
    likes: 38,
    commentsCount: 9,
    semerdzhidiBadge: 'Резонанс 98%',
    resonanceScore: 98,
    attachments: [
      { type: 'metric', title: 'Снижение скрытых трений', value: '-43%' },
      { type: 'diagram', title: 'Векторная модель Семерджиди v2.4' }
    ]
  },
  {
    id: 'post-2',
    authorId: 'prof-2',
    authorName: 'Александр Морозов',
    authorRole: 'Технический директор',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    authorCompany: 'EthOSium Core Labs',
    contour: 'corporate',
    timestamp: '1 час назад',
    content: 'Включили сквозную ИИ-оптимизацию бизнес-процессов в реальном времени. Если система видит, что процесс согласования смарт-договора буксует на этапе юридического аудита, контур автоматически предлагает перераспределение задач с учетом когнитивной загрузки специалистов.',
    tags: ['#КонтурУправления', '#Процессы', '#RealtimeAI'],
    likes: 24,
    commentsCount: 5,
    semerdzhidiBadge: 'Стабильность 94%',
    resonanceScore: 91
  },
  {
    id: 'post-3',
    authorId: 'prof-3',
    authorName: 'Елена Василенко',
    authorRole: 'Лидер команды',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    authorCompany: 'EthOSium Core Labs',
    contour: 'sovereign',
    timestamp: '3 часа назад',
    content: 'Внимание всем участникам суверенного контура! В модуле Семерджиди открыта вкладка превентивной защиты от когнитивного выгорания. Пожалуйста, обратите внимание на персональные рекомендации по балансировке рабочих интервалов.',
    tags: ['#ЗдоровьеКоманды', '#СуверенныйКонтур', '#Энергия'],
    likes: 47,
    commentsCount: 12,
    semerdzhidiBadge: 'Психо-защита',
    resonanceScore: 95
  }
];

export const INITIAL_PROCESSES: BusinessProcess[] = [
  {
    id: 'proc-1',
    name: 'Кросс-контурное согласование корпоративных смарт-регламентов',
    companyId: 'comp-1',
    contour: 'corporate',
    status: 'warning',
    efficiencyScore: 68,
    throughput: '38 опер/час',
    latencyMs: 340,
    bottleneck: 'Ручная юридическая верификация в закрытом периметре',
    stages: [
      { name: 'Инициация в публичном контуре', durationMinutes: 12, dropoffRate: 3, psychologicalPressure: 2 },
      { name: 'Перевод через контурный шлюз', durationMinutes: 4, dropoffRate: 1, psychologicalPressure: 3 },
      { name: 'Юридический и психологический аудит', durationMinutes: 85, dropoffRate: 24, psychologicalPressure: 8 },
      { name: 'Финализация и фиксация в Vault', durationMinutes: 15, dropoffRate: 4, psychologicalPressure: 4 }
    ],
    aiRecommendation: 'Рекомендуется распараллелить аудит с предиктивным ИИ-скорингом и автоматическим назначением эксперта-стабилизатора.',
    lastOptimized: '2 часа назад'
  },
  {
    id: 'proc-2',
    name: 'Адаптация и психо-профилирование ключевых лидеров команд',
    companyId: 'comp-2',
    contour: 'sovereign',
    status: 'optimal',
    efficiencyScore: 94,
    throughput: '12 профилей/день',
    latencyMs: 120,
    bottleneck: 'Отсутствует (синхронизация эталонная)',
    stages: [
      { name: 'Снятие первичных векторов Семерджиди', durationMinutes: 20, dropoffRate: 0, psychologicalPressure: 2 },
      { name: 'ИИ-калибровка совместимости с командой', durationMinutes: 5, dropoffRate: 0, psychologicalPressure: 1 },
      { name: 'Формирование персонального вектора роста', durationMinutes: 30, dropoffRate: 2, psychologicalPressure: 3 }
    ],
    aiRecommendation: 'Процесс функционирует на проектной мощности. Рекомендуется подключить автоматический трекинг стрессоустойчивости.',
    lastOptimized: 'Вчера'
  },
  {
    id: 'proc-3',
    name: 'Маршрутизация B2B поставок и транзакций в enterprise-контуре',
    companyId: 'comp-3',
    contour: 'public',
    status: 'optimal',
    efficiencyScore: 88,
    throughput: '240 транзакций/мин',
    latencyMs: 65,
    bottleneck: 'Периодическая задержка обновления публичного API',
    stages: [
      { name: 'Валидация запроса партнера', durationMinutes: 2, dropoffRate: 2, psychologicalPressure: 1 },
      { name: 'Квантово-стойкая крипто-подпись', durationMinutes: 1, dropoffRate: 0, psychologicalPressure: 1 },
      { name: 'Проведение через mesh-маршрутизатор', durationMinutes: 3, dropoffRate: 4, psychologicalPressure: 2 }
    ],
    aiRecommendation: 'Кэширование открытых метаданных в edge-узлах публичного контура.',
    lastOptimized: '30 минут назад'
  }
];

export const INITIAL_TELEMETRY: RealtimeTelemetryEvent[] = [
  {
    id: 'tel-1',
    timestamp: '11:42:05',
    type: 'ai_optimization',
    title: 'ИИ устранил задержку шлюза',
    contour: 'corporate',
    description: 'Оптимизирован буфер обмена между контурами EthOSium. Задержка сократилась на 18%.',
    impactScore: '+18% скор.'
  },
  {
    id: 'tel-2',
    timestamp: '11:40:18',
    type: 'semerdjidi_alert',
    title: 'Калибровка синергии команды №3',
    contour: 'sovereign',
    description: 'Модуль Семерджиди зафиксировал пиковое согласие векторов при планировании спринта (индекс 96%).',
    impactScore: '96% синергия'
  },
  {
    id: 'tel-3',
    timestamp: '11:38:50',
    type: 'contour_sync',
    title: 'Синхронизация контуров',
    contour: 'public',
    description: 'Бесшовная передача смарт-договоров из публичной соцсети в закрытый реестр предприятия.',
    impactScore: 'Zero-Trust OK'
  },
  {
    id: 'tel-4',
    timestamp: '11:35:12',
    type: 'social_pulse',
    title: 'Всплеск профессионального нетворкинга',
    contour: 'public',
    description: '14 новых кросс-компанейских проектных групп сформированы по матрице Семерджиди.',
    impactScore: '+14 команд'
  }
];
