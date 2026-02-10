import { create } from 'zustand';
import { Habit, CreateHabitInput, UpdateHabitInput, CompletionRecord } from '@features/habits/types';
import { 
  generateHabitId, 
  getTodayDateString, 
  isHabitActiveToday,
  isHabitCompletedToday,
} from '@features/habits/utils';
import { StorageService, StorageKeys } from '@services/storage';

interface HabitStore {
  habits: Habit[];
  isLoading: boolean;
  
  // Actions
  loadHabits: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<void>;
  updateHabit: (input: UpdateHabitInput) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (id: string) => Promise<void>;
  toggleHabitStar: (id: string) => Promise<void>;
  
  // Getters
  getHabitById: (id: string) => Habit | undefined;
  getTodayHabits: () => Habit[];
  getStarredHabits: () => Habit[];
  getCompletedTodayCount: () => number;
  getTotalActiveToday: () => number;
}

const saveHabitsToStorage = async (habits: Habit[]) => {
  await StorageService.setObject(StorageKeys.HABITS, habits);
};

const loadHabitsFromStorage = async (): Promise<Habit[]> => {
  const habits = await StorageService.getObject<Habit[]>(StorageKeys.HABITS);
  if (!habits) return [];
  
  // Convert date strings back to Date objects
  return habits.map(habit => ({
    ...habit,
    createdAt: new Date(habit.createdAt),
    completionHistory: habit.completionHistory.map(record => ({
      ...record,
      completedAt: record.completedAt ? new Date(record.completedAt) : undefined,
    })),
  }));
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  isLoading: false,

  loadHabits: async () => {
    set({ isLoading: true });
    const habits = await loadHabitsFromStorage();
    set({ habits, isLoading: false });
  },

  createHabit: async (input: CreateHabitInput) => {
    const newHabit: Habit = {
      id: generateHabitId(),
      name: input.name,
      trigger: input.trigger,
      action: input.action,
      color: input.color,
      frequency: input.frequency,
      createdAt: new Date(),
      isStarred: false,
      completionHistory: [],
      reminderTime: input.reminderTime,
      notes: input.notes,
    };

    const updatedHabits = [...get().habits, newHabit];
    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  updateHabit: async (input: UpdateHabitInput) => {
    const updatedHabits = get().habits.map(habit => {
      if (habit.id === input.id) {
        return {
          ...habit,
          ...input,
        };
      }
      return habit;
    });

    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  deleteHabit: async (id: string) => {
    const updatedHabits = get().habits.filter(habit => habit.id !== id);
    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  toggleHabitCompletion: async (id: string) => {
    const today = getTodayDateString();
    
    const updatedHabits = get().habits.map(habit => {
      if (habit.id !== id) return habit;

      const existingRecord = habit.completionHistory.find(r => r.date === today);
      
      if (existingRecord) {
        return {
          ...habit,
          completionHistory: habit.completionHistory.map(r => 
            r.date === today 
              ? { ...r, completed: !r.completed, completedAt: !r.completed ? new Date() : undefined }
              : r
          ),
        };
      } else {
        const newRecord: CompletionRecord = {
          date: today,
          completed: true,
          completedAt: new Date(),
        };
        return {
          ...habit,
          completionHistory: [...habit.completionHistory, newRecord],
        };
      }
    });

    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  toggleHabitStar: async (id: string) => {
    const updatedHabits = get().habits.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          isStarred: !habit.isStarred,
        };
      }
      return habit;
    });

    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  getHabitById: (id: string) => {
    return get().habits.find(habit => habit.id === id);
  },

  getTodayHabits: () => {
    return get().habits.filter(isHabitActiveToday);
  },

  getStarredHabits: () => {
    return get().habits.filter(habit => habit.isStarred);
  },

  getCompletedTodayCount: () => {
    return get().habits.filter(habit => 
      isHabitActiveToday(habit) && isHabitCompletedToday(habit)
    ).length;
  },

  getTotalActiveToday: () => {
    return get().habits.filter(isHabitActiveToday).length;
  },
}));