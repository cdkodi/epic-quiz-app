#!/usr/bin/env node

/**
 * Data Cleanup Script: Fix NULL kanda/sarga records in Supabase
 * 
 * This script analyzes question content to map NULL kanda/sarga values to correct values
 * and removes duplicate questions based on content similarity.
 */

require('dotenv').config();

// Content patterns to identify Sarga by question text
const SARGA_PATTERNS = {
  1: [
    'valmiki.*narada', 'narada.*valmiki', 'hermitage.*narada', 'righteous.*person',
    'inquiry.*righteous', 'attributes.*ideal', 'what does valmiki seek', 'who visits.*hermitage'
  ],
  2: [
    'krauncha', 'first.*sloka', 'birth.*ramayana', 'compassion.*divine', 'hunter.*bird',
    'spontaneous.*poetry', 'deer.*lament', 'valmiki.*grief'
  ],
  3: [
    'yogic.*vision', 'comprehensive.*planning', 'meditation.*rama', 'complete.*story',
    'vision.*future', 'omniscient.*narrative'
  ],
  4: [
    '24000.*verses', '24,000.*verses', 'gayatri.*connection', 'lava.*kusha', 'completion.*transmission',
    'epic.*structure', 'teaching.*disciples', 'royal.*performance'
  ],
  5: [
    'splendid.*description.*ayodhya', 'city.*planning', 'urban.*design', 'ayodhya.*prosperity',
    'architectural.*harmony', 'royal.*highways'
  ],
  6: [
    'virtuous.*city.*ayodhya', 'righteous.*governance', 'citizen.*prosperity', 'truth.*abiding',
    'ideal.*society', 'nastika.*absence'
  ],
  7: [
    'ministers.*dasharatha', 'administrative.*excellence', 'eight.*ministers', 'vashishta.*vamadeva',
    'ministerial.*qualities', 'brahmanical.*authority'
  ],
  8: [
    'dasharatha.*decision', 'ashvamedha.*yajna', 'horse.*ritual', 'sonless.*grief', 'sons.*beget'
  ],
  9: [
    'rishyasringa.*legend', 'celibacy.*spiritual', 'romapaada.*drought', 'sage.*vibhandaka',
    'divine.*retribution'
  ],
  10: [
    'rishyasringa.*arrival', 'marriage.*shanta', 'seduction.*plan', 'strategic.*planning',
    'feminine.*agency', 'princess.*shanta'
  ]
};

async function main() {
  console.log('🔧 Starting NULL kanda/sarga cleanup process...\n');
  
  try {
    // Import MCP Supabase functions
    const { spawn } = require('child_process');
    
    // Step 1: Get all NULL records
    console.log('📋 Step 1: Analyzing NULL kanda/sarga records...');
    const nullRecords = await executeSupabaseQuery(`
      SELECT id, question_text, epic_id, kanda, sarga 
      FROM questions 
      WHERE (kanda IS NULL OR sarga IS NULL) AND epic_id = 'ramayana'
      ORDER BY id
    `);
    
    console.log(`   Found ${nullRecords.length} records with NULL kanda/sarga\n`);
    
    if (nullRecords.length === 0) {
      console.log('✅ No NULL records found. Database is already clean!');
      return;
    }
    
    // Step 2: Analyze content patterns and map to Sargas
    console.log('🔍 Step 2: Pattern matching to identify Sargas...');
    const mappedRecords = analyzeAndMapRecords(nullRecords);
    
    // Step 3: Show mapping results
    console.log('📊 Step 3: Mapping results:');
    const mappingStats = {};
    mappedRecords.forEach(record => {
      const key = `Sarga ${record.mapped_sarga}`;
      mappingStats[key] = (mappingStats[key] || 0) + 1;
    });
    
    Object.entries(mappingStats).forEach(([sarga, count]) => {
      console.log(`   ${sarga}: ${count} questions`);
    });
    console.log(`   Unmapped: ${mappedRecords.filter(r => !r.mapped_sarga).length} questions\n`);
    
    // Step 4: Find and mark duplicates
    console.log('🔎 Step 4: Identifying duplicate questions...');
    const duplicates = findDuplicates(nullRecords);
    console.log(`   Found ${duplicates.length} duplicate question groups\n`);
    
    // Step 5: Execute updates
    console.log('✏️  Step 5: Executing database updates...');
    
    let updatedCount = 0;
    let duplicatesRemoved = 0;
    
    // Update mapped records
    for (const record of mappedRecords) {
      if (record.mapped_sarga) {
        const updateQuery = `
          UPDATE questions 
          SET kanda = 'bala_kanda', sarga = ${record.mapped_sarga}
          WHERE id = ${record.id}
        `;
        
        await executeSupabaseQuery(updateQuery);
        updatedCount++;
        
        if (updatedCount % 10 === 0) {
          console.log(`   Updated ${updatedCount}/${mappedRecords.filter(r => r.mapped_sarga).length} records...`);
        }
      }
    }
    
    // Remove duplicates (keep newest by ID)
    for (const duplicateGroup of duplicates) {
      // Sort by ID descending (newest first) and remove all but the first
      const sortedIds = duplicateGroup.sort((a, b) => b - a);
      const idsToDelete = sortedIds.slice(1); // Keep first (newest), delete rest
      
      if (idsToDelete.length > 0) {
        const deleteQuery = `DELETE FROM questions WHERE id IN (${idsToDelete.join(',')})`;
        await executeSupabaseQuery(deleteQuery);
        duplicatesRemoved += idsToDelete.length;
      }
    }
    
    console.log(`\n✅ Cleanup completed successfully!`);
    console.log(`   📊 Records updated with kanda/sarga: ${updatedCount}`);
    console.log(`   🗑️  Duplicate records removed: ${duplicatesRemoved}`);
    console.log(`   📈 Database integrity improved significantly\n`);
    
    // Step 6: Verification
    console.log('🔍 Step 6: Verifying cleanup results...');
    const remainingNulls = await executeSupabaseQuery(`
      SELECT COUNT(*) as count 
      FROM questions 
      WHERE (kanda IS NULL OR sarga IS NULL) AND epic_id = 'ramayana'
    `);
    
    console.log(`   Remaining NULL records: ${remainingNulls[0].count}`);
    
    const totalQuestions = await executeSupabaseQuery(`
      SELECT COUNT(*) as count FROM questions WHERE epic_id = 'ramayana'
    `);
    
    console.log(`   Total Ramayana questions: ${totalQuestions[0].count}`);
    
    const sagaDistribution = await executeSupabaseQuery(`
      SELECT kanda, sarga, COUNT(*) as count 
      FROM questions 
      WHERE epic_id = 'ramayana' AND kanda IS NOT NULL AND sarga IS NOT NULL
      GROUP BY kanda, sarga 
      ORDER BY sarga
    `);
    
    console.log(`\n📈 Final Sarga distribution:`);
    sagaDistribution.forEach(row => {
      console.log(`   ${row.kanda} Sarga ${row.sarga}: ${row.count} questions`);
    });
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

/**
 * Analyze question content and map to appropriate Sarga
 */
function analyzeAndMapRecords(records) {
  return records.map(record => {
    const questionText = record.question_text.toLowerCase();
    let mapped_sarga = null;
    let confidence = 0;
    
    // Check each Sarga's patterns
    for (const [sarga, patterns] of Object.entries(SARGA_PATTERNS)) {
      let matches = 0;
      
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(questionText)) {
          matches++;
        }
      }
      
      // Calculate confidence based on pattern matches
      const currentConfidence = matches / patterns.length;
      if (currentConfidence > confidence && matches > 0) {
        confidence = currentConfidence;
        mapped_sarga = parseInt(sarga);
      }
    }
    
    return {
      ...record,
      mapped_sarga,
      confidence
    };
  });
}

/**
 * Find duplicate questions based on text similarity
 */
function findDuplicates(records) {
  const duplicateGroups = [];
  const processed = new Set();
  
  for (let i = 0; i < records.length; i++) {
    if (processed.has(i)) continue;
    
    const currentRecord = records[i];
    const duplicates = [currentRecord.id];
    
    for (let j = i + 1; j < records.length; j++) {
      if (processed.has(j)) continue;
      
      const compareRecord = records[j];
      
      // Check for exact match or high similarity
      if (isSimilarQuestion(currentRecord.question_text, compareRecord.question_text)) {
        duplicates.push(compareRecord.id);
        processed.add(j);
      }
    }
    
    if (duplicates.length > 1) {
      duplicateGroups.push(duplicates);
    }
    
    processed.add(i);
  }
  
  return duplicateGroups;
}

/**
 * Check if two questions are similar enough to be considered duplicates
 */
function isSimilarQuestion(text1, text2) {
  // Normalize texts
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const norm1 = normalize(text1);
  const norm2 = normalize(text2);
  
  // Exact match
  if (norm1 === norm2) return true;
  
  // High similarity (>90% character overlap)
  const similarity = calculateSimilarity(norm1, norm2);
  return similarity > 0.9;
}

/**
 * Calculate similarity between two strings
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Execute Supabase query using environment variables
 */
async function executeSupabaseQuery(query) {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase.rpc('execute_sql', { query });
  
  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }
  
  return data || [];
}

// Export for testing
module.exports = { analyzeAndMapRecords, findDuplicates, calculateSimilarity };

// Run if called directly
if (require.main === module) {
  main();
}