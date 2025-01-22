import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import merge from "deepmerge";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { initBackgroundFetch, stopBackgroundFetch } from "@/utils/wishlist";
import { useDarkMode } from "@/hooks/useDarkMode";

// export const CombinedDarkTheme = {
//   ...merge(PaperDarkTheme, NavigationDarkTheme),
//   colors: {
//     ...merge(PaperDarkTheme.colors, NavigationDarkTheme.colors),
//     primary: "#fa4454",
//     accent: "#fa4454",
//   },
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const darkMode = useDarkMode.getState().darkModeEnabled;
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const notificationEnabled = useWishlistStore.getState().notificationEnabled;

    if (notificationEnabled) {
      initBackgroundFetch();
    } else {
      stopBackgroundFetch();
    }

    // SecureStore.getItemAsync("access_token").then((results) => {
    //   const decoded = jwtDecode(results as string);
    //   if ((decoded.exp as number) < Math.floor(Date.now() / 1000)) {
    //     router.replace("/(login)");
    //   } else {
    //     router.replace("/(authenticated)/(store)");
    //   }
    // });
    AsyncStorage.getItem("region").then((region) => {
      if (region) {
        router.replace("/(login)/login_webview");
      } else {
        router.replace("/(login)");
      }
    });
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(authenticated)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(login)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
