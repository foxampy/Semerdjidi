import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { authService } from '../../services/authService';

interface BaselineScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const BaselineScreen: React.FC<BaselineScreenProps> = ({ onNavigate }) => {
  const [sliders, setSliders] = useState({
    anxiety: 7,
    muscleTension: 8,
    controlNeed: 9,
    isolation: 6,
    selfConnection: 4,
    clarity: 5,
    vitalEnergy: 5,
  });

  const [luggageChecklist, setLuggageChecklist] = useState<Record<string, boolean>>({
    boots: true,
    windbreaker: true,
    swimwear: true,
    sunglasses: false,
    bottle: true,
    offlinePlayer: true,
  });

  const [eveningReflection, setEveningReflection] = useState({
    left: 'Желание контролировать каждую мелочь в чате проекта.',
    gone: 'Паника перед неопределенностью горного маршрута.',
    came: 'Приятное тепло в стопах и готовность слушать тишину.',
  });

  const [saveStatus, setSaveStatus] = useState(false);

  const handleSliderChange = (key: keyof typeof sliders, val: number) => {
    setSliders(prev => ({ ...prev, [key]: val }));
  };

  const toggleLuggage = (key: string) => {
    setLuggageChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAll = () => {
    authService.saveUserBaseline({
      sliders,
      luggageChecklist,
      eveningReflection,
    });
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Group & Readiness Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            D-3 до заезда
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">Готовность 85%</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            С чем я приезжаю? (Baseline)
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Малая группа №4 • Фасилитатор: Анна • 10 участников
          </p>
        </div>

        <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 leading-relaxed">
          Этот замер фиксирует ваше исходное психоэмоциональное состояние и телесный тонус перед выездом в Чимган. В конце 7-го дня интеграции мы сопоставим показатели.
        </div>
      </div>

      {/* 7 Interactive Sliders */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">tune</span>
            <h2 className="font-headline font-semibold text-sm text-[#F0E2C8]">7 шкал самочувствия</h2>
          </div>
          <span className="text-[10px] text-[#A9B489]">От 1 до 10</span>
        </div>

        <div className="space-y-3.5">
          {/* Slider 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">1. Фоновая тревога</span>
              <span className="font-bold text-[#BA9470]">{sliders.anxiety} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.anxiety} 
              onChange={(e) => handleSliderChange('anxiety', Number(e.target.value))} 
            />
          </div>

          {/* Slider 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">2. Мышечное напряжение (шея/челюсти)</span>
              <span className="font-bold text-[#BA9470]">{sliders.muscleTension} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.muscleTension} 
              onChange={(e) => handleSliderChange('muscleTension', Number(e.target.value))} 
            />
          </div>

          {/* Slider 3 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">3. Потребность все контролировать</span>
              <span className="font-bold text-[#BA9470]">{sliders.controlNeed} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.controlNeed} 
              onChange={(e) => handleSliderChange('controlNeed', Number(e.target.value))} 
            />
          </div>

          {/* Slider 4 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">4. Чувство внутренней изоляции</span>
              <span className="font-bold text-[#BA9470]">{sliders.isolation} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.isolation} 
              onChange={(e) => handleSliderChange('isolation', Number(e.target.value))} 
            />
          </div>

          {/* Slider 5 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">5. Связанность с собственным телом</span>
              <span className="font-bold text-[#A9B489]">{sliders.selfConnection} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.selfConnection} 
              onChange={(e) => handleSliderChange('selfConnection', Number(e.target.value))} 
            />
          </div>

          {/* Slider 6 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">6. Ясность долгосрочных целей</span>
              <span className="font-bold text-[#A9B489]">{sliders.clarity} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.clarity} 
              onChange={(e) => handleSliderChange('clarity', Number(e.target.value))} 
            />
          </div>

          {/* Slider 7 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#F0E2C8]">7. Уровень жизненной энергии</span>
              <span className="font-bold text-[#BA9470]">{sliders.vitalEnergy} / 10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={sliders.vitalEnergy} 
              onChange={(e) => handleSliderChange('vitalEnergy', Number(e.target.value))} 
            />
          </div>
        </div>
      </div>

      {/* Checklist Bagazh v Gory */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">hiking</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Чек-лист экипировки в горы</h3>
          </div>
          <span className="text-[10px] text-[#A9B489]">Чимган &amp; Чарвак</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'boots', label: 'Треккинговая обувь' },
            { id: 'windbreaker', label: 'Ветрозащитная куртка' },
            { id: 'swimwear', label: 'Купальник / плавки для SUP' },
            { id: 'sunglasses', label: 'Очки и солнцезащитный крем' },
            { id: 'bottle', label: 'Бутылка для воды (1 л)' },
            { id: 'offlinePlayer', label: 'Наушники для аудиопрактик' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => toggleLuggage(item.id)}
              className={`p-2 rounded-xl text-left flex items-center gap-2 border transition-all ${
                luggageChecklist[item.id]
                  ? 'neu-pill-active border-[#BA9470]/40 text-[#F0E2C8]'
                  : 'neu-inset border-[#A9B489]/15 text-[#A9B489]/70'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#BA9470]">
                {luggageChecklist[item.id] ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Evening Check-in before Sleep */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">
          Ночной чекин: «Что осталось? Что ушло? Что пришло?»
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-[#BA9470] uppercase block mb-1">Что осталось во мне?</label>
            <input 
              type="text" 
              value={eveningReflection.left} 
              onChange={(e) => setEveningReflection({ ...eveningReflection, left: e.target.value })}
              className="w-full neu-inset rounded-xl px-3 py-2 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#A9B489] uppercase block mb-1">Что ушло сегодня?</label>
            <input 
              type="text" 
              value={eveningReflection.gone} 
              onChange={(e) => setEveningReflection({ ...eveningReflection, gone: e.target.value })}
              className="w-full neu-inset rounded-xl px-3 py-2 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none" 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#F0E2C8] uppercase block mb-1">Что новое пришло на освободившееся место?</label>
            <input 
              type="text" 
              value={eveningReflection.came} 
              onChange={(e) => setEveningReflection({ ...eveningReflection, came: e.target.value })}
              className="w-full neu-inset rounded-xl px-3 py-2 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none" 
            />
          </div>
        </div>

        <button 
          onClick={handleSaveAll}
          className="w-full py-3 neu-btn rounded-xl font-bold text-xs text-[#BA9470] border border-[#BA9470]/40 mt-1 active:scale-95 transition-all"
        >
          {saveStatus ? 'Baseline сохранён в профиле ретрита ✓' : 'Зафиксировать Baseline замер'}
        </button>
      </div>
    </div>
  );
};
