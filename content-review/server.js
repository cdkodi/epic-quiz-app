const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001;

// Supabase configuration
const SUPABASE_URL = 'https://ccfpbksllmvzxllwyqyv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZnBia3NsbG12enhsbHd5cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3OTM2NzUsImV4cCI6MjA3MDM2OTY3NX0.3tc1DD-LGOOU2uSzGzC_HYYu-G7EIBW8UjHawUJz6aw';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Paths to content directories (kept for fallback)
const SUMMARIES_DIR = path.join(__dirname, '../backend/generated-content/summaries');
const QUESTIONS_DIR = path.join(__dirname, '../backend/generated-content/questions');

app.use(express.json());
app.use(express.static('public'));

// Get list of available chapters
app.get('/api/chapters', async (req, res) => {
  try {
    // Get chapters from Supabase database
    const { data: summaries, error: summariesError } = await supabase
      .from('chapter_summaries')
      .select('kanda, sarga')
      .order('kanda')
      .order('sarga');

    if (summariesError) {
      console.error('Error fetching summaries:', summariesError);
      throw summariesError;
    }

    // Get questions to see what chapters have questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('kanda, sarga')
      .not('kanda', 'is', null)
      .not('sarga', 'is', null);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw questionsError;
    }

    // Combine chapters from both sources
    const chapters = new Set();
    
    // Add chapters from summaries
    summaries?.forEach(({ kanda, sarga }) => {
      if (kanda && sarga) {
        chapters.add(`${kanda}_${sarga}`);
      }
    });
    
    // Add chapters from questions
    questions?.forEach(({ kanda, sarga }) => {
      if (kanda && sarga) {
        chapters.add(`${kanda}_${sarga}`);
      }
    });
    
    const chapterList = Array.from(chapters).map(ch => {
      const parts = ch.split('_');
      const sarga = parseInt(parts[parts.length - 1]);
      const kanda = parts.slice(0, -1).join('_');
      return { kanda, sarga };
    }).sort((a, b) => {
      if (a.kanda !== b.kanda) return a.kanda.localeCompare(b.kanda);
      return a.sarga - b.sarga;
    });
    
    console.log(`Found ${chapterList.length} chapters in database`);
    res.json(chapterList);
  } catch (error) {
    console.error('Error in /api/chapters:', error);
    res.status(500).json({ error: error.message });
  }
});

// Load summary
app.get('/api/summary/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    
    // Get summary from Supabase database
    const { data: summary, error } = await supabase
      .from('chapter_summaries')
      .select('*')
      .eq('kanda', kanda)
      .eq('sarga', parseInt(sarga))
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        res.status(404).json({ error: 'Summary not found' });
        return;
      }
      throw error;
    }

    // Convert database format to UI format (strings to arrays)
    const uiFormat = {
      title: summary.title || '',
      key_events: summary.key_events ? summary.key_events.split(';').map(s => s.trim()).filter(s => s) : [],
      main_characters: summary.main_characters ? summary.main_characters.split(';').map(s => s.trim()).filter(s => s) : [],
      themes: summary.themes ? summary.themes.split(';').map(s => s.trim()).filter(s => s) : [],
      cultural_significance: summary.cultural_significance || '',
      narrative_summary: summary.narrative_summary || '',
      kanda: summary.kanda,
      sarga: summary.sarga,
      last_modified: summary.updated_at
    };
    
    res.json(uiFormat);
  } catch (error) {
    console.error('Error loading summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save summary
app.post('/api/summary/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const summaryData = req.body;
    
    // Prepare data for database (convert arrays to strings)
    const dbData = {
      epic_id: 'ramayana', // Default epic for now
      kanda,
      sarga: parseInt(sarga),
      title: summaryData.title || '',
      key_events: Array.isArray(summaryData.key_events) ? summaryData.key_events.join('; ') : summaryData.key_events || '',
      main_characters: Array.isArray(summaryData.main_characters) ? summaryData.main_characters.join('; ') : summaryData.main_characters || '',
      themes: Array.isArray(summaryData.themes) ? summaryData.themes.join('; ') : summaryData.themes || '',
      cultural_significance: summaryData.cultural_significance || '',
      narrative_summary: summaryData.narrative_summary || '',
      source_reference: `Edited via Content Review UI - ${new Date().toISOString()}`,
      updated_at: new Date().toISOString()
    };

    // Use upsert to insert or update
    const { data, error } = await supabase
      .from('chapter_summaries')
      .upsert(dbData, {
        onConflict: 'epic_id,kanda,sarga'
      })
      .select();

    if (error) {
      console.error('Error saving summary:', error);
      throw error;
    }
    
    console.log(`Summary saved for ${kanda} sarga ${sarga}`);
    res.json({ success: true, message: 'Summary saved successfully', data });
  } catch (error) {
    console.error('Error in save summary:', error);
    res.status(500).json({ error: error.message });
  }
});

// Load questions
app.get('/api/questions/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    
    // Get questions from Supabase database
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('kanda', kanda)
      .eq('sarga', parseInt(sarga))
      .order('created_at');

    if (error) {
      console.error('Error loading questions:', error);
      throw error;
    }

    if (!questions || questions.length === 0) {
      res.status(404).json({ error: 'Questions not found' });
      return;
    }

    // Convert database format to UI format
    const uiFormat = {
      questions: questions.map(q => ({
        category: q.category,
        difficulty: q.difficulty,
        question_text: q.question_text,
        options: q.options,
        correct_answer_id: q.correct_answer_id,
        basic_explanation: q.basic_explanation,
        original_quote: q.original_quote || '',
        quote_translation: q.quote_translation || '',
        tags: q.tags || [],
        cross_epic_tags: q.cross_epic_tags || []
      })),
      kanda,
      sarga: parseInt(sarga),
      total_questions: questions.length,
      last_modified: questions[0]?.updated_at
    };
    
    res.json(uiFormat);
  } catch (error) {
    console.error('Error in load questions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save questions
app.post('/api/questions/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const questionsData = req.body;
    
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      return res.status(400).json({ error: 'Invalid questions data' });
    }

    // First, delete existing questions for this kanda/sarga
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('kanda', kanda)
      .eq('sarga', parseInt(sarga));

    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
      throw deleteError;
    }

    // Insert new questions
    const questionsToInsert = questionsData.questions.map(q => ({
      epic_id: 'ramayana',
      kanda,
      sarga: parseInt(sarga),
      category: q.category,
      difficulty: q.difficulty,
      question_text: q.question_text,
      options: q.options,
      correct_answer_id: q.correct_answer_id,
      basic_explanation: q.basic_explanation,
      original_quote: q.original_quote || null,
      quote_translation: q.quote_translation || null,
      tags: q.tags || [],
      cross_epic_tags: q.cross_epic_tags || [],
      source_reference: `Edited via Content Review UI - ${new Date().toISOString()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error('Error saving questions:', error);
      throw error;
    }
    
    console.log(`Saved ${questionsToInsert.length} questions for ${kanda} sarga ${sarga}`);
    res.json({ 
      success: true, 
      message: 'Questions saved successfully', 
      count: questionsToInsert.length,
      data 
    });
  } catch (error) {
    console.error('Error in save questions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Content Review UI running at http://localhost:${PORT}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Fallback summaries directory: ${SUMMARIES_DIR}`);
  console.log(`Fallback questions directory: ${QUESTIONS_DIR}`);
  
  // Test database connection
  try {
    const { data, error } = await supabase
      .from('chapter_summaries')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
});