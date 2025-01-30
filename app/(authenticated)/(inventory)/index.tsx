import * as SecureStore from "expo-secure-store";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import { VSprayEquipSlot } from "@/utils/misc";
import { Button, Title } from "react-native-paper";
import { router } from "expo-router";
import SprayItem from "@/components/SprayItem";
import { useAppTheme } from "@/app/_layout";

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
  const { colors } = useAppTheme();

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

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <Title
        style={{ textAlign: "center", color: colors.text, fontWeight: 700 }}
      >
        Inventory
      </Title>
      <View>
        <Title
          style={{
            fontSize: 20,
          }}
        >
          Card
        </Title>
        <TouchableWithoutFeedback onPress={() => router.push("/cards")}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: playerLoadout?.card.wideArt,
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View>
        <Title
          style={{
            fontSize: 20,
          }}
        >
          Spray
        </Title>
        <View style={styles.sprayContainer}>
          <SprayItem
            styleContainer={{ top: 11, width: 160, height: 100 }}
            style={{ width: 160, height: 100 }}
            source={require("@/assets/images/top.png")}
            playerLoadout={playerLoadout?.sprays[0]}
          />
          <SprayItem
            styleContainer={{ left: 54, width: 100, height: 160 }}
            style={{ width: 100, height: 160 }}
            source={require("@/assets/images/left.png")}
            playerLoadout={playerLoadout?.sprays[3]}
          />
          <SprayItem
            styleContainer={{ right: 54, width: 100, height: 160 }}
            style={{ width: 100, height: 160 }}
            source={require("@/assets/images/right.png")}
            playerLoadout={playerLoadout?.sprays[1]}
          />
          <SprayItem
            source={require("@/assets/images/bottom.png")}
            styleContainer={{ bottom: 11, width: 160, height: 100 }}
            style={{ width: 160, height: 100 }}
            playerLoadout={playerLoadout?.sprays[2]}
          />
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{ marginTop: 10, width: 170 }}
          mode="contained"
          buttonColor="#ff4654"
          dark
          onPress={() => router.push("/(authenticated)/(inventory)/(skins)")}
        >
          Weapon Inventory
        </Button>
        <Button
          style={{ marginTop: 10, width: 170 }}
          mode="contained"
          buttonColor="#ff4654"
          dark
          onPress={() => router.push("/buddies")}
        >
          Weapon Buddies
        </Button>
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
    height: 110,
  },
  sprayContainer: {
    position: "relative",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
});
