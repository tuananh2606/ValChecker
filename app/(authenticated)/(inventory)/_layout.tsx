import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
export default function StoreLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cards" options={{ headerTitle: t("card") }} />
      <Stack.Screen name="sprays" options={{ headerTitle: t("spray") }} />
      <Stack.Screen name="(skins)" options={{ headerShown: false }} />
      <Stack.Screen name="buddies" options={{ headerTitle: t("buddies") }} />
    </Stack>
  );
}
