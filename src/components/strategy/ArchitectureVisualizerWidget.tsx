import React, { useState } from 'react';
import { ARCHITECTURE_NODES, ArchitectureNode, STRATEGY_FLYWHEEL_STEPS, FlywheelStage } from '../../data/strategyRoadmapData';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { StrategyModalContent } from './StrategyDetailModal';

// Generated architectural schema image
import architectureImage from '../../assets/images/ethosium_architecture_roadmap_1789034254388.jpg';

interface ArchitectureVisualizerWidgetProps {
  onOpenModal: (content: StrategyModalContent) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const ArchitectureVisualizerWidget: React.FC<ArchitectureVisualizerWidgetProps> = ({
  onOpenModal,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFlywheelStep, setActiveFlywheelStep] = useState<number>(1);
  const [showImageZoom, setShowImageZoom] = useState<boolean>(false);

  const filteredNodes = ARCHITECTURE_NODES.filter((node) => {
    if (selectedCategory !== 'all' && node.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      node.title.toLowerCase().includes(q) ||
      node.englishTitle.toLowerCase().includes(q) ||
      node.shortDesc.toLowerCase().includes(q) ||
      node.badge.toLowerCase().includes(q)
    );
  });

  const currentFlywheel = STRATEGY_FLYWHEEL_STEPS.find(s => s.step === activeFlywheelStep) || STRATEGY_FLYWHEEL_STEPS[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Visual Architectural Blueprint Banner */}
      <div className="neu-card rounded-3xl p-4 sm:p-6 border border-[#BA9470]/30 bg-[#363a28] overflow-hidden relative">
        <div className="flex flex-col lg:flex-row items-center gap-5">
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#BA9470]">schema</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                Сквозная Архитектура Системы
              </span>
            </div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] leading-tight">
              EthOSium: От Local-First Криптографии до Высокогорного Кампуса
            </h2>
            <p className="text-xs sm:text-sm text-[#E2ECD2]/85 leading-relaxed font-light">
              Архитектурный каркас объединяет цифровое суверенное ядро (PPG, замеры, шифрование без утечек) с материальной средой Института Семерджиди, горной базы Чимгана и спешелти кофейни в единый самовоспроизводящийся цикл здоровья.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                onClick={() => setShowImageZoom(true)}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/40 flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                Схема высокого разрешения
              </button>
              <button
                onClick={() => onNavigate('whitepaper')}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#FFFDF8] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Белая Книга (Whitepaper 3.0)
              </button>
            </div>
          </div>

          <div 
            onClick={() => setShowImageZoom(true)}
            className="w-full lg:w-1/2 rounded-2xl overflow-hidden border border-[#BA9470]/40 neu-inset shadow-xl cursor-pointer group relative aspect-video bg-[#282a1d]"
          >
            <img
              src={architectureImage}
              alt="Схема Архитектуры EthOSium"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3.5">
              <span className="text-[10px] font-mono text-[#F0E2C8] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#BA9470]">touch_app</span>
                Нажмите для детального изучения схемы
              </span>
            </div>
          </div>
        </div>

        {/* Modal for Image Fullscreen Zoom */}
        {showImageZoom && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setShowImageZoom(false)}
          >
            <div className="relative max-w-5xl w-full neu-card p-3 rounded-3xl border border-[#BA9470]">
              <div className="flex justify-between items-center pb-2 px-2">
                <span className="text-xs font-mono text-[#BA9470] uppercase">
                  EthOSium 3D Isometric Architecture Blueprint
                </span>
                <button
                  onClick={() => setShowImageZoom(false)}
                  className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#FFFDF8]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <img
                src={architectureImage}
                alt="EthOSium 3D Architecture"
                referrerPolicy="no-referrer"
                className="w-full rounded-2xl object-contain max-h-[80vh]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------------- STRATEGY FLYWHEEL SECTION ---------------- */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#A9B489]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#BA9470]">cyclone</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                Самоусиливающийся Маховик (Growth Flywheel)
              </span>
            </div>
            <h3 className="font-headline font-bold text-lg text-[#F0E2C8] mt-0.5">
              5 Фаз Стратегического Цикла EthOSium
            </h3>
          </div>
          <span className="text-xs text-[#A9B489] font-mono">
            Как ретриты и софт ускоряют рост друг друга
          </span>
        </div>

        {/* 5 Steps Interactive Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STRATEGY_FLYWHEEL_STEPS.map((step) => {
            const isCurrent = step.step === activeFlywheelStep;
            return (
              <button
                key={step.step}
                onClick={() => setActiveFlywheelStep(step.step)}
                className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
                  isCurrent
                    ? 'neu-pill-active border-[#BA9470]/60 shadow-md'
                    : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent ? 'bg-[#BA9470] text-[#2c2f1e]' : 'neu-inset text-[#A9B489]'
                  }`}>
                    {step.step}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#A9B489]">
                    arrow_forward
                  </span>
                </div>
                <h4 className="font-headline font-bold text-xs text-[#F0E2C8] line-clamp-2 leading-tight mt-1">
                  {step.title.split('(')[0]}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Flywheel Card Deep Dive */}
        <div className="neu-inset p-4 sm:p-5 rounded-2xl border border-[#BA9470]/30 space-y-3 bg-[#2d3021]/90 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-2">
            <h4 className="font-headline font-bold text-base sm:text-lg text-[#F0E2C8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BA9470]" />
              Фаза {currentFlywheel.step}: {currentFlywheel.title}
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              {currentFlywheel.conversionMetric}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed font-light">
            {currentFlywheel.shortDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="neu-card p-3 rounded-xl border border-[#A9B489]/20">
              <span className="text-[10px] font-mono uppercase text-[#BA9470] font-bold block mb-1">
                Системный Триггер:
              </span>
              <p className="text-[#FFFDF8]">{currentFlywheel.trigger}</p>
            </div>

            <div className="neu-card p-3 rounded-xl border border-[#A9B489]/20">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                Синергия с экосистемой:
              </span>
              <p className="text-[#FFFDF8]">{currentFlywheel.synergy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- INTERACTIVE SYSTEM NODES MATRIX ---------------- */}
      <div className="space-y-4">
        <div className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
              Интерактивный Исследователь Узлов
            </span>
            <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
              Карта Системных Модулей ({filteredNodes.length} узлов)
            </h3>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              placeholder="Поиск по модулям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d3021] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FFFDF8] placeholder-[#A9B489]/60 border border-[#A9B489]/25 outline-none focus:border-[#BA9470]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {[
            { id: 'all', label: 'Все узлы' },
            { id: 'core', label: 'Local-First Vault' },
            { id: 'deeptech', label: 'AI Core & PPG' },
            { id: 'circuit', label: 'Институт (50 экспертов)' },
            { id: 'offline', label: 'Офлайн (Чимган & Лаунж)' },
            { id: 'economics', label: 'Экономика & Токены' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#BA9470]/30 text-[#FFFDF8] border border-[#BA9470]/60 shadow-sm'
                  : 'neu-inset text-[#A9B489] hover:text-[#F0E2C8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => onOpenModal({ type: 'node', data: node })}
              className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 hover:border-[#BA9470]/60 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between gap-3 group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ color: node.color }}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {node.icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    {node.securityLevel.split(':')[0]}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold">
                  {node.badge}
                </span>
                <h4 className="font-headline font-bold text-sm text-[#F0E2C8] mt-0.5 leading-snug group-hover:text-[#FFFDF8]">
                  {node.title}
                </h4>
                <p className="text-[11px] text-[#A9B489] font-mono">
                  {node.englishTitle}
                </p>

                <p className="text-xs text-[#E2ECD2]/80 mt-2 line-clamp-2 leading-relaxed font-light">
                  {node.shortDesc}
                </p>
              </div>

              <div className="border-t border-[#A9B489]/15 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#A9B489]">
                  {node.technicalSpecs.length} тех. спецификаций
                </span>
                <span className="text-[#BA9470] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                  Подробнее
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
