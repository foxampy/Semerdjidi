import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { ECOSYSTEM_CIRCUITS, CircuitId } from '../../data/whitepaperData';

interface CircuitsTopologyWidgetProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const CircuitsTopologyWidget: React.FC<CircuitsTopologyWidgetProps> = ({ onNavigate }) => {
  const [activeCircuitId, setActiveCircuitId] = useState<CircuitId>('core');

  const currentCircuit = ECOSYSTEM_CIRCUITS.find(c => c.id === activeCircuitId) || ECOSYSTEM_CIRCUITS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Topology Header */}
      <div className="neu-card rounded-2xl p-4 sm:p-5 border border-[#A9B489]/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#BA9470]">security</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
            Распределенная Архитектура Экосистемы
          </span>
        </div>
        <h2 className="font-headline font-bold text-lg text-[#F0E2C8] mt-1">
          6 Контуров Операционной Системы EthOSium
        </h2>
        <p className="text-xs text-[#A9B489] mt-0.5 leading-relaxed">
          Синергетический ансамбль: Базовое 3D-Ядро, Нейро-Интеллект Polaris, Социальный резонанс, Биометрия, Корпоративная жизнестойкость и Экспертный круг с клиническим партнером Семерджиди.
        </p>

        {/* Interactive Circuit Switcher (6 circuits) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-4">
          {ECOSYSTEM_CIRCUITS.map((circuit) => {
            const isSelected = circuit.id === activeCircuitId;
            return (
              <button
                key={circuit.id}
                onClick={() => setActiveCircuitId(circuit.id)}
                className={`p-3.5 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2 border ${
                  isSelected
                    ? 'neu-pill-active border-[#BA9470]/60 shadow-lg bg-[#BA9470]/10'
                    : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: circuit.accentColor }}
                  >
                    {circuit.icon}
                  </span>
                  <span className="text-[9px] font-mono text-[#A9B489] uppercase tracking-wider">
                    {circuit.codeName.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-xs sm:text-sm text-[#F0E2C8] leading-snug">
                    {circuit.title}
                  </h3>
                  <p className="text-[10px] text-[#A9B489] mt-0.5 truncate">
                    {circuit.securityLevel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Circuit Deep Dive */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 border border-[#BA9470]/30 bg-[#373a2a] space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A9B489]/15 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center border shrink-0"
              style={{ borderColor: `${currentCircuit.accentColor}50` }}
            >
              <span
                className="material-symbols-outlined text-[26px]"
                style={{ color: currentCircuit.accentColor }}
              >
                {currentCircuit.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: currentCircuit.accentColor }}>
                  {currentCircuit.codeName}
                </span>
                <span className="text-[9px] font-mono bg-[#2a2d1e] px-2 py-0.5 rounded text-[#A9B489] border border-[#A9B489]/20">
                  {currentCircuit.securityLevel}
                </span>
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-[#F0E2C8]">
                {currentCircuit.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onNavigate(currentCircuit.linkedScreen)}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#F0E2C8] hover:text-[#BA9470] border border-[#BA9470]/40 flex items-center gap-1.5 self-start sm:self-auto transition-all"
          >
            <span>Открыть модуль</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Description & Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu-inset p-4 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
              Назначение и архитектура:
            </span>
            <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
              {currentCircuit.description}
            </p>
          </div>

          <div className="neu-inset p-4 rounded-xl space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              Ценность для человека / компании:
            </span>
            <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
              {currentCircuit.userBenefit}
            </p>
          </div>
        </div>

        {/* Core Components */}
        <div className="neu-card p-4 rounded-xl border border-[#A9B489]/20 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
            Ключевые компоненты контура:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentCircuit.coreComponents.map((comp, idx) => (
              <div key={idx} className="neu-inset p-2.5 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#BA9470] shrink-0 mt-0.5">
                  layers
                </span>
                <span className="text-xs text-[#FFFDF8] font-medium leading-snug">
                  {comp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialist & Ecosystem Synergy */}
        <div className="border-t border-[#A9B489]/15 pt-3 flex items-start gap-2.5 text-xs text-[#A9B489]">
          <span className="material-symbols-outlined text-[18px] text-[#BA9470] shrink-0">
            handshake
          </span>
          <div>
            <span className="font-semibold text-[#F0E2C8]">Роль специалистов и партнерских институтов: </span>
            <span>{currentCircuit.specialistRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
