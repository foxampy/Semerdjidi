import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserAccount {
  id: string;
  name: string;
  emailOrTg: string;
  role: string;
  contour: 'labforge' | 'semerdzhidi' | 'both';
  provider?: 'email' | 'google' | 'apple' | 'facebook';
  providerId?: string;
  avatar?: string;
  registeredAt: string;
  hasDiscount19Sep: boolean;
  isAdmin?: boolean;
  adminRole?: 'superadmin' | 'admin' | 'moderator';
  passwordHash?: string;
  archetype?: string;
  testScoreSummary?: string;
  testAnswers?: any;
  baselineData?: any;
  retreatPreRegistration?: {
    format: 'standard' | 'vip';
    contact: string;
    finalPriceUsd: number;
    promoCode: string;
    lockedAt: string;
  } | null;
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

export interface WallPostRecord {
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

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WALL_FILE = path.join(DATA_DIR, 'wall_posts.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const INBOX_FILE = path.join(DATA_DIR, 'inbox.json');

export const SUPERADMIN_EMAILS = ['foxampy@gmail.com', 'timursama96@gmail.com'];

const SEED_USERS: UserAccount[] = [
  {
    id: 'ETH-ADM-FOXAMPY',
    name: 'Foxampy (Главный Администратор)',
    emailOrTg: 'foxampy@gmail.com',
    role: 'Главный Администратор & Архитектор Экосистемы',
    contour: 'both',
    provider: 'email',
    registeredAt: '01.09.2026',
    hasDiscount19Sep: true,
    isAdmin: true,
    adminRole: 'superadmin',
    archetype: 'Интегратор Систем и Смыслов (EthOSium Nexus)',
    testScoreSummary: 'Суперадминистратор • Полный доступ ко всем контурам и базам данных',
  },
  {
    id: 'ETH-ADM-TIMUR',
    name: 'Тимур (Суперадминистратор)',
    emailOrTg: 'timursama96@gmail.com',
    role: 'Суперадминистратор & Архитектор Экосистемы',
    contour: 'both',
    provider: 'email',
    registeredAt: '01.09.2026',
    hasDiscount19Sep: true,
    isAdmin: true,
    adminRole: 'superadmin',
    archetype: 'Интегратор Систем и Смыслов (EthOSium Nexus)',
    testScoreSummary: 'Суперадминистратор • Полный доступ ко всем контурам и базам данных',
  },
  {
    id: 'ETH-ID-SEMERDZHIDI',
    name: 'Екатерина Семерджиди',
    emailOrTg: 'semerdzhidi@ethosium.com',
    role: 'Супервизор • Доктор психологических наук',
    contour: 'semerdzhidi',
    provider: 'email',
    registeredAt: '01.09.2026',
    hasDiscount19Sep: true,
    isAdmin: true,
    adminRole: 'admin',
    archetype: 'Архитектор Глубинных Смыслов',
    testScoreSummary: 'Научный руководитель программ и супервизии',
  }
];

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'APP-CHIMGAN-001',
    type: 'retreat_chimgan',
    name: 'Михаил Токарев',
    contact: '@tokarev_dev',
    format: 'standard',
    details: '24ч ретрит перезагрузки 19-20 сентября. Предоплата 50% ($93.75) со скидкой.',
    status: 'approved',
    amountUsd: 187.5,
    promoCode: 'PRE-ETHOS-50',
    createdAt: '05.09.2026, 14:30',
    adminNotes: 'Трансфер из Ташкента подтвержден.'
  },
  {
    id: 'APP-CHIMGAN-002',
    type: 'retreat_chimgan',
    name: 'Анна Захарова',
    contact: 'anna.zakharova@gmail.com',
    format: 'vip',
    details: 'VIP пакет с личной супервизией Екатерины Семерджиди.',
    status: 'new',
    amountUsd: 495,
    promoCode: 'VIP-CHIMGAN',
    createdAt: '06.09.2026, 18:15',
    adminNotes: 'Ожидает созвона с куратором.'
  },
  {
    id: 'APP-EXP-003',
    type: 'expert_session',
    name: 'Алишер Каримов',
    contact: '+998901234567',
    format: 'online',
    details: 'Запрос на стратегическую сессию по психологической устойчивости команды.',
    status: 'in_review',
    amountUsd: 150,
    createdAt: '06.09.2026, 20:00',
  }
];

const INITIAL_INBOX: InboxMessageRecord[] = [
  {
    id: 'MSG-001',
    fromName: 'Алишер Каримов',
    fromContact: '+998901234567',
    subject: 'Вопрос по трансферу на ретрит 19 сентября',
    message: 'Здравствуйте! Подскажите, откуда именно в Ташкенте стартует утренний трансфер 19 сентября и можно ли присоединиться на своем авто в Чимган?',
    receivedAt: 'Сегодня, 16:45',
    status: 'unread'
  },
  {
    id: 'MSG-002',
    fromName: 'Дарья П.',
    fromContact: 'daria.p@outlook.com',
    subject: 'Корпоративный выезд для топ-менеджмента',
    message: 'Добрый день, интересует закрытый формат на 12 человек после 20 сентября по методике Семерджиди.',
    receivedAt: 'Вчера, 12:10',
    status: 'read',
    replyNotes: 'Направлена презентация корпоративного контура.'
  }
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    atomicWriteJsonSync(USERS_FILE, SEED_USERS);
  }
  if (!fs.existsSync(WALL_FILE)) {
    atomicWriteJsonSync(WALL_FILE, []);
  }
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    atomicWriteJsonSync(APPLICATIONS_FILE, INITIAL_APPLICATIONS);
  }
  if (!fs.existsSync(INBOX_FILE)) {
    atomicWriteJsonSync(INBOX_FILE, INITIAL_INBOX);
  }
}

/**
 * Atomic write helper using temp file and rename to prevent corrupted writes
 * during concurrent multi-user access
 */
function atomicWriteJsonSync(filePath: string, data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const dir = path.dirname(filePath);
    const tempFile = path.join(dir, `.tmp.${path.basename(filePath)}.${Date.now()}.${crypto.randomBytes(3).toString('hex')}`);
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, filePath);
  } catch (err) {
    console.error(`Error in atomic write for ${filePath}:`, err);
    // Fallback direct write
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

export function sanitizeUser(u: UserAccount): Omit<UserAccount, 'passwordHash'> {
  const { passwordHash, ...safe } = u;
  return safe;
}

export function readUsers(): UserAccount[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) {
      writeUsers(SEED_USERS);
      return SEED_USERS;
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    let users: UserAccount[] = JSON.parse(raw || '[]');
    if (!Array.isArray(users)) users = [];

    // Ensure all superadmins are always present and properly elevated
    let modified = false;
    for (const superEmail of SUPERADMIN_EMAILS) {
      const existing = users.find(u => u.emailOrTg.toLowerCase() === superEmail.toLowerCase());
      if (existing) {
        if (!existing.isAdmin || existing.adminRole !== 'superadmin') {
          existing.isAdmin = true;
          existing.adminRole = 'superadmin';
          modified = true;
        }
      } else {
        const seed = SEED_USERS.find(s => s.emailOrTg.toLowerCase() === superEmail.toLowerCase());
        if (seed) {
          users.unshift(seed);
          modified = true;
        }
      }
    }

    if (modified) {
      writeUsers(users);
    }

    return users;
  } catch (err) {
    console.error('Error reading users DB:', err);
    return SEED_USERS;
  }
}

export function writeUsers(users: UserAccount[]) {
  try {
    atomicWriteJsonSync(USERS_FILE, users);
  } catch (err) {
    console.error('Error writing users DB:', err);
  }
}

export function findUserById(id: string): UserAccount | undefined {
  const users = readUsers();
  return users.find(u => u.id === id);
}

export function findUserByContact(contact: string): UserAccount | undefined {
  const users = readUsers();
  const normalized = contact.trim().toLowerCase();
  return users.find(u => u.emailOrTg.trim().toLowerCase() === normalized);
}

export function findUserByOAuth(provider: string, providerId: string, email?: string): UserAccount | undefined {
  const users = readUsers();
  if (providerId) {
    const matchId = users.find(u => u.provider === provider && u.providerId === providerId);
    if (matchId) return matchId;
  }
  if (email) {
    const normEmail = email.trim().toLowerCase();
    const matchEmail = users.find(u => u.emailOrTg.trim().toLowerCase() === normEmail);
    if (matchEmail) return matchEmail;
  }
  return undefined;
}

export function createOrUpdateOAuthUser(params: {
  provider: 'google' | 'apple' | 'facebook';
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  contour?: 'labforge' | 'semerdzhidi' | 'both';
}): { user: UserAccount; isNew: boolean } {
  const users = readUsers();
  const existing = findUserByOAuth(params.provider, params.providerId, params.email);

  if (existing) {
    if (params.name && (!existing.name || existing.name === 'Пользователь')) {
      existing.name = params.name;
    }
    if (params.avatar) existing.avatar = params.avatar;
    existing.hasDiscount19Sep = true;

    if (SUPERADMIN_EMAILS.some(e => e.toLowerCase() === (existing.emailOrTg || '').toLowerCase())) {
      existing.isAdmin = true;
      existing.adminRole = 'superadmin';
    }

    writeUsers(users);
    return { user: existing, isNew: false };
  }

  const isSuper = SUPERADMIN_EMAILS.some(e => e.toLowerCase() === (params.email || '').toLowerCase());

  const newUser: UserAccount = {
    id: `ETH-${params.provider.toUpperCase().slice(0, 3)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    name: params.name || `${params.provider === 'google' ? 'Google' : params.provider === 'apple' ? 'Apple' : 'Facebook'} Пользователь`,
    emailOrTg: params.email || `${params.providerId}@${params.provider}.oauth`,
    role: params.role || 'Предприниматель / Лидер проектов',
    contour: params.contour || 'both',
    provider: params.provider,
    providerId: params.providerId,
    avatar: params.avatar || '',
    archetype: 'Интегратор Систем и Смыслов (EthOSium Nexus)',
    testScoreSummary: 'OAuth Авторизация • Полный доступ',
    registeredAt: new Date().toLocaleDateString('ru-RU'),
    hasDiscount19Sep: true,
    isAdmin: isSuper,
    adminRole: isSuper ? 'superadmin' : undefined,
    retreatPreRegistration: null,
  };

  users.push(newUser);
  writeUsers(users);
  return { user: newUser, isNew: true };
}

export function registerEmailUser(params: {
  name?: string;
  emailOrTg: string;
  password?: string;
  role?: string;
  contour?: 'labforge' | 'semerdzhidi' | 'both';
  archetype?: string;
  testAnswers?: any;
}): { success: boolean; user?: UserAccount; error?: string } {
  if (!params.emailOrTg || !params.emailOrTg.trim()) {
    return { success: false, error: 'Укажите email или Telegram' };
  }

  const rawContact = params.emailOrTg.trim();
  let userName = params.name ? params.name.trim() : '';
  if (!userName) {
    if (rawContact.includes('@')) {
      const prefix = rawContact.split('@')[0];
      userName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    } else {
      userName = rawContact;
    }
  }

  const existing = findUserByContact(rawContact);
  if (existing) {
    // If user has a passwordHash set
    if (existing.passwordHash) {
      if (!params.password) {
        return { success: false, error: 'Для входа в данный аккаунт требуется пароль' };
      }
      const hash = crypto.createHash('sha256').update(params.password).digest('hex');
      if (hash !== existing.passwordHash) {
        return { success: false, error: 'Неверный пароль. Проверьте введенные данные' };
      }
    } else if (params.password) {
      // User did not have a password yet; set it now
      existing.passwordHash = crypto.createHash('sha256').update(params.password).digest('hex');
      const users = readUsers();
      const u = users.find(x => x.id === existing.id);
      if (u) {
        u.passwordHash = existing.passwordHash;
        writeUsers(users);
      }
    }
    // Return existing account
    return { success: true, user: existing };
  }

  const isSuper = SUPERADMIN_EMAILS.some(e => e.toLowerCase() === rawContact.toLowerCase());
  const users = readUsers();
  const newUser: UserAccount = {
    id: `ETH-ID-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    name: userName,
    emailOrTg: rawContact,
    role: params.role || 'Предприниматель / Лидер проектов',
    contour: params.contour || 'both',
    provider: 'email',
    passwordHash: params.password ? crypto.createHash('sha256').update(params.password).digest('hex') : undefined,
    archetype: params.archetype || 'Интегратор Систем и Смыслов (EthOSium Nexus)',
    testScoreSummary: params.archetype ? `Диагностика пройдена • Архетип: ${params.archetype}` : 'Регистрация резидента',
    registeredAt: new Date().toLocaleDateString('ru-RU'),
    hasDiscount19Sep: true,
    isAdmin: isSuper,
    adminRole: isSuper ? 'superadmin' : undefined,
    testAnswers: params.testAnswers || null,
    retreatPreRegistration: null,
  };

  users.push(newUser);
  writeUsers(users);
  return { success: true, user: newUser };
}

export function updateUserProfile(userId: string, updates: {
  name?: string;
  emailOrTg?: string;
  role?: string;
  bio?: string;
  avatar?: string;
  contour?: 'labforge' | 'semerdzhidi' | 'both';
}): { success: boolean; user?: UserAccount; error?: string } {
  const users = readUsers();
  const user = users.find(u => u.id === userId || u.emailOrTg.toLowerCase() === userId.toLowerCase());
  if (!user) {
    return { success: false, error: 'Пользователь не найден' };
  }

  if (updates.name && updates.name.trim()) user.name = updates.name.trim();
  if (updates.role) user.role = updates.role.trim();
  if (updates.avatar !== undefined) user.avatar = updates.avatar;
  if (updates.contour) user.contour = updates.contour;
  if (updates.emailOrTg && updates.emailOrTg.trim()) {
    const norm = updates.emailOrTg.trim().toLowerCase();
    const existing = users.find(u => u.id !== user.id && u.emailOrTg.toLowerCase() === norm);
    if (existing) {
      return { success: false, error: 'Email или Telegram уже занят другим пользователем' };
    }
    user.emailOrTg = updates.emailOrTg.trim();
  }

  if (SUPERADMIN_EMAILS.some(e => e.toLowerCase() === user.emailOrTg.toLowerCase())) {
    user.isAdmin = true;
    user.adminRole = 'superadmin';
  }

  writeUsers(users);
  return { success: true, user };
}

export function deleteUserAccount(userId: string): { success: boolean; error?: string } {
  let users = readUsers();
  const target = users.find(u => u.id === userId || u.emailOrTg.toLowerCase() === userId.toLowerCase());
  if (!target) {
    return { success: false, error: 'Пользователь не найден' };
  }

  if (SUPERADMIN_EMAILS.some(e => e.toLowerCase() === target.emailOrTg.toLowerCase())) {
    return { success: false, error: 'Запрещено удалять учетную запись главного суперадминистратора' };
  }

  users = users.filter(u => u.id !== target.id);
  writeUsers(users);
  return { success: true };
}

export function saveRetreatPreRegistration(params: {
  userId?: string;
  contact: string;
  name: string;
  format: 'standard' | 'vip';
}): { success: boolean; certificateId: string } {
  const users = readUsers();
  const certId = `PRE-ETHOS-50-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  // Standard 24h: $375 full price, 50% discount until 10 Sep = $187.50 (prepayment $93.75). VIP & Supervision = $495.
  const price = params.format === 'vip' ? 495 : 187.5;

  let targetUser = params.userId ? users.find(u => u.id === params.userId) : undefined;
  if (!targetUser && params.contact) {
    targetUser = users.find(u => u.emailOrTg.toLowerCase() === params.contact.toLowerCase());
  }

  if (targetUser) {
    targetUser.retreatPreRegistration = {
      format: params.format,
      contact: params.contact,
      finalPriceUsd: price,
      promoCode: 'PRE-ETHOS-50',
      lockedAt: new Date().toISOString(),
    };
    writeUsers(users);
  }

  // Also record in applications for the Admin Console
  try {
    saveApplication({
      type: 'retreat_chimgan',
      name: params.name || (targetUser ? targetUser.name : 'Участник ретрита'),
      contact: params.contact,
      format: params.format,
      details: `Предрегистрация со скидкой 50% на ретрит 19-20 сентября. Сертификат: ${certId}. ${params.format === 'vip' ? 'VIP пакет с супервизией' : 'Стандарт 24ч всё включено'}.`,
      status: 'new',
      amountUsd: price,
      promoCode: 'PRE-ETHOS-50'
    });
  } catch (appErr) {
    console.error('Error auto-syncing application for retreat prereg:', appErr);
  }

  return { success: true, certificateId: certId };
}

export function saveUserTestAnswers(userIdOrContact: string, testAnswers: any): boolean {
  const users = readUsers();
  const normalized = userIdOrContact.trim().toLowerCase();
  const user = users.find(u => u.id === userIdOrContact || u.emailOrTg.toLowerCase() === normalized);
  if (!user) return false;

  user.testAnswers = {
    ...testAnswers,
    completedAt: new Date().toLocaleString('ru-RU')
  };
  writeUsers(users);
  return true;
}

export function saveUserBaseline(userIdOrContact: string, baselineData: any): boolean {
  const users = readUsers();
  const normalized = userIdOrContact.trim().toLowerCase();
  const user = users.find(u => u.id === userIdOrContact || u.emailOrTg.toLowerCase() === normalized);
  if (!user) return false;

  user.baselineData = {
    ...baselineData,
    savedAt: new Date().toLocaleString('ru-RU')
  };
  writeUsers(users);
  return true;
}

export function grantAdminRole(emailOrId: string, role: 'superadmin' | 'admin' | 'moderator' = 'admin'): { success: boolean; user?: UserAccount; message?: string } {
  const users = readUsers();
  const target = emailOrId.trim().toLowerCase();
  let user = users.find(u => u.id === emailOrId || u.emailOrTg.toLowerCase() === target);

  if (!user) {
    user = {
      id: `ETH-ADM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      name: emailOrId.split('@')[0] || 'Администратор',
      emailOrTg: emailOrId.trim(),
      role: 'Администратор Экосистемы',
      contour: 'both',
      provider: 'email',
      registeredAt: new Date().toLocaleDateString('ru-RU'),
      hasDiscount19Sep: true,
      isAdmin: true,
      adminRole: role,
      archetype: 'Администратор Системы',
      testScoreSummary: 'Права администратора выданы'
    };
    users.push(user);
    writeUsers(users);
    return { success: true, user, message: `Пользователю ${emailOrId} выданы права администратора (${role})` };
  }

  user.isAdmin = true;
  user.adminRole = role;
  writeUsers(users);
  return { success: true, user, message: `Права администратора (${role}) успешно предоставлены ${user.name}` };
}

export function revokeAdminRole(userId: string): { success: boolean; message?: string; error?: string } {
  const users = readUsers();
  const user = users.find(u => u.id === userId || u.emailOrTg.toLowerCase() === userId.toLowerCase());

  if (!user) {
    return { success: false, error: 'Пользователь не найден' };
  }

  if (SUPERADMIN_EMAILS.some(e => e.toLowerCase() === user.emailOrTg.toLowerCase())) {
    return { success: false, error: 'Нельзя отозвать права у главного суперадминистратора' };
  }

  user.isAdmin = false;
  user.adminRole = undefined;
  writeUsers(users);
  return { success: true, message: `Права администратора у ${user.name} успешно отозваны` };
}

export const INITIAL_WALL_POSTS: WallPostRecord[] = [
  {
    id: 'post-timur-expedition-1',
    author: 'Тимур Садыков',
    authorRole: 'Основатель & Исследователь экосистемы',
    contour: 'both',
    time: 'Сегодня, 11:20',
    text: 'Провел экспедицию и полевые исследования программы ретрита (19-20 сентября в горах Чимгана). Опробовал на себе абсолютно все: высокогорную адаптацию, термальный контраст, дыхательные циклы регуляции вегетативной нервной системы и погружение в тишину. Очень понравилось и мощно! Ощутил прилив сил, снятие глубокого хронического напряжения и кристальную ясность ума. 24-часовая программа «все включено» полностью выверена — ждем резидентов!',
    tags: ['#Экспедиция', '#Ретрит19Сентября', '#Чимган', '#Нейробаланс', '#Здоровье'],
    likes: 58,
    comments: [
      { author: 'Екатерина В.', text: 'Тимур, отличные новости! Жду выезда 19-го.' },
      { author: 'Алишер К.', text: '24 часа интенсивного погружения — идеальный формат для предпринимателей.' }
    ]
  },
  {
    id: 'post-team-announcement-2',
    author: 'Команда EthOSium',
    authorRole: 'Экосистема здоровья и сознания',
    contour: 'both',
    time: 'Вчера, 18:40',
    text: 'Открыта регистрация на 24-часовой ретрит перезагрузки 19-20 сентября в горах Чимгана! Формат: 24 часа «все включено» (трансфер из Ташкента, проживание в горном эко-комплексе, восстановительное 3-разовое питание, практики, баня и чан, супервизия). Полная стоимость: $375. До 10 сентября действует скидка 50% при фиксации брони предоплатой 50% ($93.75). Доступно всего 13 мест!',
    tags: ['#Команда', '#Ретрит', '#Скидка50', '#24Часа', '#Чимган'],
    likes: 84,
    comments: [
      { author: 'Михаил Т.', text: 'Успел зафиксировать 50% скидку, сертификат в кабинете!' }
    ]
  },
  {
    id: 'post-neuro-specialist-3',
    author: 'Екатерина С.',
    authorRole: 'Ведущий специалист психологической интеграции',
    contour: 'both',
    time: '2 дня назад',
    text: 'Почему 24 часа в горах эффективнее недели стандартного пляжного отпуска? Исследования показывают: смена высотного давления, разреженный горный воздух и направленные телесные интервенции активируют парасимпатическую нервную систему в 3.4 раза быстрее. За сутки происходит глубокая детоксикация кортизоловых цепей.',
    tags: ['#Нейробиология', '#Здоровье', '#Восстановление', '#Сознание'],
    likes: 71,
    comments: []
  },
  {
    id: 'post-resident-review-4',
    author: 'Роман Д.',
    authorRole: 'Основатель IT-компании, Резидент сообщества',
    contour: 'both',
    time: '3 дня назад',
    text: 'Прошел базовый тест профиля устойчивости в кабинете. Очень точно подсветило скрытые очаги выгорания в организме, о которых голова даже не думала. Буду внедрять дыхательные треки каждое утро.',
    tags: ['#Отзыв', '#ОпытРезидента', '#Диагностика'],
    likes: 42,
    comments: []
  }
];

export function readWallPosts(): WallPostRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(WALL_FILE)) {
      writeWallPosts(INITIAL_WALL_POSTS);
      return INITIAL_WALL_POSTS;
    }
    const raw = fs.readFileSync(WALL_FILE, 'utf-8');
    const posts: WallPostRecord[] = JSON.parse(raw || '[]');
    if (!Array.isArray(posts) || posts.length === 0) {
      writeWallPosts(INITIAL_WALL_POSTS);
      return INITIAL_WALL_POSTS;
    }
    return posts;
  } catch {
    return INITIAL_WALL_POSTS;
  }
}

export function writeWallPosts(posts: WallPostRecord[]) {
  try {
    atomicWriteJsonSync(WALL_FILE, posts);
  } catch (err) {
    console.error('Error writing wall posts:', err);
  }
}

export function saveWallPost(post: Omit<WallPostRecord, 'id' | 'likes' | 'comments' | 'time'> & { id?: string; time?: string }): WallPostRecord {
  const posts = readWallPosts();
  if (post.id) {
    const existing = posts.find(p => p.id === post.id);
    if (existing) {
      existing.text = post.text;
      existing.tags = post.tags;
      existing.contour = post.contour;
      if (post.author) existing.author = post.author;
      if (post.authorRole) existing.authorRole = post.authorRole;
      writeWallPosts(posts);
      return existing;
    }
  }

  const newPost: WallPostRecord = {
    id: `post-${Date.now()}`,
    author: post.author || 'Участник сообщества',
    authorRole: post.authorRole || 'Резидент EthOSium',
    contour: post.contour || 'both',
    time: 'Только что',
    text: post.text,
    tags: post.tags || [],
    likes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  writeWallPosts(posts);
  return newPost;
}

export function likeWallPost(postId: string): WallPostRecord | null {
  const posts = readWallPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return null;
  post.likes = (post.likes || 0) + 1;
  writeWallPosts(posts);
  return post;
}

export function addCommentToWallPost(postId: string, comment: { author: string; text: string }): WallPostRecord | null {
  const posts = readWallPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return null;
  if (!Array.isArray(post.comments)) post.comments = [];
  post.comments.push({
    author: comment.author || 'Резидент',
    text: comment.text.trim()
  });
  writeWallPosts(posts);
  return post;
}

export function deleteWallPost(postId: string): boolean {
  let posts = readWallPosts();
  const count = posts.length;
  posts = posts.filter(p => p.id !== postId);
  if (posts.length !== count) {
    writeWallPosts(posts);
    return true;
  }
  return false;
}

// Applications DB methods
export function readApplications(): ApplicationRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(APPLICATIONS_FILE)) {
      writeApplications(INITIAL_APPLICATIONS);
      return INITIAL_APPLICATIONS;
    }
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    const list: ApplicationRecord[] = JSON.parse(raw || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return INITIAL_APPLICATIONS;
  }
}

export function writeApplications(apps: ApplicationRecord[]) {
  try {
    atomicWriteJsonSync(APPLICATIONS_FILE, apps);
  } catch (err) {
    console.error('Error writing applications:', err);
  }
}

export function saveApplication(app: Omit<ApplicationRecord, 'id' | 'createdAt' | 'status'> & { id?: string; status?: ApplicationRecord['status'] }): ApplicationRecord {
  const apps = readApplications();
  if (app.id) {
    const existing = apps.find(a => a.id === app.id);
    if (existing) {
      if (app.name) existing.name = app.name;
      if (app.contact) existing.contact = app.contact;
      if (app.status) existing.status = app.status;
      if (app.format) existing.format = app.format;
      if (app.details) existing.details = app.details;
      if (app.amountUsd !== undefined) existing.amountUsd = app.amountUsd;
      if (app.promoCode !== undefined) existing.promoCode = app.promoCode;
      if (app.selectedModules !== undefined) existing.selectedModules = app.selectedModules;
      if (app.questionnaire !== undefined) existing.questionnaire = app.questionnaire;
      if (app.step !== undefined) existing.step = app.step;
      if (app.isDraft !== undefined) existing.isDraft = app.isDraft;
      if (app.adminNotes !== undefined) existing.adminNotes = app.adminNotes;
      existing.lastUpdated = new Date().toLocaleString('ru-RU');
      writeApplications(apps);
      return existing;
    }
  }

  const newApp: ApplicationRecord = {
    id: `APP-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    type: app.type || 'general',
    name: app.name || 'Анонимный заявитель',
    contact: app.contact || '',
    format: app.format || 'standard',
    details: app.details || '',
    status: app.status || 'new',
    amountUsd: app.amountUsd,
    promoCode: app.promoCode,
    selectedModules: app.selectedModules,
    questionnaire: app.questionnaire,
    step: app.step,
    isDraft: app.isDraft ?? (app.status === 'draft'),
    createdAt: new Date().toLocaleString('ru-RU'),
    lastUpdated: new Date().toLocaleString('ru-RU'),
    adminNotes: ''
  };

  apps.unshift(newApp);
  writeApplications(apps);
  return newApp;
}

export function saveApplicationDraft(draft: {
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
}): ApplicationRecord {
  const apps = readApplications();
  let existing: ApplicationRecord | undefined;

  if (draft.draftId) {
    existing = apps.find(a => a.id === draft.draftId);
  } else if (draft.contact && draft.contact.trim().length > 3) {
    // Try to find recent draft from same contact
    const cleanContact = draft.contact.trim().toLowerCase();
    existing = apps.find(a => 
      a.status === 'draft' && 
      a.contact.toLowerCase() === cleanContact && 
      (draft.type ? a.type === draft.type : true)
    );
  }

  const nowStr = new Date().toLocaleString('ru-RU');

  if (existing) {
    if (draft.name && draft.name.trim()) existing.name = draft.name.trim();
    if (draft.contact && draft.contact.trim()) existing.contact = draft.contact.trim();
    if (draft.format) existing.format = draft.format;
    if (draft.details) existing.details = draft.details;
    if (draft.selectedModules) existing.selectedModules = draft.selectedModules;
    if (draft.questionnaire) existing.questionnaire = { ...existing.questionnaire, ...draft.questionnaire };
    if (draft.step) existing.step = draft.step;
    if (draft.totalBudgetUsd !== undefined) existing.amountUsd = draft.totalBudgetUsd;
    if (draft.promoCode) existing.promoCode = draft.promoCode;
    existing.isDraft = true;
    existing.status = 'draft';
    existing.lastUpdated = nowStr;
    writeApplications(apps);
    return existing;
  }

  const newDraft: ApplicationRecord = {
    id: draft.draftId || `DRAFT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    type: draft.type || 'retreat_chimgan',
    name: draft.name?.trim() || 'Гость (заполняет анкету)',
    contact: draft.contact?.trim() || 'Контакт не указан',
    format: draft.format || 'custom',
    details: draft.details || 'Черновик предрегистрации на ретрит 18-20 сентября',
    status: 'draft',
    isDraft: true,
    amountUsd: draft.totalBudgetUsd,
    promoCode: draft.promoCode,
    selectedModules: draft.selectedModules || [],
    questionnaire: draft.questionnaire || {},
    step: draft.step || 'modules',
    createdAt: nowStr,
    lastUpdated: nowStr,
    adminNotes: 'Автосохраненный черновик в процессе заполнения'
  };

  apps.unshift(newDraft);
  writeApplications(apps);
  return newDraft;
}

export function updateApplicationStatus(id: string, status: ApplicationRecord['status'], adminNotes?: string): ApplicationRecord | null {
  const apps = readApplications();
  const found = apps.find(a => a.id === id);
  if (!found) return null;
  found.status = status;
  if (adminNotes !== undefined) found.adminNotes = adminNotes;
  writeApplications(apps);
  return found;
}

export function deleteApplication(id: string): boolean {
  let apps = readApplications();
  const count = apps.length;
  apps = apps.filter(a => a.id !== id);
  if (apps.length !== count) {
    writeApplications(apps);
    return true;
  }
  return false;
}

// Inbox Messages DB methods
export function readInboxMessages(): InboxMessageRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(INBOX_FILE)) {
      writeInboxMessages(INITIAL_INBOX);
      return INITIAL_INBOX;
    }
    const raw = fs.readFileSync(INBOX_FILE, 'utf-8');
    const msgs: InboxMessageRecord[] = JSON.parse(raw || '[]');
    return Array.isArray(msgs) ? msgs : [];
  } catch {
    return INITIAL_INBOX;
  }
}

export function writeInboxMessages(msgs: InboxMessageRecord[]) {
  try {
    atomicWriteJsonSync(INBOX_FILE, msgs);
  } catch (err) {
    console.error('Error writing inbox messages:', err);
  }
}

export function saveInboxMessage(msg: { fromName: string; fromContact: string; subject: string; message: string }): InboxMessageRecord {
  const msgs = readInboxMessages();
  const newMsg: InboxMessageRecord = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
    fromName: msg.fromName || 'Посетитель сайта',
    fromContact: msg.fromContact || '',
    subject: msg.subject || 'Обращение через портал',
    message: msg.message || '',
    receivedAt: new Date().toLocaleString('ru-RU'),
    status: 'unread',
    replyNotes: ''
  };
  msgs.unshift(newMsg);
  writeInboxMessages(msgs);
  return newMsg;
}

export function updateInboxMessageStatus(id: string, status: InboxMessageRecord['status'], replyNotes?: string): InboxMessageRecord | null {
  const msgs = readInboxMessages();
  const found = msgs.find(m => m.id === id);
  if (!found) return null;
  found.status = status;
  if (replyNotes !== undefined) found.replyNotes = replyNotes;
  writeInboxMessages(msgs);
  return found;
}

export function deleteInboxMessage(id: string): boolean {
  let msgs = readInboxMessages();
  const count = msgs.length;
  msgs = msgs.filter(m => m.id !== id);
  if (msgs.length !== count) {
    writeInboxMessages(msgs);
    return true;
  }
  return false;
}

