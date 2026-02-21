import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useUserStore, useHabitStore } from '@store';
import { LinearGradient } from 'expo-linear-gradient';
import { SettingItem } from '@components/ui/SettingItem';
import { StatBox } from '@components/ui/StatBox';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { StorageService, StorageKeys } from '@services/storage';
import { NotificationService } from '@services/notifications';
import { useEffect } from 'react';
// import { BackupService } from '@services/backup';


export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { profile, loadProfile } = useUserStore();
  const { habits, loadHabits } = useHabitStore();

  const [backupLoading, setBackupLoading] = useState(false);


  const [showDevSection, setShowDevSection] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        // Schedule daily reminder at 9 AM
        await NotificationService.scheduleDailyReminder(9, 0);
        setNotificationsEnabled(true);
        Alert.alert('Success', 'Daily reminders enabled at 9:00 AM');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings');
      }
    } else {
      await NotificationService.cancelAllNotifications();
      setNotificationsEnabled(false);
    }
  };

  // const handleExportBackup = async () => {
  //   setBackupLoading(true);
  //   const result = await BackupService.exportBackup();
  //   setBackupLoading(false);

  //   if (!result.success) {
  //     Alert.alert('Export Failed', result.error || 'Could not export backup');
  //   }
  // };

  const handleImportBackup = () => {
    router.push('/modals/backup-manager');
  };

  const handleEditProfile = () => {
    router.push('/modals/edit-profile');
  };

  const handleResetData = async () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    await StorageService.clearAll();
    await loadHabits();
    await loadProfile();
    setShowResetDialog(false);

    Alert.alert('Success', 'All data has been reset!');
  };

  const completionRate = habits.length > 0
    ? Math.round((habits.filter(h => h.completionHistory.length > 0).length / habits.length) * 100)
    : 0;

  const handleVersionTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 7) {
      setShowDevSection(true);
      Alert.alert('Developer Mode', 'Developer features unlocked!');
      setTapCount(0);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginTop: theme.spacing.md }]}>
          <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h2]}>
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[theme.colors.accent.purple + '40', theme.colors.accent.blue + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.profileCard,
              {
                borderRadius: theme.layout.borderRadius.lg,
                padding: theme.spacing.xl,
                ...theme.shadows.md,
              },
            ]}
          >
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.colors.accent.purple,
                  borderRadius: 50,
                },
              ]}
            >
              <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
            </View>

            <Text style={[styles.profileName, { color: theme.colors.text.primary }, theme.textStyles.h2]}>
              {profile.name}
            </Text>

            <View style={styles.levelBadge}>
              <LinearGradient
                colors={[theme.colors.streak.gold, theme.colors.streak.fire]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.levelGradient,
                  {
                    borderRadius: theme.layout.borderRadius.full,
                    paddingHorizontal: theme.spacing.base,
                    paddingVertical: theme.spacing.xs,
                  },
                ]}
              >
                <Text style={[styles.levelText, { color: theme.colors.text.inverse }, theme.textStyles.label]}>
                  ⭐ Level {profile.level}
                </Text>
              </LinearGradient>
            </View>

            <Text style={[styles.xpText, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
              {profile.xp} XP • {profile.totalHabitsCompleted} habits completed
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
            📊 Your Stats
          </Text>

          <View style={styles.statsGrid}>
            <StatBox
              icon="📝"
              label="Total Habits"
              value={habits.length}
              color={theme.colors.accent.purple}
            />
            <StatBox
              icon="🔥"
              label="Current Streak"
              value={`${profile.currentStreak} days`}
              color={theme.colors.streak.fire}
            />
          </View>

          <View style={[styles.statsGrid, { marginTop: 12 }]}>
            <StatBox
              icon="🏆"
              label="Best Streak"
              value={`${profile.bestStreak} days`}
              color={theme.colors.streak.gold}
            />
            <StatBox
              icon="📈"
              label="Completion Rate"
              value={`${completionRate}%`}
              color={theme.colors.success}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
            ⚙️ Settings
          </Text>

          <SettingItem
            icon="person-circle-outline"
            label="Edit Profile"
            type="navigation"
            onPress={handleEditProfile}
          />

          <SettingItem
            icon="notifications-outline"
            label="Daily Reminders (9 AM)"
            type="toggle"
            toggleValue={notificationsEnabled}
            onToggle={handleNotificationToggle}
          />


          <SettingItem
            icon="volume-high-outline"
            label="Sound Effects"
            type="toggle"
            toggleValue={soundEnabled}
            onToggle={setSoundEnabled}
          />

          <SettingItem
            icon="phone-portrait-outline"
            label="Haptic Feedback"
            type="toggle"
            toggleValue={hapticsEnabled}
            onToggle={setHapticsEnabled}
          />
        </View>

        {/* Data Section */}
        <View style={styles.dataSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary },
              theme.textStyles.h4,
            ]}
          >
            💾 Backup & Restore
          </Text>

          <SettingItem
            icon="cloud-upload-outline"
            label="Export Backup"
            type="navigation"
            onPress={() => Alert.alert('Export Backup', 'This feature is coming soon!')}
          />

          <SettingItem
            icon="cloud-download-outline"
            label="Restore from Backup"
            type="navigation"
            onPress={() => router.push('/modals/backup-manager')}
          />

          <SettingItem
            icon="trash-outline"
            label="Reset All Data"
            type="navigation"
            onPress={() => setShowResetDialog(true)}
            color={theme.colors.error}
          />
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
            ℹ️ About
          </Text>


          <TouchableOpacity onPress={handleVersionTap}>
            <SettingItem
              icon="information-circle-outline"
              label="Version"
              type="info"
              value="1.0.0"
            />
          </TouchableOpacity>

          <SettingItem
            icon="calendar-outline"
            label="Member Since"
            type="info"
            value={new Date(profile.joinedDate).toLocaleDateString()}
          />

          <SettingItem
            icon="help-circle-outline"
            label="Help & Support"
            type="navigation"
            onPress={() => Alert.alert('Help', 'For support, please contact support@habittracker.com')}
          />
        </View>
        {showDevSection && (
          <View style={styles.devSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.error }, theme.textStyles.h4]}>
              🔧 Developer
            </Text>

            <SettingItem
              icon="bug-outline"
              label="Clear All Habits"
              type="navigation"
              onPress={() => {
                Alert.alert(
                  'Clear All Habits?',
                  'This will delete all habits but keep your profile.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: async () => {
                        await StorageService.delete(StorageKeys.HABITS);
                        await loadHabits();
                        Alert.alert('Success', 'All habits cleared!');
                      },
                    },
                  ]
                );
              }}
              color={theme.colors.warning}
            />

            <SettingItem
              icon="refresh-outline"
              label="Reset Profile Only"
              type="navigation"
              onPress={() => {
                Alert.alert(
                  'Reset Profile?',
                  'This will reset your XP, level, and streaks but keep your habits.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: async () => {
                        await StorageService.delete(StorageKeys.USER_PROFILE);
                        await loadProfile();
                        Alert.alert('Success', 'Profile reset!');
                      },
                    },
                  ]
                );
              }}
              color={theme.colors.warning}
            />

            <SettingItem
              icon="code-outline"
              label="View Storage Keys"
              type="navigation"
              onPress={() => {
                Alert.alert('Storage Keys', `HABITS: ${StorageKeys.HABITS}\nUSER_PROFILE: ${StorageKeys.USER_PROFILE}`);
              }}
              color={theme.colors.info}
            />

            <SettingItem
              icon="close-circle-outline"
              label="Hide Developer Menu"
              type="navigation"
              onPress={() => setShowDevSection(false)}
              color={theme.colors.text.tertiary}
            />

            <SettingItem
              icon="notifications-outline"
              label="Test Notification"
              type="navigation"
              onPress={async () => {
                await NotificationService.sendTestNotification();
                Alert.alert('Sent!', 'Check your notifications');
              }}
              color={theme.colors.info}
            />
          </View>
        )}
      </ScrollView>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        visible={showResetDialog}
        title="Reset All Data?"
        message="This will permanently delete all your habits, progress, and settings. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        confirmColor={theme.colors.error}
        onConfirm={handleResetData}
        onCancel={() => setShowResetDialog(false)}
      />
    </SafeAreaView>
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
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    marginBottom: 24,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  profileName: {
    marginBottom: 8,
  },
  levelBadge: {
    marginBottom: 8,
  },
  levelGradient: {},
  levelText: {},
  xpText: {},
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  settingsSection: {
    marginBottom: 32,
  },
  dataSection: {
    marginBottom: 32,
  },
  aboutSection: {
    marginBottom: 32,
  },
  devSection: {
    marginBottom: 32,
  },
});