import React, { useState, useEffect } from 'react';
import { ActiveScreen, AdminUserRecord } from '../../semerdzhidiTypes';
import { authService, SUPERADMIN_EMAILS, ApplicationRecord, InboxMessageRecord } from '../../services/authService';
import { MediaKitScreen } from './MediaKitScreen';

interface AdminConsoleScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const AdminConsoleScreen: React.FC<AdminConsoleScreenProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isAdmin, setIsAdmin] = useState(() => authService.isAdmin());
  
  // Admin module navigation: 6 core tabs
  const [adminTab, setAdminTab] = useState<'users' | 'applications' | 'inbox' | 'mediakit' | 'grant' | 'system'>('users');
  
  // Users state
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admins' | 'tested' | 'retreat'>('all');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  
  // Applications state
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [appFilter, setAppFilter] = useState<'all' | 'draft' | 'new' | 'in_review' | 'approved' | 'declined'>('all');
  const [appSearch, setAppSearch] = useState('');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appNoteInput, setAppNoteInput] = useState('');

  // Inbox state
  const [inboxMessages, setInboxMessages] = useState<InboxMessageRecord[]>([]);
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [editingInboxId, setEditingInboxId] = useState<string | null>(null);
  const [inboxNoteInput, setInboxNoteInput] = useState('');

  // Quick grant admin state
  const [grantEmail, setGrantEmail] = useState('');
  const [grantRole, setGrantRole] = useState<'admin' | 'superadmin' | 'moderator'>('admin');
  const [grantFeedback, setGrantFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // System management state
  const [candidateApproved, setCandidateApproved] = useState(false);

  // Direct login for admin access
  const [inputAdminEmail, setInputAdminEmail] = useState('foxampy@gmail.com');
  const [loginNotice, setLoginNotice] = useState<string | null>(null);

  // Fetch users when admin is active
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const activeEmail = currentUser?.emailOrTg || 'foxampy@gmail.com';
      const result = await authService.fetchAdminUsers(activeEmail);
      if (result.success && result.users) {
        setUsers(result.users);
      }
    } catch (e) {
      console.error('Error fetching admin users:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch applications
  const loadApplications = async () => {
    setIsLoadingApps(true);
    try {
      const result = await authService.fetchApplications();
      if (result.success && result.applications) {
        setApplications(result.applications);
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Fetch inbox messages
  const loadInbox = async () => {
    setIsLoadingInbox(true);
    try {
      const result = await authService.fetchInbox();
      if (result.success && result.messages) {
        setInboxMessages(result.messages);
      }
    } catch (e) {
      console.error('Error fetching inbox:', e);
    } finally {
      setIsLoadingInbox(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadApplications();
      loadInbox();
    }
  }, [isAdmin]);

  const handleAdminLogin = (email: string) => {
    const user = authService.loginAsAdmin(email.trim());
    setCurrentUser(user);
    setIsAdmin(true);
    setLoginNotice(`Вход выполнен успешно как ${email}`);
    setTimeout(() => setLoginNotice(null), 3000);
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;

    try {
      const res = await authService.grantAdminRole(grantEmail.trim(), grantRole);
      if (res.success) {
        setGrantFeedback({ text: res.message || 'Права администратора успешно предоставлены!', success: true });
        setGrantEmail('');
        await loadUsers();
      } else {
        setGrantFeedback({ text: res.error || 'Ошибка при выдаче прав', success: false });
      }
    } catch (err: any) {
      setGrantFeedback({ text: err.message || 'Ошибка сети', success: false });
    }
  };

  const handleRevokeAdmin = async (userId: string, userEmail: string) => {
    if (userEmail.toLowerCase() === 'foxampy@gmail.com') {
      alert('Нельзя отозвать права у главного суперадминистратора foxampy@gmail.com');
      return;
    }
    if (!confirm(`Отозвать права администратора у пользователя ${userEmail}?`)) {
      return;
    }

    try {
      const res = await authService.revokeAdminRole(userId);
      if (res.success) {
        setGrantFeedback({ text: res.message || 'Права администратора отозваны', success: true });
        await loadUsers();
      } else {
        alert(res.error || 'Не удалось отозвать права');
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка');
    }
  };

  // Application handlers
  const handleUpdateAppStatus = async (id: string, status: ApplicationRecord['status'], note?: string) => {
    const res = await authService.updateApplication(id, status, note);
    if (res.success) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status, adminNotes: note ?? a.adminNotes } : a));
      setEditingAppId(null);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Удалить эту заявку из реестра?')) return;
    const res = await authService.deleteApplication(id);
    if (res.success) {
      setApplications(prev => prev.filter(a => a.id !== id));
    }
  };

  // Inbox handlers
  const handleUpdateInboxStatus = async (id: string, status: InboxMessageRecord['status'], note?: string) => {
    const res = await authService.updateInboxMessage(id, status, note);
    if (res.success) {
      setInboxMessages(prev => prev.map(m => m.id === id ? { ...m, status, replyNotes: note ?? m.replyNotes } : m));
      setEditingInboxId(null);
    }
  };

  const handleDeleteInbox = async (id: string) => {
    if (!confirm('Удалить это обращение?')) return;
    const res = await authService.deleteInboxMessage(id);
    if (res.success) {
      setInboxMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  // Export full DB backup
  const handleExportDatabaseBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      superadmin: currentUser?.emailOrTg || 'foxampy@gmail.com',
      system: 'EthOSium Nexus & LabForge Core',
      stats: {
        totalUsers: users.length,
        totalApplications: applications.length,
        totalInboxMessages: inboxMessages.length
      },
      users,
      applications,
      inboxMessages
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethosium-full-database-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpandUser = (userId: string) => {
    setExpandedUserId(prev => (prev === userId ? null : userId));
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.emailOrTg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.archetype && user.archetype.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'admins') return user.isAdmin;
    if (filterType === 'tested') return Boolean(user.testAnswers);
    if (filterType === 'retreat') return Boolean(user.retreatPreRegistration);
    return true;
  });

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.contact.toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.details && app.details.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.promoCode && app.promoCode.toLowerCase().includes(appSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (appFilter === 'all') return true;
    return app.status === appFilter;
  });

  // Filtered inbox
  const filteredInbox = inboxMessages.filter(msg => {
    if (inboxFilter === 'all') return true;
    return msg.status === inboxFilter;
  });

  // Calculate quick stats
  const totalUsersCount = users.length;
  const adminCount = users.filter(u => u.isAdmin).length;
  const testedCount = users.filter(u => u.testAnswers).length;
  const newAppsCount = applications.filter(a => a.status === 'new').length;
  const unreadInboxCount = inboxMessages.filter(m => m.status === 'unread').length;

  // IF NOT ADMIN: Render discrete security access gate
  if (!isAdmin) {
    return (
      <div className="flex flex-col w-full gap-4 pb-20 px-4 pt-6 max-w-xl mx-auto">
        <div className="neu-card rounded-2xl p-6 text-center flex flex-col items-center gap-4 border border-[#BA9470]/30 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-[#BA9470]">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-3 py-1 rounded-full border border-[#BA9470]/30">
              Закрытый контур управления
            </span>
            <h2 className="font-headline font-bold text-xl text-[#F0E2C8] mt-3">
              Доступ ограничен
            </h2>
            <p className="text-xs text-[#A9B489] mt-2 leading-relaxed">
              Этот модуль предназначен исключительно для Директората и Суперадминистраторов Экосистемы Семерджиди и LabForge. Модуль скрыт от обычных резидентов.
            </p>
          </div>

          {loginNotice && (
            <div className="w-full neu-inset p-2.5 rounded-xl text-xs text-[#A9B489] text-center border border-[#A9B489]/30">
              {loginNotice}
            </div>
          )}

          {/* Quick login for SuperAdmins */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={() => handleAdminLogin('timursama96@gmail.com')}
                className="flex-1 py-3 px-3 rounded-xl neu-btn font-headline font-bold text-xs text-[#F0E2C8] border border-[#BA9470]/60 flex items-center justify-center gap-2 hover:border-[#BA9470] active:scale-[0.98] transition-all text-center"
              >
                <span className="material-symbols-outlined text-base text-[#BA9470]">verified_user</span>
                Войти: timursama96@gmail.com
              </button>
              <button
                onClick={() => handleAdminLogin('foxampy@gmail.com')}
                className="flex-1 py-3 px-3 rounded-xl neu-btn font-headline font-bold text-xs text-[#F0E2C8] border border-[#BA9470]/60 flex items-center justify-center gap-2 hover:border-[#BA9470] active:scale-[0.98] transition-all text-center"
              >
                <span className="material-symbols-outlined text-base text-[#BA9470]">verified_user</span>
                Войти: foxampy@gmail.com
              </button>
            </div>

            <div className="flex items-center gap-2 my-1">
              <div className="h-[1px] flex-1 bg-[#A9B489]/20" />
              <span className="text-[10px] uppercase text-[#A9B489]">или вход по email</span>
              <div className="h-[1px] flex-1 bg-[#A9B489]/20" />
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                value={inputAdminEmail}
                onChange={e => setInputAdminEmail(e.target.value)}
                placeholder="Административный email"
                className="flex-1 neu-inset rounded-xl px-3.5 py-2.5 text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
              />
              <button
                onClick={() => handleAdminLogin(inputAdminEmail)}
                className="px-4 py-2.5 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/30 active:scale-95"
              >
                Войти
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('social')}
            className="text-xs text-[#A9B489] hover:text-[#F0E2C8] underline pt-2"
          >
            ← Вернуться в личный кабинет
          </button>
        </div>
      </div>
    );
  }

  // ADMIN IS AUTHENTICATED: Full Breathing Minimalist Dashboard
  return (
    <div className="flex flex-col w-full gap-5 pb-20 px-4 pt-2 max-w-5xl mx-auto">
      {/* Superadmin Header with active account status */}
      <div className="neu-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#BA9470]/30 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BA9470] neu-inset px-2.5 py-1 rounded-full border border-[#BA9470]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BA9470] animate-pulse" />
              Суперадмин-консоль • Level 4
            </span>
            <span className="text-[11px] font-semibold text-[#A9B489]">
              {currentUser?.emailOrTg?.toLowerCase() === 'foxampy@gmail.com' ? 'Главный Архитектор' : 'Администратор'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#F0E2C8] bg-black/30 px-2 py-0.5 rounded border border-[#A9B489]/20">
              {currentUser?.emailOrTg || 'foxampy@gmail.com'}
            </span>
            <button
              onClick={() => {
                authService.logout();
                setCurrentUser(null);
                setIsAdmin(false);
              }}
              title="Выйти из админки"
              className="px-2.5 py-1 rounded-lg neu-btn text-[10px] font-semibold text-[#A9B489] hover:text-[#BA9470] active:scale-95"
            >
              Выход
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-headline font-bold text-xl sm:text-2xl text-[#F0E2C8]">
            Центр Управления Экосистемой & Базой Данных
          </h1>
          <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
            Полный контроль над участниками, анкетами резидентов, заявками на ретрит 19-20 сентября, входящими обращениями и правами доступа.
          </p>
        </div>

        {/* 5 Real-time KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <div className="neu-inset p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block font-medium">Резиденты</span>
            <span className="font-headline font-bold text-lg text-[#F0E2C8]">{totalUsersCount}</span>
            <span className="text-[9px] text-[#A9B489] block">В реестре</span>
          </div>
          <div className="neu-inset p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block font-medium">Новые заявки</span>
            <span className="font-headline font-bold text-lg text-[#BA9470]">{newAppsCount}</span>
            <span className="text-[9px] text-[#A9B489] block">Всего: {applications.length}</span>
          </div>
          <div className="neu-inset p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block font-medium">Входящие</span>
            <span className="font-headline font-bold text-lg text-[#F0E2C8]">{unreadInboxCount}</span>
            <span className="text-[9px] text-[#A9B489] block">Всего: {inboxMessages.length}</span>
          </div>
          <div className="neu-inset p-3 rounded-xl text-center">
            <span className="text-[9px] uppercase text-[#A9B489] block font-medium">Прошли тест</span>
            <span className="font-headline font-bold text-lg text-[#F0E2C8]">{testedCount}</span>
            <span className="text-[9px] text-[#A9B489] block">7 вопросов</span>
          </div>
          <div className="neu-inset p-3 rounded-xl text-center col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase text-[#A9B489] block font-medium">Админы</span>
            <span className="font-headline font-bold text-lg text-[#BA9470]">{adminCount}</span>
            <span className="text-[9px] text-[#A9B489] block">Доступ Level 4</span>
          </div>
        </div>

        {/* 5 Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#A9B489]/15">
          <button
            onClick={() => setAdminTab('users')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'users'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            Участники ({filteredUsers.length})
          </button>

          <button
            onClick={() => setAdminTab('applications')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'applications'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">assignment</span>
            Заявки ({applications.length})
            {newAppsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#BA9470]" />
            )}
          </button>

          <button
            onClick={() => setAdminTab('inbox')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'inbox'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Входящие ({inboxMessages.length})
            {unreadInboxCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#BA9470]" />
            )}
          </button>

          <button
            onClick={() => setAdminTab('mediakit')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'mediakit'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            Медиа-кит &amp; Промо (10)
          </button>

          <button
            onClick={() => setAdminTab('grant')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'grant'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            Раздача прав ({adminCount})
          </button>

          <button
            onClick={() => setAdminTab('system')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'system'
                ? 'neu-btn text-[#BA9470] border border-[#BA9470]/50 shadow-inner'
                : 'text-[#A9B489] hover:text-[#F0E2C8]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">database</span>
            База & Экспорт
          </button>
        </div>
      </div>

      {/* TAB 1: USERS & FILLED QUESTIONNAIRES/TESTS */}
      {adminTab === 'users' && (
        <div className="flex flex-col gap-3">
          {/* Search & Filter Bar */}
          <div className="neu-card rounded-2xl p-3 flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#A9B489] text-[18px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени, email, архетипу..."
                className="w-full neu-inset rounded-xl pl-9 pr-3 py-2 text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filterType === 'all'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Все ({users.length})
              </button>
              <button
                onClick={() => setFilterType('admins')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filterType === 'admins'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Администраторы ({adminCount})
              </button>
              <button
                onClick={() => setFilterType('tested')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filterType === 'tested'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                С тестами 7 вопр. ({testedCount})
              </button>
              <button
                onClick={() => setFilterType('retreat')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filterType === 'retreat'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Ретрит 19-20 сент ({users.filter(u => u.retreatPreRegistration).length})
              </button>
            </div>
          </div>

          {/* Users List */}
          {isLoadingUsers ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Загрузка реестра участников из базы данных...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Пользователи по заданным критериям не найдены
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredUsers.map(user => {
                const isExpanded = expandedUserId === user.id;
                const isSuperadmin = user.emailOrTg.toLowerCase() === 'foxampy@gmail.com';

                return (
                  <div
                    key={user.id}
                    className={`neu-card rounded-2xl p-4 transition-all border ${
                      isExpanded ? 'border-[#BA9470]/50' : 'border-[#A9B489]/15'
                    }`}
                  >
                    {/* Compact Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full neu-btn flex items-center justify-center font-headline font-bold text-sm text-[#BA9470] shrink-0">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-headline font-bold text-sm text-[#F0E2C8]">
                              {user.name}
                            </span>
                            {user.isAdmin && (
                              <span className="text-[10px] uppercase font-bold text-[#BA9470] bg-[#BA9470]/10 px-2 py-0.5 rounded border border-[#BA9470]/30">
                                {user.adminRole || 'admin'}
                              </span>
                            )}
                            {isSuperadmin && (
                              <span className="text-[10px] uppercase font-bold text-[#BA9470] bg-[#BA9470]/20 px-2 py-0.5 rounded border border-[#BA9470]/50">
                                Защищенный Суперадмин
                              </span>
                            )}
                            {user.retreatPreRegistration && (
                              <span className="text-[10px] uppercase font-semibold text-[#A9B489] bg-[#A9B489]/10 px-2 py-0.5 rounded border border-[#A9B489]/30">
                                Ретрит Чимган
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A9B489] mt-0.5">
                            <span className="font-mono">{user.emailOrTg}</span>
                            <span>•</span>
                            <span>{user.role || 'Резидент'}</span>
                            {user.archetype && (
                              <>
                                <span>•</span>
                                <span className="text-[#BA9470]">{user.archetype}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        onClick={() => toggleExpandUser(user.id)}
                        className="self-start sm:self-center px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold text-[#BA9470] flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <span>{isExpanded ? 'Свернуть' : 'Анкета & Тест'}</span>
                        <span className="material-symbols-outlined text-[16px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    {/* Expanded Detailed View */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#A9B489]/15 flex flex-col gap-4">
                        {/* Section A: 7 Questions Diagnostic Test */}
                        <div className="neu-inset p-3.5 rounded-xl flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-[#BA9470]">psychology</span>
                              <h4 className="font-headline font-bold text-xs text-[#F0E2C8]">
                                Диагностический тест (7 исследовательских вопросов)
                              </h4>
                            </div>
                            <span className="text-[10px] text-[#A9B489]">
                              {user.testAnswers?.completedAt ? `Завершено: ${user.testAnswers.completedAt}` : 'Статус: сохранён'}
                            </span>
                          </div>

                          {/* Archetype verdict */}
                          <div className="bg-[#383c2c]/70 p-2.5 rounded-lg border border-[#BA9470]/30">
                            <span className="text-[10px] uppercase font-bold text-[#BA9470] block">
                              Определённый Архетип:
                            </span>
                            <span className="font-headline font-bold text-xs text-[#F0E2C8] block mt-0.5">
                              {user.archetype || 'Интегратор Систем и Смыслов (EthOSium Nexus)'}
                            </span>
                            <p className="text-[11px] text-[#A9B489] mt-1 leading-relaxed">
                              {user.testScoreSummary || 'Гармонизация аналитической строгости LabForge и психологического самосознания Семерджиди.'}
                            </p>
                          </div>

                          {/* Answers breakdown */}
                          {user.testAnswers ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">1. Реакция на непредвиденные трудности:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">{user.testAnswers.q1 || '—'}</p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">2. Действия при барьерах:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">{user.testAnswers.q2 || '—'}</p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">3. Отказ человеку (Сложность & Причина):</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">
                                  <strong>Выбор:</strong> {user.testAnswers.q3Choice || '—'}<br />
                                  <strong>Причина:</strong> {user.testAnswers.q3Reason || '—'}
                                </p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">4. Близость & Границы:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">
                                  <strong>Потребность:</strong> {user.testAnswers.q4Choice || '—'}<br />
                                  <strong>При избытке:</strong> {user.testAnswers.q4Excess || '—'}
                                </p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">5. Отношение к иному взгляду:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">{user.testAnswers.q5 || '—'}</p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg">
                                <span className="text-[10px] text-[#BA9470] font-bold block">6. Действия при кризисе:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">{user.testAnswers.q6 || '—'}</p>
                              </div>
                              <div className="neu-card p-2.5 rounded-lg md:col-span-2">
                                <span className="text-[10px] text-[#BA9470] font-bold block">7. Баланс Силы и Любви:</span>
                                <p className="text-[#F0E2C8] text-[11px] mt-0.5">{user.testAnswers.q7 || '—'}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3 text-[11px] text-[#A9B489] italic">
                              Резидент ещё не проходил тест онлайн или авторизовался без тестирования.
                            </div>
                          )}
                        </div>

                        {/* Section B: Baseline самочувствия & Чекин состояния (7 шкал) */}
                        {user.baselineData && (
                          <div className="neu-inset p-3.5 rounded-xl flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-[#A9B489]/15 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-[#A9B489]">tune</span>
                                <h4 className="font-headline font-bold text-xs text-[#F0E2C8]">
                                  Baseline самочувствия (Чекин D-3 ретрита)
                                </h4>
                              </div>
                              <span className="text-[10px] text-[#A9B489]">
                                Сохранено: {user.baselineData.savedAt || '—'}
                              </span>
                            </div>

                            {/* 7 Sliders Summary */}
                            {user.baselineData.sliders && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#BA9470] block mb-1.5">
                                  7 Шкал Баланса (от 1 до 10):
                                </span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                                  <div className="neu-card p-2 rounded-lg">
                                    <span className="text-[9px] text-[#A9B489] block">Тревога</span>
                                    <span className="font-bold text-sm text-[#F0E2C8]">{user.baselineData.sliders.anxiety || '—'}/10</span>
                                  </div>
                                  <div className="neu-card p-2 rounded-lg">
                                    <span className="text-[9px] text-[#A9B489] block">Мышечный тонус</span>
                                    <span className="font-bold text-sm text-[#F0E2C8]">{user.baselineData.sliders.muscleTension || '—'}/10</span>
                                  </div>
                                  <div className="neu-card p-2 rounded-lg">
                                    <span className="text-[9px] text-[#A9B489] block">Контроль</span>
                                    <span className="font-bold text-sm text-[#F0E2C8]">{user.baselineData.sliders.controlNeed || '—'}/10</span>
                                  </div>
                                  <div className="neu-card p-2 rounded-lg">
                                    <span className="text-[9px] text-[#A9B489] block">Энергия</span>
                                    <span className="font-bold text-sm text-[#BA9470]">{user.baselineData.sliders.vitalEnergy || '—'}/10</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Evening Reflection */}
                            {user.baselineData.eveningReflection && (
                              <div className="bg-[#383c2c]/70 p-2.5 rounded-lg border border-[#A9B489]/20 flex flex-col gap-1.5 text-xs">
                                <span className="text-[10px] uppercase font-bold text-[#A9B489]">
                                  Вечерняя рефлексия резидента перед горами:
                                </span>
                                <p className="text-[11px] text-[#F0E2C8]">
                                  <strong className="text-[#BA9470]">Что осталось:</strong> {user.baselineData.eveningReflection.left || '—'}
                                </p>
                                <p className="text-[11px] text-[#F0E2C8]">
                                  <strong className="text-[#BA9470]">Что ушло:</strong> {user.baselineData.eveningReflection.gone || '—'}
                                </p>
                                <p className="text-[11px] text-[#F0E2C8]">
                                  <strong className="text-[#A9B489]">Что пришло:</strong> {user.baselineData.eveningReflection.came || '—'}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Section C: Бронирование Ретрита 19-20 сентября */}
                        {user.retreatPreRegistration && (
                          <div className="neu-inset p-3.5 rounded-xl flex flex-col gap-2 border border-[#BA9470]/30">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-[#BA9470]">
                                Предварительное бронирование FRACTAL 2026
                              </span>
                              <span className="text-xs font-bold text-[#F0E2C8]">
                                ${user.retreatPreRegistration.finalPriceUsd} (Скидка 50%)
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#A9B489] pt-1">
                              <div>Формат: <span className="text-[#F0E2C8] font-bold">{user.retreatPreRegistration.format.toUpperCase()}</span></div>
                              <div>Промокод: <span className="font-mono text-[#BA9470]">{user.retreatPreRegistration.promoCode}</span></div>
                              <div>Контакт: <span className="text-[#F0E2C8]">{user.retreatPreRegistration.contact}</span></div>
                              <div>Фиксация: <span className="text-[10px] text-[#A9B489]">{new Date(user.retreatPreRegistration.lockedAt).toLocaleDateString('ru-RU')}</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATIONS (РЕТРИТ 19-20 СЕНТЯБРЯ, СЕССИИ, КЛУБ) */}
      {adminTab === 'applications' && (
        <div className="flex flex-col gap-4">
          {/* Applications Header and Search */}
          <div className="neu-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#A9B489] text-[18px]">search</span>
              <input
                type="text"
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
                placeholder="Поиск по имени, контакту, промокоду..."
                className="w-full neu-inset rounded-xl pl-9 pr-3 py-2 text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
              />
            </div>

            {/* Status filter chips */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setAppFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'all'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Все ({applications.length})
              </button>
              <button
                onClick={() => setAppFilter('draft')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'draft'
                    ? 'neu-btn text-amber-300 border border-amber-500/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Черновики ({applications.filter(a => a.status === 'draft').length})
              </button>
              <button
                onClick={() => setAppFilter('new')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'new'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Новые ({applications.filter(a => a.status === 'new').length})
              </button>
              <button
                onClick={() => setAppFilter('in_review')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'in_review'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                В обработке ({applications.filter(a => a.status === 'in_review').length})
              </button>
              <button
                onClick={() => setAppFilter('approved')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'approved'
                    ? 'neu-btn text-[#A9B489] border border-[#A9B489]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Одобрены ({applications.filter(a => a.status === 'approved').length})
              </button>
              <button
                onClick={() => setAppFilter('declined')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  appFilter === 'declined'
                    ? 'neu-btn text-[#E8A5A5] border border-[#7D2833]/50'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Отклонены ({applications.filter(a => a.status === 'declined').length})
              </button>
            </div>
          </div>

          {/* Applications list */}
          {isLoadingApps ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Загрузка заявок из базы данных...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Заявок по выбранным параметрам пока нет.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredApps.map(app => {
                const isEditing = editingAppId === app.id;
                const statusStyles: Record<string, { label: string; badgeClass: string }> = {
                  draft: { label: 'Черновик (в процессе)', badgeClass: 'bg-amber-950/60 text-amber-200 border-amber-500/50' },
                  new: { label: 'Новая бронь', badgeClass: 'bg-[#BA9470]/20 text-[#BA9470] border-[#BA9470]/40' },
                  in_review: { label: 'На рассмотрении', badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-500/30' },
                  approved: { label: 'Одобрена', badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' },
                  completed: { label: 'Завершена', badgeClass: 'bg-[#A9B489]/20 text-[#A9B489] border-[#A9B489]/30' },
                  declined: { label: 'Отклонена', badgeClass: 'bg-[#4A181F] text-[#E8A5A5] border-[#7D2833]/40' },
                };

                const typeNames: Record<string, string> = {
                  retreat_chimgan: 'Ретрит в Чимгане (18-20 сент)',
                  expert_session: 'Индивидуальная сессия с экспертом',
                  club_membership: 'Резиденция в Клубе',
                  general: 'Общее обращение'
                };

                return (
                  <div
                    key={app.id}
                    className={`neu-card rounded-2xl p-4 flex flex-col gap-3 border ${
                      app.status === 'draft'
                        ? 'border-amber-500/40 bg-[#3a3928]'
                        : 'border-[#A9B489]/15'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-full neu-btn flex items-center justify-center font-bold text-xs ${
                          app.status === 'draft' ? 'text-amber-300' : 'text-[#BA9470]'
                        }`}>
                          {app.name[0]?.toUpperCase() || 'A'}
                        </span>
                        <div>
                          <span className="font-headline font-bold text-sm text-[#F0E2C8] block">
                            {app.name}
                          </span>
                          <span className="text-xs font-mono text-[#A9B489]">{app.contact}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${statusStyles[app.status]?.badgeClass || ''}`}>
                          {statusStyles[app.status]?.label || app.status}
                        </span>
                        <span className="text-[11px] text-[#A9B489]">
                          {app.lastUpdated || new Date(app.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>

                    {/* Draft Indicator if incomplete */}
                    {(app.status === 'draft' || app.isDraft) && (
                      <div className="bg-amber-950/40 border border-amber-500/40 p-2.5 rounded-xl text-xs flex items-center justify-between">
                        <span className="text-amber-200 flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px]">edit_note</span>
                          В процессе заполнения участником • Шаг: <strong className="uppercase">{app.step || 'выбор'}</strong>
                        </span>
                        <span className="text-[10px] text-[#A9B489]">Автосохранено</span>
                      </div>
                    )}

                    {/* Details row */}
                    <div className="neu-inset p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-[#A9B489] block text-[11px]">Направление:</span>
                        <span className="font-semibold text-[#F0E2C8]">{typeNames[app.type] || app.type}</span>
                        {app.format && <span className="text-[#BA9470] ml-2 font-bold">({app.format.toUpperCase()})</span>}
                      </div>

                      {app.amountUsd && (
                        <div className="text-right">
                          <span className="text-[#A9B489] block text-[11px]">Бюджет:</span>
                          <span className="font-headline font-bold text-sm text-[#BA9470]">${app.amountUsd}</span>
                          {app.promoCode && <span className="block text-[10px] font-mono text-[#A9B489]">Код: {app.promoCode}</span>}
                        </div>
                      )}
                    </div>

                    {/* Selected Modules if available */}
                    {app.selectedModules && app.selectedModules.length > 0 && (
                      <div className="bg-[#383c2c]/70 p-2.5 rounded-xl border border-[#A9B489]/20 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#BA9470] block">
                          Выбранные модули ретрита ({app.selectedModules.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {app.selectedModules.map((m: string) => (
                            <span key={m} className="px-2 py-0.5 rounded-md bg-[#2a2c20]/60 text-[10px] text-[#F0E2C8] border border-[#A9B489]/20 font-mono">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Questionnaire details if available */}
                    {app.questionnaire && (app.questionnaire.mainIntention || app.questionnaire.nutritionPreference || app.questionnaire.experienceLevel) && (
                      <div className="bg-[#383c2c]/70 p-2.5 rounded-xl border border-[#A9B489]/20 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#BA9470] block">
                          Анкета участника:
                        </span>
                        {app.questionnaire.mainIntention && (
                          <p className="text-[11px] text-[#F0E2C8]">
                            <strong className="text-[#A9B489]">Запрос:</strong> {app.questionnaire.mainIntention}
                          </p>
                        )}
                        {app.questionnaire.nutritionPreference && (
                          <p className="text-[11px] text-[#F0E2C8]">
                            <strong className="text-[#A9B489]">Питание:</strong> {app.questionnaire.nutritionPreference}
                          </p>
                        )}
                        {app.questionnaire.experienceLevel && (
                          <p className="text-[11px] text-[#F0E2C8]">
                            <strong className="text-[#A9B489]">Горы:</strong> {app.questionnaire.experienceLevel}
                          </p>
                        )}
                      </div>
                    )}

                    {app.details && (
                      <p className="text-xs text-[#F0E2C8]/90 leading-relaxed px-1">
                        {app.details}
                      </p>
                    )}

                    {/* Admin notes */}
                    {app.adminNotes && (
                      <div className="bg-[#383c2c]/70 p-2.5 rounded-xl border border-[#BA9470]/30 text-xs">
                        <span className="text-[10px] uppercase font-bold text-[#BA9470] block">Служебная заметка:</span>
                        <p className="text-[#F0E2C8] mt-0.5">{app.adminNotes}</p>
                      </div>
                    )}

                    {/* Action buttons & status update */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#A9B489]/15">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase text-[#A9B489] font-bold mr-1">Статус:</span>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'new')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-[#BA9470] border border-[#BA9470]/30 active:scale-95"
                        >
                          Новая
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'in_review')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-amber-300 border border-amber-500/30 active:scale-95"
                        >
                          В обработке
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-emerald-300 border border-emerald-500/30 active:scale-95"
                        >
                          Одобрить
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'declined')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-[#E8A5A5] border border-[#7D2833]/40 active:scale-95"
                        >
                          Отклонить
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingAppId(null);
                            } else {
                              setEditingAppId(app.id);
                              setAppNoteInput(app.adminNotes || '');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#BA9470] border border-[#BA9470]/30"
                        >
                          {isEditing ? 'Закрыть' : 'Заметка'}
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#E8A5A5] border border-[#7D2833]/40 hover:bg-[#4A181F]/50"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    {/* Inline note edit */}
                    {isEditing && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={appNoteInput}
                          onChange={e => setAppNoteInput(e.target.value)}
                          placeholder="Добавить примечание или статус оплаты..."
                          className="flex-1 neu-inset rounded-xl px-3 py-1.5 text-xs text-[#F0E2C8] focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
                        />
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, app.status, appNoteInput)}
                          className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/40"
                        >
                          Сохранить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INBOX (ОБРАЩЕНИЯ И СООБЩЕНИЯ РЕЗИДЕНТОВ) */}
      {adminTab === 'inbox' && (
        <div className="flex flex-col gap-4">
          <div className="neu-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h3 className="font-headline font-bold text-sm text-[#F0E2C8]">
                Входящие обращения резидентов
              </h3>
              <p className="text-xs text-[#A9B489]">
                Вопросы по программе, бронированиям и индивидуальным консультациям
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setInboxFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  inboxFilter === 'all'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Все ({inboxMessages.length})
              </button>
              <button
                onClick={() => setInboxFilter('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  inboxFilter === 'unread'
                    ? 'neu-btn text-[#BA9470] border border-[#BA9470]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Непрочитанные ({inboxMessages.filter(m => m.status === 'unread').length})
              </button>
              <button
                onClick={() => setInboxFilter('read')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  inboxFilter === 'read'
                    ? 'neu-btn text-[#A9B489] border border-[#A9B489]/40'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                Прочитанные ({inboxMessages.filter(m => m.status === 'read').length})
              </button>
              <button
                onClick={() => setInboxFilter('replied')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  inboxFilter === 'replied'
                    ? 'neu-btn text-emerald-300 border border-emerald-500/30'
                    : 'neu-inset text-[#A9B489]'
                }`}
              >
                С ответом ({inboxMessages.filter(m => m.status === 'replied').length})
              </button>
            </div>
          </div>

          {isLoadingInbox ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Загрузка сообщений из входящей почты...
            </div>
          ) : filteredInbox.length === 0 ? (
            <div className="neu-card rounded-2xl p-8 text-center text-xs text-[#A9B489]">
              Нет обращений по выбранному фильтру.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredInbox.map(msg => {
                const isEditing = editingInboxId === msg.id;
                return (
                  <div
                    key={msg.id}
                    className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#A9B489]/15"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-[#BA9470]">
                          {msg.status === 'unread' ? 'mark_email_unread' : 'mail'}
                        </span>
                        <div>
                          <span className="font-headline font-bold text-sm text-[#F0E2C8]">
                            {msg.subject}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-[#A9B489]">
                            <span>От: <strong className="text-[#F0E2C8]">{msg.fromName}</strong></span>
                            <span>•</span>
                            <span className="font-mono">{msg.fromContact}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#A9B489]">
                          {new Date(msg.receivedAt).toLocaleDateString('ru-RU')}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                          msg.status === 'unread'
                            ? 'bg-[#BA9470]/20 text-[#BA9470] border-[#BA9470]/40'
                            : msg.status === 'replied'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                            : 'bg-black/30 text-[#A9B489] border-[#A9B489]/20'
                        }`}>
                          {msg.status === 'unread' ? 'Новое' : msg.status === 'replied' ? 'Отвечено' : 'Прочитано'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#F0E2C8]/90 leading-relaxed bg-[#383c2c]/50 p-3 rounded-xl border border-[#A9B489]/15">
                      {msg.message}
                    </p>

                    {msg.replyNotes && (
                      <div className="neu-inset p-2.5 rounded-xl text-xs border border-[#BA9470]/30">
                        <span className="text-[10px] uppercase font-bold text-[#BA9470] block">Ответ / Заметка куратора:</span>
                        <p className="text-[#F0E2C8] mt-0.5">{msg.replyNotes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#A9B489]/15">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase text-[#A9B489] font-bold">Статус:</span>
                        <button
                          onClick={() => handleUpdateInboxStatus(msg.id, 'read')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-[#A9B489] border border-[#A9B489]/30"
                        >
                          Прочитано
                        </button>
                        <button
                          onClick={() => handleUpdateInboxStatus(msg.id, 'replied')}
                          className="px-2 py-1 rounded-lg neu-btn text-[10px] font-semibold text-emerald-300 border border-emerald-500/30"
                        >
                          Отвечено
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingInboxId(null);
                            } else {
                              setEditingInboxId(msg.id);
                              setInboxNoteInput(msg.replyNotes || '');
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#BA9470] border border-[#BA9470]/30"
                        >
                          {isEditing ? 'Закрыть' : 'Заметка'}
                        </button>
                        <button
                          onClick={() => handleDeleteInbox(msg.id)}
                          className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-semibold text-[#E8A5A5] border border-[#7D2833]/40 hover:bg-[#4A181F]/50"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={inboxNoteInput}
                          onChange={e => setInboxNoteInput(e.target.value)}
                          placeholder="Текст ответа или заметка для куратора..."
                          className="flex-1 neu-inset rounded-xl px-3 py-1.5 text-xs text-[#F0E2C8] focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
                        />
                        <button
                          onClick={() => handleUpdateInboxStatus(msg.id, 'replied', inboxNoteInput)}
                          className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/40"
                        >
                          Сохранить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: ECOSYSTEM PROMO & MEDIA KIT */}
      {adminTab === 'mediakit' && (
        <div className="flex flex-col gap-4">
          <MediaKitScreen onNavigate={onNavigate} />
        </div>
      )}

      {/* TAB 4: GRANT & MANAGE ADMIN RIGHTS */}
      {adminTab === 'grant' && (
        <div className="flex flex-col gap-4">
          {/* Grant Form */}
          <div className="neu-card rounded-2xl p-5 flex flex-col gap-4 border border-[#BA9470]/30 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#BA9470]">person_add</span>
              <div>
                <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                  Выдать права администратора
                </h3>
                <p className="text-xs text-[#A9B489]">
                  Предоставление доступа к закрытому контуру управления новому или существующему пользователю
                </p>
              </div>
            </div>

            {grantFeedback && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  grantFeedback.success
                    ? 'neu-inset text-[#A9B489] border border-[#A9B489]/40'
                    : 'neu-inset text-[#E8A5A5] border border-[#7D2833]/40'
                }`}
              >
                {grantFeedback.text}
              </div>
            )}

            <form onSubmit={handleGrantAdmin} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full sm:flex-1">
                <label className="block text-[11px] font-bold uppercase text-[#A9B489] mb-1">
                  Email или Telegram резидента
                </label>
                <input
                  type="text"
                  required
                  value={grantEmail}
                  onChange={e => setGrantEmail(e.target.value)}
                  placeholder="partner@example.com или @username"
                  className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs text-[#F0E2C8] placeholder-[#A9B489]/50 focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
                />
              </div>

              <div className="w-full sm:w-52">
                <label className="block text-[11px] font-bold uppercase text-[#A9B489] mb-1">
                  Уровень привилегий
                </label>
                <select
                  value={grantRole}
                  onChange={e => setGrantRole(e.target.value as any)}
                  className="w-full neu-inset rounded-xl px-3.5 py-2.5 text-xs text-[#F0E2C8] bg-[#383c2c] focus:outline-none focus:ring-1 focus:ring-[#BA9470]"
                >
                  <option value="admin">Администратор (Управление)</option>
                  <option value="superadmin">Суперадминистратор (Level 4)</option>
                  <option value="moderator">Модератор (Просмотр анкет)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl neu-btn font-headline font-bold text-xs text-[#F0E2C8] border border-[#BA9470]/60 hover:border-[#BA9470] active:scale-95 transition-all"
              >
                Выдать права
              </button>
            </form>
          </div>

          {/* Current Administrators List */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-bold text-sm text-[#F0E2C8] flex items-center justify-between">
              <span>Действующие администраторы ({adminCount})</span>
              <span className="text-[10px] text-[#BA9470] font-normal">foxampy@gmail.com — защищенный суперадмин</span>
            </h3>

            <div className="space-y-2">
              {users.filter(u => u.isAdmin).map(admin => {
                const isFox = admin.emailOrTg.toLowerCase() === 'foxampy@gmail.com';
                return (
                  <div
                    key={admin.id}
                    className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full neu-btn flex items-center justify-center font-bold text-xs text-[#BA9470]">
                        {admin.name ? admin.name[0].toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#F0E2C8]">{admin.name}</span>
                          <span className="text-[9px] uppercase font-bold text-[#BA9470] bg-[#BA9470]/10 px-2 py-0.5 rounded border border-[#BA9470]/30">
                            {admin.adminRole || 'admin'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#A9B489] block">{admin.emailOrTg}</span>
                      </div>
                    </div>

                    <div>
                      {isFox ? (
                        <span className="text-[10px] font-bold text-[#BA9470] italic">
                          Главный Суперадмин
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRevokeAdmin(admin.id, admin.emailOrTg)}
                          className="px-3 py-1 rounded-lg neu-btn text-[10px] font-semibold text-[#E8A5A5] border border-[#7D2833]/40 hover:bg-[#4A181F]/40 active:scale-95"
                        >
                          Отозвать
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM & DATABASE EXPORT */}
      {adminTab === 'system' && (
        <div className="flex flex-col gap-4">
          {/* Database Backup Card */}
          <div className="neu-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#BA9470]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#BA9470]">cloud_download</span>
                <h3 className="font-headline font-bold text-base text-[#F0E2C8]">
                  Экспорт базы данных (JSON-резервная копия)
                </h3>
              </div>
              <p className="text-xs text-[#A9B489] mt-1 leading-relaxed">
                Выгрузка всех {users.length} профилей резидентов, {applications.length} заявок на ретрит и {inboxMessages.length} сообщений в один защищенный файл.
              </p>
            </div>

            <button
              onClick={handleExportDatabaseBackup}
              className="w-full sm:w-auto px-5 py-3 rounded-xl neu-btn font-headline font-bold text-xs text-[#BA9470] border border-[#BA9470]/50 flex items-center justify-center gap-2 hover:text-[#F0E2C8] active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Скачать JSON бэкап</span>
            </button>
          </div>

          {/* Candidate Verification Card */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3 border border-[#A9B489]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#BA9470]">verified_user</span>
                <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Верификация нового специалиста</h3>
              </div>
              <span className="text-[10px] font-bold text-[#A9B489]">Анкета #51</span>
            </div>

            <div className="neu-inset p-3 rounded-xl flex items-start gap-3">
              <div className="w-10 h-10 rounded-full neu-btn flex items-center justify-center font-headline font-bold text-xs text-[#BA9470] shrink-0">
                СВ
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <span className="font-bold text-[#F0E2C8] block">Д-р Саид Валиев</span>
                <span className="text-[#A9B489] text-[11px] block">Психоаналитик, 14 лет стажа, ТашПМИ + EAP</span>
                <p className="text-[#F0E2C8]/80 text-[11px] mt-1 leading-snug">
                  Диплом верифицирован. Прошёл супервизорский разбор у Екатерины Семерджиди 2 мая.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#A9B489]">Статус: Ожидает подписи директора</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCandidateApproved(true)}
                  className="px-3.5 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#BA9470] border border-[#BA9470]/40 active:scale-95"
                >
                  {candidateApproved ? 'Аккредитован ✓' : 'Одобрить в каталог'}
                </button>
              </div>
            </div>
          </div>

          {/* Tashkent Residence Rooms Status */}
          <div className="neu-card rounded-2xl p-4 flex flex-col gap-3">
            <h3 className="font-headline font-semibold text-sm text-[#F0E2C8]">Загрузка залов резиденции в Ташкенте</h3>
            <div className="space-y-2 text-xs">
              <div className="neu-inset p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Большой зал «Спираль» (до 40 чел)</span>
                  <span className="text-[10px] text-[#A9B489]">18:00 – 21:00 • Телесный практикум</span>
                </div>
                <span className="text-[10px] font-bold text-[#BA9470] neu-btn px-2 py-1 rounded">Занято</span>
              </div>

              <div className="neu-inset p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Кабинет Екатерины Семерджиди</span>
                  <span className="text-[10px] text-[#A9B489]">14:00 – 17:00 • Индивидуальные сессии</span>
                </div>
                <span className="text-[10px] font-bold text-[#BA9470] neu-btn px-2 py-1 rounded">Приём</span>
              </div>

              <div className="neu-inset p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#F0E2C8] block">Чайная комната созерцания</span>
                  <span className="text-[10px] text-[#A9B489]">Свободно для резидентов клуба</span>
                </div>
                <span className="text-[10px] font-bold text-[#A9B489] neu-btn px-2 py-1 rounded">Свободно</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
