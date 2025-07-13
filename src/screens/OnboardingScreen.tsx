import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '@/context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VICES = [
  {
    key: 'smoking',
    title: 'Smoking',
    description: 'Track your progress towards quitting smoking.',
  },
  {
    key: 'drinking',
    title: 'Drinking',
    description: 'Monitor your alcohol consumption and reduce drinking.',
  },
  {
    key: 'porn',
    title: 'Pornography',
    description: 'Control your pornography consumption.',
  },
];

const onboardingSteps = [
  {
    key: 'vices',
    title: 'Choose your vices',
    subtitle: 'Select the vices you want to quit or reduce.\nYou can choose multiple vices to track simultaneously.',
    vices: VICES,
  },
  {
    key: 'intro',
    title: 'Track your streaks',
    image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    description: 'Track your progress daily and watch your streak grow. Each day you stay on track, you’ll mark it as complete.'
  },
  {
    key: 'progress',
    title: 'Daily Progress',
    subtitle: 'Track your progress',
    image: { uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
    description: 'Stay motivated by seeing your daily progress and streaks. Reset your streak if needed.',
    streak: { type: 'Smoking', day: 12, goal: 30 },
  },
  {
    key: 'welcome',
    title: 'Welcome',
    subtitle: 'It takes more than 2 months before a new behavior becomes automatic',
    testimonials: [
      { name: 'Ethan, 28', text: 'I’ve been smoke-free for 3 months now, thanks to this app!', image: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, bg: '#fbe3d3' },
      { name: 'Sophia, 24', text: 'This app helped me quit drinking after years of struggling.', image: { uri: 'https://randomuser.me/api/portraits/women/44.jpg' }, bg: '#f8d6d6' },
      { name: 'Liam, 31', text: 'I never thought I could quit, but this app made it possible.', image: { uri: 'https://randomuser.me/api/portraits/men/65.jpg' }, bg: '#e6e6e6' },
    ],
    description: 'On average, it takes 66 days to be exact. You’re on your way to a healthier you!\n\nYou can do this! We’re here to support you every step of the way.',
    cta: 'Start your free trial',
    ctaSub: '7-day free trial, then $9.99/month',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const { user } = useApp();
  const [selected, setSelected] = useState<string[]>(['smoking']);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const toggleVice = (key: string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleNext = async () => {
    if (step === onboardingSteps.length - 1) {
      if (selected.length === 0) {
        setError('Please select at least one vice.');
        return;
      }
      setError('');
      // Save to Supabase
      if (user) {
        await import('@/services/supabase').then(({ supabase }) =>
          supabase.from('users').update({ vices: selected }).eq('id', user.id)
        );
      }
      navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
    } else {
      scrollRef.current?.scrollTo({ x: (step + 1) * SCREEN_WIDTH, animated: true });
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      scrollRef.current?.scrollTo({ x: (step - 1) * SCREEN_WIDTH, animated: true });
      setStep(s => s - 1);
    }
  };

  const onScroll = (e: any) => {
    const newStep = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (newStep !== step) setStep(newStep);
  };

  const renderDots = () => (
    <View style={styles.dots}>
      {onboardingSteps.map((_, i) => (
        <View key={i} style={i === step ? styles.dotActive : styles.dot} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{ alignItems: 'flex-start' }}
        style={{ flex: 1 }}
      >
        {/* Vices selection */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}> 
          <Text style={styles.step}>Select Your Vices</Text>
          {renderDots()}
          <Text style={styles.title}>{onboardingSteps[0].title}</Text>
          <Text style={styles.subtitle}>{onboardingSteps[0].subtitle}</Text>
          <FlatList
            data={onboardingSteps[0].vices}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, selected.includes(item.key) && styles.cardSelected]}
                onPress={() => toggleVice(item.key)}
                activeOpacity={0.8}
              >
                <View style={styles.cardRow}>
                  <View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.description}</Text>
                  </View>
                  <View style={selected.includes(item.key) ? styles.radioSelected : styles.radio} />
                </View>
              </TouchableOpacity>
            )}
            style={{ width: '100%' }}
            contentContainerStyle={{ gap: 16, marginTop: 16, marginBottom: 24, paddingHorizontal: 0 }}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        {/* Track your streaks */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}> 
          <Text style={styles.title}>{onboardingSteps[1].title}</Text>
          {renderDots()}
          <View style={styles.imageBox}><Image source={onboardingSteps[1].image} style={styles.image} /></View>
          <Text style={styles.description}>{onboardingSteps[1].description}</Text>
        </View>
        {/* Daily Progress */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}> 
          <Text style={styles.step}>{onboardingSteps[2].title}</Text>
          {renderDots()}
          <Text style={styles.subtitle}>{onboardingSteps[2].subtitle}</Text>
          <View style={styles.imageBox}><Image source={onboardingSteps[2].image} style={styles.image} /></View>
          <Text style={styles.description}>{onboardingSteps[2].description}</Text>
          <View style={styles.streakCard}>
            <Text style={styles.streakType}>{onboardingSteps[2].streak?.type ?? ''}</Text>
            <Text style={styles.streakDay}>{onboardingSteps[2].streak ? `Day ${onboardingSteps[2].streak.day} of ${onboardingSteps[2].streak.goal}` : ''}</Text>
          </View>
          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.resetBtn}><Text style={styles.resetBtnText}>Reset Streak</Text></TouchableOpacity>
          </View>
        </View>
        {/* Welcome/testimonials */}
        <ScrollView style={{ width: SCREEN_WIDTH }} contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
          <Text style={styles.step}>Welcome</Text>
          {renderDots()}
          <Text style={styles.subtitle}>{onboardingSteps[3].subtitle}</Text>
          <View style={styles.testimonialsRow}>
            {onboardingSteps[3].testimonials?.map((t, i) => (
              <View key={i} style={[styles.testimonialCard, { backgroundColor: t.bg }]}> 
                <Image source={t.image} style={styles.testimonialImg} />
                <Text style={styles.testimonialName}>{t.name}</Text>
                <Text style={styles.testimonialText}>{t.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.description}>{onboardingSteps[3].description}</Text>
          <Text style={styles.ctaSub}>{onboardingSteps[3].ctaSub}</Text>
        </ScrollView>
      </ScrollView>
      <View style={styles.bottomRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{step === onboardingSteps.length - 1 ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181410',
  },
  container: {
    flex: 1,
    backgroundColor: '#181410',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  step: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
  title: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fbe3d3',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  description: {
    color: '#fff',
    fontFamily: 'Space Grotesk',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  streakCard: {
    backgroundColor: '#23201c',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  streakType: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  streakDay: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 15,
  },
  rowBtns: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  resetBtnText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  nextBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 8,
  },
  nextBtnText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  testimonialsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 8,
  },
  testimonialCard: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    width: 110,
    marginHorizontal: 4,
  },
  testimonialImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  testimonialName: {
    color: '#181410',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 14,
    marginBottom: 2,
  },
  testimonialText: {
    color: '#181410',
    fontFamily: 'Space Grotesk',
    fontSize: 12,
    textAlign: 'center',
  },
  ctaSub: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#181410',
    marginBottom: 0,
  },
  cardSelected: {
    borderColor: '#fff',
    backgroundColor: '#23201c',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
    marginBottom: 2,
  },
  cardDesc: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 13,
    marginBottom: 0,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  backBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 8,
  },
  backBtnText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  error: {
    color: '#ff6a00',
    fontFamily: 'Space Grotesk',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
}); 