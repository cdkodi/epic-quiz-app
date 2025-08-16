#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths for sargas 30-33
const SARGAS = [30, 31, 32, 33];
const CONTENT_DIR = path.join(__dirname, '..', 'generated-content');

async function importSarga(sarga) {
  console.log(`\n📥 Processing Sarga ${sarga}...`);
  
  try {
    // Load questions files
    const questionsFile = path.join(CONTENT_DIR, 'questions', `bala_kanda_sarga_${sarga}_questions.json`);
    const hardQuestionsFile = path.join(CONTENT_DIR, 'questions', `bala_kanda_sarga_${sarga}_hard_questions_addon.json`);
    const summaryFile = path.join(CONTENT_DIR, 'summaries', `bala_kanda_sarga_${sarga}_summary.json`);
    
    if (!fs.existsSync(questionsFile)) {
      console.log(`❌ Questions file not found: ${questionsFile}`);
      return false;
    }
    
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
    
    // Generate SQL for questions
    const questionInserts = allQuestions.map(q => {
      const options = JSON.stringify(q.options).replace(/'/g, "''");
      const tags = q.tags ? `ARRAY[${q.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
      const crossEpicTags = q.cross_epic_tags ? `ARRAY[${q.cross_epic_tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
      
      return `INSERT INTO questions (
        epic_id, kanda, sarga, category, difficulty, question_text, 
        options, correct_answer_id, basic_explanation, tags, 
        original_quote, quote_translation, cross_epic_tags, source_reference
      ) VALUES (
        'ramayana', 'bala_kanda', ${sarga}, '${q.category}', '${q.difficulty}',
        '${q.question_text.replace(/'/g, "''")}',
        '${options}',
        ${q.correct_answer_id},
        '${q.basic_explanation.replace(/'/g, "''")}',
        ${tags},
        '${q.original_quote ? q.original_quote.replace(/'/g, "''") : ''}',
        '${q.quote_translation ? q.quote_translation.replace(/'/g, "''") : ''}',
        ${crossEpicTags},
        '${questionsData.source_url || ''}'
      );`;
    });
    
    // Generate SQL for summary
    let summaryInsert = '';
    if (summaryData) {
      const keyEvents = summaryData.key_events ? `ARRAY[${summaryData.key_events.map(e => `'${e.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
      const mainCharacters = summaryData.main_characters ? `ARRAY[${summaryData.main_characters.map(c => `'${c.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
      const themes = summaryData.themes ? `ARRAY[${summaryData.themes.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'ARRAY[]::text[]';
      
      summaryInsert = `INSERT INTO chapter_summaries (
        epic_id, kanda, sarga, title, key_events, main_characters, 
        themes, cultural_significance, narrative_summary, source_reference
      ) VALUES (
        'ramayana', 'bala_kanda', ${sarga}, '${summaryData.title.replace(/'/g, "''")}',
        ${keyEvents},
        ${mainCharacters},
        ${themes},
        '${summaryData.cultural_significance ? summaryData.cultural_significance.replace(/'/g, "''") : ''}',
        '${summaryData.narrative_summary ? summaryData.narrative_summary.replace(/'/g, "''") : ''}',
        '${summaryData.source_url || ''}'
      );`;
    }
    
    // Write SQL file
    const sqlFile = path.join(__dirname, `import-sarga-${sarga}-manual.sql`);
    const sqlContent = [
      `-- Manual import for Sarga ${sarga}`,
      `-- Generated on ${new Date().toISOString()}`,
      '',
      '-- Questions',
      ...questionInserts,
      '',
      '-- Summary',
      summaryInsert,
      ''
    ].filter(line => line !== undefined).join('\n');
    
    fs.writeFileSync(sqlFile, sqlContent);
    console.log(`   📄 Generated SQL file: ${sqlFile}`);
    console.log(`   ✅ Ready for manual execution in Supabase SQL Editor`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing Sarga ${sarga}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Manual Import SQL Generator for Sargas 30-33');
  console.log('================================================\n');
  
  let successCount = 0;
  
  for (const sarga of SARGAS) {
    const success = await importSarga(sarga);
    if (success) successCount++;
  }
  
  console.log(`\n📊 SUMMARY`);
  console.log(`=========`);
  console.log(`Processed: ${successCount}/${SARGAS.length} sargas`);
  console.log(`\n📋 NEXT STEPS:`);
  console.log(`1. Execute the generated SQL files in Supabase SQL Editor:`);
  SARGAS.forEach(sarga => {
    console.log(`   - import-sarga-${sarga}-manual.sql`);
  });
  console.log(`2. Run verification queries to confirm import`);
}

if (require.main === module) {
  main().catch(console.error);
}