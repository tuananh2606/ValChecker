import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Redirect href="/(login)" />
    </View>
  );
}
