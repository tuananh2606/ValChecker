import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="login_webview" options={{ title: "" }} />
    </Stack>
  );
}
