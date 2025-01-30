import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack } from "expo-router";
export default function SkinsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Skins",
          headerRight: () => (
            <MaterialIcons
              name="filter-list"
              size={24}
              color="white"
              style={{ marginLeft: 8 }}
            />
          ),
        }}
      />
      <Stack.Screen name="search" options={{ headerTitle: "" }} />
    </Stack>
  );
}
