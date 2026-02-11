import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { DayOfWeek, ALL_DAYS } from '@features/habits/types';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onSelectDays: (days: DayOfWeek[]) => void;
}

export function DaySelector({ selectedDays, onSelectDays }: DaySelectorProps) {
  const theme = useTheme();

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onSelectDays(selectedDays.filter(d => d !== day));
    } else {
      onSelectDays([...selectedDays, day]);
    }
  };

  const selectAll = () => {
    onSelectDays([...ALL_DAYS]);
  };

  const selectWeekdays = () => {
    onSelectDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  };

  const selectWeekend = () => {
    onSelectDays(['Sat', 'Sun']);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }, theme.textStyles.label]}>
        Frequency
      </Text>

      {/* Quick Select Buttons */}
      <View style={styles.quickSelect}>
        <TouchableOpacity
          onPress={selectAll}
          style={[
            styles.quickButton,
            {
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.layout.borderRadius.sm,
            },
          ]}
        >
          <Text style={[styles.quickButtonText, { color: theme.colors.text.secondary }, theme.textStyles.caption]}>
            All Days
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={selectWeekdays}
          style={[
            styles.quickButton,
            {
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.layout.borderRadius.sm,
            },
          ]}
        >
          <Text style={[styles.quickButtonText, { color: theme.colors.text.secondary }, theme.textStyles.caption]}>
            Weekdays
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={selectWeekend}
          style={[
            styles.quickButton,
            {
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.layout.borderRadius.sm,
            },
          ]}
        >
          <Text style={[styles.quickButtonText, { color: theme.colors.text.secondary }, theme.textStyles.caption]}>
            Weekend
          </Text>
        </TouchableOpacity>
      </View>

      {/* Day Buttons */}
      <View style={styles.dayGrid}>
        {ALL_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day);
          
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected ? theme.colors.accent.purple : theme.colors.background.elevated,
                  borderRadius: theme.layout.borderRadius.md,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isSelected ? theme.colors.text.primary : theme.colors.text.tertiary,
                    fontWeight: isSelected ? '600' : '400',
                  },
                  theme.textStyles.body,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
  },
  quickSelect: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickButtonText: {},
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {},
});