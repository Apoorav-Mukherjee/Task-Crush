import { HabitColorId } from '@constants/Colors';

/**
 * Habit Types - Following Atomic Habits methodology
 */

export interface Habit {
  id: string;
  name: string;
  trigger: string;           // "After I..." - The cue
  action: string;            // "I will..." - The action
  color: HabitColorId;
  frequency: DayOfWeek[];    // Which days this habit is active
  createdAt: Date;
  isStarred: boolean;
  completionHistory: CompletionRecord[];
  reminderTime?: string;     // Optional reminder time (HH:MM format)
  notes?: string;
}

export interface CompletionRecord {
  date: string;              // ISO date string (YYYY-MM-DD)
  completed: boolean;
  completedAt?: Date;
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface CreateHabitInput {
  name: string;
  trigger: string;
  action: string;
  color: HabitColorId;
  frequency: DayOfWeek[];
  reminderTime?: string;
  notes?: string;
}

export interface UpdateHabitInput {
  id: string;
  name?: string;
  trigger?: string;
  action?: string;
  color?: HabitColorId;
  frequency?: DayOfWeek[];
  isStarred?: boolean;
  reminderTime?: string;
  notes?: string;
}