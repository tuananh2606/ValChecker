import { RefreshControl, ScrollView, View } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { getShop, parseShop } from "@/utils/valorant-api";
import BundleItem from "./card/BundleItem";
import SkinItem from "./card/SkinItem";
import React from "react";
import TimerAction from "./TimerAction";
import useUserStore from "@/hooks/useUserStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "@/app/_layout";

const BundleView = () => {
  const user = useUserStore((state) => state.user);
  const { colors } = useAppTheme();
  const { setUser } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
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
  }, []);

  return (
    <ScrollView
      style={{ marginTop: 8, paddingHorizontal: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {user.shops.bundles.map((bundle, idx) => {
        return (
          <View key={idx} style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TimerAction
                remainingSecs={user.shops.remainingSecs.bundles[idx]}
              />
              <MaterialIcons
                name="refresh"
                size={28}
                color={colors.primary}
                onPress={onRefresh}
              />
            </View>

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
