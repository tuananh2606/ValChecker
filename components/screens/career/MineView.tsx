import { View, StyleSheet, ScrollView } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { memo, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  fetchCompetitiveUpdates,
  fetchPlayerLoadout,
  fetchPlayerMMR,
  parseSeason,
} from "@/utils/valorant-api";
import {
  fetchSeasons,
  getAssets,
  getLevelBorders,
} from "@/utils/valorant-assets";
import { Image } from "expo-image";
import Loading from "@/components/Loading";
import { useAppTheme } from "@/app/_layout";
import { Text, TouchableRipple } from "react-native-paper";
import { Href, router } from "expo-router";
import { useTranslation } from "react-i18next";

const MineView = () => {
  const { t } = useTranslation();
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
  const { colors } = useAppTheme();
  const user = useUserStore((state) => state.user);
  const { cards, titles, competitiveTiers } = getAssets();
  const [loading, setLoading] = useState<boolean>(false);
  const [levelBorder, setLevelBorder] = useState<ValorantLevelBorder>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;
      let [playerLoadout, playerMMR, seasons, levelBorders, competitiveUpdate] =
        await Promise.all([
          fetchPlayerLoadout(
            accessToken,
            entitlementsToken,
            user.region,
            user.id
          ),
          fetchPlayerMMR(accessToken, entitlementsToken, user.region, user.id),
          fetchSeasons(),
          getLevelBorders(),
          fetchCompetitiveUpdates(
            accessToken,
            entitlementsToken,
            user.region,
            user.id,
            0,
            1
          ),
        ]);
      const seasonsAvailabe = parseSeason(seasons);

      const prevSeason = seasonsAvailabe[seasonsAvailabe.length - 2];
      const seasonalInfo =
        playerMMR.QueueSkills["competitive"].SeasonalInfoBySeasonID;
      const prevRank = competitiveTiers.find(
        (item) =>
          item.tier === seasonalInfo[`${prevSeason.value}`].CompetitiveTier
      );

      const borderLevel = levelBorders.find(
        (item) => item.startingLevel + 20 > user.progress.level
      );
      setLevelBorder(borderLevel);

      setPreviousRank({
        seasonTitle: prevSeason.label,
        rankPoint: seasonalInfo[`${prevSeason.value}`].RankedRating,
        rank: prevRank as ValorantCompetitiveTier,
      });
      const currentSeason = seasonsAvailabe[seasonsAvailabe.length - 1];
      const currentRank = competitiveTiers.find(
        (item) => item.tier === competitiveUpdate.Matches[0].TierAfterUpdate
      );
      setCurrentRank({
        seasonTitle: currentSeason.label,
        rankPoint: competitiveUpdate.Matches[0].RankedRatingAfterUpdate,
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
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={{ marginTop: 8, paddingHorizontal: 10, marginBottom: 10 }}
    >
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{ fontSize: 16, color: colors.text }}
        >{`${user.name}`}</Text>
        <Text
          style={{ fontSize: 16, color: "grey" }}
        >{`#${user.tagLine}`}</Text>
      </View>
      <View
        style={{
          marginTop: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 60,
              height: 30,
              position: "absolute",
              top: -10,
              zIndex: 10,
            }}
            contentFit="contain"
            source={{
              uri: levelBorder?.levelNumberAppearance,
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: -4,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.text,
              textAlign: "center",
            }}
          >
            {user.progress.level}
          </Text>
        </View>
        {playerLoadout && (
          <Image
            style={styles.image}
            contentFit="contain"
            source={{
              uri: playerLoadout?.card.wideArt,
            }}
          />
        )}
        <View
          style={{
            position: "absolute",
            bottom: 25,
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
          marginTop: 8,
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
            {currentRank?.seasonTitle.replace("-", " // ")}
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
                fontSize: 14,
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
            {previousRank?.seasonTitle.replace("-", " // ")}
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
                fontSize: 14,
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
      <CareerButtton
        header={t("match.name")}
        title={t("match.history")}
        href={"/match-history"}
      />
      <CareerButtton
        header={t("match.career")}
        title={t("match.career_summary")}
        href={"/career-summary"}
      />
    </ScrollView>
  );
};
export default memo(MineView);

const CareerButtton = ({
  header,
  title,
  href,
}: {
  header: string;
  title: string;
  href: Href;
}) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        width: "100%",
        marginTop: 24,
      }}
    >
      <Text
        variant="labelLarge"
        style={{
          textTransform: "uppercase",
          color: "gray",
        }}
      >
        {header}
      </Text>
      <TouchableRipple
        style={{
          marginTop: 4,
          borderRadius: 8,
          padding: 10,

          backgroundColor: colors.primary,
          justifyContent: "center",
        }}
        onPress={() => router.push(href)}
      >
        <Text style={{ fontSize: 18, color: colors.text, textAlign: "left" }}>
          {title}
        </Text>
      </TouchableRipple>
    </View>
  );
};

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
