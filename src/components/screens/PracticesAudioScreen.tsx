import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { shareModule } from '../../utils/shareHelper';

interface PracticesAudioScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const PracticesAudioScreen: React.FC<PracticesAudioScreenProps> = ({ onNavigate }) => {
  const [isPlayingMain, setIsPlayingMain] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: true,
    3: false,
  });

  const playlist = [
    { title: 'Тихая гавань: деактивация симпатики', dur: '14:20', freq: '432 Hz', desc: 'Снятие спазма диафрагмы и тревоги' },
    { title: 'Дыхание «Вентральный вагус» (4-7-8)', dur: '12:00', freq: '528 Hz', desc: 'Активация парасимпатической нервной системы' },
    { title: 'Шум Чимганского водопада & Тишина', dur: '45:00', freq: 'Nature', desc: 'Бинауральный звук с места ретрита' },
    { title: 'Вечернее отпускание мышечных зажимов', dur: '18:30', freq: '432 Hz', desc: 'Глубокий скан тела перед сном' },
  ];

  const toggleOffline = (idx: number) => {
    setOfflineStatus(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Audio Room Header */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30">
            Нейро-аудиотека покоя
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#A9B489] hidden xs:inline">432 Hz • Sound Healing</span>
            <button
              onClick={() => shareModule('practices')}
              className="neu-btn px-2.5 py-1 rounded-xl text-xs font-semibold text-[#BA9470] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              title="Поделиться практиками"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Поделиться</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl text-[#F0E2C8]">
            Пространство Звукового Покоя
          </h1>
          <p className="text-xs text-[#A9B489] mt-0.5">
            Протоколы регуляции вегетативной нервной системы и снижения кортизола
          </p>
        </div>
      </div>

      {/* Main Big Neumorphic Player Card */}
      <div className="neu-card-highlight rounded-2xl p-5 flex flex-col gap-4 border border-[#BA9470]/40 bg-gradient-to-b from-[#3e4231] to-[#343829]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#BA9470]">{playlist[activeTrackIndex].freq}</span>
          <span className="material-symbols-outlined text-[#BA9470] text-[20px]">graphic_eq</span>
        </div>

        <div className="text-center py-2">
          <h2 className="font-headline font-bold text-lg text-[#F0E2C8] leading-tight">
            {playlist[activeTrackIndex].title}
          </h2>
          <p className="text-xs text-[#A9B489] mt-1">{playlist[activeTrackIndex].desc}</p>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center justify-center gap-1.5 h-10 px-4 neu-inset rounded-xl border border-[#A9B489]/15">
          {[12, 24, 32, 16, 28, 40, 20, 36, 18, 30, 22, 38, 14, 26, 34].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlayingMain ? 'bg-[#BA9470] animate-pulse' : 'bg-[#A9B489]/40'
              }`}
              style={{ height: isPlayingMain ? `${h}px` : '8px' }}
            />
          ))}
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => setActiveTrackIndex(i => (i > 0 ? i - 1 : playlist.length - 1))}
            className="w-10 h-10 rounded-full neu-btn text-[#A9B489] flex items-center justify-center hover:text-[#F0E2C8]"
          >
            <span className="material-symbols-outlined text-[20px]">skip_previous</span>
          </button>

          <button
            onClick={() => setIsPlayingMain(!isPlayingMain)}
            className="w-14 h-14 rounded-full neu-btn text-[#BA9470] border-2 border-[#BA9470]/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isPlayingMain ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => setActiveTrackIndex(i => (i < playlist.length - 1 ? i + 1 : 0))}
            className="w-10 h-10 rounded-full neu-btn text-[#A9B489] flex items-center justify-center hover:text-[#F0E2C8]"
          >
            <span className="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
        </div>
      </div>

      {/* Playlist Tracks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A9B489]">Аудиотреки для скачивания</span>
          <span className="text-[10px] text-[#BA9470]">Работают без интернета</span>
        </div>

        {playlist.map((item, idx) => {
          const isCur = activeTrackIndex === idx;
          const isOff = offlineStatus[idx];
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl flex items-center justify-between gap-3 border transition-all ${
                isCur ? 'neu-card-highlight border-[#BA9470]/40' : 'neu-card border-[#A9B489]/15'
              }`}
            >
              <button
                onClick={() => {
                  setActiveTrackIndex(idx);
                  setIsPlayingMain(true);
                }}
                className="w-8 h-8 rounded-full neu-btn text-[#BA9470] flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCur && isPlayingMain ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#F0E2C8] block truncate">{item.title}</span>
                <span className="text-[10px] text-[#A9B489]">{item.dur} • {item.freq}</span>
              </div>

              <button
                onClick={() => toggleOffline(idx)}
                className={`w-8 h-8 rounded-full neu-btn flex items-center justify-center ${
                  isOff ? 'text-[#BA9470]' : 'text-[#A9B489]/40'
                }`}
                title={isOff ? 'Сохранено в память устройства' : 'Сохранить офлайн'}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {isOff ? 'download_done' : 'download'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
