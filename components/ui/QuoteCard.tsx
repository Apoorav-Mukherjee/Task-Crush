import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface QuoteCardProps {
  quote: string;
  author: string;
  loading?: boolean;
}

export function QuoteCard({ quote, author, loading }: QuoteCardProps) {
  const theme = useTheme();

  if (loading) {
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
        <ActivityIndicator color={theme.colors.accent.purple} />
      </View>
    );
  }

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.tertiary,
          borderRadius: theme.layout.borderRadius.lg,
          padding: theme.spacing.xl,
          ...theme.shadows.md,
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.accent.purple,
        }
      ]}
    >
      <Text style={styles.quoteIcon}>💭</Text>
      <Text style={[styles.quote, { color: theme.colors.text.primary }, theme.textStyles.body]}>
        "{quote}"
      </Text>
      <Text style={[styles.author, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
        — {author}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  quoteIcon: {
    fontSize: 24,
    marginBottom: 12,
  },
  quote: {
    fontStyle: 'italic',
    marginBottom: 12,
  },
  author: {
    textAlign: 'right',
  },
});