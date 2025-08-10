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
  Alert
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