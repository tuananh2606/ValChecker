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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useAppTheme } from "@/app/_layout";

export default function BuddiesScreen() {
  const [ownedBuddies, setOwnedBuddies] = useState<ValorantBuddyAccessory[]>(
    []
  );
  const [buddy, setBuddy] = useState<{
    source: string;
    title: string;
    activeIndex?: number;
  }>({
    activeIndex: undefined,
    source: "",
    title: "",
  });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { buddies } = getAssets();
  const [buddiesData, setBuddiesData] = useState<ValorantBuddyAccessory[]>([]);
  const [ownedBuddiesData, setOwnedBuddiesData] = useState<
    ValorantBuddyAccessory[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [ownedPage, setOwnedPage] = useState<number>(1);
  const { colors } = useAppTheme();
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchBuddies = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const ownedBuddies = await fetchPlayerOwnedItems(
        accessToken,
        entitlementsToken,
        user.region,
        user.id,
        VOwnedItemType.Buddies
      );
      const newBuddies = convertOwnedItemIDToItem(ownedBuddies);
      setOwnedBuddies(newBuddies as ValorantBuddyAccessory[]);
      setOwnedBuddiesData(
        (newBuddies as ValorantBuddyAccessory[]).slice(0, 50)
      );
    };
    fetchBuddies();
    setBuddiesData(buddies.slice(0, 50));
  }, []);

  useEffect(() => {
    setBuddy({
      activeIndex: undefined,
      title: "",
      source: "",
    });
  }, [selectedTab]);

  const handleLoadMore = () => {
    if (selectedTab === 0) {
      setOwnedPage((prevPage) => prevPage + 1);
      const newBuddies = ownedBuddies.slice(
        ownedPage * 50,
        ownedPage * 50 + 50
      );
      setOwnedBuddiesData((prev) => [...prev, ...newBuddies]);
    } else {
      setPage((prevPage) => prevPage + 1);
      const newBuddies = buddies.slice(page * 50, page * 50 + 50);
      setBuddiesData((prev) => [...prev, ...newBuddies]);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ValorantBuddyAccessory; index: number }) => (
      <TouchableWithoutFeedback
        onPress={() =>
          setBuddy({
            activeIndex: index,
            title: item.displayName,
            source: item.levels[0].displayIcon,
          })
        }
      >
        <CardItem data={item} isActive={buddy.activeIndex === index} />
      </TouchableWithoutFeedback>
    ),
    [buddy]
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
            color: colors.text,
            marginBottom: 8,
          }}
        >
          {buddy.title}
        </Text>
        <Image
          style={{
            width: "100%",
            height: 100,
          }}
          contentFit="contain"
          placeholder={require("@/assets/images/image-placeholder.png")}
          source={{
            uri: buddy.source,
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
          data={ownedBuddiesData}
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
          data={buddiesData}
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
