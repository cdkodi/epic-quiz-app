#!/usr/bin/env node

/**
 * Simple Cleanup Script: Fix NULL kanda/sarga records using MCP tools
 * 
 * This script maps NULL kanda/sarga values based on content patterns
 */

require('dotenv').config();

// Content patterns to identify Sarga by question text
const SARGA_PATTERNS = {
  1: ['valmiki.*narada', 'narada.*valmiki', 'hermitage.*narada', 'righteous.*person', 'inquiry.*righteous', 'attributes.*ideal'],
  2: ['krauncha', 'first.*sloka', 'birth.*ramayana', 'compassion.*divine', 'hunter.*bird', 'spontaneous.*poetry'],
  3: ['yogic.*vision', 'comprehensive.*planning', 'meditation.*rama', 'complete.*story', 'vision.*future'],
  4: ['24000.*verses', '24,000.*verses', 'gayatri.*connection', 'lava.*kusha', 'completion.*transmission'],
  5: ['splendid.*description.*ayodhya', 'city.*planning', 'urban.*design', 'ayodhya.*prosperity'],
  6: ['virtuous.*city.*ayodhya', 'righteous.*governance', 'citizen.*prosperity', 'truth.*abiding'],
  7: ['ministers.*dasharatha', 'administrative.*excellence', 'eight.*ministers', 'vashishta.*vamadeva'],
  8: ['dasharatha.*decision', 'ashvamedha.*yajna', 'horse.*ritual', 'sonless.*grief'],
  9: ['rishyasringa.*legend', 'celibacy.*spiritual', 'romapaada.*drought', 'sage.*vibhandaka'],
  10: ['rishyasringa.*arrival', 'marriage.*shanta', 'seduction.*plan', 'strategic.*planning']
};

/**
 * Analyze question content and determine Sarga
 */
function identifySarga(questionText) {
  const text = questionText.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [sarga, patterns] of Object.entries(SARGA_PATTERNS)) {
    let score = 0;
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(text)) {
        score++;
      }
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = parseInt(sarga);
    }
  }
  
  return bestMatch;
}

async function main() {
  console.log('🔧 Starting simple NULL kanda/sarga cleanup...\n');
  
  try {
    // This is a manual approach - we'll provide SQL commands to run
    console.log('📋 Manual Cleanup Instructions:');
    console.log('=====================================\n');
    
    console.log('Run these SQL commands in the Supabase SQL editor:\n');
    
    // Generate UPDATE statements for each Sarga pattern
    for (const [sarga, patterns] of Object.entries(SARGA_PATTERNS)) {
      console.log(`-- Update questions for Sarga ${sarga}`);
      
      const conditions = patterns.map(pattern => 
        `question_text ~* '${pattern}'`
      ).join(' OR ');
      
      console.log(`UPDATE questions 
SET kanda = 'bala_kanda', sarga = ${sarga}
WHERE epic_id = 'ramayana' 
  AND (kanda IS NULL OR sarga IS NULL)
  AND (${conditions});
`);
    }
    
    console.log('\n-- Remove duplicates (keep newest by ID)');
    console.log(`DELETE FROM questions a USING questions b
WHERE a.id < b.id 
  AND a.epic_id = b.epic_id
  AND a.question_text = b.question_text;
`);
    
    console.log('\n-- Verify cleanup');
    console.log(`SELECT kanda, sarga, COUNT(*) as count 
FROM questions 
WHERE epic_id = 'ramayana' 
GROUP BY kanda, sarga 
ORDER BY kanda, sarga;
`);
    
    console.log('\n-- Check remaining NULL records');
    console.log(`SELECT COUNT(*) as null_count
FROM questions 
WHERE epic_id = 'ramayana' 
  AND (kanda IS NULL OR sarga IS NULL);
`);
    
    console.log('\n📋 Alternative: Use provided sample mappings');
    console.log('=====================================\n');
    
    // Provide some specific examples based on known content
    const specificMappings = [
      {
        pattern: "valmiki.*narada|narada.*valmiki|hermitage.*narada",
        sarga: 1,
        description: "Questions about Valmiki-Narada dialogue"
      },
      {
        pattern: "krauncha|first.*sloka|birth.*ramayana",
        sarga: 2,
        description: "Questions about Ramayana's creation"
      },
      {
        pattern: "ministers.*dasharatha|eight.*ministers",
        sarga: 7,
        description: "Questions about Dasharatha's ministers"
      },
      {
        pattern: "rishyasringa|romapaada.*drought",
        sarga: 9,
        description: "Questions about Rishyasringa legend"
      }
    ];
    
    specificMappings.forEach(mapping => {
      console.log(`-- ${mapping.description}`);
      console.log(`UPDATE questions 
SET kanda = 'bala_kanda', sarga = ${mapping.sarga}
WHERE epic_id = 'ramayana' 
  AND (kanda IS NULL OR sarga IS NULL)
  AND question_text ~* '${mapping.pattern}';
`);
    });
    
    console.log('\n✅ Manual cleanup SQL commands generated!');
    console.log('📝 Copy and run these commands in Supabase SQL editor.');
    console.log('🔗 URL: https://supabase.com/dashboard/project/ccfpbksllmvzxllwyqyv/sql');
    
  } catch (error) {
    console.error('❌ Script error:', error.message);
  }
}

if (require.main === module) {
  main();
}