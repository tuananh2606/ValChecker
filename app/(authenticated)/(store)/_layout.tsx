import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function StoreLayout() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
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
        name="night-market"
        options={{ headerTitle: t("night_market"), headerTitleAlign: "center" }}
      />
    </Stack>
  );
}
