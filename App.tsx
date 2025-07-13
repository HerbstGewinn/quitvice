import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

import { AppProvider } from '@/context/AppContext';
import HomeScreen from '@/screens/HomeScreen';
import StreakDetailScreen from '@/screens/StreakDetailScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { StreakDetailParams } from '@/types';

export type RootStackParamList = {
  SignUp: undefined;
  Onboarding: undefined;
  Home: undefined;
  StreakDetail: StreakDetailParams;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Space Grotesk': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
          'Space Grotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf'),
          'Space Grotesk-Medium': require('./assets/fonts/SpaceGrotesk-Medium.ttf'),
          'Space Grotesk-Light': require('./assets/fonts/SpaceGrotesk-Light.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Failed to load fonts:', error);
        setFontsLoaded(true); // Continue without custom fonts
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6a00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#181410' }
            }}
            initialRouteName="SignUp"
          >
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="StreakDetail" component={StreakDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181410',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Space Grotesk',
  },
}); 