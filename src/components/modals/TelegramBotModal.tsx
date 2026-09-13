import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface TelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  isTelegramContext: boolean;
}

export const TelegramBotModal: React.FC<TelegramBotModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  isTelegramContext,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string; buttons?: string[] }>>([
    {
      sender: 'bot',
      text: 'Добро пожаловать в цифровое пространство Психологического Центра Семерджиди!\n\nЗдесь вы можете:\n• Записаться на ретрит FRACTAL\n• Пройти чекин состояния D-3\n• Получить аудиопрактику покоя 432 Hz\n• Выбрать аккредитованного специалиста',
      time: '12:00',
      buttons: ['🏔 Ретриты 2026', '🧘 Чекин D-3', '🎧 Аудиотека', '👥 50 Экспертов', '✨ Открыть Mini App'],
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: cmd, time }]);

    setTimeout(() => {
      let reply = '';
      let targetScreen: ActiveScreen | null = null;

      if (cmd.includes('Ретрит') || cmd === '/retreat') {
        reply = 'Открываю программу ретрита FRACTAL: Точка Сборки (Чимган-Чарвак, 2,5 дня + 7 дней digital).';
        targetScreen = 'retreats';
      } else if (cmd.includes('Чекин') || cmd === '/checkin') {
        reply = 'Переходим к Baseline замеру 7 шкал самочувствия.';
        targetScreen = 'baseline';
      } else if (cmd.includes('Аудиотека') || cmd === '/practice') {
        reply = 'Запускаем нейро-аудиотеку 432 Hz для деактивации стресса.';
        targetScreen = 'practices';
      } else if (cmd.includes('Эксперт') || cmd === '/experts') {
        reply = 'Открываю каталог 50 аккредитованных резидентов центра.';
        targetScreen = 'experts';
      } else if (cmd.includes('Mini App') || cmd === '/app') {
        reply = 'Запуск Telegram Mini App внутри мессенджера...';
        targetScreen = 'feed';
      } else {
        reply = `Команда «${cmd}» принята. Бот синхронизирован с EAP ядром Семерджиди.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (targetScreen) {
        setTimeout(() => {
          onNavigate(targetScreen!);
          onClose();
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg bg-[#383c2c] rounded-3xl border border-[#BA9470]/40 flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Telegram Header */}
        <div className="p-3.5 bg-[#2d3023] border-b border-[#A9B489]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#503428] border border-[#BA9470]/50 flex items-center justify-center font-headline font-bold text-sm text-[#BA9470]">
              ЕС
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-sm text-[#F0E2C8]">Семерджиди • Бот Пространства</span>
                <span className="material-symbols-outlined text-sky-400 text-[14px]">verified</span>
              </div>
              <span className="text-[10px] text-[#A9B489]">@semerdzhidi_space_bot • bot</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#F0E2C8] hover:text-[#BA9470]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Telegram Messages Feed */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar min-h-[300px]">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#503428] text-[#F0E2C8] rounded-br-none border border-[#BA9470]/40'
                    : 'bg-[#404432] text-[#F0E2C8]/90 rounded-bl-none border border-[#A9B489]/20'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.buttons && (
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-[#A9B489]/15">
                    {m.buttons.map(btn => (
                      <button
                        key={btn}
                        onClick={() => handleCommand(btn)}
                        className="py-1.5 px-2 rounded-xl neu-btn text-[11px] font-semibold text-[#BA9470] hover:text-[#F0E2C8] text-center truncate border border-[#BA9470]/30 active:scale-95"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-[#A9B489]/60 px-1 mt-0.5">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Commands Bar */}
        <div className="p-3 bg-[#303425] border-t border-[#A9B489]/20 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleCommand(inputVal);
                setInputVal('');
              }
            }}
            placeholder="Напишите команду боту..."
            className="flex-1 bg-[#282b1e] neu-inset rounded-xl px-3 py-2 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none"
          />
          <button
            onClick={() => {
              if (inputVal.trim()) {
                handleCommand(inputVal);
                setInputVal('');
              }
            }}
            className="w-9 h-9 rounded-xl neu-btn text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
