import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>Q</Text>
              </View>
              <Text style={styles.brandName}>quitvice</Text>
            </View>
            
            <Text style={styles.tagline}>The Elite Commitment Contract</Text>
            <Text style={styles.subtitle}>
              Put your money where your mouth is.{'\n'}
              Finally quit for good.
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>97%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>$100</Text>
                <Text style={styles.statLabel}>Monthly</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isSignUp ? 'Join the Elite' : 'Welcome Back'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isSignUp 
                ? 'Stop investing in your vices.\nStart investing in your future.'
                : 'Continue your journey to freedom.\nYour streaks are waiting.'
              }
            </Text>

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
                    {isSignUp ? 'Continue' : 'Sign In'}
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

            {/* Value Proposition - Only show for Sign Up */}
            {isSignUp && (
              <View style={styles.valueProps}>
                <Text style={styles.valuePropTitle}>What You Get:</Text>
                <View style={styles.valuePropItem}>
                  <Text style={styles.valuePropBullet}>•</Text>
                  <Text style={styles.valuePropText}>Real financial consequences for failure</Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Text style={styles.valuePropBullet}>•</Text>
                  <Text style={styles.valuePropText}>Exclusive community of committed individuals</Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Text style={styles.valuePropBullet}>•</Text>
                  <Text style={styles.valuePropText}>Premium rewards for milestone achievements</Text>
                </View>
                <View style={styles.valuePropItem}>
                  <Text style={styles.valuePropBullet}>•</Text>
                  <Text style={styles.valuePropText}>Science-backed commitment contract system</Text>
                </View>
              </View>
            )}

            {/* Bottom Note */}
            <View style={styles.bottomNote}>
              <Text style={styles.bottomText}>
                Investment in your health, not your vice.{'\n'}
                <Text style={styles.bottomSubtext}>Cancel anytime. No long-term contracts.</Text>
              </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  brandName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    fontFamily: 'Space Grotesk-Bold',
  },
  tagline: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Space Grotesk-Bold',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: 'Space Grotesk',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#333',
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
    flex: 1,
  },
  formTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Space Grotesk-Bold',
  },
  formSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: 'Space Grotesk',
  },
  form: {
    marginBottom: 32,
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
  valueProps: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  valuePropTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  valuePropBullet: {
    color: '#fff',
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
    fontFamily: 'Space Grotesk-Bold',
  },
  valuePropText: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
    fontFamily: 'Space Grotesk',
  },
  bottomNote: {
    alignItems: 'center',
  },
  bottomText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Space Grotesk',
  },
  bottomSubtext: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Space Grotesk',
  },
}); 