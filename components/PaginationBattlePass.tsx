import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { getDeviceWidth } from "@/utils/misc";
import { useAppTheme } from "@/app/_layout";

const PaginationBattlePass = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
  setPage,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
  setPage: (page: number) => void;
}) => {
  const { colors } = useAppTheme();
  const inputRange = [0, 10];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, 10 * (getDeviceWidth() / 11)],
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
      {Array.from(Array(11)).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setPage(index);
          }}
          style={{ width: getDeviceWidth() / 11 }}
        >
          <Text
            style={[
              {
                color: colors.text,
                textAlign: "center",
              },
            ]}
          >
            {index + 1 + ""}
          </Text>
        </TouchableOpacity>
      ))}
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
    width: "100%",
    flexDirection: "row",
  },
  paginationIndicator: {
    width: getDeviceWidth() / 11,
    height: 25,
    borderBottomWidth: 2,
    borderColor: "red",
  },
});
