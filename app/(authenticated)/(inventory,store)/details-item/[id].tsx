import { getAssets } from "@/utils/valorant-assets";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useAppTheme } from "@/app/_layout";

const DetailsAccessoryScreen = () => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const { id, type } = useLocalSearchParams();
  const { buddies, sprays, cards } = getAssets();

  let card: ValorantCardAccessory | undefined,
    buddy: ValorantBuddyAccessory | undefined,
    spray: ValorantSprayAccessory | undefined;

  if (type === "card") {
    card = cards.find((card) => card.uuid === id);
  }
  if (type === "buddy") {
    buddy = buddies.find((buddy) => buddy.levels[0].uuid === id);
  }
  if (type === "spray") {
    spray = sprays.find((spray) => spray.uuid === id);
  }

  useEffect(() => {
    navigation.setOptions({
      title:
        type === "card"
          ? card?.displayName
          : type === "buddy"
          ? buddy?.displayName
          : spray?.displayName,
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "black",
      },
    });
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <Image
        style={{ width: "100%", height: type === "buddy" ? "20%" : "80%" }}
        contentFit="contain"
        source={{
          uri:
            type === "card"
              ? card?.largeArt
              : type === "buddy"
              ? buddy?.displayIcon
              : spray?.fullTransparentIcon,
        }}
      />
    </View>
  );
};
export default DetailsAccessoryScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
