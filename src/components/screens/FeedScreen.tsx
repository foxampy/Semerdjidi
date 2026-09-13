import React, { useState, useEffect } from 'react';
import { ActiveScreen, WallPost } from '../../semerdzhidiTypes';
import { authService } from '../../services/authService';
import { shareModule } from '../../utils/shareHelper';

interface FeedScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'team' | 'expedition' | 'reviews'>('all');
  const [newPostText, setNewPostText] = useState('');
  const [newPostTags, setNewPostTags] = useState('#Экосистема #Здоровье');
  const [isPublishing, setIsPublishing] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const currentUser = authService.getCurrentUser();

  // Load wall posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await authService.getWallPosts();
      setPosts(data);
    } catch {
      // Keep whatever is in state
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsPublishing(true);
    const authorName = currentUser?.name || 'Резидент экосистемы';
    const authorRole = currentUser?.role || 'Участник сообщества';

    const tagsArray = newPostTags
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const res = await authService.createWallPost({
      author: authorName,
      authorRole,
      text: newPostText.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['#Экосистема', '#Здоровье'],
      contour: currentUser?.contour || 'both',
    });

    if (res.success && res.post) {
      setPosts([res.post, ...posts]);
      setNewPostText('');
      setNewPostTags('#Экосистема #Здоровье');
    } else {
      // Local fallback in case network has hiccups
      const fallbackPost: WallPost = {
        id: `post-local-${Date.now()}`,
        author: authorName,
        authorRole,
        contour: 'both',
        time: 'Только что',
        text: newPostText.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ['#Экосистема', '#Здоровье'],
        likes: 0,
        comments: []
      };
      setPosts([fallbackPost, ...posts]);
      setNewPostText('');
    }
    setIsPublishing(false);
  };

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
            likedByMe: !isLiked
          };
        }
        return p;
      })
    );

    await authService.likeWallPost(postId);
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const author = currentUser?.name || 'Участник';
    const res = await authService.commentWallPost(postId, { author, text });

    if (res.success && res.post) {
      setPosts(prev => prev.map(p => (p.id === postId ? res.post! : p)));
    } else {
      // optimistic update
      setPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...p.comments, { author, text, time: 'Только что' }]
            };
          }
          return p;
        })
      );
    }

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'team') {
      return (
        post.author.toLowerCase().includes('команда') ||
        post.author.toLowerCase().includes('тимур') ||
        post.author.toLowerCase().includes('екатерина') ||
        post.tags.some(t => t.toLowerCase().includes('команда'))
      );
    }
    if (selectedFilter === 'expedition') {
      return (
        post.tags.some(t =>
          t.toLowerCase().includes('экспедиция') ||
          t.toLowerCase().includes('ретрит') ||
          t.toLowerCase().includes('чимган')
        ) || post.text.toLowerCase().includes('экспедици')
      );
    }
    if (selectedFilter === 'reviews') {
      return (
        post.tags.some(t => t.toLowerCase().includes('отзыв') || t.toLowerCase().includes('опыт')) ||
        (!post.author.toLowerCase().includes('команда') && !post.author.toLowerCase().includes('тимур'))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-20 pt-2 px-3 sm:px-4 max-w-3xl mx-auto">
      {/* 24h Retreat Hero Announcement Card */}
      <section className="neu-card rounded-2xl p-4 sm:p-5 border border-[#BA9470]/40 relative overflow-hidden bg-gradient-to-br from-[#3b402e] via-[#343829] to-[#2b2e21] shadow-xl">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-36 h-36 bg-[#BA9470]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#BA9470]">
              Ретрит перезагрузки • 19-20 сентября
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset text-[#F0E2C8] text-[11px] font-bold border border-[#BA9470]/40 self-start sm:self-auto">
            <span className="material-symbols-outlined text-[14px] text-amber-400">timer</span>
            <span>24 часа «Всё включено»</span>
          </span>
        </div>

        <h2 className="font-headline font-bold text-lg sm:text-xl text-[#F0E2C8] leading-snug mb-2">
          Точка Сборки: Высокогорная перезагрузка в горах Чимгана
        </h2>

        <p className="text-[13px] text-[#F0E2C8]/90 leading-relaxed mb-4">
          Суточный интенсив в горах с глубоким восстановлением вегетативной нервной системы, термальными контрастами, осознанным эко-питанием и супервизией.
        </p>

        {/* Pricing Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="neu-inset rounded-xl p-2.5 text-center border border-[#A9B489]/20">
            <span className="block text-[10px] uppercase text-[#A9B489] font-medium">Полная цена</span>
            <span className="font-headline font-bold text-base text-[#F0E2C8] line-through opacity-70">$375</span>
          </div>

          <div className="neu-inset rounded-xl p-2.5 text-center border border-emerald-500/40 bg-emerald-950/20">
            <span className="block text-[10px] uppercase text-emerald-400 font-bold">До 10 сент (-50%)</span>
            <span className="font-headline font-bold text-base text-emerald-300">$187.50</span>
          </div>

          <div className="neu-inset rounded-xl p-2.5 text-center border border-[#BA9470]/40">
            <span className="block text-[10px] uppercase text-[#BA9470] font-medium">Предоплата 50%</span>
            <span className="font-headline font-bold text-base text-[#BA9470]">$93.75</span>
          </div>

          <div className="neu-inset rounded-xl p-2.5 text-center border border-[#A9B489]/20">
            <span className="block text-[10px] uppercase text-[#A9B489] font-medium">VIP + супервизия</span>
            <span className="font-headline font-bold text-base text-[#F0E2C8]">$495</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#A9B489]/20">
          <div className="flex items-center gap-2 text-xs text-[#A9B489]">
            <span className="material-symbols-outlined text-[16px] text-[#BA9470]">event_seat</span>
            <span>Осталось всего <strong>13 мест</strong> из 20</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('booking')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl neu-btn font-semibold text-xs text-[#F0E2C8] border border-[#BA9470]/50 hover:text-[#BA9470] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Зафиксировать 50%</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('retreats')}
              className="px-3 py-2.5 rounded-xl neu-inset text-xs text-[#A9B489] hover:text-[#F0E2C8] flex items-center justify-center gap-1 transition-all"
            >
              <span>Программа</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stories / Interactive Circles */}
      <section className="w-full">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A9B489]">Разделы экосистемы</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => shareModule('feed')}
              className="neu-btn px-2.5 py-1 rounded-xl text-xs font-bold text-[#FFCF96] border border-[#BA9470]/40 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              title="Поделиться лентой"
            >
              <span className="material-symbols-outlined text-[15px]">share</span>
              <span>Поделиться</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => onNavigate('retreats')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#BA9470]/40 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-[#BA9470]">forest</span>
            </div>
            <span className="text-[11px] font-medium text-[#F0E2C8] text-center max-w-[64px] truncate">Ретрит</span>
          </button>

          <button
            onClick={() => onNavigate('onboarding')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#A9B489]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-emerald-400">percent</span>
            </div>
            <span className="text-[11px] font-medium text-[#A9B489] text-center max-w-[64px] truncate">Скидка 50%</span>
          </button>

          <button
            onClick={() => onNavigate('baseline')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#A9B489]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-[#A9B489]">tune</span>
            </div>
            <span className="text-[11px] font-medium text-[#A9B489] text-center max-w-[64px] truncate">Чекин D-3</span>
          </button>

          <button
            onClick={() => onNavigate('practices')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#A9B489]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-[#BA9470]">graphic_eq</span>
            </div>
            <span className="text-[11px] font-medium text-[#A9B489] text-center max-w-[64px] truncate">Аудиотека</span>
          </button>

          <button
            onClick={() => onNavigate('experts')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#A9B489]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-[#A9B489]">psychology</span>
            </div>
            <span className="text-[11px] font-medium text-[#A9B489] text-center max-w-[64px] truncate">Эксперты</span>
          </button>

          <button
            onClick={() => onNavigate('social')}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full neu-btn p-1 border border-[#A9B489]/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-[#A9B489]">account_circle</span>
            </div>
            <span className="text-[11px] font-medium text-[#A9B489] text-center max-w-[64px] truncate">Кабинет</span>
          </button>
        </div>
      </section>

      {/* Write a New Post Card */}
      <section className="neu-card rounded-2xl p-4 border border-[#A9B489]/25 shadow-md">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-full neu-inset flex items-center justify-center text-[#BA9470] font-bold border border-[#BA9470]/30 shrink-0">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'Я'}
          </div>
          <div>
            <span className="font-headline font-semibold text-sm text-[#F0E2C8] block leading-tight">
              {currentUser?.name || 'Поделиться с экосистемой'}
            </span>
            <span className="text-[11px] text-[#A9B489]">
              {currentUser?.role || 'Публикация в общую ленту пространства'}
            </span>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="flex flex-col gap-2.5">
          <textarea
            value={newPostText}
            onChange={e => setNewPostText(e.target.value)}
            placeholder="Поделитесь вашим опытом, результатами практик заземления или задайте вопрос сообществу..."
            rows={3}
            className="w-full neu-inset rounded-xl p-3 text-xs text-[#F0E2C8] placeholder-[#A9B489]/60 focus:outline-none focus:ring-1 focus:ring-[#BA9470] resize-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-[#A9B489] font-bold">Теги:</span>
              <input
                type="text"
                value={newPostTags}
                onChange={e => setNewPostTags(e.target.value)}
                placeholder="#Экспедиция #Ретрит #Здоровье"
                className="neu-inset px-2.5 py-1 rounded-lg text-xs text-[#BA9470] w-full sm:w-60 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim() || isPublishing}
              className="px-4 py-2 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] border border-[#BA9470]/40 hover:text-[#BA9470] disabled:opacity-40 flex items-center justify-center gap-1.5 self-end sm:self-auto transition-all"
            >
              {isPublishing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#BA9470] border-t-transparent rounded-full animate-spin"></span>
                  <span>Публикация...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Опубликовать</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'all'
              ? 'neu-inset text-[#BA9470] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          Все публикации ({posts.length})
        </button>

        <button
          onClick={() => setSelectedFilter('team')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'team'
              ? 'neu-inset text-[#BA9470] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          От команды & Тимура Садыкова
        </button>

        <button
          onClick={() => setSelectedFilter('expedition')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'expedition'
              ? 'neu-inset text-[#BA9470] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          Экспедиция & Ретрит 19-20 сент
        </button>

        <button
          onClick={() => setSelectedFilter('reviews')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'reviews'
              ? 'neu-inset text-[#BA9470] border border-[#BA9470]/40'
              : 'neu-btn text-[#A9B489] hover:text-[#F0E2C8]'
          }`}
        >
          Отзывы & Резиденты
        </button>
      </div>

      {/* Wall Posts Stream */}
      {loading ? (
        <div className="neu-card rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-[#BA9470] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#A9B489]">Загрузка ленты публикаций...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="neu-card rounded-2xl p-8 text-center border border-[#A9B489]/20">
          <span className="material-symbols-outlined text-4xl text-[#A9B489] mb-2">article</span>
          <p className="text-sm font-semibold text-[#F0E2C8]">В этой категории пока нет публикаций</p>
          <p className="text-xs text-[#A9B489] mt-1">Будьте первым, кто опубликует запись!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map(post => {
            const isLiked = likedPosts[post.id] || post.likedByMe;
            const isCommentsOpen = activeCommentPostId === post.id;
            const isTimurPost = post.author.toLowerCase().includes('тимур садыков');

            return (
              <article
                key={post.id}
                className={`neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border transition-all ${
                  isTimurPost ? 'border-[#BA9470]/60 bg-[#3b402e]' : 'border-[#A9B489]/20'
                }`}
              >
                {/* Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full neu-inset flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isTimurPost
                          ? 'border-[#BA9470] text-[#BA9470] bg-[#343829]'
                          : 'border-[#A9B489]/30 text-[#A9B489]'
                      }`}
                    >
                      {post.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-headline font-semibold text-sm text-[#F0E2C8]">
                          {post.author}
                        </span>
                        {isTimurPost && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BA9470]/20 text-[#BA9470] border border-[#BA9470]/30">
                            Исследователь
                          </span>
                        )}
                        {post.author.toLowerCase().includes('команда') && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                            Экосистема
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A9B489]">
                        {post.authorRole || 'Резидент'} • {post.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#A9B489]/70">
                      <span className="material-symbols-outlined text-[16px]">public</span>
                    </span>
                  </div>
                </div>

                {/* Post Body Text */}
                <div className="text-[13px] text-[#F0E2C8]/90 leading-relaxed whitespace-pre-line">
                  {post.text}
                </div>

                {/* Optional Audio Note for expedition / team posts */}
                {isTimurPost && (
                  <div className="p-3 rounded-xl neu-inset border border-[#BA9470]/30 flex items-center gap-3 bg-[#323627]">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      aria-label="Воспроизвести аудио-отчет"
                      className="w-10 h-10 rounded-full neu-btn text-[#F0E2C8] flex items-center justify-center shrink-0 border border-[#BA9470]/40 hover:text-[#BA9470] active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#A9B489] mb-1">
                        <span className="flex items-center gap-1 text-[#BA9470] truncate">
                          <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                          Аудио-заметка Тимура Садыкова из Чимгана
                        </span>
                        <span className="text-[#F0E2C8]/70 text-[10px] shrink-0">
                          {isPlayingAudio ? '01:12 / 03:40' : '03:40'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#24271c] rounded-full overflow-hidden flex items-center p-0.5">
                        <div
                          className="h-1 bg-[#BA9470] rounded-full transition-all duration-300"
                          style={{ width: isPlayingAudio ? '52%' : '18%' }}
                        ></div>
                        <div className="h-1 bg-[#474c38] rounded-full ml-1 flex-1"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-[#BA9470] neu-inset px-2.5 py-0.5 rounded-lg border border-[#A9B489]/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions: Likes, Comments, Share */}
                <div className="pt-2 border-t border-[#A9B489]/15 flex items-center justify-between text-xs text-[#A9B489]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isLiked ? 'text-[#BA9470] font-bold' : 'hover:text-[#F0E2C8]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'text-[#BA9470]' : ''}`}>
                        favorite
                      </span>
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 hover:text-[#F0E2C8] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      <span>{post.comments ? post.comments.length : 0}</span>
                    </button>

                    {isTimurPost && (
                      <button
                        onClick={() => onNavigate('booking')}
                        className="text-[11px] font-semibold text-[#BA9470] hover:underline flex items-center gap-1"
                      >
                        <span>Забронировать 19-20 сент</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Ссылка на публикацию скопирована!');
                      }
                    }}
                    aria-label="Поделиться"
                    className="hover:text-[#BA9470] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                </div>

                {/* Expandable Comments Drawer */}
                {isCommentsOpen && (
                  <div className="mt-2 pt-3 border-t border-[#A9B489]/20 flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A9B489]">
                      Комментарии ({post.comments ? post.comments.length : 0})
                    </span>

                    {post.comments && post.comments.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {post.comments.map((c, cIdx) => (
                          <div key={cIdx} className="neu-inset rounded-xl p-2.5 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-[#F0E2C8]">{c.author}</span>
                              {c.time && <span className="text-[10px] text-[#A9B489]">{c.time}</span>}
                            </div>
                            <p className="text-[#F0E2C8]/80">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#A9B489] italic">Комментариев пока нет. Напишите первый!</p>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={e =>
                          setCommentInputs(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Написать комментарий..."
                        className="flex-1 neu-inset rounded-xl px-3 py-2 text-xs text-[#F0E2C8] placeholder-[#A9B489]/60 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-3 py-2 rounded-xl neu-btn text-xs font-semibold text-[#F0E2C8] border border-[#BA9470]/30 hover:text-[#BA9470] disabled:opacity-40 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
