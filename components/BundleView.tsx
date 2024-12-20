import { ScrollView, View } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { getShop, parseShop } from "@/utils/valorant-api";
import BundleItem from "./card/BundleItem";
import SkinItem from "./card/SkinItem";
import React from "react";
import TimerAction from "./TimerAction";
import useUserStore from "@/hooks/useUserStore";

const BundleView = () => {
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      let accessToken = await SecureStore.getItemAsync("access_token");
      let entitlementsToken = await SecureStore.getItemAsync(
        "entitlements_token"
      );
      if (accessToken && entitlementsToken) {
        const shop = await getShop(
          accessToken,
          entitlementsToken,
          user.region,
          user.id
        );
        const shops = await parseShop(shop);
        setUser({
          ...user,
          shops: shops,
        });
      }
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView style={{ marginTop: 8 }}>
      {user.shops.bundles.map((bundle, idx) => {
        return (
          <View key={idx} style={{ marginBottom: 8 }}>
            <TimerAction
              remainingSecs={user.shops.remainingSecs.bundles[idx]}
            />
            <BundleItem key={bundle.uuid} data={bundle} />
            {bundle.items.length > 0 &&
              bundle.items.map((item, idx) => (
                <SkinItem key={idx} data={item} />
              ))}
          </View>
        );
      })}
    </ScrollView>
  );
};
export default BundleView;
