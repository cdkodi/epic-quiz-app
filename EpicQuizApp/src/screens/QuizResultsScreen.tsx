/**
 * Quiz Results Screen - Score visualization and performance breakdown
 * Matches HTML mockup design exactly with celebration and review options
 */

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Alert,
  Animated
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ScoreCircle, PerformanceBreakdown } from '../components/results';
import { Button, Card } from '../components/common';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';

type QuizResultsScreenRouteProp = RouteProp<RootStackParamList, 'QuizResults'>;
type QuizResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;

interface QuizResultsScreenProps {
  route: QuizResultsScreenRouteProp;
}

const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({ route }) => {
  const navigation = useNavigation<QuizResultsScreenNavigationProp>();
  const { 
    epic, 
    quizPackage, 
    answers, 
    score, 
    correctAnswers, 
    feedback 
  } = route.params;

  // Animation state
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animate in the results with celebration
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Show achievement alert for high scores
    if (score >= 90) {
      setTimeout(() => {
        Alert.alert(
          '🏆 Amazing!',
          'You scored 90%+ and demonstrated excellent knowledge of the Ramayana!',
          [{ text: 'Awesome!', style: 'default' }]
        );
      }, 1500);
    }
  }, [fadeAnim, slideAnim, score]);

  const getCelebrationMessage = (score: number) => {
    if (score >= 90) return '🏆 EXCELLENT!';
    if (score >= 70) return '🎉 GREAT JOB!';
    if (score >= 50) return '👍 GOOD WORK!';
    return '📚 KEEP LEARNING!';
  };

  const getScoreDescription = (score: number, total: number) => {
    const correct = Math.round((score / 100) * total);
    return `${correct} out of ${total} correct`;
  };

  const handleReviewAnswers = () => {
    // Navigate to Explanation screen for wrong answers
    const incorrectQuestions = quizPackage.questions
      .map((question, index) => {
        const userAnswer = answers.find(a => a.question_id === question.id);
        const isCorrect = correctAnswers.includes(question.id);
        return {
          question,
          userAnswer: userAnswer?.user_answer ?? -1,
          isCorrect,
        };
      })
      .filter(q => !q.isCorrect);

    if (incorrectQuestions.length > 0) {
      navigation.navigate('Explanation', {
        epic,
        questions: incorrectQuestions,
        currentIndex: 0,
      });
    }
  };

  const handleTakeNewQuiz = () => {
    Alert.alert(
      '🎯 New Quiz',
      'Ready for another quiz to improve your knowledge?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start New Quiz',
          style: 'default',
          onPress: () => {
            // Navigate back to Epic Library for new quiz selection
            navigation.popToTop();
          }
        }
      ]
    );
  };

  const handleBackToLibrary = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Celebration Header */}
          <View style={styles.celebrationContainer}>
            <Text style={styles.celebrationTitle}>
              {getCelebrationMessage(score)}
            </Text>
          </View>

          {/* Score Circle */}
          <Card style={styles.scoreCard}>
            <View style={styles.scoreContainer}>
              <ScoreCircle score={score} size={140} />
              <Text style={styles.scoreDescription}>
                {getScoreDescription(score, quizPackage.questions.length)}
              </Text>
              <Text style={styles.feedbackText}>
                {feedback}
              </Text>
            </View>
          </Card>

          {/* Performance Breakdown */}
          <PerformanceBreakdown
            quizPackage={quizPackage}
            answers={answers}
            correctAnswers={correctAnswers}
            onReviewPress={correctAnswers.length < quizPackage.questions.length ? handleReviewAnswers : undefined}
          />

          {/* Epic Progress Summary */}
          <Card style={styles.progressCard}>
            <Text style={styles.progressTitle}>
              📈 Epic Progress
            </Text>
            <Text style={styles.progressText}>
              You're building strong knowledge of {epic.title}! 
            </Text>
            <Text style={styles.progressSubtext}>
              {score >= 70 
                ? 'Excellent understanding of the characters, events, and themes.'
                : 'Keep practicing to master the cultural significance and deeper meanings.'
              }
            </Text>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Review Wrong Answers (only if there are any) */}
            {correctAnswers.length < quizPackage.questions.length && (
              <Button
                title="📖 Review Wrong Answers"
                onPress={handleReviewAnswers}
                variant="secondary"
                style={styles.actionButton}
              />
            )}

            {/* Action Row */}
            <View style={styles.buttonRow}>
              <Button
                title="🎯 New Quiz"
                onPress={handleTakeNewQuiz}
                variant="success"
                style={styles.halfButton}
              />
              
              <Button
                title="🏠 Library"
                onPress={handleBackToLibrary}
                variant="primary"
                style={styles.halfButton}
              />
            </View>
          </View>

          {/* Motivational Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {score >= 80
                ? '🌟 You\'re mastering classical literature!'
                : '📚 Every quiz builds your cultural knowledge!'
              }
            </Text>
          </View>
        </Animated.View>
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

  celebrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.l,
  },

  celebrationTitle: {
    ...Typography.hero,
    color: theme.colors.primarySaffron,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scoreCard: {
    alignItems: 'center',
    marginBottom: Spacing.m,
    paddingVertical: Spacing.xl,
  },

  scoreContainer: {
    alignItems: 'center',
  },

  scoreDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    marginTop: Spacing.m,
    textAlign: 'center',
  },

  feedbackText: {
    ...Typography.body,
    color: theme.text.primary,
    marginTop: Spacing.s,
    textAlign: 'center',
    fontWeight: '500',
  },

  progressCard: {
    marginBottom: Spacing.m,
  },

  progressTitle: {
    ...Typography.h3,
    color: theme.text.primary,
    marginBottom: Spacing.s,
    textAlign: 'center',
  },

  progressText: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },

  progressSubtext: {
    ...Typography.bodySmall,
    color: theme.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  actionsContainer: {
    marginTop: Spacing.m,
  },

  actionButton: {
    marginBottom: Spacing.m,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.s,
  },

  halfButton: {
    flex: 1,
  },

  footerContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.l,
  },

  footerText: {
    ...Typography.bodySmall,
    color: theme.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default QuizResultsScreen;