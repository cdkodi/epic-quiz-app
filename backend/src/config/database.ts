import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

/**
 * Database Configuration and Migration System
 * 
 * ARCHITECTURAL DECISION: Custom migration system instead of heavy ORM
 * WHY: 
 * - Simple, focused migrations for our specific PostgreSQL features
 * - Full control over SQL and performance optimizations
 * - No ORM overhead - direct SQL queries for better performance
 * - Educational app doesn't need complex ORM features
 */

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class Database {
  private pool: Pool;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'epic_quiz_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return error after 2 seconds if no connection available
    };

    this.pool = new Pool(this.config);

    // Handle pool errors
    this.pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  /**
   * Get a database client from the pool
   */
  async getClient() {
    return this.pool.connect();
  }

  /**
   * Execute a query using the pool
   */
  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Executed query', { text: text.substring(0, 100), duration, rows: result.rowCount });
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', { text: text.substring(0, 100), error });
      throw error;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      console.log('Database connection successful:', result.rows[0].current_time);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  /**
   * Create migrations table if it doesn't exist
   */
  private async ensureMigrationsTable(): Promise<void> {
    const createMigrationsTable = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await this.query(createMigrationsTable);
  }

  /**
   * Get list of applied migrations
   */
  private async getAppliedMigrations(): Promise<string[]> {
    const result = await this.query('SELECT version FROM schema_migrations ORDER BY version');
    return result.rows.map((row: any) => row.version);
  }

  /**
   * Run pending migrations
   * 
   * ARCHITECTURAL DECISION: File-based migrations with version control
   * WHY: Simple, predictable, and git-friendly migration system
   */
  async runMigrations(): Promise<void> {
    console.log('Starting database migrations...');
    
    await this.ensureMigrationsTable();
    const appliedMigrations = await this.getAppliedMigrations();
    
    const migrationsDir = path.join(__dirname, '../../database/migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found, skipping migrations');
      return;
    }

    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const pendingMigrations = migrationFiles.filter(file => 
      !appliedMigrations.includes(file.replace('.sql', ''))
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migrations`);

    for (const migrationFile of pendingMigrations) {
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationVersion = migrationFile.replace('.sql', '');
      
      console.log(`Running migration: ${migrationVersion}`);
      
      try {
        // Read and execute migration file
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute migration in a transaction
        const client = await this.getClient();
        try {
          await client.query('BEGIN');
          
          // Execute the migration SQL
          await client.query(migrationSQL);
          
          // Record the migration as applied
          await client.query(
            'INSERT INTO schema_migrations (version) VALUES ($1)',
            [migrationVersion]
          );
          
          await client.query('COMMIT');
          console.log(`Migration ${migrationVersion} completed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error(`Migration ${migrationVersion} failed:`, error);
        throw error;
      }
    }
    
    console.log('All migrations completed successfully');
  }

  /**
   * Close all database connections
   */
  async close(): Promise<void> {
    await this.pool.end();
    console.log('Database pool closed');
  }

  /**
   * Get pool statistics for monitoring
   */
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Create singleton instance
const database = new Database();

export default database;

// Export types for use in other modules
export type { DatabaseConfig };

/**
 * Helper function to execute queries with better error handling
 */
export const executeQuery = async (query: string, params?: any[]) => {
  try {
    return await database.query(query, params);
  } catch (error) {
    console.error('Query execution failed:', { query: query.substring(0, 100), error });
    throw new Error(`Database query failed: ${error}`);
  }
};