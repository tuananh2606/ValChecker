import { View, Text, StyleSheet, ScrollView } from "react-native";
import useUserStore from "@/hooks/useUserStore";
import { useAppTheme } from "@/app/_layout";
import { useMatchHistory } from "@/context/MatchHistoryContext";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";

const MatchHistoryDetails = () => {
  const { colors } = useAppTheme();
  const { match } = useMatchHistory();

  const user = useUserStore((state) => state.user);

  const player = match!.players.find((p) => p.subject === user.id);

  const calculateRoundDamage = (player: MatchPlayer) => {
    if (player.stats) {
      return Math.floor(player.stats.score / player.stats.roundsPlayed);
    }
    return 0;
  };

  const customSort = () => {
    return (a: MatchPlayer, b: MatchPlayer) => {
      return calculateRoundDamage(b) - calculateRoundDamage(a);
    };
  };

  const renderStatusMatch = () => {
    const isWon = match?.teams!.find(
      (item) => item.teamId === player!.teamId
    )?.won;
    return isWon ? "Won" : "Defeat";
  };

  const backgroundColorStyle = (player: MatchPlayer) => {
    const isWon = match?.teams!.find(
      (item) => item.teamId === player.teamId
    )?.won;
    return user.id === player.subject
      ? "rgba(250,214,99,0.7)"
      : isWon
      ? "rgba(1,180,51,0.7)"
      : " rgba(255,0,0,0.7)";
  };

  return (
    <ScrollView style={styles.flex}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Image
          style={{
            height: 150,
            width: "100%",
          }}
          source={{
            uri: match?.map.splash,
          }}
        />

        <Text
          style={{
            width: 50,
            position: "absolute",
            top: 10,
            left: 10,
            textTransform: "uppercase",
            color: colors.text,
          }}
        >
          {match?.map.displayName}
        </Text>
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
                fontSize: 30,
                fontWeight: "bold",
                width: 40,
              }}
            >
              {match?.teams![0].roundsWon}
            </Text>
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontSize: 30,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {renderStatusMatch()}
            </Text>
            <Text
              style={{
                color: "red",
                fontSize: 30,
                fontWeight: "bold",
                width: 40,
              }}
            >
              {match?.teams![1].roundsWon}
            </Text>
          </View>
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              textTransform: "capitalize",
              color: colors.text,
            }}
          >
            {match?.matchInfo.queueID}
          </Text>
        </BlurView>
      </View>
      <ScrollView horizontal>
        <ScrollView>
          {match &&
            match.players.sort(customSort()).map((player, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: backgroundColorStyle(player),
                    paddingRight: 4,
                    height: 50,
                    marginTop: 8,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    style={{
                      height: 50,
                      width: 50,
                    }}
                    contentFit="contain"
                    source={{
                      uri: player.character.displayIcon,
                    }}
                  />
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    contentFit="contain"
                    source={{
                      uri: player.competitiveRank.smallIcon,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      width: 150,
                      color: colors.text,
                      marginLeft: 4,
                      textOverflow: "ellipsis",
                    }}
                  >
                    {player.gameName}
                  </Text>

                  <View
                    style={{
                      width: 60,
                      height: "70%",
                      justifyContent: "center",
                      borderEndWidth: 1,
                      borderStartWidth: 1,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {calculateRoundDamage(player)}
                    </Text>
                  </View>
                  {player && player.stats ? (
                    <Text
                      style={{
                        textAlign: "center",
                        minWidth: 80,
                        width: 100,
                        color: colors.text,
                      }}
                    >{`${player.stats.kills} / ${player.stats.deaths} / ${player.stats.assists}`}</Text>
                  ) : null}
                </View>
              );
            })}
        </ScrollView>
      </ScrollView>
    </ScrollView>
  );
};
export default MatchHistoryDetails;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  blurContainer: {
    flex: 1,
    width: 230,
    height: 70,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    overflow: "hidden",
    borderRadius: 8,
  },
});
