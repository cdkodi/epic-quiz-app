/**
 * Epic Library Screen - Browse available literature
 * Matches HTML mockup design exactly with realistic data
 */

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Epic, QuizPackage } from '../types/api';
import { EpicCard } from '../components/epic';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';

// Mock data imports
import { mockEpics, mockUserProgress } from '../data/mockEpics';
import { getMockQuiz } from '../data/mockQuizData';

type EpicLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EpicLibrary'>;

const EpicLibraryScreen: React.FC = () => {
  const navigation = useNavigation<EpicLibraryNavigationProp>();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate API call with realistic loading
  const fetchEpics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // TODO: Replace with real API call
      // const response = await apiService.getEpics();
      // if (response.success) {
      //   setEpics(response.data || []);
      // }
      
      // For now, use mock data
      setEpics(mockEpics);
    } catch (error) {
      console.error('Failed to fetch epics:', error);
      Alert.alert('Error', 'Failed to load epics. Please try again.');
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEpics();
  }, []);

  const handleEpicPress = async (epic: Epic) => {
    if (!epic.is_available || epic.question_count === 0) {
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

    // For available epics, generate quiz and navigate
    Alert.alert(
      '🎯 Start Quiz',
      `Ready to test your knowledge of ${epic.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Learning',
          style: 'default',
          onPress: async () => {
            try {
              // TODO: Replace with real quiz generation API call
              // const response = await apiService.generateQuiz(epic.id, 10);
              // if (response.success) {
              //   navigation.navigate('Quiz', {
              //     epic,
              //     quizPackage: response.data
              //   });
              // }

              // For now, use mock quiz generation
              const quizPackage = getMockQuiz(epic.id, 10);
              
              navigation.navigate('Quiz', {
                epic,
                quizPackage,
              });
            } catch (error) {
              console.error('Failed to generate quiz:', error);
              Alert.alert(
                'Error',
                'Failed to generate quiz. Please try again.',
                [{ text: 'OK', style: 'default' }]
              );
            }
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
          <Text style={styles.loadingText}>Loading classical literature...</Text>
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

        {/* Epic Cards */}
        <View style={styles.epicsContainer}>
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
});

export default EpicLibraryScreen;