import { View, Text, StyleSheet, useColorScheme } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { convertSecstoHhMmSs } from "@/utils/misc";
import { Colors } from "@/constants/Colors";
interface Props {
  remainingSecs: number;
  showRefresh?: boolean;
}

const TimerAction = ({ remainingSecs, showRefresh = true }: Props) => {
  const colorScheme = useColorScheme();
  const [diff, setDiff] = useState(remainingSecs);
  useEffect(() => {
    const interval = setInterval(() => {
      setDiff((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSecs]);

  return (
    <View
      style={[styles.container, { marginHorizontal: showRefresh ? 16 : 0 }]}
    >
      <View style={styles.timerContainer}>
        <MaterialIcons
          name="access-time"
          size={18}
          color={Colors[colorScheme ?? "light"].icon}
        />
        <Text
          style={{
            fontSize: 16,
            marginLeft: 2,
            color: Colors[colorScheme ?? "light"].text,
          }}
        >
          {convertSecstoHhMmSs(diff)}
        </Text>
      </View>
      {showRefresh && (
        <View>
          <MaterialIcons name="refresh" size={28} color="red" />
        </View>
      )}
    </View>
  );
};
export default TimerAction;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
