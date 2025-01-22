import { View, Text, StyleSheet } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { memo, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  fetchPlayerLoadout,
  fetchPlayerMMR,
  parseSeason,
} from "@/utils/valorant-api";
import { fetchSeasons, getAssets } from "@/utils/valorant-assets";
import { Image } from "expo-image";

const MineView = () => {
  const [playerLoadout, setPlayerLoadout] = useState<{
    card: ValorantCardAccessory;
    title: ValorantTitleAccessory;
  }>();
  const [previousRank, setPreviousRank] = useState<{
    seasonTitle: string;
    rankPoint: number;
    rank: ValorantCompetitiveTier;
  }>();
  const [currentRank, setCurrentRank] = useState<{
    seasonTitle: string;
    rankPoint: number;
    rank: ValorantCompetitiveTier;
  }>();
  const user = useUserStore((state) => state.user);
  const { cards, titles, competitiveTiers } = getAssets();

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      let [playerLoadout, playerMMR, seasons] = await Promise.all([
        fetchPlayerLoadout(
          accessToken,
          entitlementsToken,
          user.region,
          user.id
        ),
        fetchPlayerMMR(accessToken, entitlementsToken, user.region, user.id),
        fetchSeasons(),
      ]);
      const seasonsAvailabe = parseSeason(seasons);
      const prevSeason = seasonsAvailabe[seasonsAvailabe.length - 2];
      const seasonalInfo =
        playerMMR.QueueSkills["competitive"].SeasonalInfoBySeasonID;
      const prevRank = competitiveTiers.find(
        (item) =>
          item.tier === seasonalInfo[`${prevSeason.value}`].CompetitiveTier
      );
      setPreviousRank({
        seasonTitle: prevSeason.label,
        rankPoint: seasonalInfo[`${prevSeason.value}`].RankedRating,
        rank: prevRank as ValorantCompetitiveTier,
      });
      const currentSeason = seasonsAvailabe[seasonsAvailabe.length - 1];
      const currentRank = competitiveTiers.find(
        (item) =>
          item.tier === playerMMR.LatestCompetitiveUpdate.TierAfterUpdate
      );
      setCurrentRank({
        seasonTitle: currentSeason.label,
        rankPoint: playerMMR.LatestCompetitiveUpdate.RankedRatingAfterUpdate,
        rank: currentRank as ValorantCompetitiveTier,
      });
      const myCard = cards.find(
        (card) => card.uuid === playerLoadout.Identity.PlayerCardID
      );
      const myTitle = titles.find(
        (title) => title.uuid === playerLoadout.Identity.PlayerTitleID
      );
      setPlayerLoadout({
        card: myCard as ValorantCardAccessory,
        title: myTitle as ValorantTitleAccessory,
      });
    };
    fetchData();
  }, []);
  return (
    <View style={{ marginTop: 8, paddingHorizontal: 10 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>{`${user.name}`}</Text>
        <Text
          style={{ fontSize: 16, color: "grey" }}
        >{`#${user.tagLine}`}</Text>
      </View>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -15,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}
          >
            {user.progress.level}
          </Text>
        </View>

        <Image
          style={styles.image}
          contentFit="contain"
          source={{
            uri: playerLoadout?.card.wideArt,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 15,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              textAlign: "center",
            }}
          >
            {playerLoadout?.title.titleText}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color: "grey",
              },
            ]}
          >
            {currentRank?.seasonTitle.replace("-", "/")}
          </Text>
          <Image
            style={{
              marginVertical: 8,
              width: 50,
              height: 50,
            }}
            source={{ uri: currentRank?.rank.smallIcon }}
            contentFit="contain"
          />

          <Text
            style={[
              styles.text,
              {
                fontSize: 16,
              },
            ]}
          >
            {currentRank?.rank.tierName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                color: "grey",
              },
            ]}
          >{`${currentRank?.rankPoint} RR`}</Text>
        </View>
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.text,
              {
                color: "grey",
              },
            ]}
          >
            {previousRank?.seasonTitle.replace("-", "/")}
          </Text>
          <Image
            style={{
              marginVertical: 8,
              width: 50,
              height: 50,
            }}
            source={{ uri: previousRank?.rank.smallIcon }}
            contentFit="contain"
          />

          <Text
            style={[
              styles.text,
              {
                fontSize: 16,
              },
            ]}
          >
            {previousRank?.rank.tierName}
          </Text>
          <Text
            style={[
              styles.text,
              {
                color: "grey",
              },
            ]}
          >{`${previousRank?.rankPoint} RR`}</Text>
        </View>
      </View>
    </View>
  );
};
export default memo(MineView);
const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  priceContainer: {
    zIndex: 10,
    position: "absolute",
    right: 36,
    top: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 4,
  },
  image: {
    width: "100%",
    height: 130,
  },
  text: {
    color: "white",
  },
});
