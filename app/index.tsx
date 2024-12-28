import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        backgroundColor: "#000000",
        flex: 1,
      }}
    >
      <Redirect href="/(login)" />
    </View>
  );
}
