import React, { useState } from 'react';
import { authService } from '../../../services/authService';

export const ProfessionalHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'propose_retreat' | 'accreditation' | 'protocols'>('calculator');
  
  // Calculator state
  const [ticketPriceUsd, setTicketPriceUsd] = useState<number>(320);
  const [participantsCount, setParticipantsCount] = useState<number>(14);
  const [durationNights, setDurationNights] = useState<number>(2);
  const [includeFoodAndStay, setIncludeFoodAndStay] = useState<boolean>(true);
  const [includeTransferAndEquipment, setIncludeTransferAndEquipment] = useState<boolean>(true);

  // Propose retreat form
  const [proposeTitle, setProposeTitle] = useState('');
  const [proposeCategory, setProposeCategory] = useState('psyche');
  const [proposeLocation, setProposeLocation] = useState('Чимган & Чарвак');
  const [proposeAuthorName, setProposeAuthorName] = useState('');
  const [proposeContact, setProposeContact] = useState('');
  const [proposeDescription, setProposeDescription] = useState('');
  const [proposeSubmitted, setProposeSubmitted] = useState(false);

  // Accreditation form
  const [accName, setAccName] = useState('');
  const [accSpecialization, setAccSpecialization] = useState('Психоанализ / Психотерапия');
  const [accExperienceYears, setAccExperienceYears] = useState('5-10 лет');
  const [accContact, setAccContact] = useState('');
  const [accCredentials, setAccCredentials] = useState('');
  const [accSubmitted, setAccSubmitted] = useState(false);

  // Financial Calculations for Pro
  const grossRevenue = ticketPriceUsd * participantsCount;
  const baseVenueCostPerPersonPerNight = 45; // stay in mountain center
  const baseFoodCostPerPersonPerNight = 25; // 3 meals organic
  const venueTotal = includeFoodAndStay ? (baseVenueCostPerPersonPerNight + baseFoodCostPerPersonPerNight) * durationNights * participantsCount : 0;
  const transferTotal = includeTransferAndEquipment ? (35 * participantsCount) : 0;
  const platformFee = Math.round(grossRevenue * 0.15); // 15% EthOSium platform & marketing fee
  const expertProfit = grossRevenue - venueTotal - transferTotal - platformFee;
  const profitMarginPct = grossRevenue > 0 ? Math.round((expertProfit / grossRevenue) * 100) : 0;

  const handleProposeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeTitle.trim() || !proposeAuthorName.trim() || !proposeContact.trim()) return;

    try {
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: proposeAuthorName.trim(),
        contact: proposeContact.trim(),
        format: 'custom',
        amountUsd: 0,
        promoCode: 'PRO-PARTNER',
        details: `Заявка от эксперта на проведение ретрита: "${proposeTitle}". Категория: ${proposeCategory}, Локация: ${proposeLocation}. Описание: ${proposeDescription}`,
        status: 'new'
      });
      setProposeSubmitted(true);
    } catch (err) {
      console.warn('Propose retreat error:', err);
    }
  };

  const handleAccreditationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim() || !accContact.trim()) return;

    try {
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: accName.trim(),
        contact: accContact.trim(),
        format: 'custom',
        amountUsd: 0,
        promoCode: 'PRO-ACCREDIT',
        details: `Заявка на аккредитацию специалиста: ${accName}. Направление: ${accSpecialization}, Опыт: ${accExperienceYears}. Дипломы/сертификаты: ${accCredentials}`,
        status: 'new'
      });
      setAccSubmitted(true);
    } catch (err) {
      console.warn('Accreditation error:', err);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-br from-[#3b402e] to-[#323625] shadow-xl">
        <div className="flex items-center gap-2 text-[#BA9470] font-mono text-xs uppercase font-bold tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">badge</span>
          EthOSium Pro Hub • Для Специалистов &amp; Организаторов
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8]">
          Модуль для Профессионалов &amp; Ведущих
        </h2>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 max-w-3xl leading-relaxed">
          Единая платформа для психологов, психоаналитиков, соматотерапевтов, врачей превентивной медицины, велнес-мастеров и горных гидов. Проводите свои ретриты на готовой инфраструктуре сертифицированных горных центров, ведите протоколы в приложении EthOSium и зарабатывайте с прозрачной финансовой моделью.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#313525] rounded-2xl border border-[#A9B489]/20 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-400">calculate</span>
          Калькулятор Доходности Ретрита
        </button>

        <button
          onClick={() => setActiveTab('propose_retreat')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'propose_retreat'
              ? 'neu-pill-active text-[#FFCF96] border border-[#BA9470]/40 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-amber-400">add_circle</span>
          Запустить Свой Ретрит
        </button>

        <button
          onClick={() => setActiveTab('accreditation')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'accreditation'
              ? 'neu-pill-active text-sky-300 border border-sky-500/40 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-sky-400">verified</span>
          Аккредитация Специалиста
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'protocols'
              ? 'neu-pill-active text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-purple-400">menu_book</span>
          Методические Протоколы
        </button>
      </div>

      {/* Tab 1: Financial Calculator */}
      {activeTab === 'calculator' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input sliders */}
            <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/30 bg-[#363a2a] space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96]">
                Параметры вашего мероприятия:
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#A9B489]">Стоимость билета для участника:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">${ticketPriceUsd}</span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={1200}
                  step={20}
                  value={ticketPriceUsd}
                  onChange={e => setTicketPriceUsd(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#A9B489]">Количество участников в группе:</span>
                  <span className="font-mono font-bold text-sky-400 text-sm">{participantsCount} чел.</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={participantsCount}
                  onChange={e => setParticipantsCount(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#A9B489]">Длительность ретрита:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{durationNights} ночи / {durationNights + 1} дня</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={durationNights}
                  onChange={e => setDurationNights(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#A9B489]/15 space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#E2ECD2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFoodAndStay}
                    onChange={e => setIncludeFoodAndStay(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Включить проживание и 3-разовое питание в горном центре ($70/чел/сут)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#E2ECD2] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTransferAndEquipment}
                    onChange={e => setIncludeTransferAndEquipment(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Включить трансфер из Ташкента и раздаточные материалы ($35/чел)</span>
                </label>
              </div>
            </div>

            {/* Financial Output */}
            <div className="neu-card rounded-2xl p-5 border-2 border-emerald-500/40 bg-gradient-to-br from-[#333a27] to-[#2c3220] flex flex-col justify-between gap-4 shadow-xl">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  Финансовая модель организатора:
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#2a2e1f]">
                    <span className="text-[#A9B489]">Валовая выручка (Gross):</span>
                    <span className="font-mono font-bold text-base text-[#F0E2C8]">${grossRevenue.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#2a2e1f]">
                    <span className="text-[#A9B489]">Расходы на площадку &amp; питание:</span>
                    <span className="font-mono text-[#E2ECD2]/80">-${venueTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#2a2e1f]">
                    <span className="text-[#A9B489]">Трансфер &amp; логистика:</span>
                    <span className="font-mono text-[#E2ECD2]/80">-${transferTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#2a2e1f]">
                    <span className="text-[#A9B489]">Платформа EthOSium (15%):</span>
                    <span className="font-mono text-[#E2ECD2]/80">-${platformFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
                  <div className="text-[11px] font-mono text-emerald-300 uppercase">Чистая прибыль эксперта:</div>
                  <div className="text-3xl font-headline font-bold text-emerald-400 mt-0.5">
                    ${expertProfit.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#E2ECD2]/80 mt-1">
                    Рентабельность вашего мероприятия: <strong className="text-amber-300 font-mono">{profitMarginPct}%</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('propose_retreat')}
                className="w-full neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/50 border border-emerald-500/50 hover:bg-emerald-700/70 transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                Забронировать даты под свой ретрит
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Propose Retreat */}
      {activeTab === 'propose_retreat' && (
        <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/30 bg-[#353929] space-y-4 animate-in fade-in duration-200">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96]">
            Подача заявки на запуск авторского ретрита:
          </div>

          {proposeSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-center space-y-2">
              <span className="material-symbols-outlined text-emerald-400 text-[32px]">check_circle</span>
              <h3 className="text-sm font-bold text-[#F0E2C8]">Заявка на проведение ретрита принята!</h3>
              <p className="text-xs text-[#E2ECD2]/80 max-w-md mx-auto">
                Команда кураторов EthOSium свяжется с вами для согласования дат в выбранном горном центре и публикации в каталоге ретритов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleProposeSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Название вашего ретрита *</label>
                  <input
                    type="text"
                    required
                    value={proposeTitle}
                    onChange={e => setProposeTitle(e.target.value)}
                    placeholder="Например: Психосоматика стресса в Чимгане"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Фокус 4D Здоровья</label>
                  <select
                    value={proposeCategory}
                    onChange={e => setProposeCategory(e.target.value)}
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  >
                    <option value="psyche">Психика (Психоанализ, Гештальт, Эмоции)</option>
                    <option value="body">Тело (Биохакинг, Соматика, Дыхание)</option>
                    <option value="mind">Разум (Когнитивный фокус, Стратегия)</option>
                    <option value="soul">Душа (Род, Тишина, Медитации)</option>
                    <option value="all">Комплексный 4D Синтез</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Желаемая горная база</label>
                  <select
                    value={proposeLocation}
                    onChange={e => setProposeLocation(e.target.value)}
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  >
                    <option value="Чимган & Чарвак">Чимган & Чарвак (Тянь-Шань)</option>
                    <option value="Заамин">Заамин («Узбекистанская Швейцария»)</option>
                    <option value="Аманкутан">Аманкутан (Зеравшанский хребет)</option>
                    <option value="Горный Алтай">Горный Алтай</option>
                    <option value="Иссык-Куль">Иссык-Куль (Термальный курорт)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Имя и регалии автора *</label>
                  <input
                    type="text"
                    required
                    value={proposeAuthorName}
                    onChange={e => setProposeAuthorName(e.target.value)}
                    placeholder="Др. Александр Иванов, к.м.н."
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Контакт (телефон / TG) *</label>
                  <input
                    type="text"
                    required
                    value={proposeContact}
                    onChange={e => setProposeContact(e.target.value)}
                    placeholder="+998 ... или @username"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Краткое описание программы и методики</label>
                <textarea
                  rows={3}
                  value={proposeDescription}
                  onChange={e => setProposeDescription(e.target.value)}
                  placeholder="Опишите структуру выезда, используемые техники и ожидаемые результаты для участников..."
                  className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="neu-btn px-6 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/50 border border-emerald-500/50 hover:bg-emerald-700/70 flex items-center gap-1.5 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Отправить программу на модерацию
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Accreditation */}
      {activeTab === 'accreditation' && (
        <div className="neu-card rounded-2xl p-5 border border-[#BA9470]/30 bg-[#353929] space-y-4 animate-in fade-in duration-200">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
            Аккредитация специалиста в системе EthOSium Health:
          </div>

          <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
            Аккредитованные специалисты получают доступ к ведению клиентских карточек в 6 контурах здоровья, право проведения официальных ретритов и поток клиентов из сообщества EthOSium.
          </p>

          {accSubmitted ? (
            <div className="p-6 rounded-2xl bg-sky-950/60 border border-sky-500/50 text-center space-y-2">
              <span className="material-symbols-outlined text-sky-400 text-[32px]">verified</span>
              <h3 className="text-sm font-bold text-[#F0E2C8]">Документы переданы на экспертный совет!</h3>
              <p className="text-xs text-[#E2ECD2]/80 max-w-md mx-auto">
                Екатерина Семерджиди и комиссия верифицируют ваши дипломы и свяжутся для прохождения 20-минутного онлайн-собеседования.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAccreditationSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">ФИО специалиста *</label>
                  <input
                    type="text"
                    required
                    value={accName}
                    onChange={e => setAccName(e.target.value)}
                    placeholder="Иванова Ольга Сергеевна"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Основное направление</label>
                  <select
                    value={accSpecialization}
                    onChange={e => setAccSpecialization(e.target.value)}
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  >
                    <option value="Психоанализ / Психотерапия">Психоанализ / Психотерапия</option>
                    <option value="Телесно-ориентированная соматика">Телесно-ориентированная соматика</option>
                    <option value="Клиническая психология">Клиническая психология</option>
                    <option value="Превентивная медицина / Сомнология">Превентивная медицина / Сомнология</option>
                    <option value="Горный проводник / Инструктор выживания">Горный проводник / Инструктор</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Стаж практической работы</label>
                  <select
                    value={accExperienceYears}
                    onChange={e => setAccExperienceYears(e.target.value)}
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  >
                    <option value="3-5 лет">3-5 лет</option>
                    <option value="5-10 лет">5-10 лет</option>
                    <option value="10+ лет">Более 10 лет</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Телефон / Telegram *</label>
                  <input
                    type="text"
                    required
                    value={accContact}
                    onChange={e => setAccContact(e.target.value)}
                    placeholder="+998 ... или @username"
                    className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F0E2C8] mb-1">Образование, дипломы и сертификации</label>
                <textarea
                  rows={2}
                  value={accCredentials}
                  onChange={e => setAccCredentials(e.target.value)}
                  placeholder="ВУЗ, специализация, членство в ассоциациях (ЕАРПП, IPA, ОППЛ и др.)..."
                  className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="neu-btn px-6 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-sky-700/50 border border-sky-500/50 hover:bg-sky-700/70 flex items-center gap-1.5 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Подать заявку на аккредитацию
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: Methodological Protocols */}
      {activeTab === 'protocols' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {[
            {
              title: 'Протокол психологической декомпрессии Екатерины Семерджиди',
              category: 'Психика & Разум',
              desc: 'Пошаговый алгоритм безопасной работы с вытесненными аффектами, снятие синдрома тревожного гиперконтроля и ведение групповой динамики без ретравматизации.'
            },
            {
              title: 'Горный регламент безопасности & Акклиматизация на высотах 1500–2400м',
              category: 'Тело & Безопасность',
              desc: 'Медицинские критерии допуска, измерение SpO2/пульса перед физической нагрузкой, протокол действий при горной гипоксии и аптечка первой помощи.'
            },
            {
              title: 'Цикл «7 Дней Интеграции»: сопровождение участников после выезда',
              category: 'Интеграция',
              desc: 'Шаблоны ежедневных микро-заданий для удержания ресурса и предотвращения резкого отката при возвращении в рабочий офис.'
            }
          ].map((proto, idx) => (
            <div key={idx} className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 bg-[#343828] flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-300 bg-[#2b2d1f] px-2 py-0.5 rounded border border-amber-500/30">
                  {proto.category}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#F0E2C8] mt-1.5">
                  {proto.title}
                </h4>
                <p className="text-xs text-[#E2ECD2]/75 mt-1 leading-relaxed">
                  {proto.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert(`Протокол «${proto.title}» доступен аккредитованным специалистам в закрытом контуре EthOSium.`)}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] shrink-0 self-center"
              >
                Изучить PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
