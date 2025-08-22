/**
 * Answer Review Screen - Shows question explanations and cultural context
 */

import React, { useState } from 'react';
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
  const { epic, questions, currentIndex: initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
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

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBackToResults = () => {
    navigation.goBack();
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

        {/* Answer Explanation */}
        <Card style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>
            {currentQuestion.isCorrect ? '✅ Why This Answer is Correct' : '❌ Why This Answer is Wrong'}
          </Text>
          <Text style={styles.explanationText}>
            {question.explanation || question.basic_explanation || 'Explanation not available.'}
          </Text>
          
          {/* Learning Point */}
          <View style={styles.learningPointContainer}>
            <Text style={styles.learningPointTitle}>💡 Key Learning Point</Text>
            <Text style={styles.learningPointText}>
              {currentQuestion.isCorrect 
                ? `Great job identifying the correct answer! This demonstrates your understanding of ${question.category || 'the topic'}.`
                : `This question tests your knowledge of ${question.category || 'the topic'}. Review the correct answer above and the cultural context to strengthen your understanding.`
              }
            </Text>
          </View>
          
          {/* Quick Source Reference */}
          {question.sourceReference && (
            <Text style={styles.sourceText}>
              📖 From: {question.sourceReference}
            </Text>
          )}
        </Card>

        {/* Deep Dive CTA */}
        <Card style={styles.deepDiveCTA}>
          <Text style={styles.deepDiveTitle}>🏛️ Want to Learn More?</Text>
          <Text style={styles.deepDiveDescription}>
            Explore the rich cultural context, historical background, and scholarly insights 
            related to this question in our Deep Dive section.
          </Text>
          <Button
            title="📚 Explore Cultural Deep Dive"
            onPress={handleLearnMore}
            variant="secondary"
            style={styles.deepDiveButton}
          />
        </Card>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          {questions.length > 1 && (
            <View style={styles.navigationButtons}>
              <Button
                title="← Previous"
                onPress={handlePreviousQuestion}
                variant="outline"
                style={[styles.navButton, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
                disabled={currentIndex === 0}
              />
              
              <Text style={styles.navigationCounter}>
                {currentIndex + 1} of {questions.length}
              </Text>
              
              <Button
                title="Next →"
                onPress={handleNextQuestion}
                variant="outline"
                style={[styles.navButton, { opacity: currentIndex === questions.length - 1 ? 0.5 : 1 }]}
                disabled={currentIndex === questions.length - 1}
              />
            </View>
          )}
          
          {/* Back to Results */}
          <Button
            title="📊 Back to Results"
            onPress={handleBackToResults}
            variant="primary"
            style={styles.backButton}
          />
        </View>
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
  
  learningPointContainer: {
    backgroundColor: theme.backgrounds.secondary,
    borderRadius: 8,
    padding: Spacing.m,
    marginTop: Spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primarySaffron,
  },
  
  learningPointTitle: {
    ...Typography.subtitle,
    color: theme.colors.primarySaffron,
    fontWeight: '600',
    marginBottom: Spacing.s,
  },
  
  learningPointText: {
    ...Typography.body,
    color: theme.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  
  sourceText: {
    ...Typography.caption,
    color: theme.text.tertiary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  
  deepDiveCTA: {
    marginBottom: Spacing.l,
    padding: Spacing.l,
    backgroundColor: theme.backgrounds.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primaryBlue,
  },
  
  deepDiveTitle: {
    ...Typography.h3,
    color: theme.colors.primaryBlue,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  
  deepDiveDescription: {
    ...Typography.body,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.m,
  },
  
  deepDiveButton: {
    marginHorizontal: Spacing.s,
  },
  
  navigationContainer: {
    paddingHorizontal: Spacing.m,
  },
  
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
    paddingHorizontal: Spacing.s,
  },
  
  navButton: {
    minWidth: 80,
    paddingVertical: Spacing.s,
  },
  
  navigationCounter: {
    ...Typography.subtitle,
    color: theme.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
  },
  
  backButton: {
    marginHorizontal: Spacing.s,
  },
  
  errorText: {
    ...Typography.body,
    color: theme.colors.error,
    textAlign: 'center',
    margin: Spacing.xl,
  },
});

export default ExplanationScreen;