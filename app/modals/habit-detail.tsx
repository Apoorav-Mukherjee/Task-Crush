import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabitStore } from '@store';
import { StatBox } from '@components/ui/StatBox';
import { CompletionCalendar } from '@components/habits/CompletionCalendar';
import { ConfirmDialog } from '@components/ui/ConfirmDialog';
import { Ionicons } from '@expo/vector-icons';
import { HabitColors } from '@constants/Colors';
import {
  getCurrentStreak,
  getBestStreak,
  getTotalCompletions,
  getCompletionRate,
} from '@features/habits/utils';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function HabitDetailModal() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { getHabitById, deleteHabit } = useHabitStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const habit = params.id ? getHabitById(params.id) : undefined;

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.errorContainer}>
          <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h3]}>
            Habit not found
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[{ color: theme.colors.accent.purple }, theme.textStyles.button]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const habitColor = HabitColors.find(c => c.id === habit.color)?.color || theme.colors.accent.purple;
  const currentStreak = getCurrentStreak(habit);
  const bestStreak = getBestStreak(habit);
  const totalCompletions = getTotalCompletions(habit);
  const completionRate = getCompletionRate(habit, 30);

  const handleDelete = async () => {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    await deleteHabit(habit.id);
    setShowDeleteDialog(false);
    router.back();
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality in next step
    Alert.alert('Coming Soon', 'Edit functionality will be added next!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              borderLeftWidth: 6,
              borderLeftColor: habitColor,
              ...theme.shadows.md,
            },
          ]}
        >
          <Text style={[styles.habitName, { color: theme.colors.text.primary }, theme.textStyles.h2]}>
            {habit.name}
          </Text>

          <View style={[styles.triggerContainer, { marginTop: theme.spacing.md }]}>
            <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.body]}>
              <Text style={{ color: theme.colors.text.tertiary }}>After I </Text>
              {habit.trigger}
            </Text>
          </View>

          <View style={[styles.actionContainer, { marginTop: theme.spacing.sm }]}>
            <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.body]}>
              <Text style={{ color: habitColor, fontWeight: '600' }}>I will </Text>
              {habit.action}
            </Text>
          </View>

          {/* Frequency */}
          <View style={[styles.frequencyContainer, { marginTop: theme.spacing.md }]}>
            <Text style={[styles.frequencyLabel, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
              Frequency:
            </Text>
            <View style={styles.frequencyPills}>
              {habit.frequency.map((day) => (
                <View
                  key={day}
                  style={[
                    styles.dayPill,
                    {
                      backgroundColor: theme.colors.background.elevated,
                      borderRadius: theme.layout.borderRadius.sm,
                    },
                  ]}
                >
                  <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.caption]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Notes */}
          {habit.notes && (
            <View style={[styles.notesContainer, { marginTop: theme.spacing.md }]}>
              <Text style={[styles.notesLabel, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
                Notes:
              </Text>
              <Text style={[styles.notes, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
                {habit.notes}
              </Text>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
            📊 Statistics
          </Text>

          <View style={styles.statsGrid}>
            <StatBox
              icon="🔥"
              label="Current Streak"
              value={`${currentStreak} days`}
              color={theme.colors.streak.fire}
            />
            <StatBox
              icon="🏆"
              label="Best Streak"
              value={`${bestStreak} days`}
              color={theme.colors.streak.gold}
            />
          </View>

          <View style={[styles.statsGrid, { marginTop: 12 }]}>
            <StatBox
              icon="✅"
              label="Total Completed"
              value={totalCompletions}
              color={theme.colors.success}
            />
            <StatBox
              icon="📈"
              label="30-Day Rate"
              value={`${completionRate}%`}
              color={theme.colors.accent.blue}
            />
          </View>
        </View>

        {/* Completion Calendar */}
        <View
          style={[
            styles.calendarContainer,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              ...theme.shadows.md,
            },
          ]}
        >
          <CompletionCalendar habit={habit} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.accent.blue,
                borderRadius: theme.layout.borderRadius.md,
                flex: 1,
              },
            ]}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.text.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text.primary }, theme.textStyles.button]}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDeleteDialog(true)}
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.error,
                borderRadius: theme.layout.borderRadius.md,
                flex: 1,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.text.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text.primary }, theme.textStyles.button]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Habit?"
        message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={theme.colors.error}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  headerCard: {
    marginBottom: 24,
  },
  habitName: {
    marginBottom: 4,
  },
  triggerContainer: {},
  actionContainer: {},
  frequencyContainer: {},
  frequencyLabel: {
    marginBottom: 8,
  },
  frequencyPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  notesContainer: {},
  notesLabel: {
    marginBottom: 4,
  },
  notes: {
    fontStyle: 'italic',
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  actionButtonText: {},
});