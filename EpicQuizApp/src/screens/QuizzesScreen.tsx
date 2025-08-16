/**
 * Quizzes Screen - Quick access to quizzes and learning features
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Button, Card } from '../components/common';

const QuizzesScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleStartQuiz = (epicId: string) => {
    Alert.alert('🎯 Start Quiz', `Ready to test your knowledge of ${epicId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Begin Quiz', onPress: () => {
        // Navigate to quiz screen
        (navigation as any).navigate('Quiz', {
          epic: {
            id: epicId,
            title: epicId === 'ramayana' ? 'The Ramayana' : 'Unknown Epic',
            totalQuestions: 19,
            estimatedTime: '5-8 min',
            isAvailable: true
          }
        });
      }}
    ]);
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
          <Text style={styles.title}>🎯 Ready to Learn?</Text>
          <Text style={styles.subtitle}>Choose your quiz adventure</Text>
        </View>

        {/* Quick Start Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Start</Text>
          
          <TouchableOpacity 
            style={styles.quickStartCard}
            onPress={() => handleStartQuiz('ramayana')}
          >
            <View style={styles.quickStartIcon}>
              <Text style={styles.quickStartEmoji}>🕉️</Text>
            </View>
            <View style={styles.quickStartContent}>
              <Text style={styles.quickStartTitle}>Continue Bala Kanda</Text>
              <Text style={styles.quickStartSubtitle}>Ready for Sarga 2 questions?</Text>
            </View>
            <Text style={styles.quickStartArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Available Quizzes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Available Quizzes</Text>
          
          <Card style={styles.quizCard}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizEmoji}>🕉️</Text>
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>Bala Kanda - The Beginning</Text>
                <Text style={styles.quizDescription}>Origin story and divine narration</Text>
              </View>
            </View>
            <View style={styles.quizStats}>
              <Text style={styles.statText}>📊 2 Sargas available (Sarga 1 ✓, Sarga 2 📚)</Text>
              <Text style={styles.statText}>⭐ Foundation level</Text>
            </View>
            <Button
              title="Continue to Sarga 2"
              onPress={() => handleStartQuiz('bala_kanda_sarga_2')}
              variant="primary"
              style={styles.quizButton}
            />
          </Card>

          {/* Locked Kanda */}
          <Card style={[styles.quizCard, styles.lockedCard]}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizEmoji}>🏰</Text>
              <View style={styles.quizInfo}>
                <Text style={[styles.quizTitle, styles.lockedText]}>Ayodhya Kanda - Royal Court</Text>
                <Text style={[styles.quizDescription, styles.lockedText]}>Rama's coronation and exile decree</Text>
              </View>
            </View>
            <View style={styles.lockedBanner}>
              <Text style={styles.lockedBannerText}>🔒 Complete all 77 Bala Kanda Sargas first</Text>
            </View>
          </Card>

          <Card style={[styles.quizCard, styles.lockedCard]}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizEmoji}>🌲</Text>
              <View style={styles.quizInfo}>
                <Text style={[styles.quizTitle, styles.lockedText]}>Aranya Kanda - Forest Life</Text>
                <Text style={[styles.quizDescription, styles.lockedText]}>Exile begins and trials in the forest</Text>
              </View>
            </View>
            <View style={styles.lockedBanner}>
              <Text style={styles.lockedBannerText}>🚧 Unlock after Ayodhya Kanda</Text>
            </View>
          </Card>
        </View>

        {/* Quiz Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Focus Areas</Text>
          
          <View style={styles.categoriesGrid}>
            {[
              { icon: '👑', title: 'Characters', desc: 'Heroes & villains' },
              { icon: '⚡', title: 'Events', desc: 'Key moments' },
              { icon: '💭', title: 'Themes', desc: 'Deep meanings' },
              { icon: '🏛️', title: 'Culture', desc: 'Traditions & context' }
            ].map((category, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.categoryCard}
                onPress={() => Alert.alert(`${category.icon} ${category.title}`, 'Category-specific quizzes coming soon!')}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDesc}>{category.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  
  // Quick Start Styles
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySaffron + '15',
    padding: Spacing.l,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron + '30',
  },
  
  quickStartIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primarySaffron + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  
  quickStartEmoji: {
    fontSize: 24,
  },
  
  quickStartContent: {
    flex: 1,
  },
  
  quickStartTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  quickStartSubtitle: {
    ...Typography.body,
    color: theme.text.secondary,
  },
  
  quickStartArrow: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
  },
  
  // Quiz Card Styles
  quizCard: {
    padding: Spacing.l,
    marginBottom: Spacing.m,
  },
  
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  
  quizEmoji: {
    fontSize: 32,
    marginRight: Spacing.m,
  },
  
  quizInfo: {
    flex: 1,
  },
  
  quizTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  quizDescription: {
    ...Typography.body,
    color: theme.text.secondary,
  },
  
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  
  statText: {
    ...Typography.caption,
    color: theme.text.tertiary,
  },
  
  quizButton: {
    marginTop: Spacing.s,
  },
  
  // Locked Card Styles
  lockedCard: {
    opacity: 0.6,
  },
  
  lockedText: {
    color: theme.text.tertiary,
  },
  
  lockedBanner: {
    backgroundColor: theme.colors.lightGray,
    padding: Spacing.s,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  lockedBannerText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontWeight: '600',
  },
  
  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  categoryCard: {
    width: '48%',
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  
  categoryIcon: {
    fontSize: 24,
    marginBottom: Spacing.s,
  },
  
  categoryTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  categoryDesc: {
    ...Typography.caption,
    color: theme.text.secondary,
    textAlign: 'center',
  },
});

export default QuizzesScreen;