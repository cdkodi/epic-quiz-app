/**
 * Quiz Results Screen - Show quiz performance
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';

const QuizResultsScreen = ({ route, navigation }) => {
  const { score, correctCount, totalQuestions, answers } = route.params;

  const getCelebrationMessage = (score) => {
    if (score >= 90) return '🏆 EXCELLENT!';
    if (score >= 70) return '🎉 GREAT JOB!';
    if (score >= 50) return '👍 GOOD WORK!';
    return '📚 KEEP LEARNING!';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#2E7D32';
    if (score >= 50) return '#D4700A';
    return '#D32F2F';
  };

  const handleReviewAnswers = () => {
    navigation.navigate('Explanation', { answers });
  };

  const handleNewQuiz = () => {
    navigation.popToTop();
  };

  const handleBackToLibrary = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Header */}
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationTitle}>
            {getCelebrationMessage(score)}
          </Text>
        </View>

        {/* Score Circle */}
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
            <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
              {score}%
            </Text>
          </View>
          <Text style={styles.scoreDescription}>
            {correctCount} out of {totalQuestions} correct
          </Text>
        </View>

        {/* Performance Breakdown */}
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>📊 Your Performance</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>Total Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{correctCount}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#D32F2F' }]}>{totalQuestions - correctCount}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
          </View>
        </View>

        {/* Epic Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>📈 Epic Progress</Text>
          <Text style={styles.progressText}>
            You're building strong knowledge of THE RAMAYANA!
          </Text>
          <Text style={styles.progressSubtext}>
            {score >= 70 
              ? 'Excellent understanding of the characters, events, and themes.'
              : 'Keep practicing to master the cultural significance and deeper meanings.'
            }
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Show review button if there are wrong answers */}
          {correctCount < totalQuestions && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleReviewAnswers}
            >
              <Text style={styles.reviewButtonText}>📖 Review Wrong Answers</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNewQuiz}
          >
            <Text style={styles.primaryButtonText}>🎯 Take New Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackToLibrary}
          >
            <Text style={styles.secondaryButtonText}>🏠 Back to Library</Text>
          </TouchableOpacity>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4700A',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  breakdownContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  reviewButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#D4700A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#D4700A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4700A',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default QuizResultsScreen;