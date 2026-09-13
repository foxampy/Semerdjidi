import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { shareModule } from '../../utils/shareHelper';

interface CoffeeLoungeScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

interface MenuItem {
  id: string;
  category: 'coffee' | 'tea' | 'adaptogens' | 'food';
  name: string;
  desc: string;
  priceUsd: number;
  effect: string;
  tags: string[];
}

export const CoffeeLoungeScreen: React.FC<CoffeeLoungeScreenProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'tea' | 'adaptogens' | 'food'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'residence' | 'chimgan'>('residence');
  const [cart, setCart] = useState<{ [id: string]: number }>({ 'c1': 1, 't1': 1 });
  const [residentBalance, setResidentBalance] = useState(48.0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [tableBooked, setTableBooked] = useState(false);
  const [tableForm, setTableForm] = useState({
    zone: 'Чайная комната созерцания',
    time: 'Сегодня в 16:30',
    guests: '2 гостя',
    note: 'Для беседы после сессии у Екатерины',
  });

  const menuItems: MenuItem[] = [
    {
      id: 'c1',
      category: 'coffee',
      name: 'Эфиопия Иргачеффе (Фильтр V60)',
      desc: 'Яркие ноты бергамота, белого персика и дикого жасмина. Чистая чашка для ясного фокуса.',
      priceUsd: 4.5,
      effect: 'Ясность ума & Когнитивный тонус',
      tags: ['Specialty', 'Light Roast'],
    },
    {
      id: 'c2',
      category: 'adaptogens',
      name: 'Кордицепс & Рейши Латте',
      desc: 'Овсяное молоко, экстракт гриба кордицепс, какао Criollo и щепотка корицы. Без скачков кортизола.',
      priceUsd: 6.0,
      effect: 'Снижение стресса & Баланс надпочечников',
      tags: ['No Sugar', 'Adaptogen'],
    },
    {
      id: 't1',
      category: 'tea',
      name: 'Чимганский горный сбор & Саган-Дайля',
      desc: 'Травы ручного сбора с предгорий Чимгана: чабрец, душица, шиповник и бурятский саган-дайля.',
      priceUsd: 5.0,
      effect: 'Телесное заземление & Восстановление',
      tags: ['Wild Harvest', 'Caffeine-Free'],
    },
    {
      id: 't2',
      category: 'tea',
      name: 'Церемониальная Матча Удзи (Киото)',
      desc: 'Высший грейд первого весеннего сбора. Взбита традиционным венчиком тясэн на кокосовом молоке.',
      priceUsd: 6.5,
      effect: 'L-теанин фокус & Мягкое спокойствие',
      tags: ['Ceremonial', 'Organic'],
    },
    {
      id: 'c3',
      category: 'coffee',
      name: 'Ботанический Эспрессо-Тоник 432 Hz',
      desc: 'Двойной шот спешелти Руанда, крафтовый тоник с экстрактом розмарина и свежим инжиром.',
      priceUsd: 5.5,
      effect: 'Освежение сенсорики & Бодрость',
      tags: ['Signature', 'Cold'],
    },
    {
      id: 'f1',
      category: 'food',
      name: 'Кедрово-инжирный трюфель (Raw)',
      desc: 'Кедровые орехи, вяленый самаркандский инжир, сырое какао-масло. Без глютена и сахара.',
      priceUsd: 4.0,
      effect: 'Чистая энергия без гликемического спада',
      tags: ['Raw Vegan', 'Gluten Free'],
    },
  ];

  const filteredMenu = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, count]) => {
      const item = menuItems.find(m => m.id === id);
      return sum + (item ? item.priceUsd * Number(count) : 0);
    }, 0);
  };

  const handlePayOrder = () => {
    const total = getCartTotal();
    if (residentBalance >= total) {
      setResidentBalance(prev => +(prev - total).toFixed(2));
      setOrderPlaced(true);
      setCart({});
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Coffee & Lounge Header Banner */}
      <div className="neu-card-highlight rounded-2xl p-5 flex flex-col gap-3.5 border border-[#BA9470]/40 bg-gradient-to-br from-[#3c3f2e] via-[#3a3d2c] to-[#453c2b]/35">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BA9470] text-[22px]">local_cafe</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-0.5 rounded border border-[#BA9470]/30">
              EthOSium Coffee &amp; Tea Lounge
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 hidden xs:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Открыто до 22:00
            </span>
            <button
              onClick={() => shareModule('coffee')}
              className="neu-btn px-2.5 py-1 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              title="Поделиться кофейней"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Поделиться</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-2xl text-[#F0E2C8] tracking-tight">
            Спешелти Кофейня &amp; Чайная Комната
          </h1>
          <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
            Пространство вкуса, неспешных диалогов и восстанавливающего заземления для резидентов и гостей EthOSium.
          </p>
        </div>

        {/* Location selector */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <button
            onClick={() => setSelectedLocation('residence')}
            className={`p-2.5 rounded-xl text-left flex flex-col transition-all ${
              selectedLocation === 'residence'
                ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8]'
                : 'neu-inset text-[#A9B489]'
            }`}
          >
            <span className="font-bold">Флагман • Резиденция Ташкент</span>
            <span className="text-[10px] text-[#A9B489]">Ул. Чехова 14 • Лаунж &amp; Сад</span>
          </button>
          <button
            onClick={() => setSelectedLocation('chimgan')}
            className={`p-2.5 rounded-xl text-left flex flex-col transition-all ${
              selectedLocation === 'chimgan'
                ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8]'
                : 'neu-inset text-[#A9B489]'
            }`}
          >
            <span className="font-bold">Горный кампус • Чимган</span>
            <span className="text-[10px] text-[#A9B489]">Чайная юрта &amp; терраса ретритов</span>
          </button>
        </div>

        {/* Resident Balance Wallet Box */}
        <div className="neu-card p-3 rounded-xl flex items-center justify-between border border-[#BA9470]/30 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A9B489] block">Депозитный счёт резидента</span>
            <span className="font-headline font-bold text-lg text-[#BA9470]">${residentBalance.toFixed(2)}</span>
            <span className="text-[10px] text-[#A9B489] block">≈ {(residentBalance * 12800).toLocaleString('ru-RU')} сум</span>
          </div>
          <button
            onClick={() => setResidentBalance(prev => +(prev + 25).toFixed(2))}
            className="px-3 py-1.5 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">add_circle</span>
            <span>Пополнить (+$25)</span>
          </button>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="neu-card p-1.5 rounded-2xl grid grid-cols-5 gap-1 text-[10px] font-bold text-center">
        {[
          { id: 'all', label: 'Всё меню' },
          { id: 'coffee', label: 'Кофе' },
          { id: 'tea', label: 'Чай' },
          { id: 'adaptogens', label: 'Адаптогены' },
          { id: 'food', label: 'Десерты' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`py-2 px-1 rounded-xl truncate transition-all ${
              activeCategory === cat.id
                ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/40 shadow'
                : 'neu-btn text-[#A9B489]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {filteredMenu.map(item => {
          const count = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="neu-card rounded-2xl p-4 flex flex-col justify-between gap-2.5 border border-[#A9B489]/15 hover:border-[#BA9470]/30 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-headline font-bold text-sm text-[#F0E2C8] leading-snug">
                    {item.name}
                  </h3>
                  <span className="font-headline font-bold text-sm text-[#BA9470] whitespace-nowrap">
                    ${item.priceUsd.toFixed(2)}
                  </span>
                </div>

                <p className="text-[#A9B489] text-[11px] leading-relaxed">
                  {item.desc}
                </p>

                <div className="neu-inset px-2.5 py-1 rounded-lg text-[10px] text-[#F0E2C8]/90 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#BA9470] text-[14px]">psychology</span>
                  <span>{item.effect}</span>
                </div>

                <div className="flex gap-1.5 pt-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-[#BA9470]/15 text-[#BA9470] px-2 py-0.5 rounded font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-2 border-t border-[#A9B489]/10 flex items-center justify-between">
                <span className="text-[10px] text-[#A9B489]">Подача: 3-5 минут</span>
                <div className="flex items-center gap-2">
                  {count > 0 ? (
                    <div className="flex items-center gap-2 neu-inset px-2 py-1 rounded-xl">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#BA9470] font-bold text-sm hover:scale-110"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#F0E2C8] text-xs px-1">{count}</span>
                      <button
                        onClick={() => addToCart(item.id)}
                        className="text-[#BA9470] font-bold text-sm hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item.id)}
                      className="px-3 py-1.5 neu-btn rounded-xl text-[11px] font-bold text-[#BA9470] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">shopping_bag</span>
                      <span>В заказ</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Order Summary / Cart */}
      {getCartTotal() > 0 && (
        <div className="neu-card-highlight rounded-2xl p-4 flex flex-col gap-3 border border-[#BA9470]/50">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-[#F0E2C8]">Ваш текущий заказ в лаунже</span>
            <span className="text-[10px] text-[#BA9470] font-bold uppercase neu-inset px-2 py-0.5 rounded">
              {selectedLocation === 'residence' ? 'Ташкент • Столик #4' : 'Чимган • Терраса'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#F0E2C8]">
            {Object.entries(cart).map(([id, count]) => {
              const item = menuItems.find(m => m.id === id);
              if (!item) return null;
              return (
                <div key={id} className="flex justify-between items-center neu-inset p-2 rounded-xl">
                  <span>{item.name} × {count}</span>
                  <span className="font-bold text-[#BA9470]">${(item.priceUsd * Number(count)).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <div>
              <span className="text-[#A9B489]">Сумма к списанию с депозита:</span>
              <div className="font-headline font-bold text-lg text-[#BA9470]">${getCartTotal().toFixed(2)}</div>
            </div>

            <button
              onClick={handlePayOrder}
              disabled={residentBalance < getCartTotal()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                residentBalance >= getCartTotal()
                  ? 'neu-btn text-[#F0E2C8] border border-[#BA9470]/60 active:scale-95'
                  : 'opacity-50 cursor-not-allowed bg-[#3a3e2d] text-[#A9B489]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#BA9470]">room_service</span>
              <span>Оплатить и подать</span>
            </button>
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="neu-inset p-4 rounded-2xl text-center space-y-1 border border-emerald-500/40 text-xs">
          <span className="material-symbols-outlined text-emerald-400 text-[24px]">check_circle</span>
          <p className="font-bold text-[#F0E2C8]">Заказ отправлен шеф-бариста!</p>
          <p className="text-[#A9B489]">Напитки будут доставлены к вашему столику в течение 4 минут.</p>
        </div>
      )}

      {/* Table & Tea Room Booking */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BA9470] text-[20px]">table_restaurant</span>
            <h2 className="font-headline font-bold text-sm text-[#F0E2C8]">
              Бронирование чайной комнаты и лаунжа
            </h2>
          </div>
          <span className="text-[10px] text-[#A9B489]">Для резидентов</span>
        </div>

        {tableBooked ? (
          <div className="neu-inset p-4 rounded-xl text-center text-xs space-y-1 border border-[#BA9470]/40">
            <span className="material-symbols-outlined text-[#BA9470] text-[22px]">event_available</span>
            <p className="font-bold text-[#F0E2C8]">Зона зарезервирована!</p>
            <p className="text-[#A9B489]">
              {tableForm.zone} подготовлена на {tableForm.time} ({tableForm.guests}).
            </p>
            <button
              onClick={() => setTableBooked(false)}
              className="text-[10px] text-[#BA9470] underline pt-1"
            >
              Изменить бронь
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Зона пространства</label>
              <select
                value={tableForm.zone}
                onChange={(e) => setTableForm({ ...tableForm, zone: e.target.value })}
                className="w-full neu-inset rounded-xl p-2 text-[#F0E2C8] bg-[#3a3e2d] border border-[#A9B489]/15 focus:outline-none"
              >
                <option value="Чайная комната созерцания">Чайная комната созерцания (тихая зона)</option>
                <option value="Переговорная с камином">Переговорная с камином (до 6 человек)</option>
                <option value="Терраса у сада камней">Терраса у сада камней на свежем воздухе</option>
                <option value="Горная юрта в Чимгане">Горная юрта в Чимгане у водопада</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Время и гости</label>
              <input
                type="text"
                value={`${tableForm.time} • ${tableForm.guests}`}
                onChange={(e) => setTableForm({ ...tableForm, time: e.target.value })}
                className="w-full neu-inset rounded-xl p-2 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end pt-1">
              <button
                onClick={() => setTableBooked(true)}
                className="w-full sm:w-auto px-4 py-2 neu-btn rounded-xl font-bold text-xs text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                <span>Забронировать зону бесплатно для резидента</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
