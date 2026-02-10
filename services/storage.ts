import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage wrapper for local persistence
 */

// Storage keys
export const StorageKeys = {
  HABITS: 'habits',
  USER_PROFILE: 'user_profile',
  SETTINGS: 'settings',
} as const;

// Helper functions for typed storage
export const StorageService = {
  getString: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getString error:', error);
      return null;
    }
  },

  setString: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setString error:', error);
    }
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing stored object:', error);
      return null;
    }
  },

  setObject: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setObject error:', error);
    }
  },

  delete: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  },
};