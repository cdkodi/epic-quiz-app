/**
 * Offline Storage Service for Epic Quiz App
 * Handles local storage of quiz packages for offline-first experience
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizPackage, Epic } from '../types/api';

const STORAGE_KEYS = {
  QUIZ_PACKAGES: 'quiz_packages',
  CACHED_EPICS: 'cached_epics',
  LAST_SYNC: 'last_sync',
};

class OfflineStorageService {
  /**
   * Store a quiz package for offline use
   */
  async storeQuizPackage(quizPackage: QuizPackage): Promise<boolean> {
    try {
      console.log(`💾 Storing quiz package: ${quizPackage.epicTitle}`);
      
      // Get existing packages
      const existingPackages = await this.getStoredQuizPackages();
      
      // Add or update the package
      const updatedPackages = {
        ...existingPackages,
        [quizPackage.epicId]: {
          ...quizPackage,
          cachedAt: new Date().toISOString(),
        }
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_PACKAGES, JSON.stringify(updatedPackages));
      
      console.log(`✅ Quiz package stored successfully`);
      return true;
    } catch (error) {
      console.error('Failed to store quiz package:', error);
      return false;
    }
  }

  /**
   * Retrieve a stored quiz package
   */
  async getQuizPackage(epicId: string): Promise<QuizPackage | null> {
    try {
      const packages = await this.getStoredQuizPackages();
      const packageData = packages[epicId];
      
      if (packageData) {
        console.log(`📦 Retrieved cached quiz package for ${epicId}`);
        return packageData;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to retrieve quiz package:', error);
      return null;
    }
  }

  /**
   * Get all stored quiz packages
   */
  async getStoredQuizPackages(): Promise<Record<string, QuizPackage & { cachedAt: string }>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_PACKAGES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to get stored packages:', error);
      return {};
    }
  }

  /**
   * Cache epics list
   */
  async cacheEpics(epics: Epic[]): Promise<boolean> {
    try {
      const cacheData = {
        epics,
        cachedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_EPICS, JSON.stringify(cacheData));
      console.log(`💾 Cached ${epics.length} epics`);
      return true;
    } catch (error) {
      console.error('Failed to cache epics:', error);
      return false;
    }
  }

  /**
   * Get cached epics
   */
  async getCachedEpics(): Promise<Epic[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_EPICS);
      if (data) {
        const cacheData = JSON.parse(data);
        console.log(`📦 Retrieved ${cacheData.epics.length} cached epics`);
        return cacheData.epics;
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached epics:', error);
      return null;
    }
  }

  /**
   * Check if cached data is still fresh (within 24 hours)
   */
  async isCacheValid(maxAgeHours: number = 24): Promise<boolean> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!lastSync) return false;

      const lastSyncTime = new Date(lastSync).getTime();
      const now = Date.now();
      const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds

      return (now - lastSyncTime) < maxAge;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  /**
   * Update last sync timestamp
   */
  async updateLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Failed to update last sync:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<boolean> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.QUIZ_PACKAGES),
        AsyncStorage.removeItem(STORAGE_KEYS.CACHED_EPICS),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC),
      ]);
      
      console.log('🗑️ Cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    quizPackages: number;
    epics: number;
    lastSync: string | null;
    cacheSize: string;
  }> {
    try {
      const [packages, epics, lastSync] = await Promise.all([
        this.getStoredQuizPackages(),
        this.getCachedEpics(),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      return {
        quizPackages: Object.keys(packages).length,
        epics: epics?.length || 0,
        lastSync,
        cacheSize: 'Unknown', // Could implement size calculation if needed
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        quizPackages: 0,
        epics: 0,
        lastSync: null,
        cacheSize: 'Error',
      };
    }
  }
}

// Export singleton instance
export const offlineStorageService = new OfflineStorageService();
export default offlineStorageService;