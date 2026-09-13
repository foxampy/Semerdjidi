import React, { useState } from 'react';
import { authService } from '../../../services/authService';

interface HeritageRootsProgramViewProps {
  onBackToCatalog: () => void;
  onOpenConstructor: () => void;
  onOpenComparison: () => void;
}

interface HeritageRoute {
  id: string;
  region: string;
  title: string;
  tagline: string;
  duration: string;
  locations: string[];
  grantSpots: number;
  subsidyPercent: string;
  focus: string;
  nextDates: string;
  icon: string;
  badge: string;
}

const HERITAGE_ROUTES: HeritageRoute[] = [
  {
    id: 'silk_road_roots',
    region: 'Центральная Азия & Восток',
    title: 'Шелковый Путь: Древний Хорезм, Согдиана & Бухара',
    tagline: 'Путешествие к истокам цивилизаций оазисов, суфийской мысли и караванным путям',
    duration: '8 дней / 7 ночей',
    locations: ['Самарканд', 'Бухара', 'Хива', 'Крепости Аяз-Кала', 'Ущелье Сармышсай'],
    grantSpots: 10,
    subsidyPercent: 'до 100% грант',
    focus: 'Исследование древней памяти, наскальные петроглифы, созерцание звезд в пустыне Кызылкум, диалоги о культурном синтезе с востоковедами.',
    nextDates: '14-21 октября 2026',
    icon: 'mosque',
    badge: 'Флагманский маршрут'
  },
  {
    id: 'hellas_semerdzhidi_roots',
    region: 'Средиземноморье & Греция',
    title: 'Эллада & Понтийское Наследие Семерджиди',
    tagline: 'Родовая память рода Семерджиди: колыбель античной философии, полиса и морских горизонтов',
    duration: '10 дней / 9 ночей',
    locations: ['Афины', 'Дельфы', 'Метеоры', 'Олимп', 'Северная Греция (Понтийские общины)'],
    grantSpots: 8,
    subsidyPercent: 'до 80% грант',
    focus: 'Философия стоицизма, родовые корни фамилии Семерджиди, античные принципы калокагатии (единства разума и тела), оливковые рощи и тишина монастырей.',
    nextDates: '12-21 мая 2027',
    icon: 'account_balance',
    badge: 'Родовое наследие'
  },
  {
    id: 'caucasus_roots',
    region: 'Кавказ & Закавказье',
    title: 'Кавказ: Родовые Башни & Память Гор',
    tagline: 'Стойкость рода, традиции братства и высокогорные святилища древности',
    duration: '7 дней / 6 ночей',
    locations: ['Сванетия (Местиа)', 'Казбеги', 'Дилижан', 'Монастыри V-X веков', 'Ущелье Трусо'],
    grantSpots: 12,
    subsidyPercent: 'до 90% грант',
    focus: 'Встречи со старейшинами, кодекс гостеприимства, тысячелетние родовые башни, чистейшие ледниковые источники и глубокое телесное заземление в горах.',
    nextDates: '3-9 июня 2027',
    icon: 'castle',
    badge: 'Горная экспедиция'
  },
  {
    id: 'altai_cradle',
    region: 'Алтай & Саяны',
    title: 'Алтай: Колыбель Народов & Первозданная Природа',
    tagline: 'Доисторическая память Евразии, курганы скифов и абсолютная тишина тайги',
    duration: '9 дней / 8 ночей',
    locations: ['Чуйский тракт', 'Урочище Калбак-Таш', 'Телецкое озеро', 'Плато Укок', 'Ледники Актру'],
    grantSpots: 7,
    subsidyPercent: 'до 70% грант',
    focus: 'Наскальное письмо тысячелетий, освобождение сознания от городского стресса, крио-закаливание, ночевки у первозданных горных рек.',
    nextDates: '18-26 июля 2027',
    icon: 'nature',
    badge: 'Места силы'
  },
  {
    id: 'levant_cradle',
    region: 'Левант & Ближний Восток',
    title: 'Левант: Перекресток Смыслов & Колыбель Писаний',
    tagline: 'Исследование духовных корней человечества и древнейших культурных пластов',
    duration: '10 дней / 9 ночей',
    locations: ['Иерусалим', 'Галилея', 'Мертвое море', 'Вади-Рам (Красная пустыня)', 'Петра'],
    grantSpots: 6,
    subsidyPercent: 'до 60% грант',
    focus: 'Диалог мировоззрений, историческая реконструкция путей пророков, акустика древних храмов, уединенное созерцание в пустыне.',
    nextDates: '10-19 ноября 2027',
    icon: 'temple_buddhist',
    badge: 'Культурный код'
  }
];

export const HeritageRootsProgramView: React.FC<HeritageRootsProgramViewProps> = ({
  onBackToCatalog,
  onOpenConstructor,
  onOpenComparison
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'grant_apply' | 'patronage'>('overview');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('silk_road_roots');

  // Application form state
  const currentUser = authService.getCurrentUser();
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantContact, setApplicantContact] = useState(currentUser?.emailOrTg || '');
  const [applicantCity, setApplicantCity] = useState('');
  const [applicantAge, setApplicantAge] = useState('24');
  const [programTrack, setProgramTrack] = useState<'taglit_expedition' | 'masa_residency'>('taglit_expedition');
  const [fundingCategory, setFundingCategory] = useState<'youth_grant_100' | 'project_grant_70' | 'self_funded_patron'>('youth_grant_100');
  const [motivationText, setMotivationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  // Patronage form state
  const [patronTier, setPatronTier] = useState<number>(1200);
  const [patronNote, setPatronNote] = useState('');
  const [patronSent, setPatronSent] = useState(false);

  const selectedRoute = HERITAGE_ROUTES.find(r => r.id === selectedRouteId) || HERITAGE_ROUTES[0];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantContact.trim()) return;

    setIsSubmitting(true);
    const newAppId = `ROOTS-${Date.now().toString(36).toUpperCase()}`;

    try {
      await authService.saveApplicationDraft({
        draftId: newAppId,
        type: 'general',
        name: applicantName.trim(),
        contact: applicantContact.trim(),
        format: programTrack === 'taglit_expedition' ? 'taglit_expedition' : 'masa_residency',
        details: `Программа Корней: ${selectedRoute.title}. Категория: ${fundingCategory}. Эссе: ${motivationText || '—'}`,
        selectedModules: [programTrack, fundingCategory, selectedRoute.id],
        questionnaire: {
          mainIntention: motivationText || 'Исследование родовой памяти и культурных корней',
          experienceLevel: `Возраст: ${applicantAge}, Город: ${applicantCity}`,
          specialRequests: `Категория: ${fundingCategory}, Трек: ${programTrack}`
        },
        step: 'completed',
        totalBudgetUsd: fundingCategory === 'youth_grant_100' ? 0 : fundingCategory === 'project_grant_70' ? 105 : 1200,
        promoCode: fundingCategory === 'youth_grant_100' ? 'TAGLIT-GRANT-100' : 'TAGLIT-GRANT-70'
      });

      setApplicationId(newAppId);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatronSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.submitInboxMessage({
        fromName: applicantName || 'Меценат Программы Корней',
        fromContact: applicantContact || 'Не указан',
        subject: `Меценатство: Спонсирование стипендии $${patronTier}`,
        message: `Желание профинансировать стипендиальное место для экспедиции «${selectedRoute.title}». Заметка: ${patronNote || 'Без комментариев'}`
      });
      setPatronSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/50 bg-gradient-to-br from-[#3b402e] via-[#353927] to-[#2e3222] relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#BA9470]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFCF96] font-bold px-3 py-1 rounded-full neu-inset border border-[#BA9470]/40 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400">public</span>
              Глобальная Инициатива • Аналог Таглит &amp; Маса
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Грантовый фонд 2026–2027
            </span>
          </div>

          <button
            onClick={onBackToCatalog}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Каталог ретритов
          </button>
        </div>

        <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl text-[#F0E2C8] leading-tight">
          Программа Корней &amp; Мировых Экспедиций
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/90 mt-2.5 max-w-3xl leading-relaxed">
          Субсидированные грантами и меценатами образовательно-исследовательские путешествия к культурным истокам, родовой памяти и точкам внутренней опоры. По всему миру — от Шелкового пути и понтийского наследия Семерджиди до Кавказа и Алтая.
        </p>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 pt-5 mt-4 border-t border-[#A9B489]/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            Концепция &amp; Два Формата
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'routes'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            5 Мировых Маршрутов ({HERITAGE_ROUTES.length})
          </button>

          <button
            onClick={() => setActiveTab('grant_apply')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'grant_apply'
                ? 'neu-pill-active text-[#FFCF96] border border-[#BA9470] shadow-md'
                : 'neu-btn text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            Подать на Грант (до 100%)
          </button>

          <button
            onClick={() => setActiveTab('patronage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'patronage'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
            Фонд Меценатов
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & FORMATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Mission & Heritage Pillars */}
          <div className="neu-card p-5 sm:p-6 rounded-3xl border border-[#A9B489]/20 bg-[#353928] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#BA9470]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Почему миру нужен аналог Таглит &amp; Маса?
            </div>

            <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed">
              В Израиле программы <strong>Таглит (Birthright)</strong> и <strong>Маса</strong> доказали силу культурного возвращения: десятки тысяч молодых людей находят свои корни, обретают внутреннюю опору, глубокую связь с предками и мощное созидательное сообщество на всю жизнь.
            </p>

            <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed">
              Экосистема <strong>EthOSium и Екатерина Семерджиди</strong> масштабируют этот фундаментальный принцип на весь мир: каждый человек имеет право соприкоснуться с глубинным культурным кодом своей земли, родовой памятью и сакральными точками истории — без коммерческого туризма, с исследовательскими полевыми дневниками и наставниками.
            </p>
          </div>

          {/* Two Distinct Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format 1: Taglit Expedition */}
            <div className="neu-card p-5 sm:p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#373c2a] to-[#323625] space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full neu-inset border border-emerald-500/30">
                  Формат 1 • Краткосрочный
                </span>
                <span className="text-xs font-bold text-[#F0E2C8]">7 – 10 Дней</span>
              </div>

              <h2 className="font-headline font-bold text-xl text-[#F0E2C8] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[24px]">travel_explore</span>
                Таглит-Экспедиция: Погружение в Корни
              </h2>

              <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
                Интенсивное культурно-исследовательское путешествие для молодежи (18–35 лет) и исследователей родовой памяти.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#A9B489]/15 text-xs text-[#E2ECD2]/80">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0 mt-0.5">check</span>
                  <span><strong>50%–100% покрытие расходов:</strong> субсидируется грантовым фондом экосистемы и меценатами.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0 mt-0.5">check</span>
                  <span><strong>Полевой дневник &amp; рефлексия:</strong> ежедневные записи, диалоги у костра с историками и мыслителями.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0 mt-0.5">check</span>
                  <span><strong>Живой контакт с хранителями:</strong> посещение нетуристических ремесленных и духовных обителей.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProgramTrack('taglit_expedition');
                  setActiveTab('grant_apply');
                }}
                className="w-full mt-3 neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/30 border border-emerald-500/40 hover:bg-emerald-700/40 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit_document</span>
                Подать заявку на Таглит-трек
              </button>
            </div>

            {/* Format 2: Masa Fellowship & Residency */}
            <div className="neu-card p-5 sm:p-6 rounded-3xl border border-[#BA9470]/50 bg-gradient-to-b from-[#3a3f2b] to-[#323625] space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFCF96] font-bold px-2.5 py-0.5 rounded-full neu-inset border border-[#BA9470]/40">
                  Формат 2 • Долгосрочный
                </span>
                <span className="text-xs font-bold text-[#F0E2C8]">1 – 3 Месяца</span>
              </div>

              <h2 className="font-headline font-bold text-xl text-[#F0E2C8] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFCF96] text-[24px]">diversity_2</span>
                Маса-Резиденция: Исследовательский Fellowship
              </h2>

              <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
                Глубокая стажировка и жизнь в резиденции с проектной работой в R&amp;D лаборатории LabForge и Институте EthOSium.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#A9B489]/15 text-xs text-[#E2ECD2]/80">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#BA9470] shrink-0 mt-0.5">check</span>
                  <span><strong>Стипендия &amp; проживание:</strong> грантовая стипендия на исследовательские проекты и жизнь в резиденции.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#BA9470] shrink-0 mt-0.5">check</span>
                  <span><strong>Менторство Екатерины Семерджиди:</strong> регулярные кураторские разборы и совместные публикации.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#BA9470] shrink-0 mt-0.5">check</span>
                  <span><strong>Интеграция в LabForge:</strong> создание цифровых решений, методологий и культурных артефактов.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProgramTrack('masa_residency');
                  setActiveTab('grant_apply');
                }}
                className="w-full mt-3 neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">hub</span>
                Подать на Маса-Fellowship
              </button>
            </div>
          </div>

          {/* Quick Route Teaser */}
          <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#353826] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-[#F0E2C8]">Готовы выбрать географическое направление?</h3>
              <p className="text-[11px] text-[#A9B489]">5 маршрутов: Шелковый Путь, Греция Семерджиди, Кавказ, Алтай, Левант</p>
            </div>

            <button
              onClick={() => setActiveTab('routes')}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              Смотреть маршруты
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ROUTES CATALOG */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-headline font-bold text-lg text-[#F0E2C8]">
              География Исследовательских Экспедиций
            </h2>
            <span className="text-xs font-mono text-[#A9B489]">
              {HERITAGE_ROUTES.length} активных направлений 2026–2027
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HERITAGE_ROUTES.map(route => {
              const isSelected = route.id === selectedRouteId;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`neu-card p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-[#BA9470] bg-[#3a3f2c] ring-1 ring-[#BA9470]/50 shadow-xl'
                      : 'border-[#A9B489]/25 bg-[#343827] hover:border-[#BA9470]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#FFCF96] px-2 py-0.5 rounded-full neu-inset border border-[#BA9470]/30">
                        {route.region}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {route.subsidyPercent}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-base text-[#F0E2C8] leading-snug flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#BA9470] text-[20px]">
                        {route.icon}
                      </span>
                      {route.title}
                    </h3>

                    <p className="text-xs text-[#A9B489] italic">
                      «{route.tagline}»
                    </p>

                    <p className="text-xs text-[#E2ECD2]/85 leading-relaxed pt-1">
                      {route.focus}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {route.locations.map((loc, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded neu-inset text-[#F0E2C8]/90 border border-[#A9B489]/15">
                          📍 {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#A9B489]/15 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-[#A9B489]">Даты экспедиции:</div>
                      <div className="text-xs font-mono font-bold text-[#F0E2C8]">{route.nextDates}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRouteId(route.id);
                        setActiveTab('grant_apply');
                      }}
                      className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 flex items-center gap-1 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      Подать на этот маршрут
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GRANT & SCHOLARSHIP APPLICATION */}
      {activeTab === 'grant_apply' && (
        <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/40 bg-[#353928] space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#A9B489]/15 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Открытый Грантовый Конкурс
              </span>
              <h2 className="font-headline font-bold text-xl text-[#F0E2C8] mt-0.5">
                Заявка на Грант Программы Корней (Таглит &amp; Маса)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#FFCF96] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
              Выбран маршрут: {selectedRoute.title.split(':')[0]}
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl neu-inset border border-emerald-500/40 bg-emerald-950/20 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <h3 className="font-headline font-bold text-lg text-[#F0E2C8]">
                Ваша грантовая заявка успешно принята!
              </h3>
              <p className="text-xs text-[#E2ECD2]/85 max-w-lg mx-auto">
                Код заявки: <strong className="font-mono text-[#FFCF96]">{applicationId}</strong>. Кураторы Программы Корней и координатор свяжутся с вами в Telegram для подтверждения этапа мотивационного собеседования.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
                >
                  Подать еще одну заявку
                </button>
                <button
                  onClick={onBackToCatalog}
                  className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470]"
                >
                  Вернуться в каталог
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-5">
              {/* Route Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-[#BA9470]">
                  1. Выберите Направление Экспедиции:
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full neu-inset px-3.5 py-2.5 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/25 focus:border-[#BA9470] focus:outline-none"
                >
                  {HERITAGE_ROUTES.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#343827]">
                      {r.title} ({r.region}) — {r.subsidyPercent}
                    </option>
                  ))}
                </select>
              </div>

              {/* Track Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-[#BA9470]">
                  2. Выберите Формат Участия:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setProgramTrack('taglit_expedition')}
                    className={`p-3.5 rounded-2xl neu-card border cursor-pointer transition-all ${
                      programTrack === 'taglit_expedition'
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                      Таглит-Экспедиция (7-10 дней)
                    </div>
                    <p className="text-[11px] text-[#E2ECD2]/75 mt-1">
                      Интенсивное погружение в полевые условия, историческую память и практики заземления.
                    </p>
                  </div>

                  <div
                    onClick={() => setProgramTrack('masa_residency')}
                    className={`p-3.5 rounded-2xl neu-card border cursor-pointer transition-all ${
                      programTrack === 'masa_residency'
                        ? 'border-[#BA9470] bg-[#3a3e2b] text-[#FFCF96]'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                      Маса-Резиденция &amp; Fellowship (1-3 мес)
                    </div>
                    <p className="text-[11px] text-[#E2ECD2]/75 mt-1">
                      Проживание в резиденции, исследовательская стипендия и менторство проекта в LabForge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Funding Level */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-[#BA9470]">
                  3. Категория Финансирования:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    onClick={() => setFundingCategory('youth_grant_100')}
                    className={`p-3 rounded-xl neu-card border cursor-pointer transition-all flex flex-col justify-between ${
                      fundingCategory === 'youth_grant_100'
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="text-xs font-bold">🎓 Молодежный Грант</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-1">Покрытие до 100%</div>
                    <div className="text-[10px] text-[#E2ECD2]/70 mt-1">Для участников 18-35 лет</div>
                  </label>

                  <label
                    onClick={() => setFundingCategory('project_grant_70')}
                    className={`p-3 rounded-xl neu-card border cursor-pointer transition-all flex flex-col justify-between ${
                      fundingCategory === 'project_grant_70'
                        ? 'border-[#BA9470] bg-[#393d2a] text-[#FFCF96]'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="text-xs font-bold">🏛️ Исследовательский Грант</div>
                    <div className="text-[10px] text-[#FFCF96] font-mono mt-1">Покрытие до 70%</div>
                    <div className="text-[10px] text-[#E2ECD2]/70 mt-1">Авторам культурных инициатив</div>
                  </label>

                  <label
                    onClick={() => setFundingCategory('self_funded_patron')}
                    className={`p-3 rounded-xl neu-card border cursor-pointer transition-all flex flex-col justify-between ${
                      fundingCategory === 'self_funded_patron'
                        ? 'border-purple-500 bg-purple-950/20 text-purple-300'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="text-xs font-bold">🤝 Меценатское Участие</div>
                    <div className="text-[10px] text-purple-300 font-mono mt-1">100% + спонсорство</div>
                    <div className="text-[10px] text-[#E2ECD2]/70 mt-1">Оплата за себя и стипендиата</div>
                  </label>
                </div>
              </div>

              {/* Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#A9B489]">Ваше Имя и Фамилия *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Тимур Садыков"
                    className="w-full mt-1 neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#A9B489]">Telegram или Email *</label>
                  <input
                    type="text"
                    required
                    value={applicantContact}
                    onChange={(e) => setApplicantContact(e.target.value)}
                    placeholder="@username или почта"
                    className="w-full mt-1 neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-[#A9B489]">Город проживания</label>
                    <input
                      type="text"
                      value={applicantCity}
                      onChange={(e) => setApplicantCity(e.target.value)}
                      placeholder="Ташкент"
                      className="w-full mt-1 neu-inset px-2.5 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#A9B489]">Возраст</label>
                    <input
                      type="number"
                      value={applicantAge}
                      onChange={(e) => setApplicantAge(e.target.value)}
                      placeholder="25"
                      className="w-full mt-1 neu-inset px-2.5 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Motivation Essay */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#A9B489] flex items-center justify-between">
                  <span>Мотивация: Почему для вас важно исследование корней и культурной памяти? *</span>
                  <span className="text-[10px] text-[#BA9470]">Краткое эссе</span>
                </label>
                <textarea
                  rows={3}
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                  placeholder="Опишите, что вы ищете в экспедиции, какая культурная или родовая связь вас влечет и какой проект вы хотели бы развить по возвращении..."
                  className="w-full neu-inset p-3 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#A9B489]/15">
                <p className="text-[11px] text-[#A9B489]">
                  Заявка автоматически регистрируется в базе грантового комитета EthOSium.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto neu-btn px-6 py-3 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">
                    {isSubmitting ? 'sync' : 'send'}
                  </span>
                  {isSubmitting ? 'Отправка заявки...' : 'Подать заявку на грант'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: PATRONAGE & ENDOWMENT FUND */}
      {activeTab === 'patronage' && (
        <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/40 bg-[#353928] space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFCF96] font-bold">
              Фонд Поколений &amp; Меценатство
            </span>
            <h2 className="font-headline font-bold text-xl text-[#F0E2C8]">
              Подарите Путешествие Корней Следующему Поколению
            </h2>
            <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
              Успешные выпускники, резиденты и инвесторы экосистемы могут профинансировать стипендиальное место для молодого исследователя, студента или соотечественника. 100% средств направляются в фонд грантов.
            </p>
          </div>

          {patronSent ? (
            <div className="p-5 rounded-2xl neu-inset border border-emerald-500/40 bg-emerald-950/20 text-center space-y-2">
              <span className="material-symbols-outlined text-[32px] text-emerald-400">favorite</span>
              <h3 className="font-bold text-sm text-[#F0E2C8]">Благодарим за поддержку Фонда Поколений!</h3>
              <p className="text-xs text-[#E2ECD2]/80">
                Координатор попечительского совета свяжется с вами для оформления именной стипендии.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePatronSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { tier: 350, title: 'Частичный грант (70%)', desc: 'Покрывает участие 1 исследователя в горном треке' },
                  { tier: 800, title: 'Полная стипендия (100%)', desc: 'Полный Таглит-трек на 8 дней с проживанием и трансфером' },
                  { tier: 1500, title: 'Именная стипендия Fellow', desc: 'Полный грант на Маса-резиденцию и исследовательский проект' }
                ].map(item => (
                  <div
                    key={item.tier}
                    onClick={() => setPatronTier(item.tier)}
                    className={`p-4 rounded-2xl neu-card border cursor-pointer transition-all ${
                      patronTier === item.tier
                        ? 'border-[#BA9470] bg-[#3a3f2b] text-[#FFCF96]'
                        : 'border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="font-mono text-base font-bold text-[#F0E2C8]">${item.tier}</div>
                    <div className="font-bold text-xs text-[#E2ECD2] mt-1">{item.title}</div>
                    <div className="text-[11px] text-[#A9B489] mt-1 leading-normal">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#A9B489]">Ваше пожелание или посвящение (необязательно)</label>
                <input
                  type="text"
                  value={patronNote}
                  onChange={(e) => setPatronNote(e.target.value)}
                  placeholder="Именная стипендия в память о корнях семьи..."
                  className="w-full mt-1 neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#2f3223] border border-[#A9B489]/20 focus:border-[#BA9470] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="neu-btn px-6 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#FFCF96]">volunteer_activism</span>
                  Подтвердить намерение спонсировать стипендию (${patronTier})
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Bottom Ecosystem Switcher */}
      <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/25 bg-[#343827] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#F0E2C8]">Другие разделы модуля «Ретриты &amp; Путешествия»</h4>
          <p className="text-[11px] text-[#A9B489]">Суточный конструктор на 15 мест, 3-дневный Чимган или аудит экономики</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenConstructor}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] border border-[#A9B489]/30 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px] text-amber-400">tune</span>
            24h Конструктор (15 мест)
          </button>
          <button
            onClick={onOpenComparison}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] border border-[#A9B489]/30 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px] text-[#BA9470]">compare_arrows</span>
            Сравнение моделей
          </button>
        </div>
      </div>
    </div>
  );
};
