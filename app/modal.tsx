import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function Modal() {
  const colorScheme = useColorScheme();
  const { source } = useLocalSearchParams();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Image
        contentFit="contain"
        style={styles.image}
        source={{ uri: source }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    height: 400,
    width: 200,
  },
});
