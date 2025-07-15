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
  handle: string;
  avatar: string;
  streaks: {
    type: StreakType;
    currentStreak: number;
    icon: string;
  }[];
  totalDays: number;
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
      
      // Call the Supabase function to get community leaderboard
      const { data, error: supabaseError } = await supabase
        .rpc('get_community_leaderboard', { limit_count: 100 });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Transform the data to match our CommunityUser interface
      const transformedUsers: CommunityUser[] = (data || []).map((row: any) => ({
        id: row.user_id,
        handle: row.handle || 'Anonymous',
        avatar: row.avatar_emoji || '🔥',
        streaks: [
          ...(row.smoking_streak > 0 ? [{ type: 'smoking' as StreakType, currentStreak: row.smoking_streak, icon: '🚬' }] : []),
          ...(row.drinking_streak > 0 ? [{ type: 'drinking' as StreakType, currentStreak: row.drinking_streak, icon: '🍺' }] : []),
          ...(row.porn_streak > 0 ? [{ type: 'porn' as StreakType, currentStreak: row.porn_streak, icon: '📱' }] : []),
        ],
        totalDays: row.total_days || 0,
      }));

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

  const renderUserCard = (user: CommunityUser, index: number) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userRank}>
        <Text style={styles.rankNumber}>#{index + 1}</Text>
      </View>
      
      <View style={styles.userAvatar}>
        <Text style={styles.avatarIcon}>{user.avatar}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userHandle}>{user.handle}</Text>
        <Text style={styles.totalDays}>{user.totalDays} total days</Text>
        
        <View style={styles.streaksContainer}>
          {user.streaks.map((streak) => (
            <View key={streak.type} style={styles.streakBadge}>
              <Text style={styles.streakIcon}>{streak.icon}</Text>
              <Text style={styles.streakDays}>{streak.currentStreak}d</Text>
            </View>
          ))}
        </View>
      </View>
      
      {user.id === user?.id && (
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
        <Text style={styles.statsTitle}>Elite 100 Leaderboard</Text>
        <Text style={styles.statsSubtitle}>{communityUsers.length}/100 members committed</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {communityUsers.map((user, index) => renderUserCard(user, index))}
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
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#181410',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ff6a00',
  },
  avatarIcon: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userHandle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
    marginBottom: 4,
  },
  totalDays: {
    color: '#bca89a',
    fontSize: 14,
    fontFamily: 'Space Grotesk',
    marginBottom: 8,
  },
  streaksContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181410',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakDays: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Space Grotesk-Bold',
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
});

export default CommunityScreen; 