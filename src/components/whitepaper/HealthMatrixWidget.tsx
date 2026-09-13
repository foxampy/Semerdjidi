import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { HEALTH_DIMENSIONS, HealthDimension, HealthDimensionId } from '../../data/whitepaperData';

interface HealthMatrixWidgetProps {
  onNavigate: (screen: ActiveScreen) => void;
  onSelectDimensionChapter?: (dimId: HealthDimensionId) => void;
}

export const HealthMatrixWidget: React.FC<HealthMatrixWidgetProps> = ({
  onNavigate,
  onSelectDimensionChapter
}) => {
  const [selectedDimensionId, setSelectedDimensionId] = useState<HealthDimensionId>('bioenergy');
  
  // Interactive balance scores (1 to 10) for express self-assessment
  const [scores, setScores] = useState<Record<HealthDimensionId, number>>({
    bioenergy: 7,
    mind: 8,
    career: 7,
    finance: 6,
    family: 8,
    social: 7,
    spirit: 8,
    creativity: 6
  });

  const [assessmentMode, setAssessmentMode] = useState<boolean>(false);

  const selectedDim = HEALTH_DIMENSIONS.find(d => d.id === selectedDimensionId) || HEALTH_DIMENSIONS[0];

  const averageScore = Math.round(
    ((Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0) / HEALTH_DIMENSIONS.length) * 10
  ) / 10;

  const handleScoreChange = (id: HealthDimensionId, value: number) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  const getScoreCategory = (avg: number) => {
    if (avg < 5) return { label: 'Высокая декомпенсация', color: 'text-rose-400', desc: 'Требуется срочный физический горный ретрит и разгрузка симпатической нервной системы.' };
    if (avg < 7.5) return { label: 'Режим компенсированного стресса', color: 'text-amber-400', desc: 'Организм держится на волевых усилиях. Высокий риск внезапного выгорания.' };
    return { label: 'Суверенный баланс EthOS', color: 'text-emerald-400', desc: 'Высокая стресс-резильентность, ясный ум и устойчивый телесный контакт.' };
  };

  const scoreMeta = getScoreCategory(averageScore);

  return (
    <div className="flex flex-col gap-4">
      {/* Header Bar */}
      <div className="neu-card rounded-2xl p-4 sm:p-5 border border-[#A9B489]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#BA9470]">hub</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
              8 Векторов Человека
            </span>
          </div>
          <h2 className="font-headline font-bold text-lg text-[#F0E2C8] mt-1">
            Матрица Здоровья &amp; Жизненной Силы EthOSium
          </h2>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Сон, психика, питание, биомеханика, адаптация к хаосу, призвание, привычки и чистая среда
          </p>
        </div>

        <button
          onClick={() => setAssessmentMode(!assessmentMode)}
          className={`neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
            assessmentMode
              ? 'text-[#F0E2C8] bg-[#BA9470]/25 border border-[#BA9470]/60'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          {assessmentMode ? 'Скрыть экспресс-чекин' : 'Экспресс-чекин 8 шкал'}
        </button>
      </div>

      {/* Interactive Assessment Mode (Quick Sliders) */}
      {assessmentMode && (
        <div className="neu-card rounded-2xl p-4 sm:p-5 border border-[#BA9470]/40 bg-[#353927] space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold">
                Самодиагностика Суверенности
              </span>
              <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                Оцените текущий ресурс по 8 векторам (от 1 до 10)
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-[#2a2d1e] px-3 py-1.5 rounded-xl border border-[#A9B489]/20 self-start sm:self-auto">
              <span className="text-xs text-[#A9B489]">Средний индекс:</span>
              <span className="font-mono font-bold text-sm text-[#FFFDF8]">{averageScore} / 10</span>
              <span className={`text-[11px] font-bold ${scoreMeta.color}`}>• {scoreMeta.label}</span>
            </div>
          </div>

          <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
            {scoreMeta.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {HEALTH_DIMENSIONS.map(dim => (
              <div
                key={dim.id}
                className="neu-inset p-3 rounded-xl flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]" style={{ color: dim.color }}>
                      {dim.icon}
                    </span>
                    <span className="text-xs font-semibold text-[#FFFDF8] truncate max-w-[120px]">
                      {dim.name.split('&')[0].trim()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#BA9470]">
                    {scores[dim.id]}/10
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={scores[dim.id]}
                  onChange={(e) => handleScoreChange(dim.id, Number(e.target.value))}
                  className="w-full accent-[#BA9470] cursor-pointer"
                />

                <div className="flex justify-between text-[9px] text-[#A9B489]/80 font-mono">
                  <span>Истощение (1)</span>
                  <span>Опора (10)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <span className="text-[11px] text-[#A9B489]">
              Хотите детальный поливагальный отчет с графиками?
            </span>
            <button
              onClick={() => onNavigate('baseline')}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/20 border border-[#BA9470]/40 hover:bg-[#BA9470]/30 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">insights</span>
              Открыть полный Baseline D-3 (7 шкал)
            </button>
          </div>
        </div>
      )}

      {/* 8 Dimension Tabs / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {HEALTH_DIMENSIONS.map((dim) => {
          const isSelected = dim.id === selectedDimensionId;
          return (
            <button
              key={dim.id}
              onClick={() => setSelectedDimensionId(dim.id)}
              className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2 border ${
                isSelected
                  ? 'neu-pill-active border-[#BA9470]/60 shadow-lg'
                  : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center neu-inset"
                  style={{ color: dim.color }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {dim.icon}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#A9B489] uppercase tracking-wider">
                  Вектор
                </span>
              </div>

              <div>
                <h3 className="font-headline font-bold text-xs sm:text-sm text-[#F0E2C8] leading-tight">
                  {dim.name}
                </h3>
                <p className="text-[10px] text-[#A9B489] mt-0.5 line-clamp-1">
                  {dim.englishName}
                </p>
              </div>

              <div className="w-full bg-[#2a2c1f] h-1 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${scores[dim.id] * 10}%`,
                    backgroundColor: dim.color
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Dimension Detail Card */}
      <div className="neu-card rounded-2xl p-5 sm:p-6 border border-[#BA9470]/30 bg-[#383b2a] space-y-4 animate-in fade-in duration-200">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#A9B489]/15 pb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center neu-inset shrink-0"
              style={{ color: selectedDim.color }}
            >
              <span className="material-symbols-outlined text-[26px]">
                {selectedDim.icon}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                  {selectedDim.englishName}
                </span>
                <span className="text-[10px] font-mono text-[#A9B489] bg-[#2a2d1e] px-2 py-0.5 rounded">
                  Самооценка: {scores[selectedDim.id]}/10
                </span>
              </div>
              <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-1 leading-tight">
                {selectedDim.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-1 font-light leading-relaxed">
                {selectedDim.shortDesc}
              </p>
            </div>
          </div>

          {onSelectDimensionChapter && (
            <button
              onClick={() => onSelectDimensionChapter(selectedDim.id)}
              className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/40 flex items-center gap-1.5 shrink-0 self-start"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Читать главу в Whitepaper
            </button>
          )}
        </div>

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="neu-card p-4 rounded-xl border border-rose-500/25 bg-[#3a3528]">
            <div className="flex items-center gap-2 text-rose-400 mb-1.5 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Хроническая проблема &amp; дисбаланс
            </div>
            <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
              {selectedDim.coreProblem}
            </p>
          </div>

          <div className="neu-card p-4 rounded-xl border border-emerald-500/25 bg-[#323a2a]">
            <div className="flex items-center gap-2 text-emerald-400 mb-1.5 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Решение &amp; Архитектура EthOSium
            </div>
            <p className="text-xs text-[#E2ECD2]/85 leading-relaxed">
              {selectedDim.ethosSolution}
            </p>
          </div>
        </div>

        {/* Metrics and Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          <div className="neu-inset p-3.5 rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
              Контролируемые биомаркеры &amp; метрики:
            </span>
            <ul className="space-y-1.5">
              {selectedDim.metricsTracked.map((metric, idx) => (
                <li key={idx} className="text-xs text-[#E2ECD2]/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] shrink-0" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="neu-inset p-3.5 rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
              Практические протоколы EthOS:
            </span>
            <ul className="space-y-1.5">
              {selectedDim.protocols.map((proto, idx) => (
                <li key={idx} className="text-xs text-[#E2ECD2]/80 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">check_circle</span>
                  <span>{proto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Bridges (Direct App Module Integration) */}
        <div className="border-t border-[#A9B489]/15 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[#A9B489]">
            <span className="font-semibold text-[#F0E2C8]">Прямая интеграция в приложении: </span>
            перейдите в модуль для практической работы с этим вектором
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedDim.integratedModules.map((mod, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(mod.screen)}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#F0E2C8] hover:text-[#BA9470] border border-[#A9B489]/25 hover:border-[#BA9470]/60 flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                {mod.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
