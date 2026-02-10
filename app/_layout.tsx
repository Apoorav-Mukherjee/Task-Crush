import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@constants/Colors';
import { useHabitStore, useUserStore } from '@store';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Customize navigation theme to match our dark theme
const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.accent.purple,
    background: Colors.background.primary,
    card: Colors.background.tertiary,
    text: Colors.text.primary,
    border: Colors.border.subtle,
    notification: Colors.accent.blue,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add custom fonts here if needed
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize stores
  const loadHabits = useHabitStore(state => state.loadHabits);
  const loadProfile = useUserStore(state => state.loadProfile);

  useEffect(() => {
    // Load data from storage
    const loadData = async () => {
      try {
        await Promise.all([loadHabits(), loadProfile()]);
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading app data:', error);
        setDataLoaded(true); // Continue anyway
      }
    };

    loadData();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && dataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dataLoaded]);

  if (!loaded || !dataLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={NavigationTheme}>
      <StatusBar style="light" backgroundColor={Colors.background.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background.primary,
          },
        }}
      />
    </ThemeProvider>
  );
}