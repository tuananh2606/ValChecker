import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";

interface Props {
  data: BundleShopItem;
}

const BundleItem = ({ data }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.priceContainer}>
        <Image
          style={{
            width: 16,
            height: 16,
          }}
          contentFit="contain"
          source={require("@/assets/images/valorantPoints.png")}
        />
        <Text
          style={{
            fontSize: 16,
            color: "white",
            marginLeft: 4,
          }}
        >
          {data.price}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 5,
          opacity: 0.5,
          backgroundColor: "#000000a0",
        }}
      ></View>
      <Image
        style={styles.image}
        placeholder={require("@/assets/images/image-placeholder.png")}
        contentFit="fill"
        source={{
          uri: data.displayIcon,
        }}
      />

      <Text style={styles.name}>{data.displayName}</Text>
    </View>
  );
};
export default BundleItem;

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 4,
  },
  priceContainer: {
    zIndex: 10,
    position: "absolute",
    right: 20,
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
