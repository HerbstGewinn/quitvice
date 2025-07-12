declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}

export const config = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  app: {
    name: 'QuitStreakCoach',
    version: '1.0.0',
  },
  features: {
    enableNotifications: true,
    enableAnalytics: false,
    enableOfflineMode: true,
  },
  design: {
    colors: {
      primary: '#181410',
      secondary: '#141414',
      accent: '#ff6a00',
      text: '#FFFFFF',
      textSecondary: '#ababab',
      progress: '#474747',
      progressFill: '#303030',
    },
    typography: {
      fontFamily: 'Space Grotesk',
      fontSize: {
        small: 14,
        medium: 16,
        large: 18,
        xlarge: 24,
        xxlarge: 32,
        huge: 48,
      },
    },
  },
}; 