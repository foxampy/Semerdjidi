import React, { useState, useEffect, useMemo } from 'react';
import { ActiveScreen } from '../../semerdzhidiTypes';
import { EthosiumTotem } from '../EthosiumTotem';
import { shareModule } from '../../utils/shareHelper';
import {
  WHITEPAPER_CHAPTERS,
  WhitepaperChapter,
  HEALTH_DIMENSIONS,
  HealthDimensionId,
  ECOSYSTEM_CIRCUITS
} from '../../data/whitepaperData';
import { HealthMatrixWidget } from '../whitepaper/HealthMatrixWidget';
import { CircuitsTopologyWidget } from '../whitepaper/CircuitsTopologyWidget';

interface WhitepaperScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

type WhitepaperTab = 'navigator' | 'dimensions' | 'circuits' | 'continuous';

export const WhitepaperScreen: React.FC<WhitepaperScreenProps> = ({ onNavigate }) => {
  // Main view mode
  const [activeTab, setActiveTab] = useState<WhitepaperTab>('navigator');
  
  // Selected chapter ID in navigator mode
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-manifesto');
  
  // Category filter in navigator
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Bookmarked chapter IDs stored in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ethos_whitepaper_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Read chapters tracked in localStorage
  const [readChapters, setReadChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ethos_whitepaper_read');
      return saved ? JSON.parse(saved) : ['ch-manifesto'];
    } catch {
      return ['ch-manifesto'];
    }
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('ethos_whitepaper_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Save read chapters
  useEffect(() => {
    try {
      localStorage.setItem('ethos_whitepaper_read', JSON.stringify(readChapters));
    } catch {
      // ignore
    }
  }, [readChapters]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleReadStatus = (id: string) => {
    setReadChapters(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    shareModule('whitepaper', { customTitle: 'Белая Книга Экосистемы EthOSium (Whitepaper 3.0)' });
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return WHITEPAPER_CHAPTERS.filter(ch => {
      if (showBookmarksOnly && !bookmarks.includes(ch.id)) return false;
      if (selectedCategory !== 'all' && ch.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ch.title.toLowerCase().includes(q) ||
        ch.subtitle.toLowerCase().includes(q) ||
        ch.summary.toLowerCase().includes(q) ||
        ch.content.paragraphs.some(p => p.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery, bookmarks, showBookmarksOnly]);

  const activeChapter = useMemo(() => {
    return WHITEPAPER_CHAPTERS.find(c => c.id === selectedChapterId) || WHITEPAPER_CHAPTERS[0];
  }, [selectedChapterId]);

  const currentIndex = WHITEPAPER_CHAPTERS.findIndex(c => c.id === activeChapter.id);
  const prevChapter = currentIndex > 0 ? WHITEPAPER_CHAPTERS[currentIndex - 1] : null;
  const nextChapter = currentIndex < WHITEPAPER_CHAPTERS.length - 1 ? WHITEPAPER_CHAPTERS[currentIndex + 1] : null;

  const totalReadingTime = WHITEPAPER_CHAPTERS.reduce((acc, curr) => acc + curr.readingTimeMinutes, 0);
  const readProgressPercent = Math.round((readChapters.length / WHITEPAPER_CHAPTERS.length) * 100);

  const handleCopyChapterMarkdown = () => {
    const text = `# ${activeChapter.title}\n${activeChapter.subtitle}\n\n${activeChapter.content.headline}\n\n${activeChapter.content.paragraphs.join('\n\n')}\n\n— EthOSium Whitepaper 3.0`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSelectDimensionFromMatrix = (dimId: HealthDimensionId) => {
    const targetChapter = WHITEPAPER_CHAPTERS.find(ch => ch.relatedDimensionId === dimId);
    if (targetChapter) {
      setSelectedChapterId(targetChapter.id);
      setActiveTab('navigator');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-24 px-3.5 sm:px-5 pt-2 max-w-7xl mx-auto">
      {/* Top Universal Whitepaper Header */}
      <div className="neu-card rounded-3xl p-5 sm:p-7 relative overflow-hidden border border-[#A9B489]/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl neu-inset p-2.5 flex items-center justify-center border border-[#BA9470]/40 shrink-0">
              <EthosiumTotem size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-full border border-[#BA9470]/30 font-bold">
                  EthOSium Human OS
                </span>
                <span className="text-[10px] font-mono text-[#A9B489] bg-[#2a2c20]/70 px-2 py-0.5 rounded-md">
                  v3.0 • Полный контур 2026
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {readProgressPercent}% освоено ({readChapters.length}/{WHITEPAPER_CHAPTERS.length})
                </span>
              </div>
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#F0E2C8] mt-1.5 leading-tight">
                Whitepaper: Архитектура Здоровья &amp; Ethos
              </h1>
              <p className="text-xs text-[#A9B489] mt-1 max-w-2xl">
                Операционная система полного контура человека и человечества: сон, психология, питание, движение, хаос, карьера, привычки и распределенные контуры экосистем.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`neu-btn px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                showBookmarksOnly
                  ? 'text-[#BA9470] border border-[#BA9470]/60'
                  : 'text-[#A9B489] hover:text-[#F0E2C8]'
              }`}
              title="Закладки"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showBookmarksOnly ? 'bookmark' : 'bookmark_border'}
              </span>
              <span>Закладки ({bookmarks.length})</span>
            </button>

            <button
              onClick={handleShare}
              className="neu-btn px-3 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1.5 transition-all"
              title="Поделиться Whitepaper"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedLink ? 'check' : 'share'}
              </span>
              <span>{copiedLink ? 'Ссылка скопирована' : 'Поделиться'}</span>
            </button>
          </div>
        </div>

        {/* Global Stats & Reading Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#A9B489]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-[#A9B489] flex-wrap font-mono">
            <span>Всего глав: <strong className="text-[#FFFDF8]">{WHITEPAPER_CHAPTERS.length}</strong></span>
            <span>Векторов здоровья: <strong className="text-[#BA9470]">8 векторов</strong></span>
            <span>Контуров системы: <strong className="text-sky-400">6 контуров</strong></span>
            <span>Время чтения: <strong className="text-[#FFFDF8]">~{totalReadingTime} мин</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-56">
            <div className="w-full bg-[#282a1e] h-2 rounded-full overflow-hidden border border-[#A9B489]/20">
              <div
                className="h-full bg-gradient-to-r from-[#BA9470] to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${readProgressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#A9B489] shrink-0 font-bold">
              {readProgressPercent}%
            </span>
          </div>
        </div>

        {/* Main View Mode Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 mt-4 border-t border-[#A9B489]/15">
          <button
            onClick={() => setActiveTab('navigator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'navigator'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/50 shadow-md'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            1. Главы &amp; Ридер ({WHITEPAPER_CHAPTERS.length})
          </button>

          <button
            onClick={() => setActiveTab('dimensions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dimensions'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/50 shadow-md'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hub</span>
            2. Матрица 8 Векторов Здоровья
          </button>

          <button
            onClick={() => setActiveTab('circuits')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'circuits'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/50 shadow-md'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">security</span>
            3. Топология 6 Контуров
          </button>

          <button
            onClick={() => setActiveTab('continuous')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'continuous'
                ? 'neu-pill-active text-[#F0E2C8] border border-[#BA9470]/50 shadow-md'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">article</span>
            4. Сплошной Документ (Свиток)
          </button>

          <button
            onClick={() => onNavigate('strategy')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 bg-[#BA9470]/20 text-[#BA9470] border border-[#BA9470]/50 hover:bg-[#BA9470]/30 hover:text-[#FFFDF8]"
          >
            <span className="material-symbols-outlined text-[16px]">timeline</span>
            5. Архитектура, Roadmap &amp; Инвест-План →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE NAVIGATOR / CHAPTER READER */}
      {/* ========================================================================= */}
      {activeTab === 'navigator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-300">
          {/* Left Column: Chapters Navigation & Filter (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Search and Category Filters */}
            <div className="neu-card rounded-2xl p-3.5 border border-[#A9B489]/15 space-y-2.5">
              <div className="relative">
                <span className="material-symbols-outlined text-[17px] text-[#A9B489] absolute left-3 top-2.5">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Поиск по Whitepaper..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2d3021] rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFFDF8] placeholder-[#A9B489]/60 border border-[#A9B489]/20 focus:border-[#BA9470] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="material-symbols-outlined text-[15px] text-[#A9B489] absolute right-3 top-2.5 hover:text-[#FFFDF8]"
                  >
                    close
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
                {[
                  { id: 'all', label: 'Все главы (7)' },
                  { id: 'manifesto', label: '1. Манифест' },
                  { id: 'method', label: '2. Научный базис' },
                  { id: 'circuits', label: '3. 6 Контуров' },
                  { id: 'patents', label: '4. WIPO Патенты' },
                  { id: 'privacy', label: '5. Приватность' },
                  { id: 'economics', label: '6. Экономика' },
                  { id: 'conclusion', label: '7. Заключение' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#BA9470]/30 text-[#FFFDF8] border border-[#BA9470]/60'
                        : 'neu-inset text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapters List */}
            <div className="flex flex-col gap-2 max-h-[640px] overflow-y-auto no-scrollbar pr-1">
              {filteredChapters.length === 0 ? (
                <div className="neu-card p-6 rounded-2xl text-center text-xs text-[#A9B489] border border-[#A9B489]/15">
                  Главы не найдены по текущему запросу.
                </div>
              ) : (
                filteredChapters.map((ch) => {
                  const isSelected = ch.id === selectedChapterId;
                  const isRead = readChapters.includes(ch.id);
                  const isBookmarked = bookmarks.includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      onClick={() => setSelectedChapterId(ch.id)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border text-left relative ${
                        isSelected
                          ? 'neu-pill-active border-[#BA9470]/60 shadow-lg'
                          : 'neu-card border-[#A9B489]/15 hover:border-[#A9B489]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#BA9470] font-bold">
                            {ch.number}
                          </span>
                          <span className="material-symbols-outlined text-[16px] text-[#A9B489]">
                            {ch.icon}
                          </span>
                          <span className="text-xs font-bold text-[#F0E2C8] leading-tight line-clamp-1">
                            {ch.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isRead && (
                            <span
                              className="material-symbols-outlined text-[14px] text-emerald-400"
                              title="Прочитано"
                            >
                              check_circle
                            </span>
                          )}
                          {isBookmarked && (
                            <span
                              className="material-symbols-outlined text-[14px] text-[#BA9470]"
                              title="В закладках"
                            >
                              bookmark
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#A9B489] mt-1 line-clamp-1 font-light">
                        {ch.subtitle}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#A9B489]/10 text-[10px] font-mono text-[#A9B489]/80">
                        <span>{ch.readingTimeMinutes} мин чтения</span>
                        {ch.badge && (
                          <span className="text-[#BA9470] uppercase font-bold">
                            {ch.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Chapter Content (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="neu-card rounded-3xl p-5 sm:p-7 border border-[#BA9470]/30 bg-[#383b2a] space-y-5">
              {/* Chapter Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A9B489]/15 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-full border border-[#BA9470]/30">
                      Глава {activeChapter.number}
                    </span>
                    <span className="text-xs font-mono text-[#A9B489]">
                      ~{activeChapter.readingTimeMinutes} мин чтения
                    </span>
                    {activeChapter.badge && (
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {activeChapter.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8] mt-2 leading-tight">
                    {activeChapter.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A9B489] mt-1 font-light leading-relaxed">
                    {activeChapter.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => toggleBookmark(activeChapter.id)}
                    className={`neu-btn p-2 rounded-xl text-xs transition-all ${
                      bookmarks.includes(activeChapter.id)
                        ? 'text-[#BA9470] border border-[#BA9470]/50'
                        : 'text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                    title={bookmarks.includes(activeChapter.id) ? 'Удалить из закладок' : 'Добавить в закладки'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {bookmarks.includes(activeChapter.id) ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleReadStatus(activeChapter.id)}
                    className={`neu-btn px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      readChapters.includes(activeChapter.id)
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : 'text-[#A9B489] hover:text-[#F0E2C8]'
                    }`}
                    title="Статус прочтения"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {readChapters.includes(activeChapter.id) ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{readChapters.includes(activeChapter.id) ? 'Прочитано' : 'Отметить'}</span>
                  </button>

                  <button
                    onClick={handleCopyChapterMarkdown}
                    className="neu-btn p-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] transition-all"
                    title="Скопировать главу в Markdown"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedText ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Chapter Summary Box */}
              <div className="neu-inset p-4 rounded-2xl border border-[#A9B489]/15 bg-[#2d3021]/80">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block mb-1">
                  Тезис Главы
                </span>
                <p className="text-xs sm:text-sm text-[#E2ECD2]/90 leading-relaxed font-light">
                  {activeChapter.summary}
                </p>
              </div>

              {/* Main Text Content */}
              <div className="space-y-4 pt-1">
                <h3 className="font-headline font-bold text-base sm:text-lg text-[#F0E2C8]">
                  {activeChapter.content.headline}
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-[#E2ECD2]/85 leading-relaxed font-light">
                  {activeChapter.content.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Key Takeaways */}
                {activeChapter.content.keyTakeaways && (
                  <div className="neu-card p-4 rounded-2xl border border-emerald-500/25 bg-[#323929] mt-4 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Ключевые выводы раздела:
                    </span>
                    <ul className="space-y-1.5">
                      {activeChapter.content.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="text-xs text-[#FFFDF8] flex items-start gap-2">
                          <span className="material-symbols-outlined text-[14px] text-emerald-400 mt-0.5 shrink-0">
                            arrow_right
                          </span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specific Protocols (if applicable) */}
                {activeChapter.content.protocols && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold block">
                      Практические протоколы:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeChapter.content.protocols.map((proto, idx) => (
                        <div key={idx} className="neu-inset p-3 rounded-xl border border-[#A9B489]/15">
                          <h4 className="text-xs font-bold text-[#FFFDF8]">{proto.name}</h4>
                          <p className="text-[11px] text-[#A9B489] mt-1 leading-snug">{proto.description}</p>
                          {proto.metrics && (
                            <span className="text-[10px] font-mono text-emerald-400 mt-1.5 block font-semibold">
                              Целевой маркер: {proto.metrics}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Quote (if applicable) */}
                {activeChapter.content.quotes && (
                  <div className="neu-inset p-4 rounded-2xl border-l-4 border-l-[#BA9470] border border-[#A9B489]/15 bg-[#2d3021]/60 my-4">
                    <p className="text-xs sm:text-sm italic text-[#F0E2C8] leading-relaxed">
                      {activeChapter.content.quotes.text}
                    </p>
                    <div className="mt-2 text-right">
                      <span className="text-xs font-bold text-[#BA9470] block">
                        {activeChapter.content.quotes.author}
                      </span>
                      <span className="text-[10px] text-[#A9B489] font-mono">
                        {activeChapter.content.quotes.role}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bridges: Direct Integration with App Modules */}
              {activeChapter.actionBridges.length > 0 && (
                <div className="neu-card p-4 rounded-2xl border border-[#A9B489]/20 bg-[#343727] mt-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#BA9470]">cable</span>
                      <span className="text-xs font-bold text-[#F0E2C8]">
                        Практический мост в приложение:
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A9B489]">
                      Мгновенный переход к практике
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeChapter.actionBridges.map((bridge, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(bridge.screen)}
                        className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#FFFDF8] hover:text-[#BA9470] border border-[#BA9470]/40 hover:border-[#BA9470] flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {bridge.icon}
                        </span>
                        <span>{bridge.label}</span>
                        {bridge.badge && (
                          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded ml-1">
                            {bridge.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Prev / Next Chapter Navigation */}
              <div className="border-t border-[#A9B489]/15 pt-4 flex items-center justify-between gap-3">
                {prevChapter ? (
                  <button
                    onClick={() => {
                      setSelectedChapterId(prevChapter.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="neu-btn px-3.5 py-2 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1.5 transition-all max-w-[45%]"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    <span className="truncate">Гл. {prevChapter.number}: {prevChapter.title}</span>
                  </button>
                ) : <div />}

                {nextChapter ? (
                  <button
                    onClick={() => {
                      setSelectedChapterId(nextChapter.id);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="neu-btn px-3.5 py-2 rounded-xl text-xs font-bold text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/40 flex items-center gap-1.5 transition-all max-w-[45%]"
                  >
                    <span className="truncate">Гл. {nextChapter.number}: {nextChapter.title}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                ) : <div />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: 8 HEALTH DIMENSIONS MATRIX & BALANCE RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'dimensions' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <HealthMatrixWidget
            onNavigate={onNavigate}
            onSelectDimensionChapter={handleSelectDimensionFromMatrix}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: 4 CIRCUITS TOPOLOGY VISUALIZER */}
      {/* ========================================================================= */}
      {activeTab === 'circuits' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <CircuitsTopologyWidget onNavigate={onNavigate} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: CONTINUOUS WHITEPAPER SCROLL (ACADEMIC PAPER) */}
      {/* ========================================================================= */}
      {activeTab === 'continuous' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Scroll Header Controls */}
          <div className="neu-card rounded-2xl p-4 border border-[#A9B489]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA9470] font-bold">
                Сплошной Исследовательский Свиток
              </span>
              <h2 className="font-headline font-bold text-base text-[#F0E2C8]">
                Полный текст документации EthOSium 3.0
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Печать / PDF
              </button>
              <button
                onClick={() => {
                  const allText = WHITEPAPER_CHAPTERS.map(c => `## Глава ${c.number}: ${c.title}\n\n${c.content.paragraphs.join('\n\n')}`).join('\n\n---\n\n');
                  navigator.clipboard.writeText(allText);
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                }}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/40 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedText ? 'done' : 'copy_all'}
                </span>
                {copiedText ? 'Скопировано' : 'Скопировать весь текст'}
              </button>
            </div>
          </div>

          {/* All Chapters Stream */}
          <div className="space-y-5">
            {WHITEPAPER_CHAPTERS.map((ch) => (
              <div
                key={ch.id}
                id={ch.id}
                className="neu-card rounded-3xl p-5 sm:p-7 border border-[#A9B489]/15 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#A9B489]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-full border border-[#BA9470]/30">
                      Глава {ch.number}
                    </span>
                    <span className="text-xs font-mono text-[#A9B489]">
                      ~{ch.readingTimeMinutes} мин
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A9B489] uppercase">
                    {ch.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-xl text-[#F0E2C8]">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-[#A9B489] mt-0.5">
                    {ch.subtitle}
                  </p>
                </div>

                <div className="neu-inset p-3.5 rounded-xl text-xs text-[#E2ECD2]/90 leading-relaxed font-light">
                  {ch.summary}
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#E2ECD2]/85 leading-relaxed font-light pt-1">
                  {ch.content.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {ch.actionBridges.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {ch.actionBridges.map((b, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigate(b.screen)}
                        className="neu-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#BA9470] hover:text-[#FFFDF8] border border-[#BA9470]/30 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">{b.icon}</span>
                        {b.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Bottom Gateway */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 border border-[#BA9470]/30 bg-[#353828] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#BA9470] font-bold block">
            Интеграция в реальность
          </span>
          <h3 className="font-headline font-bold text-base sm:text-lg text-[#F0E2C8] mt-0.5">
            От теории Whitepaper — к личному опыту перезагрузки
          </h3>
          <p className="text-xs text-[#E2ECD2]/80 mt-1 max-w-xl">
            Пройдите 7-шкальный чекин Baseline, соберите персональный горный ретрит в Чимгане со скидкой 50% или запишитесь к эксперту Института Семерджиди.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
          <button
            onClick={() => onNavigate('retreats')}
            className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-[#FFFDF8] bg-[#BA9470]/25 border border-[#BA9470]/60 hover:bg-[#BA9470]/40 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">landscape</span>
            Ретрит Чимган 2026
          </button>
          <button
            onClick={() => onNavigate('baseline')}
            className="neu-btn px-4 py-2.5 rounded-xl text-xs font-bold text-[#BA9470] hover:text-[#FFFDF8] border border-[#A9B489]/25 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Baseline (7 шкал)
          </button>
        </div>
      </div>
    </div>
  );
};
