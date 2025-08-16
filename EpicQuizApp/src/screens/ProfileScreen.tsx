/**
 * Profile Screen - User settings and account management
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Card } from '../components/common';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleEditProfile = () => {
    Alert.alert('✏️ Edit Profile', 'Profile customization coming soon!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    Alert.alert('⚙️ Setting Updated', `${setting} has been ${value ? 'enabled' : 'disabled'}.`);
  };

  const handleMenuOption = (option: string) => {
    Alert.alert(`${option}`, `${option} functionality coming soon!`, [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      '🚪 Sign Out', 
      'Are you sure you want to sign out? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          Alert.alert('👋 Signed Out', 'You have been signed out successfully.');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>🎓</Text>
          </View>
          <Text style={styles.username}>Epic Learner</Text>
          <Text style={styles.userTitle}>Knowledge Seeker</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>🎯 Your Learning Journey</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>78%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </Card>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          
          <Card style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>🔔 Notifications</Text>
                <Text style={styles.settingDesc}>Get reminded to practice daily</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => {
                  setNotificationsEnabled(value);
                  handleSettingChange('Notifications', value);
                }}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.primarySaffron + '50' }}
                thumbColor={notificationsEnabled ? theme.colors.primarySaffron : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>🌙 Dark Mode</Text>
                <Text style={styles.settingDesc}>Switch to dark theme</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={(value) => {
                  setDarkModeEnabled(value);
                  handleSettingChange('Dark Mode', value);
                }}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.primarySaffron + '50' }}
                thumbColor={darkModeEnabled ? theme.colors.primarySaffron : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>🔊 Sound Effects</Text>
                <Text style={styles.settingDesc}>Enable quiz sound feedback</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={(value) => {
                  setSoundEnabled(value);
                  handleSettingChange('Sound Effects', value);
                }}
                trackColor={{ false: theme.colors.lightGray, true: theme.colors.primarySaffron + '50' }}
                thumbColor={soundEnabled ? theme.colors.primarySaffron : '#f4f3f4'}
              />
            </View>
          </Card>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Account</Text>
          
          {[
            { icon: '📧', title: 'Email Preferences', desc: 'Manage your email settings' },
            { icon: '🔒', title: 'Privacy & Security', desc: 'Control your data and privacy' },
            { icon: '📱', title: 'Connected Devices', desc: 'Manage synced devices' },
            { icon: '💾', title: 'Data Export', desc: 'Download your learning data' }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuOption(item.title)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Support & Info</Text>
          
          {[
            { icon: '❓', title: 'Help & FAQ', desc: 'Get answers to common questions' },
            { icon: '📞', title: 'Contact Support', desc: 'Reach out to our team' },
            { icon: '⭐', title: 'Rate the App', desc: 'Share your experience' },
            { icon: 'ℹ️', title: 'About Epic Quiz', desc: 'App version and info' }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuOption(item.title)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleLogout}
        >
          <Text style={styles.signOutText}>🚪 Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Epic Quiz App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgrounds.primary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: ComponentSpacing.screenHorizontal,
    paddingBottom: ComponentSpacing.screenVertical,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.l,
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primarySaffron + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
    borderWidth: 3,
    borderColor: theme.colors.primarySaffron + '40',
  },
  
  avatarText: {
    fontSize: 32,
  },
  
  username: {
    ...Typography.h1,
    color: theme.text.primary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  userTitle: {
    ...Typography.body,
    color: theme.text.secondary,
    marginBottom: Spacing.l,
  },
  
  editButton: {
    backgroundColor: theme.colors.primarySaffron + '15',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primarySaffron + '30',
  },
  
  editButtonText: {
    ...Typography.body,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
  },

  // Stats Card
  statsCard: {
    padding: Spacing.l,
    marginBottom: Spacing.xl,
  },
  
  statsTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statNumber: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  statLabel: {
    ...Typography.caption,
    color: theme.text.secondary,
  },

  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  
  sectionTitle: {
    ...Typography.h2,
    color: theme.text.primary,
    marginBottom: Spacing.l,
    fontWeight: '600',
  },

  // Settings Card
  settingsCard: {
    padding: 0,
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  
  settingInfo: {
    flex: 1,
    marginRight: Spacing.m,
  },
  
  settingTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  settingDesc: {
    ...Typography.caption,
    color: theme.text.secondary,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.m,
    width: 24,
    textAlign: 'center',
  },
  
  menuContent: {
    flex: 1,
  },
  
  menuTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  menuDesc: {
    ...Typography.caption,
    color: theme.text.secondary,
  },
  
  menuArrow: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    marginLeft: Spacing.s,
  },

  // Sign Out Button
  signOutButton: {
    backgroundColor: '#ff4444' + '15',
    padding: Spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#ff4444' + '30',
  },
  
  signOutText: {
    ...Typography.subtitle,
    color: '#ff4444',
    fontWeight: '600',
  },

  // Version
  versionText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
});

export default ProfileScreen;