import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { StorageService, StorageKeys } from './storage';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = '1033217324722-0ivvqgj8jiicmv3r9sd7cjqsctsslve3.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface BackupFile {
  id: string;
  name: string;
  createdTime: string;
  size: string;
}

export const GoogleDriveService = {
  // Create auth request
  createAuthRequest() {
    const redirectUri = AuthSession.makeRedirectUri({
      
    });

    console.log('Redirect URI:', redirectUri); // For debugging

    return AuthSession.useAuthRequest(
      {
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
        redirectUri,
      },
      discovery
    );
  },

  // Upload backup to Google Drive
  async uploadBackup(accessToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get all data
      const habits = await StorageService.getObject(StorageKeys.HABITS);
      const profile = await StorageService.getObject(StorageKeys.USER_PROFILE);

      const backupData = {
        habits,
        profile,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        appName: 'Habit Tracker',
      };

      const fileName = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileContent = JSON.stringify(backupData, null, 2);

      // Step 1: Create file metadata
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: ['appDataFolder'], // Store in app-specific folder
      };

      // Step 2: Upload file
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContent +
        closeDelimiter;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload backup' };
      }

      return { success: true };
    } catch (error) {
      console.error('Backup upload error:', error);
      return { success: false, error: String(error) };
    }
  },

  // List backups from Google Drive
  async listBackups(accessToken: string): Promise<BackupFile[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?` +
        `q=name contains 'habit-tracker-backup' and trashed=false&` +
        `orderBy=createdTime desc&` +
        `fields=files(id,name,createdTime,size)&` +
        `spaces=appDataFolder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error('List error:', await response.text());
        return [];
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('List backups error:', error);
      return [];
    }
  },

  // Download and restore backup
  async restoreBackup(accessToken: string, fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return { success: false, error: 'Failed to download backup' };
      }

      const backupData = await response.json();

      // Validate backup data
      if (!backupData.version || backupData.appName !== 'Habit Tracker') {
        return { success: false, error: 'Invalid backup file' };
      }

      // Restore data
      if (backupData.habits) {
        await StorageService.setObject(StorageKeys.HABITS, backupData.habits);
      }
      if (backupData.profile) {
        await StorageService.setObject(StorageKeys.USER_PROFILE, backupData.profile);
      }

      return { success: true };
    } catch (error) {
      console.error('Restore backup error:', error);
      return { success: false, error: String(error) };
    }
  },

  // Delete a backup
  async deleteBackup(accessToken: string, fileId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Delete backup error:', error);
      return false;
    }
  },
};