#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths for sargas 30-33
const SARGAS = [30, 31, 32, 33];
const CONTENT_DIR = path.join(__dirname, '..', 'generated-content');

async function generateCompleteImportSQL() {
  console.log('🚀 Generating Complete Import SQL for Sargas 30-33');
  console.log('==================================================\n');
  
  let allSQL = [];
  
  for (const sarga of SARGAS) {
    console.log(`📥 Processing Sarga ${sarga}...`);
    
    try {
      // Load questions files
      const questionsFile = path.join(CONTENT_DIR, 'questions', `bala_kanda_sarga_${sarga}_questions.json`);
      const hardQuestionsFile = path.join(CONTENT_DIR, 'questions', `bala_kanda_sarga_${sarga}_hard_questions_addon.json`);
      const summaryFile = path.join(CONTENT_DIR, 'summaries', `bala_kanda_sarga_${sarga}_summary.json`);
      
      const questionsData = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
      let hardQuestionsData = null;
      
      if (fs.existsSync(hardQuestionsFile)) {
        hardQuestionsData = JSON.parse(fs.readFileSync(hardQuestionsFile, 'utf8'));
      }
      
      let summaryData = null;
      if (fs.existsSync(summaryFile)) {
        summaryData = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
      }
      
      // Combine questions
      const allQuestions = [...questionsData.questions];
      if (hardQuestionsData && hardQuestionsData.questions) {
        allQuestions.push(...hardQuestionsData.questions);
      }
      
      console.log(`   📝 Found ${allQuestions.length} questions (${questionsData.questions.length} standard + ${hardQuestionsData ? hardQuestionsData.questions.length : 0} hard)`);
      
      // Add section header
      allSQL.push(`\n-- ===== SARGA ${sarga} IMPORT =====`);
      allSQL.push(`-- Questions: ${allQuestions.length}, Summary: ${summaryData ? 1 : 0}`);
      
      // Generate questions SQL - batch insert format
      if (allQuestions.length > 0) {
        allSQL.push(`\n-- Sarga ${sarga} Questions`);
        allSQL.push(`INSERT INTO questions (epic_id, kanda, sarga, category, difficulty, question_text, options, correct_answer_id, basic_explanation, tags, original_quote, quote_translation, cross_epic_tags, source_reference) VALUES`);
        
        const questionValues = allQuestions.map((q, index) => {
          const options = JSON.stringify(q.options).replace(/'/g, "''");
          const tags = q.tags ? `ARRAY[${q.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
          const crossEpicTags = q.cross_epic_tags ? `ARRAY[${q.cross_epic_tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
          
          const isLast = index === allQuestions.length - 1;
          
          return `  ('ramayana', 'bala_kanda', ${sarga}, '${q.category}', '${q.difficulty}', '${q.question_text.replace(/'/g, "''")}', '${options}', ${q.correct_answer_id}, '${q.basic_explanation.replace(/'/g, "''")}', ${tags}, '${q.original_quote ? q.original_quote.replace(/'/g, "''") : ''}', '${q.quote_translation ? q.quote_translation.replace(/'/g, "''") : ''}', ${crossEpicTags}, '${questionsData.source_url || ''}')${isLast ? ';' : ','}`;
        });
        
        allSQL.push(...questionValues);
      }
      
      // Generate summary SQL
      if (summaryData) {
        allSQL.push(`\n-- Sarga ${sarga} Summary`);
        const keyEvents = summaryData.key_events ? `ARRAY[${summaryData.key_events.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
        const mainCharacters = summaryData.main_characters ? `ARRAY[${summaryData.main_characters.map(c => `'${c.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
        const themes = summaryData.themes ? `ARRAY[${summaryData.themes.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
        
        allSQL.push(`INSERT INTO chapter_summaries (epic_id, kanda, sarga, title, key_events, main_characters, themes, cultural_significance, narrative_summary, source_reference) VALUES ('ramayana', 'bala_kanda', ${sarga}, '${summaryData.title.replace(/'/g, "''")}', ${keyEvents}, ${mainCharacters}, ${themes}, '${summaryData.cultural_significance ? summaryData.cultural_significance.replace(/'/g, "''") : ''}', '${summaryData.narrative_summary ? summaryData.narrative_summary.replace(/'/g, "''") : ''}', '${summaryData.source_url || ''}');`);
      }
      
      console.log(`   ✅ Processed Sarga ${sarga}`);
      
    } catch (error) {
      console.error(`   ❌ Error processing Sarga ${sarga}:`, error.message);
    }
  }
  
  // Write complete SQL file
  const completeSQL = [
    '-- COMPLETE IMPORT FOR SARGAS 30-33',
    `-- Generated on ${new Date().toISOString()}`,
    '-- Total Sargas: 4',
    '-- Expected: 60 questions, 4 summaries',
    '',
    '-- Delete existing data for sargas 30-33 (if any)',
    "DELETE FROM questions WHERE kanda = 'bala_kanda' AND sarga IN (30, 31, 32, 33);",
    "DELETE FROM chapter_summaries WHERE kanda = 'bala_kanda' AND sarga IN (30, 31, 32, 33);",
    '',
    ...allSQL,
    '',
    '-- VERIFICATION QUERIES',
    '-- Run these to verify the import was successful:',
    '/*',
    'SELECT sarga, COUNT(*) as total_questions,',
    '       COUNT(CASE WHEN difficulty = \'easy\' THEN 1 END) as easy,',
    '       COUNT(CASE WHEN difficulty = \'medium\' THEN 1 END) as medium,',
    '       COUNT(CASE WHEN difficulty = \'hard\' THEN 1 END) as hard',
    'FROM questions', 
    'WHERE kanda = \'bala_kanda\' AND sarga IN (30, 31, 32, 33)',
    'GROUP BY sarga',
    'ORDER BY sarga;',
    '',
    'SELECT sarga, title FROM chapter_summaries',
    'WHERE kanda = \'bala_kanda\' AND sarga IN (30, 31, 32, 33)',
    'ORDER BY sarga;',
    '*/'
  ].join('\n');
  
  const sqlFile = path.join(__dirname, 'complete-import-sargas-30-33.sql');
  fs.writeFileSync(sqlFile, completeSQL);
  
  console.log(`\n📄 Generated complete SQL file: ${sqlFile}`);
  console.log(`📊 Ready for execution in Supabase`);
  
  return sqlFile;
}

if (require.main === module) {
  generateCompleteImportSQL().catch(console.error);
}

module.exports = { generateCompleteImportSQL };