import React, { useState } from 'react';
import {
  INVESTMENT_ROUNDS,
  FINANCIAL_PROJECTIONS,
  INVESTOR_TIERS,
  InvestmentRound,
  InvestorTier
} from '../../data/strategyRoadmapData';
import { StrategyModalContent } from './StrategyDetailModal';

// Generated growth investment image
import investGrowthImage from '../../assets/images/ethosium_invest_growth_1789034279536.jpg';

interface InvestmentPlanWidgetProps {
  onOpenModal: (content: StrategyModalContent) => void;
}

export const InvestmentPlanWidget: React.FC<InvestmentPlanWidgetProps> = ({
  onOpenModal
}) => {
  const [selectedRoundId, setSelectedRoundId] = useState<string>('round-seed');
  const [ticketSlider, setTicketSlider] = useState<number>(25000);

  const activeRound = INVESTMENT_ROUNDS.find(r => r.id === selectedRoundId) || INVESTMENT_ROUNDS[1];

  // Simulator calculations based on Seed SAFE at $4.5M pre-money
  const estimatedEquityPercent = Math.round((ticketSlider / (4500000 + 650000)) * 100 * 100) / 100;
  const tokenBonus = ticketSlider * 1.5; // 1.5 EthOS Credits per $1 invested
  const est2030ValuationUsd = 60000000; // $60M conservative valuation in 2030
  const estimatedValue2030Usd = Math.round((estimatedEquityPercent / 100) * est2030ValuationUsd);
  const estimatedMultiple = Math.round((estimatedValue2030Usd / ticketSlider) * 10) / 10;

  const currentTier = ticketSlider >= 100000 
    ? INVESTOR_TIERS[2] 
    : ticketSlider >= 25000 
      ? INVESTOR_TIERS[1] 
      : INVESTOR_TIERS[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Hero: Seed Round Pitch */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/30 bg-[#363a28] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#BA9470]">trending_up</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                Пошаговый Инвестиционный План
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                Seed Round Открыт
              </span>
            </div>
            <h2 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] leading-tight">
              Инвестируйте в Первую Human OS Центральной Азии
            </h2>
            <p className="text-xs sm:text-sm text-[#E2ECD2]/85 leading-relaxed font-light">
              Рынок осознанности, соматического здоровья и детокса растет на 24% год к году. EthOSium объединяет высокомаржинальные горные ретриты, сеть 50 специалистов и цифровой SaaS в устойчивую экосистему с защитой капитала.
            </p>
          </div>

          {/* Seed Round Progress Box */}
          <div className="neu-inset p-4 rounded-2xl border border-[#BA9470]/30 w-full lg:w-80 space-y-3 bg-[#2b2e1e]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A9B489] font-mono">Прогресс Seed Round:</span>
              <span className="font-mono font-bold text-emerald-400">$210k из $650k</span>
            </div>

            <div className="w-full bg-[#1e2014] h-2.5 rounded-full overflow-hidden border border-[#A9B489]/20">
              <div 
                className="h-full bg-gradient-to-r from-[#BA9470] to-emerald-400 rounded-full"
                style={{ width: `${(210000 / 650000) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#A9B489]">
              <span>Мин. чек: <strong>$10,000</strong></span>
              <span>Аллокация: <strong>32.3% собрано</strong></span>
            </div>

            <button
              onClick={() => onOpenModal({
                type: 'invest_contact',
                title: 'Запрос на участие в Seed Round',
                subtitle: 'Зарезервируйте аллокацию в синдикате или запросите Data Room / SAFE соглашение.',
                initialTicket: ticketSlider
              })}
              className="w-full neu-btn py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470]/70 hover:bg-[#BA9470]/50 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              Запросить аллокацию &amp; Pitch Deck
            </button>
          </div>
        </div>

        {/* 3 Rounds Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#A9B489]/15">
          {INVESTMENT_ROUNDS.map((r) => {
            const isSelected = r.id === selectedRoundId;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRoundId(r.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'neu-pill-active border-[#BA9470]/70 shadow-lg'
                    : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    r.status === 'completed'
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : r.status === 'open'
                        ? 'text-amber-400 bg-amber-950/60 animate-pulse'
                        : 'text-sky-400 bg-sky-950/60'
                  }`}>
                    {r.status === 'completed' ? 'Закрыт' : r.status === 'open' ? 'Идет сбор' : '2028'}
                  </span>
                  <span className="text-[10px] font-mono text-[#A9B489]">
                    {r.timeline.split('(')[0]}
                  </span>
                </div>

                <div>
                  <h4 className="font-headline font-bold text-sm text-[#F0E2C8]">
                    {r.name}
                  </h4>
                  <span className="font-mono text-base font-bold text-emerald-400 block mt-0.5">
                    ${(r.targetAmountUsd / 1000).toFixed(0)}k USD
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A9B489] pt-1 border-t border-[#A9B489]/10">
                  <span>Pre-money: ${(r.valuationPreUsd / 1000000).toFixed(1)}M</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModal({ type: 'round', data: r });
                    }}
                    className="text-[#BA9470] hover:underline"
                  >
                    Анализ →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- INTERACTIVE INVESTMENT SIMULATOR ---------------- */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/30 bg-[#353826] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#BA9470]">calculate</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold">
                Интерактивный Калькулятор Ангела
              </span>
            </div>
            <h3 className="font-headline font-bold text-lg text-[#F0E2C8] mt-0.5">
              Моделирование Доли &amp; Доходности к 2030 Году
            </h3>
          </div>
          <span className="text-xs text-[#A9B489] font-mono">
            Оценка SAFE: $4.5M pre-money
          </span>
        </div>

        {/* Slider */}
        <div className="neu-inset p-4 sm:p-5 rounded-2xl space-y-3 bg-[#2a2d1e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-[#A9B489]">Выберите размер вашего инвестиционного чека:</span>
            <div className="font-mono font-bold text-xl sm:text-2xl text-emerald-400">
              ${ticketSlider.toLocaleString()} USD
            </div>
          </div>

          <input
            type="range"
            min="10000"
            max="150000"
            step="5000"
            value={ticketSlider}
            onChange={(e) => setTicketSlider(Number(e.target.value))}
            className="w-full accent-[#BA9470] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-[#A9B489]">
            <span>$10,000 (Supporter)</span>
            <span>$25,000 (Angel)</span>
            <span>$50,000 (Partner)</span>
            <span>$100,000+ (Strategic Lead)</span>
          </div>
        </div>

        {/* Calculated Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-[#A9B489] uppercase block">Расчетная доля SAFE</span>
            <span className="font-mono font-bold text-lg text-[#FFFDF8] mt-0.5 block">
              {estimatedEquityPercent}%
            </span>
            <span className="text-[9px] text-[#A9B489]">+ 20% дисконт к Series A</span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-[#A9B489] uppercase block">Бонус EthOS Credits</span>
            <span className="font-mono font-bold text-lg text-[#BA9470] mt-0.5 block">
              {tokenBonus.toLocaleString()}
            </span>
            <span className="text-[9px] text-[#A9B489]">Баллы на ретриты &amp; лаунж</span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-[#A9B489] uppercase block">Оценка доли в 2030 г.</span>
            <span className="font-mono font-bold text-lg text-emerald-400 mt-0.5 block">
              ${(estimatedValue2030Usd / 1000).toFixed(0)}k USD
            </span>
            <span className="text-[9px] text-[#A9B489]">При капитализации $60M</span>
          </div>

          <div className="neu-inset p-3.5 rounded-2xl text-center">
            <span className="text-[10px] font-mono text-[#A9B489] uppercase block">Прогнозируемый ROI</span>
            <span className="font-mono font-bold text-lg text-sky-400 mt-0.5 block">
              {estimatedMultiple}x
            </span>
            <span className="text-[9px] text-[#A9B489]">Горизонт 4.5 года</span>
          </div>
        </div>

        {/* Investor Tier Match */}
        <div className="neu-card p-4 rounded-2xl border border-[#BA9470]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#3a3e2a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#BA9470]">verified</span>
              <span className="text-xs font-bold text-[#F0E2C8]">
                Ваш статус: {currentTier.name}
              </span>
            </div>
            <p className="text-xs text-[#E2ECD2]/80 mt-1">
              Включает: {currentTier.perks.slice(0, 2).join(' • ')}
            </p>
          </div>

          <button
            onClick={() => onOpenModal({ type: 'tier', data: currentTier })}
            className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/50 shrink-0 self-start sm:self-auto"
          >
            Все привилегии тира →
          </button>
        </div>
      </div>

      {/* ---------------- 5-YEAR FINANCIAL PROJECTIONS TABLE ---------------- */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#A9B489]/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
              Финансовый Прогноз (Conservative Baseline)
            </span>
            <h3 className="font-headline font-bold text-lg text-[#F0E2C8]">
              Динамика Выручки, EBITDA &amp; Резидентов (2026–2030)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            EBITDA-позитивно с Q4 2026
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#A9B489]/20 font-mono text-[#A9B489] text-[11px]">
                <th className="py-2.5 px-3">Год</th>
                <th className="py-2.5 px-3">Выручка (Gross)</th>
                <th className="py-2.5 px-3">COGS (Себестоимость)</th>
                <th className="py-2.5 px-3">EBITDA</th>
                <th className="py-2.5 px-3">Ретрит-гости</th>
                <th className="py-2.5 px-3">Активные резиденты</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A9B489]/10 font-mono">
              {FINANCIAL_PROJECTIONS.map((row) => (
                <tr key={row.year} className="hover:bg-[#2d3020]/50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#F0E2C8]">{row.year}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">${(row.revenueUsd / 1000).toLocaleString()}k</td>
                  <td className="py-2.5 px-3 text-[#A9B489]">${(row.cogsUsd / 1000).toLocaleString()}k</td>
                  <td className="py-2.5 px-3 font-bold text-[#BA9470]">${(row.ebitdaUsd / 1000).toLocaleString()}k</td>
                  <td className="py-2.5 px-3 text-[#FFFDF8]">{row.retreatGuests} чел</td>
                  <td className="py-2.5 px-3 text-sky-400">{row.activeResidents.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- 3 INVESTOR TIERS DETAILED CARDS ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold">
            Инвесторские Пакеты Синдиката
          </span>
          <span className="text-xs text-[#A9B489] font-mono">
            Прямое соглашение SAFE / Convertible Note
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {INVESTOR_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => onOpenModal({ type: 'tier', data: tier })}
              className="neu-card rounded-2xl p-4 sm:p-5 border border-[#A9B489]/20 hover:border-[#BA9470]/60 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-md border border-[#BA9470]/30">
                    Чек от ${tier.ticketUsd.toLocaleString()}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#A9B489] group-hover:text-[#BA9470] transition-colors">
                    military_tech
                  </span>
                </div>

                <h4 className="font-headline font-bold text-base text-[#F0E2C8] group-hover:text-[#FFFDF8]">
                  {tier.name}
                </h4>

                <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                  {tier.equityTokensPct}
                </span>

                <ul className="space-y-1.5 mt-3">
                  {tier.perks.slice(0, 3).map((p, idx) => (
                    <li key={idx} className="text-xs text-[#E2ECD2]/80 flex items-start gap-1.5 line-clamp-1">
                      <span className="material-symbols-outlined text-[13px] text-emerald-400 shrink-0 mt-0.5">check</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#A9B489]/15 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#A9B489]">
                  {tier.governanceRole.split('&')[0]}
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
