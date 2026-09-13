import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface LearningScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const LearningScreen: React.FC<LearningScreenProps> = ({ onNavigate }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState<Record<string, boolean>>({
    course1: true,
  });

  const handlePurchase = (id: string, name: string) => {
    setPurchasedCourses(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Student Profile & Progress Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            Кабинет резидента
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">Поток весна 2026</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Академия &amp; Программы Обучения
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Сертификационные курсы, клинические супервизии и методические воркбуки
          </p>
        </div>

        {/* Current Active Module */}
        <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#F0E2C8]">Модуль 4 из 6: «Телесный ответ и регуляция аффекта»</span>
            <span className="text-[#BA9470] font-bold">65%</span>
          </div>
          <div className="h-1.5 w-full bg-[#2d3023] rounded-full overflow-hidden flex items-center p-0.5">
            <div className="h-1 bg-[#BA9470] rounded-full w-[65%] shadow-[0_0_6px_#BA9470]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#A9B489] pt-0.5">
            <span>Куратор: Екатерина Семерджиди</span>
            <span>Следующий вебинар: Четверг 19:00</span>
          </div>
        </div>
      </div>

      {/* Audio Widget for Learning */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#BA9470]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">graphic_eq</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Медитация заземления резидента (4-7-8)</h3>
          </div>
          <span className="text-[10px] font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded">07:15</span>
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
              <span>Протокол входа в учебный фокус</span>
              <span className="text-[#F0E2C8]">{isPlayingAudio ? '02:45 / 07:15' : '07:15'}</span>
            </div>
            <div className="h-1.5 w-full bg-[#2d3023] rounded-full overflow-hidden flex items-center p-0.5">
              <div 
                className="h-1 bg-[#BA9470] rounded-full transition-all"
                style={{ width: isPlayingAudio ? '40%' : '10%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Programs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Программы института</h2>
          <span className="text-[10px] text-[#A9B489]">Аккредитация EAP</span>
        </div>

        {/* Course 1 */}
        <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#BA9470] neu-inset px-2 py-0.5 rounded">Флагманский курс</span>
              <h3 className="font-headline font-bold text-base text-[#F0E2C8] mt-1">
                Интегративная нейротрансформация (250 ак. часов)
              </h3>
              <p className="text-xs text-[#A9B489] mt-0.5">
                Глубинный протокол работы с травмой развития и телесными зажимами
              </p>
            </div>
            <span className="font-headline font-bold text-base text-[#BA9470]">$1,200</span>
          </div>

          <div className="neu-inset p-3 rounded-xl text-xs text-[#F0E2C8]/85 space-y-1">
            <p>• 6 очных модулей в Ташкенте или онлайн с синхронным переводом.</p>
            <p>• 40 часов супервизий с Екатериной Семерджиди.</p>
            <p>• Диплом европейского образца и включение в каталог резидентов.</p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#A9B489]">Старт группы: 1 июня 2026</span>
            <button 
              onClick={() => handlePurchase('course1', 'Интегративная нейротрансформация')}
              className="px-4 py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 hover:text-[#F0E2C8] active:scale-95"
            >
              {purchasedCourses['course1'] ? 'Вы зачислены ✓' : 'Подать заявку ($1,200)'}
            </button>
          </div>
        </div>

        {/* Course 2: Workbooks Store */}
        <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#A9B489] neu-inset px-2 py-0.5 rounded">Методические материалы</span>
              <h3 className="font-headline font-bold text-base text-[#F0E2C8] mt-1">
                Цифровые воркбуки для психологов &amp; клиентов
              </h3>
              <p className="text-xs text-[#A9B489] mt-0.5">
                Практические тетради самопознания и психоэмоционального трекинга
              </p>
            </div>
            <span className="font-headline font-bold text-base text-[#BA9470]">$25 / шт</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="neu-inset p-2.5 rounded-xl flex flex-col justify-between gap-1.5">
              <span className="font-semibold text-[#F0E2C8]">Воркбук «Точка Сборки FRACTAL»</span>
              <span className="text-[10px] text-[#A9B489]">Стр. 1–64 с упражнениями</span>
              <button 
                onClick={() => onNavigate('workbook')}
                className="mt-1 py-1 rounded neu-btn text-[10px] font-bold text-[#BA9470] text-center"
              >
                Открыть воркбук
              </button>
            </div>
            <div className="neu-inset p-2.5 rounded-xl flex flex-col justify-between gap-1.5">
              <span className="font-semibold text-[#F0E2C8]">Гид «Регуляция блуждающего нерва»</span>
              <span className="text-[10px] text-[#A9B489]">28 практических техник</span>
              <button 
                onClick={() => onNavigate('practices')}
                className="mt-1 py-1 rounded neu-btn text-[10px] font-bold text-[#A9B489] text-center"
              >
                К аудиотеке
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
