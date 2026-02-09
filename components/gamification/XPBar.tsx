import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
}

export function XPBar({ currentXP, requiredXP, level }: XPBarProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((currentXP / requiredXP) * 100, {
      damping: 15,
      stiffness: 100,
    });
  }, [currentXP, requiredXP]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <LinearGradient
            colors={[theme.colors.accent.purple, theme.colors.accent.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.levelGradient}
          >
            <Text style={[styles.levelText, { color: theme.colors.text.primary }]}>
              {level}
            </Text>
          </LinearGradient>
        </View>
        
        <View style={styles.xpInfo}>
          <Text style={[styles.xpLabel, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
            Level {level}
          </Text>
          <Text style={[styles.xpAmount, { color: theme.colors.text.primary }, theme.textStyles.label]}>
            {currentXP} / {requiredXP} XP
          </Text>
        </View>
      </View>

      <View 
        style={[
          styles.progressBar,
          { 
            backgroundColor: theme.colors.xp.background,
            borderRadius: theme.layout.borderRadius.full,
          }
        ]}
      >
        <Animated.View style={[animatedStyle, { height: '100%' }]}>
          <LinearGradient
            colors={[theme.colors.xp.bar, theme.colors.xp.glow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { borderRadius: theme.layout.borderRadius.full }]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  levelGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
  },
  xpInfo: {
    flex: 1,
  },
  xpLabel: {},
  xpAmount: {
    marginTop: 2,
  },
  progressBar: {
    height: 12,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});