/**
 * Global Test Teardown
 * 
 * Runs once after all tests to clean up the test environment
 */

import { teardownTests } from './setup';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    await teardownTests();
    console.log('✅ Test environment cleaned up');
  } catch (error) {
    console.error('⚠️  Warning: Test cleanup failed:', error);
    // Don't throw here - tests have completed successfully
  }
}