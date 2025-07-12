import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { register, loading, error } = useApp();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  const handleEmailSignUp = async () => {
    setFormError('');
    if (!email || !password || !name) {
      setFormError('Please fill out all fields.');
      return;
    }
    try {
      await register(email, password, name);
      navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        style={StyleSheet.absoluteFill}
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
        isMuted
      />
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.contentWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.panel}>
          {/* Logo and marketing copy */}
          <View style={styles.logoBox}>
            <View style={styles.logoPlaceholder}><Text style={styles.logoText}>Logo</Text></View>
            <Text style={styles.title}>quitvice</Text>
            <Text style={styles.members}>1000+ members</Text>
            <View style={styles.starsRow}>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.rating}>(4.7)</Text>
            </View>
          </View>
          {/* Sign Up Buttons or Email Form */}
          {!showEmailForm ? (
            <>
              <TouchableOpacity style={styles.appleBtn} disabled>
                <Text style={styles.appleBtnText}>Continue with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.googleBtn} disabled>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emailBtn} onPress={() => setShowEmailForm(true)}>
                <Text style={styles.emailBtnText}>Sign up with Email</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#ababab"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoFocus
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#ababab"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#ababab"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {(formError || error) ? (
                <Text style={styles.errorText}>{formError || error}</Text>
              ) : null}
              <TouchableOpacity
                style={[styles.registerBtn, loading && { opacity: 0.6 }]}
                onPress={handleEmailSignUp}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Sign Up</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setShowEmailForm(false)}
                disabled={loading}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Optional: Register later or restore progress */}
          <View style={styles.laterBox}>
            <Text style={styles.laterText}>or <Text style={styles.laterLink}>Register later</Text></Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoPlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'Space Grotesk-Bold',
  },
  members: {
    color: '#ff6a00',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Space Grotesk',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stars: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Space Grotesk',
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.8,
    fontFamily: 'Space Grotesk',
  },
  appleBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appleBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  googleBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  googleBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  emailBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emailBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Space Grotesk',
  },
  errorText: {
    color: '#ff6a00',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Space Grotesk',
  },
  registerBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  registerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  backBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Space Grotesk-Bold',
  },
  laterBox: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  laterText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
    fontFamily: 'Space Grotesk',
  },
  laterLink: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontFamily: 'Space Grotesk',
  },
  restoreLink: {
    color: '#ff6a00',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontFamily: 'Space Grotesk',
  },
}); 