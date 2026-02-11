import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface StreakChartProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakChart({ currentStreak, bestStreak }: StreakChartProps) {
  const theme = useTheme();

  const currentPercentage = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 100;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        🔥 Streak Progress
      </Text>

      <View style={styles.streakRow}>
        <View style={styles.streakItem}>
          <Text style={[styles.streakValue, { color: theme.colors.streak.fire }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.colors.text.secondary }]}>
            Current
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.streakItem}>
          <Text style={[styles.streakValue, { color: theme.colors.streak.gold }]}>
            {bestStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.colors.text.secondary }]}>
            Best
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBackground,
            {
              backgroundColor: theme.colors.background.elevated,
              borderRadius: 8,
            },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(currentPercentage, 100)}%`,
                backgroundColor: theme.colors.streak.fire,
                borderRadius: 8,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.text.tertiary }]}>
          {Math.round(currentPercentage)}% of your best
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  streakItem: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#3A3A3F',
    marginHorizontal: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 8,
    width: '100%',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});