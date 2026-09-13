import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  BrainCircuit, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Plus, 
  Check, 
  Activity,
  Award,
  Sparkles
} from 'lucide-react';
import { CompanyNode, SemerdzhidiProfile, EcosystemContour } from '../types';

interface CompaniesDirectoryProps {
  companies: CompanyNode[];
  profiles: SemerdzhidiProfile[];
  selectedCompany: CompanyNode;
  onSelectCompany: (company: CompanyNode) => void;
  onAddMember: (profile: SemerdzhidiProfile) => void;
}

export const CompaniesDirectory: React.FC<CompaniesDirectoryProps> = ({
  companies,
  profiles,
  selectedCompany,
  onSelectCompany,
  onAddMember
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberType, setNewMemberType] = useState('Стратег-Визионер (Тип I)');

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newProfile: SemerdzhidiProfile = {
      id: `prof-${Date.now()}`,
      name: newMemberName,
      role: newMemberRole || 'Специалист экосистемы',
      company: selectedCompany.name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      dominantType: newMemberType,
      vectors: {
        visionary: 80,
        stabilizer: 75,
        harmonizer: 82,
        auditor: 70
      },
      burnoutRisk: 'Низкий',
      synergyScore: 92,
      emotionalEnergy: 85,
      contourClearance: ['corporate', 'public'],
      cognitiveStyle: 'Адаптивный стиль сотрудничества с опорой на принципы открытости контура.',
      coachingRecommendations: ['Интегрировать в кросс-контурные спринты']
    };

    onAddMember(newProfile);
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Организационная структура & Участники</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
              Компании и Команды Экосистемы EthOSium
            </h1>
            <p className="text-sm text-slate-300">
              Бесшовная кросс-организационная интеграция предприятий, проектных групп и специалистов с единым сквозным профилем Семерджиди.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить участника в контур</span>
          </button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map((comp) => {
          const isSelected = selectedCompany.id === comp.id;
          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompany(comp)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
                  {comp.logo}
                </div>
                {isSelected && (
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-medium">
                    Выбрано
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-base">{comp.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{comp.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Людей</div>
                  <div className="font-bold text-white font-mono mt-0.5">{comp.membersCount}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Здоровье</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">{comp.processHealth}%</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Синергия</div>
                  <div className="font-bold text-indigo-400 font-mono mt-0.5">{comp.synergyLevel}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Members of Current Node */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">
              Участники и ключевые специалисты: <span className="text-indigo-300">{selectedCompany.name}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400">{profiles.length} профилей Семерджиди</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((prof) => (
            <div key={prof.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img src={prof.avatar} alt={prof.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{prof.name}</h4>
                    <p className="text-xs text-slate-400">{prof.role}</p>
                    <div className="text-[11px] text-indigo-400 mt-0.5 font-medium">{prof.dominantType}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {prof.synergyScore}% синергия
                  </span>
                </div>
              </div>

              {/* 4 Vector Chips */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] text-center">
                <div className="bg-slate-900 p-1.5 rounded border border-purple-500/20">
                  <div className="text-purple-400">Виз.</div>
                  <div className="font-bold text-white">{prof.vectors.visionary}%</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-emerald-500/20">
                  <div className="text-emerald-400">Стаб.</div>
                  <div className="font-bold text-white">{prof.vectors.stabilizer}%</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-pink-500/20">
                  <div className="text-pink-400">Гарм.</div>
                  <div className="font-bold text-white">{prof.vectors.harmonizer}%</div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded border border-sky-500/20">
                  <div className="text-sky-400">Ауд.</div>
                  <div className="font-bold text-white">{prof.vectors.auditor}%</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                {prof.cognitiveStyle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <span>Добавление участника в EthOSium</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Имя и Фамилия</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Например: Иван Васильев"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Роль / Должность</label>
                <input
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Например: Системный архитектор контура"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Психотип Семерджиди</label>
                <select
                  value={newMemberType}
                  onChange={(e) => setNewMemberType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Архитектор Смыслов (Тип I: Стратег-Визионер)">Архитектор Смыслов (Тип I: Стратег-Визионер)</option>
                  <option value="Стабилизатор Контура (Тип II: Системный Оператор)">Стабилизатор Контура (Тип II: Системный Оператор)</option>
                  <option value="Гармонизатор Среды (Тип III: Эмпатийный Катализатор)">Гармонизатор Среды (Тип III: Эмпатийный Катализатор)</option>
                  <option value="Критический Аудитор (Тип IV: Контролер Целостности)">Критический Аудитор (Тип IV: Контролер Целостности)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500"
                >
                  Создать профиль
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
