import React, { useState, useEffect, useRef } from 'react';
import { ActiveScreen, EthosiumUserProfile, RetreatQuestionnaireData } from '../../../semerdzhidiTypes';
import { authService } from '../../../services/authService';
import { shareModule } from '../../../utils/shareHelper';

interface ModularRetreatConstructorProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSwitchToOldModel: () => void;
  onOpenComparison: () => void;
}

export type AccommodationTier = 'budget' | 'yurt' | 'cottage';
export type SupOption = 'none' | '1hour' | 'day' | 'daynight';

export interface OptionalModulesState {
  accommodation: AccommodationTier;
  horse: boolean;
  quad: boolean;
  sup: SupOption;
  banya: boolean;
  niva: boolean;
  waterfallCar: boolean;
  farmFood: boolean;
}

export const ModularRetreatConstructor: React.FC<ModularRetreatConstructorProps> = ({
  onNavigate,
  onSwitchToOldModel,
  onOpenComparison,
}) => {
  // Stepper: 'constructor' | 'questionnaire' | 'contact' | 'confirmed'
  const [currentStep, setCurrentStep] = useState<'constructor' | 'questionnaire' | 'contact' | 'confirmed'>('constructor');

  // Selected Modules State
  const [modules, setModules] = useState<OptionalModulesState>({
    accommodation: 'yurt', // default Comfort
    horse: true,
    quad: false,
    sup: '1hour',
    banya: true,
    niva: false,
    waterfallCar: false,
    farmFood: true,
  });

  // Questionnaire State
  const [questionnaire, setQuestionnaire] = useState<RetreatQuestionnaireData>({
    experienceLevel: 'Любитель (бываю в горах 2-3 раза в год)',
    nutritionPreference: 'Стандартное горное фермерское',
    mainIntention: 'Снять хроническую усталость, перегруз и выйти из режима гиперконтроля',
    horseRidingExperience: 'Спокойный шаг с инструктором',
    accommodationType: 'Юрта (этно-комфорт)',
    specialRequests: '',
  });

  // User & Contact
  const [userProfile, setUserProfile] = useState<EthosiumUserProfile | null>(() => authService.getCurrentUser());
  const [contactData, setContactData] = useState({
    name: userProfile?.name || '',
    contact: userProfile?.emailOrTg || '',
    email: userProfile?.emailOrTg?.includes('@') ? userProfile.emailOrTg : '',
    password: '',
  });

  // Draft Autosave
  const [draftId] = useState<string>(() => {
    return localStorage.getItem('ethosium_modular_draft_id') || `DRAFT-MOD-${Date.now().toString(36).toUpperCase()}`;
  });
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [certificateId, setCertificateId] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('ethosium_modular_draft_id', draftId);
  }, [draftId]);

  // Economic calculations based on 15 participants
  // Fixed Staff: Specialist $400 + Founder/Lead $400 = $800 total / 15 participants = $53.33/person
  const FIXED_STAFF_COST = 53;
  const FIXED_STAFF_RETAIL = 75; // retail contribution

  // Accommodation Cost & Retail
  const ACCOMMODATION_DATA: Record<AccommodationTier, { name: string; cost: number; retail: number; icon: string; desc: string }> = {
    budget: {
      name: 'Бюджетное размещение (MIN)',
      cost: 30,
      retail: 45,
      icon: 'night_shelter',
      desc: 'Базовый уютный номер в горном эко-комплексе, все удобства на этаже',
    },
    yurt: {
      name: 'Аутентичная юрта (COMFORT)',
      cost: 50,
      retail: 80,
      icon: 'cabin',
      desc: 'Войлочная национальная юрта с печным теплом, коврами и чистым горным воздухом',
    },
    cottage: {
      name: 'Отдельный эко-домик (PREMIUM)',
      cost: 100,
      retail: 155,
      icon: 'villa',
      desc: 'Премиальный коттедж с панорамным видом на Чимган, санузлом и камином',
    },
  };

  // Base Cost = Fixed Staff + Accommodation
  const baseCost = FIXED_STAFF_COST + ACCOMMODATION_DATA[modules.accommodation].cost;
  const baseRetail = FIXED_STAFF_RETAIL + ACCOMMODATION_DATA[modules.accommodation].retail;

  // Calculate Optional Modules Cost & Retail
  let optionalCost = 0;
  let optionalRetail = 0;

  if (modules.horse) {
    optionalCost += 25;
    optionalRetail += 35;
  }
  if (modules.quad) {
    optionalCost += 25;
    optionalRetail += 35;
  }
  if (modules.sup === '1hour') {
    optionalCost += 6;
    optionalRetail += 10;
  } else if (modules.sup === 'day') {
    optionalCost += 13;
    optionalRetail += 20;
  } else if (modules.sup === 'daynight') {
    optionalCost += 21;
    optionalRetail += 30;
  }
  if (modules.banya) {
    // 2 hours for 5 persons = $42 total = $8.40 per person if split, or $42 slot
    optionalCost += 42;
    optionalRetail += 55;
  }
  if (modules.niva) {
    // 700 000 UZS ≈ $59 for 3 persons = $20/person
    optionalCost += 20;
    optionalRetail += 28;
  }
  if (modules.waterfallCar) {
    // 300 000 UZS ≈ $25 for 3 persons = $8/person
    optionalCost += 8;
    optionalRetail += 12;
  }
  if (modules.farmFood) {
    optionalCost += 20;
    optionalRetail += 28;
  }

  // Total Unit Economics
  const totalCostPriceUsd = Math.round(baseCost + optionalCost);
  const totalRetailPriceUsd = Math.round(baseRetail + optionalRetail);
  const priceUzs = (totalRetailPriceUsd * 12800).toLocaleString('ru-RU');
  const costUzs = (totalCostPriceUsd * 12800).toLocaleString('ru-RU');
  const marginUsd = totalRetailPriceUsd - totalCostPriceUsd;

  // Preset Handlers
  const applyPreset = (preset: 'min' | 'comfort' | 'max') => {
    if (preset === 'min') {
      setModules({
        accommodation: 'budget',
        horse: false,
        quad: false,
        sup: 'none',
        banya: false,
        niva: false,
        waterfallCar: false,
        farmFood: true,
      });
      setQuestionnaire(prev => ({ ...prev, accommodationType: 'Бюджетный номер' }));
    } else if (preset === 'comfort') {
      setModules({
        accommodation: 'yurt',
        horse: true,
        quad: false,
        sup: '1hour',
        banya: true,
        niva: false,
        waterfallCar: false,
        farmFood: true,
      });
      setQuestionnaire(prev => ({ ...prev, accommodationType: 'Юрта (этно-комфорт)' }));
    } else if (preset === 'max') {
      setModules({
        accommodation: 'cottage',
        horse: true,
        quad: true,
        sup: 'daynight',
        banya: true,
        niva: true,
        waterfallCar: true,
        farmFood: true,
      });
      setQuestionnaire(prev => ({ ...prev, accommodationType: 'Премиум эко-домик' }));
    }
  };

  // Debounced Autosave of Draft
  useEffect(() => {
    if (currentStep === 'confirmed') return;

    setAutosaveStatus('saving');
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        const selectedList: string[] = [
          `База: персонал $53 + ${ACCOMMODATION_DATA[modules.accommodation].name}`,
        ];
        if (modules.horse) selectedList.push('Конная прогулка ($25/$35)');
        if (modules.quad) selectedList.push('Квадроцикл ($25/$35)');
        if (modules.sup !== 'none') selectedList.push(`SUP: ${modules.sup}`);
        if (modules.banya) selectedList.push('Баня 2ч ($42/$55)');
        if (modules.niva) selectedList.push('Нива к высокогорью ($20/$28)');
        if (modules.waterfallCar) selectedList.push('Машина к водопаду ($8/$12)');
        if (modules.farmFood) selectedList.push('Горное фермерское питание ($20/$28)');

        const payload = {
          draftId,
          type: 'retreat_chimgan' as const,
          name: contactData.name || 'Гость (конструктор 15 мест)',
          contact: contactData.contact || 'Контакт заполняется',
          format: modules.accommodation === 'cottage' ? 'vip' : 'custom',
          details: `Модульный ретрит 24h (15 мест). Инвестиция: $${totalRetailPriceUsd}. Модули: ${selectedList.join('; ')}`,
          selectedModules: selectedList,
          questionnaire,
          step: currentStep,
          totalBudgetUsd: totalRetailPriceUsd,
          promoCode: 'MODULAR-15P',
        };

        const res = await authService.saveApplicationDraft(payload);
        if (res.success && res.draft) {
          setAutosaveStatus('saved');
        } else {
          setAutosaveStatus('idle');
        }
      } catch (err) {
        console.warn('Modular autosave error:', err);
        setAutosaveStatus('idle');
      }
    }, 800);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [modules, questionnaire, contactData, currentStep, totalCostPriceUsd, totalRetailPriceUsd, draftId]);

  // Final Registration
  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.contact.trim() || !contactData.name.trim()) {
      setAuthError('Пожалуйста, укажите имя и телефон или Telegram');
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      let currentUser = userProfile;
      if (!currentUser) {
        const regRes = await authService.registerEmail({
          name: contactData.name.trim(),
          emailOrTg: contactData.contact.trim(),
          password: contactData.password || undefined,
          role: 'Резидент модульного ретрита 24h',
          contour: 'semerdzhidi',
          archetype: 'Практик Осознанного Выбора (Модульная Модель)',
        });
        if (regRes.success && regRes.user) {
          currentUser = regRes.user;
          setUserProfile(regRes.user);
        }
      }

      const certNumber = `MOD-ETH-15-${Math.floor(1000 + Math.random() * 9000)}`;
      setCertificateId(certNumber);

      const selectedList: string[] = [
        `База: персонал $53 + ${ACCOMMODATION_DATA[modules.accommodation].name}`,
      ];
      if (modules.horse) selectedList.push('Лошадь');
      if (modules.quad) selectedList.push('Квадроцикл');
      if (modules.sup !== 'none') selectedList.push(`SUP: ${modules.sup}`);
      if (modules.banya) selectedList.push('Баня');
      if (modules.niva) selectedList.push('Нива');
      if (modules.waterfallCar) selectedList.push('Водопад');
      if (modules.farmFood) selectedList.push('Питание');

      await authService.submitApplication({
        id: draftId,
        type: 'retreat_chimgan',
        name: contactData.name.trim(),
        contact: contactData.contact.trim(),
        format: modules.accommodation === 'cottage' ? 'vip' : 'standard',
        details: `Бронь модульного ретрита 24h. Сертификат: ${certNumber}. Формат участия: $${totalRetailPriceUsd}. Набор: ${selectedList.join(', ')}. Запрос: ${questionnaire.mainIntention}.`,
        status: 'new',
        amountUsd: totalRetailPriceUsd,
        promoCode: 'MODULAR-15P',
        selectedModules: selectedList,
        questionnaire,
        step: 'completed',
        isDraft: false,
      });

      setCurrentStep('confirmed');
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка оформления заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Notification Bar comparing with the old 3-day model */}
      <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/40 bg-gradient-to-r from-[#3c402e] to-[#333626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#BA9470] text-[24px]">verified</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F0E2C8]">Новый суточный ретрит: 15 участников</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                Форматы от $120 / Свободный выбор
              </span>
            </div>
            <p className="text-[11px] text-[#A9B489]">
              Глубокая психологическая декомпрессия, фундаментальная программа Екатерины Семерджиди и гибкий выбор модулей.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onOpenComparison}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#BA9470] hover:text-[#F0E2C8] border border-[#BA9470]/40 flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
            Сравнить со старой моделью
          </button>
          <button
            onClick={onSwitchToOldModel}
            className="neu-btn px-2.5 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] shrink-0"
            title="Перейти к 3-дневной программе 18-20 сентября"
          >
            3 дня (18-20 сент.)
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-b from-[#3d4230] to-[#343828] relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full neu-inset text-[10px] uppercase font-bold tracking-widest text-[#BA9470] border border-[#BA9470]/30">
              Формат 24h (15 участников)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
              Цена от $120–150
            </span>
          </div>

          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A9B489] bg-[#2a2c20]/60 px-2.5 py-1 rounded-full border border-[#A9B489]/20">
            {autosaveStatus === 'saving' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Автосохранение...</span>
              </>
            )}
            {autosaveStatus === 'saved' && (
              <>
                <span className="material-symbols-outlined text-[13px] text-emerald-400">cloud_done</span>
                <span className="text-emerald-300">Сохранено в базу админов</span>
              </>
            )}
            {autosaveStatus === 'idle' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A9B489]" />
                <span>Синхронизация активна</span>
              </>
            )}
          </div>
        </div>

        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] leading-tight">
          Конструктор Ретрита Перезагрузки: Чимган &amp; Чарвак
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 leading-relaxed">
          Прозрачная модульная экономика на группу из 15 резидентов. Вы оплачиваете гарантированную базу (ведущие специалисты и проживание) и свободно подключаете только те активности, которые нужны именно вам.
        </p>

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-3 border-t border-[#A9B489]/15">
          <div className="neu-inset p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#A9B489] block font-mono">Ядро программы</span>
            <span className="text-sm font-bold text-[#F0E2C8] font-mono">Включено</span>
            <span className="text-[9px] text-[#A9B489]">Психоанализ &amp; Практики</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#A9B489] block font-mono">Размещение</span>
            <span className="text-sm font-bold text-[#BA9470] font-mono">3 формата</span>
            <span className="text-[9px] text-[#A9B489]">Эко-номер, юрта или коттедж</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#A9B489] block font-mono">Психологический фокус</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">Декомпрессия</span>
            <span className="text-[9px] text-emerald-300/80">Снятие гиперконтроля</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#A9B489] block font-mono">Инвестиция в участие</span>
            <span className="text-sm font-bold text-[#FFCF96] font-mono">${totalRetailPriceUsd}</span>
            <span className="text-[9px] text-[#FFCF96]/80">≈ {priceUzs} сум</span>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setCurrentStep('constructor')}
          className={`p-3 rounded-2xl text-left transition-all border ${
            currentStep === 'constructor'
              ? 'neu-card border-[#BA9470] bg-[#3a3e2c] text-[#F0E2C8]'
              : 'neu-inset text-[#A9B489] border-transparent'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470]">1</span>
            <span>Конструктор</span>
          </div>
          <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">База и активности</span>
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
          <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">Цели и формат</span>
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
            <span>Бронирование</span>
          </div>
          <span className="text-[10px] text-[#A9B489] block mt-0.5 truncate">Фиксация слота</span>
        </button>
      </div>

      {/* STEP 1: CONSTRUCTOR */}
      {currentStep === 'constructor' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* 1-Click Presets */}
          <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 space-y-3 bg-[#383c2a]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA9470] font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Быстрые пакеты в 1 клик
              </span>
              <span className="text-[11px] text-[#A9B489]">Или соберите свой ниже</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* MIN PRESET */}
              <button
                onClick={() => applyPreset('min')}
                className="neu-inset p-3.5 rounded-xl text-left hover:border-[#BA9470]/60 border border-transparent transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F0E2C8] group-hover:text-[#FFCF96]">Пакет MIN</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300">
                      Базовый
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A9B489] mt-1">
                    Фундаментальная программа + Номер + Питание
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#A9B489]/15 flex items-baseline justify-between font-mono">
                  <span className="text-[10px] text-[#A9B489]">Базовый пакет</span>
                  <span className="text-sm font-bold text-emerald-400">$135</span>
                </div>
              </button>

              {/* COMFORT PRESET */}
              <button
                onClick={() => applyPreset('comfort')}
                className="neu-card p-3.5 rounded-xl text-left border border-[#BA9470]/60 hover:border-[#BA9470] transition-all group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#BA9470]/25 text-[#BA9470] text-[9px] font-mono uppercase px-2 py-0.5 rounded-bl-lg font-bold">
                  Хит
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F0E2C8] group-hover:text-[#FFCF96]">Пакет COMFORT</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#BA9470]/30 text-[#FFCF96]">
                      Оптимум
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A9B489] mt-1">
                    Фундаментальная программа + Юрта + Лошадь + SUP + Баня + Питание
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#A9B489]/15 flex items-baseline justify-between font-mono">
                  <span className="text-[10px] text-[#A9B489]">Сбалансированный</span>
                  <span className="text-sm font-bold text-[#FFCF96]">$190</span>
                </div>
              </button>

              {/* MAX PRESET */}
              <button
                onClick={() => applyPreset('max')}
                className="neu-inset p-3.5 rounded-xl text-left hover:border-[#BA9470]/60 border border-transparent transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F0E2C8] group-hover:text-[#FFCF96]">Пакет MAX</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300">
                      Experience
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A9B489] mt-1">
                    Фундаментальная программа + Домик + Полный набор горных впечатлений
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#A9B489]/15 flex items-baseline justify-between font-mono">
                  <span className="text-[10px] text-[#A9B489]">Полное погружение</span>
                  <span className="text-sm font-bold text-purple-300">$360</span>
                </div>
              </button>
            </div>
          </div>

          {/* 1. CORE METHODOLOGY & EXPERIENCE */}
          <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/40 bg-gradient-to-br from-[#383d29] to-[#323625] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA9470] font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
                1. Психоаналитический и психологический контур программы (Архитектура самопознания)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Ядро ретрита (Включено)
              </span>
            </div>

            <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
              Суточный ретрит в Чимгане — это не просто отдых в горах, а <strong>концентрированное 24-часовое аналитическое погружение</strong>, разработанное для предпринимателей, исследователей и лидеров. Фокус программы — деконструкция хронического гиперконтроля, выявление бессознательных сценариев выгорания, снятие мышечного панциря и восстановление глубинного контакта с собой.
            </p>

            {/* Leads & Vectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="neu-inset p-4 rounded-xl flex items-start gap-3 border border-[#BA9470]/30 bg-[#353927]">
                <span className="material-symbols-outlined text-[#BA9470] text-[26px] shrink-0 mt-0.5">psychology</span>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#F0E2C8] flex items-center gap-1.5">
                    <span>Екатерина Семерджиди</span>
                    <span className="text-[10px] font-mono text-[#BA9470] font-normal">• Психоанализ &amp; Тень</span>
                  </h4>
                  <ul className="text-[11px] text-[#A9B489] space-y-1 leading-relaxed list-disc list-inside">
                    <li><strong>Аудит гиперконтроля:</strong> исследование защитных механизмов психики и перфекционизма как бегства от уязвимости.</li>
                    <li><strong>Юнгианская интеграция Тени:</strong> контакт с вытесненными аспектами личности, возвращение подавленной энергии (Libido).</li>
                    <li><strong>Анализ мышечного панциря:</strong> высвобождение челюстных, горловых и грудных зажимов по методике В. Райха и А. Лоуэна.</li>
                  </ul>
                </div>
              </div>

              <div className="neu-inset p-4 rounded-xl flex items-start gap-3 border border-[#A9B489]/25 bg-[#343725]">
                <span className="material-symbols-outlined text-emerald-400 text-[26px] shrink-0 mt-0.5">explore</span>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#F0E2C8] flex items-center gap-1.5">
                    <span>Тимур Садыков</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-normal">• Полевой контур &amp; Мауна</span>
                  </h4>
                  <ul className="text-[11px] text-[#A9B489] space-y-1 leading-relaxed list-disc list-inside">
                    <li><strong>Практика осознанного молчания (Мауна):</strong> тропы тишины в реликтовых урочищах Чимгана, отключение сенсорного шума мегаполиса.</li>
                    <li><strong>Контакт со стихиями &amp; Заземление:</strong> телесное сонастраивание с пространством гор, преодоление ментальных застреваний.</li>
                    <li><strong>Безопасный контейнер группы:</strong> сопровождение полевых интервенций, навигация по горному ландшафту.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4 Phases of 24h Transformation */}
            <div className="neu-inset p-3.5 rounded-xl border border-[#A9B489]/20 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
                4 Этапа трансформации за 24 часа в горах:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#383d2a]/80 border border-[#A9B489]/15">
                  <div className="flex items-center gap-1.5 text-[#FFCF96] font-mono font-bold text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#BA9470]/30 flex items-center justify-center text-[9px]">1</span>
                    <span>12:00–15:00</span>
                  </div>
                  <h5 className="font-bold text-[#F0E2C8] text-[11px] mt-1">Снятие Персоны &amp; Вход</h5>
                  <p className="text-[10px] text-[#A9B489] mt-0.5 leading-snug">
                    Снятие социальной маски и регалий. Аналитический контракт, диагностика ведущего запроса.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#383d2a]/80 border border-[#A9B489]/15">
                  <div className="flex items-center gap-1.5 text-[#FFCF96] font-mono font-bold text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#BA9470]/30 flex items-center justify-center text-[9px]">2</span>
                    <span>15:00–19:00</span>
                  </div>
                  <h5 className="font-bold text-[#F0E2C8] text-[11px] mt-1">Полевая терапия &amp; Контакт</h5>
                  <p className="text-[10px] text-[#A9B489] mt-0.5 leading-snug">
                    Иппотерапевтическое зеркало бессознательного, тропа молчания, контакт со стихиями.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#383d2a]/80 border border-[#A9B489]/15">
                  <div className="flex items-center gap-1.5 text-[#FFCF96] font-mono font-bold text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#BA9470]/30 flex items-center justify-center text-[9px]">3</span>
                    <span>19:00–23:00</span>
                  </div>
                  <h5 className="font-bold text-[#F0E2C8] text-[11px] mt-1">Алхимия &amp; Интеграция</h5>
                  <p className="text-[10px] text-[#A9B489] mt-0.5 leading-snug">
                    Очищение паром, ледяная купель, глубинный шеринг у ночного костра и встреча с Тенью.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#383d2a]/80 border border-[#A9B489]/15">
                  <div className="flex items-center gap-1.5 text-[#FFCF96] font-mono font-bold text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#BA9470]/30 flex items-center justify-center text-[9px]">4</span>
                    <span>07:00–12:00</span>
                  </div>
                  <h5 className="font-bold text-[#F0E2C8] text-[11px] mt-1">Сновидения &amp; Сценарий</h5>
                  <p className="text-[10px] text-[#A9B489] mt-0.5 leading-snug">
                    Анализ ночных сновидений, крио-пробуждение у водопада, дорожная карта интеграции.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ACCOMMODATION TIER */}
          <div className="neu-card rounded-2xl p-5 border border-[#A9B489]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA9470] font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">hotel</span>
                2. Выбор формата проживания (Сутки)
              </span>
              <span className="text-[11px] text-[#A9B489]">Один обязательный выбор</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['budget', 'yurt', 'cottage'] as AccommodationTier[]).map(tier => {
                const data = ACCOMMODATION_DATA[tier];
                const isSelected = modules.accommodation === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setModules(prev => ({ ...prev, accommodation: tier }));
                      setQuestionnaire(prev => ({ ...prev, accommodationType: data.name }));
                    }}
                    className={`p-4 rounded-2xl text-left transition-all flex flex-col justify-between border ${
                      isSelected
                        ? 'neu-card border-[#BA9470] bg-[#3a3e2c] text-[#F0E2C8] ring-1 ring-[#BA9470]/50'
                        : 'neu-inset text-[#A9B489] border-transparent hover:border-[#A9B489]/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-[#BA9470] text-[22px]">{data.icon}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#F0E2C8] mt-2">{data.name}</h4>
                      <p className="text-[11px] text-[#A9B489] mt-1 leading-snug">{data.desc}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-[#A9B489]/15 flex items-baseline justify-between font-mono">
                      <span className="text-[10px] text-[#A9B489]">Размещение за сутки</span>
                      <span className="text-sm font-bold text-[#FFCF96]">${data.retail}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="neu-inset p-3 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#A9B489]">Базовый пакет (Программа + {ACCOMMODATION_DATA[modules.accommodation].name}):</span>
              <span className="font-bold text-emerald-400">${ACCOMMODATION_DATA[modules.accommodation].retail + 80} / чел.</span>
            </div>
          </div>

          {/* 3. OPTIONAL MODULES */}
          <div className="neu-card rounded-2xl p-5 border border-[#A9B489]/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BA9470] font-mono flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                3. Модули самопознания, стихий &amp; телесных интервенций
              </span>
              <span className="text-[11px] text-[#A9B489]">Подключайте практики под свой запрос</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Лошадь */}
              <div
                onClick={() => setModules(p => ({ ...p, horse: !p.horse }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.horse
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.horse ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.horse && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Иппотерапия &amp; Зеркало бессознательного</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      Высокогорный верховой шаг. Лошадь как биорезонансный датчик: моментально отражает внутреннее напряжение, скрытый страх и гиперконтроль. Практика доверия и мягкого лидерства.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">Модуль</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$35</span>
                </div>
              </div>

              {/* 2. Квадроцикл */}
              <div
                onClick={() => setModules(p => ({ ...p, quad: !p.quad }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.quad
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.quad ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.quad && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Эндуро-контур &amp; Работа с витальной силой</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      Горный маршрут по предгорьям Чимгана. Трансформация подавленной агрессии и выученной беспомощности в решительность, контакт с архетипом Воина и сброс мышечных блоков.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">Модуль</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$35</span>
                </div>
              </div>

              {/* 3. SUP на Чарваке */}
              <div className="neu-card p-3.5 rounded-xl border border-[#A9B489]/20 sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#BA9470] text-[18px]">surfing</span>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">SUP на Чарваке: Сенсорное созерцание &amp; Доверие потоку</h4>
                  </div>
                  <span className="text-[11px] text-[#A9B489]">Вода как метафора бессознательного</span>
                </div>
                <p className="text-[11px] text-[#A9B489] leading-relaxed">
                  Практика удержания баланса в невесомости, сенсорная тишина, отпускание фиксации на контроле событий и медитативное созерцание зеркала Чарвака.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                  <button
                    type="button"
                    onClick={() => setModules(p => ({ ...p, sup: 'none' }))}
                    className={`p-2 rounded-lg text-xs text-center border transition-all ${
                      modules.sup === 'none'
                        ? 'neu-card border-[#BA9470] text-[#F0E2C8]'
                        : 'neu-inset text-[#A9B489] border-transparent'
                    }`}
                  >
                    <span className="block font-sans text-[11px]">Без сапа</span>
                    <span className="text-[10px] text-[#A9B489]">$0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModules(p => ({ ...p, sup: '1hour' }))}
                    className={`p-2 rounded-lg text-xs text-center border transition-all ${
                      modules.sup === '1hour'
                        ? 'neu-card border-[#BA9470] text-[#F0E2C8]'
                        : 'neu-inset text-[#A9B489] border-transparent'
                    }`}
                  >
                    <span className="block font-sans text-[11px]">SUP 1 час</span>
                    <span className="text-[10px] text-emerald-400">+$10</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModules(p => ({ ...p, sup: 'day' }))}
                    className={`p-2 rounded-lg text-xs text-center border transition-all ${
                      modules.sup === 'day'
                        ? 'neu-card border-[#BA9470] text-[#F0E2C8]'
                        : 'neu-inset text-[#A9B489] border-transparent'
                    }`}
                  >
                    <span className="block font-sans text-[11px]">SUP весь день</span>
                    <span className="text-[10px] text-emerald-400">+$20</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModules(p => ({ ...p, sup: 'daynight' }))}
                    className={`p-2 rounded-lg text-xs text-center border transition-all ${
                      modules.sup === 'daynight'
                        ? 'neu-card border-[#BA9470] text-[#F0E2C8]'
                        : 'neu-inset text-[#A9B489] border-transparent'
                    }`}
                  >
                    <span className="block font-sans text-[11px]">SUP сутки (24h)</span>
                    <span className="text-[10px] text-emerald-400">+$30</span>
                  </button>
                </div>
              </div>

              {/* 4. Горная баня */}
              <div
                onClick={() => setModules(p => ({ ...p, banya: !p.banya }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.banya
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.banya ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.banya && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Алхимия &amp; Сброс мышечного панциря (Баня)</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      2 часа фитопара на чимганских травах и ледяная купель (слот на 5 чел). Сброс кортизолового шлейфа, размягчение грудного и шейного блоков, ритуал перерождения.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">Модуль</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$55</span>
                </div>
              </div>

              {/* 5. Нива к высокогорью */}
              <div
                onClick={() => setModules(p => ({ ...p, niva: !p.niva }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.niva
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.niva ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.niva && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Смена масштаба &amp; Awe-эффект (Нива 4х4)</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      Внедорожный подъем на верхние хребты (на 3 чел.). Переключение из туннельного мышления города в панорамное восприятие горизонта и возвращение смыслов.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">Модуль</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$28</span>
                </div>
              </div>

              {/* 6. Машина к водопаду */}
              <div
                onClick={() => setModules(p => ({ ...p, waterfallCar: !p.waterfallCar }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.waterfallCar
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.waterfallCar ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.waterfallCar && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Крио-гидротерапия &amp; Водопад</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      Утренний выезд к водопаду (на 3 чел.). Сенсорная стимуляция блуждающего нерва бурным потоком ледниковой воды, разрушение апатии и эмоционального застревания.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">Модуль</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$12</span>
                </div>
              </div>

              {/* 7. Фермерское питание */}
              <div
                onClick={() => setModules(p => ({ ...p, farmFood: !p.farmFood }))}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                  modules.farmFood
                    ? 'neu-card border-[#BA9470]/70 bg-[#3a3e2c]'
                    : 'neu-inset border-transparent opacity-85'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    modules.farmFood ? 'bg-[#BA9470] text-[#343727] border-[#BA9470]' : 'border-[#A9B489]/40'
                  }`}>
                    {modules.farmFood && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F0E2C8]">Осознанное питание &amp; Нутритивный баланс</h4>
                    <p className="text-[11px] text-[#A9B489] mt-0.5 leading-relaxed">
                      3-разовый стол из продуктов горного терруара: чимганские сыры, горный мед, свежая зелень и травяной сбор. Майндфулнесс-трапезы для нейромедиаторного восстановления.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-[#A9B489] block">3 приема</span>
                  <span className="text-xs font-bold text-[#FFCF96]">+$28</span>
                </div>
              </div>
            </div>
          </div>

          {/* UNIT ECONOMICS SUMMARY BOX & ACTION BUTTON */}
          <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/40 bg-gradient-to-br from-[#383c2a] to-[#2f3223] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
                  Прозрачный расчет программы (на 1 человека)
                </span>
                <h3 className="font-headline font-bold text-lg text-[#F0E2C8]">
                  Итоговый бюджет вашего 24h ретрита
                </h3>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-[#A9B489] block">Инвестиция в участие:</span>
                <span className="text-2xl font-extrabold text-[#FFCF96]">${totalRetailPriceUsd}</span>
                <span className="text-[10px] text-[#FFCF96]/80 block">≈ {priceUzs} сум</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-[#A9B489]/15">
              <div className="neu-inset p-2 rounded-lg">
                <span className="text-[10px] text-[#A9B489] block">Программа:</span>
                <span className="font-bold text-[#F0E2C8]">Включена</span>
              </div>
              <div className="neu-inset p-2 rounded-lg">
                <span className="text-[10px] text-[#A9B489] block">Проживание:</span>
                <span className="font-bold text-[#F0E2C8]">{ACCOMMODATION_DATA[modules.accommodation].name.split(' (')[0]}</span>
              </div>
              <div className="neu-inset p-2 rounded-lg">
                <span className="text-[10px] text-[#A9B489] block">Активности:</span>
                <span className="font-bold text-[#F0E2C8]">{optionalCost > 0 ? `+${optionalCost}$` : 'Базовые'}</span>
              </div>
              <div className="neu-inset p-2 rounded-lg">
                <span className="text-[10px] text-[#A9B489] block">Формат участия:</span>
                <span className="font-bold text-emerald-400">${totalRetailPriceUsd} / чел.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => shareModule('retreats', { customTitle: `Конструктор ретрита 24h: мой выбор $${totalRetailPriceUsd}` })}
                className="neu-btn px-3 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">share</span>
                Поделиться расчетом
              </button>

              <button
                onClick={() => setCurrentStep('questionnaire')}
                className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/70 hover:bg-[#BA9470]/35 transition-all flex items-center gap-1.5"
              >
                <span>Перейти к анкете резидента</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: QUESTIONNAIRE */}
      {currentStep === 'questionnaire' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="neu-card rounded-2xl p-5 border border-[#A9B489]/20 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
                Шаг 2 из 3 • Анкета Участника
              </span>
              <h2 className="font-headline font-bold text-lg text-[#F0E2C8] mt-0.5">
                Индивидуальный профиль для Екатерины Семерджиди и проводников
              </h2>
              <p className="text-xs text-[#E2ECD2]/80 mt-1">
                Данные сохраняются автоматически. На их основе ведущие адаптируют программу и распределяют нагрузку на ретрите.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Main Intention */}
              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">
                  Главный запрос или состояние, с которым вы едете в горы
                </label>
                <textarea
                  value={questionnaire.mainIntention || ''}
                  onChange={e => setQuestionnaire(p => ({ ...p, mainIntention: e.target.value }))}
                  placeholder="Например: чувство постоянной спешки, сложности с расслаблением, выгорание на работе..."
                  rows={3}
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none border border-[#BA9470]/30"
                />
              </div>

              {/* Experience in Mountains */}
              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">
                  Ваш опыт походов и физической активности в горах
                </label>
                <select
                  value={questionnaire.experienceLevel || ''}
                  onChange={e => setQuestionnaire(p => ({ ...p, experienceLevel: e.target.value }))}
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#353828] border border-[#BA9470]/30 focus:outline-none"
                >
                  <option value="Новичок (редко бываю на природе)">Новичок (редко бываю на природе)</option>
                  <option value="Любитель (бываю в горах 2-3 раза в год)">Любитель (бываю в горах 2-3 раза в год)</option>
                  <option value="Опытный (регулярные хайкинг и походы)">Опытный (регулярные хайкинг и походы)</option>
                </select>
              </div>

              {/* Nutrition */}
              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">
                  Предпочтения по питанию
                </label>
                <select
                  value={questionnaire.nutritionPreference || ''}
                  onChange={e => setQuestionnaire(p => ({ ...p, nutritionPreference: e.target.value }))}
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#353828] border border-[#BA9470]/30 focus:outline-none"
                >
                  <option value="Стандартное горное фермерское">Стандартное горное фермерское (мясо, овощи, супы)</option>
                  <option value="Вегетарианское">Вегетарианское</option>
                  <option value="Безглютеновое / Без сахара">Безглютеновое / Без сахара</option>
                  <option value="Своё питание">Своё питание (у меня строгая диета)</option>
                </select>
              </div>

              {/* Horse experience */}
              {modules.horse && (
                <div>
                  <label className="text-xs font-bold text-[#F0E2C8] block mb-1">
                    Опыт верховой езды на лошадях
                  </label>
                  <select
                    value={questionnaire.horseRidingExperience || ''}
                    onChange={e => setQuestionnaire(p => ({ ...p, horseRidingExperience: e.target.value }))}
                    className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] bg-[#353828] border border-[#BA9470]/30 focus:outline-none"
                  >
                    <option value="Первый раз / Есть легкий страх">Первый раз (проводник ведет лошадь под уздцы)</option>
                    <option value="Спокойный шаг с инструктором">Спокойный уверенный шаг с инструктором</option>
                    <option value="Уверенный всадник (рысь / галоп)">Уверенный всадник (могу ехать самостоятельно)</option>
                  </select>
                </div>
              )}

              {/* Special Requests */}
              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">
                  Особые пожелания или медицинские противопоказания
                </label>
                <input
                  type="text"
                  value={questionnaire.specialRequests || ''}
                  onChange={e => setQuestionnaire(p => ({ ...p, specialRequests: e.target.value }))}
                  placeholder="Аллергии, травмы суставов, фобии высоты и т.д."
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none border border-[#BA9470]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#A9B489]/15">
              <button
                type="button"
                onClick={() => setCurrentStep('constructor')}
                className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                Назад к модулям
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('contact')}
                className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/70 hover:bg-[#BA9470]/35 transition-all flex items-center gap-1.5"
              >
                <span>К оформлению бронирования</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT & CONFIRMATION */}
      {currentStep === 'contact' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <form onSubmit={handleFinalBooking} className="neu-card rounded-2xl p-5 border border-[#BA9470]/40 space-y-4 bg-gradient-to-b from-[#3a3e2c] to-[#323624]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
                Шаг 3 из 3 • Фиксация бронирования
              </span>
              <h2 className="font-headline font-bold text-lg text-[#F0E2C8] mt-0.5">
                Личный кабинет участника &amp; Сертификат
              </h2>
              <p className="text-xs text-[#E2ECD2]/80 mt-1">
                Бронь фиксируется в базе администраторов. Предоплата для закрепления слота составляет 50% ($ {Math.round(totalRetailPriceUsd * 0.5)}).
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{authError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">Ваше Имя и Фамилия *</label>
                <input
                  type="text"
                  required
                  value={contactData.name}
                  onChange={e => setContactData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Алишер Навои"
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] focus:outline-none border border-[#BA9470]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#F0E2C8] block mb-1">Телефон или Telegram *</label>
                <input
                  type="text"
                  required
                  value={contactData.contact}
                  onChange={e => setContactData(p => ({ ...p, contact: e.target.value }))}
                  placeholder="+998 90 123 45 67 или @telegram_nick"
                  className="w-full neu-inset px-3 py-2 rounded-xl text-xs text-[#F0E2C8] focus:outline-none border border-[#BA9470]/30"
                />
              </div>
            </div>

            {/* Order Summary Recap */}
            <div className="neu-inset p-3.5 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#A9B489]">
                <span>Выбранное проживание:</span>
                <span className="text-[#F0E2C8]">{ACCOMMODATION_DATA[modules.accommodation].name}</span>
              </div>
              <div className="flex justify-between text-[#A9B489]">
                <span>Формат программы:</span>
                <span className="text-emerald-400 font-bold">24-часовое аналитическое погружение</span>
              </div>
              <div className="flex justify-between text-[#A9B489] pt-1 border-t border-[#A9B489]/15">
                <span className="text-[#F0E2C8] font-bold">Итоговая стоимость:</span>
                <span className="text-base text-[#FFCF96] font-bold">${totalRetailPriceUsd} (≈ {priceUzs} сум)</span>
              </div>
              <div className="flex justify-between text-[#A9B489]">
                <span>Предоплата 50% для брони:</span>
                <span className="text-emerald-300 font-bold">${Math.round(totalRetailPriceUsd * 0.5)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('questionnaire')}
                className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                Назад к анкете
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="neu-btn px-6 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Фиксация бронирования...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Зафиксировать бронь 24h ретрита</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: CONFIRMED */}
      {currentStep === 'confirmed' && (
        <div className="neu-card rounded-3xl p-6 sm:p-7 border border-emerald-500/50 bg-gradient-to-b from-[#353926] to-[#2c2f1f] text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400">
            <span className="material-symbols-outlined text-[32px]">task_alt</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Сертификат участника активен
          </span>

          <h2 className="font-headline font-bold text-2xl text-[#F0E2C8]">
            Бронирование 24h ретрита подтверждено!
          </h2>

          <p className="text-xs sm:text-sm text-[#E2ECD2]/85 max-w-lg mx-auto leading-relaxed">
            Ваша анкета и выбранные опции программы успешно зафиксированы в базе суперадминистраторов. Номер вашего персонального сертификата:
          </p>

          <div className="neu-inset p-3 rounded-2xl max-w-sm mx-auto font-mono text-base font-bold text-[#FFCF96] border border-[#BA9470]/40">
            {certificateId}
          </div>

          <div className="neu-inset p-4 rounded-2xl max-w-md mx-auto text-left text-xs font-mono space-y-1 text-[#A9B489]">
            <div className="flex justify-between">
              <span>Участник:</span>
              <span className="text-[#F0E2C8]">{contactData.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Формат:</span>
              <span className="text-[#F0E2C8]">{ACCOMMODATION_DATA[modules.accommodation].name}</span>
            </div>
            <div className="flex justify-between">
              <span>Статус участия:</span>
              <span className="text-emerald-400 font-bold">Слот зафиксирован</span>
            </div>
            <div className="flex justify-between">
              <span>Итоговая цена:</span>
              <span className="text-[#FFCF96] font-bold">${totalRetailPriceUsd} (≈ {priceUzs} сум)</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('social')}
              className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/70 hover:bg-[#BA9470]/35 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Перейти в Личный Кабинет</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep('constructor');
              }}
              className="neu-btn px-4 py-2.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
            >
              Собрать другую конфигурацию
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
