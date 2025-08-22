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
import { mockUserProgress, mockEpics } from '../data/mockEpics';

type EpicLibraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EpicLibrary'>;

const EpicLibraryScreen: React.FC = () => {
  const navigation = useNavigation<EpicLibraryNavigationProp>();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load epics from mock data for Library display
  const fetchEpics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    console.log('📚 Loading epics for Library display...');
    
    try {
      // Use mock data to show all 3 epics (Ramayana, Mahabharata, Bhagavad Gita)
      const libraryEpics = mockEpics.filter(epic => 
        epic.id === 'ramayana' || epic.id === 'mahabharata' || epic.id === 'bhagavad_gita'
      );
      console.log(`✅ Successfully loaded ${libraryEpics.length} epics for Library`);
      setEpics(libraryEpics);
    } catch (error) {
      console.error('Failed to load epics:', error);
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
    if (epic.id === 'ramayana') {
      // Navigate to Ramayana overview screen for immersive experience
      navigation.navigate('RamayanaOverview');
      return;
    }

    if (!epic.isAvailable || epic.totalQuestions === 0) {
      // Show appropriate message for unavailable epics
      if (epic.id === 'mahabharata') {
        Alert.alert(
          '🚧 Coming Soon',
          'The Mahabharata will be available in a future update. Complete your Ramayana journey first!',
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

    // For other available epics, show progressive learning options
    Alert.alert(
      '🎯 Choose Your Learning Path',
      `Ready to explore ${epic.title}?\n\n📊 ${epic.totalQuestions} questions available\n⏱️ Estimated time: ${epic.estimatedTime}\n\n🌟 Try our new story-based learning blocks!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose Difficulty',
          style: 'default',
          onPress: () => showDifficultySelection(epic)
        },
        {
          text: 'Quick Quiz',
          style: 'default',
          onPress: () => {
            navigation.navigate('Quiz', { epic });
          }
        }
      ]
    );
  };

  const showDifficultySelection = (epic: Epic) => {
    Alert.alert(
      '📚 Select Your Learning Level',
      'Choose the difficulty that matches your knowledge of the epic:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🌱 Easy (Foundational)',
          style: 'default',
          onPress: () => navigation.navigate('BlockSelection', { epic, difficulty: 'easy' })
        },
        {
          text: '🌿 Medium (Development)',
          style: 'default',
          onPress: () => navigation.navigate('BlockSelection', { epic, difficulty: 'medium' })
        },
        {
          text: '🌳 Hard (Mastery)',
          style: 'default',
          onPress: () => navigation.navigate('BlockSelection', { epic, difficulty: 'hard' })
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
        {/* Epic Cards - Direct layout like screenshot */}
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