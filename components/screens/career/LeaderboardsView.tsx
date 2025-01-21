import { View, StyleSheet, Text } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { Dropdown } from "react-native-element-dropdown";
import { Fragment, useEffect, useRef, useState } from "react";
import { fetchCompetitiveTier, fetchSeasons } from "@/utils/valorant-assets";
import { Divider } from "react-native-paper";
import { fetchLeaderBoard } from "@/utils/valorant-api";
import * as SecureStore from "expo-secure-store";
import { FlashList } from "@shopify/flash-list";
import PlayerItem from "@/components/card/PlayerItem";

interface ICompetitiveTier extends ValorantCompetitiveTiers {
  rank: {
    tier: number;
    tierName: string;
    division: string;
    divisionName: string;
    color: string;
    backgroundColor: string;
    smallIcon: string;
    largeIcon: string;
    rankTriangleDownIcon?: string;
    rankTriangleUpIcon?: string;
  };
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

  const [value, setValue] = useState(user.region);
  const [season, setSeason] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [isSeasonFocus, setIsSeasonFocus] = useState(false);
  const [seasons, setSeasons] = useState<{ label: string; value: string }[]>(
    []
  );
  const [competitiveTiers, setCompetitiveTiers] =
    useState<ValorantCompetitiveTiers>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse>();

  useEffect(() => {
    let newSeasonsData = [];
    const fetchData = async () => {
      let [seasons, competitiveTiers] = await Promise.all([
        fetchSeasons(),
        fetchCompetitiveTier(),
      ]);
      setCompetitiveTiers(competitiveTiers[competitiveTiers.length - 1]);

      const parentSeasons = seasons
        .slice(1)
        .filter((season) => !season.parentUuid);
      const childSeasons = seasons.filter(
        (season) =>
          season.parentUuid &&
          new Date(season.startTime).getTime() < new Date().getTime()
      );
      const processSeasons = parentSeasons.filter(
        (pS) => new Date(pS.startTime).getTime() < new Date().getTime()
      );
      for (let i = 0; i < processSeasons.length; i++) {
        for (let j = 0; j < childSeasons.length; j++) {
          if (childSeasons[j].parentUuid === processSeasons[i].uuid) {
            newSeasonsData.push({
              label: `${processSeasons[i].displayName} - ${childSeasons[j].displayName}`,
              value: childSeasons[j].uuid,
            });
          }
        }
      }
      setSeasons(newSeasonsData.slice(3));
      setSeason(newSeasonsData[newSeasonsData.length - 1].value);
    };
    fetchData();
  }, []);
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
      setLeaderboard(leaderboard);
    };
    fetchLeaderboard();
  }, [value, season]);

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
            { color: "white" },
            isFocus && {
              color: "blue",
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
            { color: "white" },
            isSeasonFocus && {
              color: "blue",
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
      <FlashList
        ref={flashListRef}
        data={leaderboard?.Players}
        renderItem={({ item }) => <PlayerItem data={item} />}
        estimatedItemSize={150}
      />
    </View>
  );
};
export default LeaderboardsView;
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
  },
});
