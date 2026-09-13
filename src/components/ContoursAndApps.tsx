import React, { useState } from 'react';
import { 
  AppWindow, 
  Layers, 
  ShieldCheck, 
  Lock, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  ToggleLeft, 
  ToggleRight,
  Database,
  Workflow,
  KeyRound,
  FileText
} from 'lucide-react';
import { EcosystemContour, EcosystemModule } from '../types';

interface ContoursAndAppsProps {
  modules: EcosystemModule[];
  activeContour: EcosystemContour;
  onSelectContour: (contour: EcosystemContour) => void;
}

export const ContoursAndApps: React.FC<ContoursAndAppsProps> = ({
  modules,
  activeContour,
  onSelectContour
}) => {
  const [activeAppCategory, setActiveAppCategory] = useState<'all' | 'intelligence' | 'collaboration' | 'governance'>('all');
  const [contourBridgeSync, setContourBridgeSync] = useState(true);

  // Filter modules
  const filteredModules = activeAppCategory === 'all'
    ? modules
    : modules.filter(m => m.category === activeAppCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <AppWindow className="w-3.5 h-3.5" />
            <span>Интегрированные приложения & Модули</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Контуры и Приложения Экосистемы EthOSium
          </h1>
          <p className="text-sm text-slate-300">
            Каждое приложение бесшовно интегрировано в общую шину данных с гибкой привязкой к контурам безопасности и когнитивным профилям Семерджиди.
          </p>
        </div>
      </div>

      {/* Contour Isolation & Bridge Control */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Статус кросс-контурного шлюза (Cross-Circuit Bridge)</h3>
            <p className="text-xs text-slate-400">Управление сквозной передачей данных между публичным, корпоративным и суверенным периметрами</p>
          </div>
          <button
            onClick={() => setContourBridgeSync(!contourBridgeSync)}
            className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <span>{contourBridgeSync ? 'Шлюз активен' : 'Шлюз изолирован'}</span>
            {contourBridgeSync ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div
            onClick={() => onSelectContour('public')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeContour === 'public'
                ? 'bg-sky-950/20 border-sky-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-sky-400 font-semibold mb-1">
              <span className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Публичный контур</span>
              </span>
              {activeContour === 'public' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </div>
            <p className="text-[11px] text-slate-400">Свободный обмен знаниями, открытые API, экспертные публикации.</p>
          </div>

          <div
            onClick={() => onSelectContour('corporate')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeContour === 'corporate'
                ? 'bg-indigo-950/20 border-indigo-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Корпоративный контур</span>
              </span>
              {activeContour === 'corporate' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-[11px] text-slate-400">Внутренние бизнес-процессы, регламенты, совместная работа команд.</p>
          </div>

          <div
            onClick={() => onSelectContour('sovereign')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeContour === 'sovereign'
                ? 'bg-amber-950/20 border-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Суверенный контур</span>
              </span>
              {activeContour === 'sovereign' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-400">Персональная психометрика Семерджиди, конфиденциальные ключи.</p>
          </div>
        </div>
      </div>

      {/* Category Filter & Apps List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {(['all', 'intelligence', 'collaboration', 'governance'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveAppCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeAppCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Все приложения' :
                 cat === 'intelligence' ? 'Интеллект & Психология' :
                 cat === 'collaboration' ? 'Коллаборация' : 'Управление & Безопасность'}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400">{filteredModules.length} приложений доступно</span>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {m.code}
                  </span>
                  <div className="flex items-center space-x-1">
                    {m.contourScope.map((c) => (
                      <span key={c} className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {c[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <h4 className="font-bold text-white text-base">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">{m.usageMetric}</span>
                <span className="text-indigo-400 font-medium">Активно: {m.activeUsersNow} чел.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
