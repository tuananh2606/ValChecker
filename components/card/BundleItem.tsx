import { Colors } from "@/constants/Colors";
import { StyleSheet, Image, View, Text, useColorScheme } from "react-native";

interface Props {
  data: BundleShopItem;
}

const BundleItem = ({ data }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <Image
          style={{ width: 16, height: 16 }}
          resizeMode="contain"
          source={require("@/assets/images/valorantPoints.png")}
        />
        <Text style={{ fontSize: 16, color: "white", marginLeft: 4 }}>
          {data.price}
        </Text>
      </View>
      <View>
        <Image
          style={styles.image}
          resizeMode="stretch"
          loadingIndicatorSource={require("@/assets/images/valorantPoints.png")}
          source={{
            uri: data.displayIcon,
          }}
        />
      </View>
      <Text style={styles.name}>{data.displayName}</Text>
    </View>
  );
};
export default BundleItem;

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  priceContainer: {
    zIndex: 10,
    position: "absolute",
    right: 36,
    top: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 4,
  },
  image: {
    borderRadius: 12,
    height: "100%",
  },
});
