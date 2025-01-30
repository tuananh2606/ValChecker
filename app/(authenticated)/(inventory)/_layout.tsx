import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
export default function StoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cards" options={{ headerTitle: "Cards" }} />
      <Stack.Screen name="sprays" options={{ headerTitle: "Sprays" }} />
      <Stack.Screen name="(skins)" options={{ headerShown: false }} />
      <Stack.Screen name="buddies" options={{ headerTitle: "Buddies" }} />
    </Stack>
  );
}
