import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput } from '@components/ui/TextInput';
import { ColorPicker } from '@components/ui/ColorPicker';
import { DaySelector } from '@components/ui/DaySelector';
import { HabitColorId } from '@constants/Colors';
import { DayOfWeek, ALL_DAYS } from '@features/habits/types';
import { useHabitStore } from '@store';
import * as Haptics from 'expo-haptics';

export default function CreateHabitModal() {
  const theme = useTheme();
  const router = useRouter();
  const { createHabit } = useHabitStore();

  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [selectedColor, setSelectedColor] = useState<HabitColorId>('purple');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([...ALL_DAYS]);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    trigger: '',
    action: '',
    days: '',
  });

  const validate = (): boolean => {
    const newErrors = {
      name: '',
      trigger: '',
      action: '',
      days: '',
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Habit name is required';
      isValid = false;
    }

    if (!trigger.trim()) {
      newErrors.trigger = 'Trigger is required (e.g., "brush my teeth")';
      isValid = false;
    }

    if (!action.trim()) {
      newErrors.action = 'Action is required (e.g., "meditate for 5 minutes")';
      isValid = false;
    }

    if (selectedDays.length === 0) {
      newErrors.days = 'Select at least one day';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validate()) {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    try {
      await createHabit({
        name: name.trim(),
        trigger: trigger.trim(),
        action: action.trim(),
        color: selectedColor,
        frequency: selectedDays,
        notes: notes.trim() || undefined,
      });

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h3]}>
            Create New Habit
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }, theme.textStyles.body]}>
            Build better habits using the atomic habits framework
          </Text>
        </View>

        {/* Habit Name */}
        <TextInput
          label="Habit Name"
          placeholder="e.g., Morning Meditation"
          value={name}
          onChangeText={setName}
          error={errors.name}
          autoCapitalize="words"
        />

        {/* Atomic Habits Section */}
        <View style={styles.atomicSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }, theme.textStyles.h4]}>
            ⚡ Atomic Habits
          </Text>
          <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }, theme.textStyles.bodySmall]}>
            Make it obvious. Pair your new habit with an existing routine.
          </Text>

          <TextInput
            label="After I..."
            prefix="After I"
            placeholder="brush my teeth"
            value={trigger}
            onChangeText={setTrigger}
            error={errors.trigger}
            autoCapitalize="none"
          />

          <TextInput
            label="I will..."
            prefix="I will"
            placeholder="meditate for 5 minutes"
            value={action}
            onChangeText={setAction}
            error={errors.action}
            autoCapitalize="none"
          />
        </View>

        {/* Color Picker */}
        <ColorPicker
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />

        {/* Day Selector */}
        <DaySelector
          selectedDays={selectedDays}
          onSelectDays={setSelectedDays}
        />
        {errors.days && (
          <Text style={[styles.dayError, { color: theme.colors.error }, theme.textStyles.caption]}>
            {errors.days}
          </Text>
        )}

        {/* Notes (Optional) */}
        <TextInput
          label="Notes (Optional)"
          placeholder="Why is this habit important to you?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
        />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[
              styles.button,
              styles.cancelButton,
              {
                backgroundColor: theme.colors.background.elevated,
                borderRadius: theme.layout.borderRadius.md,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text.secondary }, theme.textStyles.button]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreate}
            style={[
              styles.button,
              styles.createButton,
              {
                backgroundColor: theme.colors.accent.purple,
                borderRadius: theme.layout.borderRadius.md,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text.primary }, theme.textStyles.button]}>
              Create Habit
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
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {},
  atomicSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    marginBottom: 16,
  },
  dayError: {
    marginTop: -16,
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
  cancelButton: {},
  createButton: {},
  buttonText: {},
});