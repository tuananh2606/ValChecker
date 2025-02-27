import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useCallback, useEffect, useState } from "react";
import useUserStore from "@/hooks/useUserStore";
import * as SecureStore from "expo-secure-store";
import {
  convertDatetoSeconds,
  getDeviceWidth,
  isSameDayUTC,
} from "@/utils/misc";
import {
  ProgressBar,
  MD3Colors,
  Button,
  Title,
  Text,
} from "react-native-paper";
import TimerAction from "@/components/TimerAction";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { getMissions } from "@/utils/valorant-assets";
import { fetchPlayerXP, getMissionsMetadata } from "@/utils/valorant-api";
import { Skeleton } from "@/components/Skeleton";
import { useAppTheme } from "@/app/_layout";
import { useTranslation } from "react-i18next";
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRevenueCat } from "@/providers/RevenueCatProvider";

interface WeeklyMission extends ValorantMission {
  progress: number;
}

const AD_INTERVAL = 15 * 60 * 1000;

const adUnitId = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-4096764929331535/7631315681";

const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-4096764929331535/8840693258";

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function MissionScreen() {
  const { t } = useTranslation();
  const [expirationTime, setExpirationTime] = useState<string>();
  const [nextTimeFirstWinAvailable, setNextTimeFirstWinAvailable] =
    useState<number>(0);
  const [isFirstWin, setFirstWin] = useState<boolean>(false);
  const [missions, setMissions] = useState<WeeklyMission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useAppTheme();
  const { user: userRevenueCat } = useRevenueCat();
  const user = useUserStore((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    let accessToken = (await SecureStore.getItemAsync(
      "access_token"
    )) as string;
    let entitlementsToken = (await SecureStore.getItemAsync(
      "entitlements_token"
    )) as string;

    let [missions, missionsMetadata, accountXP] = await Promise.all([
      getMissions(),
      getMissionsMetadata(accessToken, entitlementsToken, user.region, user.id),
      fetchPlayerXP(accessToken, entitlementsToken, user.region, user.id),
    ]);
    setNextTimeFirstWinAvailable(
      convertDatetoSeconds(accountXP.NextTimeFirstWinAvailable)
    );

    const d1 = new Date(accountXP.LastTimeGrantedFirstWin);
    const d2 = new Date(accountXP.NextTimeFirstWinAvailable);

    const dayDiff = Math.round(
      (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)
    );

    if (
      (isSameDayUTC(d1, d2) || dayDiff === 1) &&
      convertDatetoSeconds(accountXP.NextTimeFirstWinAvailable) > 0
    ) {
      setFirstWin(true);
    } else {
      setFirstWin(false);
    }

    let weeklyMissions: WeeklyMission[] = [];

    for (let i = 0; i < missionsMetadata.Missions.length; i++) {
      const weeklyMission = missions.find(
        (mission) => mission.uuid === missionsMetadata.Missions[i].ID
      );

      if (weeklyMission) {
        weeklyMissions.push({
          ...weeklyMission,
          progress:
            missionsMetadata.Missions[i].Objectives[
              Object.keys(missionsMetadata.Missions[i].Objectives)[0]
            ],
        });
      }
    }

    setExpirationTime(missionsMetadata.MissionMetadata.WeeklyRefillTime);
    setMissions(weeklyMissions);
    setRefreshing(false);
    setLoading(false);
  }, []);

  const handlePress = async () => {
    if (!userRevenueCat.isPro) {
      if (interstitial.loaded) {
        const now = new Date();
        await AsyncStorage.setItem(
          "lastInterstitialAd",
          now.getTime().toString()
        );
        setTimeout(() => {
          interstitial.show();
        }, 3000);
      }
    }
    router.push("/battlepass");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;

      let [missions, missionsMetadata, accountXP] = await Promise.all([
        getMissions(),
        getMissionsMetadata(
          accessToken,
          entitlementsToken,
          user.region,
          user.id
        ),
        fetchPlayerXP(accessToken, entitlementsToken, user.region, user.id),
      ]);
      setNextTimeFirstWinAvailable(
        convertDatetoSeconds(accountXP.NextTimeFirstWinAvailable)
      );

      const d1 = new Date(accountXP.LastTimeGrantedFirstWin);
      const d2 = new Date(accountXP.NextTimeFirstWinAvailable);

      const dayDiff = Math.round(
        (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)
      );

      if (
        (isSameDayUTC(d1, d2) || dayDiff === 1) &&
        convertDatetoSeconds(accountXP.NextTimeFirstWinAvailable) > 0
      ) {
        setFirstWin(true);
      } else {
        setFirstWin(false);
      }

      let weeklyMissions: WeeklyMission[] = [];

      for (let i = 0; i < missionsMetadata.Missions.length; i++) {
        const weeklyMission = missions.find(
          (mission) => mission.uuid === missionsMetadata.Missions[i].ID
        );

        if (weeklyMission) {
          weeklyMissions.push({
            ...weeklyMission,
            progress:
              missionsMetadata.Missions[i].Objectives[
                Object.keys(missionsMetadata.Missions[i].Objectives)[0]
              ],
          });
        }
      }

      setExpirationTime(missionsMetadata.MissionMetadata.WeeklyRefillTime);
      setMissions(weeklyMissions);
      setLoading(false);
      if (!userRevenueCat.isPro) {
        const now = Date.now();
        const lastAds = Number.parseInt(
          (await AsyncStorage.getItem("lastInterstitialAd")) || "0"
        );

        // Start loading the interstitial straight away
        if (now - lastAds < AD_INTERVAL) return;
        interstitial.load();
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Title
        style={{
          textAlign: "center",
          color: colors.text,
          fontWeight: 700,
        }}
      >
        {t("mission")}
      </Title>
      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                marginRight: 10,
                borderColor: colors.primary,
                borderRadius: 4,
                transform: [{ rotate: "45deg" }],
              }}
            ></View>
            {isFirstWin && (
              <MaterialIcons
                name="done"
                style={{
                  position: "absolute",
                  inset: 0,
                }}
                size={19}
                color={colors.primary}
              />
            )}
          </View>
          <View>
            <Text style={{ color: colors.text }}>
              {t("first_win_of_the_day")}
            </Text>
            {nextTimeFirstWinAvailable > 0 ? (
              <TimerAction
                remainingSecs={nextTimeFirstWinAvailable}
                leadIconStyles={{
                  fontSize: 14,
                }}
                contentStyles={{
                  fontSize: 14,
                }}
              />
            ) : (
              <Text style={{ color: colors.text, opacity: 0.6 }}>
                {t("available")}
              </Text>
            )}
          </View>
        </View>
        <Text style={{ color: colors.text, fontSize: 16 }}>+ 1,000 AP</Text>
      </View>
      <View
        style={{
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            flex: 1,
            color: colors.text,
            textTransform: "uppercase",
          }}
        >
          {t("weekly_missions")}
        </Text>
        <MaterialIcons
          name="refresh"
          size={28}
          color={colors.primary}
          onPress={onRefresh}
        />
        {/* {expirationTime && (
          <TimerAction remainingSecs={convertDatetoSeconds(expirationTime)} />
        )} */}
      </View>
      {loading ? (
        <View>
          <View
            style={{
              width: getDeviceWidth() - 60,
              marginHorizontal: 30,
            }}
          >
            <Skeleton
              width={`${60}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${100}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${40}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
          </View>
          <View
            style={{
              width: getDeviceWidth() - 60,
              marginHorizontal: 30,
              marginVertical: 18,
            }}
          >
            <Skeleton
              width={`${60}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${100}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${40}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
          </View>
          <View
            style={{
              width: getDeviceWidth() - 60,
              marginHorizontal: 30,
            }}
          >
            <Skeleton
              width={`${60}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${100}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
            <Skeleton
              width={`${40}%`}
              height={6}
              style={{
                marginBottom: 8,
              }}
            />
          </View>
        </View>
      ) : missions.length > 0 ? (
        missions.map((mission, idx) => {
          const { title, progress, progressToComplete, xpGrant } = mission;

          const progressNumber = +(progress / progressToComplete).toFixed(2);
          return (
            <View key={idx} style={{ width: "100%", marginVertical: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: colors.text }}>{title}</Text>
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  {new Intl.NumberFormat("en", {
                    notation: "standard",
                  }).format(xpGrant) + " XP"}
                </Text>
              </View>
              <ProgressBar
                animatedValue={progressNumber}
                style={{ marginVertical: 4 }}
                color={MD3Colors.error50}
              />
              <Text style={{ color: colors.text }}>
                {`${progress} / ${progressToComplete}`}
              </Text>
            </View>
          );
        })
      ) : (
        <Text
          style={{
            marginTop: 16,
          }}
        >
          {t("missions_completed")}
        </Text>
      )}
      <View
        style={{
          width: "100%",
          marginTop: 24,
        }}
      >
        <Text
          variant="labelLarge"
          style={{
            color: "gray",
          }}
        >
          Battle Pass
        </Text>
        <Button
          style={{
            marginTop: 4,
            borderRadius: 8,
          }}
          buttonColor="#ff4654"
          dark
          mode="contained"
          onPress={handlePress}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: colors.text }}>
              Battle Pass
            </Text>
          </View>
        </Button>
      </View>
      {!userRevenueCat.isPro && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
          }}
        >
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
              networkExtras: {
                collapsible: "bottom",
              },
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
});
