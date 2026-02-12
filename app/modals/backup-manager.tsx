import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { GoogleDriveService, BackupFile } from '@services/google-drive';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore, useUserStore } from '@store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function BackupManagerModal() {
  const theme = useTheme();
  const router = useRouter();
  const { loadHabits } = useHabitStore();
  const { loadProfile } = useUserStore();

  const [request, response, promptAsync] = GoogleDriveService.createAuthRequest();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setAccessToken(authentication.accessToken);
        loadBackups(authentication.accessToken);
      }
    }
  }, [response]);

  const loadBackups = async (token: string) => {
    setRefreshing(true);
    const files = await GoogleDriveService.listBackups(token);
    setBackups(files);
    setRefreshing(false);
  };

  const handleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in to Google Drive');
    }
  };

  const handleCreateBackup = async () => {
    if (!accessToken) return;

    setLoading(true);
    const result = await GoogleDriveService.uploadBackup(accessToken);
    setLoading(false);

    if (result.success) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Success', 'Backup created successfully!');
      loadBackups(accessToken);
    } else {
      Alert.alert('Error', result.error || 'Failed to create backup');
    }
  };

  const handleRestoreBackup = (backup: BackupFile) => {
    Alert.alert(
      'Restore Backup?',
      `This will replace all your current data with the backup from ${new Date(backup.createdTime).toLocaleString()}. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            if (!accessToken) return;

            setLoading(true);
            const result = await GoogleDriveService.restoreBackup(accessToken, backup.id);
            setLoading(false);

            if (result.success) {
              await loadHabits();
              await loadProfile();

              if (Platform.OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }

              Alert.alert('Success', 'Backup restored successfully!', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } else {
              Alert.alert('Error', result.error || 'Failed to restore backup');
            }
          },
        },
      ]
    );
  };

  const handleDeleteBackup = (backup: BackupFile) => {
    Alert.alert(
      'Delete Backup?',
      `Delete backup from ${new Date(backup.createdTime).toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!accessToken) return;

            const success = await GoogleDriveService.deleteBackup(accessToken, backup.id);
            if (success) {
              Alert.alert('Success', 'Backup deleted');
              loadBackups(accessToken);
            } else {
              Alert.alert('Error', 'Failed to delete backup');
            }
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Google Drive Backup
        </Text>

        {!accessToken ? (
          <View style={styles.signInContainer}>
            <Ionicons name="cloud-outline" size={64} color={theme.colors.text.tertiary} />
            <Text style={[styles.signInText, { color: theme.colors.text.secondary }]}>
              Sign in to Google Drive to backup and restore your habits
            </Text>
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={!request}
              style={[
                styles.button,
                {
                  backgroundColor: theme.colors.accent.purple,
                  borderRadius: theme.layout.borderRadius.md,
                  opacity: request ? 1 : 0.5,
                },
              ]}
            >
              <Ionicons name="logo-google" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                Sign in with Google
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Create Backup Button */}
            <TouchableOpacity
              onPress={handleCreateBackup}
              disabled={loading}
              style={[
                styles.createButton,
                {
                  backgroundColor: theme.colors.accent.purple,
                  borderRadius: theme.layout.borderRadius.md,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text.primary} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={20} color={theme.colors.text.primary} />
                  <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                    Create New Backup
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Backups List */}
            <View style={styles.backupsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  Available Backups
                </Text>
                <TouchableOpacity onPress={() => accessToken && loadBackups(accessToken)}>
                  <Ionicons
                    name="refresh"
                    size={20}
                    color={theme.colors.text.secondary}
                    style={refreshing ? { opacity: 0.5 } : {}}
                  />
                </TouchableOpacity>
              </View>

              {refreshing ? (
                <ActivityIndicator color={theme.colors.accent.purple} style={{ marginTop: 20 }} />
              ) : backups.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-open-outline" size={48} color={theme.colors.text.tertiary} />
                  <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                    No backups found
                  </Text>
                </View>
              ) : (
                backups.map((backup) => (
                  <View
                    key={backup.id}
                    style={[
                      styles.backupCard,
                      {
                        backgroundColor: theme.colors.background.tertiary,
                        borderRadius: theme.layout.borderRadius.md,
                      },
                    ]}
                  >
                    <View style={styles.backupInfo}>
                      <Ionicons name="document-outline" size={24} color={theme.colors.accent.blue} />
                      <View style={styles.backupDetails}>
                        <Text style={[styles.backupName, { color: theme.colors.text.primary }]}>
                          {new Date(backup.createdTime).toLocaleDateString()}
                        </Text>
                        <Text style={[styles.backupMeta, { color: theme.colors.text.tertiary }]}>
                          {new Date(backup.createdTime).toLocaleTimeString()} • {formatFileSize(backup.size)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.backupActions}>
                      <TouchableOpacity
                        onPress={() => handleRestoreBackup(backup)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="download-outline" size={20} color={theme.colors.success} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteBackup(backup)}
                        style={styles.actionButton}
                      >
                        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  signInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  backupsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  backupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  backupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  backupDetails: {
    flex: 1,
  },
  backupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  backupMeta: {
    fontSize: 12,
  },
  backupActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
});