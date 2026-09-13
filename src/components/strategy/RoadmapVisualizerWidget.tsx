import React, { useState } from 'react';
import {
  ROADMAP_PHASES,
  ROADMAP_MILESTONES,
  RoadmapPhase,
  RoadmapMilestone
} from '../../data/strategyRoadmapData';
import { StrategyModalContent } from './StrategyDetailModal';

interface RoadmapVisualizerWidgetProps {
  onOpenModal: (content: StrategyModalContent) => void;
}

export const RoadmapVisualizerWidget: React.FC<RoadmapVisualizerWidgetProps> = ({
  onOpenModal
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMilestones = ROADMAP_MILESTONES.filter((ms) => {
    if (selectedPhaseId !== 'all' && ms.phaseId !== selectedPhaseId) return false;
    if (selectedCategory !== 'all' && ms.category !== selectedCategory) return false;
    return true;
  });

  const totalBudget = ROADMAP_MILESTONES.reduce((acc, m) => acc + m.budgetUsd, 0);
  const completedCount = ROADMAP_MILESTONES.filter(m => m.status === 'done').length;
  const inProgressCount = ROADMAP_MILESTONES.filter(m => m.status === 'in_progress').length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header & Summary Stats */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/30 bg-[#363a28]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#BA9470]">timeline</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                Стратегическая Дорожная Карта
              </span>
            </div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-1 leading-tight">
              Дорожная Карта EthOSium 2026 – 2030
            </h2>
            <p className="text-xs text-[#A9B489] mt-1 max-w-2xl font-light">
              Поэтапный переход от пилотного горного ретрита в Чимгане (18–20 сентября 2026) к созданию постоянного круглогодичного кампуса и международной сети резиденций.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono text-xs">
            <div className="neu-inset px-3 py-2 rounded-xl text-center">
              <span className="text-[9px] text-[#A9B489] uppercase block">Горизонт</span>
              <span className="font-bold text-[#FFFDF8]">5 Лет</span>
            </div>
            <div className="neu-inset px-3 py-2 rounded-xl text-center">
              <span className="text-[9px] text-[#A9B489] uppercase block">В работе</span>
              <span className="font-bold text-amber-400">{inProgressCount} вехи</span>
            </div>
            <div className="neu-inset px-3 py-2 rounded-xl text-center">
              <span className="text-[9px] text-[#A9B489] uppercase block">Бюджет вех</span>
              <span className="font-bold text-emerald-400">${(totalBudget / 1000).toFixed(0)}k+</span>
            </div>
          </div>
        </div>

        {/* 4 Phases Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-[#A9B489]/15">
          {ROADMAP_PHASES.map((phase) => {
            const isSelected = selectedPhaseId === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(isSelected ? 'all' : phase.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 relative ${
                  isSelected
                    ? 'neu-pill-active border-[#BA9470]/70 shadow-lg'
                    : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#BA9470]">
                    Фаза {phase.number}
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    phase.status === 'active'
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                      : phase.status === 'upcoming'
                        ? 'text-amber-400 bg-amber-950/40 border border-amber-500/20'
                        : 'text-[#A9B489] bg-[#2a2d1e]'
                  }`}>
                    {phase.status === 'active' ? 'Сейчас' : phase.status === 'upcoming' ? '2027-28' : '2029+'}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-xs sm:text-sm text-[#F0E2C8] leading-tight">
                    {phase.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#A9B489] block mt-0.5">
                    {phase.period}
                  </span>
                </div>

                <p className="text-[11px] text-[#E2ECD2]/80 line-clamp-2 font-light leading-snug">
                  {phase.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Milestones Stream */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 neu-card rounded-2xl p-3.5 border border-[#A9B489]/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F0E2C8]">
              Фильтр по направлению:
            </span>
            {selectedPhaseId !== 'all' && (
              <button
                onClick={() => setSelectedPhaseId('all')}
                className="text-[11px] text-[#BA9470] hover:underline font-mono"
              >
                (Сбросить фильтр фаз)
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'Все направления' },
              { id: 'offline', label: 'Горы & Офлайн' },
              { id: 'tech', label: 'Deep Tech & AI' },
              { id: 'institute', label: 'Институт & Врачи' },
              { id: 'business', label: 'B2B & Бизнес' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#BA9470]/30 text-[#FFFDF8] border border-[#BA9470]/60'
                    : 'neu-inset text-[#A9B489] hover:text-[#F0E2C8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestones Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredMilestones.map((ms) => {
            return (
              <div
                key={ms.id}
                onClick={() => onOpenModal({ type: 'milestone', data: ms })}
                className="neu-card rounded-2xl p-4 sm:p-5 border border-[#A9B489]/20 hover:border-[#BA9470]/60 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between gap-3 group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-md border border-[#BA9470]/30">
                      {ms.quarter}
                    </span>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ms.status === 'done'
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : ms.status === 'in_progress'
                          ? 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                          : 'text-[#A9B489] bg-[#2a2d1e]'
                    }`}>
                      {ms.status === 'done' ? 'Выполнено' : ms.status === 'in_progress' ? `${ms.progressPercent}% готово` : 'В плане'}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-sm sm:text-base text-[#F0E2C8] leading-snug group-hover:text-[#FFFDF8]">
                    {ms.title}
                  </h3>

                  <p className="text-xs text-[#E2ECD2]/80 mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {ms.summary}
                  </p>

                  {/* Progress Line */}
                  <div className="w-full bg-[#282a1d] h-1.5 rounded-full overflow-hidden mt-3 border border-[#A9B489]/15">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ms.status === 'done'
                          ? 'bg-emerald-400'
                          : ms.status === 'in_progress'
                            ? 'bg-amber-400'
                            : 'bg-[#A9B489]/40'
                      }`}
                      style={{ width: `${ms.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-[#A9B489]/15 pt-2.5 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#A9B489] text-[11px]">
                    Бюджет: <strong className="text-[#FFFDF8]">${ms.budgetUsd.toLocaleString()}</strong>
                  </span>
                  <span className="text-[#BA9470] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                    Подробнее
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
