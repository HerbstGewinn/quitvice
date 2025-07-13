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
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Path, Svg } from 'react-native-svg';

import { useApp } from '@/context/AppContext';
import { RootStackParamList, StreakType, StreakAttempt } from '@/types';
import { attemptService, getCurrentMilestoneBenefit } from '@/services/supabase';

const { width } = Dimensions.get('window');

type StreakDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StreakDetail'>;
type StreakDetailScreenRouteProp = RouteProp<RootStackParamList, 'StreakDetail'>;

const ACCENT_COLOR = '#ff6a00';
const MUTED_BUTTON_COLOR = '#2d241d';
const MUTED_TEXT_COLOR = '#fff';

const StreakDetailScreen: React.FC = () => {
  const navigation = useNavigation<StreakDetailScreenNavigationProp>();
  const route = useRoute<StreakDetailScreenRouteProp>();
  const { streakType } = route.params;

  const {
    streaks,
    loading,
    error,
    resetStreak,
    getStreakProgress,
    getEncouragement,
    updateStreakProgress
  } = useApp();

  const streak = streaks.find(s => s.type === streakType);
  const currentStreak = streak?.currentStreak || 0;
  const goal = streak?.goal || 66;
  const progress = getStreakProgress(currentStreak, goal);

  const [attempts, setAttempts] = useState<StreakAttempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const streakTypeNames = {
    smoking: 'Quit Smoking',
    drinking: 'Quit Drinking',
    porn: 'Quit Pornography'
  };

  const getBackgroundImage = (type: StreakType): string => {
    const images = {
      smoking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxDFku5EC0mxoMYB-z_EEtcsTg3NxBYnHQslokxHrBKQkHhtQ1I1dZ4Zu9HVfYPIONQQtYOanmNKQ3K12GNfNQsLqJntyVVrQy1zsAE9BEJbmB_t5uClTbR3R7FEeY1NTFlCGjfNFVVmqlX6cnlYiVDnyLihL-Dgyp_wEh3tXmLsHBGfUvnShpSLRlp5PnSsqabMHidzk_BraJ16HoRPq6WVL6sGw_ZDhapdff7grIUJMaiElothOzOS_kMBpJ9g4AXpSsmAI_AUw',
      drinking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCza7q3xZoE8z-E2zYn97U80MCXEwK7oruHwdcVoVjSVm5lqSOsh86jnwAXMtH3aEj_vwXgyg2vkne5r9Hsd5T8sWYKPhI0wHByQVLGeWHZHJJfzLqepxdCC-zdFAAfpf-LGzk_OvHK7CSuhNkts0l5oR9FDNXnPOWgoKnlhwFasswQlDosS-TDw5ZLbSn4yWxGKF2XssgWW0rfibd_eaC7mpykVlVzBaxqod9GFuhOgVxB9G6_yuV92ib1ThZ597uQ__z5WsiFm0Q',
      porn: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-BiGcyeDmWa2tmdC3n1ChbqlnbwFAz3C6YbKUS66vVJ661kZImCiHQCf9n9kmxzDFHYXLOGtg_M60xQGQiRkghckCu4wSsqHbyvdLKvjKm_ndb7d0iLGBGbhkT9ps6ZWkoqljnN7clwU4TaDVmjbFk23oAhqZKRPb97HdIiUJimMnbgIOcE5Aqj5Xnqt9U6xeIitrbVE5qbzlIcM9PteynGHrexbXT3AxyqBHtybTZFBtcGRsGxjnXnnH6bY_MjHjzd450unzA0'
    };
    return images[type];
  };

  const renderProgressBar = () => {
    const milestones = streak?.milestones || [];
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            {/* Milestone markers */}
            {milestones.map((milestone, index) => {
              // Extract day count from milestone ID
              const dayCount = parseInt(milestone.id.split('-').pop() || '0');
              const positionPercent = (dayCount / goal) * 100;
              
              return (
                <View
                  key={milestone.id}
                  style={[
                    styles.milestoneMarker,
                    {
                      left: `${positionPercent}%`,
                      backgroundColor: milestone.isReached ? ACCENT_COLOR : '#474747',
                    }
                  ]}
                >
                  {milestone.isReached && (
                    <View style={styles.milestoneDot}>
                      <Text style={styles.milestoneDotText}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          {/* Milestone labels BELOW the bar */}
          <View style={styles.milestoneLabelsBelow}>
            {milestones.map((milestone) => {
              // Extract day count from milestone ID
              const dayCount = parseInt(milestone.id.split('-').pop() || '0');
              const positionPercent = (dayCount / goal) * 100;
              
              return (
                <View
                  key={milestone.id}
                  style={[
                    styles.milestoneLabel,
                    {
                      left: `${positionPercent}%`,
                      transform: [{ translateX: -20 }],
                    }
                  ]}
                >
                  <Text style={[
                    styles.milestoneLabelText,
                    { color: milestone.isReached ? ACCENT_COLOR : '#ababab' }
                  ]}>
                    {dayCount === goal ? `${dayCount}` : `${dayCount}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const getCurrentBenefit = () => {
    if (!streak?.type) return null;
    return getCurrentMilestoneBenefit(currentStreak, goal, streak.type);
  };

  // Smooth line chart for streak length (static, not interactive)
  const renderHistoryChart = () => {
    // Mock data: 5 values, can be replaced with real attempt durations
    const attemptDurations = [12, 18, 9, 22, 17];
    const maxValue = Math.max(...attemptDurations, 1);
    const chartHeight = 120;
    const chartWidth = 260;
    const points: [number, number][] = attemptDurations.map((v, i) => [
      (i / 4) * (chartWidth - 1),
      chartHeight - (v / maxValue) * (chartHeight - 10) // 10px padding top
    ]);
    // Create smooth SVG path
    const getPath = (pts: [number, number][]): string => {
      if (pts.length < 2) return '';
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x1, y1] = pts[i - 1];
        const [x2, y2] = pts[i];
        const mx = (x1 + x2) / 2;
        d += ` Q${mx},${y1} ${x2},${y2}`;
      }
      return d;
    };
    return (
      <View style={styles.historyChartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Path
            d={getPath(points)}
            fill="none"
            stroke="#e6d5c3"
            strokeWidth={2}
          />
        </Svg>
        <View style={styles.chartLabelsRow}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Text key={num} style={styles.chartLabel}>{num}</Text>
          ))}
        </View>
      </View>
    );
  };

  const handleConfirmToday = async () => {
    if (!streak) {
      Alert.alert('Error', 'No streak found');
      return;
    }
    
    try {
      console.log('Confirming today for streak:', streak.id, 'current:', currentStreak);
      await updateStreakProgress(streak.id, currentStreak + 1);
      Alert.alert('Success', 'Streak updated successfully!');
    } catch (error) {
      console.error('Error confirming today:', error);
      Alert.alert('Error', `Failed to update streak: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = async () => {
    if (!streak?.id) {
      Alert.alert('Error', 'No streak found');
      return;
    }
    
    Alert.alert(
      'Reset Streak',
      'Are you sure you want to reset this streak? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Resetting streak:', streak.id);
              await resetStreak(streak.id);
              Alert.alert('Success', 'Streak reset successfully!');
            } catch (error) {
              console.error('Error resetting streak:', error);
              Alert.alert('Error', `Failed to reset streak: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT_COLOR} />
          <Text style={styles.loadingText}>Loading streak details...</Text>
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{streakTypeNames[streakType]}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: getBackgroundImage(streakType) }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={styles.heroCount}>{currentStreak}/{goal}</Text>
                <Text style={styles.heroLabel}>DAYS</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Progress Section */}
        {renderProgressBar()}
        {getCurrentBenefit() && (
          <View style={styles.milestoneBenefitBox}>
            <Text style={styles.milestoneBenefitText}>{getCurrentBenefit()}</Text>
          </View>
        )}

        {/* History Section */}
        <Text style={styles.sectionTitle}>Attempt History</Text>
        {loadingAttempts ? (
          <View style={styles.loadingAttemptsContainer}>
            <ActivityIndicator size="small" color={ACCENT_COLOR} />
            <Text style={styles.loadingAttemptsText}>Loading history...</Text>
          </View>
        ) : (
          renderHistoryChart()
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmToday}>
          <Text style={styles.confirmButtonText}>Confirm Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Space Grotesk',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  heroBackground: {
    height: 480,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBackgroundImage: {
    borderRadius: 12,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroCount: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -0.033,
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 8,
  },
  heroLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Space Grotesk',
  },
  progressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Space Grotesk-Medium',
    flex: 1,
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Space Grotesk',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#474747',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressBarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  milestoneMarker: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff6a00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneDotText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  milestoneLabels: {
    display: 'none', // hide old above-bar labels
  },
  milestoneLabelsBelow: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 20,
  },
  milestoneLabel: {
    position: 'absolute',
    width: 40,
    alignItems: 'center',
  },
  milestoneLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  progressLabels: {
    color: '#ababab',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Space Grotesk',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  historyContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Space Grotesk-Medium',
    marginBottom: 8,
  },
  historyCurrent: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 8,
  },
  historySubtitle: {
    color: '#ababab',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Space Grotesk',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
  },
  chart: {
    height: 148,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    height: 148,
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#303030',
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  chartLabel: {
    color: '#ababab',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.015,
    fontFamily: 'Space Grotesk-Bold',
  },
  resetContainer: {
    alignItems: 'center',
    paddingVertical: 12,
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
  loadingAttemptsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingAttemptsText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
    fontFamily: 'Space Grotesk',
  },
  historyChartContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chartLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
    marginTop: 2,
    marginBottom: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 16,
    gap: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: MUTED_BUTTON_COLOR,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  resetButtonText: {
    color: MUTED_TEXT_COLOR,
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  chartPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ACCENT_COLOR,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    backgroundColor: '#181410',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipText: {
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 16,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationText: {
    color: ACCENT_COLOR,
    fontFamily: 'Space Grotesk-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  milestoneBenefitBox: {
    backgroundColor: '#23201d',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
  },
  milestoneBenefitText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
  },
});

export default StreakDetailScreen; 