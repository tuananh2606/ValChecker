import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
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
  source?: string;
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
      <View
        onLayout={onTabbarLayout}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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

const BUTTON_SIZE: number = 40;
const SPACING: number = 20;

const TabImageButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabButtonsType) => {
  const tabPositionX = useSharedValue(0);

  const handlePress = (index: number) => {
    setSelectedTab(index);
  };

  const onTabPress = (index: number) => {
    tabPositionX.value = withTiming(
      index === 0 ? BUTTON_SIZE * index : BUTTON_SIZE * index + SPACING * index,
      {},
      () => {
        runOnJS(handlePress)(index);
      }
    );
  };

  const animtedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      style={{
        width: "100%",
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
            height: BUTTON_SIZE + SPACING / 2,
            width: BUTTON_SIZE + SPACING / 2,
          },
        ]}
      />
      <View
        style={{
          marginHorizontal: SPACING / 4,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        {buttons.map((button, index) => {
          return (
            <Pressable
              key={index}
              style={{
                marginLeft: index === 0 ? 0 : SPACING,
                paddingVertical: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => onTabPress(index)}
            >
              {button.source ? (
                <Image
                  style={{
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                  }}
                  contentFit="contain"
                  source={{
                    uri: button.source,
                  }}
                />
              ) : (
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontWeight: "600",
                  }}
                >
                  {button.title}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export { TabImageButtons, TabButtons };
