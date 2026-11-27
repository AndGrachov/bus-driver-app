/**
 * Root layout: creates the store, then keeps the splash screen up until the
 * brand fonts are loaded and saved state is restored, so the first frame the
 * driver sees already has their theme and data. Routes are split by the
 * session: signed-out drivers only reach sign-in, signed-in ones only the app.
 */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { selectIsSignedIn } from '@/features/auth';
import { selectThemeMode } from '@/features/settings';
import { makeStore, useAppSelector, useStoreHydration } from '@/store';
import { ThemeProvider, useTheme } from '@/shared/theme/ThemeProvider';
import { ColorSchemes } from '@/shared/theme/tokens';
import { fontAssets } from '@/shared/theme/typography';

SplashScreen.preventAutoHideAsync();

const store = makeStore();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}

function AppShell() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const hydrated = useStoreHydration();
  const themeMode = useAppSelector(selectThemeMode);
  const ready = (fontsLoaded || fontError !== null) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider mode={themeMode}>
      <RootStack />
    </ThemeProvider>
  );
}

function RootStack() {
  const { scheme, colors } = useTheme();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  return (
    <>
      <StatusBar style={scheme === ColorSchemes.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
