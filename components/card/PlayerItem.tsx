import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { getAssets } from "@/utils/valorant-assets";
import { Divider } from "react-native-paper";
import { Fragment } from "react";

interface Props {
  data: IPlayerItem;
}

const PlayerItem = ({ data }: Props) => {
  const { cards } = getAssets();
  const card = cards.find((card) => card.uuid === data.PlayerCardID);

  return (
    <Fragment>
      <View style={[styles.container]}>
        <Text style={[styles.text, { width: 30 }]}>{data.leaderboardRank}</Text>
        <Image
          style={{ width: 40, height: 40, marginLeft: 8, marginRight: 8 }}
          contentFit="contain"
          source={{
            uri: card?.displayIcon,
          }}
        />
        {data.IsAnonymized || data.gameName === "" ? (
          <Text style={[styles.text, { flex: 1, fontSize: 16 }]}>
            Secret Agent
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={[styles.text, { fontSize: 16 }]}
            >{`${data.gameName}`}</Text>
            <Text
              style={{ fontSize: 16, color: "grey" }}
            >{` #${data.tagLine}`}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ width: 30, height: 30, marginRight: 8 }}
            contentFit="contain"
            source={{
              uri: data.rankTier?.smallIcon,
            }}
          />
          <Text style={styles.text}>{data.rankedRating}</Text>
        </View>
      </View>
      <Divider />
    </Fragment>
  );
};
export default PlayerItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 12,
  },
  text: {
    color: "white",
  },
});
