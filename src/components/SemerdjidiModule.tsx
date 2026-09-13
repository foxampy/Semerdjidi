import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert, 
  HeartHandshake, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  UserCheck, 
  Sliders, 
  RefreshCw,
  Award,
  Zap,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SemerdzhidiProfile, SemerdzhidiVectors, EcosystemContour } from '../types';

interface SemerdjidiModuleProps {
  profiles: SemerdzhidiProfile[];
  activeContour: EcosystemContour;
  onUpdateProfile?: (profile: SemerdzhidiProfile) => void;
}

export const SemerdjidiModule: React.FC<SemerdjidiModuleProps> = ({
  profiles,
  activeContour
}) => {
  const [selectedProfile, setSelectedProfile] = useState<SemerdzhidiProfile>(profiles[0]);
  const [activeTab, setActiveTab] = useState<'profiler' | 'synergy_matrix' | 'burnout_radar' | 'theory'>('profiler');

  // Custom Interactive Simulator State
  const [customName, setCustomName] = useState('Михаил Романов');
  const [customRole, setCustomRole] = useState('Тимлид распределенного контура');
  const [customVectors, setCustomVectors] = useState<SemerdzhidiVectors>({
    visionary: 84,
    stabilizer: 68,
    harmonizer: 75,
    auditor: 79
  });
  const [customContext, setCustomContext] = useState('Срочный перевод микросервисов в защищенный корпоративный контур');
  const [isAiCalculating, setIsAiCalculating] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Function to run live AI analysis of Semerdzhidi profile
  const handleRunAiAnalysis = async () => {
    setIsAiCalculating(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/ai/semerdjidi-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: customName,
          role: customRole,
          teamContext: customContext,
          vectors: customVectors
        })
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setAiReport(data.profile);
      }
    } catch (err) {
      console.error('Failed to run Semerdzhidi AI analysis:', err);
    } finally {
      setIsAiCalculating(false);
    }
  };

  // Helper for vector colors
  const vectorMeta = {
    visionary: { label: 'Стратегический вектор (Визионер)', color: 'bg-purple-500', text: 'text-purple-400', desc: 'Генерация смыслов, долгосрочное целеполагание и архитектура' },
    stabilizer: { label: 'Операционный вектор (Стабилизатор)', color: 'bg-emerald-500', text: 'text-emerald-400', desc: 'Устойчивость процессов, алгоритмы, порядок и надежность' },
    harmonizer: { label: 'Эмпатийно-резонансный (Гармонизатор)', color: 'bg-pink-500', text: 'text-pink-400', desc: 'Командное доверие, эмоциональный баланс и снятие барьеров' },
    auditor: { label: 'Аналитико-критический (Аудитор)', color: 'bg-sky-500', text: 'text-sky-400', desc: 'Проверка фактов, валидация гипотез и минимизация рисков' }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Semerdzhidi Concept */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Фундаментальный психометрический контур EthOSium</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
              Модуль Семерджиди: Психология и Синергия Команд
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Динамическая модель психологического профилирования, основанная на 4 когнитивных векторах. 
              Обеспечивает гармонизацию взаимодействия людей, снижение эмоционального трения в корпоративном контуре 
              и автоматическую оптимизацию распределения ролей с помощью встроенного ИИ.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-indigo-400 font-['Outfit']">96.8%</div>
              <div className="text-[11px] text-slate-400">Точность прогноза</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400 font-['Outfit']">-42%</div>
              <div className="text-[11px] text-slate-400">Снижение конфликтов</div>
            </div>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:24px_24px] pointer-events-none" />
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profiler')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'profiler'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Калибратор Векторов & ИИ-Диагностика</span>
        </button>

        <button
          onClick={() => setActiveTab('synergy_matrix')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'synergy_matrix'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Матрица Совместимости & Командный Резонанс</span>
        </button>

        <button
          onClick={() => setActiveTab('burnout_radar')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'burnout_radar'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Детектор Когнитивной Нагрузки и Выгорания</span>
        </button>

        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'theory'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Методология Семерджиди</span>
        </button>
      </div>

      {/* Tab 1: Interactive Vector Profiler & AI Diagnosis */}
      {activeTab === 'profiler' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Vector Tuner */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-white text-base flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Интерактивный симулятор профиля Семерджиди</span>
                </h3>
                <p className="text-xs text-slate-400">Настройте 4 вектора для тестирования психологической динамики</p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Контур: {activeContour}
              </span>
            </div>

            {/* Inputs for member and role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Имя / Позывной</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Роль в экосистеме</label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Context */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Текущий рабочий контекст / Вызов</label>
              <input
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* 4 Vector Sliders */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Векторные коэффициенты Семерджиди:
              </h4>

              {/* Visionary */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-300 font-medium">Стратегический вектор (Визионер)</span>
                  <span className="font-bold text-purple-400">{customVectors.visionary}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={customVectors.visionary}
                  onChange={(e) => setCustomVectors({ ...customVectors, visionary: Number(e.target.value) })}
                  className="w-full accent-purple-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Генерация гипотез и удержание общего курса развития</p>
              </div>

              {/* Stabilizer */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-300 font-medium">Операционный вектор (Стабилизатор)</span>
                  <span className="font-bold text-emerald-400">{customVectors.stabilizer}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={customVectors.stabilizer}
                  onChange={(e) => setCustomVectors({ ...customVectors, stabilizer: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Регламентация, доведение до результата, дисциплина контура</p>
              </div>

              {/* Harmonizer */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-pink-300 font-medium">Эмпатийно-коммуникативный (Гармонизатор)</span>
                  <span className="font-bold text-pink-400">{customVectors.harmonizer}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={customVectors.harmonizer}
                  onChange={(e) => setCustomVectors({ ...customVectors, harmonizer: Number(e.target.value) })}
                  className="w-full accent-pink-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Снижение трения, доверие, психологическая безопасность</p>
              </div>

              {/* Auditor */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-sky-300 font-medium">Аналитико-критический (Аудитор)</span>
                  <span className="font-bold text-sky-400">{customVectors.auditor}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={customVectors.auditor}
                  onChange={(e) => setCustomVectors({ ...customVectors, auditor: Number(e.target.value) })}
                  className="w-full accent-sky-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Аудит рисков, критическая фильтрация и проверка данных</p>
              </div>
            </div>

            {/* Run Button */}
            <button
              id="run-semerdjidi-ai-btn"
              onClick={handleRunAiAnalysis}
              disabled={isAiCalculating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isAiCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ИИ-анализ по методологии Семерджиди...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Рассчитать психотип и рекомендации (ИИ)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Dynamic Diagnosis & Vector Visualization */}
          <div className="lg:col-span-6 space-y-6">
            {/* Vector Balance Radar Simulation */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-white text-base flex items-center justify-between">
                <span>Визуализация баланса векторов</span>
                <span className="text-xs text-indigo-400 font-normal">Семерджиди-профиль</span>
              </h3>

              {/* Graphical representation of the vectors */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950/80 border border-purple-500/20 rounded-xl p-3.5 text-center">
                  <div className="text-xs text-purple-400 font-semibold mb-1">Визионер (I)</div>
                  <div className="text-2xl font-bold text-white font-['Outfit']">{customVectors.visionary}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${customVectors.visionary}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-3.5 text-center">
                  <div className="text-xs text-emerald-400 font-semibold mb-1">Стабилизатор (II)</div>
                  <div className="text-2xl font-bold text-white font-['Outfit']">{customVectors.stabilizer}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${customVectors.stabilizer}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-pink-500/20 rounded-xl p-3.5 text-center">
                  <div className="text-xs text-pink-400 font-semibold mb-1">Гармонизатор (III)</div>
                  <div className="text-2xl font-bold text-white font-['Outfit']">{customVectors.harmonizer}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: `${customVectors.harmonizer}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-sky-500/20 rounded-xl p-3.5 text-center">
                  <div className="text-xs text-sky-400 font-semibold mb-1">Аудитор (IV)</div>
                  <div className="text-2xl font-bold text-white font-['Outfit']">{customVectors.auditor}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${customVectors.auditor}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Results Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white text-sm">
                    {aiReport ? 'Результат ИИ-анализа Семерджиди' : 'Текущая экспресс-оценка'}
                  </span>
                </div>
                <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {aiReport ? 'Нейро-модель v2.5' : 'Алгоритм Семерджиди'}
                </span>
              </div>

              {aiReport ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">
                      Доминирующий психотип
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                      {aiReport.dominantType}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {aiReport.cognitiveArchitecture}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Индекс синергии</div>
                      <div className="text-xl font-bold text-emerald-400 mt-0.5">{aiReport.synergyIndex || 88}%</div>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                      <div className="text-[11px] text-slate-400">Риск выгорания</div>
                      <div className={`text-xl font-bold mt-0.5 ${
                        aiReport.burnoutRisk === 'Критический' || aiReport.burnoutRisk === 'Повышенный'
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      }`}>
                        {aiReport.burnoutRisk}
                      </div>
                    </div>
                  </div>

                  {aiReport.idealContour && (
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-indigo-400 font-semibold">Оптимальный контур реализации:</span>{' '}
                      {aiReport.idealContour}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-300">Рекомендации по калибровке продуктивности:</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {aiReport.actionableSteps?.map((step: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300">
                    <p className="leading-relaxed">
                      Нажмите кнопку <strong className="text-indigo-400">«Рассчитать психотип и рекомендации (ИИ)»</strong> для запуска глубокой нейросетевой калибровки личности и совместимости в контуре EthOSium.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Предварительный индекс синергии:</span>
                      <div className="text-xl font-bold text-indigo-400 mt-1">
                        {Math.round((customVectors.visionary + customVectors.stabilizer + customVectors.harmonizer + customVectors.auditor) / 4)}%
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400">Статус контура:</span>
                      <div className="text-sm font-semibold text-emerald-400 mt-1.5 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Синхронизирован</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Synergy Matrix & Team Resonance */}
      {activeTab === 'synergy_matrix' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white text-base">Матрица взаимной совместимости специалистов</h3>
                <p className="text-xs text-slate-400">
                  Расчет резонанса и скрытых зон напряжения между участниками корпоративного контура
                </p>
              </div>
              <div className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
                Взаимный резонанс экосистемы: <strong className="text-white">93.4%</strong>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Специалист</th>
                    <th className="py-3 px-4">Доминирующий психотип</th>
                    <th className="py-3 px-4">Парный резонанс с</th>
                    <th className="py-3 px-4">Оценка синергии</th>
                    <th className="py-3 px-4">Прогноз совместной работы</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {profiles.map((p, i) => {
                    const partner = profiles[(i + 1) % profiles.length];
                    const synergy = Math.round((p.synergyScore + partner.synergyScore) / 2);
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                            <div>
                              <div className="font-medium text-white">{p.name}</div>
                              <div className="text-[11px] text-slate-400">{p.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {p.dominantType.split('(')[0]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {partner.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${synergy}%` }} />
                            </div>
                            <span className="font-bold text-emerald-400">{synergy}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {synergy >= 90 
                            ? 'Высокая синергия: идеальная взаимная компенсация векторов'
                            : 'Устойчивое взаимодействие: требуется четкая фиксация зон ответственности'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pairwise Interaction Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                <Users className="w-4 h-4" />
                <span>Оптимальные связки по Семерджиди</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Визионер (I) + Стабилизатор (II)</strong> образуют несущую конструкцию любого проекта в EthOSium. 
                Визионер задает вектор и формулирует гипотезы, а Стабилизатор обеспечивает бесперебойную реализацию без срывов дедлайнов.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-pink-400 font-semibold text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>Медиация и баланс контура</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Гармонизатор (III) + Аудитор (IV)</strong> исключают критические перекосы. 
                Гармонизатор поддерживает комфортную психологическую среду, а Аудитор валидирует качество и защищает команду от самообмана.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cognitive Load & Burnout Radar */}
      {activeTab === 'burnout_radar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Психологическая безопасность среды</div>
              <div className="text-3xl font-bold text-emerald-400 font-['Outfit']">94.2%</div>
              <div className="text-xs text-slate-400">Низкий уровень токсичности и скрытого стресса</div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Средняя когнитивная нагрузка</div>
              <div className="text-3xl font-bold text-indigo-400 font-['Outfit']">67%</div>
              <div className="text-xs text-slate-400">В пределах адаптационной нормы контура</div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Сотрудники в зоне риска выгорания</div>
              <div className="text-3xl font-bold text-amber-400 font-['Outfit']">1 чел.</div>
              <div className="text-xs text-slate-400">Рекомендован перевод в суверенный контур отдыха</div>
            </div>
          </div>

          {/* Detailed Member Burnout Status */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-white text-base">Текущий мониторинг психоэмоционального ресурса</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profiles.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-semibold text-white text-sm">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.role}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.burnoutRisk === 'Низкий' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      p.burnoutRisk === 'Умеренный' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {p.burnoutRisk} риск
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Энергетический баланс</span>
                      <span className="font-bold text-white">{p.emotionalEnergy}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: `${p.emotionalEnergy}%` }} />
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-indigo-300 font-medium">Рекомендация коуча:</span>{' '}
                    {p.coachingRecommendations[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Theory of Semerdzhidi */}
      {activeTab === 'theory' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Основы психолого-типологической системы Семерджиди
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Методика Семерджиди рассматривает человеческое сознание и профессиональное поведение не как статичные ярлыки, 
              а как динамическое векторное поле, непрерывно калибруемое контекстом решаемых задач и окружением.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {Object.entries(vectorMeta).map(([key, item]) => (
              <div key={key} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className={`text-sm font-bold ${item.text}`}>{item.label}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800/60 flex items-center justify-between">
                  <span>Вклад в экосистему EthOSium:</span>
                  <span className="text-indigo-400 font-medium">Опорный когнитивный узел</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
            <strong>Интеграция в контуры:</strong> В отличие от классических HR-систем, модуль Семерджиди в EthOSium бесшовно связан 
            с контурами безопасности и ИИ-аналитикой процессов: если процесс перегружен, система автоматически рекомендует подключение 
            специалистов нужного психотипа для разгрузки узкого места.
          </div>
        </div>
      )}
    </div>
  );
};
