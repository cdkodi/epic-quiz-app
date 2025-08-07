/**
 * Question Card Component - Displays question with answer options
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuizQuestion } from '../../types/api';
import { Card } from '../common';
import AnswerOption from './AnswerOption';
import { theme, Typography, Spacing } from '../../constants';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
}) => {
  return (
    <Card style={styles.card}>
      {/* Question Text */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            option={option}
            index={index}
            isSelected={selectedAnswer === index}
            onPress={() => onAnswerSelect(index)}
            disabled={disabled}
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.m,
    marginVertical: Spacing.s,
  },
  
  questionContainer: {
    paddingVertical: Spacing.s,
  },
  
  questionText: {
    ...Typography.questionText,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  
  divider: {
    height: 1,
    backgroundColor: theme.colors.lightGray,
    marginVertical: Spacing.m,
  },
  
  optionsContainer: {
    paddingVertical: Spacing.s,
  },
});

export default QuestionCard;