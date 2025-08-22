/**
 * Block Selection Screen - Progressive Learning Path Selection
 * Allows users to choose their learning journey through story-based blocks
 */

import * as React from 'react';
const { useEffect, useState } = React;
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { QuizBlock } from '../types/api';
import { theme, Typography, Spacing } from '../constants';
import { apiService } from '../services/api';

type BlockSelectionRouteProp = RouteProp<RootStackParamList, 'BlockSelection'>;
type BlockSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BlockSelection'>;

interface BlockSelectionScreenProps {
  route: BlockSelectionRouteProp;
}

const BlockSelectionScreen: React.FC<BlockSelectionScreenProps> = ({ route }) => {
  const navigation = useNavigation<BlockSelectionNavigationProp>();
  const { epic, difficulty = 'easy' } = route.params;
  
  const [blocks, setBlocks] = useState<QuizBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedBlock, setRecommendedBlock] = useState<QuizBlock | null>(null);

  useEffect(() => {
    loadBlocks();
    loadRecommendedBlock();
  }, [epic.id, difficulty]);

  const loadBlocks = async () => {
    try {
      const response = await apiService.getAvailableBlocks(epic.id, difficulty);
      if (response.success && response.data) {
        setBlocks(response.data.data?.blocks || []);
      } else {
        console.log('Backend not available, using fallback blocks for demonstration');
        // Fallback to mock blocks for demonstration
        setBlocks(getMockBlocks(difficulty));
      }
    } catch (error) {
      console.log('Backend not available, using fallback blocks for demonstration');
      // Fallback to mock blocks for demonstration
      setBlocks(getMockBlocks(difficulty));
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedBlock = async () => {
    try {
      const response = await apiService.getRecommendedBlock(epic.id, difficulty);
      if (response.success && response.data) {
        setRecommendedBlock(response.data.data?.recommended_block);
      } else {
        // Fallback to first block of the difficulty
        const mockBlocks = getMockBlocks(difficulty);
        setRecommendedBlock(mockBlocks[0] || null);
      }
    } catch (error) {
      console.log('Backend not available, using fallback recommended block');
      // Fallback to first block of the difficulty
      const mockBlocks = getMockBlocks(difficulty);
      setRecommendedBlock(mockBlocks[0] || null);
    }
  };

  const handleBlockPress = (block: QuizBlock) => {
    Alert.alert(
      `📚 ${block.block_name}`,
      `${block.narrative_summary}\n\n🎯 Learning Goals:\n${block.learning_objectives.map(obj => `• ${obj}`).join('\n')}\n\n📊 ${block.total_questions || 0} questions available\n⏱️ Estimated time: ${Math.ceil((block.total_questions || 10) * 1.5)} minutes`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Block',
          style: 'default',
          onPress: () => startBlockQuiz(block)
        }
      ]
    );
  };

  const startBlockQuiz = (block: QuizBlock) => {
    navigation.navigate('Quiz', {
      epic,
      difficulty: block.difficulty_level,
      blockId: block.id
    });
  };

  const getMockBlocks = (difficulty: string): QuizBlock[] => {
    const easyBlocks: QuizBlock[] = [
      {
        id: 1,
        epic_id: 'ramayana',
        block_name: 'Origins & Divine Birth',
        difficulty_level: 'easy',
        phase: 'foundational',
        start_sarga: 1,
        end_sarga: 5,
        kanda: 'bala_kanda',
        learning_objectives: ['Understanding the cosmic context', 'Meeting main characters', 'Grasping divine intervention concept'],
        narrative_summary: 'The epic begins with Narada\'s visit to Valmiki, the conception of Ramayana, and the divine origins of Rama and his brothers.',
        key_themes: ['divine birth', 'cosmic order', 'sage wisdom', 'brotherly bonds'],
        cultural_elements: ['ashrama system', 'yajna rituals', 'guru-disciple tradition'],
        sequence_order: 1,
        is_available: true,
        total_questions: 60,
        character_questions: 19,
        event_questions: 15,
        theme_questions: 11,
        culture_questions: 15,
      },
      {
        id: 2,
        epic_id: 'ramayana',
        block_name: 'Royal Education & Early Adventures',
        difficulty_level: 'easy',
        phase: 'foundational',
        start_sarga: 6,
        end_sarga: 10,
        kanda: 'bala_kanda',
        learning_objectives: ['Prince education system', 'Early heroic deeds', 'Teacher-student relationships'],
        narrative_summary: 'The princes receive their education and training. Early adventures and the development of their heroic qualities.',
        key_themes: ['education', 'heroism', 'training', 'royal duties'],
        cultural_elements: ['gurukula education', 'kshatriya dharma', 'archery skills'],
        sequence_order: 2,
        is_available: true,
        total_questions: 57,
        character_questions: 15,
        event_questions: 14,
        theme_questions: 14,
        culture_questions: 14,
      }
    ];

    const mediumBlocks: QuizBlock[] = [
      {
        id: 4,
        epic_id: 'ramayana',
        block_name: 'Forest Adventures & Demon Battles',
        difficulty_level: 'medium',
        phase: 'development',
        start_sarga: 16,
        end_sarga: 25,
        kanda: 'bala_kanda',
        learning_objectives: ['Understanding dharma in action', 'Complexity of good vs evil', 'Strategic thinking'],
        narrative_summary: 'Rama and Lakshmana journey with Vishvamitra, face their first demon encounters, and learn about cosmic battles.',
        key_themes: ['good vs evil', 'courage in adversity', 'strategic warfare', 'divine weapons'],
        cultural_elements: ['forest hermitages', 'demon mythology', 'weapon consecration'],
        sequence_order: 4,
        is_available: true,
        total_questions: 118,
        character_questions: 29,
        event_questions: 36,
        theme_questions: 22,
        culture_questions: 31,
      }
    ];

    const hardBlocks: QuizBlock[] = [
      {
        id: 7,
        epic_id: 'ramayana',
        block_name: 'The Impossible Bow & Divine Marriage',
        difficulty_level: 'hard',
        phase: 'mastery',
        start_sarga: 51,
        end_sarga: 65,
        kanda: 'bala_kanda',
        learning_objectives: ['Symbolic meaning of divine trials', 'Marriage as cosmic union', 'Manifestation of destiny'],
        narrative_summary: 'Rama breaks Shiva\'s bow, wins Sita\'s hand, and their marriage represents the union of divine principles.',
        key_themes: ['divine trials', 'cosmic marriage', 'destiny fulfillment', 'symbolic actions'],
        cultural_elements: ['Shiva worship', 'marriage symbolism', 'cosmic principles'],
        sequence_order: 7,
        is_available: true,
        total_questions: 163,
        character_questions: 49,
        event_questions: 41,
        theme_questions: 35,
        culture_questions: 38,
      }
    ];

    if (difficulty === 'easy') return easyBlocks;
    if (difficulty === 'medium') return mediumBlocks;
    if (difficulty === 'hard') return hardBlocks;
    return [...easyBlocks, ...mediumBlocks, ...hardBlocks];
  };

  const startRecommendedQuiz = () => {
    if (recommendedBlock) {
      startBlockQuiz(recommendedBlock);
    } else {
      // Fallback to regular quiz
      navigation.navigate('Quiz', { epic, difficulty });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return theme.colors.primary;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'foundational': return '🌱';
      case 'development': return '🌿';
      case 'mastery': return '🌳';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your learning path...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{epic.title} Learning Journey</Text>
          <Text style={styles.subtitle}>
            Choose your path through the epic. Each block tells a complete story.
          </Text>
        </View>

        {/* Recommended Block */}
        {recommendedBlock && (
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>🎯 Recommended for You</Text>
            <TouchableOpacity 
              style={[styles.blockCard, styles.recommendedCard]}
              onPress={() => handleBlockPress(recommendedBlock)}
            >
              <View style={styles.blockHeader}>
                <Text style={styles.blockPhase}>
                  {getPhaseIcon(recommendedBlock.phase)} {recommendedBlock.phase.toUpperCase()}
                </Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recommendedBlock.difficulty_level) }]}>
                  <Text style={styles.difficultyText}>{recommendedBlock.difficulty_level.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.blockName}>{recommendedBlock.block_name}</Text>
              <Text style={styles.blockSummary}>{recommendedBlock.narrative_summary}</Text>
              <View style={styles.blockStats}>
                <Text style={styles.blockStat}>📖 Sargas {recommendedBlock.start_sarga}-{recommendedBlock.end_sarga}</Text>
                <Text style={styles.blockStat}>❓ {recommendedBlock.total_questions || 0} questions</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startRecommendedQuiz}
            >
              <Text style={styles.startButtonText}>Start Recommended Block</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All Blocks by Phase */}
        <View style={styles.allBlocksSection}>
          <Text style={styles.sectionTitle}>📚 All Learning Blocks</Text>
          
          {['foundational', 'development', 'mastery'].map(phase => {
            const phaseBlocks = blocks.filter(block => block.phase === phase);
            if (phaseBlocks.length === 0) return null;

            return (
              <View key={phase} style={styles.phaseSection}>
                <Text style={styles.phaseTitle}>
                  {getPhaseIcon(phase)} {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                </Text>
                
                {phaseBlocks.map(block => (
                  <TouchableOpacity 
                    key={block.id}
                    style={styles.blockCard}
                    onPress={() => handleBlockPress(block)}
                  >
                    <View style={styles.blockHeader}>
                      <Text style={styles.blockSequence}>Block {block.sequence_order}</Text>
                      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(block.difficulty_level) }]}>
                        <Text style={styles.difficultyText}>{block.difficulty_level.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.blockName}>{block.block_name}</Text>
                    <Text style={styles.blockSummary} numberOfLines={2}>{block.narrative_summary}</Text>
                    
                    <View style={styles.blockStats}>
                      <Text style={styles.blockStat}>📖 Sargas {block.start_sarga}-{block.end_sarga}</Text>
                      <Text style={styles.blockStat}>❓ {block.total_questions || 0} questions</Text>
                    </View>
                    
                    {block.key_themes.length > 0 && (
                      <View style={styles.themes}>
                        {block.key_themes.slice(0, 3).map((theme, index) => (
                          <View key={index} style={styles.themeTag}>
                            <Text style={styles.themeText}>{theme}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>

        {/* Quick Start Option */}
        <View style={styles.quickStartSection}>
          <TouchableOpacity 
            style={styles.quickStartButton}
            onPress={() => navigation.navigate('Quiz', { epic, difficulty })}
          >
            <Text style={styles.quickStartText}>🎲 Random Quiz (Classic Mode)</Text>
            <Text style={styles.quickStartSubtext}>Mix of questions from all blocks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
  },
  loadingText: {
    ...Typography.bodyLarge,
    color: theme.colors.textSecondary,
    marginTop: Spacing.medium,
    textAlign: 'center',
  },
  header: {
    paddingVertical: Spacing.large,
    alignItems: 'center',
  },
  title: {
    ...Typography.headingLarge,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: Spacing.small,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  recommendedSection: {
    marginBottom: Spacing.extraLarge,
  },
  sectionTitle: {
    ...Typography.headingMedium,
    color: theme.colors.text,
    marginBottom: Spacing.medium,
  },
  blockCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: Spacing.large,
    marginBottom: Spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  blockPhase: {
    ...Typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  blockSequence: {
    ...Typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  blockName: {
    ...Typography.headingSmall,
    color: theme.colors.text,
    marginBottom: Spacing.small,
  },
  blockSummary: {
    ...Typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginBottom: Spacing.medium,
    lineHeight: 20,
  },
  blockStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.small,
  },
  blockStat: {
    ...Typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.small,
  },
  themeTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: Spacing.small,
    marginBottom: 4,
  },
  themeText: {
    ...Typography.caption,
    color: theme.colors.primary,
    fontSize: 11,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.medium,
    alignItems: 'center',
    marginTop: Spacing.small,
  },
  startButtonText: {
    ...Typography.headingSmall,
    color: '#FFFFFF',
  },
  allBlocksSection: {
    marginBottom: Spacing.extraLarge,
  },
  phaseSection: {
    marginBottom: Spacing.large,
  },
  phaseTitle: {
    ...Typography.headingMedium,
    color: theme.colors.text,
    marginBottom: Spacing.medium,
  },
  quickStartSection: {
    marginBottom: Spacing.extraLarge,
  },
  quickStartButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: Spacing.large,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickStartText: {
    ...Typography.headingSmall,
    color: theme.colors.text,
    marginBottom: 4,
  },
  quickStartSubtext: {
    ...Typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default BlockSelectionScreen;