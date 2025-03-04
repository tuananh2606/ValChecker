import { getAssets } from "@/utils/valorant-assets";
import { View, StyleSheet, ScrollView, TouchableHighlight } from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerLoadout } from "@/utils/valorant-api";
import useUserStore from "@/hooks/useUserStore";
import { isEmpty } from "@/utils/misc";
import { router } from "expo-router";
import { Card, Text } from "react-native-paper";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";

interface IEquipment {
  index: number;
  title: string;
  chromaId: string;
  skin: ValorantSkin;
  buddy: ValorantBuddyAccessory;
}

export default function EquipmentScreen() {
  const { skins, buddies } = getAssets();
  const user = useUserStore((state) => state.user);

  const sortEquipment = (displayName: string, assetPath: string) => {
    if (
      displayName.toLowerCase().includes("classic") ||
      assetPath.toLocaleLowerCase().includes("basepistol")
    ) {
      return {
        title: "classic",
        index: 0,
      };
    }
    if (
      displayName.toLowerCase().includes("shorty") ||
      assetPath.toLocaleLowerCase().includes("slim")
    ) {
      return {
        title: "shorty",
        index: 1,
      };
    }
    if (
      displayName.toLowerCase().includes("frenzy") ||
      assetPath.toLocaleLowerCase().includes("autopistol")
    ) {
      return {
        title: "frenzy",
        index: 2,
      };
    }
    if (
      displayName.toLowerCase().includes("ghost") ||
      assetPath.toLocaleLowerCase().includes("luger")
    ) {
      return {
        title: "ghost",
        index: 3,
      };
    }
    if (
      displayName.toLowerCase().includes("sheriff") ||
      assetPath.toLocaleLowerCase().includes("revolver")
    ) {
      return {
        title: "sheriff",
        index: 4,
      };
    }
    if (
      displayName.toLowerCase().includes("stinger") ||
      assetPath.toLocaleLowerCase().includes("vector")
    ) {
      return {
        title: "stinger",
        index: 5,
      };
    }
    if (
      displayName.toLowerCase().includes("spectre") ||
      assetPath.toLocaleLowerCase().includes("mp5")
    ) {
      return {
        title: "spectre",
        index: 6,
      };
    }
    if (
      displayName.toLowerCase().includes("bucky") ||
      assetPath.toLocaleLowerCase().includes("pumpshotgun")
    ) {
      return {
        title: "bucky",
        index: 7,
      };
    }
    if (
      displayName.toLowerCase().includes("judge") ||
      assetPath.toLocaleLowerCase().includes("autoshotgun")
    ) {
      return {
        title: "judge",
        index: 8,
      };
    }
    if (
      displayName.toLowerCase().includes("bulldog") ||
      assetPath.toLocaleLowerCase().includes("burst")
    ) {
      return {
        title: "bulldog",
        index: 9,
      };
    }
    if (
      displayName.toLowerCase().includes("guardian") ||
      assetPath.toLocaleLowerCase().includes("dmr")
    ) {
      return {
        title: "guardian",
        index: 10,
      };
    }
    if (
      displayName.toLowerCase().includes("phantom") ||
      assetPath.toLocaleLowerCase().includes("carbine")
    ) {
      return {
        title: "phantom",
        index: 11,
      };
    }
    if (
      displayName.toLowerCase().includes("vandal") ||
      assetPath.toLocaleLowerCase().includes("ak")
    ) {
      return {
        title: "vandal",
        index: 12,
      };
    }
    if (
      displayName.toLowerCase().includes("marshal") ||
      assetPath.toLocaleLowerCase().includes("leversniper")
    ) {
      return {
        title: "marshal",
        index: 13,
      };
    }
    if (
      displayName.toLowerCase().includes("outlaw") ||
      assetPath.toLocaleLowerCase().includes("doublesniper")
    ) {
      return {
        title: "outlaw",
        index: 14,
      };
    }
    if (
      displayName.toLowerCase().includes("operator") ||
      assetPath.toLocaleLowerCase().includes("boltsniper")
    ) {
      return {
        title: "operator",
        index: 15,
      };
    }
    if (
      displayName.toLowerCase().includes("ares") ||
      assetPath.toLocaleLowerCase().includes("lmg")
    ) {
      return {
        title: "ares",
        index: 16,
      };
    }
    if (
      displayName.toLowerCase().includes("odin") ||
      assetPath.toLocaleLowerCase().includes("hmg")
    ) {
      return {
        title: "odin",
        index: 17,
      };
    }
    return {
      title: "melee",
      index: 18,
    };
  };

  const fetchEquipments = async () => {
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

    const equipment: any[] = [];

    playerLoadout.Guns.map((item) => {
      let newEquipment = {
        index: 0,
        title: "",
        chromaId: item.ChromaID,
        skin: {},
        buddy: {},
      };

      const skin = skins.find((skin) => skin.uuid === item.SkinID);
      if (skin) {
        newEquipment.skin = skin;
        newEquipment.index = sortEquipment(
          skin.displayName,
          skin.assetPath
        ).index;
        newEquipment.title = sortEquipment(
          skin.displayName,
          skin.assetPath
        ).title;
      }
      const buddy = buddies.find(
        (buddy) => buddy.levels[0].uuid === item.CharmLevelID
      );
      if (buddy) newEquipment.buddy = buddy;

      equipment.push(newEquipment);
    });
    return equipment as IEquipment[];
    //setEquipment(equipment);
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["equipment"],
    queryFn: fetchEquipments,
    staleTime: 15 * 60000,
  });

  return (
    <ScrollView style={styles.container}>
      {data &&
        data.length > 0 &&
        data
          .sort((a, b) => a.index - b.index)
          .map((skin, index) => <Item key={index} data={skin} />)}
    </ScrollView>
  );
}

const Item = ({ data }: { data: IEquipment }) => {
  let chroma: ISkinChroma | undefined;
  chroma = data.skin.chromas.find((item) => item.uuid === data.chromaId);

  return (
    <View>
      <Text
        style={{
          marginLeft: 20,
          marginBottom: 8,
          textTransform: "uppercase",
          opacity: 0.6,
          fontSize: 12,
        }}
        variant="titleSmall"
      >
        {data.title}
      </Text>
      <TouchableHighlight
        onPress={() => {
          data.skin.contentTier
            ? router.push({
                pathname: "/details/[id]",
                params: { id: data.skin.uuid },
              })
            : null;
        }}
      >
        <Card
          style={{
            marginBottom: 10,
          }}
        >
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {!isEmpty(data.buddy) && (
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                contentFit="contain"
                source={{
                  uri: data.buddy.levels[0].displayIcon,
                }}
              />
            )}

            <Image
              style={{
                marginLeft: 8,
                flex: 1,
                height: 80,
              }}
              contentFit="contain"
              source={{
                uri: chroma?.fullRender,
              }}
            />
          </Card.Content>
        </Card>
      </TouchableHighlight>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
