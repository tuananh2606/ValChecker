import { FlatList, RefreshControl, View } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import TimerAction from "./TimerAction";
import SkinItem from "./card/SkinItem";

import { getShop, parseShop } from "@/utils/valorant-api";
import CurrencyFooter from "./CurrencyFooter";
import useUserStore from "@/hooks/useUserStore";

const StoreView = () => {
  const user = useUserStore((state) => state.user);
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
    <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <TimerAction remainingSecs={user.shops.remainingSecs.main} />
        }
        ListFooterComponent={<CurrencyFooter balances={user.balances} />}
        data={user.shops.main}
        renderItem={({ item }) => <SkinItem data={item} />}
      />
    </View>
  );
};
export default StoreView;
