import React from 'react';
import { ArchitectureNode, RoadmapMilestone, InvestmentRound, InvestorTier } from '../../data/strategyRoadmapData';
import { ActiveScreen } from '../../semerdzhidiTypes';

export type StrategyModalContent = 
  | { type: 'node'; data: ArchitectureNode }
  | { type: 'milestone'; data: RoadmapMilestone }
  | { type: 'round'; data: InvestmentRound }
  | { type: 'tier'; data: InvestorTier }
  | { type: 'invest_contact'; title: string; subtitle: string; initialTicket?: number }
  | null;

interface StrategyDetailModalProps {
  content: StrategyModalContent;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({
  content,
  onClose,
  onNavigate
}) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#363a29] border border-[#BA9470]/50 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto no-scrollbar flex flex-col gap-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Bar */}
        <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BA9470] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
              {content.type === 'node' && 'Архитектурный Узел Системы'}
              {content.type === 'milestone' && 'Веха Дорожной Карты EthOSium'}
              {content.type === 'round' && 'Инвестиционный Раунд & Капитал'}
              {content.type === 'tier' && 'Инвесторский Тир & Аллокация'}
              {content.type === 'invest_contact' && 'Инвестиционный Запрос'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#FFFDF8] transition-all"
            aria-label="Закрыть"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ---------------- TYPE 1: ARCHITECTURE NODE ---------------- */}
        {content.type === 'node' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div 
                className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center shrink-0"
                style={{ color: content.data.color }}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {content.data.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-[#BA9470] font-bold bg-[#2d3020] px-2 py-0.5 rounded">
                    {content.data.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    {content.data.securityLevel}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-1 leading-tight">
                  {content.data.title}
                </h3>
                <p className="text-xs text-[#A9B489] font-mono mt-0.5">
                  {content.data.englishTitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="neu-inset p-4 rounded-2xl border border-[#A9B489]/15">
              <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed font-light">
                {content.data.fullDesc}
              </p>
            </div>

            {/* Technical Specs */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
                Технический Стек &amp; Спецификации:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {content.data.technicalSpecs.map((spec, i) => (
                  <div key={i} className="neu-card p-2.5 rounded-xl border border-[#A9B489]/20 text-xs text-[#E2ECD2]/85 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#BA9470] shrink-0 mt-0.5">
                      memory
                    </span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Flow: In / Out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="neu-inset p-3.5 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#818cf8] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">input</span>
                  Входные потоки (Inputs):
                </span>
                <ul className="space-y-1">
                  {content.data.dataFlowInputs.map((inp, idx) => (
                    <li key={idx} className="text-xs text-[#E2ECD2]/80 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#818cf8]" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="neu-inset p-3.5 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">output</span>
                  Выходные эффекты (Outputs):
                </span>
                <ul className="space-y-1">
                  {content.data.dataFlowOutputs.map((out, idx) => (
                    <li key={idx} className="text-xs text-[#E2ECD2]/80 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* KPIs & Responsible Team */}
            <div className="neu-card p-3.5 rounded-xl border border-[#A9B489]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A9B489] block">Ответственная команда:</span>
                <span className="font-semibold text-[#F0E2C8]">{content.data.responsibleLead}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A9B489] block">Ключевые метрики (KPIs):</span>
                <span className="font-mono text-emerald-400 font-bold">{content.data.kpis.join(' • ')}</span>
              </div>
            </div>

            {/* Action Bridge */}
            {content.data.linkedScreen && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate(content.data.linkedScreen as ActiveScreen);
                  }}
                  className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/60 hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  Открыть работающий модуль в приложении
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TYPE 2: ROADMAP MILESTONE ---------------- */}
        {content.type === 'milestone' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-md border border-[#BA9470]/30">
                  {content.data.quarter}
                </span>
                <span className="text-xs font-mono text-[#A9B489] uppercase">
                  Категория: {content.data.category}
                </span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                content.data.status === 'done'
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                  : content.data.status === 'in_progress'
                    ? 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                    : 'text-[#A9B489] bg-[#2a2d1e]'
              }`}>
                {content.data.status === 'done' ? 'Завершено (100%)' : content.data.status === 'in_progress' ? `В работе (${content.data.progressPercent}%)` : 'Запланировано'}
              </span>
            </div>

            <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] leading-tight">
              {content.data.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed font-light">
              {content.data.summary}
            </p>

            {/* Deliverables Checklist */}
            <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
                Конкретные Результаты &amp; Deliverables:
              </span>
              <ul className="space-y-1.5">
                {content.data.deliverables.map((d, i) => (
                  <li key={i} className="text-xs text-[#FFFDF8] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400 mt-0.5 shrink-0">
                      check_circle
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Budget & KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="neu-inset p-3 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-[#A9B489] block">Бюджет вехи:</span>
                <span className="font-mono font-bold text-base text-[#BA9470]">
                  ${content.data.budgetUsd.toLocaleString()} USD
                </span>
              </div>
              <div className="neu-inset p-3 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-[#A9B489] block">Зависимости:</span>
                <span className="text-[#FFFDF8] text-[11px]">{content.data.dependencies.join(' • ')}</span>
              </div>
            </div>

            {/* Risk Mitigation */}
            <div className="neu-inset p-3.5 rounded-xl border border-rose-500/20 bg-[#352e27]">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">shield</span>
                Управление рисками &amp; Резервный план:
              </span>
              <p className="text-xs text-[#E2ECD2]/85 mt-1">
                {content.data.riskMitigation}
              </p>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 3: INVESTMENT ROUND ---------------- */}
        {content.type === 'round' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-md border border-[#BA9470]/30">
                {content.data.timeline}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                content.data.status === 'completed'
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                  : content.data.status === 'open'
                    ? 'text-amber-400 bg-amber-950/60 border border-amber-500/30 animate-pulse'
                    : 'text-sky-400 bg-sky-950/60 border border-sky-500/30'
              }`}>
                {content.data.status === 'completed' ? 'Закрыт' : content.data.status === 'open' ? 'Идет активный сбор (Открыт)' : 'Проектируемый раунд'}
              </span>
            </div>

            <div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8]">
                {content.data.name}
              </h3>
              <p className="text-xs text-[#A9B489] font-mono mt-0.5">
                Инструмент: {content.data.instrument}
              </p>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="neu-inset p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-[#A9B489] uppercase block">Цель раунда</span>
                <span className="font-mono font-bold text-sm text-[#FFFDF8]">${content.data.targetAmountUsd.toLocaleString()}</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-[#A9B489] uppercase block">Собрано</span>
                <span className="font-mono font-bold text-sm text-emerald-400">${content.data.raisedAmountUsd.toLocaleString()}</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-[#A9B489] uppercase block">Pre-Money</span>
                <span className="font-mono font-bold text-sm text-[#BA9470]">${content.data.valuationPreUsd.toLocaleString()}</span>
              </div>
              <div className="neu-inset p-2.5 rounded-xl">
                <span className="text-[9px] font-mono text-[#A9B489] uppercase block">Мин. чек</span>
                <span className="font-mono font-bold text-sm text-[#FFFDF8]">${content.data.minTicketUsd.toLocaleString()}</span>
              </div>
            </div>

            {/* Use of Funds Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
                Аллокация Привлеченных Средств (Use of Funds):
              </span>
              <div className="space-y-1.5">
                {content.data.keyUseOfFunds.map((u, i) => (
                  <div key={i} className="neu-card p-2.5 rounded-xl border border-[#A9B489]/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#BA9470]" />
                      <span className="text-[#FFFDF8]">{u.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-400 font-bold">${u.amountUsd.toLocaleString()}</span>
                      <span className="text-[11px] text-[#A9B489]">({u.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Unlocks */}
            <div className="neu-inset p-3.5 rounded-xl space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                Стратегические Разблокировки (Strategic Milestones):
              </span>
              <ul className="space-y-1">
                {content.data.strategicUnlocks.map((s, idx) => (
                  <li key={idx} className="text-xs text-[#E2ECD2]/85 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">trending_up</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 4: INVESTOR TIER ---------------- */}
        {content.type === 'tier' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-md border border-[#BA9470]/30">
                Инвесторский Пакет
              </span>
              <span className="font-mono text-base font-bold text-emerald-400">
                Чек от ${content.data.ticketUsd.toLocaleString()} USD
              </span>
            </div>

            <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8]">
              {content.data.name}
            </h3>

            <div className="neu-inset p-3 rounded-xl text-xs font-mono text-[#BA9470]">
              Доля / Токены: <strong>{content.data.equityTokensPct}</strong>
            </div>

            <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
                Эксклюзивные Привилегии Резидента-Инвестора:
              </span>
              <ul className="space-y-2">
                {content.data.perks.map((p, idx) => (
                  <li key={idx} className="text-xs text-[#FFFDF8] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400 mt-0.5 shrink-0">
                      star
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="neu-inset p-3 rounded-xl text-xs">
              <span className="text-[10px] font-mono text-[#A9B489] uppercase block">Участие в управлении:</span>
              <span className="text-[#FFFDF8] font-semibold">{content.data.governanceRole}</span>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 5: INVESTOR CONTACT / TICKET RESERVATION ---------------- */}
        {content.type === 'invest_contact' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-headline font-bold text-xl text-[#F0E2C8]">
                {content.title}
              </h3>
              <p className="text-xs text-[#A9B489] mt-1">
                {content.subtitle}
              </p>
            </div>

            <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-[#A9B489] block mb-1">
                  Предполагаемый чек инвестиций:
                </label>
                <div className="font-mono font-bold text-lg text-emerald-400 neu-inset p-2.5 rounded-xl border border-emerald-500/20">
                  ${(content.initialTicket || 25000).toLocaleString()} USD
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-[#A9B489] block mb-1">
                  Прямой контакт для связи:
                </label>
                <div className="text-xs text-[#FFFDF8] space-y-1 neu-inset p-3 rounded-xl font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A9B489]">Telegram Синдиката:</span>
                    <a href="https://t.me/semerdzhidi" target="_blank" rel="noreferrer" className="text-[#BA9470] hover:underline">
                      @semerdzhidi_syndicate
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A9B489]">Email партнерства:</span>
                    <span className="text-[#BA9470]">invest@ethosium.io</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#A9B489] leading-relaxed">
                Документы (Pitch Deck, SAFE Agreement, Финансовая Модель 2026–2030) высылаются после подтверждения аккредитованного статуса инвестора в течение 24 часов.
              </p>
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <a
                href="https://t.me/semerdzhidi"
                target="_blank"
                rel="noreferrer"
                className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470]/60 hover:bg-[#BA9470]/50 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Написать в Telegram Фаундерам
              </a>
            </div>
          </div>
        )}

        {/* Global Bottom Modal Footer */}
        <div className="border-t border-[#A9B489]/15 pt-3 flex items-center justify-between text-[11px] text-[#A9B489] font-mono">
          <span>EthOSium Architecture &amp; Strategy Core</span>
          <button
            onClick={onClose}
            className="neu-btn px-3 py-1 rounded-lg text-xs hover:text-[#FFFDF8]"
          >
            Закрыть окно
          </button>
        </div>
      </div>
    </div>
  );
};
