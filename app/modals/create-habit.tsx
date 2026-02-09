import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

export default function CreateHabitModal() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.tertiary }]}>
      <View style={styles.content}>
        <Text style={[{ color: theme.colors.text.primary, ...theme.textStyles.h3 }]}>
          ✨ Create New Habit
        </Text>
        <Text style={[{ color: theme.colors.text.secondary, ...theme.textStyles.body, marginTop: theme.spacing.md }]}>
          Form to create atomic habits will go here.
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