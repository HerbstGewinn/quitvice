import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useApp } from '@/context/AppContext';
import { RootStackParamList, StreakType } from '@/types';
import { supabase } from '@/services/supabase';

type CommunityScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Community'>;

interface CommunityUser {
  id: string;
  name: string;
  email: string;
  highestStreak: number;
  streakType: StreakType;
  streakIcon: string;
}

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { user } = useApp();
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCommunityUsers();
  }, []);

  const loadCommunityUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all users with their streaks
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          streaks:streaks(
            type,
            current_streak,
            is_active
          )
        `)
        .order('name');

      if (usersError) {
        console.error('Supabase error:', usersError);
        throw new Error(usersError.message);
      }

      // Transform the data to get each user's highest streak
      const validUsers: CommunityUser[] = [];
      
      (usersData || []).forEach((userData: any) => {
        const activeStreaks = userData.streaks?.filter((s: any) => s.is_active) || [];
        
        if (activeStreaks.length === 0) {
          return; // Skip users with no active streaks
        }

        // Find the highest current streak
        let highestStreak = 0;
        let streakType: StreakType = 'smoking';
        
        activeStreaks.forEach((streak: any) => {
          if (streak.current_streak > highestStreak) {
            highestStreak = streak.current_streak;
            streakType = streak.type;
          }
        });

        if (highestStreak === 0) {
          return; // Skip users with 0 streaks
        }

        const getStreakIcon = (type: StreakType): string => {
          const icons = {
            smoking: '🚬',
            drinking: '🍺',
            porn: '📱'
          };
          return icons[type];
        };

        validUsers.push({
          id: userData.id,
          name: userData.name || 'Anonymous',
          email: userData.email,
          highestStreak,
          streakType,
          streakIcon: getStreakIcon(streakType),
        });
      });

      // Sort by highest streak descending
      const transformedUsers = validUsers.sort((a, b) => b.highestStreak - a.highestStreak);

      setCommunityUsers(transformedUsers);
    } catch (err: any) {
      console.error('Error loading community users:', err);
      setError(err.message || 'Failed to load community members');
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getStreakTypeNames = (type: StreakType): string => {
    const names = {
      smoking: 'Smoking',
      drinking: 'Drinking',
      porn: 'Porn'
    };
    return names[type];
  };

  const renderUserCard = (userData: CommunityUser, index: number) => (
    <View key={userData.id} style={styles.userCard}>
      <View style={styles.userRank}>
        <Text style={styles.rankNumber}>#{index + 1}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name}</Text>
        <View style={styles.streakInfo}>
          <Text style={styles.streakIcon}>{userData.streakIcon}</Text>
          <Text style={styles.streakText}>
            {userData.highestStreak} days - {getStreakTypeNames(userData.streakType)}
          </Text>
        </View>
      </View>
      
      {userData.id === user?.id && (
        <View style={styles.youBadge}>
          <Text style={styles.youText}>YOU</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6a00" />
          <Text style={styles.loadingText}>Loading community...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCommunityUsers}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Leaderboard</Text>
        <Text style={styles.statsSubtitle}>Highest current streaks</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {communityUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active streaks found</Text>
          </View>
        ) : (
          communityUsers.map((userData, index) => renderUserCard(userData, index))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181410',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Space Grotesk-Bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
  },
  headerSpacer: {
    width: 48,
  },
  statsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 4,
  },
  statsSubtitle: {
    color: '#bca89a',
    fontSize: 16,
    fontFamily: 'Space Grotesk',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23201d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  userRank: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    color: '#ff6a00',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 4,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  streakText: {
    color: '#bca89a',
    fontSize: 14,
    fontFamily: 'Space Grotesk',
  },
  youBadge: {
    backgroundColor: '#ff6a00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  youText: {
    color: '#fff',
    fontSize: 12,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff6a00',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#bca89a',
    fontSize: 16,
    fontFamily: 'Space Grotesk',
  },
});

export default CommunityScreen; 