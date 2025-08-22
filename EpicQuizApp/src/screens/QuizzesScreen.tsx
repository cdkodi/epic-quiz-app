/**
 * Quizzes Screen - Progress-first learning dashboard
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
import { Button, Card, ProgressBar, EpicImage } from '../components/common';

const QuizzesScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock user progress data - NEW USER EXPERIENCE
  const userProgress = {
    currentEpic: 'Ramayana',
    currentKanda: 'Bala Kanda',
    currentSarga: 1,
    totalSargas: 77,
    completedSargas: 0,
    overallProgress: 0, // Fresh start
    lastQuizScore: null,
    lastQuizTotal: null,
    achievements: []
  };

  const handleContinueLearning = () => {
    Alert.alert('🎯 Start Your Epic Journey', 'Ready to begin your first Ramayana quiz?', [
      { text: 'Not yet', style: 'cancel' },
      { text: 'Let\'s begin!', onPress: () => {
        (navigation as any).navigate('Quiz', {
          epic: {
            id: 'bala_kanda_sarga_1',
            title: 'The Ramayana - Bala Kanda',
            totalQuestions: 10,
            estimatedTime: '5-8 min',
            isAvailable: true
          }
        });
      }}
    ]);
  };

  const handleExploreOtherEpics = () => {
    Alert.alert('📚 Explore Epics', 'More epic content coming soon!');
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
          <Text style={styles.title}>📚 Your Learning Journey</Text>
          <Text style={styles.subtitle}>Continue your epic adventure</Text>
        </View>

        {/* Current Progress Section */}
        <View style={styles.section}>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <EpicImage
                epicId="ramayana"
                kandaName={userProgress.currentKanda}
                aspectRatio="square"
                containerStyle={styles.kandaImage}
                showFallback={true}
                fallbackIcon="🕉️"
              />
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>{userProgress.currentEpic}: {userProgress.currentKanda}</Text>
                <Text style={styles.progressSubtitle}>Ready to start: Sarga {userProgress.currentSarga} of {userProgress.totalSargas}</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <ProgressBar 
                progress={userProgress.overallProgress} 
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {userProgress.overallProgress === 0 ? 'Ready to begin!' : `${userProgress.overallProgress.toFixed(1)}% Complete`}
              </Text>
            </View>

            <Button
              title={userProgress.overallProgress === 0 ? "Start Learning →" : "Continue Learning →"}
              onPress={handleContinueLearning}
              variant="primary"
              style={styles.continueButton}
            />
          </Card>
        </View>

        {/* Kanda Showcase Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Currently Exploring</Text>
          
          <Card style={styles.kandaShowcaseCard}>
            <EpicImage
              epicId="ramayana"
              kandaName={userProgress.currentKanda}
              aspectRatio="wide"
              containerStyle={styles.showcaseImage}
              showFallback={true}
            />
            
            <View style={styles.showcaseContent}>
              <Text style={styles.showcaseTitle}>{userProgress.currentKanda}</Text>
              <Text style={styles.showcaseSubtitle}>The Childhood Chapter</Text>
              <Text style={styles.showcaseDescription}>
                Birth and early life of Rama, his education under sage Vishwamitra, 
                and the divine marriage to Sita. This foundational chapter introduces 
                the main characters and sets the stage for the epic journey.
              </Text>
              
              {userProgress.lastQuizScore !== null ? (
                <View style={styles.lastQuizResult}>
                  <Text style={styles.resultLabel}>Last Quiz Score:</Text>
                  <Text style={styles.resultScore}>
                    {userProgress.lastQuizScore}/{userProgress.lastQuizTotal} correct
                  </Text>
                </View>
              ) : (
                <View style={styles.lastQuizResult}>
                  <Text style={styles.resultLabel}>🌟 Your First Epic Adventure</Text>
                  <Text style={styles.newUserText}>
                    Begin your journey into ancient wisdom
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Explore More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Explore More</Text>
          
          {/* Upcoming Content */}
          <Card style={styles.exploreCard}>
            <View style={styles.exploreHeader}>
              <Text style={styles.exploreEmoji}>🏰</Text>
              <View style={styles.exploreInfo}>
                <Text style={styles.exploreTitle}>Ayodhya Kanda - Royal Court</Text>
                <Text style={styles.exploreDesc}>Coming after Bala Kanda completion</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.previewButton}>
              <Text style={styles.previewText}>Preview →</Text>
            </TouchableOpacity>
          </Card>

          {/* Other Epics */}
          <Card style={styles.exploreCard}>
            <View style={styles.exploreHeader}>
              <Text style={styles.exploreEmoji}>📚</Text>
              <View style={styles.exploreInfo}>
                <Text style={styles.exploreTitle}>Other Epic Traditions</Text>
                <Text style={styles.exploreDesc}>Mahabharata, Iliad, and more</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.previewButton}
              onPress={handleExploreOtherEpics}
            >
              <Text style={styles.previewText}>Explore →</Text>
            </TouchableOpacity>
          </Card>
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
    textAlign: 'center',
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

  // Progress Card Styles
  progressCard: {
    padding: Spacing.l,
    backgroundColor: theme.colors.primarySaffron + '08',
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron + '20',
  },
  
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  
  kandaImage: {
    width: 64,
    height: 64,
    marginRight: Spacing.m,
    borderRadius: 12,
  },

  progressEmoji: {
    fontSize: 32,
    marginRight: Spacing.m,
  },
  
  progressInfo: {
    flex: 1,
  },
  
  progressTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  
  progressSubtitle: {
    ...Typography.body,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  
  progressBarContainer: {
    marginBottom: Spacing.l,
  },
  
  progressBar: {
    marginBottom: Spacing.s,
  },
  
  progressText: {
    ...Typography.caption,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
    textAlign: 'right',
  },
  
  continueButton: {
    backgroundColor: theme.colors.primarySaffron,
    paddingVertical: Spacing.m,
  },

  // Kanda Showcase Card Styles
  kandaShowcaseCard: {
    padding: 0, // Remove padding to allow full-width image
    overflow: 'hidden',
  },
  
  showcaseImage: {
    height: 200, // Larger image height
    marginBottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  
  showcaseContent: {
    padding: Spacing.l,
  },
  
  showcaseTitle: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  
  showcaseSubtitle: {
    ...Typography.subtitle,
    color: theme.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  
  showcaseDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  
  lastQuizResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.s,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray + '50',
  },
  
  resultLabel: {
    ...Typography.body,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  
  resultScore: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
  },

  newUserText: {
    ...Typography.caption,
    color: theme.colors.primarySaffron,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  // Explore Card Styles
  exploreCard: {
    padding: Spacing.l,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.lightGray + '40',
  },
  
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  
  exploreEmoji: {
    fontSize: 28,
    marginRight: Spacing.m,
  },
  
  exploreInfo: {
    flex: 1,
  },
  
  exploreTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  
  exploreDesc: {
    ...Typography.caption,
    color: theme.text.secondary,
  },
  
  previewButton: {
    alignSelf: 'flex-end',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  
  previewText: {
    ...Typography.caption,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
  },
});

export default QuizzesScreen;