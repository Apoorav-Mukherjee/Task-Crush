import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { BackupService, BackupInfo } from '@services/backup';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore, useUserStore } from '@store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { jsx } from 'react/jsx-runtime';

export default function BackupManagerModal() {
  const theme = useTheme();
  const router = useRouter();
  const { loadHabits, habits } = useHabitStore();
  const { loadProfile, profile } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('');
  const [backupInfo, setBackupInfo] = useState<BackupInfo>({
    lastBackupTime: null,
    lastRestoreTime: null,
  });

  useEffect(() => {
    loadBackupInfo();
  }, []);

  const loadBackupInfo = async () => {
    const info = await BackupService.getBackupInfo();
    setBackupInfo(info);
  };

  const handleExportBackup = async () => {
    setLoading(true);
    setOperation('Preparing backup...');

    const result = await BackupService.exportBackup();

    setLoading(false);
    setOperation('');

    if (result.success) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await loadBackupInfo();
    } else {
      Alert.alert('Export Failed', result.error || 'Could not export backup');
    }
  };

  const handleImportBackup = async () => {
    Alert.alert(
      '⚠️ Restore Backup?',
      'This will replace ALL your current habits and profile data with the backup. This cannot be undone.\n\nMake sure you select the correct backup file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose File',
          onPress: async () => {
            setLoading(true);
            setOperation('Restoring backup...');

            const result = await BackupService.importBackup();

            setLoading(false);
            setOperation('');

            if (result.cancelled) return;

            if (result.success) {
              await loadHabits();
              await loadProfile();
              await loadBackupInfo();

              if (Platform.OS === 'ios') {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }

              Alert.alert(
                '✅ Restored Successfully!',
                'Your habits and profile have been restored from the backup.',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } else {
              Alert.alert(
                'Restore Failed',
                result.error || 'Could not restore backup'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View
            style={[
              styles.loadingCard,
              { backgroundColor: theme.colors.background.tertiary },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={theme.colors.accent.purple}
            />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.text.primary },
                theme.textStyles.body,
              ]}
            >
              {operation}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text
          style={[
            styles.title,
            { color: theme.colors.text.primary },
            theme.textStyles.h2,
          ]}
        >
          Backup & Restore
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.colors.text.secondary },
            theme.textStyles.body,
          ]}
        >
          Keep your habits safe by creating regular backups
        </Text>

        {/* Stats Card */}
        <LinearGradient
          colors={[
            theme.colors.accent.purple + '30',
            theme.colors.accent.blue + '30',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.statsCard,
            { borderRadius: theme.layout.borderRadius.lg },
          ]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📝</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h3,
                ]}
              >
                {habits.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                  theme.textStyles.caption,
                ]}
              >
                Habits
              </Text>
            </View>

            <View
              style={[
                styles.statDivider,
                { backgroundColor: theme.colors.border.subtle },
              ]}
            />

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h3,
                ]}
              >
                {profile.xp}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                  theme.textStyles.caption,
                ]}
              >
                Total XP
              </Text>
            </View>

            <View
              style={[
                styles.statDivider,
                { backgroundColor: theme.colors.border.subtle },
              ]}
            />

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h3,
                ]}
              >
                {profile.currentStreak}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                  theme.textStyles.caption,
                ]}
              >
                Streak
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Last Backup Info */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
            },
          ]}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color={theme.colors.accent.purple}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.colors.text.primary },
                    theme.textStyles.label,
                  ]}
                >
                  Last Backup
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.colors.text.secondary },
                    theme.textStyles.bodySmall,
                  ]}
                >
                  {BackupService.formatBackupDate(backupInfo.lastBackupTime)}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.infoDivider,
              { backgroundColor: theme.colors.border.subtle },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons
                name="cloud-download-outline"
                size={24}
                color={theme.colors.accent.blue}
              />
              <View style={styles.infoText}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.colors.text.primary },
                    theme.textStyles.label,
                  ]}
                >
                  Last Restore
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.colors.text.secondary },
                    theme.textStyles.bodySmall,
                  ]}
                >
                  {BackupService.formatBackupDate(backupInfo.lastRestoreTime)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity
          onPress={handleExportBackup}
          disabled={loading}
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.accent.purple,
              borderRadius: theme.layout.borderRadius.lg,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonContent}>
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
            >
              <Ionicons
                name="cloud-upload"
                size={28}
                color={theme.colors.text.primary}
              />
            </View>
            <View style={styles.actionTextContainer}>
              <Text
                style={[
                  styles.actionTitle,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h4,
                ]}
              >
                Export Backup
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: 'rgba(255,255,255,0.7)' },
                  theme.textStyles.bodySmall,
                ]}
              >
                Save backup to your device or share via apps
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </View>
        </TouchableOpacity>

        {/* Import Button */}
        <TouchableOpacity
          onPress={handleImportBackup}
          disabled={loading}
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              borderWidth: 2,
              borderColor: theme.colors.accent.blue,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonContent}>
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: theme.colors.accent.blue + '30' },
              ]}
            >
              <Ionicons
                name="cloud-download"
                size={28}
                color={theme.colors.accent.blue}
              />
            </View>
            <View style={styles.actionTextContainer}>
              <Text
                style={[
                  styles.actionTitle,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h4,
                ]}
              >
                Restore Backup
              </Text>
              <Text
                style={[
                  styles.actionDescription,
                  { color: theme.colors.text.secondary },
                  theme.textStyles.bodySmall,
                ]}
              >
                Import a previously exported backup file
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </View>
        </TouchableOpacity>

        {/* How It Works */}
        <View
          style={[
            styles.howItWorksCard,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.howItWorksTitle,
              { color: theme.colors.text.primary },
              theme.textStyles.h4,
            ]}
          >
            💡 How It Works
          </Text>

          {[
            {
              icon: '1️⃣',
              text: 'Tap "Export Backup" to create a backup file',
            },
            {
              icon: '2️⃣',
              text: 'Save to your phone, Google Drive, or share via WhatsApp/Email',
            },
            {
              icon: '3️⃣',
              text: 'To restore, tap "Restore Backup" and select your backup file',
            },
            {
              icon: '✅',
              text: 'All your habits and progress will be fully restored',
            },
          ].map((item, index) => (
            <View key={index} style={styles.howItWorksStep}>
              <Text style={styles.stepIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.stepText,
                  { color: theme.colors.text.secondary },
                  theme.textStyles.bodySmall,
                ]}
              >
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Warning Note */}
        <View
          style={[
            styles.warningCard,
            {
              backgroundColor: theme.colors.warning + '20',
              borderRadius: theme.layout.borderRadius.md,
              borderLeftWidth: 4,
              borderLeftColor: theme.colors.warning,
            },
          ]}
        >
          <Ionicons
            name="warning-outline"
            size={20}
            color={theme.colors.warning}
          />
          <Text
            style={[
              styles.warningText,
              { color: theme.colors.text.secondary },
              theme.textStyles.bodySmall,
            ]}
          >
            Restoring a backup will permanently replace your current data.
            Always export a fresh backup before restoring.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
    width: 220,
  },
  loadingText: {
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {},
  statsCard: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statValue: {},
  statLabel: {},
  statDivider: {
    width: 1,
    height: 60,
  },
  infoCard: {
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {},
  infoValue: {
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  actionButton: {
    overflow: 'hidden',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    marginBottom: 4,
  },
  actionDescription: {},
  howItWorksCard: {
    padding: 20,
    gap: 12,
  },
  howItWorksTitle: {
    marginBottom: 4,
  },
  howItWorksStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    lineHeight: 20,
  },
});