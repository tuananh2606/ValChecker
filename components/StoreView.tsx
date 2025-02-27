import { FlatList, RefreshControl, View } from "react-native";
import { useCallback, useState } from "react";
import * as SecureStore from "expo-secure-store";
import TimerAction from "./TimerAction";
import SkinItem from "./card/SkinItem";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getShop, parseShop } from "@/utils/valorant-api";
import CurrencyFooter from "./CurrencyFooter";
import useUserStore from "@/hooks/useUserStore";
import { useAppTheme } from "@/app/_layout";

const StoreView = () => {
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
    <View style={{ marginTop: 8, paddingHorizontal: 16 }}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TimerAction remainingSecs={user.shops.remainingSecs.main} />
            <MaterialIcons
              name="refresh"
              size={28}
              color={colors.primary}
              onPress={onRefresh}
            />
          </View>
        }
        ListFooterComponent={<CurrencyFooter balances={user.balances} />}
        data={user.shops.main}
        renderItem={({ item }) => <SkinItem data={item} />}
      />
    </View>
  );
};
export default StoreView;
