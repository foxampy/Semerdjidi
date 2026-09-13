import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface EthosiumNexusScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const EthosiumNexusScreen: React.FC<EthosiumNexusScreenProps> = ({ onNavigate }) => {
  const [zLevel, setZLevel] = useState<number>(3);
  const [breathPhase, setBreathPhase] = useState<'Вдох' | 'Пауза' | 'Выдох'>('Вдох');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'Вдох') return 'Пауза';
        if (prev === 'Пауза') return 'Выдох';
        return 'Вдох';
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* EthOSium 4D Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            EthOSium 4D Matrix
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">Резонанс 94.2%</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Живое Поле Осознания (Continuum)
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Синхронизация телесных, групповых и смысловых контуров
          </p>
        </div>

        {/* Z-Depth Continuum Controller */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#A9B489] font-bold">Глубина Z-оси:</span>
            <span className="font-bold text-[#BA9470]">Уровень L{zLevel}: {
              zLevel === 1 ? 'Физическое тело' :
              zLevel === 2 ? 'Вегетативный отклик' :
              zLevel === 3 ? 'Эмоциональный слой' :
              zLevel === 4 ? 'Групповое зеркало' :
              zLevel === 5 ? 'Родовые паттерны' : 'Чистый синтез'
            }</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {[1, 2, 3, 4, 5, 6].map(lvl => (
              <button
                key={lvl}
                onClick={() => setZLevel(lvl)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  zLevel === lvl ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/40' : 'neu-inset text-[#A9B489]'
                }`}
              >
                L{lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breathing Sphere / ДЫШИ 4:6 ритм */}
      <div className="neu-card-highlight rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-[#BA9470]/40 text-center">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470]">
          Центральный ритм заземления
        </span>

        {/* Pulsing Breathing Circle */}
        <div className="relative w-40 h-40 rounded-full neu-inset flex items-center justify-center border-2 border-[#BA9470]/40">
          <div
            className={`w-32 h-32 rounded-full neu-btn flex flex-col items-center justify-center border border-[#BA9470]/60 transition-all duration-1000 ${
              breathPhase === 'Вдох' ? 'scale-110 shadow-[0_0_20px_#BA9470]' : breathPhase === 'Пауза' ? 'scale-105' : 'scale-90 opacity-80'
            }`}
          >
            <span className="font-headline font-bold text-lg text-[#F0E2C8]">{breathPhase}</span>
            <span className="text-[10px] text-[#BA9470] uppercase font-semibold mt-0.5">Ритм 4-7-8</span>
          </div>
        </div>

        <p className="text-xs text-[#F0E2C8]/80 max-w-xs leading-relaxed">
          Синхронизируйте вдох и выдох с пульсацией сферы. Это активирует переднюю ветвь блуждающего нерва и снимает тревожность.
        </p>
      </div>

      {/* Synthesis of the User Request */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Синтез запроса поля</h3>
        <div className="neu-inset p-3 rounded-xl text-xs text-[#F0E2C8]/90 leading-relaxed border border-[#A9B489]/15">
          «Я постоянно устаю и всё время раздражаюсь на людей вокруг» ➔ <strong>Трансформация:</strong> Отказ от роли всемогущего спасателя, признание права на физический отдых и выход в тишину горных ретритов.
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onNavigate('retreats')}
            className="flex-1 py-2.5 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/30 active:scale-95"
          >
            Выбрать ретрит в горы
          </button>
          <button
            onClick={() => onNavigate('practices')}
            className="flex-1 py-2.5 neu-btn rounded-xl text-xs font-semibold text-[#F0E2C8] active:scale-95"
          >
            Аудиотека 432 Hz
          </button>
        </div>
      </div>
    </div>
  );
};
