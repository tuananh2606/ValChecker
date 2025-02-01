import { StyleSheet, View, Text } from "react-native";
import { Card, ProgressBar } from "react-native-paper";
import { router } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import { Image } from "expo-image";

interface IBattlePassItem {
  data: BattlePassLevelsItem | BattlePassItem;
  parentIdx?: number;
  index?: number;
  ProgressionLevelReached?: number;
  ProgressionTowardsNextLevel?: number;
}

const BattlePassItem = ({
  data,
  index,
  parentIdx,
  ProgressionTowardsNextLevel,
  ProgressionLevelReached,
}: IBattlePassItem) => {
  const { displayName, displayIcon, type } = data;
  const { colors } = useAppTheme();
  const hanndleTitleImage = (type?: string, uri?: string) => {
    return type === "Title"
      ? require("@/assets/images/Player-Title.png")
      : { uri: uri };
  };
  const toggleModal = () => {
    if (data.type !== "Title" && data.type !== "Currency") {
      router.push({
        pathname: "/modal",
        params: {
          source: data.largeArt || data.fullTransparentIcon || data.displayIcon,
        },
      });
    }
  };

  return (
    <Card
      onPress={toggleModal}
      style={{
        marginVertical: 4,
        backgroundColor: colors.card,
      }}
    >
      <Card.Content style={styles.container}>
        {index !== undefined &&
          parentIdx !== undefined &&
          ProgressionLevelReached !== undefined &&
          ProgressionTowardsNextLevel !== undefined && (
            <View style={styles.progress}>
              <Text style={{ fontSize: 16, color: colors.text }}>
                {`Lv${(parentIdx + 1) * 5 - (5 - index) + 1}`}
              </Text>
              <View style={{ width: 50 }}>
                <ProgressBar
                  animatedValue={
                    (parentIdx + 1) * 5 - (5 - index) + 1 ===
                    ProgressionLevelReached + 1
                      ? ProgressionTowardsNextLevel /
                        +(data as BattlePassLevelsItem).xp
                      : (parentIdx + 1) * 5 - (5 - index) + 1 >
                        ProgressionLevelReached
                      ? 0
                      : 1
                  }
                  style={{ marginVertical: 4, borderRadius: 8 }}
                  color="green"
                />
              </View>

              <Text style={{ color: colors.text, fontSize: 10 }}>
                {`${
                  (parentIdx + 1) * 5 - (5 - index) + 1 ===
                  ProgressionLevelReached + 1
                    ? ProgressionTowardsNextLevel
                    : (parentIdx + 1) * 5 - (5 - index) + 1 >
                      ProgressionLevelReached
                    ? "0"
                    : (data as BattlePassLevelsItem).xp
                } / ${(data as BattlePassLevelsItem).xp}`}
              </Text>
            </View>
          )}
        {index !== undefined &&
          parentIdx !== undefined &&
          ProgressionLevelReached &&
          (parentIdx + 1) * 5 - (5 - index) + 1 <= ProgressionLevelReached && (
            <View style={styles.completed}>
              <Image
                placeholder={require("@/assets/images/image-placeholder.png")}
                contentFit="contain"
                style={{ width: 70, height: 70 }}
                source={require("@/assets/images/GreenCompleted.png")}
              />
            </View>
          )}

        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.image}
            tintColor={type === "Currency" ? colors.tint : undefined}
            source={hanndleTitleImage(type, displayIcon)}
          />
        </View>

        <Text style={[styles.name, { color: colors.text }]}>
          {type === "Currency" ? `10 ${displayName}` : displayName}
        </Text>
      </Card.Content>
    </Card>
  );
};
export default BattlePassItem;

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 12,
    justifyContent: "center",
  },
  progress: {
    position: "absolute",
    left: 10,
    top: 10,
  },
  name: {
    marginLeft: 4,
    textAlign: "center",
    marginTop: 8,
  },
  completed: {
    position: "absolute",
    right: 0,
    top: 0,
    transform: "rotate(45deg)",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 150,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
