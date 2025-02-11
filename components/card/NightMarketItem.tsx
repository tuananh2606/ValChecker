import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Card, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import Svg, { Polygon } from "react-native-svg";

interface props {
  item: NightMarketItem;
}
export default function NightMarketItem(props: React.PropsWithChildren<props>) {
  const { item } = props;
  const { colors } = useAppTheme();

  const handleBackgroundColor = (uuid: string) => {
    if (uuid === "e046854e-406c-37f4-6607-19a9ba8426fc") {
      return "rgba(245, 149, 91, 0.3)";
    }
    if (uuid === "0cebb8be-46d7-c12a-d306-e9907bfc5a25") {
      return "rgba(0, 149, 135, 0.3)";
    }
    if (uuid === "60bca009-4182-7998-dee7-b8a2558dc369") {
      return "rgba(209, 84, 141, 0.3)";
    }
    if (uuid === "12683d76-48d7-84a3-4e09-6985794f0445") {
      return "rgba(90, 159, 226, 0.3)";
    }
    if (uuid === "411e4a55-4e59-7757-41f0-86a53f101bb5") {
      return "rgba(250, 214, 99, 0.3)";
    }
  };

  return (
    <>
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id: item.uuid },
        }}
        asChild
      >
        <Card
          style={{
            position: "relative",
            marginVertical: 4,
          }}
        >
          <Card.Content
            style={[
              styles.container,
              {
                overflow: "hidden",
                backgroundColor: handleBackgroundColor(
                  item.contentTierUuid as string
                ),
              },
            ]}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                position: "absolute",
                left: -20,
                bottom: -35,
                opacity: 0.2,
              }}
              contentFit="contain"
              source={{
                uri: item.contentTier.displayIcon,
              }}
            />
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
              }}
            >
              <Svg
                height={60}
                style={{
                  opacity: 0.7,
                }}
                width={60}
                viewBox="0 0 100 100"
              >
                <Polygon points="0,0 100,0 0,100" fill="black" />
              </Svg>
              <Text
                style={{
                  position: "absolute",
                  color: colors.primary,
                  top: 5,
                  left: 5,
                  zIndex: 10,
                }}
              >
                -{item.discountPercent}%
              </Text>
            </View>

            <View style={styles.priceContainer}>
              {item.price && (
                <View>
                  <Text
                    style={{
                      alignSelf: "flex-end",
                      fontSize: 14,
                      textDecorationLine: "line-through",
                      color: colors.primary,
                    }}
                  >
                    {item.price}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: 16, height: 16 }}
                      contentFit="contain"
                      tintColor={colors.tint}
                      source={require("@/assets/images/valorantPoints.png")}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        marginLeft: 4,
                      }}
                    >
                      {item.discountedPrice}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                contentFit="contain"
                source={{
                  uri: item.levels[0].displayIcon,
                }}
              />
            </View>
            <View style={styles.name}>
              <Image
                style={{ width: 24, height: 24, marginLeft: 8 }}
                contentFit="contain"
                source={{
                  uri: item.contentTier.displayIcon,
                }}
              />
              <Text
                style={{
                  color: colors.text,
                  marginLeft: 4,
                  fontSize: 16,
                  textOverflow: "ellipsis",
                }}
              >
                {item.displayName}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Link>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 12,
    justifyContent: "center",
  },
  priceContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    bottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    height: 70,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "90%",
  },
});
