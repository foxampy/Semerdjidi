import React, { useState } from 'react';
import { DEFAULT_SOLO_DAY_SCHEDULE, SoloScheduleSlot } from '../../../data/retreatsAndCentersData';
import { authService } from '../../../services/authService';

interface SoloRetreatPlannerModalProps {
  onClose: () => void;
}

export const SoloRetreatPlannerModal: React.FC<SoloRetreatPlannerModalProps> = ({ onClose }) => {
  const [selectedLocation, setSelectedLocation] = useState<'chimgan' | 'zaamin' | 'amankutan' | 'altay' | 'issykkul'>('chimgan');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [accommodationType, setAccommodationType] = useState<'shale' | 'yurt' | 'forest_lodge'>('shale');
  
  // 4D Selected Pillars
  const [activeBodyModules, setActiveBodyModules] = useState<string[]>([
    'Дровяная баня с купелью',
    'Циркадная утренняя активация',
    'Органическое фермерское меню',
    'Скандинавская ходьба по терренкурам'
  ]);

  const [activeMindModules, setActiveMindModules] = useState<string[]>([
    'Digital Detox (Сейф для смартфона на 72h)',
    'Блоки глубокого созидания Deep Work',
    'Дневник стратегической ясности'
  ]);

  const [activeSoulModules, setActiveSoulModules] = useState<string[]>([
    'Прогулки абсолютной тишины без музыки',
    'Ночное созерцание звездного купола',
    'Чайная медитация на горных травах'
  ]);

  const [activePsycheModules, setActivePsycheModules] = useState<string[]>([
    'Аудио-сессии Екатерины Семерджиди',
    'Дневник саморефлексии: работа с Тенью',
    'Практика выгрузки гиперконтроля'
  ]);

  const [customGoal, setCustomGoal] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'timeline' | 'summary'>('builder');

  const LOCATIONS_CONFIG = {
    chimgan: { name: 'Чимган (1,750м)', desc: 'Близость к Ташкенту, арчовые леса, озеро Чарвак', dailyPrice: 85 },
    zaamin: { name: 'Заамин (2,100м)', desc: '«Узбекистанская Швейцария», реликтовая можжевеловая хвоя', dailyPrice: 90 },
    amankutan: { name: 'Аманкутан (1,600м)', desc: 'Сакральное ущелье, платаны, суфийские тропы', dailyPrice: 75 },
    altay: { name: 'Горный Алтай (1,800м)', desc: 'Ледниковые реки, тайга, дикие места силы', dailyPrice: 130 },
    issykkul: { name: 'Иссык-Куль (1,780м)', desc: 'Горячие термальные радоновые ключи, морской воздух', dailyPrice: 80 }
  };

  const currentLoc = LOCATIONS_CONFIG[selectedLocation];
  const accommodationMultiplier = accommodationType === 'forest_lodge' ? 1.4 : accommodationType === 'yurt' ? 0.9 : 1.1;
  const rawPrice = Math.round(currentLoc.dailyPrice * durationDays * accommodationMultiplier);
  const discountedPrice = Math.round(rawPrice * 0.5); // 50% discount

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    try {
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: contactName.trim(),
        contact: contactPhone.trim(),
        format: 'solo',
        amountUsd: discountedPrice,
        promoCode: 'SOLO-ETHOS-50',
        details: `Индивидуальный Solo-ретрит. Локация: ${currentLoc.name}, Дней: ${durationDays}, Тип жилья: ${accommodationType}. Цель: ${customGoal || 'Перезагрузка'}. Выбрано практик: Тело (${activeBodyModules.length}), Разум (${activeMindModules.length}), Душа (${activeSoulModules.length}), Психика (${activePsycheModules.length}).`,
        status: 'new'
      });
      setIsSaved(true);
    } catch (err) {
      console.warn('Solo plan save error:', err);
    }
  };

  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="neu-card rounded-3xl border border-[#BA9470]/60 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl bg-[#373b2b]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#A9B489]/20 bg-gradient-to-r from-[#3b412e] to-[#323625] flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/40">
                Solo / Self-Guided Режим
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-500/30">
                4D Здоровье: Тело, Разум, Душа, Психика
              </span>
              <span className="text-[10px] font-mono text-[#FFCF96]">
                Скидка 50%
              </span>
            </div>

            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8]">
              Конструктор Самостоятельного Ретрита
            </h2>
            <p className="text-xs text-[#E2ECD2]/80 mt-0.5">
              Соберите индивидуальное горное уединение под свой ритм жизни, задачи и уровень энергии
            </p>
          </div>

          <button
            onClick={onClose}
            className="neu-btn w-9 h-9 rounded-full flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8] shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#313525] border-b border-[#A9B489]/15 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'builder'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            1. Параметры &amp; 4D Модули
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'neu-pill-active text-[#FFCF96] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            2. Распорядок Идеального Дня
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'neu-pill-active text-emerald-300 border border-emerald-500/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">task_alt</span>
            3. Бюджет &amp; Фиксация (${discountedPrice})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'builder' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Step 1: Location & Duration */}
              <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#333726] space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96]">
                  Шаг 1: Горная база и длительность
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(LOCATIONS_CONFIG) as Array<keyof typeof LOCATIONS_CONFIG>).map(locKey => {
                    const loc = LOCATIONS_CONFIG[locKey];
                    return (
                      <button
                        key={locKey}
                        type="button"
                        onClick={() => setSelectedLocation(locKey)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          selectedLocation === locKey
                            ? 'neu-pill-active border-[#BA9470] text-[#F0E2C8]'
                            : 'neu-inset border-[#A9B489]/15 text-[#A9B489]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#F0E2C8]">{loc.name}</div>
                        <div className="text-[10px] text-[#A9B489] line-clamp-1 mt-0.5">{loc.desc}</div>
                        <div className="text-[10px] font-mono text-emerald-400 mt-1">от ${loc.dailyPrice}/сутки</div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-[#A9B489] mb-1">Срок уединения:</label>
                    <div className="flex items-center gap-1.5">
                      {[2, 3, 5, 7].map(days => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setDurationDays(days)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                            durationDays === days
                              ? 'neu-pill-active text-[#FFCF96] border-[#BA9470]'
                              : 'neu-inset text-[#A9B489] border-[#A9B489]/20'
                          }`}
                        >
                          {days} {days === 2 || days === 3 || days === 4 ? 'дня' : 'дней'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#A9B489] mb-1">Формат жилья:</label>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'yurt', label: 'Юрта' },
                        { id: 'shale', label: 'Эко-шале' },
                        { id: 'forest_lodge', label: 'VIP Лодж' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setAccommodationType(t.id as any)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            accommodationType === t.id
                              ? 'neu-pill-active text-emerald-300 border-emerald-500/40'
                              : 'neu-inset text-[#A9B489] border-[#A9B489]/20'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: 4D Health Modules Selection */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Шаг 2: Включение практик 4D Здоровья
                </div>

                {/* Body */}
                <div className="neu-card rounded-2xl p-3.5 border border-emerald-500/30 bg-[#323726] space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">fitness_center</span>
                    ТЕЛО: Физиология, питание и восстановление
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Дровяная баня с купелью',
                      'Циркадная утренняя активация',
                      'Органическое фермерское меню',
                      'Скандинавская ходьба по терренкурам',
                      'Индивидуальный конный шаг (1 час)',
                      'Дыхание по Виму Хофу на высоте'
                    ].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(activeBodyModules, setActiveBodyModules, item)}
                        className={`p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                          activeBodyModules.includes(item)
                            ? 'bg-emerald-900/50 text-emerald-200 border-emerald-500/50'
                            : 'bg-[#2a2d1f] text-[#A9B489] border-[#A9B489]/15'
                        }`}
                      >
                        <span>{item}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {activeBodyModules.includes(item) ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mind */}
                <div className="neu-card rounded-2xl p-3.5 border border-sky-500/30 bg-[#323726] space-y-2">
                  <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-sky-400">psychology</span>
                    РАЗУМ: Фокус, детокс и когнитивная ясность
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Digital Detox (Сейф для смартфона на 72h)',
                      'Блоки глубокого созидания Deep Work',
                      'Дневник стратегической ясности',
                      'Чтение в тишине без девайсов',
                      'Очки Blue-Blockers для вечернего света'
                    ].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(activeMindModules, setActiveMindModules, item)}
                        className={`p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                          activeMindModules.includes(item)
                            ? 'bg-sky-900/50 text-sky-200 border-sky-500/50'
                            : 'bg-[#2a2d1f] text-[#A9B489] border-[#A9B489]/15'
                        }`}
                      >
                        <span>{item}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {activeMindModules.includes(item) ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soul */}
                <div className="neu-card rounded-2xl p-3.5 border border-amber-500/30 bg-[#323726] space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-400">wb_sunny</span>
                    ДУША: Род, тишина, контакт со стихиями
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Прогулки абсолютной тишины без музыки',
                      'Ночное созерцание звездного купола',
                      'Чайная медитация на горных травах',
                      'Созерцание водопада / течения воды',
                      'Практика благодарности предкам'
                    ].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(activeSoulModules, setActiveSoulModules, item)}
                        className={`p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                          activeSoulModules.includes(item)
                            ? 'bg-amber-900/50 text-amber-200 border-amber-500/50'
                            : 'bg-[#2a2d1f] text-[#A9B489] border-[#A9B489]/15'
                        }`}
                      >
                        <span>{item}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {activeSoulModules.includes(item) ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Psyche */}
                <div className="neu-card rounded-2xl p-3.5 border border-purple-500/30 bg-[#323726] space-y-2">
                  <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-purple-400">auto_stories</span>
                    ПСИХИКА: Психоанализ, эмоции и глубинная проработка
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {[
                      'Аудио-сессии Екатерины Семерджиди',
                      'Дневник саморефлексии: работа с Тенью',
                      'Практика выгрузки гиперконтроля',
                      'Индивидуальный созвон с психологом (1h)',
                      'Анализ и запись ночных сновидений'
                    ].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(activePsycheModules, setActivePsycheModules, item)}
                        className={`p-2 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                          activePsycheModules.includes(item)
                            ? 'bg-purple-900/50 text-purple-200 border-purple-500/50'
                            : 'bg-[#2a2d1f] text-[#A9B489] border-[#A9B489]/15'
                        }`}
                      >
                        <span>{item}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {activePsycheModules.includes(item) ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/40 border border-[#BA9470] hover:bg-[#BA9470]/60 flex items-center gap-1.5"
                >
                  Посмотреть таймлайн дня
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl neu-inset bg-[#2d3221] border border-[#A9B489]/20 text-xs text-[#E2ECD2]/85">
                <strong className="text-emerald-400">Циркадный таймлайн Solo-ретрита:</strong> Программа сбалансирована так, чтобы у вас чередовались фазы физической активности, глубокого умственного фокуса, психоаналитической разгрузки и полного восстановления сна.
              </div>

              <div className="space-y-2">
                {DEFAULT_SOLO_DAY_SCHEDULE.map((slot, idx) => {
                  const tagColor = 
                    slot.category === 'body' ? 'text-emerald-400 border-emerald-500/30' :
                    slot.category === 'mind' ? 'text-sky-400 border-sky-500/30' :
                    slot.category === 'soul' ? 'text-amber-400 border-amber-500/30' : 'text-purple-400 border-purple-500/30';

                  return (
                    <div key={idx} className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#333626] flex items-start gap-3">
                      <div className="min-w-[85px] text-xs font-mono font-bold text-[#FFCF96]">
                        {slot.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#F0E2C8]">{slot.title}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.2 rounded-full border ${tagColor}`}>
                            {slot.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#E2ECD2]/75 mt-0.5">
                          {slot.instruction}
                        </p>
                        {slot.audioGuideTitle && (
                          <div className="mt-1 text-[10px] text-emerald-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">headphones</span>
                            Аудиогид: «{slot.audioGuideTitle}»
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('builder')}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489]"
                >
                  Назад к параметрам
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/40 border border-[#BA9470] flex items-center gap-1.5"
                >
                  Перейти к расчету бюджета
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {isSaved ? (
                <div className="neu-card rounded-2xl p-6 border-2 border-emerald-500/60 bg-[#2f3826] text-center space-y-3">
                  <span className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[28px] border border-emerald-500/40">
                    check
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#F0E2C8]">
                    План Solo-Ретрита Сохранен!
                  </h3>
                  <div className="text-xs text-[#E2ECD2]/90 max-w-md mx-auto">
                    Ваш персональный маршрут в локации <strong>{currentLoc.name}</strong> на {durationDays} дней зафиксирован. Консьерж EthOSium подготовит шале, заложит травяные сборы и свяжется с вами.
                  </div>
                  <button
                    onClick={onClose}
                    className="neu-btn px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700/50 border border-emerald-500/40"
                  >
                    Вернуться к каталогу
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#323626] space-y-2">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                      Сводка программы:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#2a2c20] border border-[#A9B489]/20">
                        <div className="text-[10px] text-[#A9B489]">Локация</div>
                        <div className="font-bold text-[#F0E2C8]">{currentLoc.name}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#2a2c20] border border-[#A9B489]/20">
                        <div className="text-[10px] text-[#A9B489]">Длительность</div>
                        <div className="font-bold text-[#F0E2C8]">{durationDays} дней / {durationDays - 1} ночей</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#2a2c20] border border-[#A9B489]/20">
                        <div className="text-[10px] text-[#A9B489]">Жилье</div>
                        <div className="font-bold text-[#F0E2C8]">{accommodationType === 'forest_lodge' ? 'VIP Лодж' : accommodationType === 'yurt' ? 'Юрта' : 'Эко-шале'}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#2a2c20] border border-[#A9B489]/20">
                        <div className="text-[10px] text-[#A9B489]">4D Практик</div>
                        <div className="font-bold text-emerald-400">
                          {activeBodyModules.length + activeMindModules.length + activeSoulModules.length + activePsycheModules.length} выбрано
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Ваше имя *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="Ваше имя"
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Телефон или Telegram *</label>
                      <input
                        type="text"
                        required
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        placeholder="+998 ... или @username"
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Главная цель вашего уединения</label>
                    <input
                      type="text"
                      value={customGoal}
                      onChange={e => setCustomGoal(e.target.value)}
                      placeholder="Например: дописать книгу, восстановить глубокий сон, побыть одному"
                      className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                    />
                  </div>

                  <div className="neu-card rounded-2xl p-4 border border-emerald-500/40 bg-[#303625] flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-[10px] text-[#A9B489] uppercase font-mono">
                        Итоговая стоимость Solo-ретрита (со скидкой 50%):
                      </div>
                      <div className="font-headline font-bold text-2xl text-emerald-300">
                        ${discountedPrice}{' '}
                        <span className="line-through text-xs font-normal text-[#A9B489]">${rawPrice}</span>
                      </div>
                      <div className="text-[10px] text-[#A9B489]">
                        Включает: проживание, 3-разовое фермерское питание, баню, приложение EthOSium и протокол
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="neu-btn px-6 py-2.5 rounded-xl font-bold text-xs text-[#FFFDF8] bg-emerald-700/50 border border-emerald-500/60 hover:bg-emerald-700/70 flex items-center gap-1.5 shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      Зафиксировать Solo-бронь
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#313525] border-t border-[#A9B489]/20 flex items-center justify-between gap-3">
          <div className="text-xs text-[#A9B489]">
            Поддержка консьержа 24/7 по рации и защищенному каналу
          </div>
          <button
            onClick={onClose}
            className="neu-btn px-4 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
