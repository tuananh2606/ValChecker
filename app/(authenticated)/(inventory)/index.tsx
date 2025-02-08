import * as SecureStore from "expo-secure-store";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import { Button, Title } from "react-native-paper";
import { router } from "expo-router";
import SprayItem from "@/components/SprayItem";
import { useAppTheme } from "@/app/_layout";
import { useTranslation } from "react-i18next";

interface ISprayAccessory extends ValorantSprayAccessory {
  equipSlot: string;
}

export default function InventoryScreen() {
  const { t } = useTranslation();
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
    <ScrollView
      style={{
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <Title
        style={{ textAlign: "center", color: colors.text, fontWeight: 700 }}
      >
        {t("inventory")}
      </Title>
      <View>
        <Title
          style={{
            fontSize: 20,
            marginBottom: 8,
          }}
        >
          {t("card")}
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
      <View
        style={{
          marginTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title
          style={{
            alignSelf: "flex-start",
            fontSize: 20,
          }}
        >
          {t("spray")}
        </Title>
        <View style={styles.sprayContainer}>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "black",
              borderRadius: 100,
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 10,
              transform: [{ translateX: -50 }, { translateY: -50 }],
            }}
          ></View>
          <SprayItem
            styleContainer={{ left: 0, top: 0, borderStartStartRadius: 150 }}
            styleImage={{
              transform: [{ rotate: "-45deg" }, { translateY: 10 }],
            }}
            playerLoadout={playerLoadout?.sprays[0]}
          />
          <SprayItem
            styleContainer={{ right: 0, borderEndStartRadius: 150 }}
            styleImage={{
              transform: [{ rotate: "-45deg" }, { translateX: -10 }],
            }}
            playerLoadout={playerLoadout?.sprays[1]}
          />
          <SprayItem
            styleContainer={{ bottom: 0, right: 0, borderEndEndRadius: 150 }}
            styleImage={{
              transform: [{ rotate: "-45deg" }, { translateY: -10 }],
            }}
            playerLoadout={playerLoadout?.sprays[2]}
          />
          <SprayItem
            styleContainer={{ bottom: 0, borderStartEndRadius: 150 }}
            styleImage={{
              transform: [{ rotate: "-45deg" }, { translateX: 10 }],
            }}
            playerLoadout={playerLoadout?.sprays[3]}
          />
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Button
          style={{ marginTop: 10, width: 170 }}
          mode="contained"
          buttonColor="#ff4654"
          dark
          onPress={() => router.push("/(authenticated)/(inventory)/(skins)")}
        >
          {t("weapon_inventory")}
        </Button>
        <Button
          style={{ marginTop: 10, width: 170 }}
          mode="contained"
          buttonColor="#ff4654"
          dark
          onPress={() => router.push("/buddies")}
        >
          {t("weapon_buddies")}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 110,
  },
  sprayContainer: {
    marginVertical: 16,
    position: "relative",
    height: 300,
    width: 300,
    transform: [{ rotate: "45deg" }],
  },
});
