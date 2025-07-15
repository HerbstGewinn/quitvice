export type StreakType = 'smoking' | 'drinking' | 'porn';

export interface Milestone {
  id: string;
  streakId: string;
  percentage: number;
  title: string;
  description: string;
  isReached: boolean;
  reachedAt?: string;
  createdAt: string;
  benefit?: {
    smoking: string;
    drinking: string;
    porn: string;
  };
}

export interface Streak {
  id: string;
  userId: string;
  type: StreakType;
  currentStreak: number;
  goal: number;
  startDate: string;
  lastCheckIn: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
}

export interface StreakAttempt {
  id: string;
  streakId: string;
  startDate: string;
  endDate: string | null;
  duration: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  imageUrl: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressData {
  currentStreak: number;
  goal: number;
  progress: number;
  encouragement: string;
  attemptHistory: number[];
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface StreakDetailParams {
  streakType: StreakType;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export type RootStackParamList = {
  SignUp: undefined;
  Onboarding: undefined;
  Home: undefined;
  StreakDetail: StreakDetailParams;
  Profile: undefined;
  Community: undefined;
}; 