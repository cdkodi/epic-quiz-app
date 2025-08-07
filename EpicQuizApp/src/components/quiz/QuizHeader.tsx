/**
 * Quiz Header Component - Shows progress and timer
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../common';
import { theme, Typography, Spacing } from '../../constants';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number; // in seconds
  showTimer?: boolean;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  timeElapsed,
  showTimer = true,
}) => {
  const progress = (currentQuestion - 1) / totalQuestions; // -1 because currentQuestion is 1-indexed
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Question Counter */}
      <Text style={styles.questionCounter}>
        Question {currentQuestion} of {totalQuestions}
      </Text>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={progress}
          color={theme.colors.primaryGreen}
          height={8}
        />
      </View>
      
      {/* Timer */}
      {showTimer && (
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>⏱️ {formatTime(timeElapsed)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    backgroundColor: theme.backgrounds.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  
  questionCounter: {
    ...Typography.bodySmall,
    color: theme.text.tertiary,
    marginBottom: Spacing.s,
    textAlign: 'center',
  },
  
  progressContainer: {
    marginBottom: Spacing.m,
  },
  
  timerContainer: {
    alignItems: 'flex-end',
  },
  
  timer: {
    ...Typography.body,
    color: theme.colors.primaryBlue,
    fontWeight: '600',
  },
});

export default QuizHeader;