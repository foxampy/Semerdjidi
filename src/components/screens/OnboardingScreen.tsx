import React, { useState } from 'react';
import { ActiveScreen, EthosiumUserProfile } from '../../semerdzhidiTypes';
import { authService } from '../../services/authService';
import { shareModule } from '../../utils/shareHelper';

interface OnboardingScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'test' | 'register' | 'retreatOffer'>('ecosystem');

  // Test answers state for 7 questions
  const [testAnswers, setTestAnswers] = useState({
    q1: 'Пытаетесь сами разобраться и найти решение',
    q2: 'Ставите цель и начинаете действовать',
    q3Choice: 'Сказать человеку «нет»',
    q3Reason: 'Опасение вызвать обиду или испортить доверительный контакт',
    q4Choice: 'Ощущать близость, взаимность и эмоциональную связь',
    q4Excess: 'При избытке близости возникает тревога потери личных границ',
    q5: 'Интерес и желание понять его',
    q6: 'Самому построить план и начать двигаться',
    q7: 'Возможность соединить эти качества в себе',
  });

  const [testSubmitted, setTestSubmitted] = useState(false);

  // Registration state - ALL FIELDS EMPTY, ZERO HARDCODED DEMO DATA
  const [regForm, setRegForm] = useState({
    name: '',
    emailOrTg: '',
    role: 'Предприниматель / Лидер проектов',
    contour: 'both' as 'labforge' | 'semerdzhidi' | 'both',
    password: '',
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [preRegLocked, setPreRegLocked] = useState(false);
  const [preRegCertificateId, setPreRegCertificateId] = useState('');
  const [preRegData, setPreRegData] = useState({
    name: '',
    contact: '',
    format: 'standard' as 'standard' | 'vip',
  });

  const [userProfile, setUserProfile] = useState<EthosiumUserProfile | null>(() => {
    return authService.getCurrentUser();
  });

  // Calculate Profile Result from 7 questions
  const getArchetypeResult = () => {
    let focus = 'Интегратор Систем и Смыслов (EthOSium Nexus)';
    let description = 'Вы стремитесь соединять аналитическую строгость и глубокое психологическое самосознание. Обладаете потенциалом гармонизировать технологические контуры и человеческие отношения.';
    
    if (testAnswers.q7.includes('Сила')) {
      focus = 'Стратег-Создатель (Контур LabForge)';
      description = 'Ваш ведущий фокус — системная автономия, архитектура процессов, четкие цели и преодоление барьеров через самостоятельное созидание.';
    } else if (testAnswers.q7.includes('Любовь')) {
      focus = 'Эмпат-Резонатор (Контур Семерджиди)';
      description = 'Ваш ведущий фокус — эмоциональная близость, тонкое чувствование людей, телесно-эмоциональный отклик и глубинная психологическая связь.';
    }

    return { focus, description };
  };

  const handleFinishTest = () => {
    setTestSubmitted(true);
    if (userProfile) {
      authService.saveUserTestAnswers(testAnswers, userProfile);
    }
    setActiveTab('register');
  };

  // Automatic OAuth sign in (Google, Apple, Facebook)
  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setAuthLoading(true);
      setAuthNotice({ text: `Подключение через ${provider.toUpperCase()}...`, type: 'info' });

      // If user typed custom name, pass it along
      const customName = regForm.name.trim() || undefined;
      const customEmail = regForm.emailOrTg.trim() || undefined;

      const res = await authService.signInOAuth(provider, { name: customName, email: customEmail });

      if (res.success && res.user) {
        setUserProfile(res.user);
        setIsRegistered(true);
        authService.saveUserTestAnswers(testAnswers, res.user);
        // Pre-fill retreat data with authenticated identity
        setPreRegData(prev => ({
          ...prev,
          name: res.user?.name || prev.name,
          contact: res.user?.emailOrTg || prev.contact,
        }));
        setAuthNotice({
          text: `Успешная авторизация через ${provider.toUpperCase()}! Профиль сохранён в БД.`,
          type: 'success'
        });
        setTimeout(() => {
          setActiveTab('retreatOffer');
        }, 1200);
      } else {
        setAuthNotice({ text: res.error || 'Ошибка OAuth подключения', type: 'error' });
      }
    } catch (e: any) {
      setAuthNotice({ text: e.message || 'Ошибка авторизации', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Manual Email/TG Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = regForm.emailOrTg.trim();
    if (!cleanEmail) {
      setAuthNotice({ text: 'Пожалуйста, укажите email или Telegram', type: 'error' });
      return;
    }
    const cleanName = regForm.name.trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail) || 'Резидент';

    try {
      setAuthLoading(true);
      const archetype = getArchetypeResult().focus;
      const res = await authService.registerEmail({
        name: cleanName,
        emailOrTg: cleanEmail,
        password: regForm.password,
        role: regForm.role,
        contour: regForm.contour,
        archetype,
      });

      if (res.success && res.user) {
        setUserProfile(res.user);
        setIsRegistered(true);
        authService.saveUserTestAnswers(testAnswers, res.user);
        setPreRegData(prev => ({
          ...prev,
          name: res.user?.name || prev.name,
          contact: res.user?.emailOrTg || prev.contact,
        }));
        setAuthNotice({ text: 'Аккаунт успешно создан и записан в базу данных!', type: 'success' });
        setTimeout(() => {
          setActiveTab('retreatOffer');
        }, 800);
      } else {
        setAuthNotice({ text: res.error || 'Не удалось завершить регистрацию', type: 'error' });
      }
    } catch (e: any) {
      setAuthNotice({ text: e.message || 'Ошибка сети', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Pre-registration for retreat
  const handlePreRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preRegData.name.trim() || !preRegData.contact.trim()) {
      return;
    }
    const res = await authService.preRegisterRetreat({
      userId: userProfile?.id,
      name: preRegData.name,
      contact: preRegData.contact,
      format: preRegData.format,
    });
    setPreRegCertificateId(res.certificateId);
    setPreRegLocked(true);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Onboarding Navigation Bar */}
      <div className="neu-card rounded-2xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
              EthOSium Onboarding &amp; Gateway
            </span>
            {userProfile && (
              <span className="text-[9px] bg-[#BA9470]/20 text-[#BA9470] px-2 py-0.5 rounded font-bold">
                ID: {userProfile.id}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#A9B489] hidden xs:inline">
              Архитектура &amp; Вход
            </span>
            <button
              onClick={() => shareModule('onboarding')}
              className="neu-btn px-2.5 py-1 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              title="Поделиться онбордингом"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Поделиться</span>
            </button>
          </div>
        </div>

        {/* Action announcement banner: Test & 50% discount moved to Retreats module */}
        <div className="neu-inset p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/25 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0">forest</span>
            <span className="text-[11px] text-[#E2ECD2] leading-tight truncate">
              Тест 7 вопросов, регистрация и скидка 50% — в модуле «Ретриты»
            </span>
          </div>
          <button
            onClick={() => onNavigate('retreats')}
            className="neu-btn px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#FFCF96] border border-[#BA9470]/50 shrink-0 hover:text-[#FFFDF8] active:scale-95 transition-all"
          >
            К ретритам →
          </button>
        </div>

        {/* Tabs Switcher */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          <button
            onClick={() => setActiveTab('ecosystem')}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold truncate transition-all ${
              activeTab === 'ecosystem'
                ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/40 shadow'
                : 'neu-btn text-[#A9B489]'
            }`}
          >
            1. Экосистема
          </button>
          <button
            onClick={() => onNavigate('retreats')}
            className="py-2 px-1 rounded-xl text-[10px] font-bold truncate transition-all neu-btn text-[#A9B489] hover:text-[#FFCF96]"
            title="Перейти к тесту в модуле Ретриты"
          >
            2. Тест (Ретрит)
          </button>
          <button
            onClick={() => onNavigate('retreats')}
            className="py-2 px-1 rounded-xl text-[10px] font-bold truncate transition-all neu-btn text-[#A9B489] hover:text-[#FFCF96]"
            title="Перейти к регистрации в модуле Ретриты"
          >
            3. Регистрация
          </button>
          <button
            onClick={() => onNavigate('retreats')}
            className="py-2 px-1 rounded-xl text-[10px] font-bold truncate transition-all neu-btn text-[#BA9470] hover:text-[#FFCF96] flex items-center justify-center gap-1"
            title="Перейти к скидке 50% в модуле Ретриты"
          >
            <span>4. Скидка 50%</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-ping"></span>
          </button>
        </div>
      </div>

      {/* TAB 1: ЧТО ТАКОЕ ETHOSIUM, LABFORGE И ЦЕНТР СЕМЕРДЖИДИ */}
      {activeTab === 'ecosystem' && (
        <div className="flex flex-col gap-4">
          {/* Hero Meta Card */}
          <div className="neu-card-highlight rounded-2xl p-5 flex flex-col gap-3 border border-[#BA9470]/40 bg-gradient-to-br from-[#3e4231] via-[#3a3e2d] to-[#473b2c]/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470]">
                Манифест Единства &amp; Синергии
              </span>
              <span className="material-symbols-outlined text-[#BA9470] text-[20px]">hub</span>
            </div>

            <div>
              <h1 className="font-headline font-bold text-2xl text-[#F0E2C8] tracking-tight">
                Что такое EthOSium?
              </h1>
              <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
                <strong>EthOSium</strong> — это мета-экосистема и цифровая среда нового поколения, которая объединяет бизнес-управление, технологические контуры и глубинную психологию человека в едином гармоничном интерфейсе.
              </p>
            </div>

            <div className="neu-inset p-3.5 rounded-xl border border-[#A9B489]/20 text-xs text-[#F0E2C8]/90 leading-relaxed space-y-1.5">
              <p>
                Вместо разрозненных сервисов и выгорания лидеров, EthOSium выстраивает <strong>бесшовную интеграцию</strong>: процессы компании не подавляют личность, а опираются на телесное здоровье, прозрачные протоколы и живую синергию участников.
              </p>
            </div>
          </div>

          {/* Two Professional Pillars: LabForge & Semerdzhidi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pillar 1: LabForge */}
            <div className="neu-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-[#A9B489]/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#BA9470] text-[20px]">precision_manufacturing</span>
                    <h2 className="font-headline font-bold text-base text-[#F0E2C8]">LabForge</h2>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#A9B489] neu-inset px-2 py-0.5 rounded">R&amp;D &amp; Архитектура</span>
                </div>

                <p className="text-xs text-[#F0E2C8]/85 font-medium leading-snug">
                  Лаборатория исследований, разработки и системной интеграции.
                </p>

                <div className="neu-inset p-3 rounded-xl text-xs text-[#A9B489] space-y-1.5 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>Стратегирование &amp; Консалтинг:</strong> Аудит и пересборка бизнес-моделей под вызовы масштабирования.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>Архитектура экосистемы:</strong> Создание кросс-платформенных сред, контуров Zero-Trust и интеграций.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>ИИ-оптимизация процессов:</strong> Аналитика операций в реальном времени без сбоев.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#A9B489]/15 flex items-center justify-between text-[11px] text-[#A9B489]">
                <span>Профессиональный участник</span>
                <span className="text-[#BA9470] font-bold">Контур Tech &amp; Ops</span>
              </div>
            </div>

            {/* Pillar 2: Semerdzhidi */}
            <div className="neu-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-[#A9B489]/20">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#BA9470] text-[20px]">spa</span>
                    <h2 className="font-headline font-bold text-base text-[#F0E2C8]">Центр Семерджиди</h2>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#A9B489] neu-inset px-2 py-0.5 rounded">Психология &amp; Здоровье</span>
                </div>

                <p className="text-xs text-[#F0E2C8]/85 font-medium leading-snug">
                  Центр научных исследований и практик психологии и здоровья.
                </p>

                <div className="neu-inset p-3 rounded-xl text-xs text-[#A9B489] space-y-1.5 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>Научная экспертиза:</strong> Клинические исследования под руководством Екатерины Семерджиди.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>Нейровегетативная регуляция:</strong> Восстановление вегетативной нервной системы (ВНС, метод 4-7-8).</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-[#BA9470] font-bold">✓</span>
                    <span><strong>FRACTAL Ретриты &amp; 50 Экспертов:</strong> Выездные программы в горах, супервизии и аккредитация EAP.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#A9B489]/15 flex items-center justify-between text-[11px] text-[#A9B489]">
                <span>Профессиональный участник</span>
                <span className="text-[#BA9470] font-bold">Контур Mind &amp; Body</span>
              </div>
            </div>
          </div>

          {/* Integration Diagram */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
              Как взаимодействуют участники внутри EthOSium:
            </h3>
            
            <div className="neu-inset p-3.5 rounded-xl border border-[#A9B489]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs">
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#BA9470]">LabForge</span>
                <span className="text-[10px] text-[#A9B489]">Инструменты, R&amp;D, консалтинг</span>
              </div>
              <span className="material-symbols-outlined text-[#BA9470] text-[20px] rotate-90 sm:rotate-0">sync_alt</span>
              <div className="flex flex-col items-center">
                <span className="font-headline font-bold text-sm text-[#F0E2C8]">EthOSium Ядро</span>
                <span className="text-[10px] text-[#A9B489]">Единая среда управления &amp; данных</span>
              </div>
              <span className="material-symbols-outlined text-[#BA9470] text-[20px] rotate-90 sm:rotate-0">sync_alt</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#BA9470]">Центр Семерджиди</span>
                <span className="text-[10px] text-[#A9B489]">Психология, лидеры, баланс</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveTab('test')}
                className="w-full sm:w-auto px-5 py-3 neu-btn rounded-xl font-bold text-xs text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Перейти к тестированию личности (7 вопросов)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ПСИХОЛОГИЧЕСКИЙ ТЕСТ (7 ТОЧНЫХ ВОПРОСОВ ИЗ ЗАПРОСА) */}
      {activeTab === 'test' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2 py-0.5 rounded">
                7 вопросов для участников
              </span>
              <span className="text-xs text-[#A9B489]">Диагностика устойчивости</span>
            </div>
            <h2 className="font-headline font-bold text-lg text-[#F0E2C8]">
              Определение вашего профиля в EthOSium
            </h2>
            <p className="text-xs text-[#A9B489] leading-relaxed">
              Ответьте искренне на 7 исследовательских вопросов. На основе ответов система определит ваш персональный психологический паттерн и откроет спец-скидку на ретрит 19-20 сентября.
            </p>
          </div>

          {/* Question 1 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 1 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Когда в жизни появляется сложная ситуация, что вы делаете первым делом?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Пытаетесь сами разобраться и найти решение, ищете человека, с которым можно это обсудить, или сначала просто наблюдаете и пытаетесь понять, что вы чувствуете?
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Пытаетесь сами разобраться и найти решение',
                'Ищете человека, с которым можно это обсудить',
                'Сначала просто наблюдаете и пытаетесь понять, что вы чувствуете',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q1: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q1 === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q1 === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 2 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Когда вы чего-то очень хотите, как обычно двигаетесь к этому?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Ставите цель и начинаете действовать, ждёте подходящего момента и внутренней готовности или идёте через людей, отношения и возможности, которые появляются по пути?
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Ставите цель и начинаете действовать',
                'Ждёте подходящего момента и внутренней готовности',
                'Идёте через людей, отношения и возможности, которые появляются по пути',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q2: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q2 === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q2 === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 3 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Что вам сложнее — попросить о помощи или сказать человеку «нет»?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              И почему именно это для вас сложно?
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {['Попросить о помощи', 'Сказать человеку «нет»'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q3Choice: opt })}
                  className={`p-2.5 rounded-xl text-center transition-all ${
                    testAnswers.q3Choice === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">
                Почему именно это сложно для вас:
              </label>
              <input
                type="text"
                value={testAnswers.q3Reason}
                onChange={(e) => setTestAnswers({ ...testAnswers, q3Reason: e.target.value })}
                placeholder="Опишите ваши внутренние ощущения..."
                className="w-full neu-inset rounded-xl px-3 py-2 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Question 4 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 4 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              В отношениях вам важнее чувствовать свободу и возможность оставаться собой или ощущать близость, взаимность и эмоциональную связь?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Что происходит, когда одного из этих элементов становится слишком много?
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Свободу и возможность оставаться собой',
                'Ощущать близость, взаимность и эмоциональную связь',
                'Баланс: свобода без потери глубокого союза',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q4Choice: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q4Choice === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q4Choice === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">
                Что происходит, когда элемента становится слишком много:
              </label>
              <input
                type="text"
                value={testAnswers.q4Excess}
                onChange={(e) => setTestAnswers({ ...testAnswers, q4Excess: e.target.value })}
                placeholder="При избытке свободы чувствую отчуждение, при избытке близости..."
                className="w-full neu-inset rounded-xl px-3 py-2 text-xs text-[#F0E2C8] border border-[#A9B489]/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Question 5 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 5 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Когда человек рядом с вами сильно отличается от вас, что вы чаще чувствуете?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Интерес и желание понять его, раздражение и желание изменить ситуацию или притяжение, которое трудно объяснить?
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Интерес и желание понять его',
                'Раздражение и желание изменить ситуацию',
                'Притяжение, которое трудно объяснить',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q5: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q5 === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q5 === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Question 6 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 6 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Представьте, что вы точно знаете, чего хотите от жизни, но путь к этому пока совершенно не понятен. Что вам ближе?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Самому построить план и начать двигаться, прислушиваться к ощущениям и ждать момента, когда станет понятно направление, или двигаться через эксперимент и смотреть, куда приведёт жизнь?
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Самому построить план и начать двигаться',
                'Прислушиваться к ощущениям и ждать момента, когда станет понятно направление',
                'Двигаться через эксперимент и смотреть, куда приведёт жизнь',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q6: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q6 === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q6 === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Question 7 */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5 border-l-4 border-l-[#BA9470]">
            <span className="text-[10px] uppercase font-bold text-[#BA9470]">Вопрос 7 из 7</span>
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8] leading-snug">
              Если убрать ожидания семьи, общества и окружающих — каким человеком вам самому хотелось бы стать?
            </h3>
            <p className="text-[11px] text-[#A9B489] -mt-1">
              Что в этом образе вам особенно важно:
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              {[
                'Сила, самостоятельность и способность создавать',
                'Любовь, близость и способность чувствовать',
                'Возможность соединить эти качества в себе',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setTestAnswers({ ...testAnswers, q7: opt })}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                    testAnswers.q7 === opt ? 'neu-pill-active border border-[#BA9470]/50 text-[#F0E2C8] font-bold' : 'neu-inset text-[#A9B489]'
                  }`}
                >
                  <span>{opt}</span>
                  {testAnswers.q7 === opt && <span className="text-[#BA9470] text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Finish Test & View Result Button */}
          <div className="neu-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#F0E2C8] block">Все 7 ответов заполнены</span>
              <span className="text-[10px] text-[#A9B489]">Скидка на ретрит 19-20 сентября будет активирована</span>
            </div>
            <button
              onClick={handleFinishTest}
              className="w-full sm:w-auto px-6 py-3 neu-btn rounded-xl font-bold text-xs text-[#BA9470] border border-[#BA9470]/40 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <span>Завершить и сохранить в профиль</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: РЕГИСТРАЦИЯ АККАУНТА В ETHOSIUM */}
      {activeTab === 'register' && (
        <div className="flex flex-col gap-4">
          {/* Diagnostic Archetype Preview */}
          <div className="neu-card-highlight rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 border-2 border-[#BA9470]/50 bg-gradient-to-br from-[#3d4231] to-[#483d2e]/40 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-[#BA9470] neu-inset px-2.5 py-1 rounded-md border border-[#BA9470]/30">
                Результат экспресс-диагностики
              </span>
              <span className="text-xs text-[#E2ECD2] font-semibold">Синтез 7 вопросов</span>
            </div>

            <h3 className="font-headline font-bold text-lg text-[#FFFDF8]">
              {getArchetypeResult().focus}
            </h3>
            <p className="text-sm text-[#FFFDF8]/90 leading-relaxed font-body">
              {getArchetypeResult().description}
            </p>
          </div>

          {/* Registration Container */}
          <div className="neu-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5 border border-[#E2ECD2]/20">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-xl text-[#FFFDF8]">
                  Регистрация аккаунта в EthOSium
                </h2>
                {userProfile && (
                  <span className="text-xs bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                    ✓ Авторизован
                  </span>
                )}
              </div>
              <p className="text-sm text-[#E2ECD2] mt-1 font-medium leading-normal">
                Единая авторизация для работы с модулями LabForge, практиками Центра Семерджиди и клубом.
              </p>
            </div>

            {/* Notification message */}
            {authNotice && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  authNotice.type === 'success'
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100'
                    : authNotice.type === 'error'
                    ? 'bg-red-950/70 border-red-500/50 text-red-100'
                    : 'bg-[#333726] border-[#BA9470]/40 text-[#FFFDF8]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {authNotice.type === 'success' ? 'check_circle' : authNotice.type === 'error' ? 'error' : 'info'}
                </span>
                <span>{authNotice.text}</span>
              </div>
            )}

            {/* Active User Card if already signed in */}
            {userProfile ? (
              <div className="neu-inset p-4 rounded-2xl border border-[#BA9470]/40 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-[#BA9470] tracking-wider block">
                      Текущий активный профиль в БД
                    </span>
                    <h3 className="font-headline font-bold text-lg text-[#FFFDF8] mt-0.5">
                      {userProfile.name}
                    </h3>
                    <p className="text-xs text-[#E2ECD2] font-mono">{userProfile.emailOrTg}</p>
                  </div>
                  <span className="text-xs neu-pill-active px-3 py-1 rounded-full text-[#BA9470] font-bold border border-[#BA9470]/40">
                    ID: {userProfile.id}
                  </span>
                </div>

                <div className="text-xs text-[#E2ECD2] bg-[#2d3122] p-2.5 rounded-xl flex items-center justify-between border border-[#E2ECD2]/15">
                  <span>Роль: <strong className="text-[#FFFDF8]">{userProfile.role}</strong></span>
                  <span>Скидка -50%: <strong className="text-emerald-400">Активирована</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('retreatOffer')}
                    className="py-3 px-3 neu-btn rounded-xl font-bold text-xs text-[#FFCF96] border border-[#BA9470]/60 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    <span>Оффер на ретрит со скидкой</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('social')}
                    className="py-3 px-3 neu-btn rounded-xl font-bold text-xs text-[#FFFDF8] border-2 border-[#BA9470]/70 flex items-center justify-center gap-2 active:scale-95 shadow-md hover:text-[#FFCF96]"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#FFCF96]">account_circle</span>
                    <span>Личный кабинет & Соцсеть</span>
                  </button>
                </div>
                
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      authService.logout();
                      setUserProfile(null);
                      setAuthNotice({ text: 'Вы вышли из профиля', type: 'info' });
                    }}
                    className="px-3.5 py-1.5 neu-btn rounded-xl text-xs text-[#E2ECD2] hover:text-red-300 border border-[#E2ECD2]/20 active:scale-95 flex items-center gap-1"
                    title="Сменить аккаунт"
                  >
                    <span className="material-symbols-outlined text-[14px]">logout</span>
                    <span>Сменить аккаунт</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Fast 1-Click OAuth Social Registration */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#FFCF96]">
                    Быстрая автоматическая регистрация в 1 клик
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => handleOAuthLogin('google')}
                      className="py-3 px-3 neu-btn rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#FFFDF8] border border-[#E2ECD2]/30 hover:border-red-400/60 active:scale-95 transition-all shadow-sm group"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.2 0 15s.7 5.4 1.9 7.8l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.3 7.5 23 12 23z"
                        />
                      </svg>
                      <span className="truncate">Google</span>
                    </button>

                    {/* Apple ID OAuth Button */}
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => handleOAuthLogin('apple')}
                      className="py-3 px-3 neu-btn rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#FFFDF8] border border-[#E2ECD2]/30 hover:border-neutral-300 active:scale-95 transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.06.63-2.73 1.4-.59.68-1.1 1.76-.96 2.8 1.03.08 2.14-.54 2.77-1.35z" />
                      </svg>
                      <span className="truncate">Apple ID</span>
                    </button>

                    {/* Facebook OAuth Button */}
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => handleOAuthLogin('facebook')}
                      className="py-3 px-3 neu-btn rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#FFFDF8] border border-[#E2ECD2]/30 hover:border-blue-400 active:scale-95 transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="truncate">Facebook</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-[#E2ECD2]/80">
                    Автоматически регистрирует профиль в БД и привязывает право на скидку -50% на ретрит.
                  </span>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-[#E2ECD2]/20 w-full"></div>
                  <span className="bg-[#393d2b] px-3 text-[11px] uppercase tracking-wider text-[#E2ECD2] font-bold shrink-0">
                    Или классическая форма
                  </span>
                  <div className="border-t border-[#E2ECD2]/20 w-full"></div>
                </div>

                {/* 2. Manual Form - Completely Empty Defaults */}
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Ваше Имя и Фамилия <span className="text-[10px] text-[#A9B489] font-normal lowercase">(необязательно)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Имя Фамилия (или оставьте пустым)"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Email или Telegram (@никнейм)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="name@example.com или @username"
                      value={regForm.emailOrTg}
                      onChange={(e) => setRegForm({ ...regForm, emailOrTg: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Пароль для доступа (необязательно)
                    </label>
                    <input
                      type="password"
                      placeholder="Придумайте пароль или оставьте пустым"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Ваша роль в среде
                    </label>
                    <select
                      value={regForm.role}
                      onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] bg-[#343827] border border-[#E2ECD2]/25 focus:outline-none"
                    >
                      <option value="Предприниматель / Лидер проектов">Предприниматель / Основатель бизнеса</option>
                      <option value="Архитектор систем / Инженер LabForge">Архитектор систем / Инженер LabForge</option>
                      <option value="Психолог / Специалист центра">Психолог / Специалист Центра Семерджиди</option>
                      <option value="Участник сообщества & Ретритов">Участник сообщества &amp; Ретритов FRACTAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Основной контур интеграции
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'labforge', label: 'LabForge (R&D)' },
                        { id: 'semerdzhidi', label: 'Семерджиди' },
                        { id: 'both', label: 'Оба контура' },
                      ].map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => setRegForm({ ...regForm, contour: c.id as any })}
                          className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                            regForm.contour === c.id
                              ? 'neu-pill-active border-2 border-[#FFCF96] text-[#FFCF96]'
                              : 'neu-inset text-[#E2ECD2]'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-4 neu-btn rounded-xl font-bold text-sm text-[#FFFDF8] border-2 border-[#BA9470]/60 flex items-center justify-center gap-2 hover:text-[#FFCF96] active:scale-95 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#FFCF96]">how_to_reg</span>
                      <span>{authLoading ? 'Сохранение в БД...' : 'Создать аккаунт & Зафиксировать скидку -50%'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ПРЕДВАРИТЕЛЬНАЯ РЕГИСТРАЦИЯ С 50% СКИДКОЙ (ВЫЕЗД 19-20 СЕНТЯБРЯ) */}
      {activeTab === 'retreatOffer' && (
        <div className="flex flex-col gap-4">
          {/* Big Golden Retreat Banner with 50% Discount Lock */}
          <div className="neu-card-highlight rounded-2xl p-5 flex flex-col gap-3.5 border-2 border-[#BA9470]/70 bg-gradient-to-b from-[#473a27] via-[#3d4130] to-[#343829] shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#BA9470] neu-inset px-3 py-1 rounded-full border border-[#BA9470]/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Предварительная регистрация: -50% Скидка
              </span>
              <span className="text-xs font-bold text-[#F0E2C8] bg-[#BA9470]/40 px-3 py-0.5 rounded-full border border-[#BA9470]/60">
                19 – 20 Сентября 2026
              </span>
            </div>

            <div>
              <h1 className="font-headline font-bold text-2xl text-[#F0E2C8] tracking-tight">
                Точка Сборки: Горы, Водопады &amp; Ночной Чарвак
              </h1>
              <p className="text-xs text-[#BA9470] font-medium mt-1">
                Глубинная перезагрузка в Чимганском ущелье с Екатериной Семерджиди и 2 ведущими специалистами
              </p>
            </div>

            {/* 50% Discount Spotlight Card */}
            <div className="neu-inset p-4 rounded-2xl border-2 border-[#BA9470]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#333726]/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-800/90 text-[#F0E2C8] text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/40">
                    -50% До 10 сентября
                  </span>
                  <span className="text-[11px] text-[#A9B489]">Скидка 50% по предоплате 50%</span>
                </div>
                <div className="flex items-baseline gap-2.5 mt-1.5 flex-wrap">
                  <span className="line-through text-sm text-[#A9B489] font-medium">$375</span>
                  <span className="font-headline font-extrabold text-3xl text-[#BA9470]">$187.50</span>
                  <span className="text-xs text-[#F0E2C8]/90 font-semibold">за 24 часа «Всё включено»</span>
                </div>
                <span className="text-[10px] text-[#A9B489] block mt-0.5">
                  Предоплата для брони 50%: <strong className="text-[#FFCF96]">$93.75</strong> • Осталось всего <strong>13 мест</strong>
                </span>
              </div>

              <div className="neu-card px-3 py-2 rounded-xl text-center border border-[#BA9470]/40 shrink-0">
                <span className="text-[9px] uppercase font-bold text-[#A9B489] block">Промокод</span>
                <span className="font-mono font-bold text-sm text-[#BA9470]">CHIMGAN-24H-50</span>
              </div>
            </div>

            {/* Special Highlight Elements from User Prompt */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="neu-inset p-2.5 rounded-xl flex items-center gap-2 border border-[#A9B489]/20">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">landscape</span>
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Горы &amp; Водопады</span>
                  <span className="text-[10px] text-[#A9B489]">Пеший трекинг заземления</span>
                </div>
              </div>

              <div className="neu-inset p-2.5 rounded-xl flex items-center gap-2 border border-[#A9B489]/20">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">pets</span>
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Прогулки на лошадках</span>
                  <span className="text-[10px] text-[#A9B489]">Синхронизация с телом</span>
                </div>
              </div>

              <div className="neu-inset p-2.5 rounded-xl flex items-center gap-2 border border-[#A9B489]/20">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">two_wheeler</span>
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Горные квадроциклы</span>
                  <span className="text-[10px] text-[#A9B489]">Сброс адреналина в каньоне</span>
                </div>
              </div>

              <div className="neu-inset p-2.5 rounded-xl flex items-center gap-2 border border-[#A9B489]/20">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">kayaking</span>
                <div>
                  <span className="font-bold text-[#F0E2C8] block">SUP под звёздами</span>
                  <span className="text-[10px] text-[#A9B489]">Ночная гладь Чарвака</span>
                </div>
              </div>
            </div>

            {/* Key Academic & Clinical Value */}
            <div className="neu-inset p-3.5 rounded-xl border border-[#BA9470]/30 space-y-2 text-xs text-[#F0E2C8]">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[18px]">psychology</span>
                <div>
                  <strong className="text-[#BA9470]">Глубинная лекция и трансформационный семинар:</strong>
                  <p className="text-[11px] text-[#A9B489] mt-0.5">
                    Лично от основателя центра <strong>Екатерины Семерджиди</strong>: работа с ключевыми жизненными сценариями и регуляция вегетативной системы.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[18px]">groups</span>
                <div>
                  <strong className="text-[#BA9470]">+ 2 ведущих специалиста центра:</strong>
                  <p className="text-[11px] text-[#A9B489] mt-0.5">
                    Телесно-ориентированный терапевт (разблокировка зажимов) и супервизор когнитивных паттернов малой группы.
                  </p>
                </div>
              </div>
            </div>

            {/* DIRECT PRE-REGISTRATION WITH 50% DISCOUNT */}
            <div className="neu-card p-4 sm:p-5 rounded-2xl flex flex-col gap-3.5 border-2 border-[#BA9470]/60">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-base text-[#FFFDF8] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#FFCF96] text-[20px]">how_to_reg</span>
                  <span>Форма предварительной регистрации (-50% скидка)</span>
                </h3>
                <span className="text-xs text-emerald-300 font-bold bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-500/40">
                  Скидка активна
                </span>
              </div>

              {preRegLocked ? (
                <div className="neu-card-highlight p-5 rounded-2xl border-2 border-[#BA9470] text-center space-y-3 bg-gradient-to-b from-[#3d4231] to-[#2e3223]">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-400/50 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-emerald-300 text-[28px]">verified</span>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-[#FFFDF8]">
                    50% скидка успешно зафиксирована в базе данных!
                  </h4>
                  <p className="text-sm text-[#E2ECD2] max-w-md mx-auto leading-relaxed">
                    Участник: <strong className="text-[#FFFDF8]">{preRegData.name || 'Гость'}</strong> ({preRegData.contact}). Ваша льготная стоимость: <span className="text-[#FFCF96] font-bold">{preRegData.format === 'vip' ? '$195 вместо $390' : '$120 вместо $240'}</span>.
                  </p>
                  <div className="neu-inset p-3 rounded-xl inline-block border border-[#BA9470]/50 font-mono text-sm text-[#FFCF96] font-bold tracking-wider">
                    Сертификат брони: {preRegCertificateId || 'PRE-ETHOS-50-SAVED'}
                  </div>
                  <p className="text-xs text-emerald-300 font-medium">
                    ✓ Запись сохранена в БД EthOSium. Слот забронирован на 19-20 сентября.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button
                      onClick={() => onNavigate('booking')}
                      className="px-6 py-3 neu-btn rounded-xl font-bold text-xs text-[#FFFDF8] border border-[#BA9470]/70 hover:text-[#FFCF96] active:scale-95 transition-all shadow-lg"
                    >
                      Перейти к выбору лоджа и деталям выезда
                    </button>
                    <button
                      onClick={() => onNavigate('feed')}
                      className="px-5 py-3 neu-btn rounded-xl text-xs font-semibold text-[#E2ECD2] hover:text-[#FFFDF8]"
                    >
                      Войти в ленту пространства
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePreRegSubmit} className="space-y-3.5 text-xs">
                  {userProfile && (!preRegData.name || !preRegData.contact) && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setPreRegData(prev => ({
                            ...prev,
                            name: userProfile.name,
                            contact: userProfile.emailOrTg,
                          }));
                        }}
                        className="text-xs text-[#FFCF96] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[15px]">person</span>
                        <span>Заполнить данными из профиля ({userProfile.name})</span>
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                        Имя участника
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Введите ваше имя"
                        value={preRegData.name}
                        onChange={(e) => setPreRegData({ ...preRegData, name: e.target.value })}
                        className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                        Telegram / Телефон
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="@username или телефон для связи"
                        value={preRegData.contact}
                        onChange={(e) => setPreRegData({ ...preRegData, contact: e.target.value })}
                        className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Выберите формат участия со скидкой 50%
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPreRegData({ ...preRegData, format: 'standard' })}
                        className={`p-3.5 rounded-xl text-left flex flex-col justify-between transition-all ${
                          preRegData.format === 'standard'
                            ? 'neu-pill-active border-2 border-[#FFCF96] text-[#FFFDF8]'
                            : 'neu-inset text-[#E2ECD2]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">24h Standard (Всё включено)</span>
                          <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">-50%</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                          <span className="line-through text-xs text-[#E2ECD2]/70">$375</span>
                          <span className="font-headline font-bold text-xl text-[#FFCF96]">$187.50</span>
                          <span className="text-[10px] text-[#A9B489]">(предоплата $93.75)</span>
                        </div>
                        <span className="text-xs text-[#E2ECD2] mt-1">24 часа: трансфер, проживание, 3-разовое питание, трекинг, баня</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreRegData({ ...preRegData, format: 'vip' })}
                        className={`p-3.5 rounded-xl text-left flex flex-col justify-between transition-all ${
                          preRegData.format === 'vip'
                            ? 'neu-pill-active border-2 border-[#FFCF96] text-[#FFFDF8]'
                            : 'neu-inset text-[#E2ECD2]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">VIP + Личная супервизия</span>
                          <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">-50%</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                          <span className="line-through text-xs text-[#E2ECD2]/70">$495</span>
                          <span className="font-headline font-bold text-xl text-[#FFCF96]">$247.50</span>
                          <span className="text-[10px] text-[#A9B489]">(предоплата $123.75)</span>
                        </div>
                        <span className="text-xs text-[#E2ECD2] mt-1">Включает 90 мин тет-а-тет супервизии + приоритетный эко-лодж</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 neu-btn rounded-xl font-bold text-sm text-[#FFFDF8] border-2 border-[#BA9470]/70 flex items-center justify-center gap-2 hover:text-[#FFCF96] active:scale-95 transition-all shadow-xl mt-2"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#FFCF96]">lock</span>
                    <span>Зафиксировать 50% скидку (предоплата {preRegData.format === 'vip' ? '$123.75' : '$93.75'}) на 19-20 сентября</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Additional Features Included */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Что включено в стоимость:</h3>
            <ul className="text-xs text-[#F0E2C8]/85 space-y-1.5 neu-inset p-3 rounded-xl border border-[#A9B489]/15">
              <li className="flex items-center gap-2"><span className="text-[#BA9470]">✓</span> Трансфер из Ташкента до Чимгана и обратно на комфортных шаттлах</li>
              <li className="flex items-center gap-2"><span className="text-[#BA9470]">✓</span> Проживание в эко-лоджах у подножия Большого Чимгана</li>
              <li className="flex items-center gap-2"><span className="text-[#BA9470]">✓</span> 3-разовое сбалансированное горное питание от шеф-повара</li>
              <li className="flex items-center gap-2"><span className="text-[#BA9470]">✓</span> Аренда SUP-бордов, лошадей, квадроциклов и экипировки</li>
              <li className="flex items-center gap-2"><span className="text-[#BA9470]">✓</span> Авторский печатный воркбук ретрита и 7 дней цифровой интеграции</li>
            </ul>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onNavigate('retreats')}
                className="flex-1 py-2.5 neu-btn rounded-xl text-xs font-semibold text-[#A9B489] hover:text-[#F0E2C8] active:scale-95"
              >
                Подробнее о концепции FRACTAL
              </button>
              <button
                onClick={() => onNavigate('social')}
                className="flex-1 py-2.5 neu-btn rounded-xl text-xs font-bold text-[#FFCF96] border-2 border-[#BA9470]/60 active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[17px]">account_circle</span>
                <span>Мой аккаунт, сообщения &amp; друзья</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
