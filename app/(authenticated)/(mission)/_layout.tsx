import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";

export default function StoreLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="battlepass"
        options={{ headerShown: false, animation: "ios_from_right" }}
      />
    </Stack>
  );
}
