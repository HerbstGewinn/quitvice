import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Animated, PanResponder, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_MIN_Y = 0;
const PANEL_MAX_Y = SCREEN_HEIGHT - 120;

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { register, loading, error } = useApp();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  // Animated panel position
  const translateY = useRef(new Animated.Value(PANEL_MIN_Y)).current;
  const panelOpen = useRef(true);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        let newY = PANEL_MIN_Y + gestureState.dy;
        if (newY < 0) newY = 0;
        if (newY > PANEL_MAX_Y) newY = PANEL_MAX_Y;
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) {
          // Swipe down to hide
          Animated.spring(translateY, {
            toValue: PANEL_MAX_Y,
            useNativeDriver: true,
          }).start(() => { panelOpen.current = false; });
        } else {
          // Snap back up
          Animated.spring(translateY, {
            toValue: PANEL_MIN_Y,
            useNativeDriver: true,
          }).start(() => { panelOpen.current = true; });
        }
      },
    })
  ).current;

  const handlePanelTap = () => {
    if (!panelOpen.current) {
      Animated.spring(translateY, {
        toValue: PANEL_MIN_Y,
        useNativeDriver: true,
      }).start(() => { panelOpen.current = true; });
    }
  };

  const handleEmailSignUp = async () => {
    setFormError('');
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
        <Animated.View
          style={[styles.panel, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {/* Swipe handle */}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.handleContainer}
            onPress={handlePanelTap}
          >
            <View style={styles.handle} />
          </TouchableOpacity>
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
            <Text style={styles.laterText}>or <Text style={styles.laterLink}>No Account yet ? Register Now !</Text></Text>
          </View>
        </Animated.View>
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
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    gap: 12,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -8,
    zIndex: 10,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#444',
    marginBottom: 8,
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