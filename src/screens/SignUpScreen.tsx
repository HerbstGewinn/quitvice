import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { register, login, loading, error } = useApp();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async () => {
    setFormError('');
    
    if (isSignUp) {
      // Sign Up flow
      if (!email || !password || !name) {
        setFormError('Please fill out all fields.');
        return;
      }
      try {
        await register(email, password, name);
        navigation.reset({ index: 0, routes: [{ name: 'Onboarding' as never }] });
      } catch (err: any) {
        setFormError(err.message || 'Registration failed');
      }
    } else {
      // Sign In flow
      if (!email || !password) {
        setFormError('Please enter your email and password.');
        return;
      }
      try {
        await login(email, password);
        navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
      } catch (err: any) {
        setFormError(err.message || 'Login failed');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.contentWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Brand Name at Top */}
          <Text style={styles.brandName}>Vices</Text>
          
          {/* Large Logo in Center */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/vices_logo_nobg.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>$100</Text>
              <Text style={styles.statLabel}>Monthly</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Limit</Text>
              <Text style={styles.statLabel}>100 Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>97%</Text>
              <Text style={styles.statLabel}>Success</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Put your money where your mouth is</Text>

            <View style={styles.form}>
              {isSignUp && (
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              {(formError || error) && (
                <Text style={styles.errorText}>{formError || error}</Text>
              )}

              <TouchableOpacity
                style={[styles.submitButton, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isSignUp ? 'I´m All In' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Toggle between Sign Up and Sign In */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={toggleMode}
                disabled={loading}
              >
                <Text style={styles.toggleText}>
                  {isSignUp 
                    ? 'Already have an account? Sign In'
                    : 'Need an account? Join the Elite'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandName: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'Space Grotesk-Bold',
    letterSpacing: -1,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#ff6a00',
    marginBottom: 40,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Space Grotesk-Bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Space Grotesk',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#333',
    marginHorizontal: 16,
  },
  formContainer: {
    marginTop: 'auto',
  },
  formTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Space Grotesk-Bold',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Space Grotesk',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Space Grotesk',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#ff6a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  toggleButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Space Grotesk',
  },
}); 