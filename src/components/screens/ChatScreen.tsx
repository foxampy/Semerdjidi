import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { useI18n } from '../../services/i18n';
import { authService } from '../../services/authService';

interface ChatScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

interface Message {
  id: string;
  sender: 'them' | 'me';
  senderName?: string;
  text: string;
  time: string;
  channel: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const currentUser = authService.getCurrentUser();
  const [activeChannel, setActiveChannel] = useState<'concierge' | 'direct' | 'community' | 'support'>('concierge');
  
  // Real user chat messages stored in localStorage by channel
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('ethosium_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-1',
        sender: 'them',
        senderName: 'Консьерж EthOSium',
        text: 'Здравствуйте! Я ваш персональный консьерж в пространстве Семерджиди. Могу подсказать по бронированию ретрита в Чимгане (18–20 сентября), подобрать практику в аудиотеке или записать вас на вебинар.',
        time: '09:00',
        channel: 'concierge',
      },
      {
        id: 'init-2',
        sender: 'them',
        senderName: 'Екатерина Семерджиди',
        text: 'Приветствую резидентов! Сегодня в 19:00 жду всех на живой лекции по нейробиологии покоя и блуждающему нерву.',
        time: '10:15',
        channel: 'community',
      },
      {
        id: 'init-3',
        sender: 'them',
        senderName: 'Михаил (Инвестор / Резидент)',
        text: 'Привет! Будешь на мастермайнде в Ташкенте перед поездкой в горы?',
        time: 'Вчера',
        channel: 'direct',
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ethosium_chat_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }
  }, [messages]);

  const channelMessages = messages.filter(m => m.channel === activeChannel);

  const getConciergeResponse = (userText: string): string => {
    const lower = userText.toLowerCase();
    if (lower.includes('ретрит') || lower.includes('чимган') || lower.includes('мест') || lower.includes('цена') || lower.includes('бронь')) {
      return 'Флагманский ретрит «Точка Сборки» пройдет 18–20 сентября в горах Чимгана. Доступна грантовая квота со скидкой 50% ($425 вместо $850). Включены проживание в виллах, баня на реке, соматика и кони. Могу открыть модуль бронирования прямо сейчас!';
    }
    if (lower.includes('практик') || lower.includes('тревог') || lower.includes('дыхан') || lower.includes('4-7-8') || lower.includes('сон')) {
      return 'Для быстрого снятия симпатического напряжения рекомендую протокол 4-7-8 (вдох на 4 счета, задержка на 7, выдох со звуком на 8). Запись с частотой 432 Hz доступна в разделе «Практики».';
    }
    if (lower.includes('кофейн') || lower.includes('ташкент') || lower.includes('чай') || lower.includes('лаунж')) {
      return 'Лаунж EthOSium Coffee & Tea Room расположен в Ташкенте (ул. Шота Руставели). Работает ежедневно с 08:00 до 22:00. Для резидентов действует депозитная система со скидкой 15%.';
    }
    if (lower.includes('лекци') || lower.includes('вебинар') || lower.includes('семинар') || lower.includes('сегодня')) {
      return 'Сегодня в 19:00 (Ташкент / МСК) пройдет лекция Екатерины Семерджиди: «Нейробиология покоя: как остановить симпатический шторм за 4 минуты». Вы можете перейти в раздел «Мой день» или «Обучение» для участия.';
    }
    return 'Ваш запрос зафиксирован в защищенном контуре. Я передал информацию куратору потока, а также подготовил персональные рекомендации в вашем разделе «Мой день». Чем еще могу помочь?';
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    // If in concierge channel, simulate intelligent assistant answer
    if (activeChannel === 'concierge') {
      setIsTyping(true);
      setTimeout(() => {
        const replyText = getConciergeResponse(userText);
        const replyMsg: Message = {
          id: `msg-reply-${Date.now()}`,
          sender: 'them',
          senderName: 'Консьерж EthOSium',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: 'concierge',
        };
        setMessages(prev => [...prev, replyMsg]);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleClearHistory = () => {
    setMessages(prev => prev.filter(m => m.channel !== activeChannel));
  };

  const quickChips = [
    'Ретрит 18–20 сентября',
    'Дыхание 4-7-8',
    'Лекция сегодня 19:00',
    'Кофейня в Ташкенте',
  ];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-140px)] max-h-[750px] pb-3 px-3 sm:px-4 pt-1">
      {/* Channel Header */}
      <div className="neu-card rounded-2xl p-3 flex flex-col gap-2 shrink-0 border border-[#A9B489]/20 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BA9470] animate-pulse"></span>
            <span className="font-headline font-bold text-sm text-[#F0E2C8]">
              {activeChannel === 'concierge' && 'Консьерж-служба & AI Ассистент'}
              {activeChannel === 'direct' && 'Личные диалоги резидентов'}
              {activeChannel === 'community' && 'Общий канал сообщества'}
              {activeChannel === 'support' && 'Техническая линия & EAP'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {channelMessages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-[#BA9470]/70 hover:text-[#BA9470] underline"
                title="Очистить переписку"
              >
                Очистить
              </button>
            )}
            <span className="text-[9px] font-mono text-[#BA9470] neu-inset px-2 py-0.5 rounded border border-[#BA9470]/20">
              E2E PROTECTED
            </span>
          </div>
        </div>

        {/* Channel Switcher (1-word tags) */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          <button
            onClick={() => setActiveChannel('concierge')}
            className={`py-1.5 rounded-xl text-xs font-bold truncate transition-all ${
              activeChannel === 'concierge' ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40' : 'neu-btn text-[#A9B489]'
            }`}
          >
            Консьерж
          </button>
          <button
            onClick={() => setActiveChannel('direct')}
            className={`py-1.5 rounded-xl text-xs font-bold truncate transition-all ${
              activeChannel === 'direct' ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40' : 'neu-btn text-[#A9B489]'
            }`}
          >
            Личные
          </button>
          <button
            onClick={() => setActiveChannel('community')}
            className={`py-1.5 rounded-xl text-xs font-bold truncate transition-all ${
              activeChannel === 'community' ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40' : 'neu-btn text-[#A9B489]'
            }`}
          >
            Канал
          </button>
          <button
            onClick={() => setActiveChannel('support')}
            className={`py-1.5 rounded-xl text-xs font-bold truncate transition-all ${
              activeChannel === 'support' ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40' : 'neu-btn text-[#A9B489]'
            }`}
          >
            Поддержка
          </button>
        </div>
      </div>

      {/* Quick Chips for Concierge */}
      {activeChannel === 'concierge' && (
        <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputVal(chip);
              }}
              className="text-[10px] font-semibold text-[#BA9470] bg-[#BA9470]/10 hover:bg-[#BA9470]/20 border border-[#BA9470]/30 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2.5 no-scrollbar">
        {channelMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 neu-inset rounded-2xl my-auto">
            <span className="material-symbols-outlined text-4xl text-[#BA9470]/40 mb-2">forum</span>
            <p className="text-sm font-semibold text-[#F0E2C8]">
              В этом канале пока нет сообщений
            </p>
            <p className="text-xs text-[#A9B489] mt-1 max-w-xs">
              Задайте вопрос или выберите быструю подсказку выше, чтобы начать диалог.
            </p>
          </div>
        ) : (
          channelMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[88%] ${
                msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {msg.senderName && (
                <span className="text-[10px] font-bold text-[#BA9470] mb-0.5 px-1">
                  {msg.senderName}
                </span>
              )}
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                  msg.sender === 'me'
                    ? 'bg-[#434834] text-[#FFFDF8] border-[#BA9470]/40 rounded-br-none shadow-md'
                    : 'neu-card text-[#E2ECD2] border-[#A9B489]/20 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-[9px] text-[#A9B489]/60 mt-0.5 px-1 font-mono">
                {msg.time}
              </span>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start flex items-center gap-1.5 p-2 rounded-xl neu-card text-xs text-[#BA9470]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-bounce [animation-delay:0.4s]"></span>
            <span className="text-[10px] ml-1">Консьерж отвечает...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="neu-card rounded-2xl p-2 flex items-center gap-2 shrink-0 border border-[#A9B489]/25 shadow-lg">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#FFFDF8] placeholder-[#A9B489]/50 outline-none"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="w-10 h-10 rounded-xl neu-btn flex items-center justify-center text-[#BA9470] disabled:opacity-40 active:scale-95 transition-all border border-[#BA9470]/30"
          title="Отправить"
        >
          <span className="material-symbols-outlined text-[19px]">send</span>
        </button>
      </form>
    </div>
  );
};
