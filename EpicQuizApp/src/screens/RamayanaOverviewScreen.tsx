/**
 * Ramayana Overview Screen - Comprehensive introduction for first-time users
 * Shows story overview, Kanda structure, characters, and difficulty selection
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Card, Button, EpicImage } from '../components/common';
import { ramayanaKandas } from '../data/mockEpics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface DifficultyOption {
  id: DifficultyLevel;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  questionCount: number;
  features: string[];
}

const difficultyOptions: DifficultyOption[] = [
  {
    id: 'easy',
    title: 'Student',
    subtitle: 'Perfect for Beginners',
    description: 'Learn the basic story and characters',
    icon: '🌟',
    questionCount: 10,
    features: ['Multiple choice questions', 'Basic story comprehension', 'Character identification']
  },
  {
    id: 'medium',
    title: 'Scholar',
    subtitle: 'Dive Deeper',
    description: 'Explore themes and character motivations',
    icon: '⚡',
    questionCount: 15,
    features: ['Complex multiple choice', 'Character motivations', 'Story themes']
  },
  {
    id: 'hard',
    title: 'Sage',
    subtitle: 'Master Level',
    description: 'Cultural context and deeper meanings',
    icon: '💎',
    questionCount: 20,
    features: ['Advanced analysis', 'Cultural context', 'Philosophical themes']
  }
];


const RamayanaOverviewScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');

  const handleBeginJourney = () => {
    // Navigate to Quiz screen with selected difficulty
    navigation.navigate('Quiz', {
      epic: { id: 'ramayana', title: 'Ramayana' },
      difficulty: selectedDifficulty
    });
  };

  const renderHeroSection = () => (
    <View style={styles.heroContainer}>
      <ImageBackground
        source={require('../assets/images/epics/ramayana/cover.png')}
        style={styles.heroBackground}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Ramayana</Text>
          <Text style={styles.heroSubtitle}>The Story of Rama and Sita</Text>
          <Text style={styles.scrollHint}>↓ Discover the timeless story ↓</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const renderStoryOverview = () => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>📖 The Ramayana</Text>
      <Text style={styles.storyText}>
        The Ramayana is one of the world's greatest epics, telling the story of Prince Rama's quest to rescue his beloved wife Sita from the demon king Ravana. This timeless tale explores themes of dharma (righteousness), devotion, courage, and the eternal battle between good and evil.
      </Text>
      <Text style={styles.storyText}>
        Through seven chapters called "Kandas," we follow Rama's journey from his birth and education, through his exile in the forest, to the great war in Lanka and his eventual return to Ayodhya as king. Each chapter reveals profound truths about duty, love, and the choices that define us.
      </Text>
      <Text style={styles.storyText}>
        More than just a story, the Ramayana is a guide for living—teaching us about loyalty, sacrifice, and the triumph of righteousness over evil forces.
      </Text>
    </Card>
  );

  const renderKandaTimeline = () => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>📚 The Seven Kandas</Text>
      <Text style={styles.sectionSubtitle}>Your journey through the epic</Text>
      
      <View style={styles.kandaGrid}>
        {ramayanaKandas.map((kanda, index) => (
          <TouchableOpacity key={kanda.id} style={styles.kandaCard}>
            <View style={styles.kandaHeader}>
              <Text style={styles.kandaNumber}>{index + 1}</Text>
              <Text style={styles.kandaIcon}>
                {index === 0 ? '👶' : index === 1 ? '🏰' : index === 2 ? '🌲' : 
                 index === 3 ? '🐒' : index === 4 ? '🕊️' : index === 5 ? '⚔️' : '🏡'}
              </Text>
            </View>
            <Text style={styles.kandaTitle}>{kanda.name}</Text>
            <Text style={styles.kandaSubtitle}>{kanda.title}</Text>
            <Text style={styles.kandaDescription}>{kanda.description}</Text>
            <Text style={styles.kandaTime}>⏱️ {kanda.estimated_reading_time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );


  const renderLearningSystem = () => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>🎯 How Learning Works</Text>
      
      <View style={styles.learningSteps}>
        <View style={styles.learningStep}>
          <Text style={styles.stepIcon}>📖</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Read & Learn</Text>
            <Text style={styles.stepDescription}>Discover the story through interactive questions</Text>
          </View>
        </View>
        
        <View style={styles.learningStep}>
          <Text style={styles.stepIcon}>🤔</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Answer Questions</Text>
            <Text style={styles.stepDescription}>Test your understanding with thoughtful questions</Text>
          </View>
        </View>
        
        <View style={styles.learningStep}>
          <Text style={styles.stepIcon}>💡</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get Explanations</Text>
            <Text style={styles.stepDescription}>Learn from detailed explanations for every answer</Text>
          </View>
        </View>
        
        <View style={styles.learningStep}>
          <Text style={styles.stepIcon}>📈</Text>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Track Progress</Text>
            <Text style={styles.stepDescription}>Watch your knowledge grow Kanda by Kanda</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  const renderDifficultySelector = () => (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>⚡ Choose Your Journey</Text>
      <Text style={styles.sectionSubtitle}>Select the learning approach that's right for you</Text>
      
      <View style={styles.difficultyGrid}>
        {difficultyOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.difficultyCard,
              selectedDifficulty === option.id && styles.selectedDifficulty
            ]}
            onPress={() => setSelectedDifficulty(option.id)}
          >
            <View style={styles.titleRow}>
              <Text style={styles.difficultyIcon}>{option.icon}</Text>
              <Text style={styles.difficultyTitle}>{option.title}</Text>
            </View>
            <Text style={styles.difficultySubtitle}>{option.subtitle}</Text>
            <Text style={styles.difficultyDescription}>{option.description}</Text>
            <Text style={styles.difficultyQuestions}>{option.questionCount} questions per quiz</Text>
            
            <View style={styles.featuresList}>
              {option.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>• {feature}</Text>
              ))}
            </View>
            
            {selectedDifficulty === option.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓ Selected</Text>
              </View>
            )}
            
            {/* Individual Begin Journey Button */}
            <Button
              title="Begin Journey"
              onPress={() => handleBeginJourney()}
              variant={selectedDifficulty === option.id ? 'primary' : 'disabled'}
              disabled={selectedDifficulty !== option.id}
              style={styles.cardButton}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderActionButtons = () => (
    <View style={styles.actionSection}>
      <Button
        title={`Begin Your Journey as a ${difficultyOptions.find(opt => opt.id === selectedDifficulty)?.title}`}
        onPress={handleBeginJourney}
        variant="primary"
        style={styles.primaryButton}
      />
      
      <Text style={styles.progressHint}>
        📍 You're about to start Bala Kanda - Step 1 of 7
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderHeroSection()}
        {renderStoryOverview()}
        {renderKandaTimeline()}
        {renderLearningSystem()}
        {renderDifficultySelector()}
        {renderActionButtons()}
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
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

  // Hero Section
  heroContainer: {
    height: screenHeight * 0.4,
    marginBottom: Spacing.l,
  },

  heroBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroImage: {
    resizeMode: 'cover',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  heroContent: {
    alignItems: 'center',
    zIndex: 1,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
    flex: 1,
  },

  heroTitle: {
    ...Typography.h1,
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.s,
    marginTop: Spacing.m,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    paddingHorizontal: Spacing.m,
    lineHeight: 45,
  },

  heroSubtitle: {
    ...Typography.h3,
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  scrollHint: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },

  // Common Section Styles
  sectionCard: {
    marginHorizontal: ComponentSpacing.screenHorizontal,
    marginBottom: Spacing.l,
    padding: Spacing.l,
  },

  sectionTitle: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.s,
  },

  sectionSubtitle: {
    ...Typography.body,
    color: theme.text.secondary,
    marginBottom: Spacing.l,
  },

  // Story Overview
  storyText: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 24,
    marginBottom: Spacing.m,
  },

  // Kanda Timeline
  kandaGrid: {
    gap: Spacing.m,
  },

  kandaCard: {
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },

  kandaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },

  kandaNumber: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginRight: Spacing.s,
  },

  kandaIcon: {
    fontSize: 24,
  },

  kandaTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },

  kandaSubtitle: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
  },

  kandaDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    marginBottom: Spacing.s,
  },

  kandaTime: {
    ...Typography.caption,
    color: theme.text.tertiary,
  },


  // Learning System
  learningSteps: {
    gap: Spacing.m,
  },

  learningStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepIcon: {
    fontSize: 28,
    marginRight: Spacing.m,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },

  stepDescription: {
    ...Typography.body,
    color: theme.text.secondary,
  },

  // Difficulty Selector
  difficultyGrid: {
    gap: Spacing.m,
  },

  difficultyCard: {
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.l,
    paddingBottom: 80, // Increased space for button clearance
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    position: 'relative',
    minHeight: 220, // Increased height for better spacing
  },

  selectedDifficulty: {
    borderColor: theme.colors.primarySaffron,
    backgroundColor: theme.colors.primarySaffron + '08',
  },

  // Title Row for inline icon and title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    paddingRight: 80, // Make space for selected indicator
  },

  difficultyIcon: {
    fontSize: 28,
    marginRight: Spacing.s,
  },

  difficultyTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    fontWeight: '700',
    marginLeft: 0, // Remove any extra margin
  },

  difficultySubtitle: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
  },

  difficultyDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    marginBottom: Spacing.s,
  },

  difficultyQuestions: {
    ...Typography.caption,
    color: theme.text.tertiary,
    marginBottom: Spacing.m,
  },

  featuresList: {
    gap: Spacing.xs,
    marginBottom: Spacing.l, // Add bottom margin to clear button
  },

  featureItem: {
    ...Typography.caption,
    color: theme.text.secondary,
  },

  selectedIndicator: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    backgroundColor: theme.colors.primarySaffron,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },

  selectedText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Card Button
  cardButton: {
    position: 'absolute',
    bottom: Spacing.l, // Moved up slightly for better clearance
    right: Spacing.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    minWidth: 110,
    borderRadius: 8,
  },

  // Action Section
  actionSection: {
    marginHorizontal: ComponentSpacing.screenHorizontal,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },

  primaryButton: {
    marginBottom: Spacing.l,
    minWidth: '100%',
  },

  progressHint: {
    ...Typography.caption,
    color: theme.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bottomSpacing: {
    height: Spacing.xxl,
  },
});

export default RamayanaOverviewScreen;