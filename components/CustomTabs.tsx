import { View, Text, Pressable } from "react-native";
import { MotiView } from "moti";
import { LinearTransition } from "react-native-reanimated";

type TabItem = {
  label: string;
};

type TabsProp = {
  data: TabItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
};

export function CustomTabs({
  data,
  selectedIndex,
  onSelect,
  activeBackgroundColor = "red",
  activeColor = "#fff",
  inactiveBackgroundColor = "#ddd",
  inactiveColor = "#999",
}: TabsProp) {
  return (
    <View style={{ flexDirection: "row" }}>
      {data.map((item, index) => {
        const isSelected = selectedIndex === index;
        return (
          <MotiView
            key={index}
            animate={{
              backgroundColor: isSelected
                ? activeBackgroundColor
                : inactiveBackgroundColor,
              borderRadius: 8,
            }}
            layout={LinearTransition.springify().damping(80).stiffness(200)}
          >
            <Pressable
              style={{
                padding: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => onSelect(index)}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
}
