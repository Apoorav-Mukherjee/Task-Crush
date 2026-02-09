/**
 * Spacing System
 * Based on 4px grid system for consistency
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Common spacing patterns
export const Layout = {
  screenPadding: Spacing.base,
  cardPadding: Spacing.base,
  sectionGap: Spacing.xl,
  itemGap: Spacing.md,
  
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  // Icon sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;