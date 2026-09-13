import React, { useState } from 'react';
import { RetreatItem } from '../../../data/retreatsAndCentersData';
import { authService } from '../../../services/authService';

interface RetreatDetailModalProps {
  retreat: RetreatItem;
  onClose: () => void;
  onBookNow: (retreat: RetreatItem) => void;
}

export const RetreatDetailModal: React.FC<RetreatDetailModalProps> = ({
  retreat,
  onClose,
  onBookNow,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'schedule' | 'booking'>('overview');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [selectedLodgeTier, setSelectedLodgeTier] = useState<'standard' | 'comfort' | 'premium'>('comfort');
  const [specialWish, setSpecialWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const calculateTotal = () => {
    let base = retreat.priceFromUsd;
    if (selectedLodgeTier === 'comfort') base += 25;
    if (selectedLodgeTier === 'premium') base += 65;
    return base * participantsCount;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestContact.trim()) return;

    setIsSubmitting(true);
    try {
      const code = `ETHOS-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalUsd = calculateTotal();

      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: guestName.trim(),
        contact: guestContact.trim(),
        format: retreat.format,
        amountUsd: totalUsd,
        promoCode: retreat.promoCode || 'ETHOS-50',
        details: `Бронирование ретрита: "${retreat.title}". Формат: ${retreat.format}, Участников: ${participantsCount}, Размещение: ${selectedLodgeTier}. Пожелания: ${specialWish || '—'}`,
        status: 'new'
      });

      setBookingSuccess(code);
    } catch (err) {
      console.warn('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="neu-card rounded-3xl border border-[#BA9470]/60 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl bg-[#373b2b]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#A9B489]/20 bg-gradient-to-r from-[#3c412f] to-[#333626] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                retreat.format === 'solo'
                  ? 'bg-amber-900/60 text-amber-300 border-amber-500/40'
                  : retreat.format === 'corporate'
                    ? 'bg-sky-900/60 text-sky-300 border-sky-500/40'
                    : 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
              }`}>
                {retreat.format === 'solo' ? 'Индивидуальный (Solo)' : retreat.format === 'corporate' ? 'Корпоративный (B2B)' : 'Групповой'}
              </span>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2a2c20] text-[#BA9470] border border-[#BA9470]/30">
                {retreat.discountBadge}
              </span>

              {retreat.altitudeMeters && (
                <span className="text-[10px] font-mono text-[#E2ECD2]/70 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px] text-emerald-400">landscape</span>
                  {retreat.altitudeMeters} м
                </span>
              )}
            </div>

            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] leading-tight">
              {retreat.title}
            </h2>
            <p className="text-xs text-[#E2ECD2]/80 mt-1">
              {retreat.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="neu-btn w-9 h-9 rounded-full flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8] shrink-0"
            title="Закрыть"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#313525] border-b border-[#A9B489]/15 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">info</span>
            Обзор
          </button>

          <button
            onClick={() => setActiveTab('dimensions')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dimensions'
                ? 'neu-pill-active text-emerald-300 border border-emerald-500/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-400">spa</span>
            4D Здоровье (Тело, Разум, Душа, Психика)
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'neu-pill-active text-amber-300 border border-amber-500/40'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-amber-400">schedule</span>
            Программа
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'booking'
                ? 'neu-pill-active text-[#FFFDF8] bg-[#BA9470]/40 border border-[#BA9470]'
                : 'text-[#BA9470] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
            Забронировать (от ${retreat.priceFromUsd})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[24px] text-[#BA9470]">event</span>
                  <div>
                    <div className="text-[10px] text-[#A9B489] uppercase font-mono">Даты</div>
                    <div className="text-xs font-bold text-[#F0E2C8]">{retreat.dates}</div>
                  </div>
                </div>

                <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[24px] text-emerald-400">pin_drop</span>
                  <div>
                    <div className="text-[10px] text-[#A9B489] uppercase font-mono">Локация</div>
                    <div className="text-xs font-bold text-[#F0E2C8]">{retreat.location}</div>
                  </div>
                </div>

                <div className="neu-card rounded-xl p-3 border border-[#A9B489]/20 flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[24px] text-sky-400">hourglass_top</span>
                  <div>
                    <div className="text-[10px] text-[#A9B489] uppercase font-mono">Длительность</div>
                    <div className="text-xs font-bold text-[#F0E2C8]">{retreat.duration}</div>
                  </div>
                </div>
              </div>

              <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#343727]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470] mb-2">
                  О программе
                </h3>
                <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed">
                  {retreat.fullDescription || retreat.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-[#A9B489]/20">
                  <span className="text-[11px] font-bold text-amber-300">Для кого: </span>
                  <span className="text-xs text-[#E2ECD2]/80">{retreat.targetAudience}</span>
                </div>
              </div>

              {/* Hosts */}
              {retreat.hosts && retreat.hosts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                    Ведущие и наставники
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {retreat.hosts.map((host, i) => (
                      <div key={i} className="neu-card rounded-xl p-3 border border-[#A9B489]/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#BA9470]/20 border border-[#BA9470]/40 flex items-center justify-center text-[#BA9470] font-bold shrink-0">
                          {host.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#F0E2C8]">{host.name}</div>
                          <div className="text-[11px] text-[#A9B489]">{host.role}</div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#2a2c20] text-emerald-300 border border-emerald-500/30 inline-block mt-0.5">
                            {host.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What is included */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#BA9470]">
                  Что включено в стоимость
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {retreat.includedServices.map((srv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#E2ECD2]/85 bg-[#313525] p-2.5 rounded-xl border border-[#A9B489]/15">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0 mt-0.5">check_circle</span>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-xl neu-inset bg-[#2e3222] border border-[#A9B489]/20 text-xs text-[#E2ECD2]/85 leading-relaxed">
                <strong className="text-[#FFCF96]">4D Холистическая Методология:</strong> Любой ретрит EthOSium строится на неразрывном балансе 4 начал человека: физического тела, когнитивного разума, глубинной души и эмоциональной психики.
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Body */}
                <div className="neu-card rounded-2xl p-4 border border-emerald-500/30 bg-[#343928] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px] text-emerald-400">fitness_center</span>
                    ТЕЛО (Somatic &amp; Biology)
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#E2ECD2]/80">
                    {retreat.dimensionBreakdown.body.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mind */}
                <div className="neu-card rounded-2xl p-4 border border-sky-500/30 bg-[#343928] space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px] text-sky-400">psychology</span>
                    РАЗУМ (Cognitive &amp; Focus)
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#E2ECD2]/80">
                    {retreat.dimensionBreakdown.mind.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Soul */}
                <div className="neu-card rounded-2xl p-4 border border-amber-500/30 bg-[#343928] space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px] text-amber-400">wb_sunny</span>
                    ДУША (Spirit &amp; Roots)
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#E2ECD2]/80">
                    {retreat.dimensionBreakdown.soul.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Psyche */}
                <div className="neu-card rounded-2xl p-4 border border-purple-500/30 bg-[#343928] space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px] text-purple-400">auto_stories</span>
                    ПСИХИКА (Psychoanalysis &amp; Depth)
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#E2ECD2]/80">
                    {retreat.dimensionBreakdown.psyche.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs text-[#A9B489] font-mono mb-1">
                Ключевые вехи расписания и смысловые блоки
              </div>
              <div className="space-y-2.5">
                {retreat.scheduleHighlights.map((slot, idx) => {
                  const tagColor = 
                    slot.tag === 'body' ? 'text-emerald-400 border-emerald-500/30' :
                    slot.tag === 'mind' ? 'text-sky-400 border-sky-500/30' :
                    slot.tag === 'soul' ? 'text-amber-400 border-amber-500/30' :
                    slot.tag === 'psyche' ? 'text-purple-400 border-purple-500/30' : 'text-[#BA9470] border-[#BA9470]/30';

                  return (
                    <div key={idx} className="neu-card rounded-xl p-3.5 border border-[#A9B489]/20 bg-[#333626] flex items-start gap-3">
                      <div className="min-w-[90px] text-xs font-mono font-bold text-[#FFCF96]">
                        {slot.timeOrDay}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-[#F0E2C8]">
                            {slot.title}
                          </h4>
                          <span className={`text-[9px] font-mono px-2 py-0.2 rounded-full border ${tagColor}`}>
                            {slot.tag.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[#E2ECD2]/75 mt-1 leading-relaxed">
                          {slot.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {bookingSuccess ? (
                <div className="neu-card rounded-2xl p-6 border-2 border-emerald-500/60 bg-[#2f3826] text-center space-y-3">
                  <span className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[32px] border border-emerald-500/40">
                    check
                  </span>
                  <h3 className="font-headline font-bold text-xl text-[#F0E2C8]">
                    Бронирование зафиксировано!
                  </h3>
                  <div className="text-xs text-[#E2ECD2]/90 max-w-md mx-auto">
                    Ваша заявка на ретрит «{retreat.title}» сохранена в базе. Номер брони: <strong className="font-mono text-emerald-300">{bookingSuccess}</strong>.
                  </div>
                  <div className="text-xs text-[#A9B489]">
                    Координатор свяжется с вами в Telegram/по телефону для подтверждения деталей и предоставления промокода со скидкой 50%.
                  </div>
                  <button
                    onClick={onClose}
                    className="neu-btn px-6 py-2.5 rounded-xl font-bold text-xs text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/40 hover:bg-emerald-700/60 mt-3"
                  >
                    Вернуться к каталогу
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/30 bg-[#323626]">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-[#A9B489]">Базовая стоимость ретрита:</span>
                      <span className="font-mono font-bold text-sm text-[#F0E2C8]">
                        от ${retreat.priceFromUsd} <span className="line-through text-[#A9B489] text-xs">${retreat.regularPriceUsd}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                      {[
                        { id: 'standard', name: 'Стандарт', add: 0, desc: 'Базовый номер' },
                        { id: 'comfort', name: 'Этно-Юрта', add: 25, desc: 'Аутентичный комфорт' },
                        { id: 'premium', name: 'Шале / Коттедж', add: 65, desc: 'Панорамный камин' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedLodgeTier(t.id as any)}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            selectedLodgeTier === t.id
                              ? 'neu-pill-active border-[#BA9470] text-[#F0E2C8]'
                              : 'neu-inset border-[#A9B489]/20 text-[#A9B489]'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#F0E2C8]">{t.name}</div>
                          <div className="text-[10px] text-[#A9B489]">{t.desc}</div>
                          <div className="text-[10px] font-mono text-emerald-400 mt-1">
                            {t.add === 0 ? 'Включено' : `+$${t.add}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        placeholder="Алексей или Елена"
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 focus:border-[#BA9470] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">
                        Телефон или Telegram *
                      </label>
                      <input
                        type="text"
                        required
                        value={guestContact}
                        onChange={e => setGuestContact(e.target.value)}
                        placeholder="+998 ... или @username"
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 focus:border-[#BA9470] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">
                        Количество участников
                      </label>
                      <select
                        value={participantsCount}
                        onChange={e => setParticipantsCount(Number(e.target.value))}
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none"
                      >
                        <option value={1}>1 персона (Solo)</option>
                        <option value={2}>2 персоны (Пара / Друг)</option>
                        <option value={3}>3 персоны</option>
                        <option value={4}>4 персоны (Мини-группа)</option>
                        <option value={8}>8+ персон (Корпоратив)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#F0E2C8] mb-1">
                        Промокод на скидку 50%
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={retreat.promoCode || 'PRE-ETHOS-50'}
                        className="w-full neu-input rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono bg-[#2a2c20] border border-emerald-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#F0E2C8] mb-1">
                      Особые пожелания или состояние (диета, травмы, запрос к ретриту)
                    </label>
                    <textarea
                      rows={2}
                      value={specialWish}
                      onChange={e => setSpecialWish(e.target.value)}
                      placeholder="Например: вегетарианское питание, хочу поработать со страхом высоты..."
                      className="w-full neu-input rounded-xl px-3 py-2 text-xs text-[#F0E2C8] bg-[#2a2c20] border border-[#A9B489]/30 outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/20 flex-wrap gap-3">
                    <div>
                      <div className="text-[10px] text-[#A9B489] uppercase font-mono">Итого к оплате (со скидкой 50%):</div>
                      <div className="font-headline font-bold text-xl text-emerald-300">
                        ${calculateTotal()}{' '}
                        <span className="text-xs font-mono text-[#A9B489] font-normal">
                          (~{(calculateTotal() * 12800).toLocaleString('ru-RU')} сум)
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="neu-btn px-6 py-2.5 rounded-xl font-bold text-xs text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 shadow-lg flex items-center gap-1.5 transition-all"
                    >
                      {isSubmitting ? (
                        <span>Оформление...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          Подтвердить бронь со скидкой
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#313525] border-t border-[#A9B489]/20 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-[#A9B489]">
            Осталось свободных мест: <strong className="text-emerald-400">{retreat.spotsLeft}</strong> из {retreat.spotsTotal}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBookNow(retreat);
              }}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#F0E2C8] border border-[#BA9470]/50 hover:border-[#BA9470]"
            >
              Открыть в конструкторе 24h
            </button>
            <button
              onClick={onClose}
              className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8]"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
