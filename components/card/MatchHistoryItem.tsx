import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { memo } from "react";
import { Card, Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";
import { getLocales } from "expo-localization";
import useUserStore from "@/hooks/useUserStore";
import { useMatchHistory } from "@/context/MatchHistoryContext";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

interface Props {
  data: MatchDetails;
}

const MatchHistoryItem = ({ data }: Props) => {
  const { colors } = useAppTheme();
  const { setMatch } = useMatchHistory();
  const user = useUserStore((state) => state.user);
  const convertTimestampToDate = (timestamp: number) => {
    const lang = getLocales()[0].languageCode || "en-US";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(lang, {
      dateStyle: "long",
    }).format(date);
  };

  const convertTimestampToTime = (timestamp: number) => {
    const lang = getLocales()[0].languageCode || "en-US";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(lang, {
      timeStyle: "short",
    }).format(date);
  };

  const renderStatusMatch = () => {
    const isWon = data?.teams!.find(
      (item) => item.teamId === player!.teamId
    )?.won;
    return isWon ? "Won" : "Defeat";
  };

  const player = data.players.find((p) => p.subject === user.id);

  return (
    <Card
      style={{
        position: "relative",
        marginTop: 8,
      }}
      onPress={() => {
        setMatch(data);
        router.push("/match-history/match-details");
      }}
    >
      <Card.Cover
        style={{
          height: 100,
          borderBottomStartRadius: 0,
          borderBottomEndRadius: 0,
        }}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        source={{ uri: data.map.splash }}
      />
      {data.teams ? (
        <BlurView tint="dark" intensity={140} style={styles.blurContainer}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textAlign: "right",
                color: "green",
                fontWeight: "bold",
              }}
            >
              {data!.teams[0].roundsWon}
            </Text>
            <Text
              style={{
                flex: 1,
                color: colors.text,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {renderStatusMatch()}
            </Text>
            <Text
              style={{
                color: "red",

                fontWeight: "bold",
              }}
            >
              {data!.teams[1].roundsWon}
            </Text>
          </View>
        </BlurView>
      ) : null}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 10,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            color: "white",
            textTransform: "capitalize",
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 20,
          }}
        >
          {data.matchInfo.queueID}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 10,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            textShadowColor: "rgba(0, 0, 0, 0.75)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
            color: "white",
            textTransform: "capitalize",
          }}
        >
          {data.map.displayName}
        </Text>
      </View>
      <Card.Content
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            position: "relative",
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: 35,
              position: "absolute",
              top: -15,
            }}
            source={{
              uri: player?.character.displayIcon,
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: 4,
            height: 70,
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text variant="labelMedium">
              {convertTimestampToDate(data.matchInfo.gameStartMillis)}
            </Text>
            <Text
              variant="labelMedium"
              style={{
                marginLeft: 8,
              }}
            >
              {convertTimestampToTime(data.matchInfo.gameStartMillis)}
            </Text>
          </View>
          {player && player.stats ? (
            <Text>{`${player.stats.kills}  /  ${player.stats.deaths}  /  ${player.stats.assists}`}</Text>
          ) : null}
        </View>
        {data.matchInfo.isRanked && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <View>
              <Text
                style={{
                  color:
                    (data.competitiveUpdates?.RankedRatingEarned as number) < 0
                      ? "red"
                      : "green",
                }}
              >
                {data.competitiveUpdates?.RankedRatingEarned}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  textAlign: "right",
                }}
              >
                {data.competitiveUpdates?.RankedRatingBeforeUpdate}
              </Text>
            </View>
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={{
                uri: player?.competitiveRank.smallIcon,
              }}
            />
            <Image
              style={[
                (data.competitiveUpdates?.RankedRatingEarned as number) > 0
                  ? styles.upgradeArrow
                  : styles.downgradeArrow,
                {
                  transform: [{ rotate: "180deg" }],
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 10,
                  height: 10,
                },
              ]}
              tintColor={
                (data.competitiveUpdates?.RankedRatingEarned as number) > 0
                  ? "green"
                  : "red"
              }
              source={require("@/assets/images/upgrade-arrow.png")}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};
export default memo(MatchHistoryItem);
const styles = StyleSheet.create({
  upgradeArrow: {
    top: 0,
  },
  downgradeArrow: {
    bottom: 0,
    transform: [{ rotate: "180deg" }],
  },
  blurContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 8,
    alignSelf: "center",
    top: 30,
    width: 100,
    height: 40,
    backgroundColor: "white",
  },
});
