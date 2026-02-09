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

export default function TodayScreen() {
  const theme = useTheme();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const [greetingEmoji, setGreetingEmoji] = useState(getGreetingEmoji());
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  // Mock data - will be replaced with real data from Zustand store
  const [userStats] = useState({
    currentXP: 750,
    requiredXP: 1000,
    level: 5,
    currentStreak: 7,
    bestStreak: 12,
    habitsCompleted: 8,
    totalHabits: 12,
    weeklyCompletion: 85,
  });

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadQuote();
    setRefreshing(false);
  }, []);

  const todayStats = [
    {
      label: 'Completed',
      value: `${userStats.habitsCompleted}/${userStats.totalHabits}`,
      icon: '✅',
      color: theme.colors.success,
    },
    {
      label: 'Weekly Rate',
      value: `${userStats.weeklyCompletion}%`,
      icon: '📈',
      color: theme.colors.accent.blue,
    },
    {
      label: 'Total XP',
      value: userStats.currentXP,
      icon: '⭐',
      color: theme.colors.xp.bar,
    },
    {
      label: 'Streak',
      value: `${userStats.currentStreak} days`,
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
            currentXP={userStats.currentXP}
            requiredXP={userStats.requiredXP}
            level={userStats.level}
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
            currentStreak={userStats.currentStreak}
            bestStreak={userStats.bestStreak}
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

        {/* Coming Soon Card */}
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
          <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h4]}>
            📅 Today's Habits
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.md }, theme.textStyles.body]}>
            Your habit list and completion tracking will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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