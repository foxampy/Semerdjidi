import React, { useState } from 'react';
import { authService } from '../../../services/authService';

export const CorporateBusinessView: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(12);
  const [selectedFormat, setSelectedFormat] = useState<'strategy' | 'antiburnout' | 'extreme'>('antiburnout');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [locationPreference, setLocationPreference] = useState('chimgan');
  const [includePsychoanalysisFacilitation, setIncludePsychoanalysisFacilitation] = useState(true);
  const [includeFullBoardAndSpa, setIncludeFullBoardAndSpa] = useState(true);

  // B2B RFP Form
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phoneOrTg, setPhoneOrTg] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [rfpSubmitted, setRfpSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financials
  const baseCostPerPersonPerDay = 
    selectedFormat === 'strategy' ? 140 :
    selectedFormat === 'antiburnout' ? 125 : 110;

  const facilitationDaily = includePsychoanalysisFacilitation ? 350 : 0;
  const boardMultiplier = includeFullBoardAndSpa ? 1.0 : 0.7;

  const rawTotalUsd = Math.round(
    (baseCostPerPersonPerDay * teamSize * durationDays * boardMultiplier) + (facilitationDaily * durationDays)
  );
  const discountedTotalUsd = Math.round(rawTotalUsd * 0.5); // 50% discount
  const perPersonDiscounted = Math.round(discountedTotalUsd / (teamSize || 1));

  const handleRfpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !phoneOrTg.trim()) return;

    setIsSubmitting(true);
    try {
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: `${contactPerson} (${companyName})`,
        contact: `${phoneOrTg} | ${workEmail}`,
        format: 'corporate',
        amountUsd: discountedTotalUsd,
        promoCode: 'CORP-ETHOS-50',
        details: `Корпоративный B2B выезд: ${companyName}. Формат: ${selectedFormat}, Команда: ${teamSize} чел, Дней: ${durationDays}, База: ${locationPreference}. Фасилитация: ${includePsychoanalysisFacilitation ? 'Да' : 'Нет'}. Цели: ${customGoal || 'Сплочение и снятие стресса'}.`,
        status: 'new'
      });
      setRfpSubmitted(true);
    } catch (err) {
      console.warn('RFP error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-br from-[#383d2c] to-[#2e3220] shadow-xl">
        <div className="flex items-center gap-2 text-[#BA9470] font-mono text-xs uppercase font-bold tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">domain</span>
          EthOSium Enterprise • Корпоративное Здоровье &amp; B2B Ретриты
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8]">
          Корпоративные Стратегические &amp; Антивыгорающие Выезды
        </h2>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 max-w-3xl leading-relaxed">
          Профессиональные горные оффсайты для топ-менеджмента и команд от 6 до 50 человек. Соединяем стратегическую фасилитацию, групповую психологическую декомпрессию, чистейший высокогорный воздух и премиальную закрытую инфраструктуру с безналичным расчетом и закрывающими документами.
        </p>

        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#A9B489]/20 flex-wrap text-xs font-mono text-[#A9B489]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-emerald-400 text-[16px]">verified</span>
            <span>Безналичный расчет (договор, закрывающие акты, НДС 0%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-300 text-[16px]">percent</span>
            <span>Корпоративная субсидия: скидка 50%</span>
          </div>
        </div>
      </div>

      {/* Calculator and B2B Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive B2B Configurator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/30 bg-[#353928] space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96]">
              Конфигуратор корпоративного выезда:
            </div>

            {/* Format choice */}
            <div>
              <label className="block text-xs font-bold text-[#F0E2C8] mb-1.5">
                Целевой формат выезда:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'antiburnout',
                    name: 'Антивыгорание',
                    sub: 'Психологическая перезагрузка',
                    desc: 'Снятие накопленного стресса, баня, прогулки в тишине'
                  },
                  {
                    id: 'strategy',
                    name: 'Стратегический',
                    sub: 'Deep Focus & Alignment',
                    desc: 'Фасилитация целей года, работа с видением и сплочение'
                  },
                  {
                    id: 'extreme',
                    name: 'Экспедиционный',
                    sub: 'Resilience Challenge',
                    desc: 'Горный трек 2200м, преодоление, характер и драйв'
                  }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedFormat === fmt.id
                        ? 'neu-pill-active border-[#BA9470] text-[#F0E2C8]'
                        : 'neu-inset border-[#A9B489]/20 text-[#A9B489]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F0E2C8]">{fmt.name}</div>
                    <div className="text-[10px] text-amber-300 font-mono mt-0.5">{fmt.sub}</div>
                    <div className="text-[10px] text-[#E2ECD2]/70 mt-1">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#A9B489]">Размер команды:</span>
                <span className="font-mono font-bold text-sky-400 text-sm">{teamSize} сотрудников</span>
              </div>
              <input
                type="range"
                min={6}
                max={50}
                step={2}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Duration and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Длительность:</label>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4, 5].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                        durationDays === d
                          ? 'neu-pill-active text-[#FFCF96] border-[#BA9470]'
                          : 'neu-inset text-[#A9B489] border-[#A9B489]/20'
                      }`}
                    >
                      {d} {d === 2 || d === 3 || d === 4 ? 'дня' : 'дней'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Локация:</label>
                <select
                  value={locationPreference}
                  onChange={e => setLocationPreference(e.target.value)}
                  className="w-full neu-input rounded-xl px-2.5 py-1.5 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                >
                  <option value="chimgan">Чимган (Шале с панорамным конференц-залом)</option>
                  <option value="zaamin">Заамин (Климатический курорт, арчовые леса)</option>
                  <option value="amankutan">Аманкутан (Уединенный горный каньон)</option>
                </select>
              </div>
            </div>

            {/* Additional Modules */}
            <div className="pt-2 border-t border-[#A9B489]/15 space-y-2 text-xs">
              <label className="flex items-center gap-2 text-[#E2ECD2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePsychoanalysisFacilitation}
                  onChange={e => setIncludePsychoanalysisFacilitation(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Фасилитация психологом-психоаналитиком центра Екатерины Семерджиди</span>
              </label>

              <label className="flex items-center gap-2 text-[#E2ECD2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFullBoardAndSpa}
                  onChange={e => setIncludeFullBoardAndSpa(e.target.checked)}
                  className="accent-emerald-500"
                />
                <span>Полный пансион (All-Inclusive фермерское питание, баня, чайная церемония)</span>
              </label>
            </div>
          </div>

          {/* Value props for Business */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#313525]">
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                -42% Выгорания
              </div>
              <p className="text-[11px] text-[#E2ECD2]/75 mt-1 leading-normal">
                Замер стресса по методологии EthOSium до и после выезда
              </p>
            </div>

            <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#313525]">
              <div className="text-sky-400 font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                100% Синхрон
              </div>
              <p className="text-[11px] text-[#E2ECD2]/75 mt-1 leading-normal">
                Команда выходит со согласованными ОКR и ясным видением
              </p>
            </div>

            <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#313525]">
              <div className="text-amber-300 font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">handshake</span>
                «Белый» Договор
              </div>
              <p className="text-[11px] text-[#E2ECD2]/75 mt-1 leading-normal">
                Полный комплект бухгалтерских документов для юрлиц
              </p>
            </div>
          </div>
        </div>

        {/* Right: Price Summary & RFP Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="neu-card rounded-2xl p-5 border-2 border-[#BA9470]/60 bg-gradient-to-br from-[#353b2a] to-[#2c3021] space-y-4 shadow-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96]">
              Предварительный расчет бюджета:
            </div>

            <div className="p-4 rounded-xl bg-[#292d1e] border border-[#BA9470]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A9B489]">Регулярный тариф:</span>
                <span className="line-through font-mono text-[#A9B489]">${rawTotalUsd.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold">Тариф EthOSium B2B (-50%):</span>
                <span className="text-2xl font-headline font-bold text-emerald-400">${discountedTotalUsd.toLocaleString()}</span>
              </div>
              <div className="pt-1 border-t border-[#A9B489]/15 flex items-center justify-between text-[11px] text-[#A9B489]">
                <span>На 1 сотрудника «под ключ»:</span>
                <span className="font-mono text-[#F0E2C8] font-bold">${perPersonDiscounted}</span>
              </div>
            </div>

            {/* RFP Form */}
            {rfpSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2">
                <span className="material-symbols-outlined text-emerald-400 text-[32px]">task_alt</span>
                <h3 className="text-sm font-bold text-[#F0E2C8]">Запрос на коммерческое предложение отправлен!</h3>
                <p className="text-xs text-[#E2ECD2]/80">
                  Корпоративный менеджер сформирует детальную смету и проект договора в течение 2 часов.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRfpSubmit} className="space-y-3">
                <div className="text-xs font-mono font-bold text-[#F0E2C8]">
                  Запросить КП и бронь дат:
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Название компании (ООО / IT-студия / Холдинг) *"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#222519] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="Контактное лицо (HRD / CEO) *"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#222519] border border-[#A9B489]/30 outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={phoneOrTg}
                    onChange={e => setPhoneOrTg(e.target.value)}
                    placeholder="Телефон / Telegram *"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#222519] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={workEmail}
                    onChange={e => setWorkEmail(e.target.value)}
                    placeholder="Корпоративная почта (для счета и презентации)"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#222519] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={customGoal}
                    onChange={e => setCustomGoal(e.target.value)}
                    placeholder="Пожелания: желаемые даты, специфика команды, запрос к программе..."
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#222519] border border-[#A9B489]/30 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/50 border border-emerald-500/50 hover:bg-emerald-700/70 transition-all flex items-center justify-center gap-1.5 shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Отправка КП...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      Получить коммерческое предложение (-50%)
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
