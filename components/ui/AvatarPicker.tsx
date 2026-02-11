import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState } from 'react';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

const AVATAR_OPTIONS = [
  '👤', '😊', '😎', '🤓', '🥳', '🤩', '😇', '🤗',
  '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🚀', '⚡', '🔥', '✨', '🌟', '💎', '🏆', '👑',
];

export function AvatarPicker({ selectedAvatar, onSelectAvatar }: AvatarPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }, theme.textStyles.label]}>
        Choose Avatar
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarScroll}
      >
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = selectedAvatar === avatar;

          return (
            <TouchableOpacity
              key={avatar}
              onPress={() => onSelectAvatar(avatar)}
              style={[
                styles.avatarButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors.accent.purple
                    : theme.colors.background.elevated,
                  borderRadius: theme.layout.borderRadius.md,
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: theme.colors.accent.purple,
                },
              ]}
            >
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  avatarScroll: {
    gap: 12,
  },
  avatarButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
});