import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Paths } from 'expo-file-system';
import { StorageService, StorageKeys } from './storage';

export interface BackupData {
  habits: any;
  profile: any;
  timestamp: string;
  version: string;
  appName: string;
}

export interface BackupInfo {
  lastBackupTime: string | null;
  lastRestoreTime: string | null;
}

// Helper to read/write files using fetch API (works without FileSystem)
const FileHelper = {
  async writeFile(uri: string, content: string): Promise<void> {
    const response = await fetch(uri, {
      method: 'PUT',
      body: content,
    });
    if (!response.ok) {
      throw new Error('Failed to write file');
    }
  },

  async readFile(uri: string): Promise<string> {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Failed to read file');
    }
    return response.text();
  },
};

export const BackupService = {
  async exportBackup(): Promise<{ success: boolean; error?: string }> {
    try {
      const habits = await StorageService.getObject(StorageKeys.HABITS);
      const profile = await StorageService.getObject(StorageKeys.USER_PROFILE);

      const backupData: BackupData = {
        habits: habits || [],
        profile: profile || {},
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        appName: 'HabitTracker',
      };

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `habit-tracker-backup-${dateStr}.json`;

      // Use Paths.document from new API
      const fileUri = `${Paths.document}/${fileName}`;
      const content = JSON.stringify(backupData, null, 2);

      // Write using fetch
      await FileHelper.writeFile(fileUri, content);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Sharing is not available on this device',
        };
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Save Your Habit Tracker Backup',
        UTI: 'public.json',
      });

      await StorageService.setString(
        'last_backup_time',
        new Date().toISOString()
      );

      return { success: true };
    } catch (error: any) {
      console.error('Export backup error:', error);
      return {
        success: false,
        error: error.message || 'Failed to export backup',
      };
    }
  },

  async importBackup(): Promise<{
    success: boolean;
    error?: string;
    cancelled?: boolean;
  }> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return { success: false, cancelled: true };
      }

      const fileUri = result.assets[0].uri;

      // Read using fetch
      const content = await FileHelper.readFile(fileUri);

      let backupData: BackupData;
      try {
        backupData = JSON.parse(content);
      } catch {
        return {
          success: false,
          error: 'Invalid file format. Please select a valid backup file.',
        };
      }

      if (backupData.appName !== 'HabitTracker') {
        return {
          success: false,
          error: 'This file is not a Habit Tracker backup.',
        };
      }

      if (!backupData.version) {
        return {
          success: false,
          error: 'Backup file is corrupted or incompatible.',
        };
      }

      if (backupData.habits) {
        await StorageService.setObject(StorageKeys.HABITS, backupData.habits);
      }

      if (backupData.profile) {
        await StorageService.setObject(
          StorageKeys.USER_PROFILE,
          backupData.profile
        );
      }

      await StorageService.setString(
        'last_restore_time',
        new Date().toISOString()
      );

      return { success: true };
    } catch (error: any) {
      console.error('Import backup error:', error);
      return {
        success: false,
        error: error.message || 'Failed to import backup',
      };
    }
  },

  async getBackupInfo(): Promise<BackupInfo> {
    const lastBackupTime = await StorageService.getString('last_backup_time');
    const lastRestoreTime = await StorageService.getString('last_restore_time');
    return {
      lastBackupTime: lastBackupTime || null,
      lastRestoreTime: lastRestoreTime || null,
    };
  },

  formatBackupDate(isoString: string | null): string {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};