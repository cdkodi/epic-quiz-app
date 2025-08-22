# Epic Quiz App - Content Sourcing & Quiz Organization Plan

## Enhanced Data Model for Story Progression & Thematic Quizzes

### Current Data Model Analysis
The existing system has a flat question structure with basic categorization:
- **Questions**: `category` (characters/events/themes/culture), `difficulty`, `tags`
- **Limitation**: No story progression or narrative sequence tracking
- **Challenge**: Can't create chapter-by-chapter learning paths

### Enhanced Database Schema

#### New Tables Required

**1. Epic Chapters Table**
```sql
CREATE TABLE epic_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    chapter_name VARCHAR(200) NOT NULL,
    sanskrit_name VARCHAR(200), -- Sanskrit chapter name
    story_summary TEXT,
    key_events TEXT[],
    key_characters TEXT[],
    narrative_order INTEGER NOT NULL, -- For story progression
    prerequisite_chapters INTEGER[], -- Chapters that must be completed first
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(epic_id, chapter_number),
    UNIQUE(epic_id, narrative_order)
);
```

**2. Quiz Collections Table**
```sql
CREATE TABLE quiz_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    epic_id VARCHAR(50) NOT NULL REFERENCES epics(id) ON DELETE CASCADE,
    collection_type VARCHAR(50) NOT NULL CHECK (collection_type IN ('story_progression', 'character_focus', 'theme_focus', 'mixed')),
    collection_name VARCHAR(200) NOT NULL,
    description TEXT,
    target_focus VARCHAR(100), -- Character name, theme, or chapter range
    difficulty_range VARCHAR(20) CHECK (difficulty_range IN ('beginner', 'intermediate', 'advanced', 'mixed')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**3. Enhanced Questions Table (Add columns)**
```sql
ALTER TABLE questions ADD COLUMN chapter_id UUID REFERENCES epic_chapters(id);
ALTER TABLE questions ADD COLUMN narrative_position INTEGER; -- Position within chapter
ALTER TABLE questions ADD COLUMN character_focus VARCHAR(100); -- Main character for question
ALTER TABLE questions ADD COLUMN theme_focus VARCHAR(100); -- Primary theme
ALTER TABLE questions ADD COLUMN story_arc_stage VARCHAR(50) CHECK (story_arc_stage IN ('exposition', 'rising_action', 'climax', 'falling_action', 'resolution'));
```

**4. Collection Questions Association**
```sql
CREATE TABLE collection_questions (
    collection_id UUID REFERENCES quiz_collections(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    PRIMARY KEY (collection_id, question_id)
);
```

## Quiz Organization Strategy

### Story-Progression Quizzes

**Ramayana Chapter Structure Example**
```
1. Balakanda (Childhood) - Rama's birth and youth
2. Ayodhyakanda (Ayodhya) - Exile begins
3. Aranyakanda (Forest) - Forest exile and Sita's abduction
4. Kishkindhakanda (Kishkindha) - Alliance with Hanuman and Sugriva
5. Sundarakanda (Beautiful) - Hanuman's journey to Lanka
6. Yuddhakanda (War) - Battle and rescue of Sita
7. Uttarakanda (Final) - Return and later events
```

**Implementation Approach**
```typescript
interface StoryProgressionQuiz {
  chapterId: string;
  chapterName: string;
  prerequisites: string[]; // Previous chapters required
  questions: QuizQuestion[];
  learningObjectives: string[];
  keyEvents: string[];
  keyCharacters: string[];
}
```

### Character & Thematic Quizzes

**Character-Focused Collections**
- **Rama Quiz**: Questions across all chapters focusing on Rama's character development
- **Sita Quiz**: Questions about Sita's journey, trials, and significance
- **Hanuman Quiz**: Questions about devotion, strength, and loyalty
- **Ravana Quiz**: Questions about the antagonist, his complexity, and downfall

**Theme-Focused Collections**
- **Dharma Quiz**: Questions about righteousness and moral duty across the epic
- **Devotion Quiz**: Questions about bhakti and loyalty (Hanuman, Lakshmana, etc.)
- **Exile Quiz**: Questions about the forest period and its significance
- **War & Peace Quiz**: Questions about conflict resolution and justice

## Content Validators Detailed Explanation

### 1. Technical Validators (100% Automated)
```typescript
class TechnicalValidator {
  validateFormat(question: GeneratedQuestion): ValidationResult {
    const checks = [
      { rule: 'exactly_4_options', pass: question.options.length === 4 },
      { rule: 'correct_answer_valid', pass: question.correct_answer_id >= 0 && question.correct_answer_id <= 3 },
      { rule: 'required_fields', pass: !!question.question_text && !!question.basic_explanation },
      { rule: 'category_valid', pass: ['characters', 'events', 'themes', 'culture'].includes(question.category) },
      { rule: 'difficulty_valid', pass: ['easy', 'medium', 'hard'].includes(question.difficulty) }
    ];
    
    return {
      passed: checks.every(c => c.pass),
      failures: checks.filter(c => !c.pass),
      score: checks.filter(c => c.pass).length / checks.length
    };
  }
}
```

### 2. Cultural Validators (AI + Human Review)
```typescript
class CulturalValidator {
  async validateCulturalContent(content: GeneratedContent): Promise<ValidationResult> {
    const checks = {
      sanskrit_accuracy: await this.validateSanskrit(content.original_quote),
      translation_quality: await this.validateTranslation(content.original_quote, content.translation),
      cultural_sensitivity: await this.checkCulturalSensitivity(content.question_text),
      religious_appropriateness: await this.checkReligiousContent(content.explanation),
      factual_accuracy: await this.crossReferenceFactsWithSources(content)
    };
    
    // Auto-pass if all checks score > 0.8
    // Flag for human review if any check scores < 0.6
    // Auto-reject if critical checks fail
    
    return {
      passed: Object.values(checks).every(score => score > 0.8),
      needsReview: Object.values(checks).some(score => score < 0.6),
      scores: checks
    };
  }
}
```

### 3. Educational Validators (ML + Rubrics)
```typescript
class EducationalValidator {
  assessEducationalQuality(question: GeneratedQuestion): ValidationResult {
    const assessments = {
      question_clarity: this.assessReadability(question.question_text),
      learning_objective: this.checkLearningValue(question),
      difficulty_appropriateness: this.validateDifficultyLevel(question),
      distractor_quality: this.assessDistractors(question.options),
      explanation_depth: this.assessExplanationQuality(question.basic_explanation)
    };
    
    return {
      passed: Object.values(assessments).every(score => score > 0.7),
      educationalScore: Object.values(assessments).reduce((sum, score) => sum + score, 0) / 5,
      recommendations: this.generateImprovementSuggestions(assessments)
    };
  }
}
```

### 4. Factual Validators (Source Cross-Reference)
```typescript
class FactualValidator {
  async validateFactualAccuracy(content: GeneratedContent): Promise<ValidationResult> {
    const sources = await this.getAuthoritativeSources(content.epic_id);
    
    const factChecks = {
      character_accuracy: await this.verifyCharacterDetails(content, sources),
      event_accuracy: await this.verifyEventDetails(content, sources),
      cultural_accuracy: await this.verifyCulturalClaims(content, sources),
      quote_authenticity: await this.verifyQuoteSource(content.original_quote, sources)
    };
    
    return {
      passed: Object.values(factChecks).every(check => check.confidence > 0.8),
      confidence: Object.values(factChecks).reduce((sum, check) => sum + check.confidence, 0) / 4,
      sources_matched: factChecks.character_accuracy.sources_found + factChecks.event_accuracy.sources_found
    };
  }
}
```

## Content Sourcing Strategy

### Primary Sources (Tier 1 - Authoritative)
1. **Sacred Texts Archive** - Complete Sanskrit texts with translations
2. **Valmiki Ramayana** - Scholarly digital edition
3. **Academic Institutions** - University digital libraries
4. **Cultural Heritage Sites** - Government and UNESCO collections

### Secondary Sources (Tier 2 - Educational)
1. **Wikipedia** - Well-cited articles for contemporary context
2. **Educational Websites** - University course materials
3. **Cultural Organizations** - Temple and cultural society publications

### Content Processing Pipeline
```
Source Text → Chapter Segmentation → Character/Theme Extraction → LLM Question Generation → Validation Pipeline → Database Storage
```

## Quiz Collection Assembly

### Story-Progression Logic
```typescript
async function createStoryProgressionQuiz(epicId: string, chapterNumber: number): Promise<QuizCollection> {
  // 1. Get questions tagged to specific chapter
  // 2. Ensure balanced difficulty progression
  // 3. Include prerequisite checking
  // 4. Add narrative context and learning objectives
}
```

### Character-Focus Logic
```typescript
async function createCharacterQuiz(epicId: string, characterName: string): Promise<QuizCollection> {
  // 1. Get questions tagged to specific character across all chapters
  // 2. Order by character development arc
  // 3. Include character background and significance
  // 4. Connect to cross-epic character parallels
}
```

### Theme-Focus Logic
```typescript
async function createThematicQuiz(epicId: string, theme: string): Promise<QuizCollection> {
  // 1. Get questions related to specific theme
  // 2. Order by thematic complexity
  // 3. Include cross-epic thematic connections
  // 4. Provide philosophical and cultural context
}
```

This plan provides the foundation for sophisticated content organization while maintaining the lean, solo-founder-friendly approach outlined in CLAUDE.md.