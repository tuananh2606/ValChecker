import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";

export default function BattlepassLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Battle Pass",
          headerTitleAlign: "center",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
