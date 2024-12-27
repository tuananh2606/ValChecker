import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useEffect, useState } from "react";

import useUserStore from "@/hooks/useUserStore";
import { getMissions } from "@/utils/valorant-api";
import * as SecureStore from "expo-secure-store";
import { convertDatetoSeconds, VMissions } from "@/utils/misc";
import { ProgressBar, MD3Colors, Button } from "react-native-paper";
import TimerAction from "@/components/TimerAction";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

interface Missions {
  MissionMetadata: {
    NPECompleted: boolean;
    /** Date in ISO 8601 format */
    WeeklyCheckpoint: string;
    /** Date in ISO 8601 format */
    WeeklyRefillTime: string;
  };
  Missions: {
    /** UUID */
    ID: string;
    Objectives: {
      [x: string]: number;
    };
    Complete: boolean;
    /** Date in ISO 8601 format */
    ExpirationTime: string;
  }[];
}

export default function MissionScreen() {
  const [expirationTime, setExpirationTime] = useState<string>();
  const [missions, setMissions] = useState<Missions>();

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = (await SecureStore.getItemAsync(
        "access_token"
      )) as string;
      let entitlementsToken = (await SecureStore.getItemAsync(
        "entitlements_token"
      )) as string;

      const missions = await getMissions(
        accessToken,
        entitlementsToken,
        user.region,
        user.id
      );

      setExpirationTime(missions.MissionMetadata.WeeklyRefillTime);
      setMissions(missions);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            flex: 1,
            color: "white",
            textTransform: "uppercase",
            fontSize: 18,
          }}
        >
          Weekly Missions
        </Text>
        <View>
          {expirationTime && (
            <TimerAction
              showRefresh={false}
              remainingSecs={convertDatetoSeconds(expirationTime)}
            />
          )}
        </View>
      </View>
      {missions &&
        missions.Missions.map((mission, idx) => {
          const { ID, Objectives } = mission;

          const progressNumber = +(
            Objectives[Object.keys(Objectives)[0]] /
            VMissions[ID as keyof typeof VMissions].target
          ).toFixed(2);

          return (
            <View key={idx} style={{ marginVertical: 8, width: "100%" }}>
              <Text style={{ color: "white", fontSize: 16 }}>
                {VMissions[ID as keyof typeof VMissions].title}
              </Text>
              <ProgressBar
                animatedValue={progressNumber}
                style={{ marginVertical: 4 }}
                color={MD3Colors.error50}
              />
              <Text style={{ color: "white", fontSize: 16 }}>
                {`${Objectives[Object.keys(Objectives)[0]]} / ${
                  VMissions[mission.ID as keyof typeof VMissions].target
                }`}
              </Text>
            </View>
          );
        })}
      <Button
        style={{
          width: "50%",
          marginTop: 24,
        }}
        mode="contained"
        onPress={() => router.push("/battlepass")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>Battle Pass</Text>
          <MaterialIcons name="arrow-forward" size={24} color="black" />
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
    marginTop: StatusBar.currentHeight,
  },
});
