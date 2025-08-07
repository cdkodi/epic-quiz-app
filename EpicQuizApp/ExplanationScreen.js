/**
 * Explanation Screen - Review quiz answers with cultural context
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

// Enhanced quiz data with explanations
const questionsWithExplanations = [
  {
    id: 1,
    text: "Who is the main protagonist of the Ramayana?",
    options: ["Krishna", "Rama", "Arjuna", "Hanuman"],
    correctAnswer: 1,
    explanation: "Rama is the seventh avatar of Vishnu and the main protagonist of the Ramayana. He represents the ideal man (Purushottama) and demonstrates perfect adherence to dharma (righteousness).",
    culturalContext: "Rama is revered across India as Maryada Purushottama - the perfect man who never strayed from the path of righteousness, even in the most difficult circumstances."
  },
  {
    id: 2,
    text: "What is Rama's wife's name?",
    options: ["Radha", "Sita", "Rukmini", "Draupadi"],
    correctAnswer: 1,
    explanation: "Sita is Rama's devoted wife, considered an incarnation of Goddess Lakshmi. She represents the ideal of feminine virtue, devotion, and purity in Hindu tradition.",
    culturalContext: "Sita's unwavering devotion to Rama, even during her captivity in Lanka, makes her a symbol of marital fidelity and strength in Indian culture."
  },
  {
    id: 3,
    text: "Who is Rama's loyal companion and devotee?",
    options: ["Hanuman", "Lakshmana", "Bharata", "Shatrughna"],
    correctAnswer: 0,
    explanation: "Hanuman, the monkey deity, is Rama's most devoted follower. His unwavering loyalty, courage, and strength make him one of the most beloved characters in the Ramayana.",
    culturalContext: "Hanuman represents the ideal devotee (bhakta) and is worshipped across India for his strength, courage, and devotion. Tuesday is considered especially auspicious for Hanuman worship."
  },
  {
    id: 4,
    text: "What weapon does Rama use to defeat Ravana?",
    options: ["Sudarshan Chakra", "Brahmastra", "Bow and Arrow", "Trishul"],
    correctAnswer: 2,
    explanation: "Rama uses his divine bow and arrows to defeat Ravana. His mastery of archery symbolizes precision, focus, and the triumph of good over evil.",
    culturalContext: "The bow (Kodanda) is Rama's signature weapon. Archery in ancient India was not just a martial skill but a spiritual discipline requiring focus and righteousness."
  },
  {
    id: 5,
    text: "Who is the demon king of Lanka?",
    options: ["Kumbhakarna", "Ravana", "Meghnad", "Surpanakha"],
    correctAnswer: 1,
    explanation: "Ravana, the ten-headed demon king of Lanka, is the primary antagonist. Despite his knowledge and power, his ego and desires led to his downfall, teaching us about the dangers of unchecked pride.",
    culturalContext: "Ravana was a great scholar of the Vedas and a powerful king, showing that knowledge without righteousness can lead to destruction. His ten heads symbolize the ten negative qualities that humans must overcome."
  }
];

const ExplanationScreen = ({ route, navigation }) => {
  const { answers } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Get wrong answers only
  const wrongAnswers = answers.filter(answer => !answer.isCorrect);
  
  if (wrongAnswers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.perfectScoreContainer}>
          <Text style={styles.perfectScoreTitle}>🏆 Perfect Score!</Text>
          <Text style={styles.perfectScoreText}>
            You answered all questions correctly! Your knowledge of the Ramayana is excellent.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('DeepDive')}
          >
            <Text style={styles.primaryButtonText}>🔍 Explore Deep Dive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.secondaryButtonText}>🏠 Back to Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentWrongAnswer = wrongAnswers[currentQuestionIndex];
  const questionData = questionsWithExplanations.find(q => q.id === currentWrongAnswer.questionId);
  
  const handleNext = () => {
    if (currentQuestionIndex < wrongAnswers.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Navigate to Deep Dive or back to library
      navigation.navigate('DeepDive');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {wrongAnswers.length}
          </Text>
          <Text style={styles.reviewingText}>Reviewing Incorrect Answers</Text>
        </View>

        {/* Question Review */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questionData.text}</Text>
          
          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {questionData.options.map((option, index) => (
              <View
                key={index}
                style={[
                  styles.optionItem,
                  index === questionData.correctAnswer && styles.correctOption,
                  index === currentWrongAnswer.selectedAnswer && styles.wrongOption
                ]}
              >
                <Text style={styles.optionLabel}>
                  {String.fromCharCode(65 + index)})
                </Text>
                <Text style={[
                  styles.optionText,
                  index === questionData.correctAnswer && styles.correctOptionText,
                  index === currentWrongAnswer.selectedAnswer && styles.wrongOptionText
                ]}>
                  {option}
                </Text>
                {index === questionData.correctAnswer && (
                  <Text style={styles.correctIcon}>✓</Text>
                )}
                {index === currentWrongAnswer.selectedAnswer && index !== questionData.correctAnswer && (
                  <Text style={styles.wrongIcon}>✗</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Explanation Section */}
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>📖 Explanation</Text>
          <Text style={styles.explanationText}>{questionData.explanation}</Text>
        </View>

        {/* Cultural Context Section */}
        <View style={styles.culturalContainer}>
          <Text style={styles.culturalTitle}>🕉️ Cultural Context</Text>
          <Text style={styles.culturalText}>{questionData.culturalContext}</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevious}
            >
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNext}
          >
            <Text style={styles.primaryButtonText}>
              {currentQuestionIndex === wrongAnswers.length - 1 ? '🔍 Deep Dive' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Learning Progress */}
        <View style={styles.learningContainer}>
          <Text style={styles.learningText}>
            🌟 Learning from mistakes helps deepen your understanding of the Ramayana's rich cultural significance!
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
  progressHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 4,
  },
  reviewingText: {
    fontSize: 14,
    color: '#666666',
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  correctOption: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E8',
  },
  wrongOption: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginRight: 12,
    minWidth: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  correctOptionText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  wrongOptionText: {
    color: '#D32F2F',
    fontWeight: '500',
  },
  correctIcon: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  wrongIcon: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  culturalContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  culturalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
  },
  culturalText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4700A',
  },
  navButtonText: {
    fontSize: 16,
    color: '#D4700A',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#D4700A',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  primaryButtonText: {
    fontSize: 16,
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
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4700A',
  },
  learningContainer: {
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  learningText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  perfectScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  perfectScoreTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 20,
    textAlign: 'center',
  },
  perfectScoreText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
});

export default ExplanationScreen;