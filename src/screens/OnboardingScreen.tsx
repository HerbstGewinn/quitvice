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
    subtitle: 'Select the vices you want to quit or reduce.',
    vices: VICES,
  },
  {
    key: 'intro',
    title: 'Track your streaks',
    image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    description: 'Track your progress daily and watch your streak grow. Each day you stay on track, you\'ll mark it as complete.'
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
    key: 'rewards',
    title: 'Exclusive Rewards',
    subtitle: 'Luxury rewards for milestones',
    image: { uri: 'https://images.unsplash.com/photo-1549068106-b024baf5062d?auto=format&fit=crop&w=400&q=80' },
    description: 'Reach milestone achievements and unlock premium rewards.',
  },
  {
    key: 'welcome',
    title: 'Welcome',
    subtitle: 'It takes more than 2 months before a new behavior becomes automatic',
    testimonials: [
      { name: 'Ethan, 28', text: 'I\'ve been smoke-free for 3 months now, thanks to this app!', image: { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }, bg: '#fbe3d3' },
      { name: 'Sophia, 24', text: 'This app helped me quit drinking after years of struggling.', image: { uri: 'https://randomuser.me/api/portraits/women/44.jpg' }, bg: '#f8d6d6' },
      { name: 'Liam, 31', text: 'I never thought I could quit, but this app made it possible.', image: { uri: 'https://randomuser.me/api/portraits/men/65.jpg' }, bg: '#e6e6e6' },
    ],
    description: 'On average, it takes 66 days to be exact. You\'re on your way to a healthier you!\n\nYou can do this! We\'re here to support you every step of the way.',
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
          <View style={styles.vicesContainer}>
            {onboardingSteps[0].vices?.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, selected.includes(item.key) && styles.cardSelected]}
                onPress={() => toggleVice(item.key)}
                activeOpacity={0.8}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.description}</Text>
                  </View>
                  <View style={selected.includes(item.key) ? styles.radioSelected : styles.radio} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {/* Track your streaks */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}> 
          <Text style={styles.step}>Track Your Streaks</Text>
          {renderDots()}
          <Text style={styles.title}>{onboardingSteps[1].title}</Text>
          <View style={styles.imageBox}>
            <Image source={onboardingSteps[1].image} style={styles.image} />
          </View>
          <Text style={styles.description}>{onboardingSteps[1].description}</Text>
        </View>

        {/* Daily Progress */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}> 
          <Text style={styles.step}>Daily Progress</Text>
          {renderDots()}
          <Text style={styles.title}>{onboardingSteps[2].title}</Text>
          <Text style={styles.subtitle}>{onboardingSteps[2].subtitle}</Text>
          <View style={styles.imageBox}>
            <Image source={onboardingSteps[2].image} style={styles.image} />
          </View>
          <Text style={styles.description}>{onboardingSteps[2].description}</Text>
          <View style={styles.streakCard}>
            <Text style={styles.streakType}>{onboardingSteps[2].streak?.type ?? ''}</Text>
            <Text style={styles.streakDay}>{onboardingSteps[2].streak ? `Day ${onboardingSteps[2].streak.day} of ${onboardingSteps[2].streak.goal}` : ''}</Text>
          </View>
          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.resetBtn}><Text style={styles.resetBtnText}>Reset Streak</Text></TouchableOpacity>
          </View>
        </View>

        {/* Exclusive Rewards */}
        <View style={[styles.container, { width: SCREEN_WIDTH }]}>
          <Text style={styles.step}>Exclusive Rewards</Text>
          {renderDots()}
          <Text style={styles.title}>{onboardingSteps[3].title}</Text>
          <Text style={styles.subtitle}>{onboardingSteps[3].subtitle}</Text>
          <View style={styles.imageBox}>
            <Image source={onboardingSteps[3].image} style={styles.image} />
          </View>
          <Text style={styles.description}>{onboardingSteps[3].description}</Text>
        </View>

        {/* Welcome/testimonials */}
        <View style={[styles.container, styles.welcomeContainer, { width: SCREEN_WIDTH }]}>
          <Text style={styles.step}>Welcome</Text>
          {renderDots()}
          <Text style={styles.title}>{onboardingSteps[4].title}</Text>
          <Text style={styles.subtitle}>{onboardingSteps[4].subtitle}</Text>
          <View style={styles.testimonialsRow}>
            {onboardingSteps[4].testimonials?.map((t, i) => (
              <View key={i} style={[styles.testimonialCard, { backgroundColor: t.bg }]}> 
                <Image source={t.image} style={styles.testimonialImg} />
                <Text style={styles.testimonialName}>{t.name}</Text>
                <Text style={styles.testimonialText}>{t.text}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.description}>{onboardingSteps[4].description}</Text>
          <Text style={styles.ctaSub}>{onboardingSteps[4].ctaSub}</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{step === onboardingSteps.length - 1 ? '100$/month' : 'Next'}</Text>
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
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  welcomeContainer: {
    paddingTop: 56,
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  step: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  vicesContainer: {
    width: '100%',
    gap: 16,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  imageBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#fbe3d3',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  streakCard: {
    backgroundColor: '#23201c',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
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
    width: '100%',
    marginTop: 16,
  },
  resetBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  nextBtnText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  testimonialsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    gap: 12,
    width: '100%',
  },
  testimonialCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
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
    marginBottom: 4,
    textAlign: 'center',
  },
  testimonialText: {
    color: '#181410',
    fontFamily: 'Space Grotesk',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  ctaSub: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#181410',
    width: '100%',
  },
  cardSelected: {
    borderColor: '#fff',
    backgroundColor: '#23201c',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  cardContent: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  cardDesc: {
    color: '#ababab',
    fontFamily: 'Space Grotesk',
    fontSize: 14,
    lineHeight: 20,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  backBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
    marginTop: 16,
    textAlign: 'center',
  },
  rewardsList: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23201c',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardMilestone: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
    marginRight: 12,
  },
  rewardReward: {
    color: '#ff6a00',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
}); 