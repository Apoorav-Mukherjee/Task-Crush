import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { HabitColors, HabitColorId } from '@constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ColorPickerProps {
  selectedColor: HabitColorId;
  onSelectColor: (color: HabitColorId) => void;
}

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }, theme.textStyles.label]}>
        Color
      </Text>
      <View style={styles.colorGrid}>
        {HabitColors.map((colorOption) => {
          const isSelected = selectedColor === colorOption.id;
          
          return (
            <TouchableOpacity
              key={colorOption.id}
              onPress={() => onSelectColor(colorOption.id)}
              style={[
                styles.colorButton,
                {
                  backgroundColor: colorOption.color,
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: theme.colors.text.primary,
                },
              ]}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={20} color={theme.colors.text.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});