import { Colors } from "@/constants/Colors";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  useColorScheme,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type TabButtonType = {
  title: string;
};
export type TabButtonsType = {
  buttons: TabButtonType[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
};
const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabButtonsType) => {
  const [dimensions, setDimensions] = useState({
    height: 20,
    width: 20,
  });
  const buttonWidth = dimensions.width / buttons.length;
  const colorScheme = useColorScheme();
  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const handlePress = (index: number) => {
    setSelectedTab(index);
  };

  const onTabPress = (index: number) => {
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handlePress)(index);
    });
  };

  const animtedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? "light"].surface,
        borderRadius: 12,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          animtedStyle,
          {
            position: "absolute",
            backgroundColor: "#8f8f8f",
            borderRadius: 8,
            marginHorizontal: 5,
            height: dimensions.height - 10,
            width: buttonWidth - 10,
          },
        ]}
      />
      <View onLayout={onTabbarLayout} style={{ flexDirection: "row" }}>
        {buttons.map((button, index) => {
          return (
            <Pressable
              key={index}
              style={{
                flex: 1,
                paddingVertical: 12,
              }}
              onPress={() => onTabPress(index)}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontWeight: "600",
                }}
              >
                {button.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
export default TabButtons;
const styles = StyleSheet.create({});
