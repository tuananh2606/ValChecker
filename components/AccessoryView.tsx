import { FlatList, RefreshControl, View } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import TimerAction from "./TimerAction";
import { getShop, parseShop } from "@/utils/valorant-api";
import AccessoryItem from "./card/AccessoryItem";
import CurrencyFooter from "./CurrencyFooter";
import useUserStore from "@/hooks/useUserStore";

const AccessoryView = () => {
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
    <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <TimerAction remainingSecs={user.shops.remainingSecs.accessory} />
        }
        ListFooterComponent={<CurrencyFooter balances={user.balances} />}
        data={user.shops.accessory}
        renderItem={({ item }) => <AccessoryItem data={item} />}
      />
    </View>
  );
};
export default AccessoryView;
