// @ts-ignore: TypeScript module declaration for @env is provided in a .d.ts file
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';
import { Streak, StreakAttempt, MotivationalQuote, User, StreakType, Milestone } from '@/types';

// Updated mock milestone data with health benefits for each vice
const mockMilestones: Milestone[] = [
  {
    id: '1',
    streakId: '1',
    percentage: 10,
    title: 'First Week',
    description: 'You\'ve completed your first week!',
    isReached: true,
    reachedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    benefit: {
      smoking: 'Circulation starts to rebound; exercise feels easier',
      drinking: 'First full REM-sleep cycles return; anxiety often dips',
      porn: 'Early drop-off in cravings reported; mental “fog” begins to lift',
    },
  },
  {
    id: '2',
    streakId: '1',
    percentage: 30,
    title: 'Day 20',
    description: 'You\'re 30% of the way there!',
    isReached: false,
    createdAt: new Date().toISOString(),
    benefit: {
      smoking: 'Lung function can improve by up to 30%; coughing eases',
      drinking: 'Liver fat already falling and blood-pressure trending down',
      porn: 'Higher everyday energy & focus noted in qualitative studies',
    },
  },
  {
    id: '3',
    streakId: '1',
    percentage: 50,
    title: 'Halfway There',
    description: 'You\'ve reached the halfway point!',
    isReached: false,
    createdAt: new Date().toISOString(),
    benefit: {
      smoking: 'Nicotine receptors down-regulate → cravings noticeably milder',
      drinking: 'Better insulin sensitivity and visible skin hydration gains',
      porn: 'Many users report return of morning erections & stronger libido',
    },
  },
  {
    id: '4',
    streakId: '1',
    percentage: 80,
    title: 'Day 53',
    description: 'You\'re in the final stretch!',
    isReached: false,
    createdAt: new Date().toISOString(),
    benefit: {
      smoking: 'Shortness of breath continues to fall; risk of heart attack already ~10% lower',
      drinking: 'Resting heart-rate normalises; measurable weight-, BP-, and mood improvements keep compounding',
      porn: 'Pilot study saw ↑ life-satisfaction scores and ↓ fatigue after 7+ weeks abstinence',
    },
  },
  {
    id: '5',
    streakId: '1',
    percentage: 100,
    title: 'Goal Achieved',
    description: 'Congratulations! You\'ve reached your goal!',
    isReached: false,
    createdAt: new Date().toISOString(),
    benefit: {
      smoking: '',
      drinking: '',
      porn: '',
    },
  },
];

// Mock data for development without Supabase
const mockStreaks: Streak[] = [
  {
    id: '1',
    userId: '1',
    type: 'smoking',
    currentStreak: 18,
    goal: 66,
    startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    lastCheckIn: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: mockMilestones,
  },
  {
    id: '2',
    userId: '1',
    type: 'drinking',
    currentStreak: 22,
    goal: 66,
    startDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    lastCheckIn: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: mockMilestones.map(m => ({ ...m, id: `${m.id}-drinking`, streakId: '2' })),
  },
  {
    id: '3',
    userId: '1',
    type: 'porn',
    currentStreak: 15,
    goal: 66,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastCheckIn: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    milestones: mockMilestones.map(m => ({ ...m, id: `${m.id}-porn`, streakId: '3' })),
  },
];

const mockAttempts: StreakAttempt[] = [
  { id: '1', streakId: '1', startDate: new Date().toISOString(), endDate: null, duration: 12, isCompleted: false, createdAt: new Date().toISOString() },
  { id: '2', streakId: '1', startDate: new Date().toISOString(), endDate: null, duration: 8, isCompleted: false, createdAt: new Date().toISOString() },
  { id: '3', streakId: '1', startDate: new Date().toISOString(), endDate: null, duration: 15, isCompleted: false, createdAt: new Date().toISOString() },
  { id: '4', streakId: '1', startDate: new Date().toISOString(), endDate: null, duration: 22, isCompleted: false, createdAt: new Date().toISOString() },
  { id: '5', streakId: '1', startDate: new Date().toISOString(), endDate: null, duration: 18, isCompleted: false, createdAt: new Date().toISOString() },
];

const mockQuotes: MotivationalQuote[] = [
  {
    id: '1',
    text: '"The only way to do great work is to love what you do." - Steve Jobs',
    author: 'Steve Jobs',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlqF2Byb-ei3zgNu45F_3USYf8G3qm2Pt9sqhsC8HeA-nEA9E0S4-6tE2q855wXKkp9aRrbp59_a11ZHUGK2A0o6d6FegHZZU5OKM6ozYNhv1Rlc4gtkIC9-HWgnpMkB3m0-OyUCgAkwVevOjg1TL8gvJeqqz-5ulC--MObvTHyGBA455XwYxJNnbM9LrZO23wzHoWlFRqwEgr3Pv4iqkpaK7EXpZCeK7YHPc46fl3y-BOQUtm1VZkMLdai-DD9wyl264e5LhZWB8',
    category: 'motivation'
  },
  {
    id: '2',
    text: '"The mind is everything. What you think you become." - Buddha',
    author: 'Buddha',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX3ZwCLie7AhSA42On8_lC3aRsGAZRCNes74qC7EqxtweSsYX5KWftqnFUMPtaP733iao2n498g6I8PYH2_L1OcBaJSu1f8svq9NGLuXNbMwCm6sY47x1OKc-kTtzK3In-tMKSzuLp-Ku6144cwOepqN2YVQPGfqrRyydF23FIiw2e6koGl4-tVPtVw6dCjQ5kQTwkP8ZLer_UlFHvE_BdXM0wQ42udLNGdJjY3MFlCQqTCxsek8I97ig06dAnGNQQJ78NqK4P300',
    category: 'mindfulness'
  },
  {
    id: '3',
    text: '"Believe you can and you\'re halfway there." - Theodore Roosevelt',
    author: 'Theodore Roosevelt',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBzzaurXYcD9ZS40TVKeXz1af8puQuOCu6LjzX7fNskXUEZ12oqN0jPMA3-6yReG9vTdtZOk2YWLOTp0kZ3hnuINNVmlD3Rde2MPdoAripTitQO1fa7HPR6n8z2YD9WE-X7xz-WpyQY2JLWRqaHtKGR7phd7KH-2RLeQKLlrfreU71244B2ZRknfDX3H7dKmCQiW43AyTj-eiIlWP3MpBqOUXfaX212NPJe94LNpY3UqO1E5QFmBQVOSp9nc5g0kQagaDVnQIXMTo',
    category: 'confidence'
  },
];

// Real Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Streak operations
export const streakService = {
  // Get all streaks for a user
  async getUserStreaks(userId: string): Promise<Streak[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStreaks;
  },

  // Get a specific streak
  async getStreak(streakId: string): Promise<Streak | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStreaks.find(s => s.id === streakId) || null;
  },

  // Create a new streak
  async createStreak(userId: string, type: StreakType, goal: number = 66): Promise<Streak> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Create default milestones for 66-day goal
    const defaultMilestones: Milestone[] = [
      {
        id: Date.now().toString() + '-10',
        streakId: Date.now().toString(),
        percentage: 10,
        title: 'First Week',
        description: 'You\'ve completed your first week!',
        isReached: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '-25',
        streakId: Date.now().toString(),
        percentage: 25,
        title: 'Quarter Way',
        description: 'You\'re 25% of the way there!',
        isReached: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '-50',
        streakId: Date.now().toString(),
        percentage: 50,
        title: 'Halfway There',
        description: 'You\'ve reached the halfway point!',
        isReached: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '-75',
        streakId: Date.now().toString(),
        percentage: 75,
        title: 'Almost There',
        description: 'You\'re in the final stretch!',
        isReached: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '-100',
        streakId: Date.now().toString(),
        percentage: 100,
        title: 'Goal Achieved',
        description: 'Congratulations! You\'ve reached your goal!',
        isReached: false,
        createdAt: new Date().toISOString(),
      },
    ];
    
    const newStreak: Streak = {
      id: Date.now().toString(),
      userId,
      type,
      currentStreak: 0,
      goal,
      startDate: new Date().toISOString(),
      lastCheckIn: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: defaultMilestones,
    };
    mockStreaks.push(newStreak);
    return newStreak;
  },

  // Update streak progress
  async updateStreak(streakId: string, currentStreak: number): Promise<Streak> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const streak = mockStreaks.find(s => s.id === streakId);
    if (streak) {
      streak.currentStreak = currentStreak;
      streak.lastCheckIn = new Date().toISOString();
      streak.updatedAt = new Date().toISOString();
    }
    return streak!;
  },

  // Reset a streak
  async resetStreak(streakId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const streak = mockStreaks.find(s => s.id === streakId);
    if (streak) {
      streak.currentStreak = 0;
      streak.startDate = new Date().toISOString();
      streak.lastCheckIn = new Date().toISOString();
      streak.updatedAt = new Date().toISOString();
    }
  },

  // Deactivate a streak
  async deactivateStreak(streakId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const streak = mockStreaks.find(s => s.id === streakId);
    if (streak) {
      streak.isActive = false;
      streak.updatedAt = new Date().toISOString();
    }
  },
};

// Streak attempt operations
export const attemptService = {
  // Get attempt history for a streak
  async getStreakAttempts(streakId: string): Promise<StreakAttempt[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAttempts.filter(a => a.streakId === streakId).slice(0, 5);
  },

  // Create a new attempt
  async createAttempt(streakId: string, startDate: string): Promise<StreakAttempt> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newAttempt: StreakAttempt = {
      id: Date.now().toString(),
      streakId,
      startDate,
      endDate: null,
      duration: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    mockAttempts.push(newAttempt);
    return newAttempt;
  },

  // Complete an attempt
  async completeAttempt(attemptId: string, endDate: string, duration: number): Promise<StreakAttempt> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const attempt = mockAttempts.find(a => a.id === attemptId);
    if (attempt) {
      attempt.endDate = endDate;
      attempt.duration = duration;
      attempt.isCompleted = true;
    }
    return attempt!;
  },
};

// Motivational quotes operations
export const quoteService = {
  // Get random motivational quotes
  async getRandomQuotes(limit: number = 3): Promise<MotivationalQuote[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockQuotes.slice(0, limit);
  },

  // Get quotes by category
  async getQuotesByCategory(category: string): Promise<MotivationalQuote[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockQuotes.filter(q => q.category === category);
  },
};

// User operations
export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      id: userId,
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...updates,
    };
  },
};

// Utility functions
export const utils = {
  // Calculate progress percentage
  calculateProgress(current: number, goal: number): number {
    return Math.min((current / goal) * 100, 100);
  },

  // Get encouragement message based on progress
  getEncouragement(progress: number): string {
    if (progress >= 80) return "Almost there! Stay strong.";
    if (progress >= 60) return "You're doing great! Keep it up.";
    if (progress >= 40) return "You're making progress! Keep going.";
    if (progress >= 20) return "Every day counts! Stay focused.";
    return "You've got this! Start strong.";
  },

  // Format date for display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  },

  // Get days since start
  getDaysSinceStart(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
}; 