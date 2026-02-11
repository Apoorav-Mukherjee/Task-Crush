import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  type?: 'navigation' | 'toggle' | 'info';
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  color?: string;
}

export function SettingItem({
  icon,
  label,
  value,
  type = 'navigation',
  toggleValue = false,
  onToggle,
  onPress,
  color,
}: SettingItemProps) {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.tertiary,
          borderRadius: theme.layout.borderRadius.md,
          padding: theme.spacing.base,
        },
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={24}
          color={color || theme.colors.text.secondary}
          style={styles.icon}
        />
        <Text style={[styles.label, { color: theme.colors.text.primary }, theme.textStyles.body]}>
          {label}
        </Text>
      </View>

      <View style={styles.right}>
        {type === 'info' && value && (
          <Text style={[styles.value, { color: theme.colors.text.tertiary }, theme.textStyles.bodySmall]}>
            {value}
          </Text>
        )}

        {type === 'toggle' && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{
              false: theme.colors.background.elevated,
              true: theme.colors.accent.purple,
            }}
            thumbColor={theme.colors.text.primary}
          />
        )}

        {type === 'navigation' && (
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
        )}
      </View>
    </View>
  );

  if (type === 'toggle' || type === 'info') {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  label: {},
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {},
});