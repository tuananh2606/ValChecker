import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useEffect, useState } from "react";

import useUserStore from "@/hooks/useUserStore";

import * as SecureStore from "expo-secure-store";
import { convertDatetoSeconds, getDeviceWidth } from "@/utils/misc";
import { ProgressBar, MD3Colors, Button, Title } from "react-native-paper";
import TimerAction from "@/components/TimerAction";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { getMissions } from "@/utils/valorant-assets";
import { getMissionsMetadata } from "@/utils/valorant-api";
import { Skeleton } from "@/components/Skeleton";
import { useAppTheme } from "@/app/_layout";

interface WeeklyMission extends ValorantMission {
  progress: number;
}

export default function MissionScreen() {
  const [expirationTime, setExpirationTime] = useState<string>();
  const [missions, setMissions] = useState<WeeklyMission[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useAppTheme();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;

      let [missions, missionsMetadata] = await Promise.all([
        getMissions(),
        getMissionsMetadata(
          accessToken,
          entitlementsToken,
          user.region,
          user.id
        ),
      ]);

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
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Title
        style={{
          textAlign: "center",
          color: colors.text,
          fontWeight: 700,
        }}
      >
        Mission
      </Title>
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
            fontSize: 16,
          }}
        >
          Weekly Missions
        </Text>

        {expirationTime && (
          <TimerAction remainingSecs={convertDatetoSeconds(expirationTime)} />
        )}
      </View>
      {loading ? (
        <View
          style={{
            marginVertical: 8,
          }}
        >
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
      ) : (
        missions &&
        missions.map((mission, idx) => {
          const { title, progress, progressToComplete, xpGrant } = mission;

          const progressNumber = +(progress / progressToComplete).toFixed(2);

          return (
            <View key={idx} style={{ marginVertical: 8, width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: colors.text }}>{title}</Text>
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  {new Intl.NumberFormat("en", { notation: "standard" }).format(
                    xpGrant
                  ) + " XP"}
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
      )}
      <Button
        style={{
          width: "50%",
          marginTop: 24,
        }}
        buttonColor="#ff4654"
        dark
        mode="contained"
        onPress={() => router.push("/battlepass")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, color: colors.text }}>Battle Pass</Text>
        </View>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
  },
});
