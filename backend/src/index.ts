import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import database from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await database.testConnection();
    const poolStats = database.getPoolStats();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: dbConnected,
        pool: poolStats
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Import API routes
import epicsRouter from './routes/epics';
import quizRouter from './routes/quiz';
import contentRouter from './routes/content';

// API routes
app.use('/api/v1/epics', epicsRouter);
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/questions', contentRouter); // Note: content router handles /questions/:id/deep-dive
app.use('/api/v1/content', contentRouter);

// API documentation endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Epic Quiz API',
    version: '1.0.0',
    description: 'Educational quiz platform for classical literature and epics',
    endpoints: {
      epics: {
        'GET /api/v1/epics': 'List all available epics',
        'GET /api/v1/epics/:epicId': 'Get epic details',
        'GET /api/v1/epics/:epicId/stats': 'Get epic statistics',
        'GET /api/v1/epics/trending': 'Get trending epics',
        'GET /api/v1/epics/search?q=term': 'Search epics'
      },
      quiz: {
        'GET /api/v1/quiz?epic=:epicId&count=10': 'Generate quiz package (bulk download)',
        'POST /api/v1/quiz/submit': 'Submit quiz results'
      },
      content: {
        'GET /api/v1/questions/:id/deep-dive': 'Get rich educational content'
      }
    },
    architecture: {
      strategy: 'Hybrid content delivery (bulk download + lazy loading)',
      offline_support: 'Quiz packages include all data needed for offline operation',
      performance_target: '<2s quiz loading, <1s deep-dive content'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    console.log('Connecting to database...');
    const dbConnected = await database.testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    // Run migrations
    console.log('Running database migrations...');
    await database.runMigrations();

    // Start server
    app.listen(PORT, () => {
      console.log(`Epic Quiz API server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: Connected to ${process.env.DB_NAME || 'epic_quiz_db'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Graceful shutdown...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  await database.close();
  process.exit(0);
});

// Start the application
startServer();