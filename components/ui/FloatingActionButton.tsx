import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FloatingActionButton({ onPress, icon = 'add' }: FloatingActionButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={handlePress}
      style={[styles.container, animatedStyle]}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[theme.colors.accent.purple, theme.colors.accent.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, theme.shadows.lg]}
      >
        <Ionicons name={icon} size={28} color={theme.colors.text.primary} />
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    zIndex: 1000,
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});