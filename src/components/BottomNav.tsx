import React from 'react';
import { ActiveScreen } from '../semerdzhidiTypes';

interface BottomNavProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const isFeed = activeScreen === 'feed';
  const isMessages = activeScreen === 'chat';
  const isMyDay = activeScreen === 'myday' || activeScreen === 'workbook' || activeScreen === 'baseline' || activeScreen === 'learning';
  const isClub = activeScreen === 'club';
  const isAccount = activeScreen === 'social';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#404432]/95 backdrop-blur-xl border-t border-[#A9B489]/20 shadow-[0_-6px_20px_#2a2c20]">
      <div className="max-w-4xl mx-auto grid grid-cols-5 items-center h-16 px-2">
        {/* 1. Лента */}
        <button
          onClick={() => onNavigate('feed')}
          className={`flex flex-col items-center justify-center gap-1 h-12 rounded-xl transition-all ${
            isFeed
              ? 'neu-pill-active text-[#F0E2C8] font-semibold border border-[#BA9470]/30 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isFeed ? 'text-[#BA9470]' : ''}`}>
            dynamic_feed
          </span>
          <span className={`text-[10px] tracking-tight leading-none ${isFeed ? 'text-[#F0E2C8] font-bold' : ''}`}>
            Лента
          </span>
        </button>

        {/* 2. Сообщения */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex flex-col items-center justify-center gap-1 h-12 rounded-xl transition-all relative ${
            isMessages
              ? 'neu-pill-active text-[#F0E2C8] font-semibold border border-[#BA9470]/30 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isMessages ? 'text-[#BA9470]' : ''}`}>
            forum
          </span>
          <span className={`text-[10px] tracking-tight leading-none ${isMessages ? 'text-[#F0E2C8] font-bold' : ''}`}>
            Сообщения
          </span>
          <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>

        {/* 3. Мой день (Центральный фокус) */}
        <button
          onClick={() => onNavigate('myday')}
          className={`flex flex-col items-center justify-center gap-1 h-12 rounded-xl transition-all relative ${
            isMyDay
              ? 'neu-pill-active text-[#FFFDF8] font-bold border border-[#BA9470]/60 shadow-md bg-[#BA9470]/15'
              : 'text-[#BA9470] hover:text-[#FFFDF8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[21px] ${isMyDay ? 'text-[#BA9470]' : 'text-[#BA9470]/80'}`}>
            calendar_today
          </span>
          <span className={`text-[10px] tracking-tight leading-none ${isMyDay ? 'text-[#FFFDF8] font-bold' : 'text-[#BA9470]'}`}>
            Мой день
          </span>
          <span className="absolute top-1.5 right-3 w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-pulse"></span>
        </button>

        {/* 4. Клуб */}
        <button
          onClick={() => onNavigate('club')}
          className={`flex flex-col items-center justify-center gap-1 h-12 rounded-xl transition-all ${
            isClub
              ? 'neu-pill-active text-[#F0E2C8] font-semibold border border-[#BA9470]/30 shadow-sm'
              : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isClub ? 'text-[#BA9470]' : ''}`}>
            diversity_3
          </span>
          <span className={`text-[10px] tracking-tight leading-none ${isClub ? 'text-[#F0E2C8] font-bold' : ''}`}>
            Клуб
          </span>
        </button>

        {/* 5. Аккаунт */}
        <button
          onClick={() => onNavigate('social')}
          className={`flex flex-col items-center justify-center gap-1 h-12 rounded-xl transition-all relative ${
            isAccount
              ? 'neu-pill-active text-[#FFFDF8] font-semibold border border-[#FFCF96]/60 shadow-sm'
              : 'text-[#A9B489] hover:text-[#FFFDF8]'
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isAccount ? 'text-[#FFCF96]' : ''}`}>
            account_circle
          </span>
          <span className={`text-[10px] tracking-tight leading-none ${isAccount ? 'text-[#FFFDF8] font-bold' : ''}`}>
            Аккаунт
          </span>
        </button>
      </div>
    </nav>
  );
};
