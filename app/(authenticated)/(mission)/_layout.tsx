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
        name="battlepass/index"
        options={{
          headerTitle: "Battle Pass",
          headerTitleAlign: "center",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
