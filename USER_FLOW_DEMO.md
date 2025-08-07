# Epic Quiz App - Complete User Flow Demo

## 🎯 Navigation Flow: Epic Library → Quiz → Results

### 1. **Epic Library Screen** (`EpicLibraryScreen.tsx`)
**Entry Point**: App launches here (`initialRouteName="EpicLibrary"`)

**What User Sees**:
```
📚 Epic Library

Discover Classical Literature

┌─────────────────────────────────────┐
│ 🕉️  THE RAMAYANA (Sanskrit)         │
│ Ancient Epic of Honor & Duty        │
│ ████████░░ 80% Complete             │
│ 847 Questions Available             │
│ 🟢 AVAILABLE                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚔️  THE MAHABHARATA (Sanskrit)      │
│ Great Epic of Cosmic War            │
│ ░░░░░░░░░░ 0% Complete              │
│ 1,200+ Questions Ready              │
│ 🔒 UNLOCK BY COMPLETING RAMAYANA   │
└─────────────────────────────────────┘

Recent Achievements:
🎖️ Characters Master
🌟 5-Day Learning Streak
```

**User Action**: Taps on "THE RAMAYANA" card
**Navigation Trigger**: `handleEpicPress()` in EpicLibraryScreen.tsx:84

```typescript
Alert.alert(
  '🎯 Start Quiz',
  `Ready to test your knowledge of ${epic.title}?`,
  [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Start Learning',
      onPress: async () => {
        const quizPackage = getMockQuiz(epic.id, 10);
        navigation.navigate('Quiz', {
          epic,
          quizPackage,
        });
      }
    }
  ]
);
```

---

### 2. **Quiz Screen** (`QuizScreen.tsx`)
**Navigation**: `navigation.navigate('Quiz', { epic, quizPackage })`

**What User Sees**:
```
🕉️ THE RAMAYANA                    [X]

Question 1 of 10                    ⏱️ 0:45

━━━━░░░░░░░░░░░░░░░░ 10% Complete

Who is the main protagonist of the Ramayana?

⚪ A) Krishna
🔵 B) Rama          ← User selected
⚪ C) Arjuna
⚪ D) Hanuman

                    [Continue]
```

**Key Features**:
- **Progress bar**: Shows question X of 10
- **Timer**: Counts down from 60 seconds per question
- **Answer selection**: Visual feedback on selection
- **Auto-advance**: After 10 questions completed
- **Score calculation**: Real-time tracking

**Navigation Trigger**: After completing 10 questions in `handleSubmitAnswer()`:

```typescript
if (currentQuestionIndex === quizData.questions.length - 1) {
  // Calculate final results
  const finalScore = Math.round((correctCount / quizData.questions.length) * 100);
  
  navigation.replace('QuizResults', {
    epic,
    quizPackage: quizData,
    answers: allAnswers,
    score: finalScore,
    correctAnswers: correctQuestionIds,
    feedback: getFeedbackMessage(finalScore)
  });
}
```

---

### 3. **Quiz Results Screen** (`QuizResultsScreen.tsx`)
**Navigation**: `navigation.replace('QuizResults', { ... })`

**What User Sees**:
```
🎉 Quiz Complete!                   [<]

          🏆 EXCELLENT!

        ┌─────────────┐
        │      85%    │ ← Animated circular progress
        │             │   Color: Green (85% score)
        └─────────────┘
        8 out of 10 correct
    Strong knowledge demonstrated!

┌─────────────────────────────────────┐
│          📊 Your Performance        │
│                                     │
│ Total Questions: 10                 │
│ Correct Answers: 8                  │
│ Incorrect Answers: 2                │
│                                     │
│ ✅ Correct (8)                      │
│ • Who is the main protagonist...    │
│ • What is Rama's wife's name...     │
│ • Who is Rama's loyal companion...  │
│ ...and 5 more correct              │
│                                     │
│ ❌ Review Needed (2)                │
│ • What weapon does Rama use...      │
│ • Who is the demon king of...       │
│                                     │
│    [📖 Review Wrong Answers]        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          📈 Epic Progress           │
│                                     │
│ You're building strong knowledge    │
│ of THE RAMAYANA!                    │
│                                     │
│ Excellent understanding of the      │
│ characters, events, and themes.     │
└─────────────────────────────────────┘

[🎯 New Quiz]           [🏠 Library]

🌟 You're mastering classical literature!
```

**Key Features**:
- **Animated entrance**: Fade + slide animations
- **Score circle**: Color-coded progress (green/saffron/red)
- **Performance breakdown**: Shows correct/incorrect questions
- **Achievement alerts**: Popup for 90%+ scores
- **Navigation options**: Review answers, new quiz, return to library

**Navigation Options**:

1. **Review Wrong Answers** → `navigation.navigate('Explanation', {...})`
2. **New Quiz** → `navigation.popToTop()` (back to Epic Library)
3. **Library** → `navigation.popToTop()` (back to Epic Library)

---

## 🔄 Complete Flow Summary

```
📚 Epic Library Screen
       ↓ (Tap Ramayana card)
   [Alert: Start Quiz?]
       ↓ (Tap "Start Learning")
   🎯 Quiz Screen
       ↓ (Complete 10 questions)
   🎉 Quiz Results Screen
       ↓ (Multiple navigation options)
   📖 Explanation Screen (future)
   📚 Deep Dive Screen (future)
   🏠 Back to Library
```

## 🎨 Visual Design Elements

**Colors Used Throughout**:
- **Primary Saffron**: `#D4700A` - Headers, buttons, highlights
- **Primary Green**: `#2E7D32` - Success states, high scores
- **Primary Blue**: `#1565C0` - Secondary buttons, progress
- **Cultural Icons**: 🕉️ (Ramayana), ⚔️ (Mahabharata)

**Animation Features**:
- **Screen transitions**: Native stack navigation
- **Score circle**: Animated progress ring
- **Celebration**: Fade-in effects, achievement alerts
- **Loading states**: Smooth transitions between screens

## 📱 Data Flow

**Epic Library** → **Quiz** → **Results**
```typescript
Epic Data → Quiz Package → Quiz Answers → Results Data
   ↓            ↓             ↓              ↓
mockEpics → getMockQuiz() → answers[] → score calculation
```

**Current Status**: ✅ Complete flow from Library → Quiz → Results
**Next Steps**: 📖 Explanation screen, 📚 Deep Dive screen