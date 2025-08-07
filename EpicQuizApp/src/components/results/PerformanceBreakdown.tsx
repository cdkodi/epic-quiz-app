/**
 * Performance Breakdown Component - Shows correct/incorrect questions breakdown
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { QuizPackage, QuestionAnswer } from '../../types/api';
import { Card } from '../common';
import { theme, Typography, Spacing } from '../../constants';

interface PerformanceBreakdownProps {
  quizPackage: QuizPackage;
  answers: QuestionAnswer[];
  correctAnswers: string[];
  onReviewPress?: () => void;
}

const PerformanceBreakdown: React.FC<PerformanceBreakdownProps> = ({
  quizPackage,
  answers,
  correctAnswers,
  onReviewPress,
}) => {
  const totalQuestions = quizPackage.questions.length;
  const correctCount = correctAnswers.length;
  const incorrectCount = totalQuestions - correctCount;

  const getCorrectQuestions = () => {
    return quizPackage.questions
      .filter(q => correctAnswers.includes(q.id))
      .map(q => q.text.substring(0, 50) + (q.text.length > 50 ? '...' : ''));
  };

  const getIncorrectQuestions = () => {
    return quizPackage.questions
      .filter(q => !correctAnswers.includes(q.id))
      .map(q => q.text.substring(0, 50) + (q.text.length > 50 ? '...' : ''));
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>📊 Your Performance</Text>
      
      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>
          Total Questions: {totalQuestions}
        </Text>
        <Text style={styles.statText}>
          Correct Answers: {correctCount}
        </Text>
        <Text style={styles.statText}>
          Incorrect Answers: {incorrectCount}
        </Text>
      </View>

      {/* Correct Questions */}
      {correctCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ✅ Correct ({correctCount})
          </Text>
          {getCorrectQuestions().slice(0, 3).map((question, index) => (
            <Text key={index} style={styles.questionText}>
              • {question}
            </Text>
          ))}
          {correctCount > 3 && (
            <Text style={styles.moreText}>
              ...and {correctCount - 3} more correct
            </Text>
          )}
        </View>
      )}

      {/* Incorrect Questions */}
      {incorrectCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ❌ Review Needed ({incorrectCount})
          </Text>
          {getIncorrectQuestions().slice(0, 3).map((question, index) => (
            <Text key={index} style={styles.questionText}>
              • {question}
            </Text>
          ))}
          {incorrectCount > 3 && (
            <Text style={styles.moreText}>
              ...and {incorrectCount - 3} more to review
            </Text>
          )}
        </View>
      )}

      {/* Review Button */}
      {incorrectCount > 0 && onReviewPress && (
        <TouchableOpacity 
          style={styles.reviewButton}
          onPress={onReviewPress}
        >
          <Text style={styles.reviewButtonText}>
            📖 Review Wrong Answers
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.m,
  },

  title: {
    ...Typography.h3,
    color: theme.text.primary,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },

  statsContainer: {
    backgroundColor: theme.backgrounds.explanation,
    padding: Spacing.m,
    borderRadius: 8,
    marginBottom: Spacing.m,
  },

  statText: {
    ...Typography.body,
    color: theme.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },

  section: {
    marginBottom: Spacing.m,
  },

  sectionTitle: {
    ...Typography.bodySmall,
    color: theme.text.secondary,
    fontWeight: '600',
    marginBottom: Spacing.s,
  },

  questionText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    marginBottom: 2,
    marginLeft: Spacing.s,
  },

  moreText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontStyle: 'italic',
    marginLeft: Spacing.s,
    marginTop: Spacing.xs,
  },

  reviewButton: {
    backgroundColor: theme.colors.primaryBlue,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.s,
  },

  reviewButtonText: {
    ...Typography.bodySmall,
    color: theme.colors.white,
    fontWeight: '600',
  },
});

export default PerformanceBreakdown;