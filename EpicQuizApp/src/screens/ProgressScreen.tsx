/**
 * Progress Screen - User learning analytics and achievements
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Card } from '../components/common';

const ProgressScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleViewDetails = (section: string) => {
    Alert.alert(`📊 ${section}`, 'Detailed analytics coming soon!', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleAchievementTap = (achievement: string) => {
    Alert.alert(`🏆 ${achievement}`, 'Achievement details and badge collection coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Your Journey</Text>
          <Text style={styles.subtitle}>Track your learning progress</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Quick Stats</Text>
          
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Questions Answered</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>78%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Quizzes Completed</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </Card>
          </View>
        </View>

        {/* Epic Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕉️ Epic Progress</Text>
          
          <TouchableOpacity 
            style={styles.progressCard}
            onPress={() => handleViewDetails('Bala Kanda Progress')}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressIcon}>🕉️</Text>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Bala Kanda</Text>
                <Text style={styles.progressSubtitle}>The Beginning - Ramayana</Text>
              </View>
              <Text style={styles.progressPercentage}>50%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '50%' }]} />
              </View>
            </View>
            
            <View style={styles.progressDetails}>
              <Text style={styles.progressDetailText}>🎯 Sarga 1 ✓ | Sarga 2 📚 Available</Text>
              <Text style={styles.progressDetailText}>📊 2 of 77 Sargas unlocked</Text>
            </View>
          </TouchableOpacity>

          {/* Locked Epic */}
          <TouchableOpacity 
            style={[styles.progressCard, styles.lockedCard]}
            onPress={() => Alert.alert('🔒 Locked', 'Complete Bala Kanda (all 77 Sargas) to unlock Ayodhya Kanda!')}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressIcon}>🏰</Text>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressTitle, styles.lockedText]}>Ayodhya Kanda</Text>
                <Text style={[styles.progressSubtitle, styles.lockedText]}>The Royal Court - Ramayana</Text>
              </View>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>
          
          <View style={styles.achievementsGrid}>
            {[
              { icon: '👑', title: 'Character Master', desc: 'Ace 10 character questions', earned: true },
              { icon: '⚡', title: 'Speed Learner', desc: 'Complete quiz in under 3 mins', earned: true },
              { icon: '🎯', title: 'Perfect Score', desc: 'Get 100% on any quiz', earned: false },
              { icon: '🔥', title: 'Hot Streak', desc: '7-day learning streak', earned: false }
            ].map((achievement, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.unearned
                ]}
                onPress={() => handleAchievementTap(achievement.title)}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.unearnedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDesc,
                  !achievement.earned && styles.unearnedText
                ]}>
                  {achievement.desc}
                </Text>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learning Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Category Breakdown</Text>
          
          {[
            { name: 'Characters', score: 85, total: 23, icon: '👑' },
            { name: 'Plot Events', score: 72, total: 31, icon: '⚡' },
            { name: 'Themes', score: 68, total: 19, icon: '💭' },
            { name: 'Cultural Context', score: 45, total: 15, icon: '🏛️' }
          ].map((category, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.categoryRow}
              onPress={() => handleViewDetails(`${category.name} Analysis`)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryStats}>
                  {Math.round(category.total * category.score / 100)}/{category.total} correct
                </Text>
              </View>
              <View style={styles.categoryScore}>
                <Text style={styles.categoryPercentage}>{category.score}%</Text>
                <View style={styles.miniProgressBar}>
                  <View style={[
                    styles.miniProgressFill, 
                    { width: `${category.score}%` }
                  ]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  
  title: {
    ...Typography.h1,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
  },
  
  subtitle: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  
  section: {
    marginBottom: Spacing.xl,
  },
  
  sectionTitle: {
    ...Typography.h2,
    color: theme.text.primary,
    marginBottom: Spacing.l,
    fontWeight: '600',
  },

  // Stats Section
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.m,
    marginHorizontal: Spacing.xs,
  },
  
  statNumber: {
    ...Typography.h1,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  statLabel: {
    ...Typography.caption,
    color: theme.text.secondary,
    textAlign: 'center',
  },

  // Progress Section
  progressCard: {
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.l,
    borderRadius: 16,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  
  progressIcon: {
    fontSize: 28,
    marginRight: Spacing.m,
  },
  
  progressInfo: {
    flex: 1,
  },
  
  progressTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  progressSubtitle: {
    ...Typography.caption,
    color: theme.text.secondary,
  },
  
  progressPercentage: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
  },
  
  progressBarContainer: {
    marginBottom: Spacing.m,
  },
  
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primarySaffron,
  },
  
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  progressDetailText: {
    ...Typography.caption,
    color: theme.text.tertiary,
  },
  
  // Locked Card
  lockedCard: {
    opacity: 0.6,
  },
  
  lockedText: {
    color: theme.text.tertiary,
  },
  
  lockIcon: {
    fontSize: 20,
    color: theme.text.tertiary,
  },

  // Achievements Section
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  achievementCard: {
    width: '48%',
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.m,
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron + '30',
    position: 'relative',
  },
  
  unearned: {
    borderColor: theme.colors.lightGray,
    opacity: 0.6,
  },
  
  achievementIcon: {
    fontSize: 24,
    marginBottom: Spacing.s,
  },
  
  achievementTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  
  achievementDesc: {
    ...Typography.caption,
    color: theme.text.secondary,
    textAlign: 'center',
  },
  
  unearnedText: {
    color: theme.text.tertiary,
  },
  
  earnedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySaffron,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  earnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },

  // Categories Section
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  
  categoryIcon: {
    fontSize: 20,
    marginRight: Spacing.m,
    width: 24,
    textAlign: 'center',
  },
  
  categoryInfo: {
    flex: 1,
  },
  
  categoryName: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  categoryStats: {
    ...Typography.caption,
    color: theme.text.secondary,
  },
  
  categoryScore: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  
  categoryPercentage: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  miniProgressBar: {
    width: 50,
    height: 4,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  miniProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primarySaffron,
  },
});

export default ProgressScreen;