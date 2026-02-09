import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (currentStreak > 0) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [currentStreak]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Animated.View style={animatedStyle}>
          <Text style={styles.fireEmoji}>🔥</Text>
        </Animated.View>
        
        <View style={styles.streakInfo}>
          <Text style={[styles.streakNumber, { color: theme.colors.streak.fire }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
            Day Streak
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

      <View style={styles.bestStreak}>
        <Text style={[styles.bestLabel, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
          Best Streak
        </Text>
        <Text style={[styles.bestNumber, { color: theme.colors.streak.gold }, theme.textStyles.h4]}>
          {bestStreak} days
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: '700',
  },
  streakLabel: {},
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  bestStreak: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bestLabel: {},
  bestNumber: {},
});