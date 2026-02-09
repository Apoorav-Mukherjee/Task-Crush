/**
 * Dark Theme Color System
 * Based on modern habit tracker design with muted neon accents
 */

export const Colors = {
  // Base Background Colors
  background: {
    primary: '#0B0B0E',      // Main background (near black)
    secondary: '#111114',    // Slightly lighter background
    tertiary: '#1A1A1F',     // Card background
    elevated: '#222227',     // Elevated elements
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',      // Main text
    secondary: '#A0A0A8',    // Secondary text
    tertiary: '#6B6B73',     // Disabled/placeholder text
    inverse: '#0B0B0E',      // Text on light backgrounds
  },

  // Accent Colors (Muted Neon for Habits)
  accent: {
    blue: '#5B8DEF',         // Cool blue
    purple: '#8B7EF5',       // Soft purple
    green: '#5FD4A0',        // Mint green
    orange: '#F5A962',       // Warm orange
    pink: '#F572A0',         // Soft pink
    cyan: '#5FD4D4',         // Turquoise
    yellow: '#F5D962',       // Muted yellow
    red: '#F57272',          // Soft red
  },

  // UI State Colors
  success: '#5FD4A0',        // Completed habits
  warning: '#F5D962',        // Warnings
  error: '#F57272',          // Errors
  info: '#5B8DEF',           // Info messages

  // Gamification Colors
  xp: {
    bar: '#8B7EF5',          // XP progress bar
    glow: '#A89FF7',         // XP glow effect
    background: '#2A2A3F',   // XP bar background
  },

  streak: {
    fire: '#F5A962',         // Streak fire color
    gold: '#F5D962',         // Gold for high streaks
  },

  // Border & Divider Colors
  border: {
    subtle: '#2A2A2F',       // Subtle borders
    default: '#3A3A3F',      // Default borders
    strong: '#4A4A4F',       // Strong borders
  },

  // Overlay & Modal Colors
  overlay: 'rgba(11, 11, 14, 0.85)',
  modal: '#1A1A1F',

  // Transparent variations
  transparent: 'transparent',
  
  // Glass morphism effect
  glass: 'rgba(255, 255, 255, 0.05)',
} as const;

// Habit color palette (for user selection)
export const HabitColors = [
  { id: 'blue', color: Colors.accent.blue, name: 'Ocean' },
  { id: 'purple', color: Colors.accent.purple, name: 'Lavender' },
  { id: 'green', color: Colors.accent.green, name: 'Mint' },
  { id: 'orange', color: Colors.accent.orange, name: 'Sunset' },
  { id: 'pink', color: Colors.accent.pink, name: 'Rose' },
  { id: 'cyan', color: Colors.accent.cyan, name: 'Sky' },
  { id: 'yellow', color: Colors.accent.yellow, name: 'Gold' },
  { id: 'red', color: Colors.accent.red, name: 'Ruby' },
] as const;

export type HabitColorId = typeof HabitColors[number]['id'];