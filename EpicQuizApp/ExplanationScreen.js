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

// Real Ramayana quiz data with Sanskrit integration - mirrors backend content
const questionsWithExplanations = [
  {
    id: 1,
    category: 'characters',
    difficulty: 'easy',
    text: "Who is the main protagonist of the Ramayana?",
    options: ["Rama", "Krishna", "Arjuna", "Hanuman"],
    correctAnswer: 0,
    explanation: "Rama is the seventh avatar of Vishnu and the central hero of the Ramayana epic.",
    sanskritQuote: "रामो विग्रहवान्धर्मः",
    translation: "Rama is righteousness personified",
    culturalContext: "Rama represents the ideal of dharmic kingship in Hindu tradition, embodying perfect balance of power and righteousness."
  },
  {
    id: 2,
    category: 'characters',
    difficulty: 'medium',
    text: "What is Hanuman's most famous feat in the Ramayana?",
    options: ["Lifting a mountain", "Crossing the ocean to Lanka", "Defeating Ravana", "Building a bridge"],
    correctAnswer: 1,
    explanation: "Hanuman's leap across the ocean to Lanka to find Sita is one of the most celebrated acts of devotion and strength.",
    sanskritQuote: "हनुमान् समुद्रं लङ्घयति",
    translation: "Hanuman leaps across the ocean",
    culturalContext: "This represents the power of devotion to transcend natural limitations - bhakti granting supernatural abilities."
  },
  {
    id: 3,
    category: 'characters', 
    difficulty: 'hard',
    text: "Who among Rama's brothers chose to accompany him in exile?",
    options: ["Bharata", "Lakshmana", "Shatrughna", "All three brothers"],
    correctAnswer: 1,
    explanation: "Lakshmana voluntarily accompanied Rama and Sita into exile, demonstrating unwavering brotherly loyalty.",
    sanskritQuote: "लक्ष्मणो रामानुगतः",
    translation: "Lakshmana followed Rama",
    culturalContext: "This exemplifies the ideal of family duty and selfless sacrifice in Indian tradition."
  },
  {
    id: 4,
    category: 'events',
    difficulty: 'easy', 
    text: "How long was Rama's exile period?",
    options: ["12 years", "14 years", "16 years", "18 years"],
    correctAnswer: 1,
    explanation: "Rama was exiled for 14 years as decreed by King Dasharatha to fulfill Kaikeyi's boon.",
    sanskritQuote: "चतुर्दश वर्षाणि वने वासः",
    translation: "Fourteen years of dwelling in the forest",
    culturalContext: "The exile represents the vanaprastha (forest dweller) stage, where one renounces worldly pleasures for spiritual growth."
  },
  {
    id: 5,
    category: 'events',
    difficulty: 'medium',
    text: "What caused Sita to cross Lakshmana's protective line?",
    options: ["A beautiful deer", "A crying child", "A beggar seeking alms", "Ravana in disguise"],
    correctAnswer: 2,
    explanation: "Sita crossed the Lakshmana Rekha to give alms to what she thought was a holy beggar, but was actually Ravana in disguise.",
    sanskritQuote: "भिक्षार्थे लक्ष्मणरेखां सीता लङ्घयति",
    translation: "Sita crosses Lakshmana's line for the sake of charity",
    culturalContext: "This demonstrates the conflict between dharmic duty (charity) and practical safety, showing how evil can exploit virtue."
  },
  {
    id: 6,
    category: 'events',
    difficulty: 'hard',
    text: "What was the final test Sita had to undergo after being rescued?",
    options: ["Trial by fire (Agni Pariksha)", "Trial by water", "Trial by combat", "Trial by meditation"],
    correctAnswer: 0,
    explanation: "Sita underwent Agni Pariksha (trial by fire) to prove her purity after her captivity in Lanka.",
    sanskritQuote: "अग्निपरीक्षा सीतायाः",
    translation: "Sita's trial by fire",
    culturalContext: "This reflects ancient concepts of honor and social expectations, though modern interpretations question such gender-based trials."
  },
  {
    id: 7,
    category: 'themes',
    difficulty: 'medium',
    text: "What is the central theme that Rama's character represents?",
    options: ["Love", "Dharma (righteousness)", "Power", "Wisdom"],
    correctAnswer: 1,
    explanation: "Rama is considered the ideal man (Purushottama) who always follows dharma despite personal cost.",
    sanskritQuote: "धर्मे च अर्थे च कामे च मोक्षे च भरतर्षभ",
    translation: "In dharma, wealth, desire, and liberation, O best of Bharatas",
    culturalContext: "Dharma represents moral duty and cosmic order, the foundation of Hindu ethical philosophy."
  },
  {
    id: 8,
    category: 'themes',
    difficulty: 'hard',
    text: "What does Hanuman's character primarily symbolize?",
    options: ["Strength", "Devotion (Bhakti)", "Intelligence", "Courage"],
    correctAnswer: 1,
    explanation: "Hanuman embodies perfect devotion (bhakti) and selfless service to the divine.",
    sanskritQuote: "राम काज किन्हे बिना मोहि कहाँ विश्राम",
    translation: "Without accomplishing Rama's work, where is rest for me?",
    culturalContext: "Hanuman represents the ideal devotee whose love for the divine grants supernatural powers and eternal joy."
  },
  {
    id: 9,
    category: 'culture',
    difficulty: 'medium', 
    text: "What does the name 'Ramayana' literally mean?",
    options: ["Story of Rama", "Journey of Rama", "Rama's way/path", "Rama's victory"],
    correctAnswer: 2,
    explanation: "Ramayana means 'Rama's way' or 'Rama's journey,' referring to both his physical and spiritual path.",
    sanskritQuote: "रामायणं महाकाव्यम्",
    translation: "The Ramayana is a great epic poem",
    culturalContext: "The epic serves as both historical narrative and spiritual guide, showing the path of righteous living."
  },
  {
    id: 10,
    category: 'culture',
    difficulty: 'hard',
    text: "Who is traditionally credited as the author of the Ramayana?",
    options: ["Vyasa", "Valmiki", "Kalidasa", "Tulsidas"],
    correctAnswer: 1,
    explanation: "Sage Valmiki is revered as the Adi Kavi (first poet) and author of the original Sanskrit Ramayana.",
    sanskritQuote: "आदिकाविर्वाल्मीकिः",
    translation: "Valmiki, the first poet", 
    culturalContext: "Valmiki's transformation from bandit to sage poet demonstrates the power of spiritual redemption and divine grace."
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

        {/* Sanskrit Quote Section */}
        {questionData.sanskritQuote && (
          <View style={styles.sanskritContainer}>
            <Text style={styles.sanskritTitle}>🕉️ Sanskrit Quote</Text>
            <Text style={styles.sanskritText}>{questionData.sanskritQuote}</Text>
            <Text style={styles.translationText}>"{questionData.translation}"</Text>
          </View>
        )}

        {/* Cultural Context Section */}
        <View style={styles.culturalContainer}>
          <Text style={styles.culturalTitle}>🏛️ Cultural Context</Text>
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
  sanskritContainer: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D4700A',
    alignItems: 'center',
  },
  sanskritTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 12,
  },
  sanskritText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  translationText: {
    fontSize: 16,
    color: '#333333',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
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