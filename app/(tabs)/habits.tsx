import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { useHabitStore, useUserStore, XP_PER_HABIT } from '@store';
import { HabitCard } from '@components/habits/HabitCard';
import { EmptyState } from '@components/ui/EmptyState';
import { FloatingActionButton } from '@components/ui/FloatingActionButton';
import { useRouter } from 'expo-router';
import { isHabitCompletedToday } from '@features/habits/utils';

export default function HabitsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { habits, toggleHabitCompletion, toggleHabitStar } = useHabitStore();
  const { addXP, incrementTotalCompletions } = useUserStore();

  const handleToggleComplete = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const wasCompleted = isHabitCompletedToday(habit);

    await toggleHabitCompletion(habitId);

    // FIXED: Same logic as above
    if (!wasCompleted) {
      await addXP(XP_PER_HABIT);
      await incrementTotalCompletions();
    } else {
      await addXP(-XP_PER_HABIT);
    }
  };

  const handleCreateHabit = () => {
    router.push('/modals/create-habit');
  };

  const handleHabitPress = (habitId: string) => {
    router.push(`/modals/habit-detail?id=${habitId}`);
  };

  const handleToggleStar = async (habitId: string) => {
    await toggleHabitStar(habitId);
  };

  // Separate starred and regular habits
  const starredHabits = habits.filter(h => h.isStarred);
  const regularHabits = habits.filter(h => !h.isStarred);

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
            All Habits
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: 4 }, theme.textStyles.body]}>
            {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
          </Text>
        </View>

        {/* Empty State */}
        {habits.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No Habits Yet"
            message="Start building better habits by creating your first one!"
          />
        ) : (
          <>
            {/* Starred Habits */}
            {starredHabits.length > 0 && (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
                  ⭐ Starred
                </Text>
                {starredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={isHabitCompletedToday(habit)}
                    onToggleComplete={() => handleToggleComplete(habit.id)}
                    onPress={() => handleHabitPress(habit.id)}
                    onStar={() => handleToggleStar(habit.id)}
                  />
                ))}
              </View>
            )}

            {/* Regular Habits */}
            {regularHabits.length > 0 && (
              <View>
                {starredHabits.length > 0 && (
                  <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
                    📝 All Habits
                  </Text>
                )}
                {regularHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={isHabitCompletedToday(habit)}
                    onToggleComplete={() => handleToggleComplete(habit.id)}
                    onPress={() => handleHabitPress(habit.id)}
                    onStar={() => handleToggleStar(habit.id)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCreateHabit} />
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
  sectionTitle: {
    marginBottom: 12,
  },
});