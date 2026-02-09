import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';

export default function HabitsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]} 
      edges={['top', 'left', 'right']}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[{ color: theme.colors.text.primary, marginTop: theme.spacing.md }, theme.textStyles.h2]}>
          All Habits
        </Text>
        
        <View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.xl,
              ...theme.shadows.md 
            }
          ]}
        >
          <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h3]}>
            📝 Habits Screen
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.md }, theme.textStyles.body]}>
            This will show all your habits with atomic habit triggers and actions.
          </Text>
        </View>

        {/* Sample Habit Cards */}
        {[1, 2, 3].map((i) => (
          <View 
            key={i}
            style={[
              styles.habitCard, 
              { 
                backgroundColor: theme.colors.background.tertiary,
                borderRadius: theme.layout.borderRadius.md,
                padding: theme.spacing.base,
                marginTop: theme.spacing.md,
                borderLeftWidth: 4,
                borderLeftColor: i === 1 ? theme.colors.accent.purple : i === 2 ? theme.colors.accent.blue : theme.colors.accent.green,
                ...theme.shadows.sm 
              }
            ]}
          >
            <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.h4]}>
              Sample Habit {i}
            </Text>
            <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.xs }, theme.textStyles.bodySmall]}>
              After I wake up, I will meditate for 5 minutes
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {},
  habitCard: {},
});