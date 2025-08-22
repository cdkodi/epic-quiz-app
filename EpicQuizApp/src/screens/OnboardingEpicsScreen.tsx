/**
 * Onboarding Epics Screen - Epic selection for new users
 * Simple, focused epic library for onboarding flow
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Card, Button, EpicImage } from '../components/common';

interface OnboardingEpic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  difficultyIcon: string;
  questionCount: number | string;
  isAvailable: boolean;
  status: string;
}

const OnboardingEpicsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Simplified epic data for onboarding
  const onboardingEpics: OnboardingEpic[] = [
    {
      id: 'ramayana',
      title: 'THE RAMAYANA',
      description: 'Journey of honor, duty, and divine love. Learn about Rama\'s exile and triumph over evil.',
      icon: '🕉️',
      difficulty: 'Beginner Friendly',
      difficultyIcon: '⭐',
      questionCount: 342,
      isAvailable: true,
      status: 'Start Learning'
    },
    {
      id: 'mahabharata',
      title: 'THE MAHABHARATA',
      description: 'Epic tale of cosmic war and moral complexity. Explore dharma through the great battle.',
      icon: '⚔️',
      difficulty: 'Advanced Level',
      difficultyIcon: '💎',
      questionCount: 'Coming Soon',
      isAvailable: false,
      status: 'Complete Ramayana First'
    },
    {
      id: 'bhagavad_gita',
      title: 'THE BHAGAVAD GITA',
      description: 'Divine dialogue on duty and spiritual wisdom. Krishna\'s eternal teachings to Arjuna.',
      icon: '📿',
      difficulty: 'Intermediate Level',
      difficultyIcon: '⚡',
      questionCount: 'Coming Soon',
      isAvailable: false,
      status: 'Unlock with Progress'
    }
  ];

  const handleEpicSelect = (epic: OnboardingEpic) => {
    if (!epic.isAvailable) {
      return; // Do nothing for unavailable epics
    }

    // Navigate to main app focused on the selected epic
    navigation.navigate('MainTabs', { 
      screen: 'Home',
      params: { selectedEpic: epic.id }
    });
  };

  const handleBrowseAll = () => {
    // Navigate to main app Epic Library
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'ios' ? true : false}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        decelerationRate="normal"
        maximumZoomScale={1}
        minimumZoomScale={1}
        scrollEnabled={true}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>📚 Choose Your Epic Journey</Text>
          <Text style={styles.subtitle}>
            Discover the stories that shaped civilizations
          </Text>
        </View>

        {/* How It Works Section */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📖 How It Works</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>
              • Answer questions about epic stories and characters
            </Text>
            <Text style={styles.instructionItem}>
              • Get instant explanations for every answer
            </Text>
            <Text style={styles.instructionItem}>
              • Track your progress through different chapters
            </Text>
            <Text style={styles.instructionItem}>
              • Explore deeper cultural insights as you learn
            </Text>
          </View>
        </Card>

        {/* Epics Section */}
        <View style={styles.epicsSection}>
          {onboardingEpics.map((epic) => (
            <TouchableOpacity
              key={epic.id}
              onPress={() => handleEpicSelect(epic)}
              disabled={!epic.isAvailable}
              style={[
                styles.epicCardContainer,
                !epic.isAvailable && styles.epicCardDisabled
              ]}
            >
              <Card style={styles.epicCard}>
                {/* Epic Image */}
                <EpicImage
                  epicId={epic.id}
                  aspectRatio="wide"
                  containerStyle={styles.epicImage}
                  showFallback={true}
                  fallbackIcon={epic.icon}
                />

                {/* Epic Content */}
                <View style={styles.epicContent}>
                  <Text style={styles.epicTitle}>
                    {epic.icon} {epic.title}
                  </Text>
                  
                  <Text style={styles.epicDescription}>
                    {epic.description}
                  </Text>

                  {/* Difficulty and Question Count */}
                  <View style={styles.epicMetaContainer}>
                    <Text style={styles.epicDifficulty}>
                      {epic.difficultyIcon} {epic.difficulty}
                    </Text>
                    <Text style={styles.epicQuestionCount}>
                      {typeof epic.questionCount === 'number' 
                        ? `📚 ${epic.questionCount} Questions Available`
                        : `📚 ${epic.questionCount}`
                      }
                    </Text>
                  </View>

                  {/* Action Button */}
                  <Button
                    title={epic.status}
                    onPress={() => handleEpicSelect(epic)}
                    variant={epic.isAvailable ? 'primary' : 'disabled'}
                    disabled={!epic.isAvailable}
                    style={styles.epicButton}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={styles.browseAllButton}
            onPress={handleBrowseAll}
          >
            <Text style={styles.browseAllText}>
              Browse All Epics →
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.footerHint}>
            Or explore the full app with tabs, progress tracking, and more features
          </Text>
          
          {/* Scroll indicator for simulator */}
          {Platform.OS === 'ios' && (
            <View style={styles.scrollIndicator}>
              <Text style={styles.scrollIndicatorText}>
                ↑ Scroll to see all content ↑
              </Text>
            </View>
          )}
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
    paddingBottom: ComponentSpacing.screenVertical + 60, // Extra padding for better scrolling
    minHeight: '120%', // Force content to be taller than screen
  },

  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.l,
  },

  title: {
    ...Typography.h1,
    fontSize: 28,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
    textAlign: 'center',
    fontWeight: '700',
  },

  subtitle: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
  },

  // Instructions Section
  instructionsCard: {
    padding: Spacing.l,
    marginBottom: Spacing.xl,
    backgroundColor: theme.colors.primarySaffron + '08',
    borderWidth: 1,
    borderColor: theme.colors.primarySaffron + '20',
  },

  instructionsTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.m,
    fontWeight: '600',
  },

  instructionsList: {
    gap: Spacing.s,
  },

  instructionItem: {
    ...Typography.body,
    color: theme.text.secondary,
    lineHeight: 20,
    fontSize: 14,
  },

  // Epics Section
  epicsSection: {
    gap: Spacing.l,
    marginBottom: Spacing.xl,
  },

  epicCardContainer: {
    opacity: 1,
  },

  epicCardDisabled: {
    opacity: 0.7,
  },

  epicCard: {
    padding: 0,
    overflow: 'hidden',
  },

  epicImage: {
    height: 160,
    marginBottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  epicContent: {
    padding: Spacing.l,
  },

  epicTitle: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.s,
    fontSize: 20,
  },

  epicDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.m,
    fontSize: 15,
  },

  epicMetaContainer: {
    marginBottom: Spacing.l,
    gap: Spacing.xs,
  },

  epicDifficulty: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontSize: 13,
    fontWeight: '500',
  },

  epicQuestionCount: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontSize: 13,
  },

  epicButton: {
    marginTop: Spacing.s,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    paddingTop: Spacing.l,
  },

  browseAllButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
  },

  browseAllText: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  footerHint: {
    ...Typography.caption,
    color: theme.text.tertiary,
    textAlign: 'center',
    marginTop: Spacing.m,
    fontSize: 12,
    lineHeight: 16,
  },

  scrollIndicator: {
    alignItems: 'center',
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
  },

  scrollIndicatorText: {
    ...Typography.caption,
    color: theme.colors.primarySaffron,
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default OnboardingEpicsScreen;