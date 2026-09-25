import React, { useState } from 'react';
import { SETTLEMENT_DEVELOPMENT_PROJECTS, SettlementProject, LotType } from '../../../data/settlementsAndSpecializedData';
import { authService } from '../../../services/authService';

interface DevelopmentSettlementsViewProps {
  onBackToCatalog: () => void;
}

export const DevelopmentSettlementsView: React.FC<DevelopmentSettlementsViewProps> = ({
  onBackToCatalog
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'calculator' | 'infrastructure' | 'contact'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'village' | 'dacha_estate' | 'hotel' | 'sanatorium'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('chimgan_eco_village');
  
  // Selected Lot for Detail Modal
  const [selectedLotModal, setSelectedLotModal] = useState<{ project: SettlementProject; lot: LotType } | null>(null);

  // Investment Calculator State
  const [calcBudgetUsd, setCalcBudgetUsd] = useState<number>(100000);
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcProjectSelect, setCalcProjectSelect] = useState<string>('chimgan_eco_village');

  // Application Form State
  const currentUser = authService.getCurrentUser();
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientContact, setClientContact] = useState(currentUser?.emailOrTg || '');
  const [interestType, setInterestType] = useState<'buy_lot' | 'co_investor' | 'developer_partnership' | 'sanatorium_share'>('buy_lot');
  const [clientBudget, setClientBudget] = useState('$50,000 – $150,000');
  const [clientNote, setClientNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredProjects = selectedCategory === 'all'
    ? SETTLEMENT_DEVELOPMENT_PROJECTS
    : SETTLEMENT_DEVELOPMENT_PROJECTS.filter(p => p.category === selectedCategory);

  const activeProject = SETTLEMENT_DEVELOPMENT_PROJECTS.find(p => p.id === selectedProjectId) || SETTLEMENT_DEVELOPMENT_PROJECTS[0];

  // Calculator calculations
  const calcSelectedProject = SETTLEMENT_DEVELOPMENT_PROJECTS.find(p => p.id === calcProjectSelect) || SETTLEMENT_DEVELOPMENT_PROJECTS[0];
  const roiRate = parseFloat(calcSelectedProject.roiAnnualPercent) / 100 || 0.20;
  const annualRentalIncome = calcBudgetUsd * roiRate;
  const monthlyRentalIncome = Math.round(annualRentalIncome / 12);
  const totalRentalIncomeOverYears = annualRentalIncome * calcYears;
  const estimatedCapitalGrowthRate = 0.12; // 12% annual capital appreciation of alpine land and real estate
  const totalCapitalAppreciation = calcBudgetUsd * Math.pow(1 + estimatedCapitalGrowthRate, calcYears) - calcBudgetUsd;
  const totalProjectedGain = totalRentalIncomeOverYears + totalCapitalAppreciation;

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim()) return;

    setIsSubmitting(true);
    try {
      await authService.submitInboxMessage({
        fromName: clientName.trim(),
        fromContact: clientContact.trim(),
        subject: `Заявка на девелопмент/недвижимость: ${activeProject.name} (${interestType})`,
        message: `Интерес: ${interestType}. Проект: ${activeProject.name}. Бюджет: ${clientBudget}. Комментарий: ${clientNote || 'Без примечаний'}.`
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/50 bg-gradient-to-br from-[#3b402e] via-[#353927] to-[#2c3020] relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#BA9470]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFCF96] font-bold px-3 py-1 rounded-full neu-inset border border-[#BA9470]/40 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400">architecture</span>
              EthOSium Real Estate &amp; Eco-Villages
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              18%–25% годовых
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
          Застройка Эко-Поселков, Дач, Отелей &amp; Санаториев
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/90 mt-2.5 max-w-3xl leading-relaxed">
          Архитектурное проектирование, мастер-планы и строительство автономных поселений здоровья в Чимгане, Заамине, Чарваке и Аманкутане. Энергонезависимость, радоновые скважины, биохакинг-инфраструктура и гарантированная доходность от сдачи резидентам EthOSium.
        </p>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 pt-5 mt-4 border-t border-[#A9B489]/20">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">holiday_village</span>
            4 Мастер-Плана Застройки
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'neu-pill-active text-[#FFCF96] border border-[#BA9470] shadow-md'
                : 'neu-btn text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            Инвест-Калькулятор Доходности
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'infrastructure'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">solar_power</span>
            Биохакинг &amp; Автономия
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">handshake</span>
            Заказ Мастер-Плана / Бронь Лота
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER PLANS & LOTS CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono uppercase text-[#A9B489] mr-1">Категория:</span>
            {[
              { id: 'all', label: 'Все объекты (4)' },
              { id: 'village', label: '🏡 Эко-Поселки' },
              { id: 'sanatorium', label: '🏥 Санатории' },
              { id: 'hotel', label: '🌊 Био-Отели' },
              { id: 'dacha_estate', label: '🌿 Дачи Здоровья' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/60 font-bold'
                    : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map(proj => {
              const isSelected = activeProject.id === proj.id;
              return (
                <div
                  key={proj.id}
                  className={`neu-card rounded-3xl p-5 sm:p-6 border transition-all space-y-4 relative ${
                    isSelected ? 'border-[#BA9470] bg-[#373c2a] shadow-xl' : 'border-[#A9B489]/20 bg-[#343827] hover:border-[#BA9470]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFCF96] font-bold px-2.5 py-0.5 rounded-full neu-inset border border-[#BA9470]/40">
                        {proj.categoryLabel}
                      </span>
                      <h3 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8] mt-1.5">
                        {proj.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#A9B489] mt-0.5">
                        <span className="material-symbols-outlined text-[15px] text-[#BA9470]">location_on</span>
                        <span>{proj.location}</span>
                        <span>•</span>
                        <span className="font-mono text-[#FFCF96]">{proj.altitudeMeters} м н.у.м.</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#A9B489]">Лоты от</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        ${proj.priceFromUsd.toLocaleString()}
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        ROI: {proj.roiAnnualPercent}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Architecture & Eco metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs py-2 px-3 rounded-2xl neu-inset bg-[#2d3121] border border-[#A9B489]/15">
                    <div>
                      <div className="text-[10px] text-[#A9B489]">Площадь</div>
                      <div className="font-bold text-[#F0E2C8]">{proj.totalAreaHectares} га</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#A9B489]">Всего лотов</div>
                      <div className="font-bold text-[#F0E2C8]">{proj.unitsTotal}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#A9B489]">Свободно</div>
                      <div className="font-bold text-emerald-400">{proj.unitsAvailable}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#A9B489]">Статус</div>
                      <div className="font-bold text-[#FFCF96] text-[11px] truncate">Активно</div>
                    </div>
                  </div>

                  {/* Available Lot Types in this project */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#F0E2C8] flex items-center justify-between">
                      <span>Доступные типовые лоты &amp; шале:</span>
                      <span className="text-[10px] text-[#A9B489]">Кликните для деталей</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {proj.lotTypes.map((lot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedLotModal({ project: proj, lot })}
                          className="neu-btn p-2.5 rounded-xl text-left border border-[#A9B489]/20 hover:border-[#BA9470]/50 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#F0E2C8] leading-tight truncate">
                              {lot.type}
                            </div>
                            <div className="text-[11px] text-[#A9B489] mt-0.5">
                              {lot.areaSqM} м² • {lot.bedrooms} спальни
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#A9B489]/15">
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              ${lot.priceUsd.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-mono text-[#FFCF96]">
                              +${lot.yieldUsdMonth}/мес
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#A9B489]/15">
                    {proj.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 rounded-lg neu-inset text-[#E2ECD2] flex items-center gap-1 border border-[#A9B489]/20"
                      >
                        <span className="material-symbols-outlined text-[13px] text-[#BA9470]">{amenity.icon}</span>
                        {amenity.name}
                      </span>
                    ))}
                  </div>

                  {/* Card actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setCalcProjectSelect(proj.id);
                        setActiveTab('calculator');
                      }}
                      className="flex-1 neu-btn py-2 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]/40 flex items-center justify-center gap-1 hover:bg-[#BA9470]/15"
                    >
                      <span className="material-symbols-outlined text-[15px]">calculate</span>
                      Рассчитать окупаемость
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProjectId(proj.id);
                        setActiveTab('contact');
                      }}
                      className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/30 border border-emerald-500/40 hover:bg-emerald-700/40 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">bookmark</span>
                      Забронировать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INVESTMENT CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/40 bg-[#353928] space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold">
                Финансовая модель девелопмента
              </span>
              <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-1">
                Калькулятор Доходности &amp; Арендного Пула
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              Выплаты ежеквартально в USD
            </span>
          </div>

          <p className="text-xs text-[#E2ECD2]/85 leading-relaxed max-w-3xl">
            Объекты застройки передаются в доверительное управление оператора ретритов EthOSium. Благодаря круглогодичному потоку участников программ, психологических выездов и корпоративных заказчиков среднегодовая заполняемость составляет 74%–82%.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-6 space-y-5">
              {/* Project Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#F0E2C8] block">Выберите Проект:</label>
                <select
                  value={calcProjectSelect}
                  onChange={(e) => setCalcProjectSelect(e.target.value)}
                  className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl px-3 py-2.5 text-xs text-[#F0E2C8] focus:border-[#BA9470] outline-none"
                >
                  {SETTLEMENT_DEVELOPMENT_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Ориентир ROI: {p.roiAnnualPercent})
                    </option>
                  ))}
                </select>
              </div>

              {/* Investment Budget Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#F0E2C8]">Сумма инвестиций (USD):</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ${calcBudgetUsd.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={500000}
                  step={5000}
                  value={calcBudgetUsd}
                  onChange={(e) => setCalcBudgetUsd(Number(e.target.value))}
                  className="w-full accent-[#BA9470] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A9B489] font-mono">
                  <span>$25k (Долевое участие)</span>
                  <span>$85k (Шале)</span>
                  <span>$235k (Вилла)</span>
                  <span>$500k (Пул)</span>
                </div>
              </div>

              {/* Horizon Years Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#F0E2C8]">Горизонт владения:</span>
                  <span className="font-mono font-bold text-[#FFCF96] text-sm">
                    {calcYears} {calcYears === 1 ? 'год' : calcYears < 5 ? 'года' : 'лет'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="w-full accent-[#BA9470] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A9B489] font-mono">
                  <span>1 год</span>
                  <span>3 года</span>
                  <span>5 лет</span>
                  <span>10 лет</span>
                </div>
              </div>

              {/* Assumptions Notice */}
              <div className="p-3 rounded-2xl neu-inset bg-[#2d3121] border border-[#A9B489]/20 text-[11px] text-[#E2ECD2]/80 space-y-1">
                <div className="font-bold text-[#FFCF96] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Условия управления EthOSium Hospitality:
                </div>
                <p>• Комиссия оператора 20% от валовой выручки (включает маркетинг, клининг, охрану и техобслуживание).</p>
                <p>• Право личного бесплатного проживания владельца — до 30 дней в году.</p>
                <p>• Юридическое право собственности на землю и строение (кадастровый паспорт РУз).</p>
              </div>
            </div>

            {/* Right Column: Projected Results Card */}
            <div className="lg:col-span-6 neu-card p-5 sm:p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#383d2c] to-[#2f3323] space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full neu-inset border border-emerald-500/30">
                Прогноз финансовых потоков
              </span>

              <div className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between border-b border-[#A9B489]/20 pb-2">
                  <span className="text-xs text-[#E2ECD2]">Пассивный доход в месяц:</span>
                  <span className="font-mono text-lg font-bold text-emerald-400">
                    +${monthlyRentalIncome.toLocaleString()} / мес
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-b border-[#A9B489]/20 pb-2">
                  <span className="text-xs text-[#E2ECD2]">Арендный доход в год:</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    +${Math.round(annualRentalIncome).toLocaleString()} / год
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-b border-[#A9B489]/20 pb-2">
                  <span className="text-xs text-[#E2ECD2]">Арендный поток за {calcYears} лет:</span>
                  <span className="font-mono text-sm font-bold text-[#F0E2C8]">
                    +${Math.round(totalRentalIncomeOverYears).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-b border-[#A9B489]/20 pb-2">
                  <span className="text-xs text-[#E2ECD2]">Прирост стоимости земли и виллы:</span>
                  <span className="font-mono text-sm font-bold text-amber-300">
                    +${Math.round(totalCapitalAppreciation).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="text-xs text-[#A9B489]">Суммарная доходность (Аренда + Капитал):</div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-[#FFCF96]">
                    +${Math.round(totalProjectedGain).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#A9B489] mt-0.5">
                    Итоговая стоимость капитала: ${(calcBudgetUsd + totalProjectedGain).toLocaleString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setClientBudget(`$${calcBudgetUsd.toLocaleString()}`);
                  setActiveTab('contact');
                }}
                className="w-full mt-4 neu-btn py-3 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                Запросить инвестиционный меморандум &amp; договор
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIOHACKING & AUTONOMY INFRASTRUCTURE */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#A9B489]/20 bg-[#353928] space-y-4">
            <h2 className="font-headline font-bold text-xl text-[#F0E2C8] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#BA9470] text-[24px]">energy_savings_leaf</span>
              Стандарты Автономии &amp; Оздоровительной Среды EthOSium
            </h2>
            <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed">
              Мы не просто строим дома — мы создаем замкнутые биосистемы, где архитектура работает на удлинение биологической жизни, снижение воспалительных маркеров и восстановление циркадных ритмов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neu-card p-5 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-3">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-[#FFCF96]">
                <span className="material-symbols-outlined text-[24px]">solar_power</span>
              </div>
              <h3 className="text-sm font-bold text-[#F0E2C8]">Энергетическая Независимость</h3>
              <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
                Солнечные батареи и литий-железо-фосфатные накопители (LFP) обеспечивают бесперебойное питание даже при отключениях городской сети. Геотермальное тепло гор для зимнего обогрева.
              </p>
            </div>

            <div className="neu-card p-5 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-3">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-cyan-400">
                <span className="material-symbols-outlined text-[24px]">water_drop</span>
              </div>
              <h3 className="text-sm font-bold text-[#F0E2C8]">Живая Родниковая Вода</h3>
              <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
                Собственные скважины на глубину 140–200 м. Природная минерализация кремнием и микродозами радона, структурирование талой ледниковой водой без хлорирования и химикатов.
              </p>
            </div>

            <div className="neu-card p-5 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-3">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-emerald-400">
                <span className="material-symbols-outlined text-[24px]">bedtime</span>
              </div>
              <h3 className="text-sm font-bold text-[#F0E2C8]">Спальни с Защитой от ЭМП</h3>
              <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
                Стены экранированы от внешнего электромагнитного смога. Окна с полным blackout-эффектом, автоматическое отключение Wi-Fi в спальной зоне на ночь и принудительная подача хвойного горного воздуха.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT & RESERVATION FORM */}
      {activeTab === 'contact' && (
        <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/50 bg-[#353928] max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFCF96] font-bold">
              Отдел Развития Экосистемы
            </span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8]">
              Заявка на Бронирование Лота / Девелопмент
            </h2>
            <p className="text-xs text-[#A9B489]">
              Выбранный проект: <strong className="text-[#F0E2C8]">{activeProject.name}</strong>
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl neu-inset bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3 animate-in zoom-in-95">
              <span className="material-symbols-outlined text-emerald-400 text-[40px]">check_circle</span>
              <h3 className="font-headline font-bold text-lg text-[#F0E2C8]">
                Заявка успешно зарегистрирована
              </h3>
              <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
                Наш ведущий девелопер и юрист свяжутся с вами в течение 2 часов для отправки генплана, кадастровых схем и условий договора инвестирования.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]"
              >
                Отправить еще одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Ваше Имя:</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Тимур Саматов"
                    className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Телефон или Telegram:</label>
                  <input
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="+998 90 123-45-67 или @username"
                    className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Формат взаимодействия:</label>
                  <select
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value as any)}
                    className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  >
                    <option value="buy_lot">Покупка лота/шале под ключ</option>
                    <option value="co_investor">Долевое соинвестирование (от $25k)</option>
                    <option value="developer_partnership">Партнерство: Застройка на моем участке</option>
                    <option value="sanatorium_share">Санаторный медицинский сьют</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Планируемый бюджет:</label>
                  <input
                    type="text"
                    value={clientBudget}
                    onChange={(e) => setClientBudget(e.target.value)}
                    placeholder="Например: $85,000"
                    className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F0E2C8]">Пожелания к локации и срокам:</label>
                <textarea
                  rows={3}
                  value={clientNote}
                  onChange={(e) => setClientNote(e.target.value)}
                  placeholder="Интересует конкретный участок, возможность рассрочки или сдачи через оператора..."
                  className="w-full bg-[#2d3121] border border-[#A9B489]/30 rounded-xl p-3 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full neu-btn py-3 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Отправка...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Получить Генеральный План &amp; Каталог Лотов</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* LOT DETAIL MODAL */}
      {selectedLotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card rounded-3xl p-6 border border-[#BA9470] bg-[#353928] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#FFCF96] uppercase tracking-wider font-bold">
                  {selectedLotModal.project.name}
                </span>
                <h3 className="font-headline font-bold text-xl text-[#F0E2C8] mt-0.5">
                  {selectedLotModal.lot.type}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLotModal(null)}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl neu-inset bg-[#2d3121]">
              <div>
                <div className="text-[10px] text-[#A9B489]">Площадь</div>
                <div className="font-bold text-[#F0E2C8] text-sm">{selectedLotModal.lot.areaSqM} м²</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A9B489]">Спальни</div>
                <div className="font-bold text-[#F0E2C8] text-sm">{selectedLotModal.lot.bedrooms}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A9B489]">Стоимость</div>
                <div className="font-bold text-emerald-400 text-sm font-mono">${selectedLotModal.lot.priceUsd.toLocaleString()}</div>
              </div>
            </div>

            <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
              {selectedLotModal.lot.description}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#A9B489]/20">
              <div className="text-xs font-bold text-[#FFCF96]">Особенности и комплектация:</div>
              <ul className="space-y-1">
                {selectedLotModal.lot.features.map((f, i) => (
                  <li key={i} className="text-xs text-[#E2ECD2]/85 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400">check</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/20">
              <div>
                <div className="text-[10px] text-[#A9B489]">Прогноз аренды:</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  +${selectedLotModal.lot.yieldUsdMonth} / мес
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProjectId(selectedLotModal.project.id);
                  setClientNote(`Интересует лот: ${selectedLotModal.lot.type} ($${selectedLotModal.lot.priceUsd})`);
                  setSelectedLotModal(null);
                  setActiveTab('contact');
                }}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50"
              >
                Оставить заявку на этот лот
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
