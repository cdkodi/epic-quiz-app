const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Paths to content directories
const SUMMARIES_DIR = path.join(__dirname, '../backend/generated-content/summaries');
const QUESTIONS_DIR = path.join(__dirname, '../backend/generated-content/questions');

app.use(express.json());
app.use(express.static('public'));

// Get list of available chapters
app.get('/api/chapters', async (req, res) => {
  try {
    const summaryFiles = await fs.readdir(SUMMARIES_DIR);
    const questionFiles = await fs.readdir(QUESTIONS_DIR);
    
    const chapters = new Set();
    
    // Parse summary files
    summaryFiles.forEach(file => {
      if (file.endsWith('_summary.json')) {
        const match = file.match(/^(.+)_sarga_(\d+)_summary\.json$/);
        if (match) {
          const kanda = match[1];
          const sarga = parseInt(match[2]);
          chapters.add(`${kanda}_${sarga}`);
        }
      }
    });
    
    // Parse question files
    questionFiles.forEach(file => {
      if (file.endsWith('_questions.json') && !file.includes('hard_questions')) {
        const match = file.match(/^(.+)_sarga_(\d+)_questions\.json$/);
        if (match) {
          const kanda = match[1];
          const sarga = parseInt(match[2]);
          chapters.add(`${kanda}_${sarga}`);
        }
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
    
    res.json(chapterList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load summary
app.get('/api/summary/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const filename = `${kanda}_sarga_${sarga}_summary.json`;
    const filepath = path.join(SUMMARIES_DIR, filename);
    
    const content = await fs.readFile(filepath, 'utf8');
    res.json(JSON.parse(content));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Summary not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Save summary
app.post('/api/summary/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const filename = `${kanda}_sarga_${sarga}_summary.json`;
    const filepath = path.join(SUMMARIES_DIR, filename);
    
    // Add metadata
    const summaryData = {
      ...req.body,
      kanda,
      sarga: parseInt(sarga),
      last_modified: new Date().toISOString()
    };
    
    await fs.writeFile(filepath, JSON.stringify(summaryData, null, 2));
    res.json({ success: true, message: 'Summary saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Load questions
app.get('/api/questions/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const filename = `${kanda}_sarga_${sarga}_questions.json`;
    const filepath = path.join(QUESTIONS_DIR, filename);
    
    const content = await fs.readFile(filepath, 'utf8');
    res.json(JSON.parse(content));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Questions not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Save questions
app.post('/api/questions/:kanda/:sarga', async (req, res) => {
  try {
    const { kanda, sarga } = req.params;
    const filename = `${kanda}_sarga_${sarga}_questions.json`;
    const filepath = path.join(QUESTIONS_DIR, filename);
    
    // Add metadata
    const questionsData = {
      ...req.body,
      kanda,
      sarga: parseInt(sarga),
      total_questions: req.body.questions ? req.body.questions.length : 0,
      last_modified: new Date().toISOString()
    };
    
    await fs.writeFile(filepath, JSON.stringify(questionsData, null, 2));
    res.json({ success: true, message: 'Questions saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Content Review UI running at http://localhost:${PORT}`);
  console.log(`Summaries directory: ${SUMMARIES_DIR}`);
  console.log(`Questions directory: ${QUESTIONS_DIR}`);
});