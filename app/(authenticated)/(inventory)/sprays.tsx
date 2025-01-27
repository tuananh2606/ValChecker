import CardItem from "@/components/card/CardItem";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerOwnedItems } from "@/utils/valorant-api";
import {
  convertOwnedItemIDToItem,
  getDeviceWidth,
  VOwnedItemType,
} from "@/utils/misc";
import TabButtons from "@/components/TabButtons";
import { SwitchTabArray } from "./cards";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function SpraysScreen() {
  const { source, title } = useLocalSearchParams();
  const [ownedSprays, setOwnedSprays] = useState<ValorantSprayAccessory[]>([]);
  const [spray, setSpray] = useState<{
    source: string;
    title: string;
    activeIndex: number;
  }>({
    activeIndex: 0,
    source: "",
    title: "",
  });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { sprays } = getAssets();
  const [spraysData, setSpraysData] = useState<ValorantSprayAccessory[]>([]);
  const [ownedSpraysData, setOwnedSpraysData] = useState<
    ValorantSprayAccessory[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [ownedPage, setOwnedPage] = useState<number>(1);

  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchSprays = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const ownedSprays = await fetchPlayerOwnedItems(
        accessToken,
        entitlementsToken,
        user.region,
        user.id,
        VOwnedItemType.Sprays
      );

      const newSprays = convertOwnedItemIDToItem(ownedSprays);
      setOwnedSprays(newSprays as ValorantSprayAccessory[]);
      setOwnedSpraysData((newSprays as ValorantSprayAccessory[]).slice(0, 50));
    };
    fetchSprays();
    setSpraysData(sprays.slice(0, 50));
  }, []);

  const handleLoadMore = () => {
    if (selectedTab === 0) {
      setOwnedPage((prevPage) => prevPage + 1);
      const newSprays = ownedSprays.slice(ownedPage * 50, ownedPage * 50 + 50);
      setOwnedSpraysData((prev) => [...prev, ...newSprays]);
    } else {
      setPage((prevPage) => prevPage + 1);
      const newSprays = sprays.slice(page * 50, page * 50 + 50);
      setSpraysData((prev) => [...prev, ...newSprays]);
    }
  };
  const renderItem = useCallback(
    ({ item, index }: { item: ValorantSprayAccessory; index: number }) => (
      <TouchableWithoutFeedback
        onPress={() =>
          setSpray({
            activeIndex: index,
            title: item.displayName,
            source: item.fullTransparentIcon,
          })
        }
      >
        <CardItem data={item} isActive={spray.activeIndex === index} />
      </TouchableWithoutFeedback>
    ),
    [spray]
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "white",
            marginBottom: 8,
          }}
        >
          {spray.title || title}
        </Text>
        <Image
          style={{
            width: "100%",
            height: 150,
          }}
          contentFit="contain"
          placeholder={require("@/assets/images/image-placeholder.png")}
          source={{
            uri: spray.source || source,
          }}
        />
      </View>
      <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
        <View style={{ width: 150 }}>
          <TabButtons
            buttons={SwitchTabArray}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
      </View>

      {selectedTab === 0 ? (
        <FlatList
          key={`tab-1`}
          numColumns={5}
          horizontal={false}
          bounces={false}
          data={ownedSpraysData}
          contentContainerStyle={{
            gap: 4,
          }}
          columnWrapperStyle={{
            gap: 4,
          }}
          getItemLayout={(data, index) => ({
            length: getDeviceWidth() / 5 - 4,
            offset: (getDeviceWidth() / 5 - 4) * index,
            index,
          })}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid}
        />
      ) : (
        <FlatList
          key={`tab-2`}
          numColumns={5}
          horizontal={false}
          bounces={false}
          data={spraysData}
          contentContainerStyle={{
            gap: 4,
          }}
          columnWrapperStyle={{
            gap: 4,
          }}
          getItemLayout={(data, index) => ({
            length: getDeviceWidth() / 5 - 4,
            offset: (getDeviceWidth() / 5 - 4) * index,
            index,
          })}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
