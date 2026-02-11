import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput } from '@components/ui/TextInput';
import { AvatarPicker } from '@components/ui/AvatarPicker';
import { useUserStore } from '@store';
import * as Haptics from 'expo-haptics';

export default function EditProfileModal() {
  const theme = useTheme();
  const router = useRouter();
  const { profile, updateProfile } = useUserStore();

  const [name, setName] = useState(profile.name);
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji);

  const handleSave = async () => {
    if (!name.trim()) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    await updateProfile({
      name: name.trim(),
      avatarEmoji,
    });

    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h3]}>
          Edit Profile
        </Text>

        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <AvatarPicker selectedAvatar={avatarEmoji} onSelectAvatar={setAvatarEmoji} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.background.elevated,
                borderRadius: theme.layout.borderRadius.md,
              },
            ]}
          >
            <Text style={[{ color: theme.colors.text.secondary }, theme.textStyles.button]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.accent.purple,
                borderRadius: theme.layout.borderRadius.md,
              },
            ]}
          >
            <Text style={[{ color: theme.colors.text.primary }, theme.textStyles.button]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  title: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});