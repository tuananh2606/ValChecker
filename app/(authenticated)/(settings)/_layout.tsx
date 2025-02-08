import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";

export default function SettingsLayout() {
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
        name="faq"
        options={{
          headerTitle: "FAQ",
          headerTitleAlign: "center",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
