/**
 * Epic Library Screen - Browse available literature
 * Matches HTML mockup design exactly with realistic data
 */

import * as React from 'react';
const { useEffect, useState } = React;
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  RefreshControl,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Epic, QuizPackage } from '../types/api';
import { EpicCard } from '../components/epic';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { apiService } from '../services/api';

// Keep mock user progress for now
import { mockUserProgress } from '../data/mockEpics';

type EpicLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EpicLibrary'>;

const EpicLibraryScreen: React.FC = () => {
  const navigation = useNavigation<EpicLibraryNavigationProp>();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch epics from Supabase
  const fetchEpics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    console.log('📚 Loading real epics from Supabase...');
    
    try {
      // Use real API service powered by Supabase
      const response = await apiService.getEpics();
      
      if (response.success) {
        console.log(`✅ Successfully loaded ${response.data.length} epics`);
        setEpics(response.data || []);
      } else {
        console.error('API Error:', response.error, response.message);
        Alert.alert('Error', response.message || 'Failed to load epics. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch epics:', error);
      Alert.alert('Connection Error', 'Unable to connect to the service. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, []);

  const handleEpicPress = async (epic: Epic) => {
    if (!epic.isAvailable || epic.totalQuestions === 0) {
      // Show appropriate message for unavailable epics
      if (epic.id === 'mahabharata') {
        Alert.alert(
          '🔒 Epic Locked',
          'Complete more Ramayana quizzes to unlock the Mahabharata!',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          '🚧 Coming Soon',
          `${epic.title} will be available in a future update. Stay tuned!`,
          [{ text: 'OK', style: 'default' }]
        );
      }
      return;
    }

    // For available epics, show quiz confirmation with real question count
    Alert.alert(
      '🎯 Start Quiz',
      `Ready to test your knowledge of ${epic.title}?\n\n📊 ${epic.totalQuestions} questions available\n⏱️ Estimated time: ${epic.estimatedTime}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Learning',
          style: 'default',
          onPress: () => {
            // Navigate to Quiz screen - it will handle the real quiz generation
            navigation.navigate('Quiz', {
              epic,
            });
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    fetchEpics(true);
  };

  if (loading && epics.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading epics from database...</Text>
          <Text style={[styles.loadingText, { fontSize: 14, marginTop: 8, opacity: 0.7 }]}>
            Connecting to Supabase...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primarySaffron}
            colors={[theme.colors.primarySaffron]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.subtitle}>Discover Classical Literature</Text>
        </View>

        {/* Continue Learning Section */}
        <View style={styles.continueSection}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => {
              // Navigate to continue learning
              Alert.alert(
                '🎯 Continue Learning',
                'Pick up where you left off with personalized quiz recommendations.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Continue Quiz', 
                    onPress: () => {
                      // Navigate to a new quiz
                      const ramayana = epics.find(e => e.id === 'ramayana');
                      if (ramayana) {
                        handleEpicPress(ramayana);
                      } else {
                        Alert.alert('Error', 'Ramayana epic not found. Please refresh the app.');
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.continueButtonIcon}>🎯</Text>
            <View style={styles.continueButtonText}>
              <Text style={styles.continueTitle}>Continue Your Journey</Text>
              <Text style={styles.continueSubtitle}>Ready for Bala Kanda - Sarga 2?</Text>
            </View>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </View>


        {/* Recent Activity Section */}
        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
          
          <TouchableOpacity 
            style={styles.recentActivityItem}
            onPress={() => {
              // Navigate to last quiz results
              Alert.alert(
                '📝 Last Quiz Results', 
                'Review your most recent Ramayana quiz performance and explanations.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Review Answers', onPress: () => {
                    // This would navigate to the explanation screen with recent quiz data
                    Alert.alert('Coming Soon', 'Quiz history and review navigation will be available in the next update.');
                  }}
                ]
              );
            }}
          >
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>📝</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Bala Kanda - Sarga 1 Completed</Text>
              <Text style={styles.activitySubtitle}>Review your answers and explanations</Text>
            </View>
            <View style={styles.activityArrow}>
              <Text style={styles.activityArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Available Epics Section */}
        <View style={styles.epicsContainer}>
          <Text style={styles.sectionTitle}>📚 Available Literature</Text>
          {epics.map((epic) => (
            <EpicCard
              key={epic.id}
              epic={epic}
              userProgress={mockUserProgress[epic.id as keyof typeof mockUserProgress]}
              onPress={() => handleEpicPress(epic)}
            />
          ))}
        </View>

        {/* Recent Achievements Section (placeholder for future) */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements:</Text>
          <Text style={styles.achievementText}>🎖️ Characters Master</Text>
          <Text style={styles.achievementText}>🌟 5-Day Learning Streak</Text>
        </View>

        {/* Footer spacing for better scroll experience */}
        <View style={styles.footerSpacing} />
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
    paddingHorizontal: ComponentSpacing.screenHorizontal,
    paddingVertical: ComponentSpacing.screenVertical,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ComponentSpacing.screenHorizontal,
  },

  loadingText: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
  },

  headerSection: {
    marginBottom: Spacing.l,
  },

  subtitle: {
    ...Typography.body,
    color: theme.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },

  epicsContainer: {
    marginBottom: Spacing.xl,
  },

  achievementsSection: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    marginBottom: Spacing.m,
  },

  achievementText: {
    ...Typography.body,
    color: theme.text.secondary,
    marginBottom: Spacing.xs,
  },

  footerSpacing: {
    height: Spacing.xl,
  },

  // New sections styles
  continueSection: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.s,
  },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primarySaffron + '15',
    padding: Spacing.l,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primarySaffron + '30',
  },

  continueButtonIcon: {
    fontSize: 28,
    marginRight: Spacing.m,
  },

  continueButtonText: {
    flex: 1,
  },

  continueTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },

  continueSubtitle: {
    ...Typography.body,
    color: theme.text.secondary,
  },

  continueArrow: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    marginLeft: Spacing.s,
  },


  recentActivitySection: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.s,
  },

  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgrounds.secondary,
    padding: Spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    marginTop: Spacing.m,
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySaffron + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },

  activityIconText: {
    fontSize: 20,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },

  activitySubtitle: {
    ...Typography.caption,
    color: theme.text.secondary,
  },

  activityArrow: {
    marginLeft: Spacing.m,
  },

  activityArrowText: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
  },
});

export default EpicLibraryScreen;