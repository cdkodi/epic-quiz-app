/**
 * Quiz Screen - Interactive question presentation with timer and flow
 * Matches HTML mockup design exactly with realistic quiz data
 */

import * as React from 'react';
const { useEffect, useState, useCallback } = React;
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  BackHandler,
  ViewStyle
} from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { QuizPackage, QuestionAnswer } from '../types/api';
import { QuizHeader, QuestionCard } from '../components/quiz';
import { Button } from '../components/common';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';

// Mock data import
import { getMockQuiz } from '../data/mockQuizData';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

interface QuizScreenProps {
  route: QuizScreenRouteProp;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ route }) => {
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const { epic } = route.params;
  
  // Quiz state
  const [quizData, setQuizData] = useState<QuizPackage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  // Generate quiz data
  useEffect(() => {
    const generateQuiz = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // TODO: Replace with real API call
        // const response = await apiService.generateQuiz(epic.id, 10);
        // if (response.success) {
        //   setQuizData(response.data);
        // }
        
        // For now, use mock data
        const mockQuiz = getMockQuiz(epic.id, 10);
        setQuizData(mockQuiz);
      } catch (error) {
        console.error('Failed to generate quiz:', error);
        Alert.alert('Error', 'Failed to load quiz. Please try again.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [epic.id, navigation]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle back button press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit Quiz',
          'Are you sure you want to exit? Your progress will be lost.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() }
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (!quizData || selectedAnswer === null) return;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const now = Date.now();
    const timeSpentOnQuestion = Math.floor((now - questionStartTime) / 1000);

    // Save answer
    const newAnswer: QuestionAnswer = {
      question_id: currentQuestion.id,
      user_answer: selectedAnswer,
      time_spent: timeSpentOnQuestion,
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.question_id === currentQuestion.id);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);

    // Check if this is the last question
    if (currentQuestionIndex >= quizData.questions.length - 1) {
      // Quiz complete - navigate to results
      handleQuizComplete(updatedAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    }
  };

  const handleQuizComplete = (finalAnswers: QuestionAnswer[]) => {
    if (!quizData) return;

    // Calculate results
    let correctCount = 0;
    const correctAnswers: string[] = [];

    finalAnswers.forEach(answer => {
      const question = quizData.questions.find(q => q.id === answer.question_id);
      if (question && question.correct_answer_id === answer.user_answer) {
        correctCount++;
        correctAnswers.push(answer.question_id);
      }
    });

    const score = Math.round((correctCount / finalAnswers.length) * 100);
    const feedback = generateFeedback(score);

    // Navigate to results
    navigation.navigate('QuizResults', {
      epic,
      quizPackage: quizData,
      answers: finalAnswers,
      score,
      correctAnswers,
      feedback,
    });
  };

  const generateFeedback = (score: number): string => {
    if (score >= 90) return "Excellent work! You have a deep understanding of this epic.";
    if (score >= 70) return "Good job! You're developing strong knowledge of the epic.";
    if (score >= 50) return "Not bad! Consider reviewing the areas where you missed questions.";
    return "Keep practicing! Focus on the fundamentals to improve your understanding.";
  };

  const handleSkipQuestion = () => {
    Alert.alert(
      'Skip Question',
      'Are you sure you want to skip this question? You won\'t get points for it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'default',
          onPress: () => {
            // Move to next question without saving answer
            if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
              setSelectedAnswer(null);
              setQuestionStartTime(Date.now());
            } else {
              // Last question - complete quiz with current answers
              handleQuizComplete(answers);
            }
          }
        }
      ]
    );
  };

  if (loading || !quizData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing your quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (quizData.questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No questions available for {epic.title}</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Quiz Header with Progress and Timer */}
      <QuizHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={quizData.questions.length}
        timeElapsed={timeElapsed}
      />

      {/* Question Card */}
      <View style={styles.questionContainer}>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />
      </View>

      {/* Action Button */}
      <View style={styles.actionsContainer}>
        <Button
          title={selectedAnswer !== null ? "Next →" : "Select an answer"}
          onPress={selectedAnswer !== null ? handleSubmitAnswer : undefined}
          variant="success"
          style={styles.actionButton}
          disabled={selectedAnswer === null}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
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

  errorText: {
    ...Typography.body,
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },

  errorButton: {
    minWidth: 120,
  },

  questionContainer: {
    flex: 1,
    paddingVertical: Spacing.s,
  },

  actionsContainer: {
    paddingHorizontal: ComponentSpacing.screenHorizontal,
    paddingBottom: ComponentSpacing.screenVertical,
    paddingTop: Spacing.l,
  },

  actionButton: {
    width: '100%',
    minHeight: 56,
  } as ViewStyle,
});

export default QuizScreen;