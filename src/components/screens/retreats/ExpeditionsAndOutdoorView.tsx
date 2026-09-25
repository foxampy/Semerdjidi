import React, { useState } from 'react';
import { OUTDOOR_AND_SCIENTIFIC_EXPEDITIONS, OutdoorExpedition } from '../../../data/settlementsAndSpecializedData';
import { authService } from '../../../services/authService';

interface ExpeditionsAndOutdoorViewProps {
  onBackToCatalog: () => void;
}

export const ExpeditionsAndOutdoorView: React.FC<ExpeditionsAndOutdoorViewProps> = ({
  onBackToCatalog
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedExpeditionModal, setSelectedExpeditionModal] = useState<OutdoorExpedition | null>(null);

  // Booking State
  const currentUser = authService.getCurrentUser();
  const [bookerName, setBookerName] = useState(currentUser?.name || '');
  const [bookerContact, setBookerContact] = useState(currentUser?.emailOrTg || '');
  const [partySize, setPartySize] = useState<number>(1);
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingTicket, setBookingTicket] = useState('');

  const filteredExpeditions = selectedType === 'all'
    ? OUTDOOR_AND_SCIENTIFIC_EXPEDITIONS
    : OUTDOOR_AND_SCIENTIFIC_EXPEDITIONS.filter(e => e.type === selectedType);

  const handleBookExpedition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookerName.trim() || !bookerContact.trim() || !selectedExpeditionModal) return;

    setIsSubmitting(true);
    const ticketId = `EXP-${Date.now().toString(36).toUpperCase()}`;

    try {
      await authService.saveApplicationDraft({
        draftId: ticketId,
        type: 'general',
        name: bookerName.trim(),
        contact: bookerContact.trim(),
        format: 'group',
        details: `Экспедиция/Активность: ${selectedExpeditionModal.title}. Участников: ${partySize}. Дата: ${preferredDate || selectedExpeditionModal.nextDates[0]}`,
        selectedModules: [selectedExpeditionModal.id, selectedExpeditionModal.type],
        questionnaire: {
          mainIntention: `Участие в экспедиции ${selectedExpeditionModal.typeLabel}`,
          experienceLevel: `Сложность: ${selectedExpeditionModal.difficultyLabel}`,
          specialRequests: `Размер группы: ${partySize} чел`
        },
        step: 'completed',
        totalBudgetUsd: selectedExpeditionModal.priceUsd * partySize
      });

      setBookingTicket(ticketId);
      setIsBooked(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/50 bg-gradient-to-br from-[#3b412e] via-[#343826] to-[#2c3020] relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFCF96] font-bold px-3 py-1 rounded-full neu-inset border border-[#BA9470]/40 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400">explore</span>
              Горные, Водные &amp; Научные Экспедиции
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Институты РУз • РБ • Израиля
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
          Экскурсии, Конные Тропы, Водные Практики &amp; Наука
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/90 mt-2.5 max-w-3xl leading-relaxed">
          Уникальные природные активности в горах и на воде с исследовательскими протоколами. В партнерстве с Академией Наук Узбекистана, Национальной академией наук Беларуси и институтами Израиля (Weizmann Institute, Wingate Institute, Hadassah).
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-5 mt-4 border-t border-[#A9B489]/20">
          {[
            { id: 'all', label: 'Все активности (5)', icon: 'apps' },
            { id: 'horse_riding', label: '🐎 Конные походы на карабаирах', icon: 'pets' },
            { id: 'water_sports', label: '🏄 Чарвак SUP & Водные практики', icon: 'water' },
            { id: 'science_expedition', label: '🔬 Археология & Фито-ботаника', icon: 'biotech' },
            { id: 'astronomy_night', label: '🔭 Майданак: Астро-ночь на 2750м', icon: 'telescope' }
          ].map(flt => (
            <button
              key={flt.id}
              onClick={() => setSelectedType(flt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === flt.id
                  ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]'
                  : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{flt.icon}</span>
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* PARTNER INSTITUTES STRIP */}
      <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 bg-[#343826] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#BA9470]">school</span>
          <span className="text-xs font-bold text-[#F0E2C8]">Академический исследовательский консорциум:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-[#A9B489]">
          <span className="flex items-center gap-1 font-mono text-emerald-400">
            <span>🇺🇿</span> АН Узбекистана (Ботаника, Археология, Астрономия)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono text-cyan-400">
            <span>🇧🇾</span> НАН Беларуси (Физиология, Бальнеология)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono text-amber-300">
            <span>🇮🇱</span> Weizmann, Wingate &amp; Hadassah
          </span>
        </div>
      </div>

      {/* EXPEDITIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExpeditions.map(exp => (
          <div
            key={exp.id}
            className="neu-card rounded-3xl p-5 sm:p-6 border border-[#A9B489]/20 bg-[#353928] hover:border-[#BA9470]/50 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold px-2.5 py-0.5 rounded-full neu-inset border border-emerald-500/30">
                    {exp.typeLabel}
                  </span>
                  <h3 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8] mt-1.5">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#A9B489] mt-0.5">
                    <span className="material-symbols-outlined text-[15px] text-[#BA9470]">pin_drop</span>
                    <span>{exp.location}</span>
                    {exp.altitudeMeters && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-[#FFCF96]">{exp.altitudeMeters} м</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-[#A9B489]">Стоимость</div>
                  <div className="text-xl font-mono font-bold text-emerald-400">
                    ${exp.priceUsd}
                  </div>
                  <div className="text-[10px] text-[#A9B489]">за человека</div>
                </div>
              </div>

              <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
                {exp.description}
              </p>

              {/* Scientific Protocol Banner */}
              <div className="p-3 rounded-2xl neu-inset bg-[#2d3121] border border-cyan-500/20 text-xs text-[#E2ECD2]/85 space-y-1">
                <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">biotech</span>
                  Научный протокол &amp; замеры:
                </div>
                <p className="text-[11px] text-[#A9B489] leading-tight">
                  {exp.researchProtocol}
                </p>
              </div>

              {/* Partners tags */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono uppercase text-[#A9B489]">Институты-партнеры:</div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.scientificPartners.map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-lg neu-inset bg-[#2a2e1e] text-[#FFCF96] border border-[#A9B489]/20"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upcoming dates */}
              <div className="text-xs text-[#E2ECD2]/80 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#BA9470]">calendar_month</span>
                <span><strong>Ближайшие выезды:</strong> {exp.nextDates[0]}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#A9B489]/15">
              <button
                onClick={() => {
                  setSelectedExpeditionModal(exp);
                  setPreferredDate(exp.nextDates[0]);
                  setIsBooked(false);
                }}
                className="w-full neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                Записаться на экспедицию (${exp.priceUsd})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedExpeditionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card rounded-3xl p-6 border border-[#BA9470] bg-[#353928] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  {selectedExpeditionModal.typeLabel}
                </span>
                <h3 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8] mt-0.5">
                  {selectedExpeditionModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExpeditionModal(null)}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {isBooked ? (
              <div className="p-6 rounded-2xl neu-inset bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                <span className="material-symbols-outlined text-emerald-400 text-[36px]">done_all</span>
                <h4 className="font-headline font-bold text-base text-[#F0E2C8]">
                  Билет на экспедицию #{bookingTicket} оформлен
                </h4>
                <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
                  Гид-инструктор свяжется с вами за сутки до выезда для уточнения трансфера, подбора снаряжения и памятки по экипировке.
                </p>
                <button
                  onClick={() => setSelectedExpeditionModal(null)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]"
                >
                  Вернуться к списку
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookExpedition} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl neu-inset bg-[#2d3121] text-xs">
                  <div>
                    <div className="text-[10px] text-[#A9B489]">Сложность</div>
                    <div className="font-bold text-[#F0E2C8]">{selectedExpeditionModal.difficultyLabel}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#A9B489]">Длительность</div>
                    <div className="font-bold text-[#FFCF96]">{selectedExpeditionModal.duration}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">Ваше Имя:</label>
                    <input
                      type="text"
                      required
                      value={bookerName}
                      onChange={(e) => setBookerName(e.target.value)}
                      placeholder="Тимур Саматов"
                      className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">Телефон / Telegram:</label>
                    <input
                      type="text"
                      required
                      value={bookerContact}
                      onChange={(e) => setBookerContact(e.target.value)}
                      placeholder="+998 90 123-45-67"
                      className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">Количество человек:</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedExpeditionModal.maxGroupSize}
                      value={partySize}
                      onChange={(e) => setPartySize(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F0E2C8]">Желаемая дата:</label>
                    <select
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                    >
                      {selectedExpeditionModal.nextDates.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/20">
                  <div>
                    <div className="text-[10px] text-[#A9B489]">К оплате ({partySize} чел):</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      ${selectedExpeditionModal.priceUsd * partySize}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60"
                  >
                    {isSubmitting ? 'Бронирование...' : 'Подтвердить бронирование'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
