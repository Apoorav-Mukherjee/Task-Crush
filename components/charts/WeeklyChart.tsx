import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

interface WeeklyChartProps {
  data: Array<{ day: string; completions: number }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const theme = useTheme();

  // Find max value for scaling
  const maxCompletions = Math.max(...data.map(d => d.completions), 1);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        📈 This Week
      </Text>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const height = (item.completions / maxCompletions) * 140;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                {item.completions > 0 && (
                  <Text style={[styles.barValue, { color: theme.colors.text.primary }]}>
                    {item.completions}
                  </Text>
                )}
                <View style={{ height: 140, justifyContent: 'flex-end' }}>
                  <LinearGradient
                    colors={[theme.colors.accent.purple, theme.colors.accent.blue]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[
                      styles.bar,
                      {
                        height: height || 4,
                        backgroundColor: theme.colors.accent.purple,
                        borderRadius: 4,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.dayLabel, { color: theme.colors.text.secondary }]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.accent.purple }]} />
          <Text style={[styles.legendText, { color: theme.colors.text.tertiary }]}>
            Habits Completed
          </Text>
        </View>
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
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingHorizontal: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  bar: {
    width: '80%',
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 8,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});