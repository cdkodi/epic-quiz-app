/**
 * Epic Card Component - Matches HTML mockup design exactly
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Epic } from '../../types/api';
import { Card, ProgressBar, Button, EpicImage } from '../common';
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
    if (epic.id === 'ramayana') {
      return {
        title: 'Continue',
        variant: 'primary' as const,
        onPress: onPress,
        disabled: false,
      };
    } else if (epic.id === 'mahabharata') {
      return {
        title: 'Coming Soon',
        variant: 'disabled' as const,
        onPress: () => {},
        disabled: true,
      };
    } else if (epic.id === 'bhagavad_gita') {
      return {
        title: 'Coming Soon',
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
      {/* Epic Image Header */}
      <EpicImage
        epicId={epic.id}
        aspectRatio="wide"
        containerStyle={styles.imageContainer}
        showFallback={true}
        fallbackIcon={getCultureIcon(epic.culture || '')}
      />

      {/* Epic Title */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{epic.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{epic.description}</Text>

        {/* Action Button */}
        <Button
          title={buttonConfig.title}
          onPress={buttonConfig.onPress}
          variant={buttonConfig.variant}
          disabled={buttonConfig.disabled}
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: ComponentSpacing.cardMargin,
    padding: 0, // Remove default padding since we're adding image
  },

  imageContainer: {
    marginBottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  contentContainer: {
    padding: ComponentSpacing.cardPadding,
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
    marginBottom: Spacing.m,
  },

  completionText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    marginBottom: Spacing.l,
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