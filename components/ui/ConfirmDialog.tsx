import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '@hooks/useTheme';
// import { BlurView } from 'expo-blur';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialogContainer} onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.dialog,
              {
                backgroundColor: theme.colors.background.tertiary,
                borderRadius: theme.layout.borderRadius.lg,
                ...theme.shadows.xl,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.colors.text.primary }, theme.textStyles.h3]}>
              {title}
            </Text>

            <Text style={[styles.message, { color: theme.colors.text.secondary }, theme.textStyles.body]}>
              {message}
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onCancel}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.colors.background.elevated,
                    borderRadius: theme.layout.borderRadius.md,
                  },
                ]}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text.secondary }, theme.textStyles.button]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                style={[
                  styles.button,
                  {
                    backgroundColor: confirmColor || theme.colors.accent.purple,
                    borderRadius: theme.layout.borderRadius.md,
                  },
                ]}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text.primary }, theme.textStyles.button]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    maxWidth: 400,
  },
  dialog: {
    padding: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {},
});