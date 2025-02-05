import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";

export default function CareerLayout() {
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
      <Stack.Screen name="match-history" options={{ headerShown: false }} />
    </Stack>
  );
}
