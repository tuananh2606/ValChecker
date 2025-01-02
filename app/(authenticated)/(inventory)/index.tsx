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
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import { getDeviceWidth, VSprayEquipSlot } from "@/utils/misc";
import Svg, { Path } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { router } from "expo-router";

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
            height: 300,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => router.push("/sprays")}>
            <ImageBackground
              source={require("@/assets/images/top.png")}
              resizeMode="contain"
              style={[
                styles.sprayContainer,
                {
                  top: 18,
                  width: 200,
                  height: 100,
                },
              ]}
            >
              <Image
                style={styles.sprayImage}
                resizeMode="contain"
                source={{
                  uri: playerLoadout?.sprays[0].fullTransparentIcon,
                }}
              />
            </ImageBackground>
          </TouchableWithoutFeedback>
          <ImageBackground
            source={require("@/assets/images/left.png")}
            resizeMode="contain"
            style={[
              styles.sprayContainer,
              {
                left: 81,
                width: 100,
                height: 200,
              },
            ]}
          >
            <Image
              style={styles.sprayImage}
              resizeMode="contain"
              source={{
                uri: playerLoadout?.sprays[3].fullTransparentIcon,
              }}
            />
          </ImageBackground>
          <ImageBackground
            source={require("@/assets/images/right.png")}
            resizeMode="contain"
            style={[
              styles.sprayContainer,
              {
                right: 81,
                width: 100,
                height: 200,
              },
            ]}
          >
            <Image
              style={styles.sprayImage}
              resizeMode="contain"
              source={{
                uri: playerLoadout?.sprays[1].fullTransparentIcon,
              }}
            />
          </ImageBackground>
          <ImageBackground
            source={require("@/assets/images/bottom.png")}
            resizeMode="contain"
            style={[
              styles.sprayContainer,
              {
                bottom: 18,
                width: 200,
                height: 100,
              },
            ]}
          >
            <Image
              style={styles.sprayImage}
              resizeMode="contain"
              source={{
                uri: playerLoadout?.sprays[2].fullTransparentIcon,
              }}
            />
          </ImageBackground>
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
          onPress={() => console.log("Pressed")}
        >
          Weapon Inventory
        </Button>
        <Button
          style={{ marginTop: 10, width: 170 }}
          mode="contained"
          onPress={() => console.log("Pressed")}
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
    width: getDeviceWidth(),
    height: 130,
  },
  sprayContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  sprayImage: {
    width: 70,
    height: 70,
  },
});
