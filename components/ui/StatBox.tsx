import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function StatBox({ label, value, icon, color }: StatBoxProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.layout.borderRadius.md,
          padding: theme.spacing.base,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text
        style={[
          styles.value,
          {
            color: color || theme.colors.text.primary,
            marginTop: theme.spacing.xs,
          },
          theme.textStyles.h3,
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
          },
          theme.textStyles.caption,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  icon: {
    fontSize: 32,
  },
  value: {},
  label: {
    textAlign: 'center',
  },
});