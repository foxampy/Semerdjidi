import React, { useState } from 'react';
import { MOUNTAIN_WELLNESS_CENTERS, MountainCenter, HealthDimension } from '../../../data/retreatsAndCentersData';
import { authService } from '../../../services/authService';

export const MountainCentersSection: React.FC = () => {
  const [selectedCenter, setSelectedCenter] = useState<MountainCenter | null>(null);
  const [activeDimensionFilter, setActiveDimensionFilter] = useState<string>('all');
  const [activeCountryFilter, setActiveCountryFilter] = useState<string>('all');
  
  // Booking inquiry state inside modal
  const [bookingProgramId, setBookingProgramId] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter centers
  const filteredCenters = MOUNTAIN_WELLNESS_CENTERS.filter(center => {
    if (activeCountryFilter !== 'all' && center.country !== activeCountryFilter) {
      return false;
    }
    if (activeDimensionFilter !== 'all') {
      if (!center.dimensions.includes(activeDimensionFilter as HealthDimension) && !center.dimensions.includes('all')) {
        return false;
      }
    }
    return true;
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim() || !selectedCenter) return;

    setIsSubmitting(true);
    try {
      const chosenProg = selectedCenter.curativePrograms.find(p => p.id === bookingProgramId);
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: clientName.trim(),
        contact: clientContact.trim(),
        format: 'custom',
        amountUsd: chosenProg ? chosenProg.ethosiumPriceUsd : 150,
        promoCode: 'ETHOS-MOUNTAIN-50',
        details: `Заявка в горный центр: "${selectedCenter.name}". Программа: ${chosenProg?.name || 'Индивидуальное проживание'}. Желаемая дата: ${inquiryDate || 'Уточняется'}.`,
        status: 'new'
      });
      setInquirySubmitted(true);
    } catch (err) {
      console.warn('Inquiry submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Banner / Header */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-br from-[#3b402e] to-[#323625] relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 text-[#BA9470] font-mono text-xs uppercase font-bold tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">nature_people</span>
          Сеть Альпийских Санаториев &amp; Горных Биохакинг-Хабов
        </div>

        <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8]">
          Горные Оздоровительные Центры EthOSium
        </h2>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 max-w-3xl leading-relaxed">
          Аккредитованные высокогорные курорты, климатические санатории и центры долголетия на высотах от 1,170 до 2,400 метров. Чистейший фитонцидный воздух вековых арчовников, термальные радоновые и минеральные ключи, пантолечение, горная гипоксия и интеграция данных здоровья в ваш профиль EthOSium со специальными клубными скидками до 50%.
        </p>

        {/* Quick Highlights Counters */}
        <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-[#A9B489]/20 flex-wrap text-xs font-mono text-[#A9B489]">
          <div>
            Центров в сети: <strong className="text-[#FFFDF8]">{MOUNTAIN_WELLNESS_CENTERS.length} локаций</strong>
          </div>
          <div>
            Диапазон высот: <strong className="text-emerald-400">1,170 – 2,400 м</strong>
          </div>
          <div>
            Клубная скидка: <strong className="text-amber-300">до 50%</strong>
          </div>
          <div>
            Интеграция: <strong className="text-sky-400">6 Контуров Здоровья</strong>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 bg-[#343828] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#A9B489] font-mono text-[11px] uppercase mr-1">Вектор 4D:</span>
          {[
            { id: 'all', label: 'Все векторы' },
            { id: 'body', label: 'Тело (Биохакинг/Бальнеология)' },
            { id: 'mind', label: 'Разум (Нейро/Фокус)' },
            { id: 'soul', label: 'Душа (Тишина/Род)' },
            { id: 'psyche', label: 'Психика (Антистресс)' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveDimensionFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeDimensionFilter === btn.id
                  ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40 text-xs'
                  : 'text-[#A9B489] hover:text-[#F0E2C8] text-xs'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A9B489] font-mono text-[11px] uppercase">Регион:</span>
          <select
            value={activeCountryFilter}
            onChange={e => setActiveCountryFilter(e.target.value)}
            className="neu-input rounded-xl px-2.5 py-1.5 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
          >
            <option value="all">Все страны и горы</option>
            <option value="Узбекистан">Узбекистан (Тянь-Шань & Заамин)</option>
            <option value="Кыргызстан">Кыргызстан (Иссык-Куль)</option>
            <option value="Россия / Трансграничный узел">Алтай</option>
            <option value="Россия">Кавказ (Красная Поляна)</option>
          </select>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCenters.map(center => (
          <div
            key={center.id}
            className="neu-card rounded-2xl p-5 border border-[#BA9470]/40 bg-[#383d2c] flex flex-col justify-between gap-4 shadow-lg hover:border-[#BA9470] transition-all"
          >
            <div>
              {/* Badges row */}
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  Аккредитован EthOSium
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-[#FFCF96] font-bold bg-[#292c1f] px-2 py-0.5 rounded-md border border-[#BA9470]/30">
                    Скидка -{center.partnerDiscountPct}%
                  </span>
                  <span className="text-xs font-mono text-sky-300 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">landscape</span>
                    {center.altitudeRange}
                  </span>
                </div>
              </div>

              <h3 className="font-headline font-bold text-lg text-[#F0E2C8] leading-snug">
                {center.name}
              </h3>

              <div className="text-xs text-[#A9B489] flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span>{center.region}, {center.country}</span>
              </div>

              <p className="text-xs text-[#E2ECD2]/85 mt-2.5 line-clamp-3 leading-relaxed">
                {center.description}
              </p>

              {/* Healing factors pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {center.healingFactors.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2d3122] text-[#E2ECD2]/80 border border-[#A9B489]/20">
                    • {f}
                  </span>
                ))}
                {center.healingFactors.length > 3 && (
                  <span className="text-[10px] font-mono text-[#BA9470] self-center">
                    +{center.healingFactors.length - 3} фактора
                  </span>
                )}
              </div>

              {/* Top program */}
              {center.curativePrograms.length > 0 && (
                <div className="mt-3 p-2.5 rounded-xl neu-inset bg-[#313525] border border-[#A9B489]/15">
                  <div className="text-[10px] font-mono text-[#A9B489] uppercase">Флагманский курс:</div>
                  <div className="text-xs font-bold text-[#F0E2C8] mt-0.5">
                    {center.curativePrograms[0].name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono mt-1">
                    <span>{center.curativePrograms[0].duration}</span>
                    <span>
                      от ${center.curativePrograms[0].ethosiumPriceUsd}{' '}
                      <span className="line-through text-[#A9B489] text-[10px]">${center.curativePrograms[0].priceUsd}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#A9B489]/15 flex items-center justify-between gap-2 flex-wrap">
              <div className="text-[11px] text-[#A9B489] font-mono">
                Размещение от <strong className="text-[#FFFDF8]">${center.accommodationOptions[0]?.pricePerNightUsd}</strong>/ночь
              </div>

              <button
                onClick={() => {
                  setSelectedCenter(center);
                  setBookingProgramId(center.curativePrograms[0]?.id || '');
                  setInquirySubmitted(false);
                }}
                className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/60 hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">medical_services</span>
                Программы &amp; Бронирование
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Center Detail & Booking Modal */}
      {selectedCenter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="neu-card rounded-3xl border border-[#BA9470]/60 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl bg-[#373b2b]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#A9B489]/20 bg-gradient-to-r from-[#3c412f] to-[#333626] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                    {selectedCenter.country}
                  </span>
                  <span className="text-[10px] font-mono text-[#FFCF96] font-bold px-2 py-0.5 rounded-full bg-[#292c1f] border border-[#BA9470]/30">
                    Высота {selectedCenter.altitudeRange}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    Скидка резидентам EthOSium: -{selectedCenter.partnerDiscountPct}%
                  </span>
                </div>

                <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] leading-tight">
                  {selectedCenter.name}
                </h2>
                <div className="text-xs text-[#A9B489] mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                  {selectedCenter.region}
                </div>
              </div>

              <button
                onClick={() => setSelectedCenter(null)}
                className="neu-btn w-9 h-9 rounded-full flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8] shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Climate and Healing Factors */}
              <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#333726] space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Климатотерапия &amp; Природные лечебные факторы
                </h3>
                <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
                  {selectedCenter.climateProfile}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {selectedCenter.healingFactors.map((factor, idx) => (
                    <span key={idx} className="text-xs bg-[#2b2f1f] text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">eco</span>
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Infrastructure */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Инфраструктура и медицинское оснащение
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCenter.infrastructure.map((inf, i) => (
                    <div key={i} className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#313525] flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[20px] text-[#FFCF96] shrink-0 mt-0.5">
                        {inf.icon}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#F0E2C8]">{inf.name}</div>
                        <div className="text-[11px] text-[#E2ECD2]/75 mt-0.5">{inf.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curative Programs List */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Лечебно-оздоровительные программы со скидкой 50%
                </h3>
                <div className="space-y-2.5">
                  {selectedCenter.curativePrograms.map(prog => (
                    <div
                      key={prog.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        bookingProgramId === prog.id
                          ? 'neu-card border-[#BA9470] bg-[#3d422f]'
                          : 'neu-inset border-[#A9B489]/20 bg-[#313525]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-[#F0E2C8]">
                              {prog.name}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                              {prog.duration}
                            </span>
                          </div>
                          <p className="text-xs text-[#E2ECD2]/80 mt-1">
                            {prog.summary}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {prog.protocols.map((proto, pidx) => (
                              <span key={pidx} className="text-[10px] font-mono bg-[#2a2d1f] text-[#FFCF96] px-2 py-0.5 rounded border border-[#BA9470]/20">
                                ✓ {proto}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono line-through text-[#A9B489]">
                            ${prog.priceUsd}
                          </div>
                          <div className="text-base font-headline font-bold text-emerald-300">
                            ${prog.ethosiumPriceUsd}
                          </div>
                          <button
                            type="button"
                            onClick={() => setBookingProgramId(prog.id)}
                            className={`mt-1.5 text-xs px-2.5 py-1 rounded-lg font-bold border transition-all ${
                              bookingProgramId === prog.id
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'neu-btn text-[#BA9470] border-[#BA9470]/40'
                            }`}
                          >
                            {bookingProgramId === prog.id ? 'Выбрана' : 'Выбрать курс'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accommodation Options */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Варианты проживания
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedCenter.accommodationOptions.map((acc, aIdx) => (
                    <div key={aIdx} className="neu-card rounded-xl p-3 border border-[#A9B489]/20 bg-[#313525]">
                      <div className="text-xs font-bold text-[#F0E2C8]">{acc.tier}</div>
                      <div className="text-sm font-headline font-bold text-emerald-400 mt-1">
                        ${acc.pricePerNightUsd} <span className="text-[10px] font-normal text-[#A9B489]">/ ночь</span>
                      </div>
                      <ul className="mt-2 space-y-1 text-[11px] text-[#E2ECD2]/75">
                        {acc.features.map((ft, fIdx) => (
                          <li key={fIdx}>• {ft}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Inquiry Form */}
              <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/40 bg-[#343828] space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCF96] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  Забронировать путевку со скидкой резидента -{selectedCenter.partnerDiscountPct}%
                </h3>

                {inquirySubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-center space-y-1.5">
                    <span className="material-symbols-outlined text-emerald-400 text-[28px]">task_alt</span>
                    <div className="text-xs font-bold text-[#F0E2C8]">
                      Ваша заявка направлена медицинскому координатору санатория!
                    </div>
                    <div className="text-[11px] text-[#E2ECD2]/80">
                      Мы свяжемся с вами в течение 30 минут для согласования даты заезда и применения промокода со скидкой 50%.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-[#A9B489] mb-1">Ваше имя *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          placeholder="Имя и фамилия"
                          className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A9B489] mb-1">Телефон / Telegram *</label>
                        <input
                          type="text"
                          required
                          value={clientContact}
                          onChange={e => setClientContact(e.target.value)}
                          placeholder="+998 ... или @username"
                          className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A9B489] mb-1">Примерная дата заезда</label>
                        <input
                          type="text"
                          value={inquiryDate}
                          onChange={e => setInquiryDate(e.target.value)}
                          placeholder="Например, с 15 по 22 октября"
                          className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/15 flex-wrap gap-2">
                      <div className="text-[11px] text-[#A9B489]">
                        Консьерж-служба курорта: <span className="font-mono text-[#F0E2C8]">{selectedCenter.contactCoordinates.phone}</span> ({selectedCenter.contactCoordinates.telegram})
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="neu-btn px-5 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 flex items-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <span>Отправка...</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[15px]">send</span>
                            Отправить заявку со скидкой
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#313525] border-t border-[#A9B489]/20 flex items-center justify-between gap-3">
              <span className="text-xs text-[#A9B489]">
                {selectedCenter.medicalLicenses?.[0] || 'Сертифицированный оздоровительный комплекс'}
              </span>
              <button
                onClick={() => setSelectedCenter(null)}
                className="neu-btn px-4 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
