import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="details/[id]"
        options={{
          headerTitle: "",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
