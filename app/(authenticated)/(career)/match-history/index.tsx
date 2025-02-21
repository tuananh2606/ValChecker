import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { fetchMatchHistory, parseMatchHistory } from "@/utils/valorant-api";
import * as SecureStore from "expo-secure-store";
import { getDeviceWidth } from "@/utils/misc";
import useUserStore from "@/hooks/useUserStore";
import Loading from "@/components/Loading";
import { FlashList } from "@shopify/flash-list";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MatchHistoryItem from "@/components/card/MatchHistoryItem";
import { useQuery } from "@tanstack/react-query";

const MatchHistory = () => {
  const user = useUserStore((state) => state.user);

  const fetchData = useCallback(async () => {
    let accessToken = (await SecureStore.getItemAsync(
      "access_token"
    )) as string;
    let entitlementsToken = (await SecureStore.getItemAsync(
      "entitlements_token"
    )) as string;

    const matchHistory = await fetchMatchHistory(
      accessToken,
      entitlementsToken,
      user.region,
      user.id,
      0,
      15
    );

    const matchHistoyDetails = await parseMatchHistory(
      accessToken,
      entitlementsToken,
      user.region,
      user.id,
      matchHistory.History
    );
    return matchHistoyDetails as MatchDetails[];
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["match-history"],
    queryFn: fetchData,
    staleTime: 60000,
  });

  const renderItem = useCallback(
    ({ item, index }: { item: MatchDetails; index: number }) => (
      <TouchableWithoutFeedback onPress={() => {}}>
        <MatchHistoryItem data={item} />
      </TouchableWithoutFeedback>
    ),
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.flex}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={getDeviceWidth()}
      />
    </View>
  );
};
export default MatchHistory;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
});
