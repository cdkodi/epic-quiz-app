#!/usr/bin/env node

/**
 * Question Quality Validation Script
 * 
 * Validates generated questions for clarity and educational value
 * Identifies vague references and provides improvement suggestions
 */

const fs = require('fs').promises;
const path = require('path');

class QuestionQualityValidator {
  constructor() {
    this.questionsDir = path.join(__dirname, '../generated-content/questions');
    this.vaguePatterns = [
      /\bin the verses?\b/i,
      /\bin these verses?\b/i,
      /\bmentioned in the verses?\b/i,
      /\bdiscussed in the verses?\b/i,
      /\bdescribed in the verses?\b/i,
      /\bfrom the verses?\b/i,
      /\baccording to the verses?\b/i,
      /\bas per the verses?\b/i
    ];
    
    this.improvementSuggestions = {
      'in the verses': 'Use specific context like "When [character] [action]" or "In [specific situation]"',
      'mentioned in the verses': 'Reference the specific narrative context or character interaction',
      'discussed in the verses': 'Describe the actual event or conversation',
      'described in the verses': 'Use the specific story element or character description'
    };
  }

  async validateSarga(sargaNumber) {
    console.log(`🔍 Validating question quality for Sarga ${sargaNumber}...\\n`);

    try {
      // Validate main questions
      const mainFile = `bala_kanda_sarga_${sargaNumber}_questions.json`;
      const mainPath = path.join(this.questionsDir, mainFile);
      const mainResults = await this.validateQuestionsFile(mainPath, 'Standard Questions');

      // Validate hard questions
      let hardResults = { issues: [], suggestions: [], total: 0 };
      try {
        const hardFile = `bala_kanda_sarga_${sargaNumber}_hard_questions_addon.json`;
        const hardPath = path.join(this.questionsDir, hardFile);
        hardResults = await this.validateQuestionsFile(hardPath, 'Hard Questions');
      } catch (error) {
        console.log(`ℹ️  No hard questions file found for Sarga ${sargaNumber}`);
      }

      // Summary report
      const totalIssues = mainResults.issues.length + hardResults.issues.length;
      const totalQuestions = mainResults.total + hardResults.total;

      console.log(`\\n📊 QUALITY VALIDATION SUMMARY - Sarga ${sargaNumber}`);
      console.log('='.repeat(50));
      console.log(`Total Questions Analyzed: ${totalQuestions}`);
      console.log(`Quality Issues Found: ${totalIssues}`);
      console.log(`Quality Score: ${Math.round(((totalQuestions - totalIssues) / totalQuestions) * 100)}%`);

      if (totalIssues === 0) {
        console.log('\\n✅ All questions pass quality validation!');
      } else {
        console.log('\\n⚠️  Issues requiring attention:');
        [...mainResults.issues, ...hardResults.issues].forEach((issue, index) => {
          console.log(`\\n${index + 1}. ${issue.question}`);
          console.log(`   Issue: ${issue.problem}`);
          console.log(`   Suggestion: ${issue.suggestion}`);
        });
      }

      return {
        sarga: sargaNumber,
        totalQuestions,
        issues: totalIssues,
        qualityScore: Math.round(((totalQuestions - totalIssues) / totalQuestions) * 100),
        details: {
          main: mainResults,
          hard: hardResults
        }
      };

    } catch (error) {
      console.error(`❌ Failed to validate Sarga ${sargaNumber}:`, error.message);
      throw error;
    }
  }

  async validateQuestionsFile(filePath, fileType) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const questions = data.questions || [];
    const issues = [];
    const suggestions = [];

    console.log(`📋 Analyzing ${questions.length} ${fileType.toLowerCase()}...`);

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionIssues = this.analyzeQuestion(question, i + 1);
      
      if (questionIssues.length > 0) {
        issues.push(...questionIssues);
        console.log(`   ⚠️  Issue in question ${i + 1}: ${questionIssues[0].problem}`);
      } else {
        console.log(`   ✅ Question ${i + 1}: Clear and contextual`);
      }
    }

    return {
      issues,
      suggestions,
      total: questions.length
    };
  }

  analyzeQuestion(question, questionNumber) {
    const issues = [];
    const questionText = question.question_text || '';

    // Check for vague references
    for (const pattern of this.vaguePatterns) {
      if (pattern.test(questionText)) {
        const match = questionText.match(pattern)[0];
        const suggestion = this.improvementSuggestions[match.toLowerCase()] || 
                          'Use specific narrative context instead of vague references';
        
        issues.push({
          question: `Q${questionNumber}: "${questionText}"`,
          problem: `Contains vague reference: "${match}"`,
          suggestion: suggestion,
          severity: 'high'
        });
      }
    }

    // Check for other clarity issues
    if (questionText.length < 10) {
      issues.push({
        question: `Q${questionNumber}: "${questionText}"`,
        problem: 'Question text is too short',
        suggestion: 'Provide more context and detail in the question',
        severity: 'medium'
      });
    }

    if (!question.basic_explanation || question.basic_explanation.length < 20) {
      issues.push({
        question: `Q${questionNumber}: "${questionText}"`,
        problem: 'Basic explanation is missing or too brief',
        suggestion: 'Provide a comprehensive educational explanation',
        severity: 'low'
      });
    }

    // Check for context-free questions
    const contextFreePatterns = [
      /^Who is [^?]+\\?$/,
      /^What is [^?]+\\?$/,
      /^Which [^?]+\\?$/
    ];

    for (const pattern of contextFreePatterns) {
      if (pattern.test(questionText) && !this.hasSpecificContext(questionText)) {
        issues.push({
          question: `Q${questionNumber}: "${questionText}"`,
          problem: 'Question lacks specific narrative context',
          suggestion: 'Include character names, story events, or situational details',
          severity: 'medium'
        });
      }
    }

    return issues;
  }

  hasSpecificContext(questionText) {
    // Check if question contains specific context indicators
    const contextIndicators = [
      'When ', 'According to ', 'In the story of ', 'During ', 'After ',
      'Before ', 'While ', 'As ', 'In [character name]', 'conversation',
      'interaction', 'encounter', 'visit', 'journey'
    ];

    return contextIndicators.some(indicator => 
      questionText.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  async batchValidateSargas(sargaNumbers) {
    console.log(`🚀 Starting batch quality validation for Sargas: ${sargaNumbers.join(', ')}\\n`);
    
    const results = [];
    let totalQuestions = 0;
    let totalIssues = 0;

    for (const sarga of sargaNumbers) {
      const result = await this.validateSarga(sarga);
      results.push(result);
      totalQuestions += result.totalQuestions;
      totalIssues += result.issues;
      
      console.log(''); // Add spacing between sargas
    }

    console.log('🎯 BATCH VALIDATION SUMMARY');
    console.log('=' .repeat(40));
    console.log(`Total Questions Analyzed: ${totalQuestions}`);
    console.log(`Total Quality Issues: ${totalIssues}`);
    console.log(`Overall Quality Score: ${Math.round(((totalQuestions - totalIssues) / totalQuestions) * 100)}%`);
    console.log('\\nBy Sarga:');
    results.forEach(result => {
      console.log(`  Sarga ${result.sarga}: ${result.qualityScore}% (${result.issues} issues)`);
    });

    return results;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  const batchArg = args.find(arg => arg.startsWith('--batch='));
  
  const validator = new QuestionQualityValidator();

  try {
    if (sargaArg) {
      const sarga = parseInt(sargaArg.split('=')[1]);
      await validator.validateSarga(sarga);
    } else if (batchArg) {
      const sargas = batchArg.split('=')[1].split(',').map(s => parseInt(s.trim()));
      await validator.batchValidateSargas(sargas);
    } else {
      console.error('❌ Usage:');
      console.error('  Single Sarga: node validate-question-quality.js --sarga=51');
      console.error('  Batch Validation: node validate-question-quality.js --batch=51,52,53');
      process.exit(1);
    }
  } catch (error) {
    console.error('\\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { QuestionQualityValidator };