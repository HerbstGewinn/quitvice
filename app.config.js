export default {
  expo: {
    name: "Vices",
    slug: "QuitStreakCoach",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/vices_logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
      revenuecatApiKey: process.env.REVENUECAT_PUBLIC_API_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "e0b623f9-8efb-4c18-9b59-0d826d35ec07"
      }
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.vicesapp.vices",
      buildNumber: "2",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};
