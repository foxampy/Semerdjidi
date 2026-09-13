import React, { useState, useEffect } from 'react';
import { ActiveScreen } from './semerdzhidiTypes';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { NavigationDrawer } from './components/NavigationDrawer';
import { LanguageProvider } from './services/i18n';

// Exact screen implementations based on provided design code
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { FeedScreen } from './components/screens/FeedScreen';
import { FounderProfileScreen } from './components/screens/FounderProfileScreen';
import { RetreatsScreen } from './components/screens/RetreatsScreen';
import { ReflectionReportScreen } from './components/screens/ReflectionReportScreen';
import { IntegrationScreen } from './components/screens/IntegrationScreen';
import { BaselineScreen } from './components/screens/BaselineScreen';
import { WorkbookScreen } from './components/screens/WorkbookScreen';
import { ExpertsCatalogScreen } from './components/screens/ExpertsCatalogScreen';
import { LearningScreen } from './components/screens/LearningScreen';
import { ClubScreen } from './components/screens/ClubScreen';
import { PracticesAudioScreen } from './components/screens/PracticesAudioScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { AdminConsoleScreen } from './components/screens/AdminConsoleScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { EthosiumNexusScreen } from './components/screens/EthosiumNexusScreen';
import { LabForgeScreen } from './components/screens/LabForgeScreen';
import { CoffeeLoungeScreen } from './components/screens/CoffeeLoungeScreen';
import { SocialAccountScreen } from './components/screens/SocialAccountScreen';
import { WhitepaperScreen } from './components/screens/WhitepaperScreen';
import { MediaKitScreen } from './components/screens/MediaKitScreen';
import { StrategyRoadmapScreen } from './components/screens/StrategyRoadmapScreen';
import { MyDayScreen } from './components/screens/MyDayScreen';

// Modals
import { TelegramBotModal } from './components/modals/TelegramBotModal';
import { PwaInstallModal } from './components/modals/PwaInstallModal';

const VALID_SCREENS: ActiveScreen[] = [
  'onboarding', 'feed', 'founder', 'retreats', 'report', 'integration',
  'baseline', 'workbook', 'experts', 'learning', 'club', 'practices',
  'chat', 'admin', 'booking', 'labforge', 'coffee', 'social', 'ethosium',
  'whitepaper', 'mediakit', 'strategy', 'myday'
];

export default function App() {
  // Initialize activeScreen from window.location.hash if present
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
      const base = rawHash.startsWith('retreats')
        ? 'retreats'
        : rawHash === 'realting'
          ? 'mediakit'
          : (rawHash === 'roadmap' || rawHash === 'invest' || rawHash === 'architecture')
            ? 'strategy'
            : (rawHash === 'day' || rawHash === 'myday' || rawHash === 'today' || rawHash === 'calendar')
              ? 'myday'
              : rawHash;
      if (VALID_SCREENS.includes(base as ActiveScreen)) {
        return base as ActiveScreen;
      }
    }
    return 'feed';
  });

  const [retreatsTab, setRetreatsTab] = useState<'program' | 'test' | 'discount' | 'booking' | undefined>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('test')) return 'test';
      if (hash.includes('discount') || hash.includes('register')) return 'discount';
      if (hash.includes('booking') || hash.includes('book')) return 'booking';
    }
    return undefined;
  });

  const [shareToast, setShareToast] = useState<{ message: string; url?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ethosium_large_font') === 'true';
    } catch {
      return false;
    }
  });

  // Synchronize hash with activeScreen for deep-linking
  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
    if (rawHash !== activeScreen && !rawHash.startsWith(activeScreen)) {
      window.history.replaceState(null, '', `#${activeScreen}`);
    }
  }, [activeScreen]);

  // Handle browser back/forward and hash change
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const rawScreen = hash.replace(/^#\/?/, '').split('?')[0].trim();
      const base = rawScreen.startsWith('retreats')
        ? 'retreats'
        : rawScreen === 'realting'
          ? 'mediakit'
          : (rawScreen === 'roadmap' || rawScreen === 'invest' || rawScreen === 'architecture')
            ? 'strategy'
            : (rawScreen === 'day' || rawScreen === 'myday' || rawScreen === 'today' || rawScreen === 'calendar')
              ? 'myday'
              : rawScreen;
      
      if (VALID_SCREENS.includes(base as ActiveScreen)) {
        setActiveScreen(base as ActiveScreen);
        if (base === 'retreats') {
          if (hash.includes('test')) setRetreatsTab('test');
          else if (hash.includes('discount') || hash.includes('register')) setRetreatsTab('discount');
          else if (hash.includes('booking') || hash.includes('book')) setRetreatsTab('booking');
          else setRetreatsTab('program');
        }
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Listen to ethosium-share-notify events for global Toast
  useEffect(() => {
    const handleShareNotify = (e: any) => {
      const detail = e.detail || {};
      setShareToast({
        message: detail.message || 'Ссылка на модуль скопирована!',
        url: detail.url,
      });

      // Automatically hide toast after 3.2 seconds
      const timer = setTimeout(() => {
        setShareToast(null);
      }, 3200);

      return () => clearTimeout(timer);
    };

    window.addEventListener('ethosium-share-notify', handleShareNotify);
    return () => window.removeEventListener('ethosium-share-notify', handleShareNotify);
  }, []);

  useEffect(() => {
    if (isLargeFont) {
      document.documentElement.classList.add('accessible-large-text');
    } else {
      document.documentElement.classList.remove('accessible-large-text');
    }
    try {
      localStorage.setItem('ethosium_large_font', String(isLargeFont));
    } catch {
      // ignore
    }
  }, [isLargeFont]);

  useEffect(() => {
    // Check if running inside Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegramEnv(true);
      try {
        tg.ready();
        tg.expand();
      } catch (e) {
        console.warn('Telegram init error:', e);
      }
    }
  }, []);

  const handleToggleLargeFont = () => {
    setIsLargeFont(prev => !prev);
  };

  const handleNavigate = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger Telegram Haptic if in TMA
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <LanguageProvider>
      <div className={`min-h-screen bg-[#383c2c] text-[#FFFDF8] flex flex-col items-center select-none antialiased ${isLargeFont ? 'accessible-mode' : ''}`}>
        {/* Fixed Neumorphic Top Bar */}
        <TopHeader
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenTelegramModal={() => setIsTelegramModalOpen(true)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          isTelegram={isTelegramEnv}
          isLargeFont={isLargeFont}
          onToggleLargeFont={handleToggleLargeFont}
        />

        {/* Main Content View with Top Margin for Fixed Header */}
        <main className="w-full max-w-4xl pt-20 pb-20 flex-1 flex flex-col">
          {activeScreen === 'onboarding' && <OnboardingScreen onNavigate={handleNavigate} />}
          {activeScreen === 'feed' && <FeedScreen onNavigate={handleNavigate} />}
          {activeScreen === 'founder' && <FounderProfileScreen onNavigate={handleNavigate} />}
          {activeScreen === 'retreats' && <RetreatsScreen onNavigate={handleNavigate} initialTab={retreatsTab} />}
          {activeScreen === 'report' && <ReflectionReportScreen onNavigate={handleNavigate} />}
          {activeScreen === 'integration' && <IntegrationScreen onNavigate={handleNavigate} />}
          {activeScreen === 'baseline' && <BaselineScreen onNavigate={handleNavigate} />}
          {activeScreen === 'workbook' && <WorkbookScreen onNavigate={handleNavigate} />}
          {activeScreen === 'experts' && <ExpertsCatalogScreen onNavigate={handleNavigate} />}
          {activeScreen === 'learning' && <LearningScreen onNavigate={handleNavigate} />}
          {activeScreen === 'club' && <ClubScreen onNavigate={handleNavigate} />}
          {activeScreen === 'practices' && <PracticesAudioScreen onNavigate={handleNavigate} />}
          {activeScreen === 'chat' && <ChatScreen onNavigate={handleNavigate} />}
          {activeScreen === 'admin' && <AdminConsoleScreen onNavigate={handleNavigate} />}
          {activeScreen === 'booking' && <BookingScreen onNavigate={handleNavigate} />}
          {activeScreen === 'labforge' && <LabForgeScreen onNavigate={handleNavigate} />}
          {activeScreen === 'coffee' && <CoffeeLoungeScreen onNavigate={handleNavigate} />}
          {activeScreen === 'social' && <SocialAccountScreen onNavigate={handleNavigate} />}
          {activeScreen === 'ethosium' && <EthosiumNexusScreen onNavigate={handleNavigate} />}
          {activeScreen === 'whitepaper' && <WhitepaperScreen onNavigate={handleNavigate} />}
          {activeScreen === 'mediakit' && <MediaKitScreen onNavigate={handleNavigate} />}
          {activeScreen === 'strategy' && <StrategyRoadmapScreen onNavigate={handleNavigate} />}
          {activeScreen === 'myday' && <MyDayScreen onNavigate={handleNavigate} />}

          {/* Production Branding Signature */}
          <footer className="w-full text-center py-8 px-4 mt-8 border-t border-[#E2ECD2]/10">
            <div className="flex flex-col items-center justify-center gap-1.5 text-[#E2ECD2]/60">
              <span className="text-xs font-mono tracking-widest uppercase font-bold text-[#FFCF96]">
                by Foxampy &amp; LabForge &amp; Semerdjidi
              </span>
              <span className="text-[10px] text-[#E2ECD2]/50 tracking-wider">
                EthOSium Production Platform • All rights reserved
              </span>
            </div>
          </footer>
        </main>

        {/* Global Share Toast Notification */}
        {shareToast && (
          <div className="fixed bottom-24 z-50 left-1/2 -translate-x-1/2 max-w-sm w-[92%] px-4 py-3 rounded-2xl neu-card border-2 border-[#FFCF96] shadow-2xl bg-[#363a2a]/95 backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 font-bold">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#FFFDF8] leading-tight">{shareToast.message}</p>
              {shareToast.url && (
                <p className="text-[10px] text-[#A9B489] truncate font-mono mt-0.5">{shareToast.url}</p>
              )}
            </div>
            <button 
              onClick={() => setShareToast(null)} 
              className="text-[#A9B489] hover:text-[#FFFDF8] text-sm p-1"
              aria-label="Закрыть уведомление"
            >
              ✕
            </button>
          </div>
        )}

        {/* Fixed Neumorphic Dock Navigation */}
        <BottomNav
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
        />

        {/* Full Module Navigation Drawer */}
        <NavigationDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          activeScreen={activeScreen}
          onSelectScreen={handleNavigate}
          onOpenTelegram={() => setIsTelegramModalOpen(true)}
          onOpenPwa={() => setIsPwaModalOpen(true)}
        />

        {/* Telegram Bot Simulator & TMA Integration Modal */}
        <TelegramBotModal
          isOpen={isTelegramModalOpen}
          onClose={() => setIsTelegramModalOpen(false)}
          onNavigate={handleNavigate}
          isTelegramContext={isTelegramEnv}
        />

        {/* PWA Download / Install SPA Modal */}
        <PwaInstallModal
          isOpen={isPwaModalOpen}
          onClose={() => setIsPwaModalOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
}
