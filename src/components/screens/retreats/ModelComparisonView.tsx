import React from 'react';

interface ModelComparisonViewProps {
  onSelectOldModel: () => void;
  onSelectNewModel: () => void;
  onBackToCatalog: () => void;
}

export const ModelComparisonView: React.FC<ModelComparisonViewProps> = ({
  onSelectOldModel,
  onSelectNewModel,
  onBackToCatalog,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/40 bg-gradient-to-br from-[#3c412f] to-[#323625]">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold px-2.5 py-0.5 rounded-full neu-inset border border-[#BA9470]/30">
            Экономический Аудит &amp; Сравнение
          </span>
          <button
            onClick={onBackToCatalog}
            className="neu-btn px-2.5 py-1 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_month</span>
            Каталог ретритов
          </button>
        </div>

        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] leading-tight">
          Сравнение Моделей &amp; Форматов Ретрита
        </h1>

        <p className="text-xs sm:text-sm text-[#E2ECD2]/85 mt-2 leading-relaxed">
          Детальный анализ перехода от жесткой пакетной модели ($420/сутки) к гибкому 15-местному модульному конструктору с персонализацией участия от $120 до $360.
        </p>

        {/* Action Toggles */}
        <div className="flex flex-wrap gap-2.5 pt-4 mt-2 border-t border-[#A9B489]/15">
          <button
            onClick={onSelectNewModel}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            Открыть Новый Конструктор (15 мест)
          </button>

          <button
            onClick={onSelectOldModel}
            className="neu-btn px-4 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] border border-[#A9B489]/30 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            Открыть 3-дневную модель (18-20 сент.)
          </button>
        </div>
      </div>

      {/* Key Economic Breakthrough Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="neu-card p-4 rounded-2xl border border-emerald-500/30 bg-[#353a27] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Оптимальная группа 15 чел.
          </div>
          <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
            Камерный круг резидентов обеспечивает глубокую индивидуальную работу с Екатериной Семерджиди и комфортный вход в программу от <strong>$120</strong>.
          </p>
        </div>

        <div className="neu-card p-4 rounded-2xl border border-emerald-500/30 bg-[#353a27] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
            Коррекция валютного курса
          </div>
          <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
            700 000 сум за Ниву — это <strong>~$59 на 3 чел. ($20/чел.)</strong>, а не $233. Поездка к водопаду: 300 000 сум = <strong>~$25 на 3 чел. ($8/чел.)</strong>.
          </p>
        </div>

        <div className="neu-card p-4 rounded-2xl border border-emerald-500/30 bg-[#353a27] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Полная опциональность
          </div>
          <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
            Лошади, квадроциклы, сапы и машины больше не зашиваются принудительно в чек. Резидент сам решает, за что платить.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="neu-card rounded-2xl p-5 border border-[#A9B489]/20 space-y-4 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
          <span className="text-xs font-mono uppercase font-bold text-[#BA9470] tracking-wider">
            Сравнительная Таблица Параметров
          </span>
          <span className="text-[11px] text-[#A9B489]">Сводка показателей</span>
        </div>

        <table className="w-full text-left text-xs font-mono min-w-[550px]">
          <thead>
            <tr className="border-b border-[#A9B489]/20 text-[#BA9470]">
              <th className="py-2.5 px-2">Параметр</th>
              <th className="py-2.5 px-2 text-rose-300/90">Предыдущая Модель (3 дня / $420)</th>
              <th className="py-2.5 px-2 text-emerald-300">Новая Модульная Модель 24h (15 мест)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#A9B489]/10 text-[#E2ECD2]/85">
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Инвестиция в участие</td>
              <td className="py-3 px-2 text-rose-300">~$420 / сутки (переплата за навязанные опции)</td>
              <td className="py-3 px-2 text-emerald-400 font-bold">$120 – $360 / сутки (свободный выбор)</td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Глубина ведения &amp; практики</td>
              <td className="py-3 px-2 text-rose-300/80">Стандартный общий формат</td>
              <td className="py-3 px-2 text-emerald-300">
                Глубинная групповая работа + пешие проводки заземления (включено)
              </td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Варианты проживания</td>
              <td className="py-3 px-2">Единый фиксированный чек</td>
              <td className="py-3 px-2 text-[#FFCF96]">
                3 опции: Бюджет $30 | Юрта $50 | Домик $100
              </td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Горный транспорт</td>
              <td className="py-3 px-2 text-rose-300/80">
                Зашит принудительно (ошибка: $233 за Ниву)
              </td>
              <td className="py-3 px-2 text-emerald-300">
                Опционально: Нива <strong>$20</strong> (700k сум / 3) | Водопад <strong>$8</strong> (300k сум / 3)
              </td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Активности (SUP, Лошади, Баня)</td>
              <td className="py-3 px-2 text-rose-300/80">Включены в обязательный пакет</td>
              <td className="py-3 px-2 text-emerald-300">
                Опционально: Лошадь $25, Квадро $25, SUP $6–$21, Баня $42
              </td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Розничная цена для резидента</td>
              <td className="py-3 px-2 text-rose-300 font-bold">$375 – $500</td>
              <td className="py-3 px-2 text-emerald-400 font-bold">
                $120–$150 (MIN) | $170–$220 (COMFORT) | $300–$400 (MAX)
              </td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-bold text-[#F0E2C8]">Психологическая доступность</td>
              <td className="py-3 px-2 text-[#A9B489]">Высокий барьер первого входа</td>
              <td className="py-3 px-2 text-emerald-300">
                Легкий доступ для каждого с гибким апгрейдом
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Package Breakdown Cards in New Model */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase font-bold text-[#BA9470] tracking-wider">
          Структура пакетов новой модульной экономики:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* MIN */}
          <div className="neu-card p-4 rounded-2xl border border-emerald-500/30 bg-[#353927] space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-[#F0E2C8]">Пакет MIN</span>
              <span className="text-emerald-300 font-bold text-sm">$120 – $150</span>
            </div>
            <p className="text-[11px] text-[#A9B489]">
              Формат участия: <strong>$120–$150 / чел.</strong> (Программа + эко-номер + питание).
            </p>
            <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
              Идеален для резидентов, желающих глубоких лекций Екатерины Семерджиди, пеших практик заземления и покоя без лишних затрат.
            </p>
          </div>

          {/* COMFORT */}
          <div className="neu-card p-4 rounded-2xl border border-[#BA9470]/50 bg-[#383d29] space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-[#F0E2C8]">Пакет COMFORT</span>
              <span className="text-[#FFCF96] font-bold text-sm">$170 – $220</span>
            </div>
            <p className="text-[11px] text-[#A9B489]">
              Формат участия: <strong>$170–$220 / чел.</strong> (Программа + юрта + иппотерапия + SUP + баня).
            </p>
            <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
              Золотой стандарт: комфортное колоритное размещение, конная прогулка, часовой сап на Чарваке и восстановительная баня.
            </p>
          </div>

          {/* MAX */}
          <div className="neu-card p-4 rounded-2xl border border-purple-500/30 bg-[#37342b] space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-[#F0E2C8]">Пакет MAX (Full Experience)</span>
              <span className="text-purple-300 font-bold text-sm">$300 – $400</span>
            </div>
            <p className="text-[11px] text-[#A9B489]">
              Формат участия: <strong>$300–$400 / чел.</strong> (Программа + коттедж + внедорожники + водопады + лошади + квадроциклы + SUP + баня).
            </p>
            <p className="text-xs text-[#E2ECD2]/80 leading-relaxed">
              Максимальное погружение: все горные активности, премиум-коттедж, внедорожники и полный спектр телесных интервенций.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="neu-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#BA9470]/30 bg-[#353826]">
        <div>
          <h4 className="text-xs font-bold text-[#F0E2C8]">Готовы протестировать новый конструктор?</h4>
          <p className="text-[11px] text-[#A9B489]">Выбирайте модули и настраивайте программу под ваш персональный темп и комфорт</p>
        </div>

        <button
          onClick={onSelectNewModel}
          className="neu-btn px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/30 border border-[#BA9470] hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Перейти в Конструктор 15 мест
        </button>
      </div>
    </div>
  );
};
