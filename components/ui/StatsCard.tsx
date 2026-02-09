import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

interface StatsCardProps {
  stats: StatItem[];
}

export function StatsCard({ stats }: StatsCardProps) {
  const theme = useTheme();

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.tertiary,
          borderRadius: theme.layout.borderRadius.lg,
          padding: theme.spacing.xl,
          ...theme.shadows.md,
        }
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
        📊 Today's Progress
      </Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statValue, { color: stat.color || theme.colors.text.primary }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }, theme.textStyles.caption]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
  },
});