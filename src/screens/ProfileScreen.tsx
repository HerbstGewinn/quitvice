import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Switch,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useApp } from '@/context/AppContext';
import { RootStackParamList } from '@/types';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = useApp();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Export data pressed');
  };

  const handlePrivacyPolicy = () => {
    // TODO: Navigate to privacy policy
    console.log('Privacy policy pressed');
  };

  const handleTermsOfService = () => {
    // TODO: Navigate to terms of service
    console.log('Terms of service pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <ImageBackground
                source={{ 
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjAnggZ2jB8p4qRDCkJhx7NqXTu6_yLYL49B5lIkr9ySN7sGP8tM2WoGamFJh_Ds1AXpcTIv1yZag2dfRGEFwCoKtjSMsP6G9XahFW-3zw9wMOKEcXIyTVJ-XtKIDH-PP9ES-4SeYfBPh4FqL2V3MerO3U5Lms2BOTb4espiyVFHNK1XdmVuaGLPazhzJPThmNifBFLu1ofEgZyxGgT8Cb0RImve_SqrO7VWWyB8rFPzIRplpdOGEjEq_a6j8Cq0Y8jETGcu-V8zI'
                }}
                style={styles.profileImage}
                imageStyle={styles.profileImageStyle}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Ethan'}</Text>
              <Text style={styles.profileUsername}>@ethan_miller</Text>
            </View>
          </View>

          {/* Subscription Section */}
          <View style={styles.subscriptionSection}>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionLabel}>Subscription</Text>
              <Text style={styles.subscriptionStatus}>Active</Text>
              <Text style={styles.subscriptionRenewal}>Next renewal: 08/15/2024</Text>
            </View>
            <View style={styles.subscriptionImageContainer}>
              <ImageBackground
                source={{ 
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiA05jmkqQqcWWG_Qpg-LzlxCYQBnhkMgYgnNe6z_2TvCMF8wjHcNqdFOvCUkSLRTfZFQdpzweM9fVC1q2RaD0iM4Nx8l2dWyt9Rvi5u9mwY2Sv2eFAecZ6uJfqAclN4Wlf_XyNqcFGPVGDAveMLSl3CZ-c6nQTIH-PT4DZX2eio0guJbttwHchSX038hQmEsjv1re7-nhr_MW8AfIdMHC3Opch95BVy0TNzugxf3yVRrDyLFsIcrsZh3LidWUdAe2WlJ9V39cCX0'
                }}
                style={styles.subscriptionImage}
                imageStyle={styles.subscriptionImageStyle}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <Text style={styles.preferencesTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3a2f27', true: '#ff6a00' }}
              thumbColor="#FFFFFF"
              style={styles.switch}
            />
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#3a2f27', true: '#ff6a00' }}
              thumbColor="#FFFFFF"
              style={styles.switch}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExportData}
          >
            <Text style={styles.exportButtonText}>Export Data</Text>
          </TouchableOpacity>
          
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={handlePrivacyPolicy}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.legalSeparator}> · </Text>
            <TouchableOpacity onPress={handleTermsOfService}>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181410',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181410',
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
    fontWeight: '400',
    fontFamily: 'Space Grotesk',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
  },
  headerSpacer: {
    width: 48,
  },
  scrollContent: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  profileImageStyle: {
    borderRadius: 64,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    textAlign: 'center',
  },
  profileUsername: {
    color: '#bca89a',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 20,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
  },
  subscriptionSection: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  subscriptionInfo: {
    flex: 2,
    gap: 4,
  },
  subscriptionLabel: {
    color: '#bca89a',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 16,
    fontFamily: 'Space Grotesk',
  },
  subscriptionStatus: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
    fontFamily: 'Space Grotesk-Bold',
  },
  subscriptionRenewal: {
    color: '#bca89a',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 16,
    fontFamily: 'Space Grotesk',
  },
  subscriptionImageContainer: {
    flex: 1,
  },
  subscriptionImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
  },
  subscriptionImageStyle: {
    borderRadius: 12,
  },
  preferencesTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
    letterSpacing: -0.015,
    fontFamily: 'Space Grotesk-Bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#181410',
    paddingHorizontal: 16,
    minHeight: 56,
    justifyContent: 'space-between',
  },
  preferenceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 20,
    fontFamily: 'Space Grotesk',
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  exportButton: {
    minWidth: 84,
    maxWidth: 480,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
    letterSpacing: 0.015,
    fontFamily: 'Space Grotesk-Bold',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  legalLink: {
    color: '#bca89a',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 16,
    fontFamily: 'Space Grotesk',
  },
  legalSeparator: {
    color: '#bca89a',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 16,
    fontFamily: 'Space Grotesk',
  },
});

export default ProfileScreen; 