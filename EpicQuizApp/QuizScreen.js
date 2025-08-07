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

// Mock quiz data
const ramayanaQuestions = [
  {
    id: 1,
    text: "Who is the main protagonist of the Ramayana?",
    options: ["Krishna", "Rama", "Arjuna", "Hanuman"],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "What is Rama's wife's name?",
    options: ["Radha", "Sita", "Rukmini", "Draupadi"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Who is Rama's loyal companion and devotee?",
    options: ["Hanuman", "Lakshmana", "Bharata", "Shatrughna"],
    correctAnswer: 0
  },
  {
    id: 4,
    text: "What weapon does Rama use to defeat Ravana?",
    options: ["Sudarshan Chakra", "Brahmastra", "Bow and Arrow", "Trishul"],
    correctAnswer: 2
  },
  {
    id: 5,
    text: "Who is the demon king of Lanka?",
    options: ["Kumbhakarna", "Ravana", "Meghnad", "Surpanakha"],
    correctAnswer: 1
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