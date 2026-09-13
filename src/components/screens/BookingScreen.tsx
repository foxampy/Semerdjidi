import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { shareModule } from '../../utils/shareHelper';
import { authService } from '../../services/authService';

interface BookingScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate }) => {
  const [selectedTier, setSelectedTier] = useState<'early' | 'standard' | 'premium'>('standard');
  const [selectedDate, setSelectedDate] = useState<'september' | 'may' | 'june'>('september');
  const [selectedLodge, setSelectedLodge] = useState<'standard' | 'aframe' | 'tent'>('standard');
  const [promoCode, setPromoCode] = useState('ETHOSIUM19');
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    hasTherapyExp: 'Да, есть опыт',
  });
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('FR-2026-084');

  const getTierPrice = () => {
    let base = 375;
    if (selectedTier === 'early') base = 94; // 50% deposit
    if (selectedTier === 'standard') base = 375;
    if (selectedTier === 'premium') base = 495;
    if (selectedLodge === 'aframe') base += 45;
    if (selectedLodge === 'tent') base += 70;

    // Apply promo discount 50%
    const upper = promoCode.trim().toUpperCase();
    if (isPromoApplied && (upper === 'ETHOSIUM19' || upper === 'PRE-ETHOS-50' || upper === 'CHIMGAN-24H-50')) {
      base = Math.round(base * 0.5); // 50% discount
    }
    return base;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const genRef = `FR-2026-${Math.floor(100 + Math.random() * 900)}`;
    setBookingRef(genRef);
    setIsBooked(true);

    try {
      const activeUser = authService.getCurrentUser();
      await authService.submitApplication({
        type: 'retreat_chimgan',
        name: formData.name || activeUser?.name || 'Гость',
        contact: formData.phone || formData.city || activeUser?.emailOrTg || '',
        format: selectedTier,
        amountUsd: getTierPrice(),
        promoCode: isPromoApplied ? promoCode : undefined,
        details: `Бронирование ретрита Чимган 19-20 сентября. Лодж: ${selectedLodge}, Город: ${formData.city}, Опыт: ${formData.hasTherapyExp}. Код брони: ${genRef}`,
        status: 'new'
      });
    } catch (err) {
      console.warn('Booking submit sync error:', err);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Booking Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            Консьерж-сервис экосистемы
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 hidden xs:inline">Скидка -50% до 10 сент (13 мест)</span>
            <button
              onClick={() => shareModule('booking')}
              className="neu-btn px-2.5 py-1 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              title="Поделиться бронированием"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Поделиться</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Бронирование слота: Ретрит FRACTAL (19-20 сентября)
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Чимганское ущелье &amp; Чарвакское озеро • 24 часа «Всё включено»
          </p>
        </div>
      </div>

      {isBooked ? (
        <div className="neu-card-highlight rounded-2xl p-6 text-center space-y-4 border border-[#BA9470]/50">
          <div className="w-16 h-16 rounded-full neu-inset mx-auto flex items-center justify-center text-[#BA9470] border border-[#BA9470]/40">
            <span className="material-symbols-outlined text-[36px]">verified</span>
          </div>
          <h2 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Слот успешно забронирован!
          </h2>
          <p className="text-xs text-[#F0E2C8]/90 max-w-md mx-auto leading-relaxed">
            Поздравляем, {formData.name || 'Гость'}. Номер брони: <strong className="text-[#BA9470]">#{bookingRef}</strong>. Инвойс на сумму <strong>${getTierPrice()}</strong> направлен вам в Telegram. Место зафиксировано в системе.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => onNavigate('baseline')}
              className="px-4 py-2.5 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40"
            >
              Заполнить Baseline D-3
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2.5 neu-btn rounded-xl text-xs font-semibold text-[#F0E2C8]"
            >
              Перейти в чат группы
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Step 1: Choose Tier */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">1. Выберите тариф</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'early', name: 'Предоплата 50%', price: '$93.75' },
                { id: 'standard', name: '24h Standard', price: '$375' },
                { id: 'premium', name: 'VIP + Супервизия', price: '$495' },
              ].map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTier(t.id as any)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    selectedTier === t.id
                      ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/50 font-bold'
                      : 'neu-btn text-[#A9B489]'
                  }`}
                >
                  <span className="text-[11px] truncate">{t.name}</span>
                  <span className="font-headline font-bold text-sm text-[#F0E2C8]">{t.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Dates */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">2. Даты выезда</h3>
              <span className="text-[10px] text-[#BA9470] font-bold">Чимган • Чарвак</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedDate('september')}
                className={`p-3 rounded-xl text-left flex flex-col gap-0.5 transition-all ${
                  selectedDate === 'september' ? 'neu-pill-active border-2 border-[#BA9470] shadow-md' : 'neu-btn'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F0E2C8]">19 – 20 сент 2026</span>
                  <span className="text-[8px] bg-[#BA9470] text-[#404432] px-1.5 py-0.5 rounded font-extrabold">ХИТ</span>
                </div>
                <span className="text-[10px] text-[#BA9470]">Водопады, кони, квадро, SUP под звёздами</span>
                <span className="text-[9px] text-[#A9B489]">Екатерина + 2 эксперта</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('may')}
                className={`p-3 rounded-xl text-left flex flex-col gap-0.5 transition-all ${
                  selectedDate === 'may' ? 'neu-pill-active border border-[#BA9470]/50' : 'neu-btn'
                }`}
              >
                <span className="font-bold text-[#F0E2C8]">14 – 16 мая 2026</span>
                <span className="text-[10px] text-[#BA9470]">Осталось 4 места</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('june')}
                className={`p-3 rounded-xl text-left flex flex-col gap-0.5 transition-all ${
                  selectedDate === 'june' ? 'neu-pill-active border border-[#BA9470]/50' : 'neu-btn'
                }`}
              >
                <span className="font-bold text-[#F0E2C8]">11 – 13 июня 2026</span>
                <span className="text-[10px] text-[#A9B489]">Осталось 9 мест</span>
              </button>
            </div>
          </div>

          {/* Step 3: Accommodation */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">3. Вариант размещения</h3>
            <div className="space-y-2 text-xs">
              {[
                { id: 'standard', title: 'Эко-лодж «Гравитация»', desc: 'Уютный двухместный номер с видом на хребет', extra: 'Включено' },
                { id: 'aframe', title: 'A-Frame коттедж у воды', desc: 'Панорамные окна прямо на Чарвакское озеро', extra: '+$45' },
                { id: 'tent', title: 'Шатер глубокого покоя', desc: 'Индивидуальный глэмпинг для максимальной тишины', extra: '+$70' },
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedLodge(item.id as any)}
                  className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all ${
                    selectedLodge === item.id ? 'neu-pill-active border border-[#BA9470]/50' : 'neu-btn'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[#F0E2C8] block">{item.title}</span>
                    <span className="text-[10px] text-[#A9B489]">{item.desc}</span>
                  </div>
                  <span className="text-xs font-bold text-[#BA9470]">{item.extra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Participant Info */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">4. Данные участника</h3>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Имя и Фамилия</label>
                <input
                  type="text"
                  required
                  placeholder="Ваше имя и фамилия"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none placeholder:text-[#A9B489]/40"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Телефон или Telegram</label>
                <input
                  type="text"
                  required
                  placeholder="+998 (__) ___ __ __ или @username"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none placeholder:text-[#A9B489]/40"
                />
              </div>
            </div>
          </div>

          {/* Promo Code & Discount */}
          <div className="neu-card rounded-2xl p-3.5 flex flex-col gap-2 border border-[#BA9470]/30">
            <label className="text-[10px] uppercase font-bold text-[#BA9470] block">Промокод на скидку</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ETHOSIUM19"
                className="flex-1 neu-inset rounded-xl p-2.5 text-xs text-[#F0E2C8] uppercase tracking-wider font-bold border border-[#A9B489]/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsPromoApplied(true)}
                className="px-3.5 py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470] border border-[#BA9470]/40"
              >
                Применить
              </button>
            </div>
            {isPromoApplied && promoCode.trim().toUpperCase() === 'ETHOSIUM19' && (
              <span className="text-[11px] text-[#BA9470] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Скидка резидента -$69 успешно применена!
              </span>
            )}
          </div>

          {/* Payment and Final Total Button */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[#A9B489] block">Итого к оплате:</span>
                {isPromoApplied && promoCode.trim().toUpperCase() === 'ETHOSIUM19' && (
                  <span className="text-[10px] text-[#BA9470]">Экономия $69 активирована</span>
                )}
              </div>
              <div className="text-right">
                <span className="font-headline font-bold text-2xl text-[#BA9470]">${getTierPrice()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 neu-btn rounded-xl font-bold text-sm text-[#F0E2C8] border border-[#BA9470]/50 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-[#BA9470]">lock</span>
              <span>Подтвердить бронирование (${getTierPrice()})</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
