import { DarkTheme, Theme } from '@theme/dark-theme';

/**
 * Hook to access theme values throughout the app
 * Currently returns dark theme (future: could support theme switching)
 */
export function useTheme(): Theme {
  return DarkTheme;
}

/**
 * Hook to access specific theme colors
 */
export function useThemeColor() {
  const theme = useTheme();
  return theme.colors;
}

/**
 * Hook to access typography
 */
export function useTypography() {
  const theme = useTheme();
  return theme.typography;
}