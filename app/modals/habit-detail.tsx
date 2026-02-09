import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export default function HabitDetailModal() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.tertiary }]}>
      <View style={styles.content}>
        <Text style={[{ color: theme.colors.text.primary, ...theme.textStyles.h3 }]}>
          📊 Habit Details
        </Text>
        <Text style={[{ color: theme.colors.text.secondary, ...theme.textStyles.body, marginTop: theme.spacing.md }]}>
          Habit statistics and history will go here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});