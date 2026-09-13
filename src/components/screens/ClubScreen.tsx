import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface ClubScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ClubScreen: React.FC<ClubScreenProps> = ({ onNavigate }) => {
  const [isHalfYear, setIsHalfYear] = useState(false);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);

  const standardPrice = isHalfYear ? '$229' : '$45';
  const proPrice = isHalfYear ? '$485' : '$95';

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Club Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            Сезон 2026
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">142 резидента</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Закрытый Клуб Семерджиди
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Пространство постоянной глубинной поддержки, супервизий и закрытых встреч
          </p>
        </div>

        {/* Pricing Toggle: Monthly vs Half-Year (-15%) */}
        <div className="neu-inset p-1 rounded-xl flex items-center justify-between border border-[#A9B489]/15">
          <button
            onClick={() => setIsHalfYear(false)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              !isHalfYear ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489]'
            }`}
          >
            Помесячно
          </button>
          <button
            onClick={() => setIsHalfYear(true)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isHalfYear ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489]'
            }`}
          >
            <span>Полгода</span>
            <span className="text-[9px] bg-[#BA9470] text-[#404432] px-1.5 rounded-full font-extrabold">-15%</span>
          </button>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Plan 1: Standart */}
        <div className="neu-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-[#A9B489]/20">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#A9B489]">Базовое участие</span>
            <h3 className="font-headline font-bold text-base text-[#F0E2C8] mt-0.5">Клуб Стандарт</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline font-bold text-2xl text-[#BA9470]">{standardPrice}</span>
              <span className="text-[11px] text-[#A9B489]">{isHalfYear ? '/ 6 мес' : '/ мес'}</span>
            </div>
            <ul className="text-xs text-[#F0E2C8]/80 space-y-1.5 mt-3 neu-inset p-2.5 rounded-xl">
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> 2 закрытых Zoom-эфира с Екатериной ежемесячно</li>
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> Доступ к архиву из 84 лекций и медитаций</li>
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> Закрытый чат резидентов со взаимной поддержкой</li>
            </ul>
          </div>
          <button
            onClick={() => setSubscribedPlan('Стандарт')}
            className="w-full py-2.5 neu-btn rounded-xl text-xs font-bold text-[#F0E2C8] border border-[#A9B489]/30 hover:text-[#BA9470] active:scale-95 transition-all"
          >
            {subscribedPlan === 'Стандарт' ? 'Оформлено ✓' : 'Вступить в клуб'}
          </button>
        </div>

        {/* Plan 2: Pro + Supervisions */}
        <div className="neu-card-highlight rounded-2xl p-4 flex flex-col justify-between gap-3 border border-[#BA9470]/50 bg-gradient-to-b from-[#3c402f] to-[#473b2c]/40">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#BA9470]">Для практикующих</span>
              <span className="text-[9px] bg-[#BA9470]/20 text-[#BA9470] px-2 py-0.5 rounded-full font-bold">Pro</span>
            </div>
            <h3 className="font-headline font-bold text-base text-[#F0E2C8] mt-0.5">Клуб Pro + Супервизии</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline font-bold text-2xl text-[#BA9470]">{proPrice}</span>
              <span className="text-[11px] text-[#A9B489]">{isHalfYear ? '/ 6 мес' : '/ мес'}</span>
            </div>
            <ul className="text-xs text-[#F0E2C8]/85 space-y-1.5 mt-3 neu-inset p-2.5 rounded-xl">
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> Всё, что входит в «Стандарт»</li>
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> 2 ежемесячные групповые супервизии практики</li>
              <li className="flex items-center gap-1.5"><span className="text-[#BA9470]">✓</span> Приоритетная бронь на выездные ретриты FRACTAL (-20%)</li>
            </ul>
          </div>
          <button
            onClick={() => setSubscribedPlan('Pro')}
            className="w-full py-2.5 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 hover:text-[#F0E2C8] active:scale-95 transition-all shadow-md"
          >
            {subscribedPlan === 'Pro' ? 'Оформлено Pro ✓' : 'Выбрать Клуб Pro'}
          </button>
        </div>
      </div>

      {/* Schedule of Upcoming Club Events */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Расписание ближайших встреч</h3>
          <span className="text-[10px] text-[#A9B489]">Май – Июнь 2026</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#BA9470] font-bold block">18 мая • 19:30 (Online)</span>
              <span className="font-semibold text-[#F0E2C8]">Закрытый клинический консилиум: «Работа с паникой»</span>
            </div>
            <button className="px-2.5 py-1 rounded neu-btn text-[10px] text-[#BA9470] shrink-0">Zoom</button>
          </div>

          <div className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-[#A9B489] font-bold block">24 мая • 16:00 (Ташкент)</span>
              <span className="font-semibold text-[#F0E2C8]">Очный чайный круг и телесная интеграция в резиденции</span>
            </div>
            <button className="px-2.5 py-1 rounded neu-btn text-[10px] text-[#F0E2C8] shrink-0">Очно</button>
          </div>
        </div>
      </div>
    </div>
  );
};
