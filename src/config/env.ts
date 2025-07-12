// Environment configuration
export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  },
  app: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'QuitStreakCoach',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
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