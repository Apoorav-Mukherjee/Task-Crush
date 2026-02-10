import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h3]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.text.secondary }, theme.textStyles.body]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});