import React, { useState, useEffect } from 'react';
import { ActiveScreen, EthosiumUserProfile } from '../../semerdzhidiTypes';
import { authService } from '../../services/authService';
import { useI18n } from '../../services/i18n';

interface SocialAccountScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

interface WallPostItem {
  id: string;
  authorId?: string;
  author: string;
  authorRole: string;
  contour: 'semerdzhidi' | 'labforge' | 'both';
  time: string;
  text: string;
  tags: string[];
  likes: number;
  comments: Array<{ author: string; text: string }>;
}

export const SocialAccountScreen: React.FC<SocialAccountScreenProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'profile' | 'messages' | 'friends' | 'wall'>('profile');

  // User session state
  const [userProfile, setUserProfile] = useState<EthosiumUserProfile | null>(() => {
    return authService.getCurrentUser();
  });

  // Auth / Registration form state (when user is not logged in)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [authForm, setAuthForm] = useState({
    name: '',
    emailOrTg: '',
    password: '',
    role: 'Предприниматель / Лидер проектов',
    contour: 'both' as 'labforge' | 'semerdzhidi' | 'both',
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || '',
    emailOrTg: userProfile?.emailOrTg || '',
    role: userProfile?.role || 'Предприниматель / Лидер проектов',
    bio: 'Исследую баланс между технологической автономией бизнеса и психологической устойчивостью команды.',
  });

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real registered users list
  const [registeredUsers, setRegisteredUsers] = useState<Array<{
    id: string;
    name: string;
    emailOrTg: string;
    role: string;
    contour: string;
    registeredAt: string;
    isAdmin?: boolean;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendFilter, setFriendFilter] = useState<'all' | 'labforge' | 'semerdzhidi'>('all');

  // Wall posts state
  const [wallPosts, setWallPosts] = useState<WallPostItem[]>([]);
  const [wallInput, setWallInput] = useState('');
  const [wallTag, setWallTag] = useState('#EthOSium');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Messages state
  const [activeDialogId, setActiveDialogId] = useState<string>('');
  const [chatInputs, setChatInputs] = useState<string>('');
  const [dialogMessages, setDialogMessages] = useState<Record<string, Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>>>(() => {
    try {
      const saved = localStorage.getItem('ethosium_direct_dialogs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ethosium_direct_dialogs', JSON.stringify(dialogMessages));
    } catch (e) {
      console.warn(e);
    }
  }, [dialogMessages]);

  // Load real registered users from backend
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setRegisteredUsers(data.users);
      }
    } catch (e) {
      console.warn('Failed to load users:', e);
    }
  };

  // Load wall posts from backend
  const loadWallPosts = async () => {
    try {
      const res = await fetch('/api/wall-posts');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setWallPosts(data.posts);
      }
    } catch (e) {
      console.warn('Failed to load wall posts:', e);
    }
  };

  useEffect(() => {
    loadUsers();
    loadWallPosts();
  }, [userProfile]);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name,
        emailOrTg: userProfile.emailOrTg,
        role: userProfile.role,
        bio: 'Исследую баланс между технологической автономией бизнеса и психологической устойчивостью команды.',
      });
    }
  }, [userProfile]);

  // Handle User Registration / Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const cleanEmail = authForm.emailOrTg.trim();
    if (!cleanEmail) {
      setAuthError('Пожалуйста, укажите email или Telegram');
      setAuthLoading(false);
      return;
    }
    const cleanName = authForm.name.trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail) || 'Резидент';

    try {
      if (authMode === 'register') {
        const res = await authService.registerWithEmail({
          name: cleanName,
          emailOrTg: cleanEmail,
          password: authForm.password,
          role: authForm.role,
          contour: authForm.contour,
        });
        if (res.success && res.user) {
          setUserProfile(res.user);
          loadUsers();
        } else {
          setAuthError(res.error || 'Ошибка при регистрации');
        }
      } else {
        const res = await authService.loginWithCredentials(cleanEmail, authForm.password);
        if (res.success && res.user) {
          setUserProfile(res.user);
          loadUsers();
        } else {
          setAuthError(res.error || 'Пользователь не найден. Проверьте введенные данные');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка связи с сервером');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle OAuth 1-click
  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await authService.loginWithOAuth(provider);
      if (res.success && res.user) {
        setUserProfile(res.user);
        loadUsers();
      } else {
        setAuthError(res.error || 'Ошибка OAuth');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка OAuth');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      const res = await authService.updateProfile({
        userId: userProfile.id,
        name: editForm.name,
        emailOrTg: editForm.emailOrTg,
        role: editForm.role,
        bio: editForm.bio,
      });

      if (res.success && res.user) {
        setUserProfile(res.user);
        setIsEditing(false);
        loadUsers();
      }
    } catch (e: any) {
      alert(e.message || 'Ошибка сохранения');
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!userProfile) return;
    setIsDeleting(true);

    try {
      const res = await authService.deleteAccount(userProfile.id);
      if (res.success) {
        setUserProfile(null);
        setShowDeleteConfirm(false);
        loadUsers();
      } else {
        alert(res.error || 'Не удалось удалить аккаунт');
      }
    } catch (e: any) {
      alert(e.message || 'Ошибка удаления');
    } finally {
      setIsDeleting(false);
    }
  };

  // Publish Wall Post
  const handlePublishWallPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallInput.trim()) return;

    try {
      const res = await fetch('/api/wall-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: userProfile?.name || 'Участник сообщества',
          authorRole: userProfile?.role || 'Резидент EthOSium',
          contour: userProfile?.contour || 'both',
          text: wallInput.trim(),
          tags: [wallTag],
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setWallPosts([data.post, ...wallPosts]);
        setWallInput('');
      }
    } catch (e) {
      console.warn('Post error:', e);
    }
  };

  // Delete Wall Post
  const handleDeleteWallPost = async (postId: string) => {
    try {
      await fetch(`/api/wall-posts/${postId}`, { method: 'DELETE' });
      setWallPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e) {
      console.warn(e);
    }
  };

  // Send Direct Message
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputs.trim() || !activeDialogId) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: chatInputs.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDialogMessages(prev => ({
      ...prev,
      [activeDialogId]: [...(prev[activeDialogId] || []), newMsg],
    }));

    setChatInputs('');
  };

  // Filtered residents list (excluding current user)
  const otherUsers = registeredUsers.filter(u => u.id !== userProfile?.id && u.emailOrTg !== userProfile?.emailOrTg);
  const filteredUsers = otherUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const match = u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.emailOrTg.toLowerCase().includes(q);
    if (!match) return false;
    if (friendFilter === 'labforge') return u.contour === 'labforge' || u.contour === 'both';
    if (friendFilter === 'semerdzhidi') return u.contour === 'semerdzhidi' || u.contour === 'both';
    return true;
  });

  const activeUserContact = registeredUsers.find(u => u.id === activeDialogId);

  return (
    <div className="flex flex-col w-full gap-4 pb-20 px-3 sm:px-4 pt-1 max-w-4xl mx-auto">
      {/* Top Banner: Ecosystem Identity */}
      <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 border border-[#E2ECD2]/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl neu-inset p-1 border border-[#FFCF96]/40 flex items-center justify-center bg-[#2b2f20] text-[#FFCF96]">
              <span className="material-symbols-outlined text-[28px]">
                {userProfile ? 'account_circle' : 'lock_open'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-lg sm:text-xl text-[#FFFDF8]">
                  {userProfile ? userProfile.name : 'Личный Кабинет Резидента'}
                </h1>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  userProfile
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}>
                  {userProfile ? 'Авторизован' : 'Вход'}
                </span>
              </div>
              <p className="text-xs text-[#E2ECD2]/80 font-mono mt-0.5">
                {userProfile ? `${userProfile.emailOrTg} • ${userProfile.role}` : 'Авторизация и управление профилем'}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {authService.isAdmin(userProfile) && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-3 py-2 neu-btn rounded-xl text-xs font-bold text-[#FFCF96] border border-[#FFCF96]/50 flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Панель Управления</span>
              </button>
            )}

            {userProfile && (
              <button
                onClick={() => {
                  authService.logout();
                  setUserProfile(null);
                }}
                className="px-3 py-2 neu-btn rounded-xl text-xs font-bold text-[#E2ECD2] border border-[#E2ECD2]/20 hover:text-red-300 flex items-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Выйти</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-1 border-t border-[#E2ECD2]/15">
          {[
            { id: 'profile', label: 'Аккаунт', icon: 'badge' },
            { id: 'messages', label: 'Сообщения', icon: 'chat' },
            { id: 'friends', label: 'Резиденты', icon: 'group' },
            { id: 'wall', label: 'Стена', icon: 'dynamic_feed' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-1 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all ${
                  isActive
                    ? 'neu-pill-active border-2 border-[#FFCF96] text-[#FFFDF8] shadow-md'
                    : 'neu-inset text-[#E2ECD2] hover:text-[#FFFDF8]'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#FFCF96]' : ''}`}>
                  {tab.icon}
                </span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: МОЙ АККАУНТ */}
      {activeTab === 'profile' && (
        <div className="flex flex-col gap-4">
          {!userProfile ? (
            /* Registration / Login Card */
            <div className="neu-card rounded-2xl p-5 sm:p-6 border border-[#E2ECD2]/20 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E2ECD2]/15 pb-3">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#FFFDF8]">
                    {authMode === 'register' ? 'Регистрация нового резидента' : 'Вход в аккаунт'}
                  </h3>
                  <p className="text-xs text-[#E2ECD2]/70 mt-0.5">
                    Каждый участник заполняет свои собственные данные
                  </p>
                </div>
                <div className="flex gap-1 neu-inset p-1 rounded-xl">
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'register' ? 'neu-pill-active text-[#FFCF96]' : 'text-[#E2ECD2]'
                    }`}
                  >
                    Регистрация
                  </button>
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      authMode === 'login' ? 'neu-pill-active text-[#FFCF96]' : 'text-[#E2ECD2]'
                    }`}
                  >
                    Вход
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
                {authMode === 'register' && (
                  <div>
                    <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                      Ваше Имя и Фамилия <span className="text-[10px] text-[#A9B489] font-normal lowercase">(необязательно)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Иван Иванов (или оставьте пустым)"
                      value={authForm.name}
                      onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                    Email или Telegram
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="user@example.com или @username"
                    value={authForm.emailOrTg}
                    onChange={e => setAuthForm({ ...authForm, emailOrTg: e.target.value })}
                    className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                    Пароль (опционально)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none"
                  />
                </div>

                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                        Ваша роль
                      </label>
                      <input
                        type="text"
                        placeholder="Предприниматель / Аналитик / Специалист"
                        value={authForm.role}
                        onChange={e => setAuthForm({ ...authForm, role: e.target.value })}
                        className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-extrabold text-[#E2ECD2] block mb-1">
                        Контур взаимодействия
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'both', label: 'Оба контура' },
                          { id: 'labforge', label: 'LabForge R&D' },
                          { id: 'semerdzhidi', label: 'Семерджиди' },
                        ].map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setAuthForm({ ...authForm, contour: c.id as any })}
                            className={`py-2 px-2 rounded-xl font-bold text-xs transition-all ${
                              authForm.contour === c.id
                                ? 'neu-pill-active border border-[#FFCF96] text-[#FFCF96]'
                                : 'neu-inset text-[#E2ECD2]'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 neu-btn rounded-xl font-bold text-sm text-[#FFFDF8] border-2 border-[#FFCF96]/70 hover:text-[#FFCF96] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#FFCF96]">
                    {authMode === 'register' ? 'person_add' : 'login'}
                  </span>
                  <span>{authMode === 'register' ? 'Создать аккаунт' : 'Войти'}</span>
                </button>
              </form>

              {/* OAuth Providers */}
              <div className="pt-2 border-t border-[#E2ECD2]/15 flex flex-col gap-2">
                <span className="text-[11px] text-[#E2ECD2]/60 text-center uppercase tracking-wider font-mono">
                  Или быстрый вход через
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    className="py-2.5 rounded-xl neu-btn border border-[#E2ECD2]/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FFFDF8] hover:text-[#FFCF96]"
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('apple')}
                    className="py-2.5 rounded-xl neu-btn border border-[#E2ECD2]/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FFFDF8] hover:text-[#FFCF96]"
                  >
                    <span>Apple</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuthLogin('facebook')}
                    className="py-2.5 rounded-xl neu-btn border border-[#E2ECD2]/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#FFFDF8] hover:text-[#FFCF96]"
                  >
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Logged-In User Profile Details */
            <div className="neu-card rounded-2xl p-5 sm:p-6 border border-[#E2ECD2]/20 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#E2ECD2]/15 pb-3">
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#FFFDF8]">
                    Данные профиля
                  </h3>
                  <p className="text-xs text-[#E2ECD2]/70">
                    ID: {userProfile.id} • Зарегистрирован: {userProfile.registeredAt}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 neu-btn rounded-xl text-xs font-bold text-[#FFCF96] border border-[#FFCF96]/40 flex items-center gap-1 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isEditing ? 'close' : 'edit'}
                  </span>
                  <span>{isEditing ? 'Отмена' : 'Редактировать'}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="text-xs uppercase font-semibold text-[#BA9470] block mb-1">
                      Отображаемое имя
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#F0E2C8] border border-white/5 focus:border-[#BA9470]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-semibold text-[#BA9470] block mb-1">
                      Email или Telegram
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.emailOrTg}
                      onChange={e => setEditForm({ ...editForm, emailOrTg: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#F0E2C8] border border-white/5 focus:border-[#BA9470]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-semibold text-[#BA9470] block mb-1">
                      Роль в сообществе
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#F0E2C8] border border-white/5 focus:border-[#BA9470]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase font-semibold text-[#BA9470] block mb-1">
                      О себе & Исследовательский интерес
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.bio}
                      onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full neu-inset rounded-xl p-3 text-sm text-[#F0E2C8] border border-white/5 focus:border-[#BA9470]/40 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 neu-btn rounded-xl font-semibold text-xs text-[#F0E2C8] border border-[#BA9470]/30 flex items-center justify-center gap-2 hover:bg-[#444b34] transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#BA9470]">save</span>
                    <span>Сохранить профиль</span>
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="neu-inset p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470] block">Имя</span>
                    <span className="text-sm font-semibold text-[#F0E2C8] mt-1 block">{userProfile.name}</span>
                  </div>

                  <div className="neu-inset p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470] block">Контакт</span>
                    <span className="text-sm font-semibold text-[#F0E2C8] mt-1 block">{userProfile.emailOrTg}</span>
                  </div>

                  <div className="neu-inset p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470] block">Роль</span>
                    <span className="text-sm font-semibold text-[#F0E2C8] mt-1 block">{userProfile.role}</span>
                  </div>

                  <div className="neu-inset p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470] block">Архетип</span>
                    <span className="text-sm font-semibold text-[#8FA382] mt-1 block">
                      {userProfile.archetype || 'Интегратор Систем и Смыслов (EthOSium Nexus)'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 neu-inset p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BA9470] block">О себе</span>
                    <p className="text-xs text-[#E2ECD2]/90 mt-1 leading-relaxed">{editForm.bio}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons: Delete Account & Retest */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate('onboarding')}
                  className="py-2.5 px-4 neu-btn rounded-xl text-xs font-semibold text-[#E2ECD2] hover:text-[#FFFDF8] flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#BA9470]">quiz</span>
                  <span>Пройти диагностику</span>
                </button>

                {/* Delete Account Trigger - deep burgundy button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="py-2.5 px-4 btn-burgundy rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                  <span>Удалить мой аккаунт</span>
                </button>
              </div>

              {/* Confirmation Modal for Account Deletion */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="neu-card rounded-2xl p-6 max-w-md w-full border border-[#782832]/40 flex flex-col gap-4 shadow-2xl bg-[#323626]">
                    <div className="flex items-center gap-3 text-[#E8A5AC]">
                      <span className="material-symbols-outlined text-2xl">warning</span>
                      <h4 className="font-semibold text-base text-[#F0E2C8]">Удаление аккаунта</h4>
                    </div>

                    <p className="text-xs text-[#E2ECD2]/90 leading-relaxed">
                      Вы действительно хотите удалить свой аккаунт ({userProfile.name}, {userProfile.emailOrTg})? Все сохраненные записи и настройки будут удалены.
                    </p>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2.5 rounded-xl neu-btn border border-white/10 text-xs font-medium text-[#E2ECD2]"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl btn-burgundy text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        {isDeleting ? 'Удаление...' : 'Подтвердить удаление'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: СООБЩЕНИЯ */}
      {activeTab === 'messages' && (
        <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#E2ECD2]/20">
          <div>
            <h3 className="font-headline font-bold text-lg text-[#FFFDF8] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FFCF96]">chat</span>
              <span>Сообщения резидентов</span>
            </h3>
            <p className="text-xs text-[#E2ECD2]/70 mt-0.5">
              Прямая защищенная связь между зарегистрированными участниками
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Contacts */}
            <div className="flex flex-col gap-1.5 neu-inset p-2.5 rounded-2xl border border-[#E2ECD2]/15 max-h-[380px] overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-[#FFCF96] px-2 py-1">
                Контакты ({otherUsers.length})
              </span>
              {otherUsers.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#E2ECD2]/60">
                  Пока нет других участников
                </div>
              ) : (
                otherUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setActiveDialogId(u.id)}
                    className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
                      activeDialogId === u.id
                        ? 'neu-pill-active border border-[#FFCF96] text-[#FFFDF8]'
                        : 'neu-btn text-[#E2ECD2]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center text-xs font-bold text-[#FFCF96] shrink-0 border border-[#FFCF96]/30">
                      {u.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate text-[#FFFDF8]">{u.name}</div>
                      <div className="text-[10px] text-[#E2ECD2]/60 truncate">{u.role}</div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Dialog View */}
            <div className="md:col-span-2 neu-inset p-3.5 rounded-2xl border border-[#E2ECD2]/20 flex flex-col h-[420px]">
              {activeUserContact ? (
                <>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E2ECD2]/15">
                    <div>
                      <h4 className="font-bold text-sm text-[#FFFDF8]">{activeUserContact.name}</h4>
                      <span className="text-[10px] text-[#FFCF96]">{activeUserContact.role}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#E2ECD2]/60">E2E</span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-2">
                    {((dialogMessages[activeDialogId]) || []).map(msg => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                            msg.sender === 'me'
                              ? 'bg-[#4a5038] text-[#FFFDF8] border border-[#FFCF96]/40'
                              : 'neu-card text-[#E2ECD2] border border-[#E2ECD2]/20'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <span className="text-[9px] text-[#FFCF96]/70 mt-1 block text-right font-mono">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendDirectMessage} className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Напишите сообщение..."
                      value={chatInputs}
                      onChange={e => setChatInputs(e.target.value)}
                      className="flex-1 neu-inset rounded-xl p-2.5 text-xs text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!chatInputs.trim()}
                      className="px-3.5 py-2.5 neu-btn rounded-xl font-bold text-xs text-[#FFFDF8] border border-[#FFCF96]/60 hover:text-[#FFCF96] active:scale-95 disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-xs text-[#E2ECD2]/60 px-4">
                  <span className="material-symbols-outlined text-3xl text-[#FFCF96]/40 mb-1">chat</span>
                  <p>Выберите контакт слева для начала диалога</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: РЕЗИДЕНТЫ */}
      {activeTab === 'friends' && (
        <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#E2ECD2]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-headline font-bold text-lg text-[#FFFDF8] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFCF96]">diversity_3</span>
                <span>Резиденты экосистемы</span>
              </h3>
              <p className="text-xs text-[#E2ECD2]/70 mt-0.5">
                Зарегистрированные участники сообщества ({registeredUsers.length})
              </p>
            </div>

            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Поиск участников..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full neu-inset rounded-xl py-2 px-3 pl-8 text-xs text-[#FFFDF8] border border-[#E2ECD2]/20 focus:outline-none placeholder:text-[#E2ECD2]/45"
              />
              <span className="material-symbols-outlined text-[16px] text-[#A9B489] absolute left-2.5 top-2.5">
                search
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Все' },
              { id: 'labforge', label: 'LabForge' },
              { id: 'semerdzhidi', label: 'Семерджиди' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFriendFilter(f.id as any)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  friendFilter === f.id
                    ? 'neu-pill-active border border-[#FFCF96] text-[#FFCF96]'
                    : 'neu-btn text-[#E2ECD2]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Users Grid */}
          {filteredUsers.length === 0 ? (
            <div className="p-8 neu-inset rounded-2xl text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl text-[#FFCF96]/30">group_off</span>
              <p className="text-sm font-semibold text-[#FFFDF8]">
                В системе пока нет других резидентов
              </p>
              <p className="text-xs text-[#E2ECD2]/60 max-w-sm">
                Новые участники появятся здесь сразу же после регистрации.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="neu-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-[#E2ECD2]/15"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl neu-inset flex items-center justify-center text-sm font-bold text-[#FFCF96] shrink-0 border border-[#FFCF96]/30">
                      {user.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-[#FFFDF8] truncate">{user.name}</h4>
                      <p className="text-xs text-[#FFCF96] truncate">{user.role}</p>
                      <span className="text-[10px] text-[#E2ECD2]/60 font-mono mt-0.5 block">
                        {user.contour.toUpperCase()} • {user.registeredAt}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E2ECD2]/10 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveDialogId(user.id);
                        setActiveTab('messages');
                      }}
                      className="flex-1 py-2 neu-btn rounded-xl font-bold text-xs text-[#FFFDF8] border border-[#FFCF96]/40 flex items-center justify-center gap-1 hover:text-[#FFCF96] active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>Написать</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: СТЕНА */}
      {activeTab === 'wall' && (
        <div className="flex flex-col gap-4">
          {/* Create Post Form */}
          <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-[#E2ECD2]/20">
            <h3 className="font-headline font-bold text-base text-[#FFFDF8] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FFCF96]">edit_note</span>
              <span>Опубликовать запись</span>
            </h3>

            <form onSubmit={handlePublishWallPost} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Поделитесь мыслями, откликом или инсайтом..."
                value={wallInput}
                onChange={e => setWallInput(e.target.value)}
                className="w-full neu-inset rounded-xl p-3 text-sm text-[#FFFDF8] border border-[#E2ECD2]/25 focus:border-[#FFCF96] focus:outline-none placeholder:text-[#E2ECD2]/45 font-medium"
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {['#EthOSium', '#Ретрит', '#LabForge', '#Семерджиди'].map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setWallTag(t)}
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${
                        wallTag === t
                          ? 'neu-pill-active border border-[#FFCF96] text-[#FFCF96]'
                          : 'neu-inset text-[#A9B489]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!wallInput.trim()}
                  className="px-5 py-2.5 neu-btn rounded-xl font-bold text-xs text-[#FFFDF8] border border-[#FFCF96]/70 hover:text-[#FFCF96] active:scale-95 disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Опубликовать</span>
                </button>
              </div>
            </form>
          </div>

          {/* Wall Feed */}
          <div className="space-y-3">
            {wallPosts.length === 0 ? (
              <div className="p-8 neu-inset rounded-2xl text-center text-xs text-[#E2ECD2]/60">
                Записей пока нет. Опубликуйте первую запись выше.
              </div>
            ) : (
              wallPosts.map(post => (
                <div
                  key={post.id}
                  className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3 border border-[#E2ECD2]/15"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#FFFDF8]">{post.author}</h4>
                      <p className="text-[11px] text-[#FFCF96]">{post.authorRole} • {post.time}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#FFCF96] neu-inset px-2.5 py-1 rounded-lg border border-[#FFCF96]/30">
                        {post.tags?.[0] || '#EthOSium'}
                      </span>
                      {/* Allow author or admin to delete post */}
                      {(authService.isAdmin(userProfile) || userProfile?.name === post.author) && (
                        <button
                          onClick={() => handleDeleteWallPost(post.id)}
                          className="text-rose-400/80 hover:text-rose-300 p-1"
                          title="Удалить запись"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-[#FFFDF8]/90 leading-relaxed whitespace-pre-wrap">
                    {post.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
