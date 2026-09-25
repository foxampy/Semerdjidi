import React, { useState, useEffect, useRef } from 'react';
import { ActiveScreen, EthosiumUserProfile, RetreatModuleItem, RetreatQuestionnaireData } from '../../semerdzhidiTypes';
import { authService, ApplicationRecord } from '../../services/authService';
import { shareModule } from '../../utils/shareHelper';
import { ModularRetreatConstructor } from './retreats/ModularRetreatConstructor';
import { ModelComparisonView } from './retreats/ModelComparisonView';
import { HeritageRootsProgramView } from './retreats/HeritageRootsProgramView';
import { EXTENDED_RETREAT_CATALOG, RetreatItem, MOUNTAIN_WELLNESS_CENTERS, HealthDimension } from '../../data/retreatsAndCentersData';
import { RetreatDetailModal } from './retreats/RetreatDetailModal';
import { MountainCentersSection } from './retreats/MountainCentersSection';
import { SoloRetreatPlannerModal } from './retreats/SoloRetreatPlannerModal';
import { ProfessionalHubView } from './retreats/ProfessionalHubView';
import { CorporateBusinessView } from './retreats/CorporateBusinessView';
import { DevelopmentSettlementsView } from './retreats/DevelopmentSettlementsView';
import { SpecializedTherapyProgramsView } from './retreats/SpecializedTherapyProgramsView';
import { ExpeditionsAndOutdoorView } from './retreats/ExpeditionsAndOutdoorView';

interface RetreatsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  initialTab?: 'program' | 'test' | 'discount' | 'booking';
}

const RETREAT_CATALOG = [
  {
    id: 'chimgan_modular_15p',
    title: 'Суточный ретрит-конструктор: Чимган & Чарвак (15 мест)',
    dates: 'Каждые выходные / Формат 24h (15 участников)',
    duration: '24 часа концентрированного погружения (с 12:00 до 12:00)',
    location: 'Узбекистан, Чимган & Чарвакское ущелье',
    status: 'active' as const,
    spotsTotal: 15,
    spotsLeft: 7,
    discountBadge: 'Конструктор: от $120',
    heroImage: 'chimgan',
    summary: 'Глубокий психологический и психоаналитический контур самопознания в Чимгане с ведущими специалистами EthOSium: деконструкция гиперконтроля, юнгианская работа с Тенью, иппотерапия-зеркало, телесная разгрузка и модули перезагрузки от $120 до $360.'
  },
  {
    id: 'chimgan_sep_2026',
    title: 'Горный ретрит перезагрузки: Чимган & Чарвак (3 дня)',
    dates: '18, 19, 20 сентября 2026',
    duration: '3 дня / 2 ночи (концентрированная перезагрузка)',
    location: 'Узбекистан, Западный Тянь-Шань, Ущелье Чимгана & Озеро Чарвак',
    status: 'active' as const,
    spotsTotal: 13,
    spotsLeft: 3,
    discountBadge: '-50% Предрегистрация',
    heroImage: 'chimgan',
    summary: 'Пешие тропы заземления, конный трек, семинары психологов EthOSium, 3 места на личный разбор с фиксацией в приложении, сапы на закатном Чарваке и рассвет на УАЗах под водопадом.'
  },
  {
    id: 'altay_oct_2026',
    title: 'Экспедиционный ретрит: Плато Укок & Телецкое озеро',
    dates: '12-18 октября 2026',
    duration: '7 дней полевой экспедиции',
    location: 'Горный Алтай, граница четырех государств',
    status: 'waitlist' as const,
    spotsTotal: 10,
    spotsLeft: 0,
    discountBadge: 'Лист ожидания',
    heroImage: 'altay',
    summary: 'Экстремальное погружение в тишину высокогорных плато, сакральные курганы, крио-купания и дыхательные практики глубокой адаптации с Тимуром Садыковым.'
  },
  {
    id: 'beldersay_dec_2026',
    title: 'Зимняя глубинная тишина: Бельдерсай & Заамин',
    dates: '11-14 декабря 2026',
    duration: '4 дня зимней перезагрузки',
    location: 'Снежные хребты Бельдерсая, можжевеловые реликтовые леса',
    status: 'announced' as const,
    spotsTotal: 12,
    spotsLeft: 8,
    discountBadge: 'Анонс',
    heroImage: 'beldersay',
    summary: 'Контрастные банные ритуалы, терморегуляция на снегу, теплые каминные диалоги и работа со скрытыми телесными страхами холода и неопределенности.'
  },
  {
    id: 'kyzylkum_spring_2027',
    title: 'Звёздный оазис: Пустыня Кызылкум & озеро Айдакуль',
    dates: '24-28 марта 2027',
    duration: '5 дней весеннего равноденствия',
    location: 'Красные пески Кызылкум, юртовый лагерь у озера',
    status: 'soon' as const,
    spotsTotal: 14,
    spotsLeft: 14,
    discountBadge: 'Скоро',
    heroImage: 'kyzylkum',
    summary: 'Абсолютная акустическая тишина пустыни, ночные созерцания галактики без светового шума городов и практики освобождения слухового анализатора.'
  },
  {
    id: 'bali_april_2027',
    title: 'Бали / Убуд: Интеграция телесного интеллекта и стратегии',
    dates: '18-26 апреля 2027',
    duration: '9 дней международного кемпа',
    location: 'Индонезия, Убуд & рисовые террасы Тегаллаланг',
    status: 'preorder' as const,
    spotsTotal: 16,
    spotsLeft: 11,
    discountBadge: 'Предзаказ',
    heroImage: 'bali',
    summary: 'Синтез восточных практик осознанности и заземления, океанических волн и стратегических сессий LabForge для международных фаундеров и инвесторов.'
  }
];

const PROGRAM_MODULES: RetreatModuleItem[] = [
  {
    id: 'base_stay_food_walks',
    name: 'Базовый модуль: Проживание, горное питание и пешие прогулки заземления',
    category: 'base',
    description: '2 ночи в уютном горном комплексе Чимгана, 3-разовое фермерское горное питание, утренние и закатные пешие прогулки по арчовым тропам для снятия суеты и цифрового шума.',
    priceUsd: 120,
    isBase: true
  },
  {
    id: 'horse_riding_trail',
    name: 'Конная прогулка по горам Чимгана',
    category: 'experience',
    description: 'Верховой горный трек в сопровождении проводников. Практика доверия, синхронизации с крупным животным и балансировки глубоких постуральных мышц.',
    priceUsd: 45
  },
  {
    id: 'lectures_semerdjidi',
    name: 'Семинарские лекции и психологические практики EthOSium',
    category: 'expert',
    description: 'Ключевые блоки психологии устойчивости от экспертов R&D Центра EthOSium: распознавание зон выгорания, работа с хроническим гиперконтролем и возвращение подлинного контакта со своим телом.',
    priceUsd: 80
  },
  {
    id: 'vip_personal_audit_3slots',
    name: 'Личный глубокий аудит с ведущим психоаналитиком EthOSium (3 места)',
    category: 'expert',
    description: 'Персональная сессия прямо на ретрите с протоколированием в приложении и фиксацией карты работы со специалистами экосистемы. Осталось всего 1 из 3 мест!',
    priceUsd: 190,
    maxSpots: 3,
    availableSpots: 1
  },
  {
    id: 'sunset_sups_charvak',
    name: 'Выход на сапах на закатный Чарвак',
    category: 'experience',
    description: 'Вечерний выход на зеркальную бирюзовую гладь водохранилища. Медитативное скольжение, синхронизация с ритмом воды, спасательные жилеты и съемка.',
    priceUsd: 40
  },
  {
    id: 'uaz_waterfall_dawn',
    name: 'Поездка на горных УАЗах на рассвет под водопадом',
    category: 'experience',
    description: 'Ранний экспедиционный выезд на подготовленных внедорожниках к скрытому высокогорному водопаду. Встреча первых лучей солнца, горный чай и мощный заряд стихии.',
    priceUsd: 50
  },
  {
    id: 'mountain_banya_herbal',
    name: 'Горная баня на дровах с купелью и фитосбором',
    category: 'experience',
    description: 'Мягкий травяной пар на горных сборах, ледяная купель из горного ручья, детокс и глубокое расслабление после физической активности.',
    priceUsd: 35
  },
  {
    id: 'transfer_tashkent',
    name: 'Комфортный трансфер Ташкент – Чимган – Ташкент',
    category: 'transport',
    description: 'Туда и обратно на комфортабельном кондиционированном микроавтобусе от центра Ташкента до дверей горного комплекса и обратно.',
    priceUsd: 30
  }
];

export const RetreatsScreen: React.FC<RetreatsScreenProps> = ({ onNavigate }) => {
  // Mode: 'catalog' | 'mountain_centers' | 'solo_planner' | 'pro_hub' | 'b2b_corporate' | 'taglit_masa' | 'development_settlements' | 'specialized_programs' | 'expeditions_outdoor' | 'configurator' | 'comparison'
  const [selectedRetreatId, setSelectedRetreatId] = useState<string>('chimgan_modular_15p');
  const [viewMode, setViewMode] = useState<'catalog' | 'mountain_centers' | 'solo_planner' | 'pro_hub' | 'b2b_corporate' | 'taglit_masa' | 'development_settlements' | 'specialized_programs' | 'expeditions_outdoor' | 'configurator' | 'comparison'>('catalog');
  const [formatFilter, setFormatFilter] = useState<'all' | 'group' | 'solo' | 'corporate' | 'expedition'>('all');
  const [dimensionFilter, setDimensionFilter] = useState<'all' | 'body' | 'mind' | 'soul' | 'psyche'>('all');
  const [selectedRetreatModal, setSelectedRetreatModal] = useState<RetreatItem | null>(null);
  const [isSoloModalOpen, setIsSoloModalOpen] = useState(false);

  // Selected Modules for Mountain Retreat 18-20 Sept
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    'base_stay_food_walks',
    'horse_riding_trail',
    'lectures_semerdjidi',
    'sunset_sups_charvak',
    'uaz_waterfall_dawn'
  ]);

  // Step in Configurator: 1. modules -> 2. questionnaire -> 3. contact -> 4. confirmed
  const [currentStep, setCurrentStep] = useState<'modules' | 'questionnaire' | 'contact' | 'confirmed'>('modules');

  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState<RetreatQuestionnaireData>({
    experienceLevel: 'Любитель (бываю в горах 2-3 раза в год)',
    nutritionPreference: 'Стандартное горное фермерское',
    mainIntention: 'Снять хроническую усталость, перегруз и выйти из режима гиперконтроля',
    horseRidingExperience: 'Спокойный шаг с инструктором',
    accommodationType: 'Двухместное с коллегой по ретриту',
    specialRequests: ''
  });

  // Contact / Account state
  const [userProfile, setUserProfile] = useState<EthosiumUserProfile | null>(() => authService.getCurrentUser());
  const [contactData, setContactData] = useState({
    name: userProfile?.name || '',
    contact: userProfile?.emailOrTg || '',
    email: userProfile?.emailOrTg?.includes('@') ? userProfile.emailOrTg : '',
    password: ''
  });

  // Draft persistence state
  const [draftId, setDraftId] = useState<string>(() => {
    return localStorage.getItem('ethosium_retreat_draft_id') || `DRAFT-${Date.now().toString(36).toUpperCase()}`;
  });
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [certificateId, setCertificateId] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce ref for auto-saving
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize draft ID to localStorage
  useEffect(() => {
    localStorage.setItem('ethosium_retreat_draft_id', draftId);
  }, [draftId]);

  // Calculate budget
  const rawTotalUsd = PROGRAM_MODULES
    .filter(m => selectedModuleIds.includes(m.id))
    .reduce((sum, m) => sum + m.priceUsd, 0);

  // Discount 50% for early pre-registration
  const discountAmount = Math.round(rawTotalUsd * 0.5);
  const finalPriceUsd = rawTotalUsd - discountAmount;
  const priceUzs = (finalPriceUsd * 12800).toLocaleString('ru-RU');

  // Trigger Debounced Autosave to Admin DB whenever state changes
  useEffect(() => {
    if (currentStep === 'confirmed') return;

    setAutosaveStatus('saving');
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const payload = {
          draftId,
          type: 'retreat_chimgan' as const,
          name: contactData.name || 'Гость (выбирает программу)',
          contact: contactData.contact || 'Контакт заполняется',
          format: selectedModuleIds.includes('vip_personal_audit_3slots') ? 'vip' : 'custom',
          details: `Модули: ${selectedModuleIds.join(', ')}. Запрос: ${questionnaire.mainIntention || '—'}`,
          selectedModules: selectedModuleIds,
          questionnaire,
          step: currentStep,
          totalBudgetUsd: finalPriceUsd,
          promoCode: 'PRE-ETHOS-50'
        };

        const res = await authService.saveApplicationDraft(payload);
        if (res.success && res.draft) {
          setAutosaveStatus('saved');
        } else {
          setAutosaveStatus('idle');
        }
      } catch (e) {
        console.warn('Autosave draft error:', e);
        setAutosaveStatus('idle');
      }
    }, 800);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [selectedModuleIds, questionnaire, contactData, currentStep, finalPriceUsd, draftId]);

  // Toggle module selection
  const handleToggleModule = (moduleId: string) => {
    if (moduleId === 'base_stay_food_walks') return; // base module is mandatory

    setSelectedModuleIds(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });
  };

  // Final submission handler
  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.contact.trim() || !contactData.name.trim()) {
      setAuthError('Пожалуйста, укажите ваше имя и контакт (телефон или Telegram)');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      // 1. Ensure user account exists
      let currentUser = userProfile;
      if (!currentUser) {
        const regRes = await authService.registerEmail({
          name: contactData.name.trim(),
          emailOrTg: contactData.contact.trim(),
          password: contactData.password || undefined,
          role: 'Участник ретрита 18-20 сентября',
          contour: 'semerdzhidi',
          archetype: 'Интегратор Систем и Смыслов (EthOSium Nexus)'
        });
        if (regRes.success && regRes.user) {
          currentUser = regRes.user;
          setUserProfile(regRes.user);
        }
      }

      // 2. Pre-register retreat with 50% discount
      const certRes = await authService.preRegisterRetreat({
        userId: currentUser?.id,
        name: contactData.name.trim(),
        contact: contactData.contact.trim(),
        format: selectedModuleIds.includes('vip_personal_audit_3slots') ? 'vip' : 'standard'
      });

      const certNumber = certRes.certificateId || `PRE-ETHOS-50-${Math.floor(1000 + Math.random() * 9000)}`;
      setCertificateId(certNumber);

      // 3. Mark application as completed in database
      await authService.submitApplication({
        id: draftId,
        type: 'retreat_chimgan',
        name: contactData.name.trim(),
        contact: contactData.contact.trim(),
        format: selectedModuleIds.includes('vip_personal_audit_3slots') ? 'vip' : 'custom',
        details: `Бронь подтверждена. Сертификат ${certNumber}. Выбранные модули: ${selectedModuleIds.join(', ')}. Запрос: ${questionnaire.mainIntention}. Питание: ${questionnaire.nutritionPreference}.`,
        status: 'new',
        amountUsd: finalPriceUsd,
        promoCode: 'PRE-ETHOS-50',
        selectedModules: selectedModuleIds,
        questionnaire,
        step: 'completed',
        isDraft: false
      });

      setCurrentStep('confirmed');
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка оформления бронирования');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRetreats = EXTENDED_RETREAT_CATALOG.filter(retreat => {
    if (formatFilter !== 'all' && retreat.format !== formatFilter) return false;
    if (dimensionFilter !== 'all') {
      if (!retreat.dimensions.includes(dimensionFilter as HealthDimension) && !retreat.dimensions.includes('all')) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-24 px-4 pt-1">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setViewMode('catalog')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'catalog'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">landscape</span>
            Ретриты &amp; Экспедиции
          </button>

          <button
            onClick={() => setViewMode('mountain_centers')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'mountain_centers'
                ? 'neu-pill-active text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">nature_people</span>
            Горные Центры ({MOUNTAIN_WELLNESS_CENTERS.length})
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setIsSoloModalOpen(true)}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              isSoloModalOpen || viewMode === 'solo_planner'
                ? 'neu-pill-active text-amber-300 border border-amber-500/50'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">self_improvement</span>
            Solo / Самостоятельные
          </button>

          <button
            onClick={() => setViewMode('b2b_corporate')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'b2b_corporate'
                ? 'neu-pill-active text-sky-300 border border-sky-500/50 shadow-md'
                : 'text-sky-400 hover:text-sky-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            Для Бизнеса &amp; B2B
          </button>

          <button
            onClick={() => setViewMode('pro_hub')}
            className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'pro_hub'
                ? 'neu-pill-active text-purple-300 border border-purple-500/50 shadow-md'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            Для Профессионалов
          </button>

          <button
            onClick={() => setViewMode('development_settlements')}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'development_settlements'
                ? 'neu-pill-active text-amber-300 border border-amber-500/50 ring-1 ring-amber-500/30 shadow-md'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">home_work</span>
            Застройка Поселков &amp; Отелей
          </button>

          <button
            onClick={() => setViewMode('specialized_programs')}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'specialized_programs'
                ? 'neu-pill-active text-rose-300 border border-rose-500/50 ring-1 ring-rose-500/30 shadow-md'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
            Спец-Программы
          </button>

          <button
            onClick={() => setViewMode('expeditions_outdoor')}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'expeditions_outdoor'
                ? 'neu-pill-active text-teal-300 border border-teal-500/50 ring-1 ring-teal-500/30 shadow-md'
                : 'text-teal-400 hover:text-teal-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            Экспедиции &amp; Аутдор
          </button>

          <button
            onClick={() => setViewMode('taglit_masa')}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'taglit_masa'
                ? 'neu-pill-active text-[#FFCF96] border border-[#BA9470]/50 ring-1 ring-[#BA9470]/30 shadow-md'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">public</span>
            Таглит &amp; Маса
          </button>

          <button
            onClick={() => {
              setSelectedRetreatId('chimgan_modular_15p');
              setViewMode('configurator');
            }}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'configurator' && selectedRetreatId === 'chimgan_modular_15p'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-amber-400">tune</span>
            24h Конструктор
          </button>

          <button
            onClick={() => setViewMode('comparison')}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'comparison'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#BA9470]">compare_arrows</span>
            Сравнение
          </button>
        </div>

        <button
          onClick={() => shareModule('retreats', { customTitle: 'Ретриты, Горные Центры & Экспедиции EthOSium' })}
          className="neu-btn px-2.5 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1 shrink-0"
          title="Поделиться модулем экспедиций"
        >
          <span className="material-symbols-outlined text-[15px]">share</span>
          <span className="hidden sm:inline">Поделиться</span>
        </button>
      </div>

      {/* VIEW 1: RETREATS & EXPEDITIONS CATALOG */}
      {viewMode === 'catalog' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Module Header */}
          <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-br from-[#3b402e] to-[#323625] shadow-xl">
            <div className="flex items-center gap-2 text-[#BA9470] font-mono text-xs uppercase font-bold tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              Экспедиционный Контур EthOSium • 4D Здоровье: Тело • Разум • Душа • Психика
            </div>

            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8]">
              Ретриты, Экспедиции &amp; Оздоровительные Пространства
            </h1>

            <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 leading-relaxed max-w-3xl">
              Холистические программы восстановления в горах: групповые психологические выезды, индивидуальные Solo-уединения, корпоративные антивыгорающие оффсайты и высокогорные санатории со скидкой 50% для резидентов.
            </p>

            {/* Quick Hub Navigation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-[#A9B489]/20">
              <button
                onClick={() => setViewMode('mountain_centers')}
                className="neu-card p-3 rounded-xl border border-emerald-500/40 bg-[#323725] text-left hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]">nature_people</span>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">4 центра</span>
                </div>
                <div className="text-xs font-bold text-[#F0E2C8] mt-1 group-hover:text-emerald-300 transition-colors">
                  Горные Санатории
                </div>
                <div className="text-[10px] text-[#A9B489]">Бальнеология &amp; климат</div>
              </button>

              <button
                onClick={() => setIsSoloModalOpen(true)}
                className="neu-card p-3 rounded-xl border border-amber-500/40 bg-[#323725] text-left hover:border-amber-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-amber-400 text-[20px]">self_improvement</span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">Конструктор</span>
                </div>
                <div className="text-xs font-bold text-[#F0E2C8] mt-1 group-hover:text-amber-300 transition-colors">
                  Solo-Ретриты
                </div>
                <div className="text-[10px] text-[#A9B489]">Личное уединение 2-7d</div>
              </button>

              <button
                onClick={() => setViewMode('development_settlements')}
                className="neu-card p-3 rounded-xl border border-amber-500/50 bg-[#383325] text-left hover:border-amber-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-amber-400 text-[20px]">home_work</span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">Девелопмент</span>
                </div>
                <div className="text-xs font-bold text-[#FFCF96] mt-1 group-hover:text-amber-300 transition-colors">
                  Поселки &amp; Отели
                </div>
                <div className="text-[10px] text-[#A9B489]">Застройка, дачи, инвестиции</div>
              </button>

              <button
                onClick={() => setViewMode('specialized_programs')}
                className="neu-card p-3 rounded-xl border border-rose-500/50 bg-[#382b2b] text-left hover:border-rose-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-rose-400 text-[20px]">family_restroom</span>
                  <span className="text-[10px] font-mono text-rose-300 font-bold">Спец-курсы</span>
                </div>
                <div className="text-xs font-bold text-rose-200 mt-1 group-hover:text-rose-300 transition-colors">
                  Семья, Дети, Аддикции
                </div>
                <div className="text-[10px] text-[#A9B489]">Раздельно / Вместе</div>
              </button>

              <button
                onClick={() => setViewMode('expeditions_outdoor')}
                className="neu-card p-3 rounded-xl border border-teal-500/50 bg-[#283633] text-left hover:border-teal-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-teal-400 text-[20px]">explore</span>
                  <span className="text-[10px] font-mono text-teal-300 font-bold">Аутдор</span>
                </div>
                <div className="text-xs font-bold text-teal-200 mt-1 group-hover:text-teal-300 transition-colors">
                  Экспедиции &amp; Походы
                </div>
                <div className="text-[10px] text-[#A9B489]">Кони, вода, наука, звёзды</div>
              </button>

              <button
                onClick={() => setViewMode('taglit_masa')}
                className="neu-card p-3 rounded-xl border border-[#BA9470]/50 bg-[#343828] text-left hover:border-[#FFCF96] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[#BA9470] text-[20px]">public</span>
                  <span className="text-[10px] font-mono text-[#FFCF96] font-bold">Гранты</span>
                </div>
                <div className="text-xs font-bold text-[#F0E2C8] mt-1 group-hover:text-[#FFCF96] transition-colors">
                  Таглит &amp; Маса (УЗ)
                </div>
                <div className="text-[10px] text-[#A9B489]">Тамир • Сафар • Улуг-Йул</div>
              </button>

              <button
                onClick={() => setViewMode('b2b_corporate')}
                className="neu-card p-3 rounded-xl border border-sky-500/40 bg-[#323725] text-left hover:border-sky-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-sky-400 text-[20px]">domain</span>
                  <span className="text-[10px] font-mono text-sky-300 font-bold">B2B</span>
                </div>
                <div className="text-xs font-bold text-[#F0E2C8] mt-1 group-hover:text-sky-300 transition-colors">
                  Для Бизнеса
                </div>
                <div className="text-[10px] text-[#A9B489]">Команды 6-50 чел</div>
              </button>

              <button
                onClick={() => setViewMode('pro_hub')}
                className="neu-card p-3 rounded-xl border border-purple-500/40 bg-[#323725] text-left hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-purple-400 text-[20px]">badge</span>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">Pro Hub</span>
                </div>
                <div className="text-xs font-bold text-[#F0E2C8] mt-1 group-hover:text-purple-300 transition-colors">
                  Для Экспертов
                </div>
                <div className="text-[10px] text-[#A9B489]">Запуск своих ретритов</div>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 bg-[#343828] space-y-3">
            {/* Format filters */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[#A9B489] font-mono text-[11px] uppercase mr-1">Формат:</span>
                {[
                  { id: 'all', label: 'Все форматы' },
                  { id: 'group', label: '👥 Групповые' },
                  { id: 'solo', label: '🧭 Solo / Уединение' },
                  { id: 'corporate', label: '🏢 Корпоративные (B2B)' },
                  { id: 'expedition', label: '⛰️ Экспедиции' },
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setFormatFilter(fmt.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                      formatFilter === fmt.id
                        ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                        : 'text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-[#A9B489]">
                Найдено программ: <strong className="text-emerald-400">{filteredRetreats.length}</strong>
              </div>
            </div>

            {/* 4D Dimension filters */}
            <div className="pt-2 border-t border-[#A9B489]/15 flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[#A9B489] font-mono text-[11px] uppercase mr-1">4D Здоровье:</span>
              {[
                { id: 'all', label: 'Все 4 измерения' },
                { id: 'body', label: '🌿 Тело (Соматика/Сон)' },
                { id: 'mind', label: '🧠 Разум (Фокус/Детокс)' },
                { id: 'soul', label: '☀️ Душа (Род/Стихии)' },
                { id: 'psyche', label: '📖 Психика (Психоанализ)' },
              ].map(dim => (
                <button
                  key={dim.id}
                  onClick={() => setDimensionFilter(dim.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                    dimensionFilter === dim.id
                      ? 'neu-pill-active text-emerald-300 border border-emerald-500/40'
                      : 'text-[#A9B489] hover:text-[#F0E2C8]'
                  }`}
                >
                  {dim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Extended Catalog Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredRetreats.map(retreat => {
              const isActive = retreat.status === 'active';
              return (
                <div
                  key={retreat.id}
                  className={`neu-card rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                    isActive
                      ? 'border-[#BA9470]/50 bg-[#3a3e2c] shadow-lg ring-1 ring-[#BA9470]/30'
                      : 'border-[#A9B489]/20 bg-[#353828]'
                  }`}
                >
                  <div>
                    {/* Header badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                          retreat.format === 'solo'
                            ? 'bg-amber-900/60 text-amber-300 border-amber-500/40'
                            : retreat.format === 'corporate'
                              ? 'bg-sky-900/60 text-sky-300 border-sky-500/40'
                              : 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {retreat.format === 'solo' ? 'Solo / Уединение' : retreat.format === 'corporate' ? 'Корпоративный B2B' : 'Групповой'}
                        </span>

                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#2a2c20] text-[#BA9470] border border-[#BA9470]/30">
                          {retreat.discountBadge}
                        </span>

                        {retreat.altitudeMeters && (
                          <span className="text-[10px] font-mono text-[#E2ECD2]/75 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px] text-emerald-400">landscape</span>
                            {retreat.altitudeMeters} м
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-mono text-[#E2ECD2]/80 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#BA9470]">event</span>
                        {retreat.dates}
                      </span>
                    </div>

                    <h2 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8]">
                      {retreat.title}
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-[#A9B489] mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                        {retreat.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {retreat.duration}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2.5 leading-relaxed">
                      {retreat.summary}
                    </p>

                    {/* 4D Health Preview Bar */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-[#2e3222] border border-emerald-500/20">
                        <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Тело (Body)</div>
                        <div className="text-[11px] text-[#E2ECD2]/80 line-clamp-1 mt-0.5">
                          {retreat.dimensionBreakdown.body[0]}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#2e3222] border border-sky-500/20">
                        <div className="text-[10px] font-mono font-bold text-sky-400 uppercase">Разум (Mind)</div>
                        <div className="text-[11px] text-[#E2ECD2]/80 line-clamp-1 mt-0.5">
                          {retreat.dimensionBreakdown.mind[0]}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#2e3222] border border-amber-500/20">
                        <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">Душа (Soul)</div>
                        <div className="text-[11px] text-[#E2ECD2]/80 line-clamp-1 mt-0.5">
                          {retreat.dimensionBreakdown.soul[0]}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-[#2e3222] border border-purple-500/20">
                        <div className="text-[10px] font-mono font-bold text-purple-400 uppercase">Психика (Psyche)</div>
                        <div className="text-[11px] text-[#E2ECD2]/80 line-clamp-1 mt-0.5">
                          {retreat.dimensionBreakdown.psyche[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#A9B489]/15 flex-wrap gap-3">
                    <div>
                      <div className="text-[11px] text-[#A9B489]">
                        {isActive ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                            Осталось {retreat.spotsLeft} из {retreat.spotsTotal} мест
                          </span>
                        ) : (
                          <span>Лист ожидания / Скоро</span>
                        )}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#F0E2C8] mt-0.5">
                        от ${retreat.priceFromUsd}{' '}
                        <span className="line-through text-[#A9B489] text-[10px] font-normal">${retreat.regularPriceUsd}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedRetreatModal(retreat)}
                        className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#F0E2C8] border border-[#BA9470]/50 hover:border-[#BA9470] transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        Подробнее &amp; 4D Программа
                      </button>

                      {retreat.format === 'solo' ? (
                        <button
                          onClick={() => setIsSoloModalOpen(true)}
                          className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-amber-800/40 border border-amber-500/60 hover:bg-amber-800/60 transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                          Сконструировать Solo
                        </button>
                      ) : retreat.format === 'corporate' ? (
                        <button
                          onClick={() => setViewMode('b2b_corporate')}
                          className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-sky-800/40 border border-sky-500/60 hover:bg-sky-800/60 transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">domain</span>
                          B2B Расчет для команды
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRetreatId(retreat.id);
                            setViewMode('configurator');
                          }}
                          className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-800/40 border border-emerald-500/60 hover:bg-emerald-800/60 transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">tune</span>
                          Собрать в конструкторе
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MOUNTAIN WELLNESS CENTERS & ALPINE SANATORIUMS */}
      {viewMode === 'mountain_centers' && (
        <MountainCentersSection />
      )}

      {/* VIEW: PROFESSIONAL HUB */}
      {viewMode === 'pro_hub' && (
        <ProfessionalHubView />
      )}

      {/* VIEW: B2B CORPORATE RETREATS & OFFSITES */}
      {viewMode === 'b2b_corporate' && (
        <CorporateBusinessView />
      )}

      {/* VIEW: HERITAGE & ROOTS PROGRAM (ANALOG OF TAGLIT & MASA) */}
      {viewMode === 'taglit_masa' && (
        <HeritageRootsProgramView
          onBackToCatalog={() => setViewMode('catalog')}
          onOpenConstructor={() => {
            setSelectedRetreatId('chimgan_modular_15p');
            setViewMode('configurator');
          }}
          onOpenComparison={() => setViewMode('comparison')}
        />
      )}

      {/* VIEW: DEVELOPMENT OF ECO-VILLAGES, HOTELS & SANATORIUMS */}
      {viewMode === 'development_settlements' && (
        <DevelopmentSettlementsView
          onBackToCatalog={() => setViewMode('catalog')}
          onOpenSpecializedPrograms={() => setViewMode('specialized_programs')}
        />
      )}

      {/* VIEW: SPECIALIZED THERAPY PROGRAMS (FAMILY, NEURODIVERGENT, ADDICTION) */}
      {viewMode === 'specialized_programs' && (
        <SpecializedTherapyProgramsView
          onBackToCatalog={() => setViewMode('catalog')}
          onOpenSettlements={() => setViewMode('development_settlements')}
        />
      )}

      {/* VIEW: OUTDOOR & SCIENTIFIC EXPEDITIONS */}
      {viewMode === 'expeditions_outdoor' && (
        <ExpeditionsAndOutdoorView
          onBackToCatalog={() => setViewMode('catalog')}
          onOpenSettlements={() => setViewMode('development_settlements')}
        />
      )}

      {/* VIEW 3: COMPARISON VIEW */}
      {viewMode === 'comparison' && (
        <ModelComparisonView
          onSelectOldModel={() => {
            setSelectedRetreatId('chimgan_sep_2026');
            setViewMode('configurator');
          }}
          onSelectNewModel={() => {
            setSelectedRetreatId('chimgan_modular_15p');
            setViewMode('configurator');
          }}
          onBackToCatalog={() => setViewMode('catalog')}
        />
      )}

      {/* VIEW 2A: NEW 24H MODULAR RETREAT CONSTRUCTOR (15 PARTICIPANTS) */}
      {viewMode === 'configurator' && selectedRetreatId === 'chimgan_modular_15p' && (
        <ModularRetreatConstructor
          onNavigate={onNavigate}
          onSwitchToOldModel={() => setSelectedRetreatId('chimgan_sep_2026')}
          onOpenComparison={() => setViewMode('comparison')}
        />
      )}

      {/* VIEW 2B: 3-DAY MOUNTAIN RETREAT (18-20 SEPT) */}
      {viewMode === 'configurator' && selectedRetreatId !== 'chimgan_modular_15p' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Main Hero Card of Active Retreat */}
          <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-b from-[#3d4230] to-[#343828] relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] uppercase font-bold tracking-widest text-[#BA9470] border border-[#BA9470]/30">
                  Горный Ретрит 18, 19, 20 сентября 2026
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-900/70 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                  Скидка 50% при ранней фиксации
                </span>
              </div>

              {/* Autosave Server Status Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A9B489] bg-[#2a2c20]/60 px-2.5 py-1 rounded-full border border-[#A9B489]/20">
                {autosaveStatus === 'saving' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Сохранение черновика...</span>
                  </>
                )}
                {autosaveStatus === 'saved' && (
                  <>
                    <span className="material-symbols-outlined text-[13px] text-emerald-400">cloud_done</span>
                    <span className="text-emerald-300">Сохранено для админов</span>
                  </>
                )}
                {autosaveStatus === 'idle' && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A9B489]" />
                    <span>Автосинхронизация активна</span>
                  </>
                )}
              </div>
            </div>

            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] leading-tight">
              Точка Сборки: Чимган &amp; Чарвак (18–20 сентября)
            </h1>

            <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-3 leading-relaxed">
              3 дня концентрированной глубокой перезагрузки в предгорьях Тянь-Шаня. Программа разработана для полного снятия хронической усталости, восстановления контакта с организмом и выхода на качественно новый уровень внутренней опоры.
            </p>

            {/* Quick Key Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-2 border-t border-[#A9B489]/15">
              <div className="neu-inset p-2.5 rounded-xl text-center">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">hiking</span>
                <span className="text-[11px] text-[#F0E2C8] block font-semibold mt-0.5">Пешие прогулки</span>
                <span className="text-[9px] text-[#A9B489]">Заземление и тишина</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl text-center">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">phishing</span>
                <span className="text-[11px] text-[#F0E2C8] block font-semibold mt-0.5">Сапы на Чарваке</span>
                <span className="text-[9px] text-[#A9B489]">Закатная гладь воды</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl text-center">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">psychology</span>
                <span className="text-[11px] text-[#F0E2C8] block font-semibold mt-0.5">Психологи EthOSium</span>
                <span className="text-[9px] text-[#A9B489]">Лекции + 3 разбора</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl text-center">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">directions_car</span>
                <span className="text-[11px] text-[#F0E2C8] block font-semibold mt-0.5">УАЗы на рассвет</span>
                <span className="text-[9px] text-[#A9B489]">Водопад в горах</span>
              </div>
            </div>
          </div>

          {/* Stepper Navigation: 1. Модули -> 2. Анкета -> 3. Регистрация */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCurrentStep('modules')}
              className={`p-3 rounded-2xl text-left transition-all border ${
                currentStep === 'modules'
                  ? 'neu-card border-[#BA9470] bg-[#3a3e2c] text-[#F0E2C8]'
                  : 'neu-inset text-[#A9B489] border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470]">1</span>
                <span>Программа</span>
              </div>
              <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">Выбор модулей &amp; бюджет</span>
            </button>

            <button
              onClick={() => setCurrentStep('questionnaire')}
              className={`p-3 rounded-2xl text-left transition-all border ${
                currentStep === 'questionnaire'
                  ? 'neu-card border-[#BA9470] bg-[#3a3e2c] text-[#F0E2C8]'
                  : 'neu-inset text-[#A9B489] border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470]">2</span>
                <span>Анкета</span>
              </div>
              <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">Цели и предпочтения</span>
            </button>

            <button
              onClick={() => setCurrentStep('contact')}
              className={`p-3 rounded-2xl text-left transition-all border ${
                currentStep === 'contact'
                  ? 'neu-card border-[#BA9470] bg-[#3a3e2c] text-[#F0E2C8]'
                  : 'neu-inset text-[#A9B489] border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470]">3</span>
                <span>Регистрация</span>
              </div>
              <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">Фиксация сертификата -50%</span>
            </button>
          </div>

          {/* STEP 1: MODULAR PROGRAM & BUDGET CONFIGURATOR */}
          {currentStep === 'modules' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Detailed Program Narrative */}
              <div className="neu-card rounded-2xl p-5 border border-[#A9B489]/15 space-y-4">
                <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
                  <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                    Полное расписание и сценарий ретрита (18–20 сентября)
                  </h3>
                  <span className="text-[10px] font-mono text-[#BA9470]">18.09 — 20.09.2026</span>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-[#E2ECD2]/85 leading-relaxed">
                  <div className="p-3 neu-inset rounded-xl">
                    <span className="font-bold text-[#BA9470] block mb-1">
                      День 1 (18 сентября) • Заземление, заселение и закатные сапы
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#A9B489]">
                      <li><strong className="text-[#F0E2C8]">10:00–12:00:</strong> Трансфер из Ташкента в горный Чимган. Смена высоты и давления.</li>
                      <li><strong className="text-[#F0E2C8]">12:30:</strong> Заселение в эко-комплекс среди арчовых рощ. Приветственный чай на травах.</li>
                      <li><strong className="text-[#F0E2C8]">13:30:</strong> Авторский горный фермерский обед (натуральные горные продукты).</li>
                      <li><strong className="text-[#F0E2C8]">15:00:</strong> Пешая прогулка для заземления и убирания суеты. Сброс городского информационного шума.</li>
                      <li><strong className="text-[#F0E2C8]">17:30:</strong> Выезд на Чарвак: медитативный выход на сап-бордах в лучах заката по бирюзовой глади.</li>
                      <li><strong className="text-[#F0E2C8]">20:00:</strong> Ужин у открытого огня и завершающие диалоги дня в теплом кругу.</li>
                    </ul>
                  </div>

                  <div className="p-3 neu-inset rounded-xl">
                    <span className="font-bold text-[#BA9470] block mb-1">
                      День 2 (19 сентября) • Конный трек, семинары Екатерины Семерджиди &amp; 3 места на личные разборы
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#A9B489]">
                      <li><strong className="text-[#F0E2C8]">08:30:</strong> Дыхательные практики пробуждения на утреннем воздухе (432 Hz). Завтрак.</li>
                      <li><strong className="text-[#F0E2C8]">10:00:</strong> Конная прогулка по горам Чимгана. Баланс сил, доверие животному и телу.</li>
                      <li><strong className="text-[#F0E2C8]">13:30:</strong> Восстановительный обед.</li>
                      <li><strong className="text-[#F0E2C8]">15:00:</strong> Семинарские лекции от Екатерины Семерджиди: нейробаланс, механизмы гиперконтроля и границы.</li>
                      <li><strong className="text-[#F0E2C8]">17:00:</strong> <span className="text-[#FFCF96] font-bold">3 эксклюзивных места для индивидуальных разборов с Екатериной</span> с фиксацией карты в приложении для дальнейшей работы со специалистами экосистемы.</li>
                      <li><strong className="text-[#F0E2C8]">19:30:</strong> Горная баня на дровах, родниковая купель и вечерний ужин.</li>
                    </ul>
                  </div>

                  <div className="p-3 neu-inset rounded-xl">
                    <span className="font-bold text-[#BA9470] block mb-1">
                      День 3 (20 сентября) • УАЗы на рассвет к водопаду и интеграция в реальность
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#A9B489]">
                      <li><strong className="text-[#F0E2C8]">05:30:</strong> Экспедиционный выезд на горных УАЗах на рассвет под высокогорным водопадом.</li>
                      <li><strong className="text-[#F0E2C8]">08:30:</strong> Горячий завтрак с видом на хребты.</li>
                      <li><strong className="text-[#F0E2C8]">10:30:</strong> Интеграционный круг: формирование плана возвращения в городскую среду без отката.</li>
                      <li><strong className="text-[#F0E2C8]">13:00:</strong> Чек-аут и обратный трансфер в Ташкент.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Interactive Module Configurator Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                    Конструктор программы: соберите модули под ваш бюджет
                  </h3>
                  <span className="text-xs text-[#A9B489]">Кликните, чтобы включить/отключить</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {PROGRAM_MODULES.map(module => {
                    const isSelected = selectedModuleIds.includes(module.id);
                    const isBase = module.isBase;
                    const isVipAudit = module.id === 'vip_personal_audit_3slots';

                    return (
                      <div
                        key={module.id}
                        onClick={() => handleToggleModule(module.id)}
                        className={`neu-card p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? isVipAudit
                              ? 'border-[#FFCF96]/70 bg-[#3d3a2b] shadow-md ring-1 ring-[#FFCF96]/40'
                              : 'border-[#BA9470]/60 bg-[#3c402f] shadow-md'
                            : 'border-[#A9B489]/15 bg-[#343727]/70 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected
                              ? 'bg-[#BA9470] text-[#2a2c20]'
                              : 'neu-inset text-transparent'
                          }`}>
                            <span className="material-symbols-outlined text-[16px] font-bold">
                              {isSelected ? 'check' : ''}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-headline font-bold text-xs sm:text-sm text-[#F0E2C8]">
                                {module.name}
                              </h4>
                              {isBase && (
                                <span className="text-[9px] font-mono uppercase font-bold text-[#BA9470] bg-[#BA9470]/15 px-2 py-0.5 rounded-md">
                                  Обязательная основа
                                </span>
                              )}
                              {isVipAudit && (
                                <span className="text-[9px] font-mono uppercase font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-500/40">
                                  Лимитировано • 1 из 3 мест!
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-headline font-bold text-sm text-[#F0E2C8] block">
                            +${module.priceUsd}
                          </span>
                          <span className="text-[10px] text-[#A9B489]">
                            {isBase ? 'в базе' : isSelected ? 'включено' : 'добавить'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sticky Real-Time Budget Summary Bar */}
              <div className="neu-card rounded-2xl p-4 sm:p-5 border border-[#BA9470]/50 bg-[#353828] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] block font-bold">
                    Расчет Бюджета Ретрита ({selectedModuleIds.length} модулей выбрано)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-headline font-bold text-2xl text-[#F0E2C8]">
                      ${finalPriceUsd}
                    </span>
                    <span className="text-xs text-[#A9B489] line-through">
                      ${rawTotalUsd}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      -50% Скидка ранней брони
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A9B489] mt-0.5 block">
                    ≈ {priceUzs} сум • Предоплата для фиксации 50%: ${Math.round(finalPriceUsd * 0.5)}
                  </span>
                </div>

                <button
                  onClick={() => setCurrentStep('questionnaire')}
                  className="w-full sm:w-auto neu-btn px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/60 hover:bg-[#BA9470]/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Перейти к Анкете Участника</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PARTICIPANT PREFERENCE QUESTIONNAIRE */}
          {currentStep === 'questionnaire' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
                  <div>
                    <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                      Анкета Участника Ретрита (18–20 сентября)
                    </h3>
                    <p className="text-xs text-[#A9B489] mt-0.5">
                      Помогает кураторам и Екатерине Семерджиди адаптировать программу и питание индивидуально под вас
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Автосохранение включено</span>
                </div>

                {/* 1. Main Intention */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F0E2C8]">
                    1. Каков ваш главный запрос / намерение на этот ретрит?
                  </label>
                  <textarea
                    rows={2}
                    value={questionnaire.mainIntention}
                    onChange={e => setQuestionnaire({ ...questionnaire, mainIntention: e.target.value })}
                    placeholder="Например: преодолеть выгорание, найти стратегическое решение по бизнесу, восстановить сон..."
                    className="w-full p-3 rounded-xl neu-inset bg-transparent text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                  />
                </div>

                {/* 2. Mountain Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F0E2C8]">
                    2. Ваш опыт пребывания в горах и физическая готовность
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      'Новичок (предпочитаю спокойный легкий темп)',
                      'Любитель (бываю в горах 2-3 раза в год)',
                      'Уверенный (люблю долгие переходы)'
                    ].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQuestionnaire({ ...questionnaire, experienceLevel: opt })}
                        className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                          questionnaire.experienceLevel === opt
                            ? 'neu-pill-active text-[#F0E2C8] border-[#BA9470]/60 font-semibold'
                            : 'neu-inset text-[#A9B489] border-transparent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Nutrition Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F0E2C8]">
                    3. Предпочтения по питанию и аллергии
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Стандартное горное фермерское',
                      'Вегетарианское / Без мяса',
                      'Безглютеновое / Без сахара',
                      'Есть аллергии (укажу в заметках)'
                    ].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQuestionnaire({ ...questionnaire, nutritionPreference: opt })}
                        className={`p-2.5 rounded-xl text-xs text-left transition-all border ${
                          questionnaire.nutritionPreference === opt
                            ? 'neu-pill-active text-[#F0E2C8] border-[#BA9470]/60 font-semibold'
                            : 'neu-inset text-[#A9B489] border-transparent'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Horse Riding & SUP Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#F0E2C8]">
                      4. Опыт верховой езды
                    </label>
                    <select
                      value={questionnaire.horseRidingExperience}
                      onChange={e => setQuestionnaire({ ...questionnaire, horseRidingExperience: e.target.value })}
                      className="w-full p-2.5 rounded-xl neu-inset bg-[#383c2c] text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                    >
                      <option value="Впервые сяду на лошадь">Впервые сяду на лошадь (только с поводом)</option>
                      <option value="Спокойный шаг с инструктором">Спокойный шаг с инструктором</option>
                      <option value="Уверенно держусь в седле">Уверенно держусь в седле</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#F0E2C8]">
                      5. Пожелания к размещению в шале
                    </label>
                    <select
                      value={questionnaire.accommodationType}
                      onChange={e => setQuestionnaire({ ...questionnaire, accommodationType: e.target.value })}
                      className="w-full p-2.5 rounded-xl neu-inset bg-[#383c2c] text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                    >
                      <option value="Двухместное с коллегой по ретриту">Двухместное с коллегой по ретриту (2 раздельные кровати)</option>
                      <option value="Индивидуальный номер (Single)">Индивидуальный номер (Single)</option>
                      <option value="Еду с партнером / парой">Еду с партнером / парой (двуспальная кровать)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Special Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#F0E2C8]">
                    6. Дополнительные пожелания или особенности здоровья
                  </label>
                  <input
                    type="text"
                    value={questionnaire.specialRequests}
                    onChange={e => setQuestionnaire({ ...questionnaire, specialRequests: e.target.value })}
                    placeholder="Например: давление, травмы коленей, необходимость в трансфере..."
                    className="w-full p-3 rounded-xl neu-inset bg-transparent text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('modules')}
                  className="neu-btn px-4 py-2.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Назад к модулям
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep('contact')}
                  className="neu-btn px-6 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/60 hover:bg-[#BA9470]/40 flex items-center gap-2"
                >
                  <span>Далее: Контакты &amp; Сертификат</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT & PROFILE REGISTRATION */}
          {currentStep === 'contact' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <form onSubmit={handleFinalBooking} className="neu-card rounded-2xl p-5 border border-[#BA9470]/40 space-y-4">
                <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
                  <div>
                    <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                      Фиксация брони &amp; Сертификат скидки 50%
                    </h3>
                    <p className="text-xs text-[#A9B489] mt-0.5">
                      Ваши данные автоматически привязываются к аккаунту и защищенной базе администраторов
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    -50% фиксируется
                  </span>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                    {authError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">
                      Ваше Имя и Фамилия
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={e => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="Иван Петров"
                      className="w-full p-3 rounded-xl neu-inset bg-transparent text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">
                      Контакт для связи (Телефон или Telegram @username)
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.contact}
                      onChange={e => setContactData({ ...contactData, contact: e.target.value })}
                      placeholder="+998 90 123-45-67 или @my_telegram"
                      className="w-full p-3 rounded-xl neu-inset bg-transparent text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                    />
                  </div>

                  {!userProfile && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#F0E2C8]">
                        Пароль для входа в кабинет резидента (опционально)
                      </label>
                      <input
                        type="password"
                        value={contactData.password}
                        onChange={e => setContactData({ ...contactData, password: e.target.value })}
                        placeholder="Придумайте пароль от 6 символов"
                        className="w-full p-3 rounded-xl neu-inset bg-transparent text-xs text-[#F0E2C8] focus:outline-none border border-[#A9B489]/20"
                      />
                      <span className="text-[10px] text-[#A9B489] block">
                        Позволит вам входить в приложение и видеть материалы подготовки и отчеты
                      </span>
                    </div>
                  )}
                </div>

                {/* Final Order Summary Card */}
                <div className="p-3.5 neu-inset rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-[#A9B489]">
                    <span>Выбранные модули:</span>
                    <span className="text-[#F0E2C8] font-bold">{selectedModuleIds.length} позиций</span>
                  </div>
                  <div className="flex justify-between text-[#A9B489]">
                    <span>Базовая стоимость:</span>
                    <span className="line-through">${rawTotalUsd}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Скидка 50% по предрегистрации:</span>
                    <span>-${discountAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#F0E2C8] text-sm font-bold border-t border-[#A9B489]/15 pt-2">
                    <span>Итоговый бюджет участия:</span>
                    <span className="text-[#FFCF96] text-base">${finalPriceUsd} (≈ {priceUzs} сум)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('questionnaire')}
                    className="neu-btn px-4 py-2.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
                  >
                    Назад к анкете
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neu-btn px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/60 hover:bg-emerald-700/60 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Оформление...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Зафиксировать бронь со скидкой 50%</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: CONFIRMED VOUCHER & CERTIFICATE */}
          {currentStep === 'confirmed' && (
            <div className="neu-card rounded-3xl p-6 sm:p-7 border border-[#BA9470]/60 bg-gradient-to-b from-[#3a3e2c] to-[#303324] space-y-5 text-center animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-900/60 text-emerald-300 mx-auto flex items-center justify-center border border-emerald-500/50">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                  Бронь успешно зафиксирована в базе
                </span>
                <h2 className="font-headline font-bold text-2xl text-[#F0E2C8] mt-1">
                  Сертификат Резидента: {certificateId}
                </h2>
                <p className="text-xs sm:text-sm text-[#E2ECD2]/80 mt-2 max-w-md mx-auto leading-relaxed">
                  Поздравляем, {contactData.name}! Ваша индивидуальная программа на ретрит 18–20 сентября и скидка 50% сохранены в реестре экосистемы.
                </p>
              </div>

              {/* Ticket Details */}
              <div className="neu-inset p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#A9B489]/15 pb-1.5">
                  <span className="text-[#A9B489]">Участник:</span>
                  <span className="font-bold text-[#FFFDF8]">{contactData.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#A9B489]/15 pb-1.5">
                  <span className="text-[#A9B489]">Контакт:</span>
                  <span className="font-bold text-[#FFFDF8]">{contactData.contact}</span>
                </div>
                <div className="flex justify-between border-b border-[#A9B489]/15 pb-1.5">
                  <span className="text-[#A9B489]">Даты:</span>
                  <span className="font-bold text-[#BA9470]">18, 19, 20 сентября 2026</span>
                </div>
                <div className="flex justify-between border-b border-[#A9B489]/15 pb-1.5">
                  <span className="text-[#A9B489]">Локация:</span>
                  <span className="text-[#FFFDF8]">Чимган &amp; Чарвак (Узбекистан)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#A9B489]">Зафиксированный бюджет:</span>
                  <span className="font-bold text-emerald-400 text-sm">${finalPriceUsd} (скидка 50%)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('social')}
                  className="w-full sm:w-auto neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/50 hover:text-[#FFFDF8]"
                >
                  Перейти в Личный Кабинет
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('modules');
                    setViewMode('catalog');
                  }}
                  className="w-full sm:w-auto neu-btn px-5 py-2.5 rounded-xl text-xs text-[#A9B489] hover:text-[#FFFDF8]"
                >
                  В Календарь Ретритов
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL FOR RETREAT 4D BREAKDOWN */}
      {selectedRetreatModal && (
        <RetreatDetailModal
          retreat={selectedRetreatModal}
          onClose={() => setSelectedRetreatModal(null)}
          onBookNow={(retreat) => {
            setSelectedRetreatModal(null);
            setSelectedRetreatId(retreat.id);
            setViewMode('configurator');
          }}
        />
      )}

      {/* SOLO RETREAT PLANNER MODAL */}
      {(isSoloModalOpen || viewMode === 'solo_planner') && (
        <SoloRetreatPlannerModal
          onClose={() => {
            setIsSoloModalOpen(false);
            if (viewMode === 'solo_planner') {
              setViewMode('catalog');
            }
          }}
        />
      )}
    </div>
  );
};
