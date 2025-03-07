import CardItem from "@/components/card/CardItem";
import { getAssets } from "@/utils/valorant-assets";
import React from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
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
import { router } from "expo-router";
import Pagination from "@/components/Pagination";
import { FlashList } from "@shopify/flash-list";
import i18n from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";

export const SwitchTabArray = [
  { title: i18n.t("owned"), id: "owned" },
  { title: i18n.t("all"), id: "all" },
];

export default function CardsScreen() {
  const { cards } = getAssets();
  const { AnimatedPagerView, ref, setPage, activePage, ...rest } = usePagerView(
    {
      pagesAmount: 2,
    }
  );
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const user = useUserStore((state) => state.user);

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
    return newCards as ValorantCardAccessory[];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
    staleTime: 15 * 60000,
  });

  const renderItem = ({ item }: { item: ValorantCardAccessory }) => (
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
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "flex-end",
          marginBottom: 8,
        }}
      >
        <Pagination
          buttons={SwitchTabArray}
          setPage={setPage}
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
      </View>

      <AnimatedPagerView
        ref={ref}
        style={{
          flex: 1,
        }}
        initialPage={0}
        overdrag={false}
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
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <FlashList
            numColumns={5}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginTop: 4,
                }}
              ></View>
            )}
            data={data}
            renderItem={renderItem}
            estimatedItemSize={getDeviceWidth() / 5}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlashList
            numColumns={5}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginTop: 4,
                }}
              ></View>
            )}
            data={cards}
            renderItem={renderItem}
            estimatedItemSize={getDeviceWidth() / 5}
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
