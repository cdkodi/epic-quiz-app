/**
 * Epic Card Component - Matches HTML mockup design exactly
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Epic } from '../../types/api';
import { Card, ProgressBar, Button } from '../common';
import { theme, Typography, ComponentSpacing, Spacing } from '../../constants';

interface EpicCardProps {
  epic: Epic;
  userProgress?: {
    completed_questions: number;
    total_questions: number;
    completion_percentage: number;
    accuracy_rate: number;
  };
  onPress: () => void;
}

const EpicCard: React.FC<EpicCardProps> = ({ epic, userProgress, onPress }) => {
  const getCultureIcon = (culture: string) => {
    switch (culture?.toLowerCase()) {
      case 'hindu':
        return '🕉️';
      case 'greek':
        return '🏛️';
      case 'roman':
        return '🏺';
      default:
        return '📚';
    }
  };

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return '🌟';
      case 'intermediate':
        return '⚡';
      case 'advanced':
        return '💎';
      default:
        return '📖';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Beginner Friendly';
      case 'intermediate':
        return 'Intermediate Level';
      case 'advanced':
        return 'Advanced Level';
      default:
        return 'All Levels';
    }
  };

  const getButtonConfig = () => {
    if (epic.is_available && epic.question_count > 0) {
      return {
        title: '📖 Start Learning',
        variant: 'primary' as const,
        onPress: onPress,
        disabled: false,
      };
    } else if (!epic.is_available && epic.id === 'mahabharata') {
      return {
        title: '🔒 Unlock with Ramayana',
        variant: 'disabled' as const,
        onPress: () => {},
        disabled: true,
      };
    } else {
      return {
        title: '🚧 Coming Soon',
        variant: 'disabled' as const,
        onPress: () => {},
        disabled: true,
      };
    }
  };

  const buttonConfig = getButtonConfig();
  const completionProgress = userProgress ? userProgress.completion_percentage / 100 : 0;

  return (
    <Card style={styles.card}>
      {/* Epic Title with Cultural Icon */}
      <Text style={styles.title}>
        {getCultureIcon(epic.culture || '')} {epic.title}
      </Text>

      {/* Description */}
      <Text style={styles.description}>{epic.description}</Text>

      {/* Difficulty Level */}
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficulty}>
          {getDifficultyIcon(epic.difficulty_level || 'beginner')} {getDifficultyLabel(epic.difficulty_level || 'beginner')}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={completionProgress}
          showLabel={false}
          color={epic.is_available ? theme.colors.primaryGreen : theme.colors.lightGray}
        />
      </View>

      {/* Question Count or Status */}
      <Text style={styles.questionCount}>
        {epic.is_available && epic.question_count > 0
          ? `${epic.question_count} Questions Available`
          : epic.id === 'mahabharata'
          ? 'Unlock by mastering Ramayana basics'
          : 'Future Release'
        }
      </Text>

      {/* Progress Stats (only show for available epics with progress) */}
      {epic.is_available && userProgress && userProgress.completed_questions > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            📚 {userProgress.completed_questions} Questions Answered
          </Text>
          <Text style={styles.statsText}>
            🏆 {userProgress.accuracy_rate}% Accuracy
          </Text>
        </View>
      )}

      {/* Action Button */}
      <Button
        title={buttonConfig.title}
        onPress={buttonConfig.onPress}
        variant={buttonConfig.variant}
        disabled={buttonConfig.disabled}
        style={styles.button}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: ComponentSpacing.cardMargin,
  },

  title: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.s,
    fontWeight: '600',
  },

  description: {
    ...Typography.bodySmall,
    color: theme.text.secondary,
    marginBottom: Spacing.s,
  },

  difficultyContainer: {
    marginBottom: Spacing.s,
  },

  difficulty: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontSize: 12,
  },

  progressContainer: {
    marginBottom: Spacing.s,
  },

  questionCount: {
    ...Typography.caption,
    color: theme.text.tertiary,
    marginBottom: Spacing.m,
  },

  statsContainer: {
    marginBottom: Spacing.m,
  },

  statsText: {
    ...Typography.caption,
    color: theme.text.secondary,
    marginBottom: 2,
  },

  button: {
    marginTop: Spacing.s,
  },
});

export default EpicCard;