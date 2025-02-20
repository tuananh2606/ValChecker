import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchMatchHistory, parseMatchHistory } from "@/utils/valorant-api";
import * as SecureStore from "expo-secure-store";
import { getDeviceWidth } from "@/utils/misc";
import useUserStore from "@/hooks/useUserStore";
import Loading from "@/components/Loading";
import { useAppTheme } from "@/app/_layout";
import { FlashList } from "@shopify/flash-list";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MatchHistoryItem from "@/components/card/MatchHistoryItem";
import { useCacheStore } from "@/hooks/useCacheStore";

const MatchHistory = () => {
  const { colors } = useAppTheme();
  const [matchHistory, setMatchHistory] = useState<MatchDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);
  const { setData, getData, clearData } = useCacheStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
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
    setData("match-history", {
      data: matchHistoyDetails,
      timestamp: new Date().getTime(),
    });
    setMatchHistory(matchHistoyDetails);
    setLoading(false);
  }, []);

  useEffect(() => {
    const cachedData = getData("match-history");
    const now = new Date().getTime();
    if (cachedData) {
      const { data, timestamp } = cachedData;
      if (now - timestamp < 15 * 60 * 1000) {
        setMatchHistory(data);
      } else {
        clearData("match-history");
        fetchData();
      }
    } else {
      fetchData();
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: MatchDetails; index: number }) => (
      <TouchableWithoutFeedback onPress={() => {}}>
        <MatchHistoryItem data={item} />
      </TouchableWithoutFeedback>
    ),
    []
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.flex}>
      <FlashList
        data={matchHistory}
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
