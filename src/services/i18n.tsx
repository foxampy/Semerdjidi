import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'ru' | 'en' | 'ar' | 'he' | 'zh';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ru', label: 'Русский', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'he', label: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
];

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  ru: {
    // TopHeader & Navigation
    'brand.name': 'EthOSium',
    'nav.onboarding': 'Онбординг',
    'nav.founder': 'Екатерина Семерджиди',
    'nav.retreats': 'Ретриты & Путешествия',
    'nav.labforge': 'LabForge R&D',
    'nav.coffee': 'Кофейня & Лаунж',
    'nav.baseline': 'Baseline чекин',
    'nav.workbook': 'Цифровой Workbook',
    'nav.experts': 'Каталог специалистов',
    'nav.learning': 'Академия',
    'nav.club': 'Клуб',
    'nav.practices': 'Практики',
    'nav.chat': 'Поддержка & Координация',
    'nav.social': 'Личный кабинет',
    'nav.admin': 'Управление',
    'nav.booking': 'Бронирование',
    'nav.menu': 'Меню',
    
    // Subtitles
    'sub.onboarding': 'Экосистема здоровья и сознания',
    'sub.founder': 'Основатель и ведущая',
    'sub.retreats': 'Ретриты, Экспедиции & Программа Корней',
    'sub.labforge': 'Инновации и R&D лаборатория',
    'sub.coffee': 'Чайная комната & Лаунж',
    'sub.baseline': 'Чекин состояния D-3',
    'sub.workbook': 'Индивидуальный план',
    'sub.experts': 'Аккредитованные эксперты',
    'sub.learning': 'Программы и лекции',
    'sub.club': 'Сообщество резидентов',
    'sub.practices': 'Ментальный покой & Аудиотека',
    'sub.chat': 'Координация резиденции',
    'sub.social': 'Профиль и публикации',
    'sub.admin': 'Панель управления',
    'sub.booking': 'Консьерж-сервис',

    // Common Actions
    'btn.login': 'Войти',
    'btn.register': 'Регистрация',
    'btn.logout': 'Выйти',
    'btn.save': 'Сохранить',
    'btn.cancel': 'Отмена',
    'btn.edit': 'Редактировать',
    'btn.delete': 'Удалить',
    'btn.send': 'Отправить',
    'btn.search': 'Поиск',
    'btn.back': 'Назад',
    'btn.apply': 'Применить',
    'btn.createPost': 'Опубликовать',
    'btn.addFriend': 'Добавить в контакты',
    'btn.removeFriend': 'Удалить из контактов',

    // Social & Profile Tabs
    'tab.profile': 'Профиль',
    'tab.messages': 'Сообщения',
    'tab.friends': 'Участники',
    'tab.wall': 'Записи',

    // Empty states & Labels
    'profile.guestTitle': 'Добро пожаловать в EthOSium',
    'profile.guestDesc': 'Войдите или зарегистрируйтесь, чтобы получить доступ к закрытым материалам, сохранять результаты тестов и публиковать записи.',
    'profile.editProfile': 'Редактировать профиль',
    'profile.role': 'Роль / Профессия',
    'profile.bio': 'О себе',
    'profile.contour': 'Контур взаимодействия',
    'profile.registered': 'Дата регистрации',
    'friends.empty': 'Пока нет зарегистрированных участников. Вы можете стать первым!',
    'messages.empty': 'Выберите участника для начала диалога.',
    'wall.placeholder': 'Поделитесь мыслями или вопросом...',
    'wall.tagPlaceholder': '#Экосистема #Здоровье #Сознание #Ретрит',

    // Footer signature
    'footer.signature': 'EthOSium • Экосистема здоровья и сознания',
  },

  en: {
    'brand.name': 'EthOSium',
    'nav.onboarding': 'Onboarding',
    'nav.founder': 'Ekaterina Semerdzhidi',
    'nav.retreats': 'Retreats & Expeditions',
    'nav.labforge': 'R&D Lab',
    'nav.coffee': 'Coffee & Lounge',
    'nav.baseline': 'Baseline Check-in',
    'nav.workbook': 'Digital Workbook',
    'nav.experts': 'Experts Directory',
    'nav.learning': 'Academy',
    'nav.club': 'Private Club',
    'nav.practices': 'Practices',
    'nav.chat': 'Support & Concierge',
    'nav.social': 'My Account',
    'nav.admin': 'Admin Console',
    'nav.booking': 'Booking Concierge',
    'nav.menu': 'Menu',

    'sub.onboarding': 'Ecosystem of Health and Consciousness',
    'sub.founder': 'Founder & Retreat Guide',
    'sub.retreats': 'Retreats, Expeditions & Heritage Roots',
    'sub.labforge': 'Innovations & R&D Lab',
    'sub.coffee': 'Tea Room & Lounge',
    'sub.baseline': 'D-3 Psycho-Emotional Calibration',
    'sub.workbook': 'Personal Growth Plan',
    'sub.experts': 'Certified Specialists',
    'sub.learning': 'Lectures & Programs',
    'sub.club': 'Resident Community',
    'sub.practices': 'Neuro-Balance & Restoration',
    'sub.chat': 'Coordination Desk',
    'sub.social': 'Profile & Publications',
    'sub.admin': 'Management Panel',
    'sub.booking': 'Concierge Booking',

    'btn.login': 'Sign In',
    'btn.register': 'Register',
    'btn.logout': 'Sign Out',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.send': 'Send',
    'btn.search': 'Search',
    'btn.back': 'Back',
    'btn.apply': 'Apply',
    'btn.createPost': 'Publish',
    'btn.addFriend': 'Connect',
    'btn.removeFriend': 'Remove',

    'tab.profile': 'Profile',
    'tab.messages': 'Messages',
    'tab.friends': 'Members',
    'tab.wall': 'Posts',

    'profile.guestTitle': 'Welcome to EthOSium',
    'profile.guestDesc': 'Sign in or register to access materials, save diagnostic test results, and share publications.',
    'profile.editProfile': 'Edit Profile',
    'profile.role': 'Role / Focus',
    'profile.bio': 'Bio',
    'profile.contour': 'Ecosystem Circuit',
    'profile.registered': 'Joined',
    'friends.empty': 'No registered members yet. Invite colleagues or be the first!',
    'messages.empty': 'Select a member to begin a conversation.',
    'wall.placeholder': 'Share an insight, question or update...',
    'wall.tagPlaceholder': '#Ecosystem #Health #Consciousness #Retreat',

    'footer.signature': 'EthOSium • Ecosystem of Health and Consciousness',
  },

  ar: {
    'brand.name': 'إيثوسيوم',
    'nav.onboarding': 'البداية',
    'nav.founder': 'إيكاترينا سيميردجيدي',
    'nav.retreats': 'الخلوات والرحلات الاستكشافية',
    'nav.labforge': 'مختبر البحث والتطوير',
    'nav.coffee': 'القهوة والصالة',
    'nav.baseline': 'تسجيل الحالة',
    'nav.workbook': 'دفتر العمل الرقمي',
    'nav.experts': 'دليل الخبراء',
    'nav.learning': 'الأكاديمية',
    'nav.club': 'النادي الخاص',
    'nav.practices': 'الممارسات والتوازن النفسي',
    'nav.chat': 'الدعم والتنسيق',
    'nav.social': 'حسابي',
    'nav.admin': 'لوحة الإدارة',
    'nav.booking': 'خدمة الحجز',
    'nav.menu': 'القائمة',

    'sub.onboarding': 'منظومة الصحة والوعي',
    'sub.founder': 'المؤسس والموجه',
    'sub.retreats': 'الخلوات والبعثات وبرنامج الجذور',
    'sub.labforge': 'الابتكار والبحث والتطوير',
    'sub.coffee': 'غرفة الشاي والصالة',
    'sub.baseline': 'معايرة الحالة اليومية',
    'sub.workbook': 'خطة التطوير الشخصي',
    'sub.experts': 'أخصائيون معتمدون',
    'sub.learning': 'برامج ومحاضرات',
    'sub.club': 'مجتمع المقيمين',
    'sub.practices': 'استعادة الهدوء والتوازن النفسي',
    'sub.chat': 'مكتب التنسيق',
    'sub.social': 'الملف الشخصي والمنشورات',
    'sub.admin': 'لوحة التحكم',
    'sub.booking': 'خدمة الحجز والاستقبال',

    'btn.login': 'تسجيل الدخول',
    'btn.register': 'إنشاء حساب',
    'btn.logout': 'تسجيل الخروج',
    'btn.save': 'حفظ',
    'btn.cancel': 'إلغاء',
    'btn.edit': 'تعديل',
    'btn.delete': 'حذف',
    'btn.send': 'إرسال',
    'btn.search': 'بحث',
    'btn.back': 'رجوع',
    'btn.apply': 'تطبيق',
    'btn.createPost': 'نشر',
    'btn.addFriend': 'إضافة إلى جهات الاتصال',
    'btn.removeFriend': 'إزالة من جهات الاتصال',

    'tab.profile': 'الملف الشخصي',
    'tab.messages': 'الرسائل',
    'tab.friends': 'الأعضاء',
    'tab.wall': 'المنشورات',

    'profile.guestTitle': 'مرحباً بكم في إيثوسيوم',
    'profile.guestDesc': 'سجل الدخول أو أنشئ حساباً جديداً للوصول إلى المحتوى وحفظ نتائج الاختبارات والمشاركة.',
    'profile.editProfile': 'تعديل الملف الشخصي',
    'profile.role': 'الدور / المهنة',
    'profile.bio': 'نبذة عنك',
    'profile.contour': 'مسار التفاعل',
    'profile.registered': 'تاريخ الانضمام',
    'friends.empty': 'لا يوجد أعضاء مسجلون بعد. كن أول من ينضم!',
    'messages.empty': 'اختر عضواً لبدء المحادثة.',
    'wall.placeholder': 'شارك بأفكارك أو أسئلتك هنا...',
    'wall.tagPlaceholder': '#إيثوسيوم #صحة #وعي #ملاذ',

    'footer.signature': 'إيثوسيوم • منظومة الصحة والوعي',
  },

  he: {
    'brand.name': 'EthOSium',
    'nav.onboarding': 'התחלה',
    'nav.founder': 'יקטרינה סמרג\'ידי',
    'nav.retreats': 'ריטריטים ומסעות',
    'nav.labforge': 'מעבדת מו"פ',
    'nav.coffee': 'קפה ולאונג\'',
    'nav.baseline': 'כיול Baseline',
    'nav.workbook': 'חוברת עבודה דיגיטלית',
    'nav.experts': 'אינדקס מומחים',
    'nav.learning': 'אקדמיה',
    'nav.club': 'מועדון חברים',
    'nav.practices': 'תרגולים ורוגע',
    'nav.chat': 'תמיכה ותיאום',
    'nav.social': 'החשבון שלי',
    'nav.admin': 'פאנל ניהול',
    'nav.booking': 'הזמנת קונסיירז\'',
    'nav.menu': 'תפריט',

    'sub.onboarding': 'אקוסיסטם של בריאות ותודעה',
    'sub.founder': 'מייסדת ומנחה',
    'sub.retreats': 'ריטריטים, משלחות ותוכנית תגלית ומסע',
    'sub.labforge': 'חדשנות ומו"פ',
    'sub.coffee': 'חדר תה ולאונג\'',
    'sub.baseline': 'כיול מצב D-3',
    'sub.workbook': 'תוכנית אישית',
    'sub.experts': 'מומחים מוסמכים',
    'sub.learning': 'הרצאות ותוכניות',
    'sub.club': 'קהילת חברים',
    'sub.practices': 'שחזור ורוגע מנטלי',
    'sub.chat': 'דסק תיאום',
    'sub.social': 'פרופיל ופרסומים',
    'sub.admin': 'פאנל ניהול',
    'sub.booking': 'שירות הזמנות',

    'btn.login': 'התחברות',
    'btn.register': 'הרשמה',
    'btn.logout': 'התנתקות',
    'btn.save': 'שמירה',
    'btn.cancel': 'ביטול',
    'btn.edit': 'עריכה',
    'btn.delete': 'מחיקה',
    'btn.send': 'שליחה',
    'btn.search': 'חיפוש',
    'btn.back': 'חזרה',
    'btn.apply': 'החל',
    'btn.createPost': 'פרסם',
    'btn.addFriend': 'הוסף לאנשי קשר',
    'btn.removeFriend': 'הסר',

    'tab.profile': 'פרופיל',
    'tab.messages': 'הודעות',
    'tab.friends': 'חברים',
    'tab.wall': 'פוסטים',

    'profile.guestTitle': 'ברוכים הבאים ל-EthOSium',
    'profile.guestDesc': 'התחברו או הירשמו כדי לגשת לחומרים, לשמור תוצאות אבחון ולשתף פרסומים.',
    'profile.editProfile': 'עריכת פרופיל',
    'profile.role': 'תפקיד / מקצוע',
    'profile.bio': 'על עצמי',
    'profile.contour': 'ערוץ אינטראקציה',
    'profile.registered': 'תאריך הצטרפות',
    'friends.empty': 'עדיין אין חברים רשומים. היה הראשון להצטרף!',
    'messages.empty': 'בחר חבר כדי להתחיל שיחה.',
    'wall.placeholder': 'שתף תובנה, שאלה או עדכון...',
    'wall.tagPlaceholder': '#בריאות #תודעה #ריטריט #קהילה',

    'footer.signature': 'EthOSium • אקוסיסטם של בריאות ותודעה',
  },

  zh: {
    'brand.name': 'EthOSium',
    'nav.onboarding': '入门指南',
    'nav.founder': '叶卡捷琳娜·塞梅尔吉迪',
    'nav.retreats': '静修营与全球远征',
    'nav.labforge': '前沿研发实验室',
    'nav.coffee': '咖啡与茶道休息厅',
    'nav.baseline': '身心基线检测',
    'nav.workbook': '数字化成长手册',
    'nav.experts': '认证专家名录',
    'nav.learning': '研修学院',
    'nav.club': '私享俱乐部',
    'nav.practices': '身心觉察练习',
    'nav.chat': '专属支持与协调',
    'nav.social': '个人中心',
    'nav.admin': '管理控制台',
    'nav.booking': '礼宾预订服务',
    'nav.menu': '菜单',

    'sub.onboarding': '身心健康与意识生态系统',
    'sub.founder': '创始人兼主导师',
    'sub.retreats': '静修营、远征探索与寻根计划',
    'sub.labforge': '系统创新与前沿研发',
    'sub.coffee': '静思茶室与休息室',
    'sub.baseline': 'D-3 身心状态校准',
    'sub.workbook': '个人成长方案',
    'sub.experts': '认证专家团队',
    'sub.learning': '讲座与学术课程',
    'sub.club': '生态驻留社群',
    'sub.practices': '身心舒缓练习',
    'sub.chat': '协调接待中心',
    'sub.social': '个人资料与动态',
    'sub.admin': '生态系统控制台',
    'sub.booking': '贵宾预订接待',

    'btn.login': '登录',
    'btn.register': '注册',
    'btn.logout': '退出登录',
    'btn.save': '保存',
    'btn.cancel': '取消',
    'btn.edit': '编辑',
    'btn.delete': '删除',
    'btn.send': '发送',
    'btn.search': '搜索',
    'btn.back': '返回',
    'btn.apply': '应用',
    'btn.createPost': '发布',
    'btn.addFriend': '添加联系人',
    'btn.removeFriend': '移除联系人',

    'tab.profile': '个人主页',
    'tab.messages': '即时消息',
    'tab.friends': '社区成员',
    'tab.wall': '动态广场',

    'profile.guestTitle': '欢迎来到 EthOSium 生态',
    'profile.guestDesc': '登录或注册以访问内部资料，保存身心评测结果并参与社区互动。',
    'profile.editProfile': '编辑资料',
    'profile.role': '角色 / 职业',
    'profile.bio': '个人简介',
    'profile.contour': '互动圈层',
    'profile.registered': '加入时间',
    'friends.empty': '暂无其他注册成员。欢迎邀请伙伴或成为首位入驻者！',
    'messages.empty': '请选择成员开始对话。',
    'wall.placeholder': '分享您的见解、问题或灵感...',
    'wall.tagPlaceholder': '#生态系统 #健康 #意识 #静修营',

    'footer.signature': 'EthOSium • 身心健康与意识生态系统',
  },
};

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('ethosium_lang') as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {}
    return 'ru';
  });

  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem('ethosium_lang', newLang);
      const opt = SUPPORTED_LANGUAGES.find(o => o.code === newLang);
      document.documentElement.dir = opt?.dir || 'ltr';
      document.documentElement.lang = newLang;
    } catch {}
  };

  useEffect(() => {
    const opt = SUPPORTED_LANGUAGES.find(o => o.code === lang);
    document.documentElement.dir = opt?.dir || 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ru;
    if (dict[key]) return dict[key];
    if (TRANSLATIONS.ru[key]) return TRANSLATIONS.ru[key];
    return fallback || key;
  };

  const currentOption = SUPPORTED_LANGUAGES.find(o => o.code === lang) || SUPPORTED_LANGUAGES[0];
  const isRtl = currentOption.dir === 'rtl';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl, currentOption }}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'rtl-context' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return ctx;
};
