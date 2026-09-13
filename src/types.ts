export type EcosystemContour = 'public' | 'corporate' | 'sovereign';

export interface SemerdzhidiVectors {
  visionary: number;   // Стратегический вектор (Визионер/Архитектор)
  stabilizer: number;  // Операционный вектор (Стабилизатор/Оператор)
  harmonizer: number;  // Эмпатийно-коммуникативный вектор (Гармонизатор)
  auditor: number;     // Аналитико-критический вектор (Аудитор/Интегратор)
}

export interface SemerdzhidiProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  dominantType: string;
  vectors: SemerdzhidiVectors;
  burnoutRisk: 'Низкий' | 'Умеренный' | 'Повышенный' | 'Критический';
  synergyScore: number;
  emotionalEnergy: number; // 0-100%
  contourClearance: EcosystemContour[];
  cognitiveStyle: string;
  coachingRecommendations: string[];
  recentStateChange?: string;
}

export interface CompanyNode {
  id: string;
  name: string;
  industry: string;
  logo: string;
  contours: EcosystemContour[];
  membersCount: number;
  processHealth: number; // 0-100%
  synergyLevel: number; // 0-100%
  activeWorkflows: number;
  description: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorCompany: string;
  contour: EcosystemContour;
  timestamp: string;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  semerdzhidiBadge?: string;
  resonanceScore: number; // 0-100%
  attachments?: {
    type: 'metric' | 'diagram' | 'doc';
    title: string;
    value?: string;
  }[];
}

export interface BusinessProcess {
  id: string;
  name: string;
  companyId: string;
  contour: EcosystemContour;
  status: 'optimal' | 'warning' | 'critical' | 'optimizing';
  efficiencyScore: number;
  throughput: string;
  latencyMs: number;
  bottleneck: string;
  stages: {
    name: string;
    durationMinutes: number;
    dropoffRate: number;
    psychologicalPressure: number; // 1-10
  }[];
  aiRecommendation?: string;
  lastOptimized?: string;
}

export interface EcosystemModule {
  id: string;
  code: string;
  title: string;
  category: 'core' | 'intelligence' | 'collaboration' | 'governance';
  contourScope: EcosystemContour[];
  icon: string;
  status: 'active' | 'synced' | 'standby';
  description: string;
  usageMetric: string;
  activeUsersNow: number;
}

export interface RealtimeTelemetryEvent {
  id: string;
  timestamp: string;
  type: 'ai_optimization' | 'contour_sync' | 'semerdjidi_alert' | 'social_pulse' | 'security_audit';
  title: string;
  contour: EcosystemContour;
  description: string;
  impactScore?: string;
}
