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
