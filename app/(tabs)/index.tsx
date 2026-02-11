import { View, Text, StyleSheet, ScrollView, Platform, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useCallback } from 'react';
import { getGreeting, getGreetingEmoji, getFormattedDate } from '@utils/date';
import { fetchDailyQuote, Quote } from '@services/quotes-api';
import { XPBar } from '@components/gamification/XPBar';
import { StreakCounter } from '@components/gamification/StreakCounter';
import { QuoteCard } from '@components/ui/QuoteCard';
import { StatsCard } from '@components/ui/StatsCard';
import { useHabitStore, useUserStore, XP_PER_HABIT } from '@store';
import { useFocusEffect } from 'expo-router';
import { HabitCard } from '@components/habits/HabitCard';
import { isHabitCompletedToday } from '@features/habits/utils';


export default function TodayScreen() {
  const theme = useTheme();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [greetingEmoji, setGreetingEmoji] = useState(getGreetingEmoji());
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  const { getTodayHabits, toggleHabitCompletion, toggleHabitStar } = useHabitStore();
  const { addXP, incrementTotalCompletions } = useUserStore();

  const todayHabits = getTodayHabits();

  const handleToggleComplete = async (habitId: string) => {
    const habit = todayHabits.find(h => h.id === habitId);
    if (!habit) return;

    const wasCompleted = isHabitCompletedToday(habit);

    await toggleHabitCompletion(habitId);

    if (!wasCompleted) {
      await addXP(XP_PER_HABIT);
      await incrementTotalCompletions();
    }
  };

  const handleToggleStar = async (habitId: string) => {
    await toggleHabitStar(habitId);
  };

  // Store data
  const { profile, getProgressToNextLevel, getRequiredXP } = useUserStore();
  const { getCompletedTodayCount, getTotalActiveToday } = useHabitStore();

  const completedToday = getCompletedTodayCount();
  const totalToday = getTotalActiveToday();
  const progressXP = getProgressToNextLevel();
  const requiredXP = getRequiredXP();

  const loadQuote = async () => {
    try {
      setQuoteLoading(true);
      const dailyQuote = await fetchDailyQuote();
      setQuote(dailyQuote);
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setGreetingEmoji(getGreetingEmoji());
      setCurrentDate(getFormattedDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Data will auto-update from store
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadQuote();
    setRefreshing(false);
  }, []);

  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const todayStats = [
    {
      label: 'Completed',
      value: `${completedToday}/${totalToday}`,
      icon: '✅',
      color: theme.colors.success,
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: '📈',
      color: theme.colors.accent.blue,
    },
    {
      label: 'Total XP',
      value: profile.xp,
      icon: '⭐',
      color: theme.colors.xp.bar,
    },
    {
      label: 'Streak',
      value: `${profile.currentStreak} days`,
      icon: '🔥',
      color: theme.colors.streak.fire,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      edges={['top', 'left', 'right']}
    >
      <LinearGradient
        colors={[theme.colors.accent.purple + '20', 'transparent']}
        style={styles.gradient}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent.purple}
          />
        }
      >
        {/* Header with Greeting */}
        <View style={[styles.header, { marginTop: theme.spacing.md }]}>
          <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h2]}>
            {greeting}! {greetingEmoji}
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: 4 }, theme.textStyles.body]}>
            {currentDate}
          </Text>
        </View>

        {/* XP Progress Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              ...theme.shadows.md,
            }
          ]}
        >
          <XPBar
            currentXP={progressXP}
            requiredXP={XP_PER_LEVEL}
            level={profile.level}
          />
        </View>

        {/* Streak Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.base,
              ...theme.shadows.md,
            }
          ]}
        >
          <StreakCounter
            currentStreak={profile.currentStreak}
            bestStreak={profile.bestStreak}
          />
        </View>

        {/* Quote Card */}
        <View style={{ marginTop: theme.spacing.base }}>
          {quote ? (
            <QuoteCard
              quote={quote.content}
              author={quote.author}
              loading={quoteLoading}
            />
          ) : (
            <QuoteCard
              quote=""
              author=""
              loading={true}
            />
          )}
        </View>

        {/* Stats Card */}
        <View style={{ marginTop: theme.spacing.base }}>
          <StatsCard stats={todayStats} />
        </View>


        {/* TODAY'S HABITS - Add this section */}
        <View 
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.base,
              ...theme.shadows.md,
            }
          ]}
        >
          <Text style={[{ color: theme.colors.text.primary, marginBottom: theme.spacing.md }, theme.textStyles.h4]}>
            📅 Today's Habits
          </Text>
          
          {todayHabits.length === 0 ? (
            <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.body]}>
              No habits scheduled for today. You can add habits from the Habits tab!
            </Text>
          ) : (
            <View>
              {todayHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isHabitCompletedToday(habit)}
                  onToggleComplete={() => handleToggleComplete(habit.id)}
                  onStar={() => handleToggleStar(habit.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const XP_PER_LEVEL = 1000; // Match the value from userStore

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
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
  card: {},
});