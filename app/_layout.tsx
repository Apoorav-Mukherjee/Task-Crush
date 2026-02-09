import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@constants/Colors';

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
    // 'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modals/create-habit"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'New Habit',
            headerStyle: {
              backgroundColor: Colors.background.tertiary,
            },
            headerTintColor: Colors.text.primary,
          }}
        />
        <Stack.Screen
          name="modals/habit-detail"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Habit Details',
            headerStyle: {
              backgroundColor: Colors.background.tertiary,
            },
            headerTintColor: Colors.text.primary,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}