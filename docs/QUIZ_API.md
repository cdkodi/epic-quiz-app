# Quiz API Documentation for Social Media Marketing

This document outlines various methods to programmatically generate quiz questions for Instagram Reels and TikTok marketing campaigns for the QuizVeda app.

## Table of Contents
- [Current App API Options](#current-app-api-options)
- [Content Generation APIs](#content-generation-apis)
- [Marketing-Optimized Content Generation](#marketing-optimized-content-generation)
- [Recommended Workflow](#recommended-workflow)
- [Content Ideas for Viral Potential](#content-ideas-for-viral-potential)
- [Automation Tools](#automation-tools)
- [Implementation Examples](#implementation-examples)

## Current App API Options

### 1. Supabase Database (Recommended)

Use your existing Supabase database to extract authentic quiz questions from the app.

```javascript
// Direct API call to your existing endpoint
const getQuizQuestions = async () => {
  try {
    const response = await fetch('YOUR_SUPABASE_API_URL/api/v1/epics/ramayana/quiz', {
      headers: {
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return null;
  }
};

// Usage
const questions = await getQuizQuestions();
console.log(questions);
```

**Pros:**
- Uses your actual app content
- Maintains consistency with app experience
- Already structured for your quiz format
- Authentic to your brand
- No additional API costs

**Cons:**
- Limited to existing content
- May need reformatting for social media
- Requires app database to be populated

### 2. Environment Variables Setup

For your Supabase integration, set up these environment variables:

```bash
# .env file
SUPABASE_PROJECT_ID=ccfpbksllmvzxllwyqyv
SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## Content Generation APIs

### 1. OpenAI API (Most Flexible)

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

const generateQuizContent = async (topic = 'ramayana', count = 5) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{
        role: "user",
        content: `Generate ${count} multiple choice questions about ${topic} for social media marketing.
        
        Requirements:
        - Engaging and shareable
        - Educational value
        - Suitable for 15-30 second videos
        - Include cultural context
        - Mix of difficulty levels
        
        Format each question as JSON:
        {
          "hook": "Attention-grabbing opener",
          "question": "Clear, intriguing question",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "correct_answer": "B",
          "explanation": "Brief explanation with interesting fact",
          "visual_cue": "Suggestion for video element",
          "difficulty": "easy|medium|hard",
          "category": "characters|plot|themes|culture"
        }`
      }]
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
};

// Usage
const socialQuestions = await generateQuizContent('ramayana', 10);
```

**Pricing:** ~$0.01-0.03 per question (depending on model)

### 2. Claude API (Anthropic)

```javascript
const generateWithClaude = async (topic, count = 5) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Create ${count} viral TikTok-style quiz questions about ${topic}.
          
          Focus on:
          - Hook viewers in first 2 seconds
          - Dramatic reveals
          - "Did you know?" moments
          - Cultural education
          - Shareable content
          
          Return as structured JSON array.`
        }]
      })
    });

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  } catch (error) {
    console.error('Claude API error:', error);
    return null;
  }
};
```

**Pricing:** ~$0.015 per 1k tokens (very cost-effective)

### 3. Google Gemini API

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateWithGemini = async (topic, count = 5) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate ${count} engaging quiz questions about ${topic} for social media.
    Make them educational, shareable, and perfect for short-form video content.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};
```

**Pricing:** Free tier available, then $0.50 per 1M tokens

## Marketing-Optimized Content Generation

### Social Media Quiz Generator Script

```javascript
// Automated content generator for Instagram Reels/TikTok
class SocialMediaQuizGenerator {
  constructor(apiProvider = 'openai') {
    this.apiProvider = apiProvider;
    this.contentThemes = [
      'characters',
      'plot_events', 
      'moral_lessons',
      'cultural_context',
      'symbolism',
      'geography',
      'relationships',
      'battles'
    ];
  }

  async generateSocialQuiz(topic = 'ramayana', count = 10, style = 'tiktok') {
    const prompt = this.buildPrompt(topic, count, style);
    
    switch(this.apiProvider) {
      case 'openai':
        return await this.generateWithOpenAI(prompt);
      case 'claude':
        return await this.generateWithClaude(prompt);
      case 'gemini':
        return await this.generateWithGemini(prompt);
      default:
        throw new Error('Invalid API provider');
    }
  }

  buildPrompt(topic, count, style) {
    const stylePrompts = {
      tiktok: `Create ${count} TikTok-optimized quiz questions about ${topic}:
      - Hook viewers in first 2 seconds
      - 15-30 second reveal format
      - Dramatic pauses and reveals
      - Use trending audio cues
      - Include "Wait for it..." moments`,
      
      instagram: `Create ${count} Instagram Reel quiz questions about ${topic}:
      - Visual storytelling focus
      - Aesthetic presentation
      - Educational carousel potential
      - Story template friendly
      - Shareable quote graphics`,
      
      youtube: `Create ${count} YouTube Shorts quiz questions about ${topic}:
      - Longer form explanations (45-60 seconds)
      - Educational deep-dives
      - Cliffhanger endings
      - Series potential
      - Subscribe hooks`
    };

    return stylePrompts[style] + `
    
    Format each as JSON:
    {
      "id": "unique_id",
      "hook": "Attention grabbing opener (max 10 words)",
      "question": "Clear, intriguing question",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "B", 
      "explanation": "Brief explanation with wow factor",
      "visual_cue": "Suggestion for video element/animation",
      "audio_cue": "Suggested sound/music timing",
      "hashtags": ["#QuizVeda", "#Ramayana", "#relevant", "#tags"],
      "call_to_action": "App download encouragement",
      "difficulty": "easy|medium|hard",
      "estimated_views": "predicted viral potential (1-10)",
      "best_time_to_post": "optimal posting time",
      "series_potential": "can this become a series?"
    }`;
  }

  async generateContentCalendar(days = 30) {
    const calendar = [];
    
    for(let day = 1; day <= days; day++) {
      const theme = this.getThemeForDay(day);
      const questions = await this.generateSocialQuiz(theme, 3);
      
      calendar.push({
        day: day,
        date: this.getDateForDay(day),
        theme: theme,
        content: questions,
        posting_schedule: this.getPostingSchedule(day)
      });
    }
    
    return calendar;
  }

  getThemeForDay(day) {
    const themes = {
      1: 'Monday Character Spotlight',
      2: 'Tuesday Plot Twists', 
      3: 'Wednesday Wisdom',
      4: 'Thursday Throwback Facts',
      5: 'Friday Face-off',
      6: 'Saturday Story Time',
      0: 'Sunday Spiritual Insights'
    };
    
    return themes[day % 7];
  }
}

// Usage
const generator = new SocialMediaQuizGenerator('openai');
const calendar = await generator.generateContentCalendar(30);
```

## Recommended Workflow

### Phase 1: Use Your Existing Content

```bash
# Step 1: Extract questions from Supabase
node scripts/extractQuestions.js

# Step 2: Format for social media
node scripts/formatForSocial.js

# Step 3: Generate video scripts
node scripts/createVideoScripts.js

# Step 4: Create posting calendar
node scripts/buildCalendar.js
```

```javascript
// scripts/extractQuestions.js
const extractExistingQuestions = async () => {
  // 1. Call your quiz API endpoint
  const questions = await getQuizQuestions();
  
  // 2. Format for social media (shorter, punchier)
  const socialQuestions = questions.map(q => ({
    ...q,
    hook: generateHook(q.question),
    visualCue: suggestVisual(q.category),
    appPromotion: generateAppPromo()
  }));
  
  // 3. Save formatted questions
  await saveToFile('social-questions.json', socialQuestions);
  
  return socialQuestions;
};
```

### Phase 2: Generate Fresh Content

```javascript
// scripts/generateFreshContent.js
const generateViralContent = async () => {
  const themes = [
    'character_mysteries',
    'plot_predictions', 
    'modern_parallels',
    'hidden_meanings',
    'cultural_facts'
  ];
  
  const allContent = [];
  
  for(const theme of themes) {
    // 1. Generate AI content optimized for virality
    const content = await generateSocialQuiz(theme, 10, 'tiktok');
    
    // 2. Add visual hooks and app promotion
    const enhanced = content.map(item => ({
      ...item,
      appConnection: linkToQuizVeda(item),
      viralFactors: analyzeViralPotential(item)
    }));
    
    allContent.push(...enhanced);
  }
  
  return allContent;
};
```

## Content Ideas for Viral Potential

### Series Concepts

#### 1. "Guess the Character" Series
```javascript
const characterGuessTemplate = {
  hook: "This character can do WHAT?! 🤯",
  format: "Visual riddles with character powers/abilities",
  frequency: "Monday Character Spotlight",
  examples: [
    "Who can become the size of a mountain?",
    "Which character has 10 heads?", 
    "Who can fly without wings?"
  ]
};
```

#### 2. "Plot Twist or Real?" Series
```javascript
const plotTwistTemplate = {
  hook: "This actually happened in Ramayana! 😱",
  format: "Surprising facts vs. made-up scenarios",
  frequency: "Tuesday Plot Twists",
  examples: [
    "A monkey burned down a city",
    "Someone built a bridge across the ocean",
    "A deer caused a war"
  ]
};
```

#### 3. "Ancient Wisdom Modern Problems" Series
```javascript
const wisdomTemplate = {
  hook: "Ramayana solved this problem 1000s of years ago! 💡",
  format: "Ancient lessons for modern situations",
  frequency: "Wednesday Wisdom",
  examples: [
    "Dealing with toxic family members",
    "Making difficult moral choices",
    "Leading with integrity"
  ]
};
```

### Example TikTok Scripts

```javascript
const tiktokScripts = {
  characterReveal: {
    script: `
      Hook (0-2s): "Think you know Ramayana? This will blow your mind! 🤯"
      Setup (2-5s): "Who can change size at will in Ramayana?"
      Visual (5-10s): Quick character montage with size transformations
      Options (10-15s): Show A) Rama B) Hanuman C) Ravana D) Lakshmana
      Reveal (15-20s): "HANUMAN! 🐒 He becomes tiny to enter Lanka, giant to cross oceans!"
      Hook (20-25s): "Want more epic knowledge? 👆"
      CTA (25-30s): "Download QuizVeda! Link in bio 📱 #QuizVeda #Ramayana"
    `,
    visualElements: [
      "Character animations",
      "Size transformation effects",
      "Epic background music",
      "App logo overlay",
      "Download button animation"
    ]
  },
  
  plotTwist: {
    script: `
      Hook (0-3s): "This ACTUALLY happened in Ramayana! No cap! 🔥"
      Question (3-7s): "A monkey burned down an entire golden city?"
      Suspense (7-12s): "Real or fake? Comment your guess! 👇"
      Reveal (12-18s): "REAL! Hanuman set Lanka on fire! 🔥🐒"
      Education (18-25s): "He did it to show Ravana's power wasn't absolute!"
      CTA (25-30s): "Learn more epic stories on QuizVeda! 📱"
    `
  }
};
```

## Automation Tools

### 1. Content Pipeline Script

```javascript
// automation/contentPipeline.js
class ContentPipeline {
  constructor() {
    this.generator = new SocialMediaQuizGenerator();
    this.scheduler = new ContentScheduler();
    this.formatter = new VideoScriptFormatter();
  }

  async createContentCalendar(days = 30) {
    console.log(`🚀 Generating ${days} days of content...`);
    
    const calendar = [];
    
    for(let day = 1; day <= days; day++) {
      const theme = this.getThemeForDay(day);
      
      // Generate base content
      const questions = await this.generator.generateSocialQuiz(theme, 3);
      
      // Create video scripts for each platform
      const tiktokScripts = questions.map(q => 
        this.formatter.formatForTikTok(q)
      );
      
      const instagramScripts = questions.map(q => 
        this.formatter.formatForInstagram(q)
      );
      
      // Schedule posts
      const schedule = this.scheduler.optimizePostingTimes(day, theme);
      
      calendar.push({
        day,
        date: this.getDate(day),
        theme,
        content: {
          questions,
          tiktok: tiktokScripts,
          instagram: instagramScripts
        },
        schedule
      });
      
      console.log(`✅ Day ${day} content generated: ${theme}`);
    }
    
    // Save calendar
    await this.saveCalendar(calendar);
    console.log(`🎉 ${days}-day content calendar created!`);
    
    return calendar;
  }

  async saveCalendar(calendar) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `content-calendar-${timestamp}.json`;
    
    await fs.writeFile(
      `./output/${filename}`,
      JSON.stringify(calendar, null, 2)
    );
    
    // Also create CSV for easy viewing
    const csv = this.convertToCSV(calendar);
    await fs.writeFile(
      `./output/content-calendar-${timestamp}.csv`,
      csv
    );
  }
}

// Usage
const pipeline = new ContentPipeline();
await pipeline.createContentCalendar(30);
```

### 2. Batch API Calls

```javascript
// automation/batchGenerator.js
const batchGenerate = async (totalQuestions = 100) => {
  const topics = [
    'characters',
    'plot_events',
    'themes', 
    'cultural_context',
    'moral_lessons',
    'symbolism',
    'geography',
    'battles'
  ];
  
  const questionsPerTopic = Math.ceil(totalQuestions / topics.length);
  const allContent = [];
  
  console.log(`🔄 Generating ${totalQuestions} questions across ${topics.length} topics...`);
  
  // Process topics in parallel for speed
  const promises = topics.map(async (topic, index) => {
    console.log(`📝 Generating ${questionsPerTopic} questions for: ${topic}`);
    
    try {
      const questions = await generateQuizContent(topic, questionsPerTopic);
      
      // Add metadata
      const enhanced = questions.map(q => ({
        ...q,
        topic,
        generated_at: new Date().toISOString(),
        batch_id: `batch_${Date.now()}_${index}`,
        social_ready: true
      }));
      
      console.log(`✅ Completed: ${topic} (${enhanced.length} questions)`);
      return enhanced;
      
    } catch (error) {
      console.error(`❌ Error generating ${topic}:`, error);
      return [];
    }
  });
  
  // Wait for all topics to complete
  const results = await Promise.all(promises);
  
  // Flatten and shuffle
  const shuffled = results.flat().sort(() => Math.random() - 0.5);
  
  console.log(`🎉 Generated ${shuffled.length} total questions!`);
  
  // Save in multiple formats
  await saveToMultipleFormats(shuffled);
  
  return shuffled;
};

const saveToMultipleFormats = async (questions) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // JSON for developers
  await fs.writeFile(
    `./output/quiz-questions-${timestamp}.json`,
    JSON.stringify(questions, null, 2)
  );
  
  // CSV for content teams
  const csv = convertQuestionsToCSV(questions);
  await fs.writeFile(
    `./output/quiz-questions-${timestamp}.csv`,
    csv
  );
  
  // Markdown for documentation
  const markdown = convertQuestionsToMarkdown(questions);
  await fs.writeFile(
    `./output/quiz-questions-${timestamp}.md`,
    markdown
  );
  
  console.log(`💾 Saved in multiple formats with timestamp: ${timestamp}`);
};
```

### 3. Content Performance Tracker

```javascript
// analytics/performanceTracker.js
class ContentPerformanceTracker {
  constructor() {
    this.platforms = ['tiktok', 'instagram', 'youtube'];
    this.metrics = ['views', 'likes', 'shares', 'comments', 'saves'];
  }

  async trackContent(contentId, platform, metrics) {
    const performance = {
      content_id: contentId,
      platform,
      metrics,
      tracked_at: new Date().toISOString(),
      viral_score: this.calculateViralScore(metrics),
      engagement_rate: this.calculateEngagementRate(metrics)
    };
    
    await this.savePerformance(performance);
    return performance;
  }

  calculateViralScore(metrics) {
    // Custom algorithm based on your goals
    const { views, likes, shares, comments } = metrics;
    
    return (
      (shares * 10) +      // Shares are most valuable
      (comments * 5) +     // Comments show engagement
      (likes * 2) +        // Likes are good
      (views * 0.1)        // Views are baseline
    ) / views; // Normalize by reach
  }

  async identifyTopPerformers(limit = 10) {
    const allContent = await this.getAllPerformanceData();
    
    return allContent
      .sort((a, b) => b.viral_score - a.viral_score)
      .slice(0, limit);
  }

  async generateInsights() {
    const topPerformers = await this.identifyTopPerformers();
    
    return {
      best_topics: this.analyzeBestTopics(topPerformers),
      optimal_posting_times: this.analyzePostingTimes(topPerformers),
      viral_patterns: this.analyzeViralPatterns(topPerformers),
      content_recommendations: this.generateRecommendations(topPerformers)
    };
  }
}
```

## Implementation Examples

### Quick Start Script

```bash
#!/bin/bash
# setup.sh - Quick setup for quiz API automation

echo "🚀 Setting up Quiz API automation..."

# Create directory structure
mkdir -p quiz-api/{scripts,output,templates,analytics}

# Install dependencies
npm init -y
npm install openai anthropic @google/generative-ai dotenv fs-extra

# Create environment file
cat > .env << EOL
OPENAI_API_KEY=your_openai_key_here
CLAUDE_API_KEY=your_claude_key_here
GEMINI_API_KEY=your_gemini_key_here
SUPABASE_PROJECT_ID=ccfpbksllmvzxllwyqyv
SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
EOL

echo "✅ Setup complete! Edit .env with your API keys."
echo "🎬 Run: node scripts/generateContent.js to start creating quiz content"
```

### Example Usage Commands

```bash
# Generate 50 TikTok-optimized questions
node scripts/generateContent.js --platform=tiktok --count=50

# Create 30-day content calendar
node scripts/createCalendar.js --days=30

# Extract existing questions from app
node scripts/extractFromSupabase.js

# Generate performance report
node scripts/analyzePerformance.js --platform=all --period=30days

# Batch generate 200 questions across all topics
node scripts/batchGenerate.js --total=200

# Create video scripts for existing questions
node scripts/createVideoScripts.js --input=questions.json
```

### Cost Estimates

| API Provider | Cost per 100 Questions | Best For |
|-------------|------------------------|----------|
| Your Supabase | Free | Authentic app content |
| OpenAI GPT-4 | $2-5 | High quality, diverse |
| Claude 3 | $1-3 | Cost-effective, reliable |
| Google Gemini | Free - $1 | Budget option |

### Expected ROI

- **Content Creation Time**: Reduced from 2 hours per question to 2 minutes
- **Consistency**: 100% on-brand messaging
- **Volume**: Generate 100+ questions daily
- **Personalization**: Tailored for each platform's algorithm
- **Performance**: Data-driven optimization

## Getting Started

1. **Set up environment variables** for your chosen API provider
2. **Choose your content strategy** (existing app content vs. fresh generation)
3. **Run the batch generator** to create your initial content library
4. **Set up the content calendar** for consistent posting
5. **Track performance** and optimize based on analytics

This system will give you a sustainable, scalable way to create engaging quiz content for your QuizVeda marketing campaigns across all social media platforms.