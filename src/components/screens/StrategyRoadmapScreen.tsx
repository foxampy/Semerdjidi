import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { StrategyDetailModal, StrategyModalContent } from '../strategy/StrategyDetailModal';
import { ArchitectureVisualizerWidget } from '../strategy/ArchitectureVisualizerWidget';
import { RoadmapVisualizerWidget } from '../strategy/RoadmapVisualizerWidget';
import { InvestmentPlanWidget } from '../strategy/InvestmentPlanWidget';
import { EthosiumTotem } from '../EthosiumTotem';

interface StrategyRoadmapScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  initialTab?: 'architecture' | 'roadmap' | 'investment';
}

export const StrategyRoadmapScreen: React.FC<StrategyRoadmapScreenProps> = ({
  onNavigate,
  initialTab = 'architecture'
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'roadmap' | 'investment'>(initialTab);
  const [modalContent, setModalContent] = useState<StrategyModalContent>(null);

  return (
    <div className="min-h-screen bg-[#2e3122] text-[#E2ECD2] pb-24 font-body">
      {/* Detail Modal for in-depth exploration */}
      <StrategyDetailModal
        content={modalContent}
        onClose={() => setModalContent(null)}
        onNavigate={onNavigate}
      />

      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#333725]/90 backdrop-blur-md border-b border-[#A9B489]/25 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('feed')}
              className="w-9 h-9 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#FFFDF8] transition-all"
              aria-label="Назад на главную"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full neu-inset p-1 flex items-center justify-center border border-[#BA9470]/40">
                <EthosiumTotem size={22} />
              </div>
              <div>
                <h1 className="font-headline font-bold text-sm sm:text-base text-[#F0E2C8] leading-tight">
                  Архитектура &amp; Стратегия EthOSium
                </h1>
                <p className="text-[10px] font-mono text-[#A9B489] uppercase tracking-wider">
                  Roadmap 2026–2030 • Seed Round $650k
                </p>
              </div>
            </div>
          </div>

          {/* Direct Investment CTA Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalContent({
                type: 'invest_contact',
                title: 'Связь с Синдикатом & Фаундерами',
                subtitle: 'Запросите доступ к Data Room, SAFE-соглашению и аудиту метрик.',
                initialTicket: 25000
              })}
              className="neu-btn px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470]/70 hover:bg-[#BA9470]/50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-400">account_balance</span>
              <span className="hidden sm:inline">Инвест-дек &amp; Синдикат</span>
              <span className="sm:hidden">Инвест-дек</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-2.5 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'architecture', label: '1. Архитектура & Маховик', icon: 'hub' },
              { id: 'roadmap', label: '2. Дорожная Карта (2026–2030)', icon: 'timeline' },
              { id: 'investment', label: '3. Пошаговый Инвест-План', icon: 'trending_up' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                    isActive
                      ? 'neu-pill-active text-[#FFFDF8] border border-[#BA9470]/60 shadow-md'
                      : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-[#BA9470]' : 'text-[#A9B489]'}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {activeTab === 'architecture' && (
          <ArchitectureVisualizerWidget
            onOpenModal={setModalContent}
            onNavigate={onNavigate}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapVisualizerWidget
            onOpenModal={setModalContent}
          />
        )}

        {activeTab === 'investment' && (
          <InvestmentPlanWidget
            onOpenModal={setModalContent}
          />
        )}

        {/* Global Bottom Navigation Links */}
        <div className="mt-12 pt-6 border-t border-[#A9B489]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('whitepaper')}
              className="neu-btn px-3 py-1.5 rounded-xl text-[#A9B489] hover:text-[#FFFDF8] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Whitepaper 3.0
            </button>
            <button
              onClick={() => onNavigate('retreats')}
              className="neu-btn px-3 py-1.5 rounded-xl text-[#A9B489] hover:text-[#FFFDF8] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">landscape</span>
              Чимган 18–20 сент
            </button>
            <button
              onClick={() => onNavigate('mediakit')}
              className="neu-btn px-3 py-1.5 rounded-xl text-[#A9B489] hover:text-[#FFFDF8] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Медиа-кит
            </button>
          </div>

          <span className="font-mono text-[#A9B489] text-[11px]">
            EthOSium Human OS © 2026. Все права защищены.
          </span>
        </div>
      </main>
    </div>
  );
};
