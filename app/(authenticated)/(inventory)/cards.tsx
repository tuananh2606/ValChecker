import CardItem from "@/components/card/CardItem";
import TabButtons from "@/components/TabButtons";
import { getAssets } from "@/utils/valorant-assets";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Animated } from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerOwnedItems } from "@/utils/valorant-api";
import useUserStore from "@/hooks/useUserStore";
import {
  convertOwnedItemIDToItem,
  getDeviceWidth,
  VOwnedItemType,
} from "@/utils/misc";
import {
  PagerViewOnPageScrollEventData,
  usePagerView,
} from "react-native-pager-view";
import { Pressable } from "react-native-gesture-handler";
import { router } from "expo-router";

export const SwitchTabArray = [{ title: "Owned" }, { title: "All" }];

export default function CardsScreen() {
  const [ownedCards, setOwnedCards] = useState<ValorantCardAccessory[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { cards } = getAssets();
  const [cardsData, setCardsData] = useState<ValorantCardAccessory[]>([]);
  const [ownedCardsData, setOwnedCardsData] = useState<ValorantCardAccessory[]>(
    []
  );
  const [page, setPage] = useState<number>(1);
  const [ownedPage, setOwnedPage] = useState<number>(1);
  const { AnimatedPagerView, ref, ...rest } = usePagerView({ pagesAmount: 2 });
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchCards = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      const ownedCards = await fetchPlayerOwnedItems(
        accessToken,
        entitlementsToken,
        user.region,
        user.id,
        VOwnedItemType.Cards
      );

      const newCards = convertOwnedItemIDToItem(ownedCards);
      setOwnedCards(newCards as ValorantCardAccessory[]);
      setOwnedCardsData((newCards as ValorantCardAccessory[]).slice(0, 50));
    };
    fetchCards();
    setCardsData(cards.slice(0, 50));
  }, []);

  const handleLoadMore = () => {
    if (selectedTab === 0) {
      setOwnedPage((prevPage) => prevPage + 1);
      const newCards = ownedCards.slice(ownedPage * 50, ownedPage * 50 + 50);
      setOwnedCardsData((prev) => [...prev, ...newCards]);
    } else {
      setPage((prevPage) => prevPage + 1);
      const newCards = cards.slice(page * 50, page * 50 + 50);
      setCardsData((prev) => [...prev, ...newCards]);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: ValorantCardAccessory; index: number }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/details-item/[id]",
            params: { id: item.uuid, type: "card" },
          })
        }
      >
        <CardItem data={item} />
      </Pressable>
    ),
    []
  );
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
        <View style={{ width: 150 }}>
          <TabButtons
            buttons={SwitchTabArray}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
      </View>

      {/* {selectedTab === 0 ? (
        <FlatList
          key={`tab-1`}
          numColumns={5}
          horizontal={false}
          bounces={false}
          data={ownedCardsData}
          contentContainerStyle={{
            gap: 4,
          }}
          columnWrapperStyle={{
            gap: 4,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => <CardItem data={item} />}
          keyExtractor={(item) => item.uuid}
        />
      ) : (
        <FlatList
          key={`tab-2`}
          numColumns={5}
          horizontal={false}
          bounces={false}
          data={cardsData}
          contentContainerStyle={{
            gap: 4,
          }}
          columnWrapperStyle={{
            gap: 4,
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => <CardItem data={item} />}
          keyExtractor={(item) => item.uuid}
        />
      )} */}
      <AnimatedPagerView
        ref={ref}
        style={{
          flex: 1,
        }}
        initialPage={0}
        overdrag={false}
        scrollEnabled={rest.scrollEnabled}
        onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
          [
            {
              nativeEvent: {
                offset: scrollOffsetAnimatedValue,
                position: positionAnimatedValue,
              },
            },
          ],
          {
            listener: ({ nativeEvent: { offset, position } }) => {},
            useNativeDriver: true,
          }
        )}
        onPageSelected={rest.onPageSelected}
        onPageScrollStateChanged={rest.onPageScrollStateChanged}
        pageMargin={10}
        orientation="horizontal"
      >
        <View>
          <FlatList
            numColumns={5}
            horizontal={false}
            bounces={false}
            data={ownedCardsData}
            contentContainerStyle={{
              gap: 4,
            }}
            columnWrapperStyle={{
              gap: 4,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
            keyExtractor={(item) => item.uuid}
            getItemLayout={(data, index) => ({
              length: getDeviceWidth() / 5 - 4,
              offset: (getDeviceWidth() / 5 - 4) * index,
              index,
            })}
          />
        </View>
        <View>
          <FlatList
            numColumns={5}
            horizontal={false}
            bounces={false}
            data={cardsData}
            contentContainerStyle={{
              gap: 4,
            }}
            columnWrapperStyle={{
              gap: 4,
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
            keyExtractor={(item) => item.uuid}
            getItemLayout={(data, index) => ({
              length: getDeviceWidth() / 5 - 4,
              offset: (getDeviceWidth() / 5 - 4) * index,
              index,
            })}
          />
        </View>
      </AnimatedPagerView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const AllView = () => {};
