#!/usr/bin/env node

/**
 * Sarga Progress Logger
 * 
 * Comprehensive step-by-step logging system for Epic Quiz App content generation pipeline.
 * Tracks each phase: scrape → standard gen → hard gen → import → verify
 * 
 * Usage: 
 *   node sarga-progress-logger.js --sarga=42 --step=scrape --status=success
 *   node sarga-progress-logger.js --sarga=42 --step=verify --questions=15 --summaries=1
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');

class SargaProgressLogger {
  constructor() {
    this.logsDir = path.join(__dirname, '../../logs');
    this.currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    this.logFile = path.join(this.logsDir, `sarga-progress-${this.currentDate}.json`);
  }

  async ensureLogsDirectory() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async loadExistingLogs() {
    try {
      const content = await fs.readFile(this.logFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      // File doesn't exist yet, return empty structure
      return {
        date: this.currentDate,
        sargas: {},
        summary: {
          total_sargas: 0,
          completed_sargas: 0,
          failed_sargas: 0,
          total_questions: 0,
          total_summaries: 0
        }
      };
    }
  }

  async logStep(sarga, step, status, metadata = {}) {
    await this.ensureLogsDirectory();
    const logs = await this.loadExistingLogs();
    const timestamp = new Date().toISOString();

    // Initialize sarga if it doesn't exist
    if (!logs.sargas[sarga]) {
      logs.sargas[sarga] = {
        sarga: parseInt(sarga),
        title: metadata.title || `Sarga ${sarga}`,
        started: timestamp,
        completed: null,
        status: 'in_progress',
        steps: {
          scrape: { status: 'pending', timestamp: null, metadata: {} },
          standard_generation: { status: 'pending', timestamp: null, metadata: {} },
          hard_generation: { status: 'pending', timestamp: null, metadata: {} },
          import: { status: 'pending', timestamp: null, metadata: {} },
          verify: { status: 'pending', timestamp: null, metadata: {} }
        },
        metrics: {
          total_questions: 0,
          standard_questions: 0,
          hard_questions: 0,
          summaries: 0,
          file_sizes: {},
          processing_times: {}
        },
        errors: []
      };
    }

    const sargaLog = logs.sargas[sarga];

    // Update step status
    if (sargaLog.steps[step]) {
      sargaLog.steps[step].status = status;
      sargaLog.steps[step].timestamp = timestamp;
      sargaLog.steps[step].metadata = { ...sargaLog.steps[step].metadata, ...metadata };

      // Track processing time
      if (status === 'success' && metadata.start_time) {
        const processingTime = Date.now() - metadata.start_time;
        sargaLog.metrics.processing_times[step] = processingTime;
      }

      // Log errors
      if (status === 'error' && metadata.error) {
        sargaLog.errors.push({
          step,
          timestamp,
          error: metadata.error,
          details: metadata.details || ''
        });
      }

      // Update metrics based on step
      this.updateMetrics(sargaLog, step, status, metadata);
    }

    // Check if sarga is complete
    const allSteps = Object.values(sargaLog.steps);
    const completedSteps = allSteps.filter(s => s.status === 'success').length;
    const failedSteps = allSteps.filter(s => s.status === 'error').length;

    if (completedSteps === allSteps.length) {
      sargaLog.status = 'completed';
      sargaLog.completed = timestamp;
    } else if (failedSteps > 0) {
      sargaLog.status = 'failed';
    }

    // Update summary statistics
    this.updateSummaryStats(logs);

    // Save logs
    await fs.writeFile(this.logFile, JSON.stringify(logs, null, 2));

    // Output progress message
    this.displayProgress(sarga, step, status, metadata);

    return logs;
  }

  updateMetrics(sargaLog, step, status, metadata) {
    if (status !== 'success') return;

    switch (step) {
      case 'scrape':
        if (metadata.verse_count) {
          sargaLog.metrics.verse_count = metadata.verse_count;
        }
        if (metadata.file_size) {
          sargaLog.metrics.file_sizes.scraped = metadata.file_size;
        }
        break;

      case 'standard_generation':
        if (metadata.questions_count) {
          sargaLog.metrics.standard_questions = metadata.questions_count;
          sargaLog.metrics.total_questions = metadata.questions_count;
        }
        if (metadata.file_size) {
          sargaLog.metrics.file_sizes.questions = metadata.file_size;
        }
        if (metadata.summaries_count) {
          sargaLog.metrics.summaries = metadata.summaries_count;
        }
        break;

      case 'hard_generation':
        if (metadata.hard_questions_count) {
          sargaLog.metrics.hard_questions = metadata.hard_questions_count;
          sargaLog.metrics.total_questions = sargaLog.metrics.standard_questions + metadata.hard_questions_count;
        }
        break;

      case 'verify':
        if (metadata.questions) {
          sargaLog.metrics.verified_questions = metadata.questions;
        }
        if (metadata.summaries) {
          sargaLog.metrics.verified_summaries = metadata.summaries;
        }
        break;
    }
  }

  updateSummaryStats(logs) {
    const sargas = Object.values(logs.sargas);
    logs.summary = {
      total_sargas: sargas.length,
      completed_sargas: sargas.filter(s => s.status === 'completed').length,
      failed_sargas: sargas.filter(s => s.status === 'failed').length,
      in_progress_sargas: sargas.filter(s => s.status === 'in_progress').length,
      total_questions: sargas.reduce((sum, s) => sum + (s.metrics.verified_questions || s.metrics.total_questions || 0), 0),
      total_summaries: sargas.reduce((sum, s) => sum + (s.metrics.verified_summaries || s.metrics.summaries || 0), 0)
    };
  }

  displayProgress(sarga, step, status, metadata) {
    const statusIcon = {
      success: '✅',
      error: '❌',
      in_progress: '🔄',
      pending: '⏳'
    }[status] || '📝';

    const stepName = {
      scrape: 'Scraping',
      standard_generation: 'Standard Generation',
      hard_generation: 'Hard Questions',
      import: 'Import',
      verify: 'Verification'
    }[step] || step;

    console.log(`${statusIcon} Sarga ${sarga} - ${stepName}: ${status.toUpperCase()}`);
    
    if (metadata.questions_count || metadata.hard_questions_count || metadata.questions) {
      const count = metadata.questions_count || metadata.hard_questions_count || metadata.questions;
      console.log(`   📊 Questions: ${count}`);
    }
    
    if (metadata.summaries_count || metadata.summaries) {
      const count = metadata.summaries_count || metadata.summaries;
      console.log(`   📝 Summaries: ${count}`);
    }

    if (metadata.error) {
      console.log(`   🔍 Error: ${metadata.error}`);
    }

    if (metadata.processing_time || metadata.start_time) {
      const time = metadata.processing_time || (Date.now() - metadata.start_time);
      console.log(`   ⏱️  Processing Time: ${Math.round(time / 1000)}s`);
    }
  }

  async generateReport(sarga = null) {
    const logs = await this.loadExistingLogs();
    
    if (sarga) {
      // Generate report for specific sarga
      const sargaLog = logs.sargas[sarga];
      if (!sargaLog) {
        console.log(`❌ No logs found for Sarga ${sarga}`);
        return;
      }

      console.log(`\n📊 SARGA ${sarga} DETAILED REPORT`);
      console.log('='.repeat(50));
      console.log(`Status: ${sargaLog.status.toUpperCase()}`);
      console.log(`Started: ${sargaLog.started}`);
      console.log(`Completed: ${sargaLog.completed || 'In Progress'}`);
      
      console.log('\n📋 STEP PROGRESS:');
      Object.entries(sargaLog.steps).forEach(([step, data]) => {
        const icon = data.status === 'success' ? '✅' : data.status === 'error' ? '❌' : '⏳';
        console.log(`  ${icon} ${step}: ${data.status}`);
      });

      console.log('\n📈 METRICS:');
      console.log(`  Total Questions: ${sargaLog.metrics.total_questions}`);
      console.log(`  Standard Questions: ${sargaLog.metrics.standard_questions}`);
      console.log(`  Hard Questions: ${sargaLog.metrics.hard_questions}`);
      console.log(`  Summaries: ${sargaLog.metrics.summaries}`);

      if (sargaLog.errors.length > 0) {
        console.log('\n🚨 ERRORS:');
        sargaLog.errors.forEach(error => {
          console.log(`  ${error.step}: ${error.error}`);
        });
      }
    } else {
      // Generate summary report
      console.log('\n📊 DAILY PROGRESS SUMMARY');
      console.log('='.repeat(50));
      console.log(`Date: ${logs.date}`);
      console.log(`Total Sargas: ${logs.summary.total_sargas}`);
      console.log(`Completed: ${logs.summary.completed_sargas}`);
      console.log(`Failed: ${logs.summary.failed_sargas}`);
      console.log(`In Progress: ${logs.summary.in_progress_sargas}`);
      console.log(`Total Questions: ${logs.summary.total_questions}`);
      console.log(`Total Summaries: ${logs.summary.total_summaries}`);

      if (logs.summary.total_sargas > 0) {
        const successRate = Math.round((logs.summary.completed_sargas / logs.summary.total_sargas) * 100);
        console.log(`Success Rate: ${successRate}%`);
      }

      console.log('\n📋 SARGA STATUS:');
      Object.values(logs.sargas).forEach(sarga => {
        const icon = sarga.status === 'completed' ? '✅' : sarga.status === 'failed' ? '❌' : '🔄';
        console.log(`  ${icon} Sarga ${sarga.sarga}: ${sarga.status} (${sarga.metrics.total_questions} questions)`);
      });
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const logger = new SargaProgressLogger();

  // Parse arguments
  const sargaArg = args.find(arg => arg.startsWith('--sarga='));
  const stepArg = args.find(arg => arg.startsWith('--step='));
  const statusArg = args.find(arg => arg.startsWith('--status='));
  const reportArg = args.find(arg => arg.startsWith('--report'));

  if (reportArg) {
    const reportSarga = sargaArg ? parseInt(sargaArg.split('=')[1]) : null;
    await logger.generateReport(reportSarga);
    return;
  }

  if (!sargaArg || !stepArg || !statusArg) {
    console.log('Usage: node sarga-progress-logger.js --sarga=42 --step=scrape --status=success');
    console.log('       node sarga-progress-logger.js --report [--sarga=42]');
    console.log('');
    console.log('Steps: scrape, standard_generation, hard_generation, import, verify');
    console.log('Status: success, error, in_progress, pending');
    return;
  }

  const sarga = parseInt(sargaArg.split('=')[1]);
  const step = stepArg.split('=')[1];
  const status = statusArg.split('=')[1];

  // Parse additional metadata
  const metadata = {};
  args.forEach(arg => {
    if (arg.includes('=') && !arg.startsWith('--sarga=') && !arg.startsWith('--step=') && !arg.startsWith('--status=')) {
      const [key, value] = arg.replace('--', '').split('=');
      if (!isNaN(value)) {
        metadata[key] = parseInt(value);
      } else {
        metadata[key] = value;
      }
    }
  });

  await logger.logStep(sarga, step, status, metadata);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = SargaProgressLogger;