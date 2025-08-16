/**
 * Answer Review Screen - Shows question explanations and cultural context
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme, Typography, ComponentSpacing, Spacing } from '../constants';
import { Button, Card } from '../components/common';

type ExplanationScreenRouteProp = RouteProp<RootStackParamList, 'Explanation'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Explanation'>;

interface ExplanationScreenProps {
  route: ExplanationScreenRouteProp;
}

const ExplanationScreen: React.FC<ExplanationScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { epic, questions, currentIndex } = route.params;
  
  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No questions available for review.</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const question = currentQuestion?.question;
  
  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Question data not available.</Text>
      </SafeAreaView>
    );
  }

  const handleLearnMore = () => {
    navigation.navigate('DeepDive', {
      questionId: question.id,
      questionText: question.questionText || question.text || 'Question',
    });
  };

  const getAnswerIcon = (index: number) => {
    if (index === question.correctAnswerId) {
      return '✅'; // Correct answer
    } else if (index === currentQuestion.userAnswer && !currentQuestion.isCorrect) {
      return '❌'; // User's wrong answer
    }
    return '⚪'; // Other options
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.questionNumber}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.resultIndicator}>
            {currentQuestion.isCorrect ? '🎉 Correct!' : '📚 Learning Opportunity'}
          </Text>
        </View>

        {/* Question Card */}
        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>
            {question.questionText || question.text}
          </Text>
        </Card>

        {/* Answer Options */}
        <Card style={styles.answersCard}>
          <Text style={styles.sectionTitle}>Answer Options</Text>
          {question.options?.map((option: string, index: number) => (
            <View key={index} style={styles.optionRow}>
              <Text style={styles.optionIcon}>{getAnswerIcon(index)}</Text>
              <Text 
                style={[
                  styles.optionText,
                  index === question.correctAnswerId && styles.correctOption,
                  index === currentQuestion.userAnswer && !currentQuestion.isCorrect && styles.incorrectOption
                ]}
              >
                {String.fromCharCode(65 + index)}) {option}
              </Text>
            </View>
          ))}
        </Card>

        {/* Basic Explanation */}
        <Card style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>📝 Explanation</Text>
          <Text style={styles.explanationText}>
            {question.explanation || question.basic_explanation || 'Explanation not available.'}
          </Text>
          
          {/* Cultural Context */}
          {question.culturalContext && (
            <>
              <Text style={styles.culturalTitle}>🏛️ Cultural Context</Text>
              <Text style={styles.culturalText}>
                {question.culturalContext}
              </Text>
            </>
          )}
          
          {/* Source Reference */}
          {question.sourceReference && (
            <Text style={styles.sourceText}>
              📚 Source: {question.sourceReference}
            </Text>
          )}
        </Card>

        {/* Learn More Button */}
        <Button
          title="🔍 Learn More - Deep Dive"
          onPress={handleLearnMore}
          variant="secondary"
          style={styles.learnMoreButton}
        />

        {/* Navigation Hint */}
        <Text style={styles.navigationHint}>
          {currentIndex < questions.length - 1 
            ? 'Swipe or navigate to review more questions'
            : 'You have reviewed all questions!'
          }
        </Text>
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
    padding: ComponentSpacing.screenHorizontal,
    paddingBottom: ComponentSpacing.screenVertical,
  },
  
  header: {
    marginBottom: Spacing.l,
    alignItems: 'center',
  },
  
  questionNumber: {
    ...Typography.h3,
    color: theme.text.secondary,
    marginBottom: Spacing.xs,
  },
  
  resultIndicator: {
    ...Typography.h2,
    color: theme.colors.primarySaffron,
    textAlign: 'center',
  },
  
  questionCard: {
    marginBottom: Spacing.m,
    padding: Spacing.l,
  },
  
  questionText: {
    ...Typography.h3,
    color: theme.text.primary,
    lineHeight: 28,
  },
  
  answersCard: {
    marginBottom: Spacing.m,
    padding: Spacing.l,
  },
  
  sectionTitle: {
    ...Typography.h3,
    color: theme.colors.primarySaffron,
    marginBottom: Spacing.m,
    fontWeight: '600',
  },
  
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
    paddingVertical: Spacing.xs,
  },
  
  optionIcon: {
    fontSize: 18,
    marginRight: Spacing.m,
    width: 24,
  },
  
  optionText: {
    ...Typography.body,
    color: theme.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  
  correctOption: {
    color: theme.colors.primaryGreen,
    fontWeight: '600',
  },
  
  incorrectOption: {
    color: theme.colors.error,
    fontWeight: '600',
  },
  
  explanationCard: {
    marginBottom: Spacing.m,
    padding: Spacing.l,
  },
  
  explanationText: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 24,
    marginBottom: Spacing.m,
  },
  
  culturalTitle: {
    ...Typography.subtitle,
    color: theme.colors.primaryBlue,
    fontWeight: '600',
    marginBottom: Spacing.s,
    marginTop: Spacing.s,
  },
  
  culturalText: {
    ...Typography.body,
    color: theme.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: Spacing.m,
  },
  
  sourceText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  
  learnMoreButton: {
    marginBottom: Spacing.l,
    marginHorizontal: Spacing.m,
  },
  
  navigationHint: {
    ...Typography.caption,
    color: theme.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  errorText: {
    ...Typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    margin: Spacing.xl,
  },
});

export default ExplanationScreen;