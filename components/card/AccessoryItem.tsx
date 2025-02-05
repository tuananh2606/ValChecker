import { useAppTheme } from "@/app/_layout";
import { router } from "expo-router";
import { StyleSheet, Image, View, Text } from "react-native";
import { Card } from "react-native-paper";

interface Props {
  data: AccessoryShopItem;
}

const AccessoryItem = ({ data }: Props) => {
  const { colors } = useAppTheme();
  return (
    <Card
      onPress={() =>
        data.type !== "title" &&
        router.push({
          pathname: "/details-item/[id]",
          params: { id: data.uuid, type: data.type },
        })
      }
      style={{
        marginVertical: 4,
      }}
    >
      <Card.Content style={styles.container}>
        <View style={styles.priceContainer}>
          <Image
            style={{ width: 16, height: 16 }}
            tintColor={colors.tint}
            resizeMode="contain"
            source={require("@/assets/images/kingdomCredits.png")}
          />
          <Text style={{ fontSize: 16, color: colors.text, marginLeft: 4 }}>
            {data.price}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={
              data.displayIcon
                ? styles.image
                : {
                    flex: 1,
                    resizeMode: "contain",
                    width: "30%",
                  }
            }
            resizeMode="contain"
            tintColor={!data.displayIcon ? colors.tint : undefined}
            source={
              !data.displayIcon
                ? require("@/assets/images/Player-Title.png")
                : {
                    uri: data.displayIcon,
                  }
            }
          />
        </View>

        <Text
          style={{
            color: colors.text,
            textAlign: "center",
            marginTop: 4,
          }}
        >
          {data.displayName}
        </Text>
      </Card.Content>
    </Card>
  );
};
export default AccessoryItem;

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
  },
  priceContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {},
  imageContainer: {
    display: "flex",
    alignItems: "center",
    height: 100,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "70%",
  },
});
