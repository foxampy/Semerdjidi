import React, { useState, useRef, useEffect } from 'react';
import { ActiveScreen } from '../semerdzhidiTypes';
import { EthosiumTotem } from './EthosiumTotem';
import { useI18n, SUPPORTED_LANGUAGES, SupportedLanguage } from '../services/i18n';
import { shareModule } from '../utils/shareHelper';

interface TopHeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenMenu: () => void;
  onOpenTelegramModal: () => void;
  onOpenPwaModal: () => void;
  isTelegram: boolean;
  isLargeFont?: boolean;
  onToggleLargeFont?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeScreen,
  onNavigate,
  onOpenMenu,
  onOpenTelegramModal,
  onOpenPwaModal,
  isTelegram,
  isLargeFont,
  onToggleLargeFont
}) => {
  const { lang, setLang, t, currentOption } = useI18n();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSubtitle = () => {
    switch (activeScreen) {
      case 'feed': return 'Лента публикаций';
      case 'onboarding': return t('sub.onboarding');
      case 'founder': return t('sub.founder');
      case 'labforge': return t('sub.labforge');
      case 'coffee': return t('sub.coffee');
      case 'retreats': return t('sub.retreats');
      case 'baseline': return t('sub.baseline');
      case 'workbook': return t('sub.workbook');
      case 'experts': return t('sub.experts');
      case 'learning': return t('sub.learning');
      case 'club': return t('sub.club');
      case 'practices': return t('sub.practices');
      case 'chat': return 'Сообщения & EAP Мессенджер';
      case 'social': return t('sub.social');
      case 'myday': return 'Мой день: Планы & Дашборд';
      case 'whitepaper': return 'Whitepaper & Манифест';
      case 'strategy': return 'Архитектура & Инвест-План';
      case 'mediakit': return 'Медиа-кит & Промо-Центр';
      case 'admin': return t('sub.admin');
      case 'booking': return t('sub.booking');
      default: return 'Экосистема здоровья и сознания';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#3A3F2D]/95 backdrop-blur-md border-b border-[#E2ECD2]/20 shadow-md transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
        {/* Left Side: Menu + Logo + Dynamic Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            aria-label={t('nav.menu')}
            className="w-10 h-10 rounded-full neu-btn flex items-center justify-center text-[#FFFDF8] hover:text-[#FFCF96] active:scale-95 transition-all shrink-0 border border-[#E2ECD2]/20"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <button
            onClick={() => onNavigate('feed')}
            className="flex items-center gap-2 text-left group min-w-0"
          >
            <div className="relative shrink-0">
              <EthosiumTotem activeScreen={activeScreen} size={38} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-black text-sm sm:text-base tracking-wide text-[#FFFDF8] group-hover:text-[#FFCF96] transition-colors truncate">
                  {t('brand.name')}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full border border-[#FFCF96]/40 text-[#FFCF96] shrink-0 font-bold bg-[#FFCF96]/10">
                  PROD
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#E2ECD2] truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[280px]">
                {getSubtitle()}
              </span>
            </div>
          </button>
        </div>

        {/* Right Side: A+/A- + Language Selector + Telegram + PWA + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Simple Font Size Button A+ / A- without explanations */}
          <button
            onClick={onToggleLargeFont}
            className={`h-9 px-2.5 rounded-xl neu-btn flex items-center justify-center font-mono font-black text-xs border active:scale-95 transition-all ${
              isLargeFont
                ? 'bg-[#4a5138] text-[#FFCF96] border-[#FFCF96] shadow-[0_0_8px_rgba(255,207,150,0.4)]'
                : 'text-[#FFFDF8] border-[#E2ECD2]/30 hover:text-[#FFCF96]'
            }`}
            title="A+ / A-"
            aria-label="A+ / A-"
          >
            <span>{isLargeFont ? 'A-' : 'A+'}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 px-2 sm:px-2.5 rounded-xl neu-btn flex items-center gap-1 border border-[#E2ECD2]/30 text-[#FFFDF8] hover:text-[#FFCF96] active:scale-95 transition-all text-xs font-bold"
              title="Language / Язык"
              aria-label="Language / Язык"
            >
              <span className="text-sm">{currentOption.flag}</span>
              <span className="font-mono text-[11px] uppercase font-bold">{currentOption.code}</span>
              <span className="material-symbols-outlined text-[14px] opacity-70">expand_more</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl neu-card border border-[#E2ECD2]/30 p-1.5 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-xl bg-[#353928]/95 animate-in fade-in zoom-in-95 duration-100">
                {SUPPORTED_LANGUAGES.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLang(opt.code as SupportedLanguage);
                      setIsLangMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                      lang === opt.code
                        ? 'neu-pill-active text-[#FFCF96] font-bold border border-[#FFCF96]/40'
                        : 'text-[#FFFDF8] hover:bg-[#434834] font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{opt.flag}</span>
                      <span>{opt.nativeName}</span>
                    </span>
                    {lang === opt.code && (
                      <span className="text-xs text-[#FFCF96] font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Telegram Indicator */}
          <button
            onClick={onOpenTelegramModal}
            className={`h-9 px-2 sm:px-2.5 rounded-xl neu-btn flex items-center gap-1 border border-[#E2ECD2]/20 hover:text-[#FFCF96] active:scale-95 transition-all text-[11px] font-semibold ${
              isTelegram ? 'text-sky-300 border-sky-400/30' : 'text-[#FFFDF8]'
            }`}
            title="Telegram"
          >
            <span className="material-symbols-outlined text-[17px] text-[#A9B489]">send</span>
            <span className="hidden xs:inline">{isTelegram ? 'TMA' : 'TG'}</span>
          </button>

          {/* Share Current Module */}
          <button
            onClick={() => shareModule(activeScreen)}
            className="h-9 px-2 sm:px-2.5 rounded-xl neu-btn flex items-center gap-1.5 border border-[#BA9470]/40 text-[#FFCF96] hover:text-[#FFFDF8] active:scale-95 transition-all text-xs font-bold"
            title="Поделиться этим модулем"
            aria-label="Поделиться этим модулем"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
            <span className="hidden sm:inline">Поделиться</span>
          </button>

          {/* Download / Install SPA */}
          <button
            onClick={onOpenPwaModal}
            className="w-9 h-9 rounded-xl neu-btn flex items-center justify-center text-[#FFFDF8] border border-[#E2ECD2]/20 hover:text-[#FFCF96] active:scale-95 transition-all"
            title="PWA / SPA"
          >
            <span className="material-symbols-outlined text-[18px]">install_mobile</span>
          </button>

          {/* My Profile & Social Hub */}
          <button
            onClick={() => onNavigate('social')}
            aria-label={t('tab.profile')}
            className={`w-9 h-9 rounded-xl neu-btn flex items-center justify-center transition-all active:scale-95 ${
              activeScreen === 'social'
                ? 'neu-pill-active border-2 border-[#FFCF96] text-[#FFCF96]'
                : 'border border-[#E2ECD2]/20 text-[#FFFDF8] hover:text-[#FFCF96]'
            }`}
            title={t('tab.profile')}
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
