import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface ExpertsCatalogScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ExpertsCatalogScreen: React.FC<ExpertsCatalogScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState('Все');
  const [selectedFormat, setSelectedFormat] = useState('Все 50');
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [bookingExpert, setBookingExpert] = useState<string | null>(null);

  const modalities = ['Все', 'КПТ', 'Гештальт', 'Психоанализ', 'Семейная', 'Нейропсихология', 'Телесная терапия'];

  const experts = [
    {
      id: 1,
      name: 'София Мельникова',
      title: 'Клинический психолог • 12 лет опыта',
      approach: 'Телесно-ориентированная терапия & Травма развития',
      tags: ['Телесная терапия', 'Гештальт'],
      format: 'Очно в Ташкенте & Онлайн',
      price: '$120 / сессия',
      rating: '4.98',
      reviews: 64,
      avatarText: 'СМ',
      slots: 'Завтра 14:00, 17:30',
    },
    {
      id: 2,
      name: 'Александр Ворнов',
      title: 'Психоаналитик, супервизор центра',
      approach: 'Лакановский анализ, кризисы идентичности',
      tags: ['Психоанализ'],
      format: 'Очно в Ташкенте',
      price: '$160 / сессия',
      rating: '5.0',
      reviews: 92,
      avatarText: 'АВ',
      slots: 'Пятница 11:00',
    },
    {
      id: 3,
      name: 'Елена Дмитриева',
      title: 'Нейропсихолог, телесный терапевт',
      approach: 'Регуляция ВНС, метод Семерджиди, нейробаланс 4-7-8',
      tags: ['Нейропсихология', 'Телесная терапия'],
      format: 'Онлайн по миру',
      price: '$140 / сессия',
      rating: '4.95',
      reviews: 48,
      avatarText: 'ЕД',
      slots: 'Сегодня 19:00',
    },
    {
      id: 4,
      name: 'Дмитрий Кузнецов',
      title: 'Семейный системный терапевт',
      approach: 'Парные кризисы, детско-родительские связи',
      tags: ['Семейная', 'КПТ'],
      format: 'Очно в Ташкенте & Онлайн',
      price: '$150 / сессия',
      rating: '4.92',
      reviews: 55,
      avatarText: 'ДК',
      slots: 'Суббота 12:00, 16:00',
    },
  ];

  const filteredExperts = experts.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.approach.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModality = selectedModality === 'Все' || exp.tags.includes(selectedModality);
    const matchesFormat = selectedFormat === 'Все 50' || 
                          (selectedFormat === 'Очно в Ташкенте' && exp.format.includes('Очно')) ||
                          (selectedFormat === 'Онлайн' && exp.format.includes('Онлайн')) ||
                          (selectedFormat === 'Свободные окна' && exp.slots.includes('Сегодня'));
    return matchesSearch && matchesModality && matchesFormat;
  });

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Catalog Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            50 Аккредитованных экспертов
          </span>
          <span className="text-xs font-semibold text-[#A9B489]">Ташкент &amp; Online</span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Каталог резидентов центра
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Каждый специалист прошёл строгий супервизорский отбор Екатерины Семерджиди
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#A9B489] text-[18px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени, запросу или методу..."
            className="w-full neu-inset rounded-xl pl-9 pr-3 py-2 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none focus:border-[#BA9470]"
          />
        </div>

        {/* Format Switcher */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {['Все 50', 'Очно в Ташкенте', 'Онлайн', 'Свободные окна'].map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`py-1.5 px-1 rounded-xl text-[10px] font-bold truncate transition-all ${
                selectedFormat === fmt
                  ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/40 shadow'
                  : 'neu-btn text-[#A9B489]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Modalities Chips Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {modalities.map(mod => (
          <button
            key={mod}
            onClick={() => setSelectedModality(mod)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedModality === mod
                ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/50'
                : 'neu-btn text-[#A9B489]'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* AI Assistant Matching Quiz (Метод Семерджиди) */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#BA9470]/30 bg-gradient-to-br from-[#3c402f] to-[#473b2c]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#BA9470]">auto_awesome</span>
            <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">Ассистент подбора эксперта</h3>
          </div>
          <span className="text-[10px] text-[#BA9470] font-bold">Шаг {quizStep} из 3</span>
        </div>

        {quizStep === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-[#F0E2C8]">С каким главным симптомом вы сталкиваетесь чаще всего?</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Спазмы в теле / тревога', 'Потеря смысла / выгорание', 'Конфликты в семье', 'Кризис в бизнесе'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setQuizAnswer(opt);
                    setQuizStep(2);
                  }}
                  className="p-2.5 rounded-xl neu-btn text-left text-[#F0E2C8] hover:text-[#BA9470] border border-[#A9B489]/20 active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 2 && (
          <div className="space-y-2">
            <p className="text-xs text-[#F0E2C8]">Предпочтительный формат взаимодействия?</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Очные сессии в Ташкенте', 'Онлайн из любой точки мира'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setQuizStep(3)}
                  className="p-2.5 rounded-xl neu-btn text-left text-[#F0E2C8] hover:text-[#BA9470] border border-[#A9B489]/20 active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {quizStep === 3 && (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl neu-inset text-xs text-[#F0E2C8]">
              На основе вашего ответа («{quizAnswer || 'Телесный отклик'}») рекомендуем специалистов направления <strong className="text-[#BA9470]">Телесная терапия &amp; Нейропсихология</strong>.
            </div>
            <button 
              onClick={() => {
                setSelectedModality('Телесная терапия');
                setQuizStep(1);
              }}
              className="w-full py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40"
            >
              Применить рекомендацию ассистента
            </button>
          </div>
        )}
      </div>

      {/* Expert Cards List */}
      <div className="flex flex-col gap-3">
        {filteredExperts.map(expert => (
          <div key={expert.id} className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full neu-inset flex items-center justify-center font-headline font-bold text-sm text-[#BA9470] border border-[#BA9470]/40 shrink-0">
                  {expert.avatarText}
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline font-bold text-base text-[#F0E2C8] leading-tight truncate">
                    {expert.name}
                  </h3>
                  <p className="text-[11px] text-[#A9B489] mt-0.5">{expert.title}</p>
                  <p className="text-xs text-[#F0E2C8]/90 font-medium mt-1 leading-snug">{expert.approach}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-headline font-bold text-sm text-[#BA9470] block">{expert.price}</span>
                <span className="text-[10px] text-[#A9B489] flex items-center justify-end gap-0.5 mt-0.5">
                  <span className="text-[#BA9470]">★</span> {expert.rating} ({expert.reviews})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/15 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#A9B489]">
                <span className="material-symbols-outlined text-[15px] text-[#BA9470]">schedule</span>
                <span>Окна: {expert.slots}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate('chat')}
                  className="px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] hover:text-[#BA9470] active:scale-95"
                >
                  Чат
                </button>
                <button 
                  onClick={() => setBookingExpert(expert.name)}
                  className="px-3.5 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 hover:text-[#F0E2C8] active:scale-95"
                >
                  Записаться
                </button>
              </div>
            </div>

            {bookingExpert === expert.name && (
              <div className="p-3 rounded-xl bg-[#503428]/80 border border-[#BA9470]/50 text-xs text-[#F0E2C8] flex items-center justify-between gap-2">
                <span>Запрос к <strong>{expert.name}</strong> отправлен. Куратор свяжется в течение 15 минут.</span>
                <button onClick={() => setBookingExpert(null)} className="text-[#BA9470] font-bold">✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
