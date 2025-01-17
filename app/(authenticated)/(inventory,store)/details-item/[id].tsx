import { Colors } from "@/constants/Colors";
import { getAssets } from "@/utils/valorant-assets";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Image } from "expo-image";

const DetailsAccessoryScreen = () => {
  const navigation = useNavigation();
  const { id, type } = useLocalSearchParams();
  const { buddies, sprays, cards } = getAssets();
  const colorScheme = useColorScheme();

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
    });
  }, [navigation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme ?? "light"].background,
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
