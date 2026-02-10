import { Habit, CompletionRecord, DayOfWeek } from './types';

/**
 * Habit utility functions
 */

export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const isHabitActiveToday = (habit: Habit): boolean => {
  const today = new Date();
  const dayNames: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[today.getDay()];
  
  return habit.frequency.includes(todayName);
};

export const isHabitCompletedToday = (habit: Habit): boolean => {
  const today = getTodayDateString();
  const todayRecord = habit.completionHistory.find(record => record.date === today);
  return todayRecord?.completed ?? false;
};

export const getCompletionRate = (habit: Habit, days: number = 7): number => {
  const today = new Date();
  const records = habit.completionHistory.filter(record => {
    const recordDate = new Date(record.date);
    const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < days;
  });

  if (records.length === 0) return 0;
  
  const completed = records.filter(r => r.completed).length;
  return Math.round((completed / records.length) * 100);
};

export const getCurrentStreak = (habit: Habit): number => {
  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dateString = checkDate.toISOString().split('T')[0];
    const record = habit.completionHistory.find(r => r.date === dateString);
    
    if (record?.completed) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getBestStreak = (habit: Habit): number => {
  if (habit.completionHistory.length === 0) return 0;

  // Sort by date
  const sorted = [...habit.completionHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let maxStreak = 0;
  let currentStreak = 0;

  for (const record of sorted) {
    if (record.completed) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

export const getTotalCompletions = (habit: Habit): number => {
  return habit.completionHistory.filter(r => r.completed).length;
};

export const generateHabitId = (): string => {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};