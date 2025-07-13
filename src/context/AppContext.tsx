import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Streak, MotivationalQuote, User, StreakType } from '@/types';
import { streakService, quoteService, userService, utils } from '@/services/supabase';
import { supabase } from '@/services/supabase';

interface AppState {
  user: User | null;
  streaks: Streak[];
  quotes: MotivationalQuote[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_STREAKS'; payload: Streak[] }
  | { type: 'ADD_STREAK'; payload: Streak }
  | { type: 'UPDATE_STREAK'; payload: Streak }
  | { type: 'SET_QUOTES'; payload: MotivationalQuote[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: null,
  streaks: [],
  quotes: [],
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_STREAKS':
      return { ...state, streaks: action.payload };
    case 'ADD_STREAK':
      return { ...state, streaks: [action.payload, ...state.streaks] };
    case 'UPDATE_STREAK':
      return {
        ...state,
        streaks: state.streaks.map(streak =>
          streak.id === action.payload.id ? action.payload : streak
        ),
      };
    case 'SET_QUOTES':
      return { ...state, quotes: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface AppContextType extends AppState {
  // User actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  
  // Streak actions
  createStreak: (type: StreakType, goal: number) => Promise<void>;
  updateStreakProgress: (streakId: string, currentStreak: number) => Promise<void>;
  resetStreak: (streakId: string) => Promise<void>;
  loadUserStreaks: (userId?: string) => Promise<void>;
  createDefaultStreaks: (userId: string) => Promise<void>;
  
  // Quote actions
  loadQuotes: () => Promise<void>;
  
  // Utility functions
  getStreakProgress: (current: number, goal: number) => number;
  getEncouragement: (progress: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const createDefaultStreaks = async (userId: string) => {
    try {
      console.log('Creating default streaks for user:', userId);
      
      // Check if user already has streaks
      let existingStreaks = [];
      try {
        existingStreaks = await streakService.getUserStreaks(userId);
        console.log('Existing streaks:', existingStreaks);
      } catch (error) {
        console.log('Could not check existing streaks (likely new user):', error);
        // Continue with creation as this is expected for new users
      }
      
      if (existingStreaks.length > 0) {
        console.log('User already has streaks, skipping default creation');
        return;
      }
      
      // Create default streaks for all three types
      const defaultStreakTypes: StreakType[] = ['smoking', 'drinking', 'porn'];
      const defaultGoal = 66; // 66 days goal
      
      console.log('Creating default streaks for types:', defaultStreakTypes);
      
      const createdStreaks = await Promise.all(
        defaultStreakTypes.map(type => 
          streakService.createStreak(userId, type, defaultGoal)
        )
      );
      
      console.log('Created default streaks:', createdStreaks);
      
      // Update the state with new streaks
      dispatch({ type: 'SET_STREAKS', payload: createdStreaks });
    } catch (error) {
      console.error('Failed to create default streaks:', error);
      // Don't throw error here as it's not critical for login flow
    }
  };

  const loadUserStreaks = async (userId?: string) => {
    const userIdToUse = userId || state.user?.id;
    console.log('AppContext: loadUserStreaks called', { 
      userId, 
      userIdToUse, 
      currentUser: state.user?.id,
      hasUser: !!state.user 
    });
    
    if (!userIdToUse) {
      console.log('AppContext: No user ID available, skipping streak loading');
      return;
    }
    
    try {
      console.log('AppContext: Loading streaks for user:', userIdToUse);
      const streaks = await streakService.getUserStreaks(userIdToUse);
      console.log('AppContext: Loaded streaks:', streaks);
      
      // If no streaks found, create default ones
      if (streaks.length === 0) {
        console.log('No streaks found, creating default streaks');
        await createDefaultStreaks(userIdToUse);
        // Reload streaks after creating defaults
        const newStreaks = await streakService.getUserStreaks(userIdToUse);
        dispatch({ type: 'SET_STREAKS', payload: newStreaks });
      } else {
        dispatch({ type: 'SET_STREAKS', payload: streaks });
      }
    } catch (error) {
      console.error('AppContext: Failed to load streaks:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load streaks' });
    }
  };

  const loadQuotes = async () => {
    try {
      console.log('Loading quotes...');
      const quotes = await quoteService.getRandomQuotes(3);
      console.log('Loaded quotes:', quotes);
      dispatch({ type: 'SET_QUOTES', payload: quotes });
    } catch (error) {
      console.error('Failed to load quotes:', error);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        console.log('Initializing app...');
        
        // Check if there's an existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (session?.user) {
          console.log('Found existing session, loading user profile...');
          // Get user profile from our users table
          const profile = await userService.getUserProfile(session.user.id);
          console.log('User profile:', profile);
          
          if (profile) {
            dispatch({ type: 'SET_USER', payload: profile });
            // Load user's streaks and quotes
            console.log('Loading user data...');
            await Promise.all([
              loadUserStreaks(session.user.id),
              loadQuotes(),
            ]);
          } else {
            console.log('No user profile found, creating one...');
            // Create user profile if it doesn't exist
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || 'User',
              });
            
            if (upsertError) {
              console.error('Failed to create user profile:', upsertError);
            } else {
              const newProfile = await userService.getUserProfile(session.user.id);
              if (newProfile) {
                dispatch({ type: 'SET_USER', payload: newProfile });
                // Create default streaks for new user
                await createDefaultStreaks(session.user.id);
                await Promise.all([
                  loadUserStreaks(session.user.id),
                  loadQuotes(),
                ]);
              }
            }
          }
        } else {
          console.log('No existing session found - user needs to login');
          // Just load quotes for unauthenticated users
          await loadQuotes();
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load app data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, loading profile...');
          const profile = await userService.getUserProfile(session.user.id);
          if (profile) {
            dispatch({ type: 'SET_USER', payload: profile });
            await loadUserStreaks(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_STREAKS', payload: [] });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Real Supabase authentication
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (user) {
        const profile = await userService.getUserProfile(user.id);
        if (profile) {
          dispatch({ type: 'SET_USER', payload: profile });
          await loadUserStreaks(user.id);
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Real Supabase auth logout
      await supabase.auth.signOut();
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_STREAKS', payload: [] });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Logout failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      // Real Supabase registration
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error('No user returned from Supabase');
      // Wait for session to be available
      let session = null;
      for (let i = 0; i < 10; i++) {
        const { data: sessionData } = await supabase.auth.getSession();
        session = sessionData.session;
        if (session && session.user && session.user.id === user.id) break;
        await new Promise(res => setTimeout(res, 200));
      }
      if (!session) throw new Error('User session not established after sign up. Please check your email for confirmation.');
      // Upsert user profile with name and email
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({ id: user.id, email: user.email, name });
      if (upsertError) throw upsertError;
      
      const newUser = { id: user.id, email: user.email || '', name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      dispatch({ type: 'SET_USER', payload: newUser });
      
      // Create default streaks for new user
      await createDefaultStreaks(user.id);
      
      // Load user data
      await Promise.all([
        loadUserStreaks(user.id),
        loadQuotes(),
      ]);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Registration failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createStreak = async (type: StreakType, goal: number) => {
    if (!state.user) throw new Error('User not authenticated');
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newStreak = await streakService.createStreak(state.user.id, type, goal);
      dispatch({ type: 'ADD_STREAK', payload: newStreak });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create streak' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateStreakProgress = async (streakId: string, currentStreak: number) => {
    try {
      console.log('AppContext: updateStreakProgress called', { streakId, currentStreak, user: state.user?.id });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Re-enable authentication check for production
      if (!state.user) {
        throw new Error('User not authenticated');
      }
      
      const updatedStreak = await streakService.updateStreak(streakId, currentStreak);
      console.log('AppContext: streak updated successfully', updatedStreak);
      dispatch({ type: 'UPDATE_STREAK', payload: updatedStreak });
    } catch (error) {
      console.error('AppContext: Failed to update streak:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update streak' });
      throw error; // Re-throw so the UI can handle it
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetStreak = async (streakId: string) => {
    try {
      console.log('AppContext: resetStreak called', { streakId, user: state.user?.id });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Re-enable authentication check for production
      if (!state.user) {
        throw new Error('User not authenticated');
      }
      
      await streakService.resetStreak(streakId);
      console.log('AppContext: streak reset successfully');
      await loadUserStreaks(); // Reload to get updated data
    } catch (error) {
      console.error('AppContext: Failed to reset streak:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to reset streak' });
      throw error; // Re-throw so the UI can handle it
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getStreakProgress = utils.calculateProgress;
  const getEncouragement = utils.getEncouragement;

  const value: AppContextType = {
    ...state,
    login,
    logout,
    register,
    createStreak,
    updateStreakProgress,
    resetStreak,
    loadUserStreaks,
    createDefaultStreaks,
    loadQuotes,
    getStreakProgress,
    getEncouragement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 