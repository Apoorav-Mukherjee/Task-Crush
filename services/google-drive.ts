import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StorageService, StorageKeys } from './storage';
import * as AuthSession from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

// You'll need to get these from Google Cloud Console
const GOOGLE_CLIENT_ID = '1033217324722-hsovoni4d5p244q36ja1cg1st7qcs4ko.apps.googleusercontent.com';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'habittracker', // MUST match app.json
});



export const GoogleDriveService = {
  // Initialize Google Sign-In
  useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: '1033217324722-hsovoni4d5p244q36ja1cg1st7qcs4ko.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      redirectUri,
    });
    
    console.log(redirectUri);

    return { request, response, promptAsync };
  },

  // Upload backup to Google Drive
  async uploadBackup(accessToken: string): Promise<boolean> {
    try {
      // Get all data
      const habits = await StorageService.getObject(StorageKeys.HABITS);
      const profile = await StorageService.getObject(StorageKeys.USER_PROFILE);

      const backupData = {
        habits,
        profile,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
      const metadata = {
        name: `habit-tracker-backup-${Date.now()}.json`,
        mimeType: 'application/json',
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      return response.ok;
    } catch (error) {
      console.error('Backup upload error:', error);
      return false;
    }
  },

  // List backups from Google Drive
  async listBackups(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name contains 'habit-tracker-backup'&orderBy=createdTime desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('List backups error:', error);
      return [];
    }
  },

  // Download and restore backup
  async restoreBackup(accessToken: string, fileId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const backupData = await response.json();

      if (backupData.habits) {
        await StorageService.setObject(StorageKeys.HABITS, backupData.habits);
      }
      if (backupData.profile) {
        await StorageService.setObject(StorageKeys.USER_PROFILE, backupData.profile);
      }

      return true;
    } catch (error) {
      console.error('Restore backup error:', error);
      return false;
    }
  },
};
