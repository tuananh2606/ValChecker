import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { Dropdown } from "react-native-element-dropdown";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchSeasons, getAssets } from "@/utils/valorant-assets";
import { Divider } from "react-native-paper";
import { fetchLeaderBoard, parseSeason } from "@/utils/valorant-api";
import * as SecureStore from "expo-secure-store";
import { FlashList } from "@shopify/flash-list";
import PlayerItem from "@/components/card/PlayerItem";

interface IPlayer {
  PlayerCardID: string;
  /** Title ID */
  TitleID: string;
  IsBanned: boolean;
  IsAnonymized: boolean;
  /** Player UUID */
  puuid: string;
  gameName: string;
  tagLine: string;
  leaderboardRank: number;
  rankedRating: number;
  numberOfWins: number;
  competitiveTier: number;
  rankTier?: ValorantCompetitiveTier;
}

const LeaderboardsView = () => {
  const user = useUserStore((state) => state.user);
  const flashListRef = useRef<FlashList<IPlayerItem> | null>(null);
  const region = [
    { label: "Asia Pacific", value: "ap" },
    { label: "Europe", value: "eu" },
    { label: "Korea", value: "kr" },
    { label: "North America", value: "na" },
  ];
  const { competitiveTiers } = getAssets();
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(user.region);
  const [season, setSeason] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [isSeasonFocus, setIsSeasonFocus] = useState(false);
  const [seasons, setSeasons] = useState<{ label: string; value: string }[]>(
    []
  );
  const [leaderboard, setLeaderboard] = useState<IPlayer[]>([]);
  const [page, setPage] = useState<number>(0);
  const [
    onEndReachedCalledDuringMomentum,
    SetOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  const fetchLeaderboardData = useCallback(
    async (pageNumber: number = 0) => {
      setLoading(true);
      try {
        const accessToken = (await SecureStore.getItemAsync(
          "access_token"
        )) as string;
        const entitlementsToken = (await SecureStore.getItemAsync(
          "entitlements_token"
        )) as string;
        if (season) {
          const leaderboard = await fetchLeaderBoard(
            accessToken,
            entitlementsToken,
            value,
            "476b0893-4c2e-abd6-c5fe-708facff0772",
            pageNumber * 50
          );

          const updatedPlayers = leaderboard.Players.map((player: IPlayer) => ({
            ...player,
            rankTier: competitiveTiers.find(
              (item) => item.tier === player.competitiveTier
            ),
          }));

          if (pageNumber === 0) {
            setLeaderboard(updatedPlayers);
          } else {
            setLeaderboard((prev) => [...prev, ...updatedPlayers]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    },
    [value, season, competitiveTiers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const seasons = await fetchSeasons();
      const seasonsAvailabe = parseSeason(seasons);
      setSeasons(seasonsAvailabe.slice(3));
      setSeason(seasonsAvailabe[seasonsAvailabe.length - 1].value);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchLeaderboardData(page);
  }, [fetchLeaderboardData, page]);

  const handleLoadMore = () => {
    if (!onEndReachedCalledDuringMomentum) {
      setPage((prev) => prev + 1);
      SetOnEndReachedCalledDuringMomentum(true);
    }
  };

  const handleRegionChange = useCallback((item: { value: string }) => {
    setValue(item.value);
    setIsFocus(false);
    setPage(0);
    flashListRef.current?.scrollToIndex({ animated: true, index: 0 });
  }, []);

  const handleSeasonChange = useCallback((item: { value: string }) => {
    setSeason(item.value);
    setIsSeasonFocus(false);
    setPage(0);
    flashListRef.current?.scrollToIndex({ animated: true, index: 0 });
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 8 }}>
      <View style={{ flexDirection: "row" }}>
        <Dropdown
          style={[
            styles.dropdown,
            {
              width: "50%",
            },
          ]}
          renderRightIcon={() => null}
          selectedTextStyle={[
            styles.selectedTextStyle,
            isFocus && {
              color: "#a4161a",
            },
          ]}
          renderItem={({ label }) => (
            <Fragment>
              <View style={{ padding: 8 }}>
                <Text
                  style={{
                    textAlign: "center",
                    flex: 1,
                    fontSize: 16,
                  }}
                >
                  {label}
                </Text>
              </View>
              <Divider />
            </Fragment>
          )}
          data={region}
          labelField="label"
          valueField="value"
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleRegionChange}
        />

        <Dropdown
          style={[
            styles.dropdown,
            {
              width: "50%",
            },
          ]}
          renderRightIcon={() => null}
          selectedTextStyle={[
            styles.selectedTextStyle,
            isSeasonFocus && {
              color: "#a4161a",
            },
          ]}
          renderItem={({ label }) => (
            <Fragment>
              <View style={{ padding: 8 }}>
                <Text
                  style={{
                    textAlign: "center",
                    flex: 1,
                    fontSize: 16,
                  }}
                >
                  {label}
                </Text>
              </View>
              <Divider />
            </Fragment>
          )}
          data={seasons}
          maxHeight={400}
          labelField="label"
          valueField="value"
          value={season}
          onFocus={() => setIsSeasonFocus(true)}
          onBlur={() => setIsSeasonFocus(false)}
          onChange={handleSeasonChange}
        />
      </View>
      <View style={{ flex: 1, position: "relative" }}>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="red" />
          </View>
        )}
        <FlashList
          ref={flashListRef}
          data={leaderboard}
          renderItem={({ item }) => <PlayerItem data={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          estimatedItemSize={60}
          onMomentumScrollBegin={() => {
            SetOnEndReachedCalledDuringMomentum(false);
          }}
        />
      </View>
    </View>
  );
};
export default memo(LeaderboardsView);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
    opacity: 0.4,
    zIndex: 10,
  },
});
