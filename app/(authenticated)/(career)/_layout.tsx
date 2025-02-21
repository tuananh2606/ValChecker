import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function CareerLayout() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        animation: "ios_from_right",
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="match-history" options={{ headerShown: false }} />
      <Stack.Screen
        name="career-summary"
        options={{
          headerTitle: t("match.career_summary"),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
