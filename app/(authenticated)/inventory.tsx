import * as SecureStore from "expo-secure-store";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import { getDeviceWidth } from "@/utils/misc";

interface ISprayAccessory extends ValorantSprayAccessory {
  equipSlot: string;
}

export default function InventoryScreen() {
  const [playerLoadout, setPlayerLoadout] = useState<{
    card: ValorantCardAccessory;
    sprays: ISprayAccessory[];
  }>();
  const user = useUserStore((state) => state.user);
  const { cards, sprays } = getAssets();

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
      console.log(playerLoadout);
      if (playerLoadout) {
        const myCard = cards.find(
          (card) => card.uuid === playerLoadout.Identity.PlayerCardID
        );
        let sprayArr = [];
        for (let i = 0; i < playerLoadout.Sprays.length; i++) {
          const spray = sprays.find(
            (spray) => spray.uuid === playerLoadout.Sprays[i].SprayID
          );
          sprayArr[i] = {
            ...spray,
            equipSlot: playerLoadout.Sprays[i].EquipSlotID,
          };
        }
        setPlayerLoadout({
          card: myCard as ValorantCardAccessory,
          sprays: sprayArr as ISprayAccessory[],
        });
      }
    };
    fetchData();
  }, []);
  console.log(playerLoadout);

  return (
    <View
      style={{
        paddingHorizontal: 10,
        marginTop: StatusBar.currentHeight,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            color: "white",
            marginBottom: 10,
          }}
        >
          Card
        </Text>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{
            uri: playerLoadout?.card.wideArt,
          }}
        />
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            color: "white",
            marginVertical: 10,
          }}
        >
          Spray
        </Text>
        <View
          style={{
            backgroundColor: "purple",
            width: 200,
            height: 200,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "red",
              position: "absolute",
              top: 0,
              transform: [{ translateX: "50%" }],

              zIndex: 10,
            }}
          ></View>
          {/* <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "orange",
              position: "absolute",
              transform: [{ translateY: "50%" }],
              left: 0,
              zIndex: 10,
            }}
          ></View>
          <View
            style={{
              width: 100,
              height: 100,
              position: "absolute",
              transform: [{ translateY: "50%" }],
              right: 0,
              zIndex: 10,
              backgroundColor: "blue",
            }}
          ></View>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "green",
              bottom: 0,
              transform: [{ translateX: "-50%" }],
              zIndex: 10,
            }}
          ></View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: 130,
  },
});
