import CardItem from "@/components/card/CardItem";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { fetchPlayerOwnedItems } from "@/utils/valorant-api";
import {
  convertOwnedItemIDToItem,
  getDeviceWidth,
  VOwnedItemType,
} from "@/utils/misc";
import { SwitchTabArray } from "./cards";
import { Image } from "expo-image";
import { useAppTheme } from "@/app/_layout";
import Pagination from "@/components/Pagination";
import {
  PagerViewOnPageScrollEventData,
  usePagerView,
} from "react-native-pager-view";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

export default function BuddiesScreen() {
  const [buddy, setBuddy] = useState<{
    source: string;
    title: string;
  }>({
    source: "",
    title: "",
  });

  const { buddies } = getAssets();
  const { colors } = useAppTheme();
  const user = useUserStore((state) => state.user);
  const { AnimatedPagerView, ref, setPage, activePage, ...rest } = usePagerView(
    {
      pagesAmount: 2,
    }
  );
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
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
    return newBuddies as ValorantBuddyAccessory[];
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["buddies"],
    queryFn: fetchBuddies,
    staleTime: 60000,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: ValorantBuddyAccessory; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          setBuddy({
            title: item.displayName,
            source: item.levels[0].displayIcon,
          })
        }
      >
        <CardItem data={item} />
      </TouchableOpacity>
    ),
    []
  );

  const firstBuddy = data?.[0];

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
          {buddy.title || firstBuddy?.displayName}
        </Text>
        <Image
          style={{
            width: "100%",
            height: 100,
          }}
          contentFit="contain"
          placeholder={require("@/assets/images/image-placeholder.png")}
          source={{
            uri: buddy.source || firstBuddy?.displayIcon,
          }}
        />
      </View>
      <View
        style={{
          alignItems: "flex-end",
          marginVertical: 8,
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
            data={buddies}
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
