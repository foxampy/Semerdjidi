import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface WorkbookScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const WorkbookScreen: React.FC<WorkbookScreenProps> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState<number>(56);
  const [notes, setNotes] = useState<Record<number, string>>({
    56: 'В автобусе из Ташкента почувствовал, насколько сильно устал мозг от рабочих дедлайнов. Хочется просто тишины.',
    57: 'У воды Чарвака впервые за полгода услышал свое дыхание.',
    58: 'На подъеме к водопаду тело включилось. Ноги гудят, но в голове стало чисто.',
    60: 'Баланс на SUP-борде: чем сильнее пытаешься все контролировать силой мышц, тем сильнее качает доску. Нужно расслабить колени.',
    62: 'Круг 1 (контролирую): только мой выдох и мое внимание. Все остальное — иллюзия власти.',
    63: 'Паттерн: спешка ➔ спазм в животе ➔ крик на подчиненных ➔ стыд.',
    64: 'Фрактал: если я спокоен внутри, моя семья и команда выравниваются автоматически.',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleTextChange = (val: string) => {
    setNotes({ ...notes, [currentPage]: val });
  };

  const handleSavePage = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Workbook Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            FRACTAL Notebook
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">Стр. 56–64</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Цифровой рабочий блокнот
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Точная реплика физического воркбука ретрита FRACTAL
          </p>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[56, 57, 58, 60, 62, 63, 64].map(p => {
            const isCur = currentPage === p;
            return (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isCur
                    ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/50 shadow'
                    : 'neu-btn text-[#A9B489]'
                }`}
              >
                Стр. {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Content Renderer */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#A9B489]/20 min-h-[380px]">
        {currentPage === 56 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел I: Дорога • Стр. 56</span>
              <span className="text-[10px] text-[#A9B489]">Трансфер Ташкент-Чимган</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              5 минут без цензуры &amp; 3 аудио-фазы
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              Выпишите всё, что крутится в голове прямо сейчас: незавершенные дела, страхи, раздражение, ожидания. Не редактируйте. Бумага выдержит всё.
            </p>
          </>
        )}

        {currentPage === 57 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел II: Вода • Стр. 57</span>
              <span className="text-[10px] text-[#A9B489]">Нулевая точка</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              2 вопроса заземления у кромки Чарвака
            </h2>
            <div className="neu-inset p-3 rounded-xl text-xs text-[#F0E2C8] space-y-1">
              <p>1. Что произойдет с миром, если я сейчас на 2 часа отключу телефон?</p>
              <p>2. Какая температура у моих ладоней в эту секунду?</p>
            </div>
          </>
        )}

        {currentPage === 58 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел III: Горы • Стр. 58</span>
              <span className="text-[10px] text-[#A9B489]">Выбить шум</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              4 остановки пешего маршрута к водопаду
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              Фиксация дыхания на подъеме. На какой остановке дыхание перестало сбиваться?
            </p>
          </>
        )}

        {currentPage === 60 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел V: Глубина SUP • Стр. 60</span>
              <span className="text-[10px] text-[#A9B489]">Чарвакское зеркало</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Капля-Волна-Озеро-Фрактал &amp; Карта страха
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              Золотое сечение баланса на доске: физическая опора стоп отражает ментальную устойчивость к внешней турбулентности.
            </p>
          </>
        )}

        {currentPage === 62 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел VII: Контроль • Стр. 62</span>
              <span className="text-[10px] text-[#A9B489]">Три круга внимания</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Круг 1: Контролирую • Круг 2: Влияю • Круг 3: Принимаю
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              Распределите свои текущие рабочие задачи по трем этим категориям.
            </p>
          </>
        )}

        {currentPage === 63 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел VIII: Схема паттерна • Стр. 63</span>
              <span className="text-[10px] text-[#A9B489]">6 звеньев цепи</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Стимул ➔ Оценка ➔ Тело ➔ Эмоция ➔ Реакция ➔ Последствие
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              В каком звене легче всего сделать паузу для нового выбора?
            </p>
          </>
        )}

        {currentPage === 64 && (
          <>
            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
              <span className="text-xs font-bold uppercase text-[#BA9470]">Раздел IX: Фрактал • Стр. 64</span>
              <span className="text-[10px] text-[#A9B489]">Завершающий синтез</span>
            </div>
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Я ➔ Семья ➔ Отношения ➔ Работа ➔ Общество
            </h2>
            <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
              Какое одно маленькое изменение в моем теле трансформирует всю цепочку связей?
            </p>
          </>
        )}

        {/* User Notepad Field */}
        <div className="flex flex-col gap-1 mt-2 flex-1">
          <label className="text-[10px] uppercase font-bold text-[#A9B489]">
            Мои записи на странице {currentPage}:
          </label>
          <textarea
            value={notes[currentPage] || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
            placeholder="Пишите здесь свои мысли, инсайты и телесные отклики..."
            className="w-full flex-1 neu-inset rounded-xl p-3 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none focus:border-[#BA9470] resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/15">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 56}
              onClick={() => setCurrentPage(p => Math.max(56, p - 1))}
              className="px-3 py-1.5 neu-btn rounded-xl text-xs font-semibold text-[#A9B489] disabled:opacity-30 active:scale-95"
            >
              ← Назад
            </button>
            <button
              disabled={currentPage >= 64}
              onClick={() => setCurrentPage(p => Math.min(64, p + 1))}
              className="px-3 py-1.5 neu-btn rounded-xl text-xs font-semibold text-[#A9B489] disabled:opacity-30 active:scale-95"
            >
              Вперёд →
            </button>
          </div>
          <button
            onClick={handleSavePage}
            className="px-4 py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 active:scale-95 transition-all"
          >
            {isSaved ? 'Сохранено ✓' : 'Сохранить запись'}
          </button>
        </div>
      </div>
    </div>
  );
};
