import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface ReflectionReportScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ReflectionReportScreen: React.FC<ReflectionReportScreenProps> = ({ onNavigate }) => {
  const [isPlayingPractice, setIsPlayingPractice] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Participant Header Card */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            FRACTAL #FR-2026-084
          </span>
          <span className="text-[11px] text-[#A9B489]">14–16 мая 2026</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Персональный отчет рефлексии
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Участник: Алексей Н. • Малая группа №4 • Фасилитатор: Анна
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#A9B489]/15">
          <div className="neu-inset p-2 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block">Маршрут</span>
            <span className="text-xs font-bold text-[#F0E2C8]">Чимган-Чарвак</span>
          </div>
          <div className="neu-inset p-2 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block">Формат</span>
            <span className="text-xs font-bold text-[#BA9470]">2,5 дня + 7 дн</span>
          </div>
          <div className="neu-inset p-2 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block">Статус</span>
            <span className="text-xs font-bold text-[#A9B489]">Завершено</span>
          </div>
        </div>
      </div>

      {/* 9 Key Structured Modules with Neumorphic Accordions */}
      <div className="space-y-2.5">
        {/* Module 1 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all" open>
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">1</span>
              <span>Основные наблюдаемые темы</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>• Постоянный фоновый мониторинг внешней среды и распределения внимания окружающих.</p>
            <p>• Сложность в делегировании даже элементарных шагов в процессе групповой сборки плота/лагеря.</p>
            <p>• Смещение ценности от «я чувствую» в сторону исключительно «я должен предоставить результат».</p>
          </div>
        </details>

        {/* Module 2 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">2</span>
              <span>Повторяющиеся паттерны (Стимул → Тело → Ответ)</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-2 leading-relaxed">
            <div className="neu-inset p-2.5 rounded-lg space-y-1 text-[11.5px]">
              <div><strong className="text-[#BA9470]">Стимул:</strong> Неопределенность тайминга или замедление общего темпа группы.</div>
              <div><strong className="text-[#A9B489]">Телесный отклик:</strong> Зажатие диафрагмы, поверхностное дыхание, напряжение трапеций.</div>
              <div><strong className="text-[#F0E2C8]">Поведенческий ответ:</strong> Перехват лидерской роли, вербальная критика темпа, изоляция от шеринга.</div>
            </div>
          </div>
        </details>

        {/* Module 3 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">3</span>
              <span>Выявленные триггеры</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>1. Ситуации вынужденной пассивности (ожидание трансфера, медитация без движения).</p>
            <p>2. Публичные паузы в разговоре (интерпретируются как угроза отвержения или неловкость).</p>
            <p>3. Непрямая обратная связь от других участников группы.</p>
          </div>
        </details>

        {/* Module 4 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">4</span>
              <span>Преобладающие способы реакции</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>Интеллектуализация и структурирование как щит от эмоциональной уязвимости. Высокая скорость перехода от чувств к рациональному плану действий.</p>
          </div>
        </details>

        {/* Module 5 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">5</span>
              <span>Сильные стороны и опоры</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>• Высочайшая внутренняя дисциплина и способность доводить начатое до конца.</p>
            <p>• Быстрый отклик на техники дыхания 4-7-8 (мгновенное снижение пульса).</p>
            <p>• Искренний интерес к самопознанию без отрицания проблемных зон.</p>
          </div>
        </details>

        {/* Module 6 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">6</span>
              <span>Потенциальные зоны внимания</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>Риск хронического телесного истощения (надпочечниковая усталость, спазм ЖКТ). Необходимость учиться «быть» без цели «производить результат».</p>
          </div>
        </details>

        {/* Module 7 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">7</span>
              <span>Вопросы для исследования на 30 дней</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>1. Если я позволю другому человеку ошибиться, что самое худшее произойдет со мной?</p>
            <p>2. Какую часть себя я прячу за бесконечной занятостью и перфекционизмом?</p>
            <p>3. Где в теле живет разрешение просто отдохнуть без чувства вины?</p>
          </div>
        </details>

        {/* Module 8 */}
        <details className="neu-card rounded-xl p-3 group border border-[#A9B489]/15 open:border-[#BA9470]/40 transition-all">
          <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-xs text-[#F0E2C8]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center text-[10px] text-[#BA9470] font-bold">8</span>
              <span>Рекомендованные следующие шаги</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#A9B489] group-open:rotate-180 transition-transform">expand_more</span>
          </summary>
          <div className="mt-3 pt-2.5 border-t border-[#A9B489]/15 text-xs text-[#F0E2C8]/85 space-y-1.5 leading-relaxed">
            <p>• Завершить программу «7 дней интеграции в город» в закрытом чате.</p>
            <p>• Пройти диагностическую сессию с ведущим психотерапевтом центра.</p>
            <p>• Ежедневно выполнять 10 минут заземления стоп перед началом рабочего дня.</p>
          </div>
        </details>

        {/* Module 9: Аудиопрактика заземления */}
        <div className="neu-card-highlight rounded-2xl p-4 flex flex-col gap-3 border border-[#BA9470]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full neu-inset flex items-center justify-center text-xs text-[#BA9470] font-bold">9</span>
              <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Персональная аудиопрактика заземления</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#BA9470] neu-inset px-2 py-0.5 rounded">08:30 мин</span>
          </div>

          <p className="text-xs text-[#F0E2C8]/90 leading-relaxed">
            <strong>«Вентральный мост»:</strong> Индивидуальный протокол снятия спазма солнечного сплетения и возвращения чувства безопасности в теле.
          </p>

          <div className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3 border border-[#A9B489]/15">
            <button 
              onClick={() => setIsPlayingPractice(!isPlayingPractice)}
              className="w-10 h-10 rounded-full neu-btn text-[#BA9470] flex items-center justify-center shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">
                {isPlayingPractice ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#A9B489] block font-semibold">Аудио-инструкция</span>
              <span className="text-xs font-semibold text-[#F0E2C8] truncate block">Голос Екатерины Семерджиди</span>
              <span className="text-[10px] text-[#BA9470]">{isPlayingPractice ? '03:14 / 08:30 • Играет' : '08:30 • 432 Hz'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ethical Boundaries / Критерии обращения за индивидуальной терапией */}
      <div className="neu-card rounded-xl p-3.5 border-l-4 border-l-[#A9B489] text-xs text-[#F0E2C8]/80 leading-relaxed">
        <strong className="text-[#F0E2C8] block mb-1">Этический дисклеймер:</strong>
        Данный отчет является зеркалом групповой динамики ретрита и не заменяет клинического психиатрического диагноза. В случае нарастания фоновой тревоги рекомендуется обратиться к аккредитованному психотерапевту центра.
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button 
          onClick={handleDownload}
          className="w-full py-3 neu-btn rounded-xl font-semibold text-xs text-[#F0E2C8] border border-[#A9B489]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px] text-[#BA9470]">download</span>
          <span>{downloadSuccess ? 'PDF успешно сформирован и загружен' : 'Скачать PDF отчет рефлексии'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => onNavigate('chat')}
            className="py-2.5 neu-btn rounded-xl font-semibold text-xs text-[#F0E2C8] border border-[#A9B489]/25 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-[#A9B489]">chat</span>
            <span>Обсудить с куратором</span>
          </button>
          <button 
            onClick={() => onNavigate('founder')}
            className="py-2.5 neu-btn rounded-xl font-semibold text-xs text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>К Екатерине ($350)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
