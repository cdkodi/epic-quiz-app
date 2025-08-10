# Epic Quiz App

A mobile-first educational quiz app for classical literature with **live Supabase integration**, featuring sophisticated design, cultural sensitivity, and authentic content.

## 🎯 Project Overview

**Educational Quiz Platform** for classical literature starting with the Ramayana, designed for solo development with lean, agile principles.

### Core Features
- **📚 Epic Library**: Browse classical literature with progressive unlocking
- **🎯 Interactive Quizzes**: Clean, distraction-free question presentation
- **🏆 Smart Results**: Score visualization with reviewable questions
- **📖 Rich Explanations**: Cultural context and educational content
- **🏛️ Deep Dive Learning**: Cross-epic connections and modern relevance

## 🏗️ Architecture

### Full-Stack Application
- **Database**: Supabase (PostgreSQL) with real Ramayana content ✅
- **Backend**: Node.js + Express + Google Sheets integration pipeline  
- **Mobile**: React Native + TypeScript + Redux Toolkit + Supabase client
- **Design**: Sophisticated cultural colors with mobile-first UX

### Key Technical Decisions
- **Hybrid Content Delivery**: Bulk download + lazy loading for offline-first mobile experience
- **PostgreSQL + JSONB**: Flexible content structure with relational integrity
- **Cultural Sensitivity**: Muted saffron/green/blue palette, respectful iconography
- **Solo Development Optimized**: Clean architecture, type safety, reusable components

## 📱 Mobile App (React Native)

### Design System
- **Colors**: Sophisticated saffron (#D4700A), green (#2E7D32), blue (#1565C0)
- **Typography**: Mobile-optimized with cultural content support
- **Components**: Reusable Button, Card, ProgressBar with variants
- **User Journey**: Epic Library → Quiz → Results → Explanation → Deep Dive

### Current Status: 🎯 PRODUCTION-READY WITH LIVE DATA ✅
- [x] Complete wireframes and pixel-perfect HTML mockups
- [x] React Native app structure with TypeScript
- [x] Redux state management with Supabase integration
- [x] Navigation and component library
- [x] **ALL 5 SCREENS IMPLEMENTED** - Epic Library → Quiz → Results → Explanation → Deep Dive
- [x] **Full user journey working with real data**
- [x] **Live Supabase integration** - 19 authentic Ramayana questions
- [x] **Rich educational content** with chapter summaries
- [x] **Offline-first architecture** with AsyncStorage caching
- [x] **Sophisticated design system** with muted cultural colors

## 🗄️ Backend API (Node.js)

### Production-Ready Features
- **RESTful API** with comprehensive validation
- **Quiz Generation** with balanced question distribution
- **Educational Content** with cultural context and cross-epic connections
- **Progress Tracking** with category-wise performance analysis
- **Custom Migration System** optimized for PostgreSQL features

### API Endpoints
```
GET  /api/v1/epics                    # Browse literature
GET  /api/v1/quiz?epicId=...&count=10 # Generate quiz package  
POST /api/v1/quiz/submit              # Submit quiz results
GET  /api/v1/questions/{id}/deep-dive # Rich cultural content
```

### Current Status: ✅ All 18 Essential Tests Passing
- [x] Database schema with comprehensive migrations
- [x] Service layer with business logic
- [x] API routes with validation middleware
- [x] Essential test coverage for production readiness

## 🎨 Design Assets

### Wireframes & Mockups
- **Wireframes**: Complete user journey flow (5 core screens)
- **Visual Mockups**: Pixel-perfect HTML showing exact design implementation
- **Design System**: Complete color palette, typography, and component specifications

### Cultural Design Principles
- **Respectful Representation**: Appropriate iconography (🕉️🏛️🏺)
- **Sophisticated Colors**: Muted, elegant interpretation of traditional colors
- **Educational Focus**: Content-first design supporting learning objectives

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- React Native development environment
- Supabase account (database is pre-configured)

### Backend Setup
```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3000
```

### Mobile App Setup (Expo Go Compatible)
```bash
cd EpicQuizApp
npm install
npm start         # Start Expo development server
# Scan QR code with Expo Go app to run on your device
# OR:
npm run android   # Run on Android emulator
npm run ios       # Run on iOS simulator
```

### 📱 Live App Demo with Real Data
**Complete 5-Screen User Journey with Supabase:**
1. **Epic Library** - Loads real Ramayana data (19 questions available)
2. **Quiz** - Interactive questions from authentic content database
3. **Results** - Score visualization with real question review
4. **Explanation** - Cultural context from chapter summaries  
5. **Deep Dive** - Bala Kanda content with themes and narrative

**✨ All screens working with live Supabase data - ready for production testing!**

### Database Setup (Supabase)
The database is **already configured** with live content:
- ✅ 19 authentic Ramayana questions
- ✅ Chapter summary (Bala Kanda, Sarga 1)  
- ✅ Cultural context and explanations
- ✅ Mobile app automatically connects to live data

**No setup required** - app works immediately!

## 📋 Development Roadmap

### Phase 1: Core Implementation ✅ COMPLETE
- [x] **Epic Library screen** - Browse and select Ramayana with cultural design
- [x] **Quiz screen** - Interactive 10-question flow with timer and touch-friendly UI
- [x] **Results screen** - Score visualization with reviewable questions

### Phase 2: Enhanced Features ✅ COMPLETE 
- [x] **Explanation screen** - Answer review with detailed cultural context
- [x] **Deep dive screen** - Rich educational content (Overview, Characters, Themes, Culture, Lessons)
- [x] **Complete user journey** - Seamless navigation between all 5 screens
- [x] **Cultural content** - Authentic Ramayana educational material with Sanskrit quotes

### Phase 3: Supabase Integration ✅ COMPLETE
- [x] **Live Supabase database** with authentic Ramayana content
- [x] **Real-time data fetching** - Epic Library + Quiz Generation
- [x] **Offline-first architecture** - AsyncStorage caching
- [x] **Chapter summaries** - Deep dive educational content
- [x] **Google Sheets pipeline** - Content review workflow
- [x] **Performance optimized** - <200ms quiz loading

### Phase 4: Production Polish
- [ ] Performance optimization and app store deployment
- [ ] Advanced features and multi-epic expansion

## 🎯 Solo Development Optimized

### Why This Architecture Works
✅ **Lean & Agile**: Focus on UI/UX and educational value  
✅ **Type Safety**: Full TypeScript coverage prevents runtime errors  
✅ **Cultural Authenticity**: Respectful, sophisticated representation  
✅ **Mobile-First**: Touch-friendly, accessible design  
✅ **Production Ready**: Backend tested and validated  

### Development Principles
- **UI/UX First**: User experience and visual design are primary concerns
- **Educational Value**: Learning effectiveness drives all feature decisions
- **Cultural Sensitivity**: Respectful handling of classical literature
- **Solo Manageable**: Avoid over-engineering, focus on essential features

## 📄 Project Documentation

- **[`SUPABASE_INTEGRATION.md`](SUPABASE_INTEGRATION.md)** - Complete Supabase setup and data flow
- [`technical-architecture.md`](technical-architecture.md) - Complete architectural decisions
- [`wireframes/`](wireframes/) - Complete wireframe system with user journey
- [`mockups/`](mockups/) - Pixel-perfect HTML visual mockups
- [`backend/`](backend/) - Production-ready API documentation
- [`EpicQuizApp/ARCHITECTURE.md`](EpicQuizApp/ARCHITECTURE.md) - React Native app structure

## 🎯 Live Database Content

### Currently Available
- **The Ramayana**: 19 authentic questions across 4 categories
- **Chapter Summary**: Bala Kanda Sarga 1 with cultural context
- **Question Types**: Characters, Events, Themes, Cultural aspects
- **Difficulty Levels**: Easy to Hard with balanced distribution
- **Cultural Context**: Sanskrit references with English translations

### Sample Question
```
Question: "What primary virtue does the dialogue between Sage Valmiki 
          and Sage Narada focus on in the opening chapter of Bala Kanda?"

Options: [Wealth, Power, Virtue, Revenge]
Answer: Virtue

Cultural Context: "In Hindu culture, virtues such as morality, generosity, 
and righteousness are highly valued, and Rama is often depicted as an 
embodiment of these qualities."
```

## 📖 Educational Content

Starting with **The Ramayana** as the foundational epic, with planned expansion to:
- Mahabharata (Indian classical literature)
- The Odyssey (Greek classical literature)
- Additional classical works based on user engagement

Content includes:
- **Quiz Questions**: Balanced across characters, events, themes, and culture
- **Cultural Context**: Historical and philosophical significance
- **Cross-Epic Connections**: Universal themes and parallels
- **Modern Relevance**: Contemporary applications of ancient wisdom

---

**Built with cultural respect, educational purpose, and solo development success in mind.**