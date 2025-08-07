/**
 * Quiz Screen - Interactive Ramayana Quiz
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';

// Real Ramayana quiz data from backend database
// This data mirrors the production backend content with Sanskrit integration
const ramayanaQuestions = [
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

const QuizScreen = ({ route, navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Save the answer
    const newAnswer = {
      questionId: ramayanaQuestions[currentQuestion].id,
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer === ramayanaQuestions[currentQuestion].correctAnswer
    };
    
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Check if quiz is complete
    if (currentQuestion < ramayanaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(60); // Reset timer for next question
    } else {
      // Quiz completed - calculate results
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      const score = Math.round((correctCount / ramayanaQuestions.length) * 100);
      
      setQuizCompleted(true);
      
      // Navigate to results
      setTimeout(() => {
        navigation.navigate('QuizResults', {
          score,
          correctCount,
          totalQuestions: ramayanaQuestions.length,
          answers: newAnswers
        });
      }, 1000);
    }
  };

  const question = ramayanaQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / ramayanaQuestions.length) * 100;

  if (quizCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>🎉 Quiz Completed!</Text>
          <Text style={styles.completedSubtext}>Calculating your results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {ramayanaQuestions.length}
        </Text>
        <Text style={styles.timer}>⏱️ {timeLeft}s</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + index)})
              </Text>
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedAnswer === null && styles.disabledButton
        ]}
        onPress={handleNextQuestion}
        disabled={selectedAnswer === null}
      >
        <Text style={[
          styles.continueButtonText,
          selectedAnswer === null && styles.disabledButtonText
        ]}>
          {currentQuestion === ramayanaQuestions.length - 1 ? 'Finish Quiz' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4700A',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  questionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#D4700A',
    backgroundColor: '#FFF7E6',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  selectedOptionText: {
    color: '#D4700A',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#D4700A',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  disabledButtonText: {
    color: '#666666',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  completedText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4700A',
    marginBottom: 16,
    textAlign: 'center',
  },
  completedSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default QuizScreen;