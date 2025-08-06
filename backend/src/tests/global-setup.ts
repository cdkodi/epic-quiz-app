/**
 * Global Test Setup
 * 
 * Runs once before all tests to initialize the test environment
 */

import { setupTests } from './setup';

export default async function globalSetup() {
  console.log('🚀 Initializing test environment...');
  
  try {
    await setupTests();
    console.log('✅ Test environment ready');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}