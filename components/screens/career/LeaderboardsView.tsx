import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { Dropdown } from "react-native-element-dropdown";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { fetchCompetitiveTier, fetchSeasons } from "@/utils/valorant-assets";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(user.region);
  const [season, setSeason] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [isSeasonFocus, setIsSeasonFocus] = useState(false);
  const [seasons, setSeasons] = useState<{ label: string; value: string }[]>(
    []
  );
  const [competitiveTiers, setCompetitiveTiers] =
    useState<ValorantCompetitiveTiers>();
  const [leaderboard, setLeaderboard] = useState<IPlayer[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      let [seasons, competitiveTiers] = await Promise.all([
        fetchSeasons(),
        fetchCompetitiveTier(),
      ]);
      setCompetitiveTiers(competitiveTiers[competitiveTiers.length - 1]);

      const seasonsAvailabe = parseSeason(seasons);
      setSeasons(seasonsAvailabe.slice(3));
      setSeason(seasonsAvailabe[seasonsAvailabe.length - 1].value);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;

      let leaderboard = await fetchLeaderBoard(
        accessToken,
        entitlementsToken,
        value,
        season
      );

      for (let i = 0; i < leaderboard.Players.length; i++) {
        const competitiveTier =
          competitiveTiers?.tiers[leaderboard.Players[i].competitiveTier];
        leaderboard.Players[i] = {
          ...leaderboard.Players[i],
          rankTier: competitiveTier,
        };
      }
      setLeaderboard(leaderboard.Players);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [value, season]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;

      let leaderboard = await fetchLeaderBoard(
        accessToken,
        entitlementsToken,
        value,
        season,
        page * 50
      );

      for (let i = 0; i < leaderboard.Players.length; i++) {
        const competitiveTier =
          competitiveTiers?.tiers[leaderboard.Players[i].competitiveTier];
        leaderboard.Players[i] = {
          ...leaderboard.Players[i],
          rankTier: competitiveTier,
        };
      }
      setLeaderboard((prev) => [...prev, ...leaderboard.Players]);
    };
    fetchLeaderboard();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

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
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
            flashListRef.current?.scrollToIndex({ animated: true, index: 0 });
          }}
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
          onChange={(item) => {
            setSeason(item.value);
            setIsSeasonFocus(false);
            flashListRef.current?.scrollToIndex({ animated: true, index: 0 });
          }}
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
