import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "./_layout";

export default function Modal() {
  const { colors } = useAppTheme();
  const { source } = useLocalSearchParams();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
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
