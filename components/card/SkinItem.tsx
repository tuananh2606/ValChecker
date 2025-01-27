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
          <Card.Content style={styles.container}>
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
              <Text style={{ color: colors.text, marginLeft: 4 }}>
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
    height: 75,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "70%",
  },
});
