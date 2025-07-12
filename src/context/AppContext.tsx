import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Streak, MotivationalQuote, User, StreakType } from '@/types';
import { streakService, quoteService, userService, utils } from '@/services/supabase';

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
  loadUserStreaks: () => Promise<void>;
  
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

  // Load initial data and auto-login for demo
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Auto-login mock user for demo
        const mockUser: User = {
          id: '1',
          email: 'demo@quitstreak.com',
          name: 'Demo User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: mockUser });
        
        // Load quotes and streaks
        await Promise.all([
          loadQuotes(),
          loadUserStreaks(),
        ]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load app data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // TODO: Implement Supabase auth
      // const { data: { user }, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      
      // if (error) throw error;
      // if (user) {
      //   const profile = await userService.getUserProfile(user.id);
      //   dispatch({ type: 'SET_USER', payload: profile });
      //   await loadUserStreaks();
      // }
      
      // Mock login for now
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'SET_USER', payload: mockUser });
      await loadUserStreaks();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // TODO: Implement Supabase auth logout
      // await supabase.auth.signOut();
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
      
      // TODO: Implement Supabase auth registration
      // const { data: { user }, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      // });
      
      // if (error) throw error;
      // if (user) {
      //   const profile = await userService.updateUserProfile(user.id, { name });
      //   dispatch({ type: 'SET_USER', payload: profile });
      // }
      
      // Mock registration for now
      const mockUser: User = {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
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
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedStreak = await streakService.updateStreak(streakId, currentStreak);
      dispatch({ type: 'UPDATE_STREAK', payload: updatedStreak });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update streak' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetStreak = async (streakId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await streakService.resetStreak(streakId);
      await loadUserStreaks(); // Reload to get updated data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to reset streak' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadUserStreaks = async () => {
    if (!state.user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const streaks = await streakService.getUserStreaks(state.user.id);
      dispatch({ type: 'SET_STREAKS', payload: streaks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load streaks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadQuotes = async () => {
    try {
      const quotes = await quoteService.getRandomQuotes(3);
      dispatch({ type: 'SET_QUOTES', payload: quotes });
    } catch (error) {
      console.error('Failed to load quotes:', error);
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
    loadQuotes,
    getStreakProgress,
    getEncouragement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 