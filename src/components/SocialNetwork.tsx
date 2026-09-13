import React, { useState } from 'react';
import { 
  Share2, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Send, 
  Sparkles, 
  Filter, 
  Tag, 
  Users, 
  TrendingUp,
  BrainCircuit,
  Lock,
  Globe,
  ShieldCheck,
  Paperclip
} from 'lucide-react';
import { SocialPost, EcosystemContour, SemerdzhidiProfile } from '../types';

interface SocialNetworkProps {
  posts: SocialPost[];
  activeContour: EcosystemContour;
  profiles: SemerdzhidiProfile[];
  onAddPost: (post: SocialPost) => void;
  onToggleLike: (postId: string) => void;
}

export const SocialNetwork: React.FC<SocialNetworkProps> = ({
  posts,
  activeContour,
  profiles,
  onAddPost,
  onToggleLike
}) => {
  const [filterContour, setFilterContour] = useState<EcosystemContour | 'all'>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostContour, setNewPostContour] = useState<EcosystemContour>(activeContour);
  const [newPostTag, setNewPostTag] = useState('#Семерджиди');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [mockComments, setMockComments] = useState<Record<string, Array<{ author: string; role: string; text: string }>>>({
    'post-1': [
      { author: 'Александр Морозов', role: 'Техдиректор', text: 'Полностью подтверждаю: в инженерном контуре количество переделок упало на треть.' },
      { author: 'Елена Василенко', role: 'HR-партнер', text: 'Удивительно точная калибровка! Команда чувствует себя увереннее.' }
    ]
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: 'user-current',
      authorName: 'Валентина Семерджиди',
      authorRole: 'Главный методолог',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      authorCompany: 'Институт Типологии Семерджиди',
      contour: newPostContour,
      timestamp: 'Только что',
      content: newPostContent,
      tags: [newPostTag, '#EthOSium'],
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      semerdzhidiBadge: 'Резонанс 97%',
      resonanceScore: 97
    };

    onAddPost(newPost);
    setNewPostContent('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    setMockComments(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        { author: 'Вы (Участник контура)', role: 'Специалист', text }
      ]
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const filteredPosts = filterContour === 'all' 
    ? posts 
    : posts.filter(p => p.contour === filterContour);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              <span>Корпоративная соцсеть & Среда взаимодействия</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Outfit']">
              EthOS Pulse: Единая Сеть Профессионалов
            </h1>
            <p className="text-sm text-slate-300">
              Прозрачный обмен знаниями, проектными инсайтами и взаимная поддержка между компаниями и контурами с умным подбором партнеров по психотипам Семерджиди.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs">
            <span className="text-slate-400 px-2">Контур ленты:</span>
            {(['all', 'public', 'corporate', 'sovereign'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterContour(c)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterContour === c
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {c === 'all' ? 'Все' : c === 'public' ? 'Публичный' : c === 'corporate' ? 'Корпоративный' : 'Суверенный'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Column: Create Post & Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Post Composer */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Опубликовать инсайт или новость в контур</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Публикация в:</span>
                <select
                  value={newPostContour}
                  onChange={(e) => setNewPostContour(e.target.value as EcosystemContour)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="public">Публичный контур</option>
                  <option value="corporate">Корпоративный контур</option>
                  <option value="sovereign">Суверенный контур</option>
                </select>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Поделитесь результатами спринта, гипотезой или обратной связью по контуру..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center space-x-2">
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-purple-300 focus:outline-none"
                  >
                    <option value="#Семерджиди">#Семерджиди</option>
                    <option value="#EthOSium">#EthOSium</option>
                    <option value="#ОптимизацияИИ">#ОптимизацияИИ</option>
                    <option value="#ПсихологическаяСинергия">#ПсихологическаяСинергия</option>
                    <option value="#ZeroTrust">#ZeroTrust</option>
                  </select>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    Индекс синергии рассчитается автоматически
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-purple-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Опубликовать в пульс</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isCommentsOpen = expandedComments[post.id];
              const comments = mockComments[post.id] || [];

              return (
                <div
                  key={post.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">{post.authorName}</span>
                          <span className="text-[11px] text-slate-400">· {post.timestamp}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-1">
                          <span>{post.authorRole}</span>
                          <span>•</span>
                          <span className="text-indigo-400">{post.authorCompany}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded border font-medium flex items-center space-x-1 ${
                        post.contour === 'public' ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                        post.contour === 'corporate' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                        'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {post.contour === 'public' ? <Globe className="w-3 h-3" /> :
                         post.contour === 'corporate' ? <ShieldCheck className="w-3 h-3" /> :
                         <Lock className="w-3 h-3" />}
                        <span>{post.contour}</span>
                      </span>

                      {post.semerdzhidiBadge && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                          {post.semerdzhidiBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Attachments if any */}
                  {post.attachments && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {post.attachments.map((att, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{att.title}</span>
                          {att.value && <span className="font-bold text-emerald-400">{att.value}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-purple-400 hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onToggleLike(post.id)}
                        className={`flex items-center space-x-1.5 transition-colors ${
                          post.isLiked ? 'text-rose-500' : 'hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center space-x-1.5 hover:text-slate-200 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments.length || post.commentsCount} коммент.</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1 text-slate-500">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Синергия поста: <strong className="text-indigo-300">{post.resonanceScore}%</strong></span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                      {comments.map((c, i) => (
                        <div key={i} className="bg-slate-950/60 rounded-xl p-3 text-xs space-y-1 border border-slate-800/80">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-white">{c.author}</span>
                            <span className="text-slate-500">{c.role}</span>
                          </div>
                          <p className="text-slate-300">{c.text}</p>
                        </div>
                      ))}

                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Написать ответ в контур..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-lg font-medium"
                        >
                          Отправить
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Smart Networking & Trends */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Matcher by Semerdzhidi */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <h3 className="font-semibold text-white text-sm">Умный нетворкинг Семерджиди</h3>
            </div>
            <p className="text-xs text-slate-400">
              Коллеги с комплементарными психотипами для совместных задач:
            </p>

            <div className="space-y-3">
              {profiles.slice(1, 4).map((prof) => (
                <div key={prof.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img src={prof.avatar} alt={prof.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-white">{prof.name}</div>
                      <div className="text-[10px] text-purple-400">{prof.dominantType.split('(')[0]}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Резонанс</div>
                    <div className="font-bold text-emerald-400">{prof.synergyScore}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosystem Trends */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-white text-sm">Тренды в контурах EthOSium</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-indigo-300 font-medium">#МодельСемерджиди2026</span>
                <span className="text-[10px] text-slate-400">420 упоминаний</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-sky-300 font-medium">#БесшовныеКонтуры</span>
                <span className="text-[10px] text-slate-400">312 упоминаний</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-emerald-300 font-medium">#ПредотвращениеВыгорания</span>
                <span className="text-[10px] text-slate-400">198 упоминаний</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
