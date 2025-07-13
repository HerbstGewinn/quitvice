// @ts-ignore: TypeScript module declaration for @env is provided in a .d.ts file
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { createClient } from '@supabase/supabase-js';
import { Streak, StreakAttempt, MotivationalQuote, User, StreakType, Milestone } from '@/types';

// Real Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Debug logging
console.log('Supabase client initialized with:', {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY?.substring(0, 20) + '...',
});

// Milestone benefits data - centralized definition based on specific day counts
const MILESTONE_BENEFITS = {
  7: {
    title: 'Day 7',
    description: 'You\'ve completed your first week!',
    benefits: {
      smoking: 'Circulation starts to rebound; exercise feels easier',
      drinking: 'First full REM-sleep cycles return; anxiety often dips',
      porn: 'Early drop-off in cravings reported; mental "fog" begins to lift',
    },
  },
  20: {
    title: 'Day 20',
    description: 'You\'ve reached 20 days!',
    benefits: {
      smoking: 'Lung function can improve by up to 30%; coughing eases',
      drinking: 'Liver fat already falling and blood-pressure trending down',
      porn: 'Higher everyday energy & focus noted in qualitative studies',
    },
  },
  33: {
    title: 'Day 33',
    description: 'You\'ve reached 33 days!',
    benefits: {
      smoking: 'Nicotine receptors down-regulate → cravings noticeably milder',
      drinking: 'Better insulin sensitivity and visible skin hydration gains',
      porn: 'Many users report return of morning erections & stronger libido',
    },
  },
  53: {
    title: 'Day 53',
    description: 'You\'ve reached 53 days!',
    benefits: {
      smoking: 'Shortness of breath continues to fall; risk of heart attack already ~10% lower',
      drinking: 'Resting heart-rate normalises; measurable weight-, BP- and mood improvements keep compounding',
      porn: 'Pilot study saw 1 life-satisfaction scores and 1 fatigue after 7+ weeks abstinence',
    },
  },
  66: {
    title: 'Goal Achieved',
    description: 'Congratulations! You\'ve reached your 66-day goal!',
    benefits: {
      smoking: 'Heart disease risk cut in half; lung cancer risk plummets',
      drinking: 'Liver fully regenerated; mental clarity at lifetime peak',
      porn: 'Healthy sexuality restored; confidence and energy maximized',
    },
  },
};

// Function to generate milestones for a streak based on day counts
function generateMilestones(streakId: string, goal: number): Milestone[] {
  const milestones: Milestone[] = [];
  
  // Use specific day milestones
  const dayMilestones = [7, 20, 33, 53, goal]; // Always include the goal as final milestone
  
  dayMilestones.forEach(dayCount => {
    const percentage = Math.round((dayCount / goal) * 100);
    const milestoneData = MILESTONE_BENEFITS[dayCount as keyof typeof MILESTONE_BENEFITS];
    
    if (milestoneData) {
      milestones.push({
        id: `${streakId}-${dayCount}`,
        streakId,
        percentage,
        title: milestoneData.title,
        description: milestoneData.description,
        isReached: false,
        createdAt: new Date().toISOString(),
        benefit: milestoneData.benefits,
      });
    }
  });
  
  return milestones;
}

// Function to update milestone progress based on current streak
function updateMilestoneProgress(milestones: Milestone[], currentStreak: number, goal: number): Milestone[] {
  return milestones.map(milestone => {
    // Extract day count from milestone ID (format: streakId-dayCount)
    const dayCount = parseInt(milestone.id.split('-').pop() || '0');
    const wasReached = milestone.isReached;
    const isNowReached = currentStreak >= dayCount;
    
    return {
      ...milestone,
      isReached: isNowReached,
      reachedAt: isNowReached && !wasReached ? new Date().toISOString() : milestone.reachedAt,
    };
  });
}

// Function to get the current milestone benefit for a streak
export function getCurrentMilestoneBenefit(currentStreak: number, goal: number, streakType: StreakType): string {
  // Find the highest reached milestone based on day count
  const dayMilestones = [7, 20, 33, 53, goal];
  let highestReachedDays = 0;
  
  for (const dayCount of dayMilestones) {
    if (currentStreak >= dayCount) {
      highestReachedDays = dayCount;
    }
  }
  
  // If no milestone reached, show the first milestone benefit as motivation
  if (highestReachedDays === 0) {
    highestReachedDays = 7; // Show Day 7 benefit as motivation
  }
  
  const milestoneData = MILESTONE_BENEFITS[highestReachedDays as keyof typeof MILESTONE_BENEFITS];
  return milestoneData?.benefits[streakType] || 'Keep going! You\'re making great progress.';
}

// Streak operations
export const streakService = {
  // Get all streaks for a user
  async getUserStreaks(userId: string): Promise<Streak[]> {
    try {
      console.log('Getting streaks for user:', userId);
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session?.user?.id);
      
      // Re-enable authentication check for production
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      // Ensure user can only access their own streaks
      if (session.user.id !== userId) {
        throw new Error('Unauthorized: Cannot access other user\'s streaks');
      }
      
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      console.log('Streaks query result:', { data, error });

      if (error) throw error;

      // Transform database data to app format and add milestones
      const streaks: Streak[] = data.map(streak => {
        const milestones = generateMilestones(streak.id, streak.goal);
        const updatedMilestones = updateMilestoneProgress(milestones, streak.current_streak, streak.goal);
        
        return {
          id: streak.id,
          userId: streak.user_id,
          type: streak.type as StreakType,
          currentStreak: streak.current_streak,
          goal: streak.goal,
          startDate: streak.start_date,
          lastCheckIn: streak.last_check_in,
          isActive: streak.is_active,
          createdAt: streak.created_at,
          updatedAt: streak.updated_at,
          milestones: updatedMilestones,
        };
      });

      console.log('Transformed streaks:', streaks);
      return streaks;
    } catch (error) {
      console.error('Error fetching user streaks:', error);
      throw error;
    }
  },

  // Get a specific streak
  async getStreak(streakId: string): Promise<Streak | null> {
    try {
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('id', streakId)
        .single();

      if (error) {
        console.error('Error fetching streak:', error);
        return null;
      }

      if (!data) {
        console.warn('Streak not found:', streakId);
        return null;
      }

      // Ensure user can only access their own streak
      if (data.user_id !== session.user.id) {
        throw new Error('Unauthorized: Cannot access other user\'s streak');
      }

      const milestones = generateMilestones(data.id, data.goal);
      const updatedMilestones = updateMilestoneProgress(milestones, data.current_streak, data.goal);

      return {
        id: data.id,
        userId: data.user_id,
        type: data.type as StreakType,
        currentStreak: data.current_streak,
        goal: data.goal,
        startDate: data.start_date,
        lastCheckIn: data.last_check_in,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        milestones: updatedMilestones,
      };
    } catch (error) {
      console.error('Error fetching streak:', error);
      throw error;
    }
  },

  // Create a new streak
  async createStreak(userId: string, type: StreakType, goal: number = 66): Promise<Streak> {
    try {
      console.log('Creating streak:', { userId, type, goal });
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session for create:', session?.user?.id);
      
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      // Ensure user can only create streaks for themselves
      if (session.user.id !== userId) {
        throw new Error('Unauthorized: Cannot create streak for other user');
      }
      
      const { data, error } = await supabase
        .from('streaks')
        .insert([
          {
            user_id: userId,
            type,
            goal,
            current_streak: 0,
            start_date: new Date().toISOString(),
            last_check_in: new Date().toISOString(),
            is_active: true,
          }
        ])
        .select()
        .single();

      console.log('Create streak result:', { data, error });

      if (error) throw error;

      // Generate milestones for the new streak
      const milestones = generateMilestones(data.id, goal);
      
      const newStreak: Streak = {
        id: data.id,
        userId: data.user_id,
        type: data.type as StreakType,
        currentStreak: data.current_streak,
        goal: data.goal,
        startDate: data.start_date,
        lastCheckIn: data.last_check_in,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        milestones,
      };

      console.log('Created streak:', newStreak);
      return newStreak;
    } catch (error) {
      console.error('Error creating streak:', error);
      throw error;
    }
  },

  // Update streak progress
  async updateStreak(streakId: string, currentStreak: number): Promise<Streak> {
    try {
      console.log('SupabaseService: updateStreak called', { streakId, currentStreak });
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('SupabaseService: Current session for update:', {
        userId: session?.user?.id,
        email: session?.user?.email,
        isValid: !!session?.access_token
      });
      
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      // First, verify the streak belongs to the current user
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('user_id')
        .eq('id', streakId)
        .single();
      
      if (streakError || !streakData) {
        throw new Error('Streak not found');
      }
      
      if (streakData.user_id !== session.user.id) {
        throw new Error('Unauthorized: Cannot update other user\'s streak');
      }
      
      const { data, error } = await supabase
        .from('streaks')
        .update({
          current_streak: currentStreak,
          last_check_in: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId)
        .select()
        .single();

      console.log('SupabaseService: Update streak result:', { data, error });

      if (error) {
        console.error('SupabaseService: Database error:', error);
        throw error;
      }

      // Generate updated milestones
      const milestones = generateMilestones(data.id, data.goal);
      const updatedMilestones = updateMilestoneProgress(milestones, currentStreak, data.goal);

      const updatedStreak: Streak = {
        id: data.id,
        userId: data.user_id,
        type: data.type as StreakType,
        currentStreak: data.current_streak,
        goal: data.goal,
        startDate: data.start_date,
        lastCheckIn: data.last_check_in,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        milestones: updatedMilestones,
      };

      console.log('SupabaseService: Updated streak successfully:', updatedStreak);
      return updatedStreak;
    } catch (error) {
      console.error('SupabaseService: Error updating streak:', error);
      throw error;
    }
  },

  // Reset a streak
  async resetStreak(streakId: string): Promise<void> {
    try {
      console.log('SupabaseService: resetStreak called', { streakId });
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('SupabaseService: Current session for reset:', {
        userId: session?.user?.id,
        email: session?.user?.email,
        isValid: !!session?.access_token
      });
      
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      // First, get the streak data and verify ownership
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('*')
        .eq('id', streakId)
        .single();

      console.log('SupabaseService: Streak data for reset:', { streakData, streakError });

      if (streakError) {
        console.error('SupabaseService: Error fetching streak data:', streakError);
        throw streakError;
      }

      if (!streakData) {
        throw new Error('Streak not found');
      }

      if (streakData.user_id !== session.user.id) {
        throw new Error('Unauthorized: Cannot reset other user\'s streak');
      }

      if (streakData.current_streak > 0) {
        // Create streak attempt record
        const { error: attemptError } = await supabase
          .from('streak_attempts')
          .insert([
            {
              streak_id: streakId,
              start_date: streakData.start_date,
              end_date: new Date().toISOString(),
              duration: streakData.current_streak,
              is_completed: streakData.current_streak >= streakData.goal,
            }
          ]);

        console.log('SupabaseService: Attempt insert result:', { attemptError });

        if (attemptError) {
          console.error('SupabaseService: Error creating attempt record:', attemptError);
          throw attemptError;
        }
      }

      // Reset the streak
      const { error } = await supabase
        .from('streaks')
        .update({
          current_streak: 0,
          start_date: new Date().toISOString(),
          last_check_in: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId);

      console.log('SupabaseService: Reset streak result:', { error });

      if (error) {
        console.error('SupabaseService: Error resetting streak:', error);
        throw error;
      }
      
      console.log('SupabaseService: Streak reset successfully');
    } catch (error) {
      console.error('SupabaseService: Error resetting streak:', error);
      throw error;
    }
  },

  // Deactivate a streak
  async deactivateStreak(streakId: string): Promise<void> {
    try {
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user session found');
      }
      
      // First, verify the streak belongs to the current user
      const { data: streakData, error: streakError } = await supabase
        .from('streaks')
        .select('user_id')
        .eq('id', streakId)
        .single();
      
      if (streakError || !streakData) {
        throw new Error('Streak not found');
      }
      
      if (streakData.user_id !== session.user.id) {
        throw new Error('Unauthorized: Cannot deactivate other user\'s streak');
      }
      
      const { error } = await supabase
        .from('streaks')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId);

      console.log('Deactivate streak result:', { error });

      if (error) throw error;
    } catch (error) {
      console.error('Error deactivating streak:', error);
      throw error;
    }
  },
};

// Streak attempt operations
export const attemptService = {
  // Get attempt history for a streak
  async getStreakAttempts(streakId: string): Promise<StreakAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('streak_attempts')
        .select('*')
        .eq('streak_id', streakId)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching streak attempts:', error);
        return [];
      }

      return data.map(attempt => ({
        id: attempt.id,
        streakId: attempt.streak_id,
        startDate: attempt.start_date,
        endDate: attempt.end_date,
        duration: attempt.duration,
        isCompleted: attempt.is_completed,
        createdAt: attempt.created_at,
      }));
    } catch (error) {
      console.error('Error fetching streak attempts:', error);
      throw error;
    }
  },

  // Create a new attempt
  async createAttempt(streakId: string, startDate: string): Promise<StreakAttempt> {
    try {
      const { data, error } = await supabase
        .from('streak_attempts')
        .insert([
          {
            streak_id: streakId,
            start_date: startDate,
            end_date: null,
            duration: 0,
            is_completed: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        streakId: data.streak_id,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration,
        isCompleted: data.is_completed,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating streak attempt:', error);
      throw error;
    }
  },

  // Complete an attempt
  async completeAttempt(attemptId: string, endDate: string, duration: number): Promise<StreakAttempt> {
    try {
      const { data, error } = await supabase
        .from('streak_attempts')
        .update({
          end_date: endDate,
          duration: duration,
          is_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        streakId: data.streak_id,
        startDate: data.start_date,
        endDate: data.end_date,
        duration: data.duration,
        isCompleted: data.is_completed,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error completing streak attempt:', error);
      throw error;
    }
  },
};

// Motivational quotes operations
export const quoteService = {
  // Get random motivational quotes
  async getRandomQuotes(limit: number = 3): Promise<MotivationalQuote[]> {
    try {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching random quotes:', error);
        return [];
      }

      return data.map(quote => ({
        id: quote.id,
        text: quote.text,
        author: quote.author,
        imageUrl: quote.image_url,
        category: quote.category,
        createdAt: quote.created_at,
      }));
    } catch (error) {
      console.error('Error fetching random quotes:', error);
      throw error;
    }
  },

  // Get quotes by category
  async getQuotesByCategory(category: string): Promise<MotivationalQuote[]> {
    try {
      const { data, error } = await supabase
        .from('motivational_quotes')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes by category:', error);
        return [];
      }

      return data.map(quote => ({
        id: quote.id,
        text: quote.text,
        author: quote.author,
        imageUrl: quote.image_url,
        category: quote.category,
        createdAt: quote.created_at,
      }));
    } catch (error) {
      console.error('Error fetching quotes by category:', error);
      throw error;
    }
  },
};

// User operations
export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!data) {
        console.warn('User not found:', userId);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

// Utility functions
export const utils = {
  calculateProgress: (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100);
  },

  getEncouragement: (progress: number): string => {
    if (progress >= 100) return "🎉 Goal achieved! You're amazing!";
    if (progress >= 75) return "🔥 Almost there! Keep pushing!";
    if (progress >= 50) return "💪 Halfway there! You're doing great!";
    if (progress >= 25) return "🌟 Great progress! Keep it up!";
    return "🚀 You've got this! Every day counts!";
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  },

  getDaysAgo: (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
}; 