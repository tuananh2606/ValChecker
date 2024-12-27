import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { getDeviceWidth } from "@/utils/misc";

const DOT_SIZE = 40;

const PaginationBattlePass = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
  setPage,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
  setPage: (page: number) => void;
}) => {
  const inputRange = [0, 11];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, 11 * DOT_SIZE],
  });

  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: "absolute",
            transform: [{ translateX: translateX }],
          },
        ]}
      />
      <FlatList
        style={{
          width: getDeviceWidth(),
        }}
        bounces={false}
        horizontal
        data={Array(11)}
        keyExtractor={(item, index) => index + ""}
        renderItem={({ index }) => (
          <Pressable
            onPress={() => {
              setPage(index);
            }}
            style={{ width: DOT_SIZE }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
              }}
            >
              {index + 1 + ""}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};
export default PaginationBattlePass;

const styles = StyleSheet.create({
  pagination: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 10,
    zIndex: 10,
    flexDirection: "row",
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: 25,
    borderBottomWidth: 2,
    borderColor: "red",
  },
});
