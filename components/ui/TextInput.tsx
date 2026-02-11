import { View, Text, TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { useState } from 'react';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  prefix?: string;
}

export function TextInput({ label, error, prefix, ...props }: CustomTextInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text.primary }, theme.textStyles.label]}>
        {label}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.background.elevated,
            borderRadius: theme.layout.borderRadius.md,
            borderWidth: 2,
            borderColor: isFocused ? theme.colors.accent.purple : 'transparent',
          },
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: theme.colors.text.tertiary }, theme.textStyles.body]}>
            {prefix}
          </Text>
        )}
        <RNTextInput
          {...props}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              flex: 1,
            },
            theme.textStyles.body,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }, theme.textStyles.caption]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  prefix: {
    marginRight: 8,
  },
  input: {
    paddingVertical: 12,
  },
  error: {
    marginTop: 4,
  },
});