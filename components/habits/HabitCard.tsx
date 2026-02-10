import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Habit } from '@features/habits/types';
import { HabitColors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPress?: () => void;
  onStar?: () => void;
}

export function HabitCard({ habit, isCompleted, onToggleComplete, onPress, onStar }: HabitCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);

  const habitColor = HabitColors.find(c => c.id === habit.color)?.color || theme.colors.accent.purple;

  useEffect(() => {
    checkScale.value = withSpring(isCompleted ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isCompleted]);

  const handleToggleComplete = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    onToggleComplete();
  };

  const handleStar = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onStar?.();
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: isCompleted ? 0.7 : 1,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <Animated.View style={cardAnimatedStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.layout.borderRadius.md,
            padding: theme.spacing.base,
            borderLeftWidth: 4,
            borderLeftColor: habitColor,
            ...theme.shadows.sm,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Left: Completion Button */}
          <TouchableOpacity
            onPress={handleToggleComplete}
            style={[
              styles.checkButton,
              {
                borderColor: habitColor,
                borderWidth: 2,
                borderRadius: theme.layout.borderRadius.sm,
                backgroundColor: isCompleted ? habitColor : 'transparent',
              },
            ]}
            activeOpacity={0.7}
          >
            <Animated.View style={checkAnimatedStyle}>
              {isCompleted && (
                <Ionicons name="checkmark" size={20} color={theme.colors.text.inverse} />
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Middle: Habit Info */}
          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.name,
                  { color: theme.colors.text.primary },
                  theme.textStyles.h4,
                  isCompleted && styles.completedText,
                ]}
                numberOfLines={1}
              >
                {habit.name}
              </Text>
              {habit.isStarred && (
                <Ionicons name="star" size={16} color={theme.colors.streak.gold} style={styles.starIcon} />
              )}
            </View>

            <View style={styles.triggerRow}>
              <Text style={[styles.trigger, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
                <Text style={{ color: theme.colors.text.tertiary }}>After I </Text>
                {habit.trigger}
              </Text>
            </View>

            <View style={styles.actionRow}>
              <Text style={[styles.action, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
                <Text style={{ color: habitColor, fontWeight: '600' }}>I will </Text>
                {habit.action}
              </Text>
            </View>

            {/* Frequency Pills */}
            <View style={styles.frequencyRow}>
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
                  <Text style={[styles.dayText, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: Star Button */}
          <TouchableOpacity
            onPress={handleStar}
            style={styles.starButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={habit.isStarred ? 'star' : 'star-outline'}
              size={24}
              color={habit.isStarred ? theme.colors.streak.gold : theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  starIcon: {
    marginLeft: 6,
  },
  triggerRow: {
    marginBottom: 2,
  },
  trigger: {
    fontStyle: 'italic',
  },
  actionRow: {
    marginBottom: 8,
  },
  action: {},
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 10,
  },
  starButton: {
    padding: 4,
    marginLeft: 8,
  },
});