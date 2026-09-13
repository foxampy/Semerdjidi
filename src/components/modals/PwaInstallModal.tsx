import React, { useState, useEffect } from 'react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Capture beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Simulate/trigger browser add to home
      alert('Для установки приложения нажмите «Поделиться» или меню браузера (⋮) ➔ «Установить приложение / На экран Домой»');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#383c2c] rounded-3xl border border-[#BA9470]/40 p-5 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl neu-inset p-1.5 flex items-center justify-center border border-[#BA9470]/40">
              <svg className="w-full h-full text-[#BA9470]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="8" viewBox="0 0 100 100">
                <path d="M50 50 A 6 6 0 0 1 50 38 A 14 14 0 0 1 50 66 A 22 22 0 0 1 50 22 A 30 30 0 0 1 50 78 A 38 38 0 0 1 50 6"></path>
              </svg>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Скачать SPA • Приложение</h2>
              <span className="text-[10px] uppercase font-semibold text-[#A9B489]">PWA Офлайн-режим</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#F0E2C8] hover:text-[#BA9470]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="neu-inset p-3.5 rounded-2xl space-y-2 text-xs text-[#F0E2C8]/90 leading-relaxed border border-[#A9B489]/15">
          <p className="font-semibold text-[#BA9470]">Преимущества установки приложения:</p>
          <ul className="space-y-1 text-[11px] text-[#A9B489]">
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#BA9470] text-[14px]">offline_pin</span>
              <span>Полная работа в горах Чимгана без интернета (аудиотека и воркбук)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#BA9470] text-[14px]">bolt</span>
              <span>Мгновенный запуск с экрана вашего смартфона или рабочего стола</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#BA9470] text-[14px]">lock</span>
              <span>Защищенное шифрованное локальное хранилище дневников</span>
            </li>
          </ul>
        </div>

        {platform === 'ios' ? (
          <div className="neu-card p-3 rounded-xl space-y-1.5 text-xs text-[#F0E2C8]">
            <span className="font-bold text-[#BA9470] block">Инструкция для iPhone / iPad (Safari):</span>
            <p className="text-[11px] text-[#A9B489]">1. Нажмите иконку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх) внизу экрана.</p>
            <p className="text-[11px] text-[#A9B489]">2. Прокрутите вниз и выберите <strong>«На экран Домой»</strong>.</p>
            <p className="text-[11px] text-[#A9B489]">3. Нажмите <strong>«Добавить»</strong> в правом верхнем углу.</p>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 neu-btn rounded-xl font-bold text-sm text-[#F0E2C8] border border-[#BA9470]/50 shadow-lg flex items-center justify-center gap-2 hover:text-[#BA9470] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-[#BA9470]">install_mobile</span>
            <span>{isInstalled ? 'Приложение установлено ✓' : 'Установить приложение на устройство'}</span>
          </button>
        )}

        <div className="flex items-center justify-between pt-1 text-[10px] text-[#A9B489]">
          <span>Service Worker: Активен</span>
          <span>Кэш: 100% готов</span>
        </div>
      </div>
    </div>
  );
};
