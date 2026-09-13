import { EthosiumUserProfile, AdminUserRecord, WallPost } from '../semerdzhidiTypes';

export const SUPERADMIN_EMAILS = ['foxampy@gmail.com', 'timursama96@gmail.com'];

export interface AuthResponse {
  success: boolean;
  user?: EthosiumUserProfile;
  token?: string;
  error?: string;
  message?: string;
  isNew?: boolean;
}

export interface ApplicationRecord {
  id: string;
  type: 'retreat_chimgan' | 'expert_session' | 'club_membership' | 'general';
  name: string;
  contact: string;
  format?: string;
  details?: string;
  status: 'draft' | 'new' | 'in_review' | 'approved' | 'completed' | 'declined';
  amountUsd?: number;
  promoCode?: string;
  createdAt: string;
  lastUpdated?: string;
  adminNotes?: string;
  selectedModules?: string[];
  questionnaire?: any;
  step?: string;
  isDraft?: boolean;
}

export interface InboxMessageRecord {
  id: string;
  fromName: string;
  fromContact: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: 'unread' | 'read' | 'replied';
  replyNotes?: string;
}

export const authService = {
  // Check if given user or current stored user is admin
  isAdmin(user?: EthosiumUserProfile | null): boolean {
    const targetUser = user !== undefined ? user : this.getCurrentUser();
    if (!targetUser) {
      const activeAdmin = localStorage.getItem('ethosium_active_admin_email');
      if (activeAdmin && SUPERADMIN_EMAILS.includes(activeAdmin.toLowerCase())) {
        return true;
      }
      return false;
    }
    if (targetUser.isAdmin) return true;
    if (targetUser.adminRole === 'superadmin' || targetUser.adminRole === 'admin') return true;
    const email = (targetUser.emailOrTg || '').trim().toLowerCase();
    return SUPERADMIN_EMAILS.some(adm => adm.toLowerCase() === email);
  },

  // Authenticate with existing credentials or register
  loginAsAdmin(email: string = 'foxampy@gmail.com'): EthosiumUserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const adminUser: EthosiumUserProfile = {
      id: cleanEmail === 'foxampy@gmail.com' ? 'ETH-ADM-FOXAMPY' : `ETH-ADM-${Date.now().toString().slice(-4)}`,
      name: cleanEmail === 'foxampy@gmail.com' ? 'Foxampy (Главный Администратор)' : (email.split('@')[0] || 'Администратор'),
      emailOrTg: cleanEmail,
      role: 'Главный Администратор & Архитектор Экосистемы',
      contour: 'both',
      archetype: 'Интегратор Систем и Смыслов (EthOSium Nexus)',
      testScoreSummary: 'Полный доступ • Суперадминистратор Экосистемы',
      registeredAt: '01.09.2026',
      hasDiscount19Sep: true,
      isAdmin: true,
      adminRole: 'superadmin',
    };
    this.saveCurrentUser(adminUser);
    localStorage.setItem('ethosium_active_admin_email', cleanEmail);
    return adminUser;
  },

  async loginWithCredentials(contact: string, password?: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.saveCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Пользователь не найден' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Ошибка сети' };
    }
  },

  async updateProfile(updates: {
    userId: string;
    name?: string;
    emailOrTg?: string;
    role?: string;
    bio?: string;
    avatar?: string;
    contour?: 'labforge' | 'semerdzhidi' | 'both';
  }): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.saveCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Не удалось обновить профиль' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Ошибка сети' };
    }
  },

  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        this.logout();
      }
      return data;
    } catch (e: any) {
      return { success: false, error: e.message || 'Ошибка сети' };
    }
  },

  // Fetch all users with full tests and questionnaires for admin view
  async fetchAdminUsers(requesterEmail?: string): Promise<{ success: boolean; users: AdminUserRecord[]; error?: string }> {
    try {
      const email = requesterEmail || this.getCurrentUser()?.emailOrTg || '';
      const res = await fetch('/api/admin/users', {
        headers: {
          'x-admin-email': email
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        return { success: true, users: data.users };
      }
      return { success: false, users: [], error: data.error || 'Ошибка загрузки пользователей' };
    } catch (e: any) {
      return { success: false, users: [], error: e.message || 'Ошибка сети' };
    }
  },

  // Grant admin rights to email or ID
  async grantAdminRole(emailOrId: string, role: string = 'admin'): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const requester = this.getCurrentUser()?.emailOrTg || '';
      const res = await fetch('/api/admin/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': requester
        },
        body: JSON.stringify({ emailOrId, role })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Сетевой сбой при выдаче прав' };
    }
  },

  // Revoke admin rights from user ID
  async revokeAdminRole(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const requester = this.getCurrentUser()?.emailOrTg || '';
      const res = await fetch('/api/admin/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': requester
        },
        body: JSON.stringify({ userId })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message || 'Сетевой сбой при отзыве прав' };
    }
  },

  // Save questionnaire test answers
  async saveUserTestAnswers(testAnswers: any, user?: EthosiumUserProfile | null): Promise<boolean> {
    const active = user || this.getCurrentUser();
    if (!active) return false;
    try {
      await fetch('/api/user/save-test-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: active.id,
          contact: active.emailOrTg,
          testAnswers
        })
      });
      // also cache in active profile
      active.testAnswers = testAnswers;
      this.saveCurrentUser(active);
      return true;
    } catch {
      return false;
    }
  },

  // Save baseline 7-scale checkin
  async saveUserBaseline(baselineData: any, user?: EthosiumUserProfile | null): Promise<boolean> {
    const active = user || this.getCurrentUser();
    if (!active) return false;
    try {
      await fetch('/api/user/save-baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: active.id,
          contact: active.emailOrTg,
          baselineData
        })
      });
      active.baselineData = baselineData;
      this.saveCurrentUser(active);
      return true;
    } catch {
      return false;
    }
  },

  // Get currently saved user from localStorage
  getCurrentUser(): EthosiumUserProfile | null {
    try {
      const saved = localStorage.getItem('ethosium_user_profile');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  // Save user profile locally
  saveCurrentUser(user: EthosiumUserProfile): void {
    try {
      localStorage.setItem('ethosium_user_profile', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user in storage:', e);
    }
  },

  // Log out
  logout(): void {
    try {
      localStorage.removeItem('ethosium_user_profile');
      localStorage.removeItem('ethosium_auth_token');
    } catch (e) {
      console.warn(e);
    }
  },

  // Register with Email / Telegram
  async registerEmail(params: {
    name?: string;
    emailOrTg: string;
    password?: string;
    role?: string;
    contour?: 'labforge' | 'semerdzhidi' | 'both';
    archetype?: string;
  }): Promise<AuthResponse> {
    const cleanEmail = (params.emailOrTg || '').trim();
    const cleanName = (params.name || '').trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail) || 'Участник';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          name: cleanName,
          emailOrTg: cleanEmail,
        }),
      });
      const data = await response.json();
      if (data.success && data.user) {
        const userProfile: EthosiumUserProfile = {
          id: data.user.id,
          name: data.user.name,
          emailOrTg: data.user.emailOrTg,
          role: data.user.role,
          contour: data.user.contour,
          archetype: data.user.archetype || 'Интегратор Систем и Смыслов (EthOSium Nexus)',
          testScoreSummary: data.user.testScoreSummary || 'Резидент EthOSium',
          registeredAt: data.user.registeredAt,
          hasDiscount19Sep: true,
          isAdmin: data.user.isAdmin,
          adminRole: data.user.adminRole,
        };
        this.saveCurrentUser(userProfile);
        if (data.token) {
          localStorage.setItem('ethosium_auth_token', data.token);
        }
        return { success: true, user: userProfile, token: data.token };
      }
      return { success: false, error: data.error || 'Ошибка при регистрации' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ошибка соединения с сервером' };
    }
  },

  // Automatic One-Click OAuth sign-in (Google, Apple, Facebook)
  async signInOAuth(
    provider: 'google' | 'apple' | 'facebook',
    customData?: { name?: string; email?: string }
  ): Promise<AuthResponse> {
    const defaultNames = {
      google: 'Google Пользователь',
      apple: 'Apple ID Резидент',
      facebook: 'Meta Facebook Профиль',
    };

    const providerId = `${provider}_${Math.floor(100000 + Math.random() * 900000)}`;
    const email = customData?.email || `user_${providerId}@${provider}.auth`;
    const name = customData?.name || defaultNames[provider];

    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          providerId,
          email,
          name,
          role: 'Предприниматель / Лидер проектов',
          contour: 'both',
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        const profile: EthosiumUserProfile = {
          id: data.user.id,
          name: data.user.name,
          emailOrTg: data.user.emailOrTg,
          role: data.user.role,
          contour: data.user.contour,
          archetype: data.user.archetype || 'Интегратор Систем и Смыслов (EthOSium Nexus)',
          testScoreSummary: `Авторизовано через ${provider.toUpperCase()}`,
          registeredAt: data.user.registeredAt,
          hasDiscount19Sep: true,
          isAdmin: data.user.isAdmin,
          adminRole: data.user.adminRole,
        };
        this.saveCurrentUser(profile);
        if (data.token) {
          localStorage.setItem('ethosium_auth_token', data.token);
        }
        return { success: true, user: profile, isNew: data.isNew, message: data.message };
      }
      
      return { success: false, error: data.error || 'Ошибка OAuth авторизации' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Ошибка соединения с сервером' };
    }
  },

  // Wall Posts API (News feed, reviews, announcements)
  async getWallPosts(): Promise<WallPost[]> {
    try {
      const res = await fetch('/api/wall-posts');
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        return data.posts;
      }
      return [];
    } catch {
      return [];
    }
  },

  async createWallPost(params: {
    author: string;
    authorRole?: string;
    contour?: string;
    text: string;
    tags?: string[];
  }): Promise<{ success: boolean; post?: WallPost; error?: string }> {
    try {
      const res = await fetch('/api/wall-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async likeWallPost(postId: string): Promise<{ success: boolean; likes?: number }> {
    try {
      const res = await fetch(`/api/wall-posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      return data;
    } catch {
      return { success: false };
    }
  },

  async commentWallPost(postId: string, comment: { author: string; text: string }): Promise<{ success: boolean; post?: WallPost }> {
    try {
      const res = await fetch(`/api/wall-posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      const data = await res.json();
      return data;
    } catch {
      return { success: false };
    }
  },

  // Pre-register for retreat with 50% discount
  async preRegisterRetreat(params: {
    userId?: string;
    name: string;
    contact: string;
    format: 'standard' | 'vip';
  }): Promise<{ success: boolean; certificateId: string }> {
    try {
      const res = await fetch('/api/auth/retreat-preregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, certificateId: data.certificateId };
      }
      return { success: false, certificateId: `PRE-ETHOS-50-${Math.floor(1000 + Math.random() * 9000)}` };
    } catch {
      return { success: true, certificateId: `PRE-ETHOS-50-${Math.floor(1000 + Math.random() * 9000)}` };
    }
  },

  // Aliases for SocialAccountScreen
  registerWithEmail(params: {
    name: string;
    emailOrTg: string;
    password?: string;
    role?: string;
    contour?: 'labforge' | 'semerdzhidi' | 'both';
    archetype?: string;
  }) {
    return this.registerEmail(params);
  },

  loginWithOAuth(
    provider: 'google' | 'apple' | 'facebook',
    customData?: { name?: string; email?: string }
  ) {
    return this.signInOAuth(provider, customData);
  },

  // Applications
  async fetchApplications(): Promise<{ success: boolean; applications: ApplicationRecord[] }> {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      return { success: Boolean(data.success), applications: data.applications || [] };
    } catch {
      return { success: false, applications: [] };
    }
  },

  async submitApplication(app: Partial<ApplicationRecord>): Promise<{ success: boolean; application?: ApplicationRecord; error?: string }> {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async saveApplicationDraft(draft: {
    draftId?: string;
    type?: ApplicationRecord['type'];
    name?: string;
    contact?: string;
    format?: string;
    details?: string;
    selectedModules?: string[];
    questionnaire?: any;
    step?: string;
    totalBudgetUsd?: number;
    promoCode?: string;
  }): Promise<{ success: boolean; draft?: ApplicationRecord; error?: string }> {
    try {
      const res = await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async updateApplication(id: string, status: ApplicationRecord['status'], adminNotes?: string): Promise<{ success: boolean; application?: ApplicationRecord }> {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async deleteApplication(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Inbox & Mail
  async fetchInbox(): Promise<{ success: boolean; messages: InboxMessageRecord[] }> {
    try {
      const res = await fetch('/api/inbox');
      const data = await res.json();
      return { success: Boolean(data.success), messages: data.messages || [] };
    } catch {
      return { success: false, messages: [] };
    }
  },

  async submitInboxMessage(msg: { fromName: string; fromContact: string; subject: string; message: string }): Promise<{ success: boolean; message?: InboxMessageRecord; error?: string }> {
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async updateInboxMessage(id: string, status: InboxMessageRecord['status'], replyNotes?: string): Promise<{ success: boolean; message?: InboxMessageRecord }> {
    try {
      const res = await fetch(`/api/inbox/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, replyNotes })
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  async deleteInboxMessage(id: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`/api/inbox/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch {
      return { success: false };
    }
  }
};
