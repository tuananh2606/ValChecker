import { useAppTheme } from "@/app/_layout";
import { MatchHistoryProvider } from "@/context/MatchHistoryContext";
import { Stack } from "expo-router";

export default function MatchHistoryLayout() {
  const { colors } = useAppTheme();
  return (
    <MatchHistoryProvider>
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
            headerTitle: "Match History",
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="match-details/index"
          options={{
            headerTitle: "Match Details",
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
      </Stack>
    </MatchHistoryProvider>
  );
}
