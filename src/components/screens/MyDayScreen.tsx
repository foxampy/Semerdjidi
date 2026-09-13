import React, { useState, useEffect } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { EthosiumTotem } from '../EthosiumTotem';
import { authService } from '../../services/authService';

interface MyDayScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

interface DailyTask {
  id: string;
  title: string;
  category: 'practice' | 'focus' | 'learning' | 'health';
  time: string;
  duration: string;
  completed: boolean;
  targetScreen?: ActiveScreen;
}

interface SeminarLecture {
  id: string;
  title: string;
  speaker: string;
  role: string;
  type: 'lecture' | 'seminar' | 'supervision';
  date: string;
  time: string;
  duration: string;
  isLiveToday?: boolean;
  spotsLeft?: number;
  description: string;
  keyPoints: string[];
}

interface PersonalOffer {
  id: string;
  tag: string;
  title: string;
  discount: string;
  description: string;
  actionText: string;
  targetScreen: ActiveScreen;
  badge: string;
  expiry: string;
}

export const MyDayScreen: React.FC<MyDayScreenProps> = ({ onNavigate }) => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'lectures' | 'tasks' | 'offers' | 'journal'>('overview');
  
  // Selected date in interactive calendar
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(10); // 10 September 2026
  
  // Local state for tasks
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const saved = localStorage.getItem('ethosium_myday_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'task-1',
        title: 'Утренний чекин витальности & психоэмоционального фона',
        category: 'health',
        time: '08:30',
        duration: '3 мин',
        completed: true,
        targetScreen: 'baseline',
      },
      {
        id: 'task-2',
        title: 'Нейро-дыхание 4-7-8 (понижение кортизола перед сессией)',
        category: 'practice',
        time: '11:00',
        duration: '5 мин',
        completed: false,
        targetScreen: 'practices',
      },
      {
        id: 'task-3',
        title: 'Заполнить срез осознанности в Воркбуке (стр. 58 «Триггеры»)',
        category: 'learning',
        time: '14:30',
        duration: '10 мин',
        completed: false,
        targetScreen: 'workbook',
      },
      {
        id: 'task-4',
        title: 'Живая лекция: «Нейробиология покоя в условиях турбулентности»',
        category: 'learning',
        time: '19:00',
        duration: '45 мин',
        completed: false,
        targetScreen: 'learning',
      },
      {
        id: 'task-5',
        title: 'Вечерняя чайная пауза & выгрузка мыслей в ежедневник',
        category: 'focus',
        time: '21:30',
        duration: '10 мин',
        completed: false,
      },
    ];
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Daily reflection notes
  const [reflectionNotes, setReflectionNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('ethosium_myday_notes');
      return saved || '';
    } catch {
      return '';
    }
  });
  const [notesSavedToast, setNotesSavedToast] = useState(false);

  // Selected lecture modal details
  const [selectedLecture, setSelectedLecture] = useState<SeminarLecture | null>(null);
  const [registeredLectures, setRegisteredLectures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('ethosium_myday_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: 'focus',
      time: 'Сегодня',
      duration: '15 мин',
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem('ethosium_myday_notes', reflectionNotes);
      setNotesSavedToast(true);
      setTimeout(() => setNotesSavedToast(false), 2500);
    } catch {
      // ignore
    }
  };

  // Seminars and lectures list
  const lecturesList: SeminarLecture[] = [
    {
      id: 'lec-1',
      title: 'Нейробиология покоя: как остановить симпатический шторм за 4 минуты',
      speaker: 'Екатерина Семерджиди',
      role: 'Клинический психолог, супервизор Института',
      type: 'lecture',
      date: 'Сегодня, 10 сентября',
      time: '19:00',
      duration: '45 мин',
      isLiveToday: true,
      spotsLeft: 6,
      description: 'Клинический разбор механизмов парасимпатического торможения, блуждающего нерва (vagus nerve) и протокола переключения внимания в критические моменты стресса.',
      keyPoints: [
        'Физиология реакций бей-беги-замри в городском ритме',
        'Техника 4-7-8 с кардио-васкулярным контролем',
        'Практические кейсы восстановления ресурсности фаундеров',
      ],
    },
    {
      id: 'lec-2',
      title: 'Семинар: Соматическая подготовка к горному ретриту Чимгана',
      speaker: 'Александр Ветров & Екатерина Семерджиди',
      role: 'Мастер соматических практик, горный гид',
      type: 'seminar',
      date: '12 сентября 2026',
      time: '18:30',
      duration: '60 мин',
      spotsLeft: 12,
      description: 'Подготовка тела и дыхательного паттерна к высотам 2200м+, перепадам давления, верховой езде на лошадях и бане на горной реке.',
      keyPoints: [
        'Дыхание на высоте и гипоксическая адаптация',
        'Работа с мышечными зажимами перед горным треком',
        'Снаряжение и психологический настрой на тишину',
      ],
    },
    {
      id: 'lec-3',
      title: 'Клиническая супервизия: Границы в партнерстве и лидерстве',
      speaker: 'Марина Озерова',
      role: 'Супервизор Института, аккредитация EAP',
      type: 'supervision',
      date: '15 сентября 2026',
      time: '16:00',
      duration: '90 мин',
      spotsLeft: 4,
      description: 'Закрытый формат супервизорской группы для предпринимателей, руководителей и резидентов Клуба EthOSium.',
      keyPoints: [
        'Разбор реальных кейсов эмоционального истощения в команде',
        'Экологичная сепарация рабочих и личных контуров',
        'Протокол обратной связи без травматизации',
      ],
    },
    {
      id: 'lec-4',
      title: 'Лекция: Архитектура Local-First данных & Цифровая автономия',
      speaker: 'Foxampy / LabForge R&D',
      role: 'Lead Architect & Systems Engineer',
      type: 'lecture',
      date: '17 сентября 2026',
      time: '20:00',
      duration: '50 мин',
      spotsLeft: 20,
      description: 'Глубокий технический вебинар о том, как устроен криптографический сейф AES-GCM-256 в EthOSium и почему данные человека должны принадлежать только ему.',
      keyPoints: [
        'Криптографическая изоляция личных заметок и воркбуков',
        'Синхронизация без серверов слежения через P2P mesh',
        'Будущее нейро-интерфейсов и персональных моделей',
      ],
    },
  ];

  // Personal offers list
  const personalOffers: PersonalOffer[] = [
    {
      id: 'off-1',
      tag: 'Ретрит в Чимгане',
      title: 'Флагманский горный ретрит 18–20 сентября: Грантовая квота -50%',
      discount: '-50%',
      description: 'Осталось 3 грантовых места на трансформационный ретрит в горах Чимгана с Екатериной Семерджиди. Полный пакет: трансфер, виллы, соматика, лошади, баня, воркбук.',
      actionText: 'Забронировать со скидкой',
      targetScreen: 'retreats',
      badge: '3 места',
      expiry: 'До 13 сентября',
    },
    {
      id: 'off-2',
      tag: 'Кофейня & Лаунж',
      title: 'Дегустационный сет «Горный сбор & Эфиопия Натурал» в Ташкенте',
      discount: 'Комплимент',
      description: 'Приходите в городской лаунж EthOSium на спешелти-сет и закрытую чайную церемонию заземления перед рабочим днем.',
      actionText: 'Открыть витрину кофейни',
      targetScreen: 'coffee',
      badge: 'Резидентам',
      expiry: 'В любое время',
    },
    {
      id: 'off-3',
      tag: 'Институт Семерджиди',
      title: 'Персональная сессия диагностики с аккредитованным специалистом',
      discount: '-30%',
      description: 'Индивидуальный часовой разбор вашего Baseline-профиля с экспертом реестра Института. Подбор персонального трека практик.',
      actionText: 'Выбрать специалиста',
      targetScreen: 'experts',
      badge: 'Персонально',
      expiry: 'Действует 48ч',
    },
    {
      id: 'off-4',
      tag: 'Академия & Клуб',
      title: 'Годовой абонемент Резидента Клуба EthOSium с доступом к базе',
      discount: 'Спецусловия',
      description: 'Неограниченный доступ ко всем вебинарам, закрытому чату, мастермайндам и скидкам 25% на все горные экспедиции.',
      actionText: 'Вступить в Клуб',
      targetScreen: 'club',
      badge: 'Клуб',
      expiry: 'До конца месяца',
    },
  ];

  // Calculate completion percentage
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Calendar dates for September 2026
  const calendarDays = [
    { num: 7, dayName: 'ПН', hasEvents: false },
    { num: 8, dayName: 'ВТ', hasEvents: true },
    { num: 9, dayName: 'СР', hasEvents: false },
    { num: 10, dayName: 'ЧТ', isToday: true, hasEvents: true },
    { num: 11, dayName: 'ПТ', hasEvents: false },
    { num: 12, dayName: 'СБ', hasEvents: true },
    { num: 13, dayName: 'ВС', hasEvents: false },
    { num: 14, dayName: 'ПН', hasEvents: false },
    { num: 15, dayName: 'ВТ', hasEvents: true },
    { num: 18, dayName: 'ПТ', isRetreat: true, hasEvents: true },
    { num: 19, dayName: 'СБ', isRetreat: true, hasEvents: true },
    { num: 20, dayName: 'ВС', isRetreat: true, hasEvents: true },
  ];

  return (
    <div className="flex flex-col w-full gap-5 pb-24 px-3 sm:px-4 pt-1">
      {/* 1. Header with Resident Status & Day Summary */}
      <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#BA9470]/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full neu-inset p-1 flex items-center justify-center border border-[#BA9470]/40">
              <EthosiumTotem size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#BA9470]">
                Ежедневник Резидента
              </span>
              <p className="text-xs font-semibold text-[#A9B489]">
                {currentUser?.name || 'Резидент EthOSium'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#F0E2C8] neu-inset px-2.5 py-1 rounded-lg border border-[#A9B489]/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Четверг, 10 сен 2026
            </span>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-2xl text-[#F0E2C8] leading-tight">
            Мой День
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5 max-w-xl">
            Центральный узел фокуса: расписание дня, персональные планы, вебинары Института, задания воркбука и предложения экосистемы.
          </p>
        </div>

        {/* Vitality & Progress Bento Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Metric 1: Ресурсность */}
          <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#A9B489] uppercase tracking-wider font-bold">Ресурс</span>
              <span className="material-symbols-outlined text-[16px] text-[#BA9470]">battery_charging_full</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-mono font-bold text-[#F0E2C8]">86%</div>
              <p className="text-[10px] text-emerald-400 font-semibold">Оптимальный баланс</p>
            </div>
          </div>

          {/* Metric 2: Выполнение планов */}
          <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#A9B489] uppercase tracking-wider font-bold">Задания дня</span>
              <span className="material-symbols-outlined text-[16px] text-[#BA9470]">task_alt</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-mono font-bold text-[#F0E2C8]">
                {completedTasksCount} / {tasks.length}
              </div>
              <div className="w-full bg-[#2a2c20] h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-[#BA9470] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Metric 3: Ближайшая лекция */}
          <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#A9B489] uppercase tracking-wider font-bold">Лекторий</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-400">live_tv</span>
            </div>
            <div className="mt-2">
              <div className="text-xs font-bold text-[#F0E2C8] truncate">Сегодня 19:00</div>
              <p className="text-[10px] text-[#BA9470] font-semibold truncate">Нейробиология покоя</p>
            </div>
          </div>

          {/* Metric 4: До ретрита Чимгана */}
          <div className="neu-inset p-3 rounded-xl border border-[#BA9470]/30 bg-[#BA9470]/5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#BA9470] uppercase tracking-wider font-bold">До Чимгана</span>
              <span className="material-symbols-outlined text-[16px] text-[#BA9470]">landscape</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-mono font-bold text-[#F0E2C8]">8 дней</div>
              <p className="text-[10px] text-[#BA9470] font-semibold">18–20 сентября 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Navigation (1-2 words labels) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          Дашборд
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'tasks'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">checklist</span>
          Задания ({tasks.filter(t => !t.completed).length})
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'schedule'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          Календарь
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'lectures'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">school</span>
          Лекции &amp; Семинары
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'offers'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">local_offer</span>
          Предложения
        </button>

        <button
          onClick={() => setActiveTab('journal')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'journal'
              ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          Ежедневник
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB: OVERVIEW (Дашборд & Сводка) */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          {/* Interactive Date Ribbon */}
          <div className="neu-card rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#F0E2C8]">Сентябрь 2026</span>
              <button 
                onClick={() => setActiveTab('schedule')}
                className="text-[#BA9470] hover:underline flex items-center gap-1 text-[11px]"
              >
                Весь календарь →
              </button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {calendarDays.map((d) => {
                const isSelected = selectedDayNumber === d.num;
                return (
                  <button
                    key={d.num}
                    onClick={() => setSelectedDayNumber(d.num)}
                    className={`flex flex-col items-center justify-center min-w-[48px] py-2 px-1.5 rounded-xl transition-all ${
                      isSelected
                        ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/50 font-bold'
                        : d.isRetreat
                          ? 'bg-[#BA9470]/15 text-[#BA9470] border border-[#BA9470]/30 hover:bg-[#BA9470]/25'
                          : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider">{d.dayName}</span>
                    <span className="text-base font-mono font-bold mt-0.5">{d.num}</span>
                    {d.hasEvents && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 ${d.isRetreat ? 'bg-[#BA9470]' : 'bg-emerald-400'}`}></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Priority Focus & Action Banner */}
          <div className="neu-card rounded-2xl p-4 border border-[#BA9470]/40 bg-gradient-to-br from-[#3d4230] to-[#343828] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-[#BA9470] shrink-0 border border-[#BA9470]/30">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#BA9470] tracking-widest">
                  Фокус Дня #1
                </span>
                <h3 className="text-sm font-bold text-[#F0E2C8] leading-snug">
                  Парасимпатическое заземление перед важным созвоном
                </h3>
                <p className="text-xs text-[#A9B489] mt-0.5">
                  Рекомендуется дыхание 4-7-8 (5 минут) в Аудиотеке Покоя.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('practices')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581] transition-all shrink-0 flex items-center gap-1.5 shadow-md self-stretch sm:self-auto justify-center"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Запустить практику
            </button>
          </div>

          {/* Active Tasks Checklist (Top 3) */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#BA9470]">checklist</span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">Планы &amp; Задания на сегодня</h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-[#BA9470] hover:underline"
              >
                Все задания ({tasks.length}) →
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {tasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl neu-inset border transition-all flex items-center justify-between gap-3 ${
                    task.completed 
                      ? 'border-emerald-500/20 opacity-70 bg-emerald-950/10' 
                      : 'border-[#A9B489]/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        task.completed 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                      }`}
                    >
                      {task.completed && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold leading-tight truncate ${task.completed ? 'line-through text-[#A9B489]' : 'text-[#F0E2C8]'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#A9B489] mt-0.5">
                        <span>{task.time}</span>
                        <span>•</span>
                        <span>{task.duration}</span>
                      </div>
                    </div>
                  </div>

                  {task.targetScreen && (
                    <button
                      onClick={() => onNavigate(task.targetScreen!)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#BA9470] neu-btn hover:text-[#FFFDF8] shrink-0"
                    >
                      Открыть
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Featured Live Seminar Today */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                  Сегодня в Лектории (19:00 Ташкент / МСК)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 neu-inset px-2 py-0.5 rounded border border-emerald-400/20">
                LIVE СЕГОДНЯ
              </span>
            </div>

            <div className="neu-inset p-3.5 rounded-xl border border-[#A9B489]/20 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#F0E2C8] leading-tight">
                    «Нейробиология покоя: как остановить симпатический шторм за 4 минуты»
                  </h4>
                  <p className="text-xs text-[#BA9470] mt-0.5">
                    Спикер: Екатерина Семерджиди (Клинический психолог)
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A9B489] line-clamp-2">
                Практический разбор парасимпатического торможения, блуждающего нерва и клинических протоколов восстановления ресурсности.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#A9B489]">
                  Свободно мест: <strong className="text-[#F0E2C8]">6</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLecture(lecturesList[0])}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#BA9470] neu-btn"
                  >
                    Подробнее
                  </button>
                  <button
                    onClick={() => onNavigate('learning')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581] transition-all"
                  >
                    Перейти в кабинет
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ecosystem Hub Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => onNavigate('baseline')}
              className="neu-btn p-3 rounded-xl flex flex-col items-center gap-1.5 text-center text-[#A9B489] hover:text-[#F0E2C8]"
            >
              <span className="material-symbols-outlined text-[22px] text-[#BA9470]">tune</span>
              <span className="text-xs font-semibold">Чекин Baseline</span>
              <span className="text-[9px] text-[#A9B489]">3 мин • 7 шкал</span>
            </button>

            <button
              onClick={() => onNavigate('workbook')}
              className="neu-btn p-3 rounded-xl flex flex-col items-center gap-1.5 text-center text-[#A9B489] hover:text-[#F0E2C8]"
            >
              <span className="material-symbols-outlined text-[22px] text-[#BA9470]">auto_stories</span>
              <span className="text-xs font-semibold">Воркбук</span>
              <span className="text-[9px] text-[#A9B489]">Стр. 56–64</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="neu-btn p-3 rounded-xl flex flex-col items-center gap-1.5 text-center text-[#A9B489] hover:text-[#F0E2C8]"
            >
              <span className="material-symbols-outlined text-[22px] text-[#BA9470]">support_agent</span>
              <span className="text-xs font-semibold">Консьерж</span>
              <span className="text-[9px] text-[#A9B489]">Чат куратора</span>
            </button>

            <button
              onClick={() => onNavigate('coffee')}
              className="neu-btn p-3 rounded-xl flex flex-col items-center gap-1.5 text-center text-[#A9B489] hover:text-[#F0E2C8]"
            >
              <span className="material-symbols-outlined text-[22px] text-[#BA9470]">local_cafe</span>
              <span className="text-xs font-semibold">Кофейня</span>
              <span className="text-[9px] text-[#A9B489]">Ташкент • Чай</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB: TASKS (Задания дня & Планы) */}
      {activeTab === 'tasks' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Список Заданий &amp; Планов</h2>
                <p className="text-xs text-[#A9B489]">
                  Отмечайте выполненные пункты дня для сохранения прогресса в локальном сейфе.
                </p>
              </div>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581] flex items-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                План
              </button>
            </div>

            {/* Add Task Form */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="neu-inset p-3 rounded-xl border border-[#BA9470]/30 flex flex-col gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Название задачи или фокуса дня..."
                  className="bg-transparent text-xs text-[#F0E2C8] placeholder-[#A9B489]/60 outline-none w-full"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-3 py-1 text-xs text-[#A9B489] hover:text-[#F0E2C8]"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#BA9470] text-[#383c2c] text-xs font-bold rounded-lg"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            <div className="flex flex-col gap-2 pt-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl neu-inset border transition-all flex items-center justify-between gap-3 ${
                    task.completed 
                      ? 'border-emerald-500/20 bg-emerald-950/15' 
                      : 'border-[#A9B489]/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        task.completed 
                          ? 'bg-emerald-500 text-white shadow-sm' 
                          : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
                      }`}
                    >
                      {task.completed && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${task.completed ? 'line-through text-[#A9B489]' : 'text-[#F0E2C8]'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#A9B489] mt-0.5">
                        <span>Время: {task.time}</span>
                        <span>•</span>
                        <span>Длительность: {task.duration}</span>
                      </div>
                    </div>
                  </div>

                  {task.targetScreen && (
                    <button
                      onClick={() => onNavigate(task.targetScreen!)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#BA9470] neu-btn hover:text-[#FFFDF8] shrink-0"
                    >
                      Перейти
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: SCHEDULE (Календарь & Расписание) */}
      {activeTab === 'schedule' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Календарь Событий — Сентябрь 2026</h2>
                <p className="text-xs text-[#A9B489]">Ключевые даты экосистемы, вебинары и горные экспедиции.</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-1 rounded-lg">
                Четверг, 10 сен
              </span>
            </div>

            {/* Timeline Schedule for Selected Day */}
            <div className="neu-inset p-4 rounded-xl border border-[#A9B489]/20 flex flex-col gap-3">
              <span className="text-xs font-bold text-[#F0E2C8] uppercase tracking-wider">
                Расписание на 10 сентября 2026:
              </span>

              <div className="relative border-l-2 border-[#BA9470]/30 pl-4 space-y-4 ml-1">
                {/* 08:30 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] font-mono text-[#BA9470]">08:30 — 08:45</span>
                  <h4 className="text-xs font-bold text-[#F0E2C8]">Утренний чекин Baseline</h4>
                  <p className="text-[11px] text-[#A9B489]">Калибровка сна, уровня кортизола и фокуса внимания.</p>
                </div>

                {/* 11:00 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#BA9470]"></div>
                  <span className="text-[10px] font-mono text-[#BA9470]">11:00 — 11:15</span>
                  <h4 className="text-xs font-bold text-[#F0E2C8]">Соматическая пауза 4-7-8</h4>
                  <p className="text-[11px] text-[#A9B489]">Аудио-сессия заземления в наушниках.</p>
                </div>

                {/* 15:00 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-[#A9B489]"></div>
                  <span className="text-[10px] font-mono text-[#BA9470]">15:00 — 16:00</span>
                  <h4 className="text-xs font-bold text-[#F0E2C8]">Коворкинг &amp; Чайная комната</h4>
                  <p className="text-[11px] text-[#A9B489]">Городской лаунж EthOSium Ташкент: фокусная работа.</p>
                </div>

                {/* 19:00 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-[#BA9470]">19:00 — 19:45 (LIVE)</span>
                  <h4 className="text-xs font-bold text-[#F0E2C8]">Лекция Екатерины Семерджиди</h4>
                  <p className="text-[11px] text-[#A9B489]">«Нейробиология покоя: как переключить симпатику».</p>
                </div>
              </div>
            </div>

            {/* Upcoming Major Milestones */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#A9B489] uppercase tracking-wider block mb-2">
                Ближайшие ключевые вехи:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-xl neu-inset border border-[#BA9470]/30 bg-[#BA9470]/5 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#BA9470]">landscape</span>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#BA9470]">18–20 СЕНТЯБРЯ</span>
                    <h5 className="text-xs font-bold text-[#F0E2C8]">Флагманский Ретрит в Чимгане</h5>
                    <p className="text-[10px] text-[#A9B489]">3 дня в горах: виллы, кони, соматика, баня.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl neu-inset border border-[#A9B489]/20 flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#A9B489]">groups</span>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#A9B489]">24 СЕНТЯБРЯ</span>
                    <h5 className="text-xs font-bold text-[#F0E2C8]">Мастермайнд Клуба Резидентов</h5>
                    <p className="text-[10px] text-[#A9B489]">Стратегическая сессия участников сообщества.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LECTURES (Лекции & Семинары) */}
      {activeTab === 'lectures' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Лекции, Семинары &amp; Супервизии</h2>
              <p className="text-xs text-[#A9B489]">
                Академический лекторий Института Семерджиди: научный подход, клинические супервизоры и соматические мастера.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {lecturesList.map(lec => {
                const isRegistered = registeredLectures[lec.id];
                return (
                  <div
                    key={lec.id}
                    className={`p-4 rounded-xl neu-inset border transition-all flex flex-col gap-2.5 ${
                      lec.isLiveToday ? 'border-[#BA9470]/50 bg-[#BA9470]/5' : 'border-[#A9B489]/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            lec.type === 'lecture' ? 'bg-[#BA9470]/20 text-[#BA9470]' :
                            lec.type === 'seminar' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {lec.type === 'lecture' ? 'Лекция' : lec.type === 'seminar' ? 'Семинар' : 'Супервизия'}
                          </span>
                          {lec.isLiveToday && (
                            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                              ● СЕГОДНЯ
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#F0E2C8] mt-1 leading-snug">
                          {lec.title}
                        </h3>
                        <p className="text-xs text-[#BA9470]">
                          {lec.speaker} • <span className="text-[#A9B489]">{lec.role}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-[#F0E2C8]">{lec.time}</div>
                        <div className="text-[10px] text-[#A9B489]">{lec.date}</div>
                      </div>
                    </div>

                    <p className="text-xs text-[#A9B489]">
                      {lec.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                      <span className="text-[11px] text-[#A9B489]">
                        Длительность: <strong className="text-[#F0E2C8]">{lec.duration}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLecture(lec)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#BA9470] neu-btn"
                        >
                          План лекции
                        </button>
                        <button
                          onClick={() => {
                            setRegisteredLectures(prev => ({ ...prev, [lec.id]: !prev[lec.id] }));
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isRegistered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#BA9470] text-[#383c2c] hover:bg-[#c9a581]'
                          }`}
                        >
                          {isRegistered ? '✓ Вы записаны' : 'Записаться'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: OFFERS (Предложения Дня) */}
      {activeTab === 'offers' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Персональные Предложения Дня</h2>
              <p className="text-xs text-[#A9B489]">
                Грантовые квоты, закрытые клубные преференции и спецусловия резидентов экосистемы.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {personalOffers.map(off => (
                <div
                  key={off.id}
                  className="p-4 rounded-xl neu-inset border border-[#BA9470]/40 bg-gradient-to-br from-[#3b3f2e] to-[#343828] flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#BA9470] bg-[#BA9470]/20 px-2 py-0.5 rounded">
                          {off.tag}
                        </span>
                        <span className="text-[10px] text-[#A9B489]">{off.expiry}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#F0E2C8] mt-1 leading-snug">
                        {off.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#BA9470] neu-inset px-2.5 py-1 rounded-lg border border-[#BA9470]/30 shrink-0">
                      {off.discount}
                    </span>
                  </div>

                  <p className="text-xs text-[#A9B489]">
                    {off.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Доступно в профиле
                    </span>
                    <button
                      onClick={() => onNavigate(off.targetScreen)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581] transition-all flex items-center gap-1"
                    >
                      {off.actionText} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: JOURNAL (Ежедневник Рефлексии) */}
      {activeTab === 'journal' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Ежедневник Рефлексии</h2>
                <p className="text-xs text-[#A9B489]">
                  Ваши персональные заметки, инсайты и вечерняя выгрузка мыслей в локальный крипто-сейф.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#BA9470] neu-inset px-2 py-0.5 rounded">
                E2E LOCAL
              </span>
            </div>

            <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/20 flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#BA9470] uppercase tracking-wider">
                Заметки дня &amp; Рефлексия (10 сентября 2026):
              </label>
              <textarea
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="Что сегодня дало энергию? Что забрало ресурс? Какой один главный вывод дня вы фиксируете?..."
                rows={7}
                className="w-full bg-transparent text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/15">
                <span className="text-[10px] text-[#A9B489]">
                  Сохраняется на вашем устройстве
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581] transition-all"
                >
                  Сохранить заметку
                </button>
              </div>
            </div>

            {notesSavedToast && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Заметка успешно сохранена в локальный сейф резидента!
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Lecture Details */}
      {selectedLecture && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card w-full max-w-lg rounded-2xl p-5 border border-[#BA9470]/50 shadow-2xl flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#BA9470] tracking-wider">
                  Программа занятия
                </span>
                <h3 className="font-headline font-bold text-base text-[#F0E2C8] mt-0.5">
                  {selectedLecture.title}
                </h3>
                <p className="text-xs text-[#BA9470]">
                  {selectedLecture.speaker} ({selectedLecture.role})
                </p>
              </div>
              <button
                onClick={() => setSelectedLecture(null)}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#A9B489] hover:text-[#F0E2C8]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#A9B489]">
              {selectedLecture.description}
            </p>

            <div className="neu-inset p-3 rounded-xl border border-[#A9B489]/15">
              <span className="text-[10px] font-bold text-[#F0E2C8] uppercase tracking-wider block mb-1.5">
                Ключевые темы разбора:
              </span>
              <ul className="space-y-1">
                {selectedLecture.keyPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-[#A9B489] flex items-start gap-1.5">
                    <span className="text-[#BA9470]">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs">
                <span className="text-[#A9B489]">Время: </span>
                <strong className="text-[#F0E2C8]">{selectedLecture.time} ({selectedLecture.duration})</strong>
              </div>
              <button
                onClick={() => {
                  setRegisteredLectures(prev => ({ ...prev, [selectedLecture.id]: true }));
                  setSelectedLecture(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#383c2c] bg-[#BA9470] hover:bg-[#c9a581]"
              >
                Записаться на вебинар
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
