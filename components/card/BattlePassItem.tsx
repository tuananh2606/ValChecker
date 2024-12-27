import { Colors } from "@/constants/Colors";
import { StyleSheet, Image, View, Text, useColorScheme } from "react-native";
import { Card, ProgressBar, MD3Colors } from "react-native-paper";
import BattlePassModal from "../modal/BattlePassModal";
import { useState } from "react";

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
  const colorScheme = useColorScheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const hanndleTitleImage = (type?: string, uri?: string) => {
    return type === "Title"
      ? require("@/assets/images/Player-Title.png")
      : { uri: uri };
  };
  const toggleModal = () => {
    if (data.type !== "Title" && data.type !== "Currency") {
      setIsVisible(!isVisible);
    }
  };

  return (
    <View>
      <Card
        onPress={toggleModal}
        style={{
          marginVertical: 4,
        }}
      >
        <Card.Content
          style={[
            styles.container,
            {
              backgroundColor: Colors[colorScheme ?? "light"].background,
            },
          ]}
        >
          {index !== undefined &&
            parentIdx !== undefined &&
            ProgressionLevelReached !== undefined &&
            ProgressionTowardsNextLevel && (
              <View style={styles.progress}>
                <Text style={{ fontSize: 16, color: "white" }}>
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

                <Text style={{ color: "white", fontSize: 10 }}>
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
            (parentIdx + 1) * 5 - (5 - index) + 1 <=
              ProgressionLevelReached && (
              <View style={styles.completed}>
                <Image
                  resizeMode="contain"
                  style={{ width: 70, height: 70 }}
                  source={require("@/assets/images/GreenCompleted.png")}
                />
              </View>
            )}

          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={hanndleTitleImage(type, displayIcon)}
            />
          </View>

          <Text style={styles.name}>
            {type === "Currency" ? `10 ${displayName}` : displayName}
          </Text>
        </Card.Content>
      </Card>

      <BattlePassModal
        isModalVisible={isVisible}
        toggleModal={toggleModal}
        data={data}
      />
    </View>
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
    fontSize: 16,
    color: "white",
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
