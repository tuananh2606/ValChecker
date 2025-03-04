import CardItem from "@/components/card/CardItem";
import useUserStore from "@/hooks/useUserStore";
import { getAssets } from "@/utils/valorant-assets";
import React, { useState } from "react";
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
import { useLocalSearchParams } from "expo-router";

import Pagination from "@/components/Pagination";
import {
  PagerViewOnPageScrollEventData,
  usePagerView,
} from "react-native-pager-view";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";

export default function SpraysScreen() {
  const { source, title } = useLocalSearchParams();
  const [spray, setSpray] = useState<{
    source: string;
    title: string;
  }>({
    source: "",
    title: "",
  });

  const { sprays } = getAssets();

  const { AnimatedPagerView, ref, setPage, activePage, ...rest } = usePagerView(
    {
      pagesAmount: 2,
    }
  );
  const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const user = useUserStore((state) => state.user);

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
    return newSprays as ValorantSprayAccessory[];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["sprays"],
    queryFn: fetchSprays,
    staleTime: 15 * 60000,
  });

  const renderItem = ({
    item,
    index,
  }: {
    item: ValorantSprayAccessory;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSpray({
            title: item.displayName,
            source: item.fullTransparentIcon,
          });
        }}
      >
        <CardItem data={item} />
      </TouchableOpacity>
    );
  };

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
            data={sprays}
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
