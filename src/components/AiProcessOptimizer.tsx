import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Cpu, 
  Layers, 
  RefreshCw,
  Play,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { BusinessProcess, EcosystemContour } from '../types';

interface AiProcessOptimizerProps {
  processes: BusinessProcess[];
  activeContour: EcosystemContour;
  onOptimizeProcess: (processId: string, result: any) => void;
}

export const AiProcessOptimizer: React.FC<AiProcessOptimizerProps> = ({
  processes,
  activeContour,
  onOptimizeProcess
}) => {
  const [selectedProcess, setSelectedProcess] = useState<BusinessProcess>(processes[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'live_streams' | 'stage_inspector' | 'process_mining'>('live_streams');

  // Interactive custom process input
  const [processNameInput, setProcessNameInput] = useState(selectedProcess.name);
  const [bottleneckInput, setBottleneckInput] = useState(selectedProcess.bottleneck);
  const [targetGoalInput, setTargetGoalInput] = useState('Ускорение в 2.5 раза и снятие стресса согласующей стороны');

  const handleSelectProcess = (proc: BusinessProcess) => {
    setSelectedProcess(proc);
    setProcessNameInput(proc.name);
    setBottleneckInput(proc.bottleneck);
    setAiReport(null);
  };

  const handleRunProcessOptimization = async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/ai/analyze-processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processName: processNameInput,
          bottleneckStage: bottleneckInput,
          currentThroughput: selectedProcess.throughput,
          errorRate: '12.4%',
          targetGoal: targetGoalInput
        })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiReport(data.analysis);
      }
    } catch (err) {
      console.error('Error running process optimization:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyAutonomousOptimization = () => {
    if (!aiReport) return;
    onOptimizeProcess(selectedProcess.id, aiReport);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-sky-950/40 border border-sky-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Нейросетевая оптимизация процессов в реальном времени</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
              ИИ-Аналитика Бизнес-Процессов и Психодинамики
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Непрерывный мониторинг операционных потоков в контурах EthOSium. Модуль выявляет заторы, рассчитывает скрытое 
              психологическое давление на исполнителей и формирует автоматические перераспределения задач с нулевым временем простоя.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-sky-400 font-['Outfit']">140 мс</div>
              <div className="text-[11px] text-slate-400">Сквозная задержка</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400 font-['Outfit']">+185%</div>
              <div className="text-[11px] text-slate-400">Прирост пропускной спос.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('live_streams')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'live_streams'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Потоки в Реальном Времени</span>
        </button>

        <button
          onClick={() => setActiveTab('stage_inspector')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'stage_inspector'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Инспектор Этапов & Психологическая Нагрузка</span>
        </button>
      </div>

      {/* Main Process Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Process List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Активные процессы контура
            </h3>
            <span className="text-xs text-slate-400">{processes.length} отслеживаемых</span>
          </div>

          <div className="space-y-2.5">
            {processes.map((proc) => {
              const isSelected = selectedProcess.id === proc.id;
              return (
                <div
                  key={proc.id}
                  onClick={() => handleSelectProcess(proc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500/50 shadow-md shadow-sky-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      proc.status === 'optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      proc.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {proc.status === 'optimal' ? 'Оптимально' : 'Требует внимания'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{proc.throughput}</span>
                  </div>

                  <h4 className="text-sm font-medium text-white leading-snug line-clamp-2">
                    {proc.name}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Эффективность:</span>
                    <span className="font-bold text-sky-400">{proc.efficiencyScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Process Diagnostics & AI Lab */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Process Card Details */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400">Текущий анализ:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-medium">
                    Контур: {selectedProcess.contour}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedProcess.name}</h2>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Задержка цикла</div>
                  <div className="text-base font-bold text-white font-mono">{selectedProcess.latencyMs} мс</div>
                </div>
              </div>
            </div>

            {/* Stages Visual Flow */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Цепочка этапов бизнес-процесса:</span>
                <span>Узкое место выделено цветом</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedProcess.stages.map((stage, idx) => {
                  const isBottleneck = stage.dropoffRate > 10 || stage.psychologicalPressure > 6;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        isBottleneck
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">Этап #{idx + 1}</span>
                        {isBottleneck && (
                          <span className="text-[10px] text-amber-400 font-bold uppercase">Узкое место</span>
                        )}
                      </div>

                      <div className="font-semibold text-white leading-tight min-h-[32px]">
                        {stage.name}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>Длительность:</span>
                          <span className="text-slate-200 font-mono">{stage.durationMinutes} мин</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Психо-нагрузка:</span>
                          <span className={`font-semibold ${
                            stage.psychologicalPressure > 6 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {stage.psychologicalPressure}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Control Center */}
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white text-sm">
                    Параметры ИИ-оптимизации EthOSium
                  </span>
                </div>
                <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                  Нейро-ядро активно
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Выявленный барьер / Bottleneck:</label>
                  <input
                    type="text"
                    value={bottleneckInput}
                    onChange={(e) => setBottleneckInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Целевой критерий улучшения:</label>
                  <input
                    type="text"
                    value={targetGoalInput}
                    onChange={(e) => setTargetGoalInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                id="run-process-ai-btn"
                onClick={handleRunProcessOptimization}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ИИ анализирует задержки и психологические барьеры...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Запустить ИИ-Оптимизацию Процесса (Real-Time)</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Diagnosis Output */}
            {aiReport && (
              <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-sky-950/40 border border-sky-500/40 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-white text-sm">ИИ-Решение и План Перестроения</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    Ожидаемый эффект: {aiReport.estimatedGain}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <strong className="text-sky-300">Первопричина:</strong> {aiReport.primaryRootCause}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-200">Системные оптимизации в контуре:</div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiReport.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Автономное действие: <span className="text-indigo-300 font-medium">{aiReport.automatedAction}</span>
                  </div>
                  <button
                    onClick={handleApplyAutonomousOptimization}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Применить автономно в EthOSium</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
