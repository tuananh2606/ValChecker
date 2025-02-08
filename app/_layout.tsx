import {
  DarkTheme as NavigationDarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  PaperProvider,
  useTheme,
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import merge from "deepmerge";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { initBackgroundFetch, stopBackgroundFetch } from "@/utils/wishlist";
import * as Notifications from "expo-notifications";
import { useTranslation } from "react-i18next";

export const unstable_settings = {
  initialRouteName: "loading",
};

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDarkTheme = {
  ...merge(MD3DarkTheme, DarkTheme),
  colors: {
    ...merge(MD3DarkTheme.colors, DarkTheme.colors),
    background: "#000000",
    surface: "#151718",
    primary: "#fa4454",
    tint: "#ffffff",
  },
  fonts: { ...NavigationDarkTheme.fonts, ...MD3DarkTheme.fonts },
};

export type AppTheme = typeof CombinedDarkTheme;

export const useAppTheme = () => useTheme<AppTheme>();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { t } = useTranslation();
  const [appIsReady, setAppIsReady] = useState(false);
  const setNotificationEnabled = useWishlistStore(
    (state) => state.setNotificationEnabled
  );

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const permission = await Notifications.getPermissionsAsync();
        if (permission.status && permission.granted) {
          setNotificationEnabled(true);
        } else {
          const permission = await Notifications.requestPermissionsAsync();
          if (permission.granted) {
            setNotificationEnabled(true);
          } else {
            setNotificationEnabled(false);
          }
        }

        const notificationEnabled =
          useWishlistStore.getState().notificationEnabled;

        if (notificationEnabled) {
          initBackgroundFetch();
        } else {
          stopBackgroundFetch();
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: CombinedDarkTheme.colors.background,
      }}
      onLayout={onLayoutRootView}
    >
      <PaperProvider theme={CombinedDarkTheme}>
        <ThemeProvider value={CombinedDarkTheme}>
          <Stack>
            <Stack.Screen
              name="(authenticated)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="index" redirect />
            <Stack.Screen
              name="loading"
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: CombinedDarkTheme.colors.background,
                },
              }}
            />
            <Stack.Screen name="(login)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                headerTitle: "",
                headerStyle: {
                  backgroundColor: "black",
                },
                animation: "default",
                presentation: "modal",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
