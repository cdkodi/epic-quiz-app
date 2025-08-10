# Epic Quiz App Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- React Native development environment
- Supabase account (database pre-configured)
- Expo CLI or Expo Go app

### 1. Clone and Setup
```bash
git clone <repository-url>
cd epic-quiz-app

# Backend setup
cd backend
npm install
npm run dev  # Starts on http://localhost:3000

# Mobile app setup (new terminal)
cd ../EpicQuizApp
npm install
npm start    # Launches Expo development server
```

### 2. Run the App
- **Physical Device**: Scan QR code with Expo Go app
- **iOS Simulator**: Press `i` in Expo terminal
- **Android Emulator**: Press `a` in Expo terminal

## Database Setup (Already Configured)

The app is **production-ready** with live Supabase database:
- ✅ 19 authentic Ramayana questions
- ✅ Chapter summary (Bala Kanda, Sarga 1)  
- ✅ Complete schema with triggers and indexes
- ✅ Mobile app automatically connects

**No additional setup required!**

## Environment Configuration

### Mobile App Environment

Create `EpicQuizApp/.env`:
```env
SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZnBia3NsbG12enhsbHd5cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTM2NzUsImV4cCI6MjA3MDM2OTY3NX0.3tc1DD-LGOOU2uSzGzC_HYYu-G7EIBW8UjHawUJz6aw
```

### Backend Environment

Create `backend/.env`:
```env
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

# Google Sheets Integration (optional)
GOOGLE_SHEETS_CREDENTIALS_PATH=./google-credentials.json
CONTENT_REVIEW_SHEET_ID=1dh8a4NVHkXcTHfOFESXUxd3xToBnBP01S2nGhp7fvVQ

# Supabase Configuration
SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
```

## Testing the Setup

### 1. Verify Database Connection
```bash
cd backend
node test-supabase-simple.js
```
Expected output:
```
✅ Supabase connection successful
📊 Found 1 epics in database
🎯 Found 19 questions for ramayana
```

### 2. Test Mobile Integration
```bash
cd EpicQuizApp
node test-supabase-mobile.js
```
Expected output:
```
✅ Successfully loaded 1 epics
✅ Successfully generated quiz with 10 questions
⚡ Performance: Epic loading ~171ms, Quiz generation ~200ms
```

### 3. Test Complete App Flow
```bash
cd EpicQuizApp
node test-app-flow.js
```
Verifies the complete user journey from Epic Library → Quiz → Results → Deep Dive.

## Production Deployment

### Mobile App (React Native)

#### Option 1: Expo Application Services (EAS)
```bash
cd EpicQuizApp

# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas login
eas build:configure

# Build for iOS and Android
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

#### Option 2: Bare React Native
```bash
cd EpicQuizApp

# Eject from Expo (if needed)
npx expo eject

# Build for iOS
cd ios && xcodebuild -workspace EpicQuizApp.xcworkspace -scheme EpicQuizApp -configuration Release

# Build for Android
cd android && ./gradlew assembleRelease
```

### Backend API Deployment

#### Option 1: Heroku
```bash
cd backend

# Create Heroku app
heroku create epic-quiz-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=your_production_db_host
heroku config:set SUPABASE_URL=https://ccfpbksllmvzxllwyqyv.supabase.co

# Deploy
git push heroku main
```

#### Option 2: Railway
```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

#### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Select `backend/` as root directory
3. Configure environment variables
4. Deploy automatically

### Database (Supabase)

Database is already in production:
- **Project**: ccfpbksllmvzxllwyqyv
- **Region**: US East
- **Plan**: Free tier (suitable for MVP)
- **Status**: ✅ Production-ready

For scaling:
1. Upgrade to Pro plan for higher limits
2. Enable database backups
3. Configure custom domain
4. Add database replicas for read scaling

## Content Management

### Adding New Questions

1. **Google Sheets Method** (Recommended):
   ```bash
   cd backend
   node import-from-sheets.js
   ```

2. **Direct Database Insert**:
   ```sql
   INSERT INTO questions (epic_id, category, difficulty, question_text, options, correct_answer_id, basic_explanation)
   VALUES ('ramayana', 'themes', 'medium', 'Your question?', '["A", "B", "C", "D"]', 2, 'Explanation here');
   ```

### Adding New Epics

```sql
INSERT INTO epics (id, title, description, language, culture, is_available, difficulty_level)
VALUES ('mahabharata', 'The Mahabharata', 'Epic description', 'Sanskrit', 'Hindu', true, 'intermediate');
```

## Monitoring and Maintenance

### Health Checks

#### Backend API Health
```bash
curl http://your-api-domain/health
```

#### Database Health
```bash
cd backend
node test-supabase-simple.js
```

### Performance Monitoring

#### Key Metrics to Track
- Epic loading time (target: < 1s)
- Quiz generation time (target: < 2s)
- Cache hit rates
- User engagement metrics

#### Logging
```typescript
// Add to mobile app for production monitoring
console.log('📊 Performance:', {
  epicLoadTime: Date.now() - startTime,
  questionsLoaded: questions.length,
  cacheHit: fromCache
});
```

### Database Maintenance

#### Regular Tasks
```sql
-- Update question counts
UPDATE epics SET question_count = (
  SELECT COUNT(*) FROM questions WHERE epic_id = epics.id
);

-- Clean old quiz sessions (monthly)
DELETE FROM quiz_sessions WHERE created_at < NOW() - INTERVAL '30 days';

-- Analyze performance
ANALYZE questions;
ANALYZE epics;
```

## Troubleshooting

### Common Issues

#### 1. App Won't Start
```bash
# Clear Expo cache
cd EpicQuizApp
npx expo start --clear

# Reset Metro bundler
npx react-native start --reset-cache
```

#### 2. Database Connection Failed
- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check Supabase project status
- Test with `curl https://ccfpbksllmvzxllwyqyv.supabase.co/rest/v1/`

#### 3. No Questions Loading
```sql
-- Check epic availability
SELECT * FROM epics WHERE is_available = true;

-- Check question count
SELECT epic_id, COUNT(*) FROM questions GROUP BY epic_id;
```

#### 4. Build Failures
```bash
# Clear all caches
cd EpicQuizApp
rm -rf node_modules
npm cache clean --force
npm install

# For iOS
cd ios && rm -rf Pods && pod install
```

### Performance Issues

#### Slow Loading
1. Check network connection
2. Verify database indexes:
   ```sql
   -- Essential indexes
   CREATE INDEX IF NOT EXISTS idx_questions_epic_id ON questions(epic_id);
   CREATE INDEX IF NOT EXISTS idx_epics_available ON epics(is_available);
   ```

#### Memory Issues
```bash
# Monitor app memory usage
cd EpicQuizApp
npx react-devtools

# Clear AsyncStorage if needed
AsyncStorage.clear();
```

## Security Checklist

### Production Security
- [ ] Environment variables secure (no hardcoded keys)
- [ ] Supabase Row Level Security enabled
- [ ] API rate limiting configured
- [ ] Error messages don't expose sensitive data
- [ ] HTTPS enforced for all connections
- [ ] Database backups automated

### Code Security
```bash
# Security audit
cd backend
npm audit --audit-level moderate

cd ../EpicQuizApp
npm audit --audit-level moderate
```

## Scaling Considerations

### User Growth Targets
- **0-1K users**: Current setup sufficient
- **1K-10K users**: Upgrade Supabase plan, add CDN
- **10K+ users**: Consider database sharding, load balancing

### Performance Optimization
```javascript
// Add to production builds
const CONFIG = {
  maxCacheSize: 100, // Limit cached quiz packages
  prefetchCount: 3,  // Pre-fetch next questions
  offlineTimeout: 30000, // 30s offline timeout
};
```

## Backup and Recovery

### Database Backup (Automatic via Supabase)
- Daily backups enabled
- 7-day retention on free plan
- Point-in-time recovery available

### Manual Backup
```bash
# Export critical data
cd backend
node scripts/backup-database.js
```

### Recovery Procedures
1. **Data corruption**: Restore from Supabase backup
2. **App store issues**: Deploy via alternative store
3. **API downtime**: Mobile app uses cached data automatically

---

## Support and Resources

### Documentation
- [`README.md`](README.md) - Project overview
- [`SUPABASE_INTEGRATION.md`](SUPABASE_INTEGRATION.md) - Database details
- [`API_SERVICES_DOCUMENTATION.md`](API_SERVICES_DOCUMENTATION.md) - Service architecture

### Getting Help
- GitHub Issues: Report bugs and request features
- Supabase Docs: https://supabase.com/docs
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev

**🚀 Your Epic Quiz App is ready for production deployment!**