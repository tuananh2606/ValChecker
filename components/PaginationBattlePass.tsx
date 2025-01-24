import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { getDeviceWidth } from "@/utils/misc";
import { forwardRef, useState } from "react";
import {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const DOT_SIZE = 40;

const PaginationBattlePass = (
  {
    activeIndex,
    setPage,
  }: {
    activeIndex: SharedValue<number>;
    setPage: (page: number) => void;
  },
  ref: any
) => {
  const [act, setAct] = useState(activeIndex.value);
  return (
    <View style={[styles.pagination]}>
      <FlatList
        ref={ref}
        style={{
          width: getDeviceWidth(),
        }}
        bounces={false}
        horizontal
        data={Array(11)}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                ref.current?.scrollToIndex({
                  index: index,
                  animated: true,
                  viewPosition: 0.5,
                });
                setAct(index);
                setPage(index);
              }}
              style={{ width: DOT_SIZE }}
            >
              <Text
                style={[
                  {
                    color: "white",
                    textAlign: "center",
                  },
                ]}
              >
                {index + 1 + ""}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
export default forwardRef(PaginationBattlePass);

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
