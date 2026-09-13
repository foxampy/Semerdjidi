import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface IntegrationScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const IntegrationScreen: React.FC<IntegrationScreenProps> = ({ onNavigate }) => {
  const [activeDay, setActiveDay] = useState<number>(3);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reflectionText, setReflectionText] = useState(
    'Сегодня утром в офисе во время жестких переговоров впервые заметил, как сжались челюсти. Вспомнил звук водопада в Чимгане, сделал выдох через приоткрытый рот — напряжение спало на 50%.'
  );
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeDaysExperiment, setActiveDaysExperiment] = useState<Record<string, boolean>>({
    'ПН': true,
    'ВТ': true,
    'СР': true,
    'ЧТ': false,
    'ПТ': false,
    'СБ': false,
    'ВС': false,
  });

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const toggleDayExp = (day: string) => {
    setActiveDaysExperiment(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Header & Progress */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            FRACTAL Digital Follow-up
          </span>
          <span className="text-xs font-bold text-[#F0E2C8]">42% завершено</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Капля возвращается в город
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            День 3 из 7 • Проверка устойчивости обнаруженных опор в реальном ритме
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-[#2d3023] rounded-full overflow-hidden flex items-center p-0.5 neu-inset">
          <div className="h-1 bg-gradient-to-r from-[#A9B489] to-[#BA9470] rounded-full shadow-[0_0_8px_#BA9470] w-[42%]"></div>
        </div>

        {/* 7 Days Timeline Buttons */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {[1, 2, 3, 4, 5, 6, 7].map(d => {
            const isCur = activeDay === d;
            const isPast = d < 3;
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 transition-all ${
                  isCur
                    ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/50 shadow'
                    : isPast
                    ? 'neu-btn text-[#A9B489]'
                    : 'neu-inset text-[#A9B489]/50'
                }`}
              >
                <span className="text-[9px] uppercase font-medium">Д{d}</span>
                <span>{isPast ? '✓' : d}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Letter to Myself from Retreat Campus */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">mail</span>
            <h2 className="font-headline font-semibold text-sm text-[#F0E2C8]">Письмо себе из кампуса</h2>
          </div>
          <span className="text-[10px] text-[#A9B489]">Написано 16 мая</span>
        </div>
        <p className="text-xs text-[#F0E2C8]/85 italic leading-relaxed bg-[#353928] p-3 rounded-xl border border-[#A9B489]/15">
          «Помни, как спокойно было на закате у Чарвака, когда ты просто сидел на доске и не пытался грести вперед. Ты не обязан спасать проект ценой собственной бессонницы. Дыши животом, когда мир начинает давить».
        </p>
      </div>

      {/* Daily Voice Note from Ekaterina */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#A9B489]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center font-headline font-bold text-xs text-[#BA9470] border border-[#BA9470]/30">
              ЕС
            </div>
            <div>
              <span className="text-xs font-bold text-[#F0E2C8] block">Голосовая заметка Екатерины</span>
              <span className="text-[10px] text-[#A9B489]">«Когда город проверяет опору»</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-full">03:42</span>
        </div>

        <div className="neu-inset p-3 rounded-xl flex items-center gap-3 border border-[#A9B489]/15">
          <button 
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-10 h-10 rounded-full neu-btn text-[#BA9470] flex items-center justify-center shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isPlayingAudio ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] text-[#A9B489] mb-1">
              <span>Слушать рекомендацию дня</span>
              <span className="text-[#F0E2C8]">{isPlayingAudio ? '01:15 / 03:42' : '03:42'}</span>
            </div>
            <div className="h-1.5 w-full bg-[#2d3023] rounded-full overflow-hidden flex items-center p-0.5">
              <div 
                className="h-1 bg-[#BA9470] rounded-full transition-all"
                style={{ width: isPlayingAudio ? '35%' : '10%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Question of the Day & Reflection Input */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">help_outline</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Вопрос Дня #{activeDay}</h3>
          </div>
          <span className="text-[10px] text-[#A9B489] uppercase font-bold">Рефлексия</span>
        </div>

        <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15">
          <p className="text-xs font-medium text-[#F0E2C8] leading-snug">
            «В какой момент сегодня старый паттерн попытался взять управление? Что конкретно его запустило?»
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider font-bold text-[#A9B489]">Мой дневник осознания:</label>
          <textarea 
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={4}
            className="w-full neu-inset rounded-xl p-3 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none focus:border-[#BA9470] resize-none leading-relaxed"
            placeholder="Зафиксируйте телесные ощущения и контекст ситуации..."
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button className="flex items-center gap-1.5 text-xs text-[#A9B489] hover:text-[#BA9470]">
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>Записать аудио-ответ</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 hover:text-[#F0E2C8] active:scale-95 transition-all"
          >
            {savedNotice ? 'Сохранено ✓' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Experiment of the Week */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Один эксперимент недели</h3>
          <span className="text-[10px] font-bold text-[#A9B489] uppercase">Практика в действии</span>
        </div>

        <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
          <strong>«Пауза перед согласием»:</strong> Прежде чем сказать «Да» на любую просьбу или задачу по работе, сделайте 3 осознанных выдоха и спросите себя: «Есть ли у меня на это реальный телесный ресурс?»
        </p>

        <div className="flex items-center justify-between gap-1.5 pt-1">
          {Object.entries(activeDaysExperiment).map(([day, checked]) => (
            <button
              key={day}
              onClick={() => toggleDayExp(day)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                checked
                  ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/50'
                  : 'neu-inset text-[#A9B489]/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
