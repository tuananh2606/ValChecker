import { View, Text, Image, StyleSheet } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import { getAssets } from "@/utils/valorant-assets";
const MineView = () => {
  const [playerLoadout, setPlayerLoadout] = useState<{
    card: ValorantCardAccessory;
    title: ValorantTitleAccessory;
  }>();
  const user = useUserStore((state) => state.user);
  const { cards, titles } = getAssets();

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const playerLoadout = await fetchPlayerLoadout(
        accessToken,
        entitlementsToken,
        user.region,
        user.id
      );
      const myCard = cards.find(
        (card) => card.uuid === playerLoadout.Identity.PlayerCardID
      );
      const myTitle = titles.find(
        (title) => title.uuid === playerLoadout.Identity.PlayerTitleID
      );
      setPlayerLoadout({
        card: myCard as ValorantCardAccessory,
        title: myTitle as ValorantTitleAccessory,
      });
    };
    fetchData();
  }, []);
  return (
    <View style={{ marginTop: 8, paddingHorizontal: 10 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>{`${user.name}`}</Text>
        <Text
          style={{ fontSize: 16, color: "grey" }}
        >{`#${user.tagLine}`}</Text>
      </View>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -15,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}
          >
            {user.progress.level}
          </Text>
        </View>

        <Image
          style={styles.image}
          resizeMode="contain"
          source={{
            uri: playerLoadout?.card.wideArt,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 15,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}
          >
            {playerLoadout?.title.titleText}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default MineView;
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
    width: "100%",
    height: 130,
  },
});
