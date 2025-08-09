/**
 * Question Card Component - Displays question with answer options
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuizQuestion } from '../../types/api';
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
    <View style={styles.container}>
      {/* Question Text */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.m,
  },
  
  questionContainer: {
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.s,
  },
  
  questionText: {
    ...Typography.questionText,
    color: theme.text.primary,
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  
  optionsContainer: {
    paddingTop: Spacing.l,
  },
});

export default QuestionCard;