import { useAppTheme } from "@/app/_layout";
import { Animated, View, StyleSheet, Pressable, Text } from "react-native";

const Pagination = ({
  width = 150,
  height = 45,
  buttons,
  setPage,
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  width?: number;
  height?: number;
  buttons?: { title: string; id: string }[];
  setPage: (page: number) => void;
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const { colors } = useAppTheme();
  const inputRange = [0, 10];
  const translateX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue
  ).interpolate({
    inputRange,
    outputRange: [0, 10 * (width / 10)],
  });

  const onTabPress = (index: number) => {
    setPage(index);
  };

  return (
    <View
      style={[
        styles.pagination,
        {
          height: height,
          width: width,
          backgroundColor: colors.surface,
          borderRadius: 12,
        },
      ]}
    >
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: "#8f8f8f",
          borderRadius: 8,
          marginHorizontal: 5,
          width: width / 10 - 10,
          height: height - 10,
          transform: [{ translateX: translateX }, { translateY: 5 }],
        }}
      />
      {Array(11).map((item, index) => {
        return (
          <Pressable
            key={item.id}
            style={{
              flex: 1,
              paddingVertical: 12,
            }}
            onPress={() => onTabPress(index)}
          >
            <Text
              style={{
                color: colors.text,
                alignSelf: "center",
                fontWeight: "600",
              }}
            >
              {index + 1}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
export default Pagination;
const styles = StyleSheet.create({
  pagination: {
    position: "relative",
    flexDirection: "row",
  },
});
