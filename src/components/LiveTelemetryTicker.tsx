import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Sparkles, BrainCircuit } from 'lucide-react';
import { RealtimeTelemetryEvent, EcosystemContour } from '../types';

interface LiveTelemetryTickerProps {
  telemetry: RealtimeTelemetryEvent[];
  activeContour: EcosystemContour;
}

export const LiveTelemetryTicker: React.FC<LiveTelemetryTickerProps> = ({
  telemetry,
  activeContour
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (telemetry.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % telemetry.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [telemetry.length]);

  const currentEvent = telemetry[currentIndex] || telemetry[0];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 text-xs py-2 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live indicator and rotating ticker */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex items-center space-x-1.5 text-emerald-400 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">Real-Time Pulse</span>
          </div>

          <span className="text-slate-700 shrink-0">|</span>

          {currentEvent && (
            <div className="flex items-center space-x-2 truncate">
              <span className="text-slate-500 font-mono text-[11px] shrink-0">{currentEvent.timestamp}</span>
              <span className="text-slate-200 font-medium truncate">{currentEvent.title}:</span>
              <span className="text-slate-400 truncate hidden md:inline">{currentEvent.description}</span>
              {currentEvent.impactScore && (
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0">
                  {currentEvent.impactScore}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: System badges */}
        <div className="hidden sm:flex items-center space-x-3 shrink-0 text-[11px]">
          <div className="flex items-center space-x-1 text-slate-400">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            <span>Семерджиди: <strong className="text-purple-300 font-medium">96.8%</strong></span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Нейро-оптимизатор: <strong className="text-sky-300 font-medium">Активен</strong></span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Контур: <strong className="text-slate-200 capitalize font-medium">{activeContour}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
