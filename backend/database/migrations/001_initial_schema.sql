-- Migration 001: Initial Epic Quiz Database Schema
-- Created: 2025-08-06
-- Description: Creates the complete database schema for Epic Quiz App

-- This migration creates all core tables, indexes, triggers, and views
-- for the multi-epic educational quiz platform.

\i '../schema.sql'

-- Insert initial epic data
INSERT INTO epics (id, title, description, language, culture, time_period, is_available, difficulty_level, estimated_reading_time) VALUES
('ramayana', 'The Ramayana', 'Ancient Indian epic narrating the journey of Rama, Sita, and Hanuman. A foundational text of Hindu literature exploring themes of duty, righteousness, and devotion.', 'sanskrit', 'hindu', 'Ancient India (7th century BCE - 4th century CE)', true, 'beginner', '2-3 hours');

-- Create initial admin user for content management (optional)
-- INSERT INTO users (id, username, email) VALUES
-- ('admin-user-uuid', 'admin', 'admin@epicquiz.com');

-- Verify schema creation
SELECT 'Migration 001 completed successfully. Tables created:' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
    'epics', 'questions', 'educational_content', 'users', 'user_progress', 'quiz_sessions', 'user_bookmarks'
) ORDER BY tablename;