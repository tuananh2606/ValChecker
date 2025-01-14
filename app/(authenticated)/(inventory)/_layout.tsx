import { Stack } from "expo-router";
import { Button } from "@react-navigation/elements";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
      <Stack.Screen
        name="skins"
        options={{
          headerTitle: "Skins",
        }}
      />
      <Stack.Screen name="buddies" options={{ headerTitle: "Buddies" }} />
    </Stack>
  );
}
