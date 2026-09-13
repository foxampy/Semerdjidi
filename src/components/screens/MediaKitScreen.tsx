import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

// Generated photorealistic assets
import chimganRetreatImg from '../../assets/images/chimgan_mountain_retreat_1789033585196.jpg';
import modernVillaImg from '../../assets/images/modern_mountain_villa_1789033603366.jpg';
import equestrianTrailImg from '../../assets/images/equestrian_mountain_trail_1789033620589.jpg';
import charvakLakeImg from '../../assets/images/charvak_lake_mindfulness_1789033638947.jpg';

interface MediaKitScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export type ModuleCategory = 
  | 'all'
  | 'realting_style'
  | 'retreats'
  | 'psychology'
  | 'taglit'
  | 'labforge'
  | 'coffee'
  | 'b2b';

interface PromoCardItem {
  id: string;
  moduleName: string;
  category: ModuleCategory;
  title: string;
  format: string;
  dimensions: string;
  recommendedPlacement: string;
  headline: string;
  subheadline: string;
  description: string;
  ctaText: string;
  targetScreen: ActiveScreen;
  utmCampaign: string;
  imageSrc: string;
  imageAlt: string;
  isRealtingStyle?: boolean;
  propertyMeta?: {
    location: string;
    altitude: string;
    objectType: string;
    priceBadge: string;
    verified: boolean;
    rating: string;
    idCode: string;
  };
  badges: string[];
}

export const MediaKitScreen: React.FC<MediaKitScreenProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'specs'>('visual');
  const [realtingThemeMode, setRealtingThemeMode] = useState<'realting_portal' | 'ethosium_dark'>('realting_portal');
  const [interactiveWidgetScore, setInteractiveWidgetScore] = useState<number | null>(null);

  const PROMO_ITEMS: PromoCardItem[] = [
    // 1. REALTING.UZ STYLE: Leaderboard Header Banner (970x250)
    {
      id: 'realting-billboard-970',
      moduleName: 'Спецпартнерство: Realting.uz • Недвижимость & Инвестиции',
      category: 'realting_style',
      title: 'Realting Leaderboard / Супер-баннер в шапку портала',
      format: 'Десктопный премиум-билборд (Realting Style)',
      dimensions: '970 × 250 px / 728 × 90 px',
      recommendedPlacement: 'Главная страница Realting.uz, шапка каталога «Элитная недвижимость & Виллы Чарвака»',
      headline: 'Инвестируйте в ясность ума: 24h перезагрузка в горах Чимгана',
      subheadline: 'Преодоление выгорания для инвесторов и предпринимателей. 75 минут от Ташкента.',
      description: 'Выездной психологический ретрит Семерджиди: деконструкция гиперконтроля, юнгианская работа с Тенью, иппотерапия-зеркало и чистейший воздух Тянь-Шаня 1200м над уровнем суеты.',
      ctaText: 'Забронировать 24ч ретрит (-50%)',
      targetScreen: 'retreats',
      utmCampaign: 'realting_billboard_leaderboard',
      imageSrc: modernVillaImg,
      imageAlt: 'Современная горная вилла в Чимгане с панорамным видом на Чарвак',
      isRealtingStyle: true,
      propertyMeta: {
        location: 'Чимган & Чарвакское ущелье',
        altitude: '1200м над у.м.',
        objectType: 'Эко-резиденция & Лодж',
        priceBadge: 'от $120 / слот',
        verified: true,
        rating: '5.0 (58 отзывов)',
        idCode: 'RLT-ETH-970'
      },
      badges: ['Realting Verified', '75 мин от Ташкента', 'Скидка 50%']
    },

    // 2. REALTING.UZ STYLE: Property Listing Tile (300x250)
    {
      id: 'realting-listing-tile-300',
      moduleName: 'Спецпартнерство: Realting.uz • Листинг объектов',
      category: 'realting_style',
      title: 'Карточка-лот в каталог загородных вилл Realting.uz',
      format: 'Medium Rectangle / Плитка объекта недвижимости',
      dimensions: '300 × 250 px',
      recommendedPlacement: 'Листинг элитных дач, участков и коттеджных поселков (Бостанлык, Чимган, Бричмулла)',
      headline: 'Купить дачу в горах просто. Сложнее — не сгореть на сделках.',
      subheadline: 'Модульный психологический ретрит в Чимгане & Чарваке',
      description: 'Не ждите окончания стройки. Восстановите нервную систему в ближайшие выходные: баня, сапы на закатном Чарваке, конный трек и личный разбор с психоаналитиком.',
      ctaText: 'Выбрать модуль в конструкторе',
      targetScreen: 'retreats',
      utmCampaign: 'realting_listing_card_property',
      imageSrc: chimganRetreatImg,
      imageAlt: 'Горы Чимгана и природный лодж ретрита',
      isRealtingStyle: true,
      propertyMeta: {
        location: 'Бостанлыкский р-н, Чимган',
        altitude: '1250м',
        objectType: 'Психологический ретрит',
        priceBadge: '$120 - $360',
        verified: true,
        rating: '4.98',
        idCode: 'RLT-LOT-300'
      },
      badges: ['Чарвак & Горы', '15 мест', 'Выходные 24h']
    },

    // 3. REALTING.UZ STYLE: Skyscraper Sidebar (300x600)
    {
      id: 'realting-skyscraper-300x600',
      moduleName: 'Спецпартнерство: Realting.uz • Сайдбар карточки объекта',
      category: 'realting_style',
      title: 'Небоскреб в карточку объекта и аналитику рынка',
      format: 'Вертикальный Half-page Skyscraper',
      dimensions: '300 × 600 px',
      recommendedPlacement: 'Правая колонка на страницах объявлений недвижимости стоимостью от $100,000+',
      headline: 'Выгорание — не лень. Это потеря контакта с глубинным Я.',
      subheadline: 'Психологический оазис для фаундеров, девелоперов и инвесторов',
      description: 'Сенсорный детокс на высоте 1200м над смогом Ташкента. Проработка синдрома самозванца, освобождение от токсичного гиперконтроля и возврат жизненной энергии.',
      ctaText: 'Пройти тест на выгорание',
      targetScreen: 'onboarding',
      utmCampaign: 'realting_sidebar_skyscraper',
      imageSrc: equestrianTrailImg,
      imageAlt: 'Конный трек по альпийским тропам Чимгана',
      isRealtingStyle: true,
      propertyMeta: {
        location: 'Западный Тянь-Шань',
        altitude: 'Высокогорье 1200м',
        objectType: 'Закрытый ретрит',
        priceBadge: 'Скидка 50%',
        verified: true,
        rating: '5.0',
        idCode: 'RLT-SKY-600'
      },
      badges: ['Анти-выгорание', 'Тест за 2 мин', 'Промокод REALTING-50']
    },

    // 4. REALTING.UZ STYLE: Sponsored Article / Editorial (1200x628)
    {
      id: 'realting-editorial-1200x628',
      moduleName: 'Спецпартнерство: Realting.uz • Журнал & Аналитика',
      category: 'realting_style',
      title: 'Спонсорская публикация в журнал Realting Lifestyle',
      format: 'Нативная статья / Превью для соцсетей',
      dimensions: '1200 × 628 px',
      recommendedPlacement: 'Раздел «Стиль жизни, инвестиции и психология бизнеса» на портале Realting.uz',
      headline: '«Я заработал миллион, но потерял сон»: Как инвесторам преодолеть эмоциональное выгорание',
      subheadline: 'Исследование психоаналитиков и опыт 24-часовых горных ретритов в Чимгане',
      description: 'Почему классический пассивный отдых у бассейна не восстанавливает когнитивный ресурс лидеров и как работает глубокая психоаналитическая пересборка в ущельях Тянь-Шаня.',
      ctaText: 'Читать спецпроект и программу',
      targetScreen: 'retreats',
      utmCampaign: 'realting_editorial_native_article',
      imageSrc: charvakLakeImg,
      imageAlt: 'Закатный сап-бординг на Чарваке в лучах заходящего солнца',
      isRealtingStyle: true,
      propertyMeta: {
        location: 'Ташкент • Чимган',
        altitude: 'Исследование',
        objectType: 'Спецпроект Семерджиди',
        priceBadge: 'Свободный доступ',
        verified: true,
        rating: 'Мастрид',
        idCode: 'RLT-ED-1200'
      },
      badges: ['Realting Media', 'Психоанализ', 'Кейсы предпринимателей']
    },

    // 5. МОДУЛЬ: Горные ретриты & Конструктор 24h
    {
      id: 'promo-retreats-24h-modular',
      moduleName: 'Направление: Горные Ретриты & Точка Сборки',
      category: 'retreats',
      title: 'Модульный ретрит-конструктор Чимган & Чарвак (15 мест)',
      format: 'Интерактивный промо-блок конструктора',
      dimensions: '800 × 450 px',
      recommendedPlacement: 'Каталоги мероприятий, тревел-порталы, сообщества предпринимателей',
      headline: '24 часа в горах Чимгана: Собери свой персональный ретрит',
      subheadline: 'От $120 за базовое проживание и пешие тропы до $360 за полный VIP-пакет',
      description: 'Выбирайте то, что нужно именно вам: конные тропы доверия, семинары Семерджиди, сапы на закатном Чарваке, поездка на УАЗах к горному водопаду или индивидуальная супервизия.',
      ctaText: 'Собрать программу в конструкторе',
      targetScreen: 'retreats',
      utmCampaign: 'promo_retreat_constructor_modular',
      imageSrc: chimganRetreatImg,
      imageAlt: 'Чимган ретрит горы и природа',
      badges: ['Конструктор от $120', 'Выходные 24h', '15 мест']
    },

    // 6. МОДУЛЬ: Психологический контур & Институт Семерджиди
    {
      id: 'promo-psychology-institute',
      moduleName: 'Направление: Институт Психологии & Супервизия',
      category: 'psychology',
      title: 'Каталог 50 аккредитованных специалистов & Супервизия',
      format: 'Промо-карточка психологического сервиса',
      dimensions: '600 × 600 px (Квадрат)',
      recommendedPlacement: 'Профильные HR-платформы, корпоративные программы EAP, медицинские порталы',
      headline: 'Профессиональная психотерапия и супервизия Семерджиди',
      subheadline: '50 верифицированных психологов, психоаналитиков и телесных терапевтов',
      description: 'Строгая аккредитация, персональный подбор специалиста по результатам диагностического теста, защищенный конфиденциальный мессенджер и супервизорский надзор.',
      ctaText: 'Подобрать специалиста',
      targetScreen: 'experts',
      utmCampaign: 'promo_psychology_experts_catalog',
      imageSrc: equestrianTrailImg,
      imageAlt: 'Терапевтическое доверие и психологическое спокойствие',
      badges: ['50 Экспертов', 'EAP Мессенджер', 'Научный контур']
    },

    // 7. МОДУЛЬ: Программа Корней & Экспедиции (Таглит / Маса)
    {
      id: 'promo-taglit-roots-expedition',
      moduleName: 'Направление: Программа Корней & Экспедиции Идентичности',
      category: 'taglit',
      title: 'Культурно-исследовательская программа «Таглит & Маса: Корни»',
      format: 'Ландшафтный промо-баннер экспедиции',
      dimensions: '1200 × 500 px (Панорама)',
      recommendedPlacement: 'Международные молодежные фонды, диаспоральные сообщества, культурные центры',
      headline: '10 дней переоткрытия своих корней на Шелковом Пути',
      subheadline: 'Самарканд • Бухара • Западный Тянь-Шань • Ташкент',
      description: 'Грантовая программа для молодежи 18-32 лет. Глубокое погружение в историю предков, созерцание памятников ЮНЕСКО, высокогорные стоянки и психологические рефлексивные круги.',
      ctaText: 'Подать заявку на грант',
      targetScreen: 'retreats',
      utmCampaign: 'promo_taglit_roots_heritage',
      imageSrc: modernVillaImg,
      imageAlt: 'Культурная экспедиция и горная резиденция',
      badges: ['Гранты до 100%', 'Самарканд & Бухара', '10 Дней']
    },

    // 8. МОДУЛЬ: LabForge R&D & Технологический контур
    {
      id: 'promo-labforge-tech',
      moduleName: 'Направление: LabForge • R&D Лаборатория & Нейроинтерфейсы',
      category: 'labforge',
      title: 'LabForge: Биометрия, архитектура и системная интеграция здоровья',
      format: 'Технологический баннер для IT и фаундеров',
      dimensions: '800 × 400 px',
      recommendedPlacement: 'IT-парки, технологические медиа, венчурные клубы, каналы стартапов',
      headline: 'Нейро-оптимизация стресса: Данные вместо догадок',
      subheadline: 'Аппаратная диагностика вегетативного баланса, протоколы 432 Hz и биометрия',
      description: 'Исследовательское подразделение EthOSium: разработка протоколов сна, мониторинг вариабельности сердечного ритма (HRV) и системный консалтинг для технологических лидеров.',
      ctaText: 'Изучить разработки LabForge',
      targetScreen: 'labforge',
      utmCampaign: 'promo_labforge_rnd_systems',
      imageSrc: charvakLakeImg,
      imageAlt: 'Нейробаланс и биометрические технологии покоя',
      badges: ['R&D Lab', 'HRV Биометрия', 'Нейро-протоколы']
    },

    // 9. МОДУЛЬ: Кофейня EthOSium & Чайный Лаунж
    {
      id: 'promo-coffee-lounge',
      moduleName: 'Направление: Резиденция в Ташкенте • Кофейня & Чайная комната',
      category: 'coffee',
      title: 'EthOSium Lounge: Спешелти кофе, чайные церемонии и покой в центре города',
      format: 'Атмосферный промо-пост для городских медиа',
      dimensions: '600 × 600 px',
      recommendedPlacement: 'Городские афиши Ташкента, гастрономические гиды, коворкинг-сообщества',
      headline: 'Оазис тишины и вкуса в центре Ташкента',
      subheadline: 'Спешелти кофе свежей обжарки, редкие высокогорные чаи и зона созерцания',
      description: 'Место встречи резидентов экосистемы Семерджиди: без суеты, с правильной акустикой, органическими десертами и библиотекой психологических трудов.',
      ctaText: 'Заглянуть в кофейню',
      targetScreen: 'coffee',
      utmCampaign: 'promo_coffee_lounge_tashkent',
      imageSrc: modernVillaImg,
      imageAlt: 'Уютный интерьер кофейни и чайной комнаты',
      badges: ['Спешелти Кофе', 'Чайная Мауна', 'Ташкент']
    },

    // 10. МОДУЛЬ: Корпоративный B2B контур для девелоперов и компаний
    {
      id: 'promo-b2b-corporate',
      moduleName: 'Направление: B2B • Командная психологическая устойчивость',
      category: 'b2b',
      title: 'B2B Корпоративные ретриты для топ-менеджмента и отделов продаж',
      format: 'Широкий корпоративный баннер',
      dimensions: '1200 × 300 px (Панорама)',
      recommendedPlacement: 'Деловые издания (Spot.uz, Gazeta.uz), ассоциации девелоперов, B2B платформы',
      headline: 'Спасите команду от выгорания: Стратегический горный ретрит в Чимгане',
      subheadline: 'Психологический аудит климата компании, снятие эмоционального выгорания руководителей',
      description: 'Корпоративный выезд без алкоголя и банальных конкурсов. Реальное восстановление работоспособности, фасилитация скрытых конфликтов и заряд энергией гор.',
      ctaText: 'Запросить B2B презентацию',
      targetScreen: 'booking',
      utmCampaign: 'promo_b2b_corporate_retreat',
      imageSrc: chimganRetreatImg,
      imageAlt: 'Горный корпоративный выезд и стратегическая сессия',
      badges: ['B2B Контракт', 'Команды от 8 чел', 'Нейроаудит']
    }
  ];

  const filteredItems = selectedCategory === 'all'
    ? PROMO_ITEMS
    : PROMO_ITEMS.filter(item => item.category === selectedCategory);

  const handleCopyText = (item: PromoCardItem) => {
    const textToCopy = `ПРОМО-МАТЕРИАЛ ЭКОСИСТЕМЫ СЕМЕРДЖИДИ & ETHOSIUM:
Модуль: ${item.moduleName}
Формат: ${item.title} (${item.dimensions})
Площадка: ${item.recommendedPlacement}

Заголовок: ${item.headline}
Подзаголовок: ${item.subheadline}
Текст: ${item.description}
CTA: ${item.ctaText}

Ссылка с UTM:
https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=partner&utm_medium=banner&utm_campaign=${item.utmCampaign}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyHtml = (item: PromoCardItem) => {
    const isRealting = item.isRealtingStyle;
    const htmlCode = isRealting
      ? `<!-- Realting.uz Partner Banner: ${item.title} -->
<div style="max-width:${item.dimensions.includes('970') ? '970px' : '600px'};border:1px solid #1E293B;border-radius:12px;overflow:hidden;background:#0F172A;font-family:Inter,system-ui,sans-serif;box-shadow:0 10px 25px rgba(0,0,0,0.3);color:#F8FAFC;">
  <div style="display:flex;flex-wrap:wrap;background:#1E293B;padding:8px 16px;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="background:#1179EC;color:#FFF;font-weight:800;font-size:11px;padding:2px 8px;border-radius:4px;letter-spacing:0.5px;">REALTING PARTNER</span>
      <span style="font-size:11px;color:#94A3B8;">${item.propertyMeta?.location || 'Чимган'}</span>
    </div>
    <span style="color:#F6D200;font-weight:700;font-size:12px;">${item.propertyMeta?.priceBadge || 'от $120'}</span>
  </div>
  <div style="padding:20px;">
    <h3 style="margin:0 0 8px 0;font-size:18px;line-height:1.3;color:#FFFFFF;">${item.headline}</h3>
    <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#CBD5E1;">${item.description}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:11px;color:#06B6D4;font-weight:600;">✓ Проверено экспертами Realting</span>
      <a href="https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=realting.uz&utm_medium=banner&utm_campaign=${item.utmCampaign}" target="_blank" rel="noopener noreferrer" style="background:#1179EC;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;display:inline-block;">${item.ctaText} &rarr;</a>
    </div>
  </div>
</div>`
      : `<!-- EthOSium Ecosystem Promo: ${item.title} -->
<div style="max-width:640px;background:#24271c;border:1px solid #BA9470;border-radius:14px;padding:20px;font-family:system-ui,sans-serif;color:#F0E2C8;">
  <span style="font-size:10px;text-transform:uppercase;color:#BA9470;font-weight:700;letter-spacing:1px;">${item.moduleName}</span>
  <h3 style="margin:8px 0;font-size:18px;color:#FFFDF8;">${item.headline}</h3>
  <p style="margin:6px 0 14px 0;font-size:12px;color:#A9B489;line-height:1.5;">${item.description}</p>
  <a href="https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=partner&utm_medium=banner&utm_campaign=${item.utmCampaign}" target="_blank" rel="noopener noreferrer" style="background:#BA9470;color:#24271c;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:700;display:inline-block;">${item.ctaText} &rarr;</a>
</div>`;

    navigator.clipboard.writeText(htmlCode);
    setCopiedCodeId(item.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleExportFullKitJson = () => {
    const fullKit = {
      title: 'Медиа-кит & Промо-центр Экосистемы Семерджиди & EthOSium',
      exportDate: new Date().toISOString(),
      modulesCovered: [
        'Горные ретриты Чимган & Чарвак (24h конструктор)',
        'Психологический контур & Институт Семерджиди',
        'Программа Корней Таглит & Маса',
        'LabForge R&D & Биометрия',
        'Спешелти Кофейня & Чайный Лаунж EthOSium',
        'Корпоративный B2B контур',
        'Спецпартнерство Realting.uz (Недвижимость & Инвестиции)'
      ],
      totalPromoItems: PROMO_ITEMS.length,
      items: PROMO_ITEMS.map(item => ({
        id: item.id,
        module: item.moduleName,
        category: item.category,
        format: item.title,
        dimensions: item.dimensions,
        recommendedPlacement: item.recommendedPlacement,
        headline: item.headline,
        subheadline: item.subheadline,
        description: item.description,
        cta: item.ctaText,
        directUrl: `https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=partner&utm_medium=banner&utm_campaign=${item.utmCampaign}`
      }))
    };

    const blob = new Blob([JSON.stringify(fullKit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethosium-full-media-kit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-24 px-4 pt-4 max-w-5xl mx-auto">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#A9B489]">
            <button onClick={() => onNavigate('feed')} className="hover:text-[#F0E2C8]">Главная</button>
            <span>/</span>
            <button onClick={() => onNavigate('retreats')} className="hover:text-[#F0E2C8]">Ретриты</button>
            <span>/</span>
            <span className="text-[#BA9470] font-bold">Медиа-кит &amp; Промо-центр</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('admin')}
              className="neu-btn px-3 py-1 rounded-lg text-xs font-bold text-[#BA9470] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Админка
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="neu-card rounded-2xl p-6 border border-[#BA9470]/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-full border border-[#BA9470]/30">
                  Официальный Медиа-Кит Экосистемы
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Все Модули &amp; Направления
                </span>
                <span className="text-[10px] font-mono text-[#1179EC] bg-blue-950/50 px-2 py-0.5 rounded border border-blue-500/30">
                  Стиль Realting.uz Включен
                </span>
              </div>

              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] leading-tight">
                Медиа-кит &amp; Промо-центр: Баннеры, Визуализации и Материалы
              </h1>

              <p className="text-xs text-[#A9B489] leading-relaxed">
                Единый центр промо-материалов по всем контурам экосистемы: горный ретрит-конструктор в Чимгане &amp; Чарваке, супервизия Семерджиди, экспедиции Таглит/Маса, R&amp;D лаборатория LabForge, спешелти кофейня и специализированные баннеры в фирменном стиле портала недвижимости <strong>Realting.uz</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={handleExportFullKitJson}
                className="py-2.5 px-4 rounded-xl neu-btn text-xs font-bold text-[#F0E2C8] border border-[#BA9470]/50 hover:border-[#BA9470] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[18px] text-[#BA9470]">download</span>
                Скачать весь медиа-кит (JSON)
              </button>
              <button
                onClick={() => onNavigate('retreats')}
                className="py-2.5 px-4 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/30 hover:border-[#BA9470] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Открыть конструктор ретрита
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Module Direction Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A9B489]">
            Выберите направление экосистемы:
          </span>
          <div className="flex items-center gap-1 neu-inset p-1 rounded-xl">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'visual' ? 'neu-pill-active text-[#F0E2C8] font-bold' : 'text-[#A9B489]'
              }`}
            >
              Макеты &amp; Фото
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'code' ? 'neu-pill-active text-[#F0E2C8] font-bold' : 'text-[#A9B489]'
              }`}
            >
              HTML Сниппеты
            </button>
            <button
              onClick={() => setViewMode('specs')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'specs' ? 'neu-pill-active text-[#F0E2C8] font-bold' : 'text-[#A9B489]'
              }`}
            >
              Спецификации
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Все направления (10)', icon: 'grid_view' },
            { id: 'realting_style', label: 'Стиль Realting.uz (Недвижимость)', icon: 'apartment', special: true },
            { id: 'retreats', label: 'Горные Ретриты 24h', icon: 'landscape' },
            { id: 'psychology', label: 'Институт & Супервизия', icon: 'psychology' },
            { id: 'taglit', label: 'Программа Корней (Таглит)', icon: 'public' },
            { id: 'labforge', label: 'LabForge R&D & Tech', icon: 'precision_manufacturing' },
            { id: 'coffee', label: 'Кофейня & Лаунж', icon: 'local_cafe' },
            { id: 'b2b', label: 'B2B Корпоративный', icon: 'business_center' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as ModuleCategory)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === tab.id
                  ? tab.special
                    ? 'bg-[#1179EC] text-white font-bold shadow-lg ring-2 ring-[#06B6D4]/50'
                    : 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/60 font-bold'
                  : tab.special
                    ? 'neu-btn text-[#1179EC] font-semibold border border-[#1179EC]/40 hover:bg-[#1179EC]/10'
                    : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Realting.uz Style Indicator & Switcher if Realting category selected */}
      {(selectedCategory === 'realting_style' || selectedCategory === 'all') && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border-2 border-[#1179EC]/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1179EC] text-white flex items-center justify-center font-bold text-lg shadow">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">
                  Фирменный дизайн Realting.uz (Недвижимость &amp; Инвестиции)
                </span>
                <span className="text-[10px] uppercase font-bold bg-[#F6D200] text-slate-900 px-2 py-0.5 rounded">
                  Active Style
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Палитра Classic Navy (#1E293B), Electric Blue (#1179EC), Teal (#06B6D4) и Speed Gold (#F6D200). Геометрия лотов, бейджи локации, высоты и верификации.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-slate-400">Режим показа:</span>
            <button
              onClick={() => setRealtingThemeMode(realtingThemeMode === 'realting_portal' ? 'ethosium_dark' : 'realting_portal')}
              className="px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-xs font-semibold text-[#38BDF8] flex items-center gap-1 border border-slate-600 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">palette</span>
              <span>{realtingThemeMode === 'realting_portal' ? 'Стиль Realting.uz' : 'Стиль EthOSium'}</span>
            </button>
          </div>
        </div>
      )}

      {/* BANNERS LIST */}
      <div className="flex flex-col gap-8">
        {filteredItems.map((item, idx) => {
          const isRealting = item.isRealtingStyle;
          const usePortalSkin = isRealting && realtingThemeMode === 'realting_portal';

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 sm:p-6 transition-all shadow-xl flex flex-col gap-4 relative overflow-hidden ${
                usePortalSkin
                  ? 'bg-[#0F172A] border-2 border-[#1E293B] text-slate-100 ring-1 ring-[#1179EC]/30'
                  : 'neu-card border border-[#BA9470]/30 text-[#F0E2C8]'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    usePortalSkin ? 'bg-[#1179EC] text-white' : 'neu-btn text-[#BA9470]'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        usePortalSkin ? 'bg-[#1E293B] text-[#38BDF8]' : 'text-[#BA9470] bg-[#BA9470]/10'
                      }`}>
                        {item.moduleName}
                      </span>
                      {isRealting && (
                        <span className="text-[10px] font-bold bg-[#F6D200] text-slate-900 px-1.5 py-0.2 rounded">
                          Realting Style
                        </span>
                      )}
                    </div>
                    <h3 className={`font-headline font-bold text-base sm:text-lg mt-0.5 ${
                      usePortalSkin ? 'text-white' : 'text-[#F0E2C8]'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Размер: <span className="font-mono font-bold text-slate-200">{item.dimensions}</span> • {item.format}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopyText(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 active:scale-95 transition-all ${
                      usePortalSkin
                        ? 'bg-[#1E293B] hover:bg-[#334155] text-slate-200 border border-slate-700'
                        : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copiedId === item.id ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedId === item.id ? 'Скопировано!' : 'Копировать текст'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyHtml(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                      usePortalSkin
                        ? 'bg-[#1179EC] hover:bg-blue-600 text-white shadow'
                        : 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copiedCodeId === item.id ? 'done_all' : 'code'}
                    </span>
                    <span>{copiedCodeId === item.id ? 'HTML готов!' : 'Код для сайта'}</span>
                  </button>
                </div>
              </div>

              {/* Placement hint */}
              <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl ${
                usePortalSkin ? 'bg-[#1E293B]/70 text-slate-300' : 'bg-[#2b2e21]/80 text-[#A9B489]'
              }`}>
                <span className="material-symbols-outlined text-[16px] text-[#BA9470]">pin_drop</span>
                <span className="font-medium">Рекомендуемое размещение:</span>
                <span className="text-white/90 truncate">{item.recommendedPlacement}</span>
              </div>

              {/* VISUAL PREVIEW WITH REAL GENERATED PHOTOGRAPHY */}
              {viewMode === 'visual' && (
                <div className="w-full flex justify-center items-center py-2 overflow-x-auto">
                  {/* 1. Realting Leaderboard 970x250 Banner */}
                  {item.id === 'realting-billboard-970' && (
                    <div className="w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-[#1E293B] shadow-2xl bg-[#0F172A] text-white flex flex-col md:flex-row">
                      <div className="md:w-5/12 h-56 md:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30" />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-[#1179EC] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow">
                            REALTING VIP
                          </span>
                          <span className="bg-[#0D9488] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow">
                            1200м Чимган
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs text-white/90 font-medium block">Озеро Чарвак &amp; Чимган</span>
                          <span className="text-[10px] text-emerald-400 font-bold block">✓ Проверено экспертами</span>
                        </div>
                      </div>

                      <div className="p-5 md:p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-[#F6D200] font-bold">
                              Спецпроект: Борьба с выгоранием
                            </span>
                            <span className="text-xs font-mono font-bold bg-[#1E293B] px-2 py-0.5 rounded text-slate-300">
                              RLT-ETH-970
                            </span>
                          </div>
                          <h4 className="font-headline font-bold text-xl sm:text-2xl text-white leading-tight">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                          <div>
                            <span className="text-[10px] uppercase text-slate-400 block">Стоимость слота</span>
                            <span className="text-lg font-bold text-[#F6D200]">от $120 <span className="text-xs text-slate-400 line-through">$240</span></span>
                          </div>
                          <button
                            onClick={() => onNavigate(item.targetScreen)}
                            className="px-6 py-3 rounded-xl bg-[#1179EC] hover:bg-blue-600 text-white font-headline font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all text-center"
                          >
                            {item.ctaText} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Realting Listing Card 300x250 */}
                  {item.id === 'realting-listing-tile-300' && (
                    <div className="w-[320px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-[#0F172A] text-white flex flex-col text-left">
                      <div className="h-36 relative overflow-hidden">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 flex gap-1">
                          <span className="bg-[#1179EC] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                            REALTING ЛОТ
                          </span>
                          <span className="bg-[#F6D200] text-slate-900 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            -50%
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-white">
                          <span className="text-[11px] font-bold drop-shadow">Чимган &amp; Чарвак</span>
                          <span className="text-xs font-mono font-bold text-[#F6D200] bg-black/60 px-2 py-0.5 rounded">
                            $120 - $360
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-headline font-bold text-sm text-white leading-snug">
                            {item.headline}
                          </h4>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>15 мест • 24 часа</span>
                            <span className="text-teal-400 font-bold">★ 4.98 (58 отзывов)</span>
                          </div>
                          <button
                            onClick={() => onNavigate(item.targetScreen)}
                            className="w-full py-2.5 px-3 rounded-lg bg-[#1179EC] hover:bg-blue-600 text-white font-headline font-bold text-xs uppercase tracking-wider text-center"
                          >
                            {item.ctaText} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Realting Skyscraper 300x600 */}
                  {item.id === 'realting-skyscraper-300x600' && (
                    <div className="w-[300px] h-[580px] rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-[#0F172A] text-white flex flex-col justify-between text-left">
                      <div className="relative h-44 overflow-hidden shrink-0">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/40" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#1179EC] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                            Realting Сайдбар
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-3 right-3">
                          <span className="text-[10px] uppercase font-bold text-[#F6D200] block">Психологический контур</span>
                          <span className="text-xs font-bold text-white">Высокогорный ретрит</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="font-headline font-bold text-base text-white leading-snug">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-[#38BDF8] font-medium">
                            {item.subheadline}
                          </p>

                          <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                              <span>1200м над смогом и суетой</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                              <span>Конный трек &amp; заземление</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                              <span>Личный разбор с психологом</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                              <span>Сапы на закатном Чарваке</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="bg-[#1E293B] p-2.5 rounded-xl text-center border border-slate-700">
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Промокод партнера</span>
                            <span className="text-sm font-mono font-bold text-[#F6D200]">REALTING-50</span>
                          </div>
                          <button
                            onClick={() => onNavigate(item.targetScreen)}
                            className="w-full py-3 px-3 rounded-xl bg-[#1179EC] hover:bg-blue-600 text-white font-headline font-bold text-xs uppercase tracking-wider shadow text-center"
                          >
                            {item.ctaText} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Realting Editorial Card 1200x628 */}
                  {item.id === 'realting-editorial-1200x628' && (
                    <div className="w-full max-w-3xl rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-[#0F172A] text-white flex flex-col md:flex-row text-left">
                      <div className="md:w-5/12 h-60 md:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#1179EC] text-white font-bold text-[10px] px-2.5 py-1 rounded">
                            REALTING LIFESTYLE
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#38BDF8]">
                            Спецпроект • Психология лидерства
                          </span>
                          <h4 className="font-headline font-bold text-xl text-white leading-tight">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <span className="text-xs text-slate-400">Автор: Екатерина Семерджиди</span>
                          <button
                            onClick={() => onNavigate(item.targetScreen)}
                            className="px-5 py-2.5 rounded-xl bg-[#1179EC] hover:bg-blue-600 text-white font-headline font-bold text-xs uppercase"
                          >
                            {item.ctaText} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5-10: Standard Ecosystem Modular Cards */}
                  {!item.id.startsWith('realting-') && (
                    <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-[#BA9470]/40 neu-card shadow-xl flex flex-col md:flex-row text-left">
                      <div className="md:w-5/12 h-52 md:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#BA9470] text-[#24271c] font-bold text-[10px] px-2 py-0.5 rounded font-mono">
                            {item.category.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470]">
                            {item.moduleName}
                          </span>
                          <h4 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8] leading-tight">
                            {item.headline}
                          </h4>
                          <p className="text-xs text-[#A9B489] leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/20">
                          <div className="flex gap-1.5 flex-wrap">
                            {item.badges.map((b, i) => (
                              <span key={i} className="text-[9px] bg-[#222519] text-[#A9B489] px-2 py-0.5 rounded">
                                {b}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => onNavigate(item.targetScreen)}
                            className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 hover:border-[#BA9470]"
                          >
                            {item.ctaText} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CODE MODE */}
              {viewMode === 'code' && (
                <div className="space-y-2 text-left">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Готовый встраиваемый HTML/iframe код с UTM метками:
                  </span>
                  <pre className="p-3.5 rounded-xl bg-[#14170e] border border-white/10 text-[11px] font-mono text-[#E2ECD2] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {usePortalSkin
                      ? `<!-- Realting.uz Partner Banner: ${item.title} -->
<div style="border:1px solid #1E293B;border-radius:12px;background:#0F172A;font-family:Inter,system-ui;color:#F8FAFC;padding:16px;">
  <span style="background:#1179EC;color:#FFF;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;">REALTING PARTNER</span>
  <h3 style="margin:8px 0;font-size:16px;">${item.headline}</h3>
  <p style="margin:4px 0 12px 0;font-size:12px;color:#94A3B8;">${item.description}</p>
  <a href="https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=realting.uz&utm_medium=banner&utm_campaign=${item.utmCampaign}" target="_blank" style="background:#1179EC;color:#FFF;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">${item.ctaText} &rarr;</a>
</div>`
                      : `<!-- EthOSium Module Promo: ${item.title} -->
<div style="background:#24271c;border:1px solid #BA9470;border-radius:12px;color:#F0E2C8;padding:16px;">
  <span style="color:#BA9470;font-size:10px;text-transform:uppercase;">${item.moduleName}</span>
  <h3 style="margin:6px 0;font-size:16px;color:#FFF;">${item.headline}</h3>
  <a href="https://ais-dev-y7eqrjhnhrfjdlzc3ymacf-470683881764.europe-west2.run.app/#${item.targetScreen}?utm_source=partner&utm_medium=banner&utm_campaign=${item.utmCampaign}" target="_blank" style="background:#BA9470;color:#24271c;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">${item.ctaText}</a>
</div>`}
                  </pre>
                </div>
              )}

              {/* SPECS MODE */}
              {viewMode === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-left">
                  <div className={`p-3 rounded-xl border ${usePortalSkin ? 'bg-[#1E293B]/70 border-slate-700' : 'neu-inset border-white/10'}`}>
                    <span className="text-[10px] uppercase font-bold text-[#BA9470] block">Технические характеристики</span>
                    <p className="mt-1">Разрешение: <span className="font-mono text-white font-bold">{item.dimensions}</span></p>
                    <p>Форматы: <span className="text-white">WebP, PNG, SVG, Responsive iframe</span></p>
                    <p>Рекомендуемый вес: <span className="text-white">до 180 КБ</span></p>
                  </div>
                  <div className={`p-3 rounded-xl border ${usePortalSkin ? 'bg-[#1E293B]/70 border-slate-700' : 'neu-inset border-white/10'}`}>
                    <span className="text-[10px] uppercase font-bold text-[#BA9470] block">UTM Разметка &amp; Воронка</span>
                    <p className="mt-1">Целевой экран: <span className="font-mono text-[#F6D200] font-bold">#{item.targetScreen}</span></p>
                    <p>Campaign Tag: <span className="font-mono text-white">{item.utmCampaign}</span></p>
                    <p>Площадка: <span className="text-white">{item.recommendedPlacement}</span></p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Support & Agency Note */}
      <div className="neu-card rounded-2xl p-6 border border-[#BA9470]/30 text-center space-y-2">
        <h4 className="font-headline font-bold text-base text-[#F0E2C8]">
          Индивидуальные форматы, печатная полиграфия &amp; B2B интеграции
        </h4>
        <p className="text-xs text-[#A9B489] max-w-xl mx-auto leading-relaxed">
          Для агентств недвижимости, медиа-партнеров и организаторов корпоративных выездов мы готовим брендированные баннеры любых размеров, PDF-презентации и интеграции с CRM-системами.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('chat')}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/30 active:scale-95"
          >
            Связаться в EAP-мессенджере
          </button>
          <button
            onClick={handleExportFullKitJson}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#F0E2C8] border border-[#BA9470]/50 active:scale-95"
          >
            Скачать спецификацию (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};
