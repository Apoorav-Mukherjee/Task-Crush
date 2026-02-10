import { create } from 'zustand';
import { StorageService, StorageKeys } from '@services/storage';

interface UserProfile {
  name: string;
  avatarEmoji: string;
  xp: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  totalHabitsCompleted: number;
  joinedDate: Date;
}

interface UserStore {
  profile: UserProfile;
  
  // Actions
  loadProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  updateStreak: (streak: number) => Promise<void>;
  incrementTotalCompletions: () => Promise<void>;
  
  // Getters
  getRequiredXP: () => number;
  getProgressToNextLevel: () => number;
}

const XP_PER_LEVEL = 1000;
const XP_PER_HABIT = 50;

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

const saveProfileToStorage = async (profile: UserProfile) => {
  await StorageService.setObject(StorageKeys.USER_PROFILE, profile);
};

const loadProfileFromStorage = async (): Promise<UserProfile> => {
  const stored = await StorageService.getObject<UserProfile>(StorageKeys.USER_PROFILE);
  
  if (stored) {
    return {
      ...stored,
      joinedDate: new Date(stored.joinedDate),
    };
  }

  // Default profile
  return {
    name: 'Habit Warrior',
    avatarEmoji: '👤',
    xp: 0,
    level: 1,
    currentStreak: 0,
    bestStreak: 0,
    totalHabitsCompleted: 0,
    joinedDate: new Date(),
  };
};

const getDefaultProfile = (): UserProfile => ({
  name: 'Habit Warrior',
  avatarEmoji: '👤',
  xp: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  totalHabitsCompleted: 0,
  joinedDate: new Date(),
});

export const useUserStore = create<UserStore>((set, get) => ({
  profile: getDefaultProfile(),

  loadProfile: async () => {
    try {
      const profile = await loadProfileFromStorage();
      set({ profile });
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ profile: getDefaultProfile() });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = {
        ...get().profile,
        ...updates,
      };
      set({ profile: updatedProfile });
      await saveProfileToStorage(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  addXP: async (amount: number) => {
    try {
      const currentProfile = get().profile;
      const newXP = currentProfile.xp + amount;
      const newLevel = calculateLevel(newXP);

      const updatedProfile = {
        ...currentProfile,
        xp: newXP,
        level: newLevel,
      };

      set({ profile: updatedProfile });
      await saveProfileToStorage(updatedProfile);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  },

  updateStreak: async (streak: number) => {
    try {
      const currentProfile = get().profile;
      const updatedProfile = {
        ...currentProfile,
        currentStreak: streak,
        bestStreak: Math.max(currentProfile.bestStreak, streak),
      };

      set({ profile: updatedProfile });
      await saveProfileToStorage(updatedProfile);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  },

  incrementTotalCompletions: async () => {
    try {
      const currentProfile = get().profile;
      const updatedProfile = {
        ...currentProfile,
        totalHabitsCompleted: currentProfile.totalHabitsCompleted + 1,
      };

      set({ profile: updatedProfile });
      await saveProfileToStorage(updatedProfile);
    } catch (error) {
      console.error('Error incrementing completions:', error);
    }
  },

  getRequiredXP: () => {
    const level = get().profile.level;
    return level * XP_PER_LEVEL;
  },

  getProgressToNextLevel: () => {
    const profile = get().profile;
    const currentLevelXP = (profile.level - 1) * XP_PER_LEVEL;
    const xpInCurrentLevel = profile.xp - currentLevelXP;
    return xpInCurrentLevel;
  },
}));

export { XP_PER_HABIT };