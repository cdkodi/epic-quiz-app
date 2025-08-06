# Epic Quiz App

A mobile-first educational quiz app for classical literature, featuring sophisticated design and cultural sensitivity.

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
- **Backend**: Node.js + Express + PostgreSQL (Production Ready ✅)
- **Mobile**: React Native + TypeScript + Redux Toolkit
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

### Current Status: ✅ Foundation Complete
- [x] Complete wireframes and pixel-perfect HTML mockups
- [x] React Native app structure with TypeScript
- [x] Redux state management with API integration
- [x] Navigation and component library
- [ ] Screen implementation (next phase)

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
- PostgreSQL 14+
- React Native development environment

### Backend Setup
```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3000
```

### Mobile App Setup  
```bash
cd EpicQuizApp
npm install
npm run start     # Start Metro bundler
npm run android   # Run on Android
npm run ios       # Run on iOS
```

### Database Setup
```bash
cd backend
# Set up PostgreSQL database
# Run migrations (handled automatically on startup)
```

## 📋 Development Roadmap

### Phase 1: Core Implementation ⏳
- [ ] Epic Library screen with real API data
- [ ] Quiz screen with question flow and timer
- [ ] Results screen with score visualization

### Phase 2: Enhanced Features
- [ ] Explanation screen with answer review
- [ ] Deep dive screen with cultural content
- [ ] Progress tracking and achievements

### Phase 3: Production Polish
- [ ] Performance optimization
- [ ] Error handling and offline support
- [ ] App store deployment

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

- [`technical-architecture.md`](technical-architecture.md) - Complete architectural decisions
- [`wireframes/`](wireframes/) - Complete wireframe system with user journey
- [`mockups/`](mockups/) - Pixel-perfect HTML visual mockups
- [`backend/`](backend/) - Production-ready API documentation
- [`EpicQuizApp/ARCHITECTURE.md`](EpicQuizApp/ARCHITECTURE.md) - React Native app structure

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