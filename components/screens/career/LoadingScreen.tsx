import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: "50%",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 50,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          contentFit="contain"
          source={require("@/assets/images/icon.png")}
        />
        <ActivityIndicator size="large" color="red" />
      </View>
    </View>
  );
};
export default LoadingScreen;
