import React, { useState } from 'react';
import { SPECIALIZED_PROGRAMS, SpecializedProgram, ProgramPhase } from '../../../data/settlementsAndSpecializedData';
import { authService } from '../../../services/authService';

interface SpecializedTherapyProgramsViewProps {
  onBackToCatalog: () => void;
  onOpenConsultation?: (programTitle: string) => void;
}

export const SpecializedTherapyProgramsView: React.FC<SpecializedTherapyProgramsViewProps> = ({
  onBackToCatalog
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('family_separation_reunion');
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(1);
  
  // Registration Form State
  const currentUser = authService.getCurrentUser();
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantContact, setApplicantContact] = useState(currentUser?.emailOrTg || '');
  const [participantCount, setParticipantCount] = useState<string>('2 человека (пара / родитель + ребенок)');
  const [situationDescription, setSituationDescription] = useState('');
  const [isApplyingGrant, setIsApplyingGrant] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationCode, setApplicationCode] = useState('');

  const activeProgram = SPECIALIZED_PROGRAMS.find(p => p.id === selectedProgramId) || SPECIALIZED_PROGRAMS[0];
  const activePhase = activeProgram.phases.find(ph => ph.phaseNumber === selectedPhaseNumber) || activeProgram.phases[0];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantContact.trim()) return;

    setIsSubmitting(true);
    const code = `SPEC-${Date.now().toString(36).toUpperCase()}`;

    try {
      await authService.saveApplicationDraft({
        draftId: code,
        type: 'general',
        name: applicantName.trim(),
        contact: applicantContact.trim(),
        format: 'group',
        details: `Специализированная программа: ${activeProgram.title}. Состав: ${participantCount}. Запрос: ${situationDescription || '—'}`,
        selectedModules: [activeProgram.id, isApplyingGrant ? 'with_grant' : 'full_price'],
        questionnaire: {
          mainIntention: situationDescription || 'Глубинная трансформация и решение кризиса',
          experienceLevel: `Программа: ${activeProgram.categoryLabel}`,
          specialRequests: `Участники: ${participantCount}, Грант: ${isApplyingGrant ? 'Да' : 'Нет'}`
        },
        step: 'completed',
        totalBudgetUsd: isApplyingGrant
          ? Math.round(activeProgram.priceUsd * (1 - activeProgram.grantCoveragePercent / 100))
          : activeProgram.priceUsd,
        promoCode: isApplyingGrant ? 'ETHOS-SPEC-GRANT' : undefined
      });

      setApplicationCode(code);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/50 bg-gradient-to-br from-[#3c412f] via-[#353927] to-[#2c3021] relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFCF96] font-bold px-3 py-1 rounded-full neu-inset border border-[#BA9470]/40 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-400">psychology_alt</span>
              Глубинные Психотерапевтические &amp; Социальные Программы
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Поддержка 6 месяцев
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
          Специализированные Программы: Семья, Нейронетипичность &amp; Зависимости
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/90 mt-2.5 max-w-3xl leading-relaxed">
          Научно обоснованные протоколы для преодоления глубоких жизненных кризисов: двухнедельные горные заезды (фаза бережного разделения + фаза осознанного соединения) с последующим 6-месячным клубно-семейным сопровождением раз в месяц.
        </p>

        {/* Program Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-5 mt-4 border-t border-[#A9B489]/20">
          {SPECIALIZED_PROGRAMS.map(prog => {
            const isSel = prog.id === selectedProgramId;
            return (
              <button
                key={prog.id}
                onClick={() => {
                  setSelectedProgramId(prog.id);
                  setSelectedPhaseNumber(1);
                  setIsSubmitted(false);
                }}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSel
                    ? 'neu-pill-active text-[#F0E2C8] border-[#BA9470] bg-[#BA9470]/15 shadow-md'
                    : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8] border-[#A9B489]/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isSel ? 'text-[#FFCF96] font-bold' : 'text-[#A9B489]'}>
                      {prog.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight line-clamp-2">
                    {prog.categoryLabel}
                  </div>
                </div>

                <div className="text-[10px] text-[#A9B489] mt-2 truncate">
                  {prog.duration.split('+')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE PROGRAM DETAILS */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/40 bg-[#353928] space-y-6 shadow-xl">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFCF96] font-bold px-2.5 py-0.5 rounded-full neu-inset border border-[#BA9470]/40">
              {activeProgram.categoryLabel}
            </span>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-1">
              {activeProgram.title}
            </h2>
            <p className="text-xs text-[#A9B489] leading-relaxed">
              {activeProgram.subtitle}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#A9B489]">Стоимость участия</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ${activeProgram.priceUsd.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Грант до {activeProgram.grantCoveragePercent}%
            </span>
          </div>
        </div>

        {/* 3-Phases Step Navigation */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-[#A9B489] font-bold">
            Этапы программы (Формула: Разделение → Соединение → Полгода Интеграции):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeProgram.phases.map(ph => {
              const isPhaseActive = ph.phaseNumber === selectedPhaseNumber;
              return (
                <button
                  key={ph.phaseNumber}
                  onClick={() => setSelectedPhaseNumber(ph.phaseNumber)}
                  className={`p-4 rounded-2xl text-left border transition-all space-y-2 ${
                    isPhaseActive
                      ? 'neu-pill-active border-emerald-500/50 bg-[#313624] text-[#F0E2C8] shadow-lg'
                      : 'neu-btn border-[#A9B489]/20 text-[#A9B489] hover:text-[#F0E2C8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-full neu-inset">
                      Фаза {ph.phaseNumber}
                    </span>
                    <span className="text-xs font-bold text-[#FFCF96]">{ph.duration}</span>
                  </div>

                  <h4 className="text-xs font-bold text-[#F0E2C8] leading-tight">
                    {ph.title}
                  </h4>

                  <p className="text-[11px] text-[#E2ECD2]/75 line-clamp-2">
                    {ph.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE PHASE DETAILED BREAKDOWN */}
        <div className="neu-card p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-[#303423] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                Детальный план: Фаза {activePhase.phaseNumber} • {activePhase.duration}
              </span>
              <h3 className="font-headline font-bold text-lg text-[#F0E2C8] mt-0.5">
                {activePhase.title}
              </h3>
            </div>

            <div className="text-xs text-[#FFCF96] flex items-center gap-1.5 bg-[#2d3120] px-3 py-1.5 rounded-xl border border-[#A9B489]/20">
              <span className="material-symbols-outlined text-[15px] text-[#BA9470]">pin_drop</span>
              <span>{activePhase.setting}</span>
            </div>
          </div>

          <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
            <strong>Фокус фазы:</strong> {activePhase.focus}
          </p>

          <div className="space-y-2 pt-2 border-t border-[#A9B489]/15">
            <div className="text-xs font-bold text-[#F0E2C8]">Ключевые практики и методики:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activePhase.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl neu-inset bg-[#2a2e1d] text-xs text-[#E2ECD2]/85">
                  <span className="material-symbols-outlined text-[15px] text-emerald-400 shrink-0 mt-0.5">check_circle</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METHODOLOGY, PARTNERS & HOSTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Methodology */}
          <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-2">
            <div className="text-xs font-bold text-[#FFCF96] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-400">psychology</span>
              Научная Методология
            </div>
            <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
              {activeProgram.methodology}
            </p>
            <div className="text-[11px] text-[#A9B489] pt-1">
              <strong>Аудитория:</strong> {activeProgram.targetAudience}
            </div>
          </div>

          {/* Partner Institutes */}
          <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-2">
            <div className="text-xs font-bold text-[#FFCF96] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-cyan-400">account_balance</span>
              Партнерские Институты
            </div>
            <ul className="space-y-1.5 text-xs text-[#E2ECD2]/80">
              {activeProgram.partnerInstitutes.map((inst, i) => (
                <li key={i} className="border-b border-[#A9B489]/10 pb-1 last:border-none">
                  <div className="font-bold text-[#F0E2C8]">{inst.name} <span className="text-[10px] text-[#A9B489]">({inst.country})</span></div>
                  <div className="text-[10px] text-[#A9B489]">{inst.role}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow-up & Outcomes */}
          <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 bg-[#343827] space-y-2">
            <div className="text-xs font-bold text-[#FFCF96] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
              Результаты &amp; 6 Месяцев
            </div>
            <div className="text-[11px] text-emerald-400 font-bold">
              {activeProgram.supervisionFollowUp}
            </div>
            <ul className="space-y-1 text-xs text-[#E2ECD2]/80">
              {activeProgram.keyOutcomes.slice(0, 3).map((out, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px] text-emerald-400">check</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div className="neu-card rounded-2xl p-5 sm:p-6 border border-[#BA9470]/50 bg-[#323624] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Конфиденциальная Заявка
              </span>
              <h3 className="font-headline font-bold text-lg text-[#F0E2C8]">
                Записаться на программу: {activeProgram.categoryLabel}
              </h3>
            </div>
            <span className="text-xs font-mono text-[#FFCF96]">
              Ближайшие даты: {activeProgram.dates}
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl neu-inset bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3 animate-in zoom-in-95">
              <span className="material-symbols-outlined text-emerald-400 text-[36px]">verified</span>
              <h4 className="font-headline font-bold text-base text-[#F0E2C8]">
                Заявка #{applicationCode} принята на рассмотрение
              </h4>
              <p className="text-xs text-[#E2ECD2]/90 leading-relaxed max-w-lg mx-auto">
                Координатор терапевтических программ свяжется с вами по указанным контактам для проведения конфиденциального пре-скрининга с психологом и подтверждения гранта.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]"
              >
                Подать еще одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">ФИО контактного лица:</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Тимур Саматов"
                    className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Телефон / Telegram:</label>
                  <input
                    type="text"
                    required
                    value={applicantContact}
                    onChange={(e) => setApplicantContact(e.target.value)}
                    placeholder="+998 90 123-45-67 или @username"
                    className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F0E2C8]">Состав участников:</label>
                  <select
                    value={participantCount}
                    onChange={(e) => setParticipantCount(e.target.value)}
                    className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl px-3 py-2 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                  >
                    <option value="2 человека (пара / супруги)">2 человека (семейная пара)</option>
                    <option value="Родитель + ребенок (нейронетипичный)">Родитель + 1 ребенок (нейронетипичный)</option>
                    <option value="Оба родителя + ребенок">Оба родителя + ребенок</option>
                    <option value="Зависимый + близкий родственник">Зависимый + созависимый близкий</option>
                    <option value="Команда / Корпоративная группа (4-12 чел)">Команда / Корпоративная группа (4–12 чел)</option>
                  </select>
                </div>

                <div className="space-y-1 flex flex-col justify-end">
                  <label className="text-xs font-bold text-[#F0E2C8] flex items-center gap-2 cursor-pointer p-2 rounded-xl neu-inset bg-[#2a2e1d]">
                    <input
                      type="checkbox"
                      checked={isApplyingGrant}
                      onChange={(e) => setIsApplyingGrant(e.target.checked)}
                      className="accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-[#E2ECD2]">
                      Запросить субсидию фонда (скидка до {activeProgram.grantCoveragePercent}%)
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#F0E2C8]">Краткое описание текущей ситуации / запроса:</label>
                <textarea
                  rows={3}
                  value={situationDescription}
                  onChange={(e) => setSituationDescription(e.target.value)}
                  placeholder="Опишите в 2-3 предложениях, с чем вы сталкиваетесь (конфликт, выгорание опеки, зависимость, потеря контакта)... Все строго конфиденциально."
                  className="w-full bg-[#2a2e1d] border border-[#A9B489]/30 rounded-xl p-3 text-xs text-[#F0E2C8] outline-none focus:border-[#BA9470]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#A9B489]">
                  Итоговая стоимость с грантом:{' '}
                  <strong className="text-emerald-400 font-mono text-sm">
                    ${isApplyingGrant
                      ? Math.round(activeProgram.priceUsd * (1 - activeProgram.grantCoveragePercent / 100)).toLocaleString()
                      : activeProgram.priceUsd.toLocaleString()}
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-emerald-700/40 border border-emerald-500/50 hover:bg-emerald-700/60 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Регистрация...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>Забронировать место на заезд</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
