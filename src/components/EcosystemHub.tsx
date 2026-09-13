import React from 'react';
import { 
  Layers, 
  BrainCircuit, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Users, 
  Globe, 
  Lock, 
  Server,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { CompanyNode, EcosystemModule, RealtimeTelemetryEvent, EcosystemContour } from '../types';

interface EcosystemHubProps {
  companies: CompanyNode[];
  modules: EcosystemModule[];
  telemetry: RealtimeTelemetryEvent[];
  activeContour: EcosystemContour;
  onNavigateTab: (tabId: string) => void;
}

export const EcosystemHub: React.FC<EcosystemHubProps> = ({
  companies,
  modules,
  telemetry,
  activeContour,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Central Ecosystem Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/20 p-6 md:p-10">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Единая операционная среда EthOSium</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Outfit']">
            Интеллектуальная Экосистема <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400">
              EthOSium & Модуль Семерджиди
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Бесшовная среда, объединяющая корпоративные контуры управления, открытые сообщества, 
            передовую психологическую типологию Семерджиди и нейросетевую оптимизацию бизнес-процессов в реальном времени.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('semerdjidi')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Модуль Семерджиди</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('ai-analytics')}
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>ИИ-Анализ Процессов</span>
            </button>

            <button
              onClick={() => onNavigateTab('social')}
              className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center space-x-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Соцсеть EthOS Pulse</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* 4 Ecosystem Vital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Здоровье процессов</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-['Outfit']">96.4%</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.2% за последние 24 часа</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Резонанс Семерджиди</span>
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-indigo-400 font-['Outfit']">94.8%</div>
          <div className="text-[11px] text-slate-400">
            4 активных вектора калибровки
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Сквозной трафик контуров</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white font-['Outfit']">1.4k</div>
          <div className="text-[11px] text-slate-400">
            Операций в минуту без задержек
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Изоляция & Безопасность</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-sky-400 font-['Outfit']">Zero-Trust</div>
          <div className="text-[11px] text-slate-400">
            Все 3 контура синхронизированы
          </div>
        </div>
      </div>

      {/* Multi-Contour Architecture Map */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Многоконтурная архитектура EthOSium</span>
            </h3>
            <p className="text-xs text-slate-400">
              Бесшовный переход данных и пользователей между изолированными периметрами
            </p>
          </div>
          <div className="text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
            Активный шлюз: <strong className="text-white capitalize">{activeContour}</strong>
          </div>
        </div>

        {/* 3 Contours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Public Contour */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeContour === 'public'
              ? 'bg-sky-950/30 border-sky-500/50 shadow-lg shadow-sky-500/10'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
                <Globe className="w-4 h-4" />
                <span>Публичный контур</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300">
                Открытый
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Открытое сообщество экспертов, профессиональная соцсеть, витрина решений, публичные публикации и поиск партнеров.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Доступность:</span>
              <span className="text-sky-300 font-medium">Свободная</span>
            </div>
          </div>

          {/* Corporate Contour */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeContour === 'corporate'
              ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Корпоративный контур</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                Защищенный
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Внутренние бизнес-процессы предприятий, документооборот, сквозной канбан, смарт-воркфлоу и командные коммуникации.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Шифрование:</span>
              <span className="text-indigo-300 font-medium">Enterprise TLS</span>
            </div>
          </div>

          {/* Sovereign Contour */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeContour === 'sovereign'
              ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Суверенный контур</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                Изолированный
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Персональная психометрика по методике Семерджиди, закрытые аудиты безопасности, персональные смарт-ключи и конфиденциальные сессии.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Приватность:</span>
              <span className="text-amber-300 font-medium">100% суверенная</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Modules Directory & Realtime Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Modules Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Интегрированные модули экосистемы
            </h3>
            <span className="text-xs text-slate-400">{modules.length} активных модуля</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  if (m.id === 'mod-semerdjidi') onNavigateTab('semerdjidi');
                  else if (m.id === 'mod-ai-analytics') onNavigateTab('ai-analytics');
                  else if (m.id === 'mod-social-network') onNavigateTab('social');
                  else onNavigateTab('apps');
                }}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {m.code}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{m.status}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{m.usageMetric}</span>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>Открыть</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Telemetry Stream */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Живая телеметрия EthOSium</span>
            </h3>
            <span className="text-[11px] text-emerald-400 animate-pulse">Live Pulse</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            {telemetry.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{t.timestamp}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    t.contour === 'public' ? 'text-sky-300 bg-sky-500/10' :
                    t.contour === 'corporate' ? 'text-indigo-300 bg-indigo-500/10' :
                    'text-amber-300 bg-amber-500/10'
                  }`}>
                    {t.contour}
                  </span>
                </div>

                <div className="font-semibold text-white">{t.title}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{t.description}</p>

                {t.impactScore && (
                  <div className="pt-1 text-right">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {t.impactScore}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
