import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useApp } from '@/context/AppContext';
import { RootStackParamList, StreakType, Milestone } from '@/types';
import { streakService } from '@/services/supabase';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    streaks, 
    quotes, 
    loading, 
    error, 
    user,
    loadUserStreaks,
    getStreakProgress,
    getEncouragement 
  } = useApp();

  const [recentMilestone, setRecentMilestone] = useState<Milestone | null>(null);
  const [showMilestoneNotification, setShowMilestoneNotification] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (user) {
      loadUserStreaks();
    }
  }, [user]);

  useEffect(() => {
    // Check for recent milestones
    const checkRecentMilestones = () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      
      for (const streak of streaks) {
        if (streak.milestones) {
          const recent = streak.milestones.find(m => 
            m.isReached && m.reachedAt && new Date(m.reachedAt) > twoDaysAgo
          );
          if (recent) {
            setRecentMilestone(recent);
            setShowMilestoneNotification(true);
            showMilestoneAnimation();
            break;
          }
        }
      }
    };

    if (streaks.length > 0) {
      checkRecentMilestones();
    }
  }, [streaks]);

  const showMilestoneAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMilestoneNotification(false);
    });
  };

  const handleStreakPress = (streakType: StreakType) => {
    navigation.navigate('StreakDetail', { streakType });
  };

  const handleSettingsPress = () => {
    navigation.navigate('Profile');
  };

  const getStreakData = (type: StreakType) => {
    return streaks.find(streak => streak.type === type);
  };

  const getActivityIcon = (type: StreakType): string => {
    const icons = {
      smoking: '🚬',
      drinking: '🍺',
      porn: '📱'
    };
    return icons[type];
  };

  const getBackgroundImage = (type: StreakType): string => {
    const images = {
      smoking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxDFku5EC0mxoMYB-z_EEtcsTg3NxBYnHQslokxHrBKQkHhtQ1I1dZ4Zu9HVfYPIONQQtYOanmNKQ3K12GNfNQsLqJntyVVrQy1zsAE9BEJbmB_t5uClTbR3R7FEeY1NTFlCGjfNFVVmqlX6cnlYiVDnyLihL-Dgyp_wEh3tXmLsHBGfUvnShpSLRlp5PnSsqabMHidzk_BraJ16HoRPq6WVL6sGw_ZDhapdff7grIUJMaiElothOzOS_kMBpJ9g4AXpSsmAI_AUw',
      drinking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCza7q3xZoE8z-E2zYn97U80MCXEwK7oruHwdcVoVjSVm5lqSOsh86jnwAXMtH3aEj_vwXgyg2vkne5r9Hsd5T8sWYKPhI0wHByQVLGeWHZHJJfzLqepxdCC-zdFAAfpf-LGzk_OvHK7CSuhNkts0l5oR9FDNXnPOWgoKnlhwFasswQlDosS-TDw5ZLbSn4yWxGKF2XssgWW0rfibd_eaC7mpykVlVzBaxqod9GFuhOgVxB9G6_yuV92ib1ThZ597uQ__z5WsiFm0Q',
      porn: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-BiGcyeDmWa2tmdC3n1ChbqlnbwFAz3C6YbKUS66vVJ661kZImCiHQCf9n9kmxzDFHYXLOGtg_M60xQGQiRkghckCu4wSsqHbyvdLKvjKm_ndb7d0iLGBGbhkT9ps6ZWkoqljnN7clwU4TaDVmjbFk23oAhqZKRPb97HdIiUJimMnbgIOcE5Aqj5Xnqt9U6xeIitrbVE5qbzlIcM9PteynGHrexbXT3AxyqBHtybTZFBtcGRsGxjnXnnH6bY_MjHjzd450unzA0'
    };
    return images[type];
  };

  const renderStreakCard = (streakType: StreakType) => {
    const streakTypeNames = {
      smoking: 'Smoking',
      drinking: 'Drinking',
      porn: 'Pornography'
    };

    const streak = getStreakData(streakType);
    const currentStreak = streak?.currentStreak || 0;
    const goal = streak?.goal || 66;
    const progress = getStreakProgress(currentStreak, goal);
    const encouragement = getEncouragement(progress);

    return (
      <TouchableOpacity
        key={streakType}
        style={styles.streakCard}
        onPress={() => handleStreakPress(streakType)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: getBackgroundImage(streakType) }}
          style={styles.streakBackground}
          imageStyle={styles.streakBackgroundImage}
        >
          <View style={styles.streakOverlay}>
            <View style={styles.streakContent}>
              <View style={styles.streakHeader}>
                <Text style={styles.streakIcon}>{getActivityIcon(streakType)}</Text>
                <Text style={styles.streakLabel}>{streakTypeNames[streakType]}</Text>
              </View>
              <Text style={styles.streakCount}>{currentStreak}/{goal}</Text>
              <Text style={styles.streakEncouragement}>{encouragement}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderMotivationalCard = (quote: any, index: number) => (
    <View key={index} style={styles.motivationalCard}>
      <ImageBackground
        source={{ uri: quote.imageUrl || quote.image }}
        style={styles.motivationalImage}
        imageStyle={styles.motivationalImageStyle}
      />
      <Text style={styles.motivationalText}>{quote.text}</Text>
    </View>
  );

  const pastStreaksMock = [
    {
      type: 'smoking',
      name: 'Smoking',
      icon: '🔥',
      completed: false,
      days: 18,
    },
    {
      type: 'drinking',
      name: 'Drinking',
      icon: '🍷',
      completed: false,
      days: 22,
    },
    {
      type: 'porn',
      name: 'Pornography',
      icon: '🎬',
      completed: true,
      days: 66,
    },
  ];

  const renderPastStreaks = () => (
    <View style={styles.pastStreaksSection}>
      <Text style={styles.pastStreaksTitle}>Past Streaks</Text>
      {pastStreaksMock.map((streak, idx) => (
        <View key={streak.type} style={styles.pastStreakCard}>
          <View style={styles.pastStreakIconBox}>
            <Text style={styles.pastStreakIcon}>{streak.icon}</Text>
          </View>
          <View style={styles.pastStreakInfo}>
            <Text style={styles.pastStreakName}>{streak.name}</Text>
            <Text style={styles.pastStreakStatus}>
              {streak.completed
                ? `Completed ${streak.days} days`
                : `Uncompleted`}
            </Text>
          </View>
          {streak.completed && <Text style={styles.pastStreakCheck}>✓</Text>}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6a00" />
          <Text style={styles.loadingText}>Loading your streaks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Milestone Notification */}
      {showMilestoneNotification && recentMilestone && (
        <Animated.View style={[styles.milestoneNotification, { opacity: fadeAnim }]}>
          <Text style={styles.milestoneIcon}>🎉</Text>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>{recentMilestone.title}</Text>
            <Text style={styles.milestoneDescription}>{recentMilestone.description}</Text>
          </View>
        </Animated.View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Streaks</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Streak Cards */}
        {(['smoking', 'drinking', 'porn'] as StreakType[]).map(streakType =>
          renderStreakCard(streakType)
        )}

        {/* Motivational Quotes */}
        {quotes.length > 0 && (
          <View style={styles.motivationalSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.motivationalScroll}
            >
              {quotes.map((quote, index) =>
                renderMotivationalCard(quote, index)
              )}
            </ScrollView>
          </View>
        )}
        {renderPastStreaks()}
      </ScrollView>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181410',
  },
  milestoneNotification: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#ff6a00',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  milestoneIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 2,
  },
  milestoneDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Space Grotesk',
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    paddingLeft: 48,
  },
  settingsButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  streakCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  streakBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  streakBackgroundImage: {
    borderRadius: 12,
  },
  streakOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  streakContent: {
    // Removed gap, using marginBottom instead
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  streakLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Space Grotesk',
  },
  streakCount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 4,
  },
  streakEncouragement: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Space Grotesk-Medium',
  },
  motivationalSection: {
    marginTop: 16,
  },
  motivationalScroll: {
    paddingHorizontal: 16,
  },
  motivationalCard: {
    width: 160,
    marginRight: 12,
  },
  motivationalImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  motivationalImageStyle: {
    borderRadius: 12,
  },
  motivationalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Space Grotesk-Medium',
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6a00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Space Grotesk',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6a00',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Space Grotesk',
  },
  pastStreaksSection: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  pastStreaksTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 12,
  },
  pastStreakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23201d',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  pastStreakIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#181410',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pastStreakIcon: {
    fontSize: 22,
  },
  pastStreakInfo: {
    flex: 1,
  },
  pastStreakName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  pastStreakStatus: {
    color: '#bca89a',
    fontSize: 14,
    fontFamily: 'Space Grotesk',
    marginTop: 2,
  },
  pastStreakCheck: {
    color: '#fff',
    fontSize: 22,
    marginLeft: 8,
  },
});

export default HomeScreen; 