import { Colors } from '@constants/Colors';
import { Typography, TextStyles } from '@constants/Typography';
import { Spacing, Layout } from '@constants/Spacing';
import { Shadows } from '@constants/Shadows';

/**
 * Main Dark Theme Object
 * Central source of truth for all theme values
 */
export const DarkTheme = {
  colors: Colors,
  typography: Typography,
  textStyles: TextStyles,
  spacing: Spacing,
  layout: Layout,
  shadows: Shadows,

  // Animation timings
  animation: {
    fast: 150,
    normal: 250,
    slow: 400,
  },

  // Opacity values
  opacity: {
    disabled: 0.5,
    subtle: 0.7,
    medium: 0.85,
    full: 1,
  },
} as const;

export type Theme = typeof DarkTheme;