import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';

interface LabForgeScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const LabForgeScreen: React.FC<LabForgeScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'services' | 'rd' | 'consultation'>('architecture');
  const [consultForm, setConsultForm] = useState({
    name: '',
    contact: '',
    projectStage: 'Масштабирование экосистемы / Пересборка процессов',
    needs: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Hero Banner */}
      <div className="neu-card-highlight rounded-2xl p-5 flex flex-col gap-3.5 border border-[#BA9470]/40 bg-gradient-to-br from-[#3b402e] via-[#353928] to-[#453c2b]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BA9470] text-[22px]">precision_manufacturing</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-0.5 rounded border border-[#BA9470]/30">
              LabForge • R&amp;D &amp; Архитектура
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-wider font-bold text-[#A9B489] bg-[#A9B489]/10 px-2 py-0.5 rounded border border-[#A9B489]/20">
            Профессиональный участник
          </span>
        </div>

        <div>
          <h1 className="font-headline font-bold text-2xl text-[#F0E2C8] tracking-tight">
            LabForge: Лаборатория R&amp;D и Архитектура Экосистем
          </h1>
          <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
            Системная интеграция, технологический консалтинг, стратегирование и цифровая инженерия для устойчивого масштабирования лидеров и платформ.
          </p>
        </div>

        {/* 4 Pillars Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="neu-inset p-2.5 rounded-xl border border-[#A9B489]/15">
            <span className="text-[10px] text-[#A9B489] uppercase block font-semibold">Контур защиты</span>
            <span className="font-headline font-bold text-sm text-[#BA9470]">Zero-Trust EAP</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl border border-[#A9B489]/15">
            <span className="text-[10px] text-[#A9B489] uppercase block font-semibold">Платформа</span>
            <span className="font-headline font-bold text-sm text-[#F0E2C8]">Web + TMA + PWA</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl border border-[#A9B489]/15">
            <span className="text-[10px] text-[#A9B489] uppercase block font-semibold">Интеграции</span>
            <span className="font-headline font-bold text-sm text-[#BA9470]">EthOSium Core</span>
          </div>
          <div className="neu-inset p-2.5 rounded-xl border border-[#A9B489]/15">
            <span className="text-[10px] text-[#A9B489] uppercase block font-semibold">R&amp;D Стенды</span>
            <span className="font-headline font-bold text-sm text-[#F0E2C8]">6 Активных</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 neu-card p-1.5 rounded-2xl">
        {[
          { id: 'architecture', label: 'Архитектура' },
          { id: 'services', label: 'Консалтинг' },
          { id: 'rd', label: 'R&D Лаборатория' },
          { id: 'consultation', label: 'Заявка' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-1 rounded-xl text-[10px] font-bold truncate transition-all ${
              activeTab === tab.id
                ? 'neu-pill-active text-[#BA9470] border border-[#BA9470]/40 shadow'
                : 'neu-btn text-[#A9B489]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: АРХИТЕКТУРА */}
      {activeTab === 'architecture' && (
        <div className="flex flex-col gap-3">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2.5">
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Архитектурный фундамент EthOSium от LabForge
            </h2>
            <p className="text-xs text-[#A9B489] leading-relaxed">
              LabForge проектирует и поддерживает цифровую ткань, связывающую человека, психологический контур Семерджиди и операционные бизнес-системы.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border border-[#A9B489]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">account_tree</span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">Bio-Signal Fabric</h3>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Шлюз данных, позволяющий безопасно агрегировать телесные и психологические метрики (уровень стресса, ВНС-чекины, прогресс рефлексии) без риска деанонимизации.
              </p>
              <div className="neu-inset p-2.5 rounded-xl text-[11px] text-[#F0E2C8]/90 font-mono">
                Status: ACTIVE • Latency &lt; 42ms • E2E 256-bit
              </div>
            </div>

            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border border-[#A9B489]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">hub</span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">Zero-Trust Gateway</h3>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Разделение ролей между корпоративными заказчиками, терапевтами Семерджиди и участниками ретритов с криптографическим разграничением прав.
              </p>
              <div className="neu-inset p-2.5 rounded-xl text-[11px] text-[#F0E2C8]/90 font-mono">
                Compliance: HIPAA / EAP Protocol Level 4
              </div>
            </div>

            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border border-[#A9B489]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">devices</span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">Omni-Platform Triad</h3>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Мгновенное развёртывание: единый интерфейс работает как Web SPA, PWA в офлайн-режиме в горах и Telegram Mini App внутри мессенджера.
              </p>
              <div className="neu-inset p-2.5 rounded-xl text-[11px] text-[#F0E2C8]/90 font-mono">
                Unified React 18 + TS + ServiceWorker + TMA SDK
              </div>
            </div>

            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border border-[#A9B489]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#BA9470] text-[20px]">view_in_ar</span>
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">4D Continuum Engine</h3>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Многомерная математическая матрица состояний (ось Z уровни L1..L6) для сценарного моделирования решений руководителя.
              </p>
              <div className="neu-inset p-2.5 rounded-xl text-[11px] text-[#F0E2C8]/90 font-mono">
                Engine: EthOSium Matrix v2.4 (Active)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: КОНСАЛТИНГ И СТРАТЕГИРОВАНИЕ */}
      {activeTab === 'services' && (
        <div className="flex flex-col gap-3">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2">
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Услуги консалтинга и стратегирования LabForge
            </h2>
            <p className="text-xs text-[#A9B489] leading-relaxed">
              Мы работаем с основателями компаний, техническими директорами и лидерами трансформаций.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border-l-4 border-l-[#BA9470]">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                  Архитектурный аудит &amp; Проектирование экосистем
                </h3>
                <span className="text-[10px] text-[#BA9470] font-bold">от $2,500</span>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Глубокий анализ существующего IT-ландшафта и бизнес-архитектуры. Создание дорожной карты перевода в единую платформенную модель без остановки операций.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">Срок: 2-3 недели</span>
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">Артефакт: Архитектурный Blueprint</span>
              </div>
            </div>

            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border-l-4 border-l-[#BA9470]">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                  Стратегическая сессия пересборки бизнес-модели
                </h3>
                <span className="text-[10px] text-[#BA9470] font-bold">от $1,800</span>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Двухдневный интенсив с ключевой командой: устранение узких мест масштабирования, синхронизация целей лидеров и внедрение контуров саморегуляции.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">Формат: Очно в Ташкенте / Горы</span>
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">Синтез с методами Семерджиди</span>
              </div>
            </div>

            <div className="neu-card rounded-2xl p-4 flex flex-col gap-2 border-l-4 border-l-[#BA9470]">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                  Интеграция ИИ-агентов и автоматизация Ops
                </h3>
                <span className="text-[10px] text-[#BA9470] font-bold">от $3,200</span>
              </div>
              <p className="text-[#A9B489] leading-relaxed">
                Разработка кастомных агентов поддержки решений, обработки обратной связи клиентов и автоматического распределения задач между модулями.
              </p>
              <div className="flex gap-2 pt-1">
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">Stack: Node.js, Python, Vector DB</span>
                <span className="neu-inset px-2 py-0.5 rounded text-[10px] text-[#A9B489]">SLA: 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: R&D ЛАБОРАТОРИЯ */}
      {activeTab === 'rd' && (
        <div className="flex flex-col gap-3">
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-2">
            <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
              Текущие исследования &amp; Прототипы LabForge
            </h2>
            <p className="text-xs text-[#A9B489] leading-relaxed">
              Экспериментальные стенды, объединяющие нейробиологию, психологию здоровья и передовые веб-технологии.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="neu-card rounded-2xl p-3.5 flex items-start justify-between gap-3 border border-[#A9B489]/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-[#F0E2C8]">Проект NeuroPulse 432 Hz</span>
                </div>
                <p className="text-[#A9B489]">
                  Генерация адаптивных звуковых волн в реальном времени под текущий пульс и дыхание пользователя в приложении.
                </p>
              </div>
              <span className="neu-inset text-[9px] uppercase font-bold text-[#BA9470] px-2 py-1 rounded">Beta 0.8</span>
            </div>

            <div className="neu-card rounded-2xl p-3.5 flex items-start justify-between gap-3 border border-[#A9B489]/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-bold text-[#F0E2C8]">Горный автономный PWA-узел</span>
                </div>
                <p className="text-[#A9B489]">
                  Технология распределённой синхронизации воркбуков и чекинов участников ретрита в ущелье Чимгана без наличия сотовой сети.
                </p>
              </div>
              <span className="neu-inset text-[9px] uppercase font-bold text-[#BA9470] px-2 py-1 rounded">Testing</span>
            </div>

            <div className="neu-card rounded-2xl p-3.5 flex items-start justify-between gap-3 border border-[#A9B489]/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#BA9470]"></span>
                  <span className="font-bold text-[#F0E2C8]">EthOSium AI Navigator</span>
                </div>
                <p className="text-[#A9B489]">
                  Нейросетевой маршрутизатор подбора из 50 экспертов на базе многофакторной оценки 7 шкал самочувствия.
                </p>
              </div>
              <span className="neu-inset text-[9px] uppercase font-bold text-[#BA9470] px-2 py-1 rounded">Live</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ЗАЯВКА НА КОНСАЛТИНГ */}
      {activeTab === 'consultation' && (
        <div className="neu-card rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-headline font-bold text-lg text-[#F0E2C8]">
              Запрос на стратегирование &amp; R&amp;D партнерство
            </h2>
            <p className="text-xs text-[#A9B489] mt-0.5">
              Оставьте задачу — архитектор LabForge свяжется с вами в течение 2 часов для организации установочной встречи.
            </p>
          </div>

          {submitted ? (
            <div className="neu-inset p-5 rounded-2xl text-center space-y-2 border border-[#BA9470]/40">
              <span className="material-symbols-outlined text-[#BA9470] text-[36px]">check_circle</span>
              <h3 className="font-headline font-bold text-base text-[#F0E2C8]">Запрос принят LabForge</h3>
              <p className="text-xs text-[#A9B489]">
                Архитектор систем свяжется в Telegram по адресу <strong>{consultForm.contact}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-2 neu-btn rounded-xl text-xs font-bold text-[#BA9470]"
              >
                Отправить ещё один запрос
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Имя и компания</label>
                <input
                  type="text"
                  required
                  placeholder="Ваше имя и название проекта/компании"
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none placeholder:text-[#A9B489]/40"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Telegram / Телефон</label>
                <input
                  type="text"
                  required
                  placeholder="@username или +998 (__) ___ __ __"
                  value={consultForm.contact}
                  onChange={(e) => setConsultForm({ ...consultForm, contact: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none placeholder:text-[#A9B489]/40"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Стадия проекта</label>
                <select
                  value={consultForm.projectStage}
                  onChange={(e) => setConsultForm({ ...consultForm, projectStage: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] bg-[#3a3e2d] border border-[#A9B489]/15 focus:outline-none"
                >
                  <option value="Масштабирование экосистемы">Масштабирование экосистемы / Пересборка процессов</option>
                  <option value="Проектирование нового контура">Проектирование нового контура / Платформы с нуля</option>
                  <option value="Интеграция ИИ и автоматизация">Интеграция ИИ и автоматизация Ops</option>
                  <option value="Корпоративная программа здоровья">Корпоративная программа психологической устойчивости</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#A9B489] block mb-1">Суть задачи</label>
                <textarea
                  rows={3}
                  value={consultForm.needs}
                  onChange={(e) => setConsultForm({ ...consultForm, needs: e.target.value })}
                  className="w-full neu-inset rounded-xl p-2.5 text-[#F0E2C8] border border-[#A9B489]/15 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 neu-btn rounded-xl font-bold text-xs text-[#F0E2C8] border border-[#BA9470]/40 flex items-center justify-center gap-2 hover:text-[#BA9470] active:scale-95 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#BA9470]">send</span>
                  <span>Отправить бриф архитектору LabForge</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
