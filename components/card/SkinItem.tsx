import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Card } from "react-native-paper";
import { Image } from "expo-image";
import { Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { useAppTheme } from "@/app/_layout";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  data: SkinShopItem | ValorantSkin;
}

const SkinItem = ({ data }: Props) => {
  const { t } = useTranslation();
  const { skinIds, toggleSkin } = useWishlistStore();
  const { colors } = useAppTheme();

  const handlePress = () => {
    toggleSkin(data.levels[0].uuid);
    if (!skinIds.includes(data.levels[0].uuid)) {
      ToastAndroid.show(
        t("wishlist.add.success", {
          displayname: data.displayName,
        }),
        ToastAndroid.SHORT
      );
    }
  };

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
    <View>
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id: data.uuid },
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
                  data.contentTierUuid as string
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
                uri: data.contentTier.displayIcon,
              }}
            />

            <View style={styles.priceContainer}>
              {(data as SkinShopItem).price && (
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
                    style={{ fontSize: 16, color: colors.text, marginLeft: 4 }}
                  >
                    {(data as SkinShopItem).price}
                  </Text>
                </View>
              )}
              <Image
                style={{ width: 24, height: 24, marginLeft: 8 }}
                contentFit="contain"
                source={{
                  uri: data.contentTier.displayIcon,
                }}
              />
            </View>

            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                contentFit="contain"
                source={{
                  uri: data.levels[0].displayIcon,
                }}
              />
            </View>
            <View style={styles.name}>
              <Text
                style={{
                  color: colors.text,
                  marginLeft: 4,
                  fontSize: 16,
                  textOverflow: "ellipsis",
                }}
              >
                {data.displayName}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Link>
      <TouchableOpacity
        onPress={handlePress}
        style={{
          right: 10,
          bottom: 10,
          position: "absolute",
        }}
      >
        {skinIds.includes(data.levels[0].uuid) ? (
          <MaterialCommunityIcons name="heart" size={24} color="red" />
        ) : (
          <MaterialCommunityIcons
            name="heart-outline"
            size={24}
            color={colors.tint}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SkinItem;

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
    position: "absolute",
    left: 10,
    bottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    height: 80,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "90%",
  },
});
