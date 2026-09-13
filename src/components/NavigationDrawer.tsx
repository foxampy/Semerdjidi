import React from 'react';
import { ActiveScreen } from '../semerdzhidiTypes';
import { EthosiumTotem } from './EthosiumTotem';
import { authService } from '../services/authService';
import { shareModule } from '../utils/shareHelper';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  onOpenTelegram: () => void;
  onOpenPwa: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onSelectScreen,
  onOpenTelegram,
  onOpenPwa
}) => {
  if (!isOpen) return null;

  const isUserAdmin = authService.isAdmin();

  // Screen sections structured in logical social network / ecosystem hierarchy
  // All titles strictly 1-2 words as requested
  const sections: { title: string; items: { id: ActiveScreen; label: string; icon: string; badge?: string }[] }[] = [
    {
      title: 'Соцсеть & Общение',
      items: [
        { id: 'feed', label: 'Лента', icon: 'dynamic_feed', badge: 'Посты' },
        { id: 'chat', label: 'Сообщения', icon: 'forum', badge: 'E2E' },
        { id: 'myday', label: 'Мой день', icon: 'calendar_today', badge: 'Планы' },
        { id: 'social', label: 'Аккаунт', icon: 'account_circle', badge: 'Профиль' },
        { id: 'club', label: 'Клуб', icon: 'diversity_3', badge: '$45 / $95' },
      ]
    },
    {
      title: 'Развитие & Практики',
      items: [
        { id: 'baseline', label: 'Диагностика', icon: 'tune', badge: 'D-3' },
        { id: 'workbook', label: 'Ежедневник', icon: 'auto_stories', badge: 'Стр. 58' },
        { id: 'practices', label: 'Практики', icon: 'graphic_eq', badge: '432 Hz' },
        { id: 'learning', label: 'Обучение', icon: 'school', badge: 'Курсы' },
        { id: 'integration', label: 'Интеграция', icon: 'all_inclusive', badge: '7 дней' },
        { id: 'report', label: 'Отчет', icon: 'insights', badge: 'Аудит' },
      ]
    },
    {
      title: 'Офлайн & Пространства',
      items: [
        { id: 'retreats', label: 'Ретриты', icon: 'landscape', badge: 'Чимган' },
        { id: 'booking', label: 'Бронирование', icon: 'how_to_reg', badge: '-50%' },
        { id: 'experts', label: 'Эксперты', icon: 'psychology', badge: '50 аккредит.' },
        { id: 'coffee', label: 'Кофейня', icon: 'local_cafe', badge: 'Лаунж' },
        { id: 'founder', label: 'Основатель', icon: 'spa', badge: 'Манифест' },
      ]
    },
    {
      title: 'Экосистема & R&D',
      items: [
        { id: 'whitepaper', label: 'Whitepaper', icon: 'menu_book', badge: 'v3.0' },
        { id: 'strategy', label: 'Стратегия', icon: 'timeline', badge: 'Seed $650k' },
        { id: 'ethosium', label: 'Матрица 4D', icon: 'hub', badge: 'Nexus' },
        { id: 'labforge', label: 'R&D Lab', icon: 'precision_manufacturing', badge: 'Tech' },
        { id: 'mediakit', label: 'Медиа-кит', icon: 'campaign', badge: 'Промо' },
        { id: 'onboarding', label: 'Онбординг', icon: 'explore', badge: 'Старт' },
        ...(isUserAdmin ? [{ id: 'admin' as ActiveScreen, label: 'Админ', icon: 'admin_panel_settings', badge: 'Root' }] : []),
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-start p-0 animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-[#3a3e2d] border-r border-[#A9B489]/25 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Top Drawer Header with Universal Totem */}
        <div className="p-4 border-b border-[#A9B489]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full neu-inset p-1 flex items-center justify-center border border-[#BA9470]/40">
              <EthosiumTotem size={24} />
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-[#F0E2C8] leading-tight">EthOSium</h2>
              <p className="text-[9px] uppercase tracking-wider text-[#A9B489]">Навигация экосистемы</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#F0E2C8] hover:text-[#BA9470] transition-colors"
            aria-label="Закрыть меню"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Middle Scrollable Links List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BA9470] block px-1">
                {sec.title}
              </span>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const isActive = activeScreen === item.id;
                  return (
                    <div key={item.id} className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectScreen(item.id);
                          onClose();
                        }}
                        className={`flex-1 p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                          isActive
                            ? 'neu-pill-active text-[#F0E2C8] font-bold border border-[#BA9470]/50 shadow-sm bg-[#BA9470]/10'
                            : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#BA9470]' : 'text-[#A9B489]'}`}>
                            {item.icon}
                          </span>
                          <span className="text-xs font-medium truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            isActive ? 'bg-[#BA9470]/25 text-[#BA9470] font-bold' : 'bg-[#2e3124] text-[#A9B489]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareModule(item.id);
                        }}
                        className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#BA9470] hover:text-[#FFFDF8] border border-[#A9B489]/20 hover:border-[#BA9470]/50 active:scale-90 transition-all shrink-0"
                        title={`Поделиться ссылкой на «${item.label}»`}
                        aria-label={`Поделиться ссылкой на «${item.label}»`}
                      >
                        <span className="material-symbols-outlined text-[15px]">share</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Tools (Telegram & PWA) */}
        <div className="p-4 border-t border-[#A9B489]/20 bg-[#343829] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTelegram();
              }}
              className="py-2 px-3 rounded-xl neu-btn text-xs font-semibold text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Телеграм</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenPwa();
              }}
              className="py-2 px-3 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] border border-[#A9B489]/30 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-[#A9B489]">download</span>
              <span>Установить SPA</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] text-[#A9B489]/60 font-mono">
              EthOSium OS • 2026
            </span>
          </div>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="flex-1 h-full" onClick={onClose} />
    </div>
  );
};
