import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@hooks/useTheme';

export default function ProfileScreen() {
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
          Profile
        </Text>
        
        {/* Avatar Card */}
        <View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.xl,
              alignItems: 'center',
              ...theme.shadows.md 
            }
          ]}
        >
          <View 
            style={[
              styles.avatar,
              { 
                backgroundColor: theme.colors.accent.purple,
                width: 80,
                height: 80,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={[{ color: theme.colors.text.primary, marginTop: theme.spacing.md }, theme.textStyles.h3]}>
            Habit Warrior
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.xs }, theme.textStyles.bodySmall]}>
            Level 5 • 750 XP
          </Text>
        </View>

        {/* Stats Card */}
        <View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.base,
              ...theme.shadows.md 
            }
          ]}
        >
          <Text style={[{ color: theme.colors.text.primary, marginBottom: theme.spacing.md }, theme.textStyles.h4]}>
            📊 Your Stats
          </Text>
          <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.body]}>
            Total Habits: 12
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.sm }, theme.textStyles.body]}>
            Completed Today: 8/12
          </Text>
          <Text style={[{ color: theme.colors.text.secondary, marginTop: theme.spacing.sm }, theme.textStyles.body]}>
            Current Streak: 7 days 🔥
          </Text>
        </View>

        {/* Settings Card */}
        <View 
          style={[
            styles.card, 
            { 
              backgroundColor: theme.colors.background.tertiary,
              borderRadius: theme.layout.borderRadius.lg,
              padding: theme.spacing.xl,
              marginTop: theme.spacing.base,
              ...theme.shadows.md 
            }
          ]}
        >
          <Text style={[{ color: theme.colors.text.primary, marginBottom: theme.spacing.md }, theme.textStyles.h4]}>
            ⚙️ Settings
          </Text>
          <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.body]}>
            Notifications, sounds, and more coming soon!
          </Text>
        </View>
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
  avatar: {},
});