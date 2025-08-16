#!/usr/bin/env node

/**
 * Pipeline Monitoring Dashboard
 * 
 * Real-time monitoring and status dashboard for the Epic Quiz App content generation pipeline.
 * Provides live updates, bottleneck identification, and comprehensive reporting.
 * 
 * Usage:
 *   node monitor-pipeline.js --watch          # Live monitoring mode
 *   node monitor-pipeline.js --summary        # Generate summary report
 *   node monitor-pipeline.js --sargas=42,43   # Monitor specific sargas
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs').promises;
const path = require('path');

class PipelineMonitor {
  constructor() {
    this.logsDir = path.join(__dirname, '../../logs');
    this.contentDir = path.join(__dirname, '../../generated-content');
    this.currentDate = new Date().toISOString().split('T')[0];
    this.logFile = path.join(this.logsDir, `sarga-progress-${this.currentDate}.json`);
    this.isWatching = false;
  }

  async getSystemStatus() {
    const status = {
      timestamp: new Date().toISOString(),
      pipeline_health: 'unknown',
      active_sargas: [],
      completed_today: 0,
      failed_today: 0,
      total_questions_today: 0,
      disk_usage: {},
      file_counts: {},
      bottlenecks: [],
      recommendations: []
    };

    try {
      // Load progress logs
      const logs = await this.loadProgressLogs();
      
      // Analyze pipeline health
      status.pipeline_health = this.assessPipelineHealth(logs);
      status.active_sargas = this.getActiveSargas(logs);
      status.completed_today = logs.summary?.completed_sargas || 0;
      status.failed_today = logs.summary?.failed_sargas || 0;
      status.total_questions_today = logs.summary?.total_questions || 0;

      // Check file system status
      status.disk_usage = await this.getDiskUsage();
      status.file_counts = await this.getFileCountsByType();

      // Identify bottlenecks
      status.bottlenecks = this.identifyBottlenecks(logs);
      status.recommendations = this.generateRecommendations(logs, status);

    } catch (error) {
      status.pipeline_health = 'error';
      status.error = error.message;
    }

    return status;
  }

  async loadProgressLogs() {
    try {
      const content = await fs.readFile(this.logFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return { sargas: {}, summary: {} };
    }
  }

  assessPipelineHealth(logs) {
    const sargas = Object.values(logs.sargas || {});
    if (sargas.length === 0) return 'idle';

    const failedCount = sargas.filter(s => s.status === 'failed').length;
    const completedCount = sargas.filter(s => s.status === 'completed').length;
    const inProgressCount = sargas.filter(s => s.status === 'in_progress').length;

    if (failedCount > 0 && completedCount === 0) return 'critical';
    if (failedCount > completedCount) return 'degraded';
    if (inProgressCount > 0) return 'active';
    if (completedCount > 0) return 'healthy';

    return 'idle';
  }

  getActiveSargas(logs) {
    return Object.values(logs.sargas || {})
      .filter(s => s.status === 'in_progress')
      .map(s => ({
        sarga: s.sarga,
        current_step: this.getCurrentStep(s),
        started: s.started,
        elapsed: Date.now() - new Date(s.started).getTime()
      }));
  }

  getCurrentStep(sargaLog) {
    const steps = ['scrape', 'standard_generation', 'hard_generation', 'import', 'verify'];
    
    for (const step of steps) {
      if (sargaLog.steps[step]?.status === 'in_progress') {
        return step;
      }
      if (sargaLog.steps[step]?.status === 'pending') {
        return step;
      }
    }
    
    return 'unknown';
  }

  async getDiskUsage() {
    const usage = {};
    
    try {
      const scraped = await this.getDirectorySize(path.join(this.contentDir, 'scraped'));
      const questions = await this.getDirectorySize(path.join(this.contentDir, 'questions'));
      const summaries = await this.getDirectorySize(path.join(this.contentDir, 'summaries'));
      const sql = await this.getDirectorySize(path.join(this.contentDir, 'sql'));

      usage.scraped_mb = Math.round(scraped / 1024 / 1024 * 100) / 100;
      usage.questions_mb = Math.round(questions / 1024 / 1024 * 100) / 100;
      usage.summaries_mb = Math.round(summaries / 1024 / 1024 * 100) / 100;
      usage.sql_mb = Math.round(sql / 1024 / 1024 * 100) / 100;
      usage.total_mb = usage.scraped_mb + usage.questions_mb + usage.summaries_mb + usage.sql_mb;
    } catch (error) {
      usage.error = error.message;
    }

    return usage;
  }

  async getDirectorySize(dirPath) {
    try {
      const files = await fs.readdir(dirPath);
      let totalSize = 0;
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  async getFileCountsByType() {
    const counts = {};
    
    try {
      const scraped = await fs.readdir(path.join(this.contentDir, 'scraped'));
      const questions = await fs.readdir(path.join(this.contentDir, 'questions'));
      const summaries = await fs.readdir(path.join(this.contentDir, 'summaries'));
      const sql = await fs.readdir(path.join(this.contentDir, 'sql'));

      counts.scraped_files = scraped.filter(f => f.endsWith('.json')).length;
      counts.question_files = questions.filter(f => f.endsWith('.json')).length;
      counts.summary_files = summaries.filter(f => f.endsWith('.json')).length;
      counts.sql_files = sql.filter(f => f.endsWith('.sql')).length;
    } catch (error) {
      counts.error = error.message;
    }

    return counts;
  }

  identifyBottlenecks(logs) {
    const bottlenecks = [];
    const sargas = Object.values(logs.sargas || {});

    // Check for sargas stuck in specific steps
    sargas.forEach(sarga => {
      Object.entries(sarga.steps).forEach(([step, data]) => {
        if (data.status === 'in_progress' && data.timestamp) {
          const elapsed = Date.now() - new Date(data.timestamp).getTime();
          const expectedTime = this.getExpectedStepTime(step);
          
          if (elapsed > expectedTime * 2) { // More than 2x expected time
            bottlenecks.push({
              type: 'stuck_step',
              sarga: sarga.sarga,
              step,
              elapsed_minutes: Math.round(elapsed / 60000),
              expected_minutes: Math.round(expectedTime / 60000)
            });
          }
        }
      });
    });

    // Check for repeated failures
    const failedSteps = {};
    sargas.forEach(sarga => {
      sarga.errors?.forEach(error => {
        failedSteps[error.step] = (failedSteps[error.step] || 0) + 1;
      });
    });

    Object.entries(failedSteps).forEach(([step, count]) => {
      if (count >= 2) {
        bottlenecks.push({
          type: 'repeated_failure',
          step,
          failure_count: count,
          affected_sargas: sargas.filter(s => s.errors?.some(e => e.step === step)).length
        });
      }
    });

    return bottlenecks;
  }

  getExpectedStepTime(step) {
    const times = {
      scrape: 2 * 60 * 1000,           // 2 minutes
      standard_generation: 5 * 60 * 1000,  // 5 minutes
      hard_generation: 3 * 60 * 1000,      // 3 minutes
      import: 2 * 60 * 1000,               // 2 minutes
      verify: 1 * 60 * 1000                // 1 minute
    };
    
    return times[step] || 5 * 60 * 1000; // Default 5 minutes
  }

  generateRecommendations(logs, status) {
    const recommendations = [];

    // Pipeline health recommendations
    if (status.pipeline_health === 'critical') {
      recommendations.push({
        priority: 'high',
        type: 'pipeline_health',
        message: 'Multiple failures detected. Check error logs and restart failed sargas.',
        action: 'Review error logs and restart pipeline'
      });
    }

    // Bottleneck recommendations
    status.bottlenecks.forEach(bottleneck => {
      if (bottleneck.type === 'stuck_step') {
        recommendations.push({
          priority: 'medium',
          type: 'performance',
          message: `Sarga ${bottleneck.sarga} stuck in ${bottleneck.step} for ${bottleneck.elapsed_minutes} minutes`,
          action: `Restart ${bottleneck.step} step for Sarga ${bottleneck.sarga}`
        });
      }
      
      if (bottleneck.type === 'repeated_failure') {
        recommendations.push({
          priority: 'high',
          type: 'reliability',
          message: `Step '${bottleneck.step}' failing repeatedly (${bottleneck.failure_count} times)`,
          action: 'Investigate and fix underlying issue with this step'
        });
      }
    });

    // Disk space recommendations
    if (status.disk_usage.total_mb > 100) {
      recommendations.push({
        priority: 'low',
        type: 'maintenance',
        message: `Content directory using ${status.disk_usage.total_mb}MB`,
        action: 'Consider archiving old generated content'
      });
    }

    return recommendations;
  }

  displayDashboard(status) {
    console.clear();
    console.log('🚀 EPIC QUIZ APP - PIPELINE MONITORING DASHBOARD');
    console.log('='.repeat(60));
    console.log(`📅 Date: ${this.currentDate}`);
    console.log(`🕐 Last Updated: ${new Date(status.timestamp).toLocaleTimeString()}`);
    console.log();

    // Pipeline Health Status
    const healthIcon = {
      healthy: '🟢',
      active: '🟡',
      degraded: '🟠',
      critical: '🔴',
      idle: '⚪',
      error: '❌'
    }[status.pipeline_health] || '❓';

    console.log(`${healthIcon} Pipeline Health: ${status.pipeline_health.toUpperCase()}`);
    console.log();

    // Today's Progress
    console.log('📊 TODAY\'S PROGRESS:');
    console.log(`  ✅ Completed Sargas: ${status.completed_today}`);
    console.log(`  ❌ Failed Sargas: ${status.failed_today}`);
    console.log(`  📝 Total Questions: ${status.total_questions_today}`);
    console.log();

    // Active Sargas
    if (status.active_sargas.length > 0) {
      console.log('🔄 ACTIVE SARGAS:');
      status.active_sargas.forEach(sarga => {
        const elapsed = Math.round(sarga.elapsed / 60000);
        console.log(`  📖 Sarga ${sarga.sarga}: ${sarga.current_step} (${elapsed}m)`);
      });
      console.log();
    }

    // System Resources
    console.log('💾 SYSTEM RESOURCES:');
    console.log(`  📁 Content Size: ${status.disk_usage.total_mb || 0}MB`);
    console.log(`  📄 Generated Files: ${status.file_counts.question_files || 0} questions, ${status.file_counts.summary_files || 0} summaries`);
    console.log();

    // Bottlenecks
    if (status.bottlenecks.length > 0) {
      console.log('⚠️  BOTTLENECKS DETECTED:');
      status.bottlenecks.forEach(bottleneck => {
        if (bottleneck.type === 'stuck_step') {
          console.log(`  🐌 Sarga ${bottleneck.sarga} stuck in ${bottleneck.step} (${bottleneck.elapsed_minutes}m)`);
        } else if (bottleneck.type === 'repeated_failure') {
          console.log(`  🔁 Step '${bottleneck.step}' failing repeatedly (${bottleneck.failure_count}x)`);
        }
      });
      console.log();
    }

    // Recommendations
    if (status.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      status.recommendations.forEach(rec => {
        const icon = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : '💡';
        console.log(`  ${icon} ${rec.message}`);
      });
      console.log();
    }

    if (this.isWatching) {
      console.log('👀 Watching for changes... (Press Ctrl+C to exit)');
    }
  }

  async startWatching(interval = 5000) {
    this.isWatching = true;
    console.log('🔍 Starting pipeline monitoring...\n');

    const updateDashboard = async () => {
      if (!this.isWatching) return;
      
      try {
        const status = await this.getSystemStatus();
        this.displayDashboard(status);
      } catch (error) {
        console.error('❌ Error updating dashboard:', error.message);
      }
      
      setTimeout(updateDashboard, interval);
    };

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.isWatching = false;
      console.log('\n👋 Monitoring stopped.');
      process.exit(0);
    });

    await updateDashboard();
  }

  async generateSummaryReport() {
    console.log('📊 PIPELINE SUMMARY REPORT');
    console.log('='.repeat(50));
    
    const status = await this.getSystemStatus();
    const logs = await this.loadProgressLogs();

    console.log(`📅 Date: ${this.currentDate}`);
    console.log(`🚀 Pipeline Health: ${status.pipeline_health.toUpperCase()}`);
    console.log();

    console.log('📈 DAILY STATISTICS:');
    console.log(`  Total Sargas Processed: ${Object.keys(logs.sargas || {}).length}`);
    console.log(`  Successfully Completed: ${status.completed_today}`);
    console.log(`  Failed: ${status.failed_today}`);
    console.log(`  Questions Generated: ${status.total_questions_today}`);
    console.log(`  Success Rate: ${Object.keys(logs.sargas || {}).length > 0 ? Math.round((status.completed_today / Object.keys(logs.sargas).length) * 100) : 0}%`);
    console.log();

    if (status.bottlenecks.length > 0) {
      console.log('⚠️  ISSUES IDENTIFIED:');
      status.bottlenecks.forEach(bottleneck => {
        console.log(`  • ${bottleneck.type}: ${JSON.stringify(bottleneck)}`);
      });
      console.log();
    }

    console.log('💾 RESOURCE USAGE:');
    console.log(`  Total Content Size: ${status.disk_usage.total_mb}MB`);
    console.log(`  Files Generated: ${status.file_counts.question_files + status.file_counts.summary_files} total`);
    console.log();

    if (status.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      status.recommendations.forEach(rec => {
        console.log(`  ${rec.priority.toUpperCase()}: ${rec.message}`);
        console.log(`    Action: ${rec.action}`);
      });
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const monitor = new PipelineMonitor();

  const watchArg = args.includes('--watch');
  const summaryArg = args.includes('--summary');
  const intervalArg = args.find(arg => arg.startsWith('--interval='));

  const interval = intervalArg ? parseInt(intervalArg.split('=')[1]) * 1000 : 5000;

  if (watchArg) {
    await monitor.startWatching(interval);
  } else if (summaryArg) {
    await monitor.generateSummaryReport();
  } else {
    // Single status check
    const status = await monitor.getSystemStatus();
    monitor.displayDashboard(status);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PipelineMonitor;