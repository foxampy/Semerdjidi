import React, { useState } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { shareModule } from '../../utils/shareHelper';

interface FounderProfileScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const FounderProfileScreen: React.FC<FounderProfileScreenProps> = ({ onNavigate }) => {
  const [activeWallTab, setActiveWallTab] = useState<'posts' | 'notes' | 'showcase' | 'reviews'>('posts');
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [quickNoticeText, setQuickNoticeText] = useState<string | null>(null);
  const [isFriendAdded, setIsFriendAdded] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleQuickBook = (serviceName: string) => {
    setQuickNoticeText(`Запрос на «${serviceName}» подготовлен для отправки Екатерине.`);
    setTimeout(() => {
      const el = document.getElementById('quickNoticeSection');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-1">
      {/* Profile Social Header Container */}
      <div className="neu-card rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          {/* Avatar Slot with Camera/Plus icon "+ Добавить фото" */}
          <div className="flex flex-col items-center shrink-0">
            <label className="w-20 h-20 rounded-full neu-inset border-2 border-dashed border-[#A9B489]/40 flex flex-col items-center justify-center text-[#A9B489] cursor-pointer hover:border-[#BA9470] transition-colors group p-1 overflow-hidden relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Екатерина Семерджиди" className="w-full h-full rounded-full object-cover" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[24px] text-[#BA9470] group-hover:scale-110 transition-transform">add_a_photo</span>
                  <span className="text-[9px] font-medium text-[#F0E2C8]/90 text-center leading-tight mt-1">+ Добавить<br/>фото</span>
                </>
              )}
              <input accept="image/*" className="hidden" type="file" onChange={handleAvatarChange} />
            </label>
            <span className="mt-1 px-1.5 py-0.5 rounded-full bg-[#503428]/70 text-[9.5px] font-medium text-[#BA9470] border border-[#BA9470]/30">Онлайн</span>
          </div>

          {/* Name, Titles and Stats */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-headline font-bold text-lg text-[#F0E2C8] leading-tight">Екатерина Семерджиди</h1>
              <span className="material-symbols-outlined text-[#BA9470] text-[16px]">stars</span>
            </div>
            <p className="text-[11px] font-medium text-[#A9B489] leading-snug mt-1">
              Супервизор • Психотерапевт • Психоаналитик • Доктор психологических наук
            </p>

            {/* Social Stats Row */}
            <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-[#A9B489]/15 text-[11.5px]">
              <div className="flex flex-col">
                <span className="font-bold text-[#F0E2C8]">{isFriendAdded ? '343' : '342'}</span>
                <span className="text-[10px] text-[#A9B489]/80">Друзья</span>
              </div>
              <div className="h-6 w-px bg-[#A9B489]/20"></div>
              <div className="flex flex-col">
                <span className="font-bold text-[#F0E2C8]">12.8k</span>
                <span className="text-[10px] text-[#A9B489]/80">Подписчики</span>
              </div>
              <div className="h-6 w-px bg-[#A9B489]/20"></div>
              <div className="flex flex-col">
                <span className="font-bold text-[#F0E2C8]">184</span>
                <span className="text-[10px] text-[#A9B489]/80">Публикации</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Social Style) */}
        <div className="grid grid-cols-12 gap-2 pt-1">
          <button 
            onClick={() => setIsFriendAdded(!isFriendAdded)}
            className={`col-span-4 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
              isFriendAdded ? 'neu-pill-active text-[#BA9470]' : 'neu-btn text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#A9B489]">
              {isFriendAdded ? 'check' : 'person_add'}
            </span>
            <span>{isFriendAdded ? 'В друзьях' : 'В друзья'}</span>
          </button>

          <button 
            onClick={() => onNavigate('club')}
            className="col-span-4 h-10 rounded-xl bg-gradient-to-r from-[#503428] to-[#614132] text-[#F0E2C8] border border-[#BA9470]/50 shadow-md text-xs font-semibold flex items-center justify-center gap-1 px-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#BA9470]">workspace_premium</span>
            <span className="truncate">Клуб $150</span>
          </button>

          <button 
            onClick={() => onNavigate('chat')}
            className="col-span-2 h-10 rounded-xl neu-btn text-[#BA9470] flex items-center justify-center active:scale-95 transition-all" 
            title="Написать сообщение"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
          </button>

          <button 
            onClick={() => shareModule('founder')}
            className="col-span-2 h-10 rounded-xl neu-btn text-[#FFCF96] border border-[#BA9470]/40 flex items-center justify-center active:scale-95 transition-all" 
            title="Поделиться профилем"
            aria-label="Поделиться профилем"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
        </div>

        {/* PHILOSOPHY MANIFESTO / BIO (VERBATIM TEXT) */}
        <div className="neu-inset rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-[#BA9470]">
            <span className="material-symbols-outlined text-[17px]">all_inclusive</span>
            <span className="text-[10.5px] uppercase font-bold tracking-widest">Манифест метода • Символ Спирали</span>
          </div>
          <p className="font-body text-[12.5px] text-[#F0E2C8]/90 leading-relaxed text-justify">
            Спираль — один из древнейших символов человечества, встречающийся в культуре, искусстве и духовных практиках разных эпох. Это универсальный архетип: он олицетворяет бесконечность, рост, эволюцию и путь к центру самого себя. В психологическом контексте спираль отражает процесс личностного развития: движение не по замкнутому кругу, а по восходящей траектории, когда каждый новый виток означает более глубокое понимание себя и своих переживаний. Терапия — это всегда движение по спирали. Мы возвращаемся к важным темам и вопросам, но каждый раз на новом уровне, с большей глубиной и осознанностью. Она подчеркивает, что работа с собой — это не линейный путь, а процесс, в котором повторение становится развитием, а возвращение — возможностью взглянуть на себя под новым углом. Спираль формирует образ психологического центра как пространства, где каждый может безопасно и с уважением исследовать свои внутренние миры, возвращаться к себе и двигаться вперёд — по спирали, но всегда глубже.
          </p>
        </div>
      </div>

      {/* HORIZONTAL SCROLLABLE ICON STRIPS / HIGHLIGHTS */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A9B489]">Разделы и витрины резиденции</span>
          <span className="text-[10px] text-[#BA9470]">Листайте вправо →</span>
        </div>
        
        <div className="flex items-start gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4">
          {/* Strip 1: Услуги */}
          <div className="shrink-0 w-64 neu-card rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#BA9470]">
                <span className="material-symbols-outlined text-[17px]">psychology</span>
                <span className="text-xs font-bold text-[#F0E2C8]">Услуги</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#503428] text-[9.5px] text-[#BA9470] border border-[#BA9470]/30">Прайс</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#F0E2C8]/90">
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Индивидуальная терапия</span>
                <span className="font-bold text-[#BA9470]">$350</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Супервизия кейсов</span>
                <span className="font-bold text-[#BA9470]">$250</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Повышение квалификации</span>
                <span className="font-bold text-[#BA9470]">$1,200</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Горный ретрит (Тянь-Шань)</span>
                <span className="font-bold text-[#BA9470]">$1,450</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#A9B489]">Сап-ретрит под звездами</span>
                <span className="font-bold text-[#BA9470]">$420</span>
              </div>
            </div>
          </div>

          {/* Strip 2: Продукты */}
          <div className="shrink-0 w-64 neu-card rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#BA9470]">
                <span className="material-symbols-outlined text-[17px]">auto_stories</span>
                <span className="text-xs font-bold text-[#F0E2C8]">Продукты</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#503428] text-[9.5px] text-[#BA9470] border border-[#BA9470]/30">Коллекция</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#F0E2C8]/90">
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Книги бестселлеры</span>
                <span className="font-bold text-[#BA9470]">$35 – $45</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Подкаст «В тишине кабинета»</span>
                <span className="font-bold text-[#BA9470]">В эфире</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Ювелирные изделия (Спираль)</span>
                <span className="font-bold text-[#BA9470]">$280</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#A9B489]/15">
                <span className="text-[#A9B489]">Кожаные сумки &amp; аксессуары</span>
                <span className="font-bold text-[#BA9470]">Премиум</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#A9B489]">Шёлковые шарфы и платки</span>
                <span className="font-bold text-[#BA9470]">$180 – $320</span>
              </div>
            </div>
          </div>

          {/* Strip 3: Проекты & Центр */}
          <div className="shrink-0 w-64 neu-card rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#BA9470]">
                <span className="material-symbols-outlined text-[17px]">account_balance</span>
                <span className="text-xs font-bold text-[#F0E2C8]">Проекты &amp; Центр</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#503428] text-[9.5px] text-[#BA9470] border border-[#BA9470]/30">Флагман</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#F0E2C8]/90">
              <div className="py-0.5 border-b border-[#A9B489]/15 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#A9B489] text-[14px]">apartment</span>
                <span>Психологический центр «Семерджиди»</span>
              </div>
              <div className="py-0.5 border-b border-[#A9B489]/15 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#A9B489] text-[14px]">school</span>
                <span>Научная школа &amp; консилиумы</span>
              </div>
              <div className="py-0.5 border-b border-[#A9B489]/15 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#A9B489] text-[14px]">villa</span>
                <span>Резиденция душевного равновесия (Ташкент)</span>
              </div>
              <div className="py-0.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#A9B489] text-[14px]">groups</span>
                <span>50 сертифицированных специалистов</span>
              </div>
            </div>
          </div>

          {/* Strip 4: Исследования & Открытия */}
          <div className="shrink-0 w-64 neu-card rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#BA9470]">
                <span className="material-symbols-outlined text-[17px]">biotech</span>
                <span className="text-xs font-bold text-[#F0E2C8]">Исследования &amp; Открытия</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#503428] text-[9.5px] text-[#BA9470] border border-[#BA9470]/30">Наука</span>
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-[#F0E2C8]/90">
              <div className="py-0.5 border-b border-[#A9B489]/15 flex items-center justify-between">
                <span className="text-[#A9B489]">Клинические протоколы 2026</span>
                <span className="text-[#BA9470] font-bold">Нейро</span>
              </div>
              <div className="py-0.5 border-b border-[#A9B489]/15 flex items-center justify-between">
                <span className="text-[#A9B489]">Монографии по нейропсихологии</span>
                <span className="text-[#BA9470] font-bold">3 тома</span>
              </div>
              <div className="py-0.5 flex items-center justify-between">
                <span className="text-[#A9B489]">Публикации ВАК / Scopus</span>
                <span className="text-[#BA9470] font-bold">24 статьи</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOCIAL FEED & WALL TABS */}
      <div className="flex items-center justify-between neu-inset rounded-xl p-1 mt-1">
        <button 
          onClick={() => setActiveWallTab('posts')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeWallTab === 'posts' ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          <span>Публикации</span>
        </button>

        <button 
          onClick={() => setActiveWallTab('notes')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeWallTab === 'notes' ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">history_edu</span>
          <span>Записи</span>
        </button>

        <button 
          onClick={() => setActiveWallTab('showcase')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeWallTab === 'showcase' ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
          <span>Витрина</span>
        </button>

        <button 
          onClick={() => setActiveWallTab('reviews')}
          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
            activeWallTab === 'reviews' ? 'neu-pill-active text-[#BA9470]' : 'text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">rate_review</span>
          <span>Отзывы</span>
        </button>
      </div>

      {/* FEED WALL POSTS */}
      <div className="flex flex-col gap-4">
        {/* POST 1: Заметка об архетипе спирали + Аудио-фрагмент подкаста */}
        {(activeWallTab === 'posts' || activeWallTab === 'notes') && (
          <article className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center font-headline font-bold text-xs text-[#BA9470] border border-[#BA9470]/30">
                  ЕС
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#F0E2C8]">Екатерина Семерджиди</span>
                    <span className="material-symbols-outlined text-[#BA9470] text-[13px]">check_circle</span>
                  </div>
                  <span className="text-[10px] text-[#A9B489]/80">Ташкентская резиденция • 2 часа назад</span>
                </div>
              </div>
              <button className="text-[#A9B489] hover:text-[#F0E2C8]">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#F0E2C8]/95 leading-relaxed">
                «Спираль формирует образ пространства, где каждый может безопасно исследовать свои внутренние миры, возвращаться к себе и двигаться вперёд — всегда глубже. Терапия — это не бег по кругу, это осознанная глубина каждого нового витка».
              </p>

              {/* Audio Podcast Fragment Preview Card */}
              <div className="neu-inset rounded-xl p-3 flex items-center justify-between gap-3 mt-1">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setIsPlayingPodcast(!isPlayingPodcast)}
                    className="w-11 h-11 rounded-full neu-btn text-[#BA9470] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {isPlayingPodcast ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470]">Подкаст «В тишине кабинета»</span>
                    <span className="text-xs font-semibold text-[#F0E2C8] truncate">Выпуск #14. Архитектура внутренних опор</span>
                    <span className="text-[10.5px] text-[#A9B489]">{isPlayingPodcast ? '04:12 / 18:42' : '18:42'} • Екатерина Семерджиди</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[#A9B489]/70 pr-1">
                  <span className="w-1 h-3 rounded-full bg-[#BA9470]"></span>
                  <span className="w-1 h-6 rounded-full bg-[#A9B489]"></span>
                  <span className="w-1 h-4 rounded-full bg-[#BA9470]"></span>
                  <span className="w-1 h-2 rounded-full bg-[#A9B489]"></span>
                  <span className="w-1 h-5 rounded-full bg-[#BA9470]"></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#A9B489]/15 text-xs">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[#F0E2C8] hover:text-[#BA9470] transition-colors">
                  <span className="material-symbols-outlined text-[19px] text-[#BA9470]">favorite</span>
                  <span className="text-[11px] font-semibold">428</span>
                </button>
                <button className="flex items-center gap-1.5 text-[#F0E2C8] hover:text-[#BA9470] transition-colors">
                  <span className="material-symbols-outlined text-[19px] text-[#A9B489]">mode_comment</span>
                  <span className="text-[11px] font-semibold">39</span>
                </button>
              </div>
              <button className="text-[#F0E2C8] hover:text-[#BA9470] transition-colors">
                <span className="material-symbols-outlined text-[19px] text-[#BA9470]">bookmark_border</span>
              </button>
            </div>
          </article>
        )}

        {/* POST 2: Витрина продуктов */}
        {(activeWallTab === 'posts' || activeWallTab === 'showcase') && (
          <article className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center font-headline font-bold text-xs text-[#BA9470] border border-[#BA9470]/30">
                  ЕС
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#F0E2C8]">Екатерина Семерджиди</span>
                    <span className="material-symbols-outlined text-[#BA9470] text-[13px]">check_circle</span>
                  </div>
                  <span className="text-[10px] text-[#A9B489]/80">Аутентичная коллекция • Артефакты смысла</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#503428] text-[10px] font-bold text-[#BA9470] border border-[#BA9470]/30">Витрина</span>
            </div>

            <p className="text-xs text-[#F0E2C8]/90 leading-relaxed">
              Сезонная капсула физических артефактов: смысловые ювелирные формы спирали, селективный текстиль и фундаментальные книги.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Item 1: Кулон */}
              <div className="neu-inset rounded-xl p-3 flex flex-col justify-between gap-2">
                <div className="w-full aspect-[4/3] rounded-lg neu-flat flex flex-col items-center justify-center text-[#BA9470] border border-[#A9B489]/15">
                  <span className="material-symbols-outlined text-[30px]">all_inclusive</span>
                  <span className="text-[9.5px] uppercase font-bold text-[#A9B489] mt-1">Серебро 925° &amp; Золото</span>
                </div>
                <div>
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8] block leading-tight">Кулон «Спираль центра»</span>
                  <span className="text-[10px] text-[#A9B489]">Символ внутренней сборки</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                  <span className="font-bold text-xs text-[#BA9470]">$280</span>
                  <button onClick={() => handleQuickBook('Кулон Спираль центра ($280)')} className="px-2 py-1 rounded neu-btn text-[10px] font-semibold text-[#F0E2C8] hover:text-[#BA9470]">Купить</button>
                </div>
              </div>

              {/* Item 2: Книги */}
              <div className="neu-inset rounded-xl p-3 flex flex-col justify-between gap-2">
                <div className="w-full aspect-[4/3] rounded-lg neu-flat flex flex-col items-center justify-center text-[#BA9470] border border-[#A9B489]/15">
                  <span className="material-symbols-outlined text-[30px]">menu_book</span>
                  <span className="text-[9.5px] uppercase font-bold text-[#A9B489] mt-1">Твердый переплет</span>
                </div>
                <div>
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8] block leading-tight">«Анатомия зрелости»</span>
                  <span className="text-[10px] text-[#A9B489]">Монография-руководство</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                  <span className="font-bold text-xs text-[#BA9470]">$35</span>
                  <button onClick={() => handleQuickBook('Книга Анатомия зрелости ($35)')} className="px-2 py-1 rounded neu-btn text-[10px] font-semibold text-[#F0E2C8] hover:text-[#BA9470]">Купить</button>
                </div>
              </div>

              {/* Item 3: Текстиль */}
              <div className="neu-inset rounded-xl p-3 flex flex-col justify-between gap-2">
                <div className="w-full aspect-[4/3] rounded-lg neu-flat flex flex-col items-center justify-center text-[#BA9470] border border-[#A9B489]/15">
                  <span className="material-symbols-outlined text-[30px]">styler</span>
                  <span className="text-[9.5px] uppercase font-bold text-[#A9B489] mt-1">Узбекский шёлк</span>
                </div>
                <div>
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8] block leading-tight">Шёлковые платки &amp; шарфы</span>
                  <span className="text-[10px] text-[#A9B489]">Натуральный шёлк и кашемир</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                  <span className="font-bold text-xs text-[#BA9470]">$180 – $320</span>
                  <button onClick={() => handleQuickBook('Шёлковые шарфы и платки ($180-$320)')} className="px-2 py-1 rounded neu-btn text-[10px] font-semibold text-[#F0E2C8] hover:text-[#BA9470]">Выбрать</button>
                </div>
              </div>

              {/* Item 4: Кожа */}
              <div className="neu-inset rounded-xl p-3 flex flex-col justify-between gap-2">
                <div className="w-full aspect-[4/3] rounded-lg neu-flat flex flex-col items-center justify-center text-[#BA9470] border border-[#A9B489]/15">
                  <span className="material-symbols-outlined text-[30px]">work</span>
                  <span className="text-[9.5px] uppercase font-bold text-[#A9B489] mt-1">Ручная выделка</span>
                </div>
                <div>
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8] block leading-tight">Кожаные сумки &amp; чехлы</span>
                  <span className="text-[10px] text-[#A9B489]">Кабинетная серия</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#A9B489]/15">
                  <span className="font-bold text-xs text-[#BA9470]">$260</span>
                  <button onClick={() => handleQuickBook('Кожаная сумка ($260)')} className="px-2 py-1 rounded neu-btn text-[10px] font-semibold text-[#F0E2C8] hover:text-[#BA9470]">Заказать</button>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* POST 3: Интерактивная витрина услуг */}
        {(activeWallTab === 'posts' || activeWallTab === 'showcase') && (
          <article className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center font-headline font-bold text-xs text-[#BA9470] border border-[#BA9470]/30">
                  ЕС
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#F0E2C8]">Екатерина Семерджиди</span>
                    <span className="material-symbols-outlined text-[#BA9470] text-[13px]">check_circle</span>
                  </div>
                  <span className="text-[10px] text-[#A9B489]/80">Очный приём в Ташкенте &amp; Online</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#503428] text-[10px] font-bold text-[#BA9470] border border-[#BA9470]/30">Приём 2026</span>
            </div>

            <p className="text-xs text-[#F0E2C8]/90 leading-relaxed">
              Открыта предварительная запись на клинические супервизии специалистов и индивидуальные глубинные сессии весеннего цикла.
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Therapy */}
              <div className="neu-inset rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8]">Индивидуальная глубинная терапия</span>
                  <span className="text-[10.5px] text-[#A9B489]">60 минут • Очно в Ташкенте или Online</span>
                  <span className="text-xs font-bold text-[#BA9470] mt-0.5">$350</span>
                </div>
                <button 
                  onClick={() => handleQuickBook('Индивидуальная глубинная терапия ($350)')}
                  className="px-3 py-2 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] hover:text-[#BA9470] shrink-0 active:scale-95"
                >
                  Записаться
                </button>
              </div>

              {/* Supervision */}
              <div className="neu-inset rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8]">Супервизия клинических кейсов</span>
                  <span className="text-[10.5px] text-[#A9B489]">Разбор практики психологов и психоаналитиков</span>
                  <span className="text-xs font-bold text-[#BA9470] mt-0.5">$250</span>
                </div>
                <button 
                  onClick={() => handleQuickBook('Супервизия клинических кейсов ($250)')}
                  className="px-3 py-2 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] hover:text-[#BA9470] shrink-0 active:scale-95"
                >
                  Подать кейс
                </button>
              </div>

              {/* Retreat */}
              <div className="neu-inset rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-headline font-semibold text-xs text-[#F0E2C8]">Ретрит «Тишина вершин: Тянь-Шань»</span>
                  <span className="text-[10.5px] text-[#A9B489]">4 дня горного погружения • Группа до 10 человек</span>
                  <span className="text-xs font-bold text-[#BA9470] mt-0.5">$1,450</span>
                </div>
                <button 
                  onClick={() => onNavigate('booking')}
                  className="px-3 py-2 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] hover:text-[#BA9470] shrink-0 active:scale-95"
                >
                  Бронь
                </button>
              </div>
            </div>

            {/* Quick Notice Banner */}
            {quickNoticeText && (
              <div id="quickNoticeSection" className="p-3 rounded-xl bg-[#503428]/80 border border-[#BA9470]/40 text-xs text-[#F0E2C8] flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#BA9470] text-[18px]">verified</span>
                  <span>{quickNoticeText}</span>
                </div>
                <button 
                  onClick={() => onNavigate('chat')} 
                  className="px-2 py-1 rounded bg-[#BA9470]/20 text-[#BA9470] font-bold text-[10px] shrink-0"
                >
                  Открыть чат
                </button>
              </div>
            )}
          </article>
        )}

        {/* Reviews tab */}
        {activeWallTab === 'reviews' && (
          <div className="space-y-3">
            <div className="neu-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F0E2C8]">Алексей Н. (Участник ретрита)</span>
                <span className="text-[#BA9470] flex items-center gap-0.5">
                  {'★'.repeat(5)}
                </span>
              </div>
              <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
                «Опыт Чарвака перевернул понимание собственного тела. За три дня в горах ушли многомесячные спазмы в груди, которых я даже не замечал. Спасибо Екатерине за бережный контейнер».
              </p>
            </div>
            <div className="neu-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F0E2C8]">Марина К. (Супервизант)</span>
                <span className="text-[#BA9470] flex items-center gap-0.5">
                  {'★'.repeat(5)}
                </span>
              </div>
              <p className="text-xs text-[#F0E2C8]/85 leading-relaxed">
                «Редчайший супервизор, который смотрит не только на динамику кейса, но и на то, как контрперенос оседает в телесных реакциях терапевта. Невероятная точность».
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
