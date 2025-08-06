# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context: Solo Founder & Lean Development

**IMPORTANT**: This is a lean, agile project managed by a solo founder/product person. Keep this context in mind for ALL development decisions:

### Core Principles
- **UI/UX First**: User experience and visual design are PRIMARY concerns
- **Educational Value**: Learning effectiveness and gamification drive engagement  
- **Lean & Simple**: Avoid over-engineering, complex processes, or enterprise patterns
- **Solo-Manageable**: All systems must be maintainable by one person
- **Production-Ready**: Focus on features that directly impact user experience

### What to Prioritize
1. **Mobile App Experience**: Smooth, intuitive, engaging UI
2. **Educational Content**: Quality explanations, cultural accuracy, learning progression
3. **Core Features**: Quiz flow, progress tracking, achievement system
4. **Essential Testing**: Critical paths, not exhaustive coverage
5. **Simple Deployment**: Straightforward, reliable production setup

### What to Avoid
- Complex microservices architectures
- Over-elaborate testing strategies (keep essential tests only)
- Enterprise-grade monitoring/observability systems
- Complicated CI/CD pipelines
- Premature optimization or scaling solutions

## Project Overview

This is the Epic Quiz App - a mobile-first educational quiz platform focused on classical literature and epics (starting with Ramayana). The app uses a hybrid content delivery model providing instant basic explanations with on-demand deep-dive educational content.

## Architecture Overview

### Frontend (React Native)
- **Offline-first architecture** with SQLite local storage
- **Redux Toolkit** for state management with RTK Query
- **Two-tier content strategy**: Basic explanations cached locally, rich content fetched on-demand
- Target performance: <2s quiz loading, instant explanation display

### Backend (Node.js/Express)
- **PostgreSQL** database with JSONB for flexible content structure
- **Redis** caching layer for performance
- **RESTful API** with bulk quiz package downloads
- Multi-epic architecture supporting content expansion

### Key Technical Requirements
- **Quiz Loading**: Single API call downloads complete quiz package (questions + basic explanations)
- **Offline Support**: Core functionality must work without internet connection
- **Performance Targets**: <3s app launch, <2s quiz loading, instant cached explanations, <1s deep-dive content
- **Cross-Epic Support**: Database and API designed for multiple literary works from day one

## Core Features Implementation

### Quiz Flow Architecture
1. **Bulk Download**: `/api/v1/epics/:epicId/quiz` returns complete quiz package
2. **Local Caching**: Questions, options, correct answers, and basic explanations stored locally
3. **Instant Review**: Results screen shows all questions with tap-to-explain (no loading)
4. **Deep Dive**: On-demand `/api/v1/questions/:id/deep-dive` for rich educational content

## Database Architecture

### Core Design Decisions

#### PostgreSQL + JSONB Hybrid Approach
- **Choice**: PostgreSQL with JSONB fields instead of pure NoSQL or pure relational
- **Why**: Best of both worlds - structured relationships with flexible JSON storage
- **Benefits**: JSONB is fully indexable/queryable, direct JSON API responses, future-proof schema evolution

#### Two-Tier Content Strategy  
- **Structure**: Separate `questions` and `educational_content` tables
- **Purpose**: Enables hybrid delivery model (bulk download + on-demand streaming)
- **Performance**: Lightweight quiz packages for mobile, heavy content loaded separately
- **Caching**: Different strategies for basic vs. rich content

#### Human-Readable Epic IDs
- **Format**: VARCHAR(50) like "ramayana" instead of UUIDs for epic identifiers  
- **Benefits**: Clean API URLs (`/api/v1/epics/ramayana/quiz`), easier debugging, SEO-friendly
- **Constraint**: Enforced lowercase with underscores pattern

#### Custom Migration System
- **Approach**: File-based migrations without ORM (vs Sequelize/TypeORM)
- **Benefits**: Full PostgreSQL feature access, better performance, precise control over queries
- **Location**: `backend/database/migrations/` with numbered SQL files

### Database Schema

#### Core Tables
```sql
epics                    # Literary works (ramayana, mahabharata, etc.)
├── questions           # Quiz questions + basic explanations (cached)
│   └── educational_content  # Rich content (on-demand loaded)
├── users              # User accounts (optional, supports anonymous)
├── user_progress      # Epic-specific learning progress  
├── quiz_sessions      # Individual quiz attempts (analytics)
└── user_bookmarks     # Saved explanations
```

#### Key Schema Patterns
- **Multi-epic design**: All content tables include `epic_id` for organization
- **Cross-epic connections**: JSONB fields for thematic linking between epics
- **Category scoring**: JSONB storage for detailed progress tracking
- **Content separation**: Basic explanations cached, detailed content streamed
- **Flexible options**: JSONB arrays for multiple choice answers

#### Performance Optimizations
- **GIN indexes** on JSONB fields and text arrays
- **Full-text search** indexes on question content  
- **Balanced question selection** using window functions
- **Connection pooling** with monitoring and graceful shutdown

### Business Logic Services

#### EpicService (`backend/src/services/EpicService.ts`)
- Epic management and availability control
- Statistics and trending calculations
- Search functionality across epics

#### QuizService (`backend/src/services/QuizService.ts`) 
- **Quiz package generation**: Implements bulk download strategy
- **Deep dive content**: Lazy loading of educational content
- **Results processing**: Score calculation and progress updates
- **Intelligent selection**: Balanced question distribution across categories/difficulties

## Development Phases

### MVP (Phase 1)
- Single epic focus (Ramayana) with 50+ high-quality questions
- Complete offline functionality implementation
- Basic progress tracking and bookmarking
- Multi-epic architecture foundation

### Post-MVP Expansion
- Additional epics (Mahabharata, Greek epics, etc.)
- Cross-epic thematic analysis features
- AI-powered content connections
- Social features and sharing

## Content Management Considerations

### Cultural Sensitivity Requirements
- Professional translation services for original language quotes
- Multi-cultural content review process
- Respectful treatment of religious and cultural content across all epic traditions
- Regional expert consultation for cultural accuracy

### Content Quality Standards
- Basic explanations: 1-2 sentences, immediately helpful
- Deep dive content: 2-3 paragraphs, scholarly but accessible
- Original language integration with accurate translations
- Cross-epic thematic connections without oversimplification

## Development Commands

### React Native Mobile App (EpicQuizMobile/)
**IMPORTANT**: All commands must be run from the `EpicQuizMobile/` directory
```bash
cd EpicQuizMobile

# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator/device
npm run android

# Run tests
npm test

# Lint code
npm run lint
```

### Backend API (backend/)
**IMPORTANT**: All commands must be run from the `backend/` directory
```bash
cd backend

# Development server with auto-reload (runs on port 3000)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only  
npm run test:performance   # Performance tests only
npm run test:coverage      # Run with coverage report
npm run test:ci           # CI/production test run
npm run test:watch        # Watch mode for development

# Lint code
npm run lint
npm run lint:fix
```

### Database Setup
**Prerequisites**: PostgreSQL 14+ running locally
```bash
# Set up environment variables (copy and edit .env.example)
cp .env.example .env

# Database will be automatically set up when you start the server
# The server runs migrations and creates tables on startup

# Manual database operations (if needed)
psql -h localhost -U postgres -c "CREATE DATABASE epic_quiz_db;"
```

### Available Endpoints (when backend is running)
- Health Check: `http://localhost:3000/health` (includes database status)
- API Base: `http://localhost:3000/api/v1` (returns "not implemented yet")

### Database Files Structure
```
backend/database/
├── schema.sql              # Complete database schema
├── migrations/
│   └── 001_initial_schema.sql    # Initial migration
└── seeds/
    └── 001_ramayana_questions.sql   # Sample Ramayana content
```

### Environment Variables (.env)
```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432  
DB_NAME=epic_quiz_db
DB_USER=postgres
DB_PASSWORD=your_password

# Test Database Configuration
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=epic_quiz_test
TEST_DB_USER=postgres
TEST_DB_PASSWORD=your_password

# Server Configuration  
PORT=3000
NODE_ENV=development
```

## Essential Testing (Lean Approach)

### Focus Areas for Solo Development
- **Critical Path Testing**: Quiz generation, scoring, content delivery
- **User Experience Validation**: Mobile app flows work correctly
- **Data Integrity**: Educational content accuracy and cultural sensitivity
- **Performance Basics**: App meets mobile performance expectations

### Simplified Test Strategy
```bash
npm test                # Essential tests only
npm run test:coverage   # Basic coverage check
npm run test:unit       # Core business logic
npm run test:api        # Main API endpoints
```

**Note**: Comprehensive test suite is available but focus on essential tests for lean development.

## Next Development Phase: Mobile UI/UX

### Priority Focus Areas
1. **React Native App Development**
   - Intuitive quiz interface design
   - Smooth animations and transitions
   - Engaging visual feedback
   - Educational progress visualization

2. **Gamification Features**
   - Achievement badges and milestones
   - Progress bars and completion tracking
   - Encouraging feedback messages
   - Learning streaks and consistency rewards

3. **Educational Experience Design**
   - Clear explanation presentation
   - "Learn More" deep-dive interface
   - Cultural context display (Sanskrit quotes, translations)
   - Cross-epic connections visualization

4. **User Experience Flows**
   - Onboarding and epic selection
   - Quiz taking experience (10 questions)
   - Results and explanation review
   - Progress tracking and motivation

### Mobile-First Design Principles
- **Thumb-Friendly**: All interactions designed for one-handed use
- **Instant Feedback**: No loading states for cached content
- **Educational Focus**: UI emphasizes learning over competition
- **Cultural Respect**: Visually appropriate for diverse epic traditions

### Project Structure
```
epic-quiz-app/
├── EpicQuizMobile/          # React Native mobile app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── quiz/       # Quiz-specific components
│   │   │   ├── explanation/ # Explanation display components
│   │   │   └── common/     # Shared components
│   │   ├── screens/        # Screen components
│   │   ├── services/       # API calls and business logic
│   │   ├── store/          # Redux Toolkit store
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── constants/      # App constants
│   └── package.json
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic services
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/          # Database seed data
│   ├── tests/              # Test files
│   └── package.json
└── CLAUDE.md              # This file
```