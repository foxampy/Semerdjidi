import React from 'react';
import { 
  Layers, 
  BrainCircuit, 
  Sparkles, 
  Share2, 
  AppWindow, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Globe, 
  Activity,
  Cpu
} from 'lucide-react';
import { EcosystemContour, CompanyNode } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeContour: EcosystemContour;
  setActiveContour: (contour: EcosystemContour) => void;
  selectedCompany: CompanyNode;
  setSelectedCompany: (company: CompanyNode) => void;
  companies: CompanyNode[];
  isAiProcessing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeContour,
  setActiveContour,
  selectedCompany,
  setSelectedCompany,
  companies,
  isAiProcessing
}) => {
  const tabs = [
    { id: 'hub', label: 'Обзор Экосистемы', icon: Layers },
    { id: 'semerdjidi', label: 'Модуль Семерджиди', icon: BrainCircuit, highlight: true },
    { id: 'ai-analytics', label: 'ИИ-Аналитика Процессов', icon: Sparkles, highlight: true },
    { id: 'social', label: 'Соцсеть & Пульс', icon: Share2 },
    { id: 'apps', label: 'Контуры & Приложения', icon: AppWindow },
    { id: 'companies', label: 'Организации & Люди', icon: Building2 },
  ];

  const contourConfig: Record<EcosystemContour, { title: string; color: string; bg: string; icon: any; border: string }> = {
    public: {
      title: 'Публичный контур',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      icon: Globe
    },
    corporate: {
      title: 'Корпоративный контур',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      icon: ShieldCheck
    },
    sovereign: {
      title: 'Суверенный контур',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: Lock
    }
  };

  const currentContourInfo = contourConfig[activeContour];
  const ContourIcon = currentContourInfo.icon;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      {/* Top Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium tracking-wide">EthOSium Mesh: Активен</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Шлюз Семерджиди: <span className="text-indigo-300 font-medium">Синхронизирован</span></span>
          </div>

          {isAiProcessing && (
            <div className="flex items-center space-x-1.5 text-amber-300 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ИИ-оптимизация в реальном времени...</span>
            </div>
          )}
        </div>

        {/* Company and Contour Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-slate-400">Организация:</span>
            <select
              value={selectedCompany.id}
              onChange={(e) => {
                const found = companies.find(c => c.id === e.target.value);
                if (found) setSelectedCompany(found);
              }}
              className="bg-transparent text-slate-200 font-medium text-xs focus:outline-none cursor-pointer"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contour Switcher Pills */}
          <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
            {(['public', 'corporate', 'sovereign'] as EcosystemContour[]).map((c) => {
              const cfg = contourConfig[c];
              const isActive = activeContour === c;
              const Icon = cfg.icon;
              return (
                <button
                  key={c}
                  id={`contour-btn-${c}`}
                  onClick={() => setActiveContour(c)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive 
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} border shadow-sm` 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title={cfg.title}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{c === 'public' ? 'Публичный' : c === 'corporate' ? 'Корпоративный' : 'Суверенный'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('hub')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-sky-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                  EthOS<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">ium</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Единая операционная среда & модель Семерджиди
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-inner border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (tab.highlight ? 'text-indigo-400' : 'text-sky-400') : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Contour Status Pill & Security Badge */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${currentContourInfo.bg} ${currentContourInfo.border} ${currentContourInfo.color}`}>
              <ContourIcon className="w-4 h-4" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] opacity-75 uppercase tracking-wider">Текущий контур</div>
                <div className="font-semibold leading-tight">{currentContourInfo.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
