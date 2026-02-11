import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Habit } from '@features/habits/types';

interface CompletionCalendarProps {
  habit: Habit;
}

export function CompletionCalendar({ habit }: CompletionCalendarProps) {
  const theme = useTheme();

  // Get last 30 days
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const isDateCompleted = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    const record = habit.completionHistory.find(r => r.date === dateString);
    return record?.completed ?? false;
  };

  const days = getLast30Days();
  const habitColor = theme.colors.accent.purple; // You can get this from HabitColors

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
        📅 Last 30 Days
      </Text>

      <View style={styles.calendar}>
        {days.map((day, index) => {
          const isCompleted = isDateCompleted(day);
          const dayOfWeek = day.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <View
              key={index}
              style={[
                styles.dayBox,
                {
                  backgroundColor: isCompleted
                    ? habitColor
                    : theme.colors.background.elevated,
                  borderRadius: 4,
                  opacity: isWeekend ? 0.5 : 1,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              { backgroundColor: theme.colors.background.elevated },
            ]}
          />
          <Text style={[styles.legendText, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
            Missed
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendBox,
              { backgroundColor: habitColor },
            ]}
          />
          <Text style={[styles.legendText, { color: theme.colors.text.tertiary }, theme.textStyles.caption]}>
            Completed
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  dayBox: {
    width: 18,
    height: 18,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  legendText: {},
});